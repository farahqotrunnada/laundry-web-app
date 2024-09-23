import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LaundryXpert',
    short_name: 'LaundryXpert',
    description: 'Clean Clothes with LaundryXpert Experience the Difference',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
