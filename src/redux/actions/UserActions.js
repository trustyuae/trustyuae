import axios from 'axios';
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
} from '../constants/Constants';
import { loginURL } from '../../utils/constants';

export const loginUser = (data) => async dispatch => {
  dispatch({ type: USER_LOGIN_REQUEST });
  try {
    const res = await axios.post(`${loginURL}`, data, { header: { 'content-type': 'application/json' } });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: res });
    await localStorage.setItem('token', JSON.stringify(res?.data?.token));
  } catch (error) {
    dispatch({ type: USER_LOGIN_FAIL });
    console.log('error occurred')
  }
};