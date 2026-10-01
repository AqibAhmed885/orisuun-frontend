'use client';

import { createContext, Dispatch, useContext, useState } from 'react';
type TContext = { key: null; update: Dispatch<any> };
const CONTEXT = createContext<TContext>({} as TContext);

export const useCardsNodesSectionsOpen = () => {
  const context = useContext(CONTEXT);
  if (Object.keys(context).length === 0) {
    throw new Error(
      'useCardsNodesSectionsOpen must be used within a CardsNodesSectionsOpenProvider'
    );
  }
  return context;
};

export const CardsNodesSectionsOpenProvider = ({ children }) => {
  const [key, update] = useState(null);

  return (
    <CONTEXT.Provider value={{ key, update }}>{children}</CONTEXT.Provider>
  );
};
