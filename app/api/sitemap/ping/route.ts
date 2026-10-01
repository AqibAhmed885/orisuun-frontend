/**
 * API route handler to manually trigger sitemap ping
 * Can be called from admin panel or after bulk operations
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orisuun.com';

/**
 * Ping Google to notify about sitemap update
 */
async function pingGoogleSitemap(sitemapUrl?: string): Promise<boolean> {
    try {
        const sitemap = sitemapUrl || `${siteUrl}/sitemap.xml`;
        const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`;
        
        const response = await fetch(pingUrl, {
            method: 'GET',
        });

        if (response.ok) {
            return true;
        } else {
            console.error(`❌ Failed to ping Google: ${response.status} ${response.statusText}`);
            return false;
        }
    } catch (error) {
        console.error('❌ Error pinging Google:', error);
        return false;
    }
}

/**
 * Ping Bing to notify about sitemap update
 */
async function pingBingSitemap(sitemapUrl?: string): Promise<boolean> {
    try {
        const sitemap = sitemapUrl || `${siteUrl}/sitemap.xml`;
        const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemap)}`;
        
        const response = await fetch(pingUrl, {
            method: 'GET',
        });

        if (response.ok) {
            return true;
        } else {
            console.error(`❌ Failed to ping Bing: ${response.status} ${response.statusText}`);
            return false;
        }
    } catch (error) {
        console.error('❌ Error pinging Bing:', error);
        return false;
    }
}

/**
 * Ping all search engines about sitemap updates
 */
async function pingAllSearchEngines(sitemapUrl?: string): Promise<{
    google: boolean;
    bing: boolean;
}> {
    const [google, bing] = await Promise.all([
        pingGoogleSitemap(sitemapUrl),
        pingBingSitemap(sitemapUrl),
    ]);

    return { google, bing };
}

/**
 * Notify search engines about new event or resource
 */
async function notifySearchEnginesAboutUpdate(type: 'event' | 'resource' | 'all' = 'all'): Promise<void> {
    try {
        if (type === 'event' || type === 'all') {
            await pingAllSearchEngines(`${siteUrl}/sitemap-events.xml`);
        }
        
        if (type === 'resource' || type === 'all') {
            await pingAllSearchEngines(`${siteUrl}/sitemap-resources.xml`);
        }

        // Also ping the main sitemap index
        await pingAllSearchEngines(`${siteUrl}/sitemap.xml`);
        
    } catch (error) {
        console.error('❌ Error notifying search engines:', error);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const type = body.type || 'all';

        await notifySearchEnginesAboutUpdate(type);

        return Response.json({
            success: true,
            message: `Search engines notified about ${type} updates`,
        });
    } catch (error) {
        return Response.json(
            {
                success: false,
                error: 'Failed to notify search engines',
            },
            { status: 500 }
        );
    }
}
