// userModel.js
const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  avatar:{type: String, default:"https://api.dicebear.com/7.x/thumbs/svg?seed=Mimi"},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailVerificationToken: String, 
  emailVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  jwtToken:{type: String}
});

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = resetToken;
    this.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // Token expires in 30 minutes
    return resetToken;
  };

module.exports = mongoose.model('User', userSchema);
