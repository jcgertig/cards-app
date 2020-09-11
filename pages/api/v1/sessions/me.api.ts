import routeHandler from '../../../../api/utils/route-handler';

export default routeHandler(async ({ req, res, requiresAuth }) => {
  if (req.method === 'GET') {
    await requiresAuth();
    res.status(200).json((req as any).user);
  }
});
