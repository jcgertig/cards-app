import { noop } from 'lodash';
import React, { useCallback, useState } from 'react';

const baseItems = {
  strategies: {}
};

type NewItems = {
  [K in keyof typeof baseItems]: {
    [uid: string]: any;
    [uidN: number]: any;
  };
};

export const NewItemContext = React.createContext<{
  addItem: (
    key: keyof typeof baseItems,
    uid: string | number,
    content: any
  ) => void;
  newItems: NewItems;
}>({ addItem: noop, newItems: baseItems });

export const NewItemProvider: React.FC = ({ children }) => {
  const [items, setNewItems] = useState<NewItems>(baseItems);

  const handleAddItem = useCallback(
    (key: keyof typeof baseItems, uid: string | number, content: any) => {
      if (content === null) {
        if (items[key]) delete items[key][uid];
      } else {
        if (!items[key]) {
          items[key] = {};
        }
        if (!items[key][uid]) {
          items[key][uid] = [];
        }
        items[key][uid] = items[key][uid].filter((i) => i.id !== content.id);
        items[key][uid].unshift(content);
      }
      setNewItems({ ...items });
    },
    [setNewItems, items]
  );

  return (
    <NewItemContext.Provider
      value={{ addItem: handleAddItem, newItems: items }}
    >
      {children}
    </NewItemContext.Provider>
  );
};
