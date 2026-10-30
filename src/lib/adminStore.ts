import { 
  ConsultationRequest, 
  DoctorAppointmentRecord, 
  InquiryMessage,
  HeaderConfig,
  HeroConfig,
  SpecialistAreasConfig,
  TreatmentsConfig,
  SpecialistArea,
  Treatment,
  BeforeAfterGalleryConfig,
  BeforeAfterPair,
  WhyChooseUsConfig,
  AwardsConfig,
  OurLocationsConfig,
  TeamLeadershipConfig,
  ProcessConfig,
  FacilityInteriorsConfig,
  TestimonialsConfig,
  SpecialOffersConfig,
  SkincareCollectionConfig,
  TrustBrandsConfig,
  AccreditationsConfig,
  LatestNewsConfig,
  FooterConfig,
  FloatingMenuConfig,
  ProfilePageConfig,
  MediaAssetRecord,
  ProtocolStepItem,
  TreatmentProtocolGroup,
  ClinicalProtocolsConfig,
  MasterBranchCategory,
  MASTER_BRANCH_CATEGORIES,
  TransformationCategorySlug
} from '../types';
import {
  CLINIC_DATA,
  ClinicData,
  ClinicLocation,
  ClinicConsultationConfig,
  ClinicProcessSection,
  ClinicFacilityGallerySection,
  ClinicTrustBrandsSection,
  ClinicAccreditationsSection,
} from '../data/clinicInfo';
import {
  convertClinicImageFileToWebP,
  normalizeClinicSlotId,
  setClinicImageVersion,
  getClinicSlotId
} from '../utils/clinicImageHelper';
import { 
  TreatmentPricingItem, 
  TreatmentPricingCardSummary,
  TreatmentPricingQueryParams,
  PaginatedTreatmentCardsResponse,
  projectTreatmentCardSummary,
  filterAndSortTreatmentCards,
  TREATMENT_PRICING_DATA, 
  TREATMENT_PRICING_CATEGORIES,
  PRICING_CATEGORIES,
  TreatmentTaxonomyGroup,
  TreatmentSubGroup,
  DEFAULT_TREATMENT_TAXONOMY,
  LEGACY_BROCHURE_SUBGROUP_IDS,
  inferTreatmentSubGroup
} from '../data/treatmentPricing';
import { CLINICAL_AREAS_DB, findTreatmentInDB } from '../data/clinicalTreatments';
import { ALL_SPECIALIST_TREATMENTS } from '../data/specialistTreatments';
// Lazy / deferred cache for siteCustomizations.json (Task 1.2: Isolate Admin Store & Mock DB Payloads)
let _siteCustomizationsCache: Record<string, any> | null = null;
let _siteCustomizationsPromise: Promise<Record<string, any> | null> | null = null;

/**
 * Lazily loads and parses siteCustomizations.json only when requested (e.g. by admin studio or treatment views)
 */
export async function loadSiteCustomizations(): Promise<Record<string, any> | null> {
  if (_siteCustomizationsCache) return _siteCustomizationsCache;
  if (!_siteCustomizationsPromise) {
    _siteCustomizationsPromise = import('../data/siteCustomizations.json')
      .then((m) => {
        _siteCustomizationsCache = (m.default || m) as Record<string, any>;
        return _siteCustomizationsCache;
      })
      .catch((err) => {
        console.warn('Could not lazily load siteCustomizations.json:', err);
        return null;
      });
  }
  return _siteCustomizationsPromise;
}

// Helper to retrieve pre-deployment persisted configuration from siteCustomizations.json
function getFileDefault<T>(key: string, hardcodedFallback: T): T {
  if (_siteCustomizationsCache && typeof _siteCustomizationsCache === 'object' && key in _siteCustomizationsCache) {
    const val = _siteCustomizationsCache[key];
    if (val !== undefined && val !== null) {
      return val as T;
    }
  }
  return hardcodedFallback;
}

// Storage keys
const CONSULTATIONS_KEY = 'clinical_consultations';
const APPOINTMENTS_KEY = 'clinical_appointments';
const INQUIRIES_KEY = 'clinical_inquiries';
const HEADER_CONFIG_KEY = 'homepage_header_config';
const HERO_CONFIG_KEY = 'homepage_hero_config_v2';
const SPECIALIST_AREAS_CONFIG_KEY = 'homepage_specialist_areas_config_v4';
const TREATMENTS_CONFIG_KEY = 'homepage_treatments_config';
const GALLERY_CONFIG_KEY = 'homepage_gallery_config_v6';
const WHY_CHOOSE_US_CONFIG_KEY = 'homepage_why_choose_us_config_v3';
const AWARDS_CONFIG_KEY = 'homepage_awards_config';
const LOCATIONS_CONFIG_KEY = 'homepage_locations_config';
const CONSULTATION_CONFIG_KEY = 'homepage_consultation_config';
const TEAM_LEADERSHIP_CONFIG_KEY = 'homepage_team_leadership_config';
const PROCESS_CONFIG_KEY = 'homepage_process_config';
const FACILITY_INTERIORS_CONFIG_KEY = 'homepage_facility_interiors_config';
const TESTIMONIALS_CONFIG_KEY = 'homepage_testimonials_config';
const SPECIAL_OFFERS_CONFIG_KEY = 'homepage_special_offers_config';
const SKINCARE_COLLECTION_CONFIG_KEY = 'homepage_skincare_collection_config';
const TRUST_BRANDS_CONFIG_KEY = 'homepage_trust_brands_config';
const ACCREDITATIONS_CONFIG_KEY = 'homepage_accreditations_config';
const LATEST_NEWS_CONFIG_KEY = 'homepage_latest_news_config';
const FOOTER_CONFIG_KEY = 'homepage_footer_config';
const FLOATING_MENU_CONFIG_KEY = 'homepage_floating_menu_config';
const PROFILE_PAGE_CONFIG_KEY = 'profile_page_config';
const CLINIC_INFO_DATA_KEY = 'clinic_info_data';
const TREATMENT_PRICING_DATA_KEY = 'treatment_pricing_data';
export const TREATMENT_TAXONOMY_KEY = 'treatment_taxonomy_data';
const CENTRAL_MEDIA_ASSETS_KEY = 'central_clinic_media_assets';
const MASTER_SERVICES_CONFIG_KEY = 'master_services_config_v1';
export const CLINICAL_PROTOCOLS_CONFIG_KEY = 'clinical_protocols_config';

export const INITIAL_MEDIA_ASSETS: MediaAssetRecord[] = [
  {
    id: 'asset-hero-video-1',
    name: 'Clinic Cinematic Experience Video',
    url: 'https://pub-e6f425d799324ff19d004c8c518f4155.r2.dev/videos/raw/be84df26-4172-4917-8f6b-9f5486c5c6d6.mp4',
    mediaType: 'video',
    location: 'Cloud Streaming CDN',
    category: 'Videos',
    altText: 'Age Reversal Clinic London clinical procedure showreel video',
    seoKeywords: ['anti-aging clinic london', 'aesthetic medicine video', 'harley street clinic'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'asset-prep-serum-1',
    name: 'Clinical Skin Prep Serum Application',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww',
    mediaType: 'image',
    location: 'Cloud CDN / Clinic Protocol',
    category: 'Treatments',
    altText: 'Clinical Skin Prep Serum Application - Epidermal Prime & Hydration',
    seoKeywords: ['clinical skin prep', 'serum application protocol', 'medical grade pre-care protocol'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'asset-recovery-spa-1',
    name: 'Clinical Recovery Spa Sanctuary',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r',
    mediaType: 'image',
    location: 'Cloud CDN / Clinic Sanctuary',
    category: 'Treatments',
    altText: 'Clinical Recovery Spa Sanctuary - Cellular Healing & Protection',
    seoKeywords: ['post-care recovery', 'cellular healing', 'clinical skin recovery'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'asset-diagnostic-tech-1',
    name: 'Targeted Bio-Calibration Diagnostics',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR',
    mediaType: 'image',
    location: 'Cloud CDN / Clinic Technology',
    category: 'Treatments',
    altText: 'High-precision targeted aesthetic treatment technology and diagnostics',
    seoKeywords: ['targeted bio-calibration', 'diagnostic dermatology', 'cellular skin regeneration'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'asset-exosome-hero',
    name: 'Exosome Regenerative Therapy Hero',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    mediaType: 'image',
    location: 'Cloud CDN / Clinic Treatments',
    category: 'Treatments',
    altText: 'Exosome Regenerative Therapy clinical procedure and cellular skin renewal',
    seoKeywords: ['cellular skin regeneration', 'exosome therapy london', 'anti-aging clinic london'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'asset-profhilo-hero',
    name: 'Profhilo Injectable Hydration Hero',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC',
    mediaType: 'image',
    location: 'Cloud CDN / Clinic Treatments',
    category: 'Treatments',
    altText: 'Profhilo Injectable Hydration bio-remodeling at Age Reversal Clinic',
    seoKeywords: ['collagen bio-remodeling', 'profhilo london clinic', 'hyaluronic acid injectable'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'asset-morpheus8-hero',
    name: 'Morpheus8 RF Microneedling Hero',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOtBKp33pnPLoKpvckXkiIS-1G2cj7yNpUXZYP7v7nB3HgYFreRRFM-F6UZt2uwFsUMzf2u0m_0SvHcja7AjjBjq8B4mo1Gk_Y3ihgY2qmmbr1Vc48W8QizQ3BLTsaPHv9ojoje0Q8wG64F4zjwPy98roZuGAorsk2N5TxRUibfaZ4gZ7L9r7cFXGqA6jBiryjo3-fh10ZWdkryws_w14ASGtvXypafuUczwEFeVz6SywQsQKFg--N76UkgP9d4Um3Q5Snz8eG_XyS',
    mediaType: 'image',
    location: 'Cloud CDN / Clinic Treatments',
    category: 'Treatments',
    altText: 'Morpheus8 RF Microneedling facial remodeling session',
    seoKeywords: ['morpheus8 rf microneedling', 'jawline contouring london', 'subdermal adipose remodeling'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'asset-ultherapy-hero',
    name: 'Ultherapy Ultrasound Lift Hero',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
    mediaType: 'image',
    location: 'Cloud CDN / Clinic Treatments',
    category: 'Treatments',
    altText: 'Ultherapy Non-Surgical Ultrasound Lift session',
    seoKeywords: ['ultherapy non-surgical lift', 'smas muscle lifting', 'non-surgical dermal lift'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'asset-ba-volumetric',
    name: 'Clinical Trial Before/After Volumetric Case',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    mediaType: 'image',
    location: 'Cloud CDN / Transformations',
    category: 'Before & After',
    altText: 'Clinical Trial Before and After Volumetric Resurfacing',
    seoKeywords: ['before and after clinic', 'transformation gallery', 'cellular skin regeneration'],
    createdAt: new Date().toISOString()
  }
];


// Initial Mock Consultations (LocationsAndConsultation)
const INITIAL_CONSULTATIONS: ConsultationRequest[] = [
  {
    id: 'con-1',
    firstName: 'Eleanor',
    lastName: 'Vance',
    email: 'eleanor.vance@vanceholdings.co.uk',
    phone: '+44 7700 900077',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
    bestTime: 'morning',
    hearAboutUs: 'referral',
    notes: 'Interested in bespoke skincare regimes combined with exosomes.',
    improvement: 'Fine lines, skin tone elasticity and hydration.',
    doctor: 'dr-smith',
    stayInTouch: ['email', 'phone'],
    agreePrivacy: true,
    agreeOffers: true,
    treatments: [
      { id: 'exosome', name: 'Premium Exosome Therapy', price: '£850' },
      { id: 'polynucleotide', name: 'Polynucleotide Skin Booster', price: '£450' }
    ],
    status: 'pending',
    internalNotes: 'VIP client referral. Prefers morning appointments.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
  },
  {
    id: 'con-2',
    firstName: 'Marcus',
    lastName: 'Sterling',
    email: 'm.sterling@capitalpartners.com',
    phone: '+44 7700 900142',
    date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0], // 4 days from now
    bestTime: 'afternoon',
    hearAboutUs: 'search',
    notes: 'First time receiving injectables. Seeking natural-looking symmetry correction.',
    improvement: 'Mild volume loss in mid-face and jawline definition.',
    doctor: 'dr-jaipur',
    stayInTouch: ['email'],
    agreePrivacy: true,
    agreeOffers: false,
    treatments: [
      { id: 'filler', name: 'Advanced Dermal Fillers', price: '£650' }
    ],
    status: 'contacted',
    internalNotes: 'Contacted via email. Patient is slightly nervous about needles. Scheduled pre-consultation call.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString() // 1 day ago
  },
  {
    id: 'con-3',
    firstName: 'Siobhan',
    lastName: 'Gallagher',
    email: 'siobhan@gallagher-design.ie',
    phone: '+353 85 123 4567',
    date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], // 1 day ago
    bestTime: 'evening',
    hearAboutUs: 'social',
    notes: 'Needs hydration treatment before her exhibition opening.',
    improvement: 'Dullness and seasonal dryness.',
    doctor: 'dr-jones',
    stayInTouch: ['email', 'telephone'],
    agreePrivacy: true,
    agreeOffers: true,
    treatments: [
      { id: 'peel', name: 'Clinical Grade Chemical Peel', price: '£250' },
      { id: 'mesotherapy', name: 'Micro-Needling & Meso-Infusion', price: '£350' }
    ],
    status: 'booked',
    internalNotes: 'Appointment finalized and locked for 18:00 with Dr. Jones.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
  },
  {
    id: 'con-4',
    firstName: 'Arthur',
    lastName: 'Pendelton',
    email: 'a.pendelton@oxford.ac.uk',
    phone: '+44 7700 900891',
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    bestTime: 'afternoon',
    hearAboutUs: 'other',
    notes: 'Rescheduling due to university term dates.',
    improvement: 'Redness and capillary vessels.',
    doctor: '',
    stayInTouch: ['email'],
    agreePrivacy: true,
    agreeOffers: false,
    treatments: [
      { id: 'exosome', name: 'Premium Exosome Therapy', price: '£850' }
    ],
    status: 'cancelled',
    internalNotes: 'Client cancelled on short notice. Keep in file for autumn recall.',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

// Initial Mock Doctor Appointments (DoctorAppointment)
const INITIAL_APPOINTMENTS: DoctorAppointmentRecord[] = [
  {
    id: 'apt-1',
    name: 'Amelia Thorne',
    phone: '+44 7700 911044',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    time: '11:00 AM',
    service: 'exosome',
    bookingRef: 'ARC-842918',
    services: [
      { id: 'exosome', name: 'Premium Exosome Therapy', price: '£850' }
    ],
    status: 'reserved',
    internalNotes: 'Provisional room booking confirmed. Awaiting final payment arrival.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  },
  {
    id: 'apt-2',
    name: 'David Beckham',
    phone: '+44 7700 900552',
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days from now
    time: '02:30 PM',
    service: 'filler',
    bookingRef: 'ARC-521952',
    services: [
      { id: 'filler', name: 'Advanced Dermal Fillers', price: '£650' }
    ],
    status: 'confirmed',
    internalNotes: 'Confirmed by administrative team. Room reserved in Devonshire Place.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  },
  {
    id: 'apt-3',
    name: 'Chloe Bennet',
    phone: '+44 7700 900481',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // 2 days ago
    time: '10:00 AM',
    service: 'peel',
    bookingRef: 'ARC-218491',
    services: [
      { id: 'peel', name: 'Clinical Grade Chemical Peel', price: '£250' }
    ],
    status: 'completed',
    internalNotes: 'Procedure completed successfully. Pre-post care instructions sent.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString() // 4 days ago
  }
];

// Initial Mock Inquiries
const INITIAL_INQUIRIES: InquiryMessage[] = [
  {
    id: 'inq-1',
    location: 'The London Clinic - Main Hospital (20 Devonshire Place)',
    name: 'Sarah Connor',
    email: 's.connor@skyline.org',
    subject: 'Parking & Accessibility',
    message: 'Is valet parking available at the main hospital building? I have reduced mobility following surgery and would prefer direct access.',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString() // 6 hours ago
  },
  {
    id: 'inq-2',
    location: 'The London Clinic - Consulting Rooms (116 Harley Street)',
    name: 'Alistair Vance',
    email: 'a.vance@vancegroup.com',
    subject: 'Private Weekend Booking',
    message: 'Do you open the Consulting Rooms on Saturdays or Sundays for premium profile clients seeking full clinical privacy?',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  }
];

// Helper to load/save JSON
function getStorageItem<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
}

function setStorageItem<T>(key: string, value: T, skipFileSync: boolean = false): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Asynchronously write changes directly to project source files on server disk
    if (
      !skipFileSync &&
      (key === CLINIC_INFO_DATA_KEY ||
        key.startsWith('homepage_') ||
        key.startsWith('profile_') ||
        key.startsWith('clinical_') ||
        key.startsWith('master_') ||
        key.startsWith('treatment_'))
    ) {
      syncConfigToFile(key, value);
    }
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

/**
 * Sync a single config item directly to project files on the server disk
 */
export function syncConfigToFile(key: string, data: any): void {
  if (typeof window === 'undefined') return;
  fetch('/api/admin/save-to-files', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, data })
  }).then(res => res.json()).then(res => {
    if (res.success) {
      console.log(`[AdminStore] Successfully synced "${key}" directly to project files on disk!`);
    }
  }).catch(() => {
    // Graceful offline fallback
  });
}

/**
 * Client-side WebP conversion utility:
 * Converts any uploaded image file (JPG, PNG, HEIC, WebP, etc.) into a lightweight,
 * clean .webp data URL before uploading to /assets/treatments/ or /assets/.
 */
export async function convertImageFileToWebpDataUrl(
  file: File,
  maxDimension: number = 1600,
  quality: number = 0.88
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not available for image conversion'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      const img = new window.Image();
      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width || 1200;
          let height = img.naturalHeight || img.height || 900;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const webpUrl = canvas.toDataURL('image/webp', quality);
          resolve(webpUrl.startsWith('data:image/webp') ? webpUrl : rawDataUrl);
        } catch {
          resolve(rawDataUrl);
        }
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image or media asset directly to public/assets/ (or public/assets/treatments/)
 * and src/assets/images/ on disk, optionally converting to WebP, assigning a predictable slotId,
 * and deleting a displaced previousUrl file
 */
export async function uploadAssetFile(
  file: File,
  previousUrl?: string,
  options?: {
    folder?: 'assets' | 'treatments' | 'transformations';
    convertToWebp?: boolean;
    slotId?: string;
  }
): Promise<{ success: boolean; url?: string; fileName?: string; version?: number | string; error?: string }> {
  try {
    const isVideo = file.type.startsWith('video/');
    const isSlotUpload = Boolean(options?.slotId);
    const shouldConvertWebp =
      !isVideo && (options?.convertToWebp === true || options?.folder === 'treatments' || isSlotUpload);

    let dataUrl: string;
    if (isSlotUpload) {
      dataUrl = await convertClinicImageFileToWebP(file);
    } else if (shouldConvertWebp) {
      dataUrl = await convertImageFileToWebpDataUrl(file);
    } else {
      dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
    }

    const cleanSlotId = options?.slotId ? normalizeClinicSlotId(options.slotId) : undefined;
    const cleanFileName = cleanSlotId
      ? `${cleanSlotId}.webp`
      : shouldConvertWebp
      ? `${file.name.replace(/\.[^/.]+$/, '')}.webp`
      : file.name;

    const endpoint = cleanSlotId ? '/api/admin/clinic-assets/upload' : '/api/admin/upload-asset';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slotId: cleanSlotId,
        fileName: cleanFileName,
        dataUrl,
        previousUrl: previousUrl?.trim() || undefined,
        folder: options?.folder,
        category: cleanSlotId ? 'clinic' : undefined,
      }),
    });
    const data = await res.json();
    if (data.success && data.url) {
      if (cleanSlotId && data.version) {
        setClinicImageVersion(cleanSlotId, data.version);
      }
      try {
        registerMediaAsset({
          name: cleanFileName,
          url: data.url,
          mediaType: isVideo ? 'video' : 'image',
          size: file.size,
          category: options?.folder === 'treatments' ? 'Treatments' : 'Uploads',
          altText: `${cleanFileName.replace(/\.[^/.]+$/, '')} - Age Reversal Clinic London`,
        });
      } catch (regErr) {
        console.warn('Could not auto-register uploaded asset:', regErr);
      }
      return { success: true, url: data.url, fileName: data.fileName || cleanFileName, version: data.version };
    }
    return { success: false, error: data.error || 'Failed to upload asset' };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

/**
 * Dedicated Slot-Aware WebP Upload Pipeline for Clinic Edit Info assets:
 * 1. Runs direct client-side WebP compression (convertClinicImageFileToWebP).
 * 2. Uploads with permanent slotId to /api/admin/clinic-assets/upload.
 * 3. Immediately registers cache-busting version in setClinicImageVersion(slotId, version).
 */
export async function uploadClinicSlotAsset(
  file: File,
  slotId: string,
  previousUrl?: string
): Promise<{ success: boolean; url?: string; fileName?: string; version?: number | string; error?: string }> {
  return uploadAssetFile(file, previousUrl, {
    slotId,
    convertToWebp: true,
  });
}

/**
 * Dedicated Clean WebP Image Upload Pipeline for Homepage Treatments Bento Cards:
 * Converts the uploaded File to a lightweight .webp via convertImageFileToWebpDataUrl,
 * uploads it to /api/admin/treatments/:id/image (with fallback to /api/admin/upload-asset),
 * saves to public/assets/treatments/ and src/assets/images/treatments/,
 * and automatically cleans up any replaced previousUrl file.
 */
export async function uploadHomepageTreatmentWebpImage(params: {
  id: string;
  file?: File;
  dataUrl?: string;
  fileName?: string;
  previousUrl?: string;
  name?: string;
  imageAlt?: string;
  seoTitle?: string;
  seoKeywords?: string[];
}): Promise<{
  success: boolean;
  url?: string;
  rawPath?: string;
  fileName?: string;
  version?: number;
  error?: string;
}> {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Window is not defined' };
  }

  try {
    const cleanId =
      String(params.id || params.name || 'treatment')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || `treatment-${Date.now()}`;

    const webpDataUrl = params.file
      ? await convertImageFileToWebpDataUrl(params.file)
      : params.dataUrl || '';

    if (!webpDataUrl) {
      return { success: false, error: 'Missing image file or WebP data URL' };
    }

    const targetFileName = `homepage-${cleanId}.webp`;

    // Primary: Dedicated ID-based treatment image endpoint with automatic cleanup of replaced files
    const res = await fetch(`/api/admin/treatments/${encodeURIComponent(cleanId)}/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: cleanId,
        scope: 'homepage_treatments',
        fileName: targetFileName,
        extension: '.webp',
        dataUrl: webpDataUrl,
        previousUrl: params.previousUrl?.trim() || undefined,
        imageAlt: params.imageAlt,
        seoTitle: params.seoTitle,
        seoKeywords: params.seoKeywords,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const resolvedRawPath = data.rawPath || data.url || `/assets/treatments/${targetFileName}`;
      const resolvedUrl = data.imagePath || `${resolvedRawPath}?v=${data.version || Date.now()}`;
      if (data.success && resolvedRawPath) {
        try {
          registerMediaAsset({
            name: params.seoTitle || params.name || targetFileName,
            url: resolvedRawPath,
            mediaType: 'image',
            category: 'Treatments',
            altText:
              params.imageAlt ||
              `${params.name || cleanId} clinical aesthetic treatment at Age Reversal Clinic London`,
            seoKeywords: params.seoKeywords,
          });
        } catch {}

        return {
          success: true,
          url: resolvedUrl,
          rawPath: resolvedRawPath,
          fileName: data.fileName || targetFileName,
          version: data.version || Date.now(),
        };
      }
    }

    // Fallback: /api/admin/upload-asset with folder='treatments' and previousUrl cleanup
    const fallbackRes = await fetch('/api/admin/upload-asset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: targetFileName,
        dataUrl: webpDataUrl,
        previousUrl: params.previousUrl?.trim() || undefined,
        folder: 'treatments',
      }),
    });

    if (fallbackRes.ok) {
      const fbData = await fallbackRes.json();
      if (fbData.success && fbData.url) {
        const version = fbData.version || Date.now();
        return {
          success: true,
          url: `${fbData.url}?v=${version}`,
          rawPath: fbData.url,
          fileName: fbData.fileName || targetFileName,
          version,
        };
      }
    }

    return { success: false, error: 'Server failed to store treatment WebP image' };
  } catch (err) {
    console.error('Error uploading Homepage Treatment WebP image:', err);
    return { success: false, error: String(err) };
  }
}

/**
 * Central Clinic Media Asset Registration & Storage
 */
export function getRegisteredMediaAssets(): MediaAssetRecord[] {
  initializeAdminStore();
  return getStorageItem<MediaAssetRecord[]>(
    CENTRAL_MEDIA_ASSETS_KEY,
    getFileDefault<MediaAssetRecord[]>('central_clinic_media_assets', INITIAL_MEDIA_ASSETS)
  );
}

/**
 * Register any newly uploaded or external media asset into central clinic library (Task 2.1)
 */
export function registerMediaAsset(asset: {
  name?: string;
  url: string;
  mediaType?: 'image' | 'video';
  category?: MediaAssetRecord['category'];
  altText?: string;
  seoKeywords?: string[];
  size?: number;
}): MediaAssetRecord {
  if (!asset.url) {
    throw new Error('Asset URL is required');
  }
  const current = getRegisteredMediaAssets();
  const existingIndex = current.findIndex(a => a.url.trim() === asset.url.trim());

  if (existingIndex >= 0) {
    const existing = current[existingIndex];
    const updatedRecord: MediaAssetRecord = {
      ...existing,
      name: asset.name || existing.name,
      mediaType: asset.mediaType || existing.mediaType,
      category: asset.category || existing.category,
      altText: asset.altText || existing.altText,
      seoKeywords: asset.seoKeywords && asset.seoKeywords.length > 0 ? asset.seoKeywords : existing.seoKeywords
    };
    const updatedList = [...current];
    updatedList[existingIndex] = updatedRecord;
    setStorageItem(CENTRAL_MEDIA_ASSETS_KEY, updatedList);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('central_assets_updated', { detail: updatedList }));
    }
    return updatedRecord;
  }

  const cleanName = asset.name || (asset.url.split('/').pop()?.split('?')[0] || 'Clinic Media Asset');
  const inferredType = asset.mediaType || (asset.url.match(/\.(mp4|webm|mov|ogg)(\?|$)/i) ? 'video' : 'image');

  const newRecord: MediaAssetRecord = {
    id: `asset-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: cleanName,
    url: asset.url,
    mediaType: inferredType,
    size: asset.size || 0,
    location: asset.url.startsWith('/') ? 'Local Disk / Server Asset' : 'Cloud / Web CDN Asset',
    category: asset.category || (inferredType === 'video' ? 'Videos' : 'Treatments'),
    altText: asset.altText || `${cleanName} - Age Reversal Clinic London`,
    seoKeywords: asset.seoKeywords || ['anti-aging clinic london', 'cellular skin regeneration'],
    createdAt: new Date().toISOString()
  };

  const updated = [newRecord, ...current];
  setStorageItem(CENTRAL_MEDIA_ASSETS_KEY, updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('central_assets_updated', { detail: updated }));
  }
  return newRecord;
}

/**
 * List all project assets in src/assets/images, public/assets, AND registered clinic media
 */
export async function listProjectAssets(): Promise<Array<{
  name: string;
  url: string;
  size: number;
  mtime: string;
  location: string;
  mediaType?: 'image' | 'video';
  category?: string;
  altText?: string;
  seoKeywords?: string[];
}>> {
  const combinedList: Array<{
    name: string;
    url: string;
    size: number;
    mtime: string;
    location: string;
    mediaType?: 'image' | 'video';
    category?: string;
    altText?: string;
    seoKeywords?: string[];
  }> = [];
  const seenUrls = new Set<string>();

  // 1. Fetch physical disk assets from server
  try {
    const res = await fetch('/api/admin/assets');
    const data = await res.json();
    if (data.success && Array.isArray(data.assets)) {
      for (const asset of data.assets) {
        if (!seenUrls.has(asset.url)) {
          seenUrls.add(asset.url);
          combinedList.push({
            name: asset.name,
            url: asset.url,
            size: asset.size,
            mtime: asset.mtime,
            location: asset.location || 'Local Disk (src/assets/images)',
            mediaType: asset.url.match(/\.(mp4|webm|mov|ogg)(\?|$)/i) ? 'video' : 'image',
            category: 'Uploads'
          });
        }
      }
    }
  } catch (e) {
    console.error('Failed to list server assets', e);
  }

  // 2. Fetch central clinic registered media assets (Cloud & Curated)
  try {
    const registered = getRegisteredMediaAssets();
    for (const reg of registered) {
      if (!seenUrls.has(reg.url)) {
        seenUrls.add(reg.url);
        combinedList.push({
          name: reg.name,
          url: reg.url,
          size: reg.size || 0,
          mtime: reg.createdAt,
          location: reg.location,
          mediaType: reg.mediaType,
          category: reg.category,
          altText: reg.altText,
          seoKeywords: reg.seoKeywords
        });
      }
    }
  } catch (e) {
    console.error('Failed to load registered assets', e);
  }

  return combinedList;
}

/**
 * Sync all current admin store configs directly to src/data/siteCustomizations.json on disk
 */
export async function syncAllConfigsToFiles(): Promise<{ success: boolean; message: string; updatedAt?: string }> {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Window is not defined' };
  }
  try {
    const allConfigs = {
      [HEADER_CONFIG_KEY]: getHeaderConfig(),
      [HERO_CONFIG_KEY]: getHeroConfig(),
      [SPECIALIST_AREAS_CONFIG_KEY]: getSpecialistAreasConfig(),
      [TREATMENTS_CONFIG_KEY]: getTreatmentsConfig(),
      [GALLERY_CONFIG_KEY]: getBeforeAfterGalleryConfig(),
      [WHY_CHOOSE_US_CONFIG_KEY]: getWhyChooseUsConfig(),
      [AWARDS_CONFIG_KEY]: getAwardsConfig(),
      [LOCATIONS_CONFIG_KEY]: getOurLocationsConfig(),
      [TEAM_LEADERSHIP_CONFIG_KEY]: getTeamLeadershipConfig(),
      [PROCESS_CONFIG_KEY]: getProcessConfig(),
      [FACILITY_INTERIORS_CONFIG_KEY]: getFacilityInteriorsConfig(),
      [TESTIMONIALS_CONFIG_KEY]: getTestimonialsConfig(),
      [SPECIAL_OFFERS_CONFIG_KEY]: getSpecialOffersConfig(),
      [SKINCARE_COLLECTION_CONFIG_KEY]: getSkincareCollectionConfig(),
      [TRUST_BRANDS_CONFIG_KEY]: getTrustBrandsConfig(),
      [ACCREDITATIONS_CONFIG_KEY]: getAccreditationsConfig(),
      [LATEST_NEWS_CONFIG_KEY]: getLatestNewsConfig(),
      [FOOTER_CONFIG_KEY]: getFooterConfig(),
      [FLOATING_MENU_CONFIG_KEY]: getFloatingMenuConfig(),
      [PROFILE_PAGE_CONFIG_KEY]: getProfilePageConfig(),
      [CLINIC_INFO_DATA_KEY]: getClinicData(),
      [TREATMENT_PRICING_DATA_KEY]: getTreatmentPricingData(),
      [TREATMENT_TAXONOMY_KEY]: getTreatmentTaxonomy(),
      [TREATMENT_DETAILS_KEY]: getTreatmentDetailsConfig(),
      [CENTRAL_MEDIA_ASSETS_KEY]: getRegisteredMediaAssets(),
      [MASTER_SERVICES_CONFIG_KEY]: getMasterServices()
    };

    const res = await fetch('/api/admin/save-to-files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allConfigs })
    });

    if (res.ok) {
      const json = await res.json();
      return { success: true, message: json.message || 'Saved to disk successfully!', updatedAt: json.updatedAt };
    } else {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.error || 'Server error saving to files.' };
    }
  } catch (err) {
    return { success: false, message: 'Network error or dev server offline: ' + String(err) };
  }
}

// Default configs
const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  logoUrl: CLINIC_DATA.logo?.icon ?? CLINIC_DATA.logo?.full ?? "",
  primaryName: "Age Reversal",
  secondaryName: "Clinic"
};

const DEFAULT_HERO_CONFIG: HeroConfig = {
  badge: "Expert Care. Advanced Solutions.",
  title: "Exceptional Results with Age Reversal",
  description: "Advanced dermatology care tailored to your unique skin. Where science meets compassion.",
  mediaType: "video",
  mediaUrl: "https://pub-e6f425d799324ff19d004c8c518f4155.r2.dev/videos/raw/be84df26-4172-4917-8f6b-9f5486c5c6d6.mp4"
};

const DEFAULT_SPECIALIST_AREAS_CONFIG: SpecialistAreasConfig = {
  heading: "Explore our specialist areas",
  description: "At Age Reversal Clinic, we offer advanced aesthetic diagnostics, world-leading practitioners, and fast access to appointments - often within 48 hours - so your transformation can begin in days, not months.",
  areas: ALL_SPECIALIST_TREATMENTS.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.image,
    pricingCategory: item.pricingCategory,
    transformationCategory: item.transformationCategory,
    category: item.category,
    duration: item.duration,
    icon: item.icon,
    coverMedia: item.coverMedia,
    seoKeywords: item.seoKeywords
  }))
};

const DEFAULT_SPECIALIST_BY_ID = new Map(
  ALL_SPECIALIST_TREATMENTS.map((item) => [item.id, item])
);

export const DEFAULT_TREATMENTS_CONFIG: TreatmentsConfig = {
  editorialHeading: "rejuvenation",
  editorialSub: "Begin your transformation",
  description: "At Age Reversal Clinic, we believe that aesthetic harmony elevates self-confidence. Our clinical therapists custom-tailor skin therapy sessions, premium facials, and micropigmentation protocols to support your personal wellness ritual.",
  seoKeywords: [
    "age reversal clinic london treatments",
    "regenerative aesthetics london",
    "non-surgical facial rejuvenation",
    "body sculpting & skin boosters london",
    "clinical dermatology procedures"
  ],
  treatments: ALL_SPECIALIST_TREATMENTS.map((item, idx) => {
    const cleanTitle = (item.title || '').trim();
    const rawParent = item.pricingCategory || item.category || 'Face & Injectables';
    const categoryLabel =
      rawParent === 'IV Drip Lounge & Wellness' ? 'IV Drips & Wellness' : rawParent;
    const cleanImage =
      item.image || '/assets/images/treatments/specialist-profhilo.jpg';

    const defaultKeywords =
      item.seoKeywords && item.seoKeywords.length > 0
        ? item.seoKeywords
        : [
            cleanTitle.toLowerCase(),
            categoryLabel.toLowerCase(),
            `${cleanTitle.toLowerCase()} london`,
            'age reversal clinic treatment',
            'medical aesthetics london'
          ];

    return {
      id: item.id,
      name: cleanTitle,
      stepNumber: String(idx + 1).padStart(2, '0'),
      description: item.description || '',
      tag: categoryLabel,
      subGroupId: item.id,
      subCategory: cleanTitle,
      image: cleanImage,
      imageAlt:
        item.coverMedia?.altText ||
        `${cleanTitle} (${categoryLabel}) at Age Reversal Clinic London`,
      seoTitle:
        item.coverMedia?.seoTitle ||
        `${cleanTitle} | Age Reversal Clinic London`,
      seoKeywords: defaultKeywords,
      duration: item.duration || '45 Mins'
    };
  })
};

const DEFAULT_GALLERY_PAIRS_BY_GROUP: Record<string, BeforeAfterPair[]> = {
  'facial-skin-care': [
    {
      id: 'pair-1',
      treatmentGroupId: 'facial-skin-care',
      linkedTreatmentId: 'facial-skin-care',
      linkedTreatmentTitle: 'Facial skin care',
      title: 'Facial skin care',
      duration: '12 Weeks',
      sessions: 3,
      beforeAltText: 'Facial skin care Before Treatment at Age Reversal Clinics London',
      afterAltText: 'Facial skin care After 12 Weeks at Age Reversal Clinics London',
      seoTitle: 'Facial skin care Before & After | Age Reversal Clinics',
      seoKeywords: ['facial skin care before and after', 'anti-aging clinic london', 'clinical facial results'],
      beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6YRX4oWEimDRlPfT4ZvP49QVjagike9HlAOT7FsLhwf61UL4dCKCGWr1FS7SmMqMhd9VheV3RuR4bKmR_H3dRMFEAxUvuwj56dIFiriv8niGvOiz7XVef6Gjx4h3iHxaFayLl_g4p2ViKYOGEKxMw4bAR7W5VL-rkDMyy7LQjrabplnGUsrY6j9fECzUiFYmk_OZ_-hBZJAePOaKJjK0lqqjd7ahusnbsXJYKmIG5Rs5lmafypBuU_b9wqYQQG0v8O8BfCz2mokhu',
      afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtnTWTfvtjmgPs1n1Q2b5gdUnZqNuGV3e-_ZLF0KZFSWWrFhA3eAIX2iTTuaY-hDvVwQ5PKReB6fFMP3tq1WnzmcGJr11CXLsLkYmYd8zLGLdL5zETq6wohVWzqLcykLevZUPnJ_LG55HukqRiTUllO8pE80UJFXvPUytiYATX5fbzVCDVz_cqX20l_6dKdFzb4UaffXMlUAbDiZwQL531mZiVM9lUuSozSA_-uLXJhit8mpHzT04T8XOmmy7yIYQyPOkWqJTIqPfO'
    }
  ],
  'co2-laser-from': [
    {
      id: 'pair-2',
      treatmentGroupId: 'co2-laser-from',
      linkedTreatmentId: 'co2-laser-from',
      linkedTreatmentTitle: 'Co@ Laser from',
      title: 'Co@ Laser from',
      duration: '12 Weeks',
      sessions: 3,
      beforeAltText: 'Co@ Laser from Before Treatment at Age Reversal Clinics London',
      afterAltText: 'Co@ Laser from After Treatment at Age Reversal Clinics London',
      seoTitle: 'Co@ Laser from Before & After | Age Reversal Clinics',
      seoKeywords: ['co2 laser before and after', 'skin resurfacing london', 'dermal texture revision'],
      beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKPf3nijQRz9NaEd_b-5EiczAejYyrgh_dwMC6S-1-7Hi8EJJnt8_x2x-i1qG-qJ0BxvXbk_PeIeusHvMggQrPf2ijjCJ-yYtr-Ur19sJw4_NIIAlLMv1S2ct_OUVp3CJNba1hCLXrrPOcfhQAQUcgqZJFcuUL6Q4KXUwM1ALRAeo6Bb79xdI4FoLRUFAP9_MlbZ8tUedBAnuVrheDWpnRtLnB17gtdOx3OFGMbTVs5jhXXnZD6b-y7OCBnlBNOtqOPMcKxAdzDKRk',
      afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFNbqNx3wVVcZoA9IP87KJkDnMZI-8uRSd-RL2-LhuxC6ADEkgMcpBDJ22CU3U7a_ZOllNge5XasdFvVaBYUhCDohAZdRi0HT1ymJ1s_FMyiXt8pJl7NGhaLkKATrZlXl3B2mFW01fD4Mzp3ixyyLcDfCdjXdPi58MzBZ-GTgGk7w7Ks96hydwAbc4rURmQ3Pel8YEcOvxIX5UbwIKvB4OdEuyDc-z_RnH-USDoP7hJ2AJkw4zTdCS7FDF6Vo4RFbWikgnECIa4gKP'
    }
  ],
  'dermal-fillers-1ml': [
    {
      id: 'pair-3',
      treatmentGroupId: 'dermal-fillers-1ml',
      linkedTreatmentId: 'dermal-fillers-1ml',
      linkedTreatmentTitle: 'Dermal Fillers-1ml',
      title: 'Dermal Fillers-1ml',
      duration: 'Single Session',
      sessions: 1,
      beforeAltText: 'Dermal Fillers-1ml Before Treatment at Age Reversal Clinics London',
      afterAltText: 'Dermal Fillers-1ml After Treatment at Age Reversal Clinics London',
      seoTitle: 'Dermal Fillers-1ml Before & After | Age Reversal Clinics',
      seoKeywords: ['dermal fillers 1ml before and after london', 'facial harmonisation results', 'lip and chin filler london'],
      beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD20NLhroXmHS02eweFz9RBF-OhZ1RaQuMYe3uKrQ3iyvZ-roWLw57bJ33sw80W5DRjj47x5XfDBbMjHImuC7GRyDB99DirCCEbVZV8CTtkxIlVvsv3muJIAVMTHXiXqyc5zkYEu_ONKT40va6LO1TTmuJIgnYDdf4IauNPrqGL0pqV8S7wijzbRu89PlKh7cdxVcMqll1kYNG8e8Oy-dy4Ftdm6rYT9ZMn2IlwhqOYW0ekq6d9NnIYN_xGqSaNcN5s4N1iiVJMk3GV',
      afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDccMXAIYxuO2yvwTqN8m4d8QLiy48sfir-uvPIXURN6mHE9KnhgzWARsOBlK9Mr7YK53ev5SNz0PPuGxVRLSblgomVrpZxwnyuJUkmY-Ozf1hCAotsXBatMbvNCyS04ZJlkaYgvTJNROZ-js6VboTaV_3ll-A3k6pNoAAipu9StjstMbS0Laznf_O50IKrmUFaecZ-yeGpZtc8RnmuWeJ_Qsqe53K1Vl0UbckdWbcqY249cXQYBmdHpG1v0uiCq0Ly6hPEjF90b3le'
    }
  ],
  'platelet-rich-plasma-prp': [
    {
      id: 'pair-4',
      treatmentGroupId: 'platelet-rich-plasma-prp',
      linkedTreatmentId: 'platelet-rich-plasma-prp',
      linkedTreatmentTitle: 'Platelet-Rich Plasma (PRP)',
      title: 'Platelet-Rich Plasma (PRP)',
      duration: '20 Weeks',
      sessions: 4,
      beforeAltText: 'Platelet-Rich Plasma (PRP) Before Treatment at Age Reversal Clinics London',
      afterAltText: 'Platelet-Rich Plasma (PRP) After 20 Weeks at Age Reversal Clinics London',
      seoTitle: 'Platelet-Rich Plasma (PRP) Before & After | Age Reversal Clinics',
      seoKeywords: ['platelet rich plasma prp before and after london', 'prp hair loss results', 'scalp density treatment'],
      beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt4dLQWWadBxtTzBpplagu2J9MUvwKtNJkgViQjChgH82bAH_iO6gF6p-TSVCSZ2jViPeml_xgEZ7Iq6F_NEVjRCtxJ7KhPFDOYT5byV1VJXaplQwCg6QybxEWi8wHT_QpGlWU8xBqFyhtpBZao172mEYVtF0UVKABJBqCwM5SU30IS2ON1eLnGldXQRWwBGjBQU7aTfniH71oyqdfhnTK_-tGbm5YfhUmEG8QjW9Nsh3NLL2fC3UAJ83TDu-VoVMkNkLRQQdclSVR',
      afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkakM8tbhNmtYeKmoQBAAzTei0SDwQVg3jf4IfrTGNP8I8WmzYu8BL-eZUD6ccSBm9fY3UgWCvjrJX1rBeyzCvPpnD3Fa7-r7rI5pw8wP459wQIwtGxvpKIrc7paJJ_LgbbcH6SrOD3cwg6mM0x7ZahhhPNgqR7PkR4wXem9rqOpBJQQq8lP3Zmij233vHOLihq3N7Pxxs00WXjWevFzHxFsHzlNU6_pv9H7yfM-0JpAPd-C0UGYVLJ7BZ6WyP8HWAt41DR1q8v6Hd'
    }
  ],
  'profhilo-2ml': [
    {
      id: 'pair-5',
      treatmentGroupId: 'profhilo-2ml',
      linkedTreatmentId: 'profhilo-2ml',
      linkedTreatmentTitle: 'Profhilo 2ml',
      title: 'Profhilo 2ml',
      duration: '8 Weeks',
      sessions: 2,
      beforeAltText: 'Profhilo 2ml Before Treatment at Age Reversal Clinics London',
      afterAltText: 'Profhilo 2ml After 8 Weeks at Age Reversal Clinics London',
      seoTitle: 'Profhilo 2ml Before & After Result | Age Reversal Clinics',
      seoKeywords: ['profhilo 2ml before and after london', 'anti-aging treatment results', 'collagen bio-remodeling'],
      beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQHcq9zpePKkMqtIMFzx_zJA6A2MHoEn6csMvjhOOX7ANTgntEGIHbHHzkJdrRGuvr_rnNYa6j_vcZm7V9bkSv83qNQwd18XJJA14YTUOLU2diwqx3hP_e-l8axRA5ZOsfN1xGiRO0pPe2sb4cNQEz8psyAxBRjvefn1MvexT-2iAwkVKIyT8R_56LKMScwW7_sMvuBzMGXxdp0I1cFNoqfp7K5RhhrtrwcfrUPw1dRPmX60Zc0esbeUgaFqwO959IBqnu8sf8OA4w',
      afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZoLjpjMEmJNM6EwzVC9AzZEWfQUVa-TmVyM-NgPL8ONCjzwY7nZ6rFqOxJ9jyK0OMnlIij8h8SOt93jaHfSglwGqtwAN3uabUuoux0yNyPzieFFX7iyB4YhjLSsBzd2BRDjEDVB1RlXcG4VC8SswApL8QbBnPLshzCzMX8LSdFYZsa0PRI6MM6b7I67HIl-B6YLhZAH5ZI9mcghNQsybRemIqmq4LWl9BCKjn5KaTyU1RyMrHYkwMgx1ABZOJ1-OJiLkjF-5mIKY0'
    }
  ],
  'salmon-sperm-injection': [
    {
      id: 'pair-6',
      treatmentGroupId: 'salmon-sperm-injection',
      linkedTreatmentId: 'salmon-sperm-injection',
      linkedTreatmentTitle: 'Salmon sperm injection',
      title: 'Salmon sperm injection',
      duration: '8 Weeks',
      sessions: 3,
      beforeAltText: 'Salmon sperm injection Before Treatment at Age Reversal Clinics London',
      afterAltText: 'Salmon sperm injection After Treatment at Age Reversal Clinics London',
      seoTitle: 'Salmon sperm injection Before & After | Age Reversal Clinics',
      seoKeywords: ['salmon sperm injection before and after', 'polynucleotides london', 'skin texture repair'],
      beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
      afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY'
    }
  ],
  'morpheus8-treatment': [
    {
      id: 'pair-7',
      treatmentGroupId: 'morpheus8-treatment',
      linkedTreatmentId: 'morpheus8-treatment',
      linkedTreatmentTitle: 'Morpheus8 treatment',
      title: 'Morpheus8 treatment',
      duration: '12 Weeks',
      sessions: 3,
      beforeAltText: 'Morpheus8 treatment Before Treatment at Age Reversal Clinics London',
      afterAltText: 'Morpheus8 treatment After Treatment at Age Reversal Clinics London',
      seoTitle: 'Morpheus8 treatment Before & After | Age Reversal Clinics',
      seoKeywords: ['morpheus8 treatment before and after london', 'jawline tightening results', 'rf microneedling london'],
      beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
      afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLv5evIx7Bexs-9iJGxOP9dKFElgqCjw3duyD5PU_MlEubT0SyTO7PuZhJtmqUZf6JcUhS8jDhV8HW0kBhWUb4MYYalT72IO5pVBeVZs2593mjjAC6tI1ZOA1a9xGgg-M5J5waWMYO9uVD4zle9guZj31tQOME7032wvttEoahsd7HhWFooW0oUTyDgrytGK4oKIN0d2mGO5oLnx-NQ5sF7-OZHtA3a9_sCrUegKiXGZwpy_05469C2zVgo'
    }
  ],
  'emface-skin-tightening-and-lifting': [
    {
      id: 'pair-8',
      treatmentGroupId: 'emface-skin-tightening-and-lifting',
      linkedTreatmentId: 'emface-skin-tightening-and-lifting',
      linkedTreatmentTitle: 'Emface skin tightening and lifting',
      title: 'Emface skin tightening and lifting',
      duration: '16 Weeks',
      sessions: 3,
      beforeAltText: 'Emface skin tightening and lifting Before Treatment at Age Reversal Clinics London',
      afterAltText: 'Emface skin tightening and lifting After Treatment at Age Reversal Clinics London',
      seoTitle: 'Emface skin tightening and lifting Before & After | Age Reversal Clinics',
      seoKeywords: ['emface skin tightening and lifting before and after london', 'non-surgical facelift results', 'facial lifting clinic'],
      beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
      afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM'
    }
  ]
};

const DEFAULT_GALLERY_CONFIG: BeforeAfterGalleryConfig = {
  heading: "Before & After Gallery",
  description: "Witness the transformative journeys of our patients. These unretouched, real clinical cases illustrate the precision-guided results we achieve daily across our specialist disciplines.",
  categories: ALL_SPECIALIST_TREATMENTS.map((item) => ({
    id: item.id,
    name: item.title,
    pairs: DEFAULT_GALLERY_PAIRS_BY_GROUP[item.id] ? [...DEFAULT_GALLERY_PAIRS_BY_GROUP[item.id]] : []
  }))
};

const DEFAULT_WHY_CHOOSE_US_CONFIG: WhyChooseUsConfig = {
  heading: "Why choose Age Reversal Clinic London?",
  description: "Experience the pinnacle of clinical aesthetics. Here’s why clients trust our London flagship for their transformation.",
  pillars: [
    {
      id: 'p1',
      title: "London's Premier Aesthetic Destination",
      description: "Situated in the heart of London on Harley Street, offering unparalleled luxury, privacy, and clinical excellence.",
      iconName: "Building",
      badge: "Harley St Flagship",
      imageUrl: ""
    },
    {
      id: 'p2',
      title: "Top-rated by real patients",
      description: "Exceptional transformations with a verified 4.9/5 star rating from over 2,000 genuine patient reviews.",
      iconName: "Star",
      badge: "4.9/5 ★ (2,000+ Reviews)",
      imageUrl: ""
    },
    {
      id: 'p3',
      title: "Advanced Clinical Technologies",
      description: "Equipped with gold-standard FDA-cleared RF, ultrasound, and picosecond medical laser treatment suites.",
      iconName: "Sparkles",
      badge: "FDA-Cleared Tech",
      imageUrl: ""
    },
    {
      id: 'p4',
      title: "World-Class Medical Team",
      description: "GMC-registered aesthetic doctors and clinical nurse specialists with decades of specialized international expertise.",
      iconName: "Medal",
      badge: "GMC Registered",
      imageUrl: ""
    }
  ]
};

const DEFAULT_AWARDS_CONFIG: AwardsConfig = {
  heading: "Awards & Recognition",
  subheading: "Recognized nationally and globally for excellence in clinical and aesthetic dermatology.",
  awards: [
    {
      id: 'award-1',
      title: 'Dermatology Clinic of the Year',
      year: '2025',
      organization: 'Aesthetic Medicine Awards',
      imageUrl: ''
    },
    {
      id: 'award-2',
      title: 'Best Non-Surgical Rejuvenation',
      year: '2025',
      organization: 'Global Cosmetic Congress',
      imageUrl: ''
    },
    {
      id: 'award-3',
      title: 'Patient Safety Excellence Award',
      year: '2024',
      organization: 'British Health Standards',
      imageUrl: ''
    },
    {
      id: 'award-4',
      title: 'Best Laser Skin Clinic',
      year: '2024',
      organization: 'International Laser Association',
      imageUrl: ''
    },
    {
      id: 'award-5',
      title: 'Excellence in Aesthetic Innovation',
      year: '2024',
      organization: 'UK Clinical Dermatology Board',
      imageUrl: ''
    }
  ]
};

const DEFAULT_LOCATIONS_CONFIG: OurLocationsConfig = {
  heading: "Our Locations",
  description: "Conveniently located across London, providing world-class aesthetic dermatology, diagnostic consultations, and personalized care.",
  locations: (CLINIC_DATA.locations || []).map((loc, idx) => {
    const fullAddress = [
      loc.address?.trim(),
      (loc.city && !loc.address?.toLowerCase().includes(loc.city.toLowerCase())) ? loc.city.trim() : null,
      loc.postalCode?.trim() || null
    ].filter(Boolean).join(', ');
    return {
      id: loc.id || `loc-${idx + 1}`,
      name: loc.name,
      address: fullAddress,
      hours: loc.hours,
      phone: loc.phone || CLINIC_DATA.phone,
      mapsUrl: loc.directionsUrl || `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`,
      bannerType: "Clinic",
      imageUrl: loc.image ?? ""
    };
  })
};

const DEFAULT_TEAM_LEADERSHIP_CONFIG: TeamLeadershipConfig = {
  heading: "Meet Our Team",
  description: "World-class specialists committed to your care.",
  members: [
    {
      id: "dr-smith",
      name: "Dr. Alistair Smith",
      role: "Lead Dermatologist",
      description: "Expert in advanced aesthetic procedures.",
      image: "https://images.unsplash.com/photo-1612349317150-e410f624c4a5?w=400&h=400&fit=crop"
    },
    {
      id: "dr-jones",
      name: "Dr. Sarah Jones",
      role: "Aesthetic Physician",
      description: "Specializes in non-surgical rejuvenation.",
      image: "https://images.unsplash.com/photo-1594824436951-7f12bc41553a?w=400&h=400&fit=crop"
    }
  ]
};

const DEFAULT_PROCESS_CONFIG: ProcessConfig = {
  eyebrow: CLINIC_DATA.processSection?.eyebrow || "Our Process",
  heading: CLINIC_DATA.processSection?.heading || "The Journey to Radiance",
  description:
    CLINIC_DATA.processSection?.subheading ||
    "From initial diagnostic skin mapping to bespoke clinical protocols and ongoing regenerative care.",
  seoKeywords: CLINIC_DATA.processSection?.seoKeywords || [],
  steps:
    CLINIC_DATA.processSection?.steps && CLINIC_DATA.processSection.steps.length > 0
      ? CLINIC_DATA.processSection.steps
      : [
          {
            id: "step-1",
            stepNumber: "01",
            title: "Comprehensive Consultation & Assessment",
            image: "",
          },
          {
            id: "step-2",
            stepNumber: "02",
            title: "Bespoke Treatment Plan",
            image: "",
          },
          {
            id: "step-3",
            stepNumber: "03",
            title: "Precision Clinical Procedure",
            image: "",
          },
          {
            id: "step-4",
            stepNumber: "04",
            title: "Regenerative Aftercare & Follow-Up",
            image: "",
          },
        ],
};

const DEFAULT_FACILITY_INTERIORS_CONFIG: FacilityInteriorsConfig = {
  eyebrow: CLINIC_DATA.facilityGallery?.eyebrow || "Our Facility",
  heading: CLINIC_DATA.facilityGallery?.heading || "Clinic Gallery",
  description: "Experience world-class care in our state-of-the-art clinic.",
  seoKeywords: CLINIC_DATA.facilityGallery?.seoKeywords || [],
  rooms:
    CLINIC_DATA.facilityGallery?.rooms && CLINIC_DATA.facilityGallery.rooms.length > 0
      ? CLINIC_DATA.facilityGallery.rooms
      : [
          {
            id: "room-1",
            title: "Consultation Suite",
            tag: "Private",
            image: "",
          },
          {
            id: "room-2",
            title: "Treatment Room",
            tag: "Clinical",
            image: "",
          },
        ],
};

const DEFAULT_TESTIMONIALS_CONFIG: TestimonialsConfig = {
  heading: "Patient Testimonials",
  description: "Real stories from our valued patients.",
  testimonials: [
    {
      id: "test-1",
      name: "Emma W.",
      role: "Patient",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      rating: 5,
      quote: "The care I received was absolutely exceptional from start to finish."
    },
    {
      id: "test-2",
      name: "Michael R.",
      role: "Patient",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      rating: 5,
      quote: "Professional, knowledgeable, and truly life-changing results."
    }
  ]
};

const DEFAULT_SPECIAL_OFFERS_CONFIG: SpecialOffersConfig = {
  heading: "Special Offers",
  description: "Discover our current clinical promotions.",
  offers: [
    {
      id: "offer-1",
      title: "Complimentary Skin Assessment",
      discount: "100% OFF",
      description: "Book your first consultation completely free of charge.",
      buttonText: "Book Now",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop",
      theme: "rose"
    }
  ]
};


const DEFAULT_SKINCARE_COLLECTION_CONFIG: SkincareCollectionConfig = {
  heading: "Skincare Essentials",
  description: "Dermatologist-approved formulations."
};

const DEFAULT_TRUST_BRANDS_CONFIG: TrustBrandsConfig = {
  heading: CLINIC_DATA.trustBrandsSection?.heading || "Over 1,000+ Brands & Laboratories Trust Us",
  seoKeywords: CLINIC_DATA.trustBrandsSection?.seoKeywords || [],
  brands:
    CLINIC_DATA.trustBrandsSection?.brands && CLINIC_DATA.trustBrandsSection.brands.length > 0
      ? CLINIC_DATA.trustBrandsSection.brands
      : [
          { id: 'bp-1', name: 'Lumina', iconType: 'circle', imageUrl: '' },
          { id: 'bp-2', name: 'Aether', iconType: 'layers', imageUrl: '' },
          { id: 'bp-3', name: 'Vera', iconType: 'pill', imageUrl: '' },
          { id: 'bp-4', name: 'Zenith', iconType: 'shield', imageUrl: '' },
          { id: 'bp-5', name: 'Nexus', iconType: 'instagram', imageUrl: '' },
        ],
};

const DEFAULT_ACCREDITATIONS_CONFIG: AccreditationsConfig = {
  eyebrow: CLINIC_DATA.accreditationsSection?.eyebrow || "Accreditations & Certifications",
  heading: CLINIC_DATA.accreditationsSection?.heading || "Excellence guaranteed. Trusted globally.",
  description:
    CLINIC_DATA.accreditationsSection?.description ||
    "We adhere to the highest international medical standards. Our facilities and practitioners are rigorously vetted by leading global dermatological and healthcare authorities.",
  seoKeywords: CLINIC_DATA.accreditationsSection?.seoKeywords || [],
  items: CLINIC_DATA.accreditations || [],
  accreditations: (CLINIC_DATA.accreditations || ['CQC Registered', 'Save Face Accredited']).map(
    (text, idx) => ({ id: `acc-${idx + 1}`, text })
  ),
};

const DEFAULT_LATEST_NEWS_CONFIG: LatestNewsConfig = {
  heading: "Latest News & Insights",
  description: "Stay informed on the latest clinical advancements.",
  newsArticles: [],
  storyArticles: []
};

const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  address: "123 Medical Plaza, London W1G 8JZ",
  phone: "020 7123 4567",
  email: "contact@agereversalclinic.com",
  hours: "Mon-Sat: 9am - 7pm",
  socialLinks: {
    facebook: "#",
    instagram: "#"
  },
  links: [
    { name: "Services", href: "#services" },
    { name: "Treatments", href: "#treatments" },
    { name: "Before & Afters", href: "#gallery" },
    { name: "Reviews", href: "#reviews" },
    { name: "Skincare Essentials", href: "#essentials" },
    { name: "Book Appointment", href: "#contact" },
    { name: "Staff Portal", href: "#admin" }
  ]
};

const DEFAULT_FLOATING_MENU_CONFIG: FloatingMenuConfig = {
  phone: "020 7123 4567",
  email: "contact@agereversalclinic.com",
  address: "123 Medical Plaza, London",
  enableChat: true,
  welcomeMessage: "Hello! How can we help you today?"
};

export const DEFAULT_CLINICAL_PROTOCOLS_CONFIG: ClinicalProtocolsConfig = {
  protocols: {
    exosome: {
      id: 'exosome',
      name: 'Exosome Regenerative Therapy',
      subtitle: 'Cellular Signaling & Dermal Matrix Restoration',
      category: 'Advanced Facials',
      branchId: 'medical-facials',
      branchName: 'Clinical & Medical Facials',
      updatedAt: '2026-10-24T00:00:00.000Z',
      steps: [
        {
          id: 'exo-1',
          stepNumber: 1,
          title: 'Epidermal Clearing',
          description: 'The skin surface is meticulously cleansed and prepared using medical-grade formulations to ensure zero barrier interference.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 1 • 10 mins',
          duration: '10 mins',
          focusArea: 'Surface Epidermis'
        },
        {
          id: 'exo-2',
          stepNumber: 2,
          title: 'Pathway Micro-Channels',
          description: 'Microscopic pathways are gently opened in the dermis, setting up the structural guide channels for deep cell permeability.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 2 • 15 mins',
          duration: '15 mins',
          focusArea: 'Upper Papillary Dermis'
        },
        {
          id: 'exo-3',
          stepNumber: 3,
          title: 'Exosome Influx',
          description: 'Pure, clinical-grade signaling exosomes are introduced, delivering growth factors and signaling lipids directly to the deep dermal matrix.',
          image: '/assets/aistudio/Sheet_Face_Mask_Vector_Illustration_-_Graphics_by_Canva_a7a34ce5.jpg',
          phaseTag: 'Phase 3 • 20 mins',
          duration: '20 mins',
          focusArea: 'Deep Dermal Matrix'
        },
        {
          id: 'exo-4',
          stepNumber: 4,
          title: 'Cellular Sealing',
          description: 'A soothing bio-active sealant is applied to calm the tissue, lock in the exosomes, and initiate immediate cellular repair.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 4 • 10 mins',
          duration: '10 mins',
          focusArea: 'Lipid Moisture Barrier'
        }
      ]
    },
    profhilo: {
      id: 'profhilo',
      name: 'Profhilo Bio-Remodeling',
      subtitle: 'Multi-Level Dermal Remodeling & Hydration Diffusion',
      category: 'Face & Injectables',
      branchId: 'skin-boosters',
      branchName: 'Skin Boosters & Bioremodeling',
      updatedAt: '2026-10-24T00:00:00.000Z',
      steps: [
        {
          id: 'prof-1',
          stepNumber: 1,
          title: 'BAP Mapping',
          description: 'Meticulous marking of the 5 key Bio Aesthetic Points (BAP) on each side of the face to optimize dermal diffusion.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 1 • 10 mins',
          duration: '10 mins',
          focusArea: 'Anatomical BAP Vector Sites'
        },
        {
          id: 'prof-2',
          stepNumber: 2,
          title: 'Micro-Targeted Delivery',
          description: 'Ultra-pure hyaluronic acid is precisely injected at calibrated depths into each designated BAP site with minimal discomfort.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 2 • 15 mins',
          duration: '15 mins',
          focusArea: 'Mid-Dermal Interstitial Space'
        },
        {
          id: 'prof-3',
          stepNumber: 3,
          title: 'Dynamic Hydration Diffusion',
          description: 'The dual-weight hyaluronic acid complex begins to slowly diffuse evenly across the surrounding skin tissues.',
          image: '/assets/aistudio/Sheet_Face_Mask_Vector_Illustration_-_Graphics_by_Canva_a7a34ce5.jpg',
          phaseTag: 'Phase 3 • 15 mins',
          duration: '15 mins',
          focusArea: 'Subdermal Tissue Compartments'
        },
        {
          id: 'prof-4',
          stepNumber: 4,
          title: 'Bio-Remodeling Cycle',
          description: 'Continuous stimulation of 4 distinct collagen and elastin types, progressively lifting and remodeling sagging skin tissue.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 4 • Long-term',
          duration: 'Ongoing',
          focusArea: 'Extracellular Fibroblast Matrix'
        }
      ]
    },
    morpheus8: {
      id: 'morpheus8',
      name: 'Morpheus8 RF Microneedling',
      subtitle: 'Fractional Radiofrequency & Subdermal Adipose Remodeling',
      category: 'Face & Injectables',
      branchId: 'high-tech-lifting',
      branchName: 'High-Tech Lifting & Laser',
      updatedAt: '2026-10-24T00:00:00.000Z',
      steps: [
        {
          id: 'morph-1',
          stepNumber: 1,
          title: 'Subdermal Mapping',
          description: 'Calibrating needle penetration depths (ranging from 1mm to 4mm) to target the specific thickness of skin and localized fat.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 1 • 15 mins',
          duration: '15 mins',
          focusArea: 'Subcutaneous Depth Calibration'
        },
        {
          id: 'morph-2',
          stepNumber: 2,
          title: 'Micro-Needle Penetration',
          description: 'Gold-plated microneedles gently enter the skin to the exact pre-calibrated depth to deliver subdermal energy.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 2 • 20 mins',
          duration: '20 mins',
          focusArea: 'Sub-Epidermal Matrix'
        },
        {
          id: 'morph-3',
          stepNumber: 3,
          title: 'RF Coagulation & Contraction',
          description: 'Radiofrequency energy pulses through the needle tips, heating and remodeling subdermal adipose tissue and contracting fibers.',
          image: '/assets/aistudio/Sheet_Face_Mask_Vector_Illustration_-_Graphics_by_Canva_a7a34ce5.jpg',
          phaseTag: 'Phase 3 • 25 mins',
          duration: '25 mins',
          focusArea: 'Deep SMAS & Fibroseptal Network'
        },
        {
          id: 'morph-4',
          stepNumber: 4,
          title: 'Neocollagenesis Trigger',
          description: 'Immediate contraction coupled with long-term collagen building results in a tighter, contoured, and lifted facial structure.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 4 • 10 mins',
          duration: '10 mins',
          focusArea: 'Dermal Structural Framework'
        }
      ]
    },
    ultherapy: {
      id: 'ultherapy',
      name: 'Ultherapy Ultrasound Lift',
      subtitle: 'Micro-Focused Ultrasound with Deep SMAS Visualization',
      category: 'Face & Injectables',
      branchId: 'high-tech-lifting',
      branchName: 'High-Tech Lifting & Laser',
      updatedAt: '2026-10-24T00:00:00.000Z',
      steps: [
        {
          id: 'ulth-1',
          stepNumber: 1,
          title: 'Real-Time Visualization',
          description: 'Using high-resolution ultrasound imaging to see beneath the skin and precisely identify the target SMAS muscle layers.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 1 • 15 mins',
          duration: '15 mins',
          focusArea: 'SMAS Ultrasound Imaging'
        },
        {
          id: 'ulth-2',
          stepNumber: 2,
          title: 'Calibrated Energy Delivery',
          description: 'Directing focused thermal points precisely at three distinct depths (1.5mm, 3.0mm, and 4.5mm) bypassing the skin surface.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 2 • 30 mins',
          duration: '30 mins',
          focusArea: 'Multi-Depth Thermal Deposition'
        },
        {
          id: 'ulth-3',
          stepNumber: 3,
          title: 'Tissue Coagulation',
          description: 'Micro-focused ultrasound waves create tiny thermal spots that trigger immediate contraction of the foundational SMAS layer.',
          image: '/assets/aistudio/Sheet_Face_Mask_Vector_Illustration_-_Graphics_by_Canva_a7a34ce5.jpg',
          phaseTag: 'Phase 3 • 20 mins',
          duration: '20 mins',
          focusArea: 'Deep Muscular Aponeurotic System'
        },
        {
          id: 'ulth-4',
          stepNumber: 4,
          title: 'Progressive Tissue Lifting',
          description: 'A natural healing cascade begins, building new, healthy collagen fibers that lift and firm the skin over 2 to 3 months.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 4 • Long-term',
          duration: '2-3 Months',
          focusArea: 'Structural Neocollagenesis'
        }
      ]
    },
    polynucleotide: {
      id: 'polynucleotide',
      name: 'Polynucleotides Dermal Repair',
      subtitle: 'Cellular DNA Fraction Regeneration & Under-Eye Rejuvenation',
      category: 'Face & Injectables',
      branchId: 'skin-boosters',
      branchName: 'Skin Boosters & Bioremodeling',
      updatedAt: '2026-10-24T00:00:00.000Z',
      steps: [
        {
          id: 'poly-1',
          stepNumber: 1,
          title: 'Dermal Scanning & Marking',
          description: 'Mapping targeted treatment zones such as the delicate under-eye tear troughs, lip lines, or areas of active dehydration.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 1 • 10 mins',
          duration: '10 mins',
          focusArea: 'Periorbital & Target Zones'
        },
        {
          id: 'poly-2',
          stepNumber: 2,
          title: 'DNA Fraction Infusion',
          description: 'Administering micro-droplets of highly purified polynucleotides directly into the damaged dermal layers.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 2 • 20 mins',
          duration: '20 mins',
          focusArea: 'Papillary Dermis Infusion'
        },
        {
          id: 'poly-3',
          stepNumber: 3,
          title: 'Cellular Instruction',
          description: 'The polynucleotide chains bind to cellular receptors, instructing fatigued cells to actively repair and regenerate tissue.',
          image: '/assets/aistudio/Sheet_Face_Mask_Vector_Illustration_-_Graphics_by_Canva_a7a34ce5.jpg',
          phaseTag: 'Phase 3 • 15 mins',
          duration: '15 mins',
          focusArea: 'Fibroblast Membrane Receptors'
        },
        {
          id: 'poly-4',
          stepNumber: 4,
          title: 'Structural Regeneration',
          description: 'Accelerated synthesis of Type I collagen, enhanced skin elasticity, and improved micro-circulation for a glowing finish.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 4 • 10 mins',
          duration: '10 mins',
          focusArea: 'Micro-Circulatory Bed'
        }
      ]
    },
    lip: {
      id: 'lip',
      name: 'Lip Augmentation & Contour',
      subtitle: 'Anatomical Cupid\'s Bow Sculpting & Hydration Integration',
      category: 'Face & Injectables',
      branchId: 'dermal-fillers',
      branchName: 'Dermal Fillers (1ml)',
      updatedAt: '2026-10-24T00:00:00.000Z',
      steps: [
        {
          id: 'lip-1',
          stepNumber: 1,
          title: 'Symmetry Analysis',
          description: 'Evaluating lip proportions, Cupid\'s bow definition, and lip borders to design a custom, harmonious shape.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 1 • 10 mins',
          duration: '10 mins',
          focusArea: 'Vermilion Border & Philtrum'
        },
        {
          id: 'lip-2',
          stepNumber: 2,
          title: 'Calibrated Micro-Needling',
          description: 'Utilizing premium hyaluronic gel blended with anesthetic lidocaine to ensure a comfortable and controlled sculpting session.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 2 • 15 mins',
          duration: '15 mins',
          focusArea: 'Sub-Mucosal Tissue'
        },
        {
          id: 'lip-3',
          stepNumber: 3,
          title: 'Precision Volumization',
          description: 'Delicate dermal sculpting to fill vertical lines, restore proportional volume, and define natural borders.',
          image: '/assets/aistudio/Sheet_Face_Mask_Vector_Illustration_-_Graphics_by_Canva_a7a34ce5.jpg',
          phaseTag: 'Phase 3 • 15 mins',
          duration: '15 mins',
          focusArea: 'Oral Commissure & Body of Lip'
        },
        {
          id: 'lip-4',
          stepNumber: 4,
          title: 'Hydration Integration',
          description: 'The hyaluronic gel integrates with the lip tissue, locking in deep moisture for a soft, lush, and hydrated pout.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 4 • 10 mins',
          duration: '10 mins',
          focusArea: 'Superficial Lip Mucosa'
        }
      ]
    },
    buttock: {
      id: 'buttock',
      name: 'Gluteal Contouring & Bio-Stimulation',
      subtitle: 'PLLA Collagen Induction & Projection Sculpting',
      category: 'Body Sculpting',
      branchId: 'body-contouring',
      branchName: 'Body Contouring & Fat Loss',
      updatedAt: '2026-10-24T00:00:00.000Z',
      steps: [
        {
          id: 'butt-1',
          stepNumber: 1,
          title: 'Vector Mapping',
          description: 'Charting gluteal contours, highlighting hip dips, and mapping target vectors for optimal projection and lift.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 1 • 15 mins',
          duration: '15 mins',
          focusArea: 'Lateral Hip Dip & Upper Pole Vectors'
        },
        {
          id: 'butt-2',
          stepNumber: 2,
          title: 'Bio-Stimulator Infusion',
          description: 'Administering high-density poly-L-lactic acid (PLLA) bio-stimulator gel into the deep subcutaneous adipose layers.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 2 • 30 mins',
          duration: '30 mins',
          focusArea: 'Deep Subcutaneous Adipose Plane'
        },
        {
          id: 'butt-3',
          stepNumber: 3,
          title: 'Structural Massage',
          description: 'Using specialized manual massage techniques to distribute the micro-particles evenly for perfectly smooth contours.',
          image: '/assets/aistudio/Sheet_Face_Mask_Vector_Illustration_-_Graphics_by_Canva_a7a34ce5.jpg',
          phaseTag: 'Phase 3 • 15 mins',
          duration: '15 mins',
          focusArea: 'Subdermal Micro-Particle Distribution'
        },
        {
          id: 'butt-4',
          stepNumber: 4,
          title: 'Sustained Collagenesis',
          description: 'The bio-stimulating particles trigger gradual, long-term collagen building, filling and rounding contours over 4-6 weeks.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 4 • Long-term',
          duration: '4-6 Weeks',
          focusArea: 'Fibroblast Proliferation & Volume'
        }
      ]
    },
    blepharoplasty: {
      id: 'blepharoplasty',
      name: 'Non-Surgical Blepharoplasty',
      subtitle: 'Precision Plasma Sublimation & Eyelid Contraction',
      category: 'Face & Injectables',
      branchId: 'high-tech-lifting',
      branchName: 'High-Tech Lifting & Laser',
      updatedAt: '2026-10-24T00:00:00.000Z',
      steps: [
        {
          id: 'bleph-1',
          stepNumber: 1,
          title: 'Laxity Mapping',
          description: 'Analyzing excess upper or lower eyelid skin and marking the micro-contraction guide path for exact sublimation.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 1 • 10 mins',
          duration: '10 mins',
          focusArea: 'Periorbital Skin Fold & Crease'
        },
        {
          id: 'bleph-2',
          stepNumber: 2,
          title: 'Plasma Arc Application',
          description: 'A precision device creates focused plasma energy points, instantly sublimating the outermost epidermal layer.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 2 • 20 mins',
          duration: '20 mins',
          focusArea: 'Superficial Epidermal Keratinocytes'
        },
        {
          id: 'bleph-3',
          stepNumber: 3,
          title: 'Immediate Contraction',
          description: 'The plasma micro-arcs trigger immediate shrinkage of loose skin cells, tightening drooping tissue with zero bleeding.',
          image: '/assets/aistudio/Sheet_Face_Mask_Vector_Illustration_-_Graphics_by_Canva_a7a34ce5.jpg',
          phaseTag: 'Phase 3 • 15 mins',
          duration: '15 mins',
          focusArea: 'Stratum Corneum Retraction'
        },
        {
          id: 'bleph-4',
          stepNumber: 4,
          title: 'Epidermal Re-Surfacing',
          description: 'Micro-crusts form and naturally shed over 5-7 days, revealing fresh, remarkably tightened, and lifted eyelid skin.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 4 • 5-7 Days',
          duration: '5-7 Days',
          focusArea: 'Regenerative Re-Epithelialization'
        }
      ]
    },
    aqualyx: {
      id: 'aqualyx',
      name: 'Aqualyx Fat Dissolving',
      subtitle: 'Targeted Lipolysis & Metabolic Adipose Clearance',
      category: 'Body Sculpting',
      branchId: 'fat-dissolving',
      branchName: 'Fat Dissolving Injections (Aqualyx & Deso)',
      updatedAt: '2026-10-24T00:00:00.000Z',
      steps: [
        {
          id: 'aqua-1',
          stepNumber: 1,
          title: 'Adipose Assessment',
          description: 'Identifying localized, stubborn fat pockets (such as double chins or love handles) and marking a precise grid guide.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 1 • 10 mins',
          duration: '10 mins',
          focusArea: 'Submental & Focal Fat Grids'
        },
        {
          id: 'aqua-2',
          stepNumber: 2,
          title: 'Lipolytic Infusion',
          description: 'Injecting the specialized Aqualyx deoxycholic acid formula directly into the center of the subcutaneous fat layer.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 2 • 20 mins',
          duration: '20 mins',
          focusArea: 'Deep Subcutaneous Adipocytes'
        },
        {
          id: 'aqua-3',
          stepNumber: 3,
          title: 'Membrane Liquefaction',
          description: 'The formulation dissolves the rigid lipid membranes, safely breaking down and liquefying target fat cells.',
          image: '/assets/aistudio/Sheet_Face_Mask_Vector_Illustration_-_Graphics_by_Canva_a7a34ce5.jpg',
          phaseTag: 'Phase 3 • 20 mins',
          duration: '20 mins',
          focusArea: 'Phospholipid Bilayers'
        },
        {
          id: 'aqua-4',
          stepNumber: 4,
          title: 'Metabolic Clearance',
          description: 'The lymphatic system naturally processes and permanently flushes the dissolved fat lipids out of your body.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 4 • 3-4 Weeks',
          duration: '3-4 Weeks',
          focusArea: 'Lymphatic Drainage Pathway'
        }
      ]
    }
  },
  defaultSteps: [
    {
      id: 'default-1',
      stepNumber: 1,
      title: 'Barrier Diagnosis',
      description: 'We analyze your skin barrier, hydration levels, and target goals to tailor an optimal aesthetic prescription.',
      image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
      phaseTag: 'Phase 1 • 10 mins',
      duration: '10 mins',
      focusArea: 'Epidermal Skin Barrier'
    },
    {
      id: 'default-2',
      stepNumber: 2,
      title: 'Custom Pre-Conditioning',
      description: 'Preparing the dermal matrix with premium medical-grade formulations specific to your skin health requirements.',
      image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
      phaseTag: 'Phase 2 • 15 mins',
      duration: '15 mins',
      focusArea: 'Cellular Hydration Prep'
    },
    {
      id: 'default-3',
      stepNumber: 3,
      title: 'Precision Protocol Phase',
      description: 'Administering the chosen targeted technologies or infusions under strict clinical safety parameters.',
      image: '/assets/aistudio/Sheet_Face_Mask_Vector_Illustration_-_Graphics_by_Canva_a7a34ce5.jpg',
      phaseTag: 'Phase 3 • 30 mins',
      duration: '30 mins',
      focusArea: 'Active Clinical Delivery'
    },
    {
      id: 'default-4',
      stepNumber: 4,
      title: 'Protective Bio-Shielding',
      description: 'Applying specialized regenerative formulations to soothe, seal, and maximize cellular rejuvenation.',
      image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
      phaseTag: 'Phase 4 • 10 mins',
      duration: '10 mins',
      focusArea: 'Barrier Seal & Defense'
    }
  ]
};

// Initialize databases if they don't exist
export function initializeAdminStore(): void {
  if (typeof window === 'undefined') return;
  if (!window.localStorage.getItem(CONSULTATIONS_KEY)) {
    setStorageItem(CONSULTATIONS_KEY, INITIAL_CONSULTATIONS);
  }
  if (!window.localStorage.getItem(APPOINTMENTS_KEY)) {
    setStorageItem(APPOINTMENTS_KEY, INITIAL_APPOINTMENTS);
  }
  if (!window.localStorage.getItem(INQUIRIES_KEY)) {
    setStorageItem(INQUIRIES_KEY, INITIAL_INQUIRIES);
  }
  if (!window.localStorage.getItem(HEADER_CONFIG_KEY)) {
    setStorageItem(HEADER_CONFIG_KEY, DEFAULT_HEADER_CONFIG);
  }
  if (!window.localStorage.getItem(HERO_CONFIG_KEY)) {
    setStorageItem(HERO_CONFIG_KEY, DEFAULT_HERO_CONFIG);
  }
  if (!window.localStorage.getItem(SPECIALIST_AREAS_CONFIG_KEY)) {
    setStorageItem(SPECIALIST_AREAS_CONFIG_KEY, DEFAULT_SPECIALIST_AREAS_CONFIG);
  }
  if (!window.localStorage.getItem(TREATMENTS_CONFIG_KEY)) {
    setStorageItem(TREATMENTS_CONFIG_KEY, DEFAULT_TREATMENTS_CONFIG);
  }
  if (!window.localStorage.getItem(GALLERY_CONFIG_KEY)) {
    setStorageItem(GALLERY_CONFIG_KEY, DEFAULT_GALLERY_CONFIG);
  }
  if (!window.localStorage.getItem(WHY_CHOOSE_US_CONFIG_KEY)) {
    setStorageItem(WHY_CHOOSE_US_CONFIG_KEY, DEFAULT_WHY_CHOOSE_US_CONFIG);
  }
  if (!window.localStorage.getItem(AWARDS_CONFIG_KEY)) {
    setStorageItem(AWARDS_CONFIG_KEY, DEFAULT_AWARDS_CONFIG);
  }
  if (!window.localStorage.getItem(LOCATIONS_CONFIG_KEY)) {
    setStorageItem(LOCATIONS_CONFIG_KEY, DEFAULT_LOCATIONS_CONFIG);
  }
  if (!window.localStorage.getItem(TEAM_LEADERSHIP_CONFIG_KEY)) {
    setStorageItem(TEAM_LEADERSHIP_CONFIG_KEY, DEFAULT_TEAM_LEADERSHIP_CONFIG);
  }
  if (!window.localStorage.getItem(PROCESS_CONFIG_KEY)) {
    setStorageItem(PROCESS_CONFIG_KEY, DEFAULT_PROCESS_CONFIG);
  }
  if (!window.localStorage.getItem(FACILITY_INTERIORS_CONFIG_KEY)) {
    setStorageItem(FACILITY_INTERIORS_CONFIG_KEY, DEFAULT_FACILITY_INTERIORS_CONFIG);
  }
  if (!window.localStorage.getItem(TESTIMONIALS_CONFIG_KEY)) {
    setStorageItem(TESTIMONIALS_CONFIG_KEY, DEFAULT_TESTIMONIALS_CONFIG);
  }
  if (!window.localStorage.getItem(SPECIAL_OFFERS_CONFIG_KEY)) {
    setStorageItem(SPECIAL_OFFERS_CONFIG_KEY, DEFAULT_SPECIAL_OFFERS_CONFIG);
  }
  if (!window.localStorage.getItem(CLINICAL_PROTOCOLS_CONFIG_KEY)) {
    setStorageItem(CLINICAL_PROTOCOLS_CONFIG_KEY, DEFAULT_CLINICAL_PROTOCOLS_CONFIG);
  }
  if (!window.localStorage.getItem(TREATMENT_TAXONOMY_KEY)) {
    setStorageItem(
      TREATMENT_TAXONOMY_KEY,
      getFileDefault<TreatmentTaxonomyGroup[]>(TREATMENT_TAXONOMY_KEY, DEFAULT_TREATMENT_TAXONOMY)
    );
  }
}

// CLINICAL PROTOCOL STORE METHODS (Customer & Admin Management)

const OFFICIAL_PRICING_CATEGORY_SET = new Set<string>(
  PRICING_CATEGORIES.filter((c) => c !== 'All Procedures')
);

const CORE_PROTOCOL_TAXONOMY_MAP: Record<
  string,
  { category: string; branchId: string; branchName: string }
> = {
  exosome: {
    category: 'Advanced Facials',
    branchId: 'medical-facials',
    branchName: 'Clinical & Medical Facials'
  },
  profhilo: {
    category: 'Face & Injectables',
    branchId: 'skin-boosters',
    branchName: 'Skin Boosters & Bioremodeling'
  },
  polynucleotide: {
    category: 'Face & Injectables',
    branchId: 'skin-boosters',
    branchName: 'Skin Boosters & Bioremodeling'
  },
  lip: {
    category: 'Face & Injectables',
    branchId: 'dermal-fillers',
    branchName: 'Dermal Fillers (1ml)'
  },
  blepharoplasty: {
    category: 'Face & Injectables',
    branchId: 'high-tech-lifting',
    branchName: 'High-Tech Lifting & Laser'
  },
  ultherapy: {
    category: 'Face & Injectables',
    branchId: 'high-tech-lifting',
    branchName: 'High-Tech Lifting & Laser'
  },
  morpheus8: {
    category: 'Face & Injectables',
    branchId: 'high-tech-lifting',
    branchName: 'High-Tech Lifting & Laser'
  },
  buttock: {
    category: 'Body Sculpting',
    branchId: 'body-contouring',
    branchName: 'Body Contouring & Fat Loss'
  },
  aqualyx: {
    category: 'Body Sculpting',
    branchId: 'fat-dissolving',
    branchName: 'Fat Dissolving Injections (Aqualyx & Deso)'
  }
};

/**
 * Normalizes any protocol group's category and branch fields so they match
 * PRICING_CATEGORIES and CLINICAL_AREAS_DB (even if loaded from older localStorage).
 */
export function normalizeProtocolGroupTaxonomy(
  key: string,
  group: TreatmentProtocolGroup
): TreatmentProtocolGroup {
  const normalizedKey = (key || group.id || '').toLowerCase().trim();

  // 1. Check direct mapping for the 9 core protocols
  if (CORE_PROTOCOL_TAXONOMY_MAP[normalizedKey]) {
    const mapped = CORE_PROTOCOL_TAXONOMY_MAP[normalizedKey];
    const hasOfficialCategory =
      group.category && OFFICIAL_PRICING_CATEGORY_SET.has(group.category);
    return {
      ...group,
      id: normalizedKey,
      category: hasOfficialCategory ? group.category : mapped.category,
      branchId: group.branchId || mapped.branchId,
      branchName: group.branchName || mapped.branchName
    };
  }

  // 2. Check CLINICAL_AREAS_DB for an exact treatment ID match
  const dbMatch = findTreatmentInDB(normalizedKey);
  if (dbMatch) {
    const resolvedCategory =
      dbMatch.category.id === 'iv-lounge-prp'
        ? 'IV Drip Lounge & Wellness'
        : dbMatch.area.name;
    return {
      ...group,
      id: normalizedKey,
      category:
        group.category && OFFICIAL_PRICING_CATEGORY_SET.has(group.category)
          ? group.category
          : resolvedCategory,
      branchId: group.branchId || dbMatch.category.id,
      branchName: group.branchName || dbMatch.category.name
    };
  }

  // 3. Check TREATMENT_PRICING_DATA for an exact ID match
  const pricingMatch = TREATMENT_PRICING_DATA.find(
    (item) => item.id.toLowerCase() === normalizedKey
  );
  if (pricingMatch) {
    return {
      ...group,
      id: normalizedKey,
      category:
        group.category && OFFICIAL_PRICING_CATEGORY_SET.has(group.category)
          ? group.category
          : pricingMatch.category
    };
  }

  // 4. Normalize legacy free-text category strings if not already in PRICING_CATEGORIES
  let normalizedCategory = group.category || 'Face & Injectables';
  if (!OFFICIAL_PRICING_CATEGORY_SET.has(normalizedCategory)) {
    const catLower = normalizedCategory.toLowerCase();
    if (catLower.includes('body') || catLower.includes('fat') || catLower.includes('glute')) {
      normalizedCategory = 'Body Sculpting';
    } else if (
      catLower.includes('facial') &&
      !catLower.includes('harmony') &&
      !catLower.includes('inject')
    ) {
      normalizedCategory = 'Advanced Facials';
    } else if (catLower.includes('iv') || catLower.includes('drip') || catLower.includes('wellness')) {
      normalizedCategory = 'IV Drip Lounge & Wellness';
    } else if (catLower.includes('hair') || catLower.includes('lash') || catLower.includes('brow') || catLower.includes('beauty')) {
      normalizedCategory = 'Hair & Beauty';
    } else if (catLower.includes('regenerative') && normalizedKey.includes('exo')) {
      normalizedCategory = 'Advanced Facials';
    } else {
      normalizedCategory = 'Face & Injectables';
    }
  }

  return {
    ...group,
    id: normalizedKey,
    category: normalizedCategory
  };
}

export function getClinicalProtocolsConfig(): ClinicalProtocolsConfig {
  initializeAdminStore();
  const stored = getStorageItem<ClinicalProtocolsConfig>(
    CLINICAL_PROTOCOLS_CONFIG_KEY,
    getFileDefault(CLINICAL_PROTOCOLS_CONFIG_KEY, DEFAULT_CLINICAL_PROTOCOLS_CONFIG)
  );

  if (!stored || !stored.protocols || typeof stored.protocols !== 'object') {
    return DEFAULT_CLINICAL_PROTOCOLS_CONFIG;
  }

  // Merge default treatments and normalize categories & branches
  const rawMerged: Record<string, TreatmentProtocolGroup> = {
    ...DEFAULT_CLINICAL_PROTOCOLS_CONFIG.protocols,
    ...stored.protocols
  };

  const mergedProtocols: Record<string, TreatmentProtocolGroup> = {};
  for (const [key, group] of Object.entries(rawMerged)) {
    if (group && typeof group === 'object') {
      mergedProtocols[key] = normalizeProtocolGroupTaxonomy(key, group);
    }
  }

  return {
    protocols: mergedProtocols,
    defaultSteps: Array.isArray(stored.defaultSteps) && stored.defaultSteps.length > 0
      ? stored.defaultSteps
      : DEFAULT_CLINICAL_PROTOCOLS_CONFIG.defaultSteps
  };
}

export function saveClinicalProtocolsConfig(config: ClinicalProtocolsConfig): ClinicalProtocolsConfig {
  setStorageItem(CLINICAL_PROTOCOLS_CONFIG_KEY, config);
  syncConfigToFile(CLINICAL_PROTOCOLS_CONFIG_KEY, config);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('clinical_protocols_updated', { detail: config }));
  }
  return config;
}

/**
 * Resolves the clinical protocol for any treatment ID across CLINICAL_AREAS_DB and TREATMENT_PRICING_DATA:
 * 1. Dedicated custom protocol if configured for that exact ID
 * 2. Parent family / branch protocol (e.g., filler-lips -> lip, aqualyx-small-single -> aqualyx, etc.)
 * 3. Default 4-step clinical protocol enriched with the treatment's actual name, category, and branch
 */
export function getClinicalProtocolByTreatmentId(treatmentId: string): TreatmentProtocolGroup {
  const config = getClinicalProtocolsConfig();
  const normalizedId = (treatmentId || '').toLowerCase().trim();

  // 1. Exact match in configured protocols
  if (normalizedId && config.protocols[normalizedId]) {
    return config.protocols[normalizedId];
  }

  // Lookup official metadata from CLINICAL_AREAS_DB or TREATMENT_PRICING_DATA if available
  const dbMatch = normalizedId ? findTreatmentInDB(normalizedId) : null;
  const pricingMatch = normalizedId
    ? TREATMENT_PRICING_DATA.find((item) => item.id.toLowerCase() === normalizedId)
    : undefined;

  const resolvedTitle =
    dbMatch?.item.name || pricingMatch?.title || undefined;
  const resolvedCategory = dbMatch
    ? dbMatch.category.id === 'iv-lounge-prp'
      ? 'IV Drip Lounge & Wellness'
      : dbMatch.area.name
    : pricingMatch?.category || 'Face & Injectables';
  const resolvedBranchId = dbMatch?.category.id;
  const resolvedBranchName = dbMatch?.category.name;

  // 2. Smart treatment family / keyword resolution
  const familyProtocolMap: Array<{ match: (id: string) => boolean; targetKey: string }> = [
    {
      match: (id) =>
        id.includes('profhilo') ||
        id.includes('seventy-hyal') ||
        id.includes('jalupro') ||
        id.includes('skin-booster'),
      targetKey: 'profhilo'
    },
    {
      match: (id) =>
        id.includes('polynucleotide') ||
        id.includes('salmon-sperm') ||
        id.includes('lumi-eyes') ||
        id.includes('illuma') ||
        id.includes('nucleofill'),
      targetKey: 'polynucleotide'
    },
    {
      match: (id) =>
        id.includes('lip') ||
        id.includes('filler') ||
        id.includes('contour-package') ||
        id.includes('rhinoplasty') ||
        id.includes('tear-trough') ||
        id.includes('cheek') ||
        id.includes('jawline') ||
        id.includes('chin'),
      targetKey: 'lip'
    },
    {
      match: (id) =>
        id.includes('morpheus') ||
        id.includes('rf-face') ||
        id.includes('rf-microneedling') ||
        id.includes('secret-rf'),
      targetKey: 'morpheus8'
    },
    {
      match: (id) =>
        id.includes('ultherapy') ||
        id.includes('hifu') ||
        id.includes('ultrasound') ||
        id.includes('endolift'),
      targetKey: 'ultherapy'
    },
    {
      match: (id) =>
        id.includes('blepharoplasty') ||
        id.includes('plasma') ||
        id.includes('eyelid') ||
        id.includes('plexr'),
      targetKey: 'blepharoplasty'
    },
    {
      match: (id) =>
        id.includes('aqualyx') ||
        id.includes('deso') ||
        id.includes('lemon-bottle') ||
        id.includes('fat-dissolv') ||
        id.includes('lipolysis'),
      targetKey: 'aqualyx'
    },
    {
      match: (id) =>
        id.includes('buttock') ||
        id.includes('hip-dip') ||
        id.includes('bbl') ||
        id.includes('lanluma') ||
        id.includes('sculptra-body') ||
        id.includes('cavitation') ||
        id.includes('body-contour'),
      targetKey: 'buttock'
    },
    {
      match: (id) =>
        id.includes('exosome') ||
        id.includes('microneedling') ||
        id.includes('hydrafacial') ||
        id.includes('biorepeel') ||
        id.includes('chemical-peel') ||
        id.includes('facial') ||
        id.includes('dermaplaning'),
      targetKey: 'exosome'
    }
  ];

  for (const rule of familyProtocolMap) {
    if (normalizedId && rule.match(normalizedId) && config.protocols[rule.targetKey]) {
      const baseGroup = config.protocols[rule.targetKey];
      return {
        ...baseGroup,
        name: resolvedTitle || baseGroup.name,
        category: resolvedCategory || baseGroup.category,
        branchId: resolvedBranchId || baseGroup.branchId,
        branchName: resolvedBranchName || baseGroup.branchName
      };
    }
  }

  // 3. Look for partial key match in config.protocols
  if (normalizedId) {
    for (const [key, group] of Object.entries(config.protocols)) {
      if (normalizedId.includes(key) || key.includes(normalizedId)) {
        return {
          ...group,
          name: resolvedTitle || group.name,
          category: resolvedCategory || group.category,
          branchId: resolvedBranchId || group.branchId,
          branchName: resolvedBranchName || group.branchName
        };
      }
    }
  }

  // 4. Branch-level fallback resolution if treatment belongs to a known CLINICAL_AREAS_DB branch
  if (resolvedBranchId) {
    const branchDefaultProtocolKey: Record<string, string> = {
      'skin-boosters': 'profhilo',
      'dermal-fillers': 'lip',
      'high-tech-lifting': 'morpheus8',
      'fat-dissolving': 'aqualyx',
      'body-contouring': 'buttock',
      'medical-facials': 'exosome'
    };

    const mappedKey = branchDefaultProtocolKey[resolvedBranchId];
    if (mappedKey && config.protocols[mappedKey]) {
      const branchGroup = config.protocols[mappedKey];
      return {
        ...branchGroup,
        id: normalizedId,
        name: resolvedTitle || branchGroup.name,
        category: resolvedCategory,
        branchId: resolvedBranchId,
        branchName: resolvedBranchName
      };
    }

    // Or check if any user-created protocol already targets this branchId
    const customBranchMatch = Object.values(config.protocols).find(
      (g) => g.branchId === resolvedBranchId
    );
    if (customBranchMatch) {
      return {
        ...customBranchMatch,
        id: normalizedId,
        name: resolvedTitle || customBranchMatch.name,
        category: resolvedCategory,
        branchId: resolvedBranchId,
        branchName: resolvedBranchName
      };
    }
  }

  // 5. Fallback to default 4-step clinical protocol with resolved treatment taxonomy
  return {
    id: normalizedId || 'general-protocol',
    name: resolvedTitle || 'Clinical Aesthetic Protocol',
    subtitle: resolvedBranchName
      ? `${resolvedBranchName} • Standardized Precision Procedure`
      : 'Standardized Precision Procedure',
    category: resolvedCategory,
    branchId: resolvedBranchId,
    branchName: resolvedBranchName,
    steps: config.defaultSteps,
    updatedAt: new Date().toISOString()
  };
}

export function saveClinicalProtocolForTreatment(
  treatmentId: string,
  group: TreatmentProtocolGroup
): ClinicalProtocolsConfig {
  const current = getClinicalProtocolsConfig();
  const normalizedId = (treatmentId || group.id || '').toLowerCase().trim();

  const updatedProtocols: Record<string, TreatmentProtocolGroup> = {
    ...current.protocols,
    [normalizedId]: {
      ...group,
      id: normalizedId,
      updatedAt: new Date().toISOString()
    }
  };

  const updatedConfig: ClinicalProtocolsConfig = {
    ...current,
    protocols: updatedProtocols
  };

  return saveClinicalProtocolsConfig(updatedConfig);
}

export function resetClinicalProtocolsToDefault(): ClinicalProtocolsConfig {
  return saveClinicalProtocolsConfig(DEFAULT_CLINICAL_PROTOCOLS_CONFIG);
}


// CONSULTATION METHODS
export function getConsultations(): ConsultationRequest[] {
  initializeAdminStore();
  return getStorageItem<ConsultationRequest[]>(CONSULTATIONS_KEY, []);
}

export function saveConsultation(consultation: Omit<ConsultationRequest, 'id' | 'status' | 'createdAt'>): ConsultationRequest {
  const consultations = getConsultations();
  const newConsultation: ConsultationRequest = {
    ...consultation,
    id: `con-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  const updated = [newConsultation, ...consultations];
  setStorageItem(CONSULTATIONS_KEY, updated);
  return newConsultation;
}

export function updateConsultationStatus(id: string, status: ConsultationRequest['status']): ConsultationRequest[] {
  const consultations = getConsultations();
  const updated = consultations.map(item => 
    item.id === id ? { ...item, status } : item
  );
  setStorageItem(CONSULTATIONS_KEY, updated);
  return updated;
}

export function updateConsultationNotes(id: string, notes: string): ConsultationRequest[] {
  const consultations = getConsultations();
  const updated = consultations.map(item => 
    item.id === id ? { ...item, internalNotes: notes } : item
  );
  setStorageItem(CONSULTATIONS_KEY, updated);
  return updated;
}

export function deleteConsultation(id: string): ConsultationRequest[] {
  const consultations = getConsultations();
  const updated = consultations.filter(item => item.id !== id);
  setStorageItem(CONSULTATIONS_KEY, updated);
  return updated;
}


// APPOINTMENT METHODS
export function getAppointments(): DoctorAppointmentRecord[] {
  initializeAdminStore();
  return getStorageItem<DoctorAppointmentRecord[]>(APPOINTMENTS_KEY, []);
}

export function saveAppointment(appointment: Omit<DoctorAppointmentRecord, 'id' | 'status' | 'createdAt'>): DoctorAppointmentRecord {
  const appointments = getAppointments();
  const newAppointment: DoctorAppointmentRecord = {
    ...appointment,
    id: `apt-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'reserved',
    createdAt: new Date().toISOString()
  };
  const updated = [newAppointment, ...appointments];
  setStorageItem(APPOINTMENTS_KEY, updated);
  return newAppointment;
}

export function updateAppointmentStatus(id: string, status: DoctorAppointmentRecord['status']): DoctorAppointmentRecord[] {
  const appointments = getAppointments();
  const updated = appointments.map(item => 
    item.id === id ? { ...item, status } : item
  );
  setStorageItem(APPOINTMENTS_KEY, updated);
  return updated;
}

export function updateAppointmentNotes(id: string, notes: string): DoctorAppointmentRecord[] {
  const appointments = getAppointments();
  const updated = appointments.map(item => 
    item.id === id ? { ...item, internalNotes: notes } : item
  );
  setStorageItem(APPOINTMENTS_KEY, updated);
  return updated;
}

export function deleteAppointment(id: string): DoctorAppointmentRecord[] {
  const appointments = getAppointments();
  const updated = appointments.filter(item => item.id !== id);
  setStorageItem(APPOINTMENTS_KEY, updated);
  return updated;
}


// INQUIRY METHODS
export function getInquiries(): InquiryMessage[] {
  initializeAdminStore();
  return getStorageItem<InquiryMessage[]>(INQUIRIES_KEY, []);
}

export function saveInquiry(inquiry: Omit<InquiryMessage, 'id' | 'isRead' | 'createdAt'>): InquiryMessage {
  const inquiries = getInquiries();
  const newInquiry: InquiryMessage = {
    ...inquiry,
    id: `inq-${Math.floor(100000 + Math.random() * 900000)}`,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  const updated = [newInquiry, ...inquiries];
  setStorageItem(INQUIRIES_KEY, updated);
  return newInquiry;
}

export function markInquiryAsRead(id: string, isRead = true): InquiryMessage[] {
  const inquiries = getInquiries();
  const updated = inquiries.map(item => 
    item.id === id ? { ...item, isRead } : item
  );
  setStorageItem(INQUIRIES_KEY, updated);
  return updated;
}

export function deleteInquiry(id: string): InquiryMessage[] {
  const inquiries = getInquiries();
  const updated = inquiries.filter(item => item.id !== id);
  setStorageItem(INQUIRIES_KEY, updated);
  return updated;
}

// Reset/Seed Database Utility
export function resetAdminStoreToDefaults(): void {
  setStorageItem(CONSULTATIONS_KEY, INITIAL_CONSULTATIONS);
  setStorageItem(APPOINTMENTS_KEY, INITIAL_APPOINTMENTS);
  setStorageItem(INQUIRIES_KEY, INITIAL_INQUIRIES);
  setStorageItem(HEADER_CONFIG_KEY, DEFAULT_HEADER_CONFIG);
  setStorageItem(HERO_CONFIG_KEY, DEFAULT_HERO_CONFIG);
  setStorageItem(SPECIALIST_AREAS_CONFIG_KEY, DEFAULT_SPECIALIST_AREAS_CONFIG);
  setStorageItem(TREATMENTS_CONFIG_KEY, DEFAULT_TREATMENTS_CONFIG);
  setStorageItem(GALLERY_CONFIG_KEY, DEFAULT_GALLERY_CONFIG);
  setStorageItem(WHY_CHOOSE_US_CONFIG_KEY, DEFAULT_WHY_CHOOSE_US_CONFIG);
  setStorageItem(AWARDS_CONFIG_KEY, DEFAULT_AWARDS_CONFIG);
  setStorageItem(LOCATIONS_CONFIG_KEY, DEFAULT_LOCATIONS_CONFIG);
  setStorageItem(TEAM_LEADERSHIP_CONFIG_KEY, DEFAULT_TEAM_LEADERSHIP_CONFIG);
  setStorageItem(PROCESS_CONFIG_KEY, DEFAULT_PROCESS_CONFIG);
  setStorageItem(FACILITY_INTERIORS_CONFIG_KEY, DEFAULT_FACILITY_INTERIORS_CONFIG);
  setStorageItem(TESTIMONIALS_CONFIG_KEY, DEFAULT_TESTIMONIALS_CONFIG);
  setStorageItem(SPECIAL_OFFERS_CONFIG_KEY, DEFAULT_SPECIAL_OFFERS_CONFIG);

  if (!window.localStorage.getItem(SKINCARE_COLLECTION_CONFIG_KEY)) {
    setStorageItem(SKINCARE_COLLECTION_CONFIG_KEY, DEFAULT_SKINCARE_COLLECTION_CONFIG);
  }
  if (!window.localStorage.getItem(TRUST_BRANDS_CONFIG_KEY)) {
    setStorageItem(TRUST_BRANDS_CONFIG_KEY, DEFAULT_TRUST_BRANDS_CONFIG);
  }
  if (!window.localStorage.getItem(ACCREDITATIONS_CONFIG_KEY)) {
    setStorageItem(ACCREDITATIONS_CONFIG_KEY, DEFAULT_ACCREDITATIONS_CONFIG);
  }
  if (!window.localStorage.getItem(LATEST_NEWS_CONFIG_KEY)) {
    setStorageItem(LATEST_NEWS_CONFIG_KEY, DEFAULT_LATEST_NEWS_CONFIG);
  }
  if (!window.localStorage.getItem(FOOTER_CONFIG_KEY)) {
    setStorageItem(FOOTER_CONFIG_KEY, DEFAULT_FOOTER_CONFIG);
  }
  if (!window.localStorage.getItem(FLOATING_MENU_CONFIG_KEY)) {
    setStorageItem(FLOATING_MENU_CONFIG_KEY, DEFAULT_FLOATING_MENU_CONFIG);
  }
  setStorageItem(PROFILE_PAGE_CONFIG_KEY, DEFAULT_PROFILE_PAGE_CONFIG);
}

// HOMEPAGE EDIT METHODS
export function getHeaderConfig(): HeaderConfig {
  initializeAdminStore();
  return getStorageItem<HeaderConfig>(HEADER_CONFIG_KEY, getFileDefault(HEADER_CONFIG_KEY, DEFAULT_HEADER_CONFIG));
}

export function saveHeaderConfig(config: HeaderConfig): HeaderConfig {
  setStorageItem(HEADER_CONFIG_KEY, config);
  return config;
}

export function getHeroConfig(): HeroConfig {
  initializeAdminStore();
  return getStorageItem<HeroConfig>(HERO_CONFIG_KEY, getFileDefault(HERO_CONFIG_KEY, DEFAULT_HERO_CONFIG));
}

export function saveHeroConfig(config: HeroConfig): HeroConfig {
  setStorageItem(HERO_CONFIG_KEY, config);
  return config;
}

const DEFAULT_MASTER_SERVICES_BY_ID = new Map(
  ALL_SPECIALIST_TREATMENTS.map((item) => [item.id, item])
);

export function normalizeMasterBranch(branch?: string, title?: string): MasterBranchCategory {
  const cleaned = (branch || '').trim();
  if ((MASTER_BRANCH_CATEGORIES as string[]).includes(cleaned)) {
    return cleaned as MasterBranchCategory;
  }
  const lower = `${cleaned} ${title || ''}`.toLowerCase();
  if (lower.includes('iv') || lower.includes('drip') || lower.includes('prp') || lower.includes('plasma') || lower.includes('wellness')) {
    return 'IV Drips & Wellness';
  }
  if (lower.includes('aqualyx') || lower.includes('deso') || lower.includes('slimming') || lower.includes('emscuplt') || lower.includes('emsculpt') || lower.includes('cellulite') || lower.includes('body sculpt')) {
    return 'Body Sculpting';
  }
  if (lower.includes('facial skin') || lower.includes('advanced facial')) {
    return 'Advanced Facials';
  }
  if (
    lower.includes('lash') ||
    lower.includes('eyebrow') ||
    lower.includes('wax') ||
    lower.includes('cut') ||
    lower.includes('collor') ||
    lower.includes('men') ||
    lower.includes('kid') ||
    lower.includes('semi-permanent') ||
    lower.includes('tattoo') ||
    lower.includes('hair') ||
    lower.includes('beauty')
  ) {
    return 'Hair & Beauty';
  }
  return 'Face & Injectables';
}

export function inferTransformationCategoryFromBranch(
  branch: MasterBranchCategory | string,
  title?: string
): TransformationCategorySlug {
  const normalizedBranch = normalizeMasterBranch(branch, title);
  const lowerTitle = (title || '').toLowerCase();
  if (normalizedBranch === 'Body Sculpting') return 'body-sculpting';
  if (normalizedBranch === 'Advanced Facials') return 'advanced-facials';
  if (normalizedBranch === 'Hair & Beauty') return 'clinical-hair';
  if (normalizedBranch === 'IV Drips & Wellness') {
    return lowerTitle.includes('prp') || lowerTitle.includes('plasma') ? 'clinical-hair' : 'anti-aging';
  }
  if (lowerTitle.includes('laser') || lowerTitle.includes('scar')) return 'acne-scarring';
  if (lowerTitle.includes('filler') || lowerTitle.includes('semi-permanent')) return 'facial-harmony';
  return 'anti-aging';
}

export function normalizeSpecialistServiceItem(raw: SpecialistArea, idx = 0): SpecialistArea {
  const fallback =
    DEFAULT_MASTER_SERVICES_BY_ID.get(raw.id) ||
    ALL_SPECIALIST_TREATMENTS.find((t) => t.title.toLowerCase() === (raw.title || '').toLowerCase().trim());

  const cleanTitle = (raw.title || fallback?.title || `Service ${idx + 1}`).trim();
  const cleanId =
    (raw.id || '').trim() ||
    cleanTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') ||
    `service-${idx + 1}`;

  const pricingCategory = normalizeMasterBranch(
    raw.pricingCategory || fallback?.pricingCategory || raw.category,
    cleanTitle
  );
  const transformationCategory =
    raw.transformationCategory ||
    fallback?.transformationCategory ||
    inferTransformationCategoryFromBranch(pricingCategory, cleanTitle);

  const resolvedImage =
    raw.image ||
    fallback?.image ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ';

  return {
    ...fallback,
    ...raw,
    id: cleanId,
    title: cleanTitle,
    description:
      raw.description ||
      fallback?.description ||
      `Bespoke ${cleanTitle} protocol performed at Age Reversal Clinic.`,
    image: resolvedImage,
    coverMedia:
      raw.coverMedia || fallback?.coverMedia
        ? {
            ...(fallback?.coverMedia || {
              mediaType: 'image',
              altText: `${cleanTitle} clinical aesthetic treatment at Age Reversal Clinic`,
              seoTitle: `${cleanTitle} - Specialist Care`,
              seoKeywords: [`${cleanTitle.toLowerCase()} london`],
            }),
            ...(raw.coverMedia || {}),
            url: resolvedImage,
          }
        : undefined,
    pricingCategory,
    transformationCategory,
    category: raw.category || pricingCategory,
    duration: raw.duration || fallback?.duration || '45 Mins',
    price: raw.price || '',
    icon: raw.icon || fallback?.icon || 'Sparkles',
    seoKeywords:
      raw.seoKeywords && raw.seoKeywords.length > 0
        ? raw.seoKeywords
        : fallback?.seoKeywords || [`${cleanTitle.toLowerCase()} london`, pricingCategory.toLowerCase()],
  };
}

export function getMasterServices(): SpecialistArea[] {
  initializeAdminStore();
  const storedMaster = getStorageItem<SpecialistArea[] | null>(
    MASTER_SERVICES_CONFIG_KEY,
    getFileDefault<SpecialistArea[] | null>(MASTER_SERVICES_CONFIG_KEY, null)
  );

  if (Array.isArray(storedMaster) && storedMaster.length > 0) {
    return storedMaster.map((item, idx) => normalizeSpecialistServiceItem(item, idx));
  }

  const storedSpec = getStorageItem<SpecialistAreasConfig>(
    SPECIALIST_AREAS_CONFIG_KEY,
    getFileDefault(SPECIALIST_AREAS_CONFIG_KEY, DEFAULT_SPECIALIST_AREAS_CONFIG)
  );
  const legacyIds = new Set([
    'face',
    'skin',
    'body',
    'hair',
    'facial-injectables',
    'skin-rejuvenation',
    'body-contouring',
    'hair-restoration'
  ]);
  const isLegacyAreas =
    !storedSpec?.areas ||
    storedSpec.areas.length <= 4 ||
    storedSpec.areas.every((a) => legacyIds.has(a.id));

  const sourceList = isLegacyAreas ? DEFAULT_SPECIALIST_AREAS_CONFIG.areas : storedSpec.areas;
  return sourceList.map((item, idx) => normalizeSpecialistServiceItem(item, idx));
}

export function getMasterServicesByBranch(): Record<MasterBranchCategory, SpecialistArea[]> {
  const services = getMasterServices();
  const grouped: Record<MasterBranchCategory, SpecialistArea[]> = {
    'Face & Injectables': [],
    'Body Sculpting': [],
    'Advanced Facials': [],
    'Hair & Beauty': [],
    'IV Drips & Wellness': []
  };

  for (const service of services) {
    const branch = normalizeMasterBranch(service.pricingCategory, service.title);
    grouped[branch].push(service);
  }
  return grouped;
}

export function saveMasterServices(
  services: SpecialistArea[],
  options?: { heading?: string; description?: string }
): SpecialistArea[] {
  const normalizedServices = services.map((item, idx) => normalizeSpecialistServiceItem(item, idx));

  // 1. Persist Master Services store
  setStorageItem(MASTER_SERVICES_CONFIG_KEY, normalizedServices);
  syncConfigToFile(MASTER_SERVICES_CONFIG_KEY, normalizedServices);

  // 2. Auto-sync Homepage: Specialist Areas (homepage_specialist_areas_config_v4)
  const currentSpec = getStorageItem<SpecialistAreasConfig>(
    SPECIALIST_AREAS_CONFIG_KEY,
    DEFAULT_SPECIALIST_AREAS_CONFIG
  );
  const nextSpecConfig: SpecialistAreasConfig = {
    heading: options?.heading ?? currentSpec?.heading ?? DEFAULT_SPECIALIST_AREAS_CONFIG.heading,
    description: options?.description ?? currentSpec?.description ?? DEFAULT_SPECIALIST_AREAS_CONFIG.description,
    areas: normalizedServices
  };
  setStorageItem(SPECIALIST_AREAS_CONFIG_KEY, nextSpecConfig);
  syncConfigToFile(SPECIALIST_AREAS_CONFIG_KEY, nextSpecConfig);

  // 3. Auto-sync Homepage: Treatments metadata (keeping Treatments card images, imageAlt, seoTitle & seoKeywords 100% decoupled from Services & Branches)
  const currentTreatConfig = getStorageItem<TreatmentsConfig>(
    TREATMENTS_CONFIG_KEY,
    getFileDefault(TREATMENTS_CONFIG_KEY, DEFAULT_TREATMENTS_CONFIG)
  );
  const serviceBySubId = new Map(normalizedServices.map((s) => [s.id, s]));
  const currentSourceCards =
    currentTreatConfig?.treatments && currentTreatConfig.treatments.length > normalizedServices.length
      ? currentTreatConfig.treatments
      : DEFAULT_TREATMENTS_CONFIG.treatments;
  const existingTreatById = new Map(
    (currentTreatConfig?.treatments || []).map((t) => [t.id, t])
  );

  const nextTreatments: Treatment[] = currentSourceCards.map((card, idx) => {
    const projected = projectHomepageTreatmentCard(card, idx);
    const prev = existingTreatById.get(projected.id) || existingTreatById.get(projected.subGroupId);
    const matchedSubService = serviceBySubId.get(projected.subGroupId);
    const resolvedTag = matchedSubService
      ? normalizeMasterBranch(matchedSubService.pricingCategory || matchedSubService.category, matchedSubService.title)
      : projected.tag;
    const resolvedSubCategory = matchedSubService ? matchedSubService.title : projected.subCategory;

    return projectHomepageTreatmentCard(
      {
        ...projected,
        tag: resolvedTag,
        subGroupId: projected.subGroupId,
        subCategory: resolvedSubCategory,
        image: prev?.image || projected.image,
        imageAlt: prev?.imageAlt || projected.imageAlt,
        seoTitle: prev?.seoTitle || projected.seoTitle,
        seoKeywords:
          prev?.seoKeywords && prev.seoKeywords.length > 0
            ? prev.seoKeywords
            : projected.seoKeywords,
      },
      idx
    );
  });
  const nextTreatConfig: TreatmentsConfig = {
    editorialHeading: currentTreatConfig?.editorialHeading || DEFAULT_TREATMENTS_CONFIG.editorialHeading,
    editorialSub: currentTreatConfig?.editorialSub || DEFAULT_TREATMENTS_CONFIG.editorialSub,
    description: currentTreatConfig?.description || DEFAULT_TREATMENTS_CONFIG.description,
    seoKeywords:
      currentTreatConfig?.seoKeywords && currentTreatConfig.seoKeywords.length > 0
        ? currentTreatConfig.seoKeywords
        : DEFAULT_TREATMENTS_CONFIG.seoKeywords,
    treatments: nextTreatments
  };
  setStorageItem(TREATMENTS_CONFIG_KEY, nextTreatConfig);
  syncConfigToFile(TREATMENTS_CONFIG_KEY, nextTreatConfig);

  // 4. Auto-sync Homepage: Before & After Groups (homepage_gallery_config_v6)
  const currentGallery = getBeforeAfterGalleryConfig();
  const existingPairsByGroupId = new Map(
    (currentGallery?.categories || []).map((c) => [c.id, c.pairs || []])
  );
  const nextGalleryConfig: BeforeAfterGalleryConfig = {
    heading: currentGallery?.heading || DEFAULT_GALLERY_CONFIG.heading,
    description: currentGallery?.description || DEFAULT_GALLERY_CONFIG.description,
    categories: normalizedServices.map((item) => {
      const existingPairs =
        existingPairsByGroupId.get(item.id) ||
        (DEFAULT_GALLERY_PAIRS_BY_GROUP[item.id] ? [...DEFAULT_GALLERY_PAIRS_BY_GROUP[item.id]] : []);
      return {
        id: item.id,
        name: item.title,
        pairs: existingPairs.map((p) => ({
          ...p,
          treatmentGroupId: item.id as any,
          linkedTreatmentId: p.linkedTreatmentId || item.id,
          linkedTreatmentTitle: item.title
        }))
      };
    })
  };
  setStorageItem(GALLERY_CONFIG_KEY, nextGalleryConfig);
  syncConfigToFile(GALLERY_CONFIG_KEY, nextGalleryConfig);

  // 5. Auto-sync Pricing Catalog Categories if a matching service's parent branch was reassigned
  try {
    const pricingData = getTreatmentPricingData();
    let pricingChanged = false;
    const byId = new Map(normalizedServices.map((s) => [s.id.toLowerCase(), s]));
    const byTitle = new Map(normalizedServices.map((s) => [s.title.toLowerCase(), s]));

    const updatedPricing = pricingData.map((pItem) => {
      const matchedService =
        byId.get(pItem.id.toLowerCase()) || byTitle.get(pItem.title.toLowerCase());
      if (matchedService && matchedService.pricingCategory) {
        const targetCategory = normalizeMasterBranch(
          matchedService.pricingCategory,
          matchedService.title
        );
        if (pItem.category !== targetCategory || pItem.title !== matchedService.title) {
          pricingChanged = true;
          return {
            ...pItem,
            title: matchedService.title,
            category: targetCategory as any
          };
        }
      }
      return pItem;
    });

    if (pricingChanged) {
      saveTreatmentPricingData(updatedPricing);
    }
  } catch (err) {
    console.warn('Could not sync master service branch changes to pricing data:', err);
  }

  // 6. Auto-sync Treatment Taxonomy from Master Services (unless triggered by saveTreatmentTaxonomy)
  if (!_isSyncingTaxonomyAndServices) {
    try {
      _isSyncingTaxonomyAndServices = true;
      const existingRawTax = getStorageItem<TreatmentTaxonomyGroup[] | null>(TREATMENT_TAXONOMY_KEY, null);
      const syncedTaxonomy = buildTaxonomyFromMasterServices(normalizedServices, existingRawTax || undefined);
      setStorageItem(TREATMENT_TAXONOMY_KEY, syncedTaxonomy);
      syncConfigToFile(TREATMENT_TAXONOMY_KEY, syncedTaxonomy);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('treatment_taxonomy_updated', { detail: syncedTaxonomy }));
      }
    } catch (err) {
      console.warn('Could not sync master services to treatment taxonomy:', err);
    } finally {
      _isSyncingTaxonomyAndServices = false;
    }
  }

  // 7. Dispatch live events so Header, SpecialistAreas, Treatments, BeforeAfterGallery & Transformations update immediately
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('master_services_updated', {
        detail: {
          services: normalizedServices,
          byBranch: getMasterServicesByBranch()
        }
      })
    );
    window.dispatchEvent(new CustomEvent('specialist_areas_updated', { detail: nextSpecConfig }));
    window.dispatchEvent(new CustomEvent('treatments_config_updated', { detail: nextTreatConfig }));
    window.dispatchEvent(new CustomEvent('gallery_config_updated', { detail: nextGalleryConfig }));
  }

  return normalizedServices;
}

export function resetMasterServicesToDefaults(): SpecialistArea[] {
  const defaults = DEFAULT_SPECIALIST_AREAS_CONFIG.areas.map((item, idx) =>
    normalizeSpecialistServiceItem(item, idx)
  );
  return saveMasterServices(defaults, {
    heading: DEFAULT_SPECIALIST_AREAS_CONFIG.heading,
    description: DEFAULT_SPECIALIST_AREAS_CONFIG.description
  });
}

export function getSpecialistAreasConfig(): SpecialistAreasConfig {
  initializeAdminStore();
  const stored = getStorageItem<SpecialistAreasConfig>(
    SPECIALIST_AREAS_CONFIG_KEY,
    getFileDefault(SPECIALIST_AREAS_CONFIG_KEY, DEFAULT_SPECIALIST_AREAS_CONFIG)
  );
  const masterAreas = getMasterServices();
  return {
    heading: stored?.heading || DEFAULT_SPECIALIST_AREAS_CONFIG.heading,
    description: stored?.description || DEFAULT_SPECIALIST_AREAS_CONFIG.description,
    areas: masterAreas
  };
}

export function saveSpecialistAreasConfig(config: SpecialistAreasConfig): SpecialistAreasConfig {
  const syncedAreas = saveMasterServices(config.areas || [], {
    heading: config.heading,
    description: config.description
  });
  return {
    heading: config.heading,
    description: config.description,
    areas: syncedAreas
  };
}

export interface HomepageTreatmentCardItem {
  id: string;
  name: string;
  stepNumber: string;
  tag: string;
  subGroupId: string;
  subCategory: string;
  duration: string;
  description: string;
  image: string;
  imageAlt: string;
  seoTitle: string;
  seoKeywords: string[];
}

export interface HomepageTreatmentsQueryParams {
  page?: number;
  offset?: number;
  limit?: number;
  tag?: string;
  category?: string;
  subGroupId?: string;
  subCategory?: string;
  search?: string;
}

export interface PaginatedHomepageTreatmentsResponse {
  items: HomepageTreatmentCardItem[];
  totalCount: number;
  hasMore: boolean;
  page: number;
  totalPages: number;
  offset: number;
  limit: number;
  sectionMeta: {
    editorialHeading: string;
    editorialSub: string;
    description: string;
    seoKeywords: string[];
  };
}

const DEFAULT_TREATMENT_SEEDS_BY_ID = new Map(
  DEFAULT_TREATMENTS_CONFIG.treatments.map((t) => [t.id, t])
);

/**
 * Exact Column Projection for Homepage Treatments Bento Cards:
 * Projects ONLY the needed card & SEO columns (id, name, stepNumber, tag, subGroupId, subCategory, duration, description, image, imageAlt, seoTitle, seoKeywords)
 * so no excess package or gallery fields are fetched or stored.
 */
export function projectHomepageTreatmentCard(
  raw: Partial<Treatment> & {
    title?: string;
    pricingCategory?: string;
    category?: string;
    procedureTime?: string;
    badge?: string;
  },
  idx: number = 0
): HomepageTreatmentCardItem {
  const rawId = (raw?.id || '').trim();
  const rawName = (raw?.name || raw?.title || '').trim();
  const seed =
    (rawId ? DEFAULT_TREATMENT_SEEDS_BY_ID.get(rawId) : undefined) ||
    DEFAULT_TREATMENTS_CONFIG.treatments.find(
      (t) => t.name.toLowerCase() === rawName.toLowerCase()
    );

  const cleanName = rawName || seed?.name || `Treatment ${idx + 1}`;
  const cleanId =
    rawId ||
    seed?.id ||
    cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') ||
    `treatment-${idx + 1}`;

  const inferred = inferTreatmentSubGroup({
    id: cleanId,
    title: cleanName,
    category: raw?.tag || raw?.pricingCategory || raw?.category || seed?.tag,
    badge: raw?.subCategory || raw?.badge,
  });

  const cleanSubGroupId = (raw?.subGroupId || seed?.subGroupId || inferred.subGroupId || '').trim();
  const specialistSub = DEFAULT_SPECIALIST_BY_ID.get(cleanSubGroupId);
  const cleanSubCategory = (
    raw?.subCategory ||
    seed?.subCategory ||
    specialistSub?.title ||
    inferred.subCategory ||
    cleanName
  ).trim();

  const cleanTag = normalizeMasterBranch(
    raw?.tag ||
      raw?.pricingCategory ||
      raw?.category ||
      seed?.tag ||
      specialistSub?.pricingCategory ||
      inferred.parentCategory,
    cleanSubCategory || cleanName
  );
  const cleanStepNumber = (raw?.stepNumber || String(idx + 1).padStart(2, '0')).trim();
  const cleanDuration = (
    raw?.duration ||
    raw?.procedureTime ||
    seed?.duration ||
    specialistSub?.duration ||
    '45 - 60 Mins'
  ).trim();
  const cleanDescription = (
    raw?.description ||
    seed?.description ||
    specialistSub?.description ||
    `Bespoke ${cleanName} clinical protocol tailored at Age Reversal Clinic.`
  ).trim();

  const rawImgCandidate = (raw?.image || '').trim();
  const cleanRawImg =
    rawImgCandidate && !rawImgCandidate.includes('unsplash.com') ? rawImgCandidate : '';
  const cleanImage = (
    cleanRawImg ||
    seed?.image ||
    specialistSub?.image ||
    '/assets/images/treatments/specialist-profhilo.jpg'
  ).trim();

  const cleanImageAlt = (
    raw?.imageAlt ||
    seed?.imageAlt ||
    `${cleanName} — ${cleanSubCategory} (${cleanTag}) at Age Reversal Clinic London`
  ).trim();
  const cleanSeoTitle = (
    raw?.seoTitle ||
    seed?.seoTitle ||
    `${cleanName} | ${cleanSubCategory} — Age Reversal Clinic`
  ).trim();

  const candidateKeywords =
    Array.isArray(raw?.seoKeywords) && raw.seoKeywords.length > 0
      ? raw.seoKeywords
      : Array.isArray(seed?.seoKeywords) && seed.seoKeywords.length > 0
      ? seed.seoKeywords
      : [
          cleanName.toLowerCase(),
          cleanSubCategory.toLowerCase(),
          cleanTag.toLowerCase(),
          `${cleanName.toLowerCase()} london`,
          'age reversal clinic treatment',
          'medical aesthetics london',
        ];

  const cleanSeoKeywords = Array.from(
    new Set(
      candidateKeywords
        .map((k) => String(k || '').trim())
        .filter(Boolean)
    )
  );

  return {
    id: cleanId,
    name: cleanName,
    stepNumber: cleanStepNumber,
    tag: cleanTag,
    subGroupId: cleanSubGroupId,
    subCategory: cleanSubCategory,
    duration: cleanDuration,
    description: cleanDescription,
    image: cleanImage,
    imageAlt: cleanImageAlt,
    seoTitle: cleanSeoTitle,
    seoKeywords: cleanSeoKeywords,
  };
}

export function getTreatmentsConfig(): TreatmentsConfig {
  initializeAdminStore();
  const stored = getStorageItem<TreatmentsConfig>(
    TREATMENTS_CONFIG_KEY,
    getFileDefault(TREATMENTS_CONFIG_KEY, DEFAULT_TREATMENTS_CONFIG)
  );

  // Dynamically load active taxonomy for parent branch metadata
  const activeTaxonomy = getTreatmentTaxonomy();
  const subGroupMetaById = new Map<string, { subCategory: string; parentBranch: string }>();
  for (const branch of activeTaxonomy) {
    for (const sub of branch.subGroups || []) {
      subGroupMetaById.set(sub.id.toLowerCase(), {
        subCategory: sub.name,
        parentBranch: branch.name,
      });
    }
  }

  // Base source cards are strictly the standalone visual image cards (completely decoupled from treatment pricing)
  const defaultCards = DEFAULT_TREATMENTS_CONFIG.treatments || [];
  const storedTreatments = Array.isArray(stored?.treatments) ? stored.treatments : [];

  const storedById = new Map<string, Treatment>();
  for (const t of storedTreatments) {
    if (t && t.id) {
      storedById.set(String(t.id).trim().toLowerCase(), t);
    }
  }

  // Build the standalone image cards, merging any custom WebP images & SEO metadata saved by admin
  const standaloneCards: HomepageTreatmentCardItem[] = defaultCards.map((baseItem, idx) => {
    const cleanId = String(baseItem.id).trim().toLowerCase();
    const saved = storedById.get(cleanId);
    const taxMeta =
      subGroupMetaById.get(cleanId) ||
      (baseItem.subGroupId ? subGroupMetaById.get(baseItem.subGroupId.toLowerCase()) : undefined);

    const resolvedParentTag =
      saved?.tag ||
      taxMeta?.parentBranch ||
      normalizeMasterBranch(baseItem.tag || 'Face & Injectables', baseItem.name);
    const resolvedSubName =
      saved?.subCategory || taxMeta?.subCategory || baseItem.subCategory || baseItem.name;

    return projectHomepageTreatmentCard(
      {
        id: baseItem.id,
        name: saved?.name || baseItem.name,
        stepNumber: String(idx + 1).padStart(2, '0'),
        tag: resolvedParentTag,
        subGroupId: baseItem.subGroupId || baseItem.id,
        subCategory: resolvedSubName,
        duration: saved?.duration || baseItem.duration || '45 Mins',
        description: saved?.description || baseItem.description || '',
        image: saved?.image || baseItem.image,
        imageAlt: saved?.imageAlt || baseItem.imageAlt,
        seoTitle: saved?.seoTitle || baseItem.seoTitle,
        seoKeywords:
          saved?.seoKeywords && saved.seoKeywords.length > 0
            ? saved.seoKeywords
            : baseItem.seoKeywords,
      },
      idx
    );
  });

  return {
    editorialHeading: stored?.editorialHeading || DEFAULT_TREATMENTS_CONFIG.editorialHeading,
    editorialSub: stored?.editorialSub || DEFAULT_TREATMENTS_CONFIG.editorialSub,
    description: stored?.description || DEFAULT_TREATMENTS_CONFIG.description,
    seoKeywords:
      Array.isArray(stored?.seoKeywords) && stored.seoKeywords.length > 0
        ? stored.seoKeywords
        : DEFAULT_TREATMENTS_CONFIG.seoKeywords || [],
    treatments: standaloneCards,
  };
}

export function saveTreatmentsConfig(config: TreatmentsConfig): TreatmentsConfig {
  const projectedTreatments: Treatment[] = (config.treatments || []).map((item, idx) =>
    projectHomepageTreatmentCard(item, idx)
  );

  const normalizedConfig: TreatmentsConfig = {
    editorialHeading: config.editorialHeading || DEFAULT_TREATMENTS_CONFIG.editorialHeading,
    editorialSub: config.editorialSub || DEFAULT_TREATMENTS_CONFIG.editorialSub,
    description: config.description || DEFAULT_TREATMENTS_CONFIG.description,
    seoKeywords:
      Array.isArray(config.seoKeywords) && config.seoKeywords.length > 0
        ? Array.from(new Set(config.seoKeywords.map((k) => String(k || '').trim()).filter(Boolean)))
        : DEFAULT_TREATMENTS_CONFIG.seoKeywords || [],
    treatments: projectedTreatments,
  };

  setStorageItem(TREATMENTS_CONFIG_KEY, normalizedConfig);
  syncConfigToFile(TREATMENTS_CONFIG_KEY, normalizedConfig);

  if (typeof window !== 'undefined') {
    fetch('/api/admin/homepage-treatments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: normalizedConfig }),
    }).catch((err) => {
      console.warn('Could not sync Homepage Treatments config to server endpoint:', err);
    });

    // Register custom treatment card images in the Central Media Asset Library for Google Image SEO
    try {
      for (const item of projectedTreatments) {
        if (item.image && item.image.startsWith('/assets/treatments/')) {
          registerMediaAsset({
            name: item.seoTitle || item.name,
            url: item.image.split('?')[0],
            mediaType: 'image',
            category: 'Treatments',
            altText: item.imageAlt,
            seoKeywords: item.seoKeywords,
          });
        }
      }
    } catch {}

    window.dispatchEvent(
      new CustomEvent('treatments_config_updated', { detail: normalizedConfig })
    );
  }

  return normalizedConfig;
}

export function resetTreatmentsConfigToDefaults(): TreatmentsConfig {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(TREATMENTS_CONFIG_KEY);
  }
  return saveTreatmentsConfig(DEFAULT_TREATMENTS_CONFIG);
}

/**
 * Paginated & Exact-Column Projected Query for Homepage Treatments Bento Cards:
 * Projects ONLY (id, name, stepNumber, tag, subGroupId, subCategory, duration, description, image, imageAlt, seoTitle, seoKeywords)
 * and slices by page / offset / limit.
 */
export function getPaginatedHomepageTreatments(
  params: HomepageTreatmentsQueryParams = {}
): PaginatedHomepageTreatmentsResponse {
  const config = getTreatmentsConfig();
  const allCards = (config.treatments || []).map((item, idx) =>
    projectHomepageTreatmentCard(item, idx)
  );

  const tagFilter = (params.tag || params.category || '').trim();
  const subGroupFilter = (params.subGroupId || params.subCategory || '').trim().toLowerCase();
  const searchFilter = (params.search || '').trim().toLowerCase();

  const filtered = allCards.filter((card) => {
    if (
      tagFilter &&
      tagFilter !== 'ALL' &&
      tagFilter !== 'All' &&
      tagFilter !== 'All Procedures' &&
      card.tag.toLowerCase() !== tagFilter.toLowerCase()
    ) {
      return false;
    }
    if (
      subGroupFilter &&
      subGroupFilter !== 'all' &&
      card.subGroupId.toLowerCase() !== subGroupFilter &&
      card.subCategory.toLowerCase() !== subGroupFilter
    ) {
      return false;
    }
    if (searchFilter) {
      const hay = `${card.name} ${card.tag} ${card.subCategory} ${card.description} ${card.imageAlt} ${card.seoTitle} ${(card.seoKeywords || []).join(' ')}`.toLowerCase();
      if (!hay.includes(searchFilter)) return false;
    }
    return true;
  });

  const totalCount = filtered.length;
  const limit = params.limit !== undefined ? Math.max(1, params.limit) : 6;
  const page = params.page !== undefined ? Math.max(1, params.page) : 1;
  const offset = params.offset !== undefined ? Math.max(0, params.offset) : (page - 1) * limit;

  const items = filtered.slice(offset, offset + limit);
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const hasMore = offset + items.length < totalCount;

  return {
    items,
    totalCount,
    hasMore,
    page: Math.floor(offset / limit) + 1,
    totalPages,
    offset,
    limit,
    sectionMeta: {
      editorialHeading: config.editorialHeading,
      editorialSub: config.editorialSub,
      description: config.description,
      seoKeywords: config.seoKeywords || [],
    },
  };
}

/**
 * Remote Paginated & Exact-Column Projected Fetcher for Homepage Treatments:
 * Queries GET /api/admin/homepage-treatments with page, offset, limit, tag, subGroupId, and search,
 * falling back to getPaginatedHomepageTreatments when offline or when local edits exist.
 */
export async function fetchPaginatedHomepageTreatments(
  params: HomepageTreatmentsQueryParams = {}
): Promise<PaginatedHomepageTreatmentsResponse> {
  if (typeof window !== 'undefined' && window.localStorage.getItem(TREATMENTS_CONFIG_KEY)) {
    return getPaginatedHomepageTreatments(params);
  }

  const limit = params.limit !== undefined ? Math.max(1, params.limit) : 6;
  const page = params.page !== undefined ? Math.max(1, params.page) : 1;
  const offset = params.offset !== undefined ? Math.max(0, params.offset) : (page - 1) * limit;

  try {
    const qs = new URLSearchParams();
    qs.set('fields', 'card');
    qs.set('limit', String(limit));
    qs.set('offset', String(offset));
    qs.set('page', String(page));
    if (params.tag || params.category) {
      qs.set('tag', String(params.tag || params.category));
    }
    if (params.subGroupId || params.subCategory) {
      qs.set('subGroupId', String(params.subGroupId || params.subCategory));
    }
    if (params.search && params.search.trim()) {
      qs.set('search', params.search.trim());
    }

    const res = await fetch(`/api/admin/homepage-treatments?${qs.toString()}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.items || json.data)) {
        const rawItems = json.items || json.data;
        const cfg = json.config || getTreatmentsConfig();
        return {
          items: rawItems.map((item: any, idx: number) =>
            projectHomepageTreatmentCard(item, offset + idx)
          ),
          totalCount: typeof json.totalCount === 'number' ? json.totalCount : rawItems.length,
          hasMore: Boolean(json.hasMore),
          page: typeof json.page === 'number' ? json.page : page,
          totalPages:
            typeof json.totalPages === 'number'
              ? json.totalPages
              : Math.max(1, Math.ceil((json.totalCount || rawItems.length) / limit)),
          offset: typeof json.offset === 'number' ? json.offset : offset,
          limit: typeof json.limit === 'number' ? json.limit : limit,
          sectionMeta: {
            editorialHeading: cfg.editorialHeading || DEFAULT_TREATMENTS_CONFIG.editorialHeading,
            editorialSub: cfg.editorialSub || DEFAULT_TREATMENTS_CONFIG.editorialSub,
            description: cfg.description || DEFAULT_TREATMENTS_CONFIG.description,
            seoKeywords: Array.isArray(cfg.seoKeywords)
              ? cfg.seoKeywords
              : DEFAULT_TREATMENTS_CONFIG.seoKeywords || [],
          },
        };
      }
    }
  } catch (err) {
    console.warn('Falling back to local paginated Homepage Treatments:', err);
  }

  return getPaginatedHomepageTreatments(params);
}

export function syncBeforeAfterPairSeoToTreatments(pair: import('../types').BeforeAfterPair): void {
  if (!pair) return;

  const keywords = Array.from(
    new Set(
      (pair.seoKeywords || [])
        .map((k) => k.trim())
        .filter(Boolean)
    )
  );

  // 1. Register Before & After photos in the Central Media Asset Library for Google Image SEO tracking
  try {
    if (pair.beforeImage && !pair.beforeImage.includes('unsplash.com')) {
      registerMediaAsset({
        name: `${pair.title} (Before Treatment)`,
        url: pair.beforeImage,
        mediaType: 'image',
        category: 'Before & After',
        altText:
          pair.beforeAltText ||
          `${pair.title} Before Treatment at Age Reversal Clinics London`,
        seoKeywords: keywords,
      });
    }
    if (pair.afterImage && !pair.afterImage.includes('unsplash.com')) {
      registerMediaAsset({
        name: `${pair.title} (After Treatment)`,
        url: pair.afterImage,
        mediaType: 'image',
        category: 'Before & After',
        altText:
          pair.afterAltText ||
          `${pair.title} After Treatment Result at Age Reversal Clinics London`,
        seoKeywords: keywords,
      });
    }
  } catch (err) {
    console.warn('Could not register Before & After assets to central library:', err);
  }

  if (keywords.length === 0 || (!pair.linkedTreatmentId && !pair.linkedTreatmentTitle)) {
    return;
  }

  const targetId = (pair.linkedTreatmentId || '').toLowerCase().trim();
  const targetTitle = (pair.linkedTreatmentTitle || '').toLowerCase().trim();

  // 2. Merge SEO keywords into linked treatment in treatment_pricing_data
  try {
    const pricingData = getTreatmentPricingData();
    let pricingUpdated = false;
    const nextPricing = pricingData.map((item) => {
      const idMatches = targetId && item.id.toLowerCase() === targetId;
      const titleMatches = targetTitle && item.title.toLowerCase() === targetTitle;
      if (idMatches || titleMatches) {
        const existingKw = item.seoKeywords || [];
        const mergedKw = Array.from(new Set([...existingKw, ...keywords]));
        if (mergedKw.length !== existingKw.length) {
          pricingUpdated = true;
          return { ...item, seoKeywords: mergedKw };
        }
      }
      return item;
    });

    if (pricingUpdated) {
      saveTreatmentPricingData(nextPricing);
    }
  } catch (err) {
    console.warn('Could not sync Before & After SEO keywords to treatment pricing:', err);
  }

  // 3. Merge SEO keywords into linked treatment in clinical_treatment_details
  try {
    const detailsDb = getTreatmentDetailsConfig();
    if (detailsDb && typeof detailsDb === 'object') {
      let detailsUpdated = false;
      const nextDetailsDb: Record<string, any> = { ...detailsDb };

      for (const key of Object.keys(nextDetailsDb)) {
        const tr = nextDetailsDb[key];
        if (!tr) continue;
        const trId = String(tr.id || key).toLowerCase();
        const trTitle = String(tr.title || '').toLowerCase();
        const matches =
          (targetId && (trId === targetId || targetId.includes(trId) || trId.includes(targetId))) ||
          (targetTitle && trTitle === targetTitle);

        if (matches) {
          const existingKw: string[] = Array.isArray(tr.seoKeywords) ? tr.seoKeywords : [];
          const mergedKw = Array.from(new Set([...existingKw, ...keywords]));
          if (mergedKw.length !== existingKw.length) {
            nextDetailsDb[key] = { ...tr, seoKeywords: mergedKw };
            detailsUpdated = true;
          }
        }
      }

      if (detailsUpdated) {
        saveTreatmentDetailsConfig(nextDetailsDb);
      }
    }
  } catch (err) {
    console.warn('Could not sync Before & After SEO keywords to clinical_treatment_details:', err);
  }
}

export function getBeforeAfterGalleryConfig(): BeforeAfterGalleryConfig {
  initializeAdminStore();
  const stored = getStorageItem<BeforeAfterGalleryConfig>(
    GALLERY_CONFIG_KEY,
    getFileDefault(GALLERY_CONFIG_KEY, DEFAULT_GALLERY_CONFIG)
  );

  // Generate treatment groups directly from the current Master Services list
  const masterServices = getMasterServices();
  const fixedGroups = (masterServices.length > 0 ? masterServices : ALL_SPECIALIST_TREATMENTS).map((item) => ({
    id: item.id,
    name: item.title,
  }));
  const validGroupIds = new Set(fixedGroups.map((g) => g.id));

  // Map legacy group IDs and default pair IDs to the 24 new service IDs
  const pairIdToGroupMap: Record<string, string> = {
    'pair-1': 'facial-skin-care',
    'pair-2': 'co2-laser-from',
    'pair-3': 'dermal-fillers-1ml',
    'pair-4': 'platelet-rich-plasma-prp',
    'pair-5': 'profhilo-2ml',
    'pair-6': 'salmon-sperm-injection',
    'pair-7': 'morpheus8-treatment',
    'pair-8': 'emface-skin-tightening-and-lifting',
  };

  const legacyGroupMap: Record<string, string> = {
    'anti-aging': 'profhilo-2ml',
    'acne-scarring': 'co2-laser-from',
    'facial-harmony': 'dermal-fillers-1ml',
    'clinical-hair': 'platelet-rich-plasma-prp',
    'body-sculpting': 'emscuplt-body-sculpt-and-tightening',
    'advanced-facials': 'facial-skin-care',
  };

  const legacyDefaultTitles = new Set([
    'Skin Treatment - 12 Wks',
    'Anti-Aging - 8 Wks',
    'Micro-Focused SMAS Tightening',
    'Laser Therapy & Skin Revision',
    'Volumetric Resurfacing & Texture',
    'Advanced Aesthetics',
    'Advanced Aesthetics Profile',
    'Subdermal Lifting & Tone',
    'Vertical Hair Follicle Density',
  ]);

  const defaultPairById = new Map<string, BeforeAfterPair>();
  Object.values(DEFAULT_GALLERY_PAIRS_BY_GROUP)
    .flat()
    .forEach((p) => defaultPairById.set(p.id, p));

  const bucketedPairs = new Map<string, BeforeAfterPair[]>();
  fixedGroups.forEach((g) => bucketedPairs.set(g.id, []));

  const seenPairIds = new Set<string>();
  const storedCategories = stored?.categories || [];
  const hasAnyNewGroup = storedCategories.some((c) => validGroupIds.has(c.id));

  for (const cat of storedCategories) {
    for (const rawPair of cat.pairs || []) {
      if (!rawPair || seenPairIds.has(rawPair.id)) continue;
      seenPairIds.add(rawPair.id);

      const targetGroupId =
        (rawPair.id && pairIdToGroupMap[rawPair.id]) ||
        (validGroupIds.has(cat.id) ? cat.id : legacyGroupMap[cat.id]) ||
        fixedGroups[0].id;

      const defaultPair = defaultPairById.get(rawPair.id);
      const shouldUpgradeDefaultTitle =
        defaultPair && (!rawPair.title || legacyDefaultTitles.has(rawPair.title));

      const upgradedPair: BeforeAfterPair = {
        ...defaultPair,
        ...rawPair,
        treatmentGroupId: targetGroupId as any,
        title: shouldUpgradeDefaultTitle ? defaultPair.title : rawPair.title,
        linkedTreatmentId: shouldUpgradeDefaultTitle
          ? defaultPair.linkedTreatmentId
          : rawPair.linkedTreatmentId || targetGroupId,
        linkedTreatmentTitle: shouldUpgradeDefaultTitle
          ? defaultPair.linkedTreatmentTitle
          : rawPair.linkedTreatmentTitle || defaultPair?.linkedTreatmentTitle,
      };

      const list = bucketedPairs.get(targetGroupId) || [];
      list.push(upgradedPair);
      bucketedPairs.set(targetGroupId, list);
    }
  }

  // Ensure all 8 default pairs are present if migrating from a legacy 5-pair snapshot
  if (!hasAnyNewGroup) {
    defaultPairById.forEach((defPair, pairId) => {
      if (!seenPairIds.has(pairId)) {
        const gId = defPair.treatmentGroupId || pairIdToGroupMap[pairId] || fixedGroups[0].id;
        const list = bucketedPairs.get(gId) || [];
        list.push({ ...defPair });
        bucketedPairs.set(gId, list);
      }
    });
  }

  const normalizedCategories = fixedGroups.map((group) => {
    const pairs = bucketedPairs.get(group.id) || [];
    return {
      id: group.id,
      name: group.name,
      pairs: pairs.map((p) => ({
        ...p,
        treatmentGroupId: (p.treatmentGroupId || group.id) as any,
        beforeAltText:
          p.beforeAltText ||
          `${p.title} Before ${group.name} Treatment at Age Reversal Clinics London`,
        afterAltText:
          p.afterAltText ||
          `${p.title} After ${group.name} Treatment Result at Age Reversal Clinics London`,
        seoTitle: p.seoTitle || `${p.title} — Before & After Result | Age Reversal Clinics`,
        seoKeywords:
          p.seoKeywords && p.seoKeywords.length > 0
            ? p.seoKeywords
            : [
                `${p.title.toLowerCase()} before and after`,
                `${group.name.toLowerCase()} london`,
                'age reversal clinics results',
              ],
      })),
    };
  });

  return {
    heading: stored?.heading || DEFAULT_GALLERY_CONFIG.heading,
    description: stored?.description || DEFAULT_GALLERY_CONFIG.description,
    categories: normalizedCategories,
  };
}

export function saveBeforeAfterGalleryConfig(config: BeforeAfterGalleryConfig): BeforeAfterGalleryConfig {
  setStorageItem(GALLERY_CONFIG_KEY, config);
  syncConfigToFile(GALLERY_CONFIG_KEY, config);

  // Sync directly to dedicated Before & After gallery endpoint (updates siteCustomizations.json + transformationsData.ts)
  if (typeof window !== 'undefined') {
    fetch('/api/admin/before-after-gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config }),
    }).catch((err) => {
      console.warn('Could not sync Before & After gallery to server endpoint:', err);
    });
  }

  // Sync SEO keywords from all pairs to their linked existing treatments & Central Asset Library
  if (config?.categories) {
    config.categories.forEach((cat) => {
      (cat.pairs || []).forEach((pair) => {
        syncBeforeAfterPairSeoToTreatments(pair);
      });
    });
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('before_after_gallery_updated', { detail: config }));
  }
  return config;
}

export async function fetchRemoteBeforeAfterGalleryConfig(): Promise<BeforeAfterGalleryConfig | null> {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch('/api/admin/before-after-gallery');
    if (!res.ok) return null;
    const data = await res.json();
    const remoteConfig = data?.config || data?.data;
    if (remoteConfig && Array.isArray(remoteConfig.categories)) {
      setStorageItem(GALLERY_CONFIG_KEY, remoteConfig);
      return getBeforeAfterGalleryConfig();
    }
  } catch (err) {
    console.warn('Could not fetch remote Before & After gallery config:', err);
  }
  return null;
}

export async function uploadBeforeAfterWebpImage(params: {
  fileName: string;
  dataUrl: string;
  slot?: 'before' | 'after';
  pairId?: string;
}): Promise<{ url: string; fileName: string } | null> {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch('/api/admin/transformations/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.url) {
      return { url: data.url, fileName: data.fileName || params.fileName };
    }
  } catch (err) {
    console.error('Error uploading Before & After WebP image:', err);
  }
  return null;
}

export function getWhyChooseUsConfig(): WhyChooseUsConfig {
  initializeAdminStore();
  const clinicWhy = getClinicData()?.whyChooseUs;
  if (clinicWhy && Array.isArray(clinicWhy.pillars) && clinicWhy.pillars.length > 0) {
    return {
      heading: clinicWhy.heading || DEFAULT_WHY_CHOOSE_US_CONFIG.heading,
      subheading: clinicWhy.subheading || DEFAULT_WHY_CHOOSE_US_CONFIG.description,
      description: clinicWhy.subheading || (clinicWhy as any).description || DEFAULT_WHY_CHOOSE_US_CONFIG.description,
      pillars: clinicWhy.pillars,
    };
  }
  return getStorageItem<WhyChooseUsConfig>(WHY_CHOOSE_US_CONFIG_KEY, getFileDefault(WHY_CHOOSE_US_CONFIG_KEY, DEFAULT_WHY_CHOOSE_US_CONFIG));
}

export function saveWhyChooseUsConfig(config: WhyChooseUsConfig): WhyChooseUsConfig {
  setStorageItem(WHY_CHOOSE_US_CONFIG_KEY, config);
  syncConfigToFile(WHY_CHOOSE_US_CONFIG_KEY, config);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('why_choose_us_updated', { detail: config }));
  }
  return config;
}

export function getAwardsConfig(): AwardsConfig {
  initializeAdminStore();
  const clinicAwards = getClinicData()?.awardsShowcase;
  if (clinicAwards && Array.isArray(clinicAwards.awards) && clinicAwards.awards.length > 0) {
    return {
      heading: clinicAwards.heading || DEFAULT_AWARDS_CONFIG.heading,
      subheading: clinicAwards.subheading || DEFAULT_AWARDS_CONFIG.subheading,
      awards: clinicAwards.awards,
    };
  }
  return getStorageItem<AwardsConfig>(AWARDS_CONFIG_KEY, getFileDefault(AWARDS_CONFIG_KEY, DEFAULT_AWARDS_CONFIG));
}

export function saveAwardsConfig(config: AwardsConfig): AwardsConfig {
  setStorageItem(AWARDS_CONFIG_KEY, config);
  syncConfigToFile(AWARDS_CONFIG_KEY, config);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('awards_config_updated', { detail: config }));
  }
  return config;
}

export function getOurLocationsConfig(): OurLocationsConfig {
  initializeAdminStore();
  const config = getStorageItem<OurLocationsConfig>(LOCATIONS_CONFIG_KEY, getFileDefault(LOCATIONS_CONFIG_KEY, DEFAULT_LOCATIONS_CONFIG));
  // If stored config locations contain the legacy dummy "Devonshire Place, London W1G 6BW" or empty, dynamically fall back to DEFAULT_LOCATIONS_CONFIG
  if (config && (!config.locations || config.locations.length === 0 || config.locations.some(l => l.address?.includes('Devonshire Place, London W1G 6BW') || l.name?.includes('The London Clinic')))) {
    return DEFAULT_LOCATIONS_CONFIG;
  }
  return config;
}

export function saveOurLocationsConfig(config: OurLocationsConfig): OurLocationsConfig {
  setStorageItem(LOCATIONS_CONFIG_KEY, config);
  syncConfigToFile(LOCATIONS_CONFIG_KEY, config);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('locations_config_changed', { detail: config }));
  }
  return config;
}

export function getTeamLeadershipConfig(): TeamLeadershipConfig {
  initializeAdminStore();
  return getStorageItem<TeamLeadershipConfig>(TEAM_LEADERSHIP_CONFIG_KEY, getFileDefault(TEAM_LEADERSHIP_CONFIG_KEY, DEFAULT_TEAM_LEADERSHIP_CONFIG));
}

export function saveTeamLeadershipConfig(config: TeamLeadershipConfig): TeamLeadershipConfig {
  setStorageItem(TEAM_LEADERSHIP_CONFIG_KEY, config);
  return config;
}

export function getProcessConfig(): ProcessConfig {
  initializeAdminStore();
  const clinicProcess = getClinicData()?.processSection;
  if (clinicProcess && Array.isArray(clinicProcess.steps) && clinicProcess.steps.length > 0) {
    return {
      eyebrow: clinicProcess.eyebrow || DEFAULT_PROCESS_CONFIG.eyebrow || 'Our Process',
      heading: clinicProcess.heading || DEFAULT_PROCESS_CONFIG.heading,
      description: clinicProcess.subheading || DEFAULT_PROCESS_CONFIG.description,
      seoKeywords: Array.isArray(clinicProcess.seoKeywords)
        ? clinicProcess.seoKeywords
        : DEFAULT_PROCESS_CONFIG.seoKeywords || [],
      steps: clinicProcess.steps,
    };
  }
  return getStorageItem<ProcessConfig>(PROCESS_CONFIG_KEY, getFileDefault(PROCESS_CONFIG_KEY, DEFAULT_PROCESS_CONFIG));
}

export function saveProcessConfig(config: ProcessConfig): ProcessConfig {
  setStorageItem(PROCESS_CONFIG_KEY, config);
  syncConfigToFile(PROCESS_CONFIG_KEY, config);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('process_config_updated', { detail: config }));
  }
  return config;
}

export function getFacilityInteriorsConfig(): FacilityInteriorsConfig {
  initializeAdminStore();
  const clinicFacility = getClinicData()?.facilityGallery;
  if (clinicFacility && Array.isArray(clinicFacility.rooms) && clinicFacility.rooms.length > 0) {
    return {
      eyebrow: clinicFacility.eyebrow || DEFAULT_FACILITY_INTERIORS_CONFIG.eyebrow || 'Our Facility',
      heading: clinicFacility.heading || DEFAULT_FACILITY_INTERIORS_CONFIG.heading,
      description: DEFAULT_FACILITY_INTERIORS_CONFIG.description,
      seoKeywords: Array.isArray(clinicFacility.seoKeywords)
        ? clinicFacility.seoKeywords
        : DEFAULT_FACILITY_INTERIORS_CONFIG.seoKeywords || [],
      rooms: clinicFacility.rooms,
    };
  }
  return getStorageItem<FacilityInteriorsConfig>(FACILITY_INTERIORS_CONFIG_KEY, getFileDefault(FACILITY_INTERIORS_CONFIG_KEY, DEFAULT_FACILITY_INTERIORS_CONFIG));
}

export function saveFacilityInteriorsConfig(config: FacilityInteriorsConfig): FacilityInteriorsConfig {
  setStorageItem(FACILITY_INTERIORS_CONFIG_KEY, config);
  syncConfigToFile(FACILITY_INTERIORS_CONFIG_KEY, config);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('facility_interiors_updated', { detail: config }));
  }
  return config;
}

export function getTestimonialsConfig(): TestimonialsConfig {
  initializeAdminStore();
  return getStorageItem<TestimonialsConfig>(TESTIMONIALS_CONFIG_KEY, getFileDefault(TESTIMONIALS_CONFIG_KEY, DEFAULT_TESTIMONIALS_CONFIG));
}

export function saveTestimonialsConfig(config: TestimonialsConfig): TestimonialsConfig {
  setStorageItem(TESTIMONIALS_CONFIG_KEY, config);
  return config;
}

export function getSpecialOffersConfig(): SpecialOffersConfig {
  initializeAdminStore();
  return getStorageItem<SpecialOffersConfig>(SPECIAL_OFFERS_CONFIG_KEY, getFileDefault(SPECIAL_OFFERS_CONFIG_KEY, DEFAULT_SPECIAL_OFFERS_CONFIG));
}

export function saveSpecialOffersConfig(config: SpecialOffersConfig): SpecialOffersConfig {
  setStorageItem(SPECIAL_OFFERS_CONFIG_KEY, config);
  return config;
}

export function getSkincareCollectionConfig(): SkincareCollectionConfig {
  initializeAdminStore();
  return getStorageItem<SkincareCollectionConfig>(SKINCARE_COLLECTION_CONFIG_KEY, getFileDefault(SKINCARE_COLLECTION_CONFIG_KEY, DEFAULT_SKINCARE_COLLECTION_CONFIG));
}

export function saveSkincareCollectionConfig(config: SkincareCollectionConfig): SkincareCollectionConfig {
  setStorageItem(SKINCARE_COLLECTION_CONFIG_KEY, config);
  return config;
}

export function getTrustBrandsConfig(): TrustBrandsConfig {
  initializeAdminStore();
  const clinicTrustBrands = getClinicData()?.trustBrandsSection;
  if (clinicTrustBrands && Array.isArray(clinicTrustBrands.brands) && clinicTrustBrands.brands.length > 0) {
    return {
      heading: clinicTrustBrands.heading || DEFAULT_TRUST_BRANDS_CONFIG.heading,
      seoKeywords: Array.isArray(clinicTrustBrands.seoKeywords)
        ? clinicTrustBrands.seoKeywords
        : DEFAULT_TRUST_BRANDS_CONFIG.seoKeywords || [],
      brands: clinicTrustBrands.brands,
    };
  }
  return getStorageItem<TrustBrandsConfig>(TRUST_BRANDS_CONFIG_KEY, getFileDefault(TRUST_BRANDS_CONFIG_KEY, DEFAULT_TRUST_BRANDS_CONFIG));
}

export function saveTrustBrandsConfig(config: TrustBrandsConfig): TrustBrandsConfig {
  setStorageItem(TRUST_BRANDS_CONFIG_KEY, config);
  syncConfigToFile(TRUST_BRANDS_CONFIG_KEY, config);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('trust_brands_updated', { detail: config }));
  }
  return config;
}

export function getAccreditationsConfig(): AccreditationsConfig {
  initializeAdminStore();
  const clinicData = getClinicData();
  const clinicAccSection = clinicData?.accreditationsSection;
  const clinicAccList = Array.isArray(clinicData?.accreditations) ? clinicData.accreditations : [];
  if (clinicAccSection || clinicAccList.length > 0) {
    return {
      eyebrow: clinicAccSection?.eyebrow || DEFAULT_ACCREDITATIONS_CONFIG.eyebrow || 'Accreditations & Certifications',
      heading: clinicAccSection?.heading || DEFAULT_ACCREDITATIONS_CONFIG.heading,
      description: clinicAccSection?.description || DEFAULT_ACCREDITATIONS_CONFIG.description,
      seoKeywords: Array.isArray(clinicAccSection?.seoKeywords)
        ? clinicAccSection.seoKeywords
        : DEFAULT_ACCREDITATIONS_CONFIG.seoKeywords || [],
      items: clinicAccList,
      accreditations: clinicAccList.map((text, idx) => ({ id: `acc-${idx + 1}`, text })),
    };
  }
  return getStorageItem<AccreditationsConfig>(ACCREDITATIONS_CONFIG_KEY, getFileDefault(ACCREDITATIONS_CONFIG_KEY, DEFAULT_ACCREDITATIONS_CONFIG));
}

export function saveAccreditationsConfig(config: AccreditationsConfig): AccreditationsConfig {
  setStorageItem(ACCREDITATIONS_CONFIG_KEY, config);
  syncConfigToFile(ACCREDITATIONS_CONFIG_KEY, config);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('accreditations_updated', { detail: config }));
  }
  return config;
}

export function getLatestNewsConfig(): LatestNewsConfig {
  initializeAdminStore();
  return getStorageItem<LatestNewsConfig>(LATEST_NEWS_CONFIG_KEY, getFileDefault(LATEST_NEWS_CONFIG_KEY, DEFAULT_LATEST_NEWS_CONFIG));
}

export function saveLatestNewsConfig(config: LatestNewsConfig): LatestNewsConfig {
  setStorageItem(LATEST_NEWS_CONFIG_KEY, config);
  return config;
}

export function getFooterConfig(): FooterConfig {
  initializeAdminStore();
  return getStorageItem<FooterConfig>(FOOTER_CONFIG_KEY, getFileDefault(FOOTER_CONFIG_KEY, DEFAULT_FOOTER_CONFIG));
}

export function saveFooterConfig(config: FooterConfig): FooterConfig {
  setStorageItem(FOOTER_CONFIG_KEY, config);
  return config;
}

export function getFloatingMenuConfig(): FloatingMenuConfig {
  initializeAdminStore();
  return getStorageItem<FloatingMenuConfig>(FLOATING_MENU_CONFIG_KEY, getFileDefault(FLOATING_MENU_CONFIG_KEY, DEFAULT_FLOATING_MENU_CONFIG));
}

export function saveFloatingMenuConfig(config: FloatingMenuConfig): FloatingMenuConfig {
  setStorageItem(FLOATING_MENU_CONFIG_KEY, config);
  return config;
}

const TREATMENT_DETAILS_KEY = 'clinical_treatment_details';

export function getTreatmentDetailsConfig(): Record<string, any> | null {
  if (typeof window === 'undefined') return null;
  try {
    const item = window.localStorage.getItem(TREATMENT_DETAILS_KEY);
    if (item) return JSON.parse(item);
    return getFileDefault(TREATMENT_DETAILS_KEY, null);
  } catch (error) {
    console.error(`Error reading localStorage key "${TREATMENT_DETAILS_KEY}":`, error);
    return null;
  }
}

/**
 * Defers loading and parsing siteCustomizations.json until treatment detail is requested
 */
export async function getTreatmentDetailsConfigDeferred(): Promise<Record<string, any> | null> {
  if (typeof window !== 'undefined') {
    try {
      const item = window.localStorage.getItem(TREATMENT_DETAILS_KEY);
      if (item) return JSON.parse(item);
    } catch {}
  }
  await loadSiteCustomizations();
  return getTreatmentDetailsConfig();
}

export function saveTreatmentDetailsConfig(config: Record<string, any>): void {
  setStorageItem(TREATMENT_DETAILS_KEY, config);
  syncConfigToFile(TREATMENT_DETAILS_KEY, config);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('treatment_details_updated', { detail: config }));
  }
}

export const DEFAULT_PROFILE_PAGE_CONFIG: ProfilePageConfig = {
  roleTag: 'Lead Consultant',
  specialtySubtitle: 'Specialist in Regenerative Aesthetics & Dermatology',
  photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2v_Qy0F12eTq307-F4t22D5-5B2vF5W5vE9p6hB9aJ6pU2yH6eZ5f-L6r3q8c9U4F8C9zK2L2eJ7qH1a_P8X9sE8hR2W8B1c2Q7K9wM7cR3X2Y7J3vL2D4aH5Y6R4W5F6E3B8D9H4F2K5M9J2P3L9Y8X7P3H6K7N8B2',
  experienceYears: '15+ Years Experience',
  gmcStatus: 'GMC Registered',
  awardStatus: 'Award Winning',
  bioTitle: 'Consultant Profile',
  bioParagraphs: [
    "{authorName} is a highly respected specialist at The London Clinic, bringing over 15 years of clinical expertise to our practice. With a foundational background in advanced dermatology and a profound focus on regenerative aesthetics, they have pioneered numerous protocols that combine cutting-edge science with holistic patient care.",
    "Graduating with honors from a top-tier medical institution, {authorName} completed comprehensive residency training before pursuing specialized fellowships in aesthetic medicine. Their approach is characterized by a meticulous attention to detail, ensuring that every treatment plan is deeply personalized to meet the unique physiological and aesthetic goals of the patient."
  ],
  bioQuote: '"My philosophy centers on enhancing natural beauty while restoring the skin\'s inherent health and vitality. I believe in utilizing advanced, evidence-based treatments to achieve subtle, durable, and highly impactful results for my patients."',
  expertiseTitle: 'Clinical Expertise',
  expertiseSubtitle: 'Pioneering advanced, evidence-based therapies for transformative results.',
  expertises: [
    {
      title: 'Regenerative Aesthetics',
      description: 'Advanced protocols utilizing exosomes and polynucleotides for comprehensive skin rejuvenation and cellular repair.',
      iconName: 'Activity'
    },
    {
      title: 'Non-Surgical Contouring',
      description: 'Expert application of dermal fillers and advanced energy-based devices for harmonious facial balancing.',
      iconName: 'Stethoscope'
    },
    {
      title: 'Complex Dermatology',
      description: 'Specialized diagnostic and therapeutic management of melasma, rosacea, and severe photo-aging.',
      iconName: 'ShieldCheck'
    }
  ],
  moreInfoTitle: 'More Information',
  moreInfoSections: [
    {
      title: 'Education & Qualifications',
      iconName: 'GraduationCap',
      items: [
        'MD, Medical University of London',
        'Fellowship in Aesthetic Dermatology',
        'Board Certified Dermatologist',
        'BSc (Hons) in Biomedical Sciences'
      ]
    },
    {
      title: 'Clinical Interests',
      iconName: 'HeartPulse',
      items: [
        'Regenerative Medicine',
        'Exosome Therapy & Bio-Remodeling',
        'Complex Skin Pigmentation',
        'Non-Surgical Facial Contouring'
      ]
    },
    {
      title: 'Awards & Recognition',
      iconName: 'Award',
      items: [
        'Aesthetic Practitioner of the Year 2025',
        'Excellence in Patient Care Award',
        'Top 10 Global Dermatologists list',
        'Innovator in Aesthetics 2024'
      ]
    },
    {
      title: 'Publications',
      iconName: 'BookOpen',
      items: [
        '"Advancements in Bio-Remodeling", Journal of Aesthetic Medicine',
        '"The Future of Exosomes", Clinical Dermatology Review',
        'Keynote Speaker: Global Aesthetics Conference 2025'
      ]
    }
  ],
  reviewsTitle: 'Patient Reviews',
  reviewsRating: 5.0,
  reviewsCountText: '(124 verified reviews)',
  reviews: [
    {
      name: 'Eleanor V.',
      role: 'Patient',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      date: 'May 2026',
      rating: 5,
      text: 'An absolutely transformative experience. The consultation was incredibly thorough, and the results of my treatment exceeded all expectations. I felt completely at ease throughout the entire process.',
      source: 'instagram'
    },
    {
      name: 'Michael R.',
      role: 'Patient',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      date: 'April 2026',
      rating: 5,
      text: 'True professional with a remarkable eye for detail. They took the time to explain every step of the regenerative protocol, ensuring I was comfortable. The subtle, natural results are exactly what I wanted.',
      source: 'facebook'
    },
    {
      name: 'Sarah P.',
      role: 'Patient',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      date: 'February 2026',
      rating: 5,
      text: 'I cannot recommend them highly enough. From the initial skin assessment to the post-treatment care, the level of expertise and genuine compassion provided is unparalleled in London.',
      source: 'tiktok'
    }
  ]
};

export function getProfilePageConfig(): ProfilePageConfig {
  initializeAdminStore();
  return getStorageItem<ProfilePageConfig>(PROFILE_PAGE_CONFIG_KEY, DEFAULT_PROFILE_PAGE_CONFIG);
}

export function saveProfilePageConfig(config: ProfilePageConfig): ProfilePageConfig {
  setStorageItem(PROFILE_PAGE_CONFIG_KEY, config);
  return config;
}


const CHAT_SESSIONS_KEY = 'clinical_chat_sessions';

export function getChatSessions(): import('../types').ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const item = window.localStorage.getItem(CHAT_SESSIONS_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Error reading chat sessions:', error);
    return [];
  }
}

export function saveChatSessions(sessions: import('../types').ChatSession[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
}

// Clinic Master Data (clinicInfo.ts) Store Management
let _hasHydratedClinicDataFromServer = false;

function mergeWithBakedInClinicData(candidate?: Partial<ClinicData> | null): ClinicData {
  const fileDefault = getFileDefault<Partial<ClinicData> | null>('clinic_info_data', null);
  const fileWhyChooseUs = getFileDefault<WhyChooseUsConfig | null>(WHY_CHOOSE_US_CONFIG_KEY, null);
  const fileAwards = getFileDefault<AwardsConfig | null>(AWARDS_CONFIG_KEY, null);
  const fileConsultation = getFileDefault<ClinicConsultationConfig | null>(CONSULTATION_CONFIG_KEY, null);
  const fileProcess = getFileDefault<ProcessConfig | null>(PROCESS_CONFIG_KEY, null);
  const fileFacility = getFileDefault<FacilityInteriorsConfig | null>(FACILITY_INTERIORS_CONFIG_KEY, null);
  const fileTrustBrands = getFileDefault<TrustBrandsConfig | null>(TRUST_BRANDS_CONFIG_KEY, null);
  const fileAccreditations = getFileDefault<AccreditationsConfig | null>(ACCREDITATIONS_CONFIG_KEY, null);

  const defaultWhyChooseUs = CLINIC_DATA.whyChooseUs || {
    heading: DEFAULT_WHY_CHOOSE_US_CONFIG.heading,
    subheading: DEFAULT_WHY_CHOOSE_US_CONFIG.description,
    pillars: DEFAULT_WHY_CHOOSE_US_CONFIG.pillars,
  };

  const defaultAwardsShowcase = CLINIC_DATA.awardsShowcase || {
    heading: DEFAULT_AWARDS_CONFIG.heading,
    subheading: DEFAULT_AWARDS_CONFIG.subheading,
    awards: DEFAULT_AWARDS_CONFIG.awards,
  };

  const defaultConsultationConfig: ClinicConsultationConfig = CLINIC_DATA.consultationConfig || {
    heading: 'Book a Preferred Consultation',
    subheading: 'Schedule your bespoke clinical assessment with our aesthetic specialists.',
    specialistLabel: 'Preferred Specialist',
    doctors: [
      {
        id: 'dr-smith',
        name: 'Dr. Alistair Smith (Lead Aesthetic Specialist)',
        specialty: 'Lead Aesthetic Specialist',
        locationIds: ['location-1791722960928', 'location-1791728808656'],
        availableDays: [1, 2, 3, 4, 5, 6],
        timeSlots: ['09:30', '11:00', '13:30', '15:00', '16:30'],
      },
      {
        id: 'dr-jones',
        name: 'Dr. Sarah Jones (Aesthetic Physician)',
        specialty: 'Aesthetic Physician',
        locationIds: ['location-1791722960928'],
        availableDays: [1, 2, 4, 5],
        timeSlots: ['10:00', '11:30', '14:00', '16:00'],
      },
      {
        id: 'dr-jaipur',
        name: 'Dr. Vikram Jaipur (Regenerative & Laser Specialist)',
        specialty: 'Regenerative & Laser Specialist',
        locationIds: ['location-1791728808656'],
        availableDays: [2, 3, 5, 6],
        timeSlots: ['09:30', '12:00', '14:30', '17:00'],
      },
    ],
    defaultTimeSlots: ['09:30', '11:00', '12:30', '14:00', '15:30', '17:00'],
    bestTimeOptions: [
      { value: 'morning', label: 'Morning (9am - 12pm)' },
      { value: 'afternoon', label: 'Afternoon (12pm - 4pm)' },
      { value: 'evening', label: 'Evening (4pm - 7pm)' },
    ],
    hearAboutUsOptions: [
      { value: 'google', label: 'Google Search' },
      { value: 'social', label: 'Social Media (Instagram / Facebook / TikTok)' },
      { value: 'referral', label: 'Friend / Family Referral' },
      { value: 'other', label: 'Other' },
    ],
    stayInTouchChannels: [
      { id: 'email', label: 'Email', enabled: true },
      { id: 'phone', label: 'Phone', enabled: true },
      { id: 'telephone', label: 'Tel Phone', enabled: true },
      { id: 'post', label: 'Post Mail', enabled: true },
      { id: 'whatsapp', label: 'WhatsApp', enabled: false },
      { id: 'sms', label: 'SMS', enabled: false },
    ],
  };

  const defaultProcessSection: ClinicProcessSection = CLINIC_DATA.processSection || {
    eyebrow: DEFAULT_PROCESS_CONFIG.eyebrow || 'Our Process',
    heading: DEFAULT_PROCESS_CONFIG.heading || 'The Journey to Radiance',
    subheading: DEFAULT_PROCESS_CONFIG.description,
    seoKeywords: DEFAULT_PROCESS_CONFIG.seoKeywords || [],
    steps: DEFAULT_PROCESS_CONFIG.steps,
  };

  const defaultFacilityGallery: ClinicFacilityGallerySection = CLINIC_DATA.facilityGallery || {
    eyebrow: DEFAULT_FACILITY_INTERIORS_CONFIG.eyebrow || 'Our Facility',
    heading: DEFAULT_FACILITY_INTERIORS_CONFIG.heading || 'Clinic Gallery',
    seoKeywords: DEFAULT_FACILITY_INTERIORS_CONFIG.seoKeywords || [],
    rooms: DEFAULT_FACILITY_INTERIORS_CONFIG.rooms,
  };

  const defaultTrustBrandsSection: ClinicTrustBrandsSection = CLINIC_DATA.trustBrandsSection || {
    heading: DEFAULT_TRUST_BRANDS_CONFIG.heading || 'Over 1,000+ Brands & Laboratories Trust Us',
    seoKeywords: DEFAULT_TRUST_BRANDS_CONFIG.seoKeywords || [],
    brands: DEFAULT_TRUST_BRANDS_CONFIG.brands,
  };

  const defaultAccreditationsSection: ClinicAccreditationsSection = CLINIC_DATA.accreditationsSection || {
    eyebrow: DEFAULT_ACCREDITATIONS_CONFIG.eyebrow || 'Accreditations & Certifications',
    heading: DEFAULT_ACCREDITATIONS_CONFIG.heading || 'Excellence guaranteed. Trusted globally.',
    description: DEFAULT_ACCREDITATIONS_CONFIG.description,
    seoKeywords: DEFAULT_ACCREDITATIONS_CONFIG.seoKeywords || [],
  };

  const resolvedFileWhyChooseUs = fileDefault?.whyChooseUs || (fileWhyChooseUs ? {
    heading: fileWhyChooseUs.heading || defaultWhyChooseUs.heading,
    subheading: fileWhyChooseUs.subheading || fileWhyChooseUs.description || defaultWhyChooseUs.subheading,
    pillars: Array.isArray(fileWhyChooseUs.pillars) && fileWhyChooseUs.pillars.length > 0
      ? fileWhyChooseUs.pillars
      : defaultWhyChooseUs.pillars,
  } : null);

  const resolvedFileAwards = fileDefault?.awardsShowcase || (fileAwards ? {
    heading: fileAwards.heading || defaultAwardsShowcase.heading,
    subheading: fileAwards.subheading || defaultAwardsShowcase.subheading,
    awards: Array.isArray(fileAwards.awards) && fileAwards.awards.length > 0
      ? fileAwards.awards
      : defaultAwardsShowcase.awards,
  } : null);

  const resolvedFileConsultation = fileDefault?.consultationConfig || fileConsultation;

  const resolvedFileProcess: ClinicProcessSection | null = fileDefault?.processSection || (fileProcess ? {
    eyebrow: fileProcess.eyebrow || defaultProcessSection.eyebrow,
    heading: fileProcess.heading || defaultProcessSection.heading,
    subheading: fileProcess.description || defaultProcessSection.subheading,
    seoKeywords: Array.isArray(fileProcess.seoKeywords) && fileProcess.seoKeywords.length > 0
      ? fileProcess.seoKeywords
      : defaultProcessSection.seoKeywords,
    steps: Array.isArray(fileProcess.steps) && fileProcess.steps.length > 0
      ? fileProcess.steps
      : defaultProcessSection.steps,
  } : null);

  const resolvedFileFacility: ClinicFacilityGallerySection | null = fileDefault?.facilityGallery || (fileFacility ? {
    eyebrow: fileFacility.eyebrow || defaultFacilityGallery.eyebrow,
    heading: fileFacility.heading || defaultFacilityGallery.heading,
    seoKeywords: Array.isArray(fileFacility.seoKeywords) && fileFacility.seoKeywords.length > 0
      ? fileFacility.seoKeywords
      : defaultFacilityGallery.seoKeywords,
    rooms: Array.isArray(fileFacility.rooms) && fileFacility.rooms.length > 0
      ? fileFacility.rooms
      : defaultFacilityGallery.rooms,
  } : null);

  const resolvedFileTrustBrands: ClinicTrustBrandsSection | null = fileDefault?.trustBrandsSection || (fileTrustBrands ? {
    heading: fileTrustBrands.heading || defaultTrustBrandsSection.heading,
    seoKeywords: Array.isArray(fileTrustBrands.seoKeywords) && fileTrustBrands.seoKeywords.length > 0
      ? fileTrustBrands.seoKeywords
      : defaultTrustBrandsSection.seoKeywords,
    brands: Array.isArray(fileTrustBrands.brands) && fileTrustBrands.brands.length > 0
      ? fileTrustBrands.brands
      : defaultTrustBrandsSection.brands,
  } : null);

  const resolvedFileAccreditations: ClinicAccreditationsSection | null = fileDefault?.accreditationsSection || (fileAccreditations ? {
    eyebrow: fileAccreditations.eyebrow || defaultAccreditationsSection.eyebrow,
    heading: fileAccreditations.heading || defaultAccreditationsSection.heading,
    description: fileAccreditations.description || defaultAccreditationsSection.description,
    seoKeywords: Array.isArray(fileAccreditations.seoKeywords) && fileAccreditations.seoKeywords.length > 0
      ? fileAccreditations.seoKeywords
      : defaultAccreditationsSection.seoKeywords,
  } : null);

  const base: ClinicData = {
    ...CLINIC_DATA,
    ...(fileDefault || {}),
    ogImage: fileDefault?.ogImage ?? CLINIC_DATA.ogImage,
    exteriorPhoto: fileDefault?.exteriorPhoto ?? CLINIC_DATA.exteriorPhoto,
    logo: {
      ...CLINIC_DATA.logo,
      ...(fileDefault?.logo || {}),
      icon: fileDefault?.logo?.icon ?? CLINIC_DATA.logo.icon,
      full: fileDefault?.logo?.full ?? CLINIC_DATA.logo.full,
    },
    socials: {
      ...CLINIC_DATA.socials,
      ...(fileDefault?.socials || {}),
    },
    interiorPhotos: Array.isArray(fileDefault?.interiorPhotos)
      ? fileDefault.interiorPhotos
      : CLINIC_DATA.interiorPhotos || [],
    locations: (
      Array.isArray(fileDefault?.locations) && fileDefault.locations.length > 0
        ? fileDefault.locations
        : CLINIC_DATA.locations
    ).map((loc, idx) => ({
      ...loc,
      image: loc.image ?? CLINIC_DATA.locations?.[idx]?.image ?? '',
    })),
    whyChooseUs: {
      heading: resolvedFileWhyChooseUs?.heading || defaultWhyChooseUs.heading,
      subheading: resolvedFileWhyChooseUs?.subheading || defaultWhyChooseUs.subheading,
      pillars: (
        Array.isArray(resolvedFileWhyChooseUs?.pillars) && resolvedFileWhyChooseUs.pillars.length > 0
          ? resolvedFileWhyChooseUs.pillars
          : defaultWhyChooseUs.pillars
      ).map((pillar, idx) => ({
        ...pillar,
        imageUrl: pillar.imageUrl ?? defaultWhyChooseUs.pillars?.[idx]?.imageUrl ?? '',
      })),
    },
    awardsShowcase: {
      heading: resolvedFileAwards?.heading || defaultAwardsShowcase.heading,
      subheading: resolvedFileAwards?.subheading || defaultAwardsShowcase.subheading,
      awards: (
        Array.isArray(resolvedFileAwards?.awards) && resolvedFileAwards.awards.length > 0
          ? resolvedFileAwards.awards
          : defaultAwardsShowcase.awards
      ).map((award, idx) => ({
        ...award,
        imageUrl: award.imageUrl ?? defaultAwardsShowcase.awards?.[idx]?.imageUrl ?? '',
      })),
    },
    consultationConfig: {
      heading: resolvedFileConsultation?.heading || defaultConsultationConfig.heading,
      subheading: resolvedFileConsultation?.subheading || defaultConsultationConfig.subheading,
      specialistLabel: resolvedFileConsultation?.specialistLabel || defaultConsultationConfig.specialistLabel || 'Preferred Specialist',
      doctors:
        Array.isArray(resolvedFileConsultation?.doctors) && resolvedFileConsultation.doctors.length > 0
          ? resolvedFileConsultation.doctors
          : defaultConsultationConfig.doctors,
      defaultTimeSlots:
        Array.isArray(resolvedFileConsultation?.defaultTimeSlots) && resolvedFileConsultation.defaultTimeSlots.length > 0
          ? resolvedFileConsultation.defaultTimeSlots
          : defaultConsultationConfig.defaultTimeSlots,
      bestTimeOptions:
        Array.isArray(resolvedFileConsultation?.bestTimeOptions) && resolvedFileConsultation.bestTimeOptions.length > 0
          ? resolvedFileConsultation.bestTimeOptions
          : defaultConsultationConfig.bestTimeOptions,
      hearAboutUsOptions:
        Array.isArray(resolvedFileConsultation?.hearAboutUsOptions) && resolvedFileConsultation.hearAboutUsOptions.length > 0
          ? resolvedFileConsultation.hearAboutUsOptions
          : defaultConsultationConfig.hearAboutUsOptions,
      stayInTouchChannels:
        Array.isArray(resolvedFileConsultation?.stayInTouchChannels) && resolvedFileConsultation.stayInTouchChannels.length > 0
          ? resolvedFileConsultation.stayInTouchChannels
          : defaultConsultationConfig.stayInTouchChannels,
    },
    processSection: {
      eyebrow: resolvedFileProcess?.eyebrow || defaultProcessSection.eyebrow,
      heading: resolvedFileProcess?.heading || defaultProcessSection.heading,
      subheading: resolvedFileProcess?.subheading || defaultProcessSection.subheading,
      seoKeywords:
        Array.isArray(resolvedFileProcess?.seoKeywords) && resolvedFileProcess.seoKeywords.length > 0
          ? resolvedFileProcess.seoKeywords
          : defaultProcessSection.seoKeywords,
      steps: (
        Array.isArray(resolvedFileProcess?.steps) && resolvedFileProcess.steps.length > 0
          ? resolvedFileProcess.steps
          : defaultProcessSection.steps
      ).map((step, idx) => ({
        ...step,
        image: step.image ?? defaultProcessSection.steps?.[idx]?.image ?? '',
      })),
    },
    facilityGallery: {
      eyebrow: resolvedFileFacility?.eyebrow || defaultFacilityGallery.eyebrow,
      heading: resolvedFileFacility?.heading || defaultFacilityGallery.heading,
      seoKeywords:
        Array.isArray(resolvedFileFacility?.seoKeywords) && resolvedFileFacility.seoKeywords.length > 0
          ? resolvedFileFacility.seoKeywords
          : defaultFacilityGallery.seoKeywords,
      rooms: (
        Array.isArray(resolvedFileFacility?.rooms) && resolvedFileFacility.rooms.length > 0
          ? resolvedFileFacility.rooms
          : defaultFacilityGallery.rooms
      ).map((room, idx) => ({
        ...room,
        image: room.image ?? defaultFacilityGallery.rooms?.[idx]?.image ?? '',
      })),
    },
    trustBrandsSection: {
      heading: resolvedFileTrustBrands?.heading || defaultTrustBrandsSection.heading,
      seoKeywords:
        Array.isArray(resolvedFileTrustBrands?.seoKeywords) && resolvedFileTrustBrands.seoKeywords.length > 0
          ? resolvedFileTrustBrands.seoKeywords
          : defaultTrustBrandsSection.seoKeywords,
      brands: (
        Array.isArray(resolvedFileTrustBrands?.brands) && resolvedFileTrustBrands.brands.length > 0
          ? resolvedFileTrustBrands.brands
          : defaultTrustBrandsSection.brands
      ).map((brand, idx) => ({
        ...brand,
        imageUrl: brand.imageUrl ?? defaultTrustBrandsSection.brands?.[idx]?.imageUrl ?? '',
      })),
    },
    accreditationsSection: {
      eyebrow: resolvedFileAccreditations?.eyebrow || defaultAccreditationsSection.eyebrow,
      heading: resolvedFileAccreditations?.heading || defaultAccreditationsSection.heading,
      description: resolvedFileAccreditations?.description || defaultAccreditationsSection.description,
      seoKeywords:
        Array.isArray(resolvedFileAccreditations?.seoKeywords) && resolvedFileAccreditations.seoKeywords.length > 0
          ? resolvedFileAccreditations.seoKeywords
          : defaultAccreditationsSection.seoKeywords,
    },
  };

  if (!candidate || typeof candidate !== 'object') {
    return base;
  }

  return {
    ...base,
    ...candidate,
    ogImage: candidate.ogImage ?? base.ogImage,
    exteriorPhoto: candidate.exteriorPhoto ?? base.exteriorPhoto,
    logo: {
      ...base.logo,
      ...(candidate.logo || {}),
      icon: candidate.logo?.icon ?? base.logo.icon,
      full: candidate.logo?.full ?? base.logo.full,
      alt: candidate.logo?.alt || base.logo.alt,
    },
    socials: {
      ...base.socials,
      ...(candidate.socials || {}),
    },
    interiorPhotos: Array.isArray(candidate.interiorPhotos)
      ? candidate.interiorPhotos
      : base.interiorPhotos || [],
    locations: (
      Array.isArray(candidate.locations) && candidate.locations.length > 0
        ? candidate.locations
        : base.locations
    ).map((loc, idx) => ({
      ...loc,
      image: loc.image ?? base.locations?.[idx]?.image ?? '',
    })),
    whyChooseUs: {
      heading: candidate.whyChooseUs?.heading || base.whyChooseUs?.heading || defaultWhyChooseUs.heading,
      subheading: candidate.whyChooseUs?.subheading || base.whyChooseUs?.subheading || defaultWhyChooseUs.subheading,
      pillars: (
        Array.isArray(candidate.whyChooseUs?.pillars) && candidate.whyChooseUs.pillars.length > 0
          ? candidate.whyChooseUs.pillars
          : (base.whyChooseUs?.pillars || defaultWhyChooseUs.pillars)
      ).map((pillar, idx) => ({
        ...pillar,
        imageUrl: pillar.imageUrl ?? base.whyChooseUs?.pillars?.[idx]?.imageUrl ?? '',
      })),
    },
    awardsShowcase: {
      heading: candidate.awardsShowcase?.heading || base.awardsShowcase?.heading || defaultAwardsShowcase.heading,
      subheading: candidate.awardsShowcase?.subheading || base.awardsShowcase?.subheading || defaultAwardsShowcase.subheading,
      awards: (
        Array.isArray(candidate.awardsShowcase?.awards) && candidate.awardsShowcase.awards.length > 0
          ? candidate.awardsShowcase.awards
          : (base.awardsShowcase?.awards || defaultAwardsShowcase.awards)
      ).map((award, idx) => ({
        ...award,
        imageUrl: award.imageUrl ?? base.awardsShowcase?.awards?.[idx]?.imageUrl ?? '',
      })),
    },
    consultationConfig: {
      heading:
        candidate.consultationConfig?.heading ||
        base.consultationConfig?.heading ||
        defaultConsultationConfig.heading,
      subheading:
        candidate.consultationConfig?.subheading ||
        base.consultationConfig?.subheading ||
        defaultConsultationConfig.subheading,
      specialistLabel:
        candidate.consultationConfig?.specialistLabel ||
        base.consultationConfig?.specialistLabel ||
        defaultConsultationConfig.specialistLabel ||
        'Preferred Specialist',
      doctors:
        Array.isArray(candidate.consultationConfig?.doctors)
          ? candidate.consultationConfig.doctors
          : (base.consultationConfig?.doctors || defaultConsultationConfig.doctors),
      defaultTimeSlots:
        Array.isArray(candidate.consultationConfig?.defaultTimeSlots) && candidate.consultationConfig.defaultTimeSlots.length > 0
          ? candidate.consultationConfig.defaultTimeSlots
          : (base.consultationConfig?.defaultTimeSlots || defaultConsultationConfig.defaultTimeSlots),
      bestTimeOptions:
        Array.isArray(candidate.consultationConfig?.bestTimeOptions) && candidate.consultationConfig.bestTimeOptions.length > 0
          ? candidate.consultationConfig.bestTimeOptions
          : (base.consultationConfig?.bestTimeOptions || defaultConsultationConfig.bestTimeOptions),
      hearAboutUsOptions:
        Array.isArray(candidate.consultationConfig?.hearAboutUsOptions) && candidate.consultationConfig.hearAboutUsOptions.length > 0
          ? candidate.consultationConfig.hearAboutUsOptions
          : (base.consultationConfig?.hearAboutUsOptions || defaultConsultationConfig.hearAboutUsOptions),
      stayInTouchChannels:
        Array.isArray(candidate.consultationConfig?.stayInTouchChannels) && candidate.consultationConfig.stayInTouchChannels.length > 0
          ? candidate.consultationConfig.stayInTouchChannels
          : (base.consultationConfig?.stayInTouchChannels || defaultConsultationConfig.stayInTouchChannels),
    },
    processSection: {
      eyebrow:
        candidate.processSection?.eyebrow ||
        base.processSection?.eyebrow ||
        defaultProcessSection.eyebrow,
      heading:
        candidate.processSection?.heading ||
        base.processSection?.heading ||
        defaultProcessSection.heading,
      subheading:
        candidate.processSection?.subheading ||
        base.processSection?.subheading ||
        defaultProcessSection.subheading,
      seoKeywords:
        Array.isArray(candidate.processSection?.seoKeywords)
          ? candidate.processSection.seoKeywords
          : (base.processSection?.seoKeywords || defaultProcessSection.seoKeywords),
      steps: (
        Array.isArray(candidate.processSection?.steps) && candidate.processSection.steps.length > 0
          ? candidate.processSection.steps
          : (base.processSection?.steps || defaultProcessSection.steps)
      ).map((step, idx) => ({
        ...step,
        image: step.image ?? base.processSection?.steps?.[idx]?.image ?? '',
      })),
    },
    facilityGallery: {
      eyebrow:
        candidate.facilityGallery?.eyebrow ||
        base.facilityGallery?.eyebrow ||
        defaultFacilityGallery.eyebrow,
      heading:
        candidate.facilityGallery?.heading ||
        base.facilityGallery?.heading ||
        defaultFacilityGallery.heading,
      seoKeywords:
        Array.isArray(candidate.facilityGallery?.seoKeywords)
          ? candidate.facilityGallery.seoKeywords
          : (base.facilityGallery?.seoKeywords || defaultFacilityGallery.seoKeywords),
      rooms: (
        Array.isArray(candidate.facilityGallery?.rooms) && candidate.facilityGallery.rooms.length > 0
          ? candidate.facilityGallery.rooms
          : (base.facilityGallery?.rooms || defaultFacilityGallery.rooms)
      ).map((room, idx) => ({
        ...room,
        image: room.image ?? base.facilityGallery?.rooms?.[idx]?.image ?? '',
      })),
    },
    trustBrandsSection: {
      heading:
        candidate.trustBrandsSection?.heading ||
        base.trustBrandsSection?.heading ||
        defaultTrustBrandsSection.heading,
      seoKeywords:
        Array.isArray(candidate.trustBrandsSection?.seoKeywords)
          ? candidate.trustBrandsSection.seoKeywords
          : (base.trustBrandsSection?.seoKeywords || defaultTrustBrandsSection.seoKeywords),
      brands: (
        Array.isArray(candidate.trustBrandsSection?.brands) && candidate.trustBrandsSection.brands.length > 0
          ? candidate.trustBrandsSection.brands
          : (base.trustBrandsSection?.brands || defaultTrustBrandsSection.brands)
      ).map((brand, idx) => ({
        ...brand,
        imageUrl: brand.imageUrl ?? base.trustBrandsSection?.brands?.[idx]?.imageUrl ?? '',
      })),
    },
    accreditationsSection: {
      eyebrow:
        candidate.accreditationsSection?.eyebrow ||
        base.accreditationsSection?.eyebrow ||
        defaultAccreditationsSection.eyebrow,
      heading:
        candidate.accreditationsSection?.heading ||
        base.accreditationsSection?.heading ||
        defaultAccreditationsSection.heading,
      description:
        candidate.accreditationsSection?.description ||
        base.accreditationsSection?.description ||
        defaultAccreditationsSection.description,
      seoKeywords:
        Array.isArray(candidate.accreditationsSection?.seoKeywords)
          ? candidate.accreditationsSection.seoKeywords
          : (base.accreditationsSection?.seoKeywords || defaultAccreditationsSection.seoKeywords),
    },
  };
}

export function getClinicData(): ClinicData {
  if (typeof window !== 'undefined' && !_hasHydratedClinicDataFromServer) {
    const hasLocalOverride = Boolean(window.localStorage.getItem(CLINIC_INFO_DATA_KEY));
    if (!hasLocalOverride) {
      _hasHydratedClinicDataFromServer = true;
      fetchRemoteClinicData().catch(() => {});
    }
  }

  const stored = getStorageItem<Partial<ClinicData> | null>(CLINIC_INFO_DATA_KEY, null);
  return mergeWithBakedInClinicData(stored);
}

// Alias for requested name: getClinicDataConfig()
export function getClinicDataConfig(): ClinicData {
  return getClinicData();
}

export function updateClinicData(data: ClinicData): ClinicData {
  if (typeof window !== 'undefined') {
    // Skip individual background /api/admin/save-to-files calls here because
    // POST /api/admin/clinic-data persists clinicInfo.ts and all synced section configs in siteCustomizations.json atomically.
    setStorageItem(CLINIC_INFO_DATA_KEY, data, true);

    // Automatically synchronize header config when logo.icon or logo.full changes
    if (data.logo && typeof data.logo === 'object') {
      const resolvedHeaderLogo = (data.logo.icon || data.logo.full) ?? '';
      const currentHeaderConfig = getHeaderConfig();
      if (currentHeaderConfig.logoUrl !== resolvedHeaderLogo) {
        const updatedHeaderConfig: HeaderConfig = {
          ...currentHeaderConfig,
          logoUrl: resolvedHeaderLogo,
        };
        setStorageItem(HEADER_CONFIG_KEY, updatedHeaderConfig, true);
        window.dispatchEvent(new CustomEvent('header_config_changed', { detail: updatedHeaderConfig }));
      }
    }

    // Automatically synchronize locations config so location and consultation components update in lockstep
    if (Array.isArray(data.locations) && data.locations.length > 0) {
      const currentLocConfig = getOurLocationsConfig();
      const updatedLocConfig: OurLocationsConfig = {
        ...currentLocConfig,
        locations: data.locations.map((loc, idx) => {
          const fullAddress = [
            loc.address?.trim(),
            (loc.city && !loc.address?.toLowerCase().includes(loc.city.toLowerCase())) ? loc.city.trim() : null,
            loc.postalCode?.trim() || null
          ].filter(Boolean).join(', ');
          return {
            id: loc.id || `loc-${idx + 1}`,
            name: loc.name,
            address: fullAddress,
            hours: loc.hours,
            phone: loc.phone || data.phone || CLINIC_DATA.phone,
            mapsUrl: loc.directionsUrl || `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`,
            bannerType: "Clinic",
            imageUrl: loc.image ?? ""
          };
        })
      };
      setStorageItem(LOCATIONS_CONFIG_KEY, updatedLocConfig, true);
      window.dispatchEvent(new CustomEvent('locations_config_changed', { detail: updatedLocConfig }));
    }

    // Automatically synchronize homepage_why_choose_us_config_v3 and dispatch why_choose_us_updated
    if (data.whyChooseUs && Array.isArray(data.whyChooseUs.pillars)) {
      const updatedWhyChooseUs: WhyChooseUsConfig = {
        heading: data.whyChooseUs.heading || DEFAULT_WHY_CHOOSE_US_CONFIG.heading,
        subheading: data.whyChooseUs.subheading || DEFAULT_WHY_CHOOSE_US_CONFIG.description,
        description: data.whyChooseUs.subheading || DEFAULT_WHY_CHOOSE_US_CONFIG.description,
        pillars: data.whyChooseUs.pillars,
      };
      setStorageItem(WHY_CHOOSE_US_CONFIG_KEY, updatedWhyChooseUs, true);
      window.dispatchEvent(new CustomEvent('why_choose_us_updated', { detail: updatedWhyChooseUs }));
    }

    // Automatically synchronize homepage_awards_config and dispatch awards_config_updated
    if (data.awardsShowcase && Array.isArray(data.awardsShowcase.awards)) {
      const updatedAwards: AwardsConfig = {
        heading: data.awardsShowcase.heading || DEFAULT_AWARDS_CONFIG.heading,
        subheading: data.awardsShowcase.subheading || DEFAULT_AWARDS_CONFIG.subheading,
        awards: data.awardsShowcase.awards,
      };
      setStorageItem(AWARDS_CONFIG_KEY, updatedAwards, true);
      window.dispatchEvent(new CustomEvent('awards_config_updated', { detail: updatedAwards }));
    }

    // Automatically synchronize homepage_consultation_config and dispatch consultation_config_updated
    if (data.consultationConfig && typeof data.consultationConfig === 'object') {
      setStorageItem(CONSULTATION_CONFIG_KEY, data.consultationConfig, true);
      window.dispatchEvent(new CustomEvent('consultation_config_updated', { detail: data.consultationConfig }));
    }

    // Automatically synchronize homepage_process_config and dispatch process_config_updated
    if (data.processSection && typeof data.processSection === 'object') {
      const updatedProcess: ProcessConfig = {
        eyebrow: data.processSection.eyebrow || DEFAULT_PROCESS_CONFIG.eyebrow || 'Our Process',
        heading: data.processSection.heading || DEFAULT_PROCESS_CONFIG.heading,
        description: data.processSection.subheading || DEFAULT_PROCESS_CONFIG.description,
        seoKeywords: Array.isArray(data.processSection.seoKeywords)
          ? data.processSection.seoKeywords
          : DEFAULT_PROCESS_CONFIG.seoKeywords || [],
        steps: Array.isArray(data.processSection.steps)
          ? data.processSection.steps
          : DEFAULT_PROCESS_CONFIG.steps,
      };
      setStorageItem(PROCESS_CONFIG_KEY, updatedProcess, true);
      window.dispatchEvent(new CustomEvent('process_config_updated', { detail: updatedProcess }));
    }

    // Automatically synchronize homepage_facility_interiors_config and dispatch facility_interiors_updated
    if (data.facilityGallery && typeof data.facilityGallery === 'object') {
      const updatedFacility: FacilityInteriorsConfig = {
        eyebrow: data.facilityGallery.eyebrow || DEFAULT_FACILITY_INTERIORS_CONFIG.eyebrow || 'Our Facility',
        heading: data.facilityGallery.heading || DEFAULT_FACILITY_INTERIORS_CONFIG.heading,
        description: DEFAULT_FACILITY_INTERIORS_CONFIG.description,
        seoKeywords: Array.isArray(data.facilityGallery.seoKeywords)
          ? data.facilityGallery.seoKeywords
          : DEFAULT_FACILITY_INTERIORS_CONFIG.seoKeywords || [],
        rooms: Array.isArray(data.facilityGallery.rooms)
          ? data.facilityGallery.rooms
          : DEFAULT_FACILITY_INTERIORS_CONFIG.rooms,
      };
      setStorageItem(FACILITY_INTERIORS_CONFIG_KEY, updatedFacility, true);
      window.dispatchEvent(new CustomEvent('facility_interiors_updated', { detail: updatedFacility }));
    }

    // Automatically synchronize homepage_trust_brands_config and dispatch trust_brands_updated
    if (data.trustBrandsSection && typeof data.trustBrandsSection === 'object') {
      const updatedTrustBrands: TrustBrandsConfig = {
        heading: data.trustBrandsSection.heading || DEFAULT_TRUST_BRANDS_CONFIG.heading,
        seoKeywords: Array.isArray(data.trustBrandsSection.seoKeywords)
          ? data.trustBrandsSection.seoKeywords
          : DEFAULT_TRUST_BRANDS_CONFIG.seoKeywords || [],
        brands: Array.isArray(data.trustBrandsSection.brands)
          ? data.trustBrandsSection.brands
          : DEFAULT_TRUST_BRANDS_CONFIG.brands,
      };
      setStorageItem(TRUST_BRANDS_CONFIG_KEY, updatedTrustBrands, true);
      window.dispatchEvent(new CustomEvent('trust_brands_updated', { detail: updatedTrustBrands }));
    }

    // Automatically synchronize homepage_accreditations_config and dispatch accreditations_updated
    if (data.accreditationsSection || Array.isArray(data.accreditations)) {
      const accList = Array.isArray(data.accreditations) ? data.accreditations : CLINIC_DATA.accreditations || [];
      const updatedAccreditations: AccreditationsConfig = {
        eyebrow:
          data.accreditationsSection?.eyebrow ||
          DEFAULT_ACCREDITATIONS_CONFIG.eyebrow ||
          'Accreditations & Certifications',
        heading:
          data.accreditationsSection?.heading ||
          DEFAULT_ACCREDITATIONS_CONFIG.heading ||
          'Excellence guaranteed. Trusted globally.',
        description:
          data.accreditationsSection?.description ||
          DEFAULT_ACCREDITATIONS_CONFIG.description,
        seoKeywords: Array.isArray(data.accreditationsSection?.seoKeywords)
          ? data.accreditationsSection.seoKeywords
          : DEFAULT_ACCREDITATIONS_CONFIG.seoKeywords || [],
        items: accList,
        accreditations: accList.map((text, idx) => ({ id: `acc-${idx + 1}`, text })),
      };
      setStorageItem(ACCREDITATIONS_CONFIG_KEY, updatedAccreditations, true);
      window.dispatchEvent(new CustomEvent('accreditations_updated', { detail: updatedAccreditations }));
    }

    window.dispatchEvent(new CustomEvent('clinic_data_changed', { detail: data }));
  }
  return data;
}

export async function saveClinicDataToFile(data: ClinicData): Promise<{ success: boolean; message?: string; error?: string }> {
  updateClinicData(data);
  try {
    const res = await fetch('/api/admin/clinic-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clinicData: data })
    });
    const result = await res.json();
    return result;
  } catch (err) {
    console.error('Failed to save clinic data to file:', err);
    return { success: false, error: String(err) };
  }
}

// Alias for requested name: saveClinicDataConfig(data)
export async function saveClinicDataConfig(data: ClinicData): Promise<{ success: boolean; message?: string; error?: string }> {
  return saveClinicDataToFile(data);
}

export function resetClinicDataToDefault(): ClinicData {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(CLINIC_INFO_DATA_KEY);
    updateClinicData(CLINIC_DATA);
  }
  return CLINIC_DATA;
}

// Sync clinic data from remote server on demand
export async function fetchRemoteClinicData(): Promise<ClinicData | null> {
  try {
    const res = await fetch('/api/admin/clinic-data');
    if (res.ok) {
      const json = await res.json();
      if (json && json.clinicData) {
        updateClinicData(json.clinicData);
        return json.clinicData;
      }
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch remote clinic data:', err);
    return null;
  }
}

// =========================================================================
// Treatment Pricing Store Management (treatmentPricing.ts & siteCustomizations.json)
// =========================================================================

export function getTreatmentPricingData(): TreatmentPricingItem[] {
  return getStorageItem<TreatmentPricingItem[]>(
    TREATMENT_PRICING_DATA_KEY,
    getFileDefault<TreatmentPricingItem[]>('treatment_pricing_data', TREATMENT_PRICING_DATA)
  );
}

export function getTreatmentPricingCategories(): readonly string[] {
  return TREATMENT_PRICING_CATEGORIES;
}

export function updateTreatmentPricingData(data: TreatmentPricingItem[]): TreatmentPricingItem[] {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(TREATMENT_PRICING_DATA_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('treatment_pricing_updated', { detail: data }));
  }
  return data;
}

export async function saveTreatmentPricingData(
  data: TreatmentPricingItem[]
): Promise<{ success: boolean; message?: string; error?: string }> {
  // Update local storage and dispatch global event immediately for zero-delay UI update
  updateTreatmentPricingData(data);

  try {
    const res = await fetch('/api/admin/treatment-pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ treatmentPricingData: data })
    });
    const result = await res.json();
    return result;
  } catch (err) {
    console.error('Failed to persist treatment pricing to disk:', err);
    return { success: false, error: String(err) };
  }
}

export function resetTreatmentPricingDataToDefault(): TreatmentPricingItem[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(TREATMENT_PRICING_DATA_KEY);
    window.dispatchEvent(new CustomEvent('treatment_pricing_updated', { detail: TREATMENT_PRICING_DATA }));
  }
  // Also sync the reset to server
  fetch('/api/admin/treatment-pricing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ treatmentPricingData: TREATMENT_PRICING_DATA })
  }).catch((err) => {
    console.warn('Could not sync reset treatment pricing to server:', err);
  });
  return TREATMENT_PRICING_DATA;
}

// Sync treatment pricing data from remote server on demand
export async function fetchRemoteTreatmentPricingData(): Promise<TreatmentPricingItem[] | null> {
  try {
    const res = await fetch('/api/admin/treatment-pricing');
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data)) {
        updateTreatmentPricingData(json.data);
        return json.data;
      }
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch remote treatment pricing data:', err);
    return null;
  }
}

/**
 * Lightweight Card-List Query:
 * Returns ONLY essential card fields (TreatmentPricingCardSummary) and strips out
 * packages, procedureTime, downtime, galleryImages, and seoKeywords.
 */
export function getTreatmentPricingCardList(): TreatmentPricingCardSummary[] {
  const fullData = getTreatmentPricingData();
  return fullData
    .filter((item) => !item.hidden && item.isActive !== false)
    .map(projectTreatmentCardSummary);
}

/**
 * Remote Card-List Query (fields=card):
 * Fetches only projected card summary fields from the server without heavy package payloads.
 */
export async function fetchRemoteTreatmentPricingCardList(): Promise<TreatmentPricingCardSummary[] | null> {
  try {
    const res = await fetch('/api/admin/treatment-pricing?fields=card');
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data)) {
        return json.data
          .filter((item: TreatmentPricingCardSummary) => !item.hidden && item.isActive !== false)
          .map(projectTreatmentCardSummary);
      }
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch remote projected treatment cards:', err);
    return null;
  }
}

/**
 * Paginated & Projected Local Store Helper:
 * Filters by category, subOptions, search, sorts by sort, projects ONLY essential card columns,
 * and returns a 10-card slice (offset, limit=10) + totalCount and hasMore metadata.
 */
export function getPaginatedTreatmentCards(
  params: TreatmentPricingQueryParams = {}
): PaginatedTreatmentCardsResponse {
  const fullData = getTreatmentPricingData();
  const activeTaxonomy = params.taxonomy || getTreatmentTaxonomy();
  return filterAndSortTreatmentCards(fullData, {
    ...params,
    taxonomy: activeTaxonomy,
    limit: params.limit ?? 10,
    fields: 'card',
  });
}

/**
 * Paginated & Projected Server Endpoint Fetcher:
 * Calls GET /api/admin/treatment-pricing?fields=card&limit=10&offset=...&category=...&subOptions=...&search=...&sort=...
 * Falls back cleanly to getPaginatedTreatmentCards if offline or if local unsaved admin edits exist.
 */
export async function fetchPaginatedTreatmentCards(
  params: TreatmentPricingQueryParams = {}
): Promise<PaginatedTreatmentCardsResponse> {
  const limit = params.limit ?? 10;
  const page = params.page ?? 1;
  const offset = params.offset !== undefined ? params.offset : (page - 1) * limit;

  // If the admin has local storage overrides in the current browser session, ensure immediate consistency
  if (
    typeof window !== 'undefined' &&
    (window.localStorage.getItem(TREATMENT_PRICING_DATA_KEY) ||
      window.localStorage.getItem(TREATMENT_TAXONOMY_KEY) ||
      window.localStorage.getItem(MASTER_SERVICES_CONFIG_KEY))
  ) {
    return getPaginatedTreatmentCards({ ...params, limit, offset, page });
  }

  try {
    const searchParams = new URLSearchParams();
    searchParams.set('fields', 'card');
    searchParams.set('limit', String(limit));
    searchParams.set('offset', String(offset));
    searchParams.set('page', String(Math.floor(offset / limit) + 1));

    if (params.category) searchParams.set('category', params.category);
    if (params.subOptions && params.subOptions.length > 0) {
      searchParams.set('subOptions', params.subOptions.join(','));
    }
    if (params.search && params.search.trim()) {
      searchParams.set('search', params.search.trim());
    }
    if (params.sort) {
      searchParams.set('sort', params.sort);
    }

    const res = await fetch(`/api/admin/treatment-pricing?${searchParams.toString()}`);
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.items || json.data)) {
        const rawItems = json.items || json.data;
        return {
          items: rawItems.map(projectTreatmentCardSummary),
          totalCount:
            typeof json.totalCount === 'number' ? json.totalCount : rawItems.length,
          hasMore: Boolean(json.hasMore),
          page: typeof json.page === 'number' ? json.page : Math.floor(offset / limit) + 1,
          offset: typeof json.offset === 'number' ? json.offset : offset,
          limit: typeof json.limit === 'number' ? json.limit : limit,
        };
      }
    }
  } catch (err) {
    console.warn('Falling back to local paginated treatment cards:', err);
  }

  return getPaginatedTreatmentCards({ ...params, limit, offset, page });
}

/**
 * Lookup full treatment details (including packages, procedureTime, downtime) by ID synchronously
 */
export function getTreatmentPricingItemById(id: string): TreatmentPricingItem | null {
  const fullData = getTreatmentPricingData();
  return fullData.find((item) => item.id === id) || null;
}

/**
 * On-demand single-item detail selector/fetcher:
 * Calls GET /api/admin/treatment-pricing/:id to fetch packages[], procedureTime, and downtime
 * ONLY when a specific card is clicked.
 */
export async function getTreatmentPackageDetailsById(
  id: string
): Promise<TreatmentPricingItem | null> {
  if (!id) return null;

  // Check local admin override first if present
  if (typeof window !== 'undefined' && window.localStorage.getItem(TREATMENT_PRICING_DATA_KEY)) {
    const localItem = getTreatmentPricingItemById(id);
    if (localItem) return localItem;
  }

  try {
    const res = await fetch(`/api/admin/treatment-pricing/${encodeURIComponent(id)}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        return json.data as TreatmentPricingItem;
      }
    }
  } catch (err) {
    console.warn(`Could not fetch remote package details for ${id}, using local fallback:`, err);
  }

  return getTreatmentPricingItemById(id);
}

// =========================================================================
// Treatment Taxonomy & Manageable Hierarchy Store (Two-Tier Groups)
// =========================================================================

let _isSyncingTaxonomyAndServices = false;

const CORE_BRANCH_ID_TO_NAME: Array<{ id: string; name: MasterBranchCategory }> = [
  { id: 'face-injectables', name: 'Face & Injectables' },
  { id: 'body-sculpting', name: 'Body Sculpting' },
  { id: 'advanced-facials', name: 'Advanced Facials' },
  { id: 'hair-beauty', name: 'Hair & Beauty' },
  { id: 'iv-drips-wellness', name: 'IV Drips & Wellness' },
];

export function buildTaxonomyFromMasterServices(
  services: SpecialistArea[],
  existingTaxonomy?: TreatmentTaxonomyGroup[]
): TreatmentTaxonomyGroup[] {
  const coreIds = new Set(CORE_BRANCH_ID_TO_NAME.map((b) => b.id));
  const existingById = new Map((existingTaxonomy || []).map((b) => [b.id, b]));

  // Start with the 5 core branches (preserving any custom renamed display title if present)
  const groups: TreatmentTaxonomyGroup[] = CORE_BRANCH_ID_TO_NAME.map((core) => {
    const existing = existingById.get(core.id);
    return {
      id: core.id,
      name: existing?.name || core.name,
      subGroups: [],
    };
  });

  // Append any custom parent branches created by the user in TreatmentPricingEditor
  if (Array.isArray(existingTaxonomy)) {
    for (const customBranch of existingTaxonomy) {
      if (customBranch && customBranch.id && !coreIds.has(customBranch.id)) {
        groups.push({
          id: customBranch.id,
          name: customBranch.name,
          subGroups: (customBranch.subGroups || []).filter(
            (s) => s && s.id && !LEGACY_BROCHURE_SUBGROUP_IDS.has(s.id)
          ),
        });
      }
    }
  }

  // Track sub-group IDs already placed in custom branches so they aren't duplicated into core branches
  const placedSubGroupIds = new Set<string>();
  for (const g of groups) {
    for (const s of g.subGroups) {
      placedSubGroupIds.add(s.id);
    }
  }

  // Populate subGroups directly from Services & Branches (getMasterServices)
  for (const service of services) {
    if (placedSubGroupIds.has(service.id)) continue;

    const customCatCandidate = (service.category || '').trim();
    const rawBranch = service.pricingCategory || service.category || '';

    // Match custom branch first if applicable, otherwise match core branch
    let targetGroup =
      groups.find(
        (g) =>
          !coreIds.has(g.id) &&
          customCatCandidate &&
          (g.name.toLowerCase() === customCatCandidate.toLowerCase() ||
            g.id === customCatCandidate.toLowerCase())
      ) ||
      groups.find(
        (g) => g.name.toLowerCase() === rawBranch.toLowerCase() || g.id === rawBranch.toLowerCase()
      );

    if (!targetGroup) {
      const normalizedBranchName = normalizeMasterBranch(rawBranch, service.title);
      const coreMatch = CORE_BRANCH_ID_TO_NAME.find((c) => c.name === normalizedBranchName);
      targetGroup = groups.find((g) => g.id === coreMatch?.id || g.name === normalizedBranchName) || groups[0];
    }

    if (targetGroup && !targetGroup.subGroups.some((s) => s.id === service.id)) {
      targetGroup.subGroups.push({
        id: service.id,
        name: service.title,
      });
      placedSubGroupIds.add(service.id);
    }
  }

  return groups;
}

export function getTreatmentTaxonomy(): TreatmentTaxonomyGroup[] {
  initializeAdminStore();
  const masterServices = getMasterServices();
  const raw = getStorageItem<TreatmentTaxonomyGroup[] | null>(
    TREATMENT_TAXONOMY_KEY,
    getFileDefault<TreatmentTaxonomyGroup[] | null>(TREATMENT_TAXONOMY_KEY, null)
  );

  // Check if stored taxonomy contains any of the old hardcoded brochure subGroup IDs
  const hasLegacySubGroups =
    Array.isArray(raw) &&
    raw.some((g) => (g.subGroups || []).some((s) => LEGACY_BROCHURE_SUBGROUP_IDS.has(s.id)));

  const synced = buildTaxonomyFromMasterServices(
    masterServices,
    hasLegacySubGroups ? undefined : raw || undefined
  );

  // If localStorage had stale legacy brochure sub-groups, overwrite it immediately with the synced Services & Branches taxonomy
  if (hasLegacySubGroups && typeof window !== 'undefined') {
    setStorageItem(TREATMENT_TAXONOMY_KEY, synced);
  }

  return synced.length > 0 ? synced : DEFAULT_TREATMENT_TAXONOMY;
}

export function updateTreatmentTaxonomy(
  taxonomy: TreatmentTaxonomyGroup[]
): TreatmentTaxonomyGroup[] {
  if (typeof window !== 'undefined') {
    setStorageItem(TREATMENT_TAXONOMY_KEY, taxonomy);
    window.dispatchEvent(
      new CustomEvent('treatment_taxonomy_updated', { detail: taxonomy })
    );
  }

  // Bidirectionally sync sub-groups back into Services & Branches (getMasterServices)
  if (!_isSyncingTaxonomyAndServices) {
    try {
      _isSyncingTaxonomyAndServices = true;
      const currentServices = getMasterServices();
      const existingById = new Map(currentServices.map((s) => [s.id, s]));
      const nextServices: SpecialistArea[] = [];
      let index = 0;

      for (const branch of taxonomy) {
        const branchCategory = normalizeMasterBranch(branch.name);
        for (const sub of branch.subGroups || []) {
          if (!sub || !sub.id || LEGACY_BROCHURE_SUBGROUP_IDS.has(sub.id)) continue;
          index += 1;
          const existing = existingById.get(sub.id);
          if (existing) {
            nextServices.push(
              normalizeSpecialistServiceItem(
                {
                  ...existing,
                  title: sub.name,
                  pricingCategory: branchCategory,
                  category: branch.name,
                },
                index - 1
              )
            );
          } else {
            nextServices.push(
              normalizeSpecialistServiceItem(
                {
                  id: sub.id,
                  number: String(index).padStart(2, '0'),
                  title: sub.name,
                  description: `Bespoke ${sub.name} treatment tailored for natural, clinically proven results.`,
                  image: '/assets/images/treatments/specialist-profhilo.jpg',
                  pricingCategory: branchCategory,
                  category: branch.name,
                  transformationCategory: inferTransformationCategoryFromBranch(branchCategory, sub.name),
                  price: 'From £150',
                  duration: '45–60 Mins',
                  icon: 'Sparkles',
                },
                index - 1
              )
            );
          }
        }
      }

      if (nextServices.length > 0) {
        saveMasterServices(nextServices);
      }
    } catch (err) {
      console.warn('Could not sync treatment taxonomy changes to master services:', err);
    } finally {
      _isSyncingTaxonomyAndServices = false;
    }
  }

  return taxonomy;
}

export async function saveTreatmentTaxonomy(
  taxonomy: TreatmentTaxonomyGroup[]
): Promise<{ success: boolean; message?: string; error?: string }> {
  // Update local storage, sync Services & Branches, and dispatch global event immediately
  updateTreatmentTaxonomy(taxonomy);

  try {
    const res = await fetch('/api/admin/treatment-taxonomy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taxonomy })
    });
    const result = await res.json();
    return result;
  } catch (err) {
    console.error('Failed to persist treatment taxonomy to disk:', err);
    return { success: false, error: String(err) };
  }
}

export function resetTreatmentTaxonomy(): TreatmentTaxonomyGroup[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(TREATMENT_TAXONOMY_KEY);
  }
  const resetServices = resetMasterServicesToDefaults();
  const defaultTax = buildTaxonomyFromMasterServices(resetServices);
  if (typeof window !== 'undefined') {
    setStorageItem(TREATMENT_TAXONOMY_KEY, defaultTax);
    window.dispatchEvent(
      new CustomEvent('treatment_taxonomy_updated', { detail: defaultTax })
    );
  }
  fetch('/api/admin/treatment-taxonomy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taxonomy: defaultTax })
  }).catch((err) => {
    console.warn('Could not sync reset treatment taxonomy to server:', err);
  });
  return defaultTax;
}

export async function fetchRemoteTreatmentTaxonomy(): Promise<TreatmentTaxonomyGroup[] | null> {
  try {
    const res = await fetch('/api/admin/treatment-taxonomy');
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.taxonomy)) {
        const hasLegacy = json.taxonomy.some((g: any) =>
          (g.subGroups || []).some((s: any) => LEGACY_BROCHURE_SUBGROUP_IDS.has(s.id))
        );
        if (!hasLegacy) {
          const currentStored = getStorageItem<TreatmentTaxonomyGroup[]>(TREATMENT_TAXONOMY_KEY, []);
          const isDifferent = JSON.stringify(currentStored) !== JSON.stringify(json.taxonomy);
          if (isDifferent) {
            setStorageItem(TREATMENT_TAXONOMY_KEY, json.taxonomy);
            const merged = getTreatmentTaxonomy();
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('treatment_taxonomy_updated', { detail: merged }));
            }
            return merged;
          }
          return getTreatmentTaxonomy();
        }
      }
    }
    return getTreatmentTaxonomy();
  } catch (err) {
    console.warn('Could not fetch remote treatment taxonomy:', err);
    return null;
  }
}





