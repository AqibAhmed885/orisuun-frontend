import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';

export const icons = {
  'Black-owned Business': (
    <BlackOwnedBusinessIcon className="text-omblue-500 w-5 h-5" />
  ),
  Expert: <ExpertsIcon className="text-omblue-500 w-5 h-5" />,
  Mentor: <MentorsIcon className="text-omblue-500 w-5 h-5" />,
  Professional: <ProfessionalsIcon className="text-omblue-500 w-5 h-5" />,
  Consultant: <ConsultantIcon className="text-omblue-500 w-5 h-5" />,
  Investor: <InvestorsIcon className="text-omblue-500 w-5 h-5" />,
  Advocate: <AdvocatesIcon className="text-omblue-500 w-5 h-5" />,
};

export const roleBasedTabs = {
  'Black-owned Business': [
    'overview',
    'fundamentals',
    'credentials',
    'reviews',
    'fundraising-campaign',
  ],
  'Strategy Consultants': [
    'overview',
    'fundamentals',
    'skills-and-experience',
    'credentials',
    'reviews',
  ],
  Expert: [
    'overview',
    'fundamentals',
    'skills-and-experience',
    'credentials',
    'reviews',
  ],
  Advocate: ['overview', 'reviews'],
  Professional: [
    'overview',
    'fundamentals',
    'skills-and-experience',
    'credentials',
    'reviews',
  ],
  Investor: ['overview', 'fundamentals', 'credentials', 'reviews'],
  Mentor: [
    'overview',
    'fundamentals',
    'skills-and-experience',
    'credentials',
    'reviews',
  ],
  // Add other roles and their corresponding Tabs
};

export const profiles = [
  { label: 'Businesses', value: '1' },
  { label: 'Experts', value: '3' },
  { label: 'Consultants', value: '2' },
  { label: 'Professionals', value: '6' },
  { label: 'Mentor', value: '8' },
  { label: 'Investor', value: '7' },
  { label: 'Business Development', value: '9' },
  { label: 'Co-Founder', value: '10' },
  { label: 'Board of Directors', value: '11' },
];

export const tabs = [
  { 0: 'All' },
  { 3: 'Expert' },
  { 2: 'Consultants' },
  { 6: 'Professional' },
  { 1: 'Businesses' },
  { 8: 'Mentor' },
];
