import {
  ADD_GRN_FAIL,
  ADD_GRN_REQUEST,
  ADD_GRN_SUCCESS,
  ADD_PRODUCT_ORDER_FOR_PREP_FAIL,
  ADD_PRODUCT_ORDER_FOR_PREP_REQUEST,
  ADD_PRODUCT_ORDER_FOR_PREP_SUCCESS,
  ADD_PRODUCT_ORDER_FOR_STOCK_FAIL,
  ADD_PRODUCT_ORDER_FOR_STOCK_REQUEST,
  ADD_PRODUCT_ORDER_FOR_STOCK_SUCCESS,
  CLEAR_ERRORS,
  GET_GRN_VIEW_FAIL,
  GET_GRN_VIEW_REQUEST,
  GET_GRN_VIEW_SUCCESS,
  GET_PRODUCT_MANUAL_FAIL,
  GET_PRODUCT_MANUAL_REQUEST,
  GET_PRODUCT_MANUAL_SUCCESS,
  GET_PRODUCT_ORDER_DETAILS_FAIL,
  GET_PRODUCT_ORDER_DETAILS_REQUEST,
  GET_PRODUCT_ORDER_DETAILS_SUCCESS,
} from "../constants/Constants";

const initialState = {
  productManual: [],
  isProductManualAvailable: false,
  grn: [],
  isGrn: false,
  grnView: [],
  isGrnView: false,
  productOrderDetails: [],
  isProductOrderDetails: false,
  productOrdersPrep: [],
  isProductOrdersPrep: false,
  productOrdersStock: [],
  isProductOrdersStock: false,
  error: null,
};

const ManagementSystemReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCT_MANUAL_REQUEST:
      return { ...state, isProductManualAvailable: true };
    case GET_PRODUCT_MANUAL_SUCCESS:
      return {
        ...state,
        isProductManualAvailable: false,
        productManual: action.payload,
      };
    case GET_PRODUCT_MANUAL_FAIL:
      return {
        ...state,
        isProductManualAvailable: false,
        error: action.payload,
      };

    case ADD_GRN_REQUEST:
      return { ...state, isGrn: true };
    case ADD_GRN_SUCCESS:
      return { ...state, isGrn: false, grn: action.payload };
    case ADD_GRN_FAIL:
      return { ...state, isGrn: false, error: action.payload };

    case GET_GRN_VIEW_REQUEST:
      return { ...state, isGrnView: true };
    case GET_GRN_VIEW_SUCCESS:
      return { ...state, isGrnView: false, grnView: action.payload };
    case GET_GRN_VIEW_FAIL:
      return { ...state, isGrnView: false, error: action.payload };

    case GET_PRODUCT_ORDER_DETAILS_REQUEST:
      return { ...state, isProductOrderDetails: true };
    case GET_PRODUCT_ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        isProductOrderDetails: false,
        productOrderDetails: action.payload,
      };
    case GET_PRODUCT_ORDER_DETAILS_FAIL:
      return { ...state, isProductOrderDetails: false, error: action.payload };

    case ADD_PRODUCT_ORDER_FOR_PREP_REQUEST:
      return { ...state, isProductOrdersPrep: true };
    case ADD_PRODUCT_ORDER_FOR_PREP_SUCCESS:
      return {
        ...state,
        isProductOrdersPrep: false,
        productOrdersPrep: action.payload,
      };
    case ADD_PRODUCT_ORDER_FOR_PREP_FAIL:
      return { ...state, isProductOrdersPrep: false, error: action.payload };

      case ADD_PRODUCT_ORDER_FOR_STOCK_REQUEST:
        return { ...state, isProductOrdersPrep: true };
      case ADD_PRODUCT_ORDER_FOR_STOCK_SUCCESS:
        return {
          ...state,
          isProductOrdersStock: false,
          productOrdersStock: action.payload,
        };
      case ADD_PRODUCT_ORDER_FOR_STOCK_FAIL:
        return { ...state, isProductOrdersStock: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export default ManagementSystemReducer;
