import {
  updateUser,
  userUpdateSchema
} from '../../../../../api/controllers/user';
import routeHandler from '../../../../../api/utils/route-handler';
import { validateId } from '../../../../../api/utils/validate';

export default routeHandler(
  async ({ req, res, validate, db, requiresAuth, config }) => {
    if (req.method === 'GET') {
      await validate(validateId);
      res.json(
        await db.Users.findOne({
          where: {
            id: req.query.id
          },
          attributes: {
            exclude: ['password', 'resetPasswordToken', 'resetPasswordSentAt']
          }
        })
      );
    } else if (req.method === 'PUT') {
      await requiresAuth();
      await validate(validateId);
      await validate(userUpdateSchema);
      const id = parseInt(req.query.id as string, 10);
      res.json(await updateUser(config, db, (req as any).user, id, req.body));
    }
  }
);
