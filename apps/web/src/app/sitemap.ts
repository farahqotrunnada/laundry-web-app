import { FRONTEND_URL } from '@/lib/constant';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = ['/'];

  return urls.map((url) => ({
    url: FRONTEND_URL + url,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));
}
