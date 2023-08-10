import { Button, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import style from "./old-password-form.module.scss";

export interface OldPasswordFormProps {
  onConfirm: (oldPassword: string) => void;
}

export const OldPasswordForm = (props: OldPasswordFormProps) => {
  const [oldPassword, setOldPassword] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onConfirm(oldPassword);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <TextField
          className={style.textField}
          label="現在のパスワードを入力"
          variant="outlined"
          margin="dense"
          value={oldPassword}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setOldPassword(event.target.value);
          }}
          type="password"
        />
        <Button variant="text" type="submit">
          次へ
        </Button>
      </form>
    </>
  );
};
