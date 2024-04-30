import { combineReducers, applyMiddleware, createStore } from "redux";
import  thunk from "redux-thunk";
import { UserReducer } from "./reducers/UserReducer";
import { composeWithDevTools } from "redux-devtools-extension";

const reducer = combineReducers({
  loginUser: UserReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
