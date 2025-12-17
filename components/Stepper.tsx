
import React from 'react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum <= currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <React.Fragment key={stepNum}>
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
              ${isCurrent ? 'bg-slate-900 text-white ring-4 ring-slate-100' : 
                isActive ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-400'}
            `}>
              {stepNum}
            </div>
            {stepNum < totalSteps && (
              <div className={`h-[2px] w-8 md:w-12 rounded-full transition-all duration-300 ${isActive && stepNum < currentStep ? 'bg-slate-700' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
