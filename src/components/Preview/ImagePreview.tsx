'use client';

import { X, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePreviewProps {
  src: string;
  alt: string;
  title?: string;
  onRemove?: () => void;
  onDownload?: () => void;
  className?: string;
  showControls?: boolean;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
}

export function ImagePreview({
  src,
  alt,
  title,
  onRemove,
  onDownload,
  className,
  showControls = true,
  aspectRatio = 'auto',
}: ImagePreviewProps) {
  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    auto: '',
  };

  return (
    <div className={cn('relative group', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-text-dark mb-3">{title}</h3>
      )}
      
      <div className={cn('image-preview relative overflow-hidden', aspectClasses[aspectRatio])}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {showControls && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              {onDownload && (
                <button
                  onClick={onDownload}
                  className="btn btn-primary btn-sm rounded-full p-2"
                  title="Download image"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              
              {onRemove && (
                <button
                  onClick={onRemove}
                  className="btn bg-red-500 hover:bg-red-600 text-white btn-sm rounded-full p-2"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
