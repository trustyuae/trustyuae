import {
  GET_All_FACTORY_REQUEST,
  GET_All_FACTORY_SUCCESS,
  GET_All_FACTORY_FAIL,
  url,
  EDIT_FACTORY_REQUEST,
  EDIT_FACTORY_SUCCESS,
  EDIT_FACTORY_FAIL,
} from "../constants/Constants";
import axios from "axios";

export const AllFactoryActions = (data) => async (dispatch) => {
  try {
    dispatch({ type: GET_All_FACTORY_REQUEST });

    const response = await axios.get(`${url}custom-factory/v1/fetch-factories`);
    dispatch({ type: GET_All_FACTORY_SUCCESS, payload: response?.data });
  } catch (error) {
    dispatch({ type: GET_All_FACTORY_FAIL, error: error });
  }
};

export const FactoryEdit = (factoryId, data) => async (dispatch) => {
  try {
    dispatch({ type: EDIT_FACTORY_REQUEST });

    const response = await axios.post(
      `${url}custom-factory/v1/update-factory/${factoryId.id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json" // Corrected the syntax
        }
      }
    );
    console.log(response,'factory res')
    dispatch({ type: EDIT_FACTORY_SUCCESS, payload: response?.data });
  } catch (error) {
    dispatch({ type: EDIT_FACTORY_FAIL, error: error.message });
  }
};