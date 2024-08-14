import ShowAlert from "../../utils/ShowAlert";
import {
  GET_All_FACTORY_REQUEST,
  GET_All_FACTORY_SUCCESS,
  GET_All_FACTORY_FAIL,
  url,
  EDIT_FACTORY_REQUEST,
  EDIT_FACTORY_SUCCESS,
  EDIT_FACTORY_FAIL,
  ADD_FACTORY_REQUEST,
  ADD_FACTORY_SUCCESS,
  ADD_FACTORY_FAIL,
  API_URL,
} from "../constants/Constants";
import axiosInstance from "../../utils/AxiosInstance";



export const AllFactoryActions = () => async (dispatch) => {
  try {
    dispatch({ type: GET_All_FACTORY_REQUEST });
    const response = await axiosInstance.get(`${API_URL}wp-json/custom-factory/v1/fetch-factories/`);
    dispatch({ type: GET_All_FACTORY_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("Error fetching factories:", error.message);
    dispatch({ type: GET_All_FACTORY_FAIL, error: error.message });
  }
};

export const FactoryEdit = (factoryId, data) => async (dispatch) => {
  try {
    dispatch({ type: EDIT_FACTORY_REQUEST });

    const response = await axiosInstance.post(
      `${url}custom-factory/v1/update-factory/${factoryId.id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json" // Corrected the syntax
        }
      }
    );
    dispatch({ type: EDIT_FACTORY_SUCCESS, payload: response?.data });
  } catch (error) {
    dispatch({ type: EDIT_FACTORY_FAIL, error: error.message });
  }
};


export const FactoryAdd = (factData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: ADD_FACTORY_REQUEST });

    const response = await axiosInstance.post(
      `${url}custom-factory/v1/add-factory`,
      factData,
      {
        headers: {
          "Content-Type": "application/json" 
        }
      }
    );
    dispatch({ type: ADD_FACTORY_SUCCESS, payload: response?.data });
    const result = await ShowAlert("Success", response?.data?.message, 'success', false, false, 'OK', '', 1000);
    // if (result.isConfirmed) navigate("/ordersystem");
    navigate("/all_factory");
  } catch (error) {
    dispatch({ type: ADD_FACTORY_FAIL, error: error.message });
  }
};