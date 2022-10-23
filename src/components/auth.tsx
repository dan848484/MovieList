import { CircularProgress } from "@mui/material";
import { useState, useEffect, FCX, createContext, ReactNode } from "react";
import { Auth } from "../auth/auth";
import { LoginForm } from "./loginForm";

interface AuthComponentProps {
  children?: ReactNode;
}

export const TokenContext = createContext("");

export const AuthComponent: FCX<AuthComponentProps> = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loginRequired, setLoginRequired] = useState(true);
  const [auth] = useState(new Auth());
  const [token, setToken] = useState("");

  /**
   * ログイン成功時
   */
  const handleFormComplete = () => {
    setLoginRequired(false);
  };

  useEffect(() => {
    (async () => {
      try {
        await auth.setUpAuth();
        const session = await auth.isLogined();
        setToken(session.getIdToken().getJwtToken());
        setLoginRequired(false);
      } catch (error) {
        console.log(
          "ログインが完了していません。ログインフォームに遷移します。",
          error
        );
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      <TokenContext.Provider value={token}>
        {isLoading && (
          <div className="w-screen h-screen flex justify-center items-center ">
            <CircularProgress className="[zoom:1.5]" />
          </div>
        )}
        {!isLoading && (
          <>
            {loginRequired && (
              <LoginForm
                onComplete={handleFormComplete}
                auth={auth}
              ></LoginForm>
            )}
            {!loginRequired && props.children}
          </>
        )}
      </TokenContext.Provider>
    </>
  );
};
