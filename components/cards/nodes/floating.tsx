'use client';

import {
  ANIMATION_INITIAL_DURATION,
  NODE_HEIGHT,
  NODE_WIDTH,
  NODES_BORDER_RADIUS_STYLE,
  NODES_DROP_SHADOW_STYLE,
  NODES_FONT_STYLE,
} from '@/components/cards/nodes/constants';
import { CardsNodesGlowBox } from '@/components/cards/nodes/glow/box';
import { CardsNodesIcon } from '@/components/cards/nodes/central-icon';
import { CardsNodesPath } from '@/components/cards/nodes/path';
import { CENTRAL_KEY } from '@/components/cards/nodes/sections/constants';
import { useCardsNodesSectionsHover } from '@/components/cards/nodes/sections/context/hover';
import { useCardsNodesSectionsOpen } from '@/components/cards/nodes/sections/context/open';
import { TNodeProps } from '@/components/cards/nodes/types';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';

type TProps = TNodeProps & {
  cardProps?: Pick<TNodeProps, 'classValue' | 'style'>;
  isAnimatedOnCentral?: boolean;
  dataIndex: number;
  forceShowPath: boolean;
  showGradientBorder?: boolean;
};

export const CardsNodesFloating: FC<TProps> = ({
  title,
  classValue,
  children,
  style,
  Icon,
  Path,
  pathProps,
  cardProps = {},
  glowProps = {},
  overlay,
  dataIndex,
  forceShowPath,
  isAnimatedOnCentral = true,
  showGradientBorder = false,
  ...props
}) => {
  const {
    classValue: cardClassValue,
    style: cardStyle,
    ...restCardProps
  } = cardProps;

  const hover = useCardsNodesSectionsHover();
  const open = useCardsNodesSectionsOpen();
  const userType = useSelector((state: RootState) => state.animation.userType);

  useEffect(() => {
  }, [userType]);
  const isCentral = hover.key === CENTRAL_KEY;
  let isHovering;
  if (userType != 'userType') {
    isHovering = true;
  }
  else {
    isHovering = hover.key === children;
  }



  return (
    <motion.div
      className={clsx('relative cursor-pointer', classValue)}
      style={{
        height: NODE_HEIGHT,
        width: NODE_WIDTH,
        ...style,
      }}
      {...props}
    >
      <AnimatePresence>
        {(isHovering || (isCentral && isAnimatedOnCentral) || forceShowPath) && (
          <CardsNodesPath Path={Path} {...pathProps} />
        )}
      </AnimatePresence>

      <motion.div
        className={clsx(
          'relative flex items-center bg-white justify-center text-center w-full h-full',
          cardClassValue,
        )}
        style={{
          ...NODES_BORDER_RADIUS_STYLE,
          ...NODES_FONT_STYLE,
          ...NODES_DROP_SHADOW_STYLE,
          ...cardStyle,
        }}
        onHoverStart={() => hover.update(children)}
        onHoverEnd={() => hover.update(null)}
        onTap={() => open.update(overlay)}
        {...restCardProps}
      >

        {
          userType == "userType" && <AnimatePresence>
            {isHovering && <CardsNodesGlowBox id={overlay} {...glowProps} />}
          </AnimatePresence>
        }


        {showGradientBorder && (
          <div
            className="absolute inset-[2px] rounded-[10px]"
            style={{
              background: 'linear-gradient(90deg, #0066B2, #0A7CC3, #0078BE, #0067B2)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '2px',
            }}
          />
        )}
        <>
          <CardsNodesIcon Icon={Icon} isAnimating={isHovering} />
          {children}
        </>
      </motion.div>
    </motion.div>
  );
};
