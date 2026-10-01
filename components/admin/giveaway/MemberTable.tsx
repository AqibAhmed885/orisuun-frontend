import Switch from '@/components/ui/switch';
import { Member } from './types';

interface MemberTableProps {
  members: Member[];
  searchText: string;
  canControlSelection: boolean;
  isDisqualifyingMember: string | null;
  onSearchChange: (text: string) => void;
  onMemberClick: (memberId: string) => void;
  onEntryClick: (member: Member) => void;
  onStatusToggle: (memberId: string) => void;
  onPreviouslyDisqualifiedToggle: (memberId: string) => void;
  disqualifyError: string | null;
  isLoading: boolean;
  cycleLabel: string;
}

export default function MemberTable({
  members,
  searchText,
  canControlSelection,
  isDisqualifyingMember,
  onSearchChange,
  onMemberClick,
  onEntryClick,
  onStatusToggle,
  onPreviouslyDisqualifiedToggle,
  disqualifyError,
  isLoading,
  cycleLabel,
}: MemberTableProps) {
  const filteredMembers = members
    .filter((member) => member.name.toLowerCase().includes(searchText.toLowerCase()))
    .sort((left, right) => left.current.rank - right.current.rank);

  return (
    <div>
      <p className="mb-3 text-center text-base font-semibold text-[#273846]">{cycleLabel}</p>
      
      <div className="mb-4 flex w-full justify-center">
        <div className="flex w-full max-w-[560px] items-center gap-2 rounded-[28px] border border-[#d1d5db] bg-white px-3 py-2 shadow-sm shadow-slate-200/40 transition hover:border-[#9ca3af] focus-within:border-[#6b7280]">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-[#6b7280]">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search members"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border-none bg-transparent text-sm text-[#243845] outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-center text-base text-[#253845]">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Member</th>
                <th># of Entries</th>
                <th># of Activities</th>
                <th>Status</th>
                <th>Previously Disqualified</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="rounded-xl bg-white/70">
                  <td>
                    <div className="mx-auto h-4 w-8 rounded-full bg-gray-200 animate-pulse" />
                  </td>
                  <td>
                    <div className="mx-auto h-4 w-24 rounded-full bg-gray-200 animate-pulse" />
                  </td>
                  <td>
                    <div className="mx-auto h-4 w-16 rounded-full bg-gray-200 animate-pulse" />
                  </td>
                  <td>
                    <div className="mx-auto h-4 w-16 rounded-full bg-gray-200 animate-pulse" />
                  </td>
                  <td>
                    <div className="mx-auto h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
                  </td>
                  <td>
                    <div className="mx-auto h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-center text-base text-[#253845]">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Member</th>
                <th># of Entries</th>
                <th># of Activities</th>
                <th>Status</th>
                <th>Previously Disqualified</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="rounded-xl bg-white/70">
                  <td>{member.current.rank}</td>
                  <td>
                    <button className="underline" onClick={() => onMemberClick(member.id)}>
                      {member.name}
                    </button>
                  </td>
                  <td>
                    <button className="underline" onClick={() => onEntryClick(member)}>
                      {member.current.entries}
                    </button>
                  </td>
                  <td>{member.current.activities}</td>
                  <td>
                    <Switch
                      label={member.status}
                      isOn={member.status === 'Active'}
                      isTitle="Yes"
                      size="sm"
                      onToggle={() => {
                        if (!canControlSelection || isDisqualifyingMember === member.id) return;
                        onStatusToggle(member.id);
                      }}
                    />
                  </td>
                  <td>
                    {member.previouslyDisqualified ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-sm text-[#4b5f6c]">
                    No members found for this cycle.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {disqualifyError && (
        <p className="mt-3 text-center text-sm text-red-600">{disqualifyError}</p>
      )}
    </div>
  );
}
