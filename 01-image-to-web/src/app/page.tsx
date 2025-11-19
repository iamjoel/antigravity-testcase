'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { LogHeader } from '@/components/logs/LogHeader';
import { LogFilters } from '@/components/logs/LogFilters';
import { LogList } from '@/components/logs/LogList';
import { LogDetailPanel } from '@/components/logs/LogDetailPanel';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        <div className="flex-1 overflow-y-auto p-6">
          <LogHeader />
          <LogFilters />
          <LogList />
        </div>
        <LogDetailPanel />
      </div>
    </MainLayout>
  );
}
