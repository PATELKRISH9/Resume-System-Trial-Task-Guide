const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { hashPassword } = require('../utils/authHelper');

// Google Sign-In
const googleSignIn = async (req, res) => {
    try {
        const { email, username, avatar } = req.body;

        if (!email || !username || !avatar) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        let user = await User.findOne({ email });
        let isNewUser = false;

        if (!user) {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await hashPassword(generatedPassword);

            user = new User({
                name: username,
                username: username.split(" ").join("").toLowerCase(),
                email,
                password: hashedPassword,
                avatar,
                isAdmin: false
            });

            await user.save();
            isNewUser = true;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        const { password, ...userData } = user._doc;
        const userWithToken = { ...userData, token };

        return res.status(200).json({
            success: true,
            user: userWithToken,
            message: isNewUser ? "New user created successfully!" : "Login successful!"
        });
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Traditional Signup
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email, and password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists with that email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isAdmin: false
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            isAdmin: newUser.isAdmin
        });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Traditional Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({ success: false, message: "Auth failed, email or password is wrong" });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ success: false, message: "Auth failed, email or password is wrong" });
        }

        const jwtToken = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            jwtToken,
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    googleSignIn,
    signup,
    login
};
