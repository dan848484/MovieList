import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Movie, IMovie } from "../../model/Movie.model";

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
    let response = await fetch(`/api/proxy/delete?id=${id}`);
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
      };
      return movie;
    } catch (error) {
      console.log(error);
      return api.rejectWithValue(error);
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
  reducers: {
    // add: (state, action: PayloadAction<Movie>) => {
    //   if (!state.movies) state.movies = [];
    //   state.movies.push(action.payload);
    // },
    // update: (state, action: PayloadAction<Movie>) => {
    //   if (!state.movies) return;
    //   const index = state.movies.findIndex((m) => {
    //     return m.id === action.payload.id;
    //   });
    //   if (index < 0) {
    //     return;
    //   }
    //   state.movies[index] = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postMovie.pending, (state, action) => {
        // action.meta.arg;
      })
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
        (movie[action.meta.arg.target] as any) = action.meta.arg.value;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        console.error(action.payload);
        state.movies = state.movies!.filter((m) => {
          return m.id === action.payload;
        });
        //pendingの時点で変更しているんだけど、rejectされた時はもとの設定に戻すみたいなことを過去の自分はやりたかったんだと思う。
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        // if (!state.movies) return;
        // for (let i = 0; i < state.movies.length; i++) {
        //   if (state.movies[i].id != action.payload.id) continue;
        //   state.movies[i] = action.payload;
        //   break;
        // }
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        if (!state.movies) return;
        state.movies = state.movies.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteMovie.rejected, (state, action) => {})
      .addCase(loadAll.fulfilled, (state, action) => {
        state.movies = action.payload;
      });
  },
});

// const { add, update } = movieSlice.actions;

export const selectMovies = (state: RootState) => state.movies;

export default movieSlice.reducer;
