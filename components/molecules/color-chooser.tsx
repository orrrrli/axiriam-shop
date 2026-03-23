'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface ColorChooserProps {
  availableColors: string[];
  onSelectedColorChange: (color: string) => void;
  selectedColor?: string;
}

export default function ColorChooser({
  availableColors,
  onSelectedColorChange,
  selectedColor: controlledColor,
}: ColorChooserProps) {
  const [internalColor, setInternalColor] = useState('');
  const selectedColor = controlledColor ?? internalColor;

  const setColor = (color: string) => {
    setInternalColor(color);
    onSelectedColorChange(color);
  };

  return (
    <div className="w-full flex">
      {availableColors.map((color) => (
        <div
          key={color}
          role="button"
          tabIndex={0}
          onClick={() => setColor(color)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setColor(color);
          }}
          className={`
            w-[3rem] h-[3rem] rounded-full mx-[1rem] relative z-[1]
            transition-transform duration-200 ease-in-out flex-shrink-0
            cursor-pointer
            hover:border-2 hover:border-[#f1f1f1]
            ${
              selectedColor === color
                ? 'border-2 border-[#f1f1f1] scale-[1.2]'
                : ''
            }
          `}
          style={{ backgroundColor: color }}
        >
          {selectedColor === color && (
            <Check
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
              size={14}
              strokeWidth={3}
            />
          )}
        </div>
      ))}
    </div>
  );
}
