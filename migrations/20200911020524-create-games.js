'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA public;`,
        {
          transaction: t
        }
      );
      await queryInterface.createTable(
        'Games',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          userId: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          type: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
          },
          state: {
            type: Sequelize.JSON
          },
          history: {
            type: Sequelize.JSON
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('NOW')
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('NOW')
          },
          _search: {
            type: 'TSVECTOR'
          }
        },
        { transaction: t }
      );
      await queryInterface.sequelize.query(
        `CREATE INDEX games_search ON "Games" USING gin(_search);`,
        { transaction: t }
      );
      await queryInterface.sequelize.query(
        `CREATE TRIGGER games_vector_update
BEFORE INSERT OR UPDATE ON "Games"
FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(_search, 'pg_catalog.english', name);`,
        { transaction: t }
      );
    }),
  down: async (queryInterface) => await queryInterface.dropTable('Games')
};
