const { default: mongoose } = require('mongoose');


// Define User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false,
      trim: true, // Removes whitespace from both ends
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, //  email is stored in lowercase
      match: [/.+@.+\..+/, 'Please enter a valid email address'], //  email validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    date_of_birth: {
      type: String,
      required: true,
    },
    profile_image: {
      type: String,
      default: '',
    },
    account_type: {
      type: String,
      default: 'email',
      enum: ['email', 'google', 'facebook', 'apple'], // limit allowed values
    },
    language: {
      type: String,
      default: 'en', // default language
      enum: ['en', 'hi', 'pa'], //restrict to supported languages
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    location: {
      type: String,
      required: false,

    },
    forgotOtp: {
      type: String,
      default: null,
    },
    forgotOtpExpires: {
      type: Date,
      default: null,
    },

    isNotificationAllowed: {
      type: Boolean,
      default: true,
    },

    
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Export model
module.exports = mongoose.model('User', userSchema);
