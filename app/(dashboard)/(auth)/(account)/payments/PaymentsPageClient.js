'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentMethod } from '@/app/(dashboard)/(auth)/(account)/signup/components/PaymentMethod';
import OrderSummary from '@/app/(dashboard)/(auth)/(account)/signup/components/OrderSummary';
import { getSubscriptionPlanAPI } from '../../../../api/auth/auth';
import { useSelector } from 'react-redux';
import useCurrentUser from '@/hooks/useCurrentUser';
import { getProfileNameFromId } from '@/data/marketing/signupData';

const STRIPE_PUBLIC_KEY = (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '').trim();
const IS_STRIPE_KEY_SHAPED = /^pk_(test|live)_[A-Za-z0-9]+$/.test(STRIPE_PUBLIC_KEY);
const CAN_INITIALIZE_STRIPE = IS_STRIPE_KEY_SHAPED;
const stripePromise = CAN_INITIALIZE_STRIPE ? loadStripe(STRIPE_PUBLIC_KEY) : null;

const resolveProfileTypeId = (userData = {}, fallbackId = 0) =>
    Number(userData?.UserProfileTypeId) ||
    Number(userData?.ProFileType) ||
    Number(userData?.ProfileType) ||
    Number(userData?.user?.UserProfileTypeId) ||
    Number(userData?.user?.ProFileType) ||
    Number(userData?.user?.ProfileType) ||
    Number(fallbackId) ||
    0;

const resolveProfileTypeName = (userData = {}, fallbackId = 0) => {
    const directName = [
        userData?.UserProfileType,
        userData?.UserProfileName,
        userData?.ProfileTypeName,
        userData?.user?.UserProfileType,
        userData?.user?.UserProfileName,
    ].find((value) => typeof value === 'string' && value.trim());

    if (directName) return directName.trim();

    const profileTypeId = resolveProfileTypeId(userData, fallbackId);

    return getProfileNameFromId(profileTypeId) || 'Member';
};

export default function PaymentsPage() {
    const { selectedProfileType } = useSelector((state) => state.auth);
    const [fallbackProfileType, setFallbackProfileType] = useState(null);
    const [billingAmount, setBillingAmount] = useState(49);
    const [billingData, setBillingData] = useState(null);
    const [selectedBilling, setSelectedBilling] = useState('Annually');
    const [registeredName, setRegisteredName] = useState('');
    const [registeredEmail, setRegisteredEmail] = useState('');
    const selectedPlan = 'Premium';
    const [billings, setBillings] = useState([]);
    const { user: currentUser } = useCurrentUser();
    const [userProfileType, setUserProfileType] = useState('Member');
    const [userProfileTypeId, setUserProfileTypeId] = useState(0);

    const noTrial = true;

    // The Redux default is Business (1), so prefer the actual signed-up/stored user.
    const currentUserProfileType = resolveProfileTypeId(
        currentUser,
        fallbackProfileType
    );
    const effectiveProfileType =
        currentUserProfileType ||
        Number(fallbackProfileType) ||
        Number(selectedProfileType) ||
        0;

    useEffect(() => {
        try {
            const registerUser = JSON.parse(localStorage.getItem('registerUser') || '{}') || {};
            localStorage.setItem('registerUser', JSON.stringify({
                ...registerUser,
                SubscriptionPlanType: 'Premium',
                user: {
                    ...(registerUser.user || {}),
                    SubscriptionPlanType: 'Premium',
                },
            }));
        } catch {
            // The checkout remains Premium if local storage is unavailable.
        }
    }, []);

    const getAnnualBillingName = (plans = []) => {
        const annualPlan = plans.find((plan) => /annual|year/i.test((plan?.Name || '').toString()));
        return annualPlan?.Name || '';
    };

    const getDisplayName = (user = {}) =>
        user?.FirstName ||
        user?.firstName ||
        user?.UserName ||
        user?.userName ||
        (user?.name ? user.name.split(' ')[0] : '');

    const getDisplayEmail = (user = {}) =>
        user?.Email ||
        user?.email ||
        user?.UserEmail ||
        user?.EmailAddress ||
        user?.userEmail ||
        user?.user_email ||
        '';

    // Fetch subscription plan options
    useEffect(() => {
        (async () => {
            try {
                if (effectiveProfileType && selectedPlan) {
                    const getCookie = (name) => {
                        if (typeof document === 'undefined') return null;
                        const value = `; ${document.cookie}`;
                        const parts = value.split(`; ${name}=`);
                        if (parts.length === 2) return parts.pop().split(';').shift();
                        return null;
                    };
                    const userCountry = getCookie('user_country') || 'US';
                    const res = await getSubscriptionPlanAPI(effectiveProfileType, selectedPlan, userCountry);

                    if (res?.status === 200) {
                        const result = res?.data?.Result || [];
                        setBillings(result);
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
                                Name: 'Annually',
                                Price: '$49',
                                Currency: registerUser?.Currency || 'USD',
                                PaypalPlanId: registerUser?.PaypalPlanId || registerUser?.PalpalPlanId || null,
                            }];
                            setBillings(fallbackBilling);
                        }
                    } catch {
                        // ignore local fallback parsing errors
                    }

                    console.warn('Subscription plan API returned 401 on payments page. Falling back to local billing data.', apiMessage);
                    return;
                }

                console.error('Error fetching subscription plan:', error);
            }
        })();
    }, [effectiveProfileType, selectedPlan]);

    useEffect(() => {
        try {
            const registerUser = JSON.parse(localStorage.getItem('registerUser') || '{}') || {};
            const localProfileType = resolveProfileTypeId(registerUser);
            if (localProfileType > 0) {
                setFallbackProfileType(localProfileType);
            }

            setBillingAmount(49);
            setBillingData(registerUser);

            // Prefer currently logged-in user info when available; otherwise fall back to local registerUser
            const firstName = getDisplayName(currentUser) || getDisplayName(registerUser);
            const email = getDisplayEmail(currentUser) ||
                getDisplayEmail(registerUser);
            setUserProfileType(
                resolveProfileTypeName(
                    currentUser || registerUser,
                    localProfileType || effectiveProfileType
                )
            );
            setUserProfileTypeId(
                resolveProfileTypeId(
                    currentUser || registerUser,
                    localProfileType || effectiveProfileType
                )
            );
            setRegisteredName(firstName || '');
            setRegisteredEmail(email || '');
        } catch (error) {
            setBillingAmount(0);
        }
    }, [currentUser, effectiveProfileType]);

    useEffect(() => {
        if (!currentUser) return;
        try {
            const firstName = getDisplayName(currentUser);
            const email = getDisplayEmail(currentUser);
            if (firstName) setRegisteredName(firstName);
            if (email) setRegisteredEmail(email);
            setUserProfileType(
                resolveProfileTypeName(currentUser, effectiveProfileType)
            );
            setUserProfileTypeId(
                resolveProfileTypeId(currentUser, effectiveProfileType)
            );
        } catch (e) {
            // no-op
        }
    }, [currentUser, effectiveProfileType]);

    useEffect(() => {
        if (!billings?.length) return;

        const billingNames = billings
            .map((billing) => billing?.Name)
            .filter(Boolean);

        // Keep user-selected tab if it exists; otherwise choose a sensible default.
        if (selectedBilling && billingNames.includes(selectedBilling)) {
            return;
        }

        const annualName = getAnnualBillingName(billings);
        setSelectedBilling(annualName || billingNames[0] || 'Annually');
    }, [billings, selectedBilling]);

    // Format currency helper with proper locale mapping and explicit symbols
    const formatCurrency = (n) => {
        try {
            const currencyCode = billingData?.Currency || 'USD';
            const normalizedCurrency = (currencyCode || '').toString().toUpperCase().trim();

            // Map currency to appropriate locale
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

            return formatted;
        } catch (e) {
            console.error('❌ [formatCurrency] Error:', e, { billingData, normalizedCurrency });

            // Fallback: Use explicit symbol map if Intl fails
            const symbolMap = {
                'USD': '$', 'CAD': '$', 'GBP': '£', 'EUR': '€',
                'NGN': '₦', 'GHS': '₵', 'ZAR': 'R',
                'KES': 'KSh', 'UGX': 'USh', 'TZS': 'TSh', 'ZMW': 'ZK', 'BWP': 'P',
            };

            const currencyCode = (billingData?.Currency || 'USD').toString().toUpperCase().trim();
            const symbol = symbolMap[currencyCode] || billingData?.CurrencySymbol || '$';

            return `${symbol}${(n || 0).toFixed(2)}`;
        }
    };

    // Update billingAmount and localStorage when billing frequency changes
    useEffect(() => {
        if (!billings?.length || !selectedBilling) return;

        const selectedBillingPlan = billings.find(b => b?.Name === selectedBilling) || billings[0];
        if (!selectedBillingPlan) return;

        const newAmount = 49;
        setBillingAmount(newAmount);

        // Sync to localStorage so PaymentMethod picks up correct plan
        try {
            const registerUser = JSON.parse(localStorage.getItem('registerUser') || '{}');
            const paypalPlanId = selectedBillingPlan?.PaypalPlanId || registerUser?.PaypalPlanId || registerUser?.PalpalPlanId;
            const updatedRegisterUser = {
                ...registerUser,
                user: {
                    ...registerUser.user,
                    BillingFrequency: selectedBilling,
                    SubscriptionPlanType: 'Premium',
                },
                BillingFrequency: selectedBilling,
                SubscriptionPlanType: 'Premium',
                UserSubscriptionPlanId: Number(selectedBillingPlan.Id) || 0,
                BillingPlanId: Number(selectedBillingPlan.Id) || 0,
                PaypalPlanId: paypalPlanId || null,
                PalpalPlanId: paypalPlanId || null,
                paymentIntent: { ...registerUser.paymentIntent, Amount: newAmount },
                Currency: selectedBillingPlan?.Currency || 'USD',
            };
            localStorage.setItem('registerUser', JSON.stringify(updatedRegisterUser));

            // ✅ CRITICAL: Update billingData state with the new Currency
            setBillingData(updatedRegisterUser);

            window.dispatchEvent(new Event('registerUserUpdated'));
        } catch (e) {
            console.error('Error syncing billing plan to localStorage:', e);
        }
    }, [selectedBilling, billings]);

    // Order summary calculations
    const promotionText = '';
    const promotionDiscount = 0;
    const estimatedTax = 0;
    const dueToday = Math.max(billingAmount - promotionDiscount + estimatedTax, 0);

    return (
        <main className="min-h-screen bg-white">

            <section className="relative mx-auto grid w-full max-w-[1440px] gap-12 px-6 pb-16 pt-28 lg:grid-cols-[1.08fr_.92fr] lg:px-16 lg:pb-24 lg:pt-36">
                <Image
                    src="/icons/signup/background.svg"
                    unoptimized
                    objectFit="cover"
                    objectPosition="top"
                    width={260}
                    height={260}
                    alt="carousel"
                    priority
                    className="pointer-events-none absolute left-0 top-0 w-40 opacity-70 md:w-56"
                />
                <div className="relative order-2 flex w-full flex-col lg:order-2">
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#101828]">Account Created</h2>
                        <p className="mt-3 text-lg text-[#526079]">User Email: {registeredEmail}</p>
                    </div>
                    <div className="w-full">
                        <OrderSummary
                            selectedBilling={selectedBilling}
                            billingPrice={billingAmount}
                            promotionText={promotionText}
                            promotionDiscount={promotionDiscount}
                            estimatedTax={estimatedTax}
                            dueToday={dueToday}
                            formatCurrency={formatCurrency}
                            noTrial={noTrial}
                            userType={userProfileType}
                            userTypeId={userProfileTypeId}
                        />
                    </div>
                </div>
                <div className="relative order-1 w-full lg:order-1">
                    <h1 className="mb-14 text-[40px] font-semibold leading-tight tracking-[-0.04em] text-[#101828] sm:text-5xl">
                        {`Hey ${registeredName || 'there'}, You’re almost there!`}
                    </h1>
                    <Elements stripe={stripePromise}>
                        <PaymentMethod
                            billing={billingAmount}
                            noTrial={noTrial}
                            billings={billings}
                            selectedBilling={selectedBilling}
                            stripeEnabled={CAN_INITIALIZE_STRIPE}
                        />
                    </Elements>
                </div>
            </section>
        </main>
    );
}
