import routeHandler from '../../../../api/utils/route-handler';

export default routeHandler(async ({ req, db }) => {
  if (req.method === 'GET') {
    const { q } = req.query;

    if (!q) {
      return await db.Games.findAll({ limit: 5, order: ['id'] });
    }
    return await db.sequelize.query(
      `SELECT *, similarity(name, :query) as sml
  FROM ${db.Games.tableName}
  WHERE name ILIKE '${q}%' OR name % :query 
  ORDER BY sml DESC
  LIMIT 10
`,
      {
        model: db.Games,
        mapToModel: true,
        replacements: { query: q }
      }
    );
  }
});
