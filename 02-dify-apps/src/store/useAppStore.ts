import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface App {
  id: string;
  name: string;
  icon: string;
  apiKey: string;
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
