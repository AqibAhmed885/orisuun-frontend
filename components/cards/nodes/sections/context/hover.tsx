'use client';

import { createContext, Dispatch, useContext, useState } from 'react';
type TContext = { key: null; update: Dispatch<any> };
const CONTEXT = createContext<TContext>({} as TContext);

export const useCardsNodesSectionsHover = () => {
  const context = useContext(CONTEXT);
  if (Object.keys(context).length === 0) {
    throw new Error(
      'useCardsNodesSectionsHover must be used within a CardsNodesSectionsHoverProvider'
    );
  }
  return context;
};

export const CardsNodesSectionsHoverProvider = ({ children }) => {
  const [key, update] = useState(null);

  return (
    <CONTEXT.Provider value={{ key, update }}>{children}</CONTEXT.Provider>
  );
};
