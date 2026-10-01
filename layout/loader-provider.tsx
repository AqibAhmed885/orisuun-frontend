'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import ThemeLoader from '@/components/ui/loader';
import { Provider } from 'react-redux';
import store from '@/data/store';
import ErrorBoundary from '../components/ui/error-boundary';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import ScaleFactorProvider from './scale-loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleComplete);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleComplete);
    };
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <ScaleFactorProvider>
      <Provider store={store}>
        <ErrorBoundary>
          <Suspense fallback={<ThemeLoader />}>
            {/* {isLoading && <ThemeLoader />} */}
            {children}
          </Suspense>
        </ErrorBoundary>
      </Provider>
    </ScaleFactorProvider>
  );
}
