import { useRouter } from 'next/router';
import React from 'react';

import CreateOrEditGames from './create-or-edit';

const GameDashboard: React.FC = () => {
  const router = useRouter();
  return <CreateOrEditGames id={parseInt(router.query.id as string, 10)} />;
};

export default GameDashboard;
