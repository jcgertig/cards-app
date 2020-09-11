import routeHandler from '../../../../api/utils/route-handler';
import { check } from '../../../../api/utils/validate';

export default routeHandler(async ({ req, validate, db }) => {
  if (req.method === 'GET') {
    await validate({
      q: check({
        required: true,
        method: [
          (value: string) => value !== 'undefined',
          (value: string) => value.length > 0
        ],
        from: 'query',
        message: 'must be a string'
      })
    });
    const q = req.query.q;

    return await db.sequelize.query(
      `SELECT *, similarity(username, :query) as sml
  FROM ${db.Users.tableName}
  WHERE username ILIKE '${q}%' OR username % :query
  ORDER BY sml DESC
  LIMIT 10
`,
      {
        model: db.Users,
        mapToModel: true,
        replacements: { query: q }
      }
    );
  }
});
