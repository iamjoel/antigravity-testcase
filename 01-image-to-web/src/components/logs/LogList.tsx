import React from 'react';
import { LogItem } from './LogItem';
import { useLogs } from '@/hooks/useLogs';
import { Loader2 } from 'lucide-react';

export const LogList = () => {
  const { logs, loading, error } = useLogs();

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-left">
            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Start Time ↓
            </th>
            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Run Time
            </th>
            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tokens
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <LogItem key={log.id} log={log} />
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-gray-500">
                No logs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
