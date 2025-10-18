const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Import User model

const signupValidation =(req, res, next)=>{
    const schema =Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(4).max(100).required(),
    });
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400)
        .json({message: "Bad request", error});
    }
    next();
}


const loginValidation =(req, res, next)=>{
    const schema =Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(4).max(100).required(),
    });
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400)
        .json({message: "Bad request", error});
    }
    next();
}

const verifyTokenAndAdmin = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;

        const user = await User.findById(req.user._id); // Assuming '_id' is stored in the token
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Access denied, not an admin' });
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = {
    signupValidation,
    loginValidation,
    verifyTokenAndAdmin
}
