'use client';

import { useState, useCallback } from 'react';
import { TryOnResponse } from '@/types';
import { generateTryOnWithRetry, isAPIError } from '@/lib/api';

interface UseTryOnReturn {
  generateTryOn: (modelImage: string, garmentImage: string) => Promise<TryOnResponse>;
  isGenerating: boolean;
  error: string | null;
  result: TryOnResponse | null;
  clearError: () => void;
  clearResult: () => void;
}

export const useTryOn = (): UseTryOnReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TryOnResponse | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  const generateTryOn = useCallback(async (
    modelImage: string,
    garmentImage: string
  ): Promise<TryOnResponse> => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await generateTryOnWithRetry(modelImage, garmentImage);
      setResult(response);
      return response;
    } catch (err) {
      let errorMessage = 'Failed to generate try-on result';
      
      if (isAPIError(err)) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateTryOn,
    isGenerating,
    error,
    result,
    clearError,
    clearResult,
  };
};
