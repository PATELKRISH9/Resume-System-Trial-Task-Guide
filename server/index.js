// Load environment variables first
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const resumeRoutes = require('./routes/resume.route');
const adminRoutes = require('./routes/admin.route');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware

// CORS configuration: allow both localhost for development and your deployed frontend
const allowedOrigins = [
  process.env.CLIENT_URL, // deployed frontend
  'http://localhost:3000', // frontend dev
  'http://localhost:3001', // alternate frontend dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin like mobile apps or curl
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());

// Debug logging for incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/data', resumeRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack || err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
