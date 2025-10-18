require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');

const setAdmin = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return;
        }

        user.isAdmin = 1;
        await user.save();
        console.log(`User ${email} is now an admin`);

        mongoose.connection.close();
    } catch (error) {
        console.error('Error setting admin:', error);
        mongoose.connection.close();
    }
};

// Usage: node setAdmin.js <email>
const email = process.argv[2];
if (!email) {
    console.log('Usage: node setAdmin.js <email>');
    process.exit(1);
}

setAdmin(email);
