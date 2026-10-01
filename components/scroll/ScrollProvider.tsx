'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useGSAPScroll } from '@/hooks/useGSAPScroll';
import { usePathname } from 'next/navigation';

type ScrollProviderProps = {
  children: ReactNode;
};

function ScrollScope({
  children,
  enabled = true,
}: ScrollProviderProps & { enabled?: boolean }) {
  const scopeRef = useRef<HTMLDivElement | null>(null);

  useGSAPScroll({ scope: scopeRef, enabled });

  return <div ref={scopeRef}>{children}</div>;
}

function HomepageMobileScrollCoordinator({ enabled }: { enabled: boolean }) {
  useGSAPScroll({ enabled });
  return null;
}

export default function ScrollProvider({ children }: ScrollProviderProps) {
  const pathname = usePathname();
  const [isMobileHomepage, setIsMobileHomepage] = useState(false);

  useEffect(() => {
    if (pathname !== '/') {
      setIsMobileHomepage(false);
      return undefined;
    }

    const mobileQuery = window.matchMedia('(max-width: 1023px)');
    const updateMobileState = () => setIsMobileHomepage(mobileQuery.matches);

    updateMobileState();
    mobileQuery.addEventListener('change', updateMobileState);

    return () => mobileQuery.removeEventListener('change', updateMobileState);
  }, [pathname]);

  if (pathname === '/') {
    return (
      <>
        <HomepageMobileScrollCoordinator enabled={isMobileHomepage} />
        {children}
      </>
    );
  }

  return <ScrollScope key={pathname}>{children}</ScrollScope>;
}
