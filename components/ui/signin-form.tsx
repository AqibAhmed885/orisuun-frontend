'use client';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Input from './input';
import Checbox from './checbox';
import Button from './button';
import { useForm } from 'react-hook-form';
import { SigninFormData, signinSchema } from '@/utils/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { getFirstAccessibleRoute, getUserPermissions } from '@/utils/middleware-permissions';
import { useRouter } from 'next/navigation';
import ls from 'localstorage-slim';
import { signinAction, signInWithSocials } from '@/server-actions/signin';
import Link from 'next/link';
import { createUser } from '@/data/slices/user-slice';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { useSession } from 'next-auth/react';
import {
  getIsSigningInStatus,
  getSignInUpWithAction,
  handleSignInToggle,
  SetSignInUpWIthAction,
} from '@/utils/auth.helpers';
import { waitForCookies } from '@/middleware';
import { ensureCurrentCycleEntry } from '@/app/api/dashboard/dashboard';
// import { cookies } from 'next/headers';

const SigninForm = ({
  setIsLoading,
  isLoading,
}: {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [remember, setRemember] = useState(false);

  const { data: session } = useSession();
  const [hasAttemptedSignIn, setHasAttemptedSignIn] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: ls.get('userData', { decrypt: true })
        ? ls.get<{ email?: string; password?: string }>('userData', {
            decrypt: true,
          })!.email
        : '',
      password: ls.get('userData')
        ? ls.get<{ email?: string; password?: string }>('userData', {
            decrypt: true,
          })!.password
        : '',
    },
  });

  const handleSubmitOnSocials = async (data: SignInWithSocials) => {
    try {
      setIsLoading(true);

      const response = await signInWithSocials(data);
      handleSignInToggle(false);

      if (response.success == false) {
        const errorMsg = response?.data?.Message || response?.message || "Sign in failed. Please try again.";
        toast.error(errorMsg, { autoClose: 4000 });
        SetSignInUpWIthAction('');
        setIsLoading(false);
        return;
      }

      SetSignInUpWIthAction('');
      const responseData = response.data;

      if (responseData?.Message === 'You are not a subscribed member') {
        toast.error('Your account exists but is not yet active. Please complete payment to activate.', { autoClose: 4000 });
        // Redirect to payment page to complete activation
        router.push(`/payment?userId=${responseData.Result.Id}`);
        return;
      }

      if (responseData?.Result?.PaymentStatus === 'Pending Verification') {
        toast.error(responseData?.Message, { autoClose: 4000 });
        localStorage.setItem('UserPlanId', responseData.Result.PaypalPlanId);
        // Redirect to payment page to complete verification
        router.push(`/payment?userId=${responseData.Result.Id}`);
        return;
      }

      if (response.success) {
        void ensureCurrentCycleEntry(responseData?.Result?.Id);

        if (responseData?.Result?.IsSubscribed) {
          toast.success('Logged In successfully');
          dispatch(createUser(responseData.Result));
          Cookies.set('token', responseData.Result.Token, { path: '/' });
          Cookies.set('userData', JSON.stringify(responseData.Result), {
            path: '/',
          });
          localStorage.setItem('userData', JSON.stringify(responseData.Result));
          localStorage.removeItem('isFreeTier');

          if (responseData?.Result?.UserProfileTypeId !== 10 && responseData?.Result?.UserProfileTypeId !== 9) {
            if (!responseData.Result.isBasicProfileDetailExist) {
              // Redirect to profile making page
              router.push('/profile/new-profile');
            } else if (!responseData.Result.isProfileComplete) {
              // Redirect to profile editing page
              router.push(
                `/profile/edit-profile/${add2040ToProfileDetailsId(
                  responseData.Result.UserProfileDetailsId
                )}`
              );
            } else {
              // Redirect to dashboard page
              router.push('/dashboard');
            }
          } else {
            // Redirect admins (UserProfileTypeId 9 or 10) to admin dashboard
            // Get permissions and find first accessible route
            const userPermissions = getUserPermissions(responseData.Result);
            const firstRoute = getFirstAccessibleRoute(userPermissions);

            // Redirect to first accessible route or fallback to resources-management
            const redirectRoute = firstRoute || '/resources-management';
            router.push(redirectRoute);
          }
        } else {
          // Handle non-subscribed users (free tier)
          toast.success('Welcome to Orisuun Free Tier!');
          dispatch(createUser(responseData.Result));
          Cookies.set('token', responseData.Result.Token, { path: '/' });

          const userDataToStore = {
            ...responseData.Result,
            IsSubscribed: false,
            isSubscriptionActive: false,
            UserSubscribedPlanType: responseData.Result.UserSubscribedPlanType || 'Not_Selected',
          };

          Cookies.set('userData', JSON.stringify(userDataToStore), { path: '/' });
          localStorage.setItem('userData', JSON.stringify(userDataToStore));
          localStorage.setItem('isFreeTier', 'true');

          if (responseData?.Result?.UserProfileTypeId !== 10 && responseData?.Result?.UserProfileTypeId !== 9) {
            if (!responseData.Result.isBasicProfileDetailExist) {
              router.push('/profile/new-profile');
            } else if (!responseData.Result.isProfileComplete) {
              router.push(
                `/profile/edit-profile/${add2040ToProfileDetailsId(
                  responseData.Result.UserProfileDetailsId
                )}`
              );
            } else {
              router.push('/dashboard');
            }
          } else {
            const userPermissions = getUserPermissions(responseData.Result);
            const firstRoute = getFirstAccessibleRoute(userPermissions);
            const redirectRoute = firstRoute || '/resources-management';
            router.push(redirectRoute);
          }
        }
      }
      setIsLoading(false);

      // setTimeout(() => {
      //   setIsLoading(false);
      // }, 2000);
    } catch (error: any) {
      const errorMsg = error?.message || "Sign in failed. Please try again.";
      toast.error(errorMsg, { autoClose: 4000 });
      console.error('An error occurred during signin:', error);
    } finally {
      handleSignInToggle(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session && getIsSigningInStatus() == true && !hasAttemptedSignIn) {
      // Prevent calling the API multiple times
      setHasAttemptedSignIn(true);

      const signInWithSocialsData = {
        Username: session?.user?.email,
        SignedUpWith: getSignInUpWithAction(),
        Token: session?.accessToken as string,
        RememberPassword: true,
      };
      handleSubmitOnSocials(signInWithSocialsData);
    }
  }, [session, hasAttemptedSignIn]);

  const onSubmit = async (data: SigninFormData) => {
    try {
      setIsLoading(true);
      if (remember)
        ls.set('userData', data, {
          ttl: 60 * 60 * 4, // expires in 4 hours
          encrypt: true,
        });
      const response = await signinAction(data);

      if (response.success == false) {
        const errorMsg = response?.data?.Message || response?.message || "Invalid email or password. Please try again.";
        toast.error(errorMsg, { autoClose: 4000 });
        setIsLoading(false);
        return;
      }

      const responseData = response.data;

      if (responseData?.Message === 'You are not a subscribed member') {
        toast.error('Your account exists but is not yet active. Please complete payment to activate.', { autoClose: 4000 });
        // Redirect to payment page to complete activation
        router.replace(`/payment?userId=${responseData.Result.Id}`);
        return;
      }

      if (responseData?.Result?.PaymentStatus === 'Pending Verification') {
        // dispatch(setUser(responseData.user));
        // dispatch(setPaymentIntent(responseData.paymentIntent));

        toast.error(responseData?.Message, { autoClose: 4000 });

        // Redirect to payment page to complete verification
        router.replace(`/payment?userId=${responseData.Result.Id}`);
        return;
      }

      if (response.success) {
        // Handle both subscribed and non-subscribed users
        const userResult = responseData.Result;

        void ensureCurrentCycleEntry(userResult?.Id);

        // Store user data regardless of subscription status
        dispatch(createUser(userResult));
        Cookies.set('token', userResult.Token, { path: '/' });
        Cookies.set('userData', JSON.stringify(userResult), {
          path: '/',
        });

        // Set free tier flags for non-subscribed users
        const userDataToStore = {
          ...userResult,
          IsSubscribed: userResult.IsSubscribed || false,
          isSubscriptionActive: userResult.isSubscriptionActive || false,
          UserSubscribedPlanType: userResult.UserSubscribedPlanType || 'Not_Selected',
        };

        localStorage.setItem('userData', JSON.stringify(userDataToStore));

        // Set free tier flag if not subscribed
        if (!userResult.IsSubscribed || userResult.UserSubscribedPlanType === 'Not_Selected') {
          localStorage.setItem('isFreeTier', 'true');
        } else {
          localStorage.removeItem('isFreeTier');
        }

        await waitForCookies();
        toast.success('Welcome back! Logging you in...', { autoClose: 3000 });

        if (userResult?.UserProfileTypeId !== 10) {
          if (!userResult.isBasicProfileDetailExist) {
            // Redirect to profile making page
            router.replace('/profile/new-profile');
          } else if (!userResult.isProfileComplete) {
            // Redirect to profile editing page
            router.replace(
              `/profile/edit-profile/${add2040ToProfileDetailsId(
                userResult.UserProfileDetailsId
              )}`
            );
          } else {
            // Redirect to dashboard page
            router.replace('/dashboard');
          }
        } else {
          router.replace('/dashboard');
        }
      }
      // setTimeout(() => {
      //   setIsLoading(false);
      // }, 2000);
    } catch (error: any) {
      const errorMsg = error?.message || "Something went wrong. Please try again.";
      toast.error(errorMsg, { autoClose: 4000 });
      console.error('An error occurred during signin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-h9 leading-[100%]">
          Email Address
        </label>

        <Input
          {...register('email')}
          id="email"
          type="email"
          placeholder="example@email.com"
          error={errors.email?.message}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-h9 leading-[100%]">
          Password
        </label>
        <Input
          {...register('password')}
          id="password"
          type="password"
          placeholder="***********"
          error={errors.password?.message}
        />
      </div>

      <div className="text-h9 2xl:text-scaled-h9 !mt-[20px] flex md:flex-row flex-col items-start md:items-center justify-between gap-2">
        <Checbox
          id="remember_password"
          checked={remember}
          onChange={(e) => {
            if (e.target.checked) {
              setRemember(true);
            } else {
              setRemember(false);
            }
          }}
        >
          <label htmlFor="remember_password">Remember Password</label>
        </Checbox>
        <Link href={'/forgot-password'}>
          <p className="text-omblue-500">Forgot Password?</p>
        </Link>
      </div>

      <div>
        <Button
          variant="primary"
          className={'py-2 mb-2 font-semibold'}
          title="Sign in"
        />
      </div>
    </form>
  );
};

export default SigninForm;
