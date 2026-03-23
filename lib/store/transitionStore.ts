import { create } from 'zustand';
import { PROGRESS_BAR_COMPLETE_FADE_MS } from '@/lib/constants/transitions';

export type NavigationType = 'default' | 'item-detail';

export interface TransitionState {
  isNavigating: boolean;
  isVisible: boolean;
  progress: number;
  isPaymentProcessing: boolean;
  startTime: number | null;
  navigationType: NavigationType;

  startNavigation: () => void;
  startItemDetailNavigation: () => void;
  completeNavigation: () => void;
  cancelNavigation: () => void;
  showIndicator: () => void;
  setProgress: (value: number) => void;
  setPaymentProcessing: (value: boolean) => void;
}

const initialState = {
  isNavigating: false,
  isVisible: false,
  progress: 0,
  isPaymentProcessing: false,
  startTime: null,
  navigationType: 'default' as NavigationType,
};

export const useTransitionStore = create<TransitionState>()((set) => ({
  ...initialState,

  startNavigation: () => {
    set({ isNavigating: true, navigationType: 'default', startTime: Date.now() });
  },

  startItemDetailNavigation: () => {
    set({ isNavigating: true, navigationType: 'item-detail', startTime: Date.now() });
  },

  completeNavigation: () => {
    set({ isNavigating: false, isVisible: false, progress: 100, navigationType: 'default' });
    setTimeout(() => {
      set({ progress: 0 });
    }, PROGRESS_BAR_COMPLETE_FADE_MS);
  },

  cancelNavigation: () => {
    set({ ...initialState });
  },

  showIndicator: () => {
    set({ isVisible: true });
  },

  setProgress: (value) => {
    set({ progress: value });
  },

  setPaymentProcessing: (value) => {
    set({ isPaymentProcessing: value });
  },
}));
