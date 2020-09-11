import { Layout } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { IGame } from '../api/controllers/game';
import AppLayout from '../components/app-layout';
import Header from '../components/layout/header';

const GamesPage: React.FC = () => {
  const [gameList, setGameList] = useState<Array<IGame>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`/api/v1/games`);
      setGameList(response.data);
    };

    fetchData();
  }, []);

  return (
    <AppLayout title="Games">
      <Header title="Games" />
      <Layout>
        <pre>{JSON.stringify(gameList, null, 2)}</pre>
      </Layout>
    </AppLayout>
  );
};

export default GamesPage;
