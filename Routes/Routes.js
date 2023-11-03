//Routes.js
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const capitalController = require('../Controllers/capitalController'); 
const expenseController = require('../Controllers/expenseController');

// User Routes
router.post('/signup', userController.signup);
router.post('/verifyEmail', userController.verifyEmail);
router.post('/login', userController.login);
router.post('/sendPasswordResetLink', userController.sendPasswordResetLink);
router.post('/resetPassword', userController.setNewPassword);
router.get('/avatars', userController.getAllAvatars);
router.get('/user/:userId', userController.getUserInfo);
router.post('/sendOTP/:userId', userController.sendOTP);
router.put('/editUser', userController.editUser);

// Capital Routes
router.post('/capital/add', capitalController.addCapitalAmount); 
router.get('/capital/:userId', capitalController.getCapitalAmount);
router.put('/capital/edit', capitalController.editCapitalAmount); 


//Expense Routes
router.post('/expenses/add', expenseController.addExpenses);
router.get('/expenses/all/:userId', expenseController.getAllExpenseTransactionsByUserId);
router.get('/expenses/details/:userId/:expenseId', expenseController.getExpenseTransactionDetails);
router.get('/expenses/totalPriceAndDate/:userId', expenseController.getAllExpenseTotalPriceAndDateByUserId);
router.get('/expenses/total/:userId', expenseController.getTotalExpenseTransactionsCount);
router.get('/expenses/cumulativeTotal/:userId', expenseController.getCumulativeTotal);
router.put('/expenses/edit', expenseController.editExpenseTransaction);
router.delete('/expenses/delete/:userId/:transactionId', expenseController.deleteExpenseTransaction);


module.exports = router;
