'use client';

import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import Favourite from '@/icons/favourite';
import Globe from '@/icons/globe';
import GoTo from '@/icons/go-to';
import FileIconAlt from '@/icons/upload-icons/file-icon-alt';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import Modal from '../ui/modal/modal';
import { toast } from 'react-toastify';
import Input from '../ui/input';
import Note from '../ui/note';
import BottomSheet from '../ui/bottom-sheet';
import DeFavourite from '@/icons/deFavourite';
import { discountApi } from '@/app/api/dashboard/favourites';
import { resolveUserProfileImageSrc } from '@/utils/image-url';

interface SimilarDiscountCard {
  Id: number;
  CompanyName?: string;
  CompanySlogan?: string;
  CompanyLogo?: string;
  DiscountDescription?: string;
  ExpiryDate?: string;
  IsFavourite?: boolean;
  DiscountCreateWebsite?: string;
  DiscountTitle?: string;
  DiscountHeading?: string;
  DiscountValue?: string;
  CompanyDescription?: string;
}

const FavouriteCardDetails = ({
  showGlobe = false,
  discoutData,
}: {
  showGlobe?: boolean;
  discoutData?: any;
}) => {
  const isMobile = useMobileMediaQuery();
  const [showDiscountCode, setShowDiscountCode] = useState(false);
  const [showDiscountCodeSheet, setShowDiscountCodeSheet] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [coupne, setCoupon] = useState('');
  const [remainingCode, setRemainingCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showTermsSheet, setShowTermsSheet] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [similarDiscounts, setSimilarDiscounts] = useState<SimilarDiscountCard[]>(
    []
  );
  const [loadingSimilarDiscounts, setLoadingSimilarDiscounts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      if (clientWidth > 0) {
        const pages = Math.max(1, Math.ceil(scrollWidth / clientWidth));
        setTotalPages(pages);
        setCurrentPage(Math.min(pages - 1, Math.round(scrollLeft / clientWidth)));
      }
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    const onResize = () => checkScrollButtons();
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', onResize);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', onResize);
      };
    }
  }, []);

  useEffect(() => {
    const fetchSimilarDiscounts = async () => {
      if (!discoutData?.Id) {
        setSimilarDiscounts([]);
        setCurrentPage(0);
        setTotalPages(0);
        return;
      }

      try {
        setLoadingSimilarDiscounts(true);
        const response = await discountApi.getSimilarDiscounts(discoutData.Id);
        console.log('Similar Discounts Response:', response); // Debugging line
        const normalized = (Array.isArray(response) ? response : [])
          .filter((item: SimilarDiscountCard) => item?.Id !== discoutData?.Id)
          .map((item: SimilarDiscountCard) => ({
            ...item,
            CompanyLogo:
              resolveUserProfileImageSrc(item.CompanyLogo) || undefined,
          }));

        setSimilarDiscounts(normalized);
        setCurrentPage(0);
      } catch (error) {
        setSimilarDiscounts([]);
      } finally {
        setLoadingSimilarDiscounts(false);
        setTimeout(() => checkScrollButtons(), 0);
      }
    };

    fetchSimilarDiscounts();
  }, [discoutData?.Id]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth || 320;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const goToPage = (page: number) => {
    if (!scrollContainerRef.current) return;

    const safePage = Math.max(0, Math.min(page, totalPages - 1));
    const offset = safePage * scrollContainerRef.current.clientWidth;
    scrollContainerRef.current.scrollTo({ left: offset, behavior: 'smooth' });
  };
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
      const userData = JSON.parse(localStorage.getItem('userData'));
      const response = await discountApi.getCompanyWiseCouponCode(id, userData?.Id);

      setCoupon(response.Code);
      setRemainingCode(response.RemainingDiscount);
      isMobile
        ? setShowDiscountCodeSheet(!showDiscountCodeSheet)
        : setShowDiscountCode(!showDiscountCode);
    } catch (error) {
      setErrorMessage(error?.response?.data?.Message || 'Failed to get coupon code');
      toast.error(error?.response?.data?.Message || 'Failed to get coupon code');
    }
  };

  const handleFavourite = async (id: number, isFavourite: boolean) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const response = await discountApi.setFavouriteDiscount(id, userData?.Id, isFavourite);

      if (response) {
        toast.success('Favourite added');
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Failed to update favourite');
    }
  };

  return (
    <div className=" ">
      <div className="grid md:grid-cols-3 gap-6 mt-6 mb-4  ">
        {!discoutData ? (
          <div className="grid md:grid-cols-3 gap-6 mt-6 mb-4 animate-pulse">
            <div className="col-span-2 order-2 md:order-1 border-r border-grey-600">
              <div className="flex items-center rounded-full gap-4 w-auto mb-5">
                <div className="rounded-full bg-gray-200 h-14 w-14" />
                <div className="mr-3">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full" />
                  <div className="h-8 w-8 bg-gray-200 rounded-full" />
                </div>
              </div>
              <div className="pe-6">
                <div className="h-4 w-40 bg-gray-200 rounded mb-3" />
                <div className="h-3 w-60 bg-gray-100 rounded mb-3" />
              </div>
            </div>
            <div className="space-y-4 col-span-1 order-1 md:order-2">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-gray-200 rounded-full" />
                  <div className="h-3 w-28 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="col-span-2 md:py-4 md:px-7 p-5 bg-white md:border border-grey-600 rounded-md shadow-md">

              <div className="pe-6">
                <p className="text-h9 2xl:text-scaled-h9 font-semibold text-[#080808] mb-3">
                  Company Description
                </p>
                <p className="text-[#3B4761] text-h10 2xl:text-scaled-h10 font-medium mb-3">
                  {discoutData?.CompanyDescription}
                </p>
              </div>
            </div>

            <div className="space-y-4 col-span-1 md:py-4 md:px-7 p-5 bg-white md:border border-grey-600 rounded-md shadow-md">
              <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                Discount Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/business.svg"
                      title="Business category"
                      alt="business icon"
                      width={24}
                      height={24}
                    />
                    <span className="text-sm font-semibold text-[#204FB4]">
                      Business category
                    </span>
                  </div>
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500 mt-1">
                    {discoutData?.CompanyType || 'N/A'}
                  </p>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/handyman.svg"
                      alt="industry icon"
                      title="Industry"
                      width={24}
                      height={24}
                    />
                    <span className="text-sm font-semibold text-[#204FB4]">
                      Industry
                    </span>
                  </div>
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500 mt-1">
                    {discoutData?.CompanyIndustry || 'N/A'}
                  </p>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/shop.svg"
                      title="Redeemable"
                      alt="redeemable icon"
                      width={24}
                      height={24}
                    />
                    <span className="text-sm font-semibold text-[#204FB4]">
                      Redeemable
                    </span>
                  </div>
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500 mt-1">
                    {discoutData?.DiscountActivation || 'N/A'}
                  </p>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/user.svg"
                      alt="customer icon"
                      width={24}
                      height={24}
                      title="Customer type"
                    />
                    <span className="text-sm font-semibold text-[#204FB4]">
                      Customer type
                    </span>
                  </div>
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500 mt-1">
                    {discoutData?.ActiveDiscount || 'N/A'}
                  </p>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/stopwatch.svg"
                      alt="expiration icon"
                      width={24}
                      height={24}
                      title="Expiration date"
                    />
                    <span className="text-sm font-semibold text-[#204FB4]">
                      Expiration date
                    </span>
                  </div>
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500 mt-1">
                    {discoutData?.ExpiryDate || 'N/A'}
                  </p>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/tasks.svg"
                      alt="number icon"
                      width={24}
                      height={24}
                      title="Number of discounts"
                    />
                    <span className="text-sm font-semibold text-[#204FB4]">
                      Number of discounts
                    </span>
                  </div>
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500 mt-1">
                    {discoutData?.NumberOfDiscount || 'N/A'}
                  </p>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/user-search.svg"
                      alt="startup icon"
                      title="Ideal for start-ups"
                      width={24}
                      height={24}
                    />
                    <span className="text-sm font-semibold text-[#204FB4]">
                      Ideal for start-ups
                    </span>
                  </div>
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500 mt-1">
                    {discoutData?.IsStartUps ? 'Yes' : 'No'}
                  </p>
                </div>
              </div> {/* close right column */}

            </div>
          </>
        )}
      </div>
      <div className="flex md:hidden items-center justify-between gap-4">
        <button
          className="flex items-center justify-center gap-2 border text-omblue-600 border-omblue-600 p-3 rounded-md w-full md:w-auto"
          onClick={() =>
            isMobile
              ? setShowTermsSheet(!showTermsSheet)
              : setShowTerms(!showTerms)
          }
        >
          Terms of using <FileIconAlt className="w-4 h-4" />
        </button>
        <button
          className="flex items-center justify-center gap-2 border bg-omblue-600 text-white border-omblue-100 p-3 rounded-md w-full md:w-auto"
          onClick={() => {
            handleGetCode(discoutData?.Id);
          }}
        >
          Get the code <GoTo className="text-white w-4 h-4" />
        </button>
      </div>
      <Modal
        showModal={showDiscountCode}
        setShowModal={setShowDiscountCode}
        modalSize="xs"
        title={`Your discount code for ${discoutData?.CompanyName}`}
      >
        <p className="mb-4">
          Your code is valid until {discoutData?.ExpiryDate}
        </p>
        <div className="flex items-center gap-1 mb-4">
          <Input
            placeholder="GHWINWHJHWHJ"
            value={coupne}
            containerClass="w-full flex-1"
          />
          <div>
            <button
              onClick={() => {
                copyToClipboard(coupne);
              }}
              className="text-white bg-omblue-500 py-3 px-4 rounded-md"
            >
              {isCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <Note
          text={`${errorMessage
            ? errorMessage
            : `You can get a code from this company ${remainingCode} more times`
            }`}
          status="info"
        />
      </Modal>
      <Modal
        showModal={showTerms}
        setShowModal={setShowTerms}
        modalSize="xs"
        title={`Terms of using discount`}
      >
        <button
          className="absolute bottom-[20px]  sm:bottom-[inherit] sm:top-[21px] left-[20px] sm:left-[inherit] sm:right-[90px] flex items-center justify-center gap-2 border bg-omblue-600 text-white border-omblue-100 p-3 rounded-md w-[calc(100%-40px)] sm:w-auto"
          onClick={() => {
            setShowTerms(false);
            handleGetCode(discoutData?.Id);
          }}
        >
          Get the code <GoTo className="text-white w-4 h-4" />
        </button>
        <p className="text-balck-500 text-h8 font-semibold my-3">
          The full contractual terms of the discount
        </p>
        <p className="text-black-400 text-h9 2xl:text-scaled-h9 font-medium mb-[40px] sm:mb-0">
          <div
            className="text-editor"
            dangerouslySetInnerHTML={{
              __html: discoutData?.TermsOfUsing,
            }}
          ></div>
        </p>
      </Modal>
      <BottomSheet
        isOpen={showDiscountCodeSheet}
        onClose={() => setShowDiscountCodeSheet(false)}
      >
        <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-blue-500">
          Your discount code for{' '}
          <span className="text-omblue-600">{discoutData?.CompanyName}</span>
        </h5>
        <p className="mb-4">
          Your code is valid until {discoutData?.ExpiryDate}
        </p>
        <div className="flex items-center gap-1 mb-4">
          <Input
            placeholder="GHWINWHJHWHJ"
            value={coupne}
            containerClass="w-full flex-1"
          />
          <div>
            <button
              onClick={() => copyToClipboard(coupne)}
              className="text-white bg-omblue-500 py-3 px-4 rounded-md"
            >
              {isCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <Note
          text={`${errorMessage
            ? errorMessage
            : `You can get a code from this company ${remainingCode} more times`
            }`}
          status="info"
        />
      </BottomSheet>
      <BottomSheet
        isOpen={showTermsSheet}
        onClose={() => setShowTermsSheet(false)}
      >
        <p className="text-balck-500 text-h8 font-semibold my-3">
          The full contractual terms of the discount
        </p>
        <p className="text-black-400 text-h9 2xl:text-scaled-h9 font-medium mb-[40px] sm:mb-0">
          <div
            className="text-editor"
            dangerouslySetInnerHTML={{
              __html: discoutData?.TermsOfUsing,
            }}
          ></div>
        </p>
        <button
          className="sticky bottom-[20px] left-[20px] flex items-center justify-center gap-2 border bg-omblue-600 text-white border-omblue-100 p-3 rounded-md w-full"
          onClick={() => {
            setShowTermsSheet(false);

            handleGetCode(discoutData?.Id);
          }}
        >
          Get the code <GoTo className="text-white w-4 h-4" />
        </button>
      </BottomSheet>

      {/* Similar Discounts Slider Section */}
      <div className="mt-8 pt-8">
        <h2 className="text-xl md:text-2xl font-bold text-[#2C4B61] mb-6">
          Similar to {discoutData?.CompanyName || 'Company Name'}
        </h2>

        {loadingSimilarDiscounts ? (
          <div className="flex gap-4 overflow-x-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`similar-skeleton-${index}`}
                className="flex-shrink-0 w-[230px] md:w-[230px] border border-gray-200 rounded-lg p-4 bg-white shadow-sm animate-pulse"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-2.5 w-16 bg-gray-100 rounded" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full border border-gray-200 bg-gray-100" />
                  <div className="w-7 h-7 rounded-full border border-gray-200 bg-gray-100" />
                </div>

                <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                <div className="space-y-2 mb-4">
                  <div className="h-2.5 w-full bg-gray-100 rounded" />
                  <div className="h-2.5 w-4/5 bg-gray-100 rounded" />
                  <div className="h-2.5 w-3/5 bg-gray-100 rounded" />
                </div>

                <div className="h-10 w-full bg-gray-200 rounded-md mb-3" />
                <div className="h-2.5 w-20 mx-auto bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : similarDiscounts.length === 0 ? (
          <p className="text-sm text-gray-500">Similar discounts are not available.</p>
        ) : (
          <div className="relative">
            {/* Left Arrow */}
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Scroll left"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="#2C4B61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {similarDiscounts.map((item, index) => (
                <div
                  key={`${item?.Id || index}`}
                  className="flex-shrink-0 w-[230px] md:w-[230px] border border-gray-200 flex flex-col justify-between rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col">
                    {/* Company Logo and Name */}
                    <div className="flex items-center gap-3 mb-3">
                      {item?.CompanyLogo ? (
                        <Image
                          src={item.CompanyLogo}
                          alt={item?.CompanyName || 'company logo'}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-black-600 flex items-center justify-center text-white font-bold text-sm">
                          {item?.CompanyName?.slice(0, 2)?.toUpperCase() || 'NA'}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-gray-900 line-clamp-1">
                          {item?.CompanyName || 'Company Name'}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {item?.CompanySlogan || 'Company Slogan'}
                        </p>
                      </div>
                    </div>

                    {/* Favorite and Link Icons */}
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        className="p-1.5 border border-gray-200 rounded-full hover:bg-gray-50"
                        onClick={() =>
                          item?.Id &&
                          handleFavourite(item.Id, !(item?.IsFavourite || false))
                        }
                      >
                        <Favourite className="w-4 h-4 text-gray-400" />
                      </button>
                      <a
                        className="p-1.5 border border-olblue-200 rounded-full hover:bg-gray-50"
                        href={item?.DiscountCreateWebsite || '#'}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.9987 11.3337H4.66536C3.78131 11.3337 2.93346 10.9825 2.30834 10.3573C1.68322 9.73223 1.33203 8.88438 1.33203 8.00033C1.33203 7.11627 1.68322 6.26842 2.30834 5.6433C2.93346 5.01818 3.78131 4.66699 4.66536 4.66699H5.9987M9.9987 4.66699H11.332C12.2161 4.66699 13.0639 5.01818 13.6891 5.6433C14.3142 6.26842 14.6654 7.11627 14.6654 8.00033C14.6654 8.88438 14.3142 9.73223 13.6891 10.3573C13.0639 10.9825 12.2161 11.3337 11.332 11.3337H9.9987M5.33203 8.00033H10.6654" stroke="#2357C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                      </a>
                    </div>

                    {/* Discount Title */}
                    <h4 className="text-base font-semibold text-[#2C7A57] mb-2 line-clamp-2">
                      {item?.DiscountTitle || item?.DiscountHeading || item?.DiscountValue || item?.DiscountDescription}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-gray-600 mb-4 line-clamp-3">
                      {item?.CompanyDescription || 'No description available for this discount.'}
                    </p>
                  </div>


                  <div className="flex flex-col gap-2">
                    {/* Get Code Button */}
                    <button
                      className="w-full bg-[#204FB4] text-white py-2.5 rounded-md font-medium text-sm hover:bg-[#1a3d8f] transition-colors flex items-center justify-center gap-2"
                      onClick={() => handleGetCode(item?.Id)}
                    >
                      Get the code
                      <GoTo className="w-4 h-4" />
                    </button>

                    {/* Expiry Date */}
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Expiry: {item?.ExpiryDate || 'N/A'}
                    </p>
                  </div>

                </div>
              ))}
            </div>

            {/* Right Arrow */}
            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Scroll right"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="#2C4B61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Pagination Dots */}
        {!loadingSimilarDiscounts && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-500',
                  index === currentPage ? 'bg-gray-800 w-6' : 'bg-gray-300'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavouriteCardDetails;
