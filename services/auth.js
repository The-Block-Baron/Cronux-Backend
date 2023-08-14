import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()


export const register = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' })
    }

    const user = new User({
        username,
        email,
        password,
    });

    try {
        const savedUser = await user.save()
        const userForToken = {
            id: savedUser._id,
            username: savedUser.username, 
        }
        const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(201).json({ user: savedUser, token })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({email})
    if(!user) {
        res.status(400).json({message: 'User not found'})
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect) {
        res.status(400).json({message: 'Invalid Password'})
    }

    const userForToken = {
        id: user._id,
        username: user.username
    }

    const token = jwt.sign(userForToken, process.env.JWT_SECRET, {expiresIn:'1h'})

    res.status(200).json({user, token})
    console.log('Login successful')

}