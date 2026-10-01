'use client';

import { getSingularRole } from '@/utils/helper';
import {
  getUserCountryFromCookie,
  formatPriceWithCurrency,
  mapSubscriptionPlansWithPricing,
} from '@/utils/subscriptionPricing';
import { CustomTab } from '../../../../../components/marketing';
import { usersTypes } from '../../../../../data/marketing';
import { getProfileIdFromSlug } from '../../../../../data/marketing/signupData';
import {
  accessTo,
  basicPlanDetails,
  premiumPlanDetails,
} from '../../../../../data/marketing/PricingData';
import {
  getLegacySubscriptionPrice,
  getSubscriptionPlanBasedOnProfileType,
} from '../../../../api/marketing/pricing';
import { clsx } from 'clsx';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const plans = [
  { plan: 'Monthly', free: '' },
  { plan: 'Quarterly', free: '1 month free' },
  { plan: 'Annually', free: '5 months free' },
];

export const Exceptionally = ({ userType }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isOpenOne, setIsOpenOne] = useState(false);
  const [isOpenTwo, setIsOpenTwo] = useState(false);

  const [priceResult, setPriceResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userCountry] = useState(() => getUserCountryFromCookie());

  const profileTypeId = getProfileIdFromSlug(userType);
  const singularProfile = useMemo(() => getSingularRole(userType), [userType]);

  const handleIsOpenOne = () => {
    setIsOpenOne(!isOpenOne);
  };

  const handleIsOpenTwo = () => {
    setIsOpenTwo(!isOpenTwo);
  };

  const handleTabChange = (index) => {
    setSelectedIndex(index);
    const plan = plans[index].plan.toLowerCase();
    setSelectedPlan(plan);
  };


  useEffect(() => {
    let isMounted = true;

    const buildLegacyFallbackPlans = async () => {
      const fallbackPlans = await Promise.all(
        plans.map(async ({ plan }) => {
          const legacyResponse = await getLegacySubscriptionPrice(
            singularProfile,
            plan.toLowerCase()
          );

          const standardPlan = legacyResponse?.Result?.[0] || {};
          const premiumPlan = legacyResponse?.Result?.[1] || {};

          return [
            {
              Id: `legacy-standard-${plan}`,
              Name: plan,
              SubscriptionId: 1,
              Price: standardPlan?.Price ?? 0,
              Currency: 'USD',
              StripePriceId: standardPlan?.StripePriceId ?? '',
              trialDays: standardPlan?.trialPeriodDays ?? 0,
              subscriptionName: 'Standard',
              planName: plan,
              price: standardPlan?.Price ?? 0,
              currency: 'USD',
              stripePriceId: standardPlan?.StripePriceId ?? '',
            },
            {
              Id: `legacy-premium-${plan}`,
              Name: plan,
              SubscriptionId: 2,
              Price: premiumPlan?.Price ?? 0,
              Currency: 'USD',
              StripePriceId: premiumPlan?.StripePriceId ?? '',
              trialDays: premiumPlan?.trialPeriodDays ?? 0,
              subscriptionName: 'Premium',
              planName: plan,
              price: premiumPlan?.Price ?? 0,
              currency: 'USD',
              stripePriceId: premiumPlan?.StripePriceId ?? '',
            },
          ];
        })
      );

      return fallbackPlans.flat();
    };

    const fetchSubscriptionPrice = async () => {
      if (!profileTypeId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getSubscriptionPlanBasedOnProfileType(profileTypeId);
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
        console.error('Error fetching localized subscription plans:', subscriptionError);

        try {
          const fallbackPlans = await buildLegacyFallbackPlans();

          if (isMounted) {
            setPriceResult(fallbackPlans);
            setError(subscriptionError.message);
          }
        } catch (fallbackError) {
          console.error('Error fetching fallback subscription plans:', fallbackError);

          if (isMounted) {
            setPriceResult([]);
            setError(fallbackError.message);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSubscriptionPrice();
    return () => {
      isMounted = false;
    };
  }, [profileTypeId, singularProfile, userCountry]);

  const selectedPlanName = plans[selectedIndex]?.plan;
  const basicPlan = priceResult.find(
    (plan) => plan?.SubscriptionId === 1 && plan?.Name === selectedPlanName
  );
  const premiumPlan = priceResult.find(
    (plan) => plan?.SubscriptionId === 2 && plan?.Name === selectedPlanName
  );
  const basicPrice = formatPriceWithCurrency(
    basicPlan?.Price,
    basicPlan?.Currency
  );
  const premiumPrice = formatPriceWithCurrency(
    premiumPlan?.Price,
    premiumPlan?.Currency
  );

  return (
    <section className="p-4 py-16 lg:px-16" aria-busy={loading}>
      <div className="flex flex-col items-center w-full">
        <h3 className="text-blue-strong sm:text-[40px] text-[24px] leading-[44px] text-center font-semibold">
          Exceptionally Affordable
        </h3>
        <div className="my-8">
          <CustomTab
            selectedIndex={selectedIndex}
            setSelectedIndex={handleTabChange}
            tabList={plans}
          />
        </div>
        <div>
          {usersTypes.map((item, i) => (
            <div key={i}>
              {item?.userType === userType && (
                <div
                  className={clsx(
                    'grid grid-cols-1 gap-[40px] w-full',
                    item?.priceCards[selectedPlan]?.card1 &&
                    item?.priceCards[selectedPlan]?.card2 &&
                    'grid-cols-1 sm:grid-cols-2 w-full'
                  )}
                >
                  {item?.priceCards[selectedPlan]?.card1 && (
                    <div
                      tabIndex="1"
                      className=" xl:w-[515px] !w-full cursor-default rounded-xl group relative"
                    >
                      <div className="bg-[#68A9DC] bg-[url('/userTypes/bg/arc.svg')] bg-no-repeat bg-right-bottom p-[40px] flex flex-col gap-5 rounded-xl border border-[#4C85BD] w-full">
                        <div className="grid grid-cols-2 sm:grid-cols-1 w-full items-center  justify-between">
                          <p ></p>
                          <p className="text-white sm:text-[24px] w-full sm:whitespace-normal whitespace-nowrap text-[18px] leading-[36px] font-semibold">

                            {item?.priceCards?.[selectedPlan]?.card1?.title}
                          </p>
                          <div
                            className=" size-[18px] relative justify-self-end  sm:hidden"
                            onClick={handleIsOpenOne}
                          >
                            {isOpenOne ? (
                              <Image
                                fill
                                src="/userTypes/up1.svg"
                                alt="arrow up"
                                className="!size-[18px]"
                              />
                            ) : (
                              <Image
                                fill
                                src="/userTypes/down1.svg"
                                alt="arrow up"
                                className="!size-[18px]"
                              />
                            )}
                          </div>
                        </div>
                        <p className="text-white font-medium text-[16px] leading-[17px]">
                          <span className="text-[40px] leading-[44px] font-semibold">
                            {basicPrice}
                          </span>
                          {item?.priceCards?.[selectedPlan]?.card1?.period}
                        </p>
                        {selectedPlan !== 'monthly' && (
                          <div className="flex gap-[7px]">
                            <div className="bg-[#F2F7FC] border border-[#D5E8FA] text-[16px] text-[#2357C6] py-[2px] px-[12px] flex justify-center items-center font-medium leading-150 rounded-full">
                              {item?.priceCards[selectedPlan]?.card1?.button1}
                            </div>
                            <div className="bg-[#F2F7FC] border border-[#D5E8FA] text-[16px] text-[#2357C6] py-[2px] px-[12px] flex justify-center items-center font-medium leading-150 rounded-full">
                              {item?.priceCards[selectedPlan]?.card1?.button2}
                            </div>
                          </div>
                        )}
                      </div>
                      {
                        /* on mobile */
                        isOpenOne && (
                          <div
                            className={`block sm:hidden z-50  w-full mt-[12px] px-10 py-8 bg-white rounded-xl shadow-xl`}
                          >
                            <div className="flex flex-col gap-8">
                              <div>
                                <p className="mb-5 font-bold text-blue-strong">
                                  Functions
                                </p>
                                {basicPlanDetails?.functions.map((item, i) => (
                                  <div
                                    key={i}
                                    className={`flex items-center gap-4 ${item?.label ? 'mb-4' : 'mb-0'
                                      } `}
                                  >
                                    <Image
                                      src={item?.icon}
                                      alt="icon"
                                      width={16}
                                      height={16}
                                    />
                                    <div className="flex flex-col">
                                      <p className="text-sm font-medium text-text-gray">
                                        {item?.label}
                                      </p>
                                      <p className="text-xs font-medium text-nav-blue">
                                        {item?.coming}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div>
                                <p className="mb-5 font-bold text-blue-strong">
                                  Access to
                                </p>
                                <div className="flex flex-col gap-4">
                                  {accessTo.map((item, i) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-4"
                                    >
                                      <div className="border grid place-items-center border-[#D5E8FA] rounded-full h-[20px] w-[20px]">
                                        <Image
                                          src="/icons/check.svg"
                                          className=""
                                          alt="icon"
                                          width={10}
                                          height={10}
                                        />
                                      </div>
                                      <p className="text-sm font-medium text-text-gray">
                                        {item}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      <div
                        className={`absolute sm:group-hover:block hidden z-50 sm:group-focus:block w-full mt-[12px] px-10 py-8 bg-white rounded-xl shadow-xl`}
                      >
                        <div className="flex flex-col gap-8">
                          <div>
                            <p className="mb-5 font-bold text-blue-strong">
                              Functions
                            </p>
                            {basicPlanDetails?.functions.map((item, i) => (
                              <div
                                key={i}
                                className={`flex items-center gap-4 ${item?.label ? 'mb-4' : 'mb-0'
                                  } `}
                              >
                                <Image
                                  src={item?.icon}
                                  alt="icon"
                                  width={16}
                                  height={16}
                                />
                                <div className="flex flex-col">
                                  <p className="text-sm font-medium text-text-gray">
                                    {item?.label}
                                  </p>
                                  <p className="text-xs font-medium text-nav-blue">
                                    {item?.coming}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <p className="mb-5 font-bold text-blue-strong">
                              Access to
                            </p>
                            <div className="flex flex-col gap-4">
                              {accessTo.map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                  <div className="border grid place-items-center border-[#D5E8FA] rounded-full h-[20px] w-[20px]">
                                    <Image
                                      src="/icons/check.svg"
                                      className=""
                                      alt="icon"
                                      width={10}
                                      height={10}
                                    />
                                  </div>
                                  <p className="text-sm font-medium text-text-gray">
                                    {item}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {item?.priceCards[selectedPlan]?.card2 && (
                    <div>
                      <div
                        tabIndex="0"
                        className="bg-userType rounded-xl xl:w-[515px] w-full relative group"
                      >
                        <div className="bg-[url('/userTypes/bg/spike.svg')] flex flex-col gap-5 bg-no-repeat bg-right p-[40px] rounded-xl border border-[#4C85BD]">
                          <div className="grid grid-cols-2 sm:grid-cols-1 w-full items-center  justify-between">
                            <p className="text-white sm:text-[24px] w-full sm:whitespace-normal whitespace-nowrap small-500:whitespace-pre-wrap text-[18px] leading-[36px] font-semibold">
                              {item?.priceCards?.[selectedPlan]?.card2?.title}
                            </p>
                            <div
                              className=" size-[18px] relative justify-self-end  sm:hidden"
                              onClick={handleIsOpenTwo}
                            >
                              {isOpenTwo ? (
                                <Image
                                  fill
                                  src="/userTypes/up1.svg"
                                  alt="arrow up"
                                  className="!size-[18px]"
                                />
                              ) : (
                                <Image
                                  fill
                                  src="/userTypes/down1.svg"
                                  alt="arrow up"
                                  className="!size-[18px]"
                                />
                              )}
                            </div>
                          </div>
                          <p className="text-white font-medium text-[16px] leading-[17px]">
                            <span className="text-[40px] leading-[44px] font-semibold">
                              {premiumPrice}
                            </span>
                            {item?.priceCards?.[selectedPlan]?.card2?.period}
                          </p>
                          {selectedPlan !== 'monthly' && (
                            <div className="flex gap-[7px]">
                              {item?.priceCards[selectedPlan]?.card2
                                ?.button1 && (
                                  <div className="bg-[#F2F7FC] border border-[#D5E8FA] text-[16px] text-[#2357C6] py-[2px] px-[12px] flex justify-center items-center font-medium leading-150 rounded-full">
                                    {
                                      item?.priceCards[selectedPlan]?.card2
                                        ?.button1
                                    }
                                  </div>
                                )}
                              {item?.priceCards[selectedPlan]?.card2
                                ?.button2 && (
                                  <div className="bg-[#F2F7FC] border border-[#D5E8FA] text-[16px] text-[#2357C6] py-[2px] px-[12px] flex justify-center items-center font-medium leading-150 rounded-full">
                                    {
                                      item?.priceCards[selectedPlan]?.card2
                                        ?.button2
                                    }
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                        {/* on mobile */}

                        <div
                          className={`absolute sm:group-hover:block hidden z-50 sm:group-focus:block w-full mt-[12px] px-10 py-8 bg-white rounded-xl shadow-xl`}
                        >
                          <div className="">
                            <p className="font-bold text-[16px] mb-5 leading-150 text-blue-strong">
                              Everything included in Visibility and
                              Collaboration, plus: {userType}
                            </p>
                            <div className="flex flex-col">
                              {premiumPlanDetails.map((item, i) => (
                                <div className="space-y-4" key={i}>
                                  {userType.replace(/-/g, '') ===
                                    item?.type
                                      .toLocaleLowerCase()
                                      .replace(/-/g, '')
                                      .replace(' ', '') &&
                                    item?.functions.map((data, j) => (
                                      <div
                                        key={j}
                                        className="flex items-start gap-4"
                                      >
                                        <Image
                                          src={data?.icon}
                                          alt="icon"
                                          width={16}
                                          height={16}
                                        />
                                        <p className="text-sm text-text-gray font-medium">
                                          {data?.label}
                                        </p>
                                      </div>
                                    ))}
                                </div>
                              ))}
                            </div>

                            <p className="mt-8 text-sm font-medium text-blue-strong">
                              *Requires Verification ($99/Lifetime)
                            </p>
                          </div>
                        </div>
                      </div>
                      {isOpenTwo && (
                        <div
                          className={`block sm:hidden z-50  w-full px-10 py-8 bg-white rounded-xl shadow-xl`}
                        >
                          <div className="">
                            <p className="font-bold text-[16px] mb-5 leading-150 text-blue-strong">
                              Everything included in Visibility and
                              Collaboration, plus: {userType}
                            </p>
                            <div className="flex flex-col">
                              {premiumPlanDetails.map((item, i) => (
                                <div className="space-y-4" key={i}>
                                  {userType.replace(/-/g, '') ===
                                    item?.type
                                      .toLocaleLowerCase()
                                      .replace(/-/g, '')
                                      .replace(' ', '') &&
                                    item?.functions.map((data, j) => (
                                      <div
                                        key={j}
                                        className="flex items-start gap-4"
                                      >
                                        <Image
                                          src={data?.icon}
                                          alt="icon"
                                          width={16}
                                          height={16}
                                        />
                                        <p className="text-sm text-text-gray font-medium">
                                          {data?.label}
                                        </p>
                                      </div>
                                    ))}
                                </div>
                              ))}
                            </div>

                            <p className="mt-8 text-sm font-medium text-blue-strong">
                              *Requires Verification ($99/Lifetime)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {usersTypes.map((item, i) => (
          <div key={i}>
            {item?.userType === userType && (
              <div className="grid mt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-y-[60px] gap-y-12 py-8 relative">
                {item?.programs?.map((program, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:gap-[28px] gap-4 items-center md:items-start text-center md:text-start"
                  >
                    <div className="size-[80px] md:size-[52px] relative">
                      <Image src={program?.img} alt={program?.title} fill />
                    </div>
                    <div className="flex flex-col gap-2 md:gap-3">
                      <p className="text-blue-strong sm:text-[20px] text-[16px] leading-[26px] font-semibold">
                        {program?.title}hh
                      </p>
                      <p className="text-blu-ray-300 sm:text-[20px] text-[16px] leading-[30px] font-medium">
                        {program?.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
