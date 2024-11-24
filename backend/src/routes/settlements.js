// routes/settlements.js

const express = require('express');
const calculateBalances = require('../utils/calculateBalances');

const logger = require('../logger'); // Assuming you have a logger
const router = express.Router();

// Get settlements per group
router.get('/', async (req, res, next) => {
  try {
    const settlements = await calculateBalances();
    res.json(settlements);
  } catch (err) {
    logger.error('Error calculating settlements:', err);
    next(err);
  }
});

module.exports = router;
