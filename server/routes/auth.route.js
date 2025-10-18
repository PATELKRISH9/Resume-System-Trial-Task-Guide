const express = require('express');
const { signup, login, googleSignIn } = require('../controllers/auth.controller');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

const router = express.Router();

// Login route
router.post('/login', loginValidation, login);

// Signup route (lowercase to match frontend)
router.post('/signup', signupValidation, signup);

// Google Sign-In route
router.post('/google-sign-in', googleSignIn);

module.exports = router;
