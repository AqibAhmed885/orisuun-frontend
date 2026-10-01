export const handleSigningUpToggle = (isSigningUp: boolean) => {
  localStorage.setItem('isSigningUp', `${isSigningUp}`);
};

export const getIsSigningUpStatus = () => {
  return localStorage.getItem('isSigningUp') === 'true'
    ? true
    : localStorage.getItem('isSigningUp');
};

export const handleSignInToggle = (isSigningIn: boolean) => {
  localStorage.setItem('isSigningIn', `${isSigningIn}`);
};

export const getIsSigningInStatus = () => {
  return localStorage.getItem('isSigningIn') === 'true'
    ? true
    : localStorage.getItem('isSigningIn');
};

export const SetSignInUpWIthAction = (action: string) => {
  localStorage.setItem('signInWithAction', action);
};

export const getSignInUpWithAction = () => {
  return localStorage.getItem('signInWithAction');
};
