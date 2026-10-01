"use client"

import { createContext, useContext, useState } from 'react';

const JoinContext = createContext();

export const useJoinContext = () => {
  const context = useContext(JoinContext);
  if (!context) {
    throw new Error('useJoinContext must be used within a JoinContextProvider');
  }
  return context;
};

export const JoinContextProvider = ({ children }) => {
  const [openJoin, setOpenJoin] = useState(false);

  return <JoinContext.Provider value={{openJoin, setOpenJoin}}>{children}</JoinContext.Provider>;
};
