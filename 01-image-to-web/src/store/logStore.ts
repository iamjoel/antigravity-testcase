import { create } from 'zustand';
import { LogFilter } from '@/types/log';

interface LogState {
  selectedLogId: string | null;
  filters: LogFilter;
  setSelectedLogId: (id: string | null) => void;
  setFilters: (filters: Partial<LogFilter>) => void;
}

export const useLogStore = create<LogState>((set) => ({
  selectedLogId: null,
  filters: {
    dateRange: 'Last 7 days',
    status: undefined,
    search: '',
  },
  setSelectedLogId: (id) => set({ selectedLogId: id }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
}));
