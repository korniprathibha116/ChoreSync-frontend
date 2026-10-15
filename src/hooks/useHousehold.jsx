import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import { householdService } from '../services/householdService';
import { getApiErrorMessage } from '../services/api';

const HouseholdContext = createContext(null);

export function HouseholdProvider({ children }) {
  const { currentUser, loading: authLoading, error: authError, setCurrentUser } = useAuth();
  const [households, setHouseholds] = useState([]);
  const [currentHousehold, setCurrentHouseholdState] = useState(null);
  const [householdSummary, setHouseholdSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState('');
  const selectedHouseholdId = useRef(null);
  const requestSequence = useRef(0);

  const setCurrentHousehold = useCallback(async (household) => {
    const sequence = ++requestSequence.current;
    selectedHouseholdId.current = household?.id ?? null;
    setCurrentHouseholdState(household || null);
    setHouseholdSummary(null);
    setError('');

    if (!household) {
      setSummaryLoading(false);
      return null;
    }

    setSummaryLoading(true);
    try {
      const summary = await householdService.getHouseholdSummary(household.id);
      if (String(summary.id) !== String(household.id) || !Array.isArray(summary.members)) {
        throw new Error('The server returned a summary for a different or invalid household.');
      }
      if (sequence === requestSequence.current) {
        setHouseholdSummary(summary);
      }
      return summary;
    } catch (requestError) {
      if (sequence === requestSequence.current) {
        setError(getApiErrorMessage(requestError, 'Unable to load household members.'));
        if (requestError.response?.status === 401) {
          setCurrentUser(null);
        }
      }
      throw requestError;
    } finally {
      if (sequence === requestSequence.current) {
        setSummaryLoading(false);
      }
    }
  }, [setCurrentUser]);

  const refreshHouseholds = useCallback(async (preferredHouseholdId) => {
    if (!currentUser || authLoading) {
      setHouseholds([]);
      setCurrentHouseholdState(null);
      setHouseholdSummary(null);
      setError(authError || '');
      setLoading(false);
      return [];
    }

    const sequence = ++requestSequence.current;
    setLoading(true);
    setError('');
    try {
      const list = await householdService.getHouseholds();
      if (!Array.isArray(list)) {
        throw new Error('The household response was not a list.');
      }
      if (sequence !== requestSequence.current) {
        return list;
      }
      setHouseholds(list);

      const requestedId = preferredHouseholdId ?? selectedHouseholdId.current;
      const selected = list.find((household) => String(household.id) === String(requestedId)) || list[0] || null;
      selectedHouseholdId.current = selected?.id ?? null;
      setCurrentHouseholdState(selected);
      setHouseholdSummary(null);

      if (selected) {
        setSummaryLoading(true);
        const summary = await householdService.getHouseholdSummary(selected.id);
        if (String(summary.id) !== String(selected.id) || !Array.isArray(summary.members)) {
          throw new Error('The server returned a summary for a different or invalid household.');
        }
        if (sequence === requestSequence.current) {
          setHouseholdSummary(summary);
        }
      }
      return list;
    } catch (requestError) {
      if (sequence === requestSequence.current) {
        setHouseholdSummary(null);
        setError(getApiErrorMessage(requestError, 'Unable to load households.'));
        if (requestError.response?.status === 401) {
          setCurrentUser(null);
        }
      }
      throw requestError;
    } finally {
      if (sequence === requestSequence.current) {
        setLoading(false);
        setSummaryLoading(false);
      }
    }
  }, [authError, authLoading, currentUser, setCurrentUser]);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    if (!currentUser) {
      ++requestSequence.current;
      selectedHouseholdId.current = null;
      setHouseholds([]);
      setCurrentHouseholdState(null);
      setHouseholdSummary(null);
      setError(authError || '');
      setLoading(false);
      setSummaryLoading(false);
      return;
    }
    refreshHouseholds().catch(() => {});
  }, [authError, authLoading, currentUser, refreshHouseholds]);

  const value = {
    households,
    currentHousehold,
    setCurrentHousehold,
    householdSummary,
    loading,
    summaryLoading,
    error,
    refreshHouseholds,
  };

  return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>;
}

export function useHousehold() {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error('useHousehold must be used within a HouseholdProvider');
  }
  return context;
}
