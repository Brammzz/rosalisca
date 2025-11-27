import React, { useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  loading?: 'lazy' | 'eager';
  quality?: number;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = '/images/placeholder.svg',
  loading = 'lazy',
  quality = 80,
  width,
  height,
  onLoad,
  onError
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setImageError(true);
    onError?.();
  }, [onError]);

  // Optimize image URL based on environment
  const getOptimizedSrc = (originalSrc: string) => {
    if (!originalSrc) return placeholder;
    
    // If already optimized URL or external URL, return as is
    if (originalSrc.startsWith('http') || originalSrc.includes('?')) {
      return originalSrc;
    }

    // Add optimization parameters for local images
    const params = new URLSearchParams();
    if (quality) params.append('q', quality.toString());
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());

    return params.toString() ? `${originalSrc}?${params}` : originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(src);
  const displaySrc = imageError ? placeholder : optimizedSrc;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Loading state */}
      {!imageLoaded && !imageError && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
      
      {/* Main image */}
      <img
        src={displaySrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        loading={loading}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />
    </div>
  );
};

export default OptimizedImage;
