const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');
const logger = require('../logger');
const { createPayment, deletePayment } = require('../services/payment.service');

// Get all payments
router.get('/', async (req, res, next) => {
  try {
    // find all payments and sort by date
    const payments = await Payment.find().sort({ date: 'asc' });
    if (payments.length > 0) {
      payments.forEach(async (payment) => {
        const paymentData = {
          payer: payment.payer,
          date: payment.date,
          amount: payment.amount,
          type: payment.type,
          notes: payment.notes,
          id: payment._id.toString()
        };
        // only add the payment if it doesn't exist in the firestore db
        await createPayment(paymentData);
      });
    }

    res.json(payments);
  } catch (err) {
    logger.error('Error fetching payments:', err);
    next(err);
  }
});

// get payment types
router.get('/types', async (req, res, next) => {
  try {
    const types = await Payment.distinct('type');
    res.json(types);
  } catch (err) {
    logger.error('Error fetching payment types:', err);
    next(err);
  }
});

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
    logger.info('Payment added:', JSON.stringify(payment));
    const paymentData = {
      payer: payment.payer,
      date: payment.date,
      amount: payment.amount,
      type: payment.type,
      notes: payment.notes,
      id: payment._id.toString()
    };
    // add the payment to the firestore db
    await createPayment(paymentData);
    res.json(payment);
  } catch (err) {
    logger.error('Error adding payment:', err);
    next(err);
  }
});

// delete payment
router.delete('/:id', async (req, res, next) => {
  try {
    const paymentId = req.params.id;
    const payment = await Payment.findByIdAndDelete(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    // delete the payment from the firestore db
    await deletePayment(paymentId);
    logger.info('Payment deleted:', payment);
    res.json(payment);
  } catch (err) {
    logger.error('Error deleting payment:', err);
    next(err);
  }
});

// update payment
router.put('/:id', async (req, res, next) => {
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
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        payer,
        date,
        amount,
        type,
        notes
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    logger.info('Payment updated:', payment);
    res.json(payment);
  } catch (err) {
    logger.error('Error updating payment:', err);
    next(err);
  }
});

module.exports = router;
