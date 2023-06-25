import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import style from "./password-change-form.module.scss";
import { Button, FormControl, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export interface PasswordFormProps {
  onConfirmed: (password: string) => void;
  isLoading: boolean;
}

export const PasswordChangeForm = (props: PasswordFormProps) => {
  const [inputedPassword, setInputedPassword] = useState("");
  const [reinputedPassword, setReinputedPassword] = useState("");
  const [isMatched, setIsMatched] = useState(false);
  const [helperTexts, setHelperTexts] = useState(["", ""]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(props.isLoading);
  }, [props.isLoading]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (
      isMatched &&
      inputedPassword.length > 0 &&
      reinputedPassword.length > 0
    ) {
      props.onConfirmed(inputedPassword);
    } else {
      setIsMatched(false);
      setHelperTexts([
        inputedPassword.length ? "" : "入力してください。",
        reinputedPassword.length ? "" : "入力してください。",
      ]);
    }
  };
  const validateInputs = (
    inputedPassword: string,
    reinputedPassword: string
  ) => {
    if (reinputedPassword !== "" && inputedPassword !== reinputedPassword) {
      helperTexts[0] = "";
      helperTexts[1] = "入力されたパスワードと一致しません。";
      setHelperTexts(helperTexts);
      setIsMatched(false);
      return;
    }
    setHelperTexts(["", ""]);
    setIsMatched(true);
  };
  return (
    <FormControl
      component="form"
      onSubmit={onSubmit}
      required={true}
      className={style.form}
    >
      <div className={style.textFieldsArea}>
        <TextField
          className={style.textField}
          label="新しいパスワードを入力"
          variant="outlined"
          margin="dense"
          value={inputedPassword}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setInputedPassword(event.target.value);
            validateInputs(event.target.value, reinputedPassword);
          }}
          type="password"
          error={!isMatched}
          helperText={helperTexts[0]}
          disabled={isLoading}
        />
        <TextField
          className={style.textField}
          label="パスワードを再入力"
          variant="outlined"
          margin="dense"
          value={reinputedPassword}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setReinputedPassword(event.target.value);
            validateInputs(inputedPassword, event.target.value);
          }}
          error={!isMatched}
          type="password"
          helperText={helperTexts[1]}
          disabled={isLoading}
        />
      </div>

      <LoadingButton
        variant="contained"
        type="submit"
        className={style.submitButton}
        loading={isLoading}
      >
        変更
      </LoadingButton>
    </FormControl>
  );
};
