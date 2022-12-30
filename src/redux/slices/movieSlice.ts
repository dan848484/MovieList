import {
  createAsyncThunk,
  createSlice,
  Dispatch,
  PayloadAction,
} from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import type { RootState } from "../store";
import { Movie, IMovie } from "../../model/Movie.model";
import axios from "axios";

interface MovieState {
  movies: Movie[] | undefined;
}

/**
 * 設定の変更のオプション
 * (updateMovieのpayloadへ渡す用)
 * APIの設計を今後見直すのでその時に改善する予定
 */
export interface UpdateOption {
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

// export const postMovie = createAsyncThunk<
//   Movie,
//   { movieName: string; token: string }
// >("movies/postMovie", async (arg, api) => {
//   try {
//     const result: IMovie = await (
//       await fetch(`/api/proxy/add?name=${arg.movieName}`, {
//         method: "POST",
//         headers: {
//           Authorization: "Bearer " + arg.token,
//         },
//       })
//     ).json();
//     const movie: Movie = {
//       ...result,
//       hidden: false,
//       isBeingUpdated: false,
//     };
//     return movie;
//   } catch (error) {
//     return api.rejectWithValue(error);
//   }
// });

// export const postMovieThunk = (movie:Movie,token:string)=>async (dispatch:Dispatch)=>{
//   const response = await axios.post<Movie>(`/api/proxy/add?name=${movie.name}`,undefined,{
//     headers:{
//       Authorazation: "Bearer" + token
//     }
//   });
//   response.data
// }

// export const deleteMovie = createAsyncThunk<
//   string,
//   { id: string; token: string }
// >("movies/deleteMovie", async (arg, api) => {
//   try {
//   } catch (error) {}
//   let response: Response = await fetch(`/api/proxy/delete?id=${arg.id}`, {
//     headers: {
//       Authorization: "Bearer " + arg.token,
//     },
//   });
//   if (response.ok) {
//     return arg.id;
//   } else {
//     return api.rejectWithValue(response);
//   }
// });

// export const updateMovie = createAsyncThunk<
//   Movie,
//   { option: updateOption; token: string }
// >("movies/updateMovie", async (arg, api) => {
//   try {
//     const result: IMovie = await (
//       await fetch(
//         `/api/proxy/update?id=${arg.option.id}&type=${arg.option.target}&value=${arg.option.value}`,
//         {
//           headers: {
//             Authorization: "Bearer " + arg.token,
//           },
//         }
//       )
//     ).json();
//     let movie: Movie = {
//       ...result,
//       hidden: false,
//       isBeingUpdated: true,
//     };
//     return movie;
//   } catch (error) {
//     console.log(error);
//     return api.rejectWithValue({});
//   }
// });

// export const loadAll = createAsyncThunk<Movie[], { token: string }>(
//   "movies/loadAll",
//   async (arg, api) => {
//     const movies: IMovie[] = await (
//       await fetch("/api/proxy/items", {
//         headers: {
//           Authorization: "Bearer " + arg.token,
//         },
//       })
//     ).json();
//     return movies.map((m) => ({ ...m, hidden: false, isBeingUpdated: false }));
//   }
// );
