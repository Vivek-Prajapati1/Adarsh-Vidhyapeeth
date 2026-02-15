# 🚀 Deployment Guide - Adarsh Vidhyapeeth

Complete deployment guide for production environment.

---

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas account created
- [ ] Domain name purchased (optional)
- [ ] SSL certificate ready
- [ ] Environment variables documented
- [ ] Database backup taken
- [ ] Admin password changed
- [ ] API tested thoroughly
- [ ] Frontend build tested
- [ ] Security review completed

---

## 🌐 Deployment Options

### Option 1: All-in-One Server (Recommended for Small Scale)

Deploy everything on a single VPS (DigitalOcean, AWS EC2, etc.)

### Option 2: Separate Services (Scalable)

- Backend: Railway / Heroku / AWS
- Frontend: Vercel / Netlify
- Database: MongoDB Atlas

---

## 📦 Option 1: Single VPS Deployment

### Server Requirements

- Ubuntu 20.04+ or similar
- Min 2GB RAM
- Node.js 18+
- MongoDB or MongoDB Atlas
- Nginx (reverse proxy)

### Step 1: Server Setup

```bash
# Connect to your VPS
ssh root@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install Nginx
sudo apt install nginx -y

# Install PM2 (process manager)
sudo npm install -g pm2

# Install MongoDB (optional, if not using Atlas)
# Follow: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
```

### Step 2: Clone Repository

```bash
# Create app directory
sudo mkdir -p /var/www/adarsh-vidhyapeeth
cd /var/www/adarsh-vidhyapeeth

# Clone your repository (or upload files)
# If using Git:
git clone https://github.com/yourusername/adarsh-vidhyapeeth.git .

# Set ownership
sudo chown -R $USER:$USER /var/www/adarsh-vidhyapeeth
```

### Step 3: Backend Setup

```bash
cd /var/www/adarsh-vidhyapeeth/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
```

**Production .env:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adarsh_vidhyapeeth
JWT_SECRET=your_super_secure_random_string_here
JWT_EXPIRE=7d
```

```bash
# Seed database
npm run seed

# Test server
npm start

# If working, setup PM2
pm2 start server.js --name adarsh-backend
pm2 save
pm2 startup
```

### Step 4: Frontend Setup

```bash
cd /var/www/adarsh-vidhyapeeth/frontend

# Install dependencies
npm install

# Create production .env
nano .env
```

**Production .env:**
```env
VITE_API_URL=https://yourdomain.com/api
# Or if using IP: http://your-server-ip:5000/api
```

```bash
# Build for production
npm run build

# Built files are in 'dist' folder
```

### Step 5: Nginx Configuration

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/adarsh-vidhyapeeth
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    # Or use: server_name your-server-ip;

    # Public website (HTML files)
    root /var/www/adarsh-vidhyapeeth;
    index index.html;

    # Serve public website
    location / {
        try_files $uri $uri/ =404;
    }

    # Serve admin dashboard (React app)
    location /dashboard {
        alias /var/www/adarsh-vidhyapeeth/frontend/dist;
        try_files $uri $uri/ /dashboard/index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Serve uploaded files
    location /uploads {
        alias /var/www/adarsh-vidhyapeeth/backend/uploads;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Max upload size
    client_max_body_size 10M;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/adarsh-vidhyapeeth /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 6: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts
# Auto-renewal is configured automatically
```

### Step 7: Firewall Setup

```bash
# Allow required ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### Step 8: Final Checks

```bash
# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check MongoDB connection
mongo "mongodb+srv://cluster.mongodb.net/test" --username youruser

# Test website
curl http://yourdomain.com
curl http://yourdomain.com/api/health
```

---

## 🔄 Option 2: Separate Hosting

### MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account & cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for all)
5. Get connection string

### Backend on Railway

1. Create account on https://railway.app
2. New Project → Deploy from GitHub
3. Select backend folder
4. Add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=...
   JWT_EXPIRE=7d
   ```
5. Deploy
6. Note the URL: `https://your-app.railway.app`

### Frontend on Vercel

1. Create account on https://vercel.com
2. New Project → Import Git Repository
3. Framework: Vite
4. Root Directory: `frontend`
5. Environment Variables:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
6. Deploy

### Update CORS (Backend)

```javascript
// backend/server.js
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

---

## 🔐 Security Best Practices

### 1. Environment Variables

Never commit `.env` files. Use platform-specific environment variable settings.

### 2. JWT Secret

Generate strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. MongoDB Security

- Use strong passwords
- Whitelist only necessary IPs
- Enable authentication
- Regular backups

### 4. Backend Security

- Keep dependencies updated
- Use Helmet.js (already included)
- Enable rate limiting
- Validate all inputs
- Sanitize user data

### 5. File Uploads

- Limit file sizes
- Validate file types
- Scan for malware
- Use CDN for static files

---

## 📊 Monitoring & Maintenance

### PM2 Monitoring

```bash
# View logs
pm2 logs adarsh-backend

# Monitor resources
pm2 monit

# Restart app
pm2 restart adarsh-backend

# List all apps
pm2 list
```

### Database Backups

```bash
# Manual backup
mongodump --uri="mongodb+srv://..." --out=/backups/$(date +%Y%m%d)

# Setup automated backups (cron)
crontab -e

# Add line (daily backup at 2 AM):
0 2 * * * mongodump --uri="mongodb+srv://..." --out=/backups/$(date +\%Y\%m\%d)
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Disk Space

```bash
# Check disk usage
df -h

# Check folder sizes
du -sh /var/www/adarsh-vidhyapeeth/*
```

---

## 🔄 Updates & Deployments

### Update Application

```bash
cd /var/www/adarsh-vidhyapeeth

# Pull latest code
git pull origin main

# Update backend
cd backend
npm install
pm2 restart adarsh-backend

# Update frontend
cd ../frontend
npm install
npm run build

# Restart Nginx
sudo systemctl restart nginx
```

### Zero-Downtime Deployment

```bash
# Build new frontend
cd frontend
npm run build

# Test backend changes locally first
cd ../backend
npm test

# Deploy backend with PM2 reload (zero downtime)
pm2 reload adarsh-backend

# Update frontend (instant)
# Already done in build step
```

---

## 🆘 Troubleshooting

### Backend Not Starting

```bash
# Check PM2 logs
pm2 logs adarsh-backend --lines 100

# Check environment variables
pm2 env 0

# Restart
pm2 restart adarsh-backend
```

### MongoDB Connection Issues

```bash
# Test connection
mongo "your-connection-string"

# Check firewall
sudo ufw status

# Check IP whitelist in MongoDB Atlas
```

### Nginx Errors

```bash
# Check config syntax
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart
sudo systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Renew manually
sudo certbot renew

# Check expiry
sudo certbot certificates
```

---

## 📱 Mobile Optimization

Frontend is fully responsive, but for native mobile apps:

### Option: Progressive Web App (PWA)

Add to `frontend/public/manifest.json`:

```json
{
  "name": "Adarsh Vidhyapeeth",
  "short_name": "AV Admin",
  "theme_color": "#1e3a8a",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🎯 Performance Optimization

### Backend

```javascript
// Enable compression
app.use(compression());

// Cache static files
app.use(express.static('public', { maxAge: '1d' }));

// Add indexes to MongoDB
studentSchema.index({ mobile: 1 });
studentSchema.index({ status: 1, isDeleted: 1 });
```

### Frontend

```javascript
// Lazy load routes
const Students = lazy(() => import('./pages/Students'));

// Use React Query caching
const { data } = useQuery('students', fetchStudents, {
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Nginx Caching

```nginx
# Add to server block
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 📋 Post-Deployment Checklist

- [ ] Website accessible at domain
- [ ] SSL certificate installed & working
- [ ] Login working with admin credentials
- [ ] Dashboard loads correctly
- [ ] API endpoints responding
- [ ] File uploads working
- [ ] Database operations functional
- [ ] PM2 auto-restart configured
- [ ] Backups scheduled
- [ ] Monitoring setup
- [ ] Error logging configured
- [ ] Performance optimized
- [ ] Security headers enabled
- [ ] CORS configured correctly
- [ ] Documentation updated

---

## 🎉 Success!

Your Adarsh Vidhyapeeth Management System is now live!

**Next Steps:**
1. Change admin password
2. Create director accounts
3. Add initial pricing
4. Train staff
5. Monitor system regularly

---

**For Support:** Contact development team

*Last Updated: February 10, 2026*
