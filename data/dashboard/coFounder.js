import Calendar from '@/icons/cofounder/calendar';
import CellPhone from '@/icons/cofounder/cell-phone';
import CorporateFare from '@/icons/cofounder/corporate-fare';
import Distance from '@/icons/cofounder/distance';
import MailEmail from '@/icons/cofounder/mail-email';
import Paid from '@/icons/cofounder/paid';
import PersonProfile from '@/icons/cofounder/person-profile';
import Handyman from '@/icons/handyman';
export const businessDetails = [
    {
        icon: (
            <CorporateFare className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
        ),
        name: 'Business type',
    },
    {
        icon: (
            <Distance className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
        ),
        name: 'Business location',
    },
    {
        icon: (
            <Calendar className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
        ),
        name: '10 years',
    },
    {
        icon: (
            <Handyman className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
        ),
        name: 'Industry',
    },
    {
        icon: (
            <CorporateFare className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
        ),
        name: 'Business type',
    },
    {
        icon: (
            <Paid className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
        ),
        name: 'No investment required to become co-founder',
    },
];

export const contactDetails = [
    {
        icon: (
            <PersonProfile className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
        ),
        name: 'David John Mahathan',
    },
    {
        icon: (
            <CellPhone className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
        ),
        name: '+1 999-999-999',
    },
    {
        icon: (
            <MailEmail className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
        ),
        name: 'johndavid.96@gmail.com',
    },
];
export const steps = [
    {
        name: 'Co-Founder & Board  Matcher',
        id: 0,
    },
    {
        name: 'Business Info',
        id: 1,
    },
    {
        name: 'Contact',
        id: 2,
    },
    {
        name: 'Role',
        id: 3,
    },
    {
        name: 'Post Duration',
        id: 4,
    },
];
export const rolesOptions = [
    { label: 'Chief Executive Officer (CEO)', value: 'Chief Executive Officer (CEO)' },
    { label: 'Chief Technology Officer (CTO)', value: 'Chief Technology Officer (CTO)' },
    { label: 'Chief Marketing Officer (CMO)', value: 'Chief Marketing Officer (CMO)' },
    { label: 'Chief Science Officer (CSO)', value: 'Chief Science Officer (CSO)' },
    { label: 'Chief Legal Officer (CLO)', value: 'Chief Legal Officer (CLO)' },
    { label: 'Chief Financial Officer (CFO)', value: 'Chief Financial Officer (CFO)' },
    { label: 'Chief Product Officer (CPO)', value: 'Chief Product Officer (CPO)' },
    { label: 'President', value: 'President' },
    { label: 'Other', value: 'Other' },
];
