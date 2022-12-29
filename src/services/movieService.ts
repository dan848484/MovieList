import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { url } from "inspector";
import { async } from "rxjs";
import { Movie } from "../model/Movie.model";
import { UpdateOption } from "../redux/slices/movieSlice";

export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/proxy/" }),
  endpoints: (builder) => ({
    getMovies: builder.query<Movie[], string>({
      query: (token) => ({
        url: "items",
        headers: {
          Authorization: "Bearer " + token,
        },
      }),
    }),
    postMovie: builder.mutation<Movie, { name: string; token: string }>({
      query: (arg) => ({
        url: `add?name=${arg.name}`,
        headers: {
          Authorization: "Bearer " + arg.token,
        },
        method: "post",
      }),
      onQueryStarted: async (arg, api) => {
        try {
          const result = await api.queryFulfilled;
          api.dispatch(
            movieApi.util.updateQueryData("getMovies", arg.token, (draft) => {
              draft.push(result.data);
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateMovie: builder.mutation<Movie, UpdateOption & { token: string }>({
      query: (option) => ({
        url: `update?id=${option.id}&type=${option.target}&value=${option.value}`,
        method: "post",
        headers: {
          Authorization: "Bearer " + option.token,
        },
      }),
      onQueryStarted: async (arg, api) => {
        try {
          const result = await api.queryFulfilled;
          api.dispatch(
            movieApi.util.updateQueryData("getMovies", arg.token, (draft) => {
              const index = draft.findIndex((movie) => movie.id === arg.id);
              if (index) {
                draft[index] = result.data;
              } else {
                throw new Error("indexが見つかりませんでした。");
              }
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    deleteMovie: builder.mutation<unknown, { id: string; token: string }>({
      query: (arg) => ({
        url: `delete?id=${arg.id}`,
        method: "post",

        headers: {
          Authorization: "Bearer " + arg.token,
        },
      }),
      onQueryStarted: async (arg, api) => {
        try {
          api.dispatch(
            movieApi.util.updateQueryData("getMovies", arg.token, (draft) => {
              const index = draft.findIndex((movie) => movie.id === arg.id);
              draft.splice(index, 1);
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useDeleteMovieMutation,
  useUpdateMovieMutation,
  usePostMovieMutation,
} = movieApi;
