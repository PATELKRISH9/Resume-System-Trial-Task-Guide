const express = require('express');
const { verifyTokenAndAdmin } = require('../Middlewares/AuthValidation');
const { getAllUsers, deleteUser, toggleAdminStatus, getAllResumes, toggleResumeVerification, deleteResume } = require('../controllers/admin.controller');

const router = express.Router();

// User management routes
router.get('/users', verifyTokenAndAdmin, getAllUsers);
router.delete('/users/:id', verifyTokenAndAdmin, deleteUser);
router.put('/users/:id/toggle-admin', verifyTokenAndAdmin, toggleAdminStatus);

// Resume management routes
router.get('/resumes', verifyTokenAndAdmin, getAllResumes);
router.put('/resumes/:id/toggle-verification', verifyTokenAndAdmin, toggleResumeVerification);
router.delete('/resumes/:id', verifyTokenAndAdmin, deleteResume);

module.exports = router;
