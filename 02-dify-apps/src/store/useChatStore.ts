import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  appId: string;
  title: string;
  updatedAt: number;
  messages: Message[];
  difyConversationId?: string;
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  createConversation: (appId: string) => string;
  addMessage: (conversationId: string, message: Message) => void;
  setActiveConversation: (id: string) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      conversations: [],
      activeConversationId: null,
      createConversation: (appId) => {
        const newConversation: Conversation = {
          id: uuidv4(), // Temporary ID, will be replaced by Dify ID on first message if needed, or we map it
          appId,
          title: 'New Chat',
          updatedAt: Date.now(),
          messages: [],
        };
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          activeConversationId: newConversation.id,
        }));
        return newConversation.id;
      },
      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                ...c,
                messages: [...c.messages, message],
                updatedAt: Date.now(),
                title: c.messages.length === 0 ? message.content.slice(0, 30) : c.title,
              }
              : c
          ),
        })),
      setActiveConversation: (id) => set({ activeConversationId: id }),
      updateConversation: (id, updates) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
        })),
    }),
    {
      name: 'dify-chat-storage',
    }
  )
);
