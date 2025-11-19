"use client";

import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

interface MainLayoutProps {
  sidebar: React.ReactNode;
  conversationList: React.ReactNode;
  chatArea: React.ReactNode;
}

export function MainLayout({ sidebar, conversationList, chatArea }: MainLayoutProps) {
  return (
    <div className="h-screen w-full bg-background overflow-hidden">
      <PanelGroup direction="horizontal" autoSaveId="dify-apps-layout">
        <Panel defaultSize={20} minSize={15} maxSize={30} className="bg-muted/10">
          {sidebar}
        </Panel>

        <PanelResizeHandle className="w-1 bg-black transition-colors hover:bg-primary focus:bg-primary" />

        <Panel defaultSize={25} minSize={20} maxSize={40} className="bg-background">
          {conversationList}
        </Panel>

        <PanelResizeHandle className="w-1 bg-black transition-colors hover:bg-primary focus:bg-primary" />

        <Panel defaultSize={55}>
          {chatArea}
        </Panel>
      </PanelGroup>
    </div>
  );
}

