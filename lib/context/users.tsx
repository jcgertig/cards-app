import { noop } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';

import { ISession } from '../../api/controllers/session';

export const UserContext = React.createContext<{
  setUser: (user: ISession | null, remember?: boolean) => void;
  user: ISession | null;
}>({ setUser: noop, user: null });

const STORAGE_KEY = 'cards-app-user';

export const getUserFromStorage = () => {
  const value = process.browser
    ? sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY)
    : null;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as ISession;
    } catch (err) {
      console.warn('failed to parse user from storage', value);
    }
  }
  return null;
};

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<ISession | null>(getUserFromStorage());
  const [remember, setRemember] = useState<boolean>(true);
  const router = useRouter();

  const handleSetUser = useCallback(
    (userToSet: ISession | null, rememberToSet?: boolean) => {
      if (userToSet === null) {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
        requestAnimationFrame(() => router.push('/'));
      } else {
        const setRem = typeof rememberToSet === 'boolean';
        const rem = setRem ? rememberToSet : remember;
        (rem ? localStorage : sessionStorage).setItem(
          STORAGE_KEY,
          JSON.stringify(userToSet)
        );
        if (setRem) setRemember(rememberToSet!);
      }
      setUser(userToSet);
    },
    [setUser, remember]
  );

  return (
    <UserContext.Provider value={{ setUser: handleSetUser, user }}>
      {children}
    </UserContext.Provider>
  );
};
