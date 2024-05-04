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
import Swal from "sweetalert2";

export const loginUser = (data, navigate) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });
  try {
    const res = await axios.post(`${loginURL}`, data, {
      headers: { "content-type": "application/json" },
    });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data.token });
    await localStorage.setItem("token", JSON.stringify(res?.data?.token));
    if (res.data.token) {
      Swal.fire({
        icon: "success",
        title: res?.data?.message,
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/ordersystem");
        }
      });
    } else {
      console.log("error while login");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error?.response?.data?.message,
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
  localStorage.clear();
  navigate("/");
};
