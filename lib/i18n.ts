'use client';

export type Lang = 'en' | 'ur';

type Dict = Record<string, { en: string; ur: string }>;

export const TRANSLATIONS: Dict = {
  // Navbar
  'nav.shop':            { en: 'Shop',            ur: 'خریداری' },
  'nav.allProducts':     { en: 'All Products',    ur: 'تمام مصنوعات' },
  'nav.categories':      { en: 'Categories',      ur: 'اقسام' },
  'nav.newArrivals':     { en: 'New Arrivals',    ur: 'نئی آمد' },
  'nav.sale':            { en: 'Sale',            ur: 'سیل' },
  'nav.about':           { en: 'About Us',        ur: 'ہمارے بارے میں' },
  'nav.contact':         { en: 'Contact',         ur: 'رابطہ' },
  'nav.faq':             { en: 'FAQ',             ur: 'سوالات' },
  'nav.search':          { en: 'Search products, categories, brands...', ur: 'مصنوعات، اقسام تلاش کریں...' },
  'nav.loginRegister':   { en: 'Login / Register', ur: 'لاگ ان / رجسٹر' },
  'nav.account':         { en: 'Account',          ur: 'اکاؤنٹ' },
  'nav.logout':          { en: 'Logout',           ur: 'لاگ آؤٹ' },
  'nav.orders':          { en: 'My Orders',        ur: 'میرے آرڈرز' },
  'nav.trackOrder':      { en: 'Track Order',      ur: 'آرڈر ٹریک کریں' },
  'nav.wishlist':        { en: 'My Wishlist',      ur: 'میری خواہشات' },
  'nav.settings':        { en: 'Settings',         ur: 'ترتیبات' },
  'nav.overview':        { en: 'Overview',         ur: 'جائزہ' },
  'nav.home':            { en: 'Home',             ur: 'ہوم' },
  'nav.cart':            { en: 'Cart',             ur: 'کارٹ' },

  // Hero
  'hero.title1':         { en: "Pakistan's",       ur: 'پاکستان کا' },
  'hero.title2':         { en: 'Trusted',          ur: 'معتبر' },
  'hero.title3':         { en: 'Online Store',     ur: 'آن لائن اسٹور' },
  'hero.subtitle':       { en: 'Quality products, fast delivery, and excellent service. Discover amazing products at unbeatable prices with our immersive 3D shopping experience.',
                           ur: 'معیاری مصنوعات، تیز ترسیل، اور بہترین سروس۔ ہمارے شاندار 3D شاپنگ تجربے کے ساتھ ناقابل یقین قیمتوں پر شاندار مصنوعات دریافت کریں۔' },
  'hero.shopNow':        { en: 'Shop Now',         ur: 'ابھی خریدیں' },
  'hero.explore':        { en: 'Explore Categories', ur: 'اقسام دیکھیں' },

  // Products
  'products.featured':   { en: 'Featured Products', ur: 'نمایاں مصنوعات' },
  'products.featuredSub':{ en: 'Discover our handpicked selection with interactive 3D previews', ur: 'انٹرایکٹو 3D پیش نظاروں کے ساتھ ہمارا منتخب کردہ انتخاب دریافت کریں' },
  'products.addToCart':  { en: 'Add to Cart',       ur: 'کارٹ میں شامل کریں' },
  'products.outOfStock': { en: 'Out of Stock',      ur: 'اسٹاک میں نہیں' },
  'products.onlyLeft':   { en: 'Only {n} left!',    ur: 'صرف {n} باقی!' },

  // Sections
  'categories.title':    { en: 'Shop by Category',  ur: 'قسم کے لحاظ سے خریدیں' },
  'categories.subtitle': { en: 'Browse through our diverse product categories', ur: 'ہماری متنوع مصنوعات کی اقسام دیکھیں' },
  'features.delivery':   { en: 'Fast Delivery',     ur: 'تیز ترسیل' },
  'features.secure':     { en: 'Secure Shopping',   ur: 'محفوظ خریداری' },
  'features.prices':     { en: 'Best Prices',       ur: 'بہترین قیمتیں' },
  'features.support':    { en: '24/7 Support',      ur: '24/7 معاونت' },

  // Cart
  'cart.title':          { en: 'Shopping Cart',     ur: 'شاپنگ کارٹ' },
  'cart.empty':          { en: 'Your cart is empty', ur: 'آپ کی کارٹ خالی ہے' },
  'cart.subtotal':       { en: 'Subtotal',          ur: 'ذیلی رقم' },
  'cart.delivery':       { en: 'Delivery',          ur: 'ترسیل' },
  'cart.total':          { en: 'Total',             ur: 'کل' },
  'cart.checkout':       { en: 'Proceed to Checkout', ur: 'چیک آؤٹ پر جائیں' },
  'cart.free':           { en: 'FREE',              ur: 'مفت' },
  'cart.freeShipHint':   { en: 'Add {amt} more for free shipping', ur: 'مفت ترسیل کے لیے {amt} مزید شامل کریں' },

  // Buttons
  'btn.continue':        { en: 'Continue Shopping', ur: 'خریداری جاری رکھیں' },
  'btn.viewAll':         { en: 'View all',          ur: 'سب دیکھیں' },
  'btn.clear':           { en: 'Clear',             ur: 'صاف کریں' },
  'btn.filters':         { en: 'Filters',           ur: 'فلٹرز' },
  'btn.apply':           { en: 'Apply Filters',     ur: 'فلٹرز لاگو کریں' },
  'btn.reset':           { en: 'Reset',             ur: 'ری سیٹ' },
  'btn.save':            { en: 'Save',              ur: 'محفوظ کریں' },
  'btn.cancel':          { en: 'Cancel',            ur: 'منسوخ' },
  'btn.confirm':         { en: 'Confirm',           ur: 'تصدیق کریں' },
  'btn.buyNow':          { en: 'Buy Now',           ur: 'ابھی خریدیں' },

  // Sections titles
  'section.recentlyViewed': { en: 'Recently Viewed', ur: 'حال ہی میں دیکھا گیا' },
  'section.related':        { en: 'You may also like', ur: 'آپ کو یہ بھی پسند آ سکتا ہے' },
  'section.reviews':        { en: 'Customer Reviews', ur: 'گاہک کے جائزے' },
  'section.footerLinks':    { en: 'Quick Links',    ur: 'فوری لنکس' },
  'section.company':        { en: 'Company',        ur: 'کمپنی' },
  'section.contact':        { en: 'Contact Us',     ur: 'ہم سے رابطہ' },

  // Order statuses
  'status.placed':          { en: 'Placed',           ur: 'جگہ دی گئی' },
  'status.processing':      { en: 'Processing',       ur: 'کارروائی' },
  'status.confirmed':       { en: 'Confirmed',        ur: 'تصدیق شدہ' },
  'status.shipped':         { en: 'Shipped',          ur: 'بھیج دیا' },
  'status.out_for_delivery':{ en: 'Out for Delivery', ur: 'ترسیل کے لیے' },
  'status.delivered':       { en: 'Delivered',        ur: 'پہنچا دیا' },
  'status.cancelled':       { en: 'Cancelled',        ur: 'منسوخ' },
};

export function translate(key: string, lang: Lang = 'en', vars?: Record<string, string>): string {
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  let s = entry[lang] || entry.en;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
  return s;
}

export function getCurrentLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('pref_lang') || 'en';
  return saved === 'ur' ? 'ur' : 'en';
}
