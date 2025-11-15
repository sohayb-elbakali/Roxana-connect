# 🚀 Quick Deployment Reference

## 📝 Pre-Deployment Checklist (5 Minutes)

### 1️⃣ Generate Strong JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy this to your `.env` file as `JWT_SECRET`

### 2️⃣ Server Environment Variables (Required)
```env
NODE_ENV=production
PORT=5000
MONGO_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<generated_from_step_1>
BREVO_API_KEY=<your_brevo_api_key>
EMAIL_FROM=<verified_sender_email>
CLIENT_URL=<your_frontend_url>
```

### 3️⃣ Client Environment Variables (Required)
```env
REACT_APP_API_URL=<your_backend_url>
```

### 4️⃣ MongoDB Atlas Setup
- Create production database user
- Generate strong password (not "admin123")
- Add server IP to whitelist (not 0.0.0.0/0)
- Enable automatic backups

### 5️⃣ Brevo Email Setup
- Verify sender email in Brevo dashboard
- Use production API key (not test key)
- Test email sending

---

## 🔒 Security Checklist

✅ JWT_SECRET is strong and unique (32+ characters)
✅ MongoDB credentials are production-specific
✅ Server IP whitelisted in MongoDB (not open to all)
✅ .env files NOT committed to git
✅ HTTPS/SSL enabled on hosting platform
✅ CORS configured with production domains only
✅ Rate limiting enabled (already configured)
✅ Helmet security headers enabled (already configured)

---

## 🎯 Deployment Steps

### Option A: Heroku Backend + Netlify Frontend

#### Backend (Heroku)
```bash
cd server
heroku login
heroku create your-app-name-api
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set BREVO_API_KEY=your_key
heroku config:set EMAIL_FROM=your_email
heroku config:set CLIENT_URL=https://your-app.netlify.app
git push heroku main
```

#### Frontend (Netlify)
```bash
cd client
# Create .env.production
echo "REACT_APP_API_URL=https://your-app-api.herokuapp.com" > .env.production
npm run build
netlify deploy --prod --dir=build
```

### Option B: Vercel (Both)

#### Backend
```bash
cd server
vercel --prod
# Set environment variables in Vercel dashboard
```

#### Frontend
```bash
cd client
vercel --prod
# Set REACT_APP_API_URL in Vercel dashboard
```

---

## ✅ Post-Deployment Testing (5 Minutes)

### Test These Features:
1. **Register** → Check email received
2. **Verify Email** → Click link in email
3. **Login** → Access granted
4. **Update Profile** → Name change works
5. **Change Password** → Old password verified
6. **Forgot Password** → Email received, reset works
7. **Upload Image** → Profile picture updates
8. **Create Post** → Visible to others
9. **Logout** → Session cleared, redirected

### Check These URLs:
- `https://your-api.com` → "Server is working correctly"
- `https://your-api.com/api/users` → Should show 401 (protected)
- `https://your-app.com` → Landing page loads

---

## 🐛 Quick Troubleshooting

### "CORS Error"
- Check `CLIENT_URL` in server .env matches your frontend URL
- Verify CORS configuration in `server/server.js`

### "Authentication Failed"
- Verify `JWT_SECRET` is same across all server instances
- Check token is being sent in `x-auth-token` header

### "Email Not Sending"
- Check `BREVO_API_KEY` is valid (not SMTP password)
- Verify `EMAIL_FROM` is verified in Brevo dashboard
- Check Brevo dashboard for error logs

### "Images Not Loading"
- Verify static files are being served
- Check CORS allows cross-origin images
- Ensure `public/images` directory exists

### "Rate Limited"
- Wait 15 minutes
- Or adjust rate limits in `server/server.js`

---

## 📊 Monitoring Commands

### Check Server Status
```bash
heroku logs --tail --app your-app-api
# or
vercel logs your-deployment-url
```

### Check Build Status
```bash
netlify status
# or
vercel ls
```

### Database Status
- Login to MongoDB Atlas
- Check cluster health
- Review connection logs

---

## 🔧 Environment Variables Quick Reference

| Variable | Where | Example | Required |
|----------|-------|---------|----------|
| NODE_ENV | Server | production | ✅ |
| PORT | Server | 5000 | ✅ |
| MONGO_URI | Server | mongodb+srv://... | ✅ |
| JWT_SECRET | Server | random32chars... | ✅ |
| BREVO_API_KEY | Server | xkeysib-... | ✅ |
| EMAIL_FROM | Server | verified@email.com | ✅ |
| CLIENT_URL | Server | https://app.com | ✅ |
| REACT_APP_API_URL | Client | https://api.com | ✅ |

---

## 📞 Support Resources

- **Heroku Docs**: https://devcenter.heroku.com/
- **Netlify Docs**: https://docs.netlify.com/
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Brevo API**: https://developers.brevo.com/

---

## 🎉 Success Indicators

✅ Backend URL returns "Server is working correctly"
✅ Frontend loads without console errors
✅ Login/Register works
✅ Emails are received
✅ Images load correctly
✅ No CORS errors in browser console
✅ SSL certificate is valid (padlock in browser)
✅ Security headers present (check with securityheaders.com)

---

**Your app is production-ready! Deploy with confidence! 🚀**

For detailed information, see: `DEPLOYMENT.md` and `PRODUCTION_READY.md`
