"use client";

import React, { useState } from 'react';
import { useAppStore, AppType } from "@/store/useAppStore";
import { useChatStore } from "@/store/useChatStore";
import { cn } from "@/lib/utils";
import { AddAppDialog } from "@/components/apps/AddAppDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";

export function AppSidebar() {
  const { apps, activeAppId, setActiveApp, addApp, removeApp, _hasHydrated } = useAppStore();
  const { setActiveConversation } = useChatStore();

  // Initialize from localStorage or default to 'dify'
  const [activeTab, setActiveTab] = useState<AppType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-sidebar-active-tab');
      return (saved as AppType) || 'dify';
    }
    return 'dify';
  });

  // ... existing useEffect ...

  const handleAppClick = (appId: string) => {
    setActiveApp(appId);
    setActiveConversation(null);
  };

  // ... existing render ...



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

  const handleTabChange = (v: string) => {
    const newTab = v as AppType;
    setActiveTab(newTab);
    // Persist to localStorage
    localStorage.setItem('app-sidebar-active-tab', newTab);
    const firstAppOfNewTab = apps.find(app => app.type === newTab);
    setActiveApp(firstAppOfNewTab ? firstAppOfNewTab.id : null);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="h-16 px-4 flex items-center justify-between flex-shrink-0 border-b-4 border-black bg-white">
        <h2 className="text-sm font-black text-black tracking-wider uppercase">Web Apps</h2>
        <AddAppDialog />
      </div>

      <div className="px-4 py-4 border-b-4 border-black bg-secondary/20">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-10 bg-white border-2 border-black p-0 gap-0 rounded-none shadow-[4px_4px_0px_0px_#000000]">
            <TabsTrigger
              value="dify"
              className="h-full rounded-none border-r-2 border-black data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-xs uppercase transition-none"
            >
              Dify
            </TabsTrigger>
            <TabsTrigger
              value="model"
              className="h-full rounded-none data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-xs uppercase transition-none"
            >
              Model
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1 bg-white">
        <div className="p-4 space-y-3">
          {filteredApps.length === 0 && (
            <div className="p-4 text-center text-sm font-bold border-2 border-dashed border-black bg-muted">
              NO {activeTab.toUpperCase()} APPS YET
            </div>
          )}
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className={cn(
                "group w-full flex items-center gap-3 px-4 py-3 border-2 border-black transition-all cursor-pointer",
                activeAppId === app.id
                  ? "bg-secondary shadow-[4px_4px_0px_0px_#000000] translate-x-[-2px] translate-y-[-2px]"
                  : "bg-white hover:bg-secondary/50 hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px]"
              )}
              onClick={() => handleAppClick(app.id)}
            >
              <span className="text-2xl flex-shrink-0 filter drop-shadow-sm">{app.icon}</span>
              <span className="truncate font-bold flex-1 text-left uppercase tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">{app.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Are you sure you want to remove "${app.name}"?`)) {
                    removeApp(app.id);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 bg-white border-2 border-black hover:bg-destructive hover:text-white transition-none shadow-[2px_2px_0px_0px_#000000]"
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
