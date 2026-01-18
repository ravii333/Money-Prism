import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }
        const user = await User.create({ email, password });
        if (user) {
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: { _id: user._id, email: user.email, token: generateToken(user._id) }
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error during registration.' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                message: 'Login successful',
                data: { _id: user._id, email: user.email, token: generateToken(user._id) }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error during login.' });
    }
};