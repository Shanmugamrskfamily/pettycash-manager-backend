const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const loginController = require('../Controllers/userController');
const resetPasswordController = require('../Controllers/userController');
const resetPasswordUpdateController = require('../Controllers/userController');
const avatarController = require('../Controllers/userController');

// User Routes
router.post('/signup', userController.signup);
router.post('/verifyEmail', userController.verifyEmail);
router.post('/login', loginController.login);
router.post('/sendPasswordResetLink', resetPasswordController.sendPasswordResetLink);
router.post('/resetPassword', resetPasswordUpdateController.setNewPassword);
router.get('/avatars', avatarController.getAllAvatars);

module.exports = router;