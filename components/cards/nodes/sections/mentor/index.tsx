import { CardsNodesFloating } from '@/components/cards/nodes/floating';
import { CardsNodesSectionsMentorsIcon } from '@/components/cards/nodes/sections/mentor/icon';
import { NodesSectionsMentorsPath } from '@/components/cards/nodes/sections/mentor/path';
import { DEFAULT_VARIANTS } from '@/components/cards/nodes/constants';
import { useEffect, useState } from 'react';

export const THE_MENTORS = {
  tagTitle: 'The Mentor',
  btnTags: [
    'Can be verified',
    'Access to Team Forming',
    'Have option to charge',
  ],
  tagDescription:
    'Those accomplished business people who have succeeded in starting or running a business*.',
  tagNote: [
    'The business must have reached three years of positive net income and revenues over $1 million under the leadership of the mentor.',
    '*High-level executives at multinational corporations also qualify to serve as mentor.',
  ],
  tagRole: [
    'These are the teachers – they’re going to help you avoid easily-made mistakes.',
    'Mentor are meant to guide on business decisions. To foster deep knowledge of a business’s history and trajectory, mentorships should be an ongoing relationship that increase in value over time.',
  ],
  img: '/home/images/image-four-mobile.png',
};

export const NodesSectionsMentors = () => {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const storedUserType = typeof window !== 'undefined' &&
      (localStorage.getItem('userType'));
    setUserType(storedUserType);
  }, []);
  return (
    <CardsNodesFloating
      overlay="mentor"
      Icon={CardsNodesSectionsMentorsIcon}
      Path={NodesSectionsMentorsPath}
      pathProps={{
        classValue: 'absolute right-[122px] bottom-[42px] z-10',
      }}
      initial={'offscreen'}
      whileInView={'onscreen'}
      viewport={{ once: true }}
      showGradientBorder={userType == 'mentors'}
      forceShowPath={userType === 'mentors'}
      variants={{
        ...DEFAULT_VARIANTS,
        offscreen: {
          ...DEFAULT_VARIANTS.offscreen,
          x: 200,
        },
        onscreen: {
          ...DEFAULT_VARIANTS.onscreen,
          x: 0,
        },
      }}
      dataIndex={3}
    >
      Mentors
    </CardsNodesFloating>
  );
};
