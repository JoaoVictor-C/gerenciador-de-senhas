export function checkPasswordStrength(password: string): {
  isStrong: boolean;
  score: number;
  feedback: string[];
} {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let score = 0;
  const feedback: string[] = [];

  if (password.length >= minLength) {
    score += 1;
  } else {
    feedback.push('A senha deve ter pelo menos 8 caracteres');
  }

  if (hasUpperCase) score += 1;
  else feedback.push('A senha deve ter pelo menos uma letra maiúscula');

  if (hasLowerCase) score += 1;
  else feedback.push('A senha deve ter pelo menos uma letra minúscula');

  if (hasNumbers) score += 1;
  else feedback.push('A senha deve ter pelo menos um número');

  if (hasSymbols) score += 1;
  else feedback.push('A senha deve ter pelo menos um caractere especial');

  const isStrong = score === 5;

  return {
    isStrong,
    score,
    feedback
  };
}