import { NextResponse } from 'next/server';
import axios from 'axios';
import { createBlogSlug } from '@/lib/blog-slug';
import { getSiteUrl } from '../sitemap-generator';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;

const headers = {
    'XApiKey': `${process.env.NEXT_PUBLIC_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

export const runtime = 'nodejs';
// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper to escape XML special characters
function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function GET() {
    const siteUrl = getSiteUrl();

    try {
        // Fetch published blogs (get large page size to retrieve all)
        const response = await axios.post(`${apiEndpoint}/Blog/GetBlogs`, {
            Status: 'Published',
            PageNumber: 1,
            PageSize: 10000,
        }, {
            headers,
        });

        const blogs = response.data?.Result?.Blogs || response.data?.Result || response.data || [];

        // Filter and normalize
        let activeBlogs = (Array.isArray(blogs) ? blogs : []).filter((b: any) =>
            b && b.Title && b.Title.trim() !== '' && b.IsDeleted !== true && b.IsActive !== false
        );

        // If API returned no blogs, try to fall back to local articles data so sitemap isn't empty
        if (!activeBlogs || activeBlogs.length === 0) {
            try {
                const local = await import('../../data/articals');
                const localArticles = local?.articles || [];
                if (localArticles.length > 0) {
                    console.info('Using local articles fallback for blogs sitemap');
                    activeBlogs = localArticles.map((a: any) => ({
                        Id: a.id,
                        Title: a.title || '',
                        UpdatedAt: a.date || new Date().toISOString(),
                        IsActive: true,
                    }));
                }
            } catch (impErr) {
                console.warn('Local articles import failed for sitemap fallback:', impErr);
            }
        }

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Insights Page -->
    <url>
        <loc>${siteUrl}/insights</loc>
        <changefreq>daily</changefreq>
    </url>

${activeBlogs.map((b: any) => {
    const slug = createBlogSlug(b.Title || b.Slug || String(b.Id || ''));
    const link = `${siteUrl}/insights/${encodeURIComponent(slug)}`;

    return `    <url>
        <loc>${escapeXml(link)}</loc>
        <changefreq>daily</changefreq>
    </url>`;
}).join('\n')}
</urlset>`;

        return new NextResponse(sitemap, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
            },
        });
    } catch (error) {
        console.error('Error generating blogs sitemap:', error);

        // Fallback: basic sitemap pointing to insights page
        const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${siteUrl}/insights</loc>
        <changefreq>daily</changefreq>
    </url>
</urlset>`;

        return new NextResponse(fallback, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    }
}
