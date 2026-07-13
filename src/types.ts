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
}

export interface ProcessStep {
  id: string;
  stepNumber: string;
  title: string;
  image: string;
}

export interface FacilityRoom {
  id: string;
  title: string;
  tag: string;
  image: string;
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
  iconType: 'circle' | 'layers' | 'pill' | 'shield' | 'instagram';
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

export interface SpecialistArea {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface SpecialistAreasConfig {
  heading: string;
  description: string;
  areas: SpecialistArea[];
}

export interface Treatment {
  id: string;
  name: string;
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
export interface BeforeAfterPair {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
}

export interface BeforeAfterCategory {
  id: string;
  name: string;
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
}

export interface WhyChooseUsConfig {
  heading: string;
  description: string;
  pillars: WhyChooseUsPillar[];
}

// AWARDS & RECOGNITION CONFIGS
export interface AwardItemConfig {
  id: string;
  title: string;
  year: string;
  organization: string;
  iconName: string; // 'Trophy' | 'Star' | 'ShieldCheck' | 'Heart' | 'Sparkles' | 'Award' etc
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

export interface TeamLeadershipConfig {
  heading: string;
  description: string;
  members: TeamMember[];
}

export interface ProcessConfig {
  heading: string;
  description: string;
  steps: ProcessStep[];
}

export interface FacilityInteriorsConfig {
  heading: string;
  description: string;
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
}

export interface TrustBrandsConfig {
  brands: TrustBrand[];
}

export interface Accreditation {
  id: string;
  text: string;
}

export interface AccreditationsConfig {
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
