'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

type Props = {
  src: string;
  name: string;
  additionalClass?: string;
  isAnimation?: boolean;
  isLast: boolean;
};

const AnimationIcon: React.FC<Props> = ({ src, name, additionalClass, isAnimation, isLast,...props }) => {
  const exitAnimation = { opacity: 0, y: 200 } 
  
  return (
    <motion.div className={'flex flex-col items-center justify-center gap-10 ' + additionalClass} {...props}
                initial={isAnimation ? { opacity: 0, y: -200 } : { opacity: 1, y: 0 }}
                animate={isAnimation ? { opacity: 1, y: 0 } : null}
                exit={exitAnimation}
                transition={{ duration: 0.5 }}
    >
      <Image src={src} alt={name} width={130} height={130} />
      <p className="max-w-[210px] text-[#2C57A4] text-2xl font-semibold text-center">{name}</p>
    </motion.div>
  );
};

export default AnimationIcon;