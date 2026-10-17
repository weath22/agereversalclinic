/**
 * ============================================================================
 * CLINIC MASTER & SEO CONFIGURATION
 * ============================================================================
 * Edit this file or customize via Admin Dashboard -> Clinic Master Data.
 * Updates clinic brand, contact, credentials, locations & Google SEO structured data.
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
  image?: string;
  imageAlt?: string;
  gallery?: string[];
}

export interface ClinicData {
  name: string;
  tagline: string;
  metaDescription: string;
  canonicalUrl: string;
  brandKeywords: string[];
  ogImage: string;

  logo: {
    icon: string;
    full?: string;
    alt: string;
  };
  exteriorPhoto?: string;
  interiorPhotos?: string[];

  phone: string;
  email: string;
  whatsapp: string;
  openingHours: string;

  priceRange: string;
  currency: string;
  acceptedPayments: string[];
  languagesSpoken: string[];
  medicalSpecialties: string[];

  gmcRegistration?: string;
  cqcStatus?: string;
  accreditations: string[];

  locations: ClinicLocation[];

  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin?: string;
  };

  googleReviewUrl?: string;
}

export const CLINIC_DATA: ClinicData = {
  "name": "Age Reversal Clinics",
  "tagline": "Premier Medical, Surgical & Cosmetic Dermatology",
  "metaDescription": "Award-winning Harley Street & London aesthetic dermatology clinic specializing in anti-ageing, medical dermatology, laser treatments, and facial aesthetics.",
  "canonicalUrl": "https://agereversalclinics.co.uk",
  "brandKeywords": [
    "dermatology clinic london",
    "harley street dermatologist",
    "anti-aging clinic london",
    "botox harley street",
    "aesthetic dermatology"
  ],
  "ogImage": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
  "logo": {
    "icon": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80",
    "alt": "Age Reversal Clinics Harley Street Logo"
  },
  "exteriorPhoto": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
  "interiorPhotos": [
    "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
  ],
  "phone": "+44 (0) 20 7946 0921",
  "email": "appointments@agereversalclinics.co.uk",
  "whatsapp": "https://wa.me/442079460921",
  "openingHours": "Mon - Fri: 08:30 – 19:30, Sat: 09:30 – 17:00",
  "priceRange": "£££",
  "currency": "GBP",
  "acceptedPayments": [
    "Cash",
    "Credit Card",
    "Debit Card",
    "American Express",
    "Bank Transfer",
    "Private Medical Insurance"
  ],
  "languagesSpoken": [
    "English",
    "French",
    "Arabic",
    "Spanish"
  ],
  "medicalSpecialties": [
    "Dermatology",
    "Cosmetic Dermatology",
    "Aesthetic Medicine",
    "Anti-Ageing Therapeutics",
    "Laser Skin Resurfacing",
    "Minor Skin Surgery"
  ],
  "gmcRegistration": "GMC Designated Medical Body #7492014",
  "cqcStatus": "CQC Registered Provider (Good Rating)",
  "accreditations": [
    "Care Quality Commission (CQC) Registered",
    "General Medical Council (GMC) Compliant",
    "British Association of Dermatologists (BAD) Member",
    "Joint Council for Cosmetic Practitioners (JCCP) Accredited",
    "Save Face Accredited Excellence"
  ],
  "locations": [
    {
      "id": "harley-street-flagship",
      "name": "Harley Street Flagship Clinic",
      "address": "10 Harley Street, Marylebone",
      "city": "London",
      "postalCode": "W1G 9PF",
      "country": "United Kingdom",
      "phone": "+44 (0) 20 7946 0921",
      "hours": "Mon - Fri: 08:30 - 19:30 | Sat: 09:30 - 17:00",
      "directionsUrl": "https://maps.google.com/?q=10+Harley+Street+London+W1G+9PF",
      "latitude": 51.5186,
      "longitude": -0.1472,
      "parkingAvailable": true,
      "wheelchairAccessible": true,
      "image": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
      "imageAlt": "Harley Street Flagship Clinic Exterior"
    },
    {
      "id": "devonshire-place-clinic",
      "name": "Devonshire Place Laser Suite",
      "address": "22 Devonshire Place, Marylebone",
      "city": "London",
      "postalCode": "W1G 6JA",
      "country": "United Kingdom",
      "phone": "+44 (0) 20 7946 0922",
      "hours": "Mon - Fri: 09:00 - 18:00",
      "directionsUrl": "https://maps.google.com/?q=22+Devonshire+Place+London+W1G+6JA",
      "latitude": 51.5212,
      "longitude": -0.1495,
      "parkingAvailable": true,
      "wheelchairAccessible": true,
      "image": "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=80",
      "imageAlt": "Devonshire Place Laser Suite"
    },
    {
      "id": "grove-park-clinic",
      "name": "Chiswick & West London Suite",
      "address": "4 Chiswick High Road",
      "city": "London",
      "postalCode": "W4 1TH",
      "country": "United Kingdom",
      "phone": "+44 (0) 20 8994 0110",
      "hours": "Tue - Sat: 09:00 - 18:00",
      "directionsUrl": "https://maps.google.com/?q=4+Chiswick+High+Road+London+W4+1TH",
      "latitude": 51.4938,
      "longitude": -0.2741,
      "parkingAvailable": true,
      "wheelchairAccessible": true,
      "image": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
      "imageAlt": "Chiswick & West London Suite"
    }
  ],
  "socials": {
    "facebook": "https://facebook.com/agereversalclinics",
    "instagram": "https://instagram.com/agereversalclinics",
    "twitter": "https://twitter.com/agereversal",
    "youtube": "https://youtube.com/@agereversalclinics",
    "linkedin": "https://linkedin.com/company/age-reversal-clinics"
  },
  "googleReviewUrl": "https://search.google.com/local/writereview?placeid=ChIJ-3P3F6sEdkgRk612k05J2vM"
};

/**
 * Compatible helper mapping for components throughout the app
 */
export const CLINIC_INFO = {
  clinicName: CLINIC_DATA.name,
  tagline: CLINIC_DATA.tagline,
  metaDescription: CLINIC_DATA.metaDescription,
  primaryPhone: CLINIC_DATA.phone,
  phoneHref: `tel:${(CLINIC_DATA.phone || '').replace(/[^0-9+]/g, '')}`,
  primaryEmail: CLINIC_DATA.email,
  whatsappUrl: CLINIC_DATA.whatsapp,
  googleReviewUrl: CLINIC_DATA.googleReviewUrl || 'https://search.google.com/local/writereview?placeid=ChIJ-3P3F6sEdkgRk612k05J2vM',
  welcomeMessage: `Welcome to ${CLINIC_DATA.name}`,
  openingHoursSummary: {
    weekdays: CLINIC_DATA.openingHours,
    saturdays: 'Sat: 10:00 – 17:00',
    sundays: 'Sun: Closed'
  },
  locations: (CLINIC_DATA.locations || []).map((loc) => ({
    ...loc,
    id: loc.id || loc.name.toLowerCase().replace(/\s+/g, '-'),
    shortName: loc.name
  })),
  socialLinks: CLINIC_DATA.socials
};

export default CLINIC_DATA;
