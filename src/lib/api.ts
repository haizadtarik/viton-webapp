import { TryOnRequest, TryOnResponse, APIError } from '@/types';
import { API_CONFIG } from './constants';

// Interface for the raw backend response
interface RawTryOnResponse {
  images_base64: string[];
  error: string;
}

class TryOnAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_TRYON_API_ENDPOINT || '';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Use simple headers that don't trigger CORS preflight
    const config: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new APIError('Request timeout. Please try again.');
        }
        
        // Network or other errors
        throw new APIError(
          error.message || 'Network error. Please check your connection.'
        );
      }
      
      throw new APIError('An unexpected error occurred.');
    }
  }

  /**
   * Generate virtual try-on result
   */
  async generateTryOn(request: TryOnRequest): Promise<TryOnResponse> {
    if (!this.baseURL) {
      throw new APIError('API endpoint not configured. Please check your environment variables.');
    }

    const response = await this.makeRequest<RawTryOnResponse>('/viton', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check for errors in the response
    if (response.error) {
      throw new APIError(response.error);
    }

    // Check if we have images in the response
    if (!response.images_base64 || response.images_base64.length === 0) {
      throw new APIError('No images returned from the API. Response: ' + JSON.stringify(response));
    }

    // Transform the response to match our expected format
    // Use the first image from the array
    const transformedResponse: TryOnResponse = {
      result_image: response.images_base64[0],
      success: true,
      message: 'Try-on generated successfully'
    };

    return transformedResponse;
  }

}

// Create singleton instance
export const tryOnAPI = new TryOnAPI();

// Utility function for retry logic
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries: number = API_CONFIG.RETRY_ATTEMPTS
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
};

// Wrapper for the main try-on function with retry logic
export const generateTryOnWithRetry = async (
  modelImage: string,
  garmentImage: string,
  options?: {
    prompt?: string;
    n_samples?: number;
    n_steps?: number;
    image_scale?: number;
    seed?: number;
  }
): Promise<TryOnResponse> => {
  return withRetry(() =>
    tryOnAPI.generateTryOn({
      model_image_base64: modelImage,
      garment_image_base64: garmentImage,
      prompt: options?.prompt || "",
      n_samples: options?.n_samples || 1,
      n_steps: options?.n_steps || 20,
      image_scale: options?.image_scale || 2,
      seed: options?.seed || -1,
    })
  );
};

// Type guard for API errors
export const isAPIError = (error: unknown): error is APIError => {
  return error instanceof Error && 'status' in error;
};
