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

export interface ClinicWhyChooseUsPillar {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  imageUrl?: string;
}

export interface ClinicWhyChooseUsSection {
  heading: string;
  subheading?: string;
  pillars: ClinicWhyChooseUsPillar[];
}

export interface ClinicAwardItem {
  id: string;
  title: string;
  year: string;
  organization: string;
  imageUrl?: string;
}

export interface ClinicAwardsSection {
  heading: string;
  subheading?: string;
  awards: ClinicAwardItem[];
}

export interface ClinicConsultationDoctor {
  id: string;
  name: string;
  specialty?: string;
  locationIds?: string[]; // Empty or matching location IDs where this specialist practices
  availableDays?: number[]; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  timeSlots?: string[]; // e.g. ["09:30", "11:00", "14:00", "16:00"]
}

export interface ClinicConsultationOption {
  value: string;
  label: string;
}

export interface ClinicStayInTouchChannel {
  id: string; // e.g. 'email' | 'phone' | 'telephone' | 'post' | 'whatsapp' | 'sms'
  label: string;
  enabled: boolean;
}

export interface ClinicConsultationConfig {
  heading?: string;
  subheading?: string;
  specialistLabel?: string; // Default: "Preferred Specialist"
  doctors: ClinicConsultationDoctor[];
  defaultTimeSlots: string[];
  bestTimeOptions: ClinicConsultationOption[];
  hearAboutUsOptions: ClinicConsultationOption[];
  stayInTouchChannels: ClinicStayInTouchChannel[];
}

export interface ClinicProcessStep {
  id: string;
  stepNumber: string;
  title: string;
  image: string;
  imageAlt?: string;
  seoKeywords?: string[];
}

export interface ClinicProcessSection {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  seoKeywords?: string[];
  steps: ClinicProcessStep[];
}

export interface ClinicFacilityRoomItem {
  id: string;
  title: string;
  tag: string;
  image: string;
  imageAlt?: string;
}

export interface ClinicFacilityGallerySection {
  eyebrow?: string;
  heading: string;
  seoKeywords?: string[];
  rooms: ClinicFacilityRoomItem[];
}

export interface ClinicTrustBrandItem {
  id: string;
  name: string;
  iconType: string;
  imageUrl?: string;
}

export interface ClinicTrustBrandsSection {
  heading: string;
  seoKeywords?: string[];
  brands: ClinicTrustBrandItem[];
}

export interface ClinicAccreditationsSection {
  eyebrow?: string;
  heading: string;
  description?: string;
  seoKeywords?: string[];
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

  whyChooseUs?: ClinicWhyChooseUsSection;
  awardsShowcase?: ClinicAwardsSection;
  consultationConfig?: ClinicConsultationConfig;
  processSection?: ClinicProcessSection;
  facilityGallery?: ClinicFacilityGallerySection;
  trustBrandsSection?: ClinicTrustBrandsSection;
  accreditationsSection?: ClinicAccreditationsSection;
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
  "ogImage": "",
  "logo": {
    "icon": "/assets/clinic-logo-icon.webp",
    "alt": "Age Reversal Clinics Logo",
    "full": "/assets/clinic-logo-full.webp"
  },
  "exteriorPhoto": "",
  "interiorPhotos": [
    "/assets/clinic-interior-0.webp"
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
      "image": "/assets/clinic-location-1791722960928.webp",
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
      "image": "/assets/clinic-location-1791728808656.webp",
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
  "googleReviewUrl": "",
  "whyChooseUs": {
    "heading": "Why choose Age Reversal Clinic London?",
    "subheading": "Experience the pinnacle of clinical aesthetics. Here’s why clients trust our London flagship for their transformation.",
    "pillars": [
      {
        "id": "p1",
        "title": "London's Premier Aesthetic Destination",
        "description": "Situated in the heart of London on Harley Street, offering unparalleled luxury, privacy, and clinical excellence.",
        "iconName": "Building",
        "badge": "Harley St Flagship",
        "imageUrl": ""
      },
      {
        "id": "p2",
        "title": "Top-rated by real patients",
        "description": "Exceptional transformations with a verified 4.9/5 star rating from over 2,000 genuine patient reviews.",
        "iconName": "Star",
        "badge": "4.9/5 ★ (2,000+ Reviews)",
        "imageUrl": ""
      },
      {
        "id": "p3",
        "title": "Advanced Clinical Technologies",
        "description": "Equipped with gold-standard FDA-cleared RF, ultrasound, and picosecond medical laser treatment suites.",
        "iconName": "Sparkles",
        "badge": "FDA-Cleared Tech",
        "imageUrl": ""
      },
      {
        "id": "p4",
        "title": "World-Class Medical Team",
        "description": "GMC-registered aesthetic doctors and clinical nurse specialists with decades of specialized international expertise.",
        "iconName": "Medal",
        "badge": "GMC Registered",
        "imageUrl": ""
      }
    ]
  },
  "awardsShowcase": {
    "heading": "Awards & Recognition",
    "subheading": "Recognized nationally and globally for excellence in clinical and aesthetic dermatology.",
    "awards": [
      {
        "id": "award-1",
        "title": "Dermatology Clinic of the Year",
        "year": "2025",
        "organization": "Aesthetic Medicine Awards",
        "iconName": "Trophy",
        "imageUrl": ""
      },
      {
        "id": "award-2",
        "title": "Best Non-Surgical Rejuvenation",
        "year": "2025",
        "organization": "Global Cosmetic Congress",
        "iconName": "Sparkles",
        "imageUrl": ""
      },
      {
        "id": "award-3",
        "title": "Patient Safety Excellence Award",
        "year": "2024",
        "organization": "British Health Standards",
        "iconName": "ShieldCheck",
        "imageUrl": ""
      },
      {
        "id": "award-4",
        "title": "Best Laser Skin Clinic",
        "year": "2024",
        "organization": "International Laser Association",
        "iconName": "Award",
        "imageUrl": ""
      },
      {
        "id": "award-5",
        "title": "Excellence in Aesthetic Innovation",
        "year": "2024",
        "organization": "UK Clinical Dermatology Board",
        "iconName": "Trophy",
        "imageUrl": ""
      }
    ]
  },
  "consultationConfig": {
    "heading": "Book a Preferred Consultation",
    "subheading": "Schedule your bespoke clinical assessment with our aesthetic specialists.",
    "specialistLabel": "Preferred Specialist",
    "doctors": [
      {
        "id": "dr-1793362578610",
        "name": "Adv Faith Chris",
        "specialty": "Lead Aesthetics Specialist",
        "locationIds": [
          "location-1791722960928"
        ],
        "availableDays": [
          1,
          2,
          3,
          4,
          5
        ],
        "timeSlots": [
          "09:30",
          "11:00",
          "14:00",
          "16:00"
        ]
      },
      {
        "id": "dr-1793362615948",
        "name": "Adv. Nuri",
        "specialty": "Aesthetics Specialist",
        "locationIds": [
          "location-1791728808656"
        ],
        "availableDays": [
          2,
          3,
          4,
          5,
          6
        ],
        "timeSlots": [
          "09:30",
          "11:00",
          "14:00",
          "16:00"
        ]
      }
    ],
    "defaultTimeSlots": [
      "09:30",
      "11:00",
      "12:30",
      "14:00",
      "15:30",
      "17:00"
    ],
    "bestTimeOptions": [
      {
        "value": "morning",
        "label": "Morning (9am - 12pm)"
      },
      {
        "value": "afternoon",
        "label": "Afternoon (12pm - 4pm)"
      },
      {
        "value": "evening",
        "label": "Evening (4pm - 7pm)"
      }
    ],
    "hearAboutUsOptions": [
      {
        "value": "google",
        "label": "Google Search"
      },
      {
        "value": "social",
        "label": "Social Media (Instagram / Facebook / TikTok)"
      },
      {
        "value": "referral",
        "label": "Friend / Family Referral"
      },
      {
        "value": "other",
        "label": "Other"
      }
    ],
    "stayInTouchChannels": [
      {
        "id": "email",
        "label": "Email",
        "enabled": true
      },
      {
        "id": "phone",
        "label": "Phone",
        "enabled": true
      },
      {
        "id": "telephone",
        "label": "Tel Phone",
        "enabled": true
      },
      {
        "id": "post",
        "label": "Post Mail",
        "enabled": true
      },
      {
        "id": "whatsapp",
        "label": "WhatsApp",
        "enabled": false
      },
      {
        "id": "sms",
        "label": "SMS",
        "enabled": false
      }
    ]
  },
  "processSection": {
    "eyebrow": "Our Process",
    "heading": "The Journey to Radiance",
    "subheading": "From initial diagnostic skin mapping to bespoke clinical protocols and ongoing regenerative care.",
    "seoKeywords": [],
    "steps": [
      {
        "id": "step-1",
        "stepNumber": "01",
        "title": "Comprehensive Consultation & Assessment",
        "image": ""
      },
      {
        "id": "step-2",
        "stepNumber": "02",
        "title": "Bespoke Treatment Plan",
        "image": ""
      },
      {
        "id": "step-3",
        "stepNumber": "03",
        "title": "Precision Clinical Procedure",
        "image": ""
      },
      {
        "id": "step-4",
        "stepNumber": "04",
        "title": "Regenerative Aftercare & Follow-Up",
        "image": ""
      }
    ]
  },
  "facilityGallery": {
    "eyebrow": "Our Facility",
    "heading": "Clinic Gallery",
    "seoKeywords": [],
    "rooms": [
      {
        "id": "room-1",
        "title": "Consultation Suite",
        "tag": "Private",
        "image": ""
      },
      {
        "id": "room-2",
        "title": "Treatment Room",
        "tag": "Clinical",
        "image": ""
      }
    ]
  },
  "trustBrandsSection": {
    "heading": "Over 1,000+ Brands & Laboratories Trust Us",
    "seoKeywords": [],
    "brands": [
      {
        "id": "bp-1",
        "name": "Lumina",
        "iconType": "circle",
        "imageUrl": ""
      },
      {
        "id": "bp-2",
        "name": "Aether",
        "iconType": "layers",
        "imageUrl": ""
      },
      {
        "id": "bp-3",
        "name": "Vera",
        "iconType": "pill",
        "imageUrl": ""
      },
      {
        "id": "bp-4",
        "name": "Zenith",
        "iconType": "shield",
        "imageUrl": ""
      },
      {
        "id": "bp-5",
        "name": "Nexus",
        "iconType": "instagram",
        "imageUrl": ""
      }
    ]
  },
  "accreditationsSection": {
    "eyebrow": "Accreditations & Certifications",
    "heading": "Excellence guaranteed. Trusted globally.",
    "description": "We adhere to the highest international medical standards. Our facilities and practitioners are rigorously vetted by leading global dermatological and healthcare authorities.",
    "seoKeywords": []
  }
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
