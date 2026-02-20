# 🚀 Deployment Guide

## Deployed URLs

- **Frontend (Vercel)**: https://adarshvidhyapeeth.vercel.app/
- **Backend (Render)**: https://adarsh-vidhyapeeth.onrender.com

---

## ✅ Configuration Completed

### Frontend Configuration

1. **.env.production** - Created with production backend URL
   ```
   VITE_API_URL=https://adarsh-vidhyapeeth.onrender.com/api
   ```

2. **vercel.json** - Created for proper SPA routing

### Backend Configuration

1. **CORS** - Updated to allow your Vercel domain
   - Allows: `https://adarshvidhyapeeth.vercel.app`
   - Also allows: `localhost:3000` and `localhost:5173` for development

---

## 📋 Setup Steps for Vercel

### 1. Add Environment Variable in Vercel Dashboard

Go to your Vercel project settings:

1. Open: https://vercel.com/dashboard
2. Select your project: `adarshvidhyapeeth`
3. Go to: **Settings** > **Environment Variables**
4. Add this variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://adarsh-vidhyapeeth.onrender.com/api`
   - **Environment**: Production

5. Click **Save**

### 2. Redeploy Frontend

After adding the environment variable:

```bash
# Commit and push your changes
git add .
git commit -m "Configure production deployment"
git push origin main
```

Vercel will automatically redeploy.

**OR** manually trigger deployment:
- Go to Vercel Dashboard > Your Project > Deployments
- Click **Redeploy**

---

## 📋 Setup Steps for Render (Backend)

### 1. Environment Variables on Render

Make sure these are set in Render Dashboard:

1. Go to: https://dashboard.render.com/
2. Select your service: `adarsh-vidhyapeeth`
3. Go to: **Environment** tab
4. Add/Verify these variables:

```
NODE_ENV=production
PORT=5000
MONGO_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
```

5. Click **Save Changes**

### 2. Verify Backend is Running

Open: https://adarsh-vidhyapeeth.onrender.com

You should see:
```json
{
  "message": "Adarsh Vidhyapeeth API is running"
}
```

---

## 🔍 Testing Your Deployment

### Test Frontend
1. Open: https://adarshvidhyapeeth.vercel.app/
2. Landing page should load
3. Click "Staff Login" or go to `/login`
4. Try logging in with admin credentials

### Test Backend Connection
1. Open browser console (F12)
2. Watch for API calls
3. Should see requests to: `https://adarsh-vidhyapeeth.onrender.com/api/...`
4. No CORS errors should appear

---

## 🐛 Troubleshooting

### If Login Doesn't Work

1. **Check Backend Logs on Render**
   - Go to Render Dashboard > Your Service > Logs
   - Look for errors

2. **Check Browser Console**
   - Open DevTools (F12) > Console tab
   - Look for CORS errors or network failures

3. **Verify Environment Variables**
   - Vercel: Settings > Environment Variables
   - Make sure `VITE_API_URL` is set correctly

4. **Check MongoDB Connection**
   - Render Dashboard > Environment
   - Verify `MONGO_URI` is correct
   - MongoDB Atlas: Check if IP whitelist includes `0.0.0.0/0`

### If Images Don't Load

- Cloudinary credentials must be set in Render
- Check Render logs for Cloudinary errors

### CORS Errors

- Backend CORS is configured for your Vercel domain
- If you change domain, update `server.js` CORS configuration

---

## 🔄 Future Deployments

### Updating Frontend
```bash
git add .
git commit -m "Your update message"
git push origin main
```
Vercel auto-deploys on push to `main` branch.

### Updating Backend
```bash
git add .
git commit -m "Your update message"
git push origin main
```
Render auto-deploys on push to `main` branch.

---

## 📞 Support

If you encounter issues:
1. Check Render logs for backend errors
2. Check Vercel logs for frontend errors
3. Verify all environment variables are set correctly
4. Test API endpoints directly using Postman or browser

---

## ✅ Deployment Checklist

- [x] Frontend `.env.production` created with backend URL
- [x] Vercel environment variable `VITE_API_URL` added
- [x] Backend CORS updated to allow Vercel domain
- [x] `vercel.json` created for SPA routing
- [x] Backend environment variables configured on Render
- [ ] MongoDB Atlas IP whitelist includes Render IPs (0.0.0.0/0)
- [ ] Test login functionality on production
- [ ] Test student management features
- [ ] Test payment processing
- [ ] Test image uploads

---

**Your application is ready for production! 🎉**
