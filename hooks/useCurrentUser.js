import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { USER_DATA_UPDATED_EVENT } from '@/utils/user-storage';

export default function useCurrentUser() {
  const authUser = useSelector((state) => (state && state.auth ? state.auth.userDetails || state.auth.user || null : null));
  const [user, setUser] = useState(authUser || null);

  const getStoredUser = useCallback(() => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem('userData') || 'null');
      if (storedUserData) return storedUserData;

      const storedRegisterUser = JSON.parse(localStorage.getItem('registerUser') || 'null');
      if (storedRegisterUser) return storedRegisterUser;
    } catch (e) {
      // ignore parse errors
    }

    return authUser || null;
  }, [authUser]);

  useEffect(() => {
    if (authUser) setUser(authUser);
  }, [authUser]);

  useEffect(() => {
    const refreshFromLocal = () => {
      setUser(getStoredUser());
    };

    // initial read
    refreshFromLocal();

    // listen for other parts of the app updating user data
    window.addEventListener('registerUserUpdated', refreshFromLocal);
    window.addEventListener(USER_DATA_UPDATED_EVENT, refreshFromLocal);
    window.addEventListener('storage', refreshFromLocal);
    return () => {
      window.removeEventListener('registerUserUpdated', refreshFromLocal);
      window.removeEventListener(USER_DATA_UPDATED_EVENT, refreshFromLocal);
      window.removeEventListener('storage', refreshFromLocal);
    };
  }, [getStoredUser]);

  return { user };
}
