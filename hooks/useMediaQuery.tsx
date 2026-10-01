import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = '768px';

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia(query);
      setMatches(mediaQuery.matches);
      const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
      mediaQuery.addEventListener('change', handler);

      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [query]);

  return matches;
};

export const useMobileMediaQuery: any = (width): boolean => {
  return useMediaQuery(`(max-width: ${width ? width : MOBILE_BREAKPOINT})`);
};

export default useMediaQuery;
