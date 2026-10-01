import { CardsNodesFloating } from '@/components/cards/nodes/floating';
import { CardsNodesSectionsProfessionalsIcon } from '@/components/cards/nodes/sections/professional/icon';
import { NodesSectionsProfessionalsPath } from '@/components/cards/nodes/sections/professional/path';
import { DEFAULT_VARIANTS } from '@/components/cards/nodes/constants';
import { useEffect, useState } from 'react';

export const THE_PROFESSIONALS = {
  tagTitle: 'The Professional',
  tagNote: [],
  btnTags: [
    'Can be verified',
    'Access to Team Forming',
    'Have option to charge for services',
  ],
  tagDescription:
    'Those currently licensed and practicing in regulated fields such as law, accounting, architecture, information technology, engineering, finance, journalism, marketing, and many others.',
  tagRole: [
    'The professional on the platform are experienced operators. They are ready to help with the problem of the day, month, or year.',
    'These are the standardizers – they’re going make sure regular business functions are operating properly. They can lighten your load.',
  ],
  img: '/home/images/image-two-mobile.png',
};
export const NodesSectionsProfessionals = () => {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem('userType');
      setUserType(storedUserType);
    }
  }, []);
  return (
    <CardsNodesFloating
      overlay="professional"
      showGradientBorder={userType == 'professional'}
      Icon={CardsNodesSectionsProfessionalsIcon}
      Path={NodesSectionsProfessionalsPath}

      pathProps={{
        classValue: 'absolute left-[124px] bottom-[42px] z-20',
      }}
      initial={'offscreen'}
      whileInView={'onscreen'}
      forceShowPath={userType == 'professionals'}
      viewport={{ once: true }}
      variants={{
        ...DEFAULT_VARIANTS,
      }}
      dataIndex={1}
    >
      Professionals
    </CardsNodesFloating>
  );
};
