import User from '../models/User.js'
import jwt from 'jsonwebtoken'

export const checkUser = async (req,res,next) => {
    const token = req.cookies.jwt; 
    if (token) {
        jwt.verify(token, "CheckingForOwner", async(error, decodedToken) => {
            if (error) {
                res.json({status: false})
                next(); 
            } else {
                console.log("verified")
                const user = await User.findByPk(decodedToken.userId); 
                if (user.role === "owner") {
                    console.log("welcome")
                    res.json({name: user.name, status: true, user: user.email, role: "owner", userId : decodedToken.userId})
                    next(); 
                } else {res.json({status: false})}
            }
        }) 
    } else {
        res.json({
            status: false,
            message: "no cookie"
        })
    }
}
    
export const checkOwner = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ status: false, message: "Unauthorized: No token provided" });
        }

        jwt.verify(token, "CheckingForOwner", async (error, decodedToken) => {
            if (error) {
                return res.status(403).json({ status: false, message: "Invalid token" });
            }

            const user = await User.findByPk(decodedToken.userId);
            if (!user || user.role !== "owner") {
                return res.status(403).json({ status: false, message: "Access denied: Not an owner" });
            }
            next(); 
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
};

    
