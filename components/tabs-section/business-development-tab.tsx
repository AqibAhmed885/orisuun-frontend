import React, { useState } from 'react';
import BusinessDevelopmentCard from '../../app/(dashboard)/(users)/(main)/business-development/components/business-development-card';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';

const BusinessDevelopmentTab = () => {
  const { profileData } = useSelector((state: RootState) => state.user);
  const [posts, setPosts] = useState(profileData?.BdList ? profileData?.BdList :[])
  return profileData?.BdList?.length > 0 ? (
    <div className="w-full grid grid-cols-12 gap-5">
      {posts?.map((BD, index) => (
        <BusinessDevelopmentCard index={index} key={index} data={BD} setPosts={setPosts} posts={posts}/>
      ))}
    </div>
  ) : (
    <p className="text-md text-black-500">No post found.</p>
  );
};

export default BusinessDevelopmentTab;
