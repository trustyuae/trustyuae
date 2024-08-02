import {combineReducers} from 'redux';
import factoryReducer from '../slices/FactoriesSlice';
import erManagementReducer from '../slices/ErManagementSlice';
import orderSystemReducer from '../slices/OrderSystemSlice';


export const rootReducer = combineReducers({
  factory:factoryReducer,
  erManagement:erManagementReducer,
  orderSystem:orderSystemReducer
});
