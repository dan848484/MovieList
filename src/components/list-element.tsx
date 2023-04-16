import { createTheme, width } from "@mui/system";
import { useState } from "react";
import { Movie } from "../model/movie-list.model";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Button, ClickAwayListener, Grow, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import { useDialog } from "../hooks/useDialog";
import { EditDialogContent } from "./dialog-contents/edit-dialog-content";
import {
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} from "../redux/services/movie-service";
import { useWebSocket } from "../hooks/useWebSocket";
interface Props {
  movie: Movie;
}

export const ListElement = (props: Props) => {
  const [menuState, setMenuState] = useState(false);
  const webSocketClient = useWebSocket();

  const [EditDialog, open, close, isOpen] = useDialog(
    EditDialogContent,
    props.movie,
    async (value?: string) => {
      if (value) {
        const updatedMovie = (await updateMovie({
          ...movie,
          name: value,
        })) as any;
        if (updatedMovie.data) {
          webSocketClient?.send("update", updatedMovie.data);
        }
      }
    }
  );
  const [updateMovie] = useUpdateMovieMutation();
  const [deleteMovie] = useDeleteMovieMutation();

  let movie = props.movie;

  const onMarkClick = async () => {
    const updatedMovie = (await updateMovie({
      ...movie,
      watched: !movie.watched,
    })) as any;
    debugger;
    webSocketClient?.send("update", updatedMovie.data);
  };

  const onMenuClick = () => {
    setMenuState(!menuState);
  };

  const editMovie = () => {
    open();
  };

  const removeMovie = async () => {
    const deletedMovie = (await deleteMovie(movie.id)) as any;
    webSocketClient?.send("delete", movie);
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
