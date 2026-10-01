import { CardsNodesFloating } from '@/components/cards/nodes/floating';
import { CardsNodesSectionsPartnersIcon } from '@/components/cards/nodes/sections/partner/icon';
import { NodesSectionsPartnersPath } from '@/components/cards/nodes/sections/partner/path';
import { DEFAULT_VARIANTS } from '@/components/cards/nodes/constants';
import { useEffect, useState } from 'react';

export const THE_PARTNERS = {
  tagTitle: 'The partner',
  tagNote: [],
  btnTags: ['Can be verified', 'Access to Team Forming'],
  tagDescription: 'Large and multinational corporations',
  tagRole: [
    'Our partner are here to support on an institutional level. They’re matching campaign donations, they’re bringing you into their organization as a vendor, and they’re giving you access to all of the professional talent at their firms.',
    'They are also the cost cutters - our Discount Portal is full of special offers from our partner, who are eager to help you grow.',
  ],
  img: '/home/images/image-six-mobile.png',
};

export const NodesSectionsPartners = () => {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const storedUserType = typeof window !== 'undefined' &&
      (localStorage.getItem('userType'));
    setUserType(storedUserType);
  }, []);
  return (
    <CardsNodesFloating
      overlay="partner"
      Icon={CardsNodesSectionsPartnersIcon}
      Path={NodesSectionsPartnersPath}
      pathProps={{
        classValue: 'absolute right-[4px] top-[25px] z-20',
      }}
      showGradientBorder={userType == 'partners'}
      initial={'offscreen'}
      whileInView={'onscreen'}
      viewport={{ once: true }}
      forceShowPath={userType === 'partners'}
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
      dataIndex={5}
    >
      partners
    </CardsNodesFloating>
  );
};
