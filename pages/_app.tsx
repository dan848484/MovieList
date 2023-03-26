import Head from "next/head";
import type { AppProps } from "next/app";
import React, { createContext, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import "../src/styles/globals.css";
import { ThemeProvider } from "@mui/material";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../theme";
import createEmotionCache from "../createEmotionCache";
import { AuthComponent } from "../src/components/auth";
import Layout from "../src/components/layout";
import { WebSocketProvider } from "../src/providers/websocket.provider";

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  props: {
    websocketUrl: string;
  };
}

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
  props,
}: MyAppProps) {
  return (
    <CacheProvider value={emotionCache!}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <AuthComponent>
            <WebSocketProvider websocketUrl={props.websocketUrl}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </WebSocketProvider>
          </AuthComponent>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.getInitialProps = async () => {
  const websocketUrl = process.env.WEBSOCKET_API;
  return {
    props: {
      websocketUrl,
    },
  };
};

export default MyApp;
