const User = require("../models/user");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../utils/sendOtpEmail");

// 🔹 REGISTER
// POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      username,
      date_of_birth,
      account_type,
      gender,
      language,
      isNotificationAllowed,
    } = req.body;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });

    // CASE 1 — New user (not found in DB)
    if (!existingUser) {
      const profileImagePath = req.file ? `/uploads/${req.file.filename}` : "";
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const newUser = new User({
        username,
        profile_image: profileImagePath,
        email,
        date_of_birth,
        gender,
        account_type: account_type || "email",
        language: language || "en",
        isNotificationAllowed:
          isNotificationAllowed !== undefined ? isNotificationAllowed : true,
        password: CryptoJs.AES.encrypt(
          password,
          process.env.PASSWORD_SEC
        ).toString(),
        otp,
        otpExpires: Date.now() + 1 * 60 * 1000, // OTP valid for 1 min
        isVerified: false,
      });

      await newUser.save();
      await sendOtpEmail(email, otp);

      return res.status(200).json({
        success: true,
        message: "User registered successfully. OTP sent to your email.",
        email: newUser.email,
        otp, // ⚠️ For testing only — remove in production
      });
    }

    // CASE 2 — User exists but not verified and OTP still valid
    if (!existingUser.isVerified) {
      if (existingUser.otpExpires && existingUser.otpExpires > Date.now()) {
        return res.status(200).json({
          success: true,
          message: "OTP already sent. Please verify your email.",
          email: existingUser.email,
          otp: existingUser.otp, // testing only
        });
      }

      // CASE 3 — OTP expired, resend new OTP
      if (!existingUser.otpExpires || existingUser.otpExpires < Date.now()) {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        existingUser.otp = newOtp;
        existingUser.otpExpires = Date.now() + 1 * 60 * 1000;
        await existingUser.save();
        await sendOtpEmail(email, newOtp);

        return res.status(200).json({
          success: true,
          message: "OTP expired earlier. A new OTP has been sent.",
          email: existingUser.email,
          otp: newOtp, // testing only
        });
      }
    }

    // CASE 4 — User already verified
    if (existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already registered. Please login.",
      });
    }
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 🔹 VERIFY OTP
// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // Check OTP & expiry
    if (user.otp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (user.otpExpires < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired" });

    // Mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const updated = await User.findByIdAndUpdate(
      user._id,
      { $inc: { tokenVersion: 1 } },
      { new: true }
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        id: updated._id,
        email: updated.email,
        tokenVersion: updated.tokenVersion,
      },
      process.env.JWT_SEC,
      { expiresIn: "7d" }
    );

    const { otpExpires, tokenVersion, otp: _, ...others } = user._doc;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: others,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 🔹 LOGIN
// POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account with OTP before login",
      });
    }

    const decryptedPass = CryptoJs.AES.decrypt(
      user.password,
      process.env.PASSWORD_SEC
    ).toString(CryptoJs.enc.Utf8);

    if (decryptedPass !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    const updated = await User.findByIdAndUpdate(
      user._id,
      { $inc: { tokenVersion: 1 } },
      { new: true }
    );

    const token = jwt.sign(
      {
        id: updated._id,
        email: updated.email,
        tokenVersion: updated.tokenVersion,
      },
      process.env.JWT_SEC,
      { expiresIn: "7d" }
    );

    const { password: _, otp, otpExpires, ...others } = user._doc;
    console.log("getting token in login ", token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: others,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};


// 🔹 FORGOT PASSWORD → Send OTP to email
// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ❌ If user is not verified → cannot use forget password
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Your account is not verified. Please verify using signup OTP.",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.forgotOtp = otp;
    user.forgotOtpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      email,
      otp, // ⚠️ remove in production
    });

  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};





//Verify OTP (Forgot Password)
exports.verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (user.forgotOtp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (user.forgotOtpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. Now reset your password.",
    });

  } catch (err) {
    console.error("Verify forgot OTP error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


//Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "email, otp, newPassword are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // OTP match?
    if (user.forgotOtp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (user.forgotOtpExpires < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired" });

    // Update password
    user.password = CryptoJs.AES.encrypt(
      newPassword,
      process.env.PASSWORD_SEC
    ).toString();

    // Clear OTP fields
    user.forgotOtp = null;
    user.forgotOtpExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please login.",
    });

  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

