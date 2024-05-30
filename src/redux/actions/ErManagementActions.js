import axios from "axios";
import {
  GET_ER_MANAGEMENT_DATA_FAIL,
  GET_ER_MANAGEMENT_DATA_REQUEST,
  GET_ER_MANAGEMENT_DATA_SUCCESS,
} from "../constants/Constants";

export const GetErManagementData = ({apiUrl}) => async (dispatch) => {
  try {
    dispatch({ type: GET_ER_MANAGEMENT_DATA_REQUEST });
    const response = await axios.get(apiUrl);
    console.log(response, "response of OrderDetailsGet Api");
    dispatch({ type: GET_ER_MANAGEMENT_DATA_SUCCESS, payload: response?.data });
    return response;
  } catch (error) {
    dispatch({ type: GET_ER_MANAGEMENT_DATA_FAIL, error: error.message });
  }
};