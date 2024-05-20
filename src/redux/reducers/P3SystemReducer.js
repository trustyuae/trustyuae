import { CLEAR_ERRORS, GET_PRODUCT_MANUAL_FAIL, GET_PRODUCT_MANUAL_REQUEST, GET_PRODUCT_MANUAL_SUCCESS, GET_PRODUCT_ORDER_DETAILS_FAIL, GET_PRODUCT_ORDER_DETAILS_REQUEST, GET_PRODUCT_ORDER_DETAILS_SUCCESS } from "../constants/Constants";

const initialState = {
    productManual: [],
    isProductManualAvailable: false,
    productOrderDetails: [],
    isProductOrderDetails: false,
    error: null,
};

const ManagementSystemReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PRODUCT_MANUAL_REQUEST:
            return { ...state, isProductManualAvailable: true };
        case GET_PRODUCT_MANUAL_SUCCESS:
            return { ...state, isProductManualAvailable: false, productManual: action.payload };
        case GET_PRODUCT_MANUAL_FAIL:
            return { ...state, isProductManualAvailable: false, error: action.payload };

            case GET_PRODUCT_ORDER_DETAILS_REQUEST:
            return { ...state, isProductOrderDetails: true };
        case GET_PRODUCT_ORDER_DETAILS_SUCCESS:
            return { ...state, isProductOrderDetails: false, productOrderDetails: action.payload };
        case GET_PRODUCT_ORDER_DETAILS_FAIL:
            return { ...state, isProductOrderDetails: false, error: action.payload };

        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

export default ManagementSystemReducer;