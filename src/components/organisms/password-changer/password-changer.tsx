import { useContext, useState } from "react";
import { NewPasswordForm } from "../../moleculs/new-password-form/new-password-form";
import style from "./password-changer.module.css";
import { AuthClientContext } from "../../../providers/auth-client.provider";
import { AuthClient } from "../../../auth-client/authClient";
import { OldPasswordForm } from "../../moleculs/old-password-form/old-password-form";
export type PasswordChangerViewMode = "old-password" | "new-password";

export interface PasswordChangerProps {
  viewMode: PasswordChangerViewMode;
  setViewMode: (viewMode: PasswordChangerViewMode) => void;
}

export const PasswordChanger = (props: PasswordChangerProps) => {
  const authClient = useContext(AuthClientContext);
  const [isLoading, setIsLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState<string | undefined>(undefined);

  const onOldPasswordInputed = (oldPassword: string) => {
    setOldPassword(oldPassword);
    props.setViewMode("new-password");
  };

  const changePassword = async (newPassword: string) => {
    if (isLoading || !oldPassword) return;
    setIsLoading(true);
    try {
      if (!authClient) {
        alert("authClientを取得できませんでした");
        return;
      }
      await authClient!.changePassword(oldPassword, newPassword);
      authClient.user!.cognitoUser.signOut(() => {
        location.reload();
      });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const view = (mode: PasswordChangerViewMode) => {
    switch (mode) {
      case "old-password":
        return (
          <OldPasswordForm onConfirm={onOldPasswordInputed}></OldPasswordForm>
        );
      case "new-password":
        return (
          <NewPasswordForm
            onConfirmed={changePassword}
            isLoading={isLoading}
          ></NewPasswordForm>
        );
      default:
        return <></>;
    }
  };

  return (
    <div className={style.container}>
      <div className={style.formWrapper}>{view(props.viewMode)}</div>
    </div>
  );
};
