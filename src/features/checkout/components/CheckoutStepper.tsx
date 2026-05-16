import { Check } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

const STEPS = ['Delivery', 'Payment', 'Review'];

export function CheckoutStepper({ step }: { step: number }) {
  return (
    <div className="mb-10 flex items-center justify-center">
      {STEPS.map((label, i) => {
        const num = i + 1;
        const isComplete = step > num;
        const isCurrent = step === num;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                  isComplete ? 'bg-green-500 text-white' :
                  isCurrent ? 'bg-blue-600 text-white' :
                  'border-2 border-slate-300 text-slate-400',
                )}
              >
                {isComplete ? <Check size={14} /> : num}
              </div>
              <span
                className={cn(
                  'mt-1 text-xs font-medium',
                  isCurrent ? 'text-blue-600' :
                  isComplete ? 'text-green-600' :
                  'text-slate-400',
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-4 mb-5 h-0.5 w-20 transition-colors',
                  step > num ? 'bg-green-500' : 'bg-slate-200',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
