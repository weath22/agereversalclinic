/**
 * ============================================================================
 * CLINIC MASTER & SEO CONFIGURATION
 * ============================================================================
 * Edit this single file to update all clinic brand, contact, medical credentials,
 * and Schema.org Google SEO structured data across the entire application.
 * ============================================================================
 */

import {
  CLINIC_LOGOS,
  CLINIC_LOCATION_IMAGES,
  CLINIC_INTERIOR_PHOTOS,
  CLINIC_BANNER_IMAGES
} from './clinicImages';

export interface ClinicLocation {
  id?: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country?: string;
  phone: string;
  hours: string;
  directionsUrl?: string;
  latitude?: number;
  longitude?: number;
  parkingAvailable?: boolean;
  wheelchairAccessible?: boolean;
  // Configurable Image Assets
  image?: string;
  imageAlt?: string;
  gallery?: string[];
}

export interface ClinicData {
  // 1. Core Brand & Meta Summary
  name: string;
  tagline: string;
  metaDescription: string;
  canonicalUrl: string;
  brandKeywords: string[];
  ogImage: string;

  // 2. Brand Visual Assets & Logos
  logo: {
    icon: string;
    full?: string;
    alt: string;
  };
  exteriorPhoto?: string;
  interiorPhotos?: string[];

  // 3. Direct Communication Channels
  phone: string;
  email: string;
  whatsapp: string;
  openingHours: string;

  // 4. Commercial & Search Details (Schema.org / Google)
  priceRange: string;
  currency: string;
  acceptedPayments: string[];
  languagesSpoken: string[];
  medicalSpecialties: string[];

  // 5. Clinical Accreditations & Registrations
  gmcRegistration?: string;
  cqcStatus?: string;
  accreditations: string[];

  // 6. Clinic Facilities & Locations
  locations: ClinicLocation[];

  // 7. Social Media Profiles
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin?: string;
  };

  // 8. Reviews & Rating Links
  googleReviewUrl?: string;
}

export const CLINIC_DATA: ClinicData = {
  // 1. Core Brand & Meta Summary
  name: 'Age Reversal Clinics',
  tagline: 'Premier Medical, Surgical & Cosmetic Dermatology',
  metaDescription:
    'Award-winning Harley Street & London aesthetic dermatology clinic specializing in cellular exosomes, Profhilo, Morpheus8, ultrasound SMAS lifts, precision dermal contouring, and regenerative skincare.',
  canonicalUrl: 'https://agereversalclinics.com',
  brandKeywords: [
    'Harley Street Dermatology Clinic London',
    'Exosome Regenerative Therapy London',
    'Profhilo Injectable Hydration London',
    'Morpheus8 RF Microneedling Marylebone',
    'Ultherapy Non-Surgical Face Lift',
    'Precision Lip Enhancement London',
    'Aesthetic Medical Doctors GMC Registered',
    'Minor Skin Surgery and Scar Revision'
  ],
  ogImage: CLINIC_BANNER_IMAGES.ogSocialImage,

  // 2. Brand Visual Assets & Logos (configured in src/data/clinicImages.ts)
  logo: CLINIC_LOGOS,
  exteriorPhoto: CLINIC_LOCATION_IMAGES['harley-street-flagship'].primary,
  interiorPhotos: CLINIC_INTERIOR_PHOTOS,

  // 3. Direct Communication Channels
  phone: '+44 20 8857 2000',
  email: 'info@agereversalclinics.com',
  whatsapp: 'https://wa.me/442088572000',
  openingHours: 'Mon – Fri: 09:00 – 19:00 | Sat: 10:00 – 17:00',

  // 4. Commercial & Search Details (Schema.org / Google)
  priceRange: '£££',
  currency: 'GBP',
  acceptedPayments: [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Visa',
    'Mastercard',
    'American Express',
    'Apple Pay',
    'Google Pay'
  ],
  languagesSpoken: ['English', 'French', 'Arabic', 'Spanish'],
  medicalSpecialties: [
    'Dermatology',
    'Aesthetic Medicine',
    'Regenerative Medicine',
    'Cosmetic Surgery',
    'Trichology',
    'Laser & Energy-Based Medicine'
  ],

  // 5. Clinical Accreditations & Registrations
  gmcRegistration: 'GMC Certified Medical Specialists',
  cqcStatus: 'CQC Regulated & Compliant Private Facility',
  accreditations: [
    'General Medical Council (GMC) Registered Specialists',
    'Care Quality Commission (CQC) Compliant Clinic',
    'Save Face Accredited Aesthetic Clinic',
    'British College of Aesthetic Medicine (BCAM) Member',
    'Joint Council for Cosmetic Practitioners (JCCP)'
  ],

  // 6. Clinic Locations (linked with dedicated media in src/data/clinicImages.ts)
  locations: [
    {
      id: 'harley-street-flagship',
      name: 'Harley Street Flagship Clinic',
      address: '4 Harley Street, Marylebone',
      city: 'London',
      postalCode: 'W1G 9PB',
      country: 'United Kingdom',
      phone: '+44 20 8857 2000',
      hours: 'Mon – Fri: 09:00 – 19:00 | Sat: 10:00 – 17:00',
      directionsUrl: 'https://maps.google.com/?q=4+Harley+Street+London+W1G+9PB',
      latitude: 51.5173,
      longitude: -0.1472,
      parkingAvailable: true,
      wheelchairAccessible: true,
      image: CLINIC_LOCATION_IMAGES['harley-street-flagship'].primary,
      imageAlt: CLINIC_LOCATION_IMAGES['harley-street-flagship'].alt,
      gallery: CLINIC_LOCATION_IMAGES['harley-street-flagship'].gallery
    },
    {
      id: 'devonshire-place-clinic',
      name: 'Devonshire Place Medical Suites',
      address: '10 Devonshire Place, Marylebone',
      city: 'London',
      postalCode: 'W1G 6HH',
      country: 'United Kingdom',
      phone: '+44 20 8857 2000',
      hours: 'Mon – Fri: 09:00 – 18:30',
      directionsUrl: 'https://maps.google.com/?q=10+Devonshire+Place+London+W1G+6HH',
      latitude: 51.5204,
      longitude: -0.1495,
      parkingAvailable: true,
      wheelchairAccessible: true,
      image: CLINIC_LOCATION_IMAGES['devonshire-place-clinic'].primary,
      imageAlt: CLINIC_LOCATION_IMAGES['devonshire-place-clinic'].alt,
      gallery: CLINIC_LOCATION_IMAGES['devonshire-place-clinic'].gallery
    },
    {
      id: 'grove-park-clinic',
      name: 'Grove Park Clinic',
      address: 'Grove Park, London Borough of Lewisham',
      city: 'London',
      postalCode: 'SE12 0AL',
      country: 'United Kingdom',
      phone: '+44 20 8857 2000',
      hours: 'Mon – Fri: 09:00 – 18:00',
      directionsUrl: 'https://maps.google.com/?q=Grove+Park+London+SE12',
      latitude: 51.4312,
      longitude: 0.0211,
      parkingAvailable: true,
      wheelchairAccessible: true,
      image: CLINIC_LOCATION_IMAGES['grove-park-clinic'].primary,
      imageAlt: CLINIC_LOCATION_IMAGES['grove-park-clinic'].alt,
      gallery: CLINIC_LOCATION_IMAGES['grove-park-clinic'].gallery
    }
  ],

  // 7. Social Links
  socials: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com/agereversalclinicuk',
    twitter: 'https://twitter.com',
    youtube: 'https://youtube.com',
    linkedin: 'https://linkedin.com'
  },

  // 8. Google Review URL (change anytime)
  googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJ-3P3F6sEdkgRk612k05J2vM'
};

/**
 * Compatible helper mapping for components throughout the app
 */
export const CLINIC_INFO = {
  clinicName: CLINIC_DATA.name,
  tagline: CLINIC_DATA.tagline,
  metaDescription: CLINIC_DATA.metaDescription,
  primaryPhone: CLINIC_DATA.phone,
  phoneHref: `tel:${CLINIC_DATA.phone.replace(/[^0-9+]/g, '')}`,
  primaryEmail: CLINIC_DATA.email,
  whatsappUrl: CLINIC_DATA.whatsapp,
  googleReviewUrl: CLINIC_DATA.googleReviewUrl || 'https://search.google.com/local/writereview?placeid=ChIJ-3P3F6sEdkgRk612k05J2vM',
  welcomeMessage: `Welcome to ${CLINIC_DATA.name}`,
  openingHoursSummary: {
    weekdays: CLINIC_DATA.openingHours,
    saturdays: 'Sat: 10:00 – 17:00',
    sundays: 'Sun: Closed'
  },
  locations: CLINIC_DATA.locations.map((loc) => ({
    ...loc,
    id: loc.id || loc.name.toLowerCase().replace(/\s+/g, '-'),
    shortName: loc.name
  })),
  socialLinks: CLINIC_DATA.socials
};

export default CLINIC_DATA;
