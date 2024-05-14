import { combineReducers, applyMiddleware, createStore } from "redux";
import  thunk from "redux-thunk";
import { UserLoginReducer, UserLogoutReducer} from "./reducers/UserReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import AllFactoryReducer from "./reducers/AllFactoryReducer";
import OrderSystemReducer from "./reducers/OrderSystemReducer";
import OrderNotAvailableReducer from "./reducers/P2SystemReducer";

const reducer = combineReducers({
  loginUser: UserLoginReducer,
  logoutUser:UserLogoutReducer,
  allFactoryData:AllFactoryReducer,
  orderSystemData:OrderSystemReducer,
  orderNotAvailable:OrderNotAvailableReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
