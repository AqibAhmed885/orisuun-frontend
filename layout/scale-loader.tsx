'use client';

import { ReactNode } from 'react';
import useScaleFactor from '@/hooks/useScaleHook';

export default function ScaleFactorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const scaleFactor = useScaleFactor();

  if (scaleFactor === null) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <>{children}</>;
}
