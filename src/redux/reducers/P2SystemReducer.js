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
  GET_PO_DETAILS_REQUEST,
  GET_PO_DETAILS_FAIL,
  GET_PO_DETAILS_SUCCESS,
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
  GET_PERTICULAR_PO_DETAILS_FAIL,
  GET_PERTICULAR_PO_DETAILS_SUCCESS,
  GET_POM_SYSTEM_PRODUCTS_DETAILS_FAIL,
  GET_POM_SYSTEM_PRODUCTS_DETAILS_SUCCESS,
  GET_POM_SYSTEM_PRODUCTS_DETAILS_REQUEST,
  UPDATE_PO_DETAILS_REQUEST,
  UPDATE_PO_DETAILS_SUCCESS,
  UPDATE_PO_DETAILS_FAIL,
  GET_QUANTITY_DETAILS_FAIL,
  GET_QUANTITY_DETAILS_SUCCESS,
  GET_QUANTITY_DETAILS_REQUEST,
  GET_MANUAL_OR_SCHEDULED_PO_DETAILS_REQUEST,
  GET_MANUAL_OR_SCHEDULED_PO_DETAILS_SUCCESS,
  GET_MANUAL_OR_SCHEDULED_PO_DETAILS_FAIL,
  GET_QUANTITY_DETAILS_ON_PO_DETAILS_REQUEST,
  GET_QUANTITY_DETAILS_ON_PO_DETAILS_SUCCESS,
  GET_QUANTITY_DETAILS_ON_PO_DETAILS_FAIL,
} from "../constants/Constants";

const initialState = {
  poDetailsData: [],
  isPoDetailsData: false,
  manualOrScheduledPoDetailsData: [],
  isManualOrScheduledPoDetailsData: false,
  perticularPoDetailsData: [],
  isPerticularPoDetailsData: false,
  quantityDetailsData: [],
  isQuantityDetailsData: false,
  quantityDetailsDataOnPoDetails: [],
  isQuantityDetailsDataOnPoDetails: false,
  addedPoData: [],
  isAddedPoData: false,
  addedManualPoData: [],
  isAddedManualPoData: false,
  addedSchedulePoData: [],
  isAddedSchedulePoData: false,
  updatedPoDetails: [],
  isUpdatedPoDetails: false,
  pomSystemProductDetails: [],
  isPomSystemProductDetails: false,
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
    case GET_PO_DETAILS_REQUEST:
      return { ...state, isPoDetailsData: true };
    case GET_PO_DETAILS_SUCCESS:
      return {
        ...state,
        isPoDetailsData: false,
        poDetailsData: action.payload,
      };
    case GET_PO_DETAILS_FAIL:
      return { ...state, isPoDetailsData: false, error: action.payload };

    case GET_MANUAL_OR_SCHEDULED_PO_DETAILS_REQUEST:
      return { ...state, isManualOrScheduledPoDetailsData: true };
    case GET_MANUAL_OR_SCHEDULED_PO_DETAILS_SUCCESS:
      return {
        ...state,
        isManualOrScheduledPoDetailsData: false,
        manualOrScheduledPoDetailsData: action.payload,
      };
    case GET_MANUAL_OR_SCHEDULED_PO_DETAILS_FAIL:
      return {
        ...state,
        isManualOrScheduledPoDetailsData: false,
        error: action.payload,
      };

    case GET_PERTICULAR_PO_DETAILS_REQUEST:
      return { ...state, isPerticularPoDetailsData: true };
    case GET_PERTICULAR_PO_DETAILS_SUCCESS:
      return {
        ...state,
        isPerticularPoDetailsData: false,
        perticularPoDetailsData: action.payload,
      };
    case GET_PERTICULAR_PO_DETAILS_FAIL:
      return {
        ...state,
        isPerticularPoDetailsData: false,
        error: action.payload,
      };

    case GET_QUANTITY_DETAILS_REQUEST:
      return { ...state, isQuantityDetailsData: true };
    case GET_QUANTITY_DETAILS_SUCCESS:
      return {
        ...state,
        isQuantityDetailsData: false,
        quantityDetailsData: action.payload,
      };
    case GET_QUANTITY_DETAILS_FAIL:
      return {
        ...state,
        isQuantityDetailsData: false,
        error: action.payload,
      };

    case GET_QUANTITY_DETAILS_ON_PO_DETAILS_REQUEST:
      return { ...state, isQuantityDetailsDataOnPoDetails: true };
    case GET_QUANTITY_DETAILS_ON_PO_DETAILS_SUCCESS:
      return {
        ...state,
        isQuantityDetailsDataOnPoDetails: false,
        quantityDetailsDataOnPoDetails: action.payload,
      };
    case GET_QUANTITY_DETAILS_ON_PO_DETAILS_FAIL:
      return {
        ...state,
        isQuantityDetailsDataOnPoDetails: false,
        error: action.payload,
      };

    case ADD_PO_REQUEST:
      return { ...state, isAddedPoData: true };
    case ADD_PO_SUCCESS:
      return {
        ...state,
        isAddedPoData: false,
        addedPoData: action.payload,
      };
    case ADD_PO_FAIL:
      return { ...state, isAddedPoData: false, error: action.payload };

    case ADD_MANUAL_PO_REQUEST:
      return { ...state, isAddedManualPoData: true };
    case ADD_MANUAL_PO_SUCCESS:
      return {
        ...state,
        isAddedManualPoData: false,
        addedManualPoData: action.payload,
      };
    case ADD_MANUAL_PO_FAIL:
      return { ...state, isAddedManualPoData: false, error: action.payload };

    case ADD_SCHEDULE_PO_REQUEST:
      return { ...state, isAddedSchedulePoData: true };
    case ADD_SCHEDULE_PO_SUCCESS:
      return {
        ...state,
        isAddedSchedulePoData: false,
        addedSchedulePoData: action.payload,
      };
    case ADD_SCHEDULE_PO_FAIL:
      return { ...state, isAddedSchedulePoData: false, error: action.payload };

    case UPDATE_PO_DETAILS_REQUEST:
      return { ...state, isUpdatedPoDetails: true };
    case UPDATE_PO_DETAILS_SUCCESS:
      return {
        ...state,
        isUpdatedPoDetails: false,
        updatedPoDetail: action.payload,
      };
    case UPDATE_PO_DETAILS_FAIL:
      return { ...state, isUpdatedPoDetails: false, error: action.payload };

    case GET_POM_SYSTEM_PRODUCTS_DETAILS_REQUEST:
      return { ...state, isPomSystemProductDetails: true };
    case GET_POM_SYSTEM_PRODUCTS_DETAILS_SUCCESS:
      return {
        ...state,
        isPomSystemProductDetails: false,
        pomSystemProductDetails: action.payload,
      };
    case GET_POM_SYSTEM_PRODUCTS_DETAILS_FAIL:
      return {
        ...state,
        isPomSystemProductDetails: false,
        error: action.payload,
      };

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
