import { UserRolesMapping } from '../../lib/enum-mappings';
import { setCheck } from '../../lib/utils/checks';
import { DBInstanceBase, IModels } from '../../models/db.tables';
import { GeneralError, UnauthorizedError } from '../utils/errors';
import { pundit } from '../utils/pundit';
import { check, IValidateSchema } from '../utils/validate';
import { ISession } from './session';
import { IUser } from './user';

export interface IGame extends DBInstanceBase {
  name: string;
  type: number;
  state: any;
  history: any;
  userId?: number;
  user?: IUser;
}

export interface GameCreateArgs {
  name: string;
  type: number;
  state?: any;
  history?: any;
  userId?: number;
}

export type UpdateGameArgs = Omit<GameCreateArgs, 'type'>;

export const GamePolicy = pundit({
  create: () => true,
  update: (user, game) =>
    game.userId === user.id || [UserRolesMapping.Admin].includes(user.role),
  delete: (user, game) =>
    game.userId === user.id || [UserRolesMapping.Admin].includes(user.role)
});

export const gameSchema: IValidateSchema = {
  name: check({ required: true, method: 'isAscii' }),
  type: check({ required: true, method: setCheck([0]) })
};

export async function createGame(
  db: IModels,
  user: ISession,
  { name, type }: GameCreateArgs
) {
  if (!GamePolicy(user).create) {
    throw new UnauthorizedError('User is not authorized to create games');
  }
  const game = await db.Games.build({
    name,
    type,
    userId: user.id
  });
  await game.save();
  if (game) {
    return game;
  }
  throw new GeneralError('Failed to create game');
}

export async function updateGame(
  db: IModels,
  user: ISession,
  id: number,
  { name, state, history }: UpdateGameArgs
) {
  const game = await db.Games.findByPk(id);
  if (game) {
    if (!GamePolicy(user, game).update) {
      throw new UnauthorizedError('User is not authorized to update games');
    }
    if (name) game.setDataValue('name', name);
    if (state) game.setDataValue('state', state);
    if (history) game.setDataValue('history', history);
    await game.save();
    return game;
  }
  throw new GeneralError('Failed to update game');
}
