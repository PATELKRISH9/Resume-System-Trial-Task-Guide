const User = require('../models/user.model');
const Resume = require('../models/resume.model');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const toggleAdminStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isAdmin } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.isAdmin = isAdmin;
        await user.save();

        const { password, ...userWithoutPassword } = user._doc;
        res.status(200).json({ success: true, message: `User admin status updated to ${isAdmin}`, user: userWithoutPassword });
    } catch (error) {
        console.error("Error in toggleAdminStatus:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find().populate('userId', 'name email username');
        res.status(200).json({ success: true, resumes });
    } catch (error) {
        console.error("Error in getAllResumes:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const toggleResumeVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const { verified } = req.body;

        const resume = await Resume.findById(id);
        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found" });
        }

        resume.verified = verified;
        await resume.save();

        res.status(200).json({ success: true, message: `Resume verification status updated to ${verified}`, resume });
    } catch (error) {
        console.error("Error in toggleResumeVerification:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;
        await Resume.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Resume deleted successfully" });
    } catch (error) {
        console.error("Error in deleteResume:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    toggleAdminStatus,
    getAllResumes,
    toggleResumeVerification,
    deleteResume
};
