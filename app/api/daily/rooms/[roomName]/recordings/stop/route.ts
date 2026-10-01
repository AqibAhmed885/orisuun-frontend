import { NextResponse } from 'next/server';
import { stopDailyRecordingFromApi } from '@/app/api/daily/_daily-api';

export async function POST(
  _request: Request,
  { params }: { params: { roomName: string } }
) {
  try {
    const { roomName } = params;
    const response = await stopDailyRecordingFromApi(roomName);
    const payload = await response.json();
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to stop Daily recording.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
