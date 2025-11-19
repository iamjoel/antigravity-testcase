"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from "@/store/useAppStore";
import { useChatStore } from "@/store/useChatStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { sendMessage } from "@/lib/dify-client";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from 'uuid';

export function ChatArea() {
  const { apps, activeAppId } = useAppStore();
  const { conversations, activeConversationId, addMessage, updateConversation } = useChatStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeApp = apps.find((a) => a.id === activeAppId);
  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeApp || !activeConversationId) return;

    const userMessageContent = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    addMessage(activeConversationId, {
      id: uuidv4(),
      role: 'user',
      content: userMessageContent,
      createdAt: Date.now(),
    });

    // Create placeholder for assistant message
    const assistantMessageId = uuidv4();
    addMessage(activeConversationId, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
    });

    try {
      // We use the local conversation ID for UI, but for API we might need a real one.
      // If it's a new chat (no messages yet), we pass undefined to API to get a new ID.
      // But here we are using local IDs.
      // Strategy: If we have a `difyConversationId` stored, use it.
      // Since we didn't add `difyConversationId` to store, let's assume we use the local ID if it matches Dify format (UUID),
      // or we let Dify create one and we might need to map it.
      // Simplified: We just pass `conversation_id` if it's not the first message.
      // Actually, Dify returns a `conversation_id`. We should probably update our local conversation ID to match Dify's if it's the first message?
      // Or store `difyId` separately.
      // For simplicity, let's just pass the ID if we have one from Dify.
      // But wait, we generated a UUID locally. Dify generates its own UUIDs.
      // We should probably store `difyConversationId` in the conversation object.
      // I'll add `difyConversationId` to the store update if needed, or just rely on the fact that we might not need to persist it if we just want history in this session.
      // But for history to work across reloads with Dify, we need the Dify ID.
      // Let's assume for now we just start a new conversation with Dify every time unless we have a mapped ID.
      // I'll update `useChatStore` to include `difyConversationId` later if needed.
      // For now, let's just pass `activeConversationId` if it looks like a Dify ID (UUID), which it is.
      // But Dify might reject our generated UUID.
      // Let's pass `undefined` if it's the first message in this conversation (or check if we have a valid Dify ID).
      // Actually, the requirement says "Chat interface only needs to support displaying chat history under THIS session".
      // So maybe we don't need to sync history with Dify server, just keep it local.
      // So we pass `conversation_id` as `activeConversation.difyId` (which we need to add) or `undefined` for new.

      let currentAnswer = '';

      await sendMessage(
        activeApp.apiKey,
        userMessageContent,
        'user-123', // Hardcoded user for now
        activeConversation?.difyConversationId, // We need to add this field
        (chunk) => {
          currentAnswer += chunk;
          // Update the assistant message with new content
          // This is a bit inefficient with Zustand for every chunk, but fine for now.
          // Better: update local state and sync to store at end or throttled.
          // For now, let's direct update store.
          useChatStore.setState((state) => ({
            conversations: state.conversations.map((c) =>
              c.id === activeConversationId
                ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMessageId ? { ...m, content: currentAnswer } : m
                  ),
                }
                : c
            ),
          }));
        }
      ).then(({ conversationId }) => {
        if (conversationId && activeConversationId) {
          updateConversation(activeConversationId, { difyConversationId: conversationId });
        }
      });

    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message or toast
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeApp) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select an app to start chatting
      </div>
    );
  }

  if (!activeConversationId) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select or create a conversation
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b flex items-center gap-3">
        <span className="text-2xl">{activeApp.icon}</span>
        <h2 className="text-lg font-semibold">{activeApp.name}</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {activeConversation?.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "rounded-lg p-3 max-w-[80%]",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="min-h-[50px] max-h-[200px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon" className="h-[50px] w-[50px]">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
