import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import PartnersIcon from '@/icons/profile-types/PartnersIcon';
import Community from '@/icons/community';
import Crown from '@/icons/crown';
import Consultant from '@/icons/consultant';
import Briefcase from '@/icons/briefcase';
import Gossip from '@/icons/gossip';
import Dollars from '@/icons/dollars';

export const icons = {
    'Black-owned Business': (
        <BlackOwnedBusinessIcon className="text-omblue-500 w-5 h-5" />
    ),
    Expert: <ExpertsIcon className="text-omblue-500 w-5 h-5" />,
    Mentor: <MentorsIcon className="text-omblue-500 w-5 h-5" />,
    Professional: <ProfessionalsIcon className="text-omblue-500 w-5 h-5" />,
    'Strategy Consultants': (
        <ConsultantIcon className="text-omblue-500 w-5 h-5" />
    ),
    Investor: <InvestorsIcon className="text-omblue-500 w-5 h-5" />,
    Advocate: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
    Partner: <PartnersIcon className="text-omblue-500 w-3 h-3" />,
};

export const roleBasedTabs = {
    'Black-owned Business': [
        'overview',
        'fundamentals',
        'credentials',
        'reviews',
        'fundraising-campaign',
        'business-development-opportunities',
    ],
    'Strategy Consultants': [
        'overview',
        'fundamentals',
        'skills-and-experience',
        'credentials',
        'reviews',
        'business-development-opportunities',
    ],
    Expert: [
        'overview',
        'fundamentals',
        'skills-and-experience',
        'credentials',
        'reviews',
        'business-development-opportunities',
    ],
    Advocate: ['overview', 'reviews', 'business-development-opportunities'],
    Professional: [
        'overview',
        'fundamentals',
        'skills-and-experience',
        'credentials',
        'reviews',
        'business-development-opportunities',
    ],
    Investor: [
        'overview',
        'fundamentals',
        'credentials',
        'reviews',
        'business-development-opportunities',
    ],
    Mentor: [
        'overview',
        'fundamentals',
        'skills-and-experience',
        'credentials',
        'reviews',
        'business-development-opportunities',
    ],
};

export const advocateFormFlowsteps = [
    {
        name: 'Basic Information',
        componentName: 'UserDetailsExperts',
        id: 0,
    },
    {
        name: 'Photos',
        componentName: 'AdvocatePhotos',
        id: 1,
    },
    {
        name: 'Verify Advocate Form',
        componentName: 'Verification',
        id: 2,
    },
];

export const businessFormFlowSteps = [
    {
        name: 'Basic Information',
        componentName: 'BasicInformation',
        id: 0,
    },
    {
        name: 'Business Information',
        componentName: 'BusinessInformation',
        id: 1,
    },
    {
        name: 'Qualifications',
        componentName: 'Qualifications',
        id: 2,
    },
    {
        name: 'Charts',
        componentName: 'Charts',
        id: 3,
    },
    {
        name: 'Industry',
        componentName: 'IndustrySelection',
        id: 4,
    },
    {
        name: 'Verify BusinessForm',
        componentName: 'Verification',
        id: 5,
    },
];

export const individualFormFlowSteps = [
    {
        name: 'Basic Information',
        componentName: 'UserDetailsExperts',
        id: 0,
    },
    {
        name: 'Skills & Experience',
        componentName: 'SkillsAndExperiences',
        id: 1,
    },
    {
        name: 'Qualifications',
        componentName: 'Qualifications',
        id: 2,
    },
    {
        name: 'Charts',
        componentName: 'Charts',
        id: 3,
    },
    {
        name: 'Industry',
        componentName: 'IndustrySelection',
        id: 4,
    },
    {
        name: 'Verify IndividualForm',
        componentName: 'Verification',
        id: 5,
    },
];
export const employeeOptions = [
    { value: '1-10', label: '1-10' },
    { value: '11-50', label: '11-50' },
    { value: '51-100', label: '51-100' },
    { value: '101-500', label: '101-500' },
    { value: '501-1000', label: '501-1000' },
    { value: '1001-5000', label: '1001-5000' },
    { value: '5001-10000', label: '5001-10000' },
    { value: '10001+', label: '10001+' },
];

export const ownershipOptions = [
    { value: '0%', label: '0%' },
    { value: '1-10%', label: '1-10%' },
    { value: '11-30%', label: '11-30%' },
    { value: '31-50%', label: '31-50%' },
    { value: '51-70%', label: '51-70%' },
    { value: '91-99%', label: '91-99%' },
    { value: '100%', label: '100%' },
];
export const businessChannelFields = [
    {
        key: 'individuals' as const,
        label: 'Individuals'
    },
    {
        key: 'smallBusinesses' as const,
        label: 'Small Businesses (less than $8 million in annual revenue)',
    },
    {
        key: 'midmarketBusinesses' as const,
        label: 'Midmarket Businesses ($8M to $1B annual revenue)',
    },
    {
        key: 'enterprise' as const,
        label: 'Enterprise (more than $1 billion in annual revenue)',
    },
];

export const profiles = [
  { icon: Community, label: 'Businesses', value: '1' },
  { icon: Crown, label: 'Experts', value: '3' },
  { icon: Consultant, label: 'Consultants', value: '2' },
  { icon: Briefcase, label: 'Professionals', value: '6' },
  { icon: Gossip, label: 'Mentors', value: '8' },
  { icon: Dollars, label: 'Investors', value: '7' },
];


export const sortOptions = [
  { value: 'Review', label: 'Reviews' },
  { value: 'Rating', label: 'Ratings' },
  { value: 'Size', label: 'Size' },
  { value: 'BlackOwnedPercent', label: '(%) of Black-Ownership' },
  { value: 'Year', label: 'Years In Business' },
  { value: 'CompanyName', label: 'Name' },
];

export const sections = [
  {
    title: 'Relevant Industries',
    options: [
      {
        id: 'medical-equipment-and-supplies-manufacturers',
        label: 'Medical equipment and supplies manufacturers',
      },
      { id: 'merchant-wholesalers', label: 'Merchant wholesalers' },
      {
        id: 'Health & Personal Care Stores',
        label: 'Health & Personal Care Stores',
      },
      { id: 'warehousing', label: 'Warehousing' },
      { id: 'health-care-services', label: 'Health care services' },
    ],
  },
];

export const sorts = [
  {
    label: 'Primary Sort',
    options: [
      { value: 'relevance', label: 'Relevance' },
      { value: 'date', label: 'Date' },
      { value: 'discount', label: 'Discount' },
    ],
  },
  {
    label: 'Secondary Sort',
    options: [
      { value: 'relevance', label: 'Relevance' },
      { value: 'date', label: 'Date' },
      { value: 'discount', label: 'Discount' },
    ],
  },
  {
    label: 'Tertiary Sort',
    options: [
      { value: 'relevance', label: 'Relevance' },
      { value: 'date', label: 'Date' },
      { value: 'discount', label: 'Discount' },
    ],
  },
  {
    label: 'Quaternary Sort',
    options: [
      { value: 'relevance', label: 'Relevance' },
      { value: 'date', label: 'Date' },
      { value: 'discount', label: 'Discount' },
    ],
  },
];

