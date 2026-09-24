export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
  { code: 'ps', name: 'Pashto', native: 'پښتو' },
  { code: 'bal', name: 'Balochi', native: 'بلوچی' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'fa', name: 'Persian', native: 'فارسی' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
];

export const CURRENCIES = [
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  { code: 'USD', symbol: '$',  name: 'US Dollar' },
  { code: 'EUR', symbol: '€',  name: 'Euro' },
  { code: 'GBP', symbol: '£',  name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼',  name: 'Saudi Riyal' },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee' },
  { code: 'BDT', symbol: '৳',  name: 'Bangladeshi Taka' },
  { code: 'CNY', symbol: '¥',  name: 'Chinese Yuan' },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen' },
  { code: 'KRW', symbol: '₩',  name: 'Korean Won' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'TRY', symbol: '₺',  name: 'Turkish Lira' },
  { code: 'RUB', symbol: '₽',  name: 'Russian Ruble' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'THB', symbol: '฿',  name: 'Thai Baht' },
  { code: 'ZAR', symbol: 'R',  name: 'South African Rand' },
  { code: 'NGN', symbol: '₦',  name: 'Nigerian Naira' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'QAR', symbol: '﷼',  name: 'Qatari Riyal' },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar' },
];

// Conversion rates FROM PKR (base)
export const PKR_RATES: Record<string, number> = {
  PKR: 1,      USD: 0.0036, EUR: 0.0033, GBP: 0.0028,
  AED: 0.0132, SAR: 0.0135, INR: 0.30,   BDT: 0.43,
  CNY: 0.026,  JPY: 0.55,   KRW: 4.9,    AUD: 0.0055,
  CAD: 0.0049, CHF: 0.0032, TRY: 0.12,   RUB: 0.34,
  MYR: 0.016,  SGD: 0.0048, HKD: 0.028,  THB: 0.13,
  ZAR: 0.066,  NGN: 5.6,    EGP: 0.18,   QAR: 0.0131, KWD: 0.0011,
};

export function getLang() {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('pref_lang') || 'en';
}
export function getCurrency() {
  if (typeof window === 'undefined') return 'PKR';
  return localStorage.getItem('pref_currency') || 'PKR';
}
export function setLang(code: string) {
  localStorage.setItem('pref_lang', code);
  window.dispatchEvent(new Event('pref-change'));
}
export function setCurrency(code: string) {
  localStorage.setItem('pref_currency', code);
  window.dispatchEvent(new Event('pref-change'));
}
export function convertPrice(pkr: number, currency = getCurrency()) {
  const rate = PKR_RATES[currency] || 1;
  const cur  = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];
  return `${cur.symbol} ${(pkr * rate).toFixed(currency === 'PKR' ? 0 : 2)}`;
}
