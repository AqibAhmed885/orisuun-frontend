import AnimationIcon from './animation-icon';
import {
  AnimatePresence,
  scroll,
  useAnimate,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Stars from '@/app/(marketing)/about/components/animation/Stars';

import { AllIconsImages, scrollRanges, visibleRange } from '../../../../../data/marketing/aboutData'
const isInRange = (value, min, max) => {
  return value >= min && value <= max;
};

const findRange = (value) => {
  for (let i = 0; i < scrollRanges.length; i++) {
    if (isInRange(value, scrollRanges[i].min, scrollRanges[i].max)) {
      return i;
    }
  }
  return 0;
};

const AnimationSection = () => {
  const [docEnv, setDocEnv] = useState(false);
  const [isAnimation, setIsAnimation] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setDocEnv(true);
    }
  }, []);
  const animationRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentElement, setCurrentElement] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [scope, animate] = useAnimate();
  const elements = AllIconsImages.map((icon, index) => (
    <AnimationIcon
      key={index}
      additionalClass="absolute right-0"
      src={icon.src}
      name={icon.name}
      isAnimation={isAnimation}
      isLast={icon.name === 'Expert'}
    />
  ));

  scroll((progress) => {
    setProgress(progress);
  });

  useEffect(() => {
    const range = findRange(progress);
    if (isInRange(progress, visibleRange.min, visibleRange.max)) {
      setHidden(false);
    } else {
      setHidden(true);
    }
    if (!hidden) {
      if (currentElement !== range) {
        setCurrentElement(range);
      }
      if (currentElement !== 0) {
        setIsAnimation(true);
      }
    }
  }, [elements.length, currentElement, progress, hidden]);

  return (
    <>
      <div
        className="sm:block hidden"
        style={{ height: 'calc(100dvh * 1.8)' }}
        ref={scope}
      >
        <AnimatePresence>
          {!hidden && (
            <motion.div
              id="icons_block"
              className={`sticky z-20 top-[60%] left-[50%] flex items-center w-[800px]`}
              initial={{ x: '-250px', y: '-100%' }}
              exit={{ y: -400, opacity: 0, scale: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              ref={animationRef}
            >
              <AnimationIcon
                src={'/about/scroll/black_owned.png'}
                name={'Black-owned Business'}
                isAnimation={isAnimation}
                isLast={false}
              />
              <AnimatePresence>{elements[currentElement]}</AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Stars />
    </>
  );
};

export default AnimationSection;
