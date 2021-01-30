import { DataTypes, Model, Sequelize } from 'sequelize';

import { GameUserCreateArgs, IGameUser } from '../api/controllers/game';

export type GameUserModel = Model<IGameUser, GameUserCreateArgs>;

export default (sequelize: Sequelize) => {
  const GameUsers = sequelize.define<GameUserModel, GameUserCreateArgs>(
    'GameUsers',
    {
      userId: DataTypes.INTEGER,
      gameId: DataTypes.INTEGER,
      status: DataTypes.INTEGER
    }
  );

  (GameUsers as any).associate = (models) => {
    GameUsers.belongsTo(models.Games, {
      as: 'game',
      foreignKey: 'gameId'
    });
    GameUsers.belongsTo(models.Users, {
      as: 'user',
      foreignKey: 'userId'
    });
  };

  return GameUsers;
};
