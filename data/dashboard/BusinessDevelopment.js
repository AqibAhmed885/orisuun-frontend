export const steps = [
  {
    name: 'Relevant Industries',
    id: 1,
  },
  {
    name: 'Region',
    id: 2,
  },
  {
    name: 'Opportunity Details',
    id: 3,
  },
];

export const structureOptions = [
  { label: 'Requesting bids', value: 'Requesting bids' },
  { label: 'Requesting proposals', value: 'Requesting proposals' },
  { label: 'Commission for facilitation', value: 'Commission for facilitation' },
  { label: 'Payment–With Milestones', value: 'Payment – With Milestones' },
  { label: 'Payment–Upfront', value: 'Payment – Upfront' },
  { label: 'Payment–Upon Receipt', value: 'Payment – Upon Receipt' },
  { label: 'Intro only', value: 'Intro only' },
];

export const strategyOptions = [
  'Market Penetration',
  'Product Development',
  'Market Development',
  'Diversification',
];

export const timelineOptions = [
  '1-3 months',
  '4-6 months',
  '7-12 months',
  '1-2 years',
  '2-5 years',
  '5+ years',
];

export const strategyColorMap = {
  'Market Penetration': {
    bg: 'bg-[#0049B41F]',
    text: 'text-[#0049B4]',
    border: 'border-[#0049B4]',
  },
  'Market Development': {
    bg: 'bg-[#0A317514]',
    text: 'text-[#0A3175]',
    border: 'border-[#579FD9]',
  },
  'Product Development': {
    bg: 'bg-[#DEF0FF]',
    text: 'text-[#579FD9]',
    border: 'border-[#579FD9]',
  },
  Diversification: {
    bg: 'bg-[#A4CADE1C]',
    text: 'text-[#A4CADE]',
    border: 'border-[#BADCF4]',
  },
};

export const tacticOptions = [
  {
    label: 'Merger',
    value: 'Merger',
  },
  {
    label: 'Acquisition - Acquirer',
    value: 'Acquisition/Acquirer',
  },
  {
    label: 'Acquisition - Target',
    value: 'Acquisition/Target',
  },
  {
    label: 'Join Venture',
    value: 'JoinVenture',
  },
  {
    label: 'Market Segmentation',
    value: 'MarketSegmentation',
  },
  {
    label: 'Access to New Stores',
    value: 'AccessNewStores',
  },
  {
    label: 'Franchise',
    value: 'Franchise',
  },
];

export const strategyColorMapUpdateSteps = {
  'Market Penetration': {
    bg: 'bg-[#F9F5FF]',
    text: 'text-[#6020B4]',
    border: 'border-[#D3BAF4]',
  },
  'Market Development': {
    bg: 'bg-[#F5FFFB]',
    text: 'text-[#20B471]',
    border: 'border-[#BAF4DA]',
  },
  'Product Development': {
    bg: 'bg-[#FFFDF5]',
    text: 'text-[#B49420]',
    border: 'border-[#F4E7BA]',
  },
  Diversification: {
    bg: 'bg-[#F5FBFF]',
    text: 'text-[#2074B4]',
    border: 'border-[#BADCF4]',
  },
};
