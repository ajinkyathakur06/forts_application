# DNS & Deployment Configuration

## Domain Setup

Your Forts Tracker application is configured to use the following domains:

### 🌐 Domain Entries

| Domain | Purpose | DNS Record |
|--------|---------|-----------|
| `forts.ajinkya.codes` | Main Application (Frontend) | A Record → 80.225.192.233 |
| `forts.application.api.ajinkya.codes` | API Backend | A Record → 80.225.192.233 |

Both domains are pointing to your Oracle Always Free server at **80.225.192.233**.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    USER BROWSER                      │
└────────────────┬────────────────────────────────────┘
                 │
                 │ https://forts.ajinkya.codes
                 ▼
┌──────────────────────────────────────────────────────┐
│         NGINX REVERSE PROXY (Port 443)              │
│  ┌─ HTTP/80 ──→ HTTPS/443 (Redirect)               │
│  └─ SSL/TLS Certificate (Let's Encrypt)            │
└────────────────┬─────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌──────────────────┐  ┌──────────────────┐
│  REACT FRONTEND  │  │  EXPRESS BACKEND │
│  /dist (static)  │  │  Port 5000       │
└────────────────┘  └────────┬───────────┘
                             │
                             ▼
                      ┌──────────────────┐
                      │   MONGODB ATLAS  │
                      │   (Cloud DB)     │
                      └──────────────────┘
```

---

## Nginx Configuration

The Nginx configuration (`nginx-forts-app.conf`) is now updated to:

### 1. **HTTP to HTTPS Redirect**
```nginx
server {
  listen 80;
  server_name forts.ajinkya.codes forts.application.api.ajinkya.codes;
  return 301 https://$server_name$request_uri;
}
```
- All HTTP traffic (port 80) is redirected to HTTPS (port 443)
- Covers both your domain and API subdomain

### 2. **HTTPS Server Configuration**
```nginx
server {
  listen 443 ssl http2;
  server_name forts.ajinkya.codes;
  
  ssl_certificate /etc/letsencrypt/live/forts.ajinkya.codes/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/forts.ajinkya.codes/privkey.pem;
```
- SSL/TLS enabled with HTTP/2 for performance
- Let's Encrypt certificate paths configured
- Security headers added for protection

### 3. **Static Files & API Routing**
- Frontend React build served from `/var/www/forts-tracker/frontend/dist`
- `/api/`, `/auth/`, and `/forts/` routes proxied to backend (port 5000)
- Long cache headers for assets (30 days)
- Short cache for HTML (5 minutes)

---

## Backend Environment Variables

### Development (`.env`)
```
MONGO_URI=mongodb+srv://ajinkya:AjinkyaHikes@cluster0.cfispda.mongodb.net/forts_app?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

### Production (`.env.production`)
```
MONGO_URI=mongodb+srv://ajinkya:AjinkyaHikes@cluster0.cfispda.mongodb.net/forts_app?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=production
API_URL=https://forts.application.api.ajinkya.codes
APP_URL=https://forts.ajinkya.codes
CORS_ORIGIN=https://forts.ajinkya.codes
```

**IMPORTANT:** Change `JWT_SECRET` to a strong, unique value for production!

---

## API Endpoints

After deployment, your API will be accessible at:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `https://forts.application.api.ajinkya.codes/auth/register` | POST | Register new user |
| `https://forts.application.api.ajinkya.codes/auth/login` | POST | Login user |
| `https://forts.application.api.ajinkya.codes/forts` | GET | List all forts |
| `https://forts.application.api.ajinkya.codes/forts` | POST | Create fort |
| `https://forts.application.api.ajinkya.codes/forts/:id` | GET | Get fort details |
| `https://forts.application.api.ajinkya.codes/forts/:id` | PUT | Update fort |
| `https://forts.application.api.ajinkya.codes/forts/:id` | DELETE | Delete fort |

---

## SSL/TLS Certificate Setup

### Using Let's Encrypt (Recommended)

1. **Install Certbot**
```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

2. **Generate Certificate**
```bash
sudo certbot certonly --standalone -d forts.ajinkya.codes -d forts.application.api.ajinkya.codes
```

3. **Auto-renew**
```bash
sudo certbot renew --dry-run
```

Certificate files will be at:
- Fullchain: `/etc/letsencrypt/live/forts.ajinkya.codes/fullchain.pem`
- Private Key: `/etc/letsencrypt/live/forts.ajinkya.codes/privkey.pem`

---

## CORS Configuration

The backend now supports CORS with your production domain:

```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

**Allowed Origins:**
- Development: `http://localhost:3000`
- Production: `https://forts.ajinkya.codes`

---

## Deployment Checklist

- [ ] DNS records created and pointing to 80.225.192.233
- [ ] SSL certificate generated via Let's Encrypt
- [ ] Nginx configuration deployed
- [ ] Backend .env.production file configured
- [ ] Frontend built and deployed to `/var/www/forts-tracker/frontend/dist`
- [ ] MongoDB Atlas connection verified
- [ ] Backend server running on port 5000
- [ ] Nginx proxy verified working
- [ ] HTTPS redirect working (http → https)
- [ ] Application accessible at https://forts.ajinkya.codes
- [ ] API accessible at https://forts.application.api.ajinkya.codes

---

## Quick Commands

### Deploy to Production

```bash
# 1. Update backend environment
cp backend/.env.production backend/.env

# 2. Build frontend
cd frontend && npm run build

# 3. Copy to web directory
sudo mkdir -p /var/www/forts-tracker
sudo cp -r frontend/dist /var/www/forts-tracker/
sudo cp -r backend /var/www/forts-tracker/

# 4. Setup Nginx
sudo cp nginx-forts-app.conf /etc/nginx/sites-available/forts-app
sudo ln -s /etc/nginx/sites-available/forts-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 5. Start backend with PM2
pm2 start backend/server.js --name "forts-api"
pm2 save
```

### Monitor

```bash
# Check Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/access.log

# Check Backend
pm2 list
pm2 logs forts-api

# Check SSL Certificate
sudo certbot certificates
```

---

## Troubleshooting

### DNS Not Resolving
```bash
nslookup forts.ajinkya.codes
# Should return: 80.225.192.233
```

### SSL Certificate Issues
```bash
sudo certbot renew --dry-run
sudo systemctl restart nginx
```

### Backend Connection Issues
```bash
curl https://forts.application.api.ajinkya.codes/health
# Should return API response
```

### CORS Errors
Check that `CORS_ORIGIN` in `.env.production` matches your frontend domain.

---

## Security Notes

1. **Change JWT_SECRET** - Use a strong, random string for production
2. **Enable Firewall** - Only allow ports 80, 443, and SSH
3. **Database Whitelisting** - Add Oracle server IP to MongoDB Atlas IP whitelist
4. **Regular Updates** - Keep Node.js, dependencies, and OS updated
5. **Monitor Logs** - Regularly review Nginx and application logs

---

## Next Steps

1. Ensure DNS entries are fully propagated
2. Generate SSL certificate with Let's Encrypt
3. Deploy to Oracle server following the deployment guide
4. Verify both domains work with HTTPS
5. Monitor application for any issues

**Your application is now configured for production deployment! 🚀**
