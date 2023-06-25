import { PasswordChangeForm } from "../../moleculs/password-change-form/password-change-form";
import style from "./password-changer.module.css";

export const PasswordChanger = () => {
  return (
    <div className={style.container}>
      <div className={style.formWrapper}>
        <PasswordChangeForm
          onConfirmed={() => {
            console.log("confirmed!");
          }}
        ></PasswordChangeForm>
      </div>
    </div>
  );
};
