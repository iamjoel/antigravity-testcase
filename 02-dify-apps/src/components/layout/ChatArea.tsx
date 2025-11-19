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
        const { generateTitle } = await import('@/app/actions/generate-title');

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
          }
        );

        // Check if this was the first exchange (messages was empty before this turn, so now it has 2 messages: user + assistant)
        // We can check if the conversation name is "New Chat" or if messages.length is small.
        // Since we just added 2 messages, let's check if total messages count is 2.
        // Note: messages state might not be updated yet in this closure if we rely on `messages` var from render.
        // But we can check `useChatStore.getState().messages`.
        const currentMessages = useChatStore.getState().messages;
        // We expect at least 2 messages now.
        // Actually, let's just check if the conversation name is "New Chat"
        const currentConversation = useChatStore.getState().conversations.find(c => c.id === currentConversationId);

        if (currentConversation && currentConversation.name === 'New Chat') {
          // Generate title
          generateTitle(
            activeApp.modelConfig?.model || 'gpt-3.5-turbo',
            userMessageContent,
            currentAnswer
          ).then((title) => {
            if (title && currentConversationId) {
              useChatStore.getState().renameLocalConversation(activeApp.id, currentConversationId, title);
            }
          });
        }

      }

    } catch (error) {
      console.error('Failed to send message:', error);
      updateMessage(assistantMsgId, "Error: Failed to get response.");
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
    <div className="flex flex-col h-full bg-white">
      <div className="h-16 px-4 border-b-4 border-black flex items-center gap-3 flex-shrink-0 bg-white min-w-0">
        <span className="text-3xl flex-shrink-0 filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">{activeApp.icon}</span>
        <h2 className="text-xl font-black uppercase tracking-wide truncate overflow-hidden text-ellipsis whitespace-nowrap">{activeApp.name}</h2>
      </div>

      <div className="flex-1 min-h-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] bg-white/50">
        <ScrollArea className="h-full">
          <div className="space-y-6 max-w-3xl mx-auto p-6">
            {isLoadingMessages && messages.length === 0 && (
              <div className="text-center text-sm font-bold animate-pulse">LOADING MESSAGES...</div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center flex-shrink-0 shadow-[4px_4px_0px_0px_#000000]">
                    <Bot className="h-6 w-6 text-black" />
                  </div>
                )}
                <div
                  className={cn(
                    "p-4 max-w-[80%] border-2 border-black shadow-[4px_4px_0px_0px_#000000]",
                    message.role === 'user'
                      ? "bg-secondary text-black"
                      : "bg-white text-black"
                  )}
                >
                  <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-10 h-10 border-2 border-black bg-primary flex items-center justify-center flex-shrink-0 shadow-[4px_4px_0px_0px_#000000]">
                    <User className="h-6 w-6 text-black" />
                  </div>
                )}
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="p-6 border-t-4 border-black bg-white flex-shrink-0">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="TYPE A MESSAGE..."
            className="min-h-[60px] max-h-[200px] border-2 border-black shadow-[4px_4px_0px_0px_#000000] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-medium placeholder:text-muted-foreground/70"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            size="icon"
            className="h-[60px] w-[60px] border-2 border-black shadow-[4px_4px_0px_0px_#000000] rounded-none bg-primary text-black hover:bg-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
          >
            <Send className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
