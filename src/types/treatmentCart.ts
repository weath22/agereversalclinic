/**
 * Treatment Cart & Clinical Treatment Plan Data Models
 * Defines data structures for planned medical treatments, package courses,
 * session calculations, and consultation preferences.
 */

import { TreatmentPricingItem, PricingPackage } from '../data/treatmentPricing';

export interface TreatmentCartItem {
  id: string; // Unique cart item ID (e.g. `${treatment.id}-${package.id}`)
  treatment: TreatmentPricingItem;
  selectedPackage: PricingPackage;
  quantity: number; // Number of patients/courses booked
  customNotes?: string;
  preferredLocation?: string;
  addedAt: string; // ISO date string
}

export interface TreatmentTotals {
  subtotal: number;
  totalSessions: number;
  totalSavings: number;
  itemCount: number;
  currency: string;
}
