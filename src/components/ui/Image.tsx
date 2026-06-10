import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import { ImageService } from '../../shared/lib/image/ImageService';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: 'speaker' | 'venue' | 'default';
  category?: string;
  containerClassName?: string;
  fallbackUrl?: string; // Kept for backwards compatibility
  src?: string;
  alt?: string;
  className?: string;
}

export function Image({ 
  src, 
  alt, 
  className, 
  containerClassName, 
  fallbackType,
  category,
  fallbackUrl,
  ...props 
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Determine fallback image based on props
  let resolvedFallback = fallbackUrl || ImageService.getFallbackImage(category);
  if (fallbackType === 'speaker') resolvedFallback = ImageService.getSpeakerImage('');
  else if (fallbackType === 'venue') resolvedFallback = ImageService.getVenueImage('');

  // Directly use the source url, if it fails, use fallback URL
  const finalSrc = error ? resolvedFallback : (src || resolvedFallback);

  return (
    <div className={cn("relative overflow-hidden bg-gray-900 w-full h-full flex flex-col", containerClassName)}>
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-3xl z-0">
           <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
        </div>
      )}
      <img
        src={finalSrc}
        alt={alt || ''}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-700 absolute inset-0",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!error) {
            setError(true);
            setLoaded(false); // reset loaded state for fallback
          }
        }}
        loading="lazy"
        {...props}
      />
    </div>
  );
}
