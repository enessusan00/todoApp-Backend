// config/auth.config.js
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');

module.exports = {
  secret
};
