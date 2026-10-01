import { NextResponse } from 'next/server';

const resolveTargetUrl = (rawUrl: string, origin: string) => {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }

    return parsed.toString();
  } catch {
    try {
      const parsed = new URL(rawUrl, origin);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return null;
      }

      return parsed.toString();
    } catch {
      return null;
    }
  }
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return NextResponse.json({ ok: false, error: 'Missing url query param' }, { status: 400 });
  }

  const targetUrl = resolveTargetUrl(rawUrl, origin);
  if (!targetUrl) {
    return NextResponse.json({ ok: false, error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        // Helps many providers return byte-ranges for PDF.js requests.
        Range: request.headers.get('range') || 'bytes=0-',
      },
      cache: 'no-store',
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { ok: false, error: `Upstream fetch failed (${upstream.status})` },
        { status: upstream.status }
      );
    }

    const headers = new Headers();
    headers.set('Content-Type', upstream.headers.get('content-type') || 'application/pdf');
    headers.set('Cache-Control', 'private, no-store');

    const passThroughHeaders = ['accept-ranges', 'content-length', 'content-range', 'content-disposition'];
    passThroughHeaders.forEach((key) => {
      const value = upstream.headers.get(key);
      if (value) {
        headers.set(key, value);
      }
    });

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    console.error('PDF proxy failed:', error);
    return NextResponse.json({ ok: false, error: 'Failed to load PDF file' }, { status: 500 });
  }
}
