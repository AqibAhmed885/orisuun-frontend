'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import { resolveUserProfileImageSrc } from '@/utils/image-url';
import Modal from '@/components/ui/modal/modal';
import BottomSheet from '@/components/ui/bottom-sheet';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import { toast } from 'react-toastify';
import { favouriteCardApi } from '@/app/api/dashboard/favourites';

type Discount = {
  Id?: number;
  id?: string | number;
  CompanyLogo: string | null;
  CompanyName: string;
  DiscountActivation: string;
  CompanyType: string;
  DiscountDescription: string;
  ExpiryDate: string;
  ActiveDiscount: string;
  NumberOfDiscount: number;

};


function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}



type ListViewProps = {
  data: Discount[];
};

const ListView: React.FC<ListViewProps> = ({ data }) => {
  const isMobile = useMobileMediaQuery();
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [coupon, setCoupon] = useState('');
  const [remainingCode, setRemainingCode] = useState('');
  const [showDiscountCode, setShowDiscountCode] = useState(false);
  const [showDiscountCodeSheet, setShowDiscountCodeSheet] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [loadingDiscountId, setLoadingDiscountId] = useState<string | number | null>(null);

  const getDiscountId = (discount: Discount) => discount.Id ?? discount.id;

  const handleGetCode = async (discount: Discount) => {
    const discountId = getDiscountId(discount);

    if (discountId === undefined || discountId === null) {
      toast.error('Unable to identify this discount');
      return;
    }

    try {
      setLoadingDiscountId(discountId);
      setIsCopied(false);

      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (!userData?.Id) {
        toast.error('Please sign in to get a discount code');
        return;
      }

      const couponDetails = await favouriteCardApi.getCompanyWiseCouponCode(
        Number(discountId),
        userData.Id
      );

      setSelectedDiscount(discount);
      setCoupon(couponDetails.Code);
      setRemainingCode(couponDetails.RemainingDiscount);

      await favouriteCardApi.getDiscountDetails(userData.Id);

      if (isMobile) {
        setShowDiscountCodeSheet(true);
      } else {
        setShowDiscountCode(true);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.Message || 'Failed to get coupon code'
      );
    } finally {
      setLoadingDiscountId(null);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coupon);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy discount code', error);
      toast.error('Failed to copy discount code');
    }
  };

  const discountCodeContent = selectedDiscount && (
    <div className="space-y-6">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-omblue-50 text-4xl font-bold text-omblue-600">
        %
      </div>
      <div>
        <h2 className="mb-2 text-2xl font-bold text-black-900">
          Your discount code for{' '}
          <span className="text-omblue-600">
            {selectedDiscount.CompanyName}
          </span>
        </h2>
        <p className="text-base text-gray-600">
          Your code is valid until {selectedDiscount.ExpiryDate}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={coupon}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base font-semibold text-black-900"
        />
        <button
          type="button"
          onClick={copyToClipboard}
          className="whitespace-nowrap rounded-lg bg-omblue-500 px-6 py-3 font-semibold text-white transition hover:bg-omblue-600"
        >
          {isCopied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-teal-200 bg-teal-50 p-4">
        <span className="mt-0.5 text-teal-600" aria-hidden="true">
          &#9432;
        </span>
        <p className="text-sm font-medium text-teal-700">
          You can get a code from this company{' '}
          <span className="font-bold">{remainingCode} more times</span>
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white overflow-x-auto tracking-wide">
        <div className="w-[1560px]">
        {/* Header */}
        <div className="grid grid-cols-[260px_140px_140px_260px_150px_150px_160px_180px] gap-4 px-5 py-3 text-sm text-gray-700 font-semibold border-b bg-gray-100">
          <div>Business</div>
          <div>Redeemable</div>
          <div>Category</div>
          <div>Discount</div>
          <div>Expiration Date</div>
          <div>Customer Type</div>
          <div>Number of Discount</div>
          <div className="text-center">Action</div>
        </div>
        {/* Rows */}
        {data.map((item, index) => {
          const discountId = getDiscountId(item);
          const isLoading = loadingDiscountId === discountId;

          return (
          <div
            key={discountId ?? index}
            className=" grid grid-cols-[260px_140px_140px_260px_150px_150px_160px_180px] gap-4  items-center px-5 py-4 border-b last:border-b-0"
          >
            {/* Business */}
            <div className="flex items-center gap-3 min-w-0">
              {item.CompanyLogo ? (
                <Image
                  src={resolveUserProfileImageSrc(item.CompanyLogo, BASE_URL) as string}
                  alt={item.CompanyName}
                  width={200}
                  height={200}
                  className="rounded-full object-cover w-10 h-10"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
                    {getInitials(item.CompanyName)}
                </div>
              )}
              <span className="font-semibold text-gray-900  truncate">{item.CompanyName}</span>
            </div>
            {/* Redeemable */}
            <div className="relative inline-block group">
              <span
                className={`inline-block max-w-[120px] truncate px-2 py-1 font-semibold rounded-full text-sm border ${item.DiscountActivation === 'Online'
                    ? 'text-blue-700'
                    : 'text-gray-700'
                  }`}
              >
                {item.DiscountActivation}
              </span>

              <div className="absolute text-center left-1/2 top-full z-10 mt-2 hidden -translate-x-1/2 rounded bg-gray-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block whitespace-normal w-36">
                {item.DiscountActivation}
              </div>
            </div>
            {/* Category */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
                {item.CompanyType}
              </span>
            </div>
            {/* Discount */}
            <div>
              <span className="inline-block border border-dashed border-omblue-300 px-3 w-full py-2 rounded-md text-blue-900 bg-olblue-50 text-xs font-semibold">
                {item.DiscountDescription}
              </span>
            </div>
            {/* Expiration Date */}
            <div>
              <span className="text-gray-800 text-sm font-medium">{item.ExpiryDate}</span>
            </div>
            {/* Customer Type */}
            <div>
              <span className={`inline-block px-3 py-1 rounded-full border text-sm font-semibold ${item.ActiveDiscount === 'New' ? ' text-blue-700' : ' text-gray-700'}`}>
                {item.ActiveDiscount?.split(' ')[0]}
              </span>
            </div>
            {/* Number of Discount */}
            <div>
              <span className="text-gray-900 font-semibold">{item.NumberOfDiscount}</span>
            </div>
            {/* Action */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleGetCode(item)}
                disabled={isLoading}
                className="flex min-w-[124px] items-center justify-center gap-2 rounded-md bg-[#2357C6] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1f4fb5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading && (
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  />
                )}
                {isLoading ? 'Getting...' : 'Get the code'}
              </button>
            </div>
          </div>
          );
        })}
        </div>
      </div>

      <Modal
        showModal={showDiscountCode}
        setShowModal={setShowDiscountCode}
        modalSize="sm"
      >
        <div className="px-2 pb-4 pt-8">{discountCodeContent}</div>
      </Modal>

      <BottomSheet
        isOpen={showDiscountCodeSheet}
        onClose={() => setShowDiscountCodeSheet(false)}
      >
        {discountCodeContent}
      </BottomSheet>
    </>
  );
};

export default ListView;
