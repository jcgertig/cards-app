import {
  createUser,
  UserPolicy,
  userSchema
} from '../../../../api/controllers/user';
import { UnauthorizedError } from '../../../../api/utils/errors';
import routeHandler from '../../../../api/utils/route-handler';

export default routeHandler(
  async ({ req, config, validate, db, requiresAuth }) => {
    if (req.method === 'GET') {
      await requiresAuth();
      if (!UserPolicy((req as any).user).list) {
        throw new UnauthorizedError('User is not authorized to update users');
      }
      return await db.Users.findAll();
    } else if (req.method === 'POST') {
      await requiresAuth();
      await validate(userSchema);
      return await createUser(config, db, (req as any).user, req.body);
    }
  }
);
