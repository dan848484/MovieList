import { configureStore } from "@reduxjs/toolkit";
import reducer from "./Slices/movieSlice";
import { dialogReducer } from "./Slices/dialogSlice";

export const store = configureStore({
  reducer: {
    movies: reducer,
    dialog: dialogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
