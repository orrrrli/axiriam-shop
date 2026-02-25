'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();

  // Only show footer on Home and Shop pages
  const visiblePaths = ['/', '/shop'];
  if (!visiblePaths.includes(pathname)) return null;

  return (
    <footer className="relative px-[5.6rem] mt-[4.8rem] bg-off-white flex items-center justify-between max-md:px-0 max-md:pt-[2.5rem] max-md:flex-col max-md:text-center">
      <div className="basis-[40%] max-md:basis-auto max-md:order-1 max-md:w-full max-md:my-[1.2rem]">
        <strong>
          <span className="text-paragraph text-[1.2rem]">
            Developed by{' '}
            <a href="https://github.com/orrrrli" className="underline" target="_blank" rel="noopener noreferrer">
              AXIRIAM TEAM
            </a>
          </span>
        </strong>
      </div>
      <div className="py-[3rem] text-center basis-[20%] max-md:basis-auto max-md:order-3 max-md:pb-0 max-md:mb-0 max-md:w-full max-md:my-[1.2rem]">
        <h2 className="text-heading text-[1.6rem] mb-1">AXIRIAM</h2>
        <h5 className="text-paragraph text-[1.2rem] m-0">
          &copy;&nbsp;{new Date().getFullYear()}
        </h5>
      </div>
      <div className="basis-[40%] text-right max-md:basis-auto max-md:order-2 max-md:text-center max-md:w-full max-md:my-[1.2rem]">
        <strong>
          <span className="text-paragraph text-[1.2rem]">
            Gorros Quir&uacute;rgicos de Alta Calidad
          </span>
        </strong>
      </div>
    </footer>
  );
};

export default Footer;
