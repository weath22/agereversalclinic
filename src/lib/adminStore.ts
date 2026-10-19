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
  MediaAssetRecord
} from '../types';
import { CLINIC_DATA, ClinicData, ClinicLocation } from '../data/clinicInfo';
import { 
  TreatmentPricingItem, 
  TREATMENT_PRICING_DATA, 
  TREATMENT_PRICING_CATEGORIES 
} from '../data/treatmentPricing';
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
const CENTRAL_MEDIA_ASSETS_KEY = 'central_clinic_media_assets';

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

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Asynchronously write changes directly to project source files on server disk
    if (key.startsWith('homepage_') || key.startsWith('profile_')) {
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
 * Upload an image or media asset directly to public/uploads/ on disk
 */
export async function uploadAssetFile(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        const res = await fetch('/api/admin/upload-asset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            dataUrl
          })
        });
        const data = await res.json();
        if (data.success && data.url) {
          // Automatic Asset Library Registration (Task 2.1)
          try {
            registerMediaAsset({
              name: file.name,
              url: data.url,
              mediaType: file.type.startsWith('video/') ? 'video' : 'image',
              size: file.size,
              category: 'Uploads',
              altText: `${file.name.replace(/\.[^/.]+$/, '')} - Age Reversal Clinic London`
            });
          } catch (regErr) {
            console.warn('Could not auto-register uploaded asset:', regErr);
          }
          resolve({ success: true, url: data.url });
        } else {
          resolve({ success: false, error: data.error || 'Failed to upload asset' });
        }
      } catch (e) {
        resolve({ success: false, error: String(e) });
      }
    };
    reader.onerror = () => resolve({ success: false, error: 'Failed to read file' });
    reader.readAsDataURL(file);
  });
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
      [TREATMENT_DETAILS_KEY]: getTreatmentDetailsConfig(),
      [CENTRAL_MEDIA_ASSETS_KEY]: getRegisteredMediaAssets()
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
  logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDesjN_a9T_c5ApVXtUbu_ZXToYSdPJkIyWoDOPkSuBoQRUyOhQp9l6Db9Wj4GBiuknLiRRmpxvA8iVUDtgyK1RWmkj17T-q0e-wv--cxohuK0XmXvrJN6DnkzK2gFmAprNxac_5EvIby0Pz6lyQGXQN8mXvvvWzRMdLtFeNDOnDO771chO4DAAYKRhLj_xguQkL4cWu1mf8hIz8RmRWNBhRLYOnOER31n5Ivd-7gbMKNxOExOBolE15qJO37x9C8cAZLSbx_RCy48Q",
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
  areas: [
    {
      id: 'face',
      title: 'Facial Injectables',
      description: 'Advanced clinical injectables and facial contouring tailored for natural lift, harmony, and structural rejuvenation.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOPTQtfj8J1bbB7SlVVRU6fYo2gWaZ-vP4FOmbQ0GK-wiSWxgFv7RrufflpNtjGP9Dk5eLV2kMfUIPVx1N4ETnRWMUGQ-pnWBcZCa97apM4cg71CV6hKaKDiQOlU26NKqLXuvzRkHrDNd-vXfy5u3MHCvpyxfbnHdk9lkm5vhjg9zIrK1aYJGwOOOPurVrXxbRr7FprgjD7ZzrUzhcc4DM6YdWc6J8P_jEx9W_ffwKfL2E8x3PIYt0_G8MTcbFUJlLtFYmgOa7s-OK'
    },
    {
      id: 'skin',
      title: 'Skin Rejuvenation',
      description: 'State-of-the-art medical grade facials, laser therapies, and cellular treatments for luminous, clear skin.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2a_0Datjn8f2On3mNF7IY6_QgXkw0AQl1Il2WqYPqYqTU7wUKYRpJUg2xdA_d0B8SfBpbvVzzYOczvA85hXWv6hkb0snKG0UXUjP3EUDr0nkt_A_nINJJOIpGcQ2X_iD94V14qlhvJmRUp8In6cOEtlONSRSf5Kpdd8uA6VUX3SFIaBku4xsVbSvg9fE6K0FWVX-QGNWmY4jhYY70yZCEdfN_V3cezSz0jiycoy31X-hMxrw-bNoMrpEVo43FV1z8TnWKiqVpTdlK'
    },
    {
      id: 'body',
      title: 'Body Contouring',
      description: 'High-definition body shaping using advanced clinical techniques, including dermal fillers and fat reduction.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClIGVnrpyhbZbn4skniRN95s8fe43niaHTpE2PHrPr4EAZc-kvyMu1k6JL4FcYCAw-SE1G2rBygkpuYimKkujZ8Ch9rHKJwqguHanaAZbAL8-ujTZWI6ThpC_rihPWbmp-seHAxJjDCFpT3JHdZknmaCVpfRjqS3n6DVdZCyDo4SBhN_q4D4NflwD5qBwDUw7uXpgpjXln7PkJWypOLjdKW-xVYzB53vh6hXOmAgbAecmaayoHjY2ZousTGNq_zRShg3Go2f8V0O4R'
    },
    {
      id: 'hair',
      title: 'Hair Restoration',
      description: 'Elite follicle stimulation and clinical growth induction therapies for healthy, robust hair restoration.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCauimUjLiG4FTybnhAOQgEeV5EX6ZPVafVgrL3ZQsSct4k3azc70DZOUL83NrLvzdJb2f8vDkSR-JW3kDIXtIlaDRE7geAe7clP3VWiV3uUxojtpMPuJEi5OqDgxLNHx9CkD10MbA89eiJWjBKIGS_6wyql817jtfy9hiYYvBvNSkfl-hWqMAYjqlQY60-eyfLsAJrUNmaucXp2XyxxJ3g8KII7-qGALB6o42Cwv1YMd51LLVpOMqPrCEUk2hzlWKV6lTlxBcieuUH'
    }
  ]
};

const DEFAULT_TREATMENTS_CONFIG: TreatmentsConfig = {
  editorialHeading: "rejuvenation",
  editorialSub: "Begin your transformation",
  description: "At Age Reversal Clinic, we believe that aesthetic harmony elevates self-confidence. Our clinical therapists custom-tailor skin therapy sessions, premium facials, and micropigmentation protocols to support your personal wellness ritual.",
  treatments: [
    { id: '1', name: 'Permanent cosmetic makeup' },
    { id: '2', name: 'Cosmetic makeup services' },
    { id: '3', name: 'Facial Services' },
    { id: '4', name: 'Tinting' }
  ]
};

const DEFAULT_GALLERY_CONFIG: BeforeAfterGalleryConfig = {
  heading: "Before & After Gallery",
  description: "Witness the transformative journeys of our patients. These unretouched, real clinical cases illustrate the precision-guided results we achieve daily across our specialist disciplines.",
  categories: [
    {
      id: 'anti-aging',
      name: 'Anti-Aging Rejuvenation',
      pairs: [
        {
          id: 'pair-1',
          title: 'Skin Treatment - 12 Wks',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6YRX4oWEimDRlPfT4ZvP49QVjagike9HlAOT7FsLhwf61UL4dCKCGWr1FS7SmMqMhd9VheV3RuR4bKmR_H3dRMFEAxUvuwj56dIFiriv8niGvOiz7XVef6Gjx4h3iHxaFayLl_g4p2ViKYOGEKxMw4bAR7W5VL-rkDMyy7LQjrabplnGUsrY6j9fECzUiFYmk_OZ_-hBZJAePOaKJjK0lqqjd7ahusnbsXJYKmIG5Rs5lmafypBuU_b9wqYQQG0v8O8BfCz2mokhu',
          afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtnTWTfvtjmgPs1n1Q2b5gdUnZqNuGV3e-_ZLF0KZFSWWrFhA3eAIX2iTTuaY-hDvVwQ5PKReB6fFMP3tq1WnzmcGJr11CXLsLkYmYd8zLGLdL5zETq6wohVWzqLcykLevZUPnJ_LG55HukqRiTUllO8pE80UJFXvPUytiYATX5fbzVCDVz_cqX20l_6dKdFzb4UaffXMlUAbDiZwQL531mZiVM9lUuSozSA_-uLXJhit8mpHzT04T8XOmmy7yIYQyPOkWqJTIqPfO'
        },
        {
          id: 'pair-5',
          title: 'Anti-Aging - 8 Wks',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQHcq9zpePKkMqtIMFzx_zJA6A2MHoEn6csMvjhOOX7ANTgntEGIHbHHzkJdrRGuvr_rnNYa6j_vcZm7V9bkSv83qNQwd18XJJA14YTUOLU2diwqx3hP_e-l8axRA5ZOsfN1xGiRO0pPe2sb4cNQEz8psyAxBRjvefn1MvexT-2iAwkVKIyT8R_56LKMScwW7_sMvuBzMGXxdp0I1cFNoqfp7K5RhhrtrwcfrUPw1dRPmX60Zc0esbeUgaFqwO959IBqnu8sf8OA4w',
          afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZoLjpjMEmJNM6EwzVC9AzZEWfQUVa-TmVyM-NgPL8ONCjzwY7nZ6rFqOxJ9jyK0OMnlIij8h8SOt93jaHfSglwGqtwAN3uabUuoux0yNyPzieFFX7iyB4YhjLSsBzd2BRDjEDVB1RlXcG4VC8SswApL8QbBnPLshzCzMX8LSdFYZsa0PRI6MM6b7I67HIl-B6YLhZAH5ZI9mcghNQsybRemIqmq4LWl9BCKjn5KaTyU1RyMrHYkwMgx1ABZOJ1-OJiLkjF-5mIKY0'
        }
      ]
    },
    {
      id: 'acne-scarring',
      name: 'Acne & Scarring',
      pairs: [
        {
          id: 'pair-2',
          title: 'Laser Therapy & Skin Revision',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKPf3nijQRz9NaEd_b-5EiczAejYyrgh_dwMC6S-1-7Hi8EJJnt8_x2x-i1qG-qJ0BxvXbk_PeIeusHvMggQrPf2ijjCJ-yYtr-Ur19sJw4_NIIAlLMv1S2ct_OUVp3CJNba1hCLXrrPOcfhQAQUcgqZJFcuUL6Q4KXUwM1ALRAeo6Bb79xdI4FoLRUFAP9_MlbZ8tUedBAnuVrheDWpnRtLnB17gtdOx3OFGMbTVs5jhXXnZD6b-y7OCBnlBNOtqOPMcKxAdzDKRk',
          afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFNbqNx3wVVcZoA9IP87KJkDnMZI-8uRSd-RL2-LhuxC6ADEkgMcpBDJ22CU3U7a_ZOllNge5XasdFvVaBYUhCDohAZdRi0HT1ymJ1s_FMyiXt8pJl7NGhaLkKATrZlXl3B2mFW01fD4Mzp3ixyyLcDfCdjXdPi58MzBZ-GTgGk7w7Ks96hydwAbc4rURmQ3Pel8YEcOvxIX5UbwIKvB4OdEuyDc-z_RnH-USDoP7hJ2AJkw4zTdCS7FDF6Vo4RFbWikgnECIa4gKP'
        }
      ]
    },
    {
      id: 'facial-harmony',
      name: 'Facial Harmony',
      pairs: [
        {
          id: 'pair-3',
          title: 'Advanced Aesthetics',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD20NLhroXmHS02eweFz9RBF-OhZ1RaQuMYe3uKrQ3iyvZ-roWLw57bJ33sw80W5DRjj47x5XfDBbMjHImuC7GRyDB99DirCCEbVZV8CTtkxIlVvsv3muJIAVMTHXiXqyc5zkYEu_ONKT40va6LO1TTmuJIgnYDdf4IauNPrqGL0pqV8S7wijzbRu89PlKh7cdxVcMqll1kYNG8e8Oy-dy4Ftdm6rYT9ZMn2IlwhqOYW0ekq6d9NnIYN_xGqSaNcN5s4N1iiVJMk3GV',
          afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDccMXAIYxuO2yvwTqN8m4d8QLiy48sfir-uvPIXURN6mHE9KnhgzWARsOBlK9Mr7YK53ev5SNz0PPuGxVRLSblgomVrpZxwnyuJUkmY-Ozf1hCAotsXBatMbvNCyS04ZJlkaYgvTJNROZ-js6VboTaV_3ll-A3k6pNoAAipu9StjstMbS0Laznf_O50IKrmUFaecZ-yeGpZtc8RnmuWeJ_Qsqe53K1Vl0UbckdWbcqY249cXQYBmdHpG1v0uiCq0Ly6hPEjF90b3le'
        }
      ]
    },
    {
      id: 'clinical-hair',
      name: 'Clinical Hair Restoration',
      pairs: [
        {
          id: 'pair-4',
          title: 'Vertical Comparison',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt4dLQWWadBxtTzBpplagu2J9MUvwKtNJkgViQjChgH82bAH_iO6gF6p-TSVCSZ2jViPeml_xgEZ7Iq6F_NEVjRCtxJ7KhPFDOYT5byV1VJXaplQwCg6QybxEWi8wHT_QpGlWU8xBqFyhtpBZao172mEYVtF0UVKABJBqCwM5SU30IS2ON1eLnGldXQRWwBGjBQU7aTfniH71oyqdfhnTK_-tGbm5YfhUmEG8QjW9Nsh3NLL2fC3UAJ83TDu-VoVMkNkLRQQdclSVR',
          afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkakM8tbhNmtYeKmoQBAAzTei0SDwQVg3jf4IfrTGNP8I8WmzYu8BL-eZUD6ccSBm9fY3UgWCvjrJX1rBeyzCvPpnD3Fa7-r7rI5pw8wP459wQIwtGxvpKIrc7paJJ_LgbbcH6SrOD3cwg6mM0x7ZahhhPNgqR7PkR4wXem9rqOpBJQQq8lP3Zmij233vHOLihq3N7Pxxs00WXjWevFzHxFsHzlNU6_pv9H7yfM-0JpAPd-C0UGYVLJ7BZ6WyP8HWAt41DR1q8v6Hd'
        }
      ]
    }
  ]
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
      imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLvP3DFx2If1DMSMz3JKM0HPzM540kXV5qx4ncam1B_CstR80gJfBU5AgVz_YsPJ7u8V1nICj4IKO0ho2mOZo1vuUDFZEw-Ayq4p14_4qW8gAEOq6vYJFfmXi02IYti-uAUEojYV7cVHRx8-IjuVyoJ6AdGSCYT0VhPznGkC--nZZbr2vqIbtzvJQaOoTpF7vm4dZGfUyfQgXnhGm3ra1mjdJAGKWeB3fhbxho_WV4iW-9ZUAe7bRastfXY"
    },
    {
      id: 'p2',
      title: "Top-rated by real patients",
      description: "Exceptional transformations with a verified 4.9/5 star rating from over 2,000 genuine patient reviews.",
      iconName: "Star",
      badge: "4.9/5 ★ (2,000+ Reviews)",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww"
    },
    {
      id: 'p3',
      title: "Advanced Clinical Technologies",
      description: "Equipped with gold-standard FDA-cleared RF, ultrasound, and picosecond medical laser treatment suites.",
      iconName: "Sparkles",
      badge: "FDA-Cleared Tech",
      imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLvbGkim0rHF7Ruf3smBfq7BlZDg7FTbjFo3KTx21CJ86qX2T7gThqEfQmaS69rYUNtNQrnGPXJIOJTcoIOz_hCdUGzS-Cyeio7-DWxIyZZVQH95grNa2bbhnLGjt5IANWtQWycAC7JKxw6K1syY9H1W4ty0-Mpc3D-dH4coJR0zr5IaxigQ7G2BRK9YnWheyv8CjvRuSu4fbTW4fj4AP8QhZU3p2G1Rg0ztNQS13w1SZT_7bU3qioomJ9_f"
    },
    {
      id: 'p4',
      title: "World-Class Medical Team",
      description: "GMC-registered aesthetic doctors and clinical nurse specialists with decades of specialized international expertise.",
      iconName: "Medal",
      badge: "GMC Registered",
      imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsFtpFDuaNJSlvtgV5ykI3LUHSXc0rzKFYXGGNqkYq6ujIGrmaVAI-UUZWBC9h6l95unMnlba0hL6OSt_W08ItQlzC4HTVhrV4H7Itfm0m7scTAtpBiomP9SY89c7Uj0Q5mgYXMjovpZuGcczZeQepLx4ye1bw1emHNdm8GxyKyt8TftVi79q1QOO0MHef213jXO6KWOkNL6ufVfwZSrPS20twzy3Jy2_MEVCz9mR9pJVAW24L2KhOTQP9P"
    }
  ]
};

const DEFAULT_AWARDS_CONFIG: AwardsConfig = {
  heading: "Awards & Recognition",
  subheading: "Recognized nationally and globally for excellence in clinical and aesthetic dermatology.",
  awards: [
    {
      id: 'aw-1',
      title: 'Dermatology Clinic of the Year',
      year: '2025',
      organization: 'Aesthetic Medicine Awards',
      imageUrl: '/src/assets/images/clinic/awards/award_dermatology.jpg'
    },
    {
      id: 'aw-2',
      title: 'Best Non-Surgical Rejuvenation',
      year: '2025',
      organization: 'Global Cosmetic Congress',
      imageUrl: '/src/assets/images/clinic/awards/award_rejuvenation.jpg'
    },
    {
      id: 'aw-3',
      title: 'Patient Safety Excellence Award',
      year: '2024',
      organization: 'British Health Standards',
      imageUrl: '/src/assets/images/clinic/awards/award_patient_safety.jpg'
    },
    {
      id: 'aw-4',
      title: 'Best Laser Skin Clinic',
      year: '2024',
      organization: 'International Laser Association',
      imageUrl: '/src/assets/images/clinic/awards/award_laser.jpg'
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
      imageUrl: loc.image || (idx === 0 
        ? "/assets/1791723050511-Screenshot_2026-07-24_193158.png" 
        : "/assets/1791729403362-arc-logo__1___2_.webp")
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
  heading: "Our Process",
  description: "Your journey to exceptional results.",
  steps: [
    {
      id: "step-1",
      stepNumber: "01",
      title: "Consultation",
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=400&fit=crop"
    },
    {
      id: "step-2",
      stepNumber: "02",
      title: "Treatment Plan",
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=400&h=400&fit=crop"
    }
  ]
};

const DEFAULT_FACILITY_INTERIORS_CONFIG: FacilityInteriorsConfig = {
  heading: "Our Facilities",
  description: "Experience world-class care in our state-of-the-art clinic.",
  rooms: [
    {
      id: "room-1",
      title: "Consultation Suite",
      tag: "Private",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=400&fit=crop"
    },
    {
      id: "room-2",
      title: "Treatment Room",
      tag: "Clinical",
      image: "https://images.unsplash.com/photo-1584982751601-97d8c2420086?w=400&h=400&fit=crop"
    }
  ]
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
  brands: [
    { id: 'bp-1', name: 'Lumina', iconType: 'circle' },
    { id: 'bp-2', name: 'Aether', iconType: 'layers' },
    { id: 'bp-3', name: 'Vera', iconType: 'pill' },
    { id: 'bp-4', name: 'Zenith', iconType: 'shield' },
    { id: 'bp-5', name: 'Nexus', iconType: 'instagram' }
  ]
};

const DEFAULT_ACCREDITATIONS_CONFIG: AccreditationsConfig = {
  accreditations: [
    { id: 'acc-1', text: 'CQC Registered' },
    { id: 'acc-2', text: 'Save Face Accredited' }
  ]
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

export function getSpecialistAreasConfig(): SpecialistAreasConfig {
  initializeAdminStore();
  return getStorageItem<SpecialistAreasConfig>(SPECIALIST_AREAS_CONFIG_KEY, getFileDefault(SPECIALIST_AREAS_CONFIG_KEY, DEFAULT_SPECIALIST_AREAS_CONFIG));
}

export function saveSpecialistAreasConfig(config: SpecialistAreasConfig): SpecialistAreasConfig {
  setStorageItem(SPECIALIST_AREAS_CONFIG_KEY, config);
  return config;
}

export function getTreatmentsConfig(): TreatmentsConfig {
  initializeAdminStore();
  return getStorageItem<TreatmentsConfig>(TREATMENTS_CONFIG_KEY, getFileDefault(TREATMENTS_CONFIG_KEY, DEFAULT_TREATMENTS_CONFIG));
}

export function saveTreatmentsConfig(config: TreatmentsConfig): TreatmentsConfig {
  setStorageItem(TREATMENTS_CONFIG_KEY, config);
  return config;
}

export function getBeforeAfterGalleryConfig(): BeforeAfterGalleryConfig {
  initializeAdminStore();
  return getStorageItem<BeforeAfterGalleryConfig>(GALLERY_CONFIG_KEY, getFileDefault(GALLERY_CONFIG_KEY, DEFAULT_GALLERY_CONFIG));
}

export function saveBeforeAfterGalleryConfig(config: BeforeAfterGalleryConfig): BeforeAfterGalleryConfig {
  setStorageItem(GALLERY_CONFIG_KEY, config);
  return config;
}

export function getWhyChooseUsConfig(): WhyChooseUsConfig {
  initializeAdminStore();
  return getStorageItem<WhyChooseUsConfig>(WHY_CHOOSE_US_CONFIG_KEY, getFileDefault(WHY_CHOOSE_US_CONFIG_KEY, DEFAULT_WHY_CHOOSE_US_CONFIG));
}

export function saveWhyChooseUsConfig(config: WhyChooseUsConfig): WhyChooseUsConfig {
  setStorageItem(WHY_CHOOSE_US_CONFIG_KEY, config);
  return config;
}

export function getAwardsConfig(): AwardsConfig {
  initializeAdminStore();
  return getStorageItem<AwardsConfig>(AWARDS_CONFIG_KEY, getFileDefault(AWARDS_CONFIG_KEY, DEFAULT_AWARDS_CONFIG));
}

export function saveAwardsConfig(config: AwardsConfig): AwardsConfig {
  setStorageItem(AWARDS_CONFIG_KEY, config);
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
  return getStorageItem<ProcessConfig>(PROCESS_CONFIG_KEY, getFileDefault(PROCESS_CONFIG_KEY, DEFAULT_PROCESS_CONFIG));
}

export function saveProcessConfig(config: ProcessConfig): ProcessConfig {
  setStorageItem(PROCESS_CONFIG_KEY, config);
  return config;
}

export function getFacilityInteriorsConfig(): FacilityInteriorsConfig {
  initializeAdminStore();
  return getStorageItem<FacilityInteriorsConfig>(FACILITY_INTERIORS_CONFIG_KEY, getFileDefault(FACILITY_INTERIORS_CONFIG_KEY, DEFAULT_FACILITY_INTERIORS_CONFIG));
}

export function saveFacilityInteriorsConfig(config: FacilityInteriorsConfig): FacilityInteriorsConfig {
  setStorageItem(FACILITY_INTERIORS_CONFIG_KEY, config);
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
  return getStorageItem<TrustBrandsConfig>(TRUST_BRANDS_CONFIG_KEY, getFileDefault(TRUST_BRANDS_CONFIG_KEY, DEFAULT_TRUST_BRANDS_CONFIG));
}

export function saveTrustBrandsConfig(config: TrustBrandsConfig): TrustBrandsConfig {
  setStorageItem(TRUST_BRANDS_CONFIG_KEY, config);
  return config;
}

export function getAccreditationsConfig(): AccreditationsConfig {
  initializeAdminStore();
  return getStorageItem<AccreditationsConfig>(ACCREDITATIONS_CONFIG_KEY, getFileDefault(ACCREDITATIONS_CONFIG_KEY, DEFAULT_ACCREDITATIONS_CONFIG));
}

export function saveAccreditationsConfig(config: AccreditationsConfig): AccreditationsConfig {
  setStorageItem(ACCREDITATIONS_CONFIG_KEY, config);
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
export function getClinicData(): ClinicData {
  return getStorageItem<ClinicData>(
    CLINIC_INFO_DATA_KEY,
    getFileDefault<ClinicData>('clinic_info_data', CLINIC_DATA)
  );
}

// Alias for requested name: getClinicDataConfig()
export function getClinicDataConfig(): ClinicData {
  return getClinicData();
}

export function updateClinicData(data: ClinicData): ClinicData {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(CLINIC_INFO_DATA_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('clinic_data_changed', { detail: data }));

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
            imageUrl: loc.image || ""
          };
        })
      };
      setStorageItem(LOCATIONS_CONFIG_KEY, updatedLocConfig);
      window.dispatchEvent(new CustomEvent('locations_config_changed', { detail: updatedLocConfig }));
    }
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
    window.dispatchEvent(new CustomEvent('clinic_data_changed', { detail: CLINIC_DATA }));
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


