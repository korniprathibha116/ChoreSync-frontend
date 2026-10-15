import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { householdService } from '../services/householdService';
import { useAuth } from './useAuth';

const HouseholdContext = createContext(null);

export function HouseholdProvider({ children }) {
  const { currentUser } = useAuth();
  const [households, setHouseholds] = useState([]);
  const [currentHousehold, setCurrentHousehold] = useState(null);
  const [householdSummary, setHouseholdSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshHouseholds = useCallback(async () => {
    if (!currentUser) {
      setHouseholds([]);
      setCurrentHousehold(null);
      setHouseholdSummary(null);
      return;
    }
    try {
      setLoading(true);
      const list = await householdService.getHouseholds();
      setHouseholds(list);
      if (list.length > 0) {
        const selected = currentHousehold
          ? list.find(h => h.id === currentHousehold.id) || list[0]
          : list[0];
        setCurrentHousehold(selected);

        // Fetch detailed summary
        try {
          const summary = await householdService.getHouseholdSummary(selected.id);
          setHouseholdSummary(summary);
        } catch {
          // fallback
        }
      } else {
        setCurrentHousehold(null);
        setHouseholdSummary(null);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [currentUser, currentHousehold]);

  useEffect(() => {
    if (currentUser) {
      refreshHouseholds();
    } else {
      setHouseholds([]);
      setCurrentHousehold(null);
      setHouseholdSummary(null);
    }
  }, [currentUser]);

  const selectHousehold = async (hh) => {
    setCurrentHousehold(hh);
    try {
      const summary = await householdService.getHouseholdSummary(hh.id);
      setHouseholdSummary(summary);
    } catch {
      // ignore
    }
  };

  return (
    <HouseholdContext.Provider
      value={{
        households,
        currentHousehold,
        householdSummary,
        loading,
        refreshHouseholds,
        setCurrentHousehold: selectHousehold,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error('useHousehold must be used within a HouseholdProvider');
  }
  return context;
}
