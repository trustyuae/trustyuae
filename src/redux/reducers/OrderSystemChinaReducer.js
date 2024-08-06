import {
    CLEAR_ERRORS,
    GET_ORDER_SYSTEM_CHINA_REQUEST,
    GET_ORDER_SYSTEM_CHINA_SUCCESS,
    GET_ORDER_SYSTEM_CHINA_FAIL,
    GET_ORDER_DETAILS_CHINA_REQUEST,
    GET_ORDER_DETAILS_CHINA_SUCCESS,
    GET_ORDER_DETAILS_CHINA_FAIL,
    UPLOAD_ATTACH_FILE_CHINA_REQUEST,
    UPLOAD_ATTACH_FILE_CHINA_SUCCESS,
    UPLOAD_ATTACH_FILE_CHINA_FAIL,
    INSERT_ORDER_PICKUP_CHINA_REQUEST,
    INSERT_ORDER_PICKUP_CHINA_SUCCESS,
    INSERT_ORDER_PICKUP_CHINA_FAIL,
    INSERT_ORDER_PICKUP_CANCEL_CHINA_REQUEST,
    INSERT_ORDER_PICKUP_CANCEL_CHINA_SUCCESS,
    INSERT_ORDER_PICKUP_CANCEL_CHINA_FAIL,
    CUSTOM_ORDER_FINISH_CHINA_REQUEST,
    CUSTOM_ORDER_FINISH_CHINA_SUCCESS,
    CUSTOM_ORDER_FINISH_CHINA_FAIL,
    ADD_MESSAGE_CHINA_REQUEST,
    ADD_MESSAGE_CHINA_SUCCESS,
    ADD_MESSAGE_CHINA_FAIL,
    GET_COMPLETED_ORDER_SYSTEM_CHINA_REQUEST,
    GET_COMPLETED_ORDER_SYSTEM_CHINA_SUCCESS,
    GET_COMPLETED_ORDER_SYSTEM_CHINA_FAIL,
    GET_COMPLETED_ORDER_DETAILS_SYSTEM_CHINA_FAIL,
    GET_COMPLETED_ORDER_DETAILS_SYSTEM_CHINA_SUCCESS,
    GET_COMPLETED_ORDER_DETAILS_SYSTEM_CHINA_REQUEST,
    UPLOAD_OVERALL_ATTACH_FILE_CHINA_REQUEST,
    UPLOAD_OVERALL_ATTACH_FILE_CHINA_SUCCESS,
    UPLOAD_OVERALL_ATTACH_FILE_CHINA_FAIL,
    CUSTOM_ORDER_ON_HOLD_CHINA_REQUEST,
    CUSTOM_ORDER_ON_HOLD_CHINA_SUCCESS,
    CUSTOM_ORDER_ON_HOLD_CHINA_FAIL,
    CUSTOM_ORDER_ON_HOLD_FINISH_CHINA_REQUEST,
    CUSTOM_ORDER_ON_HOLD_FINISH_CHINA_SUCCESS,
    CUSTOM_ORDER_ON_HOLD_FINISH_CHINA_FAIL,
    GET_ON_HOLD_ORDER_DETAILS_SYSTEM_CHINA_FAIL,
    GET_ON_HOLD_ORDER_DETAILS_SYSTEM_CHINA_SUCCESS,
    GET_ON_HOLD_ORDER_DETAILS_SYSTEM_CHINA_REQUEST,
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
    onHoldOrderDetails: [],
    isOnHoldOrderDetails: false,
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
  
  const OrderSystemChinaReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_ORDER_SYSTEM_CHINA_REQUEST:
        return { ...state, isOrders: true };
      case GET_ORDER_SYSTEM_CHINA_SUCCESS:
        return { ...state, isOrders: false, orders: action.payload };
      case GET_ORDER_SYSTEM_CHINA_FAIL:
        return { ...state, isOrders: false, error: action.payload };
  
      case GET_COMPLETED_ORDER_SYSTEM_CHINA_REQUEST:
        return { ...state, isCompletedOrders: true };
      case GET_COMPLETED_ORDER_SYSTEM_CHINA_SUCCESS:
        return {
          ...state,
          isCompletedOrders: false,
          completedOrders: action.payload,
        };
      case GET_COMPLETED_ORDER_SYSTEM_CHINA_FAIL:
        return { ...state, isCompletedOrders: false, error: action.payload };
  
      case GET_COMPLETED_ORDER_DETAILS_SYSTEM_CHINA_REQUEST:
        return { ...state, isCompletedOrderDetails: true };
      case GET_COMPLETED_ORDER_DETAILS_SYSTEM_CHINA_SUCCESS:
        return {
          ...state,
          isCompletedOrderDetails: false,
          completedOrderDetails: action.payload,
        };
      case GET_COMPLETED_ORDER_DETAILS_SYSTEM_CHINA_FAIL:
        return {
          ...state,
          isCompletedOrderDetails: false,
          error: action.payload,
        };
  
      case GET_ORDER_DETAILS_CHINA_REQUEST:
        return { ...state, isOrderDetails: true };
      case GET_ORDER_DETAILS_CHINA_SUCCESS:
        return { ...state, isOrderDetails: false, orderDetails: action.payload };
      case GET_ORDER_DETAILS_CHINA_FAIL:
        return { ...state, isOrderDetails: false, error: action.payload };
  
        case GET_ON_HOLD_ORDER_DETAILS_SYSTEM_CHINA_REQUEST:
        return { ...state, isOnHoldOrderDetails: true };
      case GET_ON_HOLD_ORDER_DETAILS_SYSTEM_CHINA_SUCCESS:
        return {
          ...state,
          isOnHoldOrderDetails: false,
          onHoldOrderDetails: action.payload,
        };
      case GET_ON_HOLD_ORDER_DETAILS_SYSTEM_CHINA_FAIL:
        return {
          ...state,
          isOnHoldOrderDetails: false,
          error: action.payload,
        };
  
      case UPLOAD_ATTACH_FILE_CHINA_REQUEST:
        return { ...state, isUploadAttachFile: true };
      case UPLOAD_ATTACH_FILE_CHINA_SUCCESS:
        return {
          ...state,
          isUploadAttachFile: false,
          uploadAttachFile: action.payload,
        };
      case UPLOAD_ATTACH_FILE_CHINA_FAIL:
        return { ...state, isUploadAttachFile: false, error: action.payload };
  
        case UPLOAD_OVERALL_ATTACH_FILE_CHINA_REQUEST:
        return { ...state, isUploadOverAllAttachFile: true };
      case UPLOAD_OVERALL_ATTACH_FILE_CHINA_SUCCESS:
        return {
          ...state,
          isUploadOverAllAttachFile: false,
          uploadOverAllAttachFile: action.payload,
        };
      case UPLOAD_OVERALL_ATTACH_FILE_CHINA_FAIL:
        return { ...state, isUploadOverAllAttachFile: false, error: action.payload };
  
      case ADD_MESSAGE_CHINA_REQUEST:
        return { ...state, isMessage: true };
      case ADD_MESSAGE_CHINA_SUCCESS:
        return { ...state, isMessage: false, Message: action.payload };
      case ADD_MESSAGE_CHINA_FAIL:
        return { ...state, isMessage: false, error: action.payload };
  
      case INSERT_ORDER_PICKUP_CHINA_REQUEST:
        return { ...state, isOrderPickUp: true };
      case INSERT_ORDER_PICKUP_CHINA_SUCCESS:
        return { ...state, isOrderPickUp: false, orderPickUp: action.payload };
      case INSERT_ORDER_PICKUP_CHINA_FAIL:
        return { ...state, isOrderPickUp: false, error: action.payload };
  
      case INSERT_ORDER_PICKUP_CANCEL_CHINA_REQUEST:
        return { ...state, isOrderPickUpCancel: true };
      case INSERT_ORDER_PICKUP_CANCEL_CHINA_SUCCESS:
        return {
          ...state,
          isOrderPickUpCancel: false,
          orderPickUpCancel: action.payload,
        };
      case INSERT_ORDER_PICKUP_CANCEL_CHINA_FAIL:
        return { ...state, isOrderPickUpCancel: false, error: action.payload };
  
      case CUSTOM_ORDER_FINISH_CHINA_REQUEST:
        return { ...state, isCustomOrder: true };
      case CUSTOM_ORDER_FINISH_CHINA_SUCCESS:
        return {
          ...state,
          isCustomOrder: false,
          customOrderData: action.payload,
        };
      case CUSTOM_ORDER_FINISH_CHINA_FAIL:
        return { ...state, isCustomOrder: false, error: action.payload };
  
        case CUSTOM_ORDER_ON_HOLD_CHINA_REQUEST:
        return { ...state, isCustomOrderOnHold: true };
      case CUSTOM_ORDER_ON_HOLD_CHINA_SUCCESS:
        return {
          ...state,
          isCustomOrderOnHold: false,
          customOrderOnHoldData: action.payload,
        };
      case CUSTOM_ORDER_ON_HOLD_CHINA_FAIL:
        return { ...state, isCustomOrderOnHold: false, error: action.payload };
  
        case CUSTOM_ORDER_ON_HOLD_FINISH_CHINA_REQUEST:
        return { ...state, isCustomOrderOnHoldFinish: true };
      case CUSTOM_ORDER_ON_HOLD_FINISH_CHINA_SUCCESS:
        return {
          ...state,
          isCustomOrderOnHoldFinish: false,
          customOrderOnHoldFinishData: action.payload,
        };
      case CUSTOM_ORDER_ON_HOLD_FINISH_CHINA_FAIL:
        return { ...state, isCustomOrderOnHoldFinish: false, error: action.payload };
  
      case CLEAR_ERRORS:
        return { ...state, error: null };
      default:
        return state;
    }
  };
  
  export default OrderSystemChinaReducer;
  