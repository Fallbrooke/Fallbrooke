const admin = require('firebase-admin');

const serviceAccount = require('./service.account.json');

console.log('Loading service account...'); // Add this line
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('Initializing Firestore...'); // Add this line
const db = admin.firestore();

console.log('Firestore connection successful!'); // Add this line

module.exports = db;
