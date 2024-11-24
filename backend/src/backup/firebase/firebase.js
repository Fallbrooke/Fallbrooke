const admin = require('firebase-admin');
const logger = require('../../logger');

const serviceAccount = require('./service.account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

logger.info('Initializing Firestore DB');
const db = admin.firestore();

logger.info('Firestore connection successful!');

module.exports = db;
