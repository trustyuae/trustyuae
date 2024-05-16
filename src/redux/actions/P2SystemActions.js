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
  () => async (dispatch) => {
    try {
      dispatch({ type: ADD_ORDER_NOT_AVAILABLE_REQUEST });
      const response = await axios.post(
         `${API_URL}wp-json/custom-so-create/v1/convert-so-order/`
      );
      console.log(response,'response of order not available data po genaration')
      dispatch({ type: ADD_ORDER_NOT_AVAILABLE_SUCCESS, payload: response?.data });
      return response;
    } catch (error) {
      dispatch({ type: ADD_ORDER_NOT_AVAILABLE_FAIL, error: error.message });
    }
  };

  // export const FactoryEdit = (factoryId, data) => async (dispatch) => {
  //   try {
  //     dispatch({ type: EDIT_FACTORY_REQUEST });
  
  //     const response = await axios.post(
  //       `${url}custom-factory/v1/update-factory/${factoryId.id}`,
  //       data,
  //       {
  //         headers: {
  //           "Content-Type": "application/json" // Corrected the syntax
  //         }
  //       }
  //     );
  //     dispatch({ type: EDIT_FACTORY_SUCCESS, payload: response?.data });
  //   } catch (error) {
  //     dispatch({ type: EDIT_FACTORY_FAIL, error: error.message });
  //   }
  // };
  