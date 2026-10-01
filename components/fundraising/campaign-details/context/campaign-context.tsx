import { setCampaignBasicInfo } from '@/data/slices/campaign-slice';
import { createContext, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';

export type Contributor = {
  Id: number;
  ProfilePicture: string;
  Name: string;
  Location: string;
  Amount: number;
  UserId: number;
};

export interface Sponsor {
  Impact: string;
  ProfilePicture: string;
  ShortMessage: string;
  Slogan: string;
  SponsorName: string;
  UserId: string;
  WebsiteUrl: string;
  Duration: Date;
}

export type Reward = {
  Id: number;
  Title: string;
  Description: string;
  Pricing: number;
  Inventory: number;
  ShippingTo: string;
  ShippingFrom: string;
  EstimatedDeliveryMonth: string;
  EstimatedDeliveryYear: string;
  ShippingToCountries: string[];
  RewardContributors: Contributor[];
};

export type UserInfo = {
  username: string;
  email: string;
  image?: string;
  location?: string;
  createdDate?: Date;
  website: string;
  userId?: number;
};

export type CampaignDetails = {
  Id: number;
  Title: string;
  Summary: string;
  Duration: string;
  Goal: number;
  Achieved: number;
  Status: number;
  BackgroundImage: string;
  YoutubeLink?: string;
  LinkedInLInk?: string;
  BlueSkyLink?: string;
  FacebookLink?: string;
  InstagramLink?: string;
  Pictures: string[];
  Video?: string | null;
  VideoLink?: string | null;
  CampaignDetails: string;
  Purpose: string;
  Rewards: Reward[];
  Sponsors: Sponsor[];
  Contributions: Contributor[];
  UserInfo: UserInfo;
  CreatedDate: Date;
};

export type CampaignDetailsContextType = {
  contributors: Contributor[];
  sponsors: Sponsor[];
  rewards: Reward[];
  userInfo: UserInfo;
  campaignInfo: Omit<
    CampaignDetails,
    'Rewards' | 'Sponsors' | 'Contributions' | 'UserInfo'
  >;
  setCampaignDetails: (details: CampaignDetails) => void;
  searchContributors: (searchTerm: string) => void;
  setNewContributor: (data: Contributor) => void;
};

const CampaignDetailsContext = createContext<
  CampaignDetailsContextType | undefined
>(undefined);

export const CampaignDetailsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const disptach = useDispatch();
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [allContributors, setAllContributors] = useState<Contributor[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: 'test',
    email: 'orisuun@gmail.com',
    image: '',
    createdDate: new Date(),
    location: 'unkown',
    website: 'https://orisuun.com',
  });
  const [campaignInfo, setCampaignInfo] = useState<
    Omit<CampaignDetails, 'Rewards' | 'Sponsors' | 'Contributions' | 'UserInfo'>
  >({
    Id: 0,
    Title: '',
    Summary: '',
    Duration: '',
    Goal: 0,
    Achieved: 0,
    Status: 0,
    BackgroundImage: '',
    YoutubeLink: '',
    LinkedInLInk: '',
    BlueSkyLink: '',
    FacebookLink: '',
    InstagramLink: '',
    Pictures: [],
    Video: null,
    VideoLink: null,
    CampaignDetails: '',
    Purpose: '',
    CreatedDate: new Date(),
  });

  const setCampaignDetails = (details: CampaignDetails) => {
    setContributors(details.Contributions || []);
    setAllContributors(details.Contributions || []);
    setSponsors(details.Sponsors || []);
    setRewards(details.Rewards || []);
    setUserInfo(
      details.UserInfo || {
        username: 'test',
        email: 'orisuun@gmail.com',
        image: '',
        createdDate: new Date(),
        location: 'unkown',
        website: 'https://orisuun.com',
      }
    );
    const { Rewards, Sponsors, Contributions, UserInfo, ...campaignData } =
      details;
    setCampaignInfo(campaignData);
    disptach(setCampaignBasicInfo({ ...campaignData }));
  };

  const searchContributors = (searchTerm: string) => {
    setContributors(() =>
      allContributors.filter((contributor) =>
        contributor.Name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const setNewContributor = (data: Contributor) =>
    setContributors([data, ...contributors]);

  return (
    <CampaignDetailsContext.Provider
      value={{
        contributors,
        sponsors,
        rewards,
        userInfo,
        campaignInfo,
        setCampaignDetails,
        searchContributors,
        setNewContributor,
      }}
    >
      {children}
    </CampaignDetailsContext.Provider>
  );
};

export const useCampaignDetails = () => {
  const context = useContext(CampaignDetailsContext);
  if (!context) {
    throw new Error(
      'useCampaignDetails must be used within a CampaignDetailsProvider'
    );
  }
  return context;
};
