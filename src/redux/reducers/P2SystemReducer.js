import {
    CLEAR_ERRORS,
    GET_ORDER_NOT_AVAILABLE_REQUEST,
    GET_ORDER_NOT_AVAILABLE_SUCCESS,
    GET_ORDER_NOT_AVAILABLE_FAIL
  } from "../constants/Constants";
  
  const initialState = {
    ordersNotAvailable: [],
    isOrdersNotAvailable: false,
    error: null,
  };
  
  const OrderNotAvailableReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_ORDER_NOT_AVAILABLE_REQUEST:
        return { ...state, isOrders: true };
      case GET_ORDER_NOT_AVAILABLE_SUCCESS:
        return { ...state, isOrders: false, ordersNotAvailable: action.payload };
      case GET_ORDER_NOT_AVAILABLE_FAIL:
        return { ...state, isOrders: false, error: action.payload };

      case CLEAR_ERRORS:
        return { ...state, error: null };
      default:
        return state;
    }
  };
  
  export default OrderNotAvailableReducer;