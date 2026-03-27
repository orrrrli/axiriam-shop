export interface ProductViewTransitionNames {
  card: string;
  image: string;
}

const PRODUCT_TRANSITION_PREFIX = 'catalog-item';

function sanitizeTransitionToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getProductViewTransitionNames(productIdentity: string): ProductViewTransitionNames {
  const safeIdentity = sanitizeTransitionToken(productIdentity) || 'unknown';
  const token = `${PRODUCT_TRANSITION_PREFIX}-${safeIdentity}`;

  return {
    card: `${token}-card`,
    image: `${token}-image`,
  };
}

type StartViewTransition = (updateCallback: () => void | Promise<void>) => unknown;

interface ViewTransitionCapableDocument {
  startViewTransition?: StartViewTransition;
}

export function getStartViewTransition(): StartViewTransition | undefined {
  if (typeof document === 'undefined') return undefined;

  const doc = document as ViewTransitionCapableDocument;
  const startViewTransition = doc.startViewTransition;

  if (!startViewTransition) return undefined;

  return startViewTransition.bind(document);
}

export function shouldSkipViewTransition(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
