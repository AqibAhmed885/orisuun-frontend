'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for intersection observer functionality
 * Used for lazy loading sections and components
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        
        // Once intersected, keep it as true (for lazy loading)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [options, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
};

/**
 * Hook specifically for lazy loading sections
 * Returns true once the element has been intersected
 */
export const useLazyLoad = (options = {}) => {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px', // Start loading 100px before element comes into view
    ...options
  });

  return { ref, shouldLoad: hasIntersected };
};
