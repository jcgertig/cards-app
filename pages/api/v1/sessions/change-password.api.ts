import { getSession, resetPassword } from '../../../../api/controllers/session';
import routeHandler from '../../../../api/utils/route-handler';
import { check } from '../../../../api/utils/validate';
import validatePassword from '../../../../api/utils/validate-password';

export default routeHandler(
  async ({ req, res, db, config, validate, requiresAuth }) => {
    if (req.method === 'POST') {
      await requiresAuth();
      await validate({
        password: check({
          required: true,
          method: [(value: string) => value !== 'undefined', validatePassword],
          from: 'body',
          message: 'does not meet password requirements'
        }),
        oldPassword: check({
          required: true,
          from: 'body'
        })
      });
      const user = (req as any).user;
      const { password, oldPassword } = req.body;

      const session = await getSession(
        db,
        config.secret,
        user.username,
        oldPassword
      );
      if (!session) {
        return res.status(401).json({
          error: 'The old password given is incorrect'
        });
      }
      await res.json(
        resetPassword(
          config,
          db,
          '',
          password,
          (await db.Users.findByPk(user.id))!
        )
      );
    }
  }
);
