// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3001' }));

// Debug logs to confirm env variables are loaded
console.log('Server starting...');
console.log('PORT from env:', process.env.PORT);
console.log('CLIENT_URL from env:', process.env.CLIENT_URL);
console.log('MONGO_URI from env:', process.env.MONGO_URI);

// Set default port
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
