import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
const apiKey =
  process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY || '';

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get('authorization');
    const incomingFormData = await request.formData();
    const forwardFormData = new FormData();
    const incomingEntries: Array<Record<string, unknown>> = [];

    incomingFormData.forEach((value, key) => {
      if (value === undefined || value === null) {
        return;
      }

      if (typeof value === 'string' && value.trim() === '') {
        return;
      }

      if (value instanceof File) {
        incomingEntries.push({
          key,
          type: 'file',
          name: value.name,
          size: value.size,
          mimeType: value.type,
        });
      } else {
        incomingEntries.push({ key, type: 'text', value });
      }

      forwardFormData.append(key, value);
    });


    const response = await fetch(`${apiEndpoint}/DiscountPortal/SaveDiscountDetails`, {
      method: 'POST',
      headers: {
        XApiKey: apiKey,
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: forwardFormData,
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';


    if (contentType.includes('application/json')) {
      const payload = await response.json();
      return NextResponse.json(payload, { status: response.status });
    }

    const textPayload = await response.text();
    return NextResponse.json(
      {
        message: textPayload || 'Unexpected response from discount API',
      },
      { status: response.status }
    );
  } catch (error: unknown) {
    console.error('[DiscountSaveRoute] Error', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to save discount details';

    return NextResponse.json(
      {
        message,
      },
      { status: 500 }
    );
  }
}
