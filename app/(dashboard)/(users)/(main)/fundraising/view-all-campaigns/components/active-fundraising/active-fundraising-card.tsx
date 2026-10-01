import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';
import CoverImage from '@/public/fundraising/image.png';
import ProfileImage from '@/public/fundraising/Profile.png';
import Divider from '@/components/ui/divider';
import { cn } from '@/utils/utils';
import Favourite from '@/icons/favourite';
import { Campaign, ICampaignList, IFavouriteCampaign } from '../../../../../../../../data/dashboard/fundraising';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import {
  defaultCampaignList,
  setCampaignList,
  setFavouriteCampaigns,
} from '@/data/slices/campaign-slice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getDaysDifference } from '@/utils/date.helpers';
import { CampaignFavoriteService } from '@/app/api/dashboard/fundraising';

interface ActiveCampaignProps {
  campaign: Campaign;
  className?: string;
}

const ActiveCampaign: FC<ActiveCampaignProps> = ({ campaign, className }) => {
  const { favouriteCampaigns, campaignList = defaultCampaignList } =
    useSelector((state: RootState) => ({
      favouriteCampaigns: state.campaign.favouriteCampaigns,
      campaignList: state.campaign.campaignList,
    })) as {
      favouriteCampaigns: IFavouriteCampaign[];
      campaignList: ICampaignList;
    };

  const dispatch = useDispatch();
  const router = useRouter();
  const [countryflagUrl, setCountryflagUrl] = useState<string>(null);
  // const fetchCountryData = async (countryName) => {
  //   try {
  //     const res = await fetch(
  //       `https://restcountries.com/v3.1/name/${countryName}`
  //     );
  //     const data = await res.json();
  //     const countryCode = data[0].cca2.toLowerCase();
  //     return `https://flagcdn.com/w320/${countryCode}.png`;
  //   } catch (error) {
  //     console.error('Error fetching flag:', error);
  //     return null;
  //   }
  // };

  useEffect(() => {
    if (campaign) {
      const fetchFlags = async () => {
        const flagUrl = await CampaignFavoriteService.getCountryFlag(campaign.UserCountry);
        setCountryflagUrl(flagUrl);
      };
      fetchFlags();
    }
  }, [campaign]);

  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  const handleUnFavouriteCampaign = async (FavouriteId: number) => {
    const payload = {
      CampaignId: campaign.Id,
      UserId: currentUser?.Id,
    };

    try {
      const response = await CampaignFavoriteService.unfavoriteCampaign(payload);
      if (response.status === 201) {
        const filterData =
          favouriteCampaigns?.filter(
            (favouriteCampaign) => favouriteCampaign.Id !== FavouriteId
          ) || [];
        const newCampaignList = { ...campaignList };
        newCampaignList.favouriteCampaigns =
          newCampaignList.favouriteCampaigns.filter(
            (favouriteCampaign) => favouriteCampaign.Id !== campaign.Id
          ) || [];
        dispatch(setFavouriteCampaigns(filterData));
        dispatch(setCampaignList({ ...newCampaignList }));
        toast.success('Campaign removed from favourites');
      }
    } catch (error) {
      toast.error('Error updating favourite status!');
    }
  };
  const handleFavouriteCampaign = async (CampaignId: number) => {
    const payload = {
      CampaignId: CampaignId,
      UserId: currentUser?.Id,
    };

    try {
      const response = await CampaignFavoriteService.favoriteCampaign(payload);
      if (response.status === 201) {
        const newFavouriteCampaigns = [
          ...favouriteCampaigns,
          response.data.Result,
        ];
        const newCampaignList = { ...campaignList };
        newCampaignList.favouriteCampaigns = [
          ...newCampaignList.favouriteCampaigns,
          campaign,
        ];
        dispatch(setFavouriteCampaigns(newFavouriteCampaigns));
        dispatch(setCampaignList({ ...newCampaignList }));

        toast.success('Campaign added to favourites');
      }
    } catch (error) {
      toast.error('Error updating favourite status!');
    }
  };

  const handleUpdateFavouriteProfile = async (campaignId: number) => {
    const FavouriteCampaign = favouriteCampaigns?.find(
      (favouriteCampaign: IFavouriteCampaign) =>
        favouriteCampaign.CampaignId === (campaign.Id as number)
    );
    if (FavouriteCampaign) {
      handleUnFavouriteCampaign(FavouriteCampaign.Id);
    } else {
      handleFavouriteCampaign(campaignId);
    }
  };

  return (
    <div
      className={`xs:min-w-[328px] xl:!min-w-[368px] xl:!max-w-full box-border h-full flex flex-col rounded-xl shadow-md border-2 border-[#F2F4F7] bg-white overflow-hidden ${className}`}
    >
      <div className="relative w-full h-48">
        <Image
          src={campaign.BackgroundImage || CoverImage.src}
          alt={`${campaign.Id} Image`}
          fill
          className="object-cover"
        />
        <button
          className={`border absolute left-2.5 top-2.5 flex justify-center items-center min-w-8 max-w-8 min-h-8 max-h-8 rounded-full ${favouriteCampaigns?.some(
            (favouriteCampaign) =>
              favouriteCampaign.CampaignId === campaign.Id
          )
            ? 'border-[#193E8D]'
            : 'border-[#7FAAE3]'
            } bg-[#F0F7FD]`}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleUpdateFavouriteProfile(campaign.Id);
          }}
        >
          <Favourite
            fill={` ${favouriteCampaigns?.some(
              (favouriteCampaign) =>
                favouriteCampaign.CampaignId === campaign.Id
            )
              ? '#193E8D'
              : '#7FAAE3'
              }`}
              stroke={` ${favouriteCampaigns?.some(
              (favouriteCampaign) =>
                favouriteCampaign.CampaignId === campaign.Id
            )
              ? '#193E8D'
              : '#7FAAE3'
              }`}
          />
        </button>
      </div>

      <div
        className="p-4 xl:!p-5 relative w-full flex-1 flex flex-col cursor-pointer"
        onClick={() => router.push(`/fundraising/${campaign.Id}`)}
      >
        <div className="flex justify-between items-center mb-3 xs:max-w-[calc(100%-60px)] xl:max-w-[calc(100%-85px)] truncate">
          <h2 className="text-lg leading-5 text-[#080808] font-bold line-clamp-1 xs:max-w-[230px] xl:!max-w-max truncate text-ellipsis">
            {campaign.UserCompanyName || 'Company Name'}
          </h2>
          <div className="absolute top-0 right-4 -translate-y-1/2 w-[60px] h-[60px] xl:!w-20 xl:!h-20 rounded-full bg-white shadow-[0_0_14px_0_#0808080D] border border-[#E3E3E2]">
            <Image
              src={
                campaign.UserProfilePicture
                  ? campaign.UserProfilePicture
                  : ProfileImage.src
              }
              alt={`${campaign.UserProfilePicture} Logo`}
              width={80}
              height={80}
              className="w-full h-full rounded-full"
            />
          </div>
        </div>

        <p title={campaign.Summary}
          className="text-h8 text-[#5B657B] mb-4 line-clamp-3 flex-1">
          {campaign.Summary}
        </p>

        <div className="flex items-center space-x-2 text-gray-500 text-xs">
          <span className="p-1 bg-[#F0F7FD] font-medium text-[#2357C6] rounded-md">
            {campaign.UserCity}
          </span>
          <span className="p-1 bg-[#F7F7F7] text-[#5B657B] flex items-center gap-2 rounded-md">
            {countryflagUrl && (
              <div className="relative flex justify-center items-center w-5 aspect-square rounded-full overflow-hidden">
                <Image
                  alt="country"
                  src={countryflagUrl}
                  fill
                  className="object-cover"
                />
              </div>

            )}
            {campaign.UserCountry}
          </span>
        </div>
        <Divider className="my-2 !border-[#E3E3E2]" />

        <div className="flex flex-col gap-2.5">
          <p className="text-sm text-[#5B657B]">fundraising status:</p>
          <span className="flex gap-1 text-lg text-[#080808] leading-none">
            <p className="font-semibold">{campaign.RaisedPercentage}% </p>{' '}
            {getDaysDifference(campaign.Duration) === 0 ? (
              <p className="font-medium"> - Expiring Today</p>
            ) : getDaysDifference(campaign.Duration) === 1 ? (
              <>
                <p className="font-medium">
                  - {getDaysDifference(campaign.Duration)} day left
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">
                  - {getDaysDifference(campaign.Duration)} days left
                </p>
              </>
            )}
          </span>
          <div
            className={cn(
              'relative h-3 rounded-full',
              campaign.RaisedPercentage <= 32
                ? 'bg-[#FFC107] bg-opacity-15'
                : campaign.RaisedPercentage <= 65
                  ? 'bg-[#1A9E78] bg-opacity-15'
                  : 'bg-[#2357C6] bg-opacity-15'
            )}
          >
            <div
              className={cn(
                'absolute h-3 rounded-full',
                campaign.RaisedPercentage <= 32
                  ? 'bg-[#FFC107]'
                  : campaign.RaisedPercentage <= 65
                    ? 'bg-[#1A9E78]'
                    : 'bg-[#2357C6]'
              )}
              style={{ width: `${campaign.RaisedPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:!grid-cols-3 gap-4 xl:divide-x mt-2.5 text-sm">
          <div className="space-y-2">
            <p className="font-medium text-[#5B657B] leading-4">Expiry</p>
            <p className="text-base leading-none text-black-500-custom font-semibold">
              {moment(campaign.Duration).format('DD MMM, YYYY')}
            </p>
          </div>
          <div className="xl:pl-4 space-y-2">
            <p className="font-medium text-[#5B657B] leading-4">Goal</p>
            <p className="text-base leading-none text-black-500-custom font-semibold">
              ${campaign.Goal.toLocaleString()}
            </p>
          </div>
          <div className="xl:pl-4 space-y-2">
            <p className="font-medium text-[#5B657B] leading-4">Contributors</p>
            <p className="text-base leading-none text-black-500-custom font-semibold">
              {campaign.Contributions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveCampaign;
