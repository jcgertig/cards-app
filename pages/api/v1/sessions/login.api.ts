import {
  getSession,
  updateSessionStats
} from '../../../../api/controllers/session';
import routeHandler from '../../../../api/utils/route-handler';

export default routeHandler(async ({ req, res, db, config }) => {
  if (req.method === 'POST') {
    const session = await getSession(
      db,
      config.secret,
      req.body.username,
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
