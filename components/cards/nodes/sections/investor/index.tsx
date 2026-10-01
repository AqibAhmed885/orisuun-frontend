import { CardsNodesFloating } from '@/components/cards/nodes/floating';
import { CardsNodesSectionsInvestorsIcon } from '@/components/cards/nodes/sections/investor/icon';
import { NodesSectionsInvestorsPath } from '@/components/cards/nodes/sections/investor/path';
import { DEFAULT_VARIANTS } from '@/components/cards/nodes/constants';
import { useEffect, useState } from 'react';

export const THE_INVESTORS = {
  tagTitle: 'The Investor',
  tagNote: [],
  btnTags: ['Can be verified', 'Access to Team Forming'],
  tagDescription:
    'Those established and professional investor and institutions actively searching impactful investment opportunities.',
  tagRole: [
    'These are the revenue growers – they’re going to provide growth capital and set you up for success.',
  ],
  img: '/home/images/image-seven-mobile.png',
};
export const NodesSectionsInvestors = () => {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const storedUserType = typeof window !== 'undefined' &&
      (localStorage.getItem('userType'));
    setUserType(storedUserType);
  }, []);
  return (
    <CardsNodesFloating
      overlay="investor"
      Icon={CardsNodesSectionsInvestorsIcon}
      Path={NodesSectionsInvestorsPath}
      pathProps={{
        classValue: 'absolute left-[-6px] top-[25px] z-20',
      }}
      initial={'offscreen'}
      showGradientBorder={userType == 'investors'}
      whileInView={'onscreen'}
      viewport={{ once: true }}
      forceShowPath={userType === 'investors'}
      dataIndex={6}
      variants={{
        ...DEFAULT_VARIANTS,
        offscreen: {
          ...DEFAULT_VARIANTS.offscreen,
          y: -200,
          x: 0,
        },
        onscreen: {
          ...DEFAULT_VARIANTS.onscreen,
          y: 0,
          x: 0,
        },
      }}
    >
      Investors
    </CardsNodesFloating>
  );
};
