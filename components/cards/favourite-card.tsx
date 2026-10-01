'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Modal from '../ui/modal/modal';
import BottomSheet from '../ui/bottom-sheet';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { favouriteCardApi } from '@/app/api/dashboard/favourites';
import { resolveUserProfileImageSrc } from '@/utils/image-url';

interface IProps {
  data?: any
  setGetListing?: any
  setUsedData?: any
  setFavouriteData?: any
  setExpireData?: any
  setIsNewData?: any
  setMostPopulatedData?: any
}

const getCompanyInitials = (name?: string) => {
  const initials = (name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return initials || 'OB';
};

const FavouriteCard: React.FC<IProps> = ({ data, setUsedData, setFavouriteData, setExpireData, setIsNewData, setMostPopulatedData }: any) => {
  const router = useRouter()
  const [showDiscountCode, setShowDiscountCode] = useState(false);
  const [showDiscountCodeSheet, setShowDiscountCodeSheet] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isGettingCode, setIsGettingCode] = useState(false);
  const [coupne, setCoupon] = useState('');
  const [remainingCode, setRemainingCode] = useState('')
  const isMobile = useMobileMediaQuery();
  const [isFavourite, setIsFavourite] = useState<boolean>(!!data?.IsFavourite);
  const [hasLogoError, setHasLogoError] = useState(false);
  const companyLogo = resolveUserProfileImageSrc(data?.CompanyLogo);

  // keep local state in sync if parent passes a new data prop
  useEffect(() => {
    setIsFavourite(!!data?.IsFavourite);
  }, [data?.IsFavourite]);

  useEffect(() => {
    setHasLogoError(false);
  }, [data?.CompanyLogo]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleGetCode = async (id: any) => {
    try {
      setIsGettingCode(true);
      const userData = JSON.parse(localStorage.getItem('userData'));
      const getCoupne = await favouriteCardApi.getCompanyWiseCouponCode(id, userData?.Id);

      setCoupon(getCoupne.Code);
      setRemainingCode(getCoupne.RemainingDiscount);

      const discountDetails = await favouriteCardApi.getDiscountDetails(userData?.Id);
      if (discountDetails) {
        const result = discountDetails.Result;
        isMobile
          ? setShowDiscountCodeSheet(!showDiscountCodeSheet)
          : setShowDiscountCode(!showDiscountCode);
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || "Failed to get coupon code");
    } finally {
      setIsGettingCode(false);
    }
  };

  const handleFavourite = async (id: number, fav: boolean) => {
    const previous = isFavourite;
    try {
      // optimistic UI update
      setIsFavourite(fav);
      const userData = JSON.parse(localStorage.getItem('userData'));
      const favouriteResponse = await favouriteCardApi.setFavouriteDiscount(id, userData?.Id, fav);

      if (favouriteResponse) {
        toast.success(fav ? "Favourite added" : "Favourite removed");
        const discountDetails = await favouriteCardApi.getDiscountDetails(userData?.Id);
        if (discountDetails) {
          const result = discountDetails.Result;
          setFavouriteData(result.filter((item: any) => item.IsFavourite === true));
          setExpireData(result.filter((item: any) => item.IsExpiringSoon === true));
          setUsedData(result.filter((item: any) => item.IsExpired === true));
          setIsNewData(result.filter((item: any) => item.IsNew === true));
          setMostPopulatedData(result.filter((item: any) => item.IsMostPopulated === true));
        }
      } else {
        // revert if API didn't succeed
        setIsFavourite(previous);
      }
    } catch (error) {
      setIsFavourite(previous);
      toast.error(error?.response?.data?.Message || "Failed to update favourite");
    }
  };

  return (
    <div
      className={data?.HomepageSliderCard
        ? 'aspect-[252/251] w-full rounded-[4.18px] border-[0.56px] border-gray-200 bg-white p-[11.15px] shadow-sm transition hover:shadow-md'
        : 'h-full w-full cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md'
      }
      onClick={() => {
        if (!data?.DisableNavigation) {
          router.push(`/discount-portal/${data?.Id}`);
        }
      }}
    >
      <div className={data?.HomepageSliderCard
        ? 'flex w-full flex-col gap-[16.73px]'
        : 'flex h-full w-full flex-col gap-6'
      }>
        {/* Header with Logo and Actions */}
        <div className="flex items-start gap-4 justify-between">
          <div className="flex flex-col items-start gap-4 flex-1">
            <div
              className={`${data?.HomepageSliderCard ? 'h-10 w-10 text-sm' : 'h-20 w-20 text-xl'} flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-omblue-50 font-bold text-omblue-700`}
            >
              {companyLogo && !hasLogoError ? (
                <Image
                  src={companyLogo}
                  alt={`${data?.CompanyName || 'Business'} logo`}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                  onError={() => setHasLogoError(true)}
                />
              ) : (
                <span aria-label={`${data?.CompanyName || 'Business'} initials`}>
                  {getCompanyInitials(data?.CompanyName)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full justify-between">
              <div className={`flex-1 ${data?.HomepageSliderCard ? 'flex flex-col gap-[6.97px]' : 'space-y-1'}`}>
                <h2 className={data?.HomepageSliderCard
                  ? 'h-[17px] w-[173px] max-w-full truncate text-[13.94px] font-semibold leading-[16.73px] tracking-normal text-black-900'
                  : 'line-clamp-1 text-h5 font-bold text-black-900 2xl:text-scaled-h5'
                }>
                  {data?.CompanyName}
                </h2>
                <p className={data?.HomepageSliderCard
                  ? 'h-[12px] max-w-[141px] truncate whitespace-nowrap text-[11.15px] font-medium leading-[11.15px] tracking-normal text-gray-500'
                  : `line-clamp-2 text-h7 text-gray-500 2xl:text-scaled-h7 ${data?.SloganSingleLine ? 'whitespace-nowrap' : ''}`
                }>
                  {data?.CompanySlogan}
                </p>
              </div>

              <div className={data?.HomepageSliderCard
                ? 'flex h-[22.31px] w-[44.61px] flex-shrink-0 items-center gap-[5.58px] [&_svg]:h-[19.52px] [&_svg]:w-[19.52px]'
                : 'flex flex-shrink-0 items-center gap-2'
              }>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavourite(data?.Id, !isFavourite);
                  }}
                  title={isFavourite ? 'Remove favourite' : 'Add favourite'}
                  className={data?.HomepageSliderCard
                    ? 'bg-white transition'
                    : 'p-2 bg-white transition'
                  }
                >
                  {isFavourite ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.5248 2.29489C11.5687 2.20635 11.6364 2.13183 11.7203 2.07972C11.8042 2.02761 11.9011 2 11.9998 2C12.0986 2 12.1955 2.02761 12.2794 2.07972C12.3633 2.13183 12.431 2.20635 12.4748 2.29489L14.7848 6.97389C14.937 7.28186 15.1617 7.5483 15.4395 7.75035C15.7173 7.95239 16.04 8.08401 16.3798 8.13389L21.5458 8.88989C21.6437 8.90408 21.7357 8.94537 21.8113 9.00909C21.887 9.07282 21.9433 9.15644 21.9739 9.2505C22.0045 9.34456 22.0081 9.4453 21.9844 9.54133C21.9607 9.63736 21.9107 9.72485 21.8398 9.79389L18.1038 13.4319C17.8575 13.672 17.6731 13.9684 17.5667 14.2955C17.4602 14.6227 17.4349 14.9708 17.4928 15.3099L18.3748 20.4499C18.3921 20.5477 18.3816 20.6485 18.3443 20.7406C18.3071 20.8327 18.2448 20.9125 18.1644 20.9709C18.084 21.0293 17.9888 21.0639 17.8897 21.0708C17.7906 21.0777 17.6915 21.0566 17.6038 21.0099L12.9858 18.5819C12.6816 18.4221 12.343 18.3386 11.9993 18.3386C11.6557 18.3386 11.3171 18.4221 11.0128 18.5819L6.39585 21.0099C6.30818 21.0563 6.20924 21.0772 6.1103 21.0701C6.01135 21.0631 5.91636 21.0285 5.83614 20.9701C5.75592 20.9118 5.69368 20.8321 5.6565 20.7401C5.61933 20.6481 5.6087 20.5476 5.62585 20.4499L6.50685 15.3109C6.56504 14.9716 6.53983 14.6233 6.43338 14.2959C6.32694 13.9686 6.14246 13.672 5.89585 13.4319L2.15985 9.79489C2.08844 9.72593 2.03784 9.63829 2.01381 9.54197C1.98978 9.44565 1.99328 9.34451 2.02393 9.25008C2.05457 9.15566 2.11111 9.07174 2.18712 9.00788C2.26313 8.94402 2.35555 8.90279 2.45385 8.88889L7.61885 8.13389C7.9591 8.08439 8.28224 7.95295 8.56043 7.75088C8.83863 7.54881 9.06355 7.28216 9.21585 6.97389L11.5248 2.29489Z" fill="#2357C6" stroke="#5B657B" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.5248 2.29489C11.5687 2.20635 11.6364 2.13183 11.7203 2.07972C11.8042 2.02761 11.9011 2 11.9998 2C12.0986 2 12.1955 2.02761 12.2794 2.07972C12.3633 2.13183 12.431 2.20635 12.4748 2.29489L14.7848 6.97389C14.937 7.28186 15.1617 7.5483 15.4395 7.75035C15.7173 7.95239 16.04 8.08401 16.3798 8.13389L21.5458 8.88989C21.6437 8.90408 21.7357 8.94537 21.8113 9.00909C21.887 9.07282 21.9433 9.15644 21.9739 9.2505C22.0045 9.34456 22.0081 9.4453 21.9844 9.54133C21.9607 9.63736 21.9107 9.72485 21.8398 9.79389L18.1038 13.4319C17.8575 13.672 17.6731 13.9684 17.5667 14.2955C17.4602 14.6227 17.4349 14.9708 17.4928 15.3099L18.3748 20.4499C18.3921 20.5477 18.3816 20.6485 18.3443 20.7406C18.3071 20.8327 18.2448 20.9125 18.1644 20.9709C18.084 21.0293 17.9888 21.0639 17.8897 21.0708C17.7906 21.0777 17.6915 21.0566 17.6038 21.0099L12.9858 18.5819C12.6816 18.4221 12.343 18.3386 11.9993 18.3386C11.6557 18.3386 11.3171 18.4221 11.0128 18.5819L6.39585 21.0099C6.30818 21.0563 6.20924 21.0772 6.1103 21.0701C6.01135 21.0631 5.91636 21.0285 5.83614 20.9701C5.75592 20.9118 5.69368 20.8321 5.6565 20.7401C5.61933 20.6482 5.6087 20.5476 5.62585 20.4499L6.50685 15.3109C6.56504 14.9716 6.53983 14.6233 6.43338 14.2959C6.32694 13.9686 6.14245 13.672 5.89585 13.4319L2.15985 9.79489C2.08844 9.72593 2.03784 9.63829 2.01381 9.54197C1.98978 9.44565 1.99328 9.34451 2.02393 9.25008C2.05457 9.15566 2.11111 9.07174 2.18712 9.00788C2.26313 8.94402 2.35555 8.90279 2.45385 8.88889L7.61885 8.13389C7.9591 8.08439 8.28224 7.95295 8.56043 7.75088C8.83863 7.54881 9.06355 7.28216 9.21585 6.97389L11.5248 2.29489Z" stroke="#5B657B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                  )}
                </button>
                <a
                  className="bg-white  transition"
                  href={data.DiscountCreateWebsite}
                  target="_blank"
                  title="Website"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="#BBCBED" />
                    <path d="M13.9997 19.3337H12.6663C11.7823 19.3337 10.9344 18.9825 10.3093 18.3573C9.6842 17.7322 9.33301 16.8844 9.33301 16.0003C9.33301 15.1163 9.6842 14.2684 10.3093 13.6433C10.9344 13.0182 11.7823 12.667 12.6663 12.667H13.9997M17.9997 12.667H19.333C20.2171 12.667 21.0649 13.0182 21.69 13.6433C22.3152 14.2684 22.6663 15.1163 22.6663 16.0003C22.6663 16.8844 22.3152 17.7322 21.69 18.3573C21.0649 18.9825 20.2171 19.3337 19.333 19.3337H17.9997M13.333 16.0003H18.6663" stroke="#2357C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Discount Offer */}
        <div className="space-y-2">
          <p className={data?.HomepageSliderCard
            ? 'whitespace-nowrap text-[13.94px] font-semibold leading-[16.73px] tracking-normal text-[#107C5D]'
            : 'text-xl md:text-32xl font-bold text-[#107C5D]'
          }>
            {data?.HomepageSliderCard
              ? data?.DiscountTitle || '50% OFF of the subscription'
              : '50% OFF of the subscription'}
          </p>
        </div>

        {/* Company Description */}
        {data?.HomepageSliderCard ? (
          <p className="relative h-[44px] w-[229.32px] max-w-full overflow-hidden text-[13px] leading-[14.64px] tracking-wide text-gray-600">
            <span className="line-clamp-3">
              {data?.CompanyDescription}
            </span>
            <span className="absolute bottom-0 right-0 bg-white pl-1 font-semibold text-omblue-600">
              View more
            </span>
          </p>
        ) : (
          <p className="line-clamp-3 flex-1 text-h8 font-medium text-gray-600 2xl:text-scaled-h8">
            {data?.CompanyDescription
              ? data?.CompanyDescription
              : 'TechWave Innovations is a dynamic technology company dedicated to creating cutting-edge solutions that redefine industry standards'}
            <a href="#" className="text-omblue-600 font-semibold ml-1">View more</a>
          </p>
        )}

        {data?.HomepageSliderCard ? (
          <div className="space-y-3">
        <button
          type="button"
          disabled={isGettingCode}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-omblue-500 py-2 font-semibold text-white transition hover:bg-omblue-600 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={(e) => {
            e.stopPropagation();
            handleGetCode(data?.Id);
          }}
        >
          {isGettingCode && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {isGettingCode ? 'Getting...' : 'Get the code'}
        </button>
        <p className="text-center text-gray-500 text-h9 2xl:text-scaled-h9 font-medium">
          Expiry: {data?.ExpiryDate}
        </p>
      </div>
      ):
      (
      <div className="mt-auto space-y-3">
        <button
          type="button"
          disabled={isGettingCode}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-omblue-500 py-2 font-semibold text-white transition hover:bg-omblue-600 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={(e) => {
            handleGetCode(data?.Id);
            e.stopPropagation();
          }}
        >
          {isGettingCode && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {isGettingCode ? 'Getting...' : 'Get the code'}
        </button>
        <p className="text-center text-gray-500 text-h9 2xl:text-scaled-h9 font-medium">
          Expiry: {data?.ExpiryDate}
        </p>
      </div> 
        )}

    </div>
      {
    data?.HomepageSliderCard && (
      <>
        <Modal
          showModal={showDiscountCode}
          setShowModal={setShowDiscountCode}
          modalSize="sm"

        >
          <div className="-mx-6 -mt-6 mb-6">
            <div className="bg-omblue-50 py-12 flex items-center justify-center rounded-t-lg">
              <svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M170.942 105.121L154.802 121.321V144.181C154.802 151.321 149.042 157.081 141.902 157.081H119.042L102.842 173.281C97.8021 178.321 89.6421 178.321 84.5421 173.281L68.4021 157.081H45.5421C38.4021 157.081 32.5821 151.321 32.5821 144.181V121.321L16.4421 105.121C11.4021 100.081 11.4021 91.9214 16.4421 86.8814L32.5821 70.6814V47.8214C32.5821 40.6814 38.4021 34.9214 45.5421 34.9214H68.4021L84.5421 18.7214C89.6421 13.6814 97.8021 13.6814 102.842 18.7214L119.042 34.9214H141.902C149.042 34.9214 154.802 40.6814 154.802 47.8214V70.6814L170.942 86.8814C176.042 91.9214 176.042 100.081 170.942 105.121Z" fill="#2357C6" />
                <path d="M130.259 59.7667L62.1594 127.927C61.4394 128.587 60.5394 128.947 59.6394 128.947C58.7394 128.947 57.8394 128.587 57.1194 127.927C56.7594 127.567 56.5194 127.147 56.3394 126.727V126.667C55.8594 125.407 56.0994 123.907 57.1194 122.887L125.219 54.7867C126.299 53.7667 127.799 53.4667 129.119 54.0067C129.539 54.1867 129.959 54.4867 130.259 54.7867C131.639 56.1667 131.639 58.3867 130.259 59.7667ZM107.039 126.907C101.819 128.887 96.0594 127.147 92.8194 123.007C92.7594 123.007 92.7594 122.947 92.7594 122.947C91.9794 121.927 91.3794 120.847 90.8994 119.587C88.4394 113.107 91.7394 105.847 98.2194 103.447C102.539 101.827 107.159 102.727 110.519 105.427C112.199 106.747 113.579 108.607 114.419 110.767C116.819 117.247 113.519 124.507 107.039 126.907ZM89.1594 79.2067C83.9394 81.1867 78.24 79.4467 74.9394 75.3067C74.1594 74.2867 73.4994 73.1467 73.02 71.8867C70.56 65.4067 73.86 58.1467 80.34 55.7467C84.66 54.1267 89.34 55.0267 92.64 57.7267C92.7 57.7867 92.64 57.7867 92.64 57.7867C94.38 59.0467 95.7 60.9067 96.54 63.0667C98.9394 69.5467 95.6394 76.8067 89.1594 79.2067Z" fill="#E0E0E0" />
                <path d="M170.939 105.122L154.799 121.322V144.182C154.799 151.322 149.039 157.082 141.899 157.082H135.779V34.9219H141.899C149.039 34.9219 154.799 40.6819 154.799 47.8219V70.6819L170.939 86.8819C176.039 91.9219 176.039 100.082 170.939 105.122Z" fill="#2357C6" />
                <path d="M128.339 57.8467L60.2394 125.947C59.5194 126.667 58.6194 127.027 57.7194 127.027C57.2394 127.027 56.7594 126.907 56.3394 126.727V126.667C55.8594 125.407 56.0994 123.907 57.1194 122.887L125.219 54.7867C126.299 53.7667 127.799 53.4667 129.119 54.0067C129.659 55.3267 129.359 56.8267 128.339 57.8467ZM105.119 124.987C100.799 126.607 96.1194 125.707 92.8194 123.007C92.7594 123.007 92.7594 122.947 92.7594 122.947C91.9794 121.927 91.3794 120.847 90.8994 119.587C88.4394 113.107 91.7394 105.847 98.2194 103.447C102.539 101.827 107.159 102.727 110.519 105.427C111.299 106.447 111.959 107.587 112.439 108.847C114.899 115.327 111.599 122.587 105.119 124.987ZM87.2394 77.2867C82.9194 78.9067 78.2394 78.0067 74.9394 75.3067C74.1594 74.2867 73.4994 73.1467 73.02 71.8867C70.56 65.4067 73.86 58.1467 80.34 55.7467C84.66 54.1267 89.34 55.0267 92.64 57.7267C92.7 57.7867 92.64 57.7867 92.64 57.7867C93.48 58.8067 94.08 59.8867 94.56 61.1467C97.0194 67.6267 93.7194 74.8867 87.2394 77.2867Z" fill="#EEEEEE" />
              </svg>

            </div>
          </div>

          <div className="px-6 pb-6">
            <h2 className="text-2xl font-bold text-black-900 mb-2">
              Your discount code for <span className="text-omblue-600">{data?.CompanyName}</span>
            </h2>
            <p className="text-gray-600 text-base mb-6">Your code is valid until {data?.ExpiryDate}</p>

            <div className="flex items-center gap-2 mb-6">
              <input
                type="text"
                readOnly
                value={coupne}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base font-semibold text-black-900 bg-gray-50"
              />
              <button
                onClick={(e) => {
                  copyToClipboard(coupne);
                  e.stopPropagation();
                }}
                className="bg-omblue-500 hover:bg-omblue-600 text-white font-semibold py-3 px-6 rounded-lg transition whitespace-nowrap"
              >
                {isCopied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="flex items-start gap-3 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-teal-700 font-medium text-sm">
                You can get a code from this company <span className="font-bold">{remainingCode} more times</span>
              </p>
            </div>
          </div>
        </Modal>
        <BottomSheet
          isOpen={showDiscountCodeSheet}
          onClose={(e) => {
            setShowDiscountCodeSheet(false);
            e.stopPropagation();
          }}
        >
          <div className="space-y-6">
            <h5 className="text-xl font-bold text-black-900">
              Your discount code for{' '}
              <span className="text-omblue-600">{data?.CompanyName}</span>
            </h5>
            <p className="text-gray-600 text-base">
              Your code is valid until {data?.ExpiryDate}
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={coupne}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base font-semibold text-black-900 bg-gray-50"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(coupne);
                }}
                className="bg-omblue-500 hover:bg-omblue-600 text-white font-semibold py-3 px-6 rounded-lg transition whitespace-nowrap"
              >
                {isCopied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="flex items-start gap-3 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-teal-700 font-medium text-sm">
                You can get a code from this company <span className="font-bold">{remainingCode} more times</span>
              </p>
            </div>
          </div>
        </BottomSheet>
      </>
    )
  }
      
    </div >
  );
};

export default FavouriteCard;
