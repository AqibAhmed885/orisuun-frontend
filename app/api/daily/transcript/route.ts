import { NextResponse } from 'next/server';
import { fetchDailyTranscriptFromApi } from '@/app/api/daily/_daily-api';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const roomName = url.searchParams.get('roomName') || url.searchParams.get('room_name') || '';
    const response = await fetchDailyTranscriptFromApi(roomName);
    const payload = await response.json();
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load Daily transcript.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
