import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../../pages/Movie.model";

type Kinds = "edit";

type dialogState = Record<
  Kinds,
  {
    open: boolean;
    movie: Movie | null;
  }
>;

const initialState: dialogState = {
  edit: {
    open: false,
    movie: null,
  },
};

export const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    setMovie: (
      state,
      action: PayloadAction<{ movie: Movie | null; kind: Kinds }>
    ) => {
      state[action.payload.kind].movie = action.payload.movie;
    },
    open: (state, action: PayloadAction<Kinds>) => {
      state[action.payload].open = true;
    },
    close: (state, action: PayloadAction<Kinds>) => {
      state[action.payload].open = false;
    },
  },
});

//action creator
export const { setMovie, open, close } = dialogSlice.actions;

export const dialogReducer = dialogSlice.reducer;
