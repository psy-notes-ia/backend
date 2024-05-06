import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCODING = 'hex';
const IV_LENGTH = 16;
const KEY = process.env.ENCRYPTION_KEY!;

export const EncryptData = (data: string) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, new Buffer(KEY), iv);
  return Buffer.concat([cipher.update(data,), cipher.final(), iv]).toString(ENCODING);
}

export const DecryptData = (data: string) => {
  const binaryData = Buffer.from(data, ENCODING);
  const iv = binaryData.slice.call(-IV_LENGTH);
  const encryptedData =  binaryData.slice.call(0, binaryData.length - IV_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, new Buffer(KEY), iv);

  return Buffer.concat([decipher.update(encryptedData), decipher.final()]).toString();
}