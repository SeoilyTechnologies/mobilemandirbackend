// controllers/userController.js

const User = require("../models/user");
const CryptoJs = require("crypto-js");

// ✅ Helper: current request se token nikaal lo (Bearer <token>)
const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

// ✅ GET /api/user/profile  — get logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // verifyToken se aaya

    const user = await User.findById(userId).select("-password -otp -otpExpires");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const token = getTokenFromRequest(req);

    // login jaisa response
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      token: token,       // jo already client ke पास है, बस वापस भेज रहे हैं
      user: user,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// ✅ POST /api/user/updateprofile — update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // verifyToken se aaya

    // Step 1: Check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Step 2: Check verification
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "User not verified. Please verify your account before updating.",
      });
    }

    // Step 3: Password change (agar bheja ho to)
    if (req.body.password) {
      req.body.password = CryptoJs.AES.encrypt(
        req.body.password,
        process.env.PASSWORD_SEC
      ).toString();
    }

    // Step 4: Profile image (if file present from multer)
    if (req.file) {
      req.body.profile_image = req.file.location;
    }

    console.log(req.body );
    // Step 5: Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    ).select("-password -otp -otpExpires");

    const token = getTokenFromRequest(req);

    // login jaisa response
    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      token: token,      // same token वापस
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
