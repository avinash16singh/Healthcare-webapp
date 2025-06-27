import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../models/UserModel.js";

// SIGN IN
export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordMatch = await bcryptjs.compare(password, existingUser.password);
        if (!isPasswordMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id, role: existingUser.role },
            process.env.JWT_SECRET || 'test',
            { expiresIn: "1h" }
        );

        res.status(200).json({ user: existingUser, token });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// SIGN UP
export const signup = async (req, res) => {
    const { name, email, password, cpassword, phone, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        if (password !== cpassword) return res.status(400).json({ message: "Passwords do not match" });

        const hashPassword = await bcryptjs.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            phone,
            role
        });

        const token = jwt.sign(
            { email: user.email, id: user._id, role: user.role },
            process.env.JWT_SECRET || 'test',
            { expiresIn: "1h" }
        );

        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
