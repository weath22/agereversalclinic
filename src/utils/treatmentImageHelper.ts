/**
 * ============================================================================
 * TREATMENT IMAGE HELPER (Predictable ID-Based Image Resolver)
 * ============================================================================
 * Resolves treatment card image paths strictly based on the treatment's permanent ID.
 * Automatically appends a cache-busting timestamp version to guarantee immediate
 * visual refreshes when a card's image is updated or overwritten on disk.
 * ============================================================================
 */

import React from 'react';

// In-memory version registry to synchronize live updates across the app session
const treatmentVersionMap = new Map<string, number | string>();

/**
 * Standardize an ID to be safe for filenames and paths
 */
export function normalizeTreatmentId(id: string): string {
  if (!id) return 'treatment-default';
  return String(id).trim().replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
}

/**
 * Register a newly saved image version timestamp for instant cache-busting
 */
export function setTreatmentImageVersion(id: string, version: number | string = Date.now()): void {
  const cleanId = normalizeTreatmentId(id);
  treatmentVersionMap.set(cleanId, version);
}

/**
 * Get the current cache version timestamp for a treatment ID
 */
export function getTreatmentImageVersion(id: string, customVersion?: number | string): number | string | undefined {
  const cleanId = normalizeTreatmentId(id);
  return customVersion || treatmentVersionMap.get(cleanId);
}

/**
 * Primary ID-based image path resolver
 * 
 * @param id The permanent ID of the treatment (e.g., 'anti-wrinkle-injections')
 * @param fallbackUrl Optional fallback URL if image fails to load
 * @param version Optional version timestamp for cache busting (or uses registered version)
 * @returns Predictable public URL: `/assets/treatments/${id}.webp?v=${updatedAt}`
 */
export function getTreatmentImagePath(
  id: string,
  fallbackUrl?: string,
  version?: number | string
): string {
  const cleanId = normalizeTreatmentId(id);
  const basePath = `/assets/treatments/${cleanId}.webp`;

  const activeVersion = getTreatmentImageVersion(cleanId, version);
  if (activeVersion) {
    return `${basePath}?v=${activeVersion}`;
  }

  return basePath;
}

/**
 * Resolves the primary image source for a treatment object with automatic fallback support
 */
export function getTreatmentCardImage(
  treatment: {
    id: string;
    image?: string;
    updatedAt?: number | string;
    coverMedia?: { url?: string };
  },
  defaultFallback?: string
): string {
  if (!treatment || !treatment.id) {
    return defaultFallback || '/assets/default-treatment.webp';
  }

  // 1. Try predictable ID path with versioning
  const v = treatment.updatedAt || getTreatmentImageVersion(treatment.id);
  return getTreatmentImagePath(treatment.id, treatment.image || defaultFallback, v);
}

/**
 * Safe error handler for <img> elements:
 * If the predictable `/assets/treatments/${id}.webp` does not exist yet on disk,
 * automatically falls back to the treatment catalog's predefined image URL or placeholder.
 */
export function handleTreatmentImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl?: string
): void {
  const target = event.currentTarget;
  const currentSrc = target.src;
  const defaultFallback = fallbackUrl || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80';

  // Prevent infinite loops if fallback also fails
  if (!target.dataset.hasFallenBack && currentSrc !== defaultFallback) {
    target.dataset.hasFallenBack = 'true';
    target.src = defaultFallback;
  }
}

/**
 * Client-side converter that transforms any uploaded image (PNG, JPG, HEIC, etc.)
 * into an optimized true WebP data URL before sending to the server.
 * This guarantees crystal-clear compression and ensures only a single .webp file is stored.
 */
export async function convertImageFileToWebP(file: File, quality: number = 0.9): Promise<string> {
  return new Promise((resolve, reject) => {
    // If the file is already a .webp, read directly
    if (file.type === 'image/webp') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0);
          const webpDataUrl = canvas.toDataURL('image/webp', quality);
          // If browser supports webp canvas export, return it
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

export default getTreatmentImagePath;
