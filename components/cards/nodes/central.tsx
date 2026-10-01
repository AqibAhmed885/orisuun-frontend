import {
  NODES_BORDER_RADIUS_STYLE,
  NODES_CENTER_FONT_STYLE,
  NODES_DROP_SHADOW_STYLE,
} from '@/components/cards/nodes/constants';
import { CardsNodesIcon } from '@/components/cards/nodes/central-icon';
import { CENTRAL_KEY } from '@/components/cards/nodes/sections/constants';
import { useCardsNodesSectionsHover } from '@/components/cards/nodes/sections/context/hover';
import { useCardsNodesSectionsOpen } from '@/components/cards/nodes/sections/context/open';
import { TNodeProps } from '@/components/cards/nodes/types';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

type TProps = Omit<TNodeProps, 'Path'> & {
  dataIndex: number;
};

export const CardsNodesCentral: FC<TProps> = ({
  classValue,
  style,
  Icon,
  overlay,
  children,
  dataIndex,
  ...props
}) => {
  const hover = useCardsNodesSectionsHover();
  const open = useCardsNodesSectionsOpen();
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onhoverStart = () => {
    hover.update(overlay);
    setIsHovering(true);
    setShowBadges(true); // Show badges on hover
    // Optionally clear timer if set
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const onhoverEnd = () => {
    hover.update(null);
    setIsHovering(false);
    setShowBadges(false); // Hide badges when hover ends
    // Optionally clear timer if set
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const onTap = () => {
    open.update(overlay);
  };

  // Intersection observer for the "Co-Founder Match"
  const { ref: coFounderRef, inView: coFounderInView } = useInView({
    threshold: 0.5, // adjust as needed
    triggerOnce: false,
  });

  const [showBadges, setShowBadges] = useState(false);

  useEffect(() => {
    if (coFounderInView && localStorage.getItem('userType') === 'userType') {
      hover.update(overlay);
      setShowBadges(true); // Show both badges

      // Clear existing timer
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Hide badges and reset hover after 5 seconds
      timeoutRef.current = setTimeout(() => {
        hover.update(null);
        setShowBadges(false);
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [coFounderInView]);

  return (
    <motion.div
      className={clsx(
        'flex flex-col items-center justify-center text-center h-[120px] w-[240px] bg-[#0A193A] text-[#fff]',
        classValue,
      )}
      style={{
        ...NODES_BORDER_RADIUS_STYLE,
        ...NODES_CENTER_FONT_STYLE,
        ...style,
      }}
      onHoverStart={onhoverStart}
      onHoverEnd={onhoverEnd}
      onTap={onTap}
      {...props}
    >
      <>
        <CardsNodesIcon Icon={Icon} isAnimating={false} />
        {children}
        <motion.div
          className="absolute top-[20px] text-sm text-blue-500 flex justify-center pb-[10px] pt-[10px] pr-[20px] pl-[20px] bg-white rounded-full"
          style={{
            transform: 'translateZ(-1px) translateY(400%)',
            ...NODES_DROP_SHADOW_STYLE,
          }}
          animate={showBadges ? 'visible' : 'hidden'}
          variants={{
            hidden: {
              x: 0,
              z: -1,
              opacity: 0,
              transition: {
                type: 'spring',
                bounce: 0.4,
                duration: 1,
              },
            },
            visible: {
              x: '-110%',
              z: -1,
              opacity: 1,
              transition: {
                type: 'spring',
                bounce: 0.4,
                duration: 1,
              },
            },
          }}
        >
          Board Member Match
        </motion.div>
        <motion.div
          ref={coFounderRef}
          className="absolute bottom-[20px] text-sm text-blue-500 flex justify-center pb-[10px] pt-[10px] pr-[20px] pl-[20px] bg-white rounded-full z-10"
          style={{
            transform: 'translateZ(-1px) translateY(400%)',
            ...NODES_DROP_SHADOW_STYLE,
          }}
          animate={showBadges ? 'visible' : 'hidden'}
          variants={{
            hidden: {
              x: 0,
              z: -1,
              opacity: 0,
              transition: {
                type: 'spring',
                bounce: 0.4,
                duration: 1.5,
              },
            },
            visible: {
              x: '116%',
              z: -1,
              opacity: 1,
              transition: {
                type: 'spring',
                bounce: 0.4,
                duration: 1.5,
              },
            },
          }}
        >
          Co-Founder Match
        </motion.div>
      </>
    </motion.div>
  );
};
