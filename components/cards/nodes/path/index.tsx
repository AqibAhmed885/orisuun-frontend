import type { FC } from 'react';
import { TNodeProps } from '@/components/cards/nodes/types';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { ANIMATION_INITIAL_DURATION } from '@/components/cards/nodes/constants';
export type TCardsNodesPathProps = Pick<
  TNodeProps,
  'classValue' | 'style' | 'Path'
>;
export const CardsNodesPath: FC<TCardsNodesPathProps> = ({
  classValue,
  style,
  Path,

}) => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ ...style }}
      className={clsx('pointer-events-none', classValue)}
      transition={{ duration: ANIMATION_INITIAL_DURATION, ease: 'easeInOut' }}
    >
      <Path />
    </motion.div>
  );
};
