import Cookies from 'js-cookie';

export const USER_DATA_UPDATED_EVENT = 'userDataUpdated';

export const updateStoredUserData = (
  updates: Record<string, unknown>,
  targetUserId?: string | number
) => {
  if (typeof window === 'undefined') return null;

  const storedUser = localStorage.getItem('userData');
  if (!storedUser) return null;

  try {
    const userData = JSON.parse(storedUser);
    const isCurrentUser =
      targetUserId == null || String(userData?.Id) === String(targetUserId);
    const storageKey = isCurrentUser ? 'userData' : 'editProfile';
    const storedTarget = isCurrentUser
      ? userData
      : JSON.parse(localStorage.getItem(storageKey) || 'null');

    if (
      !storedTarget ||
      (targetUserId != null && String(storedTarget?.Id) !== String(targetUserId))
    ) {
      return null;
    }

    const updatedUser = {
      ...storedTarget,
      ...updates,
    };

    localStorage.setItem(storageKey, JSON.stringify(updatedUser));

    if (isCurrentUser) {
      Cookies.set('userData', JSON.stringify(updatedUser), { path: '/' });
      window.dispatchEvent(
        new CustomEvent(USER_DATA_UPDATED_EVENT, { detail: updatedUser })
      );
    }

    return updatedUser;
  } catch (error) {
    console.error('Unable to update stored user data:', error);
    return null;
  }
};
