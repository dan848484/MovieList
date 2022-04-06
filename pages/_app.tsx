import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Auth } from "../auth/Auth";
import { store } from "../redux/store";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    let auth = new Auth();
    if (auth.getUserInfo()?.session.isValid()) {
      console.log("ログイン状態です。");
    } else {
      console.log("ログインされていない状態です");
      auth.login("tom", "Tomdan8464!");
    }
  }, []);
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
