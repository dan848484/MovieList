import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Auth } from "../auth/Auth";
import { store } from "../redux/store";
import "../styles/globals.css";
import { LoginForm } from "../Components/LoginForm";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppDispatch } from "../redux/hooks";

function MyApp({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [loginRequired, setLoginRequired] = React.useState(true);
  const [auth] = React.useState(new Auth());

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
    <Provider store={store}>
      {isLoading && (
        <div className="w-screen h-screen flex justify-center items-center ">
          <CircularProgress className="[zoom:1.5]" />
        </div>
      )}
      {!isLoading && (
        <>
          {loginRequired && (
            <LoginForm onComplete={handleFormComplete} auth={auth}></LoginForm>
          )}
          {!loginRequired && <Component {...pageProps} />}
        </>
      )}
    </Provider>
  );
}

export default MyApp;
