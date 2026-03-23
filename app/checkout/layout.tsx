import CheckoutTransitionIndicator from '@/components/transitions/checkout-transition-indicator';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CheckoutTransitionIndicator />
      {children}
    </>
  );
}
