import {
  url,
  GET_ORDER_SYSTEM_REQUEST,
  GET_ORDER_SYSTEM_SUCCESS,
  GET_ORDER_SYSTEM_FAIL,
  GET_ORDER_DETAILS_REQUEST,
  GET_ORDER_DETAILS_SUCCESS,
  GET_ORDER_DETAILS_FAIL,
  API_URL,
} from "../constants/Constants";
import axios from "axios";

export const OrderSystemGet =
  ({ apiUrl }) =>
  async (dispatch) => {
    console.log(apiUrl, "apiUrl");
    try {
      dispatch({ type: GET_ORDER_SYSTEM_REQUEST });

      const response = await axios.get(apiUrl);
      dispatch({ type: GET_ORDER_SYSTEM_SUCCESS, payload: response?.data });
      return response;
    } catch (error) {
      dispatch({ type: GET_ORDER_SYSTEM_FAIL, error: error.message });
    }
  };

export const OrderDetailsGet = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_ORDER_DETAILS_REQUEST });

    const response = await axios.get(
      `${API_URL}wp-json/custom-orders-new/v1/orders/?orderid=${id}`
    );
    console.log(response, "actions res");
    dispatch({ type: GET_ORDER_DETAILS_SUCCESS, payload: response?.data });
  } catch (error) {
    console.log("actions error");
    dispatch({ type: GET_ORDER_DETAILS_FAIL, error: error.message });
  }
};
