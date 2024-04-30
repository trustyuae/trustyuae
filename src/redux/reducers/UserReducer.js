
import {
    CLEAR_STORE,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
  } from '../constants/Constants';
  
  export const UserReducer = (
    state = {
      loading: false,
      data: {},
    },
    {payload, type},
  ) => {
    switch (type) {
      case USER_LOGIN_REQUEST:
        return {...state, loading: true};
      case USER_LOGIN_SUCCESS:
        return {...state, loading: false, data: payload};
      case USER_LOGIN_FAIL:
        return {...state, loading: false};
  
      case CLEAR_STORE:
        return {
          ...state,
          data: {},
        };
  
      default:
        return state;
    }
  };