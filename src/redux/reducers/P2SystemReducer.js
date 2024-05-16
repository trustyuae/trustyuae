import {
    CLEAR_ERRORS,
    GET_ORDER_NOT_AVAILABLE_REQUEST,
    GET_ORDER_NOT_AVAILABLE_SUCCESS,
    GET_ORDER_NOT_AVAILABLE_FAIL,
    ADD_ORDER_NOT_AVAILABLE_REQUEST,
    ADD_ORDER_NOT_AVAILABLE_SUCCESS,
    ADD_ORDER_NOT_AVAILABLE_FAIL
  } from "../constants/Constants";
  
  const initialState = {
    ordersNotAvailable: [],
    isOrdersNotAvailable: false,
    ordersNotAvailablePo: [],
    isOrdersNotAvailablePo: false,
    error: null,
  };
  
  const OrderNotAvailableReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_ORDER_NOT_AVAILABLE_REQUEST:
        return { ...state, isOrdersNotAvailable: true };
      case GET_ORDER_NOT_AVAILABLE_SUCCESS:
        return { ...state, isOrdersNotAvailable: false, ordersNotAvailable: action.payload };
      case GET_ORDER_NOT_AVAILABLE_FAIL:
        return { ...state, isOrdersNotAvailable: false, error: action.payload };

        case ADD_ORDER_NOT_AVAILABLE_REQUEST:
          return { ...state, isOrdersNotAvailablePo: true };
        case ADD_ORDER_NOT_AVAILABLE_SUCCESS:
          return { ...state, isOrdersNotAvailablePo: false, ordersNotAvailablePo: action.payload };
        case ADD_ORDER_NOT_AVAILABLE_FAIL:
          return { ...state, isOrdersNotAvailablePo: false, error: action.payload };
        
      case CLEAR_ERRORS:
        return { ...state, error: null };
      default:
        return state;
    }
  };
  
  export default OrderNotAvailableReducer;