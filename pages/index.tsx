import type { NextPage } from "next";
import React, { useEffect } from "react";
import { ListElement } from "../src/components/list-element";
import { AddButton } from "../src/components/add-button";
import { AddDialogContent } from "../src/components/dialog-contents/add-dialog-content";
import { useDialog } from "../src/hooks/useDialog";
import { ListElementSkelton } from "../src/components/list-element-skelton";
import {
  movieApi,
  useGetMoviesQuery,
  usePostMovieMutation,
} from "../src/redux/services/movie-service";
import { useSelector } from "react-redux";
import { RootState } from "../src/redux/store";
import { useDispatch } from "react-redux";
import { useWebSocket } from "../src/hooks/useWebSocket";
import { Movie } from "../src/model/movie-list.model";
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
  const movies = useGetMoviesQuery(undefined);
  const [postMovie] = usePostMovieMutation();
  const completedMovies = (movies.data || [])
    .filter((m) => {
      return !m.hidden;
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
    webSocketClient?.subscribe((message) => {
      console.log(message);

      switch (message.action) {
        case "update":
          break;
        case "delete":
          break;
        case "add":
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
