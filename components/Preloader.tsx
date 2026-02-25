'use client';

import { Loader2 } from 'lucide-react';

export default function Preloader() {
  return (
    <div className="fixed inset-0 w-full h-full bg-white z-modal flex flex-col items-center justify-center animate-fade-in">
      <h2 className="text-heading text-[2.4rem] tracking-[0.5rem] mb-[2rem]">
        AXIRIAM
      </h2>
      <Loader2 className="w-[3rem] h-[3rem] animate-spin text-heading" />
    </div>
  );
}
