import { createContext, useContext } from 'react';

export interface TransitionContextValue {
  reducedMotion: boolean;
}

export const TransitionContext = createContext<TransitionContextValue>({
  reducedMotion: false,
});

export function useTransitionContext(): TransitionContextValue {
  return useContext(TransitionContext);
}
