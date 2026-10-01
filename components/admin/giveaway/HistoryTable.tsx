import { SelectionRecord } from './types';

interface HistoryTableProps {
  history: SelectionRecord[];
  isLoading: boolean;
  error: string | null;
}

export default function HistoryTable({ history, isLoading, error }: HistoryTableProps) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold text-[#243845]">Selection History</h2>
      
      {isLoading && (
        <p className="text-center text-sm text-[#4b5f6c]">Loading history...</p>
      )}
      
      {error && (
        <p className="text-center text-sm text-red-600">{error}</p>
      )}

      {history.length === 0 ? (
        <p className="text-center text-base text-[#4b5f6c]">No selection history available yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-center text-base text-[#253845]">
            <thead>
              <tr>
                <th>Week</th>
                <th>Status</th>
                <th>Active</th>
                <th>Completed At</th>
                <th>Cycle Id</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record.id} className="rounded-xl bg-white/70">
                  <td>{record.weekLabel}</td>
                  <td className={record.status === 'Finalized' ? 'text-green-600' : 'text-orange-600'}>
                    {record.status}
                  </td>
                  <td>{record.isActive ? 'Yes' : 'No'}</td>
                  <td>{record.selectionDate ?? '-'}</td>
                  <td>{record.id ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
