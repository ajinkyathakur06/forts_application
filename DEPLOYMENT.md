# Forts Tracker - Deployment Guide for Oracle Always Free Server

## Project Structure

```
forts/
├── backend/
│   ├── server.js           # Express API server
│   ├── package.json        # Backend dependencies
│   ├── .env               # Environment variables (not in git)
│   └── .gitignore
├── frontend/
│   ├── src/               # React components
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── dist/              # Built frontend (production)
├── nginx-forts-app.conf   # Nginx configuration
└── README.md
```

## Prerequisites

- Node.js 16+ and npm
- MongoDB Atlas account (or local MongoDB)
- Oracle Always Free VM instance (or any Linux server)
- Nginx web server
- SSL certificates (Let's Encrypt recommended)

## Environment Variables

### Backend (.env)

```env
# MongoDB connection string
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/forts_app?retryWrites=true&w=majority

# JWT secret key (change this to something random and secure)
JWT_SECRET=your_super_secret_jwt_key_12345_change_this_in_production_use_random_string

# Server port
PORT=5000

# Environment
NODE_ENV=production
```

## Local Development Setup

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:3000`

## Production Build

### 1. Build Frontend

```bash
cd frontend
npm run build
```

Creates optimized build in `frontend/dist/`

### 2. Start Backend

```bash
cd backend
NODE_ENV=production npm start
```

## Nginx Configuration

### 1. Copy nginx config to system

```bash
sudo cp nginx-forts-app.conf /etc/nginx/sites-available/forts-tracker
sudo ln -s /etc/nginx/sites-available/forts-tracker /etc/nginx/sites-enabled/
```

### 2. Test nginx configuration

```bash
sudo nginx -t
```

### 3. Start/Reload nginx

```bash
sudo systemctl start nginx
sudo systemctl reload nginx
```

## SSL Setup with Let's Encrypt (Recommended)

### 1. Install Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### 2. Get SSL certificate

```bash
sudo certbot certonly --nginx -d your-domain.com
```

### 3. Update nginx config with SSL paths

```nginx
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privatekey.pem;
```

### 4. Reload nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Auto-renew certificates (cron job)

```bash
sudo certbot renew --quiet
sudo systemctl reload nginx
```

## Oracle Always Free Server Specific Steps

### 1. Security Groups / Firewall

Allow inbound traffic on:
- Port 80 (HTTP)
- Port 443 (HTTPS)
- Port 22 (SSH)

### 2. Deployment Steps

```bash
# SSH into your server
ssh -i your-key.key ubuntu@your-oracle-ip

# Clone or upload your repository
git clone <repo-url> or upload files

# Navigate to project
cd /var/www/forts-tracker  # or your desired path

# Install Node.js if not present
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Start backend with PM2
cd backend
npm install
pm2 start "npm start" --name "forts-backend"
pm2 startup
pm2 save
cd ..

# Configure and start nginx
sudo cp nginx-forts-app.conf /etc/nginx/sites-available/forts-tracker
sudo ln -s /etc/nginx/sites-available/forts-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl start nginx
```

### 3. Update frontend API endpoint (if using domain)

In `frontend/src/AuthContext.jsx`, update the API base URL:

```javascript
// Change from:
const res = await fetch(`http://localhost:5000${path}`, {

// To:
const res = await fetch(`https://your-domain.com${path}`, {
```

Rebuild frontend after making this change.

## Database Backups

### Manual Backup from MongoDB Atlas

```bash
# Export data
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/forts_app" --out=/backups/forts

# Restore data
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/forts_app" /backups/forts
```

## Monitoring & Logs

### Check backend logs (with PM2)

```bash
pm2 logs forts-backend
```

### Check nginx logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Security Best Practices

1. **Never commit .env file** - Use `.gitignore`
2. **Use strong JWT_SECRET** - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. **Enable HTTPS** - Use Let's Encrypt SSL
4. **Set secure MongoDB** - Enable IP whitelist in Atlas
5. **Keep dependencies updated** - Run `npm audit` regularly
6. **Use firewall rules** - Only allow necessary ports
7. **Regular backups** - Backup database regularly

## Troubleshooting

### Backend not starting

```bash
# Check if port 5000 is in use
sudo lsof -i :5000

# Check MongoDB connection
npm start  # see error messages
```

### Frontend not connecting to backend

- Check CORS is enabled in `backend/server.js`
- Verify backend is running
- Check network tab in browser DevTools
- Ensure API endpoint URL is correct

### Nginx reverse proxy issues

```bash
# Test nginx config
sudo nginx -t

# Check nginx status
sudo systemctl status nginx

# View nginx error log
sudo tail -f /var/log/nginx/error.log
```

## Updating the Application

```bash
# Pull latest changes
git pull origin main

# Update frontend
cd frontend
npm install
npm run build

# Update backend (if changes)
cd ../backend
npm install

# Restart backend with PM2
pm2 restart forts-backend

# Reload nginx
sudo systemctl reload nginx
```

## Support & Customization

For questions or modifications:
- Check error logs first
- Verify environment variables
- Test locally before deploying
- Check browser DevTools console for client-side errors
