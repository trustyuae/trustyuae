import axios from 'axios';
import { getToken } from './StorageUtils';
import { API_URL } from '../redux/constants/Constants';

const instance = axios.create({
  baseURL: `${API_URL}`,
});

instance.interceptors.request.use(
  async config => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Live ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;