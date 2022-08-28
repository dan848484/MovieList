import type { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { postMovie } from "../redux/Slices/movieSlice";
import { ListElement } from "../Components/ListElement";
import { AddButton } from "../Components/AddButton";
import { AddDialog } from "../Components/AddDialog";
import { EditDialog } from "../Components/EditDialog";
import { loadAll } from "../redux/Slices/movieSlice";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import { ListElementSkelton } from "../Components/ListElementSkelton";
import { TokenContext } from "./_app";

const Home: NextPage = () => {
  const movies = useAppSelector((state) => state.movies);
  const dispatch = useAppDispatch();
  const token = useContext(TokenContext);
  const completedMovies = (movies.movies || [])
    .filter((m) => {
      return !m.hidden;
    })
    .filter((m) => {
      return !m.watched;
    })
    .map((m, i) => {
      return <ListElement key={i} movie={m}></ListElement>;
    });
  const uncompletedMovies = (movies.movies || [])
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

  useEffect(() => {
    dispatch(loadAll({ token }));
  }, [token]);

  const [addingDialogState, setAddingDialogState] = useState(false);
  const onAddButtonClick = () => {
    setAddingDialogState(!addingDialogState);
  };
  const addNewMovie = async (name: string) => {
    try {
      dispatch(
        postMovie({
          token,
          movieName: name,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

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
        {movies.movies ? completedMovies : skeletonListElements}
        <p className="text-lg font-bold text-gray-800 mt-2 py-5">視聴済み</p>
        {movies.movies ? uncompletedMovies : skeletonListElements}
        <AddButton
          className="fixed bottom-7 right-6 z-10"
          onClick={onAddButtonClick}
        ></AddButton>
        <AddDialog
          isOpen={addingDialogState}
          onClick={addNewMovie}
          onClose={() => {
            setAddingDialogState(false);
          }}
        ></AddDialog>
        <EditDialog></EditDialog>
      </div>
    </div>
  );
};

export default Home;
