const jwt = require("jsonwebtoken");
const User = require("../models/NewsUser");

exports.protect = async (req,res,next) => {
    try{
        const token = req.cookies?.token;
        if(!token) return res.status(401).json({ message: "Not authorized, no token" });

        const decoded = jwt.verify(token,"pavab112inw");

        req.user = await User.findById(decoded.id).select("-password");
        next();
    }
    catch(err){
        console.error(err);
    res.status(401).json({ message: "Token invalid or expired" });
    }
}