const crypto = require('crypto');
const { SECRET } = require('../config/config.js');

// AES Encryption function
function encrypt(text) {
    const key = crypto.createHash('sha256').update(SECRET).digest(); // Ensure the key is 32 bytes
    const iv = Buffer.alloc(16, 0); // 16-byte IV (you can use a random IV in production)
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

// AES Decryption function
function decrypt(encryptedText) {
    const key = crypto.createHash('sha256').update(SECRET).digest(); // Ensure the key is 32 bytes
    const iv = Buffer.alloc(16, 0); // 16-byte IV (use the same IV for decryption)
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = {
    encrypt,
    decrypt
};
