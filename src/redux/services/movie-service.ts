import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { Movie } from "../../model/movie.model";
import { RootState } from "../store";

export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/proxy/",
    prepareHeaders: (headers, api) => {
      const token = (api.getState() as RootState).token.value;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getMovies: builder.query<Movie[], unknown>({
      query: () => ({
        url: "movies",
      }),
    }),
    postMovie: builder.mutation<Movie, string>({
      query: (name) => ({
        url: "movies",
        method: "post",
        body: {
          name,
        },
      }),
      onQueryStarted: async (arg, api) => {
        try {
          const result = await api.queryFulfilled;

          api.dispatch(
            movieApi.util.updateQueryData("getMovies", undefined, (draft) => {
              draft.push(result.data);
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateMovie: builder.mutation<Movie, Movie>({
      query: (movie) => ({
        url: "movies",
        method: "put",
        body: movie,
      }),
      onQueryStarted: async (arg, api) => {
        try {
          const result = await api.queryFulfilled;
          api.dispatch(
            movieApi.util.updateQueryData("getMovies", undefined, (draft) => {
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
    deleteMovie: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `movies/${id}`,
        method: "delete",
      }),
      onQueryStarted: async (arg, api) => {
        try {
          api.dispatch(
            movieApi.util.updateQueryData("getMovies", undefined, (draft) => {
              const index = draft.findIndex((movie) => movie.id === arg);
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
