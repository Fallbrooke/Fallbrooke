const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');
const logger = require('../logger');
const {
  createPayment,
  deletePayment,
  updatePayment,
  getAllPayments,
  getPaymentTypes,
  generateNewPaymentId,
  getPaymentById
} = require('../services/payment.service');

// Get all payments
router.get('/', async (req, res, next) => {
  try {
    const payments = await getAllPayments();
    res.json(payments);
  } catch (err) {
    logger.error('Error fetching payments:', err);
    next(err);
  }
});

// get payment types
router.get('/types', async (req, res, next) => {
  try {
    logger.info('Fetching payment types');
    const types = await getPaymentTypes();
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
    const paymentData = {
      payer,
      date,
      amount,
      type,
      notes
    };
    // add the payment to the firestore db
    const newPayment = await createPayment(paymentData);
    logger.info('Payment added:', JSON.stringify(newPayment));

    res.json(newPayment);
  } catch (err) {
    logger.error('Error adding payment:', err);
    next(err);
  }
});

// delete payment
router.delete('/:id', async (req, res, next) => {
  try {
    const paymentId = req.params.id;
    // delete the payment from the firestore db
    await deletePayment(paymentId);
    res.json(`Payment with id ${paymentId} deleted`);
  } catch (err) {
    logger.error('Error deleting payment:', err);
    next(err);
  }
});

// update payment
router.put('/:id', async (req, res, next) => {
  const { payer, date, amount, type, notes } = req.body;
  const id = req.params.id;

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
    // update the payment in the firestore db
    const paymentData = {
      payer,
      date: new Date(date),
      amount,
      type,
      notes,
      id
    };
    const payment = await updatePayment(paymentData);
    logger.info('Payment updated:', payment);
    res.json(payment);
  } catch (err) {
    logger.error('Error updating payment:', err);
    next(err);
  }
});

module.exports = router;
