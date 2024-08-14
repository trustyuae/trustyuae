import axios from "axios";
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_FAIL,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS,
  CLEAR_STORE,
  API_URL,
} from "../constants/Constants";
import { loginURL, logoutURL } from "../../utils/constants";
import ShowAlert from "../../utils/ShowAlert";
import axiosInstance from "../../utils/AxiosInstance";
import { getUserData, saveToken, saveUserData } from "../../utils/StorageUtils";

export const loginUser = (data, navigate) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });
  try {
    const res = await axiosInstance.post(
      `${API_URL}wp-json/custom-login/v1/login`,
      data,
      {
        headers: { 
          "content-type": "application/json"},
      }
    );
    dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data });
    await saveToken(res.data.token);
    await saveUserData(res.data.user_data);
    if (res.status === 200) {
      const result = await ShowAlert(
        "Success",
        res?.data?.message,
        "success",
        true,
        false,
        "OK"
      );
      if (result.isConfirmed) {
        const userData = await getUserData()
        if (userData.user_role === "administrator") {
          navigate("/ordersystem");
        } else if (userData.user_role === "packing_assistant") {
          navigate("/ordersystem");
        } else if (userData.user_role === "factory_coordinator") {
          navigate("/PO_ManagementSystem");
        } else if (userData.user_role === "customer_support") {
          navigate("/order_not_available");
        } else if (userData.user_role === "operation_assistant") {
          navigate("/On_Hold_Manegement_System");
        }
      }
    } else {
      console.log("error while login");
    }
  } catch (error) {
    await ShowAlert(
      "Error",
      error?.response?.data?.message,
      "error",
      false,
      false,
      "",
      "",
      1000
    );
    dispatch({ type: USER_LOGIN_FAIL });
  }
};

export const logoutUser = (navigate) => async (dispatch) => {
  dispatch({ type: USER_LOGOUT_REQUEST });
  try {
    const res = await axios.post(
      `${API_URL}wp-json/custom-login/v1/logout`,
      null,
    );
    dispatch({ type: USER_LOGOUT_SUCCESS });
    localStorage.clear();
    const result = await ShowAlert(
      "Do You Want Logged Out?",
      "",
      "question",
      true,
      true,
      "Confirm",
      "Cancel"
    );
    if (result.isConfirmed) {
      await ShowAlert(
        "Success",
        res?.data?.message,
        "success",
        false,
        false,
        "OK",
        "",
        1000
      );
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
