// components/TestimonialCard.tsx
import React, { useState } from 'react';
import { StarIcon as SolidStar } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStar } from '@heroicons/react/24/outline';
import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import { toast } from 'react-toastify';
import axios from 'axios';

const StarRatingInput = ({ label, value, onChange }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="px-2 mb-4">
      <p className="text-[#344054] font-semibold mb-1">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <InteractiveStar
            key={star}
            selected={hovered >= star || value >= star}
            onClick={() => onChange(star)}
            onHover={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
          />
        ))}
      </div>
    </div>
  );
};

const InteractiveStar = ({ selected, onClick, onHover, onMouseLeave }) => {
  return (
    <div
      className="cursor-pointer w-20 h-9"
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onMouseLeave}
    >
      {selected ? (
        <SolidStar className="text-[#2563EB] w-full h-full" />
      ) : (
        <OutlineStar className="text-gray-400 w-full h-full" />
      )}
    </div>
  );
};

const Rating = ({ rating }: { rating: number }) => {
  const stars = [];

  for (let i = 0; i < 5; i++) {
    const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;

    stars.push(
      <div key={i} className="relative w-4 h-4 mx-[1px]">
        <div
          className="absolute w-4 h-4 overflow-hidden z-10"
          style={{
            clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
          }}
        >
          <SolidStar className="w-5 h-5 text-[#BFD2FB]" />
        </div>
        <OutlineStar className="absolute w-5 h-5 text-[#759EF7] z-20" />
      </div>
    );
  }

  return <div className="flex gap-0.5">{stars}</div>;
};

export const TypeIcons = {
  'Black-owned Business': (
    <BlackOwnedBusinessIcon className="text-omblue-500 w-3 h-3" />
  ),
  Expert: <ExpertsIcon className="text-omblue-500 w-3 h-3" />,
  Mentor: <MentorsIcon className="text-omblue-500 w-3 h-3" />,
  Professional: <ProfessionalsIcon className="text-omblue-500 w-3 h-3" />,
  'Strategy Consultant': <ConsultantIcon className="text-omblue-500 w-3 h-3" />,
  Investor: <InvestorsIcon className="text-omblue-500 w-3 h-3" />,
  Advocate: <AdvocatesIcon className="text-omblue-500 w-3 h-3" />,
  Partner: <AdvocatesIcon className="text-omblue-500 w-3 h-3" />,
  Admin: <AdvocatesIcon className="text-omblue-500 w-3 h-3" />,
  SystemAdmin: <AdvocatesIcon className="text-omblue-500 w-3 h-3" />,
};

const TestimonialCard = ({ profileData, currentUser, apiEndpoint, userId, UserProfileDetailId }) => {
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [ratingDetails, setRatingDetails] = useState({
    Quality: 0,
    Service: 0,
    Cost: 0,
    Willing: 0,
    Review: '',
  });

  const toggleExpanded = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleChange = (field, value) => {
    setRatingDetails((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const ReviewSubmit = async () => {
    const requestData = {
      ReviewedProfileId: UserProfileDetailId,
      UserId: currentUser?.Id,
      Service: ratingDetails.Service,
      Quality: ratingDetails.Quality,
      Cost: ratingDetails.Cost,
      Refer: ratingDetails.Willing,
      Description: ratingDetails.Review,
      IsTeam: false
    };

    try {
      const response = await axios.post(
        `${apiEndpoint}/Profile/SaveProfileReview`,
        requestData,
        {
          headers: {
            XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.Message);
        setShowReview(false);
        setRatingDetails({
          Quality: 0,
          Service: 0,
          Cost: 0,
          Willing: 0,
          Review: '',
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message);
      console.error('Error submitting review:', error);
    }
  };
  const user =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  const teamData = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('teamData'));
  return (
    <div className="space-y-6 relative">
      <div className='flex justify-between mb-3'>
        <div>
          <h2 className='text-lg font-semibold text-gray-900'>Reviews</h2>
          <p className="text-[#344054] ">What people are saying.</p>
        </div>
        {
          user?.Id != userId && (<button
            onClick={() => setShowReview(true)}
            className='hover:bg-gray-200 border border-gray-300 rounded-md py-2 px-4 font-semibold'
          >
            Add Review
          </button>)
        }

      </div>
      <div className="grid grid-cols-1 3xl:grid-cols-2 gap-4">
        {profileData?.map((item, index) => {
          const isExpanded = expandedIndices.includes(index);
          const shouldTruncate = item?.Description?.length > 100;

          return (
            <div key={index} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
              <div className="flex items-start gap-4">
                <img
                  src={
                    item.ProfilePicture ||
                    `https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png`
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{item?.ProfileReviewedbyName}</h4>
                  <span className="bg-[#ECF4FB] border border-[#D1E9FF] px-3 py-1 rounded-2xl inline-flex items-center gap-1">
                    {TypeIcons[item?.ProfileReviewedbyUserType]} {item?.ProfileReviewedbyUserType}
                  </span>

                  <p className="text-sm text-gray-700 mt-2">
                    {shouldTruncate && !isExpanded
                      ? `${item.Description.slice(0, 100)}...`
                      : item.Description}
                  </p>

                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="text-sm text-blue-600 font-semibold mt-1 inline-block"
                    >
                      {isExpanded ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full bg-gray-50 mt-4 border-[#F9FAFB] rounded-xl px-1 py-3 grid grid-cols-2 md:grid-cols-4 gap-y-2">
                <div className="flex flex-col items-center ">
                  <p className="text-sm font-medium text-[#475467] mb-1 ">Quality</p>
                  <Rating rating={item?.Quality} />
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-[#475467] mb-1">Service</p>
                  <Rating rating={item?.Service || 4.5} />
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-[#475467] mb-1">Cost</p>
                  <Rating rating={item?.Cost || 3} />
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-[#475467] mb-1">Willing to Refer</p>
                  <Rating rating={item?.Refer || 4} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inline Modal Implementation */}
      {showReview && (
        <div className="fixed inset-0 z-50 bg-gray-400 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-[80%] lg:w-[45%]  overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Write a review</h3>
                <button
                  onClick={() => setShowReview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-4 mt-3">
                <div className='w-full'>

                  <p className="text-[#344054] text-[16px] font-semibold py-2 mb-1">Rate Your Experience</p>
                  <div className="w-[90%] md:w-[70%] lg:flex lg:flex-wrap text-omblue-500">
                    <div className="w-[50%] mb-2">
                      <StarRatingInput label="Quality" value={ratingDetails.Quality} onChange={(val) => handleChange('Quality', val)} />
                    </div>
                    <div className="w-[50%] mb-2">
                      <StarRatingInput label="Service" value={ratingDetails.Service} onChange={(val) => handleChange('Service', val)} />
                    </div>
                    <div className="w-[50%] mb-2">
                      <StarRatingInput label="Willing to Refer" value={ratingDetails.Willing} onChange={(val) => handleChange('Willing', val)} />
                    </div>
                    <div className="w-[50%] mb-2">
                      <StarRatingInput label="Cost" value={ratingDetails.Cost} onChange={(val) => handleChange('Cost', val)} />
                    </div>
                  </div>

                  <div className='W-[30%]'></div>
                </div>


                <p className="text-h8 2xl:text-scaled-h8 font-semibold text-[#344054] mb-4 mt-6">
                  Your Review
                </p>
                <textarea
                  rows={4}
                  placeholder="Share your experience with others..."
                  onChange={(e) => handleChange('Review', e.target.value)}
                  value={ratingDetails?.Review}
                  className="resize-none border border-[#EAECF0] w-full rounded-md py-3 px-4 focus:border-black-400 outline-none"
                />
              </div>

              <div className="flex w-full gap-4 pt-3">
                <button
                  onClick={() => setShowReview(false)}
                  className="flex-1 flex items-center justify-center  text-md gap-2 py-3 px-6 font-semibold bg-white border border-omblue-100 text-black rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={ReviewSubmit}
                  className="flex-1 flex items-center justify-center text-md gap-2 py-3 px-6 font-semibold bg-[#2357C6] text-white rounded-md hover:bg-omblue-300 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialCard;