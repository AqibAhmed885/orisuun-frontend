'use client';
import React from 'react';
import { feedTypes } from '@/utils/constants';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/data/store';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import { addFavouriteProfiles } from '@/data/slices/user-slice';
import { useRouter } from 'next/navigation';
import { NewsFeedCard } from './feed-cards/NewsFeedCard';
import { LeaderboardFeedCard } from './feed-cards/LeaderboardFeedCard';
import { InspoFeedCard } from './feed-cards/InspoFeedCard';
import { DiscountFeedCard } from './feed-cards/DiscountFeedCard';
import { CampaignFeedCard } from './feed-cards/CampaignFeedCard';
import { OpportunityFeedCard } from './feed-cards/OpportunityFeedCard';
import { SeekingOpportunityCard } from './feed-cards/SeekingOpportunityCard';
import { OfferingOpportunityCard } from './feed-cards/OfferingOpportunityCard';
import { BoardMemberOpportunityCard } from './feed-cards/BoardMemberOpportunityCard';
import { CoFounderOpportunityCard } from './feed-cards/CoFounderOpportunityCard';
import { CalendarEventCard } from './feed-cards/CalendarEventCard';
import { NewProfileCard } from './feed-cards/NewProfileCard';
import { ProjectFeedCard } from './feed-cards/ProjectFeedCard';
import { profileTypes } from '@/utils/profile-shapes';
import NewUserWelcomeModal from './NewUserWelcomeModal';

// interface FeedCardProps {
//   feed: IFeed;
// }
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;
const profiles = profileTypes;

export const FeedCard: React.FC<{ feed: any }> = ({ feed }) => {
  const router = useRouter();

  const isCalendarEvent = (value?: string) =>
    value === feedTypes.CalenderEvent || value === 'CalendarEvent' || value === feedTypes.TodayEvent;

  const favouriteProfiles = useSelector(
    (state: RootState) => state?.user?.favouriteProfiles
  );
  const dispatch = useDispatch();

  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  

  const teamData = JSON.parse(localStorage.getItem('teamData'));

  const handleClickOnChatIcon = async (UserId: string) => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/chat/GetSpecificUserDetails`,
        {
          UserId,
        },
        {
          headers: {
            XApiKey:
              apiKey,
          },
        }
      );
      if (response.status === 200) {
        localStorage.setItem(
          'chatDetails',
          JSON.stringify(response?.data?.Result)
        );
        router.push('/chats');
      }
    } catch (error) {
      toast.error('Failed to route to chat page');
    }
  };

  const handleRedirectToDiscount = (DiscountId: string, FeedType: string) => {
    if (
      FeedType === feedTypes?.NewDiscountCreated ||
      (FeedType === feedTypes?.NewBusinessDiscountCreated &&
        currentUser?.UserProfileTypeId === 1) ||
      (FeedType === feedTypes?.NewIndividualsDiscountCreated &&
        currentUser?.UserProfileTypeId !== 5 &&
        currentUser?.UserProfileTypeId !== 10 &&
        currentUser?.UserProfileTypeId !== 1)
    ) {
      router.push(`/discount-portal/${DiscountId}`);
    } else {
      toast.error('You are not authorized to view this discount');
    }
  };

  const handleRedirectToCampaign = (CampaignId: string) => {
    router.push(`/fundraising/${CampaignId}`);
  };

  const handleRedirectToOppertunity = (
    OppertunityId: string,
    feedType: string
  ) => {
    router.push(`/cofounder-and-board-matcher/${OppertunityId}`);
    // toast.success('now clear to which should we rout to');
  };

  const handleNewsOpen = (link?: string | null, createdDate?: string | null) => {
    if (!link) return;
    if (!createdDate) {
      window.open(link, '_blank');
      return;
    }
    const now = new Date().getTime();
    const createdTime = new Date(createdDate).getTime();
    const expiry = createdTime + 24 * 60 * 60 * 1000;

    if (now > expiry) {
      router.push('/discount-portal');
    } else {
      window.open(link, '_blank');
    }
  };

  const handleUnFavouriteProfile = async (profileId) => {
    const payload = {
      Id: profileId,
      UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
    };

    try {
      const response = await axios.post(
        `${apiEndpoint}/Favourite/UnFavouriteProfile`,
        { ...payload },
        {
          headers: {
            XApiKey:
              apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        const filterData =
          favouriteProfiles?.filter(
            (profileData) => profileData.ProfileId !== profileId
          ) || [];

        dispatch(addFavouriteProfiles(filterData));
        toast.success('Profile removed from favourites');
      }
    } catch (error) {
      toast.error('Error updating favourite status!');
    }
  };

  const handleFavouriteProfile = async (profileId) => {
    const payload = {
      UserProfileDetailId: profileId,
      UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
    };

    try {
      const response = await axios.post(
        `${apiEndpoint}/Profile/SetFavouriteProfile`,
        { ...payload },
        {
          headers: {
            XApiKey:
              apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const filterData = [
          ...favouriteProfiles,
          {
            CompanyName: `${feed.User.Name}`,
            FavouriteId: response.data.Result,
            Id: 0,
            ProfileId: profileId,
            ProfilePicture: feed?.User?.ProfileDetails?.ProfilePicture || '',
            ProfileType:
              profiles.find(
                (profile) => profile.value == feed?.User?.ProfileType
              )?.label || '',
          },
        ];
        dispatch(addFavouriteProfiles(filterData));
        toast.success('Profile added to favourites');
      }
    } catch (error) {
      toast.error('Error updating favourite status!');
    }
  };

  const handleUpdateFavouriteProfile = async (profileId) => {
    const isFavourite = favouriteProfiles?.some(
      (profile) => profile.ProfileId === profileId
    );
    if (isFavourite) {
      handleUnFavouriteProfile(profileId);
    } else {
      handleFavouriteProfile(profileId);
    }
  };

  const renderContent = () => {
    if (feed?.Type === feedTypes.Inspo && feed?.Content) {
      return <InspoFeedCard feed={feed} />;
    }

    if (
      feed?.Type === feedTypes.MostActiveChatterOfTheWeek ||
      feed?.Type === feedTypes.MostActiveChatterOfTheMonth ||
      feed?.Type === feedTypes.MostActiveChatterOfTheYear ||
      feed?.Type === feedTypes.MostReviewedProfileOfTheDay ||
      feed?.Type === feedTypes.MostReviewedProfileOfTheWeek ||
      feed?.Type === feedTypes.MostReviewedProfileOfTheYear ||
      feed?.Type === feedTypes.MostFavoritedProfileOfTheDay ||
      feed?.Type === feedTypes.MostFavoritedProfileOfTheWeek ||
      feed?.Type === feedTypes.MostFavoritedProfileOfTheYear ||
      feed?.Type === feedTypes.MostFollowedProfileOfTheDay ||
      feed?.Type === feedTypes.MostFollowedProfileOfTheWeek ||
      feed?.Type === feedTypes.MostFollowedProfileOfTheYear
    ) {
      return (
        // feed > TopUsers are null then show null
        <>
          {feed?.TopUsers && (
            <LeaderboardFeedCard
              feed={feed}
              onChatterClick={handleClickOnChatIcon}
            />
          )}
        </>
      );
    }

    if (
      feed?.Type === feedTypes.NewDiscountCreated ||
      feed?.Type === feedTypes.NewBusinessDiscountCreated ||
      feed?.Type === feedTypes.NewIndividualsDiscountCreated
    ) {
      return (
        <DiscountFeedCard
          feed={feed}
          onRedirect={handleRedirectToDiscount}
        />
      );
    }

    if (
      feed?.Type === feedTypes.NewCampaignCreated ||
      feed?.Type === feedTypes.CampaignGoalReached
    ) {
      return (
        <CampaignFeedCard
          feed={feed}
          onRedirect={handleRedirectToCampaign}
        />
      );
    }

    if (
      feed?.Type === feedTypes.NewCOFounderOppertunityCreated
    ) {
      return (
        <CoFounderOpportunityCard
          feed={feed}
          onRedirect={handleRedirectToOppertunity}
        />
      );
    }

    if (
      feed?.Type === feedTypes.NewBoardOfMemberOppertunityCreated
    ) {
      return (
        <BoardMemberOpportunityCard
          feed={feed}
          onRedirect={handleRedirectToOppertunity}
        />
      );
    }

    if (
      feed?.Type === feedTypes.NewSeekingOpportunityCreated
    ) {
      return (
        <SeekingOpportunityCard
          feed={feed}
          onRedirect={handleRedirectToOppertunity}
        />
      );
    }

    if (
      feed?.Type === feedTypes.NewOfferingOpportunityCreated
    ) {
      return (
        <OfferingOpportunityCard
          feed={feed}
          onRedirect={handleRedirectToOppertunity}
        />
      );
    }

    if (
      feed?.Type === feedTypes.NewProjectCreated ||
      feed?.Type === feedTypes.NewProjectPostCreated ||
      feed?.Type === feedTypes.ProjectUpdated ||
      feed?.Type === feedTypes.ProjectPostUpdated
    ) {
      return <ProjectFeedCard feed={feed} />;
    }



    return null;
  };

  const renderUserDetails = () => {
    if (isCalendarEvent(feed?.Type)) {
      return <CalendarEventCard feed={feed} />;
    }

    if (feed?.Type === feedTypes.NewProfileCreated && feed?.User && feed?.User?.Name) {
      return (
        <>
          {feed?.User?.ProfileDetails?.Id === currentUser?.UserProfileDetailsId && (
            <NewUserWelcomeModal
              visible={true}
              firstName={feed?.User?.Name?.split(' ')[0] || 'There'}
              onClose={() => {/* handle close if needed */ }}
            />
          )}
          <NewProfileCard feed={feed} />
        </>
      )
        
    }


    if (feed?.Type === feedTypes.News) {
      return <NewsFeedCard feed={feed} onOpenNews={handleNewsOpen} />;
    }

    return null;
  };
  const isProjectFeed = (value?: string) =>
    value === feedTypes.NewProjectCreated ||
    value === feedTypes.NewProjectPostCreated ||
    value === feedTypes.ProjectUpdated ||
    value === feedTypes.ProjectPostUpdated;

  return (
    <div className=" ">

      <div className="flex flex-col  ">
        {(feed?.Content || feed?.Description || isProjectFeed(feed?.Type)) && renderContent()}
        {renderUserDetails()}
      </div>
    </div>
  );
};
