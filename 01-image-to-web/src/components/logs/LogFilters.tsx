import React from 'react';
import { Search, Calendar, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useLogStore } from '@/store/logStore';
import { LogStatus } from '@/types/log';
import { cn } from '@/lib/utils';

export const LogFilters = () => {
  const { filters, setFilters } = useLogStore();

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      {/* Date Range Filter */}
      <div className="relative">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 cursor-pointer hover:bg-gray-50">
          <Calendar size={16} className="text-gray-500" />
          <span>{filters.dateRange}</span>
        </div>
      </div>

      {/* Status Filter */}
      <div className="relative">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 cursor-pointer hover:bg-gray-50">
          <span>Status {filters.status || 'All'}</span>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          value={filters.search || ''}
          onChange={(e) => setFilters({ search: e.target.value })}
        />
      </div>
    </div>
  );
};
