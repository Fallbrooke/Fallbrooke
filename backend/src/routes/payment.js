const Payment = require('../models/payment');

// Get all payments
router.get('/', async (req, res, next) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    logger.error('Error fetching payments:', err);
    next(err);
  }
});

// eg payment
/**
 * {
    "id": "3ace4ae0-6544-4885-9b37-bb35f170a37e",
    "payer": "Amir",
    "date": "2024-11-06",
    "amount": 12,
    "type": "Mortgage",
    "notes": ""
}
 */
// Add a new payment
router.post('/', async (req, res, next) => {
  const { payer, date, amount, type, notes } = req.body;

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
