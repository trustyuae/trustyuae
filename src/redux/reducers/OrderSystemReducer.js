import {
    CLEAR_ERRORS,
    GET_ORDER_SYSTEM_REQUEST,
    GET_ORDER_SYSTEM_SUCCESS,
    GET_ORDER_SYSTEM_FAIL,
} from "../constants/Constants";

const initialState = {
    orders: [],
    isOrders: false,
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
    
        case CLEAR_ERRORS:
          return { ...state, error: null };
        default:
          return state;
      }
}

export default OrderSystemReducer