import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Movie } from "../../pages/Movie.model";

interface MovieState {
  movies: Movie[];
}

const initialState: MovieState = {
  movies: [],
};

export const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    add: {
      reducer: (state, action: PayloadAction<Movie>) => {
        state.movies = [...state.movies, action.payload];
        state.movies.sort((a, b) => {
          return b.addedDate - a.addedDate;
        });
      },
      prepare: (name: string) => {
        return {
          payload: {
            id: nanoid(),
            addedDate: new Date().getTime(),
            name: name,
            watched: false,
          },
        };
      },
    },
    remove: (state, action: PayloadAction<Movie>) => {
      state.movies = state.movies.filter((m) => {
        return m.id !== action.payload.id;
      });
    },
    edit: (state, action: PayloadAction<Movie & { newName: string }>) => {
      const movie = state.movies.find((m) => {
        return m.id === action.payload.id;
      });
      if (!movie) {
        return;
      }
      movie.name = action.payload.newName;
    },
    mark: (state, action: PayloadAction<{ id: string }>) => {
      let movie = state.movies.find((m) => m.id === action.payload.id);
      movie && (movie.watched = true);
    },
    unmark: (state, action: PayloadAction<{ id: string }>) => {
      let movie = state.movies.find((m) => m.id === action.payload.id);
      movie && (movie.watched = false);
    },
  },
});

export const { add, remove, edit, mark, unmark } = movieSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.movies;

export default movieSlice.reducer;
