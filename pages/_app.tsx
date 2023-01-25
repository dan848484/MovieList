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

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  return (
    <CacheProvider value={emotionCache!}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <AuthComponent>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AuthComponent>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
