const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/reports/doctor-stats
// Highly inefficient nested loop aggregate reporting for admin/receptionists dashboard
// PERFORMANCE BUG: Performs multiple nested DB queries inside a loop for every doctor.
// Runs sequentially, blocking/scaling terrible with doctors count.

router.get('/doctor-stats', authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [doctors, appointmentStats, queueStats] = await Promise.all([
      prisma.doctor.findMany(),
      prisma.appointment.groupBy({
        by: ['doctorId', 'status'],
        _count: { id: true },
      }),
      prisma.queueToken.groupBy({
        by: ['doctorId'],
        where: { createdAt: { gte: today } },
        _count: { id: true },
      }),
    ]);

    const reportData = doctors.map((doc) => {
      const docAppointments = appointmentStats.filter(a => a.doctorId === doc.id);
      const totalAppointments = docAppointments.reduce((sum, a) => sum + a._count.id, 0);
      const completedAppointments = docAppointments.find(a => a.status === 'COMPLETED')?._count.id || 0;
      const cancelledAppointments = docAppointments.find(a => a.status === 'CANCELLED')?._count.id || 0;
      const todayQueueSize = queueStats.find(q => q.doctorId === doc.id)?._count.id || 0;
      const revenue = completedAppointments * doc.consultationFee;

      return {
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization,
        department: doc.department,
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        todayQueueSize,
        revenue,
      };
    });

    res.json({ success: true, data: reportData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

module.exports = router;
