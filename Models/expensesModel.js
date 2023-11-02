//expenseModel.js
const mongoose = require('mongoose');

const expensesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String },
  totalPrice: { type: Number, required: true }
});

module.exports = mongoose.model('Expenses', expensesSchema);