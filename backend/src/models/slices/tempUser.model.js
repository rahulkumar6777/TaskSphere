import mongoose from "mongoose";

const tempuserschema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    createdAt: {
        type: Date,
        expires: 600,
        default: Date.now
    }
})

export const TempUser = mongoose.model('TempUser', tempuserschema)