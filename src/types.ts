export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  isFeatured?: boolean;
}

export interface TreatmentType {
  id: string;
  name: string;
  stepNumber?: string;
  description?: string;
  tag?: string;
  image?: string;
  duration?: string;
}

export interface ProcessStep {
  id: string;
  stepNumber: string;
  title: string;
  image: string;
  imageAlt?: string;
  seoKeywords?: string[];
}

export interface FacilityRoom {
  id: string;
  title: string;
  tag: string;
  image: string;
  imageAlt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  quote: string;
  treatmentId?: string;
  category?: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  discount: string;
  description: string;
  buttonText: string;
  image: string;
  theme: 'rose' | 'dark';
  treatmentId?: string;
  category?: string;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  image: string;
  price?: string;
  category?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
}

export interface BrandPartner {
  id: string;
  name: string;
  iconType: 'circle' | 'layers' | 'pill' | 'shield' | 'instagram' | string;
  imageUrl?: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
  tag: string;
  category?: string;
}

export interface ConsultationRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  appointmentTime?: string;
  preferredLocation?: string;
  bestTime: string;
  hearAboutUs: string;
  notes: string;
  improvement: string;
  doctor: string;
  stayInTouch: string[];
  agreePrivacy: boolean;
  agreeOffers: boolean;
  treatments: { id: string; name: string; price: string }[];
  status: 'pending' | 'contacted' | 'booked' | 'cancelled';
  internalNotes?: string;
  createdAt: string;
}

export interface DoctorAppointmentRecord {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  bookingRef: string;
  services: { id: string; name: string; price: string }[];
  status: 'reserved' | 'confirmed' | 'completed' | 'cancelled';
  internalNotes?: string;
  createdAt: string;
}

export interface InquiryMessage {
  id: string;
  location: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface HeaderConfig {
  logoUrl: string;
  primaryName: string;
  secondaryName: string;
}

export interface HeroConfig {
  badge: string;
  title: string;
  description: string;
  mediaType: 'video' | 'image';
  mediaUrl: string;
}

export interface TreatmentMediaItem {
  url: string;
  mediaType?: 'image' | 'video';
  altText: string;             // Google Image Search & accessibility SEO
  seoTitle?: string;           // Hover/caption attribute
  seoKeywords: string[];       // Tagged clinical keywords
  caption?: string;            // Visual card caption
  assetId?: string;            // Link to clinic Assets Media Library
  videoPoster?: string;        // Fallback poster image for streaming video
  autoPlay?: boolean;          // Video autoplay setting
  muted?: boolean;             // Video muted setting
  loop?: boolean;              // Video loop setting
}

export interface MediaAssetRecord {
  id: string;
  name: string;
  url: string;
  mediaType: 'image' | 'video';
  size?: number;
  location: string;
  category?: 'Treatments' | 'Before & After' | 'Interiors & Facilities' | 'Videos' | 'Uploads' | 'Other';
  altText?: string;
  seoKeywords?: string[];
  createdAt: string;
}

export interface OverviewMediaConfig {
  backCard: TreatmentMediaItem;
  frontCard: TreatmentMediaItem;
  backImage?: TreatmentMediaItem;
  frontImage?: TreatmentMediaItem;
}

export interface ClinicalComparisonMediaConfig {
  before: TreatmentMediaItem;
  after: TreatmentMediaItem;
  beforeImage?: TreatmentMediaItem;
  afterImage?: TreatmentMediaItem;
  caseTitle?: string;
  caseLabel?: string;
}

export interface ClinicalGuidanceMediaConfig {
  preCare: TreatmentMediaItem;
  postCare: TreatmentMediaItem;
  preCareVisual?: TreatmentMediaItem;
  postCareVisual?: TreatmentMediaItem;
}

export type MasterBranchCategory =
  | 'Face & Injectables'
  | 'Body Sculpting'
  | 'Advanced Facials'
  | 'Hair & Beauty'
  | 'IV Drips & Wellness';

export const MASTER_BRANCH_CATEGORIES: MasterBranchCategory[] = [
  'Face & Injectables',
  'Body Sculpting',
  'Advanced Facials',
  'Hair & Beauty',
  'IV Drips & Wellness',
];

export type TransformationCategorySlug =
  | 'anti-aging'
  | 'acne-scarring'
  | 'facial-harmony'
  | 'clinical-hair'
  | 'body-sculpting'
  | 'advanced-facials'
  | 'Regenerative Biotech'
  | 'Skin Texture & Scars'
  | 'Facial Rejuvenation'
  | 'Hair Density'
  | 'Lifting & Contouring'
  | string;

export interface SpecialistArea {
  id: string;
  number?: string;
  title: string;
  description: string;
  image: string;
  pricingCategory?: MasterBranchCategory | string;
  transformationCategory?: TransformationCategorySlug;
  category?: string;
  duration?: string;
  price?: string;
  icon?: string;
  coverMedia?: TreatmentMediaItem;
  seoKeywords?: string[];
}

export interface SpecialistAreasConfig {
  heading: string;
  description: string;
  areas: SpecialistArea[];
}

export interface Treatment {
  id: string;
  name: string;
  stepNumber?: string;
  description?: string;
  tag?: string;
  image?: string;
  price?: string;
  duration?: string;
}

export interface TreatmentsConfig {
  editorialHeading: string;
  editorialSub: string;
  description: string;
  treatments: Treatment[];
}

// BEFORE & AFTER GALLERY CONFIGS
export type ExistingTreatmentGroupId =
  | 'lash-eyebrow'
  | 'body-waxing'
  | 'ladies-girls-cut-collors-treatments'
  | 'men-and-kids'
  | 'men-kids-services'
  | 'facial-skin-care'
  | 'aqualyx-course-3'
  | 'deso-face-and-body-course-of-1'
  | 'deso-face-and-body-course-of-3'
  | 'slimming-pen'
  | 'platelet-rich-plasma-prp'
  | 'co2-laser-from'
  | 'endolift-fiber-lift'
  | 'salmon-sperm-injection'
  | 'semi-permanent-makeup'
  | 'tattoo-removal'
  | 'morpheus8-treatment'
  | 'emface-skin-tightening-and-lifting'
  | 'emscuplt-body-sculpt-and-tightening'
  | 'body-slimming-fat-loss-cellulite-reduction'
  | 'anti-wrinkles-injection'
  | 'iv-drip-lounge-course-of-1'
  | 'dermal-fillers-1ml'
  | 'profhilo-2ml'
  // Legacy IDs kept for backward compatibility
  | 'anti-aging'
  | 'acne-scarring'
  | 'facial-harmony'
  | 'clinical-hair'
  | 'body-sculpting'
  | 'advanced-facials'
  | 'iv-wellness';

export interface BeforeAfterPair {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  treatmentGroupId?: ExistingTreatmentGroupId | string;
  linkedTreatmentId?: string;
  linkedTreatmentTitle?: string;
  beforeAltText?: string;
  afterAltText?: string;
  seoTitle?: string;
  seoKeywords?: string[];
  duration?: string;
  sessions?: number;
  featured?: boolean;
  hidden?: boolean;
  updatedAt?: number | string;
}

export interface BeforeAfterCategory {
  id: ExistingTreatmentGroupId | string;
  name: string;
  treatmentCategory?: string;
  pairs: BeforeAfterPair[];
}

export interface BeforeAfterGalleryConfig {
  heading: string;
  description: string;
  categories: BeforeAfterCategory[];
}

// WHY CHOOSE US CONFIGS
export interface WhyChooseUsPillar {
  id: string;
  title: string;
  description: string;
  iconName: string; // 'Building' | 'ThumbsUp' | 'HeartPulse' | 'Medal' | 'Shield' | 'Star' etc
  imageUrl?: string;
  badge?: string;
}

export interface WhyChooseUsConfig {
  heading: string;
  subheading?: string;
  description: string;
  pillars: WhyChooseUsPillar[];
}

// AWARDS & RECOGNITION CONFIGS
export interface AwardItemConfig {
  id: string;
  title: string;
  year: string;
  organization: string;
  iconName?: string; // 'Trophy' | 'Star' | 'ShieldCheck' | 'Heart' | 'Sparkles' | 'Award' etc
  imageUrl?: string;
}

export interface AwardsConfig {
  heading: string;
  subheading: string;
  awards: AwardItemConfig[];
}

// OUR LOCATIONS CONFIGS
export interface LocationItemConfig {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone?: string;
  mapsUrl: string;
  bannerType: string; // 'Map' | 'Building' | 'Clinic'
  imageUrl: string;
}

export interface OurLocationsConfig {
  heading: string;
  description: string;
  locations: LocationItemConfig[];
  backgroundImage?: string;
}

// BOOK CONSULTATION CONFIGS
export interface ConsultationDoctorConfig {
  id: string;
  name: string;
  specialty?: string;
  locationIds?: string[];
  availableDays?: number[]; // 0=Sun .. 6=Sat
  timeSlots?: string[];
}

export interface ConsultationOptionConfig {
  value: string;
  label: string;
}

export interface StayInTouchChannelConfig {
  id: string;
  label: string;
  enabled: boolean;
}

export interface ConsultationSectionConfig {
  heading?: string;
  subheading?: string;
  specialistLabel?: string;
  doctors: ConsultationDoctorConfig[];
  defaultTimeSlots: string[];
  bestTimeOptions: ConsultationOptionConfig[];
  hearAboutUsOptions: ConsultationOptionConfig[];
  stayInTouchChannels: StayInTouchChannelConfig[];
}

export interface TeamLeadershipConfig {
  heading: string;
  description: string;
  members: TeamMember[];
}

export interface ProcessConfig {
  eyebrow?: string;
  heading: string;
  description: string;
  seoKeywords?: string[];
  steps: ProcessStep[];
}

export interface FacilityInteriorsConfig {
  eyebrow?: string;
  heading: string;
  description: string;
  seoKeywords?: string[];
  rooms: FacilityRoom[];
}

export interface TestimonialsConfig {
  heading: string;
  description: string;
  testimonials: Testimonial[];
}

export interface SpecialOffersConfig {
  heading: string;
  description: string;
  offers: SpecialOffer[];
}

export interface SkincareCollectionConfig {
  heading: string;
  description: string;
}

export interface TrustBrand {
  id: string;
  name: string;
  iconType: string;
  imageUrl?: string;
}

export interface TrustBrandsConfig {
  heading?: string;
  seoKeywords?: string[];
  brands: TrustBrand[];
}

export interface Accreditation {
  id: string;
  text: string;
}

export interface AccreditationsConfig {
  eyebrow?: string;
  heading?: string;
  description?: string;
  seoKeywords?: string[];
  items?: string[];
  accreditations: Accreditation[];
}

export interface LatestNewsConfig {
  heading: string;
  description: string;
  newsArticles: Article[];
  storyArticles: Article[];
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterConfig {
  address: string;
  phone: string;
  email: string;
  hours: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  links: FooterLink[];
}

export interface FloatingMenuConfig {
  phone: string;
  email: string;
  address: string;
  enableChat: boolean;
  welcomeMessage: string;
}

export interface ProfileExpertiseItem {
  title: string;
  description: string;
  iconName: string;
}

export interface ProfileMoreInfoSection {
  title: string;
  iconName: string;
  items: string[];
}

export interface ProfileReviewItem {
  name: string;
  role: string;
  image: string;
  date: string;
  rating: number;
  text: string;
  source: 'instagram' | 'facebook' | 'tiktok';
}

export interface ProfilePageConfig {
  roleTag: string;
  specialtySubtitle: string;
  photoUrl: string;
  experienceYears: string;
  gmcStatus: string;
  awardStatus: string;
  bioTitle: string;
  bioParagraphs: string[];
  bioQuote: string;
  expertiseTitle: string;
  expertiseSubtitle: string;
  expertises: ProfileExpertiseItem[];
  moreInfoTitle: string;
  moreInfoSections: ProfileMoreInfoSection[];
  reviewsTitle: string;
  reviewsRating: number;
  reviewsCountText: string;
  reviews: ProfileReviewItem[];
}




export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  clientName?: string;
  clientEmail?: string;
  messages: ChatMessage[];
  lastUpdated: string;
  unreadCountAdmin: number;
}

// CLINICAL PROTOCOL SCHEMA (Customer "The Clinical Protocol" Timeline & Admin Studio)
export interface ProtocolStepItem {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  image: string; // Image URL, uploaded asset path (e.g. /assets/aistudio/...), or SVG icon preset key
  phaseTag?: string; // e.g. "Phase 1 • 10 mins"
  duration?: string; // e.g. "10 mins"
  focusArea?: string; // e.g. "Epidermal Stratum Corneum"
}

export interface TreatmentProtocolGroup {
  id: string; // Treatment id matching treatment ID e.g. 'exosome', 'profhilo', 'morpheus8', etc.
  name: string; // Display name e.g. "Exosome Regenerative Therapy"
  subtitle?: string; // Optional short clinical subtitle
  category?: string; // Official PRICING_CATEGORIES name e.g. "Face & Injectables", "Body Sculpting"
  branchId?: string; // Official CLINICAL_AREAS_DB subcategory branch ID e.g. "skin-boosters", "dermal-fillers"
  branchName?: string; // Official CLINICAL_AREAS_DB subcategory branch title
  steps: ProtocolStepItem[];
  updatedAt?: string;
}

export interface ClinicalProtocolsConfig {
  protocols: Record<string, TreatmentProtocolGroup>; // keyed by treatmentId
  defaultSteps: ProtocolStepItem[]; // fallback protocol steps
}
