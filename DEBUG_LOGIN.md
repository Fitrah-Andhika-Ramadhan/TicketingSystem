# Login Debugging Guide

## Quick Test Steps

1. **Check if server is running**
   - Visit `http://localhost:3000/login`
   - You should see the login form

2. **Open Browser DevTools (F12)**
   - Go to Console tab
   - Try to login with:
     - Email: `admin@natagroup.com`
     - Password: `NataGroup@2024`
   - Watch the console for [v0] debug messages

3. **Test API Directly**
   - Visit `http://localhost:3000/test`
   - Click "Test Login API" button
   - See the response in the console

## Expected Console Logs

### On Login Form Submit:
```
[v0] Submitting login form: {email: "admin@natagroup.com", password: "NataGroup@2024"}
[v0] Response status: 200
[v0] Response data: {success: true, user: {...}, token: "eyJhbGc..."}
[v0] Login successful, storing token and redirecting
```

### On Dashboard Load:
```
[v0] Dashboard auth check - token: present user: present
[v0] Authenticated, loading user: admin@natagroup.com
[v0] Fetching projects...
[v0] Projects response status: 200
[v0] Projects data: {success: true, data: [...]}
```

## Troubleshooting

### Issue: Login button doesn't respond
**Solution:** Check browser console for JavaScript errors

### Issue: "Invalid email or password" error
**Solution:** Verify you're using:
- Email: `admin@natagroup.com`
- Password: `NataGroup@2024`

### Issue: Login succeeds but doesn't redirect to dashboard
**Solution:** 
- Check localStorage (DevTools → Application → LocalStorage)
- Should have `token` and `user` keys
- Check if dashboard page shows auth errors in console

### Issue: API test page shows errors
**Solution:** The API might not be responding correctly
- Check server console for errors
- Try refreshing the page
- Check if `npm run dev` is still running

## Environment Check

```bash
# Verify dependencies are installed
ls node_modules | grep -E "jsonwebtoken|bcryptjs"

# Check if .env.local exists
cat .env.local
```

## Files to Check

- `/app/api/auth/login/route.ts` - Login endpoint
- `/app/login/page.tsx` - Login form
- `/app/dashboard/page.tsx` - Dashboard
- `/lib/auth.ts` - Authentication logic
