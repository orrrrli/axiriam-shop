'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ImageLoaderProps {
  src: string;
  alt?: string;
  className?: string;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({ src, alt = '', className = '' }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <Loader2
          className="absolute inset-0 m-auto animate-spin text-gray-10"
          size={24}
        />
      )}
      <img
        alt={alt}
        className={`${className} ${loaded ? 'is-img-loaded' : 'is-img-loading'}`}
        onLoad={() => setLoaded(true)}
        src={src}
      />
    </>
  );
};

export default ImageLoader;
