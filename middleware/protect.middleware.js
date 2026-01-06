// const jwt = require("jsonwebtoken");


const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // adjust path

module.exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.Insurance_Token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // ✅ REAL USER OBJECT
    next();

  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
