import { useEffect, useState } from 'react';

const STORAGE_KEY = 'mvep_dark';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(STORAGE_KEY, String(isDark));
    } catch {
      // localStorage unavailable (private browsing, disabled, etc.) — dark mode just won't persist
    }
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((prev) => !prev) };
}
