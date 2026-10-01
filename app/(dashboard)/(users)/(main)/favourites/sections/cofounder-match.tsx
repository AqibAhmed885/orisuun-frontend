import Loader from '@/components/ui/loader';
import Eye from '@/icons/eye';
import Favourite from '@/icons/favourite';
import { TypeIcons } from '@/utils/helper';
import { favouriteService } from '../../../../../api/dashboard/favourites';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';


const CofounderMatchShimmer = () => (
  <div className="col-span-6">
    <div className="border-grey-600 border rounded-md p-4 animate-pulse space-y-4">
      <div className="h-5 w-40 bg-gray-200 rounded mb-3" />
      <div>
        <div className="h-4 w-28 bg-gray-100 rounded mb-2" />
        <div className="h-4 w-full bg-gray-100 rounded mb-2" />
        <div className="h-4 w-3/4 bg-gray-100 rounded mb-2" />
      </div>
      <hr className="my-4" />
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
          <div className="w-10 h-10 border border-green-500 bg-gray-100 rounded-full" />
          <div className="flex items-center gap-2 border border-omblue-100 px-5 py-3.5 rounded-md">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CofounderMatch = () => {
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
    const teamData = JSON.parse(localStorage.getItem('teamData'));

  const fetchFilteredPosts = async () => {
    setLoader(true);
    try {
      const posts = await favouriteService.getFavouriteBDList({
        BdType: '',
        MatchType: 2,
        UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
      });
      setPosts(posts);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoader(false);
    }
  };

  const setUnFavourite = async (profile) => {
    try {
      const success = await favouriteService.unFavouriteBdPost({
        FavBdPostId: profile.FavouritePostId,
        UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
      });

      if (success) {
        const result = posts.filter(post => post.BDId !== profile.BDId);
        setPosts(result);
      }
    } catch (error) {
      console.error('Error updating favourite status:', error);
    }
  };

  useEffect(() => {
    fetchFilteredPosts();
  }, []);
  return (
    loader ? (
      <div className="grid grid-cols-12 gap-5 py-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <CofounderMatchShimmer key={idx} />
        ))}
      </div>
    ) : posts.length > 0 ? (
      <div className="grid grid-cols-12 gap-5 py-6">
        {posts.map((post, index) => (
          <div key={index} className="col-span-6">
            <div className="border-grey-600 border rounded-md p-4">
              <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-olblue-900 mb-5">
                {post.BusinessName}
              </h5>
              <div>
                <p className="text-black-500 text-h9 2xl:text-scaled-h9 font-semibold mb-2">
                  Role Description
                </p>
                <div
                  className="text-editor"
                  dangerouslySetInnerHTML={{ __html: post.RoleDescription }}
                />
              </div>
              <hr className="my-4" />
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-1/2">
                  <div className="bg-profile-frame p-0.5 w-11 h-11 rounded-full flex items-center justify-center relative">
                    <Image
                      src={post.ProfilePicture || BASE_URL
                      }
                      alt="image"
                      width={44}
                      height={44}
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-h8 2xl:text-scaled-h8 text-black-500 font-bold cursor-pointer" onClick={() => {
                      router.push(`/profile/${post?.UserProfileId}`)
                    }}>
                      {post.UserCompanyName}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {TypeIcons[post.UserType]}
                      <p className="text-blue-300 text-h10 2xl:text-scaled-h10 font-medium">
                        {post.UserType}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-1/2 flex items-center justify-end gap-4">
                  <div className="w-10 h-10 flex items-center justify-center border border-green-500 bg-green-50 rounded-full p-2 cursor-pointer" onClick={() => setUnFavourite(post)}>
                    <Favourite className="w-5 h-5 text-green-500 " />
                  </div>
                  <button className="flex items-center gap-2 border border-omblue-100 px-5 py-3.5 rounded-md" onClick={() => router.push(`/profile/${post?.ProfileDetailId}`)}>
                    <Eye className="w-4 h-4 text-omblue-500" />
                    <p className="text-h9 2xl:text-scaled-h9 text-omblue-500 font-medium">
                      View Profile
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="w-full text-center my-5">No Posts found</p>
    ))

};

export default CofounderMatch;
