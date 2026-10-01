import React from 'react';
import Chip from '../../../../../../components/ui/chip';
import AccountTree from '@/icons/account-tree';
import Distance from '@/icons/cofounder/distance';
import Handyman from '@/icons/handyman';
import CalenderClock from '@/icons/calender-clock';
import Image from 'next/image';
import Consultant from '@/icons/consultant';
import Favourite from '@/icons/favourite';
import Eye from '@/icons/eye';
import { apiEndpoint, cn } from '@/utils/utils';
import axios from 'axios';
import { TypeIcons } from '@/utils/helper';
import { usePathname, useRouter } from 'next/navigation';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';

const BusinessDevelopmentCard = ({
  index,
  data,
  posts,
  setPosts,
}: {
  index: number;
  data?: any;
  setPosts?: any;
  posts?: any;
}) => {
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
    const teamData = JSON.parse(localStorage.getItem('teamData'));
  const pathname = usePathname();
  
  const setFavourite = async (profile, isFavourite) => {
    const payload = {
      FavBdPostId: profile.FavouritePostId,
      UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
    };
    const payloadProfile = {
      [!isFavourite ? 'BDOpportunityId' : 'FavBdPostId']: isFavourite ? profile?.FavouritePostId : profile.BDId,
      UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
    };

    try {
      const response = await axios.post(
        isFavourite ? `${apiEndpoint}/Favourite/UnFavouriteBdPost` : `${apiEndpoint}/Profile/SetFavouritePost`,
        { ...payloadProfile },
        {
          headers: {
            XApiKey:
              'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        if (pathname == '/favourites') {
          setPosts((prevList) =>
            prevList.filter((post) => post.BDId !== profile.BDId)
          );
        }
        else {

          const filterData = posts.map((detail) =>
            detail.BDId === profile.BDId
              ? { ...detail, IsFavourite: !detail.IsFavourite, FavouritePostId: response.data.Result }
              : detail
          );

          setPosts(filterData);
        }
      }
    } catch (error) {
      console.error('Error updating favourite status:', error);
    }
  };
  const router = useRouter()

  return (
    <div key={index} className="col-span-12 md:col-span-6">
      <div className="p-4 border border-grey-600 rounded-md space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-olblue-900">
            {data?.StrategyName}
          </h5>
          <p
            className={cn(
              'text-h7 2xl:text-scaled-h7 font-semibold',
              data.bdtype == 'Seeking' ? 'text-olblue-500' : 'text-green-500'
            )}
          >
            {data.bdtype == 'Seeking' ? 'We Are Seeking' : 'We Can Facilitate'}
          </p>
        </div>
        <div className="flex items-center gap-2 pb-1 flex-wrap">
          {data.bDTacticsSelections.map((tactic, index) => (
            <Chip key={index} text={tactic.TacticsName} className="" />
          ))}
        </div>
        <div className="grid grid-cols-12 gap-4 pb-4">
          {data.IndustryType && (
            <div className="flex items-start gap-2 col-span-6">
              <AccountTree className="w-6 h-6 text-omblue-500" />
              <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                {data.IndustryType}
              </p>
            </div>
          )}
          {data.RegionName && (
            <div className="flex items-start gap-2 col-span-6">
              <Distance className="w-6 h-6 text-omblue-500" />
              <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                {data.RegionName}
              </p>
            </div>
          )}
          {/* <div className="flex items-start gap-2 col-span-6">
            <Handyman className="w-6 h-6 text-omblue-500" />
            <div>
              <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                Oilseed and Grain Farming
              </p>
              <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                Vegetable and Melon Farming
              </p>
              <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                Fruit and Tree Nut Farming
              </p>
            </div>
          </div> */}
          {data?.bDIndustryDetails?.length > 0 && (
            <div className="flex items-start gap-2 mb-5">
              <div title="Industries">
                <Handyman className="text-omblue-600 w-6 h-6" />{' '}
              </div>
              <div className="space-y-2">
                {data?.bDIndustryDetails?.map((item, index) => (
                  <p
                    className="text-h9 2xl:text-scaled-h9 text-blue-500 font-medium"
                    key={index}
                  >
                    {' '}
                    {item?.IndustryName}
                  </p>
                ))}
                {/* <p className="text-h9 2xl:text-scaled-h9 text-blue-500 font-medium">
            Vegetable and Melon Farming
          </p>
          <p className="text-h9 2xl:text-scaled-h9 text-blue-500 font-medium">
            Fruit and Tree Nut Farming
          </p> */}
              </div>
            </div>
          )}
          {data.timeLine && (
            <div className="flex items-start gap-2 col-span-6">
              <CalenderClock className="w-6 h-6 text-omblue-500" />
              <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                {data.timeLine}
              </p>
            </div>
          )}
        </div>
        <hr />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-1/2">
            <div className="bg-profile-frame p-0.5 w-11 h-11 rounded-full flex items-center justify-center relative">
              <Image
                src={
                  data?.ProfilePicture ||
                  BASE_URL
                }
                alt="image"
                width={44}
                height={44}
                className="w-full h-full rounded-full"
              />
            </div>
            <div className="space-y-1">
              <p className="text-h8 2xl:text-scaled-h8 text-black-500 font-bold cursor-pointer" onClick={() => {
                router.push(`/profile/${data?.UserProfileId}`)
              }}>
                {data.UserCompanyName}
              </p>
              <div className="flex items-center gap-1.5">
                {TypeIcons[data.UserType]}
                <p className="text-blue-300 text-h10 2xl:text-scaled-h10 font-medium">
                  {data.UserType}
                </p>
              </div>
            </div>
          </div>

          <div className="w-1/2 flex items-center justify-end gap-4">
            <div className="p-2 w-8 h-8 border border-green-400 flex items-center justify-center rounded-full cursor-pointer" onClick={() => setFavourite(data, data.IsFavourite)}>
              <Favourite className="w-5 h-5 text-green-400" fill={
                data.IsFavourite ? 'currentColor' : 'white'
              } />
            </div>
            <button className="flex items-center gap-2 border border-omblue-100 px-5 py-3.5 rounded-md" onClick={() => router.push(`/profile/${data?.ProfileDetailId}`)}>
              <Eye className="w-4 h-4 text-omblue-500" />
              <p className="text-h9 2xl:text-scaled-h9 text-omblue-500 font-medium">
                View Profile
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDevelopmentCard;
