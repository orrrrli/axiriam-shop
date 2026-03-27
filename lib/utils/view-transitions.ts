import type { CSSProperties } from 'react';

type ViewTransitionCapableDocument = Document & {
  startViewTransition?: (updateCallback: () => void) => unknown;
};

const SAFE_NAME_FALLBACK = 'default';

function getDocument(): ViewTransitionCapableDocument | null {
  if (typeof document === 'undefined') {
    return null;
  }

  return document as ViewTransitionCapableDocument;
}

export function supportsViewTransitions(): boolean {
  const currentDocument = getDocument();
  return Boolean(currentDocument?.startViewTransition);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function startViewTransition(navigate: () => void): boolean {
  const currentDocument = getDocument();

  if (!currentDocument?.startViewTransition || prefersReducedMotion()) {
    return false;
  }

  currentDocument.startViewTransition(() => {
    navigate();
  });

  return true;
}

export function createViewTransitionName(prefix: string, rawId: string): string {
  const trimmed = rawId.trim();
  const safeId = trimmed.replace(/[^a-zA-Z0-9_-]/g, '-') || SAFE_NAME_FALLBACK;

  return `${prefix}-${safeId}`;
}

export function viewTransitionStyle(name?: string): CSSProperties | undefined {
  if (!name) {
    return undefined;
  }

  return { viewTransitionName: name } as CSSProperties;
}
