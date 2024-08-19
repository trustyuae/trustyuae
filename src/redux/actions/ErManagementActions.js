import {
  GET_ER_MANAGEMENT_DATA_FAIL,
  GET_ER_MANAGEMENT_DATA_REQUEST,
  GET_ER_MANAGEMENT_DATA_SUCCESS,
} from "../constants/Constants";

import axiosInstance from "../../utils/AxiosInstance";


export const GetErManagementData = ({apiUrl}) => async (dispatch) => {
  try {
    dispatch({ type: GET_ER_MANAGEMENT_DATA_REQUEST });
    const response = await axiosInstance.get(apiUrl);
    dispatch({ type: GET_ER_MANAGEMENT_DATA_SUCCESS, payload: response?.data });
    return response;
  } catch (error) {
    dispatch({ type: GET_ER_MANAGEMENT_DATA_FAIL, error: error.message });
  }
};
