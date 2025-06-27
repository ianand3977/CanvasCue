const winston = require('winston');

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

function errorHandler(err, req, res, next) {
  logger.error('Unhandled error', { error: err, url: req.originalUrl });
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}

module.exports = errorHandler;
