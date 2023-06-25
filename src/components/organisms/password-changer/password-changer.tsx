import { useState } from "react";
import { PasswordChangeForm } from "../../moleculs/password-change-form/password-change-form";
import style from "./password-changer.module.css";

export const PasswordChanger = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className={style.container}>
      <div className={style.formWrapper}>
        <PasswordChangeForm
          onConfirmed={(password) => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
            }, 3000);
          }}
          isLoading={isLoading}
        ></PasswordChangeForm>
      </div>
    </div>
  );
};
