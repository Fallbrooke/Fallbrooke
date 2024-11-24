// models/Expense.js

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true }, // Reference to Group
  expenseName: { type: String, required: true }, // New required field
  description: { type: String }, // Optional field
  amount: { type: Number, required: true },
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, // Reference to User
  settled: { type: Boolean, default: false },
  shares: { type: Object, required: true }, // e.g., { Amir: 25, Ravi: 25, Sanskar: 25, Vidya: 25 }
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
