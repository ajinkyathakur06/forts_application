# 🏰 Forts Tracker App

A beautiful, mobile-first web application to track and manage forts you've visited or plan to visit. Features include authentication, photo galleries, and detailed fort information.

## Features

✅ **User Authentication**
- Secure login/register system
- JWT token-based authentication
- Password hashing with bcryptjs

🏰 **Fort Management**
- Add new forts with name, location, height, and photos
- Mark forts as visited or not visited
- View detailed information for each fort
- Add descriptions and notes to forts
- Photo gallery for each fort

📱 **Mobile-First UI**
- Responsive design optimized for phones
- Beautiful gradient theme (purple/indigo)
- Touch-friendly buttons and controls
- Stats dashboard showing visited/total forts

🔐 **Security**
- Environment variables for sensitive data
- Password encryption
- JWT token expiration
- User-specific data isolation

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB (Atlas)
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- React 18
- Vite (fast build tool)
- CSS3 (responsive design)
- Context API for state management

**Deployment:**
- Nginx reverse proxy
- Oracle Always Free Server compatible
- SSL/HTTPS ready

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- MongoDB Atlas account

### 1. Clone and Setup Environment

```bash
# Backend environment
cd backend
cp .env.example .env  # or create .env with your MongoDB URI
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

## Usage

1. **Register**: Create a new account with username and password
2. **Login**: Sign in with your credentials
3. **Add Fort**: Click the **+** button to add a new fort
   - Enter name and location (required)
   - Add height, description, notes (optional)
   - Add photo links (one per line)
4. **View Details**: Click any fort to see full details and photo gallery
5. **Mark Visited**: Check the checkbox to mark fort as visited
6. **Edit**: Click the edit icon (✏️) in detail view to update
7. **Delete**: Remove forts you no longer want to track

## Environment Variables

### Backend (.env)

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/forts_app
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

## Project Structure

```
forts/
├── backend/
│   ├── server.js           # Express API
│   ├── .env               # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main app with routing
│   │   ├── AuthScreen.jsx          # Login/Register
│   │   ├── FortsScreen.jsx         # Forts list
│   │   ├── FortDetail.jsx          # Detail & edit
│   │   ├── AddFortScreen.jsx       # Add new fort
│   │   └── AuthContext.jsx         # Auth state
│   ├── index.html
│   └── package.json
├── nginx-forts-app.conf    # Nginx config for production
├── DEPLOYMENT.md           # Deployment guide
└── README.md              # This file
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Forts (all require JWT token)
- `GET /forts` - Get all forts
- `GET /forts/:id` - Get specific fort
- `POST /forts` - Create new fort
- `PUT /forts/:id` - Update fort
- `DELETE /forts/:id` - Delete fort

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Quick Deploy to Oracle Free Server

```bash
# 1. Build frontend
cd frontend && npm run build && cd ..

# 2. Copy to server
scp -r . user@server:/var/www/forts-tracker/

# 3. On server:
cd /var/www/forts-tracker/backend
npm install
pm2 start "npm start" --name "forts-backend"

# 4. Configure nginx
sudo cp nginx-forts-app.conf /etc/nginx/sites-available/forts-tracker
sudo systemctl reload nginx
```

## Screenshots

### Login Screen
- Clean, modern design with gradient background
- Username and password inputs
- Toggle between login and register modes

### Forts List
- Display all forts with statistics
- Filter by visited/not visited status
- Thumbnail photos from first photo link
- Floating action button to add new fort

### Fort Details
- Full fort information display
- Photo gallery with all images
- Edit inline form
- Mark as visited checkbox
- Delete option

## Features Coming Soon

- 📍 Map view of forts
- 📸 Direct photo uploads
- 🗺️ Distance calculation
- 📊 Statistics dashboard
- 🔔 Notifications/reminders
- 📤 Export data as PDF/CSV

## Security Notes

⚠️ **Important**

- Never commit `.env` file
- Change `JWT_SECRET` in production to a random string
- Use HTTPS in production
- Enable MongoDB IP whitelist
- Keep dependencies updated with `npm audit`

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

**Frontend can't connect to backend?**
- Ensure backend is running on port 5000
- Check CORS is enabled
- Verify API endpoint in AuthContext.jsx

**MongoDB connection error?**
- Check MONGO_URI in .env
- Verify IP is whitelisted in MongoDB Atlas
- Check username and password

**App looks broken on mobile?**
- Clear browser cache
- Check device orientation
- Open DevTools for error messages

## License

Free to use and modify for personal projects.

## Support

For issues or questions:
1. Check error logs in browser console (F12)
2. Check backend logs with `npm start`
3. Review DEPLOYMENT.md for more details
4. Check nginx error logs: `/var/log/nginx/error.log`

---

**Happy fort tracking! 🏰**
