import routeHandler from '../../../../api/utils/route-handler';
import { validateId } from '../../../../api/utils/validate';

export default routeHandler(async ({ req, res, db, validate }) => {
  if (req.method === 'GET') {
    await validate(validateId);
    res.json(
      await db.Comments.findByPk(req.query.id as string, {
        include: { model: db.Users, as: 'user' }
      })
    );
  }
});
