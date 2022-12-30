import type { NextPage } from "next";
import React, { useEffect } from "react";
import { ListElement } from "../src/components/listElement";
import { AddButton } from "../src/components/addButton";
import { AddDialogContent } from "../src/components/dialogContents/addDialogContent";
import { useDialog } from "../src/hooks/useDialog";
import { ListElementSkelton } from "../src/components/listElementSkelton";
import {
  movieApi,
  useGetMoviesQuery,
  usePostMovieMutation,
} from "../src/redux/services/movieService";
import { useSelector } from "react-redux";
import { RootState } from "../src/redux/store";
import { useDispatch } from "react-redux";
const Home: NextPage = () => {
  const token = useSelector((state: RootState) => state.token.value);
  const [AddDialog, open, close, isOpen] = useDialog(
    AddDialogContent,
    undefined,
    async (name?: string) => {
      if (name) {
        try {
          updateMovie(name);
        } catch (error) {
          console.error(error);
        }
      }
    }
  );
  const movies = useGetMoviesQuery();
  const [updateMovie] = usePostMovieMutation();
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

  return (
    <div
      className="
      px-5
      py-3
      box-border
      w-screen
      h-screen
      overflow-x-hidden
      flex
      flex-col
    "
    >
      <div className="w-full h-20 font-bold text-3xl grow-0 fixed bg-white z-10 top-0 left-0 pl-[26px] shadow-sm">
        <span className="relative top-[23px] ">MovieList</span>
      </div>
      <div className="grow mt-16">
        {movies.data ? completedMovies : skeletonListElements}

        <p className="text-lg font-bold text-gray-800 mt-2 py-5">視聴済み</p>
        {movies.data ? uncompletedMovies : skeletonListElements}
        <AddButton
          className="fixed bottom-7 right-6 z-10"
          onClick={onAddButtonClick}
        ></AddButton>
      </div>
      {AddDialog}
    </div>
  );
};

export default Home;
