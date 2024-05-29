import {
  CLEAR_ERRORS,
  GET_ER_MANAGEMENT_DATA_FAIL,
  GET_ER_MANAGEMENT_DATA_REQUEST,
  GET_ER_MANAGEMENT_DATA_SUCCESS,
} from "../constants/Constants";

const initialState = {
  ermanagementData: [],
  isErmanagementData: false,
  error: null,
};

const ErmanagementReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ER_MANAGEMENT_DATA_REQUEST:
      return { ...state, isErmanagementData: true };
    case GET_ER_MANAGEMENT_DATA_SUCCESS:
      return {
        ...state,
        isErmanagementData: false,
        ermanagementData: action.payload,
      };
    case GET_ER_MANAGEMENT_DATA_FAIL:
      return { ...state, isErmanagementData: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export default ErmanagementReducer;
