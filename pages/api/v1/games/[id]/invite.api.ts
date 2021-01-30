import validator from 'validator';

import { GamePolicy, IGame } from '../../../../../api/controllers/game';
import { SimpleUserAttributes } from '../../../../../api/controllers/user';
import { gameInvite } from '../../../../../api/utils/email';
import { UnauthorizedError } from '../../../../../api/utils/errors';
import routeHandler from '../../../../../api/utils/route-handler';
import {
  check,
  IValidateSchema,
  validateId
} from '../../../../../api/utils/validate';

export const inviteSchema: IValidateSchema = {
  emails: check({
    required: true,
    method: (value: any) =>
      Array.isArray(value) &&
      value.length > 0 &&
      value.every((i) => validator.isEmail(i)),
    message: 'should be an array of email addresses'
  })
};

export default routeHandler(
  async ({ req, db, validate, requiresAuth, config }) => {
    await validate(validateId);
    const id = parseInt(req.query.id as string, 10);
    if (req.method === 'POST') {
      await requiresAuth();
      await validate(inviteSchema);
      const game = await db.Games.findByPk(id, {
        include: [
          { model: db.Users, as: 'owner', attributes: SimpleUserAttributes }
        ]
      });
      if (!GamePolicy((req as any).user, game).update) {
        throw new UnauthorizedError(
          'User is not authorized to invite others to this game'
        );
      }
      if (game) gameInvite(config, game.toJSON() as IGame, req.body.emails);
      return { success: true };
    }
  }
);
