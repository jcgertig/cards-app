import { Layout, Result } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';

import { IGame } from '../../api/controllers/game';
import AppLayout from '../../components/app-layout';
import GameView from '../../components/game-view';
import Header from '../../components/layout/header';
import Loader from '../../components/loader';
import useRest from '../../lib/hooks/use-rest';

const GamePage: React.FC<unknown> = () => {
  const route = useRouter();
  const { loading, error, res: game } = useRest<IGame>(
    route.query.id ? `/api/v1/games/${route.query.id}` : null
  );

  const title = game?.name || 'Game';

  return (
    <AppLayout title={title}>
      <Header title={title} />
      <Layout>
        {loading && <Loader />}
        {error && (
          <Result status={500} title={'Error'} subTitle={error.message} />
        )}
        {game && (
          <div>
            {/* <pre>{JSON.stringify(game, null, 2)}</pre> */}
            <GameView definition={game} />
          </div>
        )}
      </Layout>
    </AppLayout>
  );
};

export default GamePage;
