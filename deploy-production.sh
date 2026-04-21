#!/bin/bash

# Forts Tracker - Production Deployment Script
# This script builds and deploys the application to production

set -e

echo "🚀 Forts Tracker - Production Deployment Script"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAINS="forts.ajinkya.codes forts.application.api.ajinkya.codes"
SERVER_IP="80.225.192.233"
DEPLOY_USER="ajinkya"
DEPLOY_PATH="/home/ajinkya/forts-tracker"
WEB_ROOT="/var/www/forts-tracker"

# Step 1: Build Frontend
echo -e "${YELLOW}Step 1: Building React Frontend...${NC}"
cd frontend
npm install
npm run build
echo -e "${GREEN}✅ Frontend built successfully${NC}"
cd ..

# Step 2: Prepare Backend
echo -e "${YELLOW}Step 2: Preparing Backend...${NC}"
cd backend
npm install
echo -e "${GREEN}✅ Backend prepared${NC}"
cd ..

# Step 3: Create Deployment Package
echo -e "${YELLOW}Step 3: Creating deployment package...${NC}"
mkdir -p deploy-package
cp -r frontend/dist deploy-package/
cp -r backend deploy-package/
cp nginx-forts-app.conf deploy-package/
cp .env.example deploy-package/backend/.env.example
echo -e "${GREEN}✅ Deployment package created${NC}"

# Step 4: Display Deployment Instructions
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ BUILD SUCCESSFUL${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📦 Deployment Package Ready:"
echo "   Location: ./deploy-package/"
echo ""
echo "📋 Next Steps for Server Deployment:"
echo ""
echo "1. 📡 UPLOAD TO SERVER:"
echo "   scp -r deploy-package/* $DEPLOY_USER@$SERVER_IP:$DEPLOY_PATH/"
echo ""
echo "2. 🔗 CONNECT TO SERVER:"
echo "   ssh $DEPLOY_USER@$SERVER_IP"
echo ""
echo "3. 📂 SETUP WEB DIRECTORY:"
echo "   sudo mkdir -p $WEB_ROOT"
echo "   sudo chown $DEPLOY_USER:$DEPLOY_USER $WEB_ROOT"
echo "   cd $DEPLOY_PATH"
echo "   cp -r dist/* $WEB_ROOT/"
echo ""
echo "4. 🔧 CONFIGURE BACKEND:"
echo "   cd $WEB_ROOT/backend"
echo "   cp .env.example .env"
echo "   # Edit .env with production values"
echo "   nano .env"
echo ""
echo "5. 🔐 SETUP SSL CERTIFICATE:"
echo "   sudo certbot certonly --standalone -d forts.ajinkya.codes -d forts.application.api.ajinkya.codes"
echo ""
echo "6. ⚙️  SETUP NGINX:"
echo "   sudo cp $DEPLOY_PATH/nginx-forts-app.conf /etc/nginx/sites-available/forts-app"
echo "   sudo ln -s /etc/nginx/sites-available/forts-app /etc/nginx/sites-enabled/"
echo "   sudo nginx -t"
echo "   sudo systemctl restart nginx"
echo ""
echo "7. 🚀 START BACKEND WITH PM2:"
echo "   pm2 start $WEB_ROOT/backend/server.js --name 'forts-api'"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "8. ✅ VERIFY:"
echo "   curl https://forts.ajinkya.codes"
echo ""
echo -e "${YELLOW}Domain Configuration:${NC}"
echo "   Frontend: https://forts.ajinkya.codes"
echo "   API:      https://forts.application.api.ajinkya.codes"
echo "   IP:       $SERVER_IP"
echo ""
echo -e "${GREEN}All domains must point to: $SERVER_IP${NC}"
echo ""
