## 🔧 Bug Fixes & Improvements

This is a forked version of HAQMS with the following fixes applied:

### 🔴 Security Fixes
- Fixed SQL Injection vulnerability in doctors search route
- Removed plain text password logging from auth routes
- Excluded password hash from registration API response
- Restored broken admin role check in authorization middleware
- Fixed JWT expiration being ignored (ignoreExpiration: true removed)
- Reduced JWT token lifetime from 365 days to 8 hours
- Removed hardcoded JWT secret fallback
- Restricted CORS to frontend origin only

### 🟠 Performance Fixes
- Fixed N+1 query problem in appointments route
- Replaced in-memory pagination with database-level pagination
- Replaced sequential DB calls with parallel Promise.all in doctor stats
- Replaced loop queries in reports with grouped aggregation

### 🟡 Concurrency Fixes
- Removed artificial sleep delay in queue check-in
- Fixed race condition in queue token generation using Prisma transaction
- Improved duplicate appointment booking check to hour-level slots

## 🚀 Live Demo
- **Frontend:** https://haqms-kappa.vercel.app
- **Backend:**https://haqms-production-4150.up.railway.app

## 🔑 Demo Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@haqms.com | password123 |
| Receptionist | reception1@haqms.com | password123 |
| Doctor | doctor1@haqms.com | password123 |