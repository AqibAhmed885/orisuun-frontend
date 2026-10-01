import { NextResponse } from 'next/server';
import { escapeXml, getSitemapUrls } from '../sitemap-generator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const urls = getSitemapUrls();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url>\n    <loc>${escapeXml(String(u.url))}</loc>\n    <changefreq>daily</changefreq>\n  </url>`).join('\n')}\n</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
