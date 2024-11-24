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

const getPaymentById = async (id) => {
  const paymentsRef = db.collection('payments');
  const payment = await paymentsRef.doc(id).get();
  if (!payment.exists) {
    logger.error(`Payment with id ${id} not found`);
    return null;
  }
  return payment.data();
};

const createPayment = async (paymentData) => {
  const newPaymentId = generateNewPaymentId();
  const newPaymentData = {
    payer: paymentData.payer,
    date: new Date(paymentData.date),
    amount: paymentData.amount,
    type: paymentData.type,
    notes: paymentData.notes,
    id: newPaymentId
  };
  const paymentsRef = db.collection('payments');
  const payment = await paymentsRef.doc(newPaymentData.id).get();
  if (!payment.exists) {
    await paymentsRef.doc(newPaymentData.id).set(newPaymentData);
    const paymentInfo = await getPayment(newPaymentData.id);
    if (paymentInfo) {
      logger.info(
        `Payment with id ${paymentInfo.id} added: ${JSON.stringify(
          paymentInfo
        )}`
      );
      return paymentInfo;
    } else {
      throw new Error('Error adding payment');
    }
  }
};

const deletePayment = async (id) => {
  const paymentsRef = db.collection('payments');
  await paymentsRef.doc(id).delete();
  const payment = await getPayment(id);
  if (!payment) {
    logger.info(`Payment with id ${id} deleted`);
  } else {
    throw new Error('Error deleting payment with id ' + id);
  }
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
    return paymentInfo;
  } else {
    throw new Error('Error updating payment with id ' + payment.id);
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
      date: data?.date?.toDate()
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

const generateNewPaymentId = () => {
  return db.collection('payments').doc().id;
};

module.exports = {
  createPayment,
  deletePayment,
  updatePayment,
  getAllPayments,
  getPaymentTypes,
  generateNewPaymentId,
  getPaymentById
};
