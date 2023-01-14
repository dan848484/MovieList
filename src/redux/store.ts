import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { movieApi } from "./services/movie-service";
import tokenReducer from "./slices/token-slice";
export const store = configureStore({
  reducer: {
    token: tokenReducer,
    [movieApi.reducerPath]: movieApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(movieApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
