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
    deleteLocalConversation,
    fetchConversations,
    clearMessages,
    isLoadingConversations,
    fetchModelConversations
  } = useChatStore();

  const activeApp = apps.find(a => a.id === activeAppId);

  useEffect(() => {
    if (activeApp) {
      if (activeApp.type === 'dify') {
        fetchConversations(activeApp.apiKey, 'user-123');
      } else {
        fetchModelConversations(activeApp.id);
      }
    }
  }, [activeApp, fetchConversations, fetchModelConversations]);

  const handleNewChat = () => {
    setActiveConversation(null);
    clearMessages();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (activeApp && confirm('Delete this conversation?')) {
      if (activeApp.type === 'dify') {
        await deleteConversation(activeApp.apiKey, id, 'user-123');
      } else {
        deleteLocalConversation(activeApp.id, id);
      }
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
    <div className="flex flex-col h-full bg-background border-r-4 border-black">
      <div className="h-16 px-4 border-b-4 border-black flex items-center justify-between flex-shrink-0 bg-white">
        <h2 className="text-lg font-black uppercase tracking-wide">Conversations</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNewChat}
          className="border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all rounded-none bg-secondary text-black hover:bg-secondary"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 bg-white">
        <div className="p-4 space-y-3">
          {isLoadingConversations && (
            <div className="text-center text-sm font-bold p-4 animate-pulse">LOADING...</div>
          )}
          {!isLoadingConversations && conversations.length === 0 && (
            <div className="text-center text-sm font-bold p-4 border-2 border-dashed border-black bg-muted">
              NO CONVERSATIONS YET
            </div>
          )}
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "group flex items-center justify-between p-3 border-2 border-black cursor-pointer transition-all",
                activeConversationId === conversation.id
                  ? "bg-primary shadow-[4px_4px_0px_0px_#000000] translate-x-[-2px] translate-y-[-2px]"
                  : "bg-white hover:bg-primary/20 hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px]"
              )}
              onClick={() => setActiveConversation(conversation.id)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="truncate font-bold">{conversation.name || 'NEW CHAT'}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white rounded-none"
                onClick={(e) => handleDelete(e, conversation.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
