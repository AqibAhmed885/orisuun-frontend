import DailyLiveRoom from '@/components/DailyLiveRoom';

type LivePageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    host?: string | string[];
    name?: string | string[];
    testRemainingSeconds?: string | string[];
  };
};

const getFirstValue = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

export default function LivePage({ params, searchParams }: LivePageProps) {
  const bookingId = decodeURIComponent(params.id);
  const hostParam = getFirstValue(searchParams?.host);
  const nameParam = getFirstValue(searchParams?.name);
  const testRemainingSeconds = Number(getFirstValue(searchParams?.testRemainingSeconds));

  return (
    <DailyLiveRoom
      bookingId={bookingId}
      preferredUserName={nameParam?.trim() || undefined}
      preferredIsHost={hostParam?.toLowerCase() === 'true'}
      debugRemainingSeconds={Number.isFinite(testRemainingSeconds) ? testRemainingSeconds : undefined}
    />
  );
}
