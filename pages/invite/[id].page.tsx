import { Layout, Result } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import AppLayout from '../../components/app-layout';
import Header from '../../components/layout/header';
import Loader from '../../components/loader';
import useRest from '../../lib/hooks/use-rest';

const GameInvitePage: React.FC<unknown> = () => {
  const route = useRouter();
  const { loading, error, res } = useRest<{
    gameName: string;
    success: boolean;
    error?: string;
  }>(route.query.id ? `/api/v1/games/${route.query.id}/join` : null, 'POST');

  const title = `Join ${res?.gameName || 'Game'}`;

  useEffect(() => {
    if (res && res.success) {
      if (process.browser) {
        window.location.href = `${window.location.origin}/g/${route.query.id}`;
      }
    }
  }, [res]);

  return (
    <AppLayout title={title}>
      <Header title={title} />
      <Layout>
        {loading && <Loader />}
        {error && (
          <Result status={500} title={'Error'} subTitle={error.message} />
        )}
        {res?.error && (
          <Result
            status={500}
            title="Unable to join the game"
            subTitle={res?.error}
          />
        )}
      </Layout>
    </AppLayout>
  );
};

export default GameInvitePage;
