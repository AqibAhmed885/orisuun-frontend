// import { THE_BLACK_OWNED_BUSINESSES } from '@/components/cards/nodes/sections/black-owned';
// import { THE_MANAGEMENT_CONSULTANTS } from '@/components/cards/nodes/sections/consultants';
// import { THE_EXPERTS } from '@/components/cards/nodes/sections/expert';
// import { THE_INVESTORS } from '@/components/cards/nodes/sections/investor';
// import { THE_MENTORS } from '@/components/cards/nodes/sections/mentor';
// import { THE_PARTNERS } from '@/components/cards/nodes/sections/partner';
// import { THE_PEOPLE } from '@/components/cards/nodes/sections/people';
// import { THE_PROFESSIONALS } from '@/components/cards/nodes/sections/professional';

export const CENTRAL_KEY = 'black-owned';

// export const USERS_TAGS = [
//   THE_PEOPLE,
//   THE_PROFESSIONALS,
//   THE_EXPERTS,
//   THE_MENTORS,
//   THE_MANAGEMENT_CONSULTANTS,
//   THE_PARTNERS,
//   THE_INVESTORS,
//   THE_BLACK_OWNED_BUSINESSES,
// ];

export const USER_KEYS = [
  CENTRAL_KEY,
  'professional',
  'expert',
  'mentor',
  'consultants',
  'partner',
  'investor',
  'advocate',
  'people',
] as const;

export type TUserKey = (typeof USER_KEYS)[number];
