import {
    API_URL,
    GET_ORDER_NOT_AVAILABLE_REQUEST,
    GET_ORDER_NOT_AVAILABLE_SUCCESS,
    GET_ORDER_NOT_AVAILABLE_FAIL
  } from "../constants/Constants";
  import axios from "axios";

  export const OrderNotAvailableData =
  () =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_ORDER_NOT_AVAILABLE_REQUEST });
      const response = await axios.get(
        `${API_URL}wp-json/custom-order-not/v1/order-not-available/`
      );
      console.log(response?.data,'response of order not available data')
      dispatch({ type: GET_ORDER_NOT_AVAILABLE_SUCCESS, payload: response?.data });
      return response;
    } catch (error) {
      dispatch({ type: GET_ORDER_NOT_AVAILABLE_FAIL, error: error.message });
    }
  };
