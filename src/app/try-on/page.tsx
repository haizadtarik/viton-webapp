'use client';

import { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Download, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { ImageData } from '@/types';
import { UploadZone } from '@/components/Upload/UploadZone';
import { NavigationPills } from '@/components/Navigation/NavigationPills';
import { ImagePreview } from '@/components/Preview/ImagePreview';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { useTryOn } from '@/hooks/useTryOn';
import { cn, downloadImage } from '@/lib/utils';

type Step = 'model' | 'garment' | 'result';

export default function TryOnPage() {
  const [currentStep, setCurrentStep] = useState<Step>('model');
  const [modelImage, setModelImage] = useState<ImageData | null>(null);
  const [garmentImage, setGarmentImage] = useState<ImageData | null>(null);
  const { generateTryOn, isGenerating, error, result, clearError } = useTryOn();

  const completedSteps = [
    ...(modelImage ? ['model'] : []),
    ...(garmentImage ? ['garment'] : []),
    ...(result ? ['result'] : []),
  ];

  const handleModelUpload = useCallback((imageData: ImageData) => {
    setModelImage(imageData);
    if (currentStep === 'model') {
      setCurrentStep('garment');
    }
  }, [currentStep]);

  const handleGarmentUpload = useCallback((imageData: ImageData) => {
    setGarmentImage(imageData);
  }, []);

  const handleGenerateTryOn = useCallback(async () => {
    if (!modelImage?.base64 || !garmentImage?.base64) return;

    try {
      clearError();
      await generateTryOn(modelImage.base64, garmentImage.base64);
      setCurrentStep('result');
    } catch {
      // Error is handled by the hook
    }
  }, [modelImage, garmentImage, generateTryOn, clearError]);

  const handleDownload = useCallback(() => {
    if (result?.result_image) {
      downloadImage(result.result_image, 'virtual-try-on-result.png');
    }
  }, [result]);

  const handleReset = useCallback(() => {
    setModelImage(null);
    setGarmentImage(null);
    setCurrentStep('model');
    clearError();
  }, [clearError]);

  const canGenerateResult = modelImage !== null && garmentImage !== null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Link 
              href="/" 
              className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold text-text-dark mb-4">
            Virtual Try-On Studio
          </h1>
          <p className="text-lg text-text-medium max-w-2xl mx-auto">
            Upload a model photo and a garment image to see how they look together using AI-powered virtual try-on technology.
          </p>
        </div>

        {/* Navigation Pills */}
        <NavigationPills 
          currentStep={currentStep}
          completedSteps={completedSteps}
          className="mb-8"
        />

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        {/* Model Upload Step */}
        {currentStep === 'model' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-text-dark mb-2">
                  Upload Model Photo
                </h2>
                <p className="text-text-medium">
                  Choose a clear photo of a person to serve as your model
                </p>
              </div>

              {modelImage ? (
                <div className="space-y-6">
                  <ImagePreview
                    src={modelImage.preview || `data:image/jpeg;base64,${modelImage.base64}`}
                    alt="Model Photo"
                    onRemove={() => setModelImage(null)}
                    title="Model Photo"
                  />
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setCurrentStep('garment')}
                      className="btn btn-primary btn-lg"
                    >
                      Continue to Garment
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              ) : (
                <UploadZone
                  onImageUpload={handleModelUpload}
                  title="Upload Model Photo"
                  subtitle="Perfect for showcasing how garments will look"
                />
              )}
            </div>
          </div>
        )}

        {/* Garment Upload Step */}
        {currentStep === 'garment' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-text-dark mb-2">
                  Upload Garment
                </h2>
                <p className="text-text-medium">
                  Choose the clothing item you want to try on your model
                </p>
              </div>

              {garmentImage ? (
                <div className="space-y-6">
                  <ImagePreview
                    src={garmentImage.preview || `data:image/jpeg;base64,${garmentImage.base64}`}
                    alt="Garment"
                    onRemove={() => setGarmentImage(null)}
                    title="Garment"
                  />
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setCurrentStep('model')}
                      className="btn btn-secondary btn-lg"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back to Model
                    </button>
                    <button
                      onClick={handleGenerateTryOn}
                      disabled={!canGenerateResult || isGenerating}
                      className={cn(
                        'btn btn-lg',
                        canGenerateResult ? 'btn-primary' : 'btn-disabled'
                      )}
                    >
                      {isGenerating ? (
                        <>
                          <LoadingSpinner className="w-5 h-5 mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Try-On
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <UploadZone
                    onImageUpload={handleGarmentUpload}
                    title="Upload Garment"
                    subtitle="Shirts, dresses, jackets, and more"
                  />
                  <div className="flex justify-center">
                    <button
                      onClick={() => setCurrentStep('model')}
                      className="btn btn-secondary btn-lg"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back to Model
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Result Step */}
        {currentStep === 'result' && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-text-dark mb-2">
                  Virtual Try-On Result
                </h2>
                <p className="text-text-medium">
                  Here's how the garment looks on your model
                </p>
              </div>

              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <LoadingSpinner className="w-16 h-16 mb-4" />
                  <h3 className="text-xl font-semibold text-text-dark mb-2">
                    Generating Your Try-On...
                  </h3>
                  <p className="text-text-medium">
                    This may take a few moments
                  </p>
                </div>
              ) : result ? (
                <div className="space-y-8">
                  {/* Result Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Original Model */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text-dark text-center">
                        Original Model
                      </h3>
                      {modelImage && (
                        <ImagePreview
                          src={modelImage.preview || `data:image/jpeg;base64,${modelImage.base64}`}
                          alt="Original Model"
                          onRemove={() => {}}
                          title=""
                          showControls={false}
                        />
                      )}
                    </div>

                    {/* Garment */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text-dark text-center">
                        Garment
                      </h3>
                      {garmentImage && (
                        <ImagePreview
                          src={garmentImage.preview || `data:image/jpeg;base64,${garmentImage.base64}`}
                          alt="Garment"
                          onRemove={() => {}}
                          title=""
                          showControls={false}
                        />
                      )}
                    </div>

                    {/* Result */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text-dark text-center">
                        Try-On Result
                      </h3>
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`data:image/png;base64,${result.result_image}`}
                          alt="Virtual try-on result"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={handleDownload}
                      className="btn btn-primary btn-lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Result
                    </button>
                    <button
                      onClick={() => setCurrentStep('garment')}
                      className="btn btn-secondary btn-lg"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Try Different Garment
                    </button>
                    <button
                      onClick={handleReset}
                      className="btn btn-outline btn-lg"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Start Over
                    </button>
                  </div>

                  {/* Processing Time */}
                  {result.processing_time && (
                    <div className="text-center text-sm text-text-light">
                      Generated in {(result.processing_time / 1000).toFixed(1)} seconds
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold text-text-dark mb-2">
                    No Result Yet
                  </h3>
                  <p className="text-text-medium mb-6">
                    Upload both a model and garment to generate a try-on result
                  </p>
                  <button
                    onClick={() => setCurrentStep('model')}
                    className="btn btn-primary btn-lg"
                  >
                    Start Try-On Process
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-12 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-text-medium hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
