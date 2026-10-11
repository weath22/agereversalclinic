/**
 * Treatment Cart Store & Persistence Layer
 * Handles localStorage synchronization, cross-tab events, financial totals,
 * session aggregations, and course package savings computations.
 */

import { TreatmentCartItem, TreatmentTotals } from '../types/treatmentCart';
import { TreatmentPricingItem, PricingPackage } from '../data/treatmentPricing';

export const TREATMENT_CART_STORAGE_KEY = 'arc_clinic_treatment_cart_v1';
export const TREATMENT_CART_UPDATED_EVENT = 'arc_treatment_cart_updated';

/**
 * Generate a unique and stable ID for a treatment + package combination
 */
export function generateTreatmentCartItemId(treatmentId: string, packageId: string): string {
  return `${treatmentId}__${packageId}`;
}

/**
 * Loads treatment cart items safely from localStorage
 */
export function loadTreatmentCartFromStorage(): TreatmentCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TREATMENT_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        item => item && item.treatment && item.selectedPackage && typeof item.quantity === 'number'
      );
    }
    return [];
  } catch (err) {
    console.error('[TreatmentCartStore] Error loading treatment cart from storage:', err);
    return [];
  }
}

/**
 * Saves treatment cart to localStorage and broadcasts the update event
 */
export function saveTreatmentCartToStorage(cart: TreatmentCartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TREATMENT_CART_STORAGE_KEY, JSON.stringify(cart));
    broadcastTreatmentCartUpdated(cart);
  } catch (err) {
    console.error('[TreatmentCartStore] Error saving treatment cart to storage:', err);
  }
}

/**
 * Broadcast custom event for in-window sync across tabs, drawers, and headers
 */
export function broadcastTreatmentCartUpdated(cart: TreatmentCartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const event = new CustomEvent(TREATMENT_CART_UPDATED_EVENT, { detail: { cart } });
    window.dispatchEvent(event);
  } catch {
    // Ignore in non-browser runtimes
  }
}

/**
 * Compute total item and course counts
 */
export function calculateTotalTreatmentCount(cart: TreatmentCartItem[]): number {
  return cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
}

/**
 * Calculates comprehensive financial breakdown:
 * - Subtotal: sum of package prices * quantity
 * - Total Sessions: aggregated across all booked single sessions & multi-session courses
 * - Total Savings: calculates bundle discount savings by comparing course price against single session rate
 */
export function calculateTreatmentTotals(cart: TreatmentCartItem[]): TreatmentTotals {
  let subtotal = 0;
  let totalSessions = 0;
  let totalSavings = 0;

  for (const item of cart) {
    const qty = Math.max(1, item.quantity || 1);
    const pkgPrice = item.selectedPackage?.price || 0;
    const pkgSessions = Math.max(1, item.selectedPackage?.sessions || 1);

    subtotal += pkgPrice * qty;
    totalSessions += pkgSessions * qty;

    // Check if this treatment has a single baseline session to compute course savings
    const singlePackage = item.treatment?.packages?.find(p => p.sessions === 1);
    if (singlePackage && pkgSessions > 1) {
      const fullPriceIfIndividual = singlePackage.price * pkgSessions;
      const actualPrice = pkgPrice;
      const courseSaving = Math.max(0, fullPriceIfIndividual - actualPrice);
      totalSavings += courseSaving * qty;
    } else if (item.selectedPackage?.savingsBadge) {
      // Attempt parse from badge if available (e.g. "Save £200")
      const match = item.selectedPackage.savingsBadge.match(/£?([0-9,]+)/);
      if (match) {
        const val = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(val)) totalSavings += val * qty;
      }
    }
  }

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalSessions,
    totalSavings: Math.round(totalSavings * 100) / 100,
    itemCount: calculateTotalTreatmentCount(cart),
    currency: cart[0]?.treatment?.currency || '£'
  };
}

/**
 * Helper to construct a new TreatmentCartItem
 */
export function createTreatmentCartItem(
  treatment: TreatmentPricingItem,
  selectedPackage: PricingPackage,
  quantity: number = 1,
  customNotes?: string,
  preferredLocation?: string
): TreatmentCartItem {
  return {
    id: generateTreatmentCartItemId(treatment.id, selectedPackage.id),
    treatment,
    selectedPackage,
    quantity: Math.max(1, quantity),
    customNotes,
    preferredLocation,
    addedAt: new Date().toISOString()
  };
}
