import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import advertReducer from './slices/advertSlice';
import vehicleReducer from './slices/listingsSlice';
import { persistReducer } from 'redux-persist';
import { persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage instead of sessionStorage

const persistConfig = {
  key: 'root',
  storage, // This now uses localStorage
  whitelist: ['auth', 'advert', 'vehicles'],
  debug: true
};

const rootReducer = combineReducers({
  auth: authReducer,
  advert: advertReducer,
  vehicles: vehicleReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      }
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;