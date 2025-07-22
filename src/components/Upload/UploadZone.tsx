'use client';

import { Upload, Camera, Link2, X, Loader2 } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { UploadZoneProps, UploadSource, TabOption } from '@/types';
import { useImageUpload } from '@/hooks/useImageUpload';
import { cn } from '@/lib/utils';

const tabOptions: TabOption[] = [
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'camera', label: 'Camera', icon: Camera },
  { id: 'url', label: 'URL', icon: Link2 },
];

export function UploadZone({
  onImageUpload,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024,
  title,
  subtitle,
  className,
  disabled = false,
}: UploadZoneProps) {
  const [activeTab, setActiveTab] = useState<UploadSource>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploadFromUrl, isUploading, error, clearError } = useImageUpload();

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      clearError();
      const imageData = await uploadImage(file, activeTab);
      onImageUpload(imageData);
    } catch {
      // Error is handled by the hook
    }
  }, [uploadImage, activeTab, onImageUpload, clearError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled || isUploading) return;
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  }, [disabled, isUploading, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  }, [disabled, isUploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleUrlSubmit = useCallback(async () => {
    if (!imageUrl.trim()) return;
    
    try {
      clearError();
      const imageData = await uploadFromUrl(imageUrl);
      onImageUpload(imageData);
      setImageUrl('');
    } catch {
      // Error is handled by the hook
    }
  }, [imageUrl, uploadFromUrl, onImageUpload, clearError]);

  const openFileDialog = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isUploading]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Tab Selector */}
      <div className="flex space-x-1 bg-gray-200/75 backdrop-blur-sm rounded-full p-1">
        {tabOptions.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'tab flex-1',
                activeTab === tab.id ? 'active' : 'inactive'
              )}
              disabled={disabled}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Upload Area */}
      {activeTab === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
          className={cn(
            'upload-zone cursor-pointer',
            isDragging && 'active',
            error && 'error',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md mx-auto">
            <div className="flex flex-col items-center space-y-4">
              {isUploading ? (
                <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
              ) : (
                <div className="p-4 rounded-full bg-gray-100/80 backdrop-blur-sm">
                  <Upload className="w-12 h-12 text-gray-500" />
                </div>
              )}
              
              <div className="text-center space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                {subtitle && (
                  <p className="text-gray-600 text-base">{subtitle}</p>
                )}
                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">
                    Drop your photo here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPEG, PNG, WebP (max {Math.round(maxSize / (1024 * 1024))}MB)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera Capture */}
      {activeTab === 'camera' && (
        <div className="upload-zone">
          <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md mx-auto">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-gray-100/80 backdrop-blur-sm">
                <Camera className="w-12 h-12 text-gray-500" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Take a Photo</h3>
                <p className="text-gray-600 text-base">Use your camera to capture a photo</p>
                <button
                  onClick={() => {
                    // TODO: Implement camera capture
                    console.log('Camera capture not implemented yet');
                  }}
                  className="btn btn-primary btn-md"
                  disabled={disabled}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Open Camera
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* URL Input */}
      {activeTab === 'url' && (
        <div className="upload-zone">
          <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md mx-auto">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-gray-100/80 backdrop-blur-sm">
                <Link2 className="w-12 h-12 text-gray-500" />
              </div>
              <div className="text-center space-y-4 w-full">
                <h3 className="text-xl font-semibold text-gray-800">Image URL</h3>
                <p className="text-gray-600 text-base">Enter a direct link to an image</p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    disabled={disabled || isUploading}
                  />
                  <button
                    onClick={handleUrlSubmit}
                    disabled={!imageUrl.trim() || disabled || isUploading}
                    className="btn btn-primary btn-md whitespace-nowrap"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Load Image'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <X className="w-3 h-3 text-white" />
            </div>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
