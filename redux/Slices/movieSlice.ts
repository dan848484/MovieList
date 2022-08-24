import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Movie, IMovie } from "../../model/Movie.model";
import config from "../../Movielist.config";

interface MovieState {
  movies: Movie[] | undefined;
}

/**
 * 設定の変更のオプション
 * (updateMovieのpayloadへ渡す用)
 * APIの設計を今後見直すのでその時に改善する予定
 */
interface updateOption {
  id: string;
  /**
   * 変更したい項目
   */
  target: Exclude<keyof Movie, "id">;
  /**
   * 設定する値
   */
  value: string | number | boolean;
}

const initialState: MovieState = {
  movies: undefined,
};

/**
 * 現在更新中のMovieを記録しておくキャッシュ
 */
const movieChache: Record<string, Movie> = {};

export const postMovie = createAsyncThunk<
  Movie,
  { movieName: string; token: string }
>("movies/postMovie", async (arg, api) => {
  try {
    const result: IMovie = await (
      await fetch(`/api/proxy/add?name=${arg.movieName}`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + arg.token,
        },
      })
    ).json();
    const movie: Movie = {
      ...result,
      hidden: false,
      isBeingUpdated: false,
    };
    return movie;
  } catch (error) {
    return api.rejectWithValue(error);
  }
});

export const deleteMovie = createAsyncThunk<
  string,
  { id: string; token: string }
>("movies/deleteMovie", async (arg, api) => {
  try {
  } catch (error) {}
  let response: Response = await fetch(`/api/proxy/delete?id=${arg.id}`, {
    headers: {
      Authorization: "Bearer " + arg.token,
    },
  });
  if (response.ok) {
    return arg.id;
  } else {
    return api.rejectWithValue(response);
  }
});

export const updateMovie = createAsyncThunk<
  Movie,
  { option: updateOption; token: string }
>("movies/updateMovie", async (arg, api) => {
  try {
    const result: IMovie = await (
      await fetch(
        `/api/proxy/update?id=${arg.option.id}&type=${arg.option.target}&value=${arg.option.value}`,
        {
          headers: {
            Authorization: "Bearer " + arg.token,
          },
        }
      )
    ).json();
    let movie: Movie = {
      ...result,
      hidden: false,
      isBeingUpdated: true,
    };
    return movie;
  } catch (error) {
    console.log(error);
    return api.rejectWithValue({});
  }
});

export const loadAll = createAsyncThunk<Movie[], { token: string }>(
  "movies/loadAll",
  async (arg, api) => {
    const movies: IMovie[] = await (
      await fetch("/api/proxy/items", {
        headers: {
          Authorization: "Bearer " + arg.token,
        },
      })
    ).json();
    return movies.map((m) => ({ ...m, hidden: false, isBeingUpdated: false }));
  }
);

export const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postMovie.pending, (state, action) => {})
      .addCase(postMovie.fulfilled, (state, action) => {
        state.movies = [...(state.movies || []), action.payload];
        state.movies.sort((a, b) => {
          return b.addedDate - a.addedDate;
        });
      })
      .addCase(postMovie.rejected, (state, action) => {})
      .addCase(updateMovie.pending, (state, action) => {
        if (!state.movies) return;
        const index = state.movies.findIndex(
          (m) => m.id === action.meta.arg.option.id
        );
        if (index < 0) return;
        let movie = state.movies[index];
        movieChache[action.meta.arg.option.id] = Object.assign({}, movie);
        movie.isBeingUpdated = true;
        (movie[action.meta.arg.option.target] as string | number | boolean) =
          action.meta.arg.option.value;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        try {
          const index = state.movies!.findIndex(
            (m) => m.id === action.meta.arg.option.id
          );
          if (index < 0) return;
          state.movies![index!] = movieChache[index];
          delete movieChache[state.movies![index].id];
        } catch (error) {
          console.error(error);
        }
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        const updatedMovie = action.payload;
        const index = state!.movies!.findIndex((m) => m.id === updatedMovie.id);
        try {
          state!.movies![index].isBeingUpdated = false;
        } catch (error) {
          console.error(error);
        }

        delete movieChache[state.movies![index].id];
      })
      .addCase(deleteMovie.pending, (state, action) => {
        const id = action.meta.arg.id;
        const movie = state.movies!.find((m) => m.id === id);
        movie && (movie.hidden = true);
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        if (!state.movies) return;
        state.movies = state.movies.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        const id = action.meta.arg.id;
        const movie = state.movies!.find((m) => m.id === id);
        movie && (movie.hidden = false);
      })
      .addCase(loadAll.fulfilled, (state, action) => {
        state.movies = action.payload;
      });
  },
});

export const selectMovies = (state: RootState) => state.movies;

export default movieSlice.reducer;
