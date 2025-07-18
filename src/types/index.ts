import { LucideIcon } from 'lucide-react';

export type UploadSource = 'upload' | 'camera' | 'url';

export interface ImageData {
  base64: string | null;
  file: File | null;
  source: UploadSource;
  preview?: string;
}

export interface AppState {
  currentStep: 'landing' | 'model' | 'garment' | 'result';
  modelImage: ImageData;
  garmentImage: ImageData;
  resultImage: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface TryOnResponse {
  result_image: string;
  processing_time?: number;
  success: boolean;
  message?: string;
}

export interface TryOnRequest {
  model_image_base64: string;
  garment_image_base64: string;
  prompt: string;
  n_samples: number;
  n_steps: number;
  image_scale: number;
  seed: number;
}

export interface UploadError {
  code: 'FILE_TOO_LARGE' | 'INVALID_FORMAT' | 'NETWORK_ERROR' | 'UNKNOWN';
  message: string;
}

export interface NavigationStep {
  id: string;
  label: string;
  icon: LucideIcon;
  completed: boolean;
  active: boolean;
}

export interface UploadZoneProps {
  onImageUpload: (imageData: ImageData) => void;
  accept?: string;
  maxSize?: number;
  title: string;
  subtitle?: string;
  className?: string;
  disabled?: boolean;
}

export interface TabOption {
  id: UploadSource;
  label: string;
  icon: LucideIcon;
}

export class APIError extends Error {
  status?: number;
  code?: string;
  
  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}
