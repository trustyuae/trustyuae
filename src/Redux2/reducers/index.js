import { combineReducers } from "redux";
import factoryReducer from "../slices/FactoriesSlice";
import erManagementReducer from "../slices/ErManagementSlice";
import orderSystemReducer from "../slices/OrderSystemSlice";
import orderSystemChinaReducer from "../slices/OrderSystemChinaSlice";
import p2SystemReducer from "../slices/P2SystemSlice";
import p3SystemReducer from "../slices/P3SystemSlice";
import productManagementReducer from "../slices/ProductManagementSlice";
import userReducer from "../slices/UserSlice";

export const rootReducer = combineReducers({
  factory: factoryReducer,
  erManagement: erManagementReducer,
  orderSystem: orderSystemReducer,
  orderSystemChina: orderSystemChinaReducer,
  p2System: p2SystemReducer,
  p3System: p3SystemReducer,
  productManagement: productManagementReducer,
  user: userReducer,
});
