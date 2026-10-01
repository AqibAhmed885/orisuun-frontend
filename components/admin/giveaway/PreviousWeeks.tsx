import { useEffect, useMemo, useState } from 'react';
import { apiBaseUrl, asBoolean, asNumber, asString, formatDateForApi, formatCycleLabel } from './types';
import ArrowLeft from '@/icons/arrow-left';
import ArrowRight from '@/icons/arrow-right';
import { CycleApiResponse, SelectionRecord, getAccessToken } from './types';

interface PreviousMemberRow {
  id: string;
  name: string;
  rank: number;
  entries: number;
  activities: number;
  status: 'Active' | 'Disqualified';
  previouslyDisqualified: boolean;
}

interface PreviousWeeksProps {
  history: SelectionRecord[];
  isLoading: boolean;
  error: string | null;
}

export default function PreviousWeeks({
  history,
  isLoading,
  error,
}: PreviousWeeksProps) {
  const cycleHistory = useMemo(
    () => [...history].sort((left, right) => {
      const leftTime = new Date(left.endDate ?? left.selectionDate ?? 0).getTime();
      const rightTime = new Date(right.endDate ?? right.selectionDate ?? 0).getTime();
      return rightTime - leftTime;
    }),
    [history]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMembers, setSelectedMembers] = useState<PreviousMemberRow[]>([]);
  const [selectedCycleLabel, setSelectedCycleLabel] = useState<string>('');
  const [selectedSelectionDate, setSelectedSelectionDate] = useState<string>('');
  const [isCycleLoading, setIsCycleLoading] = useState(false);
  const [cycleLoadError, setCycleLoadError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedIndex(0);
  }, [cycleHistory.length]);

  useEffect(() => {
    const selectedSelection = cycleHistory[selectedIndex] ?? cycleHistory[0];

    const fetchSelectedCycle = async () => {
      if (!selectedSelection?.endDate) {
        setSelectedMembers([]);
        setSelectedCycleLabel(selectedSelection?.weekLabel ?? '');
        setSelectedSelectionDate(selectedSelection?.selectionDate ?? '');
        return;
      }

      setIsCycleLoading(true);
      setCycleLoadError(null);

      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
        const token = getAccessToken();
        const response = await fetch(
          `${apiBaseUrl}/api/Admin/WeeklyGiveawayAdmin/GetCycleDetailsByDate?date=${formatDateForApi(new Date(selectedSelection.endDate))}`,
          {
            method: 'GET',
            headers: {
              accept: '*/*',
              XApiKey: apiKey,
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to load previous cycle details.');
        }

        const payload: CycleApiResponse = await response.json();
        if (payload.StatusCode !== 200 || !payload.Result) {
          throw new Error(payload.Message || 'Unable to fetch previous cycle details.');
        }

        const cycle = payload.Result.Cycle;
        const participants = Array.isArray(payload.Result.Participants) ? payload.Result.Participants : [];

        const mappedMembers: PreviousMemberRow[] = participants.map((participant, index) => {
          const participantName =
            asString(participant.Name) ||
            asString(participant.FullName) ||
            asString(participant.UserName) ||
            `Member ${index + 1}`;

          const entries =
            asNumber(participant.Entries, -1) >= 0
              ? asNumber(participant.Entries)
              : asNumber(participant.EntryCount, asNumber(participant.TotalEntries, 0));

          const activities =
            asNumber(participant.ActivityEntries, -1) >= 0
              ? asNumber(participant.ActivityEntries)
              : asNumber(participant.ActivityCount, asNumber(participant.TotalActivities, 0));

          const isDisqualified =
            asBoolean(participant.IsDisqualified) ||
            asBoolean(participant.Disqualified) ||
            asBoolean(participant.IsIneligible);

          const previouslyDisqualified =
            asBoolean(participant.PreviouslyDisqualified) ||
            asBoolean(participant.WasPreviouslyDisqualified);

          return {
            id: asString(participant.Id, asString(participant.UserId, `previous-member-${index + 1}`)),
            name: participantName,
            rank: asNumber(participant.Rank, index + 1),
            entries,
            activities,
            status: isDisqualified ? 'Disqualified' : 'Active',
            previouslyDisqualified,
          };
        });

        setSelectedMembers(mappedMembers.sort((left, right) => left.rank - right.rank));
        setSelectedCycleLabel(formatCycleLabel(cycle?.StartDate, cycle?.EndDate));
        setSelectedSelectionDate(selectedSelection.selectionDate);
      } catch (fetchError) {
        setCycleLoadError(fetchError instanceof Error ? fetchError.message : 'Unable to load previous cycle details.');
        setSelectedMembers([]);
      } finally {
        setIsCycleLoading(false);
      }
    };

    void fetchSelectedCycle();
  }, [cycleHistory, selectedIndex]);

  if (isLoading) {
    return (
      <div>
        <p className="mb-3 text-center text-sm text-[#4b5f6c]">Loading cycle history...</p>
        {error && <p className="mb-3 text-center text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  if (cycleHistory.length === 0) {
    return (
      <div>
        <p className="py-6 text-center text-base text-[#4b5f6c]">No previous cycles found.</p>
      </div>
    );
  }

  const selectedSelection = cycleHistory[selectedIndex] ?? cycleHistory[0];
  const canGoOlder = selectedIndex < cycleHistory.length - 1;
  const canGoNewer = selectedIndex > 0;

  const goOlder = () => {
    setSelectedIndex((current) => Math.min(current + 1, cycleHistory.length - 1));
  };

  const goNewer = () => {
    setSelectedIndex((current) => Math.max(current - 1, 0));
  };

  const winnerMember = selectedMembers[0] ?? null;
  const previousMembers = selectedMembers.slice(1);

  return (
    <div className="space-y-6">
      {error && <p className="mb-3 text-center text-sm text-red-600">{error}</p>}
      {cycleLoadError && <p className="mb-3 text-center text-sm text-red-600">{cycleLoadError}</p>}

      <div className="flex items-center justify-center gap-4 text-center">
        <button
          type="button"
          onClick={goOlder}
          disabled={!canGoOlder}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d6dce4] bg-white text-[#243845] transition disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Go to older previous week"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="space-y-1">
          <p className="text-base font-semibold text-[#1f2f3b]">{selectedCycleLabel || selectedSelection.weekLabel}</p>
          <p className="text-sm text-[#506674]">Selection Date: {selectedSelectionDate || selectedSelection.selectionDate}</p>
          <p className="text-xs text-[#7a8793]">
            Week {selectedIndex + 1} of {cycleHistory.length}
          </p>
        </div>

        <button
          type="button"
          onClick={goNewer}
          disabled={!canGoNewer}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d6dce4] bg-white text-[#243845] transition disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Go to newer previous week"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-auto max-w-[1200px] rounded-[28px] border border-[#2c5f7f] bg-white p-6 shadow-sm">
        <p className="mb-4 text-center text-lg font-semibold text-[#243845]">Winner</p>

        {isCycleLoading ? (
          <p className="py-6 text-center text-sm text-[#506674]">Loading previous week participants...</p>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left text-sm text-[#243845]">
            <thead>
              <tr className="border-b border-[#d6dce4]">
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3"># of Entries</th>
                <th className="px-4 py-3"># of Activities</th>
                <th className="px-4 py-3">Odds of Winning</th>
                <th className="px-4 py-3">First Time Winner</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#f8fafc] text-[#243845]">
                <td className="px-4 py-4 font-semibold">{winnerMember?.rank ?? '-'}</td>
                <td className="px-4 py-4 font-semibold">{winnerMember?.name ?? 'TBD'}</td>
                <td className="px-4 py-4">{winnerMember?.entries ?? '-'}</td>
                <td className="px-4 py-4">{winnerMember?.activities ?? '-'}</td>
                <td className="px-4 py-4">{selectedSelection.winnerOdds}</td>
                <td className="px-4 py-4">{selectedSelection.firstTimeWinner ? 'Yes' : 'No'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        )}
      </div>

      <div className="mx-auto max-w-[1200px] rounded-[28px] border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <p className="mb-4 text-center text-lg font-semibold text-[#243845]">All Other Members</p>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left text-sm text-[#243845]">
            <thead>
              <tr className="border-b border-[#d6dce4]">
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3"># of Entries</th>
                <th className="px-4 py-3"># of Activities</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Previously Disqualified</th>
              </tr>
            </thead>
            <tbody>
              {previousMembers.length > 0 ? (
                previousMembers.map((member) => (
                  <tr
                    key={`previous-${member.id}`}
                    className="border-b border-[#eef2f7] last:border-b-0"
                  >
                    <td className="px-4 py-4">{member.rank}</td>
                    <td className="px-4 py-4 font-semibold">{member.name}</td>
                    <td className="px-4 py-4">{member.entries}</td>
                    <td className="px-4 py-4">{member.activities}</td>
                    <td className="px-4 py-4">{member.status}</td>
                    <td className="px-4 py-4">{member.previouslyDisqualified ? 'Yes' : 'No'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-[#6b7280]">
                    No members found for the selected previous week.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
