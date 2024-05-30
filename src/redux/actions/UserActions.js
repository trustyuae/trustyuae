import axios from "axios";
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_FAIL,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS,
  CLEAR_STORE,
} from "../constants/Constants";
import { loginURL, logoutURL } from "../../utils/constants";
import ShowAlert from "../../utils/ShowAlert";

export const loginUser = (data, navigate) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });
  try {
    const res = await axios.post(`${loginURL}`, data, {
      headers: { "content-type": "application/json" },
    });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data });
    localStorage.setItem("token", JSON.stringify(res?.data?.token));
    localStorage.setItem("user_data", JSON.stringify(res?.data?.user_data));
    if (res.data.token) {
      const result = await ShowAlert('Success', res?.data?.message, "success", true, false, 'OK');
      if (result.isConfirmed) navigate("/ordersystem");
    } else {
      console.log("error while login");
    }
  } catch (error) {
    await ShowAlert('Error', error?.response?.data?.message, "error");
    dispatch({ type: USER_LOGIN_FAIL });
  }
};

export const logoutUser = (navigate) => async (dispatch) => {
  dispatch({ type: USER_LOGOUT_REQUEST });
  try {
    const res = await axios.post(`${logoutURL}`, null);
    console.log(res, "logout res");
    dispatch({ type: USER_LOGOUT_SUCCESS });
    localStorage.clear();
    const result = await ShowAlert("Do You Want Logged Out?", '', 'question', true, true, "Confirm", "Cancel");
    if (result.isConfirmed) {
      await ShowAlert("Success", res?.data?.message, 'success', false, false, 'OK', '', 1500)
      navigate("/");
    }
    dispatch({ type: CLEAR_STORE });
  } catch (error) {
    dispatch({ type: USER_LOGOUT_FAIL });
    console.log("error occurred");
  }
};

export const loginUserWithToken = (navigate, token) => async (dispatch) => {
  if (token) {
    navigate("/ordersystem");
  } else {
    navigate("/");
  }
};


