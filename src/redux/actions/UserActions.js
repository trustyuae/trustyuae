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

export const loginUser = (data, navigate) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });
  try {
    const res = await axios.post(
      `${API_URL}wp-json/custom-login/v1/login`,
      data,
      {
        headers: { "content-type": "application/json" },
      }
    );
    console.log(res, "respuncee");
    dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data });
    localStorage.setItem("token", JSON.stringify(res?.data?.token));
    localStorage.setItem("user_data", JSON.stringify(res?.data?.user_data));
    if (res.data.token) {
      const result = await ShowAlert(
        "Success",
        res?.data?.message,
        "success",
        true,
        false,
        "OK"
      );
      if (result.isConfirmed) {
        if (res.data.user_data.user_role === "administrator") {
          navigate("/ordersystem");
        } else if (res.data.user_data.user_role === "packing_assistant") {
          navigate("/ordersystem");
        } else if (res.data.user_data.user_role === "factory_coordinator") {
          navigate("/PO_ManagementSystem");
        } else if (res.data.user_data.user_role === "customer_support") {
          navigate("/order_not_available");
        } else if (res.data.user_data.user_role === "operation_assistant") {
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
      null
    );
    console.log(res, "logout res");
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
