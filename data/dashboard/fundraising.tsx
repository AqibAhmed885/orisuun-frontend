import AcquisitionIcon from '@/public/icons/fundraising/acquisition-icon';
import EquipmentIcon from '@/public/icons/fundraising/equipment-icon';
import ExpansionIcon from '@/public/icons/fundraising/expansion-icon';
import GoalIcon from '@/public/icons/fundraising/goal-icon';

export interface ICustomSelectOptions {
    label: string;
    value: string;
    icon?: string;
}

export const months: Array<ICustomSelectOptions> = [
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
];
export const campaignPurposes = [
    { label: 'Equipment', value: 'equipment' },
    { label: 'Expansion', value: 'expansion' },
    { label: 'Acquisition', value: 'acquisition' },
];

export const tabs = [
    { id: 1, title: 'Basic Information', steps: 3 },
    { id: 2, title: 'Campaign Details', steps: 1 },
    { id: 3, title: 'Rewards', steps: 1 },
];

export const sponsorTabs = [
    { id: 1, title: 'Sponsor Info', steps: 3 },
    { id: 2, title: 'Sponsorship Details', steps: 1 },
    { id: 3, title: 'Payment Details', steps: 1 },
];

export const DaysOfMonths: Record<string, { value: string; label: string }[]> =
{
    '1': Array.from({ length: 31 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
    })),
    '2': Array.from({ length: 28 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
    })),
    '3': Array.from({ length: 31 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
    })),
    '4': Array.from({ length: 30 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
    })),
    '5': Array.from({ length: 31 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
    })),
    '6': Array.from({ length: 30 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
    })),
    '7': Array.from({ length: 31 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
    })),
    '8': Array.from({ length: 31 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
    })),
    '9': Array.from({ length: 30 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
    })),
    '10': Array.from({ length: 31 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
    })),
    '11': Array.from({ length: 30 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
    })),
    '12': Array.from({ length: 31 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
    })),
};

export const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return { label: year.toString(), value: year.toString() };
});

export const impactOptions: Array<ICustomSelectOptions> = [
  {
    label: '1X',
    value: '1X',
  },
  {
    label: '2X',
    value: '2X',
  },
  {
    label: '3X',
    value: '3X',
  },
  {
    label: '4X',
    value: '4X',
  },
  {
    label: '5X',
    value: '5X',
  },
  {
    label: '6X',
    value: '6X',
  },
  {
    label: '7X',
    value: '7X',
  },
  {
    label: '8X',
    value: '8X',
  },
  {
    label: '9X',
    value: '9X',
  },
  {
    label: '10X',
    value: '10X',
  },
];

export const fundraisingData = [
  {
    icon: EquipmentIcon,
    label: 'Fundraising for equipment',
    value: 'equipment',
  },
  {
    icon: ExpansionIcon,
    label: 'Fundraising for expansion',
    value: 'expansion',
  },
  {
    icon: AcquisitionIcon,
    label: 'Fundraising for acquisition',
    value: 'acquisition',
  },
  {
    icon: GoalIcon,
    label: 'Goal almost reached',
    value: '90',
  },
];

export const fundraisingSectionTitle = {
  contributedCampaigns: {
    title: 'Contributed',
    type: 'contributed',
  },
  expiringCampaigns: {
    title: 'Expiring Soon',
    type: 'expiring',
  },
  favouriteCampaigns: { title: 'Favourited', type: 'favourited' },
  inMyCityCampaigns: {
    title: 'In My City',
    type: 'local',
  },
  newCampaigns: {
    title: 'New',
    type: 'new',
  },
  popularCampaigns: {
    title: 'Popular',
    type: 'popular',
  },
};

export interface Campaign {
  Id?: number;
  Title: string;
  Summary: string;
  BackgroundImage: string;
  Duration: string;
  Goal: number;
  CampaignCurrentFund: number | null;
  RaisedPercentage: number | null;
  Status: number;
  UserProfilePicture: string;
  UserCity: string;
  UserCountry: string;
  UserCompanyName: string;
  CreatedDate: string;
  Contributions: number;
  isContributed: boolean;
}

export interface CampaignSection {
  title: string;
  type: 'favourited' | 'popular' | 'new' | 'expiring' | 'contributed' | 'local';
  campaigns: Campaign[];
}

export interface ICampaignList {
  favouriteCampaigns: Array<any>;
  popularCampaigns: Array<any>;
  newCampaigns: Array<any>;
  expiringCampaigns: Array<any>;
  contributedCampaigns: Array<any>;
  inMyCityCampaign: Array<any>;
}

export interface IFavouriteCampaign {
  Id: number;
  UserId: string;
  CampaignId: number;
}
