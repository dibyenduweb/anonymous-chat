export const generateUserId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'user-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};