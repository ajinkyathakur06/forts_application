# 🌐 Production Deployment Ready - DNS & Domains Configured

## ✅ What's Been Configured

Your Forts Tracker application is now fully configured for production deployment with the following domains:

### 📍 Domain Mapping

```
┌─────────────────────────────────────────────────────┐
│          YOUR PRODUCTION DOMAINS                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  🎯 Main Application:                              │
│     https://forts.ajinkya.codes                    │
│     → React Frontend (UI)                          │
│     → Port: 443 (HTTPS)                            │
│                                                      │
│  🔗 API Backend:                                    │
│     https://forts.application.api.ajinkya.codes   │
│     → Express.js Backend (REST API)                │
│     → Port: 443 (HTTPS)                            │
│                                                      │
│  📡 Server IP:                                      │
│     80.225.192.233                                 │
│     → Oracle Always Free Instance                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

Both domains **must point to** `80.225.192.233` (A records).

---

## 📋 Files Updated/Created

### 1. **Backend Configuration**
- ✅ `backend/server.js` - Updated CORS configuration with domain support
- ✅ `backend/.env` - Development environment (localhost:3000)
- ✅ `backend/.env.production` - Production environment (your domains)

### 2. **Nginx Configuration**
- ✅ `nginx-forts-app.conf` - Updated with your domains and SSL setup

### 3. **Documentation**
- ✅ `DNS-DEPLOYMENT-GUIDE.md` - Complete DNS and deployment guide
- ✅ `deploy-production.sh` - Automated deployment script

---

## 🚀 Quick Start - Deploy to Production

### One-Command Deployment (Recommended)

```bash
cd /home/ajinkya-thakur/dev/forts
./deploy-production.sh
```

This will:
1. ✅ Build React frontend
2. ✅ Install backend dependencies
3. ✅ Create deployment package
4. ✅ Show step-by-step deployment instructions

### Step-by-Step Manual Deployment

**On Your Local Machine:**

```bash
# 1. Build the application
cd /home/ajinkya-thakur/dev/forts
./deploy-production.sh

# 2. Upload to server
scp -r deploy-package/* ajinkya@80.225.192.233:/home/ajinkya/forts-tracker/
```

**On Your Oracle Server (SSH in):**

```bash
# 3. Connect to server
ssh ajinkya@80.225.192.233

# 4. Setup web directory
sudo mkdir -p /var/www/forts-tracker
sudo chown ajinkya:ajinkya /var/www/forts-tracker
cp -r /home/ajinkya/forts-tracker/dist /var/www/forts-tracker/

# 5. Configure backend
cd /var/www/forts-tracker/backend
cp .env.example .env
# Edit .env - update JWT_SECRET and other vars if needed
nano .env

# 6. Get SSL Certificate (Let's Encrypt)
sudo certbot certonly --standalone \
  -d forts.ajinkya.codes \
  -d forts.application.api.ajinkya.codes

# 7. Install and setup Nginx
sudo cp /home/ajinkya/forts-tracker/nginx-forts-app.conf /etc/nginx/sites-available/forts-app
sudo ln -s /etc/nginx/sites-available/forts-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 8. Start backend with PM2
pm2 start /var/www/forts-tracker/backend/server.js --name "forts-api"
pm2 save
pm2 startup

# 9. Verify everything works
curl https://forts.ajinkya.codes
```

---

## 🔐 Security Configuration

### CORS Settings
✅ Frontend origin: `https://forts.ajinkya.codes`
✅ API accepts requests from your frontend domain only
✅ Credentials and custom headers enabled

### SSL/TLS
✅ HTTPS enforced (HTTP redirects to HTTPS)
✅ Let's Encrypt certificate support
✅ Security headers configured:
- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options`
- `X-Frame-Options`
- `X-XSS-Protection`

### JWT Authentication
- ⚠️ **IMPORTANT:** Change `JWT_SECRET` in production `.env`
- Use a strong, random 32+ character secret

---

## 📊 Environment Variables

### Production (.env.production)

```env
# Database
MONGO_URI=mongodb+srv://ajinkya:AjinkyaHikes@cluster0.cfispda.mongodb.net/forts_app?retryWrites=true&w=majority&appName=Cluster0

# Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server
PORT=5000
NODE_ENV=production

# URLs (Your Domains)
API_URL=https://forts.application.api.ajinkya.codes
APP_URL=https://forts.ajinkya.codes
CORS_ORIGIN=https://forts.ajinkya.codes
```

---

## ✨ Nginx Architecture

```
User Request (HTTPS)
        ↓
    ┌─────────────────────────┐
    │  Nginx (Port 443)       │
    │  - SSL/TLS Termination  │
    │  - Reverse Proxy        │
    └──────┬──────────────────┘
           │
    ┌──────┴──────────────────┐
    │                         │
    ▼                         ▼
┌────────────┐          ┌──────────────┐
│ /dist/     │          │ /api/auth/   │
│ React      │          │ /forts/      │
│ Frontend   │          │ Express      │
│            │          │ Backend      │
│ Static     │          │ Port 5000    │
│ Files      │          │              │
└────────────┘          └──────┬───────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │ MongoDB Atlas    │
                        │ (Cloud Database) │
                        └──────────────────┘
```

---

## 🧪 Testing After Deployment

### Test Frontend
```bash
# Should load React app
curl -I https://forts.ajinkya.codes
# Response: 200 OK
```

### Test API
```bash
# Should return API message
curl https://forts.application.api.ajinkya.codes
# Response: {"message":"Forts Tracker API is running"}
```

### Test SSL Certificate
```bash
# Should show your certificate
echo | openssl s_client -servername forts.ajinkya.codes -connect forts.ajinkya.codes:443 2>/dev/null | openssl x509 -noout -dates
```

### Test CORS
```bash
# From browser console at https://forts.ajinkya.codes
fetch('https://forts.application.api.ajinkya.codes', {
  method: 'GET',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' }
})
```

---

## 📈 Monitoring Commands

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Check Backend Status
```bash
pm2 list
pm2 logs forts-api
pm2 monit
```

### Check SSL Certificate
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

### Check Server Resources
```bash
top
df -h
free -h
netstat -tuln | grep LISTEN
```

---

## 🆘 Troubleshooting

### DNS Not Working
```bash
# Check DNS resolution
nslookup forts.ajinkya.codes
dig forts.ajinkya.codes

# Should return: 80.225.192.233
```

### HTTPS Not Working
```bash
# Check SSL certificate
sudo certbot certificates

# Verify certificate files exist
ls -la /etc/letsencrypt/live/forts.ajinkya.codes/

# Check Nginx SSL configuration
sudo nginx -t
```

### API Not Responding
```bash
# Check backend process
pm2 list
pm2 logs forts-api

# Check port 5000 is listening
sudo netstat -tuln | grep 5000

# Test backend directly
curl http://localhost:5000
```

### CORS Errors
```bash
# Check CORS_ORIGIN in .env
grep CORS_ORIGIN /var/www/forts-tracker/backend/.env

# Must match: https://forts.ajinkya.codes

# Restart backend
pm2 restart forts-api
```

---

## 📅 Maintenance Tasks

### Daily
- [ ] Monitor error logs
- [ ] Check server disk space

### Weekly
- [ ] Review application logs
- [ ] Check SSL certificate expiration

### Monthly
- [ ] Update dependencies
- [ ] Backup database
- [ ] Review security logs

### Every 3 Months
- [ ] SSL certificate renewal (auto with Let's Encrypt)
- [ ] Security updates for OS and packages

---

## 📱 API Endpoints (Production)

All endpoints are now available at `https://forts.application.api.ajinkya.codes`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Login and get JWT token |
| `/forts` | GET | Get all user's forts |
| `/forts` | POST | Create new fort |
| `/forts/:id` | GET | Get fort details |
| `/forts/:id` | PUT | Update fort |
| `/forts/:id` | DELETE | Delete fort |

---

## 🎯 Final Checklist

Before marking deployment complete:

- [ ] DNS records created (both domains → 80.225.192.233)
- [ ] DNS propagated (test with `nslookup`)
- [ ] SSL certificate generated
- [ ] Nginx installed and configured
- [ ] Backend server running (PM2)
- [ ] MongoDB connection verified
- [ ] Frontend accessible at https://forts.ajinkya.codes
- [ ] API accessible at https://forts.application.api.ajinkya.codes
- [ ] Registration works
- [ ] Login works
- [ ] Can add forts
- [ ] Can view forts
- [ ] Can upload photos
- [ ] Can edit forts
- [ ] Can delete forts
- [ ] SSL certificate valid
- [ ] HTTPS redirect working
- [ ] CORS working

---

## 🎉 You're All Set!

Your Forts Tracker application is configured and ready for production deployment!

**Key Information:**
- 🌐 Domains: `forts.ajinkya.codes` and `forts.application.api.ajinkya.codes`
- 📡 Server: 80.225.192.233 (Oracle Always Free)
- 🔐 SSL: Let's Encrypt (automatic renewal)
- 🗄️ Database: MongoDB Atlas (cloud)
- ⚡ Performance: Optimized with caching and compression

**Next Step:** Run `./deploy-production.sh` to build and prepare for deployment!

🚀 **Happy Deploying!**
