import React from 'react';

interface MainLayoutProps {
  sidebar: React.ReactNode;
  conversationList: React.ReactNode;
  chatArea: React.ReactNode;
}

export function MainLayout({ sidebar, conversationList, chatArea }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <aside className="w-[300px] flex-shrink-0 border-r bg-muted/10">
        {sidebar}
      </aside>
      <aside className="w-[300px] flex-shrink-0 border-r bg-background">
        {conversationList}
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        {chatArea}
      </main>
    </div>
  );
}
