import { Layout } from 'antd';
import Head from 'next/head';
import React from 'react';

export interface LayoutProps {
  title?: string;
}

const AppLayout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Head>
        <title>Cards{title ? ` :: ${title}` : ''}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {children}
    </Layout>
  );
};

export default AppLayout;
