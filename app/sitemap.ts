export const dynamic = 'force-static'

import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://jzai.store', lastModified: new Date(), priority: 1 },
    { url: 'https://jzai.store/pricing', lastModified: new Date(), priority: 0.9 },
    { url: 'https://jzai.store/create-chatbot', lastModified: new Date(), priority: 0.8 },
    { url: 'https://jzai.store/auth', lastModified: new Date(), priority: 0.6 },
  ]
}
