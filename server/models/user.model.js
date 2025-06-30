import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'User Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
    },
    password:{
        type: String,
        required:true,
        minLength: 6,
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;