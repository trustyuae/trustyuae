import {
  CLEAR_STORE,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_FAIL,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS,
} from "../constants/Constants";

export const UserLoginReducer = (
  state = { loading: false, data: {} },
  { payload, type }
) => {
  switch (type) {
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true };
    case USER_LOGIN_SUCCESS:
      return { ...state, loading: false, data: payload };
    case USER_LOGIN_FAIL:
      return { ...state, loading: false };

    case CLEAR_STORE:
      return { ...state, data: {} };

    default:
      return state;
  }
};

export const UserLogoutReducer = (
  state = { loading: false, data: {} },
  { payload, type }
) => {
  switch (type) {
    case USER_LOGOUT_REQUEST:
      return { ...state, loading: true };
    case USER_LOGOUT_SUCCESS:
      return { ...state, loading: false, data: payload};
    case USER_LOGOUT_FAIL:
      return { ...state, loading: false };

    case CLEAR_STORE:
      return { ...state, data: {} };

    default:
      return state;
  }
};
