export function validatePassword(password: string): { valid: boolean; reason?: string } {
  if (password.length < 10) return { valid: false, reason: 'Şifre en az 10 karakter olmalı.' };
  if (!/[A-Z]/.test(password)) return { valid: false, reason: 'En az bir büyük harf içermeli.' };
  if (!/[a-z]/.test(password)) return { valid: false, reason: 'En az bir küçük harf içermeli.' };
  if (!/[0-9]/.test(password)) return { valid: false, reason: 'En az bir rakam içermeli.' };
  if (!/[^A-Za-z0-9]/.test(password)) return { valid: false, reason: 'En az bir özel karakter içermeli.' };
  return { valid: true };
}
