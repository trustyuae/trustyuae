import {
  CLEAR_ERRORS,
  GET_ORDER_NOT_AVAILABLE_REQUEST,
  GET_ORDER_NOT_AVAILABLE_SUCCESS,
  GET_ORDER_NOT_AVAILABLE_FAIL,
  ADD_ORDER_NOT_AVAILABLE_REQUEST,
  ADD_ORDER_NOT_AVAILABLE_SUCCESS,
  ADD_ORDER_NOT_AVAILABLE_FAIL,
  UPDATE_ORDER_NOT_AVAILABLE_STATUS_REQUEST,
  UPDATE_ORDER_NOT_AVAILABLE_STATUS_SUCCESS,
  UPDATE_ORDER_NOT_AVAILABLE_STATUS_FAIL,
  ADD_ORDER_NOT_AVAILABLE_REFUND_REQUEST,
  ADD_ORDER_NOT_AVAILABLE_REFUND_SUCCESS,
  ADD_ORDER_NOT_AVAILABLE_REFUND_FAIL,
} from "../constants/Constants";

const initialState = {
  ordersNotAvailable: [],
  isOrdersNotAvailable: false,
  ordersNotAvailablePo: [],
  isOrdersNotAvailablePo: false,
  ordersNotAvailableStatus: [],
  isOrdersNotAvailableStatus: false,
  ordersNotAvailableRefund: [],
  isOrdersNotAvailableRefund: false,
  error: null,
};

const OrderNotAvailableReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDER_NOT_AVAILABLE_REQUEST:
      return { ...state, isOrdersNotAvailable: true };
    case GET_ORDER_NOT_AVAILABLE_SUCCESS:
      return {
        ...state,
        isOrdersNotAvailable: false,
        ordersNotAvailable: action.payload,
      };
    case GET_ORDER_NOT_AVAILABLE_FAIL:
      return { ...state, isOrdersNotAvailable: false, error: action.payload };

    case ADD_ORDER_NOT_AVAILABLE_REQUEST:
      return { ...state, isOrdersNotAvailablePo: true };
    case ADD_ORDER_NOT_AVAILABLE_SUCCESS:
      return {
        ...state,
        isOrdersNotAvailablePo: false,
        ordersNotAvailablePo: action.payload,
      };
    case ADD_ORDER_NOT_AVAILABLE_FAIL:
      return { ...state, isOrdersNotAvailablePo: false, error: action.payload };

    case UPDATE_ORDER_NOT_AVAILABLE_STATUS_REQUEST:
      return { ...state, isOrdersNotAvailableStatus: true };
    case UPDATE_ORDER_NOT_AVAILABLE_STATUS_SUCCESS:
      return {
        ...state,
        isOrdersNotAvailableStatus: false,
        ordersNotAvailableStatus: action.payload,
      };
    case UPDATE_ORDER_NOT_AVAILABLE_STATUS_FAIL:
      return {
        ...state,
        isOrdersNotAvailableStatus: false,
        error: action.payload,
      };

    case ADD_ORDER_NOT_AVAILABLE_REFUND_REQUEST:
      return { ...state, isOrdersNotAvailableRefund: true };
    case ADD_ORDER_NOT_AVAILABLE_REFUND_SUCCESS:
      return {
        ...state,
        isOrdersNotAvailableRefund: false,
        ordersNotAvailableRefund: action.payload,
      };
    case ADD_ORDER_NOT_AVAILABLE_REFUND_FAIL:
      return {
        ...state,
        isOrdersNotAvailableRefund: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export default OrderNotAvailableReducer;
