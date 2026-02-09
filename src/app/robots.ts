import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/portal/', '/admin/', '/api/', '/login', '/auth/'],
      },
    ],
    sitemap: 'https://movefox.co.uk/sitemap.xml',
  };
}
