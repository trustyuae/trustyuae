import {
    url,
    GET_ORDER_SYSTEM_REQUEST,
    GET_ORDER_SYSTEM_SUCCESS,
    GET_ORDER_SYSTEM_FAIL,
    GET_ORDER_DETAILS_REQUEST,
    GET_ORDER_DETAILS_SUCCESS,
    GET_ORDER_DETAILS_FAIL
  } from "../constants/Constants";
  import axios from "axios";

  export const OrderSystemGet = () => async (dispatch) => {
    try {
      dispatch({ type: GET_ORDER_SYSTEM_REQUEST });
  
      const response = await axios.get(
        `${url}custom-orders-new/v1/orders`);
      dispatch({ type: GET_ORDER_SYSTEM_SUCCESS, payload: response?.data });
    } catch (error) {
      dispatch({ type: GET_ORDER_SYSTEM_FAIL, error: error.message });
    }
  };

  export const OrderDetailsGet = (id) => async (dispatch) => {
    try {
      dispatch({ type: GET_ORDER_DETAILS_REQUEST });
  
      const response = await axios.get(
        `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-orders-new/v1/orders/?orderid=${id}`);
        console.log(response,'actions res')
      dispatch({ type: GET_ORDER_DETAILS_SUCCESS, payload: response?.data });
    } catch (error) {
      console.log('actions error')
      dispatch({ type: GET_ORDER_DETAILS_FAIL, error: error.message });
    }
  };