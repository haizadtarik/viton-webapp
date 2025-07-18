'use client';

import { useState, useCallback } from 'react';
import { ImageData, UploadSource } from '@/types';
import { fileToBase64, validateImageFile, createImagePreview, compressImage } from '@/lib/utils';
import { UPLOAD_CONFIG } from '@/lib/constants';

interface UseImageUploadReturn {
  uploadImage: (file: File, source: UploadSource) => Promise<ImageData>;
  uploadFromUrl: (url: string) => Promise<ImageData>;
  isUploading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadImage = useCallback(async (
    file: File,
    source: UploadSource
  ): Promise<ImageData> => {
    setIsUploading(true);
    setError(null);

    try {
      // Validate file
      const validationError = validateImageFile(file, UPLOAD_CONFIG.MAX_FILE_SIZE);
      if (validationError) {
        throw new Error(validationError.message);
      }

      // Compress image if it's too large
      let processedFile = file;
      if (file.size > 1024 * 1024) { // 1MB
        processedFile = await compressImage(
          file,
          UPLOAD_CONFIG.COMPRESSION.maxWidth,
          UPLOAD_CONFIG.COMPRESSION.quality
        );
      }

      // Convert to base64
      const base64 = await fileToBase64(processedFile);
      
      // Create preview URL
      const preview = createImagePreview(processedFile);

      const imageData: ImageData = {
        base64,
        file: processedFile,
        source,
        preview,
      };

      return imageData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadFromUrl = useCallback(async (url: string): Promise<ImageData> => {
    setIsUploading(true);
    setError(null);

    try {
      // Fetch image from URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch image from URL');
      }

      // Convert response to blob
      const blob = await response.blob();
      
      // Check if it's an image
      if (!blob.type.startsWith('image/')) {
        throw new Error('URL does not point to a valid image');
      }

      // Convert blob to file
      const file = new File([blob], 'image-from-url', { type: blob.type });

      // Use the regular upload flow
      return await uploadImage(file, 'url');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load image from URL';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [uploadImage]);

  return {
    uploadImage,
    uploadFromUrl,
    isUploading,
    error,
    clearError,
  };
};
