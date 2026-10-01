interface IProfileDetails {
  Id: number;
  ProfilePicture: string;
}

interface IUser {
  Id: string;
  Name: string;
  ProfileType: string;
  ProfileDetails: IProfileDetails;
  IsVerified: number;
}

export interface IFeed {
  Id: number;
  CreateDate: string;
  Content: string;
  DiscountId: string | null;
  Type: string;
  CompaignId: string | null;
  PostId: string | null;
  UserId: string;
  User: IUser;
  Auther: string;
  DiscountExpiry: Date | null;
  DiscountTitle: string | null;
  Title: string | null;
  EventType: string | null;
  City: string | null
  Country: string | null
  EventLink: string | null
  StartTime: string | null
  EventDate: string | null
  TimeZone: string | null
  LocationType: string | null
  title: string;
  DateTime: string;
  NewsChannel: string;
  Description: string;
  NewsLink: string;
}
// types/campaign.ts
export interface Contributor {
  id: string;
  name: string;
  amount: number;
  message?: string;
  date: string | Date;
  avatar?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website: string;
  contribution: number;
  description: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  amount: number;
  deliveryDate: string;
  claimed: number;
  total: number;
}

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  website: string;
}

export interface CampaignInfo {
  id: string;
  title: string;
  summary: string;
  description: string;
  goal: number;
  achieved: number;
  duration: string;
  startDate: Date;
  endDate: Date;
  backgroundImage?: string;
  status: 'active' | 'completed' | 'upcoming';
  updates?: CampaignUpdate[];
}

export interface CampaignUpdate {
  id: string;
  title: string;
  content: string;
  date: Date;
  images?: string[];
}