import React from 'react';
import { LogEntry } from '@/types/log';
import { cn } from '@/lib/utils';
import { useLogStore } from '@/store/logStore';

interface LogItemProps {
  log: LogEntry;
}

export const LogItem = ({ log }: LogItemProps) => {
  const { selectedLogId, setSelectedLogId } = useLogStore();
  const isSelected = selectedLogId === log.id;

  return (
    <tr
      onClick={() => setSelectedLogId(log.id)}
      className={cn(
        'border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors',
        isSelected ? 'bg-blue-50 hover:bg-blue-50' : ''
      )}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600">{log.startTime}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              log.status === 'SUCCESS'
                ? 'bg-green-500'
                : log.status === 'FAILURE'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
            )}
          ></div>
          <span
            className={cn(
              'text-sm font-medium',
              log.status === 'SUCCESS'
                ? 'text-green-700'
                : log.status === 'FAILURE'
                  ? 'text-red-700'
                  : 'text-yellow-700'
            )}
          >
            {log.status}
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">{log.runTime}s</td>
      <td className="py-3 px-4 text-sm text-gray-600">{log.tokens}</td>
    </tr>
  );
};
