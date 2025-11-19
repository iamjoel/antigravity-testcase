import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getConversations, getMessages, deleteConversation, renameConversation } from '@/lib/dify-client';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  name: string;
  inputs: Record<string, any>;
  introduction: string;
  createdAt: number;
}

interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;

  setActiveConversation: (id: string | null) => void;
  fetchConversations: (apiKey: string, user: string) => Promise<void>;
  fetchMessages: (apiKey: string, conversationId: string, user: string) => Promise<void>;
  deleteConversation: (apiKey: string, conversationId: string, user: string) => Promise<void>;
  renameConversation: (apiKey: string, conversationId: string, name: string, user: string) => Promise<void>;
  clearMessages: () => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, content: string) => void;

  // Local Model App Support
  localConversations: Record<string, Message[]>;
  createLocalConversation: (appId: string) => string;
  saveLocalMessage: (conversationId: string, message: Message) => void;
  loadLocalConversation: (conversationId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: [],
      activeConversationId: null,
      isLoadingConversations: false,
      isLoadingMessages: false,

      setActiveConversation: (id) => set({ activeConversationId: id }),

      fetchConversations: async (apiKey, user) => {
        set({ isLoadingConversations: true });
        try {
          const data = await getConversations(apiKey, user);
          // Map Dify conversation format to our interface if needed
          // Dify returns { data: [...] }
          const conversations = data.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            inputs: c.inputs,
            introduction: c.introduction,
            createdAt: c.created_at,
          }));
          set({ conversations });
        } catch (error) {
          console.error('Failed to fetch conversations', error);
        } finally {
          set({ isLoadingConversations: false });
        }
      },

      fetchMessages: async (apiKey, conversationId, user) => {
        set({ isLoadingMessages: true, messages: [] });
        try {
          const data = await getMessages(apiKey, conversationId, user);
          // Map Dify messages (query/answer pairs) to flat list
          const flatMessages: Message[] = [];
          // Dify returns newest first usually? Need to check. Assuming newest first, we reverse.
          // Let's assume data.data is array.
          const sortedData = data.data.sort((a: any, b: any) => a.created_at - b.created_at);

          sortedData.forEach((item: any) => {
            if (item.query) {
              flatMessages.push({
                id: `${item.id}-user`,
                role: 'user',
                content: item.query,
                createdAt: item.created_at * 1000,
              });
            }
            if (item.answer) {
              flatMessages.push({
                id: `${item.id}-assistant`,
                role: 'assistant',
                content: item.answer,
                createdAt: item.created_at * 1000, // Dify timestamp is usually seconds
              });
            }
          });

          set({ messages: flatMessages });
        } catch (error) {
          console.error('Failed to fetch messages', error);
        } finally {
          set({ isLoadingMessages: false });
        }
      },

      deleteConversation: async (apiKey, conversationId, user) => {
        try {
          await deleteConversation(apiKey, conversationId, user);
          // Optimistic update first
          set((state) => ({
            conversations: state.conversations.filter((c) => c.id !== conversationId),
            activeConversationId: state.activeConversationId === conversationId ? null : state.activeConversationId,
            messages: state.activeConversationId === conversationId ? [] : state.messages,
          }));
          // Then refetch to ensure sync
          await get().fetchConversations(apiKey, user);
        } catch (error) {
          console.error('Failed to delete conversation', error);
        }
      },

      renameConversation: async (apiKey, conversationId, name, user) => {
        try {
          await renameConversation(apiKey, conversationId, name, user);
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c.id === conversationId ? { ...c, name } : c
            ),
          }));
        } catch (error) {
          console.error('Failed to rename conversation', error);
        }
      },

      clearMessages: () => set({ messages: [] }),

      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

      updateMessage: (id, content) =>
        set((state) => {
          const newMessages = state.messages.map((m) =>
            m.id === id ? { ...m, content } : m
          );

          // If we are in a local conversation (no Dify ID logic, but we can check activeConversationId)
          // Actually, we should probably have a way to know if current conversation is local.
          // For now, let's just save to localConversations if it exists there.
          const activeId = state.activeConversationId;
          if (activeId && state.localConversations[activeId]) {
            return {
              messages: newMessages,
              localConversations: {
                ...state.localConversations,
                [activeId]: newMessages
              }
            };
          }

          return { messages: newMessages };
        }),

      // Local Model App Actions
      localConversations: {}, // Map<conversationId, Message[]>

      createLocalConversation: (appId) => {
        const id = crypto.randomUUID();
        const newConversation: Conversation = {
          id,
          name: 'New Chat',
          inputs: {},
          introduction: '',
          createdAt: Date.now() / 1000,
        };
        set((state) => ({
          activeConversationId: id,
          messages: [],
          conversations: [newConversation, ...state.conversations], // Add to list (we might need to separate lists in UI or store)
          localConversations: {
            ...state.localConversations,
            [id]: []
          }
        }));
        return id;
      },

      saveLocalMessage: (conversationId, message) => {
        set((state) => {
          const currentMessages = state.localConversations[conversationId] || [];
          const newMessages = [...currentMessages, message];

          // Also update main messages if this is active
          const updates: Partial<ChatState> = {
            localConversations: {
              ...state.localConversations,
              [conversationId]: newMessages
            }
          };

          if (state.activeConversationId === conversationId) {
            updates.messages = newMessages;
          }

          return updates;
        });
      },

      loadLocalConversation: (conversationId) => {
        set((state) => ({
          activeConversationId: conversationId,
          messages: state.localConversations[conversationId] || [],
        }));
      },
    }),
    {
      name: 'dify-chat-storage',
      partialize: (state) => ({
        activeConversationId: state.activeConversationId,
        localConversations: state.localConversations
      }),
    }
  )
);
