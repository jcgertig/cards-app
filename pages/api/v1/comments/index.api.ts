import routeHandler from '../../../../api/utils/route-handler';

export default routeHandler(async ({ req, res, db }) => {
  if (req.method === 'GET') {
    res.json(await db.Comments.findAll());
  }
});
