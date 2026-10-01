import { useEffect, useMemo, useState } from 'react';
import ArrowLeft from '@/icons/arrow-left';
import ArrowRight from '@/icons/arrow-right';
import {
  apiBaseUrl,
  asBoolean,
  asNumber,
  asString,
  formatDateForApi,
  formatCycleLabel,
  CycleApiResponse,
  SelectionRecord,
  getAccessToken,
} from './types';

interface PendingSelectionProps {
  pendingSelection: SelectionRecord;
  history: SelectionRecord[];
  members: Array<{
    id: string;
    name: string;
    status: 'Active' | 'Disqualified';
    previouslyDisqualified: boolean;
    current: {
      rank: number;
      entries: number;
      activities: number;
    };
  }>;
  canSelectWinner: boolean;
  canConfirmWinner: boolean;
  isSelectingWinner: boolean;
  isFinalizingWinner: boolean;
  selectWinnerError: string | null;
  finalizeWinnerError: string | null;
  onRerunSelection: () => void;
  onConfirmWinner: () => void;
}

export default function PendingSelection({
  pendingSelection,
  history,
  members,
  canSelectWinner,
  canConfirmWinner,
  isSelectingWinner,
  isFinalizingWinner,
  selectWinnerError,
  finalizeWinnerError,
  onRerunSelection,
  onConfirmWinner,
}: PendingSelectionProps) {
  const timeline = useMemo(
    () =>
      [pendingSelection, ...history.filter((record) => record.status === 'Finalized')]
        .sort((left, right) => {
          if (left.id === pendingSelection.id) return -1;
          if (right.id === pendingSelection.id) return 1;
          const leftTime = new Date(left.endDate ?? left.selectionDate ?? 0).getTime();
          const rightTime = new Date(right.endDate ?? right.selectionDate ?? 0).getTime();
          return rightTime - leftTime;
        }),
    [history, pendingSelection]
  );
  const currentWeekRows = useMemo(
    () =>
      [...members].sort((left, right) => left.current.rank - right.current.rank),
    [members]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMembers, setSelectedMembers] = useState<Array<{
    id: string;
    name: string;
    rank: number;
    entries: number;
    activities: number;
    status: 'Active' | 'Disqualified';
    previouslyDisqualified: boolean;
  }>>([]);
  const [selectedCycleLabel, setSelectedCycleLabel] = useState<string>('');
  const [selectedSelectionDate, setSelectedSelectionDate] = useState<string>('');
  const [isCycleLoading, setIsCycleLoading] = useState(false);
  const [cycleLoadError, setCycleLoadError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedIndex(0);
  }, [timeline.length]);

  useEffect(() => {
    const selectedSelection = timeline[selectedIndex] ?? pendingSelection;

    const fetchSelectedCycle = async () => {
      if (selectedIndex === 0) {
        const mappedCurrentRows = currentWeekRows.map((member) => ({
          id: member.id,
          name: member.name,
          rank: member.current.rank,
          entries: member.current.entries,
          activities: member.current.activities,
          status: member.status,
          previouslyDisqualified: member.previouslyDisqualified,
        }));

        setSelectedMembers(mappedCurrentRows);
        setSelectedCycleLabel(pendingSelection.weekLabel);
        setSelectedSelectionDate(pendingSelection.selectionDate);
        setCycleLoadError(null);
        setIsCycleLoading(false);
        return;
      }

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
          throw new Error('Failed to load pending selection details.');
        }

        const payload: CycleApiResponse = await response.json();
        if (payload.StatusCode !== 200 || !payload.Result) {
          throw new Error(payload.Message || 'Unable to fetch pending selection details.');
        }

        const cycle = payload.Result.Cycle;
        const participants = Array.isArray(payload.Result.Participants) ? payload.Result.Participants : [];

        const mappedMembers = participants.map((participant, index) => {
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

          const status: 'Active' | 'Disqualified' = isDisqualified ? 'Disqualified' : 'Active';

          const previouslyDisqualified =
            asBoolean(participant.PreviouslyDisqualified) ||
            asBoolean(participant.WasPreviouslyDisqualified);

          return {
            id: asString(participant.Id, asString(participant.UserId, `pending-member-${index + 1}`)),
            name: participantName,
            rank: asNumber(participant.Rank, index + 1),
            entries,
            activities,
            status,
            previouslyDisqualified,
          };
        });

        setSelectedMembers(mappedMembers.sort((left, right) => left.rank - right.rank));
        setSelectedCycleLabel(formatCycleLabel(cycle?.StartDate, cycle?.EndDate));
        setSelectedSelectionDate(selectedSelection.selectionDate);
      } catch (fetchError) {
        setCycleLoadError(fetchError instanceof Error ? fetchError.message : 'Unable to load pending selection details.');
        setSelectedMembers([]);
      } finally {
        setIsCycleLoading(false);
      }
    };

    void fetchSelectedCycle();
  }, [currentWeekRows, pendingSelection, selectedIndex, timeline]);

  const selectedSelection = timeline[selectedIndex] ?? pendingSelection;
  const isLivePendingWeek = selectedIndex === 0;
  const canGoOlder = selectedIndex < timeline.length - 1;
  const canGoNewer = selectedIndex > 0;

  const goOlder = () => {
    setSelectedIndex((current) => Math.min(current + 1, timeline.length - 1));
  };

  const goNewer = () => {
    setSelectedIndex((current) => Math.max(current - 1, 0));
  };

  const winnerRow =
    selectedMembers.find((member) => member.name === selectedSelection.winnerName) ||
    selectedMembers[0] ||
    null;

  return (
    <div>
      {cycleLoadError && <p className="mb-3 text-center text-sm text-red-600">{cycleLoadError}</p>}
      <div className="flex items-center justify-center gap-4 text-center">
        <button
          type="button"
          onClick={goOlder}
          disabled={!canGoOlder}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d6dce4] bg-white text-[#243845] transition disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Go to older selection week"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="space-y-1">
          <p className="mt-2 text-base font-semibold text-[#273846]">{selectedCycleLabel || selectedSelection.weekLabel}</p>
          <p className="text-sm text-[#506674]">Selection Date: {selectedSelectionDate || selectedSelection.selectionDate}</p>
          <p className="text-xs text-[#7a8793]">
            Week {selectedIndex + 1} of {timeline.length}
          </p>
        </div>

        <button
          type="button"
          onClick={goNewer}
          disabled={!canGoNewer}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d6dce4] bg-white text-[#243845] transition disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Go to newer selection week"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="border border-[#2c5f7f] p-4 rounded-[28px]">
        <p className="text-center text-lg font-semibold text-[#243845]">Winner</p>
        {isCycleLoading ? (
          <p className="py-4 text-center text-sm text-[#506674]">Loading previous week participants...</p>
        ) : (
          <table className="mt-2 min-w-full text-center text-base text-[#243845]">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Member</th>
                <th># of Entries</th>
                <th># of Activities</th>
                <th>Odds of Winning</th>
                <th>First Time Winner</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{winnerRow?.rank ?? '-'}</td>
                <td>{winnerRow?.name ?? selectedSelection.winnerName ?? 'TBD'}</td>
                <td>{winnerRow?.entries ?? selectedSelection.winnerEntries ?? '-'}</td>
                <td>{winnerRow?.activities ?? selectedSelection.winnerActivities ?? '-'}</td>
                <td>{selectedSelection.winnerOdds}</td>
                <td>{selectedSelection.firstTimeWinner ? 'Yes' : 'No'}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {isLivePendingWeek ? (
        <div className="mt-5 flex flex-wrap gap-4 pl-4">
          <button
            disabled={!canConfirmWinner || isFinalizingWinner}
            onClick={onConfirmWinner}
            className="rounded-xl border border-[#2c5f7f] px-6 py-2 text-base font-semibold text-[#2a3e4b] disabled:opacity-50"
          >
            {isFinalizingWinner ? 'Finalizing...' : 'Confirm Winner'}
          </button>
          <button
            disabled={!canSelectWinner || isSelectingWinner}
            onClick={onRerunSelection}
            className="rounded-xl border border-[#2c5f7f] px-6 py-2 text-base font-semibold text-[#2a3e4b] disabled:opacity-50"
          >
            {isSelectingWinner ? 'Selecting...' : 'Re-Select'}
          </button>
        </div>
      ) : (
        <p className="mt-5 pl-4 text-sm text-[#506674]">
          Viewing a previous selection. Actions are available only on the latest previous week.
        </p>
      )}

      {selectWinnerError && (
        <p className="mt-3 pl-4 text-sm text-red-600">{selectWinnerError}</p>
      )}
      {finalizeWinnerError && (
        <p className="mt-3 pl-4 text-sm text-red-600">{finalizeWinnerError}</p>
      )}
    </div>
  );
}
