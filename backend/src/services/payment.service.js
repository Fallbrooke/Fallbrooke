const db = require('../backup/firebase/firebase');

const createPayment = async (paymentData) => {
  const paymentsRef = db.collection('payments');
  // only add the payment if it doesn't exist in the firestore db
  paymentsRef
    .doc(paymentData.id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        paymentsRef.doc(paymentData.id).set(paymentData);
      }
    })
    .catch((error) => {
      console.error('Error getting document:', error);
    });
};

module.exports = { createPayment };
