export const saveToken = async (token) => {
    try {
      await localStorage.setItem('token', JSON.stringify(token));
    } catch (e) {
      console.error('Failed to save the token to storage', e);
    }
  };
  
  export const saveUserData = async (user_data) => {
      try {
        await localStorage.setItem('user_data', JSON.stringify(user_data));
      } catch (e) {
        console.error('Failed to save the user_data to storage', e);
      }
    };
    
  
  export const getToken = async () => {
    try {
      return await JSON.parse(localStorage.getItem('token'));
    } catch (e) {
      console.error('Failed to fetch the token from storage', e);
      return null;
    }
  };
  
  export const getUserData = async () => {
      try {
        return await JSON.parse(localStorage.getItem('user_data'));
      } catch (e) {
        console.error('Failed to fetch the user_data from storage', e);
        return null;
      }
    };
  
  export const removeToken = async (token) => {
    try {
      await localStorage.removeItem('token');
    } catch (e) {
      console.error('Failed to remove the token from storage', e);
    }
  };