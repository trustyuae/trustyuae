import {
  API_URL,
  GET_ALL_PRODUCTS_LIST_FAIL,
  GET_ALL_PRODUCTS_LIST_REQUEST,
  GET_ALL_PRODUCTS_LIST_SUCCESS,
} from "../constants/Constants";
import axios from "axios";

export const GetAllProductsList = ({apiurl}) => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_PRODUCTS_LIST_REQUEST });
    const response = await axios.get(apiurl);
    console.log(response, "response of GetAllProducts");
    dispatch({
      type: GET_ALL_PRODUCTS_LIST_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({ type: GET_ALL_PRODUCTS_LIST_FAIL, error: error.message });
  }
};
