import {
  API_URL,
  EDIT_PRODUCT_LIST_FAIL,
  EDIT_PRODUCT_LIST_REQUEST,
  EDIT_PRODUCT_LIST_SUCCESS,
  GET_ALL_PRODUCTS_LIST_FAIL,
  GET_ALL_PRODUCTS_LIST_REQUEST,
  GET_ALL_PRODUCTS_LIST_SUCCESS,
} from "../constants/Constants";
import axiosInstance from "../../utils/AxiosInstance";


export const GetAllProductsList =
  ({ apiUrl }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_ALL_PRODUCTS_LIST_REQUEST });
      const response = await axiosInstance.get(apiUrl);
      dispatch({
        type: GET_ALL_PRODUCTS_LIST_SUCCESS,
        payload: response?.data,
      });
      return response;
    } catch (error) {
      dispatch({ type: GET_ALL_PRODUCTS_LIST_FAIL, error: error.message });
      throw error; // Rethrow the error to be caught in fetchProducts
    }
  };

export const EditProductsList = (formData, id) => async (dispatch) => {
  try {
    dispatch({ type: EDIT_PRODUCT_LIST_REQUEST });
    const response = await axiosInstance.post(
      `${API_URL}wp-json/custom-proimage-update/v1/update-product/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
   
    dispatch({
      type: EDIT_PRODUCT_LIST_SUCCESS,
      payload: response?.data,
    });
    return response;
  } catch (error) {
    dispatch({ type: EDIT_PRODUCT_LIST_FAIL, error: error.message });
    throw error; // Rethrow the error to be caught in fetchProducts
  }
};
