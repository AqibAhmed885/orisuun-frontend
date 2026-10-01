'use client';

import Breadcrumbs from '@/components/ui/breadcrumbs';
import FavouriteCardDetails from '@/components/cards/favourite-card-details';
import ChevronLeft from '@/icons/chevron-left';
import Favourite from '@/icons/favourite';
import DeFavourite from '@/icons/deFavourite';
import Globe from '@/icons/globe';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DiscountDetailsService } from '@/app/api/dashboard/discount-portal';
import { discountApi } from '@/app/api/dashboard/favourites';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import { resolveUserProfileImageSrc } from '@/utils/image-url';

const Discount = () => {
  const params = useParams();
  const id = params.id as string;
  const [discoutData, setDiscountData] = useState<any>(null);
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const showGlobe = true;

  const handleFavourite = async (id: number, fav: boolean) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const response = await discountApi.setFavouriteDiscount(id, userData?.Id, fav);
      if (response) {
        setIsFavourite(fav);
        toast.success(fav ? 'Favourite added' : 'Favourite removed');
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Failed to update favourite');
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    (async () => {
      const res = await DiscountDetailsService.getDiscountCodeDetails(id, userData?.Id);
        if (res.status === 200) {
          setDiscountData(res.data?.Result);
          setIsFavourite(res.data?.Result?.IsFavourite === true || res.data?.Result?.IsFavourite === 1);
      }
    })()
  }, [])

  return (
    <div className="">
      <div className='bg-white px-2  md:px-6 border-b border-[#E3E3E2]'>
        <div className="lg:hidden flex items-center justify-between py-4 mt-3">
          <ChevronLeft className="w-6 h-6" />
        </div>
        <div className="md:py-8 py-4">
          <div className="hidden md:block">
            <Breadcrumbs
              breadcrumbs={[
                { title: 'Discount Portal', url: '/discount-portal' },
                { title: discoutData?.CompanyName },
              ]}
            />
          </div>
        </div>
        {/* company header moved from card component */}
        <div className="flex justify-between items-center   gap-4 w-auto mb-5">
          <div className='flex items-center gap-4'>
            <div className='rounded-full bg-[#2357C6]'>
              <Image
                src={resolveUserProfileImageSrc(discoutData?.CompanyLogo, BASE_URL) as string}
                alt="profile"
                width={56}
                height={56}
                className="w-14 h-14 p-0.5 rounded-full object-cover"
              />
            </div>
            <div className="mr-3">
              <p className="text-h8 2xl:text-scaled-h8 font-bold text-black-500">
                {discoutData?.CompanyName}
              </p>
              <p className="text-h10 2xl:text-scaled-h10 font-medium text-blue-300">
                {discoutData?.CompanySlogan}
              </p>
            </div>
          </div>
          
          <div className="space-x-1 flex gap-1 items-center">
            {!isFavourite ? (
              <button
                onClick={() => {
                  handleFavourite(discoutData?.Id, true);
                }}
                title="Favourite"
              >
                <DeFavourite className="w-4 h-4" />
              </button>
            ) : (
              <button
                className='p-2 rounded-full'
                title="Favourite"
              >
                <Favourite
                  onClick={() =>
                    handleFavourite(
                      discoutData?.Id,
                      false
                    )
                  }
                />
              </button>
            )}
            <a
              className={cn(
                'bg-white border border-omblue-100 text-omblue-400 p-2 rounded-full cursor-pointer',
                showGlobe ? 'block' : 'hidden md:block'
              )}
              href={discoutData?.DiscountCreateWebsite}
              target="_blank"
              title="Website"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.9987 11.3337H4.66536C3.78131 11.3337 2.93346 10.9825 2.30834 10.3573C1.68322 9.73223 1.33203 8.88438 1.33203 8.00033C1.33203 7.11627 1.68322 6.26842 2.30834 5.6433C2.93346 5.01818 3.78131 4.66699 4.66536 4.66699H5.9987M9.9987 4.66699H11.332C12.2161 4.66699 13.0639 5.01818 13.6891 5.6433C14.3142 6.26842 14.6654 7.11627 14.6654 8.00033C14.6654 8.88438 14.3142 9.73223 13.6891 10.3573C13.0639 10.9825 12.2161 11.3337 11.332 11.3337H9.9987M5.33203 8.00033H10.6654" stroke="#2357C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

            </a>
          </div>
        </div>
      </div>
      
      <div className="px-2 my-4 md:px-6">
        <FavouriteCardDetails showGlobe={true} discoutData={discoutData} />
      </div>
    </div>
  );
};

export default Discount;
