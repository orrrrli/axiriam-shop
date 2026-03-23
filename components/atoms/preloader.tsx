'use client';

import BrandSpinner from '@/components/transitions/brand-spinner';
import { useTransitionContext } from '@/components/transitions/transition-context';

export default function Preloader() {
  const { reducedMotion } = useTransitionContext();

  return (
    <div className="fixed inset-0 w-full h-full bg-white z-modal flex flex-col items-center justify-center animate-fade-in">
      <h2 className="text-heading text-[2.4rem] tracking-[0.5rem] mb-[2rem]">
        AXIRIAM
      </h2>
      <BrandSpinner size="lg" reducedMotion={reducedMotion} />
    </div>
  );
}
