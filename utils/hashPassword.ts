import * as Crypto from 'expo-crypto';

export const hashPassword = async (senha: string): Promise<string> => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    senha
  );
  return digest;
};