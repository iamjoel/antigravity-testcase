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
  const {
    messages,
    activeConversationId,
    addMessage,
    updateMessage,
    fetchMessages,
    setActiveConversation,
    fetchConversations,
    isLoadingMessages,
    createLocalConversation,
    saveLocalMessage,
    loadLocalConversation
  } = useChatStore();

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeApp = apps.find((a) => a.id === activeAppId);

  useEffect(() => {
    if (activeApp) {
      if (activeApp.type === 'dify') {
        if (activeConversationId) {
          fetchMessages(activeApp.apiKey, activeConversationId, 'user-123');
        }
      } else {
        // Model App
        if (activeConversationId) {
          loadLocalConversation(activeConversationId);
        } else {
          // If no active conversation, create one immediately for Model apps? 
          // Or wait for first message? 
          // Dify waits. Let's wait.
          // But we need to clear messages.
          useChatStore.getState().clearMessages();
        }
      }
    }
  }, [activeApp, activeConversationId, fetchMessages, loadLocalConversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeApp) return;

    const userMessageContent = input.trim();
    setInput('');
    setIsSending(true);

    // Optimistic update for user message
    const userMsgId = uuidv4();
    const userMsg = {
      id: userMsgId,
      role: 'user' as const,
      content: userMessageContent,
      createdAt: Date.now(),
    };
    addMessage(userMsg);

    // Placeholder for assistant message
    const assistantMsgId = uuidv4();
    const assistantMsg = {
      id: assistantMsgId,
      role: 'assistant' as const,
      content: '',
      createdAt: Date.now(),
    };
    addMessage(assistantMsg);

    // Handle persistence for Model apps immediately
    let currentConversationId = activeConversationId;
    if (activeApp.type === 'model') {
      if (!currentConversationId) {
        currentConversationId = createLocalConversation(activeApp.id);
      }
      saveLocalMessage(currentConversationId, userMsg);
      saveLocalMessage(currentConversationId, assistantMsg);
    }

    try {
      let currentAnswer = '';

      if (activeApp.type === 'dify') {
        const { conversationId } = await sendMessage(
          activeApp.apiKey,
          userMessageContent,
          'user-123',
          activeConversationId || undefined,
          (chunk) => {
            currentAnswer += chunk;
            updateMessage(assistantMsgId, currentAnswer);
          }
        );

        if (!activeConversationId && conversationId) {
          setActiveConversation(conversationId);
          fetchConversations(activeApp.apiKey, 'user-123');
        }
      } else {
        // Model App
        const { sendModelMessage } = await import('@/lib/model-client');

        // Prepare history for model context
        const history = messages.map(m => ({ role: m.role, content: m.content }));
        history.push({ role: 'user', content: userMessageContent });

        await sendModelMessage(
          activeApp.apiKey,
          activeApp.modelConfig?.model || 'gpt-3.5-turbo',
          activeApp.modelConfig?.systemPrompt,
          history,
          (chunk) => {
            currentAnswer += chunk;
            updateMessage(assistantMsgId, currentAnswer);
            if (currentConversationId) {
              // We need to update the saved message too, but updateMessage only updates state.messages
              // We should probably have updateLocalMessage too, or just save at the end.
              // For streaming, saving at the end is better for performance, 
              // but if we want real-time persistence we need to update.
              // Let's save at the end.
            }
          }
        );

        if (currentConversationId) {
          saveLocalMessage(currentConversationId, { ...assistantMsg, content: currentAnswer });
        }
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      updateMessage(assistantMsgId, "Error: Failed to get response.");
      if (activeApp.type === 'model' && currentConversationId) {
        saveLocalMessage(currentConversationId, { ...assistantMsg, content: "Error: Failed to get response." });
      }
    } finally {
      setIsSending(false);
    }
  };

  if (!activeApp) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select an app to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="h-16 px-4 border-b flex items-center gap-3 flex-shrink-0">
        <span className="text-2xl">{activeApp.icon}</span>
        <h2 className="text-lg font-semibold">{activeApp.name}</h2>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-4 max-w-3xl mx-auto p-4">
            {isLoadingMessages && messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground">Loading messages...</div>
            )}
            {messages.map((message) => (
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
      </div>

      <div className="p-4 border-t flex-shrink-0">
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
          <Button onClick={handleSend} disabled={isSending || !input.trim()} size="icon" className="h-[50px] w-[50px]">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
