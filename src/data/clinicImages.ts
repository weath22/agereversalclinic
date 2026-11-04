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

const clinicHarleyStreet = '';
const clinicDevonshire = '';
const awardDermatologyClinic = '';
const awardRejuvenation = '';
const awardPatientSafety = '';
const awardLaserClinic = '';
const minorSurgeryScars = '';

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
  icon: '',
  full: '',
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
    gallery: []
  },
  'location1': {
    primary: clinicHarleyStreet,
    alt: 'Location 1 - Harley Street Flagship Clinic',
    gallery: []
  },
  'loc-1': {
    primary: clinicHarleyStreet,
    alt: 'Location 1 - Harley Street Flagship Clinic',
    gallery: []
  },

  // --- Location 2: Devonshire Place Medical Suites ---
  'devonshire-place-clinic': {
    primary: clinicDevonshire,
    alt: 'Devonshire Place Medical Suites Dermatology and Minor Surgery Clinic',
    thumbnail: clinicDevonshire,
    gallery: []
  },
  'location2': {
    primary: clinicDevonshire,
    alt: 'Location 2 - Devonshire Place Medical Suites',
    gallery: []
  },
  'loc-2': {
    primary: clinicDevonshire,
    alt: 'Location 2 - Devonshire Place Medical Suites',
    gallery: []
  },

  // --- Location 3: Grove Park Clinic ---
  'grove-park-clinic': {
    primary: '',
    alt: 'Grove Park Clinic Aesthetic Medicine Suites',
    thumbnail: '',
    gallery: []
  },
  'location3': {
    primary: '',
    alt: 'Location 3 - Grove Park Clinic',
    gallery: []
  },
  'loc-3': {
    primary: '',
    alt: 'Location 3 - Grove Park Clinic',
    gallery: []
  }
};

/**
 * 3. Master Clinic Interior Photos & Medical Suites
 */
export const CLINIC_INTERIOR_PHOTOS: string[] = [];

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
  ogSocialImage: '',
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
