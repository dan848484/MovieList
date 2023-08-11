import Head from "next/head";
import type { AppProps } from "next/app";
import React, {
  ReactElement,
  ReactNode,
  createContext,
  useEffect,
} from "react";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import "../src/styles/globals.css";
import { ThemeProvider } from "@mui/material";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../theme";
import createEmotionCache from "../createEmotionCache";
import { AuthGuardComponent } from "../src/components/templates/auth/auth";
import Layout from "../src/components/templates/layout/layout";
import { WebSocketProvider } from "../src/providers/websocket.provider";
import { NextPage } from "next";

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  props: {
    websocketUrl: string;
  };
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

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
          <AuthGuardComponent>
            <WebSocketProvider websocketUrl={props.websocketUrl}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </WebSocketProvider>
          </AuthGuardComponent>
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
