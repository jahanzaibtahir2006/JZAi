export const dynamic = 'force-static'

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/api', '/reset-password'],
    },
    sitemap: 'https://jzai.store/sitemap.xml',
  }
}
