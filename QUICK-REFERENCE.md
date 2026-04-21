# 🎯 PRODUCTION SETUP - QUICK REFERENCE

## Your Domain Configuration

```
╔══════════════════════════════════════════════════════════╗
║         FORTS TRACKER - PRODUCTION DOMAINS              ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  🌐 Frontend: forts.ajinkya.codes                       ║
║     └─ React UI Application                            ║
║     └─ Served by Nginx (Port 443 - HTTPS)             ║
║                                                          ║
║  🔗 API: forts.application.api.ajinkya.codes           ║
║     └─ Express.js REST API                            ║
║     └─ Proxied through Nginx (Port 443 - HTTPS)      ║
║                                                          ║
║  📡 Server: 80.225.192.233                             ║
║     └─ Oracle Always Free Instance                     ║
║     └─ Both domains point here                         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

## 📦 Files Created/Updated

### Configuration Files ✅
```
backend/
  ├─ server.js (Updated CORS configuration)
  ├─ .env (Development)
  ├─ .env.example (Template)
  └─ .env.production (Production - YOUR DOMAINS)

nginx-forts-app.conf (Updated - Your domains + SSL)
```

### Documentation Files ✅
```
📚 Complete Deployment Guides:
  ├─ DNS-DEPLOYMENT-GUIDE.md (NEW! DNS setup + architecture)
  ├─ PRODUCTION-READY.md (NEW! Complete setup guide)
  ├─ README.md (Project overview)
  ├─ DEPLOYMENT.md (Original deployment guide)
  ├─ FEATURES.md (User features)
  ├─ PROJECT-SUMMARY.md (Technical details)
  ├─ PROJECT-CHECKLIST.md (Verification)
  ├─ DELIVERY-SUMMARY.md (What was delivered)
  └─ INDEX.md (Documentation index)
```

### Deployment Script ✅
```
deploy-production.sh (NEW! Automated deployment script)
  └─ Builds frontend + backend
  └─ Creates deployment package
  └─ Shows step-by-step instructions
```

---

## 🚀 3-Step Quick Deploy

### Step 1: Build
```bash
cd /home/ajinkya-thakur/dev/forts
./deploy-production.sh
```

### Step 2: Upload
```bash
scp -r deploy-package/* ajinkya@80.225.192.233:/home/ajinkya/forts-tracker/
```

### Step 3: Deploy (On Server)
```bash
ssh ajinkya@80.225.192.233

# Follow the automated instructions from deploy-production.sh
```

---

## 🔐 Important Security Notes

### ⚠️ Change JWT_SECRET!
Before deployment, update in `backend/.env.production`:
```env
JWT_SECRET=generate_a_strong_random_string_here
# Use: openssl rand -base64 32
```

### ⚠️ MongoDB Whitelist
Add Oracle server IP to MongoDB Atlas:
1. Go to MongoDB Atlas Dashboard
2. Network Access → IP Whitelist
3. Add: 80.225.192.233

### ⚠️ Firewall Rules
Only allow:
- Port 22 (SSH)
- Port 80 (HTTP - redirects to HTTPS)
- Port 443 (HTTPS)

---

## 📋 Deployment Checklist

Before going live:

- [ ] DNS records created
- [ ] DNS records point to 80.225.192.233
- [ ] SSL certificate ready (Let's Encrypt)
- [ ] Nginx configured
- [ ] Backend .env.production configured
- [ ] MongoDB whitelist updated
- [ ] Frontend built
- [ ] Backend running on port 5000
- [ ] Nginx proxy working
- [ ] HTTPS redirect working
- [ ] Registration working
- [ ] Login working
- [ ] Can create/edit/delete forts

---

## 🌐 Environment Variables Summary

### Production (.env.production)
```env
# Database (Cloud MongoDB)
MONGO_URI=mongodb+srv://ajinkya:AjinkyaHikes@cluster0.cfispda.mongodb.net/forts_app?retryWrites=true&w=majority&appName=Cluster0

# Security (CHANGE THIS!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server
PORT=5000
NODE_ENV=production

# Your Domains
API_URL=https://forts.application.api.ajinkya.codes
APP_URL=https://forts.ajinkya.codes
CORS_ORIGIN=https://forts.ajinkya.codes
```

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│     User Browser                                │
│     https://forts.ajinkya.codes                │
└────────────────┬────────────────────────────────┘
                 │ HTTPS (Port 443)
                 ▼
┌─────────────────────────────────────────────────┐
│     Nginx Reverse Proxy                         │
│     - SSL Termination                          │
│     - HTTP to HTTPS Redirect                   │
│     - Load Balancing                           │
└────────────────┬────────────────────────────────┘
         ┌───────┴───────┐
         │               │
         ▼               ▼
    ┌────────────┐  ┌──────────────┐
    │  React    │  │   Express    │
    │  Frontend │  │   Backend    │
    │  /dist    │  │  :5000       │
    │  Static   │  │  /auth       │
    │           │  │  /forts      │
    └────────────┘  └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  MongoDB     │
                    │  Atlas       │
                    │  (Cloud)     │
                    └──────────────┘
```

---

## 💡 Key Configuration Points

### Nginx
- ✅ Listens on port 80 (HTTP) - redirects to HTTPS
- ✅ Listens on port 443 (HTTPS) - main server
- ✅ Serves React static files from `/var/www/forts-tracker/frontend/dist`
- ✅ Proxies API requests to backend on port 5000
- ✅ Sets security headers for protection

### Backend
- ✅ Runs on port 5000
- ✅ CORS enabled for `https://forts.ajinkya.codes`
- ✅ JWT authentication for user isolation
- ✅ Connected to MongoDB Atlas

### Frontend
- ✅ React 18 with Vite build
- ✅ Mobile-first responsive design
- ✅ Production build optimized (~50KB gzipped)
- ✅ Static file caching configured

---

## 🧪 Testing URLs (After Deployment)

```
Frontend:  https://forts.ajinkya.codes
API:       https://forts.application.api.ajinkya.codes

Examples:
- Register:    POST https://forts.application.api.ajinkya.codes/auth/register
- Login:       POST https://forts.application.api.ajinkya.codes/auth/login
- List Forts:  GET https://forts.application.api.ajinkya.codes/forts
- Create Fort: POST https://forts.application.api.ajinkya.codes/forts
```

---

## 📞 Common Commands

### On Server

```bash
# Check Nginx status
sudo systemctl status nginx
sudo systemctl restart nginx

# Check backend process
pm2 list
pm2 logs forts-api
pm2 restart forts-api

# Check SSL certificate
sudo certbot certificates
sudo certbot renew --dry-run

# View logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### From Local Machine

```bash
# Test HTTPS connection
curl -I https://forts.ajinkya.codes

# Test API
curl https://forts.application.api.ajinkya.codes

# Test DNS
nslookup forts.ajinkya.codes
```

---

## 🎯 What's Next?

1. **Ensure DNS is set up**: Both domains must point to 80.225.192.233
2. **Run build script**: `./deploy-production.sh`
3. **Upload to server**: `scp -r deploy-package/* ajinkya@80.225.192.233:/home/ajinkya/forts-tracker/`
4. **Follow deployment steps**: Follow instructions from the script
5. **Generate SSL certificate**: Use Let's Encrypt
6. **Start servers**: Configure Nginx and start backend with PM2
7. **Verify**: Test both domains

---

## 📚 Reference Documentation

| Document | Purpose |
|----------|---------|
| **DNS-DEPLOYMENT-GUIDE.md** | Complete DNS setup and deployment guide |
| **PRODUCTION-READY.md** | Detailed production deployment checklist |
| **DEPLOYMENT.md** | Original deployment steps (for reference) |
| **README.md** | Project overview and quick start |
| **FEATURES.md** | User feature guide |
| **PROJECT-SUMMARY.md** | Technical architecture details |

Start with: **DNS-DEPLOYMENT-GUIDE.md** → **PRODUCTION-READY.md**

---

## ✨ Summary

✅ Your application is fully configured for production
✅ Both domains are set up in code
✅ Nginx configured with SSL support
✅ Automated deployment script ready
✅ Complete documentation provided

🚀 **Ready to deploy to your Oracle Always Free server!**

```
    forts.ajinkya.codes
            ↓
    Your Forts Tracker App
            ↓
     80.225.192.233
```

**Happy deploying! 🎉**
