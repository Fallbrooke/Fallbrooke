const db = require('../backup/firebase/firebase');
const logger = require('../logger');

const createPayment = async (paymentData) => {
  const paymentsRef = db.collection('payments');
  const payment = await paymentsRef.doc(paymentData.id).get();
  if (!payment.exists) {
    await paymentsRef.doc(paymentData.id).set(paymentData);
    const paymentInfo = await paymentsRef.doc(paymentData.id).get();
    logger.info(
      `Payment with id ${paymentInfo.id} added: ${JSON.stringify(
        paymentInfo.data()
      )}`
    );
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

module.exports = { createPayment, deletePayment };
