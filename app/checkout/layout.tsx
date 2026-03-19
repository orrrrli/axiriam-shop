import CheckoutTransitionIndicator from '@/components/transitions/CheckoutTransitionIndicator';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CheckoutTransitionIndicator />
      {children}
    </>
  );
}
