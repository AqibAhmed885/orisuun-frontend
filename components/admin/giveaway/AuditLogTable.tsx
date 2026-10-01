import { AuditLog } from './types';

interface AuditLogTableProps {
  logs: AuditLog[];
}

export default function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold text-[#243845]">Audit Log</h2>
      
      {logs.length === 0 ? (
        <p className="text-center text-base text-[#4b5f6c]">No audit logs available yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-sm text-[#253845]">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Admin</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="rounded-xl bg-white/70">
                  <td>{log.at}</td>
                  <td>{log.actor}</td>
                  <td className="font-semibold">{log.action}</td>
                  <td>{log.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
