'use client';

import BusinessDevelopmentCard from '@/app/(dashboard)/(users)/(main)/business-development/components/business-development-card';
import Loader from '@/components/ui/loader';
import { favouriteService } from '../../../../../api/dashboard/favourites';
import { cn } from '@/utils/utils';
import React, { useEffect, useState } from 'react';

const BusinessDevelopmentPost = () => {
  const [selected, setSelected] = useState('All');
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(false);
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
const teamData = JSON.parse(localStorage.getItem('teamData'));
  const fetchFilteredPosts = async () => {
    setLoader(true);
    try {
      const posts = await favouriteService.getFavouriteBDList({
        BdType: selected,
        MatchType: 1,
        UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
      });
      setPosts(posts);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (selected) {
      fetchFilteredPosts();
    }
  }, [selected]);

  return (
    <div className="py-6 flex flex-col items-start">
      <div
        className={cn(
          'bg-[#F3F5F7] text-blue-200 p-1 flex items-center w-auto rounded-md mb-6'
        )}
      >
        <div
          className={cn(
            'px-4 py-1.5 text-h7 2xl:text-scaled-h7 cursor-pointer rounded-md',
            selected === 'All'
              ? 'text-blue-500 font-semibold bg-white'
              : 'text-blue-200 font-medium'
          )}
          onClick={() => setSelected('All')}
        >
          <p>All</p>
        </div>
        <div
          className={cn(
            'px-4 py-1.5 text-h7 2xl:text-scaled-h7 cursor-pointer rounded-md',
            selected === 'Seeking'
              ? 'text-blue-500 font-semibold bg-white'
              : 'text-blue-200 font-medium'
          )}
          onClick={() => setSelected('Seeking')}
        >
          <p>We Are Seeking</p>
        </div>
        <div
          className={cn(
            'px-4 py-1.5 text-h7 2xl:text-scaled-h7 cursor-pointer rounded-md',
            selected === 'Facilitate'
              ? 'text-blue-500 font-semibold bg-white'
              : 'text-blue-200 font-medium'
          )}
          onClick={() => setSelected('Facilitate')}
        >
          <p>We Can Facilitate</p>
        </div>
      </div>

      {loader ? (
        <div className="w-full grid grid-cols-12 gap-5">
          {Array.from({ length: 4 }).map((_, idx) => (
            <BusinessDevelopmentCardShimmer key={idx} />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="w-full grid grid-cols-12 gap-5">
          {posts.map((post, index) => (
            <BusinessDevelopmentCard index={index} key={index} data={post} setPosts={setPosts} posts={posts} />
          ))}
        </div>
      ) : (
        <p className="w-full text-center my-5">No Posts found</p>
      )}
    </div>
  );
};

export default BusinessDevelopmentPost;


const BusinessDevelopmentCardShimmer = () => (
  <div className="col-span-12 md:col-span-6">
    <div className="p-4 border border-grey-600 rounded-md space-y-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-100 rounded" />
      </div>
      {/* Chips */}
      <div className="flex items-center gap-2 pb-1 flex-wrap">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-6 w-16 bg-gray-100 rounded-full" />
        ))}
      </div>
      {/* Grid details */}
      <div className="grid grid-cols-12 gap-4 pb-4">
        <div className="flex items-start gap-2 col-span-6">
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
        <div className="flex items-start gap-2 col-span-6">
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
        <div className="flex items-start gap-2 mb-5 col-span-12">
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-4 w-32 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
        <div className="flex items-start gap-2 col-span-6">
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
      </div>
      <hr />
      {/* Footer */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-1/2">
          <div className="bg-gray-200 w-11 h-11 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-end gap-4">
          <div className="p-2 w-8 h-8 border border-green-400 rounded-full bg-gray-100" />
          <div className="flex items-center gap-2 border border-omblue-100 px-5 py-3.5 rounded-md">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);