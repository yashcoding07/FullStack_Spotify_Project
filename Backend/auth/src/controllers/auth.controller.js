import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import _config from '../config/config.js';

export async function register(req, res){
    const {email, password, fullName: { firstName, lastName }} = req.body;

    const isUserAlreadyExists = await userModel.findOne({email});

    if(isUserAlreadyExists){
        return res.status(400).json({message: "User already exists."});
    };

    const hash = await bcryptjs.hash(password, 10);

    const user = await userModel.create({
        email,
        password: hash,
        fullName: {
            firstName,
            lastName
        }
    });

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, _config.JWT_SECRET, { expiresIn: "2d" });

    res.cookie("token", token);

    res.status(201).json({
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        }
    });
};

