import { MetadataRoute } from 'next';

function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'https://orisuun.com';

  return siteUrl.replace(/\/+$/, '');
}

export default function robots(): MetadataRoute.Robots {
  const isStaging = process.env.NEXTAUTH_URL?.includes('staging');
  const siteUrl = getSiteUrl();

  if (isStaging) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      host: siteUrl,
      sitemap: `${siteUrl}/sitemap.xml`,
    };
  }

  // Production — keep existing rules
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
