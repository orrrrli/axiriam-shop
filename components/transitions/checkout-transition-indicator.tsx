'use client';

import { useEffect, useState } from 'react';
import { useTransitionContext } from './transition-context';
import LoadingOverlay from './loading-overlay';
import PaymentBlockModal from './payment-block-modal';
import { useTransitionStore } from '@/lib/store/transitionStore';

export default function CheckoutTransitionIndicator() {
  const { reducedMotion } = useTransitionContext();
  const isPaymentProcessing = useTransitionStore((s) => s.isPaymentProcessing);
  const [showBlockModal, setShowBlockModal] = useState(false);

  useEffect(() => {
    if (!isPaymentProcessing) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    const handlePopState = () => {
      // Push state back to prevent the navigation
      window.history.pushState(null, '', window.location.href);
      setShowBlockModal(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isPaymentProcessing]);

  return (
    <>
      <LoadingOverlay variant="checkout" reducedMotion={reducedMotion} />
      {showBlockModal && (
        <PaymentBlockModal onDismiss={() => setShowBlockModal(false)} />
      )}
    </>
  );
}
