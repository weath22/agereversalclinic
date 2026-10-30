import React, { useState, useEffect, useRef } from 'react';
import { LogoOutlineSkeleton, LogoSkeletonSize } from './LogoOutlineSkeleton';
import { getClinicData } from '../../lib/adminStore';
import { CLINIC_LOGOS } from '../../data/clinicImages';
import { resolveClinicImageSrc } from '../../utils/clinicImageHelper';

export interface ClinicImageWithPlaceholderProps {
  /**
   * The target image URL (predictable slot path or external URL)
   */
  src?: string;
  /**
   * Accessible alt description
   */
  alt: string;
  /**
   * Optional title tooltip
   */
  title?: string;
  /**
   * Classes applied directly to the <img> element
   */
  className?: string;
  /**
   * Classes applied to the containing box
   */
  containerClassName?: string;
  /**
   * Optional permanent clinic slot ID (e.g. 'clinic-location-1', 'clinic-interior-0')
   */
  slotId?: string;
  /**
   * Size of the brand logo placeholder when loading or on missing/404 image
   */
  logoSize?: LogoSkeletonSize | number;
  /**
   * Whether to show "Age Reversal Clinics" wordmark beneath the brand emblem on error
   */
  showBrandText?: boolean;
  /**
   * Optional custom brand subtext label beneath the emblem
   */
  brandSubtext?: string;
  /**
   * Explicit override URL for the brand logo placeholder
   */
  brandLogoUrl?: string;
  /**
   * Optional safe fallback image URL before giving up to brand logo
   */
  fallbackUrl?: string;
  /**
   * Native img loading mode ('lazy' | 'eager')
   */
  loading?: 'lazy' | 'eager';
  /**
   * Optional click handler
   */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * Container inline styles
   */
  style?: React.CSSProperties;
  /**
   * Image inline styles
   */
  imgStyle?: React.CSSProperties;
  /**
   * Fetch priority
   */
  fetchPriority?: 'high' | 'low' | 'auto';
  /**
   * Children overlay elements (e.g. gradient scrims, badges, buttons)
   */
  children?: React.ReactNode;
}

/**
 * ClinicImageWithPlaceholder
 * ============================================================================
 * Production image component designed to match the Pricing Cards architecture:
 * 1. Loading State: Displays the exact clinic brand logo placeholder with subtle ambient glow.
 * 2. 404 / Missing State: On server 404 or missing asset, immediately halts loading and
 *    displays the exact Age Reversal Clinic brand logo placeholder.
 * 3. Loaded State: Smooth fade-in of the photograph with GPU-acceleration.
 * 4. Zero dummy AI or Unsplash placeholders: Always displays the clinic's authentic brand mark.
 * ============================================================================
 */
export const ClinicImageWithPlaceholder: React.FC<ClinicImageWithPlaceholderProps> = ({
  src,
  alt,
  title,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative w-full h-full overflow-hidden bg-luxury-secondary flex items-center justify-center',
  slotId,
  logoSize = 'md',
  showBrandText = false,
  brandSubtext,
  brandLogoUrl: customBrandLogoUrl,
  fallbackUrl,
  loading = 'lazy',
  onClick,
  style,
  imgStyle,
  fetchPriority = 'auto',
  children,
}) => {
  // Compute initial resolved image path: if rawSrc is empty/cleared, return "" immediately
  const resolveTargetSrc = (rawSrc?: string, targetSlotId?: string): string => {
    const cleanSrc = (rawSrc ?? '').trim();
    if (!cleanSrc) {
      return '';
    }
    if (targetSlotId) {
      return resolveClinicImageSrc(targetSlotId, cleanSrc);
    }
    return cleanSrc;
  };

  const initialSrc = resolveTargetSrc(src, slotId);
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(!initialSrc);
  const [triedFallback, setTriedFallback] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Sync state whenever src or slotId changes
  useEffect(() => {
    const nextSrc = resolveTargetSrc(src, slotId);
    setCurrentSrc(nextSrc);
    setIsLoaded(false);
    setTriedFallback(false);
    setHasError(!nextSrc);
  }, [src, slotId]);

  // Check if image is already cached/complete in memory
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [currentSrc]);

  // Determine the exact brand logo URL to use for the placeholder
  const clinicData = getClinicData();
  const exactBrandLogo =
    customBrandLogoUrl ||
    clinicData?.logo?.icon ||
    clinicData?.logo?.full ||
    CLINIC_LOGOS.icon;

  const handleImageError = () => {
    // If a valid non-unsplash custom fallback exists and hasn't been tried yet, try it once
    const cleanFallback = (fallbackUrl || '').trim();
    const canTryFallback =
      cleanFallback &&
      !cleanFallback.includes('unsplash.com') &&
      !triedFallback &&
      cleanFallback !== currentSrc;

    if (canTryFallback) {
      setTriedFallback(true);
      setCurrentSrc(cleanFallback);
      return;
    }

    // Server returned 404 or image file is missing: immediately activate exact brand logo placeholder
    setHasError(true);
  };

  return (
    <div
      className={containerClassName}
      style={style}
      onClick={onClick}
    >
      {/* 1. Exact Brand Logo Preloader (displayed while image is downloading) */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          <LogoOutlineSkeleton
            size={logoSize}
            variant="gold"
            animate={true}
            logoUrl={exactBrandLogo}
          />
        </div>
      )}

      {/* 2. Exact Brand Logo Placeholder (displayed if file is missing, 404'd, or failed) */}
      {hasError && (
        <div className="w-full h-full flex items-center justify-center p-3 text-center z-0 pointer-events-none">
          <LogoOutlineSkeleton
            size={logoSize}
            variant="gold"
            animate={false}
            showText={showBrandText}
            text={brandSubtext}
            logoUrl={exactBrandLogo}
          />
        </div>
      )}

      {/* 3. True Clinical Photograph (rendered only when an image source exists and hasn't failed) */}
      {!hasError && currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          title={title}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          className={`${className} transition-opacity duration-500 transform-gpu ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: 'translateZ(0)', ...imgStyle }}
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={handleImageError}
        />
      )}

      {/* 4. Child Overlays (Badges, buttons, title overlays, gradient scrims) */}
      {children}
    </div>
  );
};

export default ClinicImageWithPlaceholder;
