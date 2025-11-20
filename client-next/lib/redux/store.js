import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from "./modules";
import { setAuthToken } from "../utils";

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['users', 'profiles'], // Only persist users and profiles
  blacklist: ['alerts'], // Don't persist alerts
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store, null, () => {
  // After rehydration, set the token in axios
  const state = store.getState();
  if (state.users && state.users.token) {
    setAuthToken(state.users.token);
  }
});

let currentState = store.getState();

store.subscribe(() => {
  let previousState = currentState;
  currentState = store.getState();

  if (previousState.users.token !== currentState.users.token) {
    const token = currentState.users.token;
    setAuthToken(token);
  }
});

export default store;