'use client';

import { useState, useCallback } from 'react';
import { Sparkles, Download, RotateCcw } from 'lucide-react';
import { ImageData } from '@/types';
import { UploadZone } from '@/components/Upload/UploadZone';
import { NavigationPills } from '@/components/Navigation/NavigationPills';
import { ImagePreview } from '@/components/Preview/ImagePreview';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { useTryOn } from '@/hooks/useTryOn';
import { downloadImage } from '@/lib/utils';

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
    <div className="relative min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {currentStep === 'model' && 'Choose Your Model Image'}
            {currentStep === 'garment' && 'Provide Garment'}
            {currentStep === 'result' && 'Virtual Try-On Result'}
          </h1>
          {currentStep !== 'result' && (
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {currentStep === 'model'
                ? 'Upload a photo of your model to get started.'
                : 'Now, provide the garment you want to see on the model.'}
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 max-w-2xl mx-auto" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Main Content */}
        <main className="w-full flex-grow flex flex-col items-center pb-32">
          {currentStep === 'model' && (
            <div className="w-full max-w-md">
              <UploadZone 
                onImageUpload={handleModelUpload} 
                title="Drop your photo here"
                subtitle="Upload a clear photo of your model"
              />
            </div>
          )}

          {currentStep === 'garment' && (
            <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-4xl">
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-700">Your Model</h2>
                {modelImage && (
                  <ImagePreview
                    src={modelImage.preview || `data:image/jpeg;base64,${modelImage.base64}`}
                    alt="Model"
                    onRemove={() => setModelImage(null)}
                    title="Your Model"
                  />
                )}
              </div>
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-700">The Garment</h2>
                {garmentImage ? (
                  <ImagePreview
                    src={garmentImage.preview || `data:image/jpeg;base64,${garmentImage.base64}`}
                    alt="Garment"
                    onRemove={() => setGarmentImage(null)}
                    title="The Garment"
                  />
                ) : (
                  <UploadZone 
                    onImageUpload={handleGarmentUpload}
                    title="Drop garment here"
                    subtitle="Upload the clothing item"
                  />
                )}
              </div>
            </div>
          )}

          {currentStep === 'garment' && canGenerateResult && (
            <div className="mt-8">
              <button
                onClick={handleGenerateTryOn}
                disabled={isGenerating}
                className="btn btn-primary btn-lg group"
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner className="w-6 h-6 mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-2 transition-transform duration-300 group-hover:scale-110" />
                    Generate Try-On
                  </>
                )}
              </button>
            </div>
          )}

          {currentStep === 'result' && (
            <div className="w-full max-w-5xl">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <LoadingSpinner className="w-16 h-16 mb-4 text-primary-600" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    Generating Your Masterpiece...
                  </h3>
                  <p className="text-gray-500">
                    This may take a few moments. Good things come to those who wait!
                  </p>
                </div>
              ) : result ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {modelImage && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-center text-gray-700">Original Model</h3>
                        <ImagePreview
                          src={modelImage.preview || `data:image/jpeg;base64,${modelImage.base64}`}
                          alt="Original Model"
                          showControls={false}
                        />
                      </div>
                    )}
                    {garmentImage && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-center text-gray-700">Garment</h3>
                        <ImagePreview
                          src={garmentImage.preview || `data:image/jpeg;base64,${garmentImage.base64}`}
                          alt="Garment"
                          showControls={false}
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-center text-gray-700">Result</h3>
                      <div className="rounded-2xl overflow-hidden shadow-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`data:image/png;base64,${result.result_image}`}
                          alt="Virtual try-on result"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button onClick={handleDownload} className="btn btn-primary">
                      <Download className="w-5 h-5 mr-2" />
                      Download
                    </button>
                    <button onClick={handleReset} className="btn btn-outline">
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Start Over
                    </button>
                  </div>
                </div>
              ) : (
                 <div className="text-center py-16">
                  <h3 className="text-xl font-semibold text-text-dark mb-2">
                    No Result Yet
                  </h3>
                  <p className="text-text-medium mb-6">
                    Something went wrong. Please try generating the result again.
                  </p>
                  <button
                    onClick={() => setCurrentStep('garment')}
                    className="btn btn-primary btn-lg"
                  >
                    Go Back
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Floating Navigation Dock */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <NavigationPills 
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={(step) => setCurrentStep(step as Step)}
        />
      </div>
    </div>
  );
}
