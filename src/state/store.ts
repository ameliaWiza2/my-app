import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore, combineReducers, createListenerMiddleware} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import {baseApi} from './services/baseApi';
import authReducer, {signIn, signOut} from './slices/authSlice';
import userReducer from './slices/userSlice';
import {setAuthToken} from '../services/api';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: signIn,
  effect: async action => {
    setAuthToken(action.payload.token);
  },
});

listenerMiddleware.startListening({
  actionCreator: signOut,
  effect: async () => {
    setAuthToken(null);
  },
});

listenerMiddleware.startListening({
  predicate: action => action.type === 'persist/REHYDRATE',
  effect: async (_, api) => {
    const state = api.getState() as {auth?: {token?: string | null}};
    setAuthToken(state.auth?.token ?? null);
  },
});

const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    })
      .concat(listenerMiddleware.middleware)
      .concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
