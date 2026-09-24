'use client';
import { useEffect, useState } from 'react';
import { translate, getCurrentLang, type Lang } from './i18n';

export function useI18n() {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const update = () => setLang(getCurrentLang());
    update();
    window.addEventListener('pref-change', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('pref-change', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  const t = (key: string, vars?: Record<string, string>) => translate(key, lang, vars);

  return { lang, t, isRTL: lang === 'ur' };
}
