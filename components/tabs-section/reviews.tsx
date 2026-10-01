"use client";

import { RootState } from '@/data/store';
import ChevronRight from '@/icons/chevron-right';
import Dollars from '@/icons/dollars';
import Star from '@/icons/star';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import { TypeIcons } from '@/utils/helper';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const ReviewShimmer = () => (
  <div className="col-span-12 md:col-span-6 3xl:col-span-4">
    <div className="md:py-4 md:px-7 p-5 md:border border-grey-600 rounded-md shadow-md bg-white animate-pulse">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-gray-200 rounded-full" />
        <div className="space-y-1 flex-1">
          <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
      <div className="h-4 w-full bg-gray-100 rounded mb-3" />
      <div className="h-4 w-3/4 bg-gray-100 rounded mb-3" />
      <hr className="my-3" />
      <div className="space-y-3">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="flex items-center space-x-4">
            <div className="flex items-center gap-2 w-[10%]">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="h-4 w-6 bg-gray-100 rounded" />
            </div>
            <div className="bg-[#C7E8FF] w-[65%] h-2 py-1 rounded-3xl relative">
              <div className="bg-gray-200 h-full absolute inset-0 rounded-3xl" style={{ width: '60%' }} />
            </div>
            <div className="w-3/12">
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);


const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const headers = {
  'XApiKey': `${process.env.NEXT_PUBLIC_API_KEY}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

interface ReviewItem {
  Cost: number;
  Description: string;
  IsTeam: boolean;
  ProfilePicture: string;
  ProfileReviewedbyName: string;
  ProfileReviewedbyUserType: string;
  Quality: number;
  Refer: number;
  ReviewedProfileId: string;
  Service: number;
  UserId: string;
}


const Reviews = ({ showLimited = false, loader }: { showLimited?: boolean, loader?: boolean }) => {
  const [reviewsToShow, setReviewsToShow] = useState<ReviewItem[]>([]);
  const { profileData } = useSelector((state: RootState) => state.user);
  const teamData = useSelector((state: RootState) => state.user.teamData);

  useEffect(() => {
    const fetchTeamReviewData = async () => {
      try {
        const response = await axios.get(
          `${apiEndpoint}/Team/GetTeamRatingsReviews?teamId=${encodeURIComponent(teamData?.teamId)}`,
          { headers }
        );

        if (response.status === 200) {
          if (response.data.Result && response.data.Result.length > 0) {
            const ReviewList: ReviewItem[] = response.data.Result.map((item: any) => ({
              Cost: item.CostRating,
              Description: item.Review,
              IsTeam: item.IsTeam,
              ProfilePicture: item.ProfilePicture,
              ProfileReviewedbyName: item.Name,
              ProfileReviewedbyUserType: item.ProfileType,
              Quality: item.QualityRating,
              Refer: item.ReferRating,
              ReviewedProfileId: item.UserProfileId,
              Service: item.ServiceRating,
              UserId: item.UserId
            }));
            setReviewsToShow(ReviewList);
          }
        } else {
          throw new Error("Failed to fetch team reviews");
        }
      } catch (error) {
        console.error("Error fetching team reviews:", error);
      }
    };

    if (teamData?.isActive) {
      fetchTeamReviewData();
    } else {
      setReviewsToShow(showLimited ? profileData?.ReviewList?.slice(0, 3) : profileData?.ReviewList);
    }
  }, [teamData, profileData, showLimited]);

  const router = useRouter();

  // State to keep track of which reviews are expanded
  const [expandedReviews, setExpandedReviews] = useState<number[]>([]);

  // Toggle expanded state for a specific review
  const toggleExpand = (index: number) => {
    if (expandedReviews.includes(index)) {
      setExpandedReviews(expandedReviews.filter((i) => i !== index)); // Collapse
    } else {
      setExpandedReviews([...expandedReviews, index]); // Expand
    }
  };

  if (loader) {
    return (
      <div className="grid grid-cols-12 gap-8" id="profile_reviews">
        {Array.from({ length: 3 }).map((_, idx) => (
          <ReviewShimmer key={idx} />
        ))}
      </div>
    );
  }

  return (
    reviewsToShow?.length > 0 ? (
      <div className="grid grid-cols-12 gap-8" id="profile_reviews">
        {reviewsToShow.map((review, index) => {
          const isExpanded = expandedReviews.includes(index);
          const maxCharacters = 200;
          const displayText = isExpanded ? review.Description : review.Description.slice(0, maxCharacters);

          return (
            <div key={index} className="col-span-12 md:col-span-6 3xl:col-span-4">
              <div className="md:py-4 md:px-7 p-5 md:border border-grey-600 rounded-md shadow-md bg-white">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        review.ProfilePicture || BASE_URL
                      }
                      alt="image"
                      width={36}
                      height={36}
                      className="w-9 h-9 object-cover rounded-full"
                    />
                    <div className="space-y-0.5">
                      <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500 cursor-pointer" onClick={() => {
                        if (review?.IsTeam == true) {
                          router.push(`/settings/teamprofile/${review.UserId}`);
                        } else {
                          router.push(`/profile/${review.ReviewedProfileId}`);
                        }
                      }}>
                        {review.ProfileReviewedbyName}
                      </p>
                      <div className="inline-flex items-center gap-1.5">
                        {/* <Dollars className="w-4 h-4 text-omblue-600" /> */}
                        <div title="Profile">{TypeIcons[review.ProfileReviewedbyUserType]}</div>
                        <p className="text-h10 2xl:text-scaled-h10 font-medium text-blue-300">
                          {review.ProfileReviewedbyUserType}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-400">
                    {displayText}
                    {review.Description.length > maxCharacters && (
                      <>
                        {!isExpanded && '...'}
                        <span
                          onClick={() => toggleExpand(index)}
                          className="text-blue-500 cursor-pointer ml-2 font-semibold"
                        >
                          {isExpanded ? 'Show less' : 'Show more'}
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <hr className="my-3" />
                <div className="space-y-3 block mx-auto">
                  {['Quality', 'Service', 'Cost', 'Refer'].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <div className="flex items-center gap-2 w-[10%]">
                        <Star className="text-olblue-500 w-4 h-4" />
                        <h6 className="text-h9 2xl:text-scaled-h6 font-medium text-blue-500 w-6">
                          {review[item]}
                        </h6>
                      </div>
                      <div className="bg-[#C7E8FF] w-[65%] h-2 py-1 rounded-3xl relative">
                        <div
                          className={`bg-olblue-500 h-full absolute inset-0 rounded-3xl`}
                          style={{ width: `${review?.[item] * 2 * 10}%` }}
                        ></div>
                      </div>
                      <div className="w-3/12">
                        <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                          {item === 'Refer' ? 'Willing For Refer' : item}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-md text-black-500 m-8">No reviews found.</p>
    )
  );
};

export default Reviews;
