"use client";

import React, { useEffect } from 'react';
import { useAppStore } from "@/store/useAppStore";
import { useChatStore } from "@/store/useChatStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConversationList() {
  const { apps, activeAppId } = useAppStore();
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    deleteConversation,
    fetchConversations,
    clearMessages,
    isLoadingConversations
  } = useChatStore();

  const activeApp = apps.find(a => a.id === activeAppId);

  useEffect(() => {
    if (activeApp) {
      fetchConversations(activeApp.apiKey, 'user-123');
    }
  }, [activeApp, fetchConversations]);

  const handleNewChat = () => {
    setActiveConversation(null);
    clearMessages();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (activeApp && confirm('Delete this conversation?')) {
      await deleteConversation(activeApp.apiKey, id, 'user-123');
    }
  };

  if (!activeAppId) {
    return (
      <div className="h-full flex items-center justify-center p-4 text-muted-foreground text-sm">
        Select an app to view conversations
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <Button variant="outline" size="icon" onClick={handleNewChat}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {isLoadingConversations && (
            <div className="text-center text-sm text-muted-foreground p-4">Loading...</div>
          )}
          {!isLoadingConversations && conversations.length === 0 && (
            <div className="text-center text-sm text-muted-foreground p-4">
              No conversations yet.
            </div>
          )}
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "group flex items-center justify-between p-3 rounded-lg text-sm cursor-pointer transition-colors",
                activeConversationId === conversation.id
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              )}
              onClick={() => setActiveConversation(conversation.id)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{conversation.name || 'New Chat'}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDelete(e, conversation.id)}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
