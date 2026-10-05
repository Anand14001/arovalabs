import { useCallback, useState } from 'react';

/*
 * Recent search terms, kept in localStorage.
 *
 * Only the typed string is stored, never what was opened from it — a list of
 * tests someone looked at is a health record, and this is a marketing site with
 * no account behind it. Terms are capped and the whole list is clearable.
 *
 * Every access is guarded: localStorage throws in private mode and with site
 * data blocked, and a search box that crashes the page is worse than one that
 * forgets.
 */
const STORAGE_KEY = 'arova-recent-searches';
const LIMIT = 6;

function read() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((t) => typeof t === 'string' && t.trim()).slice(0, LIMIT);
  } catch {
    return [];
  }
}

function write(terms) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
  } catch {
    // Storage unavailable — the list still works for this page view.
  }
}

export default function useRecentSearches() {
  const [recent, setRecent] = useState(read);

  const remember = useCallback((term) => {
    const value = term.trim();
    if (value.length < 2) return;

    setRecent((prev) => {
      // Case-insensitive de-dupe, most recent first.
      const next = [value, ...prev.filter((t) => t.toLowerCase() !== value.toLowerCase())].slice(
        0,
        LIMIT,
      );
      write(next);
      return next;
    });
  }, []);

  const forget = useCallback((term) => {
    setRecent((prev) => {
      const next = prev.filter((t) => t !== term);
      write(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setRecent([]);
    write([]);
  }, []);

  return { recent, remember, forget, clear };
}
