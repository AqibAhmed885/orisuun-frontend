'use client';

import { useLayoutEffect, useState } from 'react';

const useScaleFactor = () => {
  const [scaleFactor, setScaleFactor] = useState<number | null>(null);

  useLayoutEffect(() => {
    const calculateScaleFactor = () => {
      const newScaleFactor = Math.min(
        window.innerWidth / 1440,
        window.innerHeight / 900
      );
      setScaleFactor(newScaleFactor);
      document.documentElement.style.setProperty(
        '--scale-factor',
        newScaleFactor.toString()
      );
    };

    calculateScaleFactor();
    window.addEventListener('resize', calculateScaleFactor);
    return () => window.removeEventListener('resize', calculateScaleFactor);
  }, []);

  return scaleFactor;
};

export default useScaleFactor;
