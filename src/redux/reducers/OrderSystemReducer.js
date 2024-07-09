import {
  CLEAR_ERRORS,
  GET_ORDER_SYSTEM_REQUEST,
  GET_ORDER_SYSTEM_SUCCESS,
  GET_ORDER_SYSTEM_FAIL,
  GET_ORDER_DETAILS_REQUEST,
  GET_ORDER_DETAILS_SUCCESS,
  GET_ORDER_DETAILS_FAIL,
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
  ADD_MESSAGE_REQUEST,
  ADD_MESSAGE_SUCCESS,
  ADD_MESSAGE_FAIL,
  GET_COMPLETED_ORDER_SYSTEM_REQUEST,
  GET_COMPLETED_ORDER_SYSTEM_SUCCESS,
  GET_COMPLETED_ORDER_SYSTEM_FAIL,
  GET_COMPLETED_ORDER_DETAILS_SYSTEM_FAIL,
  GET_COMPLETED_ORDER_DETAILS_SYSTEM_SUCCESS,
  GET_COMPLETED_ORDER_DETAILS_SYSTEM_REQUEST,
  UPLOAD_OVERALL_ATTACH_FILE_REQUEST,
  UPLOAD_OVERALL_ATTACH_FILE_SUCCESS,
  UPLOAD_OVERALL_ATTACH_FILE_FAIL,
  CUSTOM_ORDER_ON_HOLD_REQUEST,
  CUSTOM_ORDER_ON_HOLD_SUCCESS,
  CUSTOM_ORDER_ON_HOLD_FAIL,
  CUSTOM_ORDER_ON_HOLD_FINISH_REQUEST,
  CUSTOM_ORDER_ON_HOLD_FINISH_SUCCESS,
  CUSTOM_ORDER_ON_HOLD_FINISH_FAIL,
} from "../constants/Constants";

const initialState = {
  orders: [],
  isOrders: false,
  completedOrders: [],
  isCompletedOrders: false,
  orderDetails: [],
  isOrderDetails: false,
  completedOrderDetails: [],
  isCompletedOrderDetails: false,
  uploadAttachFile: [],
  isUploadAttachFile: false,
  uploadOverAllAttachFile: [],
  isUploadOverAllAttachFile: false,
  Message: [],
  isMessage: false,
  orderPickUp: [],
  isOrderPickUp: false,
  orderPickUpCancel: [],
  isOrderPickUpCancel: false,
  customOrderData: [],
  isCustomOrder: false,
  customOrderOnHoldData: [],
  isCustomOrderOnHold: false,
  customOrderOnHoldFinishData: [],
  isCustomOrderOnHoldFinish: false,
  error: null,
};

const OrderSystemReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDER_SYSTEM_REQUEST:
      return { ...state, isOrders: true };
    case GET_ORDER_SYSTEM_SUCCESS:
      return { ...state, isOrders: false, orders: action.payload };
    case GET_ORDER_SYSTEM_FAIL:
      return { ...state, isOrders: false, error: action.payload };

    case GET_COMPLETED_ORDER_SYSTEM_REQUEST:
      return { ...state, isCompletedOrders: true };
    case GET_COMPLETED_ORDER_SYSTEM_SUCCESS:
      return {
        ...state,
        isCompletedOrders: false,
        completedOrders: action.payload,
      };
    case GET_COMPLETED_ORDER_SYSTEM_FAIL:
      return { ...state, isCompletedOrders: false, error: action.payload };

    case GET_COMPLETED_ORDER_DETAILS_SYSTEM_REQUEST:
      return { ...state, isCompletedOrderDetails: true };
    case GET_COMPLETED_ORDER_DETAILS_SYSTEM_SUCCESS:
      return {
        ...state,
        isCompletedOrderDetails: false,
        completedOrderDetails: action.payload,
      };
    case GET_COMPLETED_ORDER_DETAILS_SYSTEM_FAIL:
      return {
        ...state,
        isCompletedOrderDetails: false,
        error: action.payload,
      };

    case GET_ORDER_DETAILS_REQUEST:
      return { ...state, isOrderDetails: true };
    case GET_ORDER_DETAILS_SUCCESS:
      return { ...state, isOrderDetails: false, orderDetails: action.payload };
    case GET_ORDER_DETAILS_FAIL:
      return { ...state, isOrderDetails: false, error: action.payload };

    case UPLOAD_ATTACH_FILE_REQUEST:
      return { ...state, isUploadAttachFile: true };
    case UPLOAD_ATTACH_FILE_SUCCESS:
      return {
        ...state,
        isUploadAttachFile: false,
        uploadAttachFile: action.payload,
      };
    case UPLOAD_ATTACH_FILE_FAIL:
      return { ...state, isUploadAttachFile: false, error: action.payload };

      case UPLOAD_OVERALL_ATTACH_FILE_REQUEST:
      return { ...state, isUploadOverAllAttachFile: true };
    case UPLOAD_OVERALL_ATTACH_FILE_SUCCESS:
      return {
        ...state,
        isUploadOverAllAttachFile: false,
        uploadOverAllAttachFile: action.payload,
      };
    case UPLOAD_OVERALL_ATTACH_FILE_FAIL:
      return { ...state, isUploadOverAllAttachFile: false, error: action.payload };

    case ADD_MESSAGE_REQUEST:
      return { ...state, isMessage: true };
    case ADD_MESSAGE_SUCCESS:
      return { ...state, isMessage: false, Message: action.payload };
    case ADD_MESSAGE_FAIL:
      return { ...state, isMessage: false, error: action.payload };

    case INSERT_ORDER_PICKUP_REQUEST:
      return { ...state, isOrderPickUp: true };
    case INSERT_ORDER_PICKUP_SUCCESS:
      return { ...state, isOrderPickUp: false, orderPickUp: action.payload };
    case INSERT_ORDER_PICKUP_FAIL:
      return { ...state, isOrderPickUp: false, error: action.payload };

    case INSERT_ORDER_PICKUP_CANCEL_REQUEST:
      return { ...state, isOrderPickUpCancel: true };
    case INSERT_ORDER_PICKUP_CANCEL_SUCCESS:
      return {
        ...state,
        isOrderPickUpCancel: false,
        orderPickUpCancel: action.payload,
      };
    case INSERT_ORDER_PICKUP_CANCEL_FAIL:
      return { ...state, isOrderPickUpCancel: false, error: action.payload };

    case CUSTOM_ORDER_FINISH_REQUEST:
      return { ...state, isCustomOrder: true };
    case CUSTOM_ORDER_FINISH_SUCCESS:
      return {
        ...state,
        isCustomOrder: false,
        customOrderData: action.payload,
      };
    case CUSTOM_ORDER_FINISH_FAIL:
      return { ...state, isCustomOrder: false, error: action.payload };

      case CUSTOM_ORDER_ON_HOLD_REQUEST:
      return { ...state, isCustomOrderOnHold: true };
    case CUSTOM_ORDER_ON_HOLD_SUCCESS:
      return {
        ...state,
        isCustomOrderOnHold: false,
        customOrderOnHoldData: action.payload,
      };
    case CUSTOM_ORDER_ON_HOLD_FAIL:
      return { ...state, isCustomOrderOnHold: false, error: action.payload };

      case CUSTOM_ORDER_ON_HOLD_FINISH_REQUEST:
      return { ...state, isCustomOrderOnHoldFinish: true };
    case CUSTOM_ORDER_ON_HOLD_FINISH_SUCCESS:
      return {
        ...state,
        isCustomOrderOnHoldFinish: false,
        customOrderOnHoldFinishData: action.payload,
      };
    case CUSTOM_ORDER_ON_HOLD_FINISH_FAIL:
      return { ...state, isCustomOrderOnHoldFinish: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export default OrderSystemReducer;
