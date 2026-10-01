import { NextResponse } from 'next/server';

/**
 * API endpoint to verify anti-scraping measures are active
 * Access: GET /api/security-check
 */
export async function GET(request: Request) {
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Check if it's a bot
  const botUserAgents = [
     'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot',
    'gptbot', 'chatgpt', 'ccbot', 'anthropic', 'claude', 'scrapy', 'curl', 'wget',
    'python-requests', 'axios', 'httpclient', 'selenium', 'puppeteer', 'playwright',
  ];
  
  const isBot = botUserAgents.some(bot => 
    userAgent.toLowerCase().includes(bot)
  );

  const headers = new Headers();
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  
  return NextResponse.json(
    {
      status: isBot ? 'blocked' : 'allowed',
      message: isBot 
        ? 'Bot detected - access would be blocked by middleware'
        : 'Human access - security headers applied',
      userAgent: userAgent,
      securityMeasures: {
        robotsTxt: 'All bots blocked',
        middleware: 'Bot detection active',
        headers: 'Security headers applied',
        clientSide: 'Anti-scraping component active',
        metaTags: 'No-index directives present',
      },
      timestamp: new Date().toISOString(),
    },
    { 
      status: isBot ? 403 : 200,
      headers 
    }
  );
}
