# 🚨 URGENT FIX - Render Backend Setup

## Current Problem
**500 Internal Server Error** when logging in because Render backend has no environment variables set.

---

## ✅ STEP-BY-STEP FIX (5 minutes)

### 📍 Step 1: Go to Render Dashboard
Open: https://dashboard.render.com/
- Find and click your service: **adarsh-vidhyapeeth**

---

### 📍 Step 2: Click "Environment" Tab
On the left sidebar, click **Environment**

---

### 📍 Step 3: Add These 8 Variables

Click **Add Environment Variable** button for each:

| Variable Name | Value to Enter |
|--------------|----------------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | Your MongoDB connection string ⬇️ |
| `JWT_SECRET` | `adarsh-vidyapeeth-secure-production-jwt-secret-2026` |
| `JWT_EXPIRE` | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

---

### 📍 Step 4: Get Your MongoDB Connection String

1. Open: https://cloud.mongodb.com/
2. Click your cluster → **Connect** button
3. Choose: **Connect your application**
4. **Driver**: Node.js
5. Copy the connection string that looks like:
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace** `<password>` with your actual database password
7. **Add** database name: `adarsh-vidhyapeeth`

**Final format:**
```
mongodb+srv://username:your-password@cluster.mongodb.net/adarsh-vidhyapeeth?retryWrites=true&w=majority
```

---

### 📍 Step 5: Get Cloudinary Credentials

1. Open: https://cloudinary.com/console
2. Copy from your dashboard:
   - **Cloud name** (e.g., `dxxxxxxx`)
   - **API Key** (numbers)
   - **API Secret** (alphanumeric string)

---

### 📍 Step 6: Save & Redeploy

1. Click **Save Changes** button at bottom
2. Render will automatically redeploy (wait 2-3 minutes)
3. Go to **Logs** tab and wait for: ✅ "MongoDB Connected" ✅ "Server running on port 5000"

---

### 📍 Step 7: Verify & Test

1. **Check Backend:**
   - Open: https://adarsh-vidhyapeeth.onrender.com/api/health
   - You should see: `{"success":true,"message":"Server is running"}`

2. **Try Login:**
   - Go to: https://adarshvidhyapeeth.vercel.app/login
   - Username: `admin`
   - Password: `admin123`

---

## ⚠️ IMPORTANT NOTES

### MongoDB Atlas Network Access
**MUST DO:** Allow Render to connect to MongoDB

1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Click **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Choose: **Allow Access from Anywhere**
5. Enter: `0.0.0.0/0`
6. Click **Confirm**

Without this, your backend cannot connect to database!

---

## 🐛 If Still Not Working

### Check Render Logs
1. Go to Render Dashboard → Your Service
2. Click **Logs** tab
3. Look for error messages:
   - ❌ "MongoDB Connection Error" → Check MONGODB_URI
   - ❌ "JWT" error → Check JWT_SECRET
   - ❌ "Cloudinary" error → Check Cloudinary credentials

### Common Issues

**"Invalid credentials" error:**
- Database might not have admin user yet
- Try creating admin user in MongoDB directly

**Still 500 error:**
- Check ALL 8 environment variables are set correctly
- Variable names are case-sensitive: `MONGODB_URI` (not `MONGO_URI`)
- MongoDB Atlas network access allows 0.0.0.0/0

---

## ✅ Success Checklist

- [ ] All 8 environment variables added on Render
- [ ] MongoDB connection string is correct (with password replaced)
- [ ] MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- [ ] Cloudinary credentials are correct
- [ ] Render shows "MongoDB Connected" in logs
- [ ] https://adarsh-vidhyapeeth.onrender.com/api/health works
- [ ] Login works with admin/admin123

---

**After completing these steps, your login should work! 🎉**

If you're stuck on any step, check that step carefully - most issues are from typos or missing values.
