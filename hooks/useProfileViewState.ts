import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/data/store';
import {
  initializeProfileView,
  loadProfileProviderSetup,
  selectActiveProfileTab,
  selectProfileProviderSetup,
  selectProfileProviderSetupError,
  selectProfileProviderSetupStatus,
  selectProfileViewKey,
  setActiveProfileTab,
  type ProfileTab,
} from '@/data/slices/profile-view-slice';

export function useProfileViewState(profileKey?: string | null) {
  const dispatch = useDispatch<AppDispatch>();
  const activeTab = useSelector(selectActiveProfileTab);
  const storedProfileKey = useSelector(selectProfileViewKey);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profileKey) dispatch(initializeProfileView(String(profileKey)));
  }, [dispatch, profileKey]);

  useEffect(() => {
    if (activeTab !== 'Consultations' || storedProfileKey !== String(profileKey)) return;

    const frame = requestAnimationFrame(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    return () => cancelAnimationFrame(frame);
  }, [activeTab, profileKey, storedProfileKey]);

  const setActiveTab = useCallback(
    (tab: ProfileTab) => dispatch(setActiveProfileTab(tab)),
    [dispatch]
  );

  return { activeTab, containerRef, setActiveTab };
}

export function useProfileProviderSetup(profileKey?: string | null) {
  const dispatch = useDispatch<AppDispatch>();
  const storedProfileKey = useSelector(selectProfileViewKey);
  const storedProviderSetup = useSelector(selectProfileProviderSetup);
  const providerSetupStatus = useSelector(selectProfileProviderSetupStatus);
  const providerSetupError = useSelector(selectProfileProviderSetupError);
  const normalizedProfileKey = profileKey ? String(profileKey) : '';

  useEffect(() => {
    if (!normalizedProfileKey) return;

    dispatch(initializeProfileView(normalizedProfileKey));
    dispatch(loadProfileProviderSetup(normalizedProfileKey));
  }, [dispatch, normalizedProfileKey]);

  const isCurrentProfile = storedProfileKey === normalizedProfileKey;
  const providerSetup = isCurrentProfile ? storedProviderSetup : null;
  const isLoadingProviderSetup = Boolean(normalizedProfileKey) && (
    !isCurrentProfile || providerSetupStatus === 'idle' || providerSetupStatus === 'loading'
  );

  return {
    providerSetup,
    providerSetupError: isCurrentProfile ? providerSetupError : null,
    providerSetupStatus: isCurrentProfile ? providerSetupStatus : 'idle',
    isLoadingProviderSetup,
  };
}
