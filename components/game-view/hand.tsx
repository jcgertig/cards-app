import React from 'react';

import { IDeckConfig } from '../../lib/game-config';
import { Card } from '../../lib/logic/deck';

type CardProps = {
  card: Card;
};

const CardView: React.FC<CardProps> = ({ card }) => {
  return <div>{card.name}</div>;
};

type HandProps = {
  hand: Array<string>;
  deckConfig?: IDeckConfig;
};

const Hand: React.FC<HandProps> = ({ hand, deckConfig }) => {
  const cards = React.useMemo(
    () => hand.map((id) => new Card(id, deckConfig)),
    [hand]
  );

  return (
    <div>
      {cards.map((card) => (
        <CardView card={card} key={card.name} />
      ))}
    </div>
  );
};

export default Hand;
