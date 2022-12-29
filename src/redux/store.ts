import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { movieApi } from "../services/movieService";
import reducer from "./slices/movieSlice";

export const store = configureStore({
  reducer: {
    movies: reducer,
    [movieApi.reducerPath]: movieApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(movieApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
