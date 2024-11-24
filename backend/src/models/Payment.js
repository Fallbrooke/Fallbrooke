const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String },
  payer: { type: String, required: true },
  type: { type: String, required: true }
});

module.exports = mongoose.model('Payment', paymentSchema);
