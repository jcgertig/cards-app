import { DataTypes, Model, Sequelize } from 'sequelize';

import { GameCreateArgs, IGame } from '../api/controllers/game';

export type GameModel = Model<IGame, GameCreateArgs>;

export default (sequelize: Sequelize) => {
  const Games = sequelize.define<GameModel, GameCreateArgs>('Games', {
    name: DataTypes.STRING,
    type: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    state: DataTypes.JSON,
    history: DataTypes.JSON
  });

  (Games as any).associate = (models) => {
    Games.belongsTo(models.Users, {
      as: 'owner',
      foreignKey: 'userId'
    });
    Games.hasMany(models.GameUsers, {
      as: 'members',
      foreignKey: 'gameId'
    });
  };

  return Games;
};
