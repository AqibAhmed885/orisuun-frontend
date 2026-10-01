import { useEffect, useState } from 'react';
import Switch from '@/components/ui/switch';
import { Member } from './types';
import { getWeeklyEntryRules, WeeklyEntryRule } from '@/app/api/dashboard/dashboard';
import { formatDateForApi } from './types';

interface MemberDetailModalProps {
  member: Member;
  onClose: () => void;
  onTogglePreviouslyDisqualified: (memberId: string) => void;
}

export default function MemberDetailModal({ member, onClose, onTogglePreviouslyDisqualified }: MemberDetailModalProps) {

  const [entryRules, setEntryRules] = useState<WeeklyEntryRule[]>([]);
  const [ruleLoading, setRuleLoading] = useState(false);
  const [ruleError, setRuleError] = useState<string | null>(null);
  const now = new Date();
  const currentDate = now.toLocaleDateString();
  const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    const fetchEntryRules = async () => {
      setRuleLoading(true);
      setRuleError(null);

      try {
        const response = await getWeeklyEntryRules(member.userId, formatDateForApi(new Date()));
        if (response.success && response.data) {
          setEntryRules(
            (response.data.EntryRules || []).filter(
              (rule) => rule.ActionType !== 'ONE_COMPULSORY' && rule.ActionName !== 'Mandatory Base Entry'
            )
          );
        } else {
          setRuleError(response.message || 'Failed to load entry rules');
        }
      } catch (error) {
        setRuleError('Unable to load entry logs');
      } finally {
        setRuleLoading(false);
      }
    };

    if (member.userId) {
      fetchEntryRules();
    }
  }, [member.userId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 p-4">
      <div className="w-full max-w-[840px] max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 md:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-semibold text-[#243845]">{member.name}</p>
          </div>
          <button
            className="text-[#506674] hover:text-[#243845]"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Status Info */}
        <div className="mt-4 rounded-lg bg-white border border-gray-300 p-4">
          <p className="text-base font-semibold text-[#243845]">Status</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className='w-64'>
              <p className="text-sm text-[#506674]">Current Status</p>
              <p className={`mt-1 font-semibold ${member.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                {member.status}
              </p>
            </div>
            <div className="flex  w-96 itmes-center justify-between ">
              <p className="text-sm text-[#506674] text-nowrap">Previously Disqualified</p>
              <Switch
                // label={member.previouslyDisqualified ? 'Yes' : 'No'}
                isOn={member.previouslyDisqualified}
                isTitle="Yes"
                size="sm"
                onToggle={() => onTogglePreviouslyDisqualified(member.id)}
              />
            </div>
          </div>
        </div>

        {/* Current Week Section */}
        <div className="mt-6 rounded-lg border border-gray-300 bg-white p-4">
          <p className="text-base font-semibold text-[#243845]">Current Week</p>
          <table className="mt-3 w-full text-sm text-[#243845]">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-semibold">Rank</td>
                <td className="py-2 text-right">{member.current.rank}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold"># of Entries</td>
                <td className="py-2 text-right">{member.current.entries}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold"># of Activities</td>
                <td className="py-2 text-right">{member.current.activities}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Entry Ratio</td>
                <td className="py-2 text-right">
                  {member.current.activities > 0
                    ? (member.current.entries / member.current.activities).toFixed(2)
                    : '0.00'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        

        {/* Entry Logs */}
        <div className="mt-6 rounded-lg border border-gray-300 bg-white p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold text-[#243845]">Entry Logs</p>
              <p className="text-sm text-[#506674]">Fetched: {currentDate} {currentTime}</p>
            </div>
            <p className="text-sm text-[#506674]">Rules: {entryRules.length}</p>
          </div>

          {ruleLoading ? (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-12 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : ruleError ? (
            <p className="mt-4 text-sm text-red-600">{ruleError}</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm text-[#243845]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-left">Entry Rule</th>
                    <th className="py-2 text-right">Entries</th>
                    <th className="py-2 text-right">Max/Day</th>
                    <th className="py-2 text-right">Max/Week</th>
                  </tr>
                </thead>
                <tbody>
                  {entryRules.map((rule) => (
                    <tr key={rule.Id} className="border-b last:border-b-0">
                      <td className="py-2 text-left">{rule.ActionName || rule.ActionType}</td>
                      <td className="py-2 text-right">{rule.EntriesAwarded}</td>
                      <td className="py-2 text-right">{rule.MaxPerDay ?? '—'}</td>
                      <td className="py-2 text-right">{rule.MaxPerWeek ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <button
          className="mt-6 w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#243845] hover:border-[#4f6977] hover:border-2"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
