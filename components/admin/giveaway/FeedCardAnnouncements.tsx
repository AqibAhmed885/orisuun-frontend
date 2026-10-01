import { FeedCardAnnouncement } from './types';

interface FeedCardAnnouncementsProps {
  feedCards: FeedCardAnnouncement[];
}

export default function FeedCardAnnouncements({ feedCards }: FeedCardAnnouncementsProps) {
  return (
    <div className="rounded-2xl border-2 bg-[#f3f3f3] p-4">
      <h3 className="text-lg font-semibold text-[#243845]">Winner Feed Card Announcements</h3>
      
      {feedCards.length === 0 ? (
        <p className="text-base text-[#4b5f6c]">No finalized announcement yet.</p>
      ) : (
        <div className="mt-2 space-y-2">
          {feedCards.map((card) => (
            <div
              key={card.id}
              className="rounded-lg border border-[#4f6977] bg-white px-3 py-2 text-base text-[#243845]"
            >
              {card.weekLabel}: Winner {card.winnerName} (published {card.createdAt})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
