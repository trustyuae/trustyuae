export const isValidEmail = (username) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;;
    return emailPattern.test(username);
  };