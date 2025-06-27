const crypto = require('crypto');

function generateOtp(length = 6) {
  return crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');
}

function getExpiry(minutes = 10) {
  return new Date(Date.now() + minutes * 60000);
}

module.exports = { generateOtp, getExpiry };
