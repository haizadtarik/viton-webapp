'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'pulse' | 'dots' | 'sparkles';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'spinner',
  text,
  className 
}: LoadingSpinnerProps) {
  if (variant === 'sparkles') {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
        <div className="relative">
          <Sparkles className={cn(sizeClasses[size], 'text-primary-500 animate-pulse')} />
          <div className="absolute inset-0 animate-ping">
            <Sparkles className={cn(sizeClasses[size], 'text-primary-300')} />
          </div>
        </div>
        {text && (
          <p className="text-text-medium text-sm animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        {text && (
          <p className="text-text-medium text-sm">{text}</p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
        <div className={cn(
          sizeClasses[size],
          'bg-primary-500 rounded-full animate-pulse'
        )} />
        {text && (
          <p className="text-text-medium text-sm animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
      <Loader2 className={cn(sizeClasses[size], 'text-primary-500 animate-spin')} />
      {text && (
        <p className="text-text-medium text-sm">{text}</p>
      )}
    </div>
  );
}
