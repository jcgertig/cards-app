import { DataTypes, Model, Sequelize } from 'sequelize';

import { CommentCreateArgs, IComment } from '../api/controllers/comment';

export type CommentModel = Model<IComment, CommentCreateArgs>;

export default (sequelize: Sequelize) => {
  const Comments = sequelize.define<CommentModel, CommentCreateArgs>(
    'Comments',
    {
      userId: DataTypes.INTEGER,
      gameId: DataTypes.INTEGER,
      content: DataTypes.JSON
    }
  );

  (Comments as any).associate = (models) => {
    Comments.belongsTo(models.Users, {
      as: 'user',
      foreignKey: 'userId'
    });

    Comments.belongsTo(models.Games, {
      as: 'game',
      foreignKey: 'gameId'
    });
  };

  return Comments;
};
