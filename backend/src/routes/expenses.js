// routes/expenses.js

const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Group = require('../models/Group');
const logger = require('../logger'); // Assuming you have a logger
const User = require('../models/User');

// Get all expenses, optionally filtered by group
router.get('/', async (req, res, next) => {
  const { groupId } = req.query; // Optional query parameter to filter by group

  let filter = {};
  if (groupId) {
    filter.group = groupId;
  }

  try {
    const expenses = await Expense.find(filter)
      .populate('group')
      .populate('payer');
    res.json(expenses);
  } catch (err) {
    logger.error('Error fetching expenses:', err);
    next(err);
  }
});

// Add a new expense
router.post('/', async (req, res, next) => {
  const {
    groupId,
    expenseName,
    description,
    amount,
    payer: payerId,
    shares
  } = req.body;

  // validate required fields and throw error with the specific field that is missing
  ['groupId', 'expenseName', 'amount', 'payer', 'shares'].forEach((field) => {
    if (!req.body[field]) {
      return res.status(400).json({
        message: `${field} is required.`
      });
    }
  });

  try {
    // Verify that the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(400).json({ message: 'Invalid group ID.' });
    }

    // Verify that the payer exists
    const payer = await User.findById(payerId);
    if (!payer) {
      return res.status(400).json({ message: 'Invalid payer.' });
    }

    const expense = new Expense({
      group: groupId,
      expenseName,
      description, // Optional
      amount,
      payer,
      shares
    });

    const newExpense = await expense.save();
    logger.info(
      `Added new expense: ${newExpense.expenseName} to group: ${group.name}`
    );
    res.status(201).json(newExpense);
  } catch (err) {
    logger.error('Error adding expense:', err);
    next(err);
  }
});

// Delete an expense
router.delete('/:id', async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      logger.warn(`Expense not found: ID ${req.params.id}`);
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.deleteOne(); // Use deleteOne() as per Mongoose v6+
    logger.info(
      `Deleted expense: ${expense.expenseName} from group ID: ${expense.group}`
    );
    res.json({ message: 'Expense deleted successfully.' });
  } catch (err) {
    logger.error('Error deleting expense:', err);
    next(err);
  }
});

// Get a single expense by ID
router.get('/:id', async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('group')
      .populate('payer');
    if (!expense) {
      logger.warn(`Expense not found: ID ${req.params.id}`);
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    logger.error('Error fetching expense:', err);
    next(err);
  }
});

// Additional routes (e.g., update expense) can be added here

module.exports = router;
