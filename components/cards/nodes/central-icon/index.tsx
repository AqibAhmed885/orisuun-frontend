import type { FC } from 'react';
import { motion } from 'framer-motion';
import { TNodeProps } from '@/components/cards/nodes/types';
import { CardsNodesShadow } from '@/components/cards/nodes/central-icon/shadow';
import { ANIMATION_INITIAL_DURATION } from '@/components/cards/nodes/constants';

const Y = { START: '40%', END: '-25%' };

type TProps = {
  isAnimating: boolean;
} & Pick<TNodeProps, 'Icon'>;
export const CardsNodesIcon: FC<TProps> = ({ isAnimating, Icon }) => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full">

      <motion.div
        initial={['initial']}
        animate={isAnimating ? 'animate' : 'exit'}
        variants={{
          initial: {
            y: Y.START,
          },
          animate: {
            y: [Y.START, Y.END],
            rotate: 0,
            transition: {
              duration: 2,
              repeat: Infinity,
              // repeatDelay: 0.2,
              repeatType: "mirror",
            },
          },
          exit: {
            y: Y.START,
          },
        }}
      >
        <Icon />
      </motion.div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/4">
        <CardsNodesShadow />
      </div>
    </div>
  );
};
