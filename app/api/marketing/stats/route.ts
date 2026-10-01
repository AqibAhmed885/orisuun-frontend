import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://api.orisuun.com/api/Marketing/GetAdvocatesAndBlackOwnedBusiness',
      {
        method: 'GET',
        headers: {
          accept: '*/*',
          // Ye key ab sirf server par hai, client ko kabhi nahi dikhegi
          XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
        },
        // Cache controls: Har 1 ghante (3600s) baad data refresh hoga
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from Orisuun' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}