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
import { toast } from "react-toastify";

export const loginUser = (data, navigate) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });
  try {
    const res = await axios.post(`${loginURL}`, data, {
      headers: { "content-type": "application/json" },
    });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data.token });
    localStorage.setItem("token", JSON.stringify(res?.data?.token));
    if (res.data.token) {
      toast(`${res?.data?.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/ordersystem");
    } else {
      console.log("error while login");
    }
  } catch (error) {
    toast(`${error?.response?.data?.message}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    dispatch({ type: USER_LOGIN_FAIL });
    console.log("error occurred");
  }
};

export const logoutUser = (navigate) => async (dispatch) => {
  dispatch({ type: USER_LOGOUT_REQUEST });
  try {
    await axios.post(`${logoutURL}`, null);
    dispatch({ type: USER_LOGOUT_SUCCESS });
    localStorage.clear();
    navigate("/");
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

export const userLogout = (navigate) => async (dispatch) => {
  dispatch({ type: CLEAR_STORE });
  await localStorage.clear();
  navigate("/");
};
