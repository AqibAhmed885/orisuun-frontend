import Community from '@/icons/community';
import Crown from '@/icons/crown';
import Consultant from '@/icons/consultant';
import Briefcase from '@/icons/briefcase';
import Gossip from '@/icons/gossip';
import Dollars from '@/icons/dollars';

export const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'deleted', label: 'Deleted' },
    { value: 'verified', label: 'Verified' },
    { value: 'unverified', label: 'Unverified' },
];
export const profiles = [
    { icon: Community, title: 'Businesses', id: 1 },
    { icon: Crown, title: 'Experts', id: 3 },
    { icon: Consultant, title: 'Consultants', id: 2 },
    { icon: Briefcase, title: 'Professionals', id: 6 },
    { icon: Gossip, title: 'Mentors', id: 8 },
    { icon: Dollars, title: 'Investors', id: 7 },
];
export const sortOptions = [
    { value: 'Review', label: 'Reviews' },
    { value: 'Rating', label: 'Ratings' },
    { value: 'Size', label: 'Size' },
    { value: 'BlackOwnedPercent', label: '(%) of Black-Ownership' },
    { value: 'Year', label: 'Years In Business' },
    { value: 'CompanyName', label: 'Name' },
];
export const sortOptionsNonBusiness = [
    { value: 'Review', label: 'Reviews' },
    { value: 'Rating', label: 'Ratings' },
    { value: 'CompanyName', label: 'Name' },
];