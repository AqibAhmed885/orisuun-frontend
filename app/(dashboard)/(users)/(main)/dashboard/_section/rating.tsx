import ProfileCard from './profile-card';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import star from '@/public/images/vector/star.svg';
import thumbsUp from '@/public/images/vector/thumbs-up.svg';
import Crown from '@/icons/crown';
import Star from '@/icons/star';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import Button from '@/components/ui/button';
import NoRatings from '@/icons/feeds/no-ratings';
import Accordion from '@/components/ui/accordian';
import { AccordianSkeletonList } from '@/components/feed-card-skeleton/accordianSkeleton';
import { useRouter } from 'next/navigation';
import LatestRatings from '@/public/icons/latestRatings.png'
import { getFeedbackList } from '../../../../../api/dashboard/dashboard'
import { TypeIcons } from '@/utils/helper';
const Rating: React.FC = () => {
  const router = useRouter();

  const [rating, setRating] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('userData')).Id;
        const result = await getFeedbackList(userId);
        setRating(result);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  return (
    <Accordion
      title="Latest Ratings"
      headerClasses="px-4"
      className="px-0"
      bodyClasses="text-gray-700 px-0"
    >
      <div className="flex flex-col flex-grow overflow-hidden">
        {rating?.length > 0 &&
          !loading && ( // Show header only if not loading
            <div className="grid grid-cols-12 gap-2 bg-omblue-25 px-4 py-2">
              <div className="col-span-7 text-start text-blue-500 2xl:text-scaled-h10 text-h10 font-semibold">
                Profile
              </div>
              <div className="col-span-2 text-start text-blue-500 2xl:text-scaled-h10 text-h10 font-semibold">
                Rating
              </div>
              <div className="col-span-3 text-start text-blue-500 2xl:text-scaled-h10 text-h10 font-semibold">
                Status
              </div>
            </div>
          )}

        {loading ? (
          <AccordianSkeletonList />
        ) : rating?.length > 0 ? (
          <div className="overflow-y-auto max-h-60 hide-scrollbar px-4">
            {rating?.map((data, index) => {
              let status = '';
              let starColor = '';

              if (data?.FinalReview >= 1 && data?.FinalReview <= 3) {
                status = 'Very Dissatisfied';
                starColor = 'bg-light-danger';
              } else if (data?.FinalReview > 3 && data?.FinalReview <= 6) {
                status = 'Neutral';
                starColor = 'bg-light-warning';
              } else if (data?.FinalReview > 6) {
                status = 'Satisfied';
                starColor = 'bg-light-success';
              }

              return (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 border-b border-grey-600 py-3"
                >
                  <div className="col-span-7 overflow-hidden">
                    <ProfileCard
                      usernameClasses="max-w-20 truncate text-nowrap"
                      variant="sm"
                      name={data?.ProfileReviewByName}
                      company={data?.ProfileType}
                      icon={TypeIcons[data?.ProfileType]}
                      isImage={false}
                      profileId={data?.ProfileId}
                      image={`${!!data?.ProfilePicture
                        ? data?.ProfilePicture
                        : 'https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png'
                        } `}
                    />
                  </div>
                  <div className="col-span-2 font-medium text-black-500">
                    <div className="flex items-center gap-0.5">
                      <Star className={`w-3 h-3 fill-nav-blue text-nav-blue`} />
                      <p className="text-sm">{data?.FinalReview?.toFixed(1)}</p>
                    </div>
                    <p className={`text-sm  font-normal`}>
                      {status}
                    </p>
                  </div>
                  <div className="col-span-3 text-h10 2xl:text-scaled-h10 font-medium text-green-400">
                    <p>Private</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-3">
            <div className="flex flex-col gap-5">
              {/* <NoRatings /> */}
              <Image alt='Latest Ratings' src={LatestRatings.src} width={150} height={120} className=' 3xl:w-36 3xl:h-36' />
              <p className="text-h9 2xl:text-scaled-h9 max-w-36 text-center text-[#393939] mx-auto">
                Your latest ratings will appear here
              </p>
            </div>
            <Button
              title="Browse Profiles"
              className="text-sm h-9 !min-w-36 3xl:!min-w-40 w-max m-0"
              onClick={() =>
                router.push(
                  '/profile-search/search-results?searchQuery=&city=&profileType=1'
                )
              }
            />
          </div>
        )}
      </div>
    </Accordion>
  );
};

export default Rating;
