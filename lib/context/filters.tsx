import { noop } from 'lodash';
import React, { useCallback, useState } from 'react';

const baseFilters = {
  strategies: {}
};

type Filters = {
  [K in keyof typeof baseFilters]: {
    [uid: string]: any;
    [uidN: number]: any;
  };
};

export const FilterContext = React.createContext<{
  setFilter: (
    key: keyof typeof baseFilters,
    uid: string | number,
    content: any
  ) => void;
  filters: Filters;
}>({ setFilter: noop, filters: baseFilters });

const STORAGE_KEY = 'par-app-filters';

export const getFilterFromStorage = () => {
  const value = process.browser ? localStorage.getItem(STORAGE_KEY) : {};
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as Filters;
    } catch (err) {
      console.warn('failed to parse user from storage', value);
    }
  }
  return baseFilters;
};

export const FilterProvider: React.FC = ({ children }) => {
  const [filters, setFilters] = useState<Filters>(getFilterFromStorage());

  const handleSetFilter = useCallback(
    (key: keyof typeof baseFilters, uid: string | number, content: any) => {
      if (content === null) {
        if (filters[key]) delete filters[key][uid];
      } else {
        if (!filters[key]) {
          filters[key] = {};
        }
        filters[key][uid] = content;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
      setFilters({ ...filters });
    },
    [setFilters, filters]
  );

  return (
    <FilterContext.Provider value={{ setFilter: handleSetFilter, filters }}>
      {children}
    </FilterContext.Provider>
  );
};
