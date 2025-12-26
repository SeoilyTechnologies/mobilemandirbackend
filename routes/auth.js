const router = require("express").Router();
//const upload = require("../utils/multer");
const upload = require("../utils/s3Upload");

const {
  registerUser,
  verifyOtp,
  loginUser,
  forgotPassword, resetPassword,verifyForgotOtp
} = require("../controllers/authController");

// REGISTER
router.post("/register", upload.single("profile_image"), registerUser);

// VERIFY OTP
router.post("/verify-otp", verifyOtp);

// LOGIN
router.post("/login", loginUser);

//forget password
router.post("/forgot-password", forgotPassword);

// VERIFY OTP
router.post("/verify-forget-otp", verifyForgotOtp);

//reset password
router.post("/reset-password", resetPassword);

module.exports = router;
