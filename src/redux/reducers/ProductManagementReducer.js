import {
  CLEAR_ERRORS,
  EDIT_PRODUCT_LIST_FAIL,
  EDIT_PRODUCT_LIST_REQUEST,
  EDIT_PRODUCT_LIST_SUCCESS,
  GET_ALL_PRODUCTS_LIST_FAIL,
  GET_ALL_PRODUCTS_LIST_REQUEST,
  GET_ALL_PRODUCTS_LIST_SUCCESS,
} from "../constants/Constants";

const initialState = {
  allProducts: [],
  isAllProducts: false,
  EditProducts: [],
  isEditProducts: false,
  error: null,
};

const ProductManagementReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PRODUCTS_LIST_REQUEST:
      return { ...state, isAllProducts: true };
    case GET_ALL_PRODUCTS_LIST_SUCCESS:
      return {
        ...state,
        isAllProducts: false,
        allProducts: action.payload,
      };
    case GET_ALL_PRODUCTS_LIST_FAIL:
      return { ...state, isAllProducts: false, error: action.payload };

    case EDIT_PRODUCT_LIST_REQUEST:
      return { ...state, isEditProducts: true };
    case EDIT_PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        isEditProducts: false,
        EditProducts: action.payload,
      };
    case EDIT_PRODUCT_LIST_FAIL:
      return { ...state, isEditProducts: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export default ProductManagementReducer;
