import axios from 'axios';
import React from 'react';

import SimpleSearchSelect, { SimpleSearchSelectProps } from './simple-search';

async function loadGames(inputValue: string) {
  const res = await axios.get(
    `/api/v1/games/search?q=${encodeURIComponent(inputValue)}`
  );
  return res.data.map((entry) => ({
    label: entry.name,
    value: entry.id,
    ...entry
  }));
}

const GamesSearchSelect: React.FC<SimpleSearchSelectProps> = (props) => {
  return <SimpleSearchSelect {...props} loadOptions={loadGames} />;
};

export default React.memo(GamesSearchSelect);
