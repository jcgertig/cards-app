import { gameSchema, updateGame } from '../../../../api/controllers/game';
import routeHandler from '../../../../api/utils/route-handler';
import { validateId } from '../../../../api/utils/validate';

export default routeHandler(async ({ req, db, validate, requiresAuth }) => {
  await validate(validateId);
  const id = parseInt(req.query.id as string, 10);
  if (req.method === 'GET') {
    return await db.Games.findByPk(id);
  } else if (req.method === 'PUT') {
    await requiresAuth();
    await validate(gameSchema);
    return await updateGame(db, (req as any).user, id, req.body);
  }
});
