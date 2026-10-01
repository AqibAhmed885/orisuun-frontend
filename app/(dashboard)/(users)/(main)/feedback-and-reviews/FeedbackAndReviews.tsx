"use client";

import Loader from '@/components/ui/loader';
import Reviews from '@/components/tabs-section/reviews';
import { addProfileData } from '@/data/slices/user-slice';
import { fetchUserProfile } from '../../../../api/dashboard/feedback&review';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';


const FeedbackAndReviews = () => {
  const [loader, setLoader] = useState(true);
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  const dispatch = useDispatch();

  const fetchProfileData = async () => {
    try {
      const profileData = await fetchUserProfile(currentUser);
      dispatch(addProfileData(profileData));
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error('Error fetching profile data:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchProfileData();
    }
  }, []);


  return (
    <div className='p-2 md:p-8'>
      <h2 className="text-xl font-semibold text-[#0B1636] flex items-center gap-3 mb-5">
        <div className="h-12 w-[8px] rounded-r-lg bg-[#0B1636]"></div>
        <span>Feedback And Reviews</span>
      </h2>
      <Reviews showLimited={false} loader={loader} />
    </div>
  );
};

export default FeedbackAndReviews;