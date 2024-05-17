import Swal from "sweetalert2";
import {
    API_URL,
    GET_ORDER_NOT_AVAILABLE_REQUEST,
    GET_ORDER_NOT_AVAILABLE_SUCCESS,
    GET_ORDER_NOT_AVAILABLE_FAIL,
    ADD_ORDER_NOT_AVAILABLE_REQUEST,
    ADD_ORDER_NOT_AVAILABLE_SUCCESS,
    ADD_ORDER_NOT_AVAILABLE_FAIL
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

  export const OrderNotAvailableDataPo =
  (requestData) => async (dispatch) => {
    try {
      if(!requestData?.reminder_date){
        Swal.fire({
          icon: "error",
          title: "Please select a reminder date!",
        });
      }else{
        dispatch({ type: ADD_ORDER_NOT_AVAILABLE_REQUEST });
        const response = await axios.post(
           `${API_URL}wp-json/custom-so-create/v1/convert-so-order/`,requestData
        );
        dispatch({ type: ADD_ORDER_NOT_AVAILABLE_SUCCESS, payload: response?.data });
        return response;
      }
    } catch (error) {
      dispatch({ type: ADD_ORDER_NOT_AVAILABLE_FAIL, error: error.message });
    }
  };

  