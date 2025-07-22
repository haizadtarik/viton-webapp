'use client';

import { User, Shirt, Image, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationPillsProps {
  currentStep: string;
  completedSteps: string[];
  className?: string;
  onStepClick?: (step: string) => void;
}

const steps = [
  { id: 'model', label: 'Model', icon: User },
  { id: 'garment', label: 'Garment', icon: Shirt },
  { id: 'result', label: 'Result', icon: Image },
];

export function NavigationPills({ 
  currentStep, 
  completedSteps, 
  className,
  onStepClick 
}: NavigationPillsProps) {
  return (
    <div className={cn(
      'bg-white/80 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border border-white/20',
      'flex items-center space-x-2',
      className
    )}>
      {steps.map((step) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = completedSteps.includes(step.id);
        const canClick = isCompleted || isActive;
        
        return (
          <button
            key={step.id}
            onClick={() => canClick && onStepClick?.(step.id)}
            disabled={!canClick}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200',
              'text-sm font-medium',
              isActive && 'bg-blue-500 text-white shadow-md',
              isCompleted && !isActive && 'bg-green-100 text-green-700 hover:bg-green-200',
              !isActive && !isCompleted && 'text-gray-400 cursor-not-allowed',
              canClick && !isActive && 'hover:bg-gray-100'
            )}
          >
            <div className="flex items-center space-x-2">
              {isCompleted && !isActive ? (
                <Check className="w-4 h-4" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              <span>{step.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
