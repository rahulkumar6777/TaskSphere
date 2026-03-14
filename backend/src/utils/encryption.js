import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;


const encrypt = (text) => {
  if (!text) return text;
  return CryptoJS.AES.encrypt(String(text), ENCRYPTION_KEY).toString();
};


const decrypt = (cipherText) => {
  if (!cipherText) return cipherText;
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return cipherText;
  }
};


const encryptFields = (obj, fields) => {
  const result = { ...obj };
  fields.forEach((field) => {
    if (result[field]) {
      result[field] = encrypt(result[field]);
    }
  });
  return result;
};


export { encrypt, decrypt, encryptFields }
