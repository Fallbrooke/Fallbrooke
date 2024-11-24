// utils/calculateBalances.js

const { log } = require('winston');
const Expense = require('../models/Expense');
const Group = require('../models/Group');
const User = require('../models/User');
const logger = require('../logger');

/**
 * Calculates balances and settlements per group.
 * @returns {Object} An object where each key is a group name and the value contains balances and settlements.
 */
async function calculateBalances() {
  try {
    const groups = await Group.find().populate('members');
    const result = {};

    for (const group of groups) {
      // Fetch expenses for the group
      const expenses = await Expense.find({ group: group._id }).populate(
        'payer'
      );
      logger.info(
        `Calculating balances for group: ${
          group.name
        } with members: ${group.members.map((member) => member.name)}`
      );

      // Calculate total paid and total owed per member
      const balances = {}; // { memberName: balance }

      // Initialize balances
      group.members.forEach((member) => {
        balances[member.name] = 0;
      });

      expenses.forEach((expense) => {
        const { payer, amount, shares } = expense;

        // Add amount to payer's balance
        if (balances.hasOwnProperty(payer)) {
          balances[payer.id] += amount;
        } else {
          balances[payer.id] = amount;
        }

        // Subtract shares from each member's balance
        Object.keys(shares).forEach((member) => {
          if (balances.hasOwnProperty(member)) {
            balances[member] -= shares[member];
          } else {
            balances[member] = -shares[member];
          }
        });
      });

      // Filter out members with zero balance
      const filteredBalances = {};
      Object.keys(balances).forEach((member) => {
        if (balances[member] !== 0) {
          filteredBalances[member] = balances[member];
        }
      });

      // Calculate settlements
      const settlements = calculateSettlements(filteredBalances);

      // Assign to result
      result[group.name] = {
        balances: filteredBalances,
        settlements,
        users: group.members.map((member) => {
          return { id: member.id, name: member.name };
        })
      };
    }

    return result;
  } catch (err) {
    throw err;
  }
}

/**
 * Calculates settlements based on balances.
 * @param {Object} balances - { memberName: balance }
 * @returns {Array} Settlements in the format [{ from: 'A', to: 'B', amount: 10 }, ...]
 */
function calculateSettlements(balances) {
  const creditors = [];
  const debtors = [];

  // Separate creditors and debtors
  Object.keys(balances).forEach((member) => {
    const balance = balances[member];
    if (balance > 0) {
      creditors.push({ member, amount: balance });
    } else if (balance < 0) {
      debtors.push({ member, amount: Math.abs(balance) });
    }
  });

  const settlements = [];

  let i = 0; // Index for debtors
  let j = 0; // Index for creditors

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const settledAmount = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.member,
      to: creditor.member,
      amount: settledAmount
    });

    // Update amounts
    debtors[i].amount -= settledAmount;
    creditors[j].amount -= settledAmount;

    // Move to next debtor or creditor if fully settled
    if (debtors[i].amount === 0) i++;
    if (creditors[j].amount === 0) j++;
  }

  return settlements;
}

module.exports = calculateBalances;
