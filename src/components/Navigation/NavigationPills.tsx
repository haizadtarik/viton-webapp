'use client';

import { User, Shirt, Image, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationPillsProps {
  currentStep: string;
  completedSteps: string[];
  className?: string;
}

const steps = [
  { id: 'model', label: 'Model', icon: User },
  { id: 'garment', label: 'Garment', icon: Shirt },
  { id: 'result', label: 'Result', icon: Image },
];

export function NavigationPills({ 
  currentStep, 
  completedSteps, 
  className 
}: NavigationPillsProps) {
  return (
    <div className={cn('flex justify-center space-x-4', className)}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = completedSteps.includes(step.id);
        
        return (
          <div
            key={step.id}
            className={cn(
              'nav-pill',
              isActive && 'active',
              isCompleted && !isActive && 'completed',
              !isActive && !isCompleted && 'inactive'
            )}
          >
            <div className="flex items-center space-x-2">
              {isCompleted && !isActive ? (
                <Check className="w-4 h-4" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            
            {/* Step number for mobile */}
            <span className="sm:hidden text-xs">
              {index + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}
