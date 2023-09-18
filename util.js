const crypto = require('crypto');

function generateToken(len = 64) {
    return crypto.randomBytes(len).toString('hex');
}

module.exports = {
    generateToken
};

