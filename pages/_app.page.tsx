import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'antd/dist/antd.css';
import 'draft-js-emoji-plugin/lib/plugin.css';
import 'draft-js-hashtag-plugin/lib/plugin.css';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import 'draft-js-linkify-plugin/lib/plugin.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import '../styles.css';

import Head from 'next/head';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import Loader from '../components/loader';
import { FilterProvider } from '../lib/context/filters';
import { NewItemProvider } from '../lib/context/newItems';
import { getUserFromStorage, UserProvider } from '../lib/context/users';
import theme from '../lib/theme';

function Loading() {
  return (
    <div>
      <Loader />
    </div>
  );
}

export default function App({ Component, pageProps, router }) {
  const user = getUserFromStorage();
  const setComponentAndRedirect = () => {
    Component = Loading;
    if (process.browser) {
      window.location.href = window.location.origin;
    }
  };
  if (
    !user &&
    router.route !== '/' &&
    router.route !== '/login' &&
    router.route !== '/sign-up'
  ) {
    setComponentAndRedirect();
  } else if (
    (!user || user.role !== 1) &&
    router.route.indexOf('/admin') === 0
  ) {
    setComponentAndRedirect();
  }
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <FilterProvider>
          <NewItemProvider>
            <>
              <Head>
                <title>Cards</title>
                <link
                  rel="apple-touch-icon"
                  sizes="180x180"
                  href="/favicon/apple-touch-icon.png"
                />
                <link
                  rel="icon"
                  type="image/png"
                  sizes="32x32"
                  href="/favicon/favicon-32x32.png"
                />
                <link
                  rel="icon"
                  type="image/png"
                  sizes="16x16"
                  href="/favicon/favicon-16x16.png"
                />
                <link rel="manifest" href="/favicon/site.webmanifest" />
                <link
                  rel="mask-icon"
                  href="/favicon/safari-pinned-tab.svg"
                  color="#0984e3"
                ></link>
                <link rel="shortcut icon" href="/favicon/favicon.ico" />
                <meta name="msapplication-TileColor" content="#0984e3" />
                <meta
                  name="msapplication-config"
                  content="/favicon/browserconfig.xml"
                />
                <meta name="theme-color" content="#0984e3" />
              </Head>
              <Component {...pageProps} />
            </>
          </NewItemProvider>
        </FilterProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
