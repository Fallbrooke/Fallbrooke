const db = require('../data/firebase');
const logger = require('../logger');

const getPayment = async (id) => {
  const paymentsRef = db.collection('payments');
  const payment = await paymentsRef.doc(id).get();
  if (!payment.exists) {
    logger.error(`Payment with id ${id} not found`);
    return null;
  }
  return payment.data();
};

const createPayment = async (paymentData) => {
  const paymentsRef = db.collection('payments');
  const payment = await paymentsRef.doc(paymentData.id).get();
  if (!payment.exists) {
    await paymentsRef.doc(paymentData.id).set(paymentData);
    const paymentInfo = await getPayment(paymentData.id);
    if (paymentInfo) {
      logger.info(
        `Payment with id ${paymentInfo.id} added: ${JSON.stringify(
          paymentInfo
        )}`
      );
    }
  }
};

const deletePayment = async (id) => {
  const paymentsRef = db.collection('payments');
  paymentsRef
    .doc(id)
    .delete()
    .then(() => {
      logger.info(`Payment with id ${id} deleted`);
    });
};

const updatePayment = async (payment) => {
  const paymentsRef = db.collection('payments');
  await paymentsRef.doc(payment.id).update(payment);
  const paymentInfo = await getPayment(payment.id);
  if (paymentInfo) {
    logger.info(
      `Payment with id ${paymentInfo.id} updated: ${JSON.stringify(
        paymentInfo
      )}`
    );
  }
};

/**
 * Get all payments from the Firestore database
 */
const getAllPayments = async () => {
  const paymentsRef = db.collection('payments');
  const snapshot = await paymentsRef.get();
  const payments = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    // convert the Firestore DB's timestamp object to a Date object
    payments.push({
      ...data,
      date: data.date.toDate()
    });
  });
  return payments;
};

const getPaymentTypes = async () => {
  const paymentTypesRef = db.collection('payments');
  const snapshot = await paymentTypesRef.get();
  const paymentTypes = new Set();

  snapshot.forEach((doc) => {
    const type = doc.data()?.type;
    paymentTypes.add(type);
  });
  return Array.from(paymentTypes);
};

module.exports = {
  createPayment,
  deletePayment,
  updatePayment,
  getAllPayments,
  getPaymentTypes
};
