import {applyMiddleware, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import storage from "redux-persist/lib/storage";
import {rootReducer} from '../reducers/index'

const persistConfig = {
  timeout: null,
  keyPrefix: '',
  key: 'root',
  storage: storage,

  blacklist: ['error', 'status', 'loader'],
};

export const store = createStore(
  persistReducer(persistConfig, rootReducer),
  applyMiddleware(thunk),
);

export const persistor = persistStore(store);