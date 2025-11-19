"use client";

import React, { useState } from 'react';
import { useAppStore, AppType } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { AddAppDialog } from "@/components/apps/AddAppDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";

export function AppSidebar() {
  const { apps, activeAppId, setActiveApp, addApp, removeApp, _hasHydrated } = useAppStore();
  const [activeTab, setActiveTab] = useState<AppType>('dify');

  React.useEffect(() => {
    const defaultKey = process.env.NEXT_PUBLIC_DIFY_DEMO_KEY;
    if (_hasHydrated && defaultKey) {
      const hasDefaultApp = apps.some(app => app.id === 'default-app');
      if (!hasDefaultApp) {
        addApp({
          id: 'default-app',
          name: 'Dify Demo',
          apiKey: defaultKey,
          icon: '🤖',
          type: 'dify',
        });
      }
    }
  }, [_hasHydrated, apps, addApp]);

  const filteredApps = apps.filter(app => app.type === activeTab);

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA] dark:bg-muted/10">
      <div className="h-16 px-4 flex items-center justify-between flex-shrink-0">
        <h2 className="text-xs font-semibold text-muted-foreground tracking-wider">WEB APPS</h2>
        <AddAppDialog />
      </div>

      <div className="px-4 pb-2">
        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as AppType)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="dify" className="text-xs">Dify</TabsTrigger>
            <TabsTrigger value="model" className="text-xs">Model</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 space-y-1">
          {filteredApps.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No {activeTab} apps yet.
            </div>
          )}
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className={cn(
                "group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                activeAppId === app.id
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
              )}
              onClick={() => setActiveApp(app.id)}
            >
              <span className="text-xl flex-shrink-0">{app.icon}</span>
              <span className="truncate font-medium flex-1 text-left">{app.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Are you sure you want to remove "${app.name}"?`)) {
                    removeApp(app.id);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 hover:text-red-600 rounded"
                title="Remove App"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
