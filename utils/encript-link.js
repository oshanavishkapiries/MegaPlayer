const crypto = require("crypto");
const { SECRET } = require("../config/config.js");

function encrypt(text) {
  const key = crypto.createHash("sha256").update(SECRET).digest();
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

function decrypt(encryptedText) {
  const key = crypto.createHash("sha256").update(SECRET).digest();
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = {
  encrypt,
  decrypt,
};
