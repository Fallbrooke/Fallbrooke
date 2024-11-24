// logger.js

const { createLogger, format, transports, addColors } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3, // Add 'http' level
  verbose: 4,
  debug: 5,
  silly: 6
};

addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta', // Add color for 'http' level
  verbose: 'cyan',
  debug: 'blue',
  silly: 'gray'
});

const logger = createLogger({
  levels,
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.colorize({ all: true }),
    format.json(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      (info) => `${info.timestamp} [${info.level}]: ${info.message}`
    )
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d' // Keep logs for 14 days
    })
  ],

  exceptionHandlers: [new transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new transports.File({ filename: 'logs/rejections.log' })]
});

module.exports = logger;
