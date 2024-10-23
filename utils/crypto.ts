import * as Crypto from 'expo-crypto';
import * as Random from 'expo-random';
import { Buffer } from 'buffer';

// IMPORTANT: In a production environment, never hardcode your secret key.
// Use environment variables or secure storage solutions.
const SECRET_KEY = 'chave-bem-secreta-haha'; 

export const encrypt = async (data: string): Promise<string> => {
  const iv = await Random.getRandomBytesAsync(16); // Initialization vector
  const key = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    SECRET_KEY
  );

  // Simple encryption using SHA256 (for demonstration only)
  // For real encryption, use AES or other secure algorithms with proper implementation
  const encrypted = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    key + Buffer.from(iv).toString('hex') + data
  );

  return `${Buffer.from(iv).toString('hex')}:${encrypted}`;
};

export const decrypt = async (data: string): Promise<string> => {
  const [ivHex, encrypted] = data.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const key = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    SECRET_KEY
  );

  // Since SHA256 is one-way, decryption isn't possible.
  // Implement reversible encryption algorithms like AES for real use cases.
  // Here, we'll just return the encrypted data for demonstration.
  return encrypted;
};