'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/icons/logo';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { signInWithSocials, signinAction } from '@/server-actions/signin';
import { createUser } from '@/data/slices/user-slice';
import { waitForCookies } from '@/middleware';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { getFirstAccessibleRoute, getUserPermissions } from '@/utils/middleware-permissions';

const SignupThankYouClient = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const redirectAfterLogin = (user: any) => {

    if (user?.UserProfileTypeId === 10 || user?.UserProfileTypeId === 9) {
      const userPermissions = getUserPermissions(user);
      const firstRoute = getFirstAccessibleRoute(userPermissions);
      const route = firstRoute || '/dashboard';
      router.push(route);
      return;
    }

    if (!user?.isBasicProfileDetailExist) {
      router.push('/profile/new-profile');
      return;
    }

    if (!user?.isProfileComplete) {
      router.push(
        `/profile/edit-profile/${add2040ToProfileDetailsId(user?.UserProfileDetailsId)}`
      );
      return;
    }

    router.push('/dashboard');
  };

  const persistAuth = async (user: any) => {
    try {
      
      dispatch(createUser(user));
      
      // Set cookies
      Cookies.set('token', user?.Token, { path: '/' });
      Cookies.set('userData', JSON.stringify(user), { path: '/' });
      
      // Set localStorage
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.removeItem('isFreeTier');
      localStorage.setItem('newUserWelcomePending', 'true');
      
      // Clear signup-related data
      localStorage.removeItem('registerUser');
      localStorage.removeItem('signupAuthData');
            
      // Wait for cookies to be set with a timeout
      try {
        await Promise.race([
          waitForCookies(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Cookie timeout')), 3000)
          )
        ]);
      } catch (cookieError: any) {
        console.warn('⚠️ Cookie wait timeout, proceeding anyway:', cookieError?.message);
        // Continue anyway - cookies are already set
      }
    } catch (error: any) {
      console.error('❌ Error persisting auth:', error?.message);
      throw error;
    }
  };

  const handleContinue = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      // 🧪 Check if this is a test mode payment
      const isTestMode = typeof localStorage !== 'undefined' && localStorage.getItem('testModePayment') === 'true';
      
      if (isTestMode) {        
        // Get the test auth data
        const testAuthData = JSON.parse(localStorage.getItem('signupAuthData') || '{}');
        const testUser = testAuthData?.user || {};
        
        // Create a mock user object for test mode
        const mockTestUser = {
          Token: 'test-token-' + Date.now(),
          Id: testUser?.Id || 'test-user-id',
          UserProfileTypeId: testUser?.UserProfileTypeId || 1,
          isBasicProfileDetailExist: testUser?.isBasicProfileDetailExist || false,
          isProfileComplete: testUser?.isProfileComplete || false,
          UserProfileDetailsId: testUser?.UserProfileDetailsId || null,
          ...testUser,
        };
        
        await persistAuth(mockTestUser);
        await new Promise(resolve => setTimeout(resolve, 500));
        redirectAfterLogin(mockTestUser);
        return;
      }

      // Check if user is already authenticated
      const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
      if (currentUser?.Token) {
        redirectAfterLogin(currentUser);
        return;
      }

      // Get signup authentication data with multiple fallback sources
      const signupAuthData = JSON.parse(localStorage.getItem('signupAuthData') || '{}');
      const registerUser = JSON.parse(localStorage.getItem('registerUser') || '{}');

      // Build authData with multiple fallback sources for password
      const authData = {
        Email: signupAuthData?.Email || registerUser?.Email || signupAuthData?.email || registerUser?.email || signupAuthData?.user?.Email || registerUser?.user?.Email || '',
        Password: signupAuthData?.Password || registerUser?.Password || signupAuthData?.password || registerUser?.password || registerUser?.user?.Password || registerUser?.user?.password || '',
        SignedUpWith: signupAuthData?.SignedUpWith || registerUser?.SignedUpWith || 'manual',
        Token: signupAuthData?.Token || registerUser?.Token || registerUser?.user?.Token || '',
      };

      const email = authData?.Email || '';
      const password = authData?.Password || '';
      const signedUpWith = authData?.SignedUpWith || 'manual';
      const oauthToken = authData?.Token || '';

      let response: any;

      if (signedUpWith !== 'manual') {
        // OAuth sign-in
        if (oauthToken) {
          response = await signInWithSocials({
            Username: email,
            SignedUpWith: signedUpWith,
            Token: oauthToken,
            RememberPassword: true,
          });
        }
      } else {
        // Manual email/password sign-in
        if (email && password) {
          response = await signinAction({
            email,
            password,
          });
        }
      }

      const responseData = response?.data;
      const user = responseData?.Result;

      // Check if signin was successful
      if (response?.success && user?.Token) {
        toast.success('Welcome to Orisuun! ');
        await persistAuth(user);
        
        // Give auth state time to settle
        await new Promise(resolve => setTimeout(resolve, 500));
        
        redirectAfterLogin(user);
      } else {
        // Sign-in failed or no token, but user has subscription - redirect to dashboard anyway
        console.warn('⚠️ Sign-in did not return token, but user has active subscription');
        console.warn('📧 Redirecting to dashboard...');
        toast.success('Welcome to Orisuun! 🎉');
        setIsLoading(false);
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.warn('⚠️ Error during sign-in, but user has active subscription');
      console.warn('📧 Redirecting to dashboard without authentication');
      
      // User already has subscription from signup, redirect to dashboard
      toast.success('Welcome to Orisuun! 🎉');
      setIsLoading(false);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="mx-auto min-h-screen"
      style={{
        backgroundImage: 'url("/beta/images/onboarding.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <section className="flex min-h-screen max-w-7xl mx-auto flex-col md:flex-row">
        <div className="flex w-full flex-col justify-center px-6 py-10 md:w-1/2 md:px-12 lg:px-20">
          <Logo className="h-12 w-40" />

          <div className="mt-10 max-w-xl space-y-5">
            <h1 className="text-[34px] font-semibold leading-tight text-blue-500 md:text-[44px]">
              Thank You!
            </h1>

            <p className="text-base leading-7 text-gray-700">
              You have successfully created your membership.
            </p>

            <p className="text-base leading-7 text-gray-700">Welcome to Orisuun</p>

            <div className="pt-2">
              <button
                type="button"
                data-gtm="onboarding_paid_continue"
                onClick={handleContinue}
                disabled={isLoading}
                className="inline-flex h-12 items-center justify-center rounded-full border border-olblue-500 px-8 text-base font-semibold text-omblue-500 transition-all hover:text-white hover:bg-omblue-700 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Continuing...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignupThankYouClient;
