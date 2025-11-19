import React from 'react';
import { X } from 'lucide-react';
import { LogEntry } from '@/types/log';
import { cn } from '@/lib/utils';

interface DetailHeaderProps {
  log: LogEntry;
  onClose: () => void;
}

export const DetailHeader = ({ log, onClose }: DetailHeaderProps) => {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Log Detail</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Status
          </span>
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
            <span className={cn(
              'text-sm font-medium',
              log.status === 'SUCCESS' ? 'text-green-700' : 'text-gray-700'
            )}>
              {log.status}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Elapsed Time
          </span>
          <span className="text-sm font-medium text-gray-900">{log.runTime}s</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total Tokens
          </span>
          <span className="text-sm font-medium text-gray-900">{log.tokens}</span>
        </div>
      </div>

      {/* Warning/Info Banner */}
      <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-lg text-xs text-orange-800">
        There are n nodes in the process running abnormally, please go to tracing to check the logs.
      </div>
    </div>
  );
};
