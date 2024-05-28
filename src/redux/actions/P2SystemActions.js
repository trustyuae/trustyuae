import Swal from "sweetalert2";
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
  GET_MANUAL_PO_DETAILS_REQUEST,
  GET_MANUAL_PO_DETAILS_SUCCESS,
  GET_MANUAL_PO_DETAILS_FAIL,
  GET_SCHEDULE_PO_DETAILS_REQUEST,
  GET_SCHEDULE_PO_DETAILS_SUCCESS,
  GET_SCHEDULE_PO_DETAILS_FAIL,
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
} from "../constants/Constants";
import axios from "axios";

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

export const ManualPoDetailsData =
  ({ apiUrl }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_MANUAL_PO_DETAILS_REQUEST });
      const response = await axios.get(apiUrl);
      dispatch({
        type: GET_MANUAL_PO_DETAILS_SUCCESS,
        payload: response?.data,
      });
      return response;
    } catch (error) {
      dispatch({ type: GET_MANUAL_PO_DETAILS_FAIL, error: error.message });
    }
  };

export const SchedulePoDetailsData =
  ({ apiUrl }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_SCHEDULE_PO_DETAILS_REQUEST });
      const response = await axios.get(apiUrl);
      dispatch({
        type: GET_SCHEDULE_PO_DETAILS_SUCCESS,
        payload: response?.data,
      });
      return response;
    } catch (error) {
      dispatch({ type: GET_SCHEDULE_PO_DETAILS_FAIL, error: error.message });
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
  (productId) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_QUANTITY_DETAILS_REQUEST });
      const response = await axios.get(`${API_URL}wp-json/custom-preorder-product/v1/pre-order-product-detail/${productId}`);
      console.log(response,'rsponse of quntity details')
      dispatch({
        type: GET_QUANTITY_DETAILS_SUCCESS,
        payload: response?.data,
      });
      return response;
    } catch (error) {
      dispatch({ type: GET_QUANTITY_DETAILS_FAIL, error: error.message });
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
      await Swal.fire({
        text: response.data,
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/PO_ManagementSystem");
    }
    dispatch({
      type: ADD_PO_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({ type: ADD_PO_FAIL, error: error.message });
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
      await Swal.fire({
        text: response.data,
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/PO_ManagementSystem");
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
      await Swal.fire({
        text: response.data,
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/PO_ManagementSystem");
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

      Swal.fire({
        icon: "success",
        title: response.data.message,
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/PO_ManagementSystem");
        }
      });

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
      Swal.fire({
        icon: "error",
        title: "Please select a reminder date!",
      });
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
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Status Updated Successfully!",
          });
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

// export const OrderNotAvailableRefund = (requestedInfo,id,username,password) => async (dispatch) => {
//   try {
//     dispatch({ type: ADD_ORDER_NOT_AVAILABLE_REFUND_REQUEST });
//     const basicAuth = {
//       username: username,
//       password: password
//     };
//     const response = await axios
//       .post(
//         `${API_URL}/wp-json/wc/v3/orders/${id}/refunds`,
//         requestedInfo,
//         {
//           auth: basicAuth
//         }
//       )
//       .then((response) => {
//         Swal.fire({
//           icon: "success",
//           title: "refund process completed Successfully!",
//         });
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//     dispatch({
//       type: ADD_ORDER_NOT_AVAILABLE_REFUND_SUCCESS,
//       payload: response?.data,
//     });
//     return response;
//   } catch (error) {
//     dispatch({
//       type: ADD_ORDER_NOT_AVAILABLE_REFUND_FAIL,
//       error: error.message,
//     });
//   }
// };

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

      Swal.fire({
        icon: "success",
        title: "Refund process completed successfully!",
      });

      dispatch({
        type: ADD_ORDER_NOT_AVAILABLE_REFUND_SUCCESS,
        payload: refunds,
      });

      return refunds;
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error in refund process!",
      });
      dispatch({
        type: ADD_ORDER_NOT_AVAILABLE_REFUND_FAIL,
        error: error.message,
      });
      throw error;
    }
  };
