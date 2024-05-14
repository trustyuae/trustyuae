export const isValidEmail = (username) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernamePattern = /^[a-zA-Z0-9_.-]+$/; 
  return emailPattern.test(username) || usernamePattern.test(username);
};