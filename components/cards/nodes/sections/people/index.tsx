import { CardsNodesBottom } from '@/components/cards/nodes/bottom';
import { CardsNodesSectionsPeopleIcon } from '@/components/cards/nodes/sections/people/icon';
import { NodesSectionsPeoplePath } from '@/components/cards/nodes/sections/people/path';
import { DEFAULT_VARIANTS } from '@/components/cards/nodes/constants';
import { useEffect, useState } from 'react';

// The People
export const THE_PEOPLE = {
  tagTitle: 'The People',
  tagNote: [],
  btnTags: [],
  tagDescription:
    'Those out there who want to support Black-owned businesses through patronage. They are your new customers and clients.',
  tagRole: [
    'They use the Search and Explore functions on our database to find Black-owned businesses to buy from',
    'They contribute to fundraising campaigns',
    'They provide valuable feedback to the businesses they visit',
  ],
  img: '/home/images/image-one-mobile.png',
};

export const NodesSectionsPeople = () => {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const storedUserType = typeof window !== 'undefined' &&
      (localStorage.getItem('userType'));
    setUserType(storedUserType);
  }, []);
  return (
    <CardsNodesBottom
      overlay="people"
      Icon={CardsNodesSectionsPeopleIcon}
      Path={NodesSectionsPeoplePath}
      pathProps={{
        classValue:
          'absolute left-1/2 bottom-full -translate-x-1/2 translate-y-[3px] z-20',
      }}
      initial={'offscreen'}
      whileInView={'onscreen'}

      viewport={{ once: true }}

      variants={{
        ...DEFAULT_VARIANTS,
        offscreen: {
          ...DEFAULT_VARIANTS.offscreen,
          y: 50,
          x: 0,
        },
        onscreen: {
          ...DEFAULT_VARIANTS.onscreen,
          y: 0,
          x: 0,
        },
      }}
    >
      The People:
      <br />
      Customers, Clients, & Advocates
    </CardsNodesBottom>
  );
};
