# 🔧 URGENT: Fix Render Backend - Environment Variables Missing

## ⚠️ Current Issue
Your backend is deployed on Render but **missing environment variables**, causing login to fail with a 500 error.

---

## ✅ Step-by-Step Fix for Render

### 1. Go to Render Dashboard
Open: https://dashboard.render.com/

### 2. Select Your Service
- Find and click: **adarsh-vidhyapeeth** (your backend service)

### 3. Go to Environment Tab
- Click on the **Environment** tab in the left sidebar

### 4. Add These Environment Variables

Click **Add Environment Variable** and add each of these:

#### **Required Variables:**

```plaintext
NODE_ENV
production

PORT
5000

MONGO_URI
mongodb+srv://YOUR_MONGODB_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/adarsh-vidhyapeeth?retryWrites=true&w=majority

JWT_SECRET
your-secret-key-here-make-it-long-and-random-12345678

JWT_EXPIRE
7d

CLOUDINARY_CLOUD_NAME
your-cloudinary-cloud-name

CLOUDINARY_API_KEY
your-cloudinary-api-key

CLOUDINARY_API_SECRET
your-cloudinary-api-secret
```

---

## 📝 How to Get Your Values

### MongoDB URI (MONGO_URI)
1. Go to: https://cloud.mongodb.com/
2. Click your cluster
3. Click **Connect** → **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your actual database password
6. Replace `<database>` with `adarsh-vidhyapeeth`

### JWT Secret (JWT_SECRET)
- Use any long random string (at least 32 characters)
- Example: `adarsh-vidyapeeth-super-secret-jwt-key-2026-production`
- **IMPORTANT:** This should be different from your local development secret

### Cloudinary Credentials
1. Go to: https://cloudinary.com/console
2. Find your dashboard
3. Copy:
   - **Cloud name**
   - **API Key**
   - **API Secret**

---

## 🔄 After Adding Variables

### 1. Save Changes
Click **Save Changes** button at the bottom

### 2. Manual Deploy
- Go to **Manual Deploy** tab
- Click **Deploy latest commit**

OR Render will auto-deploy after you save environment variables.

---

## ✅ Verify Backend is Working

### Test Backend API
Open this URL in your browser:
```
https://adarsh-vidhyapeeth.onrender.com/api/auth/health
```

You should see a response (not an error page).

### Check Logs
Go to **Logs** tab in Render Dashboard and look for:
- ✅ "MongoDB Connected"
- ✅ "Cloudinary configured"
- ✅ "Server running on port 5000"
- ❌ No error messages

---

## 🔍 If Still Getting Errors

### Check MongoDB Atlas
1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Click **Network Access** (left sidebar)
3. Make sure IP whitelist includes: `0.0.0.0/0` (Allow from anywhere)
   - Or add Render's IP addresses

### Check Cloudinary
1. Go to Cloudinary Console
2. Verify your account is active
3. Check API credentials are correct

### Check Render Logs
Look for specific error messages:
- "MongoError" → MongoDB connection issue
- "Cloudinary" → Cloudinary credentials issue
- "JWT" → JWT secret missing

---

## 📞 Quick Checklist

Before testing login again:

- [ ] All 8 environment variables added on Render
- [ ] MongoDB URI is correct (with password replaced)
- [ ] MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- [ ] JWT_SECRET is set (any long random string)
- [ ] Cloudinary credentials are correct
- [ ] Render service redeployed after adding variables
- [ ] Render logs show "MongoDB Connected"
- [ ] No errors in Render logs

---

## 🎯 After Setup

1. Wait 2-3 minutes for deployment to complete
2. Check Render logs for "Server running"
3. Try logging in again at: https://adarshvidhyapeeth.vercel.app/login
4. Use your admin credentials

---

**Your backend should work after setting these environment variables! 🚀**
