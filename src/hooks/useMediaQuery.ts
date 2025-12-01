import { useEffect, useState } from 'react';

const safeMatchMedia = (query: string): MediaQueryList | null => {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
    return null;
  }
  return window.matchMedia(query);
};

export const useMediaQuery = (query: string) => {
  const getInitialValue = () => {
    const mediaQuery = safeMatchMedia(query);
    return mediaQuery ? mediaQuery.matches : false;
  };

  const [matches, setMatches] = useState<boolean>(getInitialValue);

  useEffect(() => {
    const mediaQuery = safeMatchMedia(query);
    if (!mediaQuery) {
      return undefined;
    }

    const updateMatches = (event: MediaQueryListEvent | MediaQueryList) => {
      setMatches(event.matches);
    };

    updateMatches(mediaQuery);

    const listener = (event: MediaQueryListEvent) => updateMatches(event);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      mediaQuery.addListener(listener);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
};
