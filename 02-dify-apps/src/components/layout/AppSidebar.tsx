"use client";

import React from 'react';
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { AddAppDialog } from "@/components/apps/AddAppDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";

export function AppSidebar() {
  const { apps, activeAppId, setActiveApp, addApp, removeApp, _hasHydrated } = useAppStore();

  React.useEffect(() => {
    if (_hasHydrated && apps.length === 0) {
      addApp({
        id: 'default-app',
        name: 'Dify Demo',
        apiKey: 'app-w33gBVqBQIQwRKH6gIDyAqhI',
        icon: '🤖',
      });
    }
  }, [_hasHydrated, apps.length, addApp]);

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA] dark:bg-muted/10">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-muted-foreground tracking-wider">WEB APPS</h2>
        <AddAppDialog />
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 space-y-1">
          {apps.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No apps added yet.
            </div>
          )}
          {apps.map((app) => (
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
