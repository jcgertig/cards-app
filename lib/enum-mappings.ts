import { optionsObject } from './utils/options-object';

export type UserRoles = 0 | 1 | number;

export const UserRolesMapping = optionsObject({
  Basic: 0,
  Admin: 1
});

export type GameTypes = 0 | 1 | 2 | number;

export const GameTypesMapping = optionsObject({
  Deuces: 0,
  Hearts: 1,
  Bids: 2
});
