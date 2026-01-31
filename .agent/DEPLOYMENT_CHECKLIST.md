# ✅ Cliente Area - Production Deployment Checklist

## Pre-Deployment Steps

### 1. Database Setup
- [ ] Run `npx prisma generate` to regenerate Prisma client
- [ ] Run `npx prisma db push` OR `npx prisma migrate deploy` 
- [ ] Verify `Client` table has `password` column (nullable String)
- [ ] Seed database with at least one test customer account

### 2. Environment Variables
- [ ] Set `JWT_SECRET` to a secure random string (min 32 characters)
- [ ] Set `DATABASE_URL` to production PostgreSQL connection string
- [ ] Set `NODE_ENV=production`
- [ ] Verify `.env` file is NOT committed to git

### 3. Build & Test
- [ ] Run `npm run build` to verify no build errors
- [ ] Test registration: Create new customer account
- [ ] Test login: Log in with created account
- [ ] Test logout: Verify logout clears session
- [ ] Test protected routes: Access `/cliente` without login → should redirect

### 4. Security Verification
- [ ] Verify passwords are hashed in database (bcrypt format)
- [ ] Verify `customer-token` cookie is `httpOnly`
- [ ] Verify cookies have `secure: true` flag in production
- [ ] Test wrong password → should reject login
- [ ] Test duplicate email → should prevent registration

## Post-Deployment Verification

### Authentication Flow
- [ ] Registration creates account and auto-logs in
- [ ] Login requires correct email + password
- [ ] Session persists across page refreshes
- [ ] Logout properly clears authentication
- [ ] Protected routes redirect to login when not authenticated

### Data Integration
- [ ] Dashboard shows real customer data from database
- [ ] Consultations page shows real consultations (or empty state)
- [ ] Documents page shows real documents (or empty state)
- [ ] Payments page shows real payments (or empty state)

### User Experience
- [ ] No "João Silva Santos" mock data visible
- [ ] No hardcoded dates from 2024
- [ ] Loading states appear during data fetch
- [ ] Error messages are user-friendly
- [ ] Empty states have clear CTAs

## Rollback Plan

If issues occur in production:

1. **Quick Fix:** Revert to previous deployment
2. **Check logs:** Look for authentication errors in server logs
3. **Database:** Verify Prisma schema matches DB schema
4. **Environment:** Double-check `JWT_SECRET` is set correctly

## Known Limitations

- Password reset flow not implemented (users must contact support)
- Email verification not implemented (all emails auto-verified)
- Profile updates only work locally (not persisted to DB yet)
- Document uploads need API integration to persist

## Success Criteria

✅ New users can register with name, email, phone, password
✅ Registered users can log in with email + password
✅ Dashboard displays real customer data from PostgreSQL
✅ All pages redirect to login if not authenticated
✅ Logout clears session and redirects to login page
✅ No mock data ("João Silva", "demo@visa2any.com") appears anywhere

---

**Status:** Ready for production deployment
**Last Updated:** January 31, 2026
