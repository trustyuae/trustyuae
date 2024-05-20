import axios from "axios";
import {
  ADD_PRODUCT_ORDER_FOR_PREP_FAIL,
  ADD_PRODUCT_ORDER_FOR_PREP_REQUEST,
  ADD_PRODUCT_ORDER_FOR_PREP_SUCCESS,
  API_URL,
  GET_PRODUCT_MANUAL_FAIL,
  GET_PRODUCT_MANUAL_REQUEST,
  GET_PRODUCT_MANUAL_SUCCESS,
  GET_PRODUCT_ORDER_DETAILS_FAIL,
  GET_PRODUCT_ORDER_DETAILS_REQUEST,
  GET_PRODUCT_ORDER_DETAILS_SUCCESS,
} from "../constants/Constants";

export const GetProductManual =
  ({ apiUrl }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_PRODUCT_MANUAL_REQUEST });
      const response = await axios.get(apiUrl);
      console.log(response, "response of order not available data");
      dispatch({ type: GET_PRODUCT_MANUAL_SUCCESS, payload: response?.data });
      return response;
    } catch (error) {
      dispatch({ type: GET_PRODUCT_MANUAL_FAIL, error: error.message });
    }
  };

export const GetProductOrderDetails =
  ({ apiUrl }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_PRODUCT_ORDER_DETAILS_REQUEST });
      const response = await axios.get(apiUrl);
      console.log(response, "response of GetProductOrderDetails");
      dispatch({
        type: GET_PRODUCT_ORDER_DETAILS_SUCCESS,
        payload: response?.data,
      });
      return response;
    } catch (error) {
      dispatch({ type: GET_PRODUCT_ORDER_DETAILS_FAIL, error: error.message });
    }
  };

export const AddProductOrderForPre = (requestedDataP) => async (dispatch) => {
  try {
    dispatch({ type: ADD_PRODUCT_ORDER_FOR_PREP_REQUEST });
    const response = await axios.post(
      `${API_URL}wp-json/order-preparation-api/v1/order-send-by-product/`,requestedDataP
    );
    dispatch({
      type: ADD_PRODUCT_ORDER_FOR_PREP_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({ type: ADD_PRODUCT_ORDER_FOR_PREP_FAIL, error: error.message });
  }
};
