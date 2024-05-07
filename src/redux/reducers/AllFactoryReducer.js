import {
    GET_All_FACTORY_REQUEST,
    GET_All_FACTORY_SUCCESS,
    GET_All_FACTORY_FAIL,
    CLEAR_ERRORS,
    EDIT_FACTORY_REQUEST,
    EDIT_FACTORY_SUCCESS,
    EDIT_FACTORY_FAIL,
    ADD_FACTORY_REQUEST,
    ADD_FACTORY_SUCCESS,
    ADD_FACTORY_FAIL,
} from "../constants/Constants";

const initialState = {
    factory: [],
    isFactory: false,
    error: null,
    editFactory:[],
    isEditFactory:false,
    addFactory:[],
    isAddFactory:false,
  };

const AllFactoryReducer = (state=initialState, action) => {
    switch (action.type) {
        case GET_All_FACTORY_REQUEST:
          return { ...state, isFactory: true };
        case GET_All_FACTORY_SUCCESS:
          return { ...state, isFactory: false, factory: action.payload };
        case GET_All_FACTORY_FAIL:
          return { ...state, isFactory: false, error: action.payload };

          case EDIT_FACTORY_REQUEST:
          return { ...state, isEditFactory: true };
        case EDIT_FACTORY_SUCCESS:
          return { ...state, isEditFactory: false, factory: action.payload };
        case EDIT_FACTORY_FAIL:
          return { ...state, isEditFactory: false, error: action.payload };

          case ADD_FACTORY_REQUEST:
            return { ...state, isAddFactory: true };
          case ADD_FACTORY_SUCCESS:
            return { ...state, isAddFactory: false, factory: action.payload };
          case ADD_FACTORY_FAIL:
            return { ...state, isAddFactory: false, error: action.payload };
    
        case CLEAR_ERRORS:
          return { ...state, error: null };
        default:
          return state;
      }
}

export default AllFactoryReducer