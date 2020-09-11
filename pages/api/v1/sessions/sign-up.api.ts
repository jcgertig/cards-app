import { pick } from 'lodash';

import {
  getSession,
  signUp,
  updateSessionStats
} from '../../../../api/controllers/session';
import { userSchema } from '../../../../api/controllers/user';
import routeHandler from '../../../../api/utils/route-handler';

export default routeHandler(async ({ req, res, db, config, validate }) => {
  if (req.method === 'POST') {
    await validate(pick(userSchema, ['email', 'username', 'password']));
    await signUp(
      config,
      db,
      req.body.email,
      req.body.username,
      req.body.password
    );
    const session = await getSession(
      db,
      config.secret,
      req.body.email,
      req.body.password
    );
    if (!session) {
      return res.status(401).json({
        error: 'The given credentials do not match any record in our system'
      });
    }
    await updateSessionStats(db, session.id);
    res.status(200).json(session);
  }
});
