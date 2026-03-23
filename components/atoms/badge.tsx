'use client';

import React from 'react';

interface BadgeProps {
  count: number;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ count, children }) => (
  <div className="relative">
    {children}
    {count >= 1 && (
      <span className="absolute -top-[12px] -right-[15px] w-[20px] h-[20px] rounded-full bg-danger flex items-center justify-center text-white text-[11px] font-bold">
        {count}
      </span>
    )}
  </div>
);

export default Badge;
