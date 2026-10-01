import { HTMLMotionProps } from 'framer-motion';
import { ClassValue } from 'clsx';
import { FC, SVGAttributes } from 'react';
import { TCardsNodesPathProps } from '@/components/cards/nodes/path';
import { TCardsNodesGlowBoxProps } from '@/components/cards/nodes/glow/box';
export type TNodeProps = HTMLMotionProps<'div'> & {
  Icon: FC<SVGAttributes<SVGSVGElement>>;
  Path: FC;
  overlay: string;

} & Partial<{
    classValue: ClassValue;
    pathProps: Pick<TCardsNodesPathProps, 'classValue' | 'style'>;
    glowProps: Partial<TCardsNodesGlowBoxProps>
  }>;
