import { Sequelize } from 'sequelize';

import baseConfig from '../api/config';
import { getModels, IModels } from './db.tables';

const { db: config } = baseConfig;

const sequelize = config.useEnvVariable
  ? new Sequelize(process.env[config.useEnvVariable]!, config as any)
  : new Sequelize(
      config.database!,
      config.username!,
      config.password!,
      config as any
    );

const db = getModels(sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default { ...db, sequelize } as IModels;
