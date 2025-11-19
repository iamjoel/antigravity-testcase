import React from 'react';
import { cn } from '@/lib/utils';

interface DetailTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DetailTabs = ({ activeTab, onTabChange }: DetailTabsProps) => {
  const tabs = ['RESULT', 'DETAIL', 'TRACING'];

  return (
    <div className="px-6 border-b border-gray-200">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              'py-3 text-xs font-semibold tracking-wider border-b-2 transition-colors',
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};
