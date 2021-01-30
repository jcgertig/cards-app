import { Button } from 'antd';
import axios from 'axios';
import { omit } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';

import { IGame } from '../../api/controllers/game';
import { getGameConfig } from '../../game-config';
import { UserContext } from '../../lib/context/users';
import Game from '../../lib/logic/game';
import Loader from '../loader';

export type GameViewProps = {
  definition: IGame;
};

const GameView: React.FC<GameViewProps> = ({ definition }) => {
  const [game, setGame] = useState<Game | null>(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const config = getGameConfig(definition.type);
    if (config) {
      let game: Game | null = null;
      if (definition.state === null) {
        game = new Game({
          config,
          playerIds: [
            definition.owner?.id || undefined,
            ...(definition.members?.map((i) => i.userId) || [])
          ].filter((i) => typeof i === 'number') as Array<number>
        });
      } else {
        game = new Game({
          options: {
            ...definition.state,
            config
          }
        });
      }
      if (game) {
        game.addPlayer(2);
        game.addPlayer(3);
        game.addPlayer(4);
        game.start();
      }
      setGame(game);
    } else {
      // TODO handle bad config error
    }
  }, []);

  const handleStartGame = async () => {
    await axios(`/api/v1/games/${definition.id}/start`, {
      method: 'POST',
      data: { state: omit(game?.asJSON(), ['config']) }
    });
  };

  if (!game) {
    <div>
      <Loader />
    </div>;
  }

  if (!game?.isActive) {
    return (
      <div>
        {user && user.id === definition.userId && game?.canStart && (
          <div>
            <Button onClick={handleStartGame}>Start Game</Button>
          </div>
        )}
        {!game?.canStart && game?.canAddPlayer && (
          <div>Waiting On Players to Join</div>
        )}
      </div>
    );
  }
  return <div>Active Game</div>;
};

export default GameView;
