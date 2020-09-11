import { DataTypes, Model, Sequelize } from 'sequelize';

import { IUser, UserCreateArgs } from '../api/controllers/user';

export type UserModel = Model<IUser, UserCreateArgs>;

export default (sequelize: Sequelize) => {
  const Users = sequelize.define<UserModel, UserCreateArgs>('Users', {
    firstName: { type: DataTypes.STRING, defaultValue: '' },
    lastName: { type: DataTypes.STRING, defaultValue: '' },
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    username: DataTypes.STRING,
    preferences: DataTypes.JSON,
    signInCount: DataTypes.INTEGER,
    lastSignInAt: DataTypes.DATE,
    profileImage: DataTypes.STRING,
    confirmationToken: DataTypes.STRING,
    confirmationSentAt: DataTypes.DATE,
    confirmedAt: DataTypes.DATE,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordSentAt: DataTypes.DATE
  });
  return Users;
};
