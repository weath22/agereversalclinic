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
  "tagline": "Beauty, Cosmetic & Personal Care, Beauty Salon",
  "metaDescription": "Award-winning Harley Street & London aesthetic dermatology clinic specializing in anti-ageing, medical dermatology, laser treatments, and facial aesthetics.",
  "canonicalUrl": "https://agereversalclinics.co.uk",
  "brandKeywords": [
    "dermatology clinic london",
    "harley street dermatologist",
    "anti-aging clinic london",
    "botox harley street",
    "aesthetic dermatology",
    "Clinical aesthetics UK",
    "Professional skincare clinic UK",
    "Aesthetic medicine UK",
    "Skin rejuvenation clinic UK",
    "Non-surgical cosmetic treatments UK",
    "Advanced aesthetics UK",
    "Cosmetic skin clinic UK",
    "Medical aesthetics UK",
    "Aesthetic clinics UK"
  ],
  "ogImage": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
  "logo": {
    "icon": "/assets/1792949260148-age_reversal_clinic_uk_groove_park_london.png",
    "alt": "Age Reversal Clinics Logo",
    "full": "/assets/1792949271165-age_reversal_clinic_uk_groove_park_london.png"
  },
  "exteriorPhoto": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
  "interiorPhotos": [
    "/assets/1791726254284-Screenshot_2026-07-24_193158.png"
  ],
  "phone": "+44 (0) 20 7984159517",
  "email": "agereversalbeautyspa@gmail.com",
  "whatsapp": "https://wa.me/44207984159517",
  "openingHours": "Mon - Sat: 09:00 AM – 18:00 PM",
  "priceRange": "£",
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
    "French"
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
      "id": "location-1791722960928",
      "name": "Age Reversal Clinic",
      "address": "Age Reversal Clinic Grove Park",
      "city": "London",
      "postalCode": "",
      "country": "United Kingdom",
      "phone": "+44 (0) 20 88572000",
      "hours": "Mon – Sat: 09:00 AM – 6:00 PM",
      "directionsUrl": "",
      "latitude": 51.5173,
      "longitude": -0.1472,
      "parkingAvailable": false,
      "wheelchairAccessible": true,
      "image": "/assets/1791723050511-Screenshot_2026-07-24_193158.png",
      "imageAlt": ""
    },
    {
      "id": "location-1791728808656",
      "name": "374 Baring Road London UK",
      "address": "374 Baring Road Se12 0EF",
      "city": "London",
      "postalCode": "",
      "country": "United Kingdom",
      "phone": "+44 (0) 20 8857 2000",
      "hours": "Mon – Sat: 09:00 – 19:00",
      "directionsUrl": "https://www.bing.com/maps/search?mepi=0%7E%7EEmbedded%7EAddress_Link&ty=18&v=2&sV=1&FORM=MPSRPL&ss=id.ypid%3AYNA9A194E7369433C4&q=The+Age+Reversal+Clinic-+Hair-Beauty-Medical&ppois=51.430503845214844_0.021059999242424965_The+Age+Reversal+Clinic-+Hair-Beauty-Medical_YNA9A194E7369433C4%7E&cp=51.430504%7E0.021060&lvl=16&style=r",
      "latitude": 51.5173,
      "longitude": -0.1472,
      "parkingAvailable": false,
      "wheelchairAccessible": false,
      "image": "/assets/1791729403362-arc-logo__1___2_.webp",
      "imageAlt": ""
    }
  ],
  "socials": {
    "facebook": "https://www.facebook.com/agereversalmedspa",
    "instagram": "https://www.instagram.com/agereversalclinicuk/",
    "twitter": "",
    "youtube": "",
    "linkedin": ""
  },
  "googleReviewUrl": ""
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
