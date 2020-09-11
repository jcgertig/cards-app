import { createGame, gameSchema } from '../../../../api/controllers/game';
import routeHandler from '../../../../api/utils/route-handler';

export default routeHandler(async ({ req, db, requiresAuth, validate }) => {
  if (req.method === 'GET') {
    return await db.Games.findAll({
      include: { model: db.Users, as: 'owner' }
    });
  } else if (req.method === 'POST') {
    await requiresAuth();
    await validate(gameSchema);
    return await createGame(db, (req as any).user, req.body);
  }
});
