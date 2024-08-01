import Swal from "sweetalert2";
import ShowAlert from "../../utils/ShowAlert";
import {
  GET_ORDER_SYSTEM_REQUEST,
  GET_ORDER_SYSTEM_SUCCESS,
  GET_ORDER_SYSTEM_FAIL,
  GET_ORDER_DETAILS_REQUEST,
  GET_ORDER_DETAILS_SUCCESS,
  GET_ORDER_DETAILS_FAIL,
  ADD_MESSAGE_REQUEST,
  ADD_MESSAGE_SUCCESS,
  ADD_MESSAGE_FAIL,
  API_URL,
  UPLOAD_ATTACH_FILE_REQUEST,
  UPLOAD_ATTACH_FILE_SUCCESS,
  UPLOAD_ATTACH_FILE_FAIL,
  INSERT_ORDER_PICKUP_REQUEST,
  INSERT_ORDER_PICKUP_SUCCESS,
  INSERT_ORDER_PICKUP_FAIL,
  INSERT_ORDER_PICKUP_CANCEL_REQUEST,
  INSERT_ORDER_PICKUP_CANCEL_SUCCESS,
  INSERT_ORDER_PICKUP_CANCEL_FAIL,
  CUSTOM_ORDER_FINISH_REQUEST,
  CUSTOM_ORDER_FINISH_SUCCESS,
  CUSTOM_ORDER_FINISH_FAIL,
  GET_COMPLETED_ORDER_SYSTEM_REQUEST,
  GET_COMPLETED_ORDER_SYSTEM_SUCCESS,
  GET_COMPLETED_ORDER_SYSTEM_FAIL,
  GET_COMPLETED_ORDER_DETAILS_SYSTEM_FAIL,
  GET_COMPLETED_ORDER_DETAILS_SYSTEM_SUCCESS,
  GET_COMPLETED_ORDER_DETAILS_SYSTEM_REQUEST,
  UPLOAD_OVERALL_ATTACH_FILE_SUCCESS,
  UPLOAD_OVERALL_ATTACH_FILE_FAIL,
  UPLOAD_OVERALL_ATTACH_FILE_REQUEST,
  CUSTOM_ORDER_ON_HOLD_REQUEST,
  CUSTOM_ORDER_ON_HOLD_SUCCESS,
  CUSTOM_ORDER_ON_HOLD_FAIL,
  CUSTOM_ORDER_ON_HOLD_FINISH_REQUEST,
  CUSTOM_ORDER_ON_HOLD_FINISH_FAIL,
  CUSTOM_ORDER_ON_HOLD_FINISH_SUCCESS,
  GET_ON_HOLD_ORDER_DETAILS_SYSTEM_SUCCESS,
  GET_ON_HOLD_ORDER_DETAILS_SYSTEM_FAIL,
  GET_ON_HOLD_ORDER_DETAILS_SYSTEM_REQUEST,
} from "../constants/Constants";
import axios from "axios";


const token = JSON.parse(localStorage.getItem('token'))
const headers = {
  Authorization: `Live ${token}`,
};

export const OrderSystemGet =
  ({ apiUrl }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_ORDER_SYSTEM_REQUEST });

      const response = await axios.get(apiUrl,{headers});
      dispatch({ type: GET_ORDER_SYSTEM_SUCCESS, payload: response?.data });
      return response;
    } catch (error) {
      dispatch({ type: GET_ORDER_SYSTEM_FAIL, error: error.message });
    }
  };

export const CompletedOrderSystemGet =
  ({ apiUrl }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_COMPLETED_ORDER_SYSTEM_REQUEST });

      const response = await axios.get(apiUrl,{headers});
      dispatch({
        type: GET_COMPLETED_ORDER_SYSTEM_SUCCESS,
        payload: response?.data,
      });
      return response;
    } catch (error) {
      dispatch({ type: GET_COMPLETED_ORDER_SYSTEM_FAIL, error: error.message });
    }
  };

export const CompletedOrderDetailsGet = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_COMPLETED_ORDER_DETAILS_SYSTEM_REQUEST });

    const response = await axios.get(
      `${API_URL}wp-json/custom-orders-completed/v1/completed-orders/?orderid=${id}`,{headers}
    );
    dispatch({
      type: GET_COMPLETED_ORDER_DETAILS_SYSTEM_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({
      type: GET_COMPLETED_ORDER_DETAILS_SYSTEM_FAIL,
      error: error.message,
    });
  }
};

export const OnHoldOrderDetailsGet = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_ON_HOLD_ORDER_DETAILS_SYSTEM_REQUEST});

    const response = await axios.get(
      `${API_URL}wp-json/custom-onhold-orders/v1/onhold-orders/?orderid=${id}`,{headers}
    );
    dispatch({
      type: GET_ON_HOLD_ORDER_DETAILS_SYSTEM_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({
      type: GET_ON_HOLD_ORDER_DETAILS_SYSTEM_FAIL,
      error: error.message,
    });
  }
};

export const ReserveOrderDetailsGet = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_COMPLETED_ORDER_DETAILS_SYSTEM_REQUEST });

    const response = await axios.get(
      `${API_URL}wp-json/custom-reserved-orders/v1/reserved-orders/?orderid=${id}`,{headers}
    );
    dispatch({
      type: GET_COMPLETED_ORDER_DETAILS_SYSTEM_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({
      type: GET_COMPLETED_ORDER_DETAILS_SYSTEM_FAIL,
      error: error.message,
    });
  }
};

export const OrderDetailsGet =
  ({ id }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_ORDER_DETAILS_REQUEST });

      const response = await axios.get(
        `${API_URL}wp-json/custom-orders-new/v1/orders/?orderid=${id}`,{headers}
      );
      dispatch({ type: GET_ORDER_DETAILS_SUCCESS, payload: response?.data });
      return response;
    } catch (error) {
      dispatch({ type: GET_ORDER_DETAILS_FAIL, error: error.message });
    }
  };

export const AttachmentFileUpload =
  ({ user_id, order_id, item_id, variation_id, selectedFile }) =>
  async (dispatch) => {
    try {
      dispatch({ type: UPLOAD_ATTACH_FILE_REQUEST });
      const requestData = new FormData();
      requestData.append("dispatch_image", selectedFile);
      const response = await axios.post(
        `${API_URL}wp-json/custom-order-attachment/v1/insert-attachment/${user_id}/${order_id}/${item_id}/${variation_id}`,
        requestData,
        {
          headers: {
            Authorization: `Live ${token}`,
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

export const OverAllAttachmentFileUpload =
  ({ order_id, order_dispatch_image }) =>
  async (dispatch) => {
    try {
      dispatch({ type: UPLOAD_OVERALL_ATTACH_FILE_REQUEST });
      const requestData = new FormData();
      requestData.append("order_dispatch_image", order_dispatch_image);
      const response = await axios.post(
        `${API_URL}wp-json/order-complete-attachment/v1/order-attachment/${order_id}`,
        requestData,
        {
          headers: {
            Authorization: `Live ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch({
        type: UPLOAD_OVERALL_ATTACH_FILE_SUCCESS,
        payload: response?.data,
      });
      return response;
    } catch (error) {
      dispatch({ type: UPLOAD_OVERALL_ATTACH_FILE_FAIL, error: error.message });
    }
  };

export const AddMessage = (requestData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_MESSAGE_REQUEST });
    const response = await axios.post(
      `${API_URL}wp-json/custom-message-note/v1/order-note/`,
      requestData,{headers}
    );
    dispatch({ type: ADD_MESSAGE_SUCCESS, payload: response?.data });
    return response;
  } catch (error) {
    dispatch({ type: ADD_MESSAGE_FAIL, error: error.message });
  }
};

export const InsertOrderPickup = (requestData) => async (dispatch) => {
  try {
    dispatch({ type: INSERT_ORDER_PICKUP_REQUEST });

    const response = await axios.post(
      `${API_URL}wp-json/custom-order-pick/v1/insert-order-pickup/`,
      requestData,{headers}
    );
    dispatch({ type: INSERT_ORDER_PICKUP_SUCCESS, payload: response?.data });
    return response;
  } catch (error) {
    dispatch({ type: INSERT_ORDER_PICKUP_FAIL, error: error.message });
  }
};

export const InsertOrderPickupCancel = (requestData) => async (dispatch) => {
  try {
    dispatch({ type: INSERT_ORDER_PICKUP_CANCEL_REQUEST });

    const response = await axios.post(
      `${API_URL}wp-json/custom-order-cancel/v1/insert-order-cancel/`,
      requestData,{headers}
    );
    dispatch({
      type: INSERT_ORDER_PICKUP_CANCEL_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({ type: INSERT_ORDER_PICKUP_CANCEL_FAIL, error: error.message });
  }
};

export const CustomOrderFinish =
  (user_id, id, navigate) => async (dispatch) => {
    dispatch({ type: CUSTOM_ORDER_FINISH_REQUEST });
    try {
      const response = await axios.post(
        `${API_URL}wp-json/custom-order-finish/v1/finish-order/${user_id}/${id}`,{headers}
      );
      dispatch({ type: CUSTOM_ORDER_FINISH_SUCCESS, payload: response.data });
      return response;
    } catch (error) {
      dispatch({ type: CUSTOM_ORDER_FINISH_FAIL, error: error.message });
    }
  };

export const CustomOrderOH = (result, navigate) => async (dispatch) => {
  dispatch({ type: CUSTOM_ORDER_ON_HOLD_REQUEST });
  try {
    const response = await axios.post(
      `${API_URL}wp-json/custom-onhold-orders-convert/v1/update_onhold_note/`,
      result,{headers}
    );
    dispatch({ type: CUSTOM_ORDER_ON_HOLD_SUCCESS, payload: response.data });
    if (response.status === 200) {
      navigate("/on_hold_orders_system");
    }
    return response;
  } catch (error) {
    dispatch({ type: CUSTOM_ORDER_ON_HOLD_FAIL, error: error.message });
  }
};

export const CustomOrderFinishOH =
  (user_id, id, navigate) => async (dispatch) => {
    dispatch({ type: CUSTOM_ORDER_ON_HOLD_FINISH_REQUEST });
    try {
      const response = await axios.post(
        `${API_URL}wp-json/custom-onhold-order-finish/v1/onhold-finish-order/${user_id}/${id}`,{headers}
      );
      dispatch({
        type: CUSTOM_ORDER_ON_HOLD_FINISH_SUCCESS,
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
        type: CUSTOM_ORDER_ON_HOLD_FINISH_FAIL,
        error: error.message,
      });
    }
  };
