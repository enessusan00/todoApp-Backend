const crypto = require('crypto');

// config/auth.config.js

function generateSecret() {
    return crypto.randomBytes(64).toString('hex');
}

module.exports = {
    secret: generateSecret()
};
