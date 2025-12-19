const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    console.log(" Authorization header:", authHeader);

    // Check for missing header
    if (!authHeader)
      return res.status(401).json({ message: 'No token provided' });

    // Clean and extract token (handles extra "Bearer" cases)
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    console.log("🔹 Extracted token:", token);

    if (!token)
      return res.status(401).json({ message: 'Token missing or malformed' });

    //  Verify token
    console.log("🔹 Using secret:", process.env.JWT_SEC);
    const payload = jwt.verify(token, process.env.JWT_SEC);
    console.log("✅ Decoded payload:", payload);

    // User ke token se id get krke token version get kiya aur jo token version token se mila and jo db se mila usko compare kiya
    const user = await User.findById(payload.id).select('tokenVersion');
    if (!user) return res.status(401).json({ message: 'User not found' });

    if (user.tokenVersion !== payload.tokenVersion)
      return res.status(401).json({ message: 'Session expired. Please login again.' });

    //  Attach user info to request
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

