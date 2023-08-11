import type { NextPage } from "next";
import React, { useEffect } from "react";
import { ListElement } from "../src/components/moleculs/list-element/list-element";
import { AddButton } from "../src/components/atoms/add-button/add-button";
import { AddDialogContent } from "../src/components/organisms/add-dialog-content/add-dialog-content";
import { useDialog } from "../src/hooks/useDialog";
import { ListElementSkelton } from "../src/components/moleculs/list-element-skelton/list-element-skelton";
import {
  movieApi,
  useDeleteMovieMutation,
  useGetMoviesQuery,
  usePostMovieMutation,
  useUpdateMovieMutation,
} from "../src/redux/services/movie-service";
import { useSelector } from "react-redux";
import { RootState } from "../src/redux/store";
import { useDispatch } from "react-redux";
import { useWebSocket } from "../src/hooks/useWebSocket";
const Home: NextPage = () => {
  const webSocketClient = useWebSocket();
  const token = useSelector((state: RootState) => state.token.token);
  const [AddDialog, open, close, isOpen] = useDialog(
    AddDialogContent,
    undefined,
    async (name?: string) => {
      if (name) {
        try {
          let movie = (await postMovie(name)) as any;
          if (movie.data) {
            webSocketClient!.send("add", movie.data);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  );
  const dispatch = useDispatch();
  const movies = useGetMoviesQuery(undefined);
  const [postMovie] = usePostMovieMutation();
  const [updateMoive] = useUpdateMovieMutation();
  const [deleteMovie] = useDeleteMovieMutation();
  const completedMovies = (movies.data || [])
    .filter((m) => {
      return !m?.hidden;
    })
    .filter((m) => {
      return !m.watched;
    })
    .map((m, i) => {
      return <ListElement key={i} movie={m}></ListElement>;
    });
  const uncompletedMovies = (movies.data || [])
    .filter((m) => {
      return !m.hidden;
    })
    .filter((m) => {
      return m.watched;
    })
    .map((m, i) => {
      return <ListElement key={i} movie={m}></ListElement>;
    });

  const skeletonListElements = Array<typeof ListElementSkelton>(5)
    .fill(() => <></>)
    .map((_, i) => {
      return <ListElementSkelton key={i}></ListElementSkelton>;
    });

  const onAddButtonClick = () => {
    open();
  };

  useEffect(() => {
    movies.refetch();
  }, [token]);

  useEffect(() => {
    webSocketClient?.subscribe((websocketMessage) => {
      const movie = websocketMessage.movie;
      switch (websocketMessage.messageType) {
        case "update":
          let action = movieApi.util.updateQueryData(
            "getMovies",
            undefined,
            (cache) => {
              const index = cache.findIndex((m) => m.id === movie.id);
              if (!index) return;
              Object.assign(cache[index], movie);
            }
          );
          dispatch(action as any);
          break;
        case "delete":
          action = movieApi.util.updateQueryData(
            "getMovies",
            undefined,
            (cache) => {
              const index = cache.findIndex((m) => m.id === movie.id);
              if (!index) return;
              cache.splice(index, 1);
            }
          );
          dispatch(action as any);
          break;
        case "add":
          action = movieApi.util.updateQueryData(
            "getMovies",
            undefined,
            (cache) => {
              cache.push(movie);
            }
          );
          dispatch(action as any);
          break;
      }
    });
  }, [webSocketClient]);

  return (
    <div
      className="
      px-5
      py-3
      overflow-scroll
      h-full
      box-border
      w-screen
      overflow-x-hidden
      flex
      flex-col
    "
    >
      <div className="grow shrink">
        {movies.data ? completedMovies : skeletonListElements}

        <p className="text-lg font-bold text-gray-800 mt-2 py-5">視聴済み</p>
        {movies.data ? uncompletedMovies : skeletonListElements}
        <AddButton
          className="fixed bottom-[80px] right-6 z-10"
          onClick={onAddButtonClick}
        ></AddButton>
      </div>
      {AddDialog}
    </div>
  );
};

export default Home;
