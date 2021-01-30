import {
  GamePolicy,
  IGame,
  updateGame
} from '../../../../../api/controllers/game';
import { UnauthorizedError } from '../../../../../api/utils/errors';
import routeHandler from '../../../../../api/utils/route-handler';
import {
  check,
  IValidateSchema,
  validateId
} from '../../../../../api/utils/validate';

export const actionSchema: IValidateSchema = {
  type: check({
    required: true,
    method: 'isAscii'
  }),
  args: check({
    required: false
  })
};

export default routeHandler(async ({ req, db, validate, requiresAuth }) => {
  await validate(validateId);
  const id = parseInt(req.query.id as string, 10);
  if (req.method === 'POST') {
    await requiresAuth();
    await validate(actionSchema);
    const game = await db.Games.findByPk(id, {
      include: [
        {
          model: db.GameUsers,
          as: 'members'
        }
      ]
    });
    const user = (req as any).user;
    if (!GamePolicy(user, game).action) {
      throw new UnauthorizedError(
        'User is not authorized to perform actions in this game'
      );
    }
    const history = (game?.toJSON() as IGame).history || [];
    const { type, args } = req.body;
    return await updateGame(db, user, id, {
      history: [
        { type, args, userId: user.id, date: new Date().toISOString() },
        ...history
      ]
    });
  }
});
