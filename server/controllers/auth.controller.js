const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { hashPassword } = require('../utils/authHelper');

// Google Sign-In
const googleSignIn = async (req, res) => {
    try {
        console.log("googleSignIn function called. Request body:", req.body);

        if (!req.body.email || !req.body.username || !req.body.avatar) {
            console.log("Missing required fields in request body.");
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if user already exists
        console.log("Searching for user with email:", req.body.email);
        let user = await User.findOne({ email: req.body.email });
        let isNewUser = false;

        if (!user) {
            console.log("User not found. Creating new user.");
            // If user doesn't exist, create a new one
            const generatedPassword = Math.random().toString(36).slice(-8);
            console.log("Generated password:", generatedPassword);
            const hashedPassword = await hashPassword(generatedPassword);
            console.log("Hashed password generated.");

            user = new User({
                name: req.body.username, // Add name field
                username: req.body.username.split(" ").join("").toLowerCase(),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.avatar,
                isAdmin: false // Default to false
            });

            console.log("New user object created:", user);
            await user.save();
            console.log("New user saved to database.");
            isNewUser = true;
        } else {
            console.log("User found:", user.email);
        }

        // Generate JWT token
        console.log("Generating JWT token for user ID:", user._id);
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        console.log("JWT token generated.");

        // Remove sensitive data from the response
        const { password, ...rest } = user._doc;
        const userWithToken = { ...rest, token, isAdmin: user.isAdmin, name: user.name, username: user.username, email: user.email, avatar: user.avatar };

        // Send response
        if (isNewUser) {
            console.log("New user created successfully. Sending response.");
            return res.status(200).json({ user: userWithToken, message: "New user created successfully!" });
        } else {
            console.log("Login successful for existing user. Sending response.");
            return res.status(200).json({ user: userWithToken, message: "Login Successful!" });
        }
    } catch (error) {
        console.error("Error in googleSignIn:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// Traditional Signup
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "User already exists with that email", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isAdmin: false // Default to false, can be set via database or admin panel
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", success: true, isAdmin: newUser.isAdmin });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Traditional Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const errorMsg = "Auth failed, email or password is wrong";

        if (!user) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const jwtToken = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            _id: user._id,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

module.exports = {
    googleSignIn,
    signup,
    login
};
