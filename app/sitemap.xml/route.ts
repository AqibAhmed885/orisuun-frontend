import { NextResponse } from 'next/server';
import { escapeXml, getSiteUrl } from '../sitemap-generator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SITEMAPS = [
  '/sitemap-pages.xml',
  '/sitemap-blogs.xml',
];

export async function GET() {
    const siteUrl = getSiteUrl();
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAPS.map((sitemapPath) => `  <sitemap>
    <loc>${escapeXml(`${siteUrl}${sitemapPath}`)}</loc>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new NextResponse(sitemapIndex, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
    });
}
