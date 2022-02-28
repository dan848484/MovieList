import type { NextPage } from "next";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { add } from "./Slices/movieSlice";
import { ListElement } from "./Components/ListElement";
import { createTheme, IconButton } from "@mui/material";
import { AddButton } from "./Components/AddButton";
import { AddDialog } from "./Components/AddDialog";
import { EditDialog } from "./Components/EditDialog";

const Home: NextPage = () => {
  const movies = useAppSelector((state) => state.movies);
  const dispatch = useAppDispatch();
  const listElements = movies.movies.map((m, i) => {
    return <ListElement key={i} movie={m}></ListElement>;
  });

  const [addingDialogState, setAddingDialogState] = useState(false);
  const onAddButtonClick = () => {
    setAddingDialogState(!addingDialogState);
  };
  const addNewMovie = (name: string) => {
    dispatch(add(name));
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
        {listElements}
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
