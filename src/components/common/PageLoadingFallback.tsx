import React from 'react';
import { LogoOutlineSkeleton } from './LogoOutlineSkeleton';

interface PageLoadingFallbackProps {
  message?: string;
  subMessage?: string;
}

export const PageLoadingFallback: React.FC<PageLoadingFallbackProps> = ({
  message = 'Loading Clinical Experience...',
  subMessage = 'Preparing authentic Harley Street aesthetic protocols & verified data'
}) => {
  return (
    <div 
      className="min-h-[65vh] w-full flex flex-col items-center justify-center p-8 bg-silver-50/50"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="relative flex items-center justify-center mb-4">
        <LogoOutlineSkeleton size="lg" variant="gold" animate={true} />
      </div>

      {/* Typography */}
      <h3 className="text-silver-900 font-serif font-light text-lg md:text-xl tracking-wide text-center">
        {message}
      </h3>
      <p className="text-silver-700 font-sans text-xs md:text-sm tracking-normal text-center mt-1.5 max-w-md">
        {subMessage}
      </p>

      {/* Subtle micro progress indicator */}
      <div className="w-36 h-0.5 bg-silver-200 rounded-full overflow-hidden mt-5">
        <div className="w-full h-full bg-gradient-to-r from-rose-gold/40 via-rose-gold to-rose-gold/40 animate-[pulse_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  );
};

export default PageLoadingFallback;
