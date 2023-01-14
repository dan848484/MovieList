import {
  Button,
  Dialog,
  DialogTitle,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { DialogContent, DialogContentProps } from "../../hooks/useDialog";

export const AddDialogContent = (props: DialogContentProps<string>) => {
  const [name, setName] = useState("");
  const [inputError, setInputError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [sending, setSending] = useState(false);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const close = () => {
    setInputError(false);
    setHelperText("");
    setName("");
    props.close(name);
  };
  const onClick = () => {
    if (name == "") {
      setInputError(true);
      setHelperText("入力してください。");
      return;
    }
    close();
  };

  return (
    <>
      <div className="w-[310px] box-border p-8">
        <DialogTitle className="[margin: 0 auto;] text-center ">
          <p className="font-bold">新規作成</p>
        </DialogTitle>
        <div className="h-16">
          <TextField
            onChange={onChange}
            placeholder="映画名をここに入力"
            variant="outlined"
            className="w-full"
            error={inputError}
            helperText={helperText}
          ></TextField>
        </div>
        <div className="flex justify-between mt-6">
          <Button className="w-28 h-11 " variant="outlined" onClick={close}>
            キャンセル
          </Button>
          <Button className="w-28 h-11" variant="contained" onClick={onClick}>
            作成
          </Button>
        </div>
      </div>
    </>
  );
};
