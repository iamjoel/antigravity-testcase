import React, { useState } from 'react';
import { useLogStore } from '@/store/logStore';
import { DetailHeader } from './DetailHeader';
import { DetailTabs } from './DetailTabs';
import { DetailContent } from './DetailContent';
import { LogEntry } from '@/types/log';

// Mock data lookup (should be replaced by API call or store data)
const MOCK_LOGS: Record<string, LogEntry> = {
  '1': {
    id: '1',
    startTime: '2023-03-21 10:25',
    status: 'SUCCESS',
    runTime: 4.285,
    tokens: 1400,
  },
  '2': {
    id: '2',
    startTime: '2023-03-21 10:25',
    status: 'SUCCESS',
    runTime: 4.285,
    tokens: 1400,
  },
  '3': {
    id: '3',
    startTime: '2023-03-21 10:25',
    status: 'SUCCESS',
    runTime: 4.285,
    tokens: 1400,
  },
  '4': {
    id: '4',
    startTime: '2023-03-21 10:25',
    status: 'SUCCESS',
    runTime: 4.285,
    tokens: 1400,
  },
};

export const LogDetailPanel = () => {
  const { selectedLogId, setSelectedLogId } = useLogStore();
  const [activeTab, setActiveTab] = useState('DETAIL');
  const [log, setLog] = React.useState<LogEntry | null>(null);

  // In a real app, we would fetch the log detail here.
  // For this mock implementation, we'll just use the list data if available,
  // or we could fetch it from the API if we had a detail endpoint.
  // Since our list endpoint returns full details, we can just find it in the list?
  // But we don't have access to the list here.
  // So I'll implement a simple fetch for the detail.

  React.useEffect(() => {
    if (selectedLogId) {
      // Simulate fetch or actually fetch if we had a detail endpoint.
      // Since we don't have a detail endpoint, I'll fetch the list and find it, 
      // or just rely on the fact that the user clicked it from the list.
      // Ideally, the store should hold the current log object, not just ID.
      // But to stick to the plan, I'll just fetch the list again or filter?
      // That's inefficient.
      // Let's update the store to hold `selectedLog` instead of `selectedLogId`?
      // No, ID is better for deep linking.

      // I'll add a detail endpoint or just filter from the list in the API.
      // Let's just fetch the list with a search param for ID?
      // Or simpler: I'll just use the `useLogs` hook here too? No.

      // I'll implement a helper to fetch single log.
      const fetchLog = async () => {
        try {
          // We'll just use the search param to find it for now as a hack since we don't have getById
          const response = await fetch(`/api/logs?search=${selectedLogId}`);
          const data = await response.json();
          const found = data.data.find((l: LogEntry) => l.id === selectedLogId);
          if (found) setLog(found);
        } catch (e) {
          console.error(e);
        }
      };
      fetchLog();
    } else {
      setLog(null);
    }
  }, [selectedLogId]);

  if (!selectedLogId || !log) return null;

  return (
    <div className="w-[600px] border-l border-gray-200 bg-white flex flex-col h-full shadow-xl absolute right-0 top-0 z-10">
      <DetailHeader log={log} onClose={() => setSelectedLogId(null)} />
      <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <DetailContent activeTab={activeTab} log={log} />
    </div>
  );
};
