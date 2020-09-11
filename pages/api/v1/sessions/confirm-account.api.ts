import { confirmAccount } from '../../../../api/controllers/session';
import routeHandler from '../../../../api/utils/route-handler';

export default routeHandler(async ({ req, res, db, config }) => {
  if (req.method === 'POST') {
    const session = await confirmAccount(config, db, req.body.token);
    res.status(200).json(session);
  }
});
