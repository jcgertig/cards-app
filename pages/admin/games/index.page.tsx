import React from 'react';

import ListingDashboard from '../../../components/admin-layout/listing-dashboard';
import { GameTypesMapping } from '../../../lib/enum-mappings';

const GamesDashboard = () => {
  return (
    <ListingDashboard
      modelPlural="games"
      modelSingular="game"
      columnDefs={[
        {
          field: 'type',
          width: 80,
          valueFormatter: ({ value }) =>
            typeof value === 'number' ? GameTypesMapping[value] : ''
        },
        { field: 'name' }
      ]}
    />
  );
};

export default GamesDashboard;
