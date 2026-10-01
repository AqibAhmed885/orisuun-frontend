import { NextResponse } from 'next/server';
import { startDailyRecordingFromApi } from '@/app/api/daily/_daily-api';

export async function POST(
  request: Request,
  { params }: { params: { roomName: string } }
) {
  try {
    const { roomName } = params;
    let body: unknown = undefined;
    try {
      body = await request.json();
    } catch {
      body = undefined;
    }
    const response = await startDailyRecordingFromApi(roomName, body);
    const payload = await response.json();
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to start Daily recording.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
