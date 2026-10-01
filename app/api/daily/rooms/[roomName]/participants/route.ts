import { NextResponse } from 'next/server';
import { fetchDailyParticipantsFromApi } from '@/app/api/daily/_daily-api';

export async function GET(
  _request: Request,
  { params }: { params: { roomName: string } }
) {
  try {
    const { roomName } = params;
    const response = await fetchDailyParticipantsFromApi(roomName);
    const payload = await response.json();
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load Daily participants.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
