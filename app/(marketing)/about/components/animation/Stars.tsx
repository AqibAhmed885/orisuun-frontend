'use client';

import Image from 'next/image';
import { motion, useAnimate, useInView, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const Stars = () => {
  const ranges = [
    {
      min: 0.2,
      max: 0.4,
      animation: async () => {
        await Promise.all([
          animate('#star1', { x: '130%' }, { duration: 1 }),
          animate('#star2', { x: '-245%', rotate: 135 }, { duration: 1 }),
        ]);
      },
      reverseAnimation: async () => {
        await Promise.all([
          animate('#star1', { x: '0' }, { duration: 1 }),
          animate('#star2', { x: '0', rotate: 0 }, { duration: 1 }),
        ]);
      },
    },
    {
      min: 0.4,
      max: 0.6,
      animation: async () => {
        await animate('#stars_container', { y: '-30%', x: '15%', scale: 0.5 }, { duration: 1 });
      },
      reverseAnimation: async () => {
        await animate('#stars_container', { y: '0', x: '0', scale: 1 }, { duration: 1 });
      },
    },
    {
      min: 0.6,
      max: 0.8,
      animation: async () => {
        await Promise.all([
          animate('#circle', {
            pathLength: 1.1,
          }, {
            type: 'spring',
            duration: 0.5,
            bounce: 0,
          }),
          animate('#circle', {
            opacity: 1,
          }, {
            duration: 0.2,
          }),
          animate('#circle', {
            strokeLinecap: 'round',
          }),
        ]);
      },
      reverseAnimation: async () => {
        await Promise.all([
          animate('#circle', {
            pathLength: 0,
          }, {
            type: 'spring',
            duration: 0.5,
            bounce: 0,
          }),
          animate('#circle', {
            opacity: 0,
          }, {
            duration: 0.2,
          }),
          animate('#circle', {
            strokeLinecap: 'butt',
          }),
        ]);
      },
    },
    {
      min: 0.8,
      max: 1,
      animation: async () => {
        await animate('#logo_container', { y: '-10%', scale: 0.8 }, { duration: 0.5 });
      },
      reverseAnimation: async () => {
        await animate('#logo_container', { y: '0', scale: 1 }, { duration: 0.5 });
      },
    },
  ];

  const starsRef = useRef(null);
  const isInView = useInView(starsRef, {
    margin: '0px 0px -50% 0px'
  });
  useEffect(() => {
    if (isInView && previousScrollY < 0.8) {
      animate('#stars_container', { y: '-30%', x: 0, scale: 1, opacity: 1 }, {
        duration: 0.5,
      })
    } else if (isInView && previousScrollY > 0.8 && previousScrollY <= 1) {
      animate('#stars_container', { y: '-30%', x: '15%', scale: 0.5, opacity: 1 })
    }
     else {
      animate('#stars_container', { y: '-30%', x: 0, scale: 0.5, opacity: 0 })
    }
  }, [isInView]);

  const [previousScrollY, setPreviousScrollY] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const [scope, animate] = useAnimate();
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  const finishAnimationLater = () => {
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }
    animationTimerRef.current = setTimeout(() => {
      setIsAnimating(false);
      animationTimerRef.current = null;
    }, 1000);
  };

  useMotionValueEvent(scrollYProgress, 'change', async (latest) => {
    if (latest > previousScrollY) {
      const range = ranges.find(range => range.min <= latest && range.max >= latest);
      if (range) {
        setIsAnimating(true);
        finishAnimationLater();
        await range.animation();
      }
    } else {
      const range = ranges.find(range => range.min <= latest && range.max >= latest);
      if (range) {
        setIsAnimating(true);
        finishAnimationLater();
        await range.reverseAnimation();
      }
    }
    setPreviousScrollY(latest);
  });

  return (
    <div className="hidden sm:relative h-[300vh] bottom-[-50vh] -mt-[50vh] sm:flex justify-center w-full" ref={ref}>
      <div ref={scope}>
        <div id="logo_container" className="sticky top-[25%] h-[50vh] flex justify-center items-center w-full">
          <motion.div id="stars_container" className="flex gap-[500px] items-center justify-center relative"
            initial={{ y: '-30%', x: 0, scale: 0.5, opacity: 0 }}
            ref={starsRef}
          >
            < div id="star1" className="w-[248px] h-[248px] ">
              <Image src="/about/scroll/star.svg" alt="star" width={248} height={248} />
            </div>
            <div id="star2" className="w-[154px] h-[154px]">
              <Image src="/about/scroll/star.svg" alt="star" width={154} height={154} />
            </div>
          </motion.div>
          <motion.svg className="absolute top-[40%] left-[50%]" width="300"
            height="300"
            viewBox="0 0 400 400"
            initial={{ x: '-50%' }}
          >
            <motion.circle
              id="circle"
              cx="200"
              cy="200"
              r="160"
              stroke="#2C57A4"
              style={{ strokeWidth: '74px', fill: 'transparent' }}
              initial={{ pathLength: 0, opacity: 0, strokeLinecap: 'butt' }}
            />
          </motion.svg>
        </div>
      </div>
    </div>
  )
    ;
};

export default Stars;
