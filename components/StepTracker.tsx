'use client';

import React from 'react';

interface StepTrackerProps {
  current: number;
}

const steps = [
  { step: 1, label: 'Order Summary' },
  { step: 2, label: 'Shipping Details' },
  { step: 3, label: 'Payment' },
];

const StepTracker: React.FC<StepTrackerProps> = ({ current }) => {
  const getStepClass = (step: number) => {
    if (step === current) return 'is-active';
    if (step < current) return 'is-done';
    return '';
  };

  return (
    <div className="flex justify-center sticky top-[6rem] bg-body py-[1rem] mb-[3rem] z-[1] max-xs:top-[5rem]">
      <ul className="w-1/2 flex justify-between items-center p-0 m-auto relative list-none
        before:content-[''] before:absolute before:top-[15px] before:left-0 before:right-0 before:mx-auto before:w-[85%] before:h-[3px] before:bg-border/50
        max-xs:w-full">
        {steps.map(({ step, label }) => {
          const state = getStepClass(step);
          return (
            <li key={step} className="flex justify-center">
              <div className="w-[100px] flex justify-center items-center flex-col z-[1]">
                <div
                  className={`m-0 p-[1.6rem] rounded-full w-[30px] h-[30px] flex justify-center items-center text-[1.4rem] font-bold
                    ${state === 'is-active'
                      ? 'bg-primary text-white'
                      : state === 'is-done'
                        ? 'bg-border-focus text-white'
                        : 'bg-border text-gray-10'
                    }`}
                >
                  <h4 className="m-0 text-inherit">{step}</h4>
                </div>
                <h6
                  className={`mt-[1.2rem] mb-0 text-[1.1rem] text-center
                    ${state === 'is-active' ? 'text-heading' : 'text-gray-20'}`}
                >
                  {label}
                </h6>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StepTracker;
