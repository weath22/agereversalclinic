/**
 * ============================================================================
 * CLINIC MASTER IMAGE & MEDIA REGISTRY
 * ============================================================================
 * Dedicated configuration file for all clinic visual assets:
 * - Brand logos & emblems
 * - Clinic location facades & entrance photos
 * - Interior consultation suites & treatment rooms
 * - Medical award trophies & badges
 * - OpenGraph and social sharing preview imagery
 * ============================================================================
 */

import clinicDevonshire from '../assets/images/clinic/locations/devonshire_place.jpg';
import clinicHarleyStreet from '../assets/images/clinic/locations/harley_street_flagship.jpg';
import awardDermatologyClinic from '../assets/images/clinic/awards/award_dermatology.jpg';
import awardLaserClinic from '../assets/images/clinic/awards/award_laser.jpg';
import awardPatientSafety from '../assets/images/clinic/awards/award_patient_safety.jpg';
import awardRejuvenation from '../assets/images/clinic/awards/award_rejuvenation.jpg';
import minorSurgeryScars from '../assets/images/clinic/procedures/minor_surgery_scars.jpg';

export interface ClinicImageConfig {
  url: string;
  alt: string;
  caption?: string;
}

export interface ClinicLocationMedia {
  primary: string;
  alt: string;
  thumbnail?: string;
  gallery: string[];
}

/**
 * 1. Brand Logos & Emblems
 */
export const CLINIC_LOGOS = {
  icon: '/assets/clinic-logo-icon.webp',
  full: '/assets/clinic-logo-full.webp',
  alt: 'Age Reversal Clinics Emblem'
};

/**
 * 2. Clinic Locations Media Registry
 *
 * You can map images to clinic locations in TWO ways:
 *
 * Option 1 (By Location ID): 'harley-street-flagship', 'devonshire-place-clinic', 'grove-park-clinic'
 * Option 2 (By Location Order / Number): 'location1', 'location2', 'loc-1', 'loc-2'
 */
export const CLINIC_LOCATION_IMAGES: Record<string, ClinicLocationMedia> = {
  // --- Location 1: Harley Street Flagship ---
  'harley-street-flagship': {
    primary: clinicHarleyStreet,
    alt: 'Age Reversal Clinics Harley Street Flagship Private Consultation Rooms',
    thumbnail: clinicHarleyStreet,
    gallery: [
      clinicHarleyStreet,
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  'location1': {
    primary: clinicHarleyStreet,
    alt: 'Location 1 - Harley Street Flagship Clinic',
    gallery: [clinicHarleyStreet]
  },
  'loc-1': {
    primary: clinicHarleyStreet,
    alt: 'Location 1 - Harley Street Flagship Clinic',
    gallery: [clinicHarleyStreet]
  },

  // --- Location 2: Devonshire Place Medical Suites ---
  'devonshire-place-clinic': {
    primary: clinicDevonshire,
    alt: 'Devonshire Place Medical Suites Dermatology and Minor Surgery Clinic',
    thumbnail: clinicDevonshire,
    gallery: [
      clinicDevonshire,
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  'location2': {
    primary: clinicDevonshire,
    alt: 'Location 2 - Devonshire Place Medical Suites',
    gallery: [clinicDevonshire]
  },
  'loc-2': {
    primary: clinicDevonshire,
    alt: 'Location 2 - Devonshire Place Medical Suites',
    gallery: [clinicDevonshire]
  },

  // --- Location 3: Grove Park Clinic ---
  'grove-park-clinic': {
    primary: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
    alt: 'Grove Park Clinic Aesthetic Medicine Suites',
    thumbnail: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  'location3': {
    primary: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
    alt: 'Location 3 - Grove Park Clinic',
    gallery: ['https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80']
  },
  'loc-3': {
    primary: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
    alt: 'Location 3 - Grove Park Clinic',
    gallery: ['https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80']
  }
};

/**
 * 3. Master Clinic Interior Photos & Medical Suites
 */
export const CLINIC_INTERIOR_PHOTOS: string[] = [
  '/assets/clinic-interior-0.webp'
];

/**
 * 4. Clinical Awards & Accreditation Badges
 */
export const CLINIC_AWARDS_MEDIA = [
  {
    id: 'dermatology-clinic',
    image: awardDermatologyClinic,
    alt: 'Excellence in Aesthetic Dermatology Award'
  },
  {
    id: 'laser-clinic',
    image: awardLaserClinic,
    alt: 'Best Energy-Based & Laser Clinic Award'
  },
  {
    id: 'patient-safety',
    image: awardPatientSafety,
    alt: 'Clinical Patient Safety & Governance Award'
  },
  {
    id: 'rejuvenation',
    image: awardRejuvenation,
    alt: 'Cellular Rejuvenation Innovation Award'
  }
];

/**
 * 5. Banners & OpenGraph Social Sharing Visuals
 */
export const CLINIC_BANNER_IMAGES = {
  heroSculptureBust:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD8bgRX2IN0PJIId4hwyXvIXyAXymszL74AdUgStK58dFHc8-yHd7YTcqnjhsif69RjPTorG7X3K2L_bd7s4gjmN7BWOz_FKR0y4diN2rWbgdn3rsH3ormt2YNjUPPENB3P5V1pf5Vv3Opmiei3njD4hgCUAyHv5TB258eloVBqp55EW_KeB5ZpB9uITDcr9V8Hr0owysVe95b66YQbYKPz1BzX_NuBJVChJdYZxvlErr8HaxLbOY6AVAvs4gtL9k-XKw',
  ogSocialImage: '/assets/clinic-og-image.webp',
  minorSurgeryBanner: minorSurgeryScars
};

/**
 * Helper: Retrieve location image details by ID with graceful fallback
 */
export const getLocationMediaById = (locationId: string): ClinicLocationMedia => {
  return (
    CLINIC_LOCATION_IMAGES[locationId] || {
      primary: clinicHarleyStreet,
      alt: 'Age Reversal Clinics Medical Facility',
      gallery: [clinicHarleyStreet, clinicDevonshire]
    }
  );
};
