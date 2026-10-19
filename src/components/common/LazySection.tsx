import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  id?: string;
  alternateIds?: string[];
  className?: string;
  minHeight?: string | number;
  rootMargin?: string;
  placeholder?: ReactNode;
  contentLabel?: string;
}

/**
 * High-performance viewport-based lazy hydration wrapper (Phase 2, Task 2.1)
 * Defers mounting heavy DOM subtrees, images, scripts, and video players
 * until the user scrolls within 200px–300px of the section.
 */
export const LazySection: React.FC<LazySectionProps> = ({
  children,
  id,
  alternateIds = [],
  className = '',
  minHeight = '350px',
  rootMargin = '250px 0px',
  placeholder,
  contentLabel
}) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If already hydrated, nothing to observe
    if (isHydrated) return;

    const matchesHash = (hash: string) => {
      const cleanHash = hash.replace('#', '').toLowerCase();
      if (!cleanHash) return false;
      if (id && cleanHash === id.toLowerCase()) return true;
      if (alternateIds.some(alt => alt.toLowerCase() === cleanHash)) return true;
      if (id === 'locations' && (cleanHash === 'preferred-consultation' || cleanHash === 'contact' || cleanHash === 'book' || cleanHash === 'appointment')) return true;
      if (id === 'news' && (cleanHash === 'latest-news' || cleanHash === 'journal')) return true;
      if (id === 'gallery' && (cleanHash === 'transformations' || cleanHash === 'before-after' || cleanHash === 'cases')) return true;
      if (id === 'facility' && (cleanHash === 'interiors' || cleanHash === 'tour')) return true;
      if (id === 'testimonials' && (cleanHash === 'reviews' || cleanHash === 'stories')) return true;
      if (id === 'social-videos' && (cleanHash === 'videos' || cleanHash === 'reels')) return true;
      if (id === 'awards' && (cleanHash === 'recognition' || cleanHash === 'accreditations')) return true;
      return false;
    };

    // Check if the current URL hash directly matches this section ID or nested IDs
    if (typeof window !== 'undefined' && window.location.hash && matchesHash(window.location.hash)) {
      setIsHydrated(true);
      return;
    }

    // Fallback if IntersectionObserver is not supported in environment
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsHydrated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsHydrated(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0.01
      }
    );

    const currentElem = containerRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    // Listen for global hashchange or programmatic scroll triggers
    const handleHashOrNav = () => {
      if (typeof window !== 'undefined' && window.location.hash && matchesHash(window.location.hash)) {
        setIsHydrated(true);
      }
    };

    window.addEventListener('hashchange', handleHashOrNav);
    window.addEventListener('scroll_to_section', handleHashOrNav);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', handleHashOrNav);
      window.removeEventListener('scroll_to_section', handleHashOrNav);
    };
  }, [id, isHydrated, rootMargin]);

  const heightStyle = typeof minHeight === 'number' ? `${minHeight}px` : minHeight;

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative w-full ${className}`}
      style={{
        minHeight: isHydrated ? undefined : heightStyle,
        contentVisibility: 'auto',
        containIntrinsicSize: isHydrated ? undefined : heightStyle
      }}
    >
      {isHydrated ? (
        children
      ) : (
        placeholder || (
          <div 
            className="w-full flex items-center justify-center bg-[#faf9f8]/60 transition-opacity duration-300"
            style={{ minHeight: heightStyle }}
            role="presentation"
            aria-hidden="true"
          >
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="w-8 h-8 rounded-full border border-rose-gold/30 border-t-rose-gold animate-spin mb-3 opacity-60" />
              {contentLabel && (
                <span className="text-xs uppercase tracking-widest text-silver-600 font-sans font-medium">
                  {contentLabel}
                </span>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default LazySection;
