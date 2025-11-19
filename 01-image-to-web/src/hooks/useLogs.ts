import { useState, useEffect } from 'react';
import { LogEntry, PaginatedLogs, LogFilter } from '@/types/log';
import { useLogStore } from '@/store/logStore';

export const useLogs = () => {
  const { filters } = useLogStore();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('pageSize', pageSize.toString());
        if (filters.status) params.set('status', filters.status);
        if (filters.search) params.set('search', filters.search);

        const response = await fetch(`/api/logs?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }
        const data: PaginatedLogs = await response.json();
        setLogs(data.data);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchLogs();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, page]);

  return { logs, loading, error, total, page, setPage, pageSize };
};
