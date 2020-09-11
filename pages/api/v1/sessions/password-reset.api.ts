import {
  requestPasswordReset,
  resetPassword
} from '../../../../api/controllers/session';
import routeHandler from '../../../../api/utils/route-handler';
import { check } from '../../../../api/utils/validate';
import validatePassword from '../../../../api/utils/validate-password';

export default routeHandler(async ({ req, res, db, config, validate }) => {
  if (req.method === 'POST') {
    await validate({
      token: check({
        required: false,
        method: ['isAscii'],
        from: 'body',
        message: 'does not meet password requirements'
      }),
      password: check({
        required: ['token'],
        method: [(value: string) => value !== 'undefined', validatePassword],
        from: 'body',
        message: 'does not meet password requirements'
      }),
      email: check({
        required: ['!token'],
        method: [(value: string) => value !== 'undefined', 'isEmail'],
        from: 'body',
        message: 'must be a valid email address'
      })
    });
    const { token, email, password } = req.body;
    if (!token) {
      res.status(200).json(await requestPasswordReset(config, db, email));
    } else {
      res.status(200).json(await resetPassword(config, db, token, password));
    }
  }
});
