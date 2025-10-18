// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth.route');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));

// Debug logs to confirm env variables are loaded
console.log('Server starting...');
console.log('PORT from env:', process.env.PORT);
console.log('CLIENT_URL from env:', process.env.CLIENT_URL);
console.log('MONGO_URI from env:', process.env.MONGO_URI);

// Mount routes
app.use('/api/auth', authRoutes); // ✅ Add this line

// Default route for sanity check
app.get('/', (req, res) => res.send('API is running'));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
});
