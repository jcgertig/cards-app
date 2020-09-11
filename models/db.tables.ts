import { Model, ModelCtor, Sequelize } from 'sequelize';

import { CommentModel } from './comments';
import { GameModel } from './games';
import { UserModel } from './users';

export const jsonColumn = (column: string) => {
  return {
    get: function() {
      const value = (this as any).getDataValue(column);
      if (value) {
        try {
          return JSON.parse(value);
        } catch (error) {
          return value;
        }
      }
      return '';
    },
    set: function() {
      const value = (this as any).getDataValue(column);
      if (value) return JSON.stringify(value);
      return '';
    }
  };
};

export interface ITables {
  Comments: ModelCtor<CommentModel>;
  Games: ModelCtor<GameModel>;
  Users: ModelCtor<UserModel>;
}

export interface IModels extends ITables {
  sequelize: Sequelize;
}

export interface DBInstanceBase {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export function getModels(seq: Sequelize): ITables {
  function load<M extends Model>(filePath: string) {
    const method = require(`./${filePath}`).default;
    return method(seq) as ModelCtor<M>;
  }

  return {
    Comments: load<CommentModel>('comments'),
    Games: load<GameModel>('games'),
    Users: load<UserModel>('users')
  };
}
