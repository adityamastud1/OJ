const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function ensureAuthenticated(req, res, next) {
  // ✅ Case 1: OAuth (passport session)
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // ✅ Case 2: JWT (token in Authorization header)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ message: "User not found" });

      req.user = user; // ✅ set user manually for downstream routes
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  // ❌ If neither session nor JWT present
  return res.status(401).json({ message: "Login required" });
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: admin only' });
}

module.exports = { ensureAuthenticated, ensureAdmin };
