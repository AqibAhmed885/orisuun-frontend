"use client"

import { createContext, useContext, useState } from 'react';

const PlanProfileContext = createContext();

export const usePlanProfileContext = () => {
  const context = useContext(PlanProfileContext);
  if (!context) {
    throw new Error('usePlanProfileContext must be used within a PlanProfileContextProvider');
  }
  return context;
};

export const PlanProfileContextProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [plan, setPlan] = useState(null)

  return <PlanProfileContext.Provider value={{profile, setProfile, plan, setPlan}}>{children}</PlanProfileContext.Provider>;
};
