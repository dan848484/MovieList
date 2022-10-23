import { configureStore } from "@reduxjs/toolkit";
import reducer from "./slices/movieSlice";

export const store = configureStore({
  reducer: {
    movies: reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
