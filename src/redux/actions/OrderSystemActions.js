import {
  GET_ORDER_SYSTEM_REQUEST,
  GET_ORDER_SYSTEM_SUCCESS,
  GET_ORDER_SYSTEM_FAIL,
  GET_ORDER_DETAILS_REQUEST,
  GET_ORDER_DETAILS_SUCCESS,
  GET_ORDER_DETAILS_FAIL,
  API_URL,
  UPLOAD_ATTACH_FILE_REQUEST,
  UPLOAD_ATTACH_FILE_SUCCESS,
  UPLOAD_ATTACH_FILE_FAIL,
  INSERT_ORDER_PICKUP_REQUEST,
  INSERT_ORDER_PICKUP_SUCCESS,
  INSERT_ORDER_PICKUP_FAIL,
  CUSTOM_ORDER_FINISH_REQUEST,
  CUSTOM_ORDER_FINISH_SUCCESS,
  CUSTOM_ORDER_FINISH_FAIL,
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

export const OrderDetailsGet =
  ({ id }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_ORDER_DETAILS_REQUEST });

      const response = await axios.get(
        `${API_URL}wp-json/custom-orders-new/v1/orders/?orderid=${id}`
      );
      console.log(response,'response of OrderDetailsGet Api')
      dispatch({ type: GET_ORDER_DETAILS_SUCCESS, payload: response?.data });
      return response;
    } catch (error) {
      dispatch({ type: GET_ORDER_DETAILS_FAIL, error: error.message });
    }
  };

export const AttachmentFileUpload =
  ({ user_id, id, selectedFile }) =>
  async (dispatch) => {
    try {
      dispatch({ type: UPLOAD_ATTACH_FILE_REQUEST });

      const requestData = new FormData();
      requestData.append("dispatch_image", selectedFile);
      const response = await axios.post(
        `${API_URL}wp-json/custom-order-attachment/v1/insert-attachment/${user_id}/${id}`,
        requestData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch({ type: UPLOAD_ATTACH_FILE_SUCCESS, payload: response?.data });
      return response;
    } catch (error) {
      dispatch({ type: UPLOAD_ATTACH_FILE_FAIL, error: error.message });
    }
  };

export const InsertOrderPickup = (requestData) => async (dispatch) => {
  // console.log(requestData, "requestData");
  try {
    dispatch({ type: INSERT_ORDER_PICKUP_REQUEST });

    const response = await axios.post(
      `${API_URL}wp-json/custom-order-pick/v1/insert-order-pickup/`,
      requestData
    );
    console.log(response,'InsertOrderPickup')
    dispatch({ type: INSERT_ORDER_PICKUP_SUCCESS, payload: response?.data });
    return response;
  } catch (error) {
    dispatch({ type: INSERT_ORDER_PICKUP_FAIL, error: error.message });
  }
};

export const CustomOrderFinish =
  ({ user_id, id }) =>
  async (dispatch) => {
    try {
      dispatch({ type: CUSTOM_ORDER_FINISH_REQUEST });

      const response = await axios.post(
        `${API_URL}wp-json/custom-order-finish/v1/finish-order/${user_id}/${id}`
      );
      dispatch({ type: CUSTOM_ORDER_FINISH_SUCCESS, payload: response?.data });
      return response;
    } catch (error) {
      dispatch({ type: CUSTOM_ORDER_FINISH_FAIL, error: error.message });
    }
  };

  