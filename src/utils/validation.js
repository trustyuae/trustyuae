export const isValidUserName = (username) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;;
    return emailPattern.test(username);
  };