'use client';

import Image from 'next/image';
import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Profile } from './Profile';
import { planType, billingFrequency } from '../../../../../../data/marketing/signupData';
import useOutsideClick from '@/hooks/useOutsideClick';
import { getSubscriptionPlanAPI } from '../../../../../api/auth/auth';
import { SessionProvider } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

export default function SignUp() {
  const { selectedProfileType } = useSelector((state) => state.auth);
  const searchParams = useSearchParams();
  const noTrial = searchParams?.has('weekly-funding');

  // Plan & Billing state
  const queryPlanType = searchParams?.get('planType');
  const queryBillingFrequency = searchParams?.get('billingfrequency');

  const [selectedPlan, setSelectedPlan] = useState(
    queryPlanType == 'Premium' ? planType[0] : planType[1]
  );

  const [selectedBilling, setSelectedBilling] = useState(
    queryBillingFrequency ? queryBillingFrequency : billingFrequency[0]?.type
  );
  const [availablePlanTypes, setAvailablePlanTypes] = useState(planType);
  const [billings, setBillings] = useState([]);
  const [planDropdownOpen, setPlanDropdownOpen] = useState(false);
  const planDropdownRef = useRef(null);
  useOutsideClick(planDropdownRef, () => setPlanDropdownOpen(false));

  // Restrict available plans for certain profile types
  useEffect(() => {
    if (selectedProfileType == 4) {
      setAvailablePlanTypes([planType[0]]);
      if (selectedPlan === planType[1]) setSelectedPlan(planType[0]);
    } else {
      setAvailablePlanTypes(planType);
    }
  }, [selectedProfileType, selectedPlan, queryBillingFrequency, selectedBilling]);

  // Fetch subscription plan options whenever profile or plan changes
  useEffect(() => {
    (async () => {
      try {
        if (selectedProfileType && selectedPlan) {
          const getCookie = (name) => {
            if (typeof document === 'undefined') return null;
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
          };
          const userCountry = getCookie('user_country') || 'US';
          const res = await getSubscriptionPlanAPI(selectedProfileType, selectedPlan, userCountry);

          if (res?.status === 200) {
            const result = res?.data?.Result || [];
            setBillings(result);

            // Auto-select Monthly plan if not explicitly set by query param
            if (!queryBillingFrequency && result.length) {
              const monthlyPlan =
                result.find(p => p?.Name?.toLowerCase() === 'monthly') || result[0];

              setSelectedBilling(monthlyPlan.Name);

              // Sync to localStorage after auto-selecting Monthly
              if (typeof window !== 'undefined') {
                try {
                  const registerUser = JSON.parse(localStorage.getItem('registerUser') || '{}');

                  if (registerUser && monthlyPlan) {
                    const paypalPlanIdFromBilling = monthlyPlan?.PaypalPlanId;
                    const originalPaypalId = registerUser?.PaypalPlanId || registerUser?.PalpalPlanId;
                    const finalPaypalPlanId = paypalPlanIdFromBilling || originalPaypalId;

                    const parsePlanPrice = (priceValue) => {
                      if (!priceValue) return 0;
                      const priceStr = priceValue.toString().replace(/,/g, '');
                      const match = priceStr.match(/\$?\s*([0-9]+(?:\.[0-9]+)?)/);
                      if (match) return parseFloat(match[1]);
                      const num = parseFloat(priceValue);
                      return isNaN(num) ? 0 : num;
                    };

                    const planAmount = parsePlanPrice(monthlyPlan.Price);

                    const updatedRegisterUser = {
                      ...registerUser,
                      user: {
                        ...registerUser.user,
                        SubscriptionPlanType: selectedPlan || 'Premium',
                        BillingFrequency: monthlyPlan.Name || 'Monthly',
                      },
                      BillingFrequency: monthlyPlan.Name || 'Monthly',
                      UserSubscriptionPlanId: Number(monthlyPlan.Id),
                      BillingPlanId: Number(monthlyPlan.Id),
                      PaypalPlanId: finalPaypalPlanId || null,
                      PalpalPlanId: finalPaypalPlanId || null,
                      paymentIntent: {
                        ...registerUser.paymentIntent,
                        Amount: planAmount,
                      },
                      Currency: monthlyPlan.Currency || 'USD',
                      IsStripeSupported: typeof monthlyPlan.IsStripeSupported !== 'undefined' ? monthlyPlan.IsStripeSupported : true,
                    };

                    localStorage.setItem('registerUser', JSON.stringify(updatedRegisterUser));
                    window.dispatchEvent(new Event('registerUserUpdated'));
                  }
                } catch (error) {
                  console.error('Error auto-syncing Monthly plan to localStorage:', error);
                }
              }
            }
          }
        }
      } catch (error) {
        const status = error?.response?.status;
        const apiMessage = error?.response?.data?.Message || error?.message;

        if (status === 401) {
          try {
            const registerUser = JSON.parse(localStorage.getItem('registerUser') || '{}');
            const localPlanId =
              Number(registerUser?.BillingPlanId) ||
              Number(registerUser?.UserSubscriptionPlanId) ||
              0;

            if (localPlanId > 0) {
              const fallbackBilling = [{
                Id: localPlanId,
                Name: registerUser?.BillingFrequency || selectedBilling || 'Monthly',
                Price: registerUser?.paymentIntent?.Amount ? `$${registerUser.paymentIntent.Amount}` : '$0',
                Currency: registerUser?.Currency || 'USD',
                PaypalPlanId: registerUser?.PaypalPlanId || registerUser?.PalpalPlanId || null,
              }];
              setBillings(fallbackBilling);
            }
          } catch {
            // ignore local fallback parsing errors
          }
          console.warn('Subscription plan API returned 401 during signup. Falling back to local billing data.', apiMessage);
          return;
        }

        console.error('Error fetching subscription plan:', error);
      }
    })();
  }, [selectedProfileType, selectedPlan, queryBillingFrequency, selectedBilling]);

  // Update localStorage when plan or billing frequency changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const registerUser = JSON.parse(localStorage.getItem('registerUser') || '{}');

        if (!billings?.length || !selectedBilling) {
          return;
        }

        const selectedBillingPlan =
          billings.find(b => b?.Name === selectedBilling) ||
          billings.find(b => b?.Name?.toLowerCase() === 'monthly') ||
          billings[0];

        if (!selectedBillingPlan) {
          console.error('No billing plan found');
          return;
        }

        if (registerUser) {
          const paypalPlanIdFromBilling = selectedBillingPlan?.PaypalPlanId;
          const originalPaypalId = registerUser?.PaypalPlanId || registerUser?.PalpalPlanId;
          const finalPaypalPlanId = paypalPlanIdFromBilling || originalPaypalId;

          const parsePlanPrice = (priceValue) => {
            if (!priceValue) return 0;
            const priceStr = priceValue.toString().replace(/,/g, '');
            const match = priceStr.match(/\$?\s*([0-9]+(?:\.[0-9]+)?)/);
            if (match) return parseFloat(match[1]);
            const num = parseFloat(priceValue);
            return isNaN(num) ? 0 : num;
          };

          const planAmount = parsePlanPrice(selectedBillingPlan.Price);

          const updatedRegisterUser = {
            ...registerUser,
            user: {
              ...registerUser.user,
              SubscriptionPlanType: selectedPlan || 'Premium',
              BillingFrequency: selectedBilling || selectedBillingPlan?.Name || 'Monthly',
            },
            BillingFrequency: selectedBilling || selectedBillingPlan?.Name || 'Monthly',
            UserSubscriptionPlanId: Number(selectedBillingPlan.Id) || 0,
            BillingPlanId: Number(selectedBillingPlan.Id) || 0,
            PaypalPlanId: finalPaypalPlanId || null,
            PalpalPlanId: finalPaypalPlanId || null,
            paymentIntent: {
              ...registerUser.paymentIntent,
              Amount: planAmount,
            },
            Currency: selectedBillingPlan?.Currency || 'USD',
            IsStripeSupported: typeof selectedBillingPlan?.IsStripeSupported !== 'undefined' ? selectedBillingPlan.IsStripeSupported : true,
          };

          localStorage.setItem('registerUser', JSON.stringify(updatedRegisterUser));
          window.dispatchEvent(new Event('registerUserUpdated'));
        }
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }
    }
  }, [selectedPlan, selectedBilling, billings]);

  // Order summary helpers with proper locale mapping and explicit symbols
  const formatCurrency = (n) => {
    try {
      const currencyCode = selectedBillingObj?.Currency || 'USD';
      const normalizedCurrency = (currencyCode || '').toString().toUpperCase().trim();

      // Map currency to appropriate locale for proper symbol display
      const localeMap = {
        'USD': 'en-US',
        'CAD': 'en-CA',
        'GBP': 'en-GB',
        'EUR': 'en-IE',
        'KES': 'en-KE',  // Kenya
        'NGN': 'en-NG',  // Nigeria
        'UGX': 'en-UG',  // Uganda
        'ZAR': 'en-ZA',  // South Africa
        'GHS': 'en-GH',  // Ghana
        'TZS': 'en-TZ',  // Tanzania
        'ZMW': 'en-ZM',  // Zambia
        'BWP': 'en-BW',  // Botswana
      };

      // Explicit symbol mapping for verification
      const symbolMap = {
        'USD': '$',      // US Dollar
        'CAD': '$',      // Canadian Dollar
        'GBP': '£',      // British Pound
        'EUR': '€',      // Euro
        'NGN': '₦',      // Nigerian Naira
        'GHS': '₵',      // Ghanaian Cedi
        'ZAR': 'R',      // South African Rand
        'KES': 'KSh',    // Kenyan Shilling
        'UGX': 'USh',    // Ugandan Shilling
        'TZS': 'TSh',    // Tanzanian Shilling
        'ZMW': 'ZK',     // Zambian Kwacha
        'BWP': 'P',      // Botswana Pula
      };

      const locale = localeMap[normalizedCurrency] || 'en-US';
      const expectedSymbol = symbolMap[normalizedCurrency];


      const formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: normalizedCurrency || 'USD',
        maximumFractionDigits: 2,
      }).format(n);

      // Log to verify correct symbol is being used

      return formatted;
    } catch (e) {
      console.error('❌ [SignUp formatCurrency] Error:', e, { selectedBillingObj, normalizedCurrency });

      // Fallback: Use explicit symbol map if Intl fails
      const symbolMap = {
        'USD': '$', 'CAD': '$', 'GBP': '£', 'EUR': '€',
        'NGN': '₦', 'GHS': '₵', 'ZAR': 'R',
        'KES': 'KSh', 'UGX': 'USh', 'TZS': 'TSh', 'ZMW': 'ZK', 'BWP': 'P',
      };

      const currencyCode = (selectedBillingObj?.Currency || 'USD').toString().toUpperCase().trim();
      const symbol = symbolMap[currencyCode] || selectedBillingObj?.CurrencySymbol || '$';

      return `${symbol}${(n || 0).toFixed(2)}`;
    }
  };

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const match = priceStr.toString().replace(/,/g, '').match(/\$?\s*([0-9]+(?:\.[0-9]+)?)/);
    if (match) return parseFloat(match[1]);
    const num = parseFloat(priceStr);
    return isNaN(num) ? 0 : num;
  };

  const selectedBillingObj = billings?.find((b) => b?.Name === selectedBilling) || billingFrequency.find((b) => b?.type === selectedBilling) || {};
  const billingPrice = parsePrice(selectedBillingObj?.Price || selectedBillingObj?.rate || selectedBillingObj?.Rate || selectedBillingObj?.PriceDisplay);
  const promotionText = noTrial ? '' : 'Two week FREE Trial';
  const promotionDiscount = promotionText ? billingPrice : 0;
  const estimatedTax = 0;
  const dueToday = Math.max(billingPrice - promotionDiscount + estimatedTax, 0);

  return (
    <Suspense>
      <main className="relative max-w-[110rem] mx-auto bg-white h-full min-h-screen flex md:flex-row flex-col justify-between">
        <div className="w-full xl:w-[calc(100vw-631px)] overflow-y-scroll hide-scrollbar mx-auto min-h-screen flex flex-col">
          <div className="relative md:text-[40px] pb-8 text-[24px] lg:!block border-b text-center py-10 capitalize 4xl:text-[40px] leading-10 font-medium text-blue-500">
            <h1 className='relative inline-block'>
              {"Let's create your account"}
              <span className="absolute text-[12px] -bottom-6 md:-right-6 right-[10%] font-normal text-gray-600">
                {"(Just 15 Seconds )"}
              </span>
            </h1>
          </div>

          <div className="w-full mt-10 mx-auto xs:pb-10 lg:!pb-0">
            <Suspense>
              <section className="w-full px-4 lg:!px-0 md:min-w-[540px] md:max-w-[540px] mx-auto">
                <SessionProvider>
                  <Profile
                    selectedPlan={selectedPlan}
                    selectedBilling={selectedBilling}
                    billings={billings}
                    setSelectedPlan={setSelectedPlan}
                    availablePlanTypes={availablePlanTypes}
                    setSelectedBilling={setSelectedBilling}
                  />
                </SessionProvider>
              </section>
            </Suspense>
          </div>
        </div>

        <div className="flex md:max-w-[40%] w-full min-h-screen relative right-0 top-0 object-contain justify-end object-right">
          <Image
            src="/auth/signup3.png"
            unoptimized
            objectFit="cover"
            objectPosition="top"
            layout="fill"
            alt="carousel"
            priority
          />
        </div>
      </main>

      {/* Toast Container for validation and error messages */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Suspense>
  );
}
