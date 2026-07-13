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
  ProfilePageConfig
} from '../types';

// Storage keys
const CONSULTATIONS_KEY = 'clinical_consultations';
const APPOINTMENTS_KEY = 'clinical_appointments';
const INQUIRIES_KEY = 'clinical_inquiries';
const HEADER_CONFIG_KEY = 'homepage_header_config';
const HERO_CONFIG_KEY = 'homepage_hero_config';
const SPECIALIST_AREAS_CONFIG_KEY = 'homepage_specialist_areas_config';
const TREATMENTS_CONFIG_KEY = 'homepage_treatments_config';
const GALLERY_CONFIG_KEY = 'homepage_gallery_config';
const WHY_CHOOSE_US_CONFIG_KEY = 'homepage_why_choose_us_config';
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
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
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
  mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-receiving-a-facial-treatment-40541-large.mp4"
};

const DEFAULT_SPECIALIST_AREAS_CONFIG: SpecialistAreasConfig = {
  heading: "Explore our specialist areas",
  description: "At The London Clinic, we offer advanced diagnostics, world-leading consultants and fast access to appointments - often within 48 hours - so your treatment can begin in days, not months. Whether you're worried about cancer, fatigue, weight loss, unexplained symptoms or a family medical history, we move quickly to get you the right help.",
  areas: [
    {
      id: 'cancer-care',
      title: 'Cancer care',
      description: 'Expert consultants and advanced therapies for fast, world-class private cancer treatment.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXc7SORxoXUK7Kzbf256KDGjYoiGB3XeCLNYObBtlw7h8260KwmKxaiEQL7E2Wg3BTQhjpJs0Iw9GVYkNkpYhd4WPz_jdW6PA2i4yXAVvmrMoBCqMX479nyNRdb7X8GwVNjcQtb1OIG8li-NYXrs-55c2CPQIIew0siqNajiO8--wLogFbflBlElSPQ9GlaxJ2VmWkjKCbGUr2QX1FhpzqTBOU86kyynhHW4UjQMqKe-XDBVsXygiZM-ACB4nUWQl8J4dDjsBIEw'
    },
    {
      id: 'eye-centre',
      title: 'Eye Centre',
      description: 'Rapid diagnostics and tailored treatment for cataracts, eye disease and complex conditions.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4fJHIJX0K1v-oz5txqtrtxpaIViJ65RYhXP0GvCvV9X-BUkcVQEzgBqKS8YzsomPWnOJfJG0bHH7KhmjwFqawKN0Ss4I6mWbR3ZNdU44GSg2NLrvKAwaRieRBsOOT7KE8OriZhzgqvAFhE2KvoiitHEBwjWSBKT4Y81onojL9xa2DBvQY3ooaY_hI5oMtsQHGTkAhp4nYkzSmtJGApHA0MjH-_XS-vhuGsAAtT9vX_mD_3h-ImzrSsTJQk47WHJvD5amFx30t_g'
    },
    {
      id: 'lung-centre',
      title: 'Lung Centre',
      description: 'Fast access to lung diagnostics, therapies and minimally invasive treatments.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSewylSW1YbrYNaLbxZiwxQF6qhQmFTupVXlyUicJq7mls_9KiS0PKgUNmGBOXbGpaLuWRlegLQQDTQbvbNoC7CkLSz2F7KwNAc-d1s8luKt2R6VcojE1oK87g_TmfoFqurEFqbHSXUephHqQH3cIeAEMpzhaqXbEjIVKRBDAQMypjwZ3r-r3Um4iGWAwLDcARQTOD0Hw6TZmIYW9jH-_qH3xAxZVfPts2b6Qg_4UdK0nwL7q9pfmgOvUiiwB4ATkn09Vp0ctO6w'
    },
    {
      id: 'breast',
      title: 'Breast',
      description: 'Expert breast diagnostics with advanced, comfortable imaging for symptoms or family history concerns.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUloxcWsT4NRCnTfn0RneF4Q4BwymxBAMsqFKJv9IIvSzEjhVsjT_MDtI4irgzGW0su__ZFlPbs8_2ebSsDU3aWDop2YR9ea2x21K8fdCKFFVUTyJj9U_xiYZFY63zL5Btb43hR-HaxmbiKFgUp8DqEgm5D4mrjpPpfVzplLWjcWFD75MC4S3cc8dnLB7CywLocC5PIZJPdVTfCwgrgG4WqwQZabVdZ8OAlRAeHeZCBxQt2rP-Gm1MJcgjtoht4nVH3CBwLsNAF8OI'
    },
    {
      id: 'dermatology',
      title: 'Dermatology & Acne',
      description: 'Advanced clinical diagnostics and personalized therapies for persistent acne, cellular scarring.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX'
    },
    {
      id: 'laser-skin',
      title: 'Laser Skin Centre',
      description: 'State-of-the-art fractional CO2 and picosecond laser technologies for complete resurfacing and pigments.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC'
    },
    {
      id: 'facial-contouring',
      title: 'Facial Contouring',
      description: 'Precision aesthetic enhancements combining neuromodulators, fillers, and skin boosters for natural lift.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ'
    },
    {
      id: 'hair-restoration',
      title: 'Hair Restoration',
      description: 'Elite follicle stimulation, PRP and clinical growth induction therapies for healthy, robust hair.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW'
    },
    {
      id: 'cellular-wellness',
      title: 'Cellular Wellness',
      description: 'Intravenous micronutrient therapies and custom cellular vitalizations tailored to bio-markers.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r'
    },
    {
      id: 'longevity-screen',
      title: 'Longevity Screening',
      description: 'Pioneering early stage risk profiles, metabolic evaluations, and long-term vitality maps.',
      image: 'https://lh3.googleusercontent.com/aida/AP1WRLsFtpFDuaNJSlvtgV5ykI3LUHSXc0rzKFYXGGNqkYq6ujIGrmaVAI-UUZWBC9h6l95unMnlba0hL6OSt_W08ItQlzC4HTVhrV4H7Itfm0m7scTAtpBiomP9SY89c7Uj0Q5mgYXMjovpZuGcczZeQepLx4ye1bw1emHNdm8GxyKyt8TftVi79q1QOO0MHef213jXO6KWOkNL6ufVfwZSrPS20twzy3Jy2_MEVCz9mR9pJVAW24L2KhOTQP9P'
    },
    {
      id: 'body-sculpting',
      title: 'Body Sculpting',
      description: 'High-definition body shaping using advanced clinical electromagnetic waves and cryolipolysis.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR'
    },
    {
      id: 'clinical-facials',
      title: 'Medical Grade Facials',
      description: 'Intense dermal cleansing, microcurrent contouring, and medical peels with botanical antioxidants.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs'
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
      id: 'acne',
      name: 'Acne & Scarring',
      pairs: [
        {
          id: 'acne-1',
          title: 'Active Acne Clear-Up - 12 Wks',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
          afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY'
        },
        {
          id: 'acne-2',
          title: 'Atrophic Scar Smoothing - 6 Mths',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
          afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLv5evIx7Bexs-9iJGxOP9dKFElgqCjw3duyD5PU_MlEubT0SyTO7PuZhJtmqUZf6JcUhS8jDhV8HW0kBhWUb4MYYalT72IO5pVBeVZs2593mjjAC6tI1ZOA1a9xGgg-M5J5waWMYO9uVD4zle9guZj31tQOME7032wvttEoahsd7HhWFooW0oUTyDgrytGK4oKIN0d2mGO5oLnx-NQ5sF7-OZHtA3a9_sCrUegKiXGZwpy_05469C2zVgo'
        }
      ]
    },
    {
      id: 'antiaging',
      name: 'Anti-Aging Rejuvenation',
      pairs: [
        {
          id: 'age-1',
          title: 'Deep Wrinkle Diminution - 16 Wks',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
          afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLv5evIx7Bexs-9iJGxOP9dKFElgqCjw3duyD5PU_MlEubT0SyTO7PuZhJtmqUZf6JcUhS8jDhV8HW0kBhWUb4MYYalT72IO5pVBeVZs2593mjjAC6tI1ZOA1a9xGgg-M5J5waWMYO9uVD4zle9guZj31tQOME7032wvttEoahsd7HhWFooW0oUTyDgrytGK4oKIN0d2mGO5oLnx-NQ5sF7-OZHtA3a9_sCrUegKiXGZwpy_05469C2zVgo'
        }
      ]
    },
    {
      id: 'hair',
      name: 'Clinical Hair Restoration',
      pairs: [
        {
          id: 'hair-1',
          title: 'Temporal Hairline Density - 6 Mths',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
          afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM'
        }
      ]
    }
  ]
};

const DEFAULT_WHY_CHOOSE_US_CONFIG: WhyChooseUsConfig = {
  heading: "Why choose The London Clinic?",
  description: "Your health deserves the very best. Here’s why patients trust The London Clinic.",
  pillars: [
    {
      id: 'p1',
      title: "The UK’s largest independent hospital",
      description: "More patients choose The London Clinic than any other.",
      iconName: "Building"
    },
    {
      id: 'p2',
      title: "Top-rated by real patients",
      description: "4.86/5 from over 1,600 reviews on Doctify and over 4.5 rating on Google.",
      iconName: "ThumbsUp"
    },
    {
      id: 'p3',
      title: "Full intensive care on-site",
      description: "World-class 13-bed ICU for expert support if your care becomes complex.",
      iconName: "HeartPulse"
    },
    {
      id: 'p4',
      title: "Investing in clinical excellence",
      description: "In collaboration with Northwestern, we equip our teams with cutting-edge medical equipment.",
      iconName: "Medal"
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
      iconName: 'Trophy'
    },
    {
      id: 'aw-2',
      title: 'Best Non-Surgical Rejuvenation',
      year: '2025',
      organization: 'Global Cosmetic Congress',
      iconName: 'Sparkles'
    },
    {
      id: 'aw-3',
      title: 'Patient Safety Excellence Award',
      year: '2024',
      organization: 'British Health Standards',
      iconName: 'ShieldCheck'
    },
    {
      id: 'aw-4',
      title: 'Best Laser Skin Clinic',
      year: '2024',
      organization: 'International Laser Association',
      iconName: 'Award'
    }
  ]
};

const DEFAULT_LOCATIONS_CONFIG: OurLocationsConfig = {
  heading: "Our Locations",
  description: "Conveniently located in the heart of London's medical district, providing world-class care across multiple specialized facilities.",
  locations: [
    {
      id: 'loc-1',
      name: "The London Clinic - Main Hospital",
      address: "20 Devonshire Place, London W1G 6BW",
      hours: "Open 24 hours for inpatient care",
      mapsUrl: "https://maps.google.com/?q=20+Devonshire+Place,+London+W1G+6BW",
      bannerType: "Map",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuASZKoKhij5mKIMYIaSVfVDbHCQQhOAHm8VMWFbq2S9QwpVP-JCdU5_c4F2CWomVS7s0nYacWblWSVAmRkM3JF7HYiH8YGA1tQYJ9P4_Wz36RmFZc5TRrU9zSh9sLum6Usm_7XuOGMK7KjFm1bhV-DZ_m8xWC2FrOkjqbzaH29MaU4j4NFRn3lufmvMKk_n5DbqDPwFUbfl7PVHFBiM4oZmy3SaXkVVSPxZPj-hJudGKMUQUMAwsSL-8yF78wwhmkFx6ryzzjEFtw"
    },
    {
      id: 'loc-2',
      name: "The London Clinic - Harley Street",
      address: "116 Harley Street, London W1G 7JL",
      hours: "Mon - Fri: 8:00 AM - 8:00 PM",
      mapsUrl: "https://maps.google.com/?q=116+Harley+Street,+London+W1G+7JL",
      bannerType: "Building",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuASZKoKhij5mKIMYIaSVfVDbHCQQhOAHm8VMWFbq2S9QwpVP-JCdU5_c4F2CWomVS7s0nYacWblWSVAmRkM3JF7HYiH8YGA1tQYJ9P4_Wz36RmFZc5TRrU9zSh9sLum6Usm_7XuOGMK7KjFm1bhV-DZ_m8xWC2FrOkjqbzaH29MaU4j4NFRn3lufmvMKk_n5DbqDPwFUbfl7PVHFBiM4oZmy3SaXkVVSPxZPj-hJudGKMUQUMAwsSL-8yF78wwhmkFx6ryzzjEFtw"
    }
  ]
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
    { name: 'Home', href: '#home' }
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
  return getStorageItem<HeaderConfig>(HEADER_CONFIG_KEY, DEFAULT_HEADER_CONFIG);
}

export function saveHeaderConfig(config: HeaderConfig): HeaderConfig {
  setStorageItem(HEADER_CONFIG_KEY, config);
  return config;
}

export function getHeroConfig(): HeroConfig {
  initializeAdminStore();
  return getStorageItem<HeroConfig>(HERO_CONFIG_KEY, DEFAULT_HERO_CONFIG);
}

export function saveHeroConfig(config: HeroConfig): HeroConfig {
  setStorageItem(HERO_CONFIG_KEY, config);
  return config;
}

export function getSpecialistAreasConfig(): SpecialistAreasConfig {
  initializeAdminStore();
  return getStorageItem<SpecialistAreasConfig>(SPECIALIST_AREAS_CONFIG_KEY, DEFAULT_SPECIALIST_AREAS_CONFIG);
}

export function saveSpecialistAreasConfig(config: SpecialistAreasConfig): SpecialistAreasConfig {
  setStorageItem(SPECIALIST_AREAS_CONFIG_KEY, config);
  return config;
}

export function getTreatmentsConfig(): TreatmentsConfig {
  initializeAdminStore();
  return getStorageItem<TreatmentsConfig>(TREATMENTS_CONFIG_KEY, DEFAULT_TREATMENTS_CONFIG);
}

export function saveTreatmentsConfig(config: TreatmentsConfig): TreatmentsConfig {
  setStorageItem(TREATMENTS_CONFIG_KEY, config);
  return config;
}

export function getBeforeAfterGalleryConfig(): BeforeAfterGalleryConfig {
  initializeAdminStore();
  return getStorageItem<BeforeAfterGalleryConfig>(GALLERY_CONFIG_KEY, DEFAULT_GALLERY_CONFIG);
}

export function saveBeforeAfterGalleryConfig(config: BeforeAfterGalleryConfig): BeforeAfterGalleryConfig {
  setStorageItem(GALLERY_CONFIG_KEY, config);
  return config;
}

export function getWhyChooseUsConfig(): WhyChooseUsConfig {
  initializeAdminStore();
  return getStorageItem<WhyChooseUsConfig>(WHY_CHOOSE_US_CONFIG_KEY, DEFAULT_WHY_CHOOSE_US_CONFIG);
}

export function saveWhyChooseUsConfig(config: WhyChooseUsConfig): WhyChooseUsConfig {
  setStorageItem(WHY_CHOOSE_US_CONFIG_KEY, config);
  return config;
}

export function getAwardsConfig(): AwardsConfig {
  initializeAdminStore();
  return getStorageItem<AwardsConfig>(AWARDS_CONFIG_KEY, DEFAULT_AWARDS_CONFIG);
}

export function saveAwardsConfig(config: AwardsConfig): AwardsConfig {
  setStorageItem(AWARDS_CONFIG_KEY, config);
  return config;
}

export function getOurLocationsConfig(): OurLocationsConfig {
  initializeAdminStore();
  return getStorageItem<OurLocationsConfig>(LOCATIONS_CONFIG_KEY, DEFAULT_LOCATIONS_CONFIG);
}

export function saveOurLocationsConfig(config: OurLocationsConfig): OurLocationsConfig {
  setStorageItem(LOCATIONS_CONFIG_KEY, config);
  return config;
}

export function getTeamLeadershipConfig(): TeamLeadershipConfig {
  initializeAdminStore();
  return getStorageItem<TeamLeadershipConfig>(TEAM_LEADERSHIP_CONFIG_KEY, DEFAULT_TEAM_LEADERSHIP_CONFIG);
}

export function saveTeamLeadershipConfig(config: TeamLeadershipConfig): TeamLeadershipConfig {
  setStorageItem(TEAM_LEADERSHIP_CONFIG_KEY, config);
  return config;
}

export function getProcessConfig(): ProcessConfig {
  initializeAdminStore();
  return getStorageItem<ProcessConfig>(PROCESS_CONFIG_KEY, DEFAULT_PROCESS_CONFIG);
}

export function saveProcessConfig(config: ProcessConfig): ProcessConfig {
  setStorageItem(PROCESS_CONFIG_KEY, config);
  return config;
}

export function getFacilityInteriorsConfig(): FacilityInteriorsConfig {
  initializeAdminStore();
  return getStorageItem<FacilityInteriorsConfig>(FACILITY_INTERIORS_CONFIG_KEY, DEFAULT_FACILITY_INTERIORS_CONFIG);
}

export function saveFacilityInteriorsConfig(config: FacilityInteriorsConfig): FacilityInteriorsConfig {
  setStorageItem(FACILITY_INTERIORS_CONFIG_KEY, config);
  return config;
}

export function getTestimonialsConfig(): TestimonialsConfig {
  initializeAdminStore();
  return getStorageItem<TestimonialsConfig>(TESTIMONIALS_CONFIG_KEY, DEFAULT_TESTIMONIALS_CONFIG);
}

export function saveTestimonialsConfig(config: TestimonialsConfig): TestimonialsConfig {
  setStorageItem(TESTIMONIALS_CONFIG_KEY, config);
  return config;
}

export function getSpecialOffersConfig(): SpecialOffersConfig {
  initializeAdminStore();
  return getStorageItem<SpecialOffersConfig>(SPECIAL_OFFERS_CONFIG_KEY, DEFAULT_SPECIAL_OFFERS_CONFIG);
}

export function saveSpecialOffersConfig(config: SpecialOffersConfig): SpecialOffersConfig {
  setStorageItem(SPECIAL_OFFERS_CONFIG_KEY, config);
  return config;
}



export function getSkincareCollectionConfig(): SkincareCollectionConfig {
  initializeAdminStore();
  return getStorageItem<SkincareCollectionConfig>(SKINCARE_COLLECTION_CONFIG_KEY, DEFAULT_SKINCARE_COLLECTION_CONFIG);
}

export function saveSkincareCollectionConfig(config: SkincareCollectionConfig): SkincareCollectionConfig {
  setStorageItem(SKINCARE_COLLECTION_CONFIG_KEY, config);
  return config;
}

export function getTrustBrandsConfig(): TrustBrandsConfig {
  initializeAdminStore();
  return getStorageItem<TrustBrandsConfig>(TRUST_BRANDS_CONFIG_KEY, DEFAULT_TRUST_BRANDS_CONFIG);
}

export function saveTrustBrandsConfig(config: TrustBrandsConfig): TrustBrandsConfig {
  setStorageItem(TRUST_BRANDS_CONFIG_KEY, config);
  return config;
}

export function getAccreditationsConfig(): AccreditationsConfig {
  initializeAdminStore();
  return getStorageItem<AccreditationsConfig>(ACCREDITATIONS_CONFIG_KEY, DEFAULT_ACCREDITATIONS_CONFIG);
}

export function saveAccreditationsConfig(config: AccreditationsConfig): AccreditationsConfig {
  setStorageItem(ACCREDITATIONS_CONFIG_KEY, config);
  return config;
}

export function getLatestNewsConfig(): LatestNewsConfig {
  initializeAdminStore();
  return getStorageItem<LatestNewsConfig>(LATEST_NEWS_CONFIG_KEY, DEFAULT_LATEST_NEWS_CONFIG);
}

export function saveLatestNewsConfig(config: LatestNewsConfig): LatestNewsConfig {
  setStorageItem(LATEST_NEWS_CONFIG_KEY, config);
  return config;
}

export function getFooterConfig(): FooterConfig {
  initializeAdminStore();
  return getStorageItem<FooterConfig>(FOOTER_CONFIG_KEY, DEFAULT_FOOTER_CONFIG);
}

export function saveFooterConfig(config: FooterConfig): FooterConfig {
  setStorageItem(FOOTER_CONFIG_KEY, config);
  return config;
}

export function getFloatingMenuConfig(): FloatingMenuConfig {
  initializeAdminStore();
  return getStorageItem<FloatingMenuConfig>(FLOATING_MENU_CONFIG_KEY, DEFAULT_FLOATING_MENU_CONFIG);
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
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading localStorage key "${TREATMENT_DETAILS_KEY}":`, error);
    return null;
  }
}

export function saveTreatmentDetailsConfig(config: Record<string, any>): void {
  setStorageItem(TREATMENT_DETAILS_KEY, config);
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
