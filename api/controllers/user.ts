import BadWordsFilter from 'bad-words';
import bcrypt from 'bcrypt';
import { isUndefined, omit } from 'lodash';
import rug from 'random-username-generator';
import { Sequelize } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { UserRoles, UserRolesMapping } from '../../lib/enum-mappings';
import { objectCheck } from '../../lib/utils/checks';
import { DBInstanceBase, IModels } from '../../models/db.tables';
import { BLOCKED_USERNAMES } from '../utils/blocked-words';
import { confirmAccount } from '../utils/email';
import {
  DBFailureError,
  GeneralError,
  UnauthorizedError
} from '../utils/errors';
import { IConfig } from '../utils/general-types';
import { pundit } from '../utils/pundit';
import { check, IValidateSchema } from '../utils/validate';
import validatePassword from '../utils/validate-password';
import { ISession } from './session';

export interface IUser extends DBInstanceBase {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role: UserRoles;
  active: boolean;
  username: string;
  preferences?: any;
  signInCount: number;
  lastSignInAt: Date;
  profileImage?: string;
  confirmationToken?: string;
  confirmationSentAt?: Date;
  confirmedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordSentAt?: Date;
}

export interface UserCreateArgs {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role: UserRoles;
  username: string;
  preferences?: any;
  active?: boolean;
  signInCount?: number;
  lastSignInAt?: Date;
  profileImage?: string;
  confirmationToken?: string;
  confirmationSentAt?: Date;
  confirmedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordSentAt?: Date;
}

export type UserUpdateArgs = Omit<
  UserCreateArgs,
  'password' | 'email' | 'role'
> & { email?: string; role?: UserRoles };

export const UserPolicy = pundit({
  list: (user) => [UserRolesMapping.Admin].includes(user.role),
  create: (user) => [UserRolesMapping.Admin].includes(user.role),
  update: (user, id) =>
    id === user.id || [UserRolesMapping.Admin].includes(user.role),
  updateRole: (user) => [UserRolesMapping.Admin].includes(user.role)
});

export async function getUser(
  db: IModels,
  slug: string,
  key:
    | 'id'
    | 'username'
    | 'email'
    | 'confirmationToken'
    | 'resetPasswordToken' = 'id'
) {
  return await db.Users.findOne({ where: { [key]: slug } });
}

const profaneFilter = new BadWordsFilter();

const emailCheck = {
  required: true,
  method: [(value: string) => value !== 'undefined', 'isEmail'],
  from: 'body',
  message: 'must be a valid email address'
};

export const userSchema: IValidateSchema = {
  email: check(emailCheck as any),
  password: check({
    required: true,
    method: [(value: string) => value !== 'undefined', validatePassword],
    from: 'body',
    message: 'does not meet password requirements'
  }),
  role: check({
    required: false,
    method: [(value: number) => !!UserRolesMapping[value]],
    message: 'has to be a valid user role'
  }),
  firstName: check({ required: false, method: 'isAscii' }),
  lastName: check({ required: false, method: 'isAscii' }),
  username: check({
    required: false,
    method: [
      'isAscii',
      (value: string) => {
        return (
          value.length > 2 &&
          !profaneFilter.isProfane(value.toLocaleLowerCase()) &&
          !BLOCKED_USERNAMES.includes(value.toLocaleLowerCase())
        );
      }
    ],
    message: 'needs to be longer then 2 characters and not be a reserved word'
  }),
  confirmationToken: check({ required: false, method: 'isAscii' }),
  preferences: check({ required: false, method: objectCheck })
};

export const userUpdateSchema = {
  ...omit(userSchema, ['password', 'email']),
  email: check({
    ...emailCheck,
    required: false
  } as any)
};

export async function hashPassword(password: string) {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

export async function createUser(
  config: IConfig,
  db: IModels,
  args: UserCreateArgs,
  user?: ISession,
  signUp = false
) {
  if (!signUp && !UserPolicy(user!).create) {
    throw new UnauthorizedError('User is not authorized to create users');
  }
  rug.setSeperator(' ');
  const username = args.username || rug.generate();
  const confirmationToken = uuid();
  const password = await hashPassword(args.password);

  const newUser = await db.Users.build({
    email: args.email,
    password,
    role: args.role,
    confirmationToken,
    confirmationSentAt: Sequelize.fn('NOW') as any,
    username,
    firstName: args.firstName,
    lastName: args.lastName,
    preferences: args.preferences
  });
  await newUser.save();
  if (newUser.getDataValue('id')) {
    await confirmAccount(config, newUser.toJSON() as IUser);
  } else {
    throw new DBFailureError('User creation failed');
  }
  return newUser;
}

export async function updateUser(
  config: IConfig,
  db: IModels,
  currentUser: ISession,
  id: number,
  { firstName, lastName, username, preferences, email, role }: UserUpdateArgs
) {
  if (!UserPolicy(currentUser, id).update) {
    throw new UnauthorizedError('User is not authorized to update users');
  }
  if (role && !UserPolicy(currentUser, id).updateRole) {
    throw new UnauthorizedError('User is not authorized to roles for users');
  }
  const user = await db.Users.findByPk(id);
  if (user) {
    let confirmationToken;
    if (!isUndefined(firstName)) user.setDataValue('firstName', firstName);
    if (!isUndefined(lastName)) user.setDataValue('lastName', lastName);
    if (!isUndefined(username)) user.setDataValue('username', username);
    if (!isUndefined(preferences))
      user.setDataValue('preferences', preferences);
    if (email && (user as any).email !== email) {
      confirmationToken = uuid();
      user.setDataValue('email', email);
      user.setDataValue('confirmationToken', confirmationToken);
      user.setDataValue('confirmationSentAt', new Date());
    }
    if (role) user.setDataValue('role', role);
    await user.save();
    if (!user) {
      throw new GeneralError('Failed to update user');
    }
    if (confirmationToken) {
      await confirmAccount(config, user.toJSON() as IUser);
    }
    return user;
  }
  throw new GeneralError('No user with the give id exists');
}
