// API Configuration
export const API_CONFIG = {
  TIMEOUT: 300000, // 5 minutes (300 seconds)
  RETRY_ATTEMPTS: 3,
} as const;

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_DIMENSIONS: {
    width: 2048,
    height: 2048,
  },
  COMPRESSION: {
    quality: 0.8,
    maxWidth: 1024,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection and try again.',
  FILE_TOO_LARGE: 'File size must be less than 10MB.',
  INVALID_FORMAT: 'Please upload a valid image file (JPEG, PNG, WebP).',
  UPLOAD_FAILED: 'Failed to upload image. Please try again.',
  GENERATION_FAILED: 'Failed to generate try-on result. Please try again.',
  CAMERA_ACCESS: 'Camera access denied. Please allow camera permission.',
  INVALID_URL: 'Please enter a valid image URL.',
  GENERIC: 'Something went wrong. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: 'Image uploaded successfully!',
  GENERATION_SUCCESS: 'Try-on result generated successfully!',
  DOWNLOAD_SUCCESS: 'Image downloaded successfully!',
} as const;

// App Steps
export const APP_STEPS = {
  LANDING: 'landing',
  MODEL: 'model',
  GARMENT: 'garment',
  RESULT: 'result',
} as const;

// Upload Sources
export const UPLOAD_SOURCES = {
  UPLOAD: 'upload',
  CAMERA: 'camera',
  URL: 'url',
} as const;

// Navigation Configuration
export const NAVIGATION_STEPS = [
  {
    id: 'model',
    label: 'Model',
    description: 'Upload or take a photo of the person',
  },
  {
    id: 'garment',
    label: 'Garment',
    description: 'Choose the clothing item to try on',
  },
  {
    id: 'result',
    label: 'Result',
    description: 'View and download your try-on result',
  },
] as const;