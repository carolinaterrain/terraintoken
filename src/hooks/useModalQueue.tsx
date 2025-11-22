import { create } from 'zustand';

export type ModalType = 
  | 'risk-banner'
  | 'pwa-prompt'
  | 'exit-intent'
  | 'waitlist-exit'
  | 'goodbye-wave';

interface ModalState {
  activeModal: ModalType | null;
  dismissedModals: Set<ModalType>;
  modalQueue: ModalType[];
  lastShownTime: number;
  
  requestModal: (type: ModalType) => void;
  dismissModal: (type: ModalType, permanent?: boolean) => void;
  clearActiveModal: () => void;
}

// Priority order (higher index = higher priority)
const MODAL_PRIORITY: Record<ModalType, number> = {
  'risk-banner': 5,
  'pwa-prompt': 4,
  'exit-intent': 3,
  'waitlist-exit': 2,
  'goodbye-wave': 1,
};

// Minimum delay between modals (ms)
const MODAL_DELAY = 3000;

export const useModalQueue = create<ModalState>((set, get) => ({
  activeModal: null,
  dismissedModals: new Set(),
  modalQueue: [],
  lastShownTime: 0,

  requestModal: (type: ModalType) => {
    const state = get();
    
    // Don't show if permanently dismissed
    if (state.dismissedModals.has(type)) return;
    
    // Don't show if another modal was shown recently
    const timeSinceLastModal = Date.now() - state.lastShownTime;
    if (timeSinceLastModal < MODAL_DELAY && state.activeModal) return;
    
    // If no active modal, show immediately
    if (!state.activeModal) {
      set({
        activeModal: type,
        lastShownTime: Date.now(),
      });
      return;
    }
    
    // If new modal has higher priority, replace current
    if (MODAL_PRIORITY[type] > MODAL_PRIORITY[state.activeModal]) {
      set({
        activeModal: type,
        lastShownTime: Date.now(),
      });
    }
  },

  dismissModal: (type: ModalType, permanent = false) => {
    const state = get();
    
    if (permanent) {
      const newDismissed = new Set(state.dismissedModals);
      newDismissed.add(type);
      set({ dismissedModals: newDismissed });
    }
    
    if (state.activeModal === type) {
      set({ activeModal: null });
    }
  },

  clearActiveModal: () => {
    set({ activeModal: null });
  },
}));
