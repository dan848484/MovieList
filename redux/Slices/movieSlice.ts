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

export const postMovie = createAsyncThunk<Movie, string>(
  "movies/postMovie",
  async (movieName, api) => {
    try {
      const result: IMovie = await (
        await fetch(`/api/proxy/add?name=${movieName}`, {
          method: "POST",
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
  }
);

export const deleteMovie = createAsyncThunk<string, string>(
  "movies/deleteMovie",
  async (id, api) => {
    try {
    } catch (error) {}
    let response: Response = await fetch(`/api/proxy/delete?id=${id}`);
    if (response.ok) {
      return id;
    } else {
      return api.rejectWithValue(response);
    }
  }
);

export const updateMovie = createAsyncThunk<Movie, updateOption>(
  "movies/updateMovie",
  async (option: updateOption, api) => {
    try {
      const result: IMovie = await (
        await fetch(
          `/api/proxy/update?id=${option.id}&type=${option.target}&value=${option.value}`
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
  }
);

export const loadAll = createAsyncThunk<Movie[]>(
  "movies/loadAll",
  async (_, api) => {
    const movies: IMovie[] = await (await fetch("/api/proxy/items")).json();
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
          (m) => m.id === action.meta.arg.id
        );
        if (index < 0) return;
        let movie = state.movies[index];
        movieChache[action.meta.arg.id] = Object.assign({}, movie);
        movie.isBeingUpdated = true;
        (movie[action.meta.arg.target] as string | number | boolean) =
          action.meta.arg.value;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        try {
          const index = state.movies!.findIndex(
            (m) => m.id === action.meta.arg.id
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
        const id = action.meta.arg;
        const movie = state.movies!.find((m) => m.id === id);
        movie && (movie.hidden = true);
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        if (!state.movies) return;
        state.movies = state.movies.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        const id = action.meta.arg;
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
