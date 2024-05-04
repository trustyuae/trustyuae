import { combineReducers, applyMiddleware, createStore } from "redux";
import  thunk from "redux-thunk";
import { UserLoginReducer, UserLogoutReducer} from "./reducers/UserReducer";
import { composeWithDevTools } from "redux-devtools-extension";

const reducer = combineReducers({
  loginUser: UserLoginReducer,
  logoutUser:UserLogoutReducer
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
