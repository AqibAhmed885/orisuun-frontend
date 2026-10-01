'use client';

import { getSingularRole } from '@/utils/helper';
import {
  formatPriceWithCurrency,
  getUserCountryFromCookie,
  mapSubscriptionPlansWithPricing,
} from '@/utils/subscriptionPricing';
import { getShimmerPlaceholder } from '@/utils/shimmerPlaceholder';
import { newUsersTypes } from '../../../../data/marketing';
import { getProfileIdFromSlug } from '../../../../data/marketing/signupData';
import { premiumPlanDetails } from '../../../../data/marketing/PricingData';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  getLegacySubscriptionPrice,
  getSubscriptionPlanBasedOnProfileType,
} from '../../../api/marketing/pricing';

const ANNUAL_PLAN_NAME = 'Annually';
const PREMIUM_SUBSCRIPTION_ID = 2;

const planTypeBySlug = {
  'black-owned-businesses': 'Black-owned Businesses',
  experts: 'Experts',
  mentors: 'Mentors',
  investors: 'Investors',
  professionals: 'Professionals',
  'strategy-consultants': 'Strategy Consultants',
  partners: 'Partners',
};

export const Exceptionally = ({ userType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceResult, setPriceResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const [userCountry] = useState(() => getUserCountryFromCookie());

  const profileTypeId = getProfileIdFromSlug(userType);

  const singularProfile = useMemo(
    () => getSingularRole(userType),
    [userType]
  );

  const currentUserType = useMemo(
    () => newUsersTypes.find((item) => item?.userType === userType),
    [userType]
  );

  /*
   * Most user types use:
   * priceCards.annually.card
   *
   * Professionals currently use:
   * priceCards.annually.card2
   *
   * This keeps both data structures working without changing the UI.
   */
  const annualPremiumCard = useMemo(() => {
    const annualCards = currentUserType?.priceCards?.annually;

    return annualCards?.card2 || annualCards?.card || null;
  }, [currentUserType]);

  const selectedPremiumPlanDetails = useMemo(() => {
    const targetType = planTypeBySlug[userType];

    return (
      premiumPlanDetails.find((plan) => plan?.type === targetType) ||
      premiumPlanDetails[0]
    );
  }, [userType]);

  const selectedPremiumPlanFunctions = useMemo(() => {
    if (!selectedPremiumPlanDetails) {
      return [];
    }

    if (Array.isArray(selectedPremiumPlanDetails.functions)) {
      return selectedPremiumPlanDetails.functions;
    }

    if (Array.isArray(selectedPremiumPlanDetails.sections)) {
      return selectedPremiumPlanDetails.sections.flatMap(
        (section) => section?.functions || []
      );
    }

    return [];
  }, [selectedPremiumPlanDetails]);

  useEffect(() => {
    let isMounted = true;

    const fetchAnnualPremiumPrice = async () => {
      /*
       * Partners use the Contact Us card and do not need
       * subscription pricing from the API.
       */
      if (userType === 'partners' || !profileTypeId) {
        return;
      }

      setLoading(true);

      try {
        const response =
          await getSubscriptionPlanBasedOnProfileType(profileTypeId);

        const localizedPlans = mapSubscriptionPlansWithPricing({
          subscriptions: response?.Subscriptions || [],
          plans: response?.SubscriptionPlan || [],
          pricingList: response?.SubscriptionPlanPricings || [],
          userCountry,
        });

        if (isMounted) {
          setPriceResult(localizedPlans);
        }
      } catch (subscriptionError) {
        console.error(
          'Error fetching localized annual premium plan:',
          subscriptionError
        );

        /*
         * Fallback to the legacy annual pricing API.
         */
        try {
          const legacyResponse = await getLegacySubscriptionPrice(
            singularProfile,
            ANNUAL_PLAN_NAME.toLowerCase()
          );

          /*
           * Existing legacy response order:
           * Result[0] = Standard
           * Result[1] = Premium
           */
          const legacyPremiumPlan = legacyResponse?.Result?.[1] || {};

          if (isMounted) {
            setPriceResult([
              {
                Id: 'legacy-premium-annually',
                Name: ANNUAL_PLAN_NAME,
                SubscriptionId: PREMIUM_SUBSCRIPTION_ID,
                Price: legacyPremiumPlan?.Price,
                Currency: legacyPremiumPlan?.Currency || 'USD',
                StripePriceId:
                  legacyPremiumPlan?.StripePriceId || '',
                trialDays:
                  legacyPremiumPlan?.trialPeriodDays || 0,
              },
            ]);
          }
        } catch (fallbackError) {
          console.error(
            'Error fetching fallback annual premium plan:',
            fallbackError
          );

          if (isMounted) {
            setPriceResult([]);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnnualPremiumPrice();

    return () => {
      isMounted = false;
    };
  }, [
    profileTypeId,
    singularProfile,
    userCountry,
    userType,
  ]);

  /*
   * Only select the Premium Annual subscription.
   */
  const annualPremiumPlan = priceResult.find(
    (plan) =>
      plan?.SubscriptionId === PREMIUM_SUBSCRIPTION_ID &&
      plan?.Name?.toLowerCase() ===
      ANNUAL_PLAN_NAME.toLowerCase()
  );

  /*
   * API price has priority.
   * Data-file price is used as the fallback.
   */
  const annualPremiumPrice =
    annualPremiumPlan?.Price !== undefined &&
      annualPremiumPlan?.Price !== null
      ? formatPriceWithCurrency(
        annualPremiumPlan.Price,
        annualPremiumPlan.Currency
      )
      : annualPremiumCard?.price;

  if (!currentUserType || !annualPremiumCard) {
    return null;
  }

  return (
    <section
      className="p-4 py-16 lg:px-16"
      aria-busy={loading}
    >
      <div className="flex flex-col items-center w-full">
        <h3 className="text-blue-strong sm:text-[40px] text-[24px] leading-[44px] text-center font-[450px]">
          Exceptionally Affordable
        </h3>

        <div className="mt-8 w-full flex justify-center">
          <div className="xl:w-[1060px] w-full">
            <div
              tabIndex={0}
              className="bg-userType rounded-xl xl:w-[1060px] w-full relative group"
            >
              <div className="bg-[url('/userTypes/bg/spike3.svg')]  flex flex-col gap-2 bg-no-repeat bg-right-bottom p-[40px] rounded-xl border border-[#4C85BD]">
                <div className="grid md:grid-cols-2 grid-cols-1 w-full items-center justify-between">
                  <p className="text-white sm:text-[32px] w-full sm:whitespace-normal whitespace-nowrap small-500:whitespace-pre-wrap text-[20px] leading-[36px] font-semibold">
                    {annualPremiumCard.title}
                  </p>

                  {annualPremiumCard.subtitle && (
                    <p className="text-white sm:text-base w-full sm:whitespace-normal whitespace-nowrap text-sm leading-[36px] font-[450px]">
                      {annualPremiumCard.subtitle}
                    </p>
                  )}

                  <button
                    type="button"
                    className="size-[18px] relative justify-self-end sm:hidden"
                    onClick={() =>
                      setIsOpen((currentValue) => !currentValue)
                    }
                    aria-expanded={isOpen}
                    aria-label={
                      isOpen
                        ? 'Hide plan details'
                        : 'Show plan details'
                    }
                  >
                    <Image
                      fill
                      src={
                        isOpen
                          ? '/userTypes/up1.svg'
                          : '/userTypes/down1.svg'
                      }
                      alt=""
                      className="!size-[18px]"
                      placeholder="blur"
                      blurDataURL={getShimmerPlaceholder(18, 18)}
                    />
                  </button>
                </div>

                <p className="text-white  font-semibold text-[48px] xl:text-[96px] leading-[1.2] cursor-pointer">
                  <span className="max-w-full ">
                    {userType === 'partners' ? (
                      <Link href="/contact">Contact Us</Link>
                    ) : (
                      annualPremiumPrice
                    )}
                  </span>

                  {annualPremiumCard.period}
                </p>

                {/* {(annualPremiumCard.button1 ||
                  annualPremiumCard.button2) && (
                    <div className="flex flex-wrap gap-[7px]">
                      {annualPremiumCard.button1 && (
                        <div className="bg-[#F2F7FC] border border-[#D5E8FA] text-[16px] text-[#2357C6] py-[2px] px-[12px] flex justify-center items-center font-[450px] leading-150 rounded-full">
                          {annualPremiumCard.button1}
                        </div>
                      )}

                      {annualPremiumCard.button2 && (
                        <div className="bg-[#F2F7FC] border border-[#D5E8FA] text-[16px] text-[#2357C6] py-[2px] px-[12px] flex justify-center items-center font-[450px] leading-150 rounded-full">
                          {annualPremiumCard.button2}
                        </div>
                      )}
                    </div>
                  )} */}
              </div>

              {/* Desktop hover/focus details */}
              <div className="absolute sm:group-hover:block hidden z-50 sm:group-focus-within:block w-full mt-[12px] px-10 py-8 bg-white rounded-xl shadow-xl">
                <PremiumDetails
                  functions={selectedPremiumPlanFunctions}
                />
              </div>
            </div>

            {/* Mobile details */}
            {isOpen && (
              <div className="block sm:hidden z-50 w-full mt-[12px] px-10 py-8 bg-white rounded-xl shadow-xl">
                <PremiumDetails
                  functions={selectedPremiumPlanFunctions}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid mt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-y-[60px] gap-y-12 py-8 relative">
          {currentUserType.programs?.map(
            (program, index) => (
              <div
                key={`${program?.title}-${index}`}
                className="flex flex-col sm:gap-[28px] gap-4 items-center md:items-start text-center md:text-start"
              >
                <div className="size-[80px] md:size-[52px] relative">
                  <Image
                    src={program?.img}
                    alt={program?.title || ''}
                    fill
                    placeholder="blur"
                    blurDataURL={getShimmerPlaceholder(80, 80)}
                    sizes="(max-width: 768px) 80px, 52px"
                  />
                </div>

                <div className="flex flex-col gap-2 md:gap-3">
                  <p className="text-blue-strong sm:text-[20px] text-[16px] leading-[26px] font-semibold">
                    {program?.title}
                  </p>

                  <p className="text-blu-ray-300 sm:text-[20px] text-[16px] leading-[30px] font-[450px]">
                    {program?.details}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

const PremiumDetails = ({ functions }) => {
  return (
    <div>
      <p className="font-bold text-[16px] mb-5 leading-150 text-blue-strong">
        Premium includes:
      </p>

      <div className="flex flex-col space-y-4">
        {functions.map((data, index) => (
          <div
            key={`${data?.label}-${index}`}
            className="flex items-start gap-4"
          >
            <Image
              src={data?.icon}
              alt=""
              width={16}
              height={16}
              placeholder="blur"
              blurDataURL={getShimmerPlaceholder(16, 16)}
            />

            <p className="text-sm text-text-gray font-[450px]">
              {data?.label}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm font-[450px] text-blue-strong">
        *Requires Verification ($99/Lifetime)
      </p>
    </div>
  );
};