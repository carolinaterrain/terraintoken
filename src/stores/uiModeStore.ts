import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UIMode = 'ape' | 'research';

interface UIModeState {
  mode: UIMode;
  setMode: (mode: UIMode) => void;
  toggleMode: () => void;
}

export const useUIModeStore = create<UIModeState>()(
  persist(
    (set) => ({
      mode: 'ape', // Default to Ape Mode for new visitors
      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set((state) => ({
          mode: state.mode === 'ape' ? 'research' : 'ape',
        })),
    }),
    {
      name: 'trn-ui-mode',
    }
  )
);
