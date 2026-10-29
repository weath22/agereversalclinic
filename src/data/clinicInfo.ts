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
  "ogImage": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
  "logo": {
    "icon": "/assets/1791726118331-Screenshot_2026-07-24_193158.png",
    "alt": "Age Reversal Clinics Logo",
    "full": "/assets/1791726190127-arc-logo__2_.webp"
  },
  "exteriorPhoto": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
  "interiorPhotos": [
    "/assets/1793130890366-arcoutsideview.jpg",
    "/assets/1793130908513-arctreatment.jpg"
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
        "imageUrl": "https://lh3.googleusercontent.com/aida/AP1WRLvP3DFx2If1DMSMz3JKM0HPzM540kXV5qx4ncam1B_CstR80gJfBU5AgVz_YsPJ7u8V1nICj4IKO0ho2mOZo1vuUDFZEw-Ayq4p14_4qW8gAEOq6vYJFfmXi02IYti-uAUEojYV7cVHRx8-IjuVyoJ6AdGSCYT0VhPznGkC--nZZbr2vqIbtzvJQaOoTpF7vm4dZGfUyfQgXnhGm3ra1mjdJAGKWeB3fhbxho_WV4iW-9ZUAe7bRastfXY"
      },
      {
        "id": "p2",
        "title": "Top-rated by real patients",
        "description": "Exceptional transformations with a verified 4.9/5 star rating from over 2,000 genuine patient reviews.",
        "iconName": "Star",
        "badge": "4.9/5 ★ (2,000+ Reviews)",
        "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww"
      },
      {
        "id": "p3",
        "title": "Advanced Clinical Technologies",
        "description": "Equipped with gold-standard FDA-cleared RF, ultrasound, and picosecond medical laser treatment suites.",
        "iconName": "Sparkles",
        "badge": "FDA-Cleared Tech",
        "imageUrl": "https://lh3.googleusercontent.com/aida/AP1WRLvbGkim0rHF7Ruf3smBfq7BlZDg7FTbjFo3KTx21CJ86qX2T7gThqEfQmaS69rYUNtNQrnGPXJIOJTcoIOz_hCdUGzS-Cyeio7-DWxIyZZVQH95grNa2bbhnLGjt5IANWtQWycAC7JKxw6K1syY9H1W4ty0-Mpc3D-dH4coJR0zr5IaxigQ7G2BRK9YnWheyv8CjvRuSu4fbTW4fj4AP8QhZU3p2G1Rg0ztNQS13w1SZT_7bU3qioomJ9_f"
      },
      {
        "id": "p4",
        "title": "World-Class Medical Team",
        "description": "GMC-registered aesthetic doctors and clinical nurse specialists with decades of specialized international expertise.",
        "iconName": "Medal",
        "badge": "GMC Registered",
        "imageUrl": "https://lh3.googleusercontent.com/aida/AP1WRLsFtpFDuaNJSlvtgV5ykI3LUHSXc0rzKFYXGGNqkYq6ujIGrmaVAI-UUZWBC9h6l95unMnlba0hL6OSt_W08ItQlzC4HTVhrV4H7Itfm0m7scTAtpBiomP9SY89c7Uj0Q5mgYXMjovpZuGcczZeQepLx4ye1bw1emHNdm8GxyKyt8TftVi79q1QOO0MHef213jXO6KWOkNL6ufVfwZSrPS20twzy3Jy2_MEVCz9mR9pJVAW24L2KhOTQP9P"
      }
    ]
  },
  "awardsShowcase": {
    "heading": "Awards & Recognition",
    "subheading": "Recognized nationally and globally for excellence in clinical and aesthetic dermatology.",
    "awards": [
      {
        "id": "aw-1",
        "title": "Dermatology Clinic of the Year",
        "year": "2025",
        "organization": "Aesthetic Medicine Awards",
        "imageUrl": "/src/assets/images/clinic/awards/award_dermatology.jpg"
      },
      {
        "id": "aw-2",
        "title": "Best Non-Surgical Rejuvenation",
        "year": "2025",
        "organization": "Global Cosmetic Congress",
        "imageUrl": "/src/assets/images/clinic/awards/award_rejuvenation.jpg"
      }
    ]
  },
  "consultationConfig": {
    "heading": "Book a Preferred Consultation",
    "subheading": "Schedule your bespoke clinical assessment with our aesthetic specialists.",
    "specialistLabel": "Preferred Specialist",
    "doctors": [
      {
        "id": "dr-smith",
        "name": "Med Faith Chris",
        "specialty": "Lead Aesthetic Specialist",
        "locationIds": [
          "location-1791722960928"
        ],
        "availableDays": [
          1,
          2,
          3,
          4,
          5,
          6
        ],
        "timeSlots": [
          "09:30",
          "11:00",
          "13:30",
          "15:00",
          "16:30"
        ]
      },
      {
        "id": "dr-jaipur",
        "name": "Med Nuri",
        "specialty": "Regenerative & Laser Specialist",
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
          "12:00",
          "14:30",
          "17:00"
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
        "enabled": false
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
        "image": "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=400&fit=crop"
      },
      {
        "id": "step-2",
        "stepNumber": "02",
        "title": "Bespoke Treatment Plan",
        "image": "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=400&h=400&fit=crop"
      }
    ]
  },
  "facilityGallery": {
    "eyebrow": "Our Facility",
    "heading": "Clinic Gallery",
    "seoKeywords": [
      "medspa",
      "london medspa"
    ],
    "rooms": [
      {
        "id": "room-1",
        "title": "Consultation Suite",
        "tag": "Private",
        "image": "/assets/1793130890366-arcoutsideview.jpg",
        "imageAlt": "Medspa Consultation Suite"
      },
      {
        "id": "room-2",
        "title": "Age Reversal Treatment Area",
        "tag": "Clinical",
        "image": "/assets/1793130908513-arctreatment.jpg",
        "imageAlt": "Age Reversal Treatment Area"
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
        "iconType": "circle"
      },
      {
        "id": "bp-2",
        "name": "Aether",
        "iconType": "layers"
      },
      {
        "id": "bp-3",
        "name": "Vera",
        "iconType": "pill"
      },
      {
        "id": "bp-4",
        "name": "Zenith",
        "iconType": "shield"
      },
      {
        "id": "bp-5",
        "name": "Nexus",
        "iconType": "instagram"
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
