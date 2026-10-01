'use client';

import { useEffect, useMemo, useState } from 'react';
import MemberTable from './MemberTable';
import PendingSelection from './PendingSelection';
import PreviousWeeks from './PreviousWeeks';
import HistoryTable from './HistoryTable';
import AuditLogTable from './AuditLogTable';
import FeedCardAnnouncements from './FeedCardAnnouncements';
import MemberDetailModal from './MemberDetailModal';
import EntryAdjustmentModal from './EntryAdjustmentModal';
import ConfirmDialog from './ConfirmDialog';
import SidePanelButton from './SidePanelButton';
import TopTab from './TopTab';
import {
  Member,
  SelectionRecord,
  FeedCardAnnouncement,
  AuditLog,
  CycleApiResponse,
  AllCyclesApiResponse,
  ConfirmState,
  ProgramTab,
  CycleTab,
  MemberStatus,
  ConfirmAction,
  apiBaseUrl,
  adminRole,
  adminName,
  getAccessToken,
  formatDateForApi,
  formatCycleLabel,
  getWeekOfYear,
  formatSelectionDate,
  asNumber,
  asString,
  asBoolean,
  createEmptyPendingSelection,
} from './types';

interface GiveawayAdminPageProps {
  prizeDescription?: string;
}

export default function GiveawayAdminPage({ prizeDescription: initialPrizeDescription = 'Weekly Giveaway Prize' }: GiveawayAdminPageProps) {
  const [programTab, setProgramTab] = useState<ProgramTab>('members');
  const [cycleTab, setCycleTab] = useState<CycleTab>('current');
  const [members, setMembers] = useState<Member[]>([]);
  const [history, setHistory] = useState<SelectionRecord[]>([]);
  const [pendingSelection, setPendingSelection] = useState<SelectionRecord>(createEmptyPendingSelection);
  const [feedCards, setFeedCards] = useState<FeedCardAnnouncement[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [entryPopupMemberId, setEntryPopupMemberId] = useState<string | null>(null);
  const [entryAdjustValue, setEntryAdjustValue] = useState<number>(0);
  const [searchText, setSearchText] = useState('');
  const [currentCycleId, setCurrentCycleId] = useState<number | null>(null);
  const [isLoadingCycle, setIsLoadingCycle] = useState(false);
  const [cycleError, setCycleError] = useState<string | null>(null);
  const [isLoadingAllCycles, setIsLoadingAllCycles] = useState(false);
  const [allCyclesError, setAllCyclesError] = useState<string | null>(null);
  const [isSelectingWinner, setIsSelectingWinner] = useState(false);
  const [selectWinnerError, setSelectWinnerError] = useState<string | null>(null);
  const [isFinalizingWinner, setIsFinalizingWinner] = useState(false);
  const [finalizeWinnerError, setFinalizeWinnerError] = useState<string | null>(null);
  const [prizeDescription, setPrizeDescription] = useState<string>(initialPrizeDescription);
  const [isDisqualifyingMember, setIsDisqualifyingMember] = useState<string | null>(null);
  const [disqualifyError, setDisqualifyError] = useState<string | null>(null);
  const [isAdjustingEntries, setIsAdjustingEntries] = useState(false);
  const [adjustEntriesError, setAdjustEntriesError] = useState<string | null>(null);
  const [currentCycleLabel, setCurrentCycleLabel] = useState<string>('Current Week');
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false,
    action: null,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
  });

  const canControlSelection = adminRole === 'superadmin';

  const getCycleLabelWithWeekNumber = (startDate?: string, endDate?: string) => {
    const cycleDatesLabel = formatCycleLabel(startDate, endDate);
    const weekNumber = getWeekOfYear(startDate || endDate || new Date());
    return `Week #${weekNumber} - ${cycleDatesLabel}`;
  };

  useEffect(() => {
    const fetchCurrentCycle = async () => {
      setIsLoadingCycle(true);
      setCycleError(null);

      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
        const token = getAccessToken();
        const date = formatDateForApi(new Date());

        const response = await fetch(
          `${apiBaseUrl}/api/Admin/WeeklyGiveawayAdmin/GetCycleDetailsByDate?date=${date}`,
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
          throw new Error('Failed to load current cycle details.');
        }

        const payload: CycleApiResponse = await response.json();
        if (payload.StatusCode !== 200 || !payload.Result) {
          throw new Error(payload.Message || 'No active cycle found for today.');
        }

        const cycle = payload.Result.Cycle;
        const participants = Array.isArray(payload.Result.Participants) ? payload.Result.Participants : [];
        setCurrentCycleId(typeof cycle?.Id === 'number' ? cycle.Id : null);

        const cycleLabelWithWeekNumber = getCycleLabelWithWeekNumber(cycle?.StartDate, cycle?.EndDate);
        setCurrentCycleLabel(cycleLabelWithWeekNumber);

        const mappedMembers: Member[] = participants.map((participant, index) => {
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

          const rank = asNumber(participant.Rank, index + 1);

          return {
            id: asString(participant.Id, asString(participant.UserId, `member-${index + 1}`)),
            userId: asString(participant.UserId, asString(participant.Id, `member-${index + 1}`)),
            name: participantName,
            status: isDisqualified ? 'Disqualified' : 'Active',
            previouslyDisqualified,
            current: {
              weekLabel: cycleLabelWithWeekNumber,
              rank,
              entries,
              activities,
            },
            previousWeeks: [],
          };
        });

        setMembers(mappedMembers);

        const totalEntriesFromApi = asNumber(payload.Result.Stats?.TotalEntries);
        const totalEntries = totalEntriesFromApi > 0
          ? totalEntriesFromApi
          : mappedMembers.reduce((sum, member) => sum + member.current.entries, 0);

        const winnerCandidate = [...mappedMembers].sort(
          (left, right) => right.current.entries - left.current.entries
        )[0];

        if (winnerCandidate) {
          const winnerOdds = totalEntries > 0
            ? `${((winnerCandidate.current.entries / totalEntries) * 100).toFixed(2)}%`
            : '0.00%';

          setPendingSelection(
            (previous) => ({
            ...previous,
            id: winnerCandidate.id,
            weekLabel: cycleLabelWithWeekNumber,
            selectionDate: formatSelectionDate(cycle?.EndDate),
            totalEntries,
            winnerName: winnerCandidate.name,
            winnerEntries: winnerCandidate.current.entries,
            winnerActivities: winnerCandidate.current.activities,
            winnerOdds,
            status: 'Not Finalized',
          }));
        } else {
          setPendingSelection((previous) => ({
            ...previous,
            id: 'pending-selection',
            weekLabel: cycleLabelWithWeekNumber,
            selectionDate: formatSelectionDate(cycle?.EndDate),
            totalEntries,
            winnerName: 'TBD',
            winnerEntries: 0,
            winnerActivities: 0,
            winnerOdds: '0.00%',
            status: 'Not Finalized',
          }));
        }
      } catch (error) {
        const fallbackMessage = 'Unable to load current cycle details.';
        setCycleError(error instanceof Error ? error.message : fallbackMessage);
      } finally {
        setIsLoadingCycle(false);
      }
    };

    const fetchAllCycles = async () => {
      setIsLoadingAllCycles(true);
      setAllCyclesError(null);

      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
        const token = getAccessToken();

        const response = await fetch(
          `${apiBaseUrl}/api/Admin/WeeklyGiveawayAdmin/GetAllCycles?page=1&pageSize=20`,
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
          throw new Error('Failed to load all cycles.');
        }

        const payload: AllCyclesApiResponse = await response.json();
        if (payload.StatusCode !== 200 || !payload.Result) {
          throw new Error(payload.Message || 'Unable to fetch cycles list.');
        }

        const cycles = Array.isArray(payload.Result.Cycles) ? payload.Result.Cycles : [];
        const now = new Date();

        const sortedCycles = cycles
          .filter((cycle) => {
            return !!cycle.StartDate && !!cycle.EndDate;
          })
          .sort((left, right) => {
            const leftTime = new Date(left.EndDate || 0).getTime();
            const rightTime = new Date(right.EndDate || 0).getTime();
            return rightTime - leftTime;
          });

        const mappedHistory: SelectionRecord[] = sortedCycles.map((cycle) => {
          const endDate = cycle.EndDate ? new Date(cycle.EndDate) : null;
          const isPastCycle = endDate ? endDate < now : false;

          return {
            id: `cycle-${cycle.Id ?? Math.random()}`,
            weekLabel: getCycleLabelWithWeekNumber(cycle.StartDate, cycle.EndDate),
            selectionDate: formatSelectionDate(cycle.CompletedAt || cycle.EndDate),
            startDate: cycle.StartDate ?? null,
            endDate: cycle.EndDate ?? null,
            isActive: cycle.IsActive ?? false,
            isCompleted: cycle.IsCompleted ?? false,
            completedAt: cycle.CompletedAt ?? null,
            createdAt: cycle.CreatedAt ?? null,
            totalEntries: 0,
            winnerName: 'TBD',
            winnerEntries: 0,
            winnerActivities: 0,
            winnerOdds: '0.00%',
            firstTimeWinner: false,
            method: 'Auto',
            status: cycle.IsCompleted || isPastCycle ? 'Finalized' : 'Not Finalized',
          };
        });

        setHistory(mappedHistory);
      } catch (error) {
        const fallbackMessage = 'Unable to load cycle history.';
        setAllCyclesError(error instanceof Error ? error.message : fallbackMessage);
      } finally {
        setIsLoadingAllCycles(false);
      }
    };

    fetchCurrentCycle();
    fetchAllCycles();
  }, []);

  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId]
  );

  const entryPopupMember = useMemo(
    () => members.find((member) => member.id === entryPopupMemberId) ?? null,
    [members, entryPopupMemberId]
  );

  const currentRows = useMemo(() => {
    return members
      .filter((member) => member.name.toLowerCase().includes(searchText.toLowerCase()))
      .sort((left, right) => left.current.rank - right.current.rank);
  }, [members, searchText]);

  const activeMembers = useMemo(
    () => members.filter((member) => member.status === 'Active'),
    [members]
  );

  const canSelectWinner =
    canControlSelection &&
    currentCycleId !== null &&
    activeMembers.length > 0;

  const canConfirmWinner =
    canSelectWinner &&
    pendingSelection.winnerName !== 'TBD' &&
    pendingSelection.winnerEntries > 0 &&
    !isFinalizingWinner;

  const totalCurrentEntries = members.reduce((sum, member) => sum + member.current.entries, 0);

  const appendLog = (action: string, detail: string) => {
    setLogs((previous) => [
      {
        id: `log-${Date.now()}`,
        at: new Date().toLocaleString(),
        actor: adminName,
        action,
        detail,
      },
      ...previous,
    ]);
  };

  const toggleStatus = async (memberId: string) => {
    if (!canControlSelection || currentCycleId === null) return;

    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const nextStatus: MemberStatus = member.status === 'Active' ? 'Disqualified' : 'Active';
    setIsDisqualifyingMember(memberId);
    setDisqualifyError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
      const token = getAccessToken();
      const targetUserId = member.userId || member.id;
      const endpoint =
        nextStatus === 'Disqualified'
          ? 'DisqualifyUser'
          : 'QualifyUser';
      const actionLabel =
        nextStatus === 'Disqualified'
          ? 'disqualify'
          : 'qualify';

      const response = await fetch(
        `${apiBaseUrl}/api/Admin/WeeklyGiveawayAdmin/${endpoint}`,
        {
          method: 'POST',
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            XApiKey: apiKey,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            UserId: targetUserId,
            WeeklyCycleId: currentCycleId,
            Reason:
              nextStatus === 'Disqualified'
                ? 'Disqualified by superadmin for current week'
                : 'Qualified by superadmin for current week',
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = `Failed to ${actionLabel} member.`;
        try {
          const errorPayload = await response.json();
          errorMessage = errorPayload?.Message || errorPayload?.message || errorMessage;
        } catch {
          errorMessage = `Failed to ${actionLabel} member (HTTP ${response.status}).`;
        }
        throw new Error(errorMessage);
      }

      const payload = await response.json();
      if (payload?.StatusCode !== 200) {
        throw new Error(payload?.Message || `Unable to ${actionLabel} member.`);
      }

      setMembers((previous) =>
        previous.map((m) => {
          if (m.id !== memberId) return m;

          appendLog(
            nextStatus === 'Disqualified' ? 'Disqualified Member' : 'Reinstated Member',
            `${member.name} status changed to ${nextStatus} in current week.`
          );

          return {
            ...m,
            status: nextStatus,
            previouslyDisqualified: nextStatus === 'Disqualified' ? true : m.previouslyDisqualified,
            current: {
              ...m.current,
              entries: nextStatus === 'Disqualified' ? 0 : m.current.entries,
              activities: nextStatus === 'Disqualified' ? 0 : m.current.activities,
            },
          };
        })
      );
    } catch (error) {
      setDisqualifyError(error instanceof Error ? error.message : 'Unable to update member status.');
    } finally {
      setIsDisqualifyingMember(null);
    }
  };

  const togglePreviouslyDisqualified = (memberId: string) => {
    if (!canControlSelection) return;

    setMembers((previous) =>
      previous.map((member) => {
        if (member.id !== memberId) return member;

        const nextValue = !member.previouslyDisqualified;

        appendLog(
          nextValue ? 'Marked Previously Disqualified' : 'Cleared Previously Disqualified',
          `${member.name} previously disqualified set to ${nextValue ? 'Yes' : 'No'}.`
        );

        return {
          ...member,
          previouslyDisqualified: nextValue,
        };
      })
    );
  };

  const openEntryPopup = (member: Member) => {
    setEntryPopupMemberId(member.id);
    setEntryAdjustValue(member.current.entries);
  };

  const saveEntryAdjustment = async () => {
    if (!entryPopupMember || !canControlSelection || currentCycleId === null) return;

    setIsAdjustingEntries(true);
    setAdjustEntriesError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
      const token = getAccessToken();
      const userData = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;

      let adminUserId: string | number = '';
      if (userData) {
        try {
          const parsed = JSON.parse(userData) as { Id?: string | number; UserId?: string | number };
          adminUserId = parsed.Id ?? parsed.UserId ?? '';
        } catch {
          adminUserId = '';
        }
      }

      if (!adminUserId) {
        throw new Error('User ID not found. Please log in again.');
      }

      const adjustmentAmount = entryAdjustValue - entryPopupMember.current.entries;

      const response = await fetch(
        `${apiBaseUrl}/api/Admin/WeeklyGiveawayAdmin/AdjustEntries?adminUserId=${adminUserId}`,
        {
          method: 'POST',
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            XApiKey: apiKey,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            UserId: entryPopupMember.userId,
            WeeklyCycleId: currentCycleId,
            AdjustmentAmount: adjustmentAmount,
            Reason: 'Manual adjustment by superadmin',
            AdjustmentType: "ADMIN_ADJUSTMENT",
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = 'Failed to adjust entries.';
        try {
          const errorPayload = await response.json();
          errorMessage = errorPayload?.Message || errorPayload?.message || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const payload = await response.json();
      if (payload?.StatusCode !== 200) {
        throw new Error(payload?.Message || 'Unable to adjust entries.');
      }

      setMembers((previous) =>
        previous.map((member) => {
          if (member.id !== entryPopupMember.id) return member;

          appendLog(
            'Adjusted Entry Total',
            `${member.name} entries changed from ${member.current.entries} to ${entryAdjustValue}.`
          );

          return {
            ...member,
            current: {
              ...member.current,
              entries: Math.max(0, entryAdjustValue),
            },
          };
        })
      );

      setEntryPopupMemberId(null);
    } catch (error) {
      setAdjustEntriesError(error instanceof Error ? error.message : 'Unable to adjust entries.');
    } finally {
      setIsAdjustingEntries(false);
    }
  };

  const runRerunSelection = async () => {
    if (!canSelectWinner || currentCycleId === null) return;

    setIsSelectingWinner(true);
    setSelectWinnerError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
      const token = getAccessToken();
      const userData = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;

      let adminUserId: string | number = '';
      if (userData) {
        try {
          const parsed = JSON.parse(userData) as { Id?: string | number; UserId?: string | number };
          adminUserId = parsed.Id ?? parsed.UserId ?? '';
        } catch {
          adminUserId = '';
        }
      }

      if (!adminUserId) {
        throw new Error('User ID not found. Please log in again.');
      }

      const response = await fetch(
        `${apiBaseUrl}/api/Admin/WeeklyGiveawayAdmin/SelectWinner?adminUserId=${adminUserId}`,
        {
          method: 'POST',
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            XApiKey: apiKey,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            WeeklyCycleId: currentCycleId,
            RunNumber: 0,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to select winner.');
      }

      const payload = await response.json();
      if (payload?.StatusCode !== 200) {
        throw new Error(payload?.Message || 'Unable to select winner.');
      }

      const result = payload?.Result ?? {};
      const winnerName =
        asString(result.WinnerName) ||
        asString(result.SelectedWinnerName) ||
        asString(result.UserName) ||
        asString(result.Name) ||
        'TBD';

      const winnerEntries =
        asNumber(result.WinnerEntries, -1) >= 0
          ? asNumber(result.WinnerEntries)
          : asNumber(result.EntryCount, asNumber(result.Entries, 0));

      const winnerActivities =
        asNumber(result.WinnerActivities, -1) >= 0
          ? asNumber(result.WinnerActivities)
          : asNumber(result.ActivityEntries, asNumber(result.Activities, 0));

      const winnerOdds =
        asString(result.WinnerOdds) ||
        asString(result.OddsOfWinning) ||
        (totalCurrentEntries > 0
          ? `${((winnerEntries / totalCurrentEntries) * 100).toFixed(2)}%`
          : '0.00%');

      const firstTimeWinner = asBoolean(result.FirstTimeWinner, false);
      const participantId =
        asString(result.ParticipantId) ||
        asString(result.UserWeeklyEntryId) ||
        asString(result.UserEntryId) ||
        asString(result.Id) ||
        members.find((member) => member.name === winnerName)?.id ||
        `participant-${Date.now()}`;

      setPendingSelection((previous) => ({
        ...previous,
        id: participantId,
        winnerName,
        winnerEntries,
        winnerActivities,
        winnerOdds,
        firstTimeWinner,
        method: 'Manual-Rerun',
        status: 'Not Finalized',
      }));

      appendLog('Re-Select Winner', `Current week winner was re-selected. New winner: ${winnerName}`);
    } catch (error) {
      setSelectWinnerError(error instanceof Error ? error.message : 'Unable to select winner.');
    } finally {
      setIsSelectingWinner(false);
    }
  };

  const runConfirmWinner = async () => {
    if (!canConfirmWinner) return;

    setIsFinalizingWinner(true);
    setFinalizeWinnerError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
      const token = getAccessToken();
      const userData = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;

      let adminUserId: string | number = '';
      if (userData) {
        try {
          const parsed = JSON.parse(userData) as { Id?: string | number; UserId?: string | number };
          adminUserId = parsed.Id ?? parsed.UserId ?? '';
        } catch {
          adminUserId = '';
        }
      }

      if (!adminUserId) {
        throw new Error('User ID not found. Please log in again.');
      }

      const participantIdForConfirm =
        members.find((member) => member.name === pendingSelection.winnerName)?.id ||
        pendingSelection.id;

      const response = await fetch(
        `${apiBaseUrl}/api/Admin/WeeklyGiveawayAdmin/FinalizeWinner?adminUserId=${adminUserId}`,
        {
          method: 'POST',
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            XApiKey: apiKey,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            SelectionId: participantIdForConfirm,
            PrizeDescription: prizeDescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to finalize winner.');
      }

      const payload = await response.json();
      if (payload?.StatusCode !== 200) {
        throw new Error(payload?.Message || 'Unable to finalize winner.');
      }

      const finalizedRecord: SelectionRecord = {
        ...pendingSelection,
        status: 'Finalized',
      };

      setHistory((previous) => [finalizedRecord, ...previous]);
      setPendingSelection((previous) => ({ ...previous, status: 'Finalized' }));

      setFeedCards((previous) => [
        {
          id: `feed-${Date.now()}`,
          weekLabel: finalizedRecord.weekLabel,
          winnerName: finalizedRecord.winnerName,
          createdAt: new Date().toLocaleString(),
        },
        ...previous,
      ]);

      appendLog(
        'Confirmed Winner',
        `${finalizedRecord.winnerName} finalized and announcement pushed to all member feeds.`
      );
    } catch (error) {
      setFinalizeWinnerError(error instanceof Error ? error.message : 'Unable to finalize winner.');
    } finally {
      setIsFinalizingWinner(false);
    }
  };

  const openConfirmPopup = (action: ConfirmAction) => {
    if (!canControlSelection) return;

    if (action === 'rerun-selection') {
      setConfirmState({
        open: true,
        action,
        title: 'Re-Select Winner',
        message: 'Re-run selection for current week? This action will be logged.',
        confirmLabel: 'Re-Select',
      });
      return;
    }

    setConfirmState({
      open: true,
      action,
      title: 'Confirm Winner',
      message: 'Finalize this winner and announce to all member feeds?',
      confirmLabel: 'Confirm Winner',
    });
  };

  const closeConfirmPopup = () => {
    setConfirmState((previous) => ({ ...previous, open: false, action: null }));
  };

  const executeConfirmAction = async () => {
    if (!confirmState.action) return;

    if (confirmState.action === 'rerun-selection') {
      await runRerunSelection();
    }

    if (confirmState.action === 'confirm-winner') {
      await runConfirmWinner();
    }

    closeConfirmPopup();
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-[1400px] min-h-screen space-y-4">
        {/* Header */}
        <section className="mb-6">
          <h1 className="text-3xl font-bold text-[#1f2f3b]">Weekly Goals Management</h1>
          <p className="mt-1 text-sm text-[#506674]">
            Superadmin dashboard for managing giveaway cycles, members, and selections
          </p>
        </section>

        {/* Layout: Sidebar + Main Content */}
        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          {/* Left Sidebar - Tab Navigation */}
          <aside className="space-y-2">
            <SidePanelButton
              label="Members"
              active={programTab === 'members'}
              onClick={() => setProgramTab('members')}
            />
            <SidePanelButton
              label="History"
              active={programTab === 'history'}
              onClick={() => setProgramTab('history')}
            />
            {/* <SidePanelButton
              label="Audit Log"
              active={programTab === 'audit'}
              onClick={() => setProgramTab('audit')}
            /> */}
          </aside>

          {/* Main Content */}
          <main className="space-y-4">
            {programTab === 'members' && (
              <div>  
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-4 text-base font-semibold text-[#1f2f3b]">
                    <TopTab label="Current Week" active={cycleTab === 'current'} onClick={() => setCycleTab('current')} />
                    <TopTab label="Pending Selection" active={cycleTab === 'pending'} onClick={() => setCycleTab('pending')} />
                    <TopTab label="Previous Weeks" active={cycleTab === 'previous'} onClick={() => setCycleTab('previous')} />
                  </div>
                </div>

                {cycleTab === 'current' && (
                  <MemberTable
                    members={currentRows}
                    searchText={searchText}
                    canControlSelection={canControlSelection}
                    isDisqualifyingMember={isDisqualifyingMember}
                    onSearchChange={setSearchText}
                    onMemberClick={setSelectedMemberId}
                    onEntryClick={openEntryPopup}
                    onStatusToggle={toggleStatus}
                    onPreviouslyDisqualifiedToggle={togglePreviouslyDisqualified}
                    disqualifyError={disqualifyError}
                    isLoading={isLoadingCycle}
                    cycleLabel={currentCycleLabel}
                  />
                )}

                {cycleTab === 'pending' && (
                  <PendingSelection
                    pendingSelection={pendingSelection}
                    history={history}
                    members={members}
                    canSelectWinner={canSelectWinner}
                    canConfirmWinner={canConfirmWinner}
                    isSelectingWinner={isSelectingWinner}
                    isFinalizingWinner={isFinalizingWinner}
                    selectWinnerError={selectWinnerError}
                    finalizeWinnerError={finalizeWinnerError}
                    onRerunSelection={() => openConfirmPopup('rerun-selection')}
                    onConfirmWinner={() => openConfirmPopup('confirm-winner')}
                  />
                )}

                {cycleTab === 'previous' && (
                  <PreviousWeeks
                    history={history}
                    isLoading={isLoadingAllCycles}
                    error={allCyclesError}
                  />
                )}
              </div>
            )}

            {/* History Tab */}
            {programTab === 'history' && (
              <HistoryTable
                history={history}
                isLoading={isLoadingAllCycles}
                error={allCyclesError}
              />
            )}

            {/* Audit Tab */}
            {/* {programTab === 'audit' && (
              <AuditLogTable logs={logs} />
            )} */}

            {/* <FeedCardAnnouncements feedCards={feedCards} /> */}
          </main>
        </div>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMemberId(null)}
          onTogglePreviouslyDisqualified={togglePreviouslyDisqualified}
        />
      )}

      {/* Entry Adjustment Modal */}
      {entryPopupMember && (
        <EntryAdjustmentModal
          member={entryPopupMember}
          adjustValue={entryAdjustValue}
          isAdjusting={isAdjustingEntries}
          error={adjustEntriesError}
          onValueChange={setEntryAdjustValue}
          onSave={saveEntryAdjustment}
          onClose={() => setEntryPopupMemberId(null)}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        state={confirmState}
        onConfirm={executeConfirmAction}
        onCancel={closeConfirmPopup}
      />
    </div>
  );
}
