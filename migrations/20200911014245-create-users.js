'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA public;`,
        { transaction: t }
      );
      await queryInterface.createTable(
        'Users',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
          },
          lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
          },
          role: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
          },
          active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
          },
          username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
          },
          preferences: {
            type: Sequelize.JSON
          },
          signInCount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
          },
          lastSignInAt: {
            type: Sequelize.DATE
          },
          profileImage: {
            type: Sequelize.STRING
          },
          confirmationToken: {
            type: Sequelize.STRING
          },
          confirmationSentAt: {
            type: Sequelize.DATE
          },
          confirmedAt: {
            type: Sequelize.DATE
          },
          resetPasswordToken: {
            type: Sequelize.STRING
          },
          resetPasswordSentAt: {
            type: Sequelize.DATE
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
        `CREATE INDEX users_search ON "Users" USING gin(_search);`,
        { transaction: t }
      );
      await queryInterface.sequelize.query(
        `CREATE TRIGGER Users_vector_update
BEFORE INSERT OR UPDATE ON "Users"
FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(_search, 'pg_catalog.english', ${[
          '"username"',
          '"firstName"',
          '"lastName"'
        ].join(', ')});`,
        { transaction: t }
      );
    }),
  down: async (queryInterface) => await queryInterface.dropTable('Users')
};
