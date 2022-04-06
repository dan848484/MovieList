import {
  Button,
  Dialog,
  DialogTitle,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { createTheme } from "@mui/system";
import React, { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Movie } from "../pages/Movie.model";
import { edit } from "../redux/Slices/movieSlice";
import { setMovie, open, close } from "../redux/Slices/dialogSlice";

export const EditDialog = () => {
  const [name, setName] = useState("");
  const [inputError, setInputError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const dispatch = useAppDispatch();
  let movie = useAppSelector((state) => {
    return state.dialog.edit.movie;
  });
  let isOpen = useAppSelector((state) => {
    return state.dialog.edit.open;
  });

  const onClick = () => {
    if (name == "") {
      setInputError(true);
      setHelperText("入力してください。");
      return;
    }
    let payload = { ...movie!, newName: name };
    console.log(payload);
    dispatch(edit(payload));
    closeDialog();
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const closeDialog = () => {
    setInputError(false);
    setHelperText("");
    setName("");
    dispatch(close("edit"));
  };

  return (
    <React.Fragment>
      <Dialog open={isOpen} className="rounded-[23px]">
        <div className="w-[310px] box-border p-8">
          <DialogTitle className="[margin: 0 auto;] text-center ">
            <p className="font-bold">編集</p>
          </DialogTitle>
          <div className="h-16">
            <TextField
              onChange={onChange}
              placeholder="映画名をここに入力"
              defaultValue={movie?.name}
              variant="outlined"
              className="w-full"
              error={inputError}
              helperText={helperText}
            ></TextField>
          </div>
          <div className="flex justify-between mt-6">
            <Button
              className="w-28 h-11"
              variant="outlined"
              onClick={closeDialog}
            >
              キャンセル
            </Button>
            <Button className="w-28 h-11" variant="contained" onClick={onClick}>
              更新
            </Button>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
};
