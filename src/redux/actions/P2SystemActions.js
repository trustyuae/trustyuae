import {
  API_URL,
  GET_ORDER_NOT_AVAILABLE_REQUEST,
  GET_ORDER_NOT_AVAILABLE_SUCCESS,
  GET_ORDER_NOT_AVAILABLE_FAIL,
  ADD_ORDER_NOT_AVAILABLE_REQUEST,
  ADD_ORDER_NOT_AVAILABLE_SUCCESS,
  ADD_ORDER_NOT_AVAILABLE_FAIL,
  UPDATE_ORDER_NOT_AVAILABLE_STATUS_REQUEST,
  UPDATE_ORDER_NOT_AVAILABLE_STATUS_SUCCESS,
  UPDATE_ORDER_NOT_AVAILABLE_STATUS_FAIL,
  ADD_ORDER_NOT_AVAILABLE_REFUND_FAIL,
  ADD_ORDER_NOT_AVAILABLE_REFUND_SUCCESS,
  ADD_ORDER_NOT_AVAILABLE_REFUND_REQUEST,
  GET_PO_DETAILS_REQUEST,
  GET_PO_DETAILS_SUCCESS,
  GET_PO_DETAILS_FAIL,
  ADD_PO_REQUEST,
  ADD_PO_SUCCESS,
  ADD_PO_FAIL,
  ADD_MANUAL_PO_REQUEST,
  ADD_MANUAL_PO_SUCCESS,
  ADD_MANUAL_PO_FAIL,
  ADD_SCHEDULE_PO_REQUEST,
  ADD_SCHEDULE_PO_SUCCESS,
  ADD_SCHEDULE_PO_FAIL,
  GET_PERTICULAR_PO_DETAILS_REQUEST,
  GET_PERTICULAR_PO_DETAILS_SUCCESS,
  GET_PERTICULAR_PO_DETAILS_FAIL,
  GET_POM_SYSTEM_PRODUCTS_DETAILS_REQUEST,
  GET_POM_SYSTEM_PRODUCTS_DETAILS_SUCCESS,
  GET_POM_SYSTEM_PRODUCTS_DETAILS_FAIL,
  UPDATE_PO_DETAILS_REQUEST,
  UPDATE_PO_DETAILS_SUCCESS,
  UPDATE_PO_DETAILS_FAIL,
  GET_QUANTITY_DETAILS_REQUEST,
  GET_QUANTITY_DETAILS_SUCCESS,
  GET_QUANTITY_DETAILS_FAIL,
  GET_MANUAL_OR_SCHEDULED_PO_DETAILS_REQUEST,
  GET_MANUAL_OR_SCHEDULED_PO_DETAILS_FAIL,
  GET_MANUAL_OR_SCHEDULED_PO_DETAILS_SUCCESS,
  GET_QUANTITY_DETAILS_ON_PO_DETAILS_FAIL,
  GET_QUANTITY_DETAILS_ON_PO_DETAILS_SUCCESS,
  GET_QUANTITY_DETAILS_ON_PO_DETAILS_REQUEST,
} from "../constants/Constants";
import axios from "axios";
import ShowAlert from "../../utils/ShowAlert";

export const PoDetailsData =
  ({ apiUrl }) =>
    async (dispatch) => {
      try {
        dispatch({ type: GET_PO_DETAILS_REQUEST });
        const response = await axios.get(apiUrl);
        dispatch({
          type: GET_PO_DETAILS_SUCCESS,
          payload: response?.data,
        });
        return response;
      } catch (error) {
        dispatch({ type: GET_PO_DETAILS_FAIL, error: error.message });
      }
    };

export const ManualOrScheduledPoDetailsData =
  ({ apiUrl }) =>
    async (dispatch) => {
      try {
        dispatch({ type: GET_MANUAL_OR_SCHEDULED_PO_DETAILS_REQUEST });
        const response = await axios.get(apiUrl);
        dispatch({
          type: GET_MANUAL_OR_SCHEDULED_PO_DETAILS_SUCCESS,
          payload: response?.data,
        });
        return response;
      } catch (error) {
        dispatch({ type: GET_MANUAL_OR_SCHEDULED_PO_DETAILS_FAIL, error: error.message });
      }
    };

export const PerticularPoDetails =
  ({ apiUrl }) =>
    async (dispatch) => {
      try {
        dispatch({ type: GET_PERTICULAR_PO_DETAILS_REQUEST });
        const response = await axios.get(apiUrl);
        dispatch({
          type: GET_PERTICULAR_PO_DETAILS_SUCCESS,
          payload: response?.data,
        });
        return response;
      } catch (error) {
        dispatch({ type: GET_PERTICULAR_PO_DETAILS_FAIL, error: error.message });
      }
    };

export const QuantityPoDetails =
  (productId,{payload}) =>
    async (dispatch) => {
      try {
        dispatch({ type: GET_QUANTITY_DETAILS_REQUEST });
        const response = await axios.post(`${API_URL}wp-json/custom-preorder-product/v1/pre-order-product-detail/${productId}`,payload);
        console.log(response, 'rsponse of quntity details')
        dispatch({
          type: GET_QUANTITY_DETAILS_SUCCESS,
          payload: response?.data,
        });
        return response;
      } catch (error) {
        dispatch({ type: GET_QUANTITY_DETAILS_FAIL, error: error.message });
      }
    };

export const QuantityPoDetailsForModalInView =
  (productId, poId) =>
    async (dispatch) => {
      try {
        dispatch({ type: GET_QUANTITY_DETAILS_ON_PO_DETAILS_REQUEST });
        const response = await axios.get(`${API_URL}wp-json/preorder-product-po/v1/pre-order-product-detail-single-po/${productId}/${poId}`);
        console.log(response, 'rsponse of quntity details')
        dispatch({
          type: GET_QUANTITY_DETAILS_ON_PO_DETAILS_SUCCESS,
          payload: response?.data,
        });
        return response;
      } catch (error) {
        dispatch({ type: GET_QUANTITY_DETAILS_ON_PO_DETAILS_FAIL, error: error.message });
      }
    };

export const AddPO = (payload, navigate) => async (dispatch) => {
  try {
    dispatch({ type: ADD_PO_REQUEST });
    const response = await axios.post(
      `${API_URL}wp-json/custom-po-number/v1/po-id-generate/`,
      payload
    );

    if (response.data) {
      console.log(response, 'response addPO')
      const result = await ShowAlert('Success', response.data, "success", true, false, 'OK');
      if (result.isConfirmed) {
        navigate("/PO_ManagementSystem");
      }
    }
    dispatch({
      type: ADD_PO_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({ type: ADD_PO_FAIL, error: error.message });
    // return error
    const result = await ShowAlert('Error', error.response.data.message, "error", true, false, 'OK');

  }
};

export const AddManualPO = (payload, navigate) => async (dispatch) => {
  try {
    dispatch({ type: ADD_MANUAL_PO_REQUEST });
    const response = await axios.post(
      `${API_URL}wp-json/custom-manual-order/v1/post-order-manual/`,
      payload
    );
    if (response.data) {
      const result = await ShowAlert('Success', response.data, "success", true, false, 'OK');
      if (result.isConfirmed) navigate("/PO_ManagementSystem");
    }
    dispatch({
      type: ADD_MANUAL_PO_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({ type: ADD_MANUAL_PO_FAIL, error: error.message });
  }
};

export const AddSchedulePO = (payload, navigate) => async (dispatch) => {
  try {
    dispatch({ type: ADD_SCHEDULE_PO_REQUEST });
    const response = await axios.post(
      `${API_URL}wp-json/custom-schedule-order/v1/post-order-schedule/`,
      payload
    );
    if (response.data) {
      const result = await ShowAlert('Success', response.data, "success", true, false, 'OK');
      if (result.isConfirmed) navigate("/PO_ManagementSystem");
    }
    dispatch({
      type: ADD_SCHEDULE_PO_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({ type: ADD_SCHEDULE_PO_FAIL, error: error.message });
  }
};

export const UpdatePODetails =
  ({ apiUrl }, payload, navigate) =>
    async (dispatch) => {
      try {
        dispatch({ type: UPDATE_PO_DETAILS_REQUEST });
        const response = await axios.post(apiUrl, payload);
        const result = await ShowAlert(response.data.message, '', "success", true, false, 'OK');
        if (result.isConfirmed) navigate("/PO_ManagementSystem");

        dispatch({
          type: UPDATE_PO_DETAILS_SUCCESS,
          payload: response.data,
        });

        console.log(response.data, "updatedData");
        return response.data;
      } catch (error) {
        dispatch({ type: UPDATE_PO_DETAILS_FAIL, error: error.message });
      }
    };

export const PomSystemProductsDetails =
  ({ apiUrl }) =>
    async (dispatch) => {
      try {
        dispatch({ type: GET_POM_SYSTEM_PRODUCTS_DETAILS_REQUEST });
        const response = await axios.get(apiUrl);
        dispatch({
          type: GET_POM_SYSTEM_PRODUCTS_DETAILS_SUCCESS,
          payload: response?.data,
        });
        return response;
      } catch (error) {
        dispatch({
          type: GET_POM_SYSTEM_PRODUCTS_DETAILS_FAIL,
          error: error.message,
        });
      }
    };

export const OrderNotAvailableData =
  ({ apiUrl }) =>
    async (dispatch) => {
      try {
        dispatch({ type: GET_ORDER_NOT_AVAILABLE_REQUEST });
        const response = await axios.get(apiUrl);
        console.log(response, "response of order not available data");
        dispatch({
          type: GET_ORDER_NOT_AVAILABLE_SUCCESS,
          payload: response?.data,
        });
        return response;
      } catch (error) {
        dispatch({ type: GET_ORDER_NOT_AVAILABLE_FAIL, error: error.message });
      }
    };

export const OrderNotAvailableDataPo = (requestData) => async (dispatch) => {
  try {
    if (!requestData?.reminder_date) {
      await ShowAlert("Please select a reminder date!", '', "error", false, false, '', '', 1000);
    } else {
      dispatch({ type: ADD_ORDER_NOT_AVAILABLE_REQUEST });
      const response = await axios.post(
        `${API_URL}wp-json/custom-so-create/v1/convert-so-order/`,
        requestData
      );
      dispatch({
        type: ADD_ORDER_NOT_AVAILABLE_SUCCESS,
        payload: response?.data,
      });
      return response;
    }
  } catch (error) {
    dispatch({ type: ADD_ORDER_NOT_AVAILABLE_FAIL, error: error.message });
  }
};

export const OrderNotAvailableDataStatus =
  (requestedDataS) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_ORDER_NOT_AVAILABLE_STATUS_REQUEST });
      const response = await axios
        .post(
          `${API_URL}wp-json/order-not-update/v1/order-not-btn/`,
          requestedDataS
        )
        .then(async (response) => {
          await ShowAlert("Status Updated Successfully!", '', "success", false, false, '', '', 1000);
        })
        .catch((error) => {
          console.error(error);
        });
      dispatch({
        type: UPDATE_ORDER_NOT_AVAILABLE_STATUS_SUCCESS,
        payload: response?.data,
      });
      return response;
    } catch (error) {
      dispatch({
        type: UPDATE_ORDER_NOT_AVAILABLE_STATUS_FAIL,
        error: error.message,
      });
    }
  };

export const OrderNotAvailableRefund =
  (requestedInfo, orderIds, username, password) => async (dispatch) => {
    try {
      dispatch({ type: ADD_ORDER_NOT_AVAILABLE_REFUND_REQUEST });
      const basicAuth = {
        username: username,
        password: password,
      };
      const refundPromises = orderIds.map(async (id) => {
        const response = await axios.post(
          `${API_URL}/wp-json/wc/v3/orders/${id}/refunds`,
          requestedInfo,
          {
            auth: basicAuth,
          }
        );
        return response.data;
      });

      const refunds = await Promise.all(refundPromises);
      await ShowAlert("Refund process completed successfully!", '', "success", false, false, '', '', 1000);
      dispatch({
        type: ADD_ORDER_NOT_AVAILABLE_REFUND_SUCCESS,
        payload: refunds,
      });

      return refunds;
    } catch (error) {
      console.error(error);
      await ShowAlert("Error in refund process!", '', "error", false, false, '', '', 1000);
      dispatch({
        type: ADD_ORDER_NOT_AVAILABLE_REFUND_FAIL,
        error: error.message,
      });
      throw error;
    }
  };
