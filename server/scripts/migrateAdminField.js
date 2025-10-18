require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');

const migrateAdminField = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Update all users where isAdmin is not set (undefined) to 0
        const result = await User.updateMany(
            { isAdmin: { $exists: false } },
            { $set: { isAdmin: 0 } }
        );

        console.log(`Updated ${result.modifiedCount} users to have isAdmin: false`);

        mongoose.connection.close();
    } catch (error) {
        console.error('Error migrating admin field:', error);
        mongoose.connection.close();
    }
};

migrateAdminField();
