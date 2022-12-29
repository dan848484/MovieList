import { createTheme, width } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Movie } from "../model/Movie.model";
// import { remove, mark, unmark } from "../redux/Slices/movieSlice";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Button,
  ButtonBase,
  ClickAwayListener,
  Grow,
  IconButton,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
// import { updateMovie, deleteMovie } from "../redux/slices/movieSlice";
import { useDialog } from "../hooks/useDialog";
import { EditDialogContent } from "./dialogContents/editDialogContent";
import {
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} from "../redux/services/movieService";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
interface Props {
  movie: Movie;
}

export const ListElement = (props: Props) => {
  const [menuState, setMenuState] = useState(false);

  const [EditDialog, open, close, isOpen] = useDialog(
    EditDialogContent,
    props.movie,
    (value?: string) => {
      if (value) {
        updateMovie({
          id: movie!.id,
          target: "name",
          value,
        });
      }
    }
  );
  const [updateMovie] = useUpdateMovieMutation();
  const [deleteMovie] = useDeleteMovieMutation();

  let movie = props.movie;

  const onMarkClick = () => {
    updateMovie({
      id: movie.id,
      target: "watched",
      value: !movie.watched,
    });
  };

  const onMenuClick = () => {
    setMenuState(!menuState);
  };

  const editMovie = () => {
    open();
  };

  const removeMovie = async () => {
    deleteMovie(movie.id);
    setMenuState(false);
  };
  return (
    <div
      className={`w-full flex-initial flex bg-gray-200 px-4 py-2 rounded-xl mt-5 `}
    >
      <div className="flex grow relative top-2 overflow-hidden">
        <IconButton className="w-6 h-6" onClick={onMarkClick}>
          <div
            className={`w-6 h-6 shrink-0 rounded-full relative border ${
              movie.watched ? "border-blue-500" : "border-gray-500"
            } `}
          >
            <div
              className={`${
                movie.watched
                  ? "absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-blue-500 w-[17px] h-[17px] rounded-full"
                  : "hidden"
              } `}
            ></div>
          </div>
        </IconButton>

        <p className="ml-3 grow overflow-hidden text-ellipsis whitespace-nowrap">
          {movie.name}
        </p>
      </div>

      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={() => {
          setMenuState(false);
        }}
      >
        <div className="relative grow-0 shrink-0 w-[43px]">
          <IconButton disableRipple={true} onClick={onMenuClick}>
            <MoreHorizIcon></MoreHorizIcon>
          </IconButton>
          <Grow in={menuState}>
            <div className="absolute w-36 right-0 bg-white shadow-lg p-3 rounded-md z-[5]">
              <Button variant="text" onClick={editMovie}>
                <div className="flex">
                  <EditIcon></EditIcon>
                  <p className="ml-3">編集する</p>
                </div>
              </Button>
              <Button variant="text" onClick={removeMovie}>
                <div className="flex">
                  <RemoveCircleOutlineIcon className="text-red-600"></RemoveCircleOutlineIcon>
                  <p className="text-red-600 ml-3">削除する</p>
                </div>
              </Button>
            </div>
          </Grow>
        </div>
      </ClickAwayListener>
      {EditDialog}
    </div>
  );
};
