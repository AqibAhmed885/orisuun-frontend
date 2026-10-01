import { CardsNodesFloating } from '@/components/cards/nodes/floating';
import { CardsNodesSectionsExpertsIcon } from '@/components/cards/nodes/sections/expert/icon';
import { NodesSectionsExpertsPath } from '@/components/cards/nodes/sections/expert/path-copy';
import { DEFAULT_VARIANTS } from '@/components/cards/nodes/constants';
import { useEffect, useState } from 'react';
import { CardsNodesSectionsBlackOwnedIcon } from '../black-owned/icon';

export const THE_EXPERTS = {
  tagTitle: 'The Expert',
  tagNote: [],
  btnTags: [
    'Can be verified',
    'Access to Team Forming',
    'Have option to charge',
  ],
  tagDescription:
    'Those recognized and credentialed individuals (or small organizations) who can confidently claim to be among the top of their field.',
  tagRole: [
    'The key resource in taking an idea to its maximum potential.',
    'These are the clarifiers and elevators – they’re going to sharpen your ideas with perspective and insight.',
  ],
  img: '/home/images/image-three-mobile.png',
};

export const NodesSectionsExperts = () => {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const storedUserType = typeof window !== 'undefined' &&
      (localStorage.getItem('userType'));
    setUserType(storedUserType);
  }, []);
  return (
    <CardsNodesFloating
      overlay="expert"
      Icon={CardsNodesSectionsBlackOwnedIcon}
      Path={NodesSectionsExpertsPath}
      pathProps={{
        classValue: 'absolute left-0 -top-[40px]',
      }}
      showGradientBorder={userType == 'experts'}
      initial={'offscreen'}
      forceShowPath={userType === 'experts'}
      whileInView={'onscreen'}
      viewport={{ once: true }}
      variants={{
        ...DEFAULT_VARIANTS,
      }}
      dataIndex={2}
    >
      Subject Matter Experts
    </CardsNodesFloating>
  );
};
