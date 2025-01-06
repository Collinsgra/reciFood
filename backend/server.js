const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const blogRoutes = require('./routes/blogs');

const app = express();

// Updated CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://reci-food-client.vercel.app', 'https://reci-food-client.vercel.app/'] // Note: Added both with and without trailing slash
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add root route handler
app.get('/', (req, res) => {
  res.json({ 
    message: 'ReciFOOD API is running',
    endpoints: {
      auth: '/api/auth',
      recipes: '/api/recipes',
      users: '/api/users',
      contact: '/api/contact',
      admin: '/api/admin',
      blogs: '/api/blogs'
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 errors - This should come after all other routes
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method,
    availableEndpoints: {
      auth: '/api/auth',
      recipes: '/api/recipes',
      users: '/api/users',
      contact: '/api/contact',
      admin: '/api/admin',
      blogs: '/api/blogs'
    }
  });
});

// Export the Express API
module.exports = app;

// Only listen if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}