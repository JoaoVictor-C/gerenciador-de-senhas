export function generatePassword(length: number = 12, options: { 
  uppercase: boolean; 
  numbers: boolean; 
  symbols: boolean; 
} = { uppercase: true, numbers: true, symbols: true }): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

  let characters = lowercase;
  if (options.uppercase) characters += uppercaseChars;
  if (options.numbers) characters += numbers;
  if (options.symbols) characters += symbols;

  let password = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    password += characters[index];
  }

  return password;
}
