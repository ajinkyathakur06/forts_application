require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI || !JWT_SECRET) {
  console.error('❌ Missing required environment variables: MONGO_URI and JWT_SECRET');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  }
}, { timestamps: true });

const fortSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  height: {
    type: Number,
    default: null
  },
  visited: {
    type: Boolean,
    default: false
  },
  visitedDate: {
    type: Date,
    default: null
  },
  photoLinks: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Fort = mongoose.model('Fort', fortSchema);

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

app.get('/', (req, res) => {
  res.json({ message: 'Forts Tracker API is running' });
});

app.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Registered successfully',
      token,
      user: { id: user._id, username: user.username }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get all forts for logged-in user
app.get('/forts', auth, async (req, res) => {
  try {
    const forts = await Fort.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json(forts);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch forts', error: error.message });
  }
});

// Get single fort by ID
app.get('/forts/:id', auth, async (req, res) => {
  try {
    const fort = await Fort.findOne({ _id: req.params.id, userId: req.userId });
    if (!fort) {
      return res.status(404).json({ message: 'Fort not found' });
    }
    return res.json(fort);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch fort', error: error.message });
  }
});

// Create new fort
app.post('/forts', auth, async (req, res) => {
  try {
    const { name, location, height, visited, photoLinks, description, notes } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: 'Fort name and location are required' });
    }

    const fort = await Fort.create({
      userId: req.userId,
      name,
      location,
      height: height || null,
      visited: !!visited,
      visitedDate: visited ? new Date() : null,
      photoLinks: photoLinks || [],
      description: description || '',
      notes: notes || ''
    });

    return res.status(201).json(fort);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create fort', error: error.message });
  }
});

// Update fort
app.put('/forts/:id', auth, async (req, res) => {
  try {
    const { visited } = req.body;
    
    const updateData = { ...req.body };
    if (visited !== undefined) {
      updateData.visitedDate = visited ? new Date() : null;
    }

    const updated = await Fort.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Fort not found' });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update fort', error: error.message });
  }
});

// Delete fort
app.delete('/forts/:id', auth, async (req, res) => {
  try {
    const deleted = await Fort.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!deleted) {
      return res.status(404).json({ message: 'Fort not found' });
    }

    return res.json({ message: 'Fort deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete fort', error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


