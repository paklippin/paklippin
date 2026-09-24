import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://paklippinshop.pages.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = [
    { url: '/',                    priority: 1.0,  changeFrequency: 'daily'   as const },
    { url: '/shop',                priority: 0.9,  changeFrequency: 'daily'   as const },
    { url: '/categories',          priority: 0.8,  changeFrequency: 'weekly'  as const },
    { url: '/new-arrivals',        priority: 0.8,  changeFrequency: 'daily'   as const },
    { url: '/sale',                priority: 0.8,  changeFrequency: 'daily'   as const },
    { url: '/about',               priority: 0.6,  changeFrequency: 'monthly' as const },
    { url: '/contact',             priority: 0.6,  changeFrequency: 'monthly' as const },
    { url: '/faq',                 priority: 0.6,  changeFrequency: 'monthly' as const },
    { url: '/terms',               priority: 0.4,  changeFrequency: 'yearly'  as const },
    { url: '/privacy',             priority: 0.4,  changeFrequency: 'yearly'  as const },
    { url: '/shipping',            priority: 0.4,  changeFrequency: 'yearly'  as const },
    { url: '/returns',             priority: 0.4,  changeFrequency: 'yearly'  as const },
  ];

  return staticPages.map((p) => ({
    url: `${BASE}${p.url}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
