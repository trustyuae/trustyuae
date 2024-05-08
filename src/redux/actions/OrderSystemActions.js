import {
    url,
    GET_ORDER_SYSTEM_REQUEST,
    GET_ORDER_SYSTEM_SUCCESS,
    GET_ORDER_SYSTEM_FAIL,
  } from "../constants/Constants";
  import axios from "axios";

  export const OrderSystemGet = (factoryId, data) => async (dispatch) => {
    try {
      dispatch({ type: GET_ORDER_SYSTEM_REQUEST });
  
      const response = await axios.get(
        `${url}custom-orders-new/v1/orders`);
      dispatch({ type: GET_ORDER_SYSTEM_SUCCESS, payload: response?.data });
    } catch (error) {
      dispatch({ type: GET_ORDER_SYSTEM_FAIL, error: error.message });
    }
  };