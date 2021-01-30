import {
  GamePolicy,
  gameUpdateSchema,
  updateGame
} from '../../../../../api/controllers/game';
import { UnauthorizedError } from '../../../../../api/utils/errors';
import routeHandler from '../../../../../api/utils/route-handler';
import { validateId } from '../../../../../api/utils/validate';

export default routeHandler(async ({ req, db, validate, requiresAuth }) => {
  await validate(validateId);
  const id = parseInt(req.query.id as string, 10);
  if (req.method === 'PUT') {
    await requiresAuth();
    await validate(gameUpdateSchema);
    const game = await db.Games.findByPk(id);
    if (!GamePolicy((req as any).user, game).update) {
      throw new UnauthorizedError('User is not authorized to start this game');
    }
    return await updateGame(db, (req as any).user, id, req.body);
  }
});
