'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { signInWithSocials, signinAction } from '@/server-actions/signin';
import { createUser } from '@/data/slices/user-slice';
import { waitForCookies } from '@/middleware';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { getFirstAccessibleRoute, getUserPermissions } from '@/utils/middleware-permissions';
import { constructNow } from 'date-fns';

const FreeSignupThankYouClient = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const redirectAfterLogin = (user: any) => {
    // Check if user is admin (UserProfileTypeId 9 or 10)
    if (user?.UserProfileTypeId === 10 || user?.UserProfileTypeId === 9) {
      const userPermissions = getUserPermissions(user);
      const firstRoute = getFirstAccessibleRoute(userPermissions);
      const route = firstRoute || '/dashboard';
      router.push(route);
      return;
    }

    // For regular users, check profile completion
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

    // Redirect to dashboard for free tier users
    router.push('/dashboard');
  };

  const persistAuth = async (user: any) => {
    try {
      dispatch(createUser(user));

      // Set cookies
      Cookies.set('token', user?.Token, { path: '/' });
      Cookies.set('userData', JSON.stringify(user), { path: '/' });

      // Set localStorage with proper free tier flags
      const userDataWithFreeTier = {
        ...user,
        IsSubscribed: false,
        isSubscriptionActive: false,
        UserSubscribedPlanType: 'Free',
        BillingFrequency: 'Free',
      };
      
      localStorage.setItem('userData', JSON.stringify(userDataWithFreeTier));
      localStorage.setItem('newUserWelcomePending', 'true');
      localStorage.setItem('isFreeTier', 'true');

      // Clear signup-related data
      localStorage.removeItem('registerUser');
      localStorage.removeItem('signupAuthData');
    } catch (error: any) {
      console.error('❌ Error persisting auth:', error?.message);
      throw error;
    }
  };

  const handleContinue = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      // Check if user is already authenticated
      const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');

      if (currentUser?.Token) {
        redirectAfterLogin(currentUser);
        return;
      }

      // Get signup authentication data
      const signupAuthData = JSON.parse(localStorage.getItem('signupAuthData') || '{}');
      const registerUser = JSON.parse(localStorage.getItem('registerUser') || '{}');


      // Build authData with multiple fallback sources
      const authData = {
        Email: signupAuthData?.Email
          || registerUser?.Email || signupAuthData?.email || registerUser?.email || signupAuthData?.user?.Email || registerUser?.user?.Email || '',
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
        toast.success('Welcome to Orisuun Free Tier! 🎉');
        await persistAuth(user);

        // Give auth state time to settle
        await new Promise(resolve => setTimeout(resolve, 500));

        redirectAfterLogin(user);
      } else {
        // For free tier, redirect to profile setup if no token
        toast.success('Welcome to Orisuun Free Tier! 🎉');
        router.push('/profile/new-profile');
      }
    } catch (error: any) {
      toast.success('Welcome to Orisuun Free Tier! 🎉');
      router.push('/profile/new-profile');
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
        backgroundPosition: '',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <section className="flex min-h-screen max-w-7xl mx-auto flex-col md:flex-row">
        <div className="flex w-full flex-col justify-center px-6 py-10 md:w-1/2 md:px-12 lg:px-20">
          <Image
            src="/logo.svg"
            alt="Orisuun Logo"
            width={160}
            height={48}
            className="h-12 w-40"
          />

          <div className="mt-10 max-w-xl space-y-5">
            <h1 className="text-[34px] font-semibold leading-tight text-blue-500 md:text-[44px]">
              Welcome to Orisuun Free Tier!
            </h1>

            <p className="text-base leading-7 text-gray-700">
              You have successfully created your free membership.
            </p>

            {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Your Free Access Includes:</h2>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>✓ Discounts - Create and view deals</li>
                <li>✓ Communities & Chat</li>
                <li>✓ Connections</li>
                <li>✓ Reviews</li>
                <li>✓ Search</li>
                <li>✓ Leaderboard</li>
              </ul>
            </div> */}

            <p className="text-sm text-gray-600">
              Upgrade to Premium anytime to unlock features like fundraising, business development, and more!
            </p>

            <div className="pt-4">
              <button
                type="button"
                data-gtm="onboarding_free_continue"
                onClick={handleContinue}
                disabled={isLoading}
                className="inline-flex h-12 items-center justify-center rounded-full border border-olblue-500 px-8 text-base font-semibold text-omblue-500 transition-all hover:text-white hover:bg-omblue-700 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Continuing...' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FreeSignupThankYouClient;
