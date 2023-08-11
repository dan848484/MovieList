import { Button, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import style from "./old-password-form.module.scss";

export interface OldPasswordFormProps {
  onConfirm: (oldPassword: string) => void;
}

export const OldPasswordForm = (props: OldPasswordFormProps) => {
  const [oldPassword, setOldPassword] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onConfirm(oldPassword);
  };

  useEffect(() => {
    //初期アニメーション
    if (!ref.current) return;
    ref.current.animate(
      [
        {
          opacity: 0,
        },
        { opacity: 1 },
      ],
      {
        duration: 200,
      }
    );
  }, []);

  return (
    <>
      <form onSubmit={onSubmit} ref={ref} className={style.form}>
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
        <Button
          variant="contained"
          type="submit"
          className={style.submitButton}
        >
          次へ
        </Button>
      </form>
    </>
  );
};
