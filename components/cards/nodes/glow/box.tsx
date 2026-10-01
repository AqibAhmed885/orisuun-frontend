import { ANIMATION_INITIAL_DURATION } from '@/components/cards/nodes/constants';
import {
  CardsNodesGlowAura,
  TCardsNodesGlowAuraProps,
} from '@/components/cards/nodes/glow/aura';
import { motion } from 'framer-motion';
import type { FC } from 'react';

export type TCardsNodesGlowBoxProps = TCardsNodesGlowAuraProps;
export const CardsNodesGlowBox: FC<TCardsNodesGlowBoxProps> = (props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: ANIMATION_INITIAL_DURATION, ease: 'linear' }}
      style={{ x: '-50%', y: '-50%' }}
      className="absolute left-1/2 top-1/2 pointer-events-none"
    >
      <CardsNodesGlowAura {...props} />
    </motion.div>
  );
};
