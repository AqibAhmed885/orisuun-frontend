'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AntiScraping from './AntiScraping';

/**
 * Conditionally renders AntiScraping only when the current pathname
 * is not the sign-in or sign-up pages (/signin, /signup).
 */
export default function AntiScrapingConditional() {
  const pathname = usePathname() || '';
  // Normalize pathname (strip query and trailing slash)
  const basePath = pathname.split('?')[0].replace(/\/$/, '');

  if (basePath === '/signin' || basePath === '/signup' || basePath === '/payment') {
    return null;
  }

  return <AntiScraping />;
}
