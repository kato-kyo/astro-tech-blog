import { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  sizes?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  width = 400,
  height = 300,
  loading = 'lazy',
  sizes,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 画像の初期状態をチェックし、既に失敗している場合は即座にエラー状態にする
    const img = document.querySelector<HTMLImageElement>(`img[src="${src}"]`);
    if (img && img.complete && img.naturalWidth === 0) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // タイムアウトで画像読み込みの最大時間を制限（5秒）
    const timeout = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [src, isLoading]);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Create className with conditional hover effects
  const getImageClassName = () => {
    let baseClassName = className;

    // Only add hover effects when not loading and no error
    if (!isLoading && !hasError && className.includes('object-cover')) {
      baseClassName += ' hover:scale-105 transition-transform duration-300';
    }

    // Add positioning classes for loading placeholder overlay
    if (isLoading) {
      baseClassName += ' absolute top-0 left-0';
    }

    return baseClassName;
  };

  // Static placeholder component for when image fails to load
  const StaticPlaceholder = () => (
    <div
      className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
      style={{ width: width || '100%', height: height || 'auto' }}
    >
      <div className="text-center p-4">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          画像を読み込めませんでした
        </p>
      </div>
    </div>
  );

  // Loading placeholder - only animate when actually loading
  const LoadingPlaceholder = () => (
    <div
      className={`w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center ${isLoading ? 'animate-pulse' : ''}`}
      style={{ width: width || '100%', height: height || 'auto' }}
    >
      <svg
        className="h-8 w-8 text-gray-400 dark:text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );

  // Normal image loading
  return (
    <div className="relative">
      {isLoading && <LoadingPlaceholder />}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          className={getImageClassName()}
          width={width}
          height={height}
          loading={loading}
          sizes={sizes}
          onError={handleError}
          onLoad={handleLoad}
          style={
            isLoading
              ? { opacity: 0, transition: 'opacity 0.3s ease-in-out' }
              : { opacity: 1, transition: 'none' }
          }
        />
      )}
      {hasError && !isLoading && <StaticPlaceholder />}
    </div>
  );
}
