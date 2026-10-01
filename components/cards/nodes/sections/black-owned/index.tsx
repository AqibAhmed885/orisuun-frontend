import { CardsNodesCentral } from '@/components/cards/nodes/central';
import { CardsNodesSectionsBlackOwnedIcon } from '@/components/cards/nodes/sections/black-owned/icon';
import { CENTRAL_KEY } from '@/components/cards/nodes/sections/constants';
import { FC } from 'react';
import { DEFAULT_VARIANTS } from '@/components/cards/nodes/constants';
import { CardsNodesSectionsExpertsIcon } from '../expert/icon';

export const THE_BLACK_OWNED_BUSINESSES = {
  tagTitle: 'The Black-Owned Businesses',
  tagNote: [],
  btnTags: ['Can be verified', 'Access to Team Forming'],
  tagDescription:
    'Those privately-owned businesses around the world with at least 25% Black ownership. These businesses may operate in any industry and be any size.',
  tagRole: [
    'The platform is designed to help these businesses find the resources to expand and scale.',
  ],
  img: '/home/images/image-eight-mobile.png',
};
export const NodesSectionsBlackOwned: FC = ({ ...props }) => {
  return (
    <CardsNodesCentral
      classValue="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[-94px] "
      style={{ transformStyle: 'preserve-3d' }}
      Icon={CardsNodesSectionsExpertsIcon}
      overlay={CENTRAL_KEY}
      {...props}
      initial={'offscreen'}
      whileInView={'onscreen'}
      viewport={{ once: true }}
      variants={{
        offscreen: {
          opacity: 0,
          scale: 0.6,
          x: '-50%',
          y: -94,
          z: 10,
          transition: {
            type: "spring",
            bounce: 0.4,
            duration: DEFAULT_VARIANTS.onscreen.transition.duration
          }
        },
        onscreen: {
          opacity: 1,
          scale: 1,
          x: '-50%',
          y: -94,
          z: 10,
          transition: {
            type: "spring",
            bounce: 0.4,
            duration: DEFAULT_VARIANTS.onscreen.transition.duration,
            delay: DEFAULT_VARIANTS.onscreen.transition.delay
          }
        }
      }}
      dataIndex={0}
    >
      <>
        <div>Black-Owned</div>
        <div>Businesses</div>
      </>
    </CardsNodesCentral>
  );
};
