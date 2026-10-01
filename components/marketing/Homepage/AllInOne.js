'use client';

import { Suspense } from 'react';
import 'swiper/css';
import AllInOneTabs from '../Homepage/AllInOneTabs.js';


const AllInOne = ({ isUserType, userType = '' }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* {(userType == 'advocates' || userType == 'experts' || userType == 'mentors' || userType == 'professionals' || userType == 'strategy-consultants' || userType == 'partners' || userType == 'investors') && ( */}
        {/* <>
          <p className='text-center text-[16px] font-semibold text-[#5B657B]'>How to build</p>
          <p className='text-center text-[48px] font-[450px] text-[#001E5F]'>Hard Parts of Business Made Easy</p>
        </> */}
      {/* )} */}
      <AllInOneTabs UserType={userType} />
    </Suspense>
  );
};

export default AllInOne;
