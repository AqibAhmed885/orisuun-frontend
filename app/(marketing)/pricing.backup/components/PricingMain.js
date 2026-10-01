'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { Prices } from './Prices';
import { PricesFeature } from './PricesFeature';
import {
  basicPlanDetails,
  premiumPlanDetails,
} from '../../../../data/marketing/PricingData';
import { CustomTab } from '../../../../components/marketing';
import {
  getSubscriptionPlanBasedOnProfileType,
  getUserProfileType,
  getUserProfileTypeFeatures,
} from '../../../api/marketing/pricing';
import {
  getUserCountryFromCookie,
  mapSubscriptionPlansWithPricing,
  splitSubscriptionPlansByTier,
} from '../../../../utils/subscriptionPricing';

const sizes = {
  sm: 'p-2 border-r-[8px] rounded-md text-sm',
  md: 'p-2.5 border-r-[10px] rounded-lg text-sm font-medium',
  lg: 'p-4 border-r-[16px] rounded-xl text-base',
};

const variants = {
  primary: 'border-transparent',
  outlined: 'select-wrapper',
};

const pricingbg = `${process.env.NEXT_PUBLIC_STATIC_URL}/assets/img/bg-gradient-pric.webp`;

/**
 * Change this value according to your fixed navbar height.
 * If you want sticky exactly at viewport top, set this to 0.
 */
const PRICING_STICKY_TOP = 96;

const CheckIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill="none"
    >
      <mask
        id="mask0_2349_11941"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="27"
        height="27"
      >
        <path
          d="M13.5 26C15.1418 26.0021 16.7679 25.6798 18.2848 25.0515C19.8016 24.4231 21.1793 23.5012 22.3388 22.3388C23.5012 21.1793 24.4231 19.8016 25.0515 18.2848C25.6798 16.7679 26.0021 15.1418 26 13.5C26.0021 11.8582 25.6797 10.2321 25.0514 8.71528C24.4231 7.19843 23.5012 5.8207 22.3388 4.66126C21.1793 3.49878 19.8016 2.57688 18.2848 1.94856C16.7679 1.32024 15.1418 0.997883 13.5 1.00001C11.8582 0.997917 10.2321 1.32029 8.71528 1.94861C7.19843 2.57693 5.8207 3.49881 4.66126 4.66126C3.49881 5.8207 2.57693 7.19843 1.94861 8.71528C1.32029 10.2321 0.997917 11.8582 1.00001 13.5C0.997883 15.1418 1.32024 16.7679 1.94856 18.2848C2.57688 19.8016 3.49878 21.1793 4.66126 22.3388C5.8207 23.5012 7.19843 24.4231 8.71528 25.0514C10.2321 25.6797 11.8582 26.0021 13.5 26Z"
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
      <g mask="url(#mask0_2349_11941)">
        <path
          d="M-1.5 -1.5H28.5V28.5H-1.5V-1.5Z"
          fill="url(#paint0_linear_2349_11941)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_2349_11941"
          x1="-1.875"
          y1="-1.80103"
          x2="16.0711"
          y2="34.7219"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2357C6" />
          <stop offset="1" stopColor="#5EA8FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const SavingsHint = () => {
  return (
    <div className="absolute bottom-[-50px] right-0 hidden items-center gap-2 text-sm font-semibold text-[#2357C6] sm:flex xl:bottom-[-36px] xl:right-[-130px]">
      <span className="inline-block rotate-[-35deg] text-2xl leading-none text-black">
        ↙
      </span>
      <span>Save up to 45%</span>
    </div>
  );
};

export const PricingMain = ({
  initialProfileFeatures = [],
  initialProfileTypes = [],
  initialSubscriptionPlans = null,
  defaultProfileType = null,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileTypeList, setProfileTypeList] = useState([]);
  const [basicPlans, setBasicPlans] = useState([]);
  const [premiumPlans, setPremiumPlans] = useState([]);
  const [subscriptionResponse, setSubscriptionResponse] = useState(
    initialSubscriptionPlans
  );
  const [profileFeatures, setProfileFeatures] = useState(
    initialProfileFeatures
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userCountry] = useState(() => getUserCountryFromCookie());
  const [isSticky, setIsSticky] = useState(false);

  const locationLoading = false;

  const profileRef = useRef(null);
  const profileTypesRef = useRef([]);
  const stickySentinelRef = useRef(null);
  const scrollRafRef = useRef(null);

  const plans = [
    { plan: 'Monthly', free: '' },
    { plan: 'Quarterly', free: '1 month free' },
    { plan: 'Annually', free: '5 months free' },
  ];

  const features = [
    { title: 'Free Trial', description: "You'll love it, we know it" },
    {
      title: 'Vibrant Ecosystem',
      description: 'Connect with Mentors, Investors, Experts',
    },
    {
      title: 'Local & Global',
      description: "What you're looking for, here and there",
    },
    {
      title: 'Intuitive Design',
      description: 'Accelerate your journey with ease',
    },
  ];

  const ProfileSelect = ({
    name,
    options,
    size = 'md',
    variant = 'primary',
    className,
    ...props
  }) => {
    return (
      <select
        name={name}
        {...props}
        className={clsx(
          'outline-none',
          sizes[size],
          variants[variant],
          className
        )}
      >
        {options
          ?.filter((option) => option.label !== 'Partner')
          .map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
      </select>
    );
  };

  const applyLocalizedPlans = useCallback(
    (response) => {
      const localizedPlans = mapSubscriptionPlansWithPricing({
        subscriptions: response?.Subscriptions || [],
        plans: response?.SubscriptionPlan || [],
        pricingList: response?.SubscriptionPlanPricings || [],
        userCountry,
      });

      const { standardPlans, premiumPlans } =
        splitSubscriptionPlansByTier(localizedPlans);

      setBasicPlans(standardPlans || []);
      setPremiumPlans(premiumPlans || []);
    },
    [userCountry]
  );

  const getSubscriptionPlansForProfile = useCallback(async (profileTypeId) => {
    const response = await getSubscriptionPlanBasedOnProfileType(profileTypeId);

    setSubscriptionResponse(response);

    return response;
  }, []);

  useEffect(() => {
    if (!subscriptionResponse) {
      return;
    }

    applyLocalizedPlans(subscriptionResponse);
  }, [applyLocalizedPlans, subscriptionResponse]);

  useEffect(() => {
    const initializeData = async () => {
      if (initialProfileTypes.length > 0) {
        const filteredProfileTypes = initialProfileTypes.filter(
          (type) => type?.UserProfileName !== 'Partners'
        );

        const result = filteredProfileTypes.map((item) => ({
          id: item.Id,
          label: item.UserProfileName,
          value: item.UserProfileName,
        }));

        profileTypesRef.current = result;
        profileRef.current = result[0];

        setProfileTypeList(result);
        setSelectedProfile(result[0]);

        if (initialSubscriptionPlans) {
          setSubscriptionResponse(initialSubscriptionPlans);
        }

        return;
      }

      setLoading(true);

      try {
        const [featuresResponse, profileTypes] = await Promise.all([
          getUserProfileTypeFeatures(),
          getUserProfileType(),
        ]);

        setProfileFeatures(featuresResponse || []);

        const filteredProfileTypes = profileTypes.filter(
          (type) => type?.UserProfileName !== 'Partners'
        );

        const result = filteredProfileTypes.map((item) => ({
          id: item.Id,
          label: item.UserProfileName,
          value: item.UserProfileName,
        }));

        profileTypesRef.current = result;
        profileRef.current = result[0];

        setProfileTypeList(result);
        setSelectedProfile(result[0]);

        if (result[0]?.id) {
          await getSubscriptionPlansForProfile(result[0].id);
        }
      } catch (err) {
        console.error('Error fetching pricing data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [
    initialProfileTypes,
    initialSubscriptionPlans,
    getSubscriptionPlansForProfile,
  ]);

  useEffect(() => {
    const updateStickyState = () => {
      if (!stickySentinelRef.current) {
        return;
      }

      const shouldBeSticky =
        stickySentinelRef.current.getBoundingClientRect().top <=
        PRICING_STICKY_TOP;

      setIsSticky((previousValue) =>
        previousValue === shouldBeSticky ? previousValue : shouldBeSticky
      );
    };

    const handleScrollOrResize = () => {
      if (scrollRafRef.current) {
        return;
      }

      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = null;
        updateStickyState();
      });
    };

    updateStickyState();

    window.addEventListener('scroll', handleScrollOrResize, {
      passive: true,
    });
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      if (scrollRafRef.current) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }

      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);

  const handleTabChange = (index) => {
    setSelectedIndex(index);
  };

  const handleProfileTypeChange = async (event) => {
    const selectedProfileId = event.target.value;

    const nextProfile = profileTypeList.find(
      (profile) => profile.id == selectedProfileId
    );

    if (!nextProfile) {
      return;
    }

    const previousProfile = selectedProfile;

    setSelectedProfile(nextProfile);
    setLoading(true);
    setError(null);

    try {
      await getSubscriptionPlansForProfile(selectedProfileId);
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
      setSelectedProfile(previousProfile);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const planType = useMemo(() => {
    switch (selectedIndex) {
      case 0:
        return 'Monthly';
      case 1:
        return 'Quarterly';
      case 2:
        return 'Annually';
      default:
        return 'Monthly';
    }
  }, [selectedIndex]);

  return (
    <>
      <section
        className="relative left-0 right-0 top-0 h-[560px] pt-16 text-center sm:h-[500px] lg:h-[580px]"
        style={{
          backgroundImage: `url(${pricingbg})`,
          backgroundSize: 'cover',
        }}
      >
        <main className="mx-auto flex h-full w-full max-w-[1440px] flex-col px-4 3xl:max-w-[1600px] 2k:max-w-[1800px] xl:p-0">
          <h1 className="pt-[55px] text-[40px] font-semibold leading-normal text-blue-strong md:pt-[120px] md:text-5xl md:leading-[110%]">
            Real Access, Real Collaborations, Real Value!
          </h1>

          <div className="mx-auto mt-7 flex max-w-[100%] justify-center gap-4 small-1000:flex-wrap md:mt-10 lg:max-w-[843px] lg:gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex w-[calc(50%-8px)] max-w-xs items-start gap-3 text-left lg:w-auto"
              >
                <div className="text-xl text-blue-600">
                  <CheckIcon />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-semibold leading-[110%] text-blue-strong sm:text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-medium leading-[150%] text-text-gray sm:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mx-auto mb-[-28px] mt-auto">
            <CustomTab
              selectedIndex={selectedIndex}
              setSelectedIndex={handleTabChange}
              tabList={plans}
            />
            <svg
              className="absolute xl:right-[-130px] right-0 xl:bottom-[-36px] bottom-[-50px]"
              width="131"
              height="40"
              viewBox="0 0 131 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_3710_31598)">
                <path
                  d="M34.3727 23.0713C34.3029 22.8155 34.1344 22.598 33.9042 22.4664C33.674 22.3349 33.401 22.3002 33.1452 22.3699C28.3015 23.6893 22.2935 20.8764 19.8016 18.3846L14.7911 13.374L20.8623 13.374C20.995 13.3764 21.1269 13.3522 21.2503 13.303C21.3736 13.2538 21.4859 13.1805 21.5806 13.0874C21.6753 12.9943 21.7505 12.8833 21.8019 12.7609C21.8532 12.6384 21.8797 12.507 21.8797 12.3742C21.8797 12.2414 21.8532 12.11 21.8019 11.9875C21.7505 11.865 21.6753 11.754 21.5806 11.661C21.4859 11.5679 21.3736 11.4946 21.2503 11.4454C21.1269 11.3962 20.995 11.372 20.8623 11.3743L12.377 11.3743C12.1118 11.3744 11.8575 11.4797 11.67 11.6672C11.4825 11.8547 11.3772 12.109 11.3772 12.3742L11.3772 20.8595C11.3748 20.9922 11.399 21.1241 11.4482 21.2475C11.4974 21.3708 11.5707 21.4831 11.6638 21.5778C11.7569 21.6725 11.8679 21.7477 11.9903 21.7991C12.1128 21.8504 12.2442 21.8769 12.377 21.8769C12.5098 21.8769 12.6412 21.8504 12.7637 21.7991C12.8862 21.7477 12.9972 21.6725 13.0902 21.5778C13.1833 21.4831 13.2566 21.3708 13.3058 21.2475C13.355 21.1241 13.3792 20.9922 13.3769 20.8595L13.3769 14.7883L18.3874 19.7988C20.8446 22.256 27.6255 25.9478 33.6713 24.2988C33.927 24.229 34.1446 24.0605 34.2761 23.8303C34.4077 23.6001 34.4424 23.3271 34.3727 23.0713Z"
                  fill="black"
                />
              </g>
              <path
                d="M44.1757 24.9968C42.8317 24.9968 41.7957 24.6654 41.0677 24.0028C40.349 23.3401 39.9617 22.4768 39.9057 21.4128H41.1377C41.3057 23.1301 42.337 23.9888 44.2317 23.9888C44.9503 23.9888 45.5243 23.8301 45.9537 23.5128C46.3923 23.1861 46.6117 22.7194 46.6117 22.1128C46.6117 21.8421 46.5603 21.6041 46.4577 21.3988C46.355 21.1934 46.229 21.0254 46.0797 20.8948C45.9397 20.7641 45.725 20.6428 45.4357 20.5308C45.1463 20.4188 44.8757 20.3301 44.6237 20.2648C44.381 20.1994 44.045 20.1201 43.6157 20.0268C43.1023 19.9148 42.6777 19.8028 42.3417 19.6908C42.0057 19.5694 41.6697 19.4061 41.3337 19.2008C40.9977 18.9954 40.7457 18.7341 40.5777 18.4168C40.419 18.0901 40.3397 17.6981 40.3397 17.2408C40.3397 16.4194 40.6477 15.7754 41.2637 15.3088C41.889 14.8328 42.715 14.5948 43.7417 14.5948C45.991 14.5948 47.2557 15.6354 47.5357 17.7168H46.3457C46.2523 17.0074 45.9863 16.4754 45.5477 16.1208C45.109 15.7568 44.5163 15.5748 43.7697 15.5748C43.079 15.5748 42.5283 15.7148 42.1177 15.9948C41.7163 16.2748 41.5157 16.6714 41.5157 17.1848C41.5157 17.4088 41.5577 17.6094 41.6417 17.7868C41.735 17.9548 41.8517 18.0994 41.9917 18.2208C42.141 18.3328 42.3323 18.4354 42.5657 18.5288C42.8083 18.6221 43.0463 18.7014 43.2797 18.7668C43.513 18.8228 43.7977 18.8834 44.1337 18.9488C44.6003 19.0421 44.983 19.1308 45.2817 19.2148C45.5803 19.2894 45.9117 19.4061 46.2757 19.5648C46.6397 19.7234 46.9197 19.9054 47.1157 20.1108C47.321 20.3161 47.4937 20.5868 47.6337 20.9228C47.783 21.2494 47.8577 21.6321 47.8577 22.0708C47.8577 22.9854 47.517 23.7041 46.8357 24.2268C46.1637 24.7401 45.277 24.9968 44.1757 24.9968ZM54.8153 24.8708C54.0967 24.8708 53.6813 24.5114 53.5693 23.7928H53.5553C52.958 24.5581 52.1553 24.9408 51.1473 24.9408C50.4287 24.9408 49.8407 24.7681 49.3833 24.4228C48.926 24.0774 48.6973 23.5781 48.6973 22.9248C48.6973 22.5888 48.7487 22.2994 48.8513 22.0568C48.9633 21.8048 49.1033 21.6041 49.2713 21.4548C49.4393 21.2961 49.668 21.1608 49.9573 21.0488C50.256 20.9274 50.5407 20.8388 50.8113 20.7828C51.082 20.7174 51.4273 20.6521 51.8473 20.5868C52.118 20.5494 52.3093 20.5214 52.4213 20.5028C52.5427 20.4748 52.6967 20.4374 52.8833 20.3908C53.07 20.3348 53.2007 20.2741 53.2753 20.2088C53.35 20.1434 53.42 20.0548 53.4853 19.9428C53.5507 19.8308 53.5833 19.7001 53.5833 19.5508C53.5833 19.1401 53.4387 18.8274 53.1493 18.6128C52.8693 18.3888 52.4727 18.2768 51.9593 18.2768C50.7927 18.2768 50.1907 18.8088 50.1533 19.8728H49.0613C49.08 19.1354 49.332 18.5428 49.8173 18.0948C50.312 17.6468 51.0213 17.4228 51.9453 17.4228C53.728 17.4228 54.6193 18.1881 54.6193 19.7188V23.1628C54.6193 23.4801 54.6707 23.7041 54.7733 23.8348C54.8853 23.9654 55.0907 23.9981 55.3893 23.9328H55.4313V24.7588C55.2447 24.8334 55.0393 24.8708 54.8153 24.8708ZM51.3993 24.0728C52.0993 24.0728 52.6407 23.8721 53.0233 23.4708C53.406 23.0601 53.5973 22.6121 53.5973 22.1268V20.8948C53.252 21.1094 52.7013 21.2868 51.9453 21.4268C51.6653 21.4828 51.446 21.5294 51.2873 21.5668C51.1287 21.5948 50.9467 21.6508 50.7413 21.7348C50.536 21.8094 50.382 21.8934 50.2793 21.9868C50.1767 22.0801 50.088 22.2061 50.0133 22.3648C49.9387 22.5141 49.9013 22.6914 49.9013 22.8968C49.9013 23.6808 50.4007 24.0728 51.3993 24.0728ZM57.9233 24.8008L55.3893 17.5628H56.6073L58.1053 22.1548L58.5813 23.6808H58.6093C58.7867 23.0834 58.9453 22.5748 59.0853 22.1548L60.6113 17.5628H61.7873L59.1833 24.8008H57.9233ZM65.5417 24.9968C64.4684 24.9968 63.6144 24.6374 62.9797 23.9188C62.3544 23.1908 62.0417 22.2808 62.0417 21.1888C62.0417 20.1154 62.3591 19.2148 62.9937 18.4868C63.6377 17.7494 64.4637 17.3808 65.4717 17.3808C66.5357 17.3808 67.3571 17.7541 67.9357 18.5008C68.5144 19.2381 68.8037 20.2228 68.8037 21.4548H63.2037C63.2504 22.2201 63.4744 22.8454 63.8757 23.3308C64.2864 23.8068 64.8417 24.0448 65.5417 24.0448C66.6244 24.0448 67.2917 23.5501 67.5437 22.5608H68.6497C68.4817 23.3354 68.1271 23.9374 67.5857 24.3668C67.0444 24.7868 66.3631 24.9968 65.5417 24.9968ZM66.9837 18.8928C66.6197 18.4821 66.1157 18.2768 65.4717 18.2768C64.8277 18.2768 64.3144 18.4914 63.9317 18.9208C63.5584 19.3501 63.3251 19.9101 63.2317 20.6008H67.5857C67.5484 19.8728 67.3477 19.3034 66.9837 18.8928ZM77.8811 24.8008H76.7471V23.8068H76.7191C76.1498 24.5814 75.4218 24.9688 74.5351 24.9688C73.7884 24.9688 73.1958 24.7588 72.7571 24.3388C72.3184 23.9094 72.0991 23.3214 72.0991 22.5748V17.5628H73.2331V22.5468C73.2331 23.0134 73.3731 23.3774 73.6531 23.6388C73.9424 23.9001 74.3438 24.0308 74.8571 24.0308C75.4264 24.0308 75.8838 23.8394 76.2291 23.4568C76.5744 23.0741 76.7471 22.5934 76.7471 22.0148V17.5628H77.8811V24.8008ZM79.4145 27.1248V17.5628H80.5485V18.5848H80.5765C81.1645 17.7914 81.9392 17.3948 82.9005 17.3948C83.8339 17.3948 84.5852 17.7354 85.1545 18.4168C85.7239 19.0888 86.0085 20.0174 86.0085 21.2028C86.0085 22.3694 85.7285 23.2981 85.1685 23.9888C84.6085 24.6701 83.8385 25.0108 82.8585 25.0108C81.8879 25.0108 81.1272 24.6561 80.5765 23.9468H80.5485V27.1248H79.4145ZM82.7745 24.0588C83.4465 24.0588 83.9599 23.7974 84.3145 23.2748C84.6692 22.7521 84.8465 22.0661 84.8465 21.2168C84.8465 20.3674 84.6692 19.6814 84.3145 19.1588C83.9599 18.6268 83.4512 18.3608 82.7885 18.3608C82.0325 18.3608 81.4585 18.6314 81.0665 19.1728C80.6745 19.7048 80.4785 20.3861 80.4785 21.2168C80.4785 22.0661 80.6652 22.7521 81.0385 23.2748C81.4119 23.7974 81.9905 24.0588 82.7745 24.0588ZM88.9057 18.4868V17.5628H89.9557V15.2808H91.0897V17.5628H92.4897V18.4868H91.0897V23.1908C91.0897 23.6388 91.3323 23.8628 91.8177 23.8628C92.023 23.8628 92.2237 23.8301 92.4197 23.7648H92.4617V24.7448C92.1537 24.8101 91.8503 24.8428 91.5517 24.8428C90.4877 24.8428 89.9557 24.3761 89.9557 23.4428V18.4868H88.9057ZM99.2203 23.9048C98.5856 24.6328 97.7409 24.9968 96.6863 24.9968C95.6316 24.9968 94.7823 24.6328 94.1383 23.9048C93.5036 23.1768 93.1863 22.2714 93.1863 21.1888C93.1863 20.1061 93.5036 19.2008 94.1383 18.4728C94.7823 17.7448 95.6316 17.3808 96.6863 17.3808C97.7409 17.3808 98.5856 17.7448 99.2203 18.4728C99.8549 19.2008 100.172 20.1061 100.172 21.1888C100.172 22.2714 99.8549 23.1768 99.2203 23.9048ZM94.9503 23.2468C95.3609 23.7788 95.9396 24.0448 96.6863 24.0448C97.4329 24.0448 98.0069 23.7788 98.4083 23.2468C98.8096 22.7054 99.0103 22.0194 99.0103 21.1888C99.0103 20.3488 98.8049 19.6628 98.3943 19.1308C97.9929 18.5894 97.4236 18.3188 96.6863 18.3188C95.9396 18.3188 95.3609 18.5894 94.9503 19.1308C94.5489 19.6721 94.3483 20.3581 94.3483 21.1888C94.3483 22.0194 94.5489 22.7054 94.9503 23.2468ZM107.648 24.8008V22.4488H103.126V21.3988L107.872 15.1128H108.796V21.5108H110.378V22.4488H108.796V24.8008H107.648ZM104.26 21.4688V21.5108H107.648V17.0168H107.62L104.26 21.4688ZM114.541 25.0108C113.543 25.0108 112.712 24.7354 112.049 24.1848C111.396 23.6341 111.051 22.9154 111.013 22.0288H112.175C112.25 22.6354 112.493 23.1114 112.903 23.4568C113.314 23.8021 113.855 23.9748 114.527 23.9748C115.209 23.9748 115.755 23.7648 116.165 23.3448C116.576 22.9154 116.781 22.3508 116.781 21.6508C116.781 20.9508 116.567 20.3954 116.137 19.9848C115.717 19.5741 115.181 19.3688 114.527 19.3688C113.557 19.3688 112.838 19.7001 112.371 20.3628H111.237L112.301 15.2108H117.411V16.2608H113.127L112.497 19.1448H112.525C113.095 18.6034 113.827 18.3328 114.723 18.3328C115.619 18.3328 116.385 18.6361 117.019 19.2428C117.663 19.8494 117.985 20.6614 117.985 21.6788C117.985 22.6868 117.663 23.4941 117.019 24.1008C116.375 24.7074 115.549 25.0108 114.541 25.0108ZM122.521 19.7748C122.11 20.2788 121.569 20.5308 120.897 20.5308C120.225 20.5308 119.679 20.2788 119.259 19.7748C118.839 19.2708 118.629 18.5988 118.629 17.7588C118.629 16.9188 118.844 16.2468 119.273 15.7428C119.702 15.2388 120.244 14.9868 120.897 14.9868C121.55 14.9868 122.087 15.2388 122.507 15.7428C122.927 16.2374 123.137 16.9094 123.137 17.7588C123.137 18.5988 122.932 19.2708 122.521 19.7748ZM128.723 24.2548C128.312 24.7588 127.771 25.0108 127.099 25.0108C126.427 25.0108 125.881 24.7588 125.461 24.2548C125.041 23.7508 124.831 23.0788 124.831 22.2388C124.831 21.3988 125.046 20.7268 125.475 20.2228C125.904 19.7188 126.446 19.4668 127.099 19.4668C127.752 19.4668 128.289 19.7188 128.709 20.2228C129.129 20.7174 129.339 21.3894 129.339 22.2388C129.339 23.0788 129.134 23.7508 128.723 24.2548ZM120.757 24.8008L126.259 15.2108H127.211L121.709 24.8008H120.757ZM120.001 19.1588C120.216 19.5134 120.514 19.6908 120.897 19.6908C121.28 19.6908 121.574 19.5134 121.779 19.1588C121.994 18.8041 122.101 18.3374 122.101 17.7588C122.101 17.1988 121.994 16.7368 121.779 16.3728C121.564 16.0088 121.27 15.8268 120.897 15.8268C120.514 15.8268 120.216 16.0041 120.001 16.3588C119.796 16.7134 119.693 17.1801 119.693 17.7588C119.693 18.3281 119.796 18.7948 120.001 19.1588ZM126.203 23.6388C126.418 23.9934 126.716 24.1708 127.099 24.1708C127.482 24.1708 127.776 23.9934 127.981 23.6388C128.196 23.2841 128.303 22.8174 128.303 22.2388C128.303 21.6788 128.196 21.2168 127.981 20.8528C127.766 20.4888 127.472 20.3068 127.099 20.3068C126.716 20.3068 126.418 20.4841 126.203 20.8388C125.998 21.1934 125.895 21.6601 125.895 22.2388C125.895 22.8081 125.998 23.2748 126.203 23.6388Z"
                fill="#2357C6"
              />
              <defs>
                <clipPath id="clip0_3710_31598">
                  <rect
                    width="28"
                    height="28"
                    fill="white"
                    transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 19.8008 39.5977)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </main>
      </section>

      <div className="mb-20" />

      <div className="relative z-10 bg-white">
        <div ref={stickySentinelRef} className="h-px w-full" />

        <div
          className="sticky z-30 hidden md:block"
          style={{ top: `${PRICING_STICKY_TOP}px` }}
        >
          <div className="mx-auto w-full max-w-[1440px] 3xl:max-w-[1600px] 2k:max-w-[1800px]">
            <div
              className={clsx(
                'flex flex-col items-center gap-4 p-3 transition-all duration-300 md:flex-row lg:px-14',
                isSticky ? 'py-3' : 'py-8'
              )}
            >
              <div
                className={clsx(
                  'flex flex-col gap-5 transition-all duration-300',
                  isSticky ? 'hidden' : 'items-center md:items-start'
                )}
              >
                <h2 className="text-center text-[34px] font-bold leading-[normal] tracking-[0.48px] text-[#16357A] md:text-left xl:text-5xl">
                  Deep dive into
                  <span className="bg-gradient-to-r from-[#2357C6] to-[#5EA8FF] bg-clip-text pl-[4px] text-transparent md:block md:pl-0">
                    Orisuun Plans
                  </span>
                </h2>

                <div className="flex w-full flex-col items-center gap-5 small-500:mx-0 lg:flex-row">
                  <ProfileSelect
                    name="profileType"
                    className="h-[57px] border-r-[24px] bg-[#F8F8F8] pl-6 text-base font-semibold text-[#1B3C7B] small-500:w-full md:h-[69px] xl:w-[360px] xl:!text-xl !rounded-[66px]"
                    options={profileTypeList}
                    onChange={handleProfileTypeChange}
                    value={selectedProfile?.id}
                    disabled={loading || locationLoading}
                  />
                </div>
              </div>

              <div className="small-767:mt-6 small-767:w-full md:ml-auto">
                <Prices
                  basicPlanList={basicPlans}
                  premiumPlanList={premiumPlans}
                  basicPlanDetails={basicPlanDetails}
                  premiumPlanDetails={premiumPlanDetails}
                  planType={planType}
                  profile={selectedProfile}
                  isSticky={isSticky}
                />
              </div>
            </div>
          </div>
        </div>

        <PricesFeature
          basicPlanList={basicPlans}
          premiumPlanList={premiumPlans}
          basicPlanDetails={basicPlanDetails}
          premiumPlanDetails={premiumPlanDetails}
          planType={planType}
          profile={selectedProfile}
        />
      </div>
    </>
  );
};