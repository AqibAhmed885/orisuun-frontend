import Image from 'next/image';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Cookies from 'js-cookie';
import { Button } from '../../../../../../components/marketing';
import {
  createPaymentIntent,
  payAccountPayment,
  getPaySubscription,
} from '../../../../../api/auth/auth';
import {
  bankSchema,
  cardSchema,
} from '../../../../../../utils/marketing/schemas';
import { toast } from 'react-toastify';
import { SuccessModal } from './Contribution/successModal';
import Modal from '@/components/marketing/Payment Modal/Modal';
import { useRouter, useSearchParams } from 'next/navigation';
import { accountType } from '@/data/marketing';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ApplePayPayment from './ApplePayPayment';
import CashAppPayment from './CashAppPayment';
import Input from '@/components/ui/input';
import VisaIcon from '@/icons/cards/visa';
import MasterCardIcon from '@/icons/cards/master-card';
import AmexIcon from '@/icons/cards/amex';
import Discover from '@/icons/cards/discover';

// Countries where Stripe is NOT supported — only PayPal
const STRIPE_UNSUPPORTED_COUNTRIES = ['TZ', 'ZM', 'BW', 'GH'];
const US_COUNTRY_IDENTIFIERS = new Set(['US', 'USA', 'UNITED STATES', 'UNITED STATES OF AMERICA']);

function normalizeCountry(value) {
  return (value || '').toString().trim().toUpperCase();
}

function isUSCountry(value) {
  if (!value) return false; // 🔥 important
  return US_COUNTRY_IDENTIFIERS.has(
    value.toString().trim().toUpperCase()
  );
}

function getUserCountry() {
  if (typeof document === 'undefined') return 'US'; // 🔥 Default to US on server

  const match = document.cookie.match(/(?:^|;\s*)user_country=([^;]*)/);

  if (match && match[1]) {
    const detected = normalizeCountry(decodeURIComponent(match[1]));
    return detected || 'US'; // 🔥 Fallback to US if empty after normalization
  }
  return 'US'; // 🔥 Default to US if cookie not found
}

const STRIPE_PUBLIC_KEY = (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '').trim();
const IS_STAGING_API = (process.env.NEXT_PUBLIC_APP_BASE_URL || '').includes('staging-api');
const IS_STRIPE_KEY_SHAPED = /^pk_(test|live)_[A-Za-z0-9]+$/.test(STRIPE_PUBLIC_KEY);
const IS_STRIPE_KEY_ENV_COMPATIBLE = !(IS_STAGING_API && STRIPE_PUBLIC_KEY.startsWith('pk_live_'));
const IS_VALID_STRIPE_PUBLIC_KEY = IS_STRIPE_KEY_SHAPED && IS_STRIPE_KEY_ENV_COMPATIBLE;

const stripePromise = IS_VALID_STRIPE_PUBLIC_KEY ? loadStripe(STRIPE_PUBLIC_KEY) : null;


export const PaymentMethod = ({ billing, noTrial = false, billings = [], selectedBilling = '', stripeEnabled = true }) => {
  const stripe = useStripe();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState();
  const [cardLoader, setCardLoader] = useState(false);
  const [paypalLoader, setPaypalLoader] = useState(false);
  const elements = useElements();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const resolveUserId = (userData) => {
    return (
      userData?.user?.Id ||
      userData?.Id ||
      userData?.UserId ||
      userData?.user?.UserId ||
      userId ||
      ''
    );
  };

  const resolveBillingPlanId = (userData) => {
    const idFromStorage =
      Number(userData?.BillingPlanId) ||
      Number(userData?.UserSubscriptionPlanId) ||
      Number(userData?.user?.BillingPlanId) ||
      Number(userData?.user?.UserSubscriptionPlanId) ||
      0;

    if (idFromStorage > 0) {
      return idFromStorage;
    }

    const selectedBillingPlan =
      billings?.find((plan) => plan?.Name === selectedBilling) ||
      billings?.find((plan) => plan?.Name?.toLowerCase() === 'monthly') ||
      billings?.[0];

    return Number(selectedBillingPlan?.Id) || 0;
  };

  const syncResolvedPlanToStorage = (userData, resolvedPlanId) => {
    if (!resolvedPlanId || typeof window === 'undefined') return userData;

    const updatedUserData = {
      ...userData,
      BillingPlanId: resolvedPlanId,
      UserSubscriptionPlanId: Number(userData?.UserSubscriptionPlanId) || resolvedPlanId,
      user: {
        ...(userData?.user || {}),
        BillingPlanId: Number(userData?.user?.BillingPlanId) || resolvedPlanId,
        UserSubscriptionPlanId:
          Number(userData?.user?.UserSubscriptionPlanId) ||
          Number(userData?.user?.BillingPlanId) ||
          resolvedPlanId,
      },
    };

    localStorage.setItem('registerUser', JSON.stringify(updatedUserData));
    window.dispatchEvent(new Event('registerUserUpdated'));

    return updatedUserData;
  };


  // track stripe element completion and CTA visibility
  const [cardComplete, setCardComplete] = useState({ number: false, expiry: false, cvc: false });
  const [showCTA, setShowCTA] = useState(false);

  const [userCountry, setUserCountry] = useState('US'); // 🔥 Default to US
  const isStripeSupported = !STRIPE_UNSUPPORTED_COUNTRIES.includes(userCountry);
  const canUseStripe = stripeEnabled && isStripeSupported && IS_VALID_STRIPE_PUBLIC_KEY;
  const showZipCodeField = isUSCountry(userCountry); // 🔥 Simplified - userCountry always has value

  useEffect(() => {
    const country = getUserCountry();
    if (country) {
      setUserCountry(country);
    }
  }, []);

  const {
    register,
    handleSubmit: handleCardSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(cardSchema),
    context: { userCountry }, // 🔥 Form validation respects current country
  }); // 🔥 Recreates when userCountry changes for dynamic validation

  const nameOnCard = watch('nameOnCard');

  useEffect(() => {
    // Show CTA as soon as any card field or name has input (not waiting for full completion)
    const anyEntered = !!nameOnCard || cardComplete.number || cardComplete.expiry || cardComplete.cvc;
    setShowCTA(!!anyEntered);
  }, [nameOnCard, cardComplete]);

  // const { register: bankRegister, handleSubmit: handleBankSubmit, formState: { errors: bankErrors },
  // } = useForm({
  //   resolver: yupResolver(bankSchema),
  // });

  const cardSubmit = async (data) => {
    try {
      setCardLoader(true);
      let userData = JSON.parse(localStorage.getItem('registerUser') || '{}');
      const resolvedUserId = resolveUserId(userData);
      const resolvedPlanId = resolveBillingPlanId(userData);

      if (resolvedPlanId > 0) {
        userData = syncResolvedPlanToStorage(userData, resolvedPlanId);
      }

      // 🛡️ ENHANCED VALIDATION: Check for valid BillingPlanId
      if (!resolvedPlanId || resolvedPlanId === 0) {
        console.error('❌ No valid BillingPlanId found in localStorage during card payment:', {
          BillingPlanId: userData?.BillingPlanId,
          UserSubscriptionPlanId: userData?.UserSubscriptionPlanId,
          SelectedBilling: selectedBilling,
          AvailableBillingIds: billings?.map((b) => b?.Id),
        });

        toast.error('Billing plan is still loading. Please wait a moment and try again.', {
          containerId: 'paymentPage',
          autoClose: 4000
        });

        setCardLoader(false);
        return;
      }

      if (!IS_VALID_STRIPE_PUBLIC_KEY) {
        toast.error('Card payment is temporarily unavailable. Please use PayPal or contact support.', {
          containerId: 'paymentPage',
          autoClose: 4000
        });
        setCardLoader(false);
        return;
      }



      if (!stripe || !elements) {
        toast.error('Card payment is not ready. Please refresh the page and try again.', {
          containerId: 'paymentPage',
          autoClose: 4000
        });
        setCardLoader(false);
        return;
      }
      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!resolvedUserId) {
        toast.error('User session is missing. Please sign up again and retry payment.', {
          containerId: 'paymentPage',
        });
        setCardLoader(false);
        return;
      }

      const paymentMethodReq = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: data.nameOnCard,
        },
      });

      if (paymentMethodReq.error) {
        const stripeMessage = paymentMethodReq.error?.message || 'Payment Failed!';
        toast.error(stripeMessage, { containerId: 'paymentPage' });
        console.error('Stripe createPaymentMethod error:', paymentMethodReq.error);
        setCardLoader(false);
      } else {
        let verifyPayment;
        try {
          verifyPayment = await createPaymentIntent(
            resolvedUserId,
            `${resolvedPlanId}`,
            paymentMethodReq.paymentMethod?.id,
            'stripe',
            userCountry,
            !noTrial
          );
        } catch (apiError) {
          console.error('Stripe createPaymentIntent failed:', {
            status: apiError?.response?.status,
            message: apiError?.response?.data?.Message || apiError?.message,
            response: apiError?.response?.data,
            requestPayload: {
              UserId: resolvedUserId,
              PlanId: `${resolvedPlanId}`,
              PaymentMethodType: 'stripe',
              CountryCode: userCountry,
              applyTrial: true,
            },
          });

          toast.error(
            apiError?.response?.data?.Message ||
            'Payment initialization failed. Please try again or contact support.',
            { containerId: 'paymentPage' }
          );
          setCardLoader(false);
          return;
        }

        if (verifyPayment.status === 200) {
          // Extract auth credentials from localStorage (Profile.js already stored it with password)
          const existingSignupAuth = JSON.parse(localStorage.getItem('signupAuthData') || '{}');
          
          const authData = {
            Email: existingSignupAuth?.Email || userData?.Email || userData?.email || userData?.user?.Email || '',
            Password: existingSignupAuth?.Password || userData?.Password || userData?.password || '',
            SignedUpWith: existingSignupAuth?.SignedUpWith || userData?.SignedUpWith || 'manual',
            Token: existingSignupAuth?.Token || userData?.Token || '',
          };

          // Validate auth data before storing
          if (!authData.Email) {
            console.error('❌ [PaymentMethod] ERROR: Email is missing in auth data');
          }

          // Store auth data for thank-you page sign-in (preserve password from Profile.js)
          localStorage.setItem('signupAuthData', JSON.stringify(authData));

          setCardLoader(false);
          setTimeout(() => router.push('/signup-thank-you'), 1000);
        } else {
          console.error('❌ [PaymentMethod] verifyPayment status is not 200:', verifyPayment.status);
          toast.error(
            verifyPayment?.data?.Message || 'Payment verification failed. Please try again or contact support.',
            { containerId: 'paymentPage', autoClose: 4000 }
          );
          setCardLoader(false);
          return; // ✅ CRITICAL: Prevent any further execution
        }
      }
    } catch (error) {
      const fallbackMessage =
        error?.response?.data?.Message ||
        error?.response?.data?.message ||
        error?.message ||
        'Payment Failed!';

      toast.error(fallbackMessage);
      console.error('Card payment error:', error);
      setCardLoader(false);
    }
  };


  const handlePayPalClick = async () => {
    // Track PayPal click in GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'paypal_click',
        event_category: 'payment',
        event_label: 'PayPal Button Click',
        timestamp: new Date().toISOString(),
      });
    }

    // Open popup immediately to avoid blocker
    const popup = window.open('', 'PayPalCheckout', 'resizable=yes,scrollbars=yes,toolbar=yes,width=500,height=600');

    try {
      setPaypalLoader(true);
      let userData = JSON.parse(localStorage.getItem('registerUser') || '{}');
      const resolvedPlanId = resolveBillingPlanId(userData);
      if (resolvedPlanId > 0) {
        userData = syncResolvedPlanToStorage(userData, resolvedPlanId);
      }
      let resolvedUserId = resolveUserId(userData);

      // 🛡️ ENHANCED VALIDATION: Check for valid BillingPlanId
      if (!resolvedPlanId || resolvedPlanId === 0 || !userData?.user?.SubscriptionPlanType || userData?.user?.SubscriptionPlanType === 'Not_Selected') {
        console.error('❌ Validation Failed - Missing or Invalid Plan ID:', {
          BillingPlanId: userData?.BillingPlanId,
          ResolvedBillingPlanId: resolvedPlanId,
          SubscriptionPlanType: userData?.user?.SubscriptionPlanType,
        });

        // 🔧 LAST RESORT: Try to trigger the sync event and wait briefly
        window.dispatchEvent(new Event('registerUserUpdated'));

        // Wait 500ms for sync to complete
        await new Promise(resolve => setTimeout(resolve, 500));

        // Re-read localStorage
        userData = JSON.parse(localStorage.getItem('registerUser') || '{}');
        resolvedUserId = resolveUserId(userData);

        // Check again
        if (!resolvedPlanId || resolvedPlanId === 0) {
          console.error('❌ Emergency sync failed - still no valid BillingPlanId');
          toast.error('Billing plan not configured. Please go back and select a plan.', {
            containerId: 'paymentPage',
            autoClose: 4000
          });

          if (popup) popup.close();
          setPaypalLoader(false);
          return;
        }
      }

      if (!resolvedUserId) {
        toast.error('User session is missing. Please sign up again and retry payment.', {
          containerId: 'paymentPage'
        });
        if (popup) popup.close();
        setPaypalLoader(false);
        return;
      }

      // Create PayPal payment intent with empty PaymentMethod and type 'paypal'
      let verifyPayment;
      try {
        verifyPayment = await createPaymentIntent(
          resolvedUserId,
          resolvedPlanId,
          '',
          'paypal',
          userCountry,
          !noTrial
        );
      } catch (error) {
        // Handle axios error specifically
        console.error('PayPal Payment Error (Catch):', error);

        const responseData = error?.response?.data;
        const statusMessage = responseData?.Message || '';
        const isAlreadyPending = statusMessage.toLowerCase().includes('pending') || statusMessage.toLowerCase().includes('already pending');
        const transactionId = responseData?.Result?.PayPalTransactionId;

        if (error?.response?.status === 400 && isAlreadyPending && transactionId) {
          if (popup) {
            popup.location.href = `https://www.paypal.com/checkoutnow?token=${transactionId}`;
          }
          setPaypalLoader(false);
          return;
        }

        throw error; // Re-throw if it's not a recoverable pending error
      }

      const result = verifyPayment?.data?.Result;
      const approvalUrl = result?.SubscriptionApprovalUrl || result?.PaymentApprovalUrl || result?.ApprovalUrl;
      const transactionId = result?.PayPalTransactionId;

      if (verifyPayment?.status === 200) {
        if (approvalUrl) {
          if (popup) {
            popup.location.href = approvalUrl;
          } else {
            window.location.href = approvalUrl;
          }
          return;
        }

        if (transactionId) {
          if (popup) {
            popup.location.href = `https://www.paypal.com/checkoutnow?token=${transactionId}`;
          }
          return;
        }
      }

      // If we got here, something failed
      console.error('DEBUG: PayPal Subscription Failed - No Approval URL');
      toast.error('Failed to initiate PayPal checkout. Please try again or use card payment.', {
        containerId: 'paymentPage',
        autoClose: 4000
      });
    } catch (error) {
      console.error('PayPal Payment Final Error:', error);

      const paypalErrorMsg = error?.response?.data?.Message || error?.message || 'PayPal payment failed. Please try again or use card payment.';
      toast.error(paypalErrorMsg, { containerId: 'paymentPage', autoClose: 4000 });
    } finally {
      setPaypalLoader(false);
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();

    const registerUser = JSON.parse(localStorage.getItem('registerUser') || '{}');
    const resolvedPlanId = resolveBillingPlanId(registerUser);

    if (!resolvedPlanId && !billings?.length) {
      toast.info('Loading subscription plan details. Please try again in a moment.', {
        containerId: 'paymentPage',
        autoClose: 2500,
      });
      return;
    }

    // If user hasn't explicitly selected a payment method but entered card details, default to card
    if (!paymentMethod) {
      const anyCardEntered = !!nameOnCard || cardComplete.number || cardComplete.expiry || cardComplete.cvc;
      if (anyCardEntered) {
        setPaymentMethod('card');
        toast.info('Processing payment...');
        handleCardSubmit(cardSubmit)();
        return;
      }

      // No method selected and no card details entered — prompt user
      toast.info('Please select a payment method or enter card details to proceed');
      return;
    }
    toast.info('Processing payment...');
    handleCardSubmit(cardSubmit)();

  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const registerData = JSON.parse(localStorage.getItem('registerUser'));
        if (token?.id) {
          const res = await getPaySubscription(
            registerData?.paymentIntent?.CustomerId,
            registerData?.BillingPlanId?.toString(),
            token?.id,
            userCountry
          );

          if (res.status === 200) {
            toast.success(res.data?.Message || 'Registration done!');
          }
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.Message ||
          'There was a server error while registering (contact support)'
        );
      }
    })();
  }, [token, userCountry]);


  // Add effect to listen for localStorage changes (when plan/billing changes in PlanCard)
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window.localStorage !== 'undefined') {
        const registerUser = JSON.parse(localStorage.getItem('registerUser') || '{}');
        if (registerUser?.paymentIntent) {
          // Update internal state if needed, or just force re-read during payment
          // setFrequency removed


          if (registerUser?.user?.SubscriptionPlanType) {
            // We don't have setSelectedPlan in this component scope (it was in SignUp), 
            // but we can rely on localStorage reading in handlePayPalClick
          }
        }
      }
    };

    // Listen for custom storage events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('registerUserUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('registerUserUpdated', handleStorageChange);
    };
  }, []);

  return (
    <>
      <div className="w-full  min-h-[40rem] flex flex-col justify-between" >
        <form onSubmit={handlePayment} className=" space-y-4">
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-900">Payment methods</p>
          </div>

          <div className="flex flex-wrap items-center justify-between">
          </div>

          {canUseStripe && (
            <div className="space-y-4">
              <Input
                {...register('nameOnCard')}
                placeholder="Name on Card"
                error={errors.nameOnCard?.message}
                className="text-sm px-4 py-4 h-11 placeholder:text-black-100 placeholder:!font-normal placeholder:!text-[14px] border-[#E4E9F5] !leading-5"
              />

              <div className="stripe-input placeholder:text-black-100 placeholder:!font-medium border-[#E4E9F5] border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9 font-medium px-4 py-3 rounded-md w-full relative pr-14">
                <div className="flex-1">
                  <CardNumberElement
                    onChange={(e) => setCardComplete((p) => ({ ...p, number: !!e?.complete || !!(!e?.empty) }))}
                    options={{
                      disableLink: true,
                      showIcon: false,
                      placeholder: 'Card Number',
                      style: {
                        base: {
                          '::placeholder': {
                            color: 'rgb(178 178 178)',
                            fontSize: '14px',
                            fontWeight: 500,
                          },
                          height: '48px',
                        },
                      },
                    }}
                  />
                </div>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <VisaIcon className="w-5 h-3 md:w-9 md:h-6" />
                  <MasterCardIcon className="w-5 h-3 md:w-9 md:h-6" />
                  <AmexIcon className="w-5 h-3 md:w-8 md:h-6" />
                  <Discover className="w-5 h-3 md:w-9 md:h-6" />
                  <Popover className="relative">
                    <PopoverButton className="text-[#6E6E6E] font-medium ml-1">+more</PopoverButton>
                    <PopoverPanel anchor="bottom center" className="flex flex-col mt-5">
                      <Image src="/icons/methodGp.svg" className="" width={246} height={84} alt="card group" />
                    </PopoverPanel>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center w-full gap-[18px]">
                <div className="stripe-input placeholder:text-black-100 placeholder:!font-medium border-[#E4E9F5] border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9 font-medium px-4 py-3 rounded-md w-full">
                  <CardExpiryElement
                    onChange={(e) => setCardComplete((p) => ({ ...p, expiry: !!e?.complete || !!(!e?.empty) }))}
                    options={{
                      placeholder: 'Expiration Date',
                      style: {
                        base: {
                          '::placeholder': {
                            color: 'rgb(178 178 178)',
                            fontSize: '14px',
                            fontWeight: 500,
                          },
                        },
                        height: '48px',
                      },
                    }}
                  />
                </div>
                <div className="stripe-input flex items-center justify-between placeholder:text-black-100 placeholder:!font-medium border-[#E4E9F5] border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9 font-medium px-4 py-2.5 rounded-md w-full">
                  <div className="flex-1">
                    <CardCvcElement
                      onChange={(e) => setCardComplete((p) => ({ ...p, cvc: !!e?.complete || !!(!e?.empty) }))}
                      options={{
                        placeholder: 'Security Code',
                        style: {
                          base: {
                            '::placeholder': {
                              color: 'rgb(178 178 178)',
                              fontSize: '14px',
                              fontWeight: 500,
                            },
                            height: '48px',
                          },
                        },
                      }}
                    />
                  </div>

                  <svg className=" shrink-0" width="24" height="23" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.875 2H1.125C0.893014 2.00026 0.670604 2.09253 0.506565 2.25656C0.342526 2.4206 0.250256 2.64301 0.25 2.875V11.625C0.250256 11.857 0.342526 12.0794 0.506565 12.2434C0.670604 12.4075 0.893014 12.4997 1.125 12.5H7.87937C8.20144 12.963 8.6307 13.3412 9.13056 13.6024C9.63041 13.8636 10.186 14 10.75 14C11.314 14 11.8696 13.8636 12.3694 13.6024C12.8693 13.3412 13.2986 12.963 13.6206 12.5H14.875C15.107 12.4997 15.3294 12.4075 15.4934 12.2434C15.6575 12.0794 15.7497 11.857 15.75 11.625V2.875C15.7497 2.64301 15.6575 2.4206 15.4934 2.25656C15.3294 2.09253 15.107 2.00026 14.875 2ZM10.75 13.5C10.1567 13.5 9.57664 13.3241 9.08329 12.9944C8.58994 12.6648 8.20542 12.1962 7.97836 11.6481C7.7513 11.0999 7.69189 10.4967 7.80764 9.91473C7.9234 9.33279 8.20912 8.79824 8.62868 8.37868C9.04824 7.95912 9.58279 7.6734 10.1647 7.55764C10.7467 7.44189 11.3499 7.5013 11.8981 7.72836C12.4462 7.95542 12.9148 8.33994 13.2444 8.83329C13.5741 9.32664 13.75 9.90666 13.75 10.5C13.749 11.2954 13.4327 12.0579 12.8703 12.6203C12.3079 13.1827 11.5454 13.499 10.75 13.5ZM15.25 11.625C15.2499 11.7244 15.2104 11.8198 15.1401 11.8901C15.0698 11.9604 14.9744 11.9999 14.875 12H13.9119C14.1651 11.4665 14.2792 10.8776 14.2436 10.2882C14.208 9.69872 14.0239 9.12785 13.7083 8.62872C13.3927 8.12959 12.956 7.71842 12.4387 7.43349C11.9215 7.14857 11.3405 6.99915 10.75 6.99915C10.1595 6.99915 9.57854 7.14857 9.06129 7.43349C8.54404 7.71842 8.10729 8.12959 7.79171 8.62872C7.47612 9.12785 7.29196 9.69872 7.25636 10.2882C7.22077 10.8776 7.3349 11.4665 7.58813 12H1.125C1.02557 11.9999 0.930235 11.9604 0.859926 11.8901C0.789618 11.8198 0.750083 11.7244 0.75 11.625V6.25H15.25V11.625ZM15.25 5.75H0.75V4.25H15.25V5.75ZM15.25 3.75H0.75V2.875C0.750083 2.77557 0.789618 2.68023 0.859926 2.60993C0.930235 2.53962 1.02557 2.50008 1.125 2.5H14.875C14.9744 2.50008 15.0698 2.53962 15.1401 2.60993C15.2104 2.68023 15.2499 2.77557 15.25 2.875V3.75Z" fill="#475467" />
                    <path d="M6 7.75H1.5C1.4337 7.75 1.37011 7.77634 1.32322 7.82322C1.27634 7.87011 1.25 7.9337 1.25 8V9.75C1.25 9.8163 1.27634 9.87989 1.32322 9.92678C1.37011 9.97366 1.4337 10 1.5 10H6C6.0663 10 6.12989 9.97366 6.17678 9.92678C6.22366 9.87989 6.25 9.8163 6.25 9.75V8C6.25 7.9337 6.22366 7.87011 6.17678 7.82322C6.12989 7.77634 6.0663 7.75 6 7.75ZM5.75 9.5H1.75V8.25H5.75V9.5ZM9.5 10C9.5663 10 9.62989 9.97366 9.67678 9.92678C9.72366 9.87989 9.75 9.8163 9.75 9.75C9.75 9.6837 9.72366 9.62011 9.67678 9.57322C9.62989 9.52634 9.5663 9.5 9.5 9.5H8.75C8.6837 9.5 8.62011 9.52634 8.57322 9.57322C8.52634 9.62011 8.5 9.6837 8.5 9.75V11.5C8.5 11.5663 8.52634 11.6299 8.57322 11.6768C8.62011 11.7237 8.6837 11.75 8.75 11.75H9.5C9.5663 11.75 9.62989 11.7237 9.67678 11.6768C9.72366 11.6299 9.75 11.5663 9.75 11.5C9.75 11.4337 9.72366 11.3701 9.67678 11.3232C9.62989 11.2763 9.5663 11.25 9.5 11.25H9V10H9.5ZM11.3188 9.50963C11.255 9.49141 11.1866 9.49926 11.1287 9.53146C11.0707 9.56366 11.0279 9.61756 11.0097 9.68131L10.75 10.59L10.4904 9.68125C10.4813 9.64968 10.4662 9.6202 10.4458 9.5945C10.4253 9.56879 10.4001 9.54735 10.3714 9.53142C10.3427 9.51548 10.3111 9.50535 10.2785 9.50161C10.2459 9.49787 10.2128 9.5006 10.1812 9.50963C10.1497 9.51865 10.1202 9.53381 10.0945 9.55423C10.0688 9.57465 10.0474 9.59994 10.0314 9.62864C10.0155 9.65735 10.0054 9.68891 10.0016 9.72153C9.99787 9.75415 10.0006 9.78718 10.0096 9.81875L10.5096 11.5688C10.5246 11.621 10.5561 11.6669 10.5995 11.6996C10.6428 11.7324 10.6957 11.75 10.75 11.75C10.8043 11.75 10.8572 11.7324 10.9005 11.6996C10.9439 11.6669 10.9754 11.621 10.9904 11.5688L11.4904 9.81875C11.4994 9.78718 11.5021 9.75415 11.4984 9.72153C11.4947 9.68891 11.4845 9.65735 11.4686 9.62864C11.4527 9.59993 11.4312 9.57465 11.4055 9.55423C11.3798 9.53381 11.3503 9.51865 11.3188 9.50963ZM13.0688 9.50963C13.005 9.49141 12.9366 9.49926 12.8787 9.53146C12.8207 9.56366 12.7779 9.61756 12.7597 9.68131L12.5 10.59L12.2404 9.68125C12.2313 9.64968 12.2162 9.6202 12.1958 9.5945C12.1753 9.56879 12.1501 9.54735 12.1214 9.53142C12.0927 9.51548 12.0611 9.50535 12.0285 9.50161C11.9959 9.49787 11.9628 9.5006 11.9312 9.50963C11.8997 9.51865 11.8702 9.53381 11.8445 9.55423C11.8188 9.57465 11.7974 9.59994 11.7814 9.62864C11.7655 9.65735 11.7554 9.68891 11.7516 9.72153C11.7479 9.75415 11.7506 9.78718 11.7596 9.81875L12.2596 11.5688C12.2746 11.621 12.3061 11.6669 12.3495 11.6996C12.3928 11.7324 12.4457 11.75 12.5 11.75C12.5543 11.75 12.6072 11.7324 12.6505 11.6996C12.6939 11.6669 12.7254 11.621 12.7404 11.5688L13.2404 9.81875C13.2494 9.78718 13.2521 9.75415 13.2484 9.72153C13.2447 9.68891 13.2345 9.65735 13.2186 9.62864C13.2027 9.59993 13.1812 9.57465 13.1555 9.55423C13.1298 9.53381 13.1003 9.51865 13.0688 9.50963ZM3.75 10.25H1.5C1.4337 10.25 1.37011 10.2763 1.32322 10.3232C1.27634 10.3701 1.25 10.4337 1.25 10.5C1.25 10.5663 1.27634 10.6299 1.32322 10.6768C1.37011 10.7237 1.4337 10.75 1.5 10.75H3.75C3.8163 10.75 3.87989 10.7237 3.92678 10.6768C3.97366 10.6299 4 10.5663 4 10.5C4 10.4337 3.97366 10.3701 3.92678 10.3232C3.87989 10.2763 3.8163 10.25 3.75 10.25ZM2.25 11H1.5C1.4337 11 1.37011 11.0263 1.32322 11.0732C1.27634 11.1201 1.25 11.1837 1.25 11.25C1.25 11.3163 1.27634 11.3799 1.32322 11.4268C1.37011 11.4737 1.4337 11.5 1.5 11.5H2.25C2.3163 11.5 2.37989 11.4737 2.42678 11.4268C2.47366 11.3799 2.5 11.3163 2.5 11.25C2.5 11.1837 2.47366 11.1201 2.42678 11.0732C2.37989 11.0263 2.3163 11 2.25 11Z" fill="#475467" />
                  </svg>
                </div>

                {/* {showZipCodeField && ( */}
                  <div className=" flex items-center justify-between placeholder:text-black-100  border-[#E4E9F5] border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9   rounded-md w-full">
                    <Input
                      {...register('billingZipCode')}
                      placeholder="ZIP Code"
                      error={errors.billingZipCode?.message}
                      className="focus:border-omblue-500 text-[10px] placeholder:!font-normal placeholder:!text-[13px] border-none "
                    />
                  </div>

                {/* )} */}

              </div>
            </div>
          )}



          {!canUseStripe && (
            <div className="rounded-md border border-[#E4E9F5] bg-[#F8FAFC] px-4 py-3 text-sm text-[#334155]">
              Card payment is temporarily unavailable in this environment. Please use PayPal or update Stripe publishable key configuration.
            </div>
          )}

          {canUseStripe && (
            <div className="space-y-4 ">
              <Button
                className="w-full rounded-full bg-nav-blue py-2 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePayment}
                disabled={cardLoader || !showCTA}
                type="button"
                data-gtm="payment_paid_stripe"
              >
                {cardLoader ? (
                  'Processing...'
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.6667 6.66927H13.3333C13.5101 6.66927 13.6797 6.73951 13.8047 6.86453C13.9298 6.98956 14 7.15913 14 7.33594V14.0026C14 14.1794 13.9298 14.349 13.8047 14.474C13.6797 14.599 13.5101 14.6693 13.3333 14.6693H2.66667C2.48986 14.6693 2.32029 14.599 2.19526 14.474C2.07024 14.349 2 14.1794 2 14.0026V7.33594C2 7.15913 2.07024 6.98956 2.19526 6.86453C2.32029 6.73951 2.48986 6.66927 2.66667 6.66927H3.33333V6.0026C3.33333 5.38977 3.45404 4.78293 3.68856 4.21675C3.92308 3.65056 4.26683 3.13611 4.70017 2.70277C5.13351 2.26943 5.64796 1.92569 6.21414 1.69117C6.78033 1.45664 7.38716 1.33594 8 1.33594C8.61284 1.33594 9.21967 1.45664 9.78586 1.69117C10.352 1.92569 10.8665 2.26943 11.2998 2.70277C11.7332 3.13611 12.0769 3.65056 12.3114 4.21675C12.546 4.78293 12.6667 5.38977 12.6667 6.0026V6.66927ZM3.33333 8.0026V13.3359H12.6667V8.0026H3.33333ZM7.33333 9.33594H8.66667V12.0026H7.33333V9.33594ZM11.3333 6.66927V6.0026C11.3333 5.11855 10.9821 4.2707 10.357 3.64558C9.7319 3.02046 8.88406 2.66927 8 2.66927C7.11595 2.66927 6.2681 3.02046 5.64298 3.64558C5.01786 4.2707 4.66667 5.11855 4.66667 6.0026V6.66927H11.3333Z" fill="white" />
                    </svg>
                    {noTrial ? 'Join Orisuun' : 'Start Your Free Trial'}
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="flex flex-col w-full gap-4 pt-10 justify-center items-center">
            <div className="w-full ">
              <button
                onClick={handlePayPalClick}
                disabled={paypalLoader}
                type="button"
                data-gtm-event="paypal-click"
                className="w-full h-[48px] border border-[#E4E9F5] rounded-md text-sm font-medium text-gray-700 hover:bg-[#E4E9F5] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paypalLoader ? 'Processing...' : (
                  <>
                    <Image src="/icons/paypal_icon.svg" alt="PayPal Logo" width={80} height={24} />
                  </>
                )}
              </button>
            </div>
            <div className="w-full">
              {/* <CashAppPayment
              amount={billing}
            /> */}
            </div>
            {canUseStripe && (
              <div className=" w-full">
                <Elements stripe={stripePromise}>
                  <ApplePayPayment
                    amount={billing}
                  />
                </Elements>
              </div>
            )}
          </div>
        </form>

        <div className="w-full my-6">
          <p className="text-sm text-gray-700 mb-3">Secure payments, protected by your card provider (3D Secure enabled)</p>
          <div className="flex items-center gap-4 ">
            <Image src="/auth/secure.svg" alt="payment providers" width={360} height={48} className='h-8 object-contain w-auto' />
            <Image src="/auth/sourcecode.svg" alt="payment providers" width={360} height={48} className='h-8 object-contain w-auto' />
            <Image src="/auth/discover.svg" alt="payment providers" width={360} height={48} className='h-8 object-contain w-auto' />
            <Image src="/auth/safekey.svg" alt="payment providers" width={360} height={48} className='h-8 object-contain w-auto' />
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={handleCloseModal} className={`z-30`}>
        <SuccessModal onClose={handleCloseModal} />;
      </Modal>
    </>
  );
};
