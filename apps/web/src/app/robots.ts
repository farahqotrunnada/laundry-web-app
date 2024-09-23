import { FRONTEND_URL } from '@/lib/constant';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: '/',
      userAgent: '*',
      disallow: '/dashboard',
    },
    sitemap: FRONTEND_URL + '/sitemap.xml',
  };
}
