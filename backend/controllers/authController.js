 
import jwt from 'jsonwebtoken'
import User from "../models/User.js"; 
import bcrypt from "bcryptjs";


export const login = async(req,res,next) => {
    try {
        const {email,password} = req.body; 
        const user = await User.findOne({ where: {email} }); 
        if (!user) return res.status(400).json({ message: "User does not exist" });
        const isMatch = await bcrypt.compare(password , user.password); 
        if (!isMatch) return res.status(400).json({message: "Invalid Credentials"}); 

        const token = jwt.sign(
            { userId: user.id, role: user.role }, // including role such that i can decrypt token anytime and check for owner-only functions
            process.env.JWT_SECRET, // JWT PASSWORD IS "CheckingForOwner"
            { expiresIn: "1d" }
        );

        res.cookie("jwt", token, {
            httpOnly: true, 
            maxAge: 60*60*24*1000,
            sameSite: "none",
            secure: true
        })
        res.json({ token, role: user.role}); 
    } catch(error) {
        console.log("error", error.message)
    }
}


export const register = async (req, res) => {
    try {
        const { name, email, password, isOwner } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = isOwner ? "owner" : "user"; // Assign role based on checkbox

        // Create user in PostgreSQL using Sequelize
        await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
