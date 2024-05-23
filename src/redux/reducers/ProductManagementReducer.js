import {
  CLEAR_ERRORS,
  GET_ALL_PRODUCTS_LIST_FAIL,
  GET_ALL_PRODUCTS_LIST_REQUEST,
  GET_ALL_PRODUCTS_LIST_SUCCESS,
} from "../constants/Constants";

const initialState = {
  allProducts: [],
  isAllProducts: false,
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

    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export default ProductManagementReducer;
