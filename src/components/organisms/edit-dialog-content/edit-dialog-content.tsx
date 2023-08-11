import { Button, DialogTitle, TextField, ThemeProvider } from "@mui/material";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Movie } from "../../../model/movie-list.model";
import { DialogContentProps } from "../../../hooks/useDialog";

export const EditDialogContent = (props: DialogContentProps<Movie>) => {
  const [name, setName] = useState("");
  const [inputError, setInputError] = useState(false);
  const [helperText, setHelperText] = useState("");

  let movie = props.data;

  const onClick = () => {
    if (name == "") {
      setInputError(true);
      setHelperText("入力してください。");
      return;
    }

    closeDialog();
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const closeDialog = () => {
    setInputError(false);
    setHelperText("");
    setName("");
    props.close(name);
  };

  const cancel = () => {
    props.close();
  };

  return (
    <>
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
          <Button className="w-28 h-11" variant="outlined" onClick={cancel}>
            キャンセル
          </Button>
          <Button className="w-28 h-11" variant="contained" onClick={onClick}>
            更新
          </Button>
        </div>
      </div>
    </>
  );
};
