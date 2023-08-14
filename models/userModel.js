import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema =  new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    projects: [{type: mongoose.Schema.Types.ObjectId, ref:'Project'}],
    colorPalette: String
})

userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }

    next()
})

const User = mongoose.model('User', userSchema)