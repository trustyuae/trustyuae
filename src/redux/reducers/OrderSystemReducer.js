import {
    CLEAR_ERRORS,
    GET_ORDER_SYSTEM_REQUEST,
    GET_ORDER_SYSTEM_SUCCESS,
    GET_ORDER_SYSTEM_FAIL,
    GET_ORDER_DETAILS_REQUEST,
    GET_ORDER_DETAILS_SUCCESS,
    GET_ORDER_DETAILS_FAIL
} from "../constants/Constants";

const initialState = {
    orders: [],
    isOrders: false,
    orderDetails: [],
    isOrderDetails: false,
    error: null,
  };

const OrderSystemReducer = (state=initialState, action) => {
    switch (action.type) {
        case GET_ORDER_SYSTEM_REQUEST:
          return { ...state,isOrders: true };
        case GET_ORDER_SYSTEM_SUCCESS:
          return { ...state, isOrders: false, factory: action.payload };
        case GET_ORDER_SYSTEM_FAIL:
          return { ...state, isOrders: false, error: action.payload };

          case GET_ORDER_DETAILS_REQUEST:
            return { ...state,isOrderDetails: true };
          case GET_ORDER_DETAILS_SUCCESS:
            return { ...state, isOrderDetails: false, factory: action.payload };
          case GET_ORDER_DETAILS_FAIL:
            return { ...state, isOrderDetails: false, error: action.payload };
    
        case CLEAR_ERRORS:
          return { ...state, error: null };
        default:
          return state;
      }
}

export default OrderSystemReducer