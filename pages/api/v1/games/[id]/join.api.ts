import { IGame } from '../../../../../api/controllers/game';
import { GeneralError } from '../../../../../api/utils/errors';
import routeHandler from '../../../../../api/utils/route-handler';
import { validateId } from '../../../../../api/utils/validate';
import { getGameConfig } from '../../../../../game-config';
import Game from '../../../../../lib/logic/game';

export default routeHandler(async ({ req, db, validate, requiresAuth }) => {
  await validate(validateId);
  const id = parseInt(req.query.id as string, 10);
  if (req.method === 'POST') {
    await requiresAuth();
    const game = await db.Games.findByPk(id, {
      include: [
        {
          model: db.GameUsers,
          as: 'members'
        }
      ]
    });

    const userId = (req as any).user.id;
    const definition = game?.toJSON() as IGame;
    const config = getGameConfig(definition.type);

    if (!config) {
      throw new GeneralError('No game config associated to this game');
    }

    if (definition.userId !== userId) {
      let game: Game | null = null;
      if (!definition.state) {
        game = new Game({
          config,
          playerIds: [
            userId,
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
      if (!game.canAddPlayer) {
        return {
          gameName: definition.name,
          success: false,
          error: 'Game is already full'
        };
      }
      await db.GameUsers.create({
        userId,
        gameId: id
      });
    }
    return {
      gameName: definition.name,
      success: true
    };
  }
});
