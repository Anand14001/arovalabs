import { useEffect, useState } from 'react';

/*
 * Subscribes to a media query. Used to keep layout-switching decisions in one
 * place rather than guessing at a breakpoint from `window.innerWidth` and then
 * forgetting to listen for resizes.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);

    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
