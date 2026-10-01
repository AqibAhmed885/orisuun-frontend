import { Member } from './types';

interface EntryAdjustmentModalProps {
  member: Member;
  adjustValue: number;
  isAdjusting: boolean;
  error: string | null;
  onValueChange: (value: number) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function EntryAdjustmentModal({
  member,
  adjustValue,
  isAdjusting,
  error,
  onValueChange,
  onSave,
  onClose,
}: EntryAdjustmentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 p-4">
      <div className="w-full max-w-[760px] rounded-xl bg-[#f3f3f3] p-6 md:p-8">
        <p className="text-center text-lg font-semibold text-[#243845]">Member</p>
        <p className="mt-4 text-base font-semibold text-[#243845]">Current Week</p>

        <table className="mt-2 min-w-full text-center text-sm text-[#243845]">
          <thead>
            <tr>
              <th>Rank</th>
              <th># of Entries</th>
              <th># of Activities</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{member.current.rank}</td>
              <td>{member.current.entries}</td>
              <td>{member.current.activities}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-base font-semibold text-[#243845]">
          <span>Add entries:</span>
          <input
            type="number"
            min={0}
            value={adjustValue}
            onChange={(event) => onValueChange(Number(event.target.value))}
            className="w-[220px] rounded-sm bg-white px-3 py-1 text-sm"
          />
        </div>

        <p className="mt-8 text-lg font-semibold text-[#243845]">Previous Weeks</p>
        {member.previousWeeks.length > 0 ? (
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full text-center text-sm text-[#243845]">
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Rank</th>
                  <th># of Entries</th>
                  <th># of Activities</th>
                  <th>Entry Ratio</th>
                </tr>
              </thead>
              <tbody>
                {member.previousWeeks.map((week) => (
                  <tr key={`${member.id}-${week.weekLabel}`}>
                    <td>{week.weekLabel}</td>
                    <td>{week.rank}</td>
                    <td>{week.entries}</td>
                    <td>{week.activities}</td>
                    <td>
                      {week.activities > 0
                        ? (week.entries / week.activities).toFixed(2)
                        : '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-[#506674]">No previous week details are available for this member.</p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            disabled={isAdjusting}
            className="rounded-lg bg-white px-4 py-2 text-sm text-[#243845] disabled:opacity-50"
            onClick={onSave}
          >
            {isAdjusting ? 'Saving...' : 'Save'}
          </button>
          <button
            className="rounded-lg bg-white px-4 py-2 text-sm text-[#243845]"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
