'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const Banner = () => {
  return (
    <div className="w-full h-[40rem] mt-[2rem] bg-[#f3f3f3] flex max-xs:h-auto max-xs:flex-col">
      {/* Left - Text */}
      <div className="flex items-start justify-center flex-col p-[5rem] basis-1/2 max-xs:p-[5rem_0]">
        <h1 className="text-[4.8rem] text-heading mb-[1rem] w-[80%] leading-tight max-xs:w-full max-xs:text-[3rem]">
          <span className="font-light">Wear</span>
          &nbsp;your style with&nbsp;
          <strong>Confidence</strong>
        </h1>
        <p className="text-paragraph text-[1.6rem] leading-[2.4rem]">
          Gorros quir&uacute;rgicos de alta calidad con dise&ntilde;os &uacute;nicos para profesionales
          de la salud. Comodidad y estilo en cada turno.
        </p>
        <br />
        <Link href="/catalogo" className="button inline-flex items-center gap-2 no-underline">
          Shop Now&nbsp;
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Right - Image */}
      <div className="relative w-full h-full basis-1/2 overflow-hidden max-xs:h-[25rem]">
        <img
          src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Gorros quirúrgicos"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Banner;
