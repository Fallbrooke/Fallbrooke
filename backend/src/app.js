// app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const paymentsRouter = require('./routes/payments'); // Import settlements router
const logger = require('./logger'); // Import the logger
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Use morgan middleware for HTTP request logging
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.http(message.trim())
    }
  })
);

// Connect to MongoDB
mongoose.connect('mongodb://mongodb:27017/expenseSplitterDB');

// Check connection
mongoose.connection.on('connected', () => {
  logger.info('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});

process.on('exit', (code) => {
  logger.info(`About to exit with code: ${code}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
});

// Routes
app.use('/api/v1/payments', paymentsRouter); // Use the payment router

// send the health check response 'OK' to indicate that the server is running
app.get('/health', (req, res) => {
  res.send('OK');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`${err.status || 500} - ${err.message}`);
  res.status(err.status || 500).json({ message: err.message });
});

// Start the server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
