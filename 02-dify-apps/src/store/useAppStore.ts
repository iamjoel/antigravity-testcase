import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppType = 'dify' | 'model';

export interface App {
  id: string;
  name: string;
  icon: string;
  apiKey: string;
  type: AppType;
  modelConfig?: {
    provider: string;
    model: string;
    systemPrompt?: string;
  };
}

interface AppState {
  apps: App[];
  activeAppId: string | null;
  _hasHydrated: boolean;
  addApp: (app: App) => void;
  removeApp: (id: string) => void;
  setActiveApp: (id: string) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      apps: [],
      activeAppId: null,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      addApp: (app) =>
        set((state) => {
          const defaultApp: App = {
            id: 'default-dify-demo',
            name: 'Dify Demo',
            icon: '🤖',
            apiKey: process.env.NEXT_PUBLIC_DIFY_DEMO_KEY || '',
            type: 'dify',
          };
          if (state.apps.some((a) => a.id === app.id)) {
            return state;
          }
          return {
            apps: [...state.apps, app],
            activeAppId: state.activeAppId || app.id, // Auto-select first app
          };
        }),
      removeApp: (id) =>
        set((state) => ({
          apps: state.apps.filter((app) => app.id !== id),
          activeAppId: state.activeAppId === id ? null : state.activeAppId,
        })),
      setActiveApp: (id) => set({ activeAppId: id }),
    }),
    {
      name: 'dify-apps-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
