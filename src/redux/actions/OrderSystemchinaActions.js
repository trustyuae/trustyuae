import Swal from "sweetalert2";
import ShowAlert from "../../utils/ShowAlert";
import {
  GET_ORDER_SYSTEM_CHINA_REQUEST,
  GET_ORDER_SYSTEM_CHINA_SUCCESS,
  GET_ORDER_SYSTEM_CHINA_FAIL,
  GET_ORDER_DETAILS_CHINA_REQUEST,
  GET_ORDER_DETAILS_CHINA_SUCCESS,
  GET_ORDER_DETAILS_CHINA_FAIL,
  ADD_MESSAGE_CHINA_REQUEST,
  ADD_MESSAGE_CHINA_SUCCESS,
  ADD_MESSAGE_CHINA_FAIL,
  API_URL,
  UPLOAD_ATTACH_FILE_CHINA_REQUEST,
  UPLOAD_ATTACH_FILE_CHINA_SUCCESS,
  UPLOAD_ATTACH_FILE_CHINA_FAIL,
  INSERT_ORDER_PICKUP_CHINA_REQUEST,
  INSERT_ORDER_PICKUP_CHINA_SUCCESS,
  INSERT_ORDER_PICKUP_CHINA_FAIL,
  INSERT_ORDER_PICKUP_CANCEL_CHINA_REQUEST,
  INSERT_ORDER_PICKUP_CANCEL_CHINA_SUCCESS,
  INSERT_ORDER_PICKUP_CANCEL_CHINA_FAIL,
  CUSTOM_ORDER_FINISH_CHINA_REQUEST,
  CUSTOM_ORDER_FINISH_CHINA_SUCCESS,
  CUSTOM_ORDER_FINISH_CHINA_FAIL,
  GET_COMPLETED_ORDER_SYSTEM_CHINA_REQUEST,
  GET_COMPLETED_ORDER_SYSTEM_CHINA_SUCCESS,
  GET_COMPLETED_ORDER_SYSTEM_CHINA_FAIL,
  GET_COMPLETED_ORDER_DETAILS_SYSTEM_CHINA_FAIL,
  GET_COMPLETED_ORDER_DETAILS_SYSTEM_CHINA_SUCCESS,
  GET_COMPLETED_ORDER_DETAILS_SYSTEM_CHINA_REQUEST,
  UPLOAD_OVERALL_ATTACH_FILE_CHINA_SUCCESS,
  UPLOAD_OVERALL_ATTACH_FILE_CHINA_FAIL,
  UPLOAD_OVERALL_ATTACH_FILE_CHINA_REQUEST,
  CUSTOM_ORDER_ON_HOLD_CHINA_REQUEST,
  CUSTOM_ORDER_ON_HOLD_CHINA_SUCCESS,
  CUSTOM_ORDER_ON_HOLD_CHINA_FAIL,
  CUSTOM_ORDER_ON_HOLD_FINISH_CHINA_REQUEST,
  CUSTOM_ORDER_ON_HOLD_FINISH_CHINA_FAIL,
  CUSTOM_ORDER_ON_HOLD_FINISH_CHINA_SUCCESS,
  GET_ON_HOLD_ORDER_DETAILS_SYSTEM_CHINA_SUCCESS,
  GET_ON_HOLD_ORDER_DETAILS_SYSTEM_CHINA_FAIL,
  GET_ON_HOLD_ORDER_DETAILS_SYSTEM_CHINA_REQUEST,
  CUSTOM_ORDER_SEND_UAE_REQUEST,
  CUSTOM_ORDER_SEND_UAE_FAIL,
  CUSTOM_ORDER_SEND_UAE_SUCCESS,
} from "../constants/Constants";
import axios from "axios";

const token = JSON.parse(localStorage.getItem("token"));
const headers = {
  Authorization: `Live ${token}`,
};

export const OrderSystemGet =
  ({ apiUrl }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_ORDER_SYSTEM_CHINA_REQUEST });

      const response = await axios.get(apiUrl, { headers });
      dispatch({
        type: GET_ORDER_SYSTEM_CHINA_SUCCESS,
        payload: response?.data,
      });
      return response;
    } catch (error) {
      dispatch({ type: GET_ORDER_SYSTEM_CHINA_FAIL, error: error.message });
    }
  };

export const CompletedOrderSystemGet =
  ({ apiUrl }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_COMPLETED_ORDER_SYSTEM_CHINA_REQUEST });

      const response = await axios.get(apiUrl, { headers });
      dispatch({
        type: GET_COMPLETED_ORDER_SYSTEM_CHINA_SUCCESS,
        payload: response?.data,
      });
      return response;
    } catch (error) {
      dispatch({
        type: GET_COMPLETED_ORDER_SYSTEM_CHINA_FAIL,
        error: error.message,
      });
    }
  };

export const CompletedOrderDetailsGet = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_COMPLETED_ORDER_DETAILS_SYSTEM_CHINA_REQUEST });

    const response = await axios.get(
      `${API_URL}wp-json/custom-orders-completed/v1/completed-orders/?warehouse=China&orderid=${id}`,
      { headers }
    );
    dispatch({
      type: GET_COMPLETED_ORDER_DETAILS_SYSTEM_CHINA_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({
      type: GET_COMPLETED_ORDER_DETAILS_SYSTEM_CHINA_FAIL,
      error: error.message,
    });
  }
};

export const OnHoldOrderDetailsGet = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_ON_HOLD_ORDER_DETAILS_SYSTEM_CHINA_REQUEST });

    const response = await axios.get(
      `${API_URL}wp-json/custom-onhold-orders/v1/onhold-orders/?warehouse=China&orderid=${id}`,
      { headers }
    );
    dispatch({
      type: GET_ON_HOLD_ORDER_DETAILS_SYSTEM_CHINA_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({
      type: GET_ON_HOLD_ORDER_DETAILS_SYSTEM_CHINA_FAIL,
      error: error.message,
    });
  }
};

export const ReserveOrderDetailsGet = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_COMPLETED_ORDER_DETAILS_SYSTEM_CHINA_REQUEST });

    const response = await axios.get(
      `${API_URL}wp-json/custom-reserved-orders/v1/reserved-orders/?warehouse=China&orderid=${id}`,
      { headers }
    );
    dispatch({
      type: GET_COMPLETED_ORDER_DETAILS_SYSTEM_CHINA_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({
      type: GET_COMPLETED_ORDER_DETAILS_SYSTEM_CHINA_FAIL,
      error: error.message,
    });
  }
};

export const OrderDetailsGet =
  ({ id }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_ORDER_DETAILS_CHINA_REQUEST });

      const response = await axios.get(
        `${API_URL}wp-json/custom-orders-new/v1/orders/?warehouse=China&orderid=${id}`,
        { headers }
      );
      dispatch({
        type: GET_ORDER_DETAILS_CHINA_SUCCESS,
        payload: response?.data,
      });
      return response;
    } catch (error) {
      dispatch({ type: GET_ORDER_DETAILS_CHINA_FAIL, error: error.message });
    }
  };

export const AttachmentFileUpload =
  ({ user_id, order_id, item_id, variation_id, selectedFile }) =>
  async (dispatch) => {
    try {
      dispatch({ type: UPLOAD_ATTACH_FILE_CHINA_REQUEST });
      const requestData = new FormData();
      requestData.append("dispatch_image", selectedFile);
      const response = await axios.post(
        `${API_URL}wp-json/custom-order-attachment/v1/insert-attachment/${user_id}/${order_id}/${item_id}/${variation_id}/?warehouse=China&`,
        requestData,
        {
          headers: {
            Authorization: `Live ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch({
        type: UPLOAD_ATTACH_FILE_CHINA_SUCCESS,
        payload: response?.data,
      });
      return response;
    } catch (error) {
      dispatch({ type: UPLOAD_ATTACH_FILE_CHINA_FAIL, error: error.message });
    }
  };

export const OverAllAttachmentFileUpload =
  ({ order_id, order_dispatch_image }) =>
  async (dispatch) => {
    try {
      dispatch({ type: UPLOAD_OVERALL_ATTACH_FILE_CHINA_REQUEST });
      const requestData = new FormData();
      requestData.append("order_dispatch_image", order_dispatch_image);
      const response = await axios.post(
        `${API_URL}wp-json/order-complete-attachment/v1/order-attachment/${order_id}/?warehouse=China`,
        requestData,
        {
          headers: {
            Authorization: `Live ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch({
        type: UPLOAD_OVERALL_ATTACH_FILE_CHINA_SUCCESS,
        payload: response?.data,
      });
      return response;
    } catch (error) {
      dispatch({
        type: UPLOAD_OVERALL_ATTACH_FILE_CHINA_FAIL,
        error: error.message,
      });
    }
  };

export const AddMessage = (requestData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_MESSAGE_CHINA_REQUEST });
    const response = await axios.post(
      `${API_URL}wp-json/custom-message-note/v1/order-note/?warehouse=China`,
      requestData,
      { headers }
    );
    dispatch({ type: ADD_MESSAGE_CHINA_SUCCESS, payload: response?.data });
    return response;
  } catch (error) {
    dispatch({ type: ADD_MESSAGE_CHINA_FAIL, error: error.message });
  }
};

export const InsertOrderPickup = (requestData) => async (dispatch) => {
  try {
    dispatch({ type: INSERT_ORDER_PICKUP_CHINA_REQUEST });

    const response = await axios.post(
      `${API_URL}wp-json/custom-order-pick/v1/insert-order-pickup/?warehouse=China`,
      requestData,
      { headers }
    );
    dispatch({
      type: INSERT_ORDER_PICKUP_CHINA_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({ type: INSERT_ORDER_PICKUP_CHINA_FAIL, error: error.message });
  }
};

export const InsertOrderPickupCancel = (requestData) => async (dispatch) => {
  try {
    dispatch({ type: INSERT_ORDER_PICKUP_CANCEL_CHINA_REQUEST });

    const response = await axios.post(
      `${API_URL}wp-json/custom-order-cancel/v1/insert-order-cancel/?warehouse=China`,
      requestData,
      { headers }
    );
    dispatch({
      type: INSERT_ORDER_PICKUP_CANCEL_CHINA_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({
      type: INSERT_ORDER_PICKUP_CANCEL_CHINA_FAIL,
      error: error.message,
    });
  }
};

export const CustomOrderFinish =
  (user_id, id, navigate) => async (dispatch) => {
    dispatch({ type: CUSTOM_ORDER_FINISH_CHINA_REQUEST });
    try {
      const response = await axios.post(
        `${API_URL}wp-json/custom-order-finish/v1/finish-order/${user_id}/${id}/?warehouse=China`,
        { headers }
      );
      dispatch({
        type: CUSTOM_ORDER_FINISH_CHINA_SUCCESS,
        payload: response.data,
      });
      return response;
    } catch (error) {
      dispatch({ type: CUSTOM_ORDER_FINISH_CHINA_FAIL, error: error.message });
    }
  };

export const CustomOrderOH = (result, navigate) => async (dispatch) => {
  dispatch({ type: CUSTOM_ORDER_ON_HOLD_CHINA_REQUEST });
  try {
    const response = await axios.post(
      `${API_URL}wp-json/custom-onhold-orders-convert/v1/update_onhold_note/?warehouse=China`,
      result,
      { headers }
    );
    dispatch({
      type: CUSTOM_ORDER_ON_HOLD_CHINA_SUCCESS,
      payload: response.data,
    });
    if (response.status === 200) {
      navigate("/on_hold_orders_system");
    }
    return response;
  } catch (error) {
    dispatch({ type: CUSTOM_ORDER_ON_HOLD_CHINA_FAIL, error: error.message });
  }
};

export const CustomOrderFinishOH =
  (user_id, id, navigate) => async (dispatch) => {
    dispatch({ type: CUSTOM_ORDER_ON_HOLD_FINISH_CHINA_REQUEST });
    try {
      const response = await axios.post(
        `${API_URL}wp-json/custom-onhold-order-finish/v1/onhold-finish-order/${user_id}/${id}/?warehouse=China`,
        { headers }
      );
      dispatch({
        type: CUSTOM_ORDER_ON_HOLD_FINISH_CHINA_SUCCESS,
        payload: response.data,
      });
      if (response.data.status_code === 200) {
        await Swal.fire({
          title: response.data.message,
          icon: "success",
          showConfirmButton: true,
        });
        navigate("/on_hold_orders_system");
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          showConfirmButton: true,
        });
      }
      return response;
    } catch (error) {
      dispatch({
        type: CUSTOM_ORDER_ON_HOLD_FINISH_CHINA_FAIL,
        error: error.message,
      });
    }
  };

export const CustomItemSendToUAE = (id, navigate) => async (dispatch) => {
  dispatch({ type: CUSTOM_ORDER_SEND_UAE_REQUEST });

  try {
    const response = await axios.post(
      `${API_URL}wp-json/custom-push-order/v1/push-order-china/${id}`,
      { headers }
    );

    dispatch({
      type: CUSTOM_ORDER_SEND_UAE_SUCCESS,
      payload: response.data,
    });

    // if (response.status === 200) {
    //   await Swal.fire({
    //     title: response.data.message,
    //     icon: "success",
    //     showConfirmButton: true,
    //   });
    //   navigate("/on_hold_orders_system");
    // } else {
    //   Swal.fire({
    //     title: response.data.message,
    //     icon: "error",
    //     showConfirmButton: true,
    //   });
    // }

    return response;
  } catch (error) {
    dispatch({
      type: CUSTOM_ORDER_SEND_UAE_FAIL,
      error: error.message,
    });
  }
};
