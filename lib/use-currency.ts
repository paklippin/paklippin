'use client';
import { useEffect, useState } from 'react';
import { getCurrency, convertPrice } from './locale';

export function useCurrency() {
  const [currency, setCurrencyState] = useState<string>('PKR');

  useEffect(() => {
    const update = () => setCurrencyState(getCurrency());
    update();
    window.addEventListener('pref-change', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('pref-change', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return {
    currency,
    price: (pkr: number) => convertPrice(pkr, currency),
    raw: (pkr: number) => pkr * (require('./locale').PKR_RATES[currency] || 1),
  };
}
