'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  getUserProfileTypeFeatures,
} from '@/server-actions/signup';
import { Button } from '../../../../components/marketing';
import {
  accessTo,
  partnerPlanDetails,
} from '../../../../data/marketing/PricingData';
import { useEffect, useRef, useState } from 'react';
import { getProfileSlug } from '../../../../data/marketing/signupData';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const PricesFeature = ({
  basicPlanList,
  premiumPlanList,
  basicPlanDetails,
  premiumPlanDetails,
  profile,
  planType,
}) => {
  const router = useRouter();
  const [type] = useState(profile?.value);
  const handleChoosePlan = (subscriptionType) => {
    const profileSlug = getProfileSlug(profile.value);
    router.push(
      `/signup?profile=${profileSlug}&billingfrequency=${planType}&planType=${subscriptionType}`
    );
  };
  const basicPlanPrices = basicPlanList?.find((plan) => plan.Name === planType);
  const premiumPlanPrices = premiumPlanList?.find(
    (plan) => plan.Name === planType
  );

  const getBillingPeriodText = () => {
    if (planType === 'Monthly') return '/Month';
    if (planType === 'Quarterly') return '/Quarter';
    return '/Year';
  };

  const calculateSavings = (price, originalMonthlyPrice) => {
    let monthlyEquivalent;
    if (planType === 'Quarterly') {
      monthlyEquivalent = price / 3;
    } else if (planType === 'Annually') {
      monthlyEquivalent = price / 12;
    } else {
      return null; // No savings for monthly plan
    }

    const savedAmount = monthlyEquivalent.toFixed(2);

    const savedPercentage = 100 - (savedAmount / originalMonthlyPrice) * 100;

    return {
      amount: savedAmount,
      percentage: savedPercentage.toFixed(0),
    };
  };

  const renderSavings = (price, planList) => {
    const originalMonthlyPlan = planList?.find(
      (plan) => plan.Name === 'Monthly'
    );
    const savings = calculateSavings(price, originalMonthlyPlan?.Price);
    if (!savings) return null;
    return savings.amount; // Return the percentage
  };

  const renderSavingsPercentage = (price, planList) => {
    const originalMonthlyPlan = planList?.find(
      (plan) => plan.Name === 'Monthly'
    );

    const savings = calculateSavings(price, originalMonthlyPlan?.Price);
    if (!savings) return null;
    return savings.percentage; // Return the percentage
  };


  const [profileFeatures, setProfileFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const features = await getUserProfileTypeFeatures();

        setProfileFeatures(features);
      } catch (err) {
        console.error('Error fetching profile features:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const [isSticky, setIsSticky] = useState(false);
  const [componentInView, setComponentInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if component is in viewport
        const componentTopInView = rect.top <= windowHeight && rect.top >= 0;
        const componentBottomInView = rect.bottom >= 0 && rect.bottom <= windowHeight;
        const componentFillsViewport = rect.top <= 0 && rect.bottom >= windowHeight;

        const isInView = componentTopInView || componentBottomInView || componentFillsViewport;

        // Check if component top has reached viewport top
        const atTop = rect.top <= 0;

        setIsSticky(atTop);
        setComponentInView(isInView);
      }
    };

    // Run once on mount to check initial position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>

      <section
        ref={sectionRef}
        className="bg-white md:mt-11 mt-0 shadow-price3 p-6 rounded-3xl small-767:px-4 small-767:shadow-none price_feature_main relative"
      >
        {/* Sticky labels - only visible when component is in view and at top */}
        <div className={`${isSticky && componentInView ? 'fixed w-full mt-[23%]' : 'absolute w-full'} 
                bg-white small-767:block hidden top-0 z-50 `}>
          <div className="flex justify-end pr-6 small-767:pr-4 w-full mt-[13px]">
            <div className={`flex text-sm rounded mr-4 py-5 ${isSticky && componentInView ? 'bg-[#F7F9FC]' : 'bg-white'}`}>
              <div className="w-[61px] text-center font-semibold text-blue-strong">Standard</div>
              <div className="w-[61px] text-center font-semibold text-blue-strong">Premium</div>
            </div>
          </div>
        </div>

        {/* Add padding when sticky to prevent content jump */}
        {isSticky && componentInView && <div className="small-767:block hidden h-16" />}
        {/* Render profile features */}
        {profileFeatures?.map((feature) =>
          feature?.ProfileName === profile?.value ? (
            feature?.Categories?.map((category) => {
              const categoryTitle = category?.CatTitle; // Get the category title dynamically

              // Render category based on its title
              return (
                <div className="w-full md:mb-3" key={categoryTitle}>
                  <div className="flex flex-col">
                    <p className="text-blue-strong text-[28px] small-767:text-xl small-767:my-8 font-semibold md:my-6 my-8 text-left table_p">
                      {categoryTitle}
                    </p>
                    <table className="w-full border-collapse small-767:border-none price_feature">
                      <tbody>
                        {categoryTitle === "Discovery" ? (
                          <tr className="w-full">
                            <th></th>
                            <th style={{ color: 'white' }}>Standard</th>
                            <th style={{ color: 'white' }}>Premium</th>
                          </tr>
                        ) : (
                          <tr className="w-full" style={{ color: 'white' }}>
                              <th></th>
                            <th style={{ color: 'white' }}>Standard</th>
                            <th style={{ color: 'white' }}>Premium</th>
                          </tr>
                        )}

                        <tr>
                          <th>
                            <p className="text-blue-strong text-[28px] small-767:text-xl small-767:my-4 font-semibold md:my-6  text-left">
                              {categoryTitle}
                            </p>
                          </th>
                          <th></th>
                          <th></th>
                        </tr>

                        {/* Render features */}
                        {category?.Features?.map((item, i) => (
                          <tr key={i}>
                            <td className='w-full'>
                              <div className="flex items-start gap-4  mt-1">
                                {item.Icon && <Image
                                  className="small-767:size-[20px]"
                                  src={`${staticUrl}/icons/${item.Icon}`}
                                  alt="icon"
                                  width={30}
                                  height={30}
                                />}
                                <div className="flex flex-col gap-2 text-left">
                                  <p className="text-sm md:text-base text-blue-strong font-semibold">
                                    <p>
                                      {item?.FeatureTitle}
                                    </p>

                                  </p>

                                  <p className="text-[#3D3D3D] text-sm font-medium mb-2  md:pr-[10rem]  lg:pr-[70px] xl:w-[30rem] ">
                                    <p>
                                      {item?.Description}
                                    </p>

                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Standard Column */}
                            <td>
                              <div className="flex justify-center items-center w-full sm:w-[200px] md:w-[200px] lg:w-[254px] xl:w-[312px]">

                                {item?.Standard == true ? (<svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="27"
                                  height="27"
                                  viewBox="0 0 27 27"
                                  fill="none"

                                >
                                  <mask
                                    id="mask0_3684_20102"
                                    maskUnits="userSpaceOnUse"
                                    x="0"
                                    y="0"
                                    width="27"
                                    height="27"
                                  >
                                    <path
                                      d="M13.5 26C15.1418 26.0021 16.7679 25.6798 18.2847 25.0515C19.8016 24.4231 21.1793 23.5012 22.3387 22.3388C23.5012 21.1793 24.4231 19.8016 25.0514 18.2848C25.6798 16.7679 26.0021 15.1418 26 13.5C26.0021 11.8582 25.6797 10.2321 25.0514 8.71528C24.4231 7.19843 23.5012 5.8207 22.3387 4.66126C21.1793 3.49878 19.8016 2.57688 18.2847 1.94856C16.7679 1.32024 15.1418 0.997883 13.5 1.00001C11.8582 0.997917 10.2321 1.32029 8.71527 1.94861C7.19843 2.57693 5.8207 3.49881 4.66126 4.66126C3.4988 5.8207 2.57693 7.19843 1.94861 8.71528C1.32029 10.2321 0.997917 11.8582 1.00001 13.5C0.997883 15.1418 1.32024 16.7679 1.94856 18.2848C2.57688 19.8016 3.49878 21.1793 4.66126 22.3388C5.8207 23.5012 7.19843 24.4231 8.71527 25.0514C10.2321 25.6797 11.8582 26.0021 13.5 26Z"
                                      fill="white"
                                      stroke="white"
                                      strokeWidth="2"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M8.5 13.5L12.25 17.25L19.75 9.75"
                                      stroke="black"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </mask>
                                  <g mask="url(#mask0_3684_20102)">
                                    <path
                                      d="M-0.96875 0H26.9715V30H-0.96875V0Z"
                                      fill="#7FAAE3"
                                    />
                                  </g>
                                </svg>) : (<div className="h-[27px] w-[27px]"></div>)}
                              </div>
                            </td>

                            {/* Premium Column */}
                            <td>
                              {profile?.value !== 'Advocate' && (
                                <div className="flex justify-center items-center w-full sm:w-[200px] md:min-w-[200px] lg:min-w-[254px] xl:min-w-[312px]">
                                  {item?.Premium === true ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="27"
                                      height="27"
                                      viewBox="0 0 27 27"
                                      fill="none"
                                    >
                                      <mask
                                        id="mask0_3684_20102"
                                        maskUnits="userSpaceOnUse"
                                        x="0"
                                        y="0"
                                        width="27"
                                        height="27"
                                      >
                                        <path
                                          d="M13.5 26C15.1418 26.0021 16.7679 25.6798 18.2847 25.0515C19.8016 24.4231 21.1793 23.5012 22.3387 22.3388C23.5012 21.1793 24.4231 19.8016 25.0514 18.2848C25.6798 16.7679 26.0021 15.1418 26 13.5C26.0021 11.8582 25.6797 10.2321 25.0514 8.71528C24.4231 7.19843 23.5012 5.8207 22.3387 4.66126C21.1793 3.49878 19.8016 2.57688 18.2847 1.94856C16.7679 1.32024 15.1418 0.997883 13.5 1.00001C11.8582 0.997917 10.2321 1.32029 8.71527 1.94861C7.19843 2.57693 5.8207 3.49881 4.66126 4.66126C3.4988 5.8207 2.57693 7.19843 1.94861 8.71528C1.32029 10.2321 0.997917 11.8582 1.00001 13.5C0.997883 15.1418 1.32024 16.7679 1.94856 18.2848C2.57688 19.8016 3.49878 21.1793 4.66126 22.3388C5.8207 23.5012 7.19843 24.4231 8.71527 25.0514C10.2321 25.6797 11.8582 26.0021 13.5 26Z"
                                          fill="white"
                                          stroke="white"
                                          strokeWidth="2"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M8.5 13.5L12.25 17.25L19.75 9.75"
                                          stroke="black"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </mask>
                                      <g mask="url(#mask0_3684_20102)">
                                        <path
                                          d="M-0.96875 0H26.9715V30H-0.96875V0Z"
                                          fill="#7FAAE3"
                                        />
                                      </g>
                                    </svg>
                                  ) : (<div className="h-[27px] w-[27px]"></div>)}
                                </div>
                              )}

                              {/* Add this style to hide the premium checkmark when Advocate profile */}
                              {profile?.value === 'Advocate' && (
                                <div
                                  className="flex justify-center items-center w-full lg:min-w-[312px]"
                                  style={{ visibility: 'hidden' }}
                                />
                              )}
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          ) : null
        )}
      </section>

    </>
  );
};
