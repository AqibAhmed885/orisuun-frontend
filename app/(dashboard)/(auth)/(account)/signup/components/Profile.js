'use client';

import Link from 'next/link';
import { Suspense, useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { registerUserAPI } from '../../../../../api/auth/auth';
import { profileTypesWithIds, getProfileIdFromSlug } from '../../../../../../data/marketing/signupData';
import { ProfileDetails } from './ProfileDetails';
import { profileSchema } from '../../../../../../utils/marketing/schemas';
import { toast } from 'react-toastify';
import Button from '@/components/ui/button';
import Divider from '@/components/ui/divider';
import SocialButtons from '@/components/ui/social-buttons';
import { useSession } from 'next-auth/react';
import {
  getIsSigningUpStatus,
  getSignInUpWithAction,
  handleSigningUpToggle,
  SetSignInUpWIthAction,
} from '@/utils/auth.helpers';
import { useDispatch } from 'react-redux';
import { setSelectedProfileType } from '@/data/slices/auth-slice';
import ChevronDown from '@/icons/chevron-down';
import Image from 'next/image';
import useOutsideClick from '@/hooks/useOutsideClick';


import Modal from './Modal';

const clearSession = async () => {
  // Use NextAuth's signOut function to clear cookies and reset session
  await signOut({ redirect: false });
};

export const Profile = ({ selectedPlan, selectedBilling, billings }) => {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  // Extract query parameters
  const queryProfile = searchParams.get('profile');
  const isFreeSignupPath = pathname?.startsWith('/free/signup');
  const emailSignupDataGtm = isFreeSignupPath
    ? 'signup_free_email'
    : 'signup_paid_email';
  const paymentsRoute = searchParams?.has('weekly-funding')
    ? '/payments?weekly-funding'
    : '/payments';
  const postSignupRoute = isFreeSignupPath
    ? '/free/signup-thank-you'
    : paymentsRoute;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profilesTypes, setProfileTypes] = useState(profileTypesWithIds);
  const [selectedOption, setSelectedOption] = useState(profileTypesWithIds[0]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openFrom, setOpenFrom] = useState(false);
  // modal state for role picker
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [modalSelectedRole, setModalSelectedRole] = useState(profileTypesWithIds[0]?.Id);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef(null);

  // New state to control form visibility and prevent flicker
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Track if we've already attempted OAuth registration to prevent duplicate calls
  const [hasAttemptedOAuthRegistration, setHasAttemptedOAuthRegistration] = useState(false);
  // Inline error for duplicate account
  const [accountExistsError, setAccountExistsError] = useState(false);

  // close dropdown when clicking outside
  useOutsideClick(roleDropdownRef, () => setRoleDropdownOpen(false));

  const handleChange = (value) => {
    dispatch(setSelectedProfileType(value.Id));
    setSelectedOption(value);

    // Update URL query param so signup?profile=<slug> reflects selected role
    try {
      const slug = value?.slug || value?.UserProfileName?.toLowerCase().replace(/\s+/g, '-') || String(value?.Id);
      // Preserve other query params
      const currentSearch = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
      currentSearch.set('profile', slug);
      const newUrl = `${pathname}?${currentSearch.toString()}`;
      // Use replace so it doesn't create an extra history entry; use push if you prefer history behavior
      router.replace(newUrl);
    } catch (e) {
      // Fallback: silently fail
      // console.error('Failed to update profile query param', e);
    }
  };

  const {
    register,
    handleSubmit,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    mode: 'onTouched',
  });






  const isAlreadyExistsError = (msg = '') =>
    /user already exists/i.test(msg) ||
    /email.*already.*registered/i.test(msg) ||
    /account already exists/i.test(msg) ||
    /already.*account/i.test(msg);

  const parsePlanPrice = (priceValue) => {
    if (!priceValue) return 0;
    const priceStr = priceValue.toString().replace(/,/g, '');
    const match = priceStr.match(/\$?\s*([0-9]+(?:\.[0-9]+)?)/);
    if (match) return parseFloat(match[1]);
    const num = parseFloat(priceValue);
    return isNaN(num) ? 0 : num;
  };

  const selectedBillingPlan =
    billings?.find((billing) => billing?.Name === selectedBilling) ||
    billings?.find((billing) => billing?.Name?.toLowerCase() === 'monthly') ||
    billings?.[0] ||
    null;

  const registerUser = async (data) => {
    setAccountExistsError(false);
    try {
      const response = await registerUserAPI({
        ...data,
        PrivacyCheck: true,
      });

      if (response.status === 200) {
        toast.success(
          isFreeSignupPath
            ? 'Account created successfully!...'
            : 'Account created successfully! ',
          { autoClose: 3000, position: 'top-right' }
        );

        // Store combined data: API response (contains PalpalPlanId) + submitted data
        const apiResult = response.data?.Result || {};
        const planAmount = parsePlanPrice(selectedBillingPlan?.Price);
        const resolvedPaypalPlanId = selectedBillingPlan?.PaypalPlanId || apiResult?.PalpalPlanId || apiResult?.PaypalPlanId || data?.PaypalPlanId || data?.PalpalPlanId || null;
        const resolvedPlanId = Number(selectedBillingPlan?.Id) || Number(apiResult?.BillingPlanId) || Number(apiResult?.UserSubscriptionPlanId) || data?.BillingPlanId || data?.UserSubscriptionPlanId || 0;
        const resolvedPlanType = selectedPlan?.Name || selectedPlan?.type || selectedPlan || 'Premium';
        const combinedData = {
          ...data,
          ...apiResult,
          // Ensure PayPal Plan ID is available (note: API returns "PalpalPlanId")
          PaypalPlanId: resolvedPaypalPlanId,
          PalpalPlanId: resolvedPaypalPlanId,
          BillingPlanId: resolvedPlanId,
          UserSubscriptionPlanId: resolvedPlanId,
          BillingFrequency: selectedBillingPlan?.Name || data?.BillingFrequency || apiResult?.BillingFrequency || 'Monthly',
          Currency: selectedBillingPlan?.Currency || data?.Currency || apiResult?.Currency || 'USD',
          paymentIntent: {
            ...(data?.paymentIntent || apiResult?.paymentIntent || {}),
            Amount: planAmount,
          },
          user: {
            ...(data?.user || apiResult?.user || {}),
            SubscriptionPlanType: resolvedPlanType,
            BillingFrequency: selectedBillingPlan?.Name || data?.BillingFrequency || apiResult?.BillingFrequency || 'Monthly',
          },
        };
        localStorage.setItem('registerUser', JSON.stringify(combinedData));

        const signupAuthData = {
          Email: data?.Email || data?.email || '',
          Password: data?.Password || data?.password || '',
          SignedUpWith: data?.SignedUpWith || 'manual',
          Token: data?.Token || '',
        };
        localStorage.setItem('signupAuthData', JSON.stringify(signupAuthData));

        // Set token and userData cookies for middleware authentication
        // This is needed so the middleware doesn't redirect to /signin after signup
        if (typeof document !== 'undefined') {
          const token = apiResult?.Token || apiResult?.token || data?.Token || '';
          const userDataObj = {
            ...apiResult,
            Token: token,
            isProfileComplete: apiResult?.isProfileComplete || false,
            isBasicProfileDetailExist: apiResult?.isBasicProfileDetailExist || true,
            UserSubscribedPlanType: isFreeSignupPath ? 'Free' : (apiResult?.UserSubscribedPlanType || 'Premium'),
          };
          
          // Set token cookie (even if empty, for free tier users)
          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
          
          // Set userData cookie
          document.cookie = `userData=${encodeURIComponent(JSON.stringify(userDataObj))}; path=/; max-age=86400; SameSite=Lax`;
        }

        await clearSession();

        // Check if this is a social signup (OAuth flow)
        const isSocialSignup = data?.SignedUpWith && data?.SignedUpWith !== 'manual';

        // Clear localStorage flags to prevent re-registration
        handleSigningUpToggle(false);
        
        // Use window.location for more reliable redirect after OAuth
        // This ensures the redirect happens even if React router has issues
        setTimeout(() => {
          window.location.href = postSignupRoute;
        }, 500);
      } else {
        toast.error(response?.data?.message || 'Registration failed', {
          containerId: 'containerA',
        });
        handleSigningUpToggle(false);
        setIsFormVisible(true);
      }
    } catch (error) {
      // Check if error message indicates user already exists
      const errorMessage = error?.response?.data?.Message || error?.response?.data?.message || error.message || '';
      if (isAlreadyExistsError(errorMessage)) {
        if (data.SignedUpWith !== 'manual') {
          toast.info(
            isFreeSignupPath
              ? 'Account already exists ...'
              : 'Account already exists. Proceeding to payment...',
            // { containerId: 'containerA' }
          );
          localStorage.setItem(
            'signupAuthData',
            JSON.stringify({
              Email: data?.Email || data?.email || '',
              Password: data?.Password || data?.password || '',
              SignedUpWith: data?.SignedUpWith || 'manual',
              Token: data?.Token || '',
            })
          );
          handleSigningUpToggle(false);
          
          setTimeout(() => {
            window.location.href = '/signin';
          }, 1000);
        } else {
          // Manual: show inline error with sign-in link — do NOT toast
          setAccountExistsError(true);
          setIsFormVisible(true);
        }
        return;
      } else {
        // User-friendly error message
        let userFriendlyMessage = errorMessage;

        // Map backend errors to user-friendly messages
        if (errorMessage.includes('Invalid Token') || errorMessage.includes('Invalid Sign')) {
          userFriendlyMessage = 'Authentication failed. Please try signing up again.';
        } else if (errorMessage.includes('Email')) {
          userFriendlyMessage = 'Invalid email address. Please check and try again.';
        } else if (!userFriendlyMessage || userFriendlyMessage.trim() === '') {
          userFriendlyMessage = 'Something went wrong during signup. Please try again.';
        }

        toast.error(userFriendlyMessage, {
          autoClose: 4000,
          position: 'top-right'
        });
        setError(error.message);
        setIsFormVisible(true);
      }
      handleSigningUpToggle(false);
    } finally {
      setLoading(false);
      SetSignInUpWIthAction('');
    }
  };


  const onSubmit = async (data) => {
    setError(null);
    setAccountExistsError(false);
    handleSigningUpToggle(true);
    const userData = {
      SignedUpWith: 'manual',
      FirstName: data?.firstName,
      LastName: data?.lastName,
      Email: data?.email,
      Password: data?.password,
      PrivacyCheck: true,
      ProFileType: selectedOption.Id,
      BillingFrequency: selectedBillingPlan?.Name || selectedBilling || 'Monthly',
      BillingPlanId: Number(selectedBillingPlan?.Id) || 0,
      UserSubscriptionPlanId: Number(selectedBillingPlan?.Id) || 0,
      PaypalPlanId: selectedBillingPlan?.PaypalPlanId || null,
      PalpalPlanId: selectedBillingPlan?.PaypalPlanId || null,
      Currency: selectedBillingPlan?.Currency || 'USD',
      paymentIntent: {
        Amount: parsePlanPrice(selectedBillingPlan?.Price),
      },
      user: {
        SubscriptionPlanType: selectedPlan?.Name || selectedPlan?.type || selectedPlan || 'Premium',
        BillingFrequency: selectedBillingPlan?.Name || selectedBilling || 'Monthly',
      },
    };

    setLoading(true);
    registerUser(userData);
  };

  useEffect(() => {
    if (queryProfile) {
      // Check if queryProfile is a slug (contains letters) or an ID (only numbers)
      const isSlug = /[a-zA-Z]/.test(queryProfile);
      let profileId;

      if (isSlug) {
        // Convert slug to ID
        profileId = getProfileIdFromSlug(queryProfile);
      } else {
        // It's already an ID
        profileId = Number(queryProfile);
      }

      if (profileId) {
        const foundProfile = profileTypesWithIds.find(
          (profileType) => profileType.Id == profileId
        );
        if (foundProfile) {
          setSelectedOption(foundProfile);
          dispatch(setSelectedProfileType(profileId));
        } else {
          // Fallback to default if profile not found
          setSelectedOption(profileTypesWithIds[0]);
          dispatch(setSelectedProfileType(profileTypesWithIds[0].Id));
        }
      } else {
        // Fallback to default if conversion failed
        setSelectedOption(profileTypesWithIds[0]);
        dispatch(setSelectedProfileType(profileTypesWithIds[0].Id));
      }
    } else {
      setSelectedOption(profileTypesWithIds[0]);
      dispatch(setSelectedProfileType(profileTypesWithIds[0].Id));
    }
  }, [queryProfile]);




  useEffect(() => {
    // If we have a session and registration should continue, complete signup.
    if (session && status === 'authenticated' && !loading && !hasAttemptedOAuthRegistration) {
      const isSigningUp = getIsSigningUpStatus();
      const signedUpWith = getSignInUpWithAction();

      // Detect OAuth provider from session - this works even without localStorage
      // NextAuth sessions from OAuth will have accessToken and user info
      const isOAuthSession = session?.accessToken && session?.user?.email;
      
      // Determine the provider: use localStorage value if available, otherwise default
      let detectedProvider = signedUpWith;
      if (!detectedProvider && isOAuthSession) {
        // Default to 'google' if we can't determine the provider but have a valid OAuth session
        // This handles the case where user is on a new device without localStorage
        detectedProvider = 'google';
      }

      // Proceed if:
      // 1. We have localStorage flags (normal flow), OR  
      // 2. We have a valid OAuth session on signup page (handles new device scenario)
      const shouldProceedWithRegistration = 
        ((isSigningUp === true || isSigningUp === 'true' || signedUpWith) && selectedOption?.Id) ||
        (isOAuthSession && selectedOption?.Id);

      if (shouldProceedWithRegistration) {
        setHasAttemptedOAuthRegistration(true); // Prevent duplicate registration attempts

        const userData = {
          SignedUpWith: detectedProvider || 'social',
          FirstName: session.user?.name?.split(' ')[0] || '',
          LastName: session.user?.name?.split(' ')[1] || '',
          email: session.user?.email,
          PrivacyCheck: true,
          ProFileType: selectedOption?.Id,
          UserSubscriptionPlanId: 0,
          Password: '',
          Token: session?.accessToken,
        };
        setLoading(true);
        registerUser(userData);
      } else if (isOAuthSession && !selectedOption?.Id) {
        // User has OAuth session but no profile selected - show the form
        setIsFormVisible(true);
        handleSigningUpToggle(false);
      }
    }
  }, [session, status, selectedOption, hasAttemptedOAuthRegistration]);

  // On mount, check if we should show form based on localStorage flags
  useEffect(() => {
    const isSigningUp = getIsSigningUpStatus();
    // If no signing up flag or it's false, show the form
    if (isSigningUp == null || (isSigningUp !== true && isSigningUp !== 'true')) {
      // Small delay to let session status resolve
      const timer = setTimeout(() => {
        if (status !== 'loading') {
          setIsFormVisible(true);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    // If isSigningUp is true, we keep form hidden to show loader while OAuth processes
  }, [status]);

  // Watch for session status to prevent stuck loading
  useEffect(() => {
    if (status === 'unauthenticated') {
      // If unauthenticated, always show the form so they can sign up manually or retry
      setIsFormVisible(true);
    } else if (status === 'authenticated' && session) {
      // If user is authenticated via OAuth
      const isOAuthSession = session?.accessToken && session?.user?.email;

      if (isOAuthSession && !loading && !hasAttemptedOAuthRegistration) {
        // Check if we should show form (if no profile selected yet)
        if (!selectedOption?.Id) {
          setIsFormVisible(true);
        }
        // If profile is selected, the other useEffect will handle registration
      }
    }
  }, [status, session, loading, hasAttemptedOAuthRegistration, selectedOption]);

  const toSingular = (name = "") => {
    // basic plural → singular handling
    if (name.toLowerCase().endsWith("ies")) {
      return name.slice(0, -3) + "y"; // Businesses → Business
    }

    if (name.toLowerCase().endsWith("s")) {
      return name.slice(0, -1); // Experts → Expert
    }

    return name; // already singular
  };

  return (
    <>
      {!isFormVisible && (
        <div className="flex h-[50vh] w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-nav-blue border-t-transparent" />
        </div>
      )}
      {isFormVisible && (
        <Suspense>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 md:space-y-5"
          >
            <div
              className={` space-y-2 relative`}
            >
              <div className="relative flex flex-col w-full xs:px-5 lg:!px-0 lg:!flex-row gap-3 lg:!gap-0 items-start justify-start lg:space-x-4 xl:space-x-10">
                <div className="flex xl:w-1/4 flex-col gap-1.5 mb-20 xs:min-w-full lg:!min-w-max  " >
                  <Image
                    src={`/icons/signup/${selectedOption?.Id}.svg`}
                    alt="Profile Icon"
                    width={480}
                    height={480}
                    className="absolute w-64  -left-12 -top-12 md:-left-24 md:-top-0 pointer-events-none"
                  />
                  <span className="font-bold  text-gray-400 text-base">Role</span>
                  <h1 className="md:text-7xl text-3xl text-gray-900 font-semibold">
                    {selectedOption?.Id === 1 ?
                      (
                        <h1>
                          Business
                        </h1>
                      ) : (
                        <>
                          {toSingular(selectedOption?.UserProfileName?.toString() || '')}
                        </>
                      )}
                  </h1>

                  <p className="mt- text-xs text-gray-500 max-w-2xl">
                    {(() => {
                      const map = {
                        'Black-owned Businesses': 'Business members use Orisuun to access customers, capital, mentorship and professional support',
                        'Experts': 'Experts provide Black-owned businesses with domain-specific insights grounded in deep subject-matter expertise',
                        'Investors': 'Investors discover and invest in Black-owned businesses from early to established stages',
                        'Strategy Consultants': 'Strategy consultants help Black-owned businesses tackle high-impact challenges through rigorous structured analysis and execution support',
                        'Professionals': 'Professionals support Black-owned businesses by delivering specialized functions across business functions',
                        'Mentors': 'Mentors help Black-owned businesses grow by sharing experience-driven advice and perspective',
                        'Advocates': 'Advocates strengthen Black-owned businesses by supporting them directly and through feedback and fundraising',
                      };
                      return map[selectedOption?.UserProfileName] || '';
                    })()}
                  </p>

                  <button
                    type="button"
                    className="self-start relative z-10 cursor-pointer inline-block text-sm text-nav-blue underline font-semibold "
                    onClick={() => {
                      setModalSelectedRole(selectedOption?.Id || profileTypesWithIds[0]?.Id);
                      setShowRoleModal(true);
                    }}
                  >
                    I need a different role type?
                  </button>

                  <Modal
                    showModal={showRoleModal}
                    setShowModal={(val) => { setShowRoleModal(val); if (!val) setRoleDropdownOpen(false); }}
                    modalSize="sm"

                  >
                    <div className="flex flex-col w-full  items-start gap-6">
                      <div className="w-full md:w-[600px] h-auto mx-auto">
                        <Image
                          src="/images/main-animation.png     "
                          alt="Orisuun ecosystem"
                          width={1200}
                          height={1200}
                          className=''
                        />
                      </div>
                      <div className="w-full flex flex-col items-center justify-center">
                        <h1 className='md:text-3xl text-2xl capitalize text-center font-semibold'>There&apos;s a place for you here </h1>
                        {/* <p className=" mt-4 mb-2"></p> */}
                        <p className="mb-4 mt-4">Select your desired role</p>
                        <div className="md:w-1/2 w-full relative" ref={roleDropdownRef}>
                          <button
                            type="button"
                            aria-haspopup="listbox"
                            aria-expanded={roleDropdownOpen}
                            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                            onKeyDown={(e) => { if (e.key === 'Escape') setRoleDropdownOpen(false); }}
                            className={`w-full rounded-full px-6 py-2 text-base flex text-nowrap items-center justify-between  bg-white transition-border ${roleDropdownOpen ? 'border-2 ring-2 ring-[rgba(35,87,198,0.06)]' : 'border border-gray-200'}`}
                          >
                            <span>{profilesTypes.find((p) => p.Id === modalSelectedRole)?.UserProfileName}</span>
                            <ChevronDown className="w-3 h-3 text-gray-500" />
                          </button>

                          <div
                            role="listbox"
                            tabIndex={-1}
                            className={`absolute mt-1 h-40 w-full  overflow-auto bg-white border border-gray-200 rounded-xl shadow z-50 ${roleDropdownOpen ? 'block' : 'hidden'}`}
                          >
                            {profilesTypes.map((p) => (
                              <button
                                key={p.Id}
                                type="button"
                                role="option"
                                aria-selected={modalSelectedRole === p.Id}
                                className={`w-full text-left px-4 py-1 text-sm hover:bg-gray-50 ${modalSelectedRole === p.Id ? 'bg-gray-100 font-semibold' : ''}`}
                                onClick={() => { setModalSelectedRole(p.Id); setRoleDropdownOpen(false); }}
                              >
                                {p.UserProfileName}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mt-6 flex w-full justify-center">
                          <button
                            type="button"
                            className="w-full  px-6 py-3 font-semibold text-base bg-nav-blue text-white rounded-full"
                            onClick={() => {
                              const chosen = profilesTypes.find((p) => p.Id === modalSelectedRole);
                              if (chosen) handleChange(chosen);
                              setOpenFrom(true);
                              setShowRoleModal(false);
                              setIsCollapsed(true);
                            }}
                          >
                            Sign up for free
                          </button>

                        </div>

                        <div className="w-full text-center mt-4">
                          <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link href="/signin" className="text-nav-blue font-semibold" onClick={() => setShowRoleModal(false)}>
                              Log in
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
            <div className='w-full flex flex-col items-center'>
              <button onClick={
                () => {
                  setIsCollapsed(!isCollapsed);
                  setOpenFrom(!openFrom);
                }
              } type="button" className="flex items-center gap-2 text-lg text-center font-semibold underline self-center text-nav-blue ">
                {isCollapsed ? 'Sign up options' : ''}
                {/* {isCollapsed ? <ChevronRightBlack className="w-3 h-3" /> : null} */}
              </button>
            </div>
            {!isCollapsed && (
              <SocialButtons
                handleStatusToggle={handleSigningUpToggle}
                isSubmitting={loading}
              />
            )}
            <Divider text="or" />

            <div className={`flex justify-center ${openFrom ? 'hidden' : ''}`}>
              <button
                type="button"
                data-gtm={emailSignupDataGtm}
                className="border-b border-nav-blue mx-auto block"
                onClick={() => {
                  if (!openFrom) clearErrors();
                  setOpenFrom(!openFrom);
                  setIsCollapsed(!isCollapsed);
                }}
              >
                <span className="text-center font-semibold text-lg text-nav-blue">
                  Sign up with Email
                </span>
              </button>
            </div>

            {openFrom && (
              <div className="space-y-6 md:space-y-5 pb-6">
                <div className="space-y-2">
                  <p className="text-lg  font-semibold">Sign up with Email</p>
                  <ProfileDetails register={register} errors={errors} />
                </div>

                {accountExistsError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    An account with this email already exists.{' '}
                    <Link href="/signin" className="font-semibold underline text-red-700 hover:text-red-900">
                      Sign in instead
                    </Link>
                    {' '}or use a different email address.
                  </div>
                )}
                <Button
                  className="w-full h-12 rounded-full text-lg !mx-0"
                  disabled={loading}
                  title={`${loading ? 'Submitting...' : 'Create Your Account'}`}
                />
              </div>
            )}
          </form>
        </Suspense>
      )}
    </>
  );
};
