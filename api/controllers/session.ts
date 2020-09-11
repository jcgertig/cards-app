import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op, Sequelize } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { UserRoles, UserRolesMapping } from '../../lib/enum-mappings';
import { IModels } from '../../models/db.tables';
import { UserModel } from '../../models/users';
import { passwordChanged, passwordReset } from '../utils/email';
import { IConfig } from '../utils/general-types';
import { createUser, getUser, hashPassword, IUser } from './user';

export interface ISession {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  authToken?: string;
  role: UserRoles;
  username: string;
  confirmed: boolean;
  profileImage: string;
  preferences: any;
}

export const getSessionMapping = (i: IUser, secret?: string): ISession => {
  return {
    id: i.id!,
    firstName: i.firstName!,
    lastName: i.lastName!,
    fullName: `${i.firstName} ${i.lastName}`.trim(),
    email: i.email,
    authToken: secret ? jwt.sign({ user_id: i.id }, secret) : undefined, // eslint-disable-line @typescript-eslint/camelcase
    role: i.role!,
    username: i.username!,
    confirmed: !!i.confirmedAt,
    profileImage: i.profileImage!,
    preferences: i.preferences
  };
};

export const getSession = async (
  db: IModels,
  secret: string,
  username: string,
  password: string
) => {
  const maybeUsers = await db.Users.findAll({
    where: {
      [Op.or]: [
        {
          username: username
        },
        {
          email: username
        }
      ]
    }
  });

  let foundUser: UserModel | undefined;
  for (const maybeUser of maybeUsers) {
    const match = await bcrypt.compare(
      password,
      maybeUser.getDataValue('password')!
    );
    if (match) {
      foundUser = maybeUser;
      break;
    }
  }
  if (!foundUser) return undefined;
  return getSessionMapping(foundUser.get(), secret);
};

export const getSessionFromId = async (db: IModels, userId: number) => {
  const user = await db.Users.findByPk(userId);
  if (!user) return undefined;
  return getSessionMapping(user.get());
};

export const updateSessionStats = async (db: IModels, userId: number) => {
  await db.Users.update(
    {
      signInCount: Sequelize.literal('"signInCount"+1') as any,
      lastSignInAt: Sequelize.fn('NOW') as any
    },
    { where: { id: userId } }
  );
};

export const signUp = async (
  config: IConfig,
  db: IModels,
  email: string,
  username: string,
  password: string
) => {
  return await createUser(
    config,
    db,
    {
      email,
      username,
      password,
      role: UserRolesMapping.Basic
    },
    undefined,
    true
  );
};

export const confirmAccount = async (
  config: IConfig,
  db: IModels,
  token: string
) => {
  const user = await db.Users.findOne({ where: { confirmationToken: token } });
  if (user) {
    user.set('confirmedAt', Sequelize.fn('NOW') as any);
    await user.save();
    return getSessionMapping(user.get(), config.secret);
  }
  return undefined;
};

export const requestPasswordReset = async (
  config: IConfig,
  db: IModels,
  email: string
) => {
  const user = await getUser(db, email, 'email');
  if (user) {
    user.set('resetPasswordToken', uuid());
    user.set('resetPasswordSentAt', Sequelize.fn('NOW') as any);
    await user.save();

    await passwordReset(config, user.get());
  }
  return { success: true };
};

export const resetPassword = async (
  config: IConfig,
  db: IModels,
  token: string,
  password: string,
  userOverride?: UserModel
) => {
  const user = userOverride || (await getUser(db, token, 'resetPasswordToken'));
  if (user) {
    const encryptedPassword = await hashPassword(password);
    user.set('password', encryptedPassword);
    user.set('resetPasswordToken', 'NULL');
    await user.save();
    const session = getSessionMapping(user.get(), config.secret);
    await passwordChanged(config, user.get());
    return session;
  }
  return undefined;
};
