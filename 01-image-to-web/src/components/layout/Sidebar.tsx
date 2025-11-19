import React from 'react';
import { LayoutDashboard, FileText, Settings, Bot, Database, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, active }: SidebarItemProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors',
        active
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-100'
      )}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export const Sidebar = () => {
  return (
    <div className="w-64 h-screen border-r border-gray-200 bg-white flex flex-col">
      <div className="p-4 flex items-center gap-2 border-b border-gray-100">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
          <Bot size={20} />
        </div>
        <div>
          <h1 className="font-semibold text-gray-900">Dify</h1>
          <p className="text-xs text-gray-500">Solar Studio</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 py-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">App</h2>
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Orchestrate" />
          <SidebarItem icon={<Database size={18} />} label="API Access" />
          <SidebarItem icon={<FileText size={18} />} label="Logs" active />
          <SidebarItem icon={<Activity size={18} />} label="Monitoring" />
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <SidebarItem icon={<Settings size={18} />} label="Settings" />
      </div>
    </div>
  );
};
