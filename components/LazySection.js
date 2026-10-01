'use client';

import React from 'react';
import { useLazyLoad } from '@/hooks/useIntersectionObserver';

/**
 * LazySection component for lazy loading sections
 * Only renders children when the section comes into view
 */
export const LazySection = ({ 
  children, 
  fallback = null, 
  threshold = 0.1, 
  rootMargin = '100px',
  className = '',
  ...props 
}) => {
  const { ref, shouldLoad } = useLazyLoad({
    threshold,
    rootMargin
  });

  return (
    <div ref={ref} className={className} {...props}>
      {shouldLoad ? children : fallback}
    </div>
  );
};

/**
 * LazySection with skeleton loading fallback
 */
export const LazySectionWithSkeleton = ({ 
  children, 
  skeletonHeight = '400px',
  className = '',
  ...props 
}) => {
  const skeletonFallback = (
    <div 
      className="loading-skeleton w-full rounded-lg"
      style={{ height: skeletonHeight }}
    />
  );

  return (
    <LazySection 
      fallback={skeletonFallback}
      className={className}
      {...props}
    >
      {children}
    </LazySection>
  );
};

/**
 * LazySection with custom loading component
 */
export const LazySectionWithCustomLoader = ({ 
  children, 
  loadingComponent,
  className = '',
  ...props 
}) => {
  return (
    <LazySection 
      fallback={loadingComponent}
      className={className}
      {...props}
    >
      {children}
    </LazySection>
  );
};
