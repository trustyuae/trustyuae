import axios from "axios";
import { GET_PRODUCT_MANUAL_FAIL, GET_PRODUCT_MANUAL_REQUEST, GET_PRODUCT_MANUAL_SUCCESS } from "../constants/Constants";


export const GetProductManual =
    ({ apiUrl }) => async (dispatch) => {
        try {
            dispatch({ type: GET_PRODUCT_MANUAL_REQUEST });
            const response = await axios.get(apiUrl);
            console.log(response, 'response of order not available data')
            dispatch({ type: GET_PRODUCT_MANUAL_SUCCESS, payload: response?.data });
            return response;
        } catch (error) {
            dispatch({ type: GET_PRODUCT_MANUAL_FAIL, error: error.message });
        }
    };