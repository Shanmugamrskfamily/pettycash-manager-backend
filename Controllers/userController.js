//userController.js
const User = require('../Models/userModel');
const avatar = require('../Models/avatarModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const EMAIL = process.env.E_MAIL;
const E_PASS = process.env.E_PASS;
const SECRET_KEY = process.env.SECRET_KEY;

exports.signup = async (req, res) => {
  try {
    const { name, mobileNumber, email, password, avatar } = req.body;

    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate an email verification token
    const emailVerificationToken = crypto.randomBytes(4).toString('hex');

    const user = new User({
      name,
      mobileNumber,
      email,
      avatar,
      password: hashedPassword,
      emailVerificationToken,
      emailVerified: false, // Mark the email as unverified
    });

    await user.save();
    // Send an email with the verification link
    const verificationOtp = emailVerificationToken;

    const transporter = nodemailer.createTransport({
      service: 'Outlook',
      auth: {
        user: EMAIL,
        pass: E_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: user.email,
      subject: 'Pettycash Manager-Signup Email Verification OTP',
      html: `
        <h2>Pettycash Manager</h2>
        <h4><b>Dear ${user.name},</b></h4>
        <p>Welcome to our family 😍,</p>
        <p>Your Email Verification OTP is: <b>${verificationOtp}</b></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "User registered successfully. Please verify your email.", emailVerificationToken, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};

exports.getAllAvatars = async (req, res) => {
    try {
      // Fetch all avatar details from the database
      const avatars = await avatar.find();
  
      res.status(200).json({ avatars });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong.', error });
    }
  };

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    // Find the user by the provided email verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerified: false, // Check if the email is not verified yet
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token.', });
    }
    // Update the user's email verification status
    user.emailVerified = true;
    user.emailVerificationToken = undefined; // Clear the verification token
    await user.save();

    const transporterVerified = nodemailer.createTransport({
      service: 'Outlook',
      auth: {
        user: EMAIL,
        pass: E_PASS,
      },
    });

    const mailOptionsVerified = {
      from: EMAIL,
      to: user.email,
      subject: `Pettycash Manager - Email Verified`,
      html: `
        <h2>Pettycash Manager</h2>
        <h4>Dear <b>${user.name},</b></h4>
        <p>Your email has been successfully verified ✅.</p>
      `,
    };

    await transporterVerified.sendMail(mailOptionsVerified);

    res.status(200).json({ message: 'Email verification successful. Confirmation Mail Sent!' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user with the provided email exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed. User not found.' });
      }
  
      // Check if the user's email is verified
      if (!user.emailVerified) {
        return res.status(401).json({ message: 'Authentication failed. Email not verified.' });
      }
  
      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Authentication failed. Invalid password.' });
      }
  
      // Create a JWT token
      const token = jwt.sign({ userId: user._id }, SECRET_KEY);
      user.jwtToken=token;
      await user.save();
      const userName = user.name;
      const avatar = user.avatar;
      res.status(200).json({ message: 'User Successfully Authenticated!', token, userId: user._id, userName, avatar });
    } catch (error) {
      res.status(500).json({ message: `Authentication failed. ${error.message}` });
    }
  };

exports.sendPasswordResetLink = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      const otp = crypto.randomBytes(4).toString('hex');
      user.emailVerificationToken = otp;
      
      await user.save();
  
      const transporter = nodemailer.createTransport({
        service: 'Outlook',
        auth: {
          user: EMAIL,
          pass: E_PASS,
        },
      });
  
      const mailOptions = {
        from: EMAIL, 
        to: user.email,
        subject: 'RSK Pettycash Manager-Password Reset OTP',
        html: `
        <h4>Hello ${user.name},</h4>
          <p> Below is Your OTP To reset your password for your Account 👇🏻:</p>
          <b>${otp}</b>
        `,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'Password reset link sent to your email.',otp });
    } 
    catch (error) 
    {
      res.status(500).json({ message: 'Something went wrong.',error: error.message });
    }
  };

exports.setNewPassword = async (req, res) => {
    try {
      const { otp, newPassword  } = req.body;
      const user = await User.findOne({
        emailVerificationToken: otp
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token.' });
      }
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  console.log(hashedPassword);
      // Update the user's password
      user.password = hashedPassword;
  
      // Clear the emailVerificationToken fields
      user.emailVerificationToken = undefined;
      // Save the updated user document
      await user.save();
      const transporter = nodemailer.createTransport({
        service: 'Outlook',
        auth: {
          user: EMAIL,
          pass: E_PASS,
        },
      });
  
      const mailOptions = {
        from: EMAIL, 
        to: user.email,
        subject: 'RSK Pettycash Manager - Password Change Confirmation',
        html: `
        <h4>Dear ${user.name},</h4>
        <p>As per your request Your <b style="color:green">Password has been changed successfully!</b></p>
        <p>Your Email ID: ${user.email}</p>
        <p>Your New Passwordd is: <b style="color:green">${newPassword}</b></p>
        `,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'Password reset and update successful, Confirmation email sent.' });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong.' });
    }
  };
  