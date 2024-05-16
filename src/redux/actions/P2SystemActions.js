import {
    API_URL,
    GET_ORDER_NOT_AVAILABLE_REQUEST,
    GET_ORDER_NOT_AVAILABLE_SUCCESS,
    GET_ORDER_NOT_AVAILABLE_FAIL
  } from "../constants/Constants";
  import axios from "axios";

  export const OrderNotAvailableData =
  ({ apiUrl }) => async (dispatch) => {
    try {
      dispatch({ type: GET_ORDER_NOT_AVAILABLE_REQUEST });
      const response = await axios.get(apiUrl);
      console.log(response,'response of order not available data')
      dispatch({ type: GET_ORDER_NOT_AVAILABLE_SUCCESS, payload: response?.data });
      return response;
    } catch (error) {
      dispatch({ type: GET_ORDER_NOT_AVAILABLE_FAIL, error: error.message });
    }
  };

  // export const OrderSystemGet =
  // ({ apiUrl }) =>
  // async (dispatch) => {
  //   console.log(apiUrl, "apiUrl");
  //   try {
  //     dispatch({ type: GET_ORDER_SYSTEM_REQUEST });

  //     const response = await axios.get(apiUrl);
  //     dispatch({ type: GET_ORDER_SYSTEM_SUCCESS, payload: response?.data });
  //     return response;
  //   } catch (error) {
  //     dispatch({ type: GET_ORDER_SYSTEM_FAIL, error: error.message });
  //   }
  // };
