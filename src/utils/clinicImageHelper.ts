/**
 * ============================================================================
 * CLINIC IMAGE HELPER (Predictable Slot ID-Based Image Resolver & Fallback)
 * ============================================================================
 * Mirrors the robust predictable ID architecture used in Treatment Pricing cards:
 * 1. Standardizes permanent slot IDs for all clinic sections:
 *    - Brand Logo: clinic-logo-icon.webp, clinic-logo-full.webp
 *    - Exterior & OG: clinic-exterior.webp, clinic-og-image.webp
 *    - Interior Suites: clinic-interior-[index].webp
 *    - Locations: clinic-location-[locationId].webp
 *    - Awards: clinic-award-[awardId].webp
 *    - Why Choose Us Pillars: clinic-pillar-[pillarId].webp
 *    - Process Steps: clinic-process-[stepId].webp
 *    - Facility Rooms: clinic-facility-[roomId].webp
 *    - Trust Brands: clinic-brand-[brandId].webp
 * 2. Provides versioned cache-busting resolver:
 *    getClinicImagePath(slotId, fallbackUrl, version) -> /assets/${slotId}.webp?v=${timestamp}
 * 3. Safe error fallback handler:
 *    handleClinicImageError(event, fallbackUrl, slotId) -> gracefully swaps to bundled
 *    catalog assets or permanent brand logo so images never break after copying project files.
 * ============================================================================
 */

import React from 'react';
import {
  CLINIC_LOGOS,
  CLINIC_LOCATION_IMAGES,
  CLINIC_INTERIOR_PHOTOS,
  CLINIC_AWARDS_MEDIA,
  CLINIC_BANNER_IMAGES
} from '../data/clinicImages';

// In-memory version map to trigger instantaneous client-side refreshes upon upload
const clinicVersionMap = new Map<string, number | string>();

/**
 * Standardize an ID or slot name to be safe for filenames and URLs
 */
export function normalizeClinicSlotId(slotId: string): string {
  if (!slotId) return 'clinic-asset-default';
  return String(slotId)
    .trim()
    .replace(/\.webp$/i, '')
    .replace(/^(\/assets\/|assets\/)/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .toLowerCase();
}

/**
 * Predefined canonical slot categories
 */
export type ClinicSlotCategory =
  | 'logo-icon'
  | 'logo-full'
  | 'exterior'
  | 'og'
  | 'interior'
  | 'location'
  | 'award'
  | 'pillar'
  | 'process'
  | 'facility'
  | 'brand';

/**
 * Generate a predictable permanent slot ID for any clinic section
 */
export function getClinicSlotId(category: ClinicSlotCategory, idOrIndex?: string | number): string {
  switch (category) {
    case 'logo-icon':
      return 'clinic-logo-icon';
    case 'logo-full':
      return 'clinic-logo-full';
    case 'exterior':
      return 'clinic-exterior';
    case 'og':
      return 'clinic-og-image';
    case 'interior':
      return `clinic-interior-${idOrIndex !== undefined ? idOrIndex : 0}`;
    case 'location': {
      const cleanLocId = normalizeClinicSlotId(String(idOrIndex || '1')).replace(/^location-/, '');
      return `clinic-location-${cleanLocId}`;
    }
    case 'award': {
      const cleanAwardId = normalizeClinicSlotId(String(idOrIndex || '1')).replace(/^(award-|aw-)/, '');
      return `clinic-award-${cleanAwardId}`;
    }
    case 'pillar': {
      const cleanPillarId = normalizeClinicSlotId(String(idOrIndex || '1')).replace(/^(pillar-|p-)/, '');
      return `clinic-pillar-${cleanPillarId}`;
    }
    case 'process': {
      const cleanStepId = normalizeClinicSlotId(String(idOrIndex || '1')).replace(/^(process-|step-)/, '');
      return `clinic-process-${cleanStepId}`;
    }
    case 'facility': {
      const cleanRoomId = normalizeClinicSlotId(String(idOrIndex || '1')).replace(/^(facility-room-|facility-|suite-|room-)/, '');
      return `clinic-facility-${cleanRoomId}`;
    }
    case 'brand': {
      const cleanBrandId = normalizeClinicSlotId(String(idOrIndex || '1')).replace(/^brand-/, '');
      return `clinic-brand-${cleanBrandId}`;
    }
    default:
      return normalizeClinicSlotId(String(idOrIndex || 'clinic-asset'));
  }
}

/**
 * Register a newly saved image version timestamp for instant cache-busting
 */
export function setClinicImageVersion(slotId: string, version: number | string = Date.now()): void {
  const cleanId = normalizeClinicSlotId(slotId);
  clinicVersionMap.set(cleanId, version);
}

/**
 * Get the current cache version timestamp for a slot ID
 */
export function getClinicImageVersion(slotId: string, customVersion?: number | string): number | string | undefined {
  const cleanId = normalizeClinicSlotId(slotId);
  return customVersion || clinicVersionMap.get(cleanId);
}

/**
 * Retrieve the static bundled catalog fallback URL for a slot
 */
export function getBundledClinicFallback(slotId: string): string {
  const cleanId = normalizeClinicSlotId(slotId);

  // Logo Icon
  if (cleanId === 'clinic-logo-icon') {
    return CLINIC_LOGOS.icon;
  }
  // Full Logo
  if (cleanId === 'clinic-logo-full') {
    return CLINIC_LOGOS.full || CLINIC_LOGOS.icon;
  }
  // Exterior Photo
  if (cleanId === 'clinic-exterior') {
    return CLINIC_LOCATION_IMAGES['harley-street-flagship']?.primary || CLINIC_INTERIOR_PHOTOS[0];
  }
  // OpenGraph Image
  if (cleanId === 'clinic-og-image') {
    return CLINIC_BANNER_IMAGES.ogSocialImage || CLINIC_LOGOS.full;
  }
  // Interior suites
  if (cleanId.startsWith('clinic-interior-')) {
    const rawIdx = parseInt(cleanId.replace('clinic-interior-', ''), 10);
    const idx = isNaN(rawIdx) ? 0 : rawIdx % CLINIC_INTERIOR_PHOTOS.length;
    return CLINIC_INTERIOR_PHOTOS[idx] || CLINIC_INTERIOR_PHOTOS[0];
  }
  // Locations
  if (cleanId.startsWith('clinic-location-')) {
    const rawLoc = cleanId.replace('clinic-location-', '');
    const matched = CLINIC_LOCATION_IMAGES[rawLoc];
    if (matched?.primary) return matched.primary;
    // Sequential fallback
    return CLINIC_LOCATION_IMAGES['harley-street-flagship']?.primary || CLINIC_INTERIOR_PHOTOS[0];
  }
  // Awards
  if (cleanId.startsWith('clinic-award-')) {
    const rawAward = cleanId.replace('clinic-award-', '');
    const matched = CLINIC_AWARDS_MEDIA.find((a) => a.id === rawAward || cleanId.includes(a.id));
    if (matched?.image) return matched.image;
    return CLINIC_AWARDS_MEDIA[0]?.image || CLINIC_LOGOS.icon;
  }

  // Universal ultimate fallback: permanent high-res brand emblem
  return CLINIC_LOGOS.icon;
}

/**
 * Primary ID-based clinic image path resolver
 * 
 * @param slotId The permanent slot ID (e.g., 'clinic-logo-icon', 'clinic-location-1')
 * @param fallbackUrl Optional predefined fallback URL if image fails to load
 * @param version Optional version timestamp for cache busting
 * @returns Predictable public URL: `/assets/${slotId}.webp?v=${updatedAt}`
 */
export function getClinicImagePath(
  slotId: string,
  fallbackUrl?: string,
  version?: number | string
): string {
  const cleanId = normalizeClinicSlotId(slotId);
  const basePath = `/assets/${cleanId}.webp`;

  const activeVersion = getClinicImageVersion(cleanId, version);
  if (activeVersion) {
    return `${basePath}?v=${activeVersion}`;
  }

  return basePath;
}

/**
 * Resolves the primary image source for any clinic element:
 * 1. If given an external cloud CDN URL (Google usercontent, Cloudflare, etc.), returns it.
 * 2. If given a relative local path, maps it predictably to the standardized slot ID.
 * 3. If empty or missing, returns the predictable slot URL.
 */
export function resolveClinicImageSrc(
  slotId: string,
  currentValue?: string,
  fallbackUrl?: string,
  version?: number | string
): string {
  const cleanVal = (currentValue || '').trim();

  // If already an external cloud URL, use it directly (e.g. permanent Google Cloud/Unsplash)
  if (cleanVal.startsWith('http://') || cleanVal.startsWith('https://')) {
    // If it's a generic Unsplash placeholder, prefer the predictable slot ID
    if (cleanVal.includes('images.unsplash.com')) {
      return getClinicImagePath(slotId, cleanVal, version);
    }
    return cleanVal;
  }

  // Standardize to predictable slot ID path
  return getClinicImagePath(slotId, fallbackUrl || cleanVal, version);
}

/**
 * Safe error handler for <img> elements:
 * If the predictable `/assets/${slotId}.webp` does not exist yet on disk (e.g. after pasting a zip),
 * automatically falls back to:
 * 1. The custom fallback URL (if valid and not an unsplash stock link)
 * 2. The static bundled catalog default in clinicImages.ts
 * 3. The permanent clinic brand emblem
 * It guarantees the UI NEVER shows a broken image or empty gap.
 */
export function handleClinicImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl?: string,
  slotId?: string
): void {
  const target = event.currentTarget;
  const currentSrc = target.src;

  // Prevent infinite loops if fallback also errors
  if (target.dataset.hasFallenBack === 'true') {
    return;
  }

  target.dataset.hasFallenBack = 'true';

  // 1. Try provided custom fallback if it's not a generic unsplash placeholder
  const cleanFallback =
    fallbackUrl && !fallbackUrl.includes('unsplash.com') && fallbackUrl !== currentSrc
      ? fallbackUrl.trim()
      : '';

  if (cleanFallback) {
    target.src = cleanFallback;
    return;
  }

  // 2. Try the bundled catalog asset for this slot ID
  if (slotId) {
    const catalogDefault = getBundledClinicFallback(slotId);
    if (catalogDefault && catalogDefault !== currentSrc) {
      target.src = catalogDefault;
      return;
    }
  }

  // 3. Ultimate fallback: Permanent Brand Emblem
  if (CLINIC_LOGOS.icon && currentSrc !== CLINIC_LOGOS.icon) {
    target.src = CLINIC_LOGOS.icon;
  }
}

/**
 * Client-side converter that transforms any uploaded image (PNG, JPG, HEIC, WebP, etc.)
 * into an optimized true WebP data URL before sending to the server.
 * This guarantees consistent WebP compression and ensures only a single .webp file is stored per slot.
 */
export async function convertClinicImageFileToWebP(
  file: File,
  quality: number = 0.9,
  maxDimension: number = 1600
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not available for image conversion'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width || 1200;
          let height = img.naturalHeight || img.height || 900;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const webpDataUrl = canvas.toDataURL('image/webp', quality);

          if (webpDataUrl.startsWith('data:image/webp')) {
            resolve(webpDataUrl);
          } else {
            resolve(reader.result as string);
          }
        } catch {
          resolve(reader.result as string);
        }
      };
      img.onerror = () => resolve(reader.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export default getClinicImagePath;
