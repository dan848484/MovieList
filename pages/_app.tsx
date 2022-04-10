import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Auth } from "../auth/Auth";
import { store } from "../redux/store";
import "../styles/globals.css";
import { LoginForm } from "../Components/LoginForm";

function MyApp({ Component, pageProps }: AppProps) {
  const [loginRequired, setLoginRequired] = React.useState(true);
  const [auth] = React.useState(new Auth());

  /**
   * ログイン成功時に実行する関数
   */
  const handleFormComplete = () => {
    setLoginRequired(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const session = await auth.isLogined();
        console.log(session);
        setLoginRequired(false);
      } catch (error) {
        console.log(
          "ログインが完了していません。ログインフォームに遷移します。"
        );
      }
    })();
  }, []);
  const content = loginRequired ? (
    <LoginForm onComplete={handleFormComplete} auth={auth}></LoginForm>
  ) : (
    <Component {...pageProps} />
  );
  return <Provider store={store}>{content}</Provider>;
}

export default MyApp;
