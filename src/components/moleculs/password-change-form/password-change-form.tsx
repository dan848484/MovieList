import { ChangeEvent, FormEvent, useState } from "react";
import style from "./password-change-form.module.scss";
import { Button, FormControl, TextField } from "@mui/material";

export interface PasswordFormProps {
  onConfirmed: (password: string) => void;
}

export const PasswordChangeForm = (props: PasswordFormProps) => {
  const [inputedPassword, setInputedPassword] = useState("");
  const [reinputedPassword, setReinputedPassword] = useState("");
  const [isMatched, setIsMatched] = useState(false);
  const [helperTexts, setHelperTexts] = useState(["", ""]);
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log(inputedPassword, reinputedPassword);
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
        />
      </div>

      <Button variant="contained" type="submit" className={style.submitButton}>
        変更
      </Button>
    </FormControl>
  );
};
