//captitalModel.js
const mongoose = require('mongoose');

const capitalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Capital', capitalSchema);
