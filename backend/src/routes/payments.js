const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');
const logger = require('../logger');

// Get all payments
router.get('/', async (req, res, next) => {
  try {
    // find all payments
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    logger.error('Error fetching payments:', err);
    next(err);
  }
});

// eg payment
/**

 */
// Add a new payment
router.post('/', async (req, res, next) => {
  const { payer, date, amount, type, notes } = req.body;

  // log the request body
  logger.info('Request body:', req.body);

  // validate required fields and throw error with the specific field that is missing
  ['payer', 'date', 'amount', 'type'].forEach((field) => {
    if (!req.body[field]) {
      return res.status(400).json({
        message: `${field} is required.`
      });
    }
  });

  try {
    const payment = new Payment({
      payer,
      date,
      amount,
      type,
      notes
    });

    await payment.save();
    res.json(payment);
  } catch (err) {
    logger.error('Error adding payment:', err);
    next(err);
  }
});

module.exports = router;
