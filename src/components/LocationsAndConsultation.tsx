import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { saveConsultation, saveInquiry, getOurLocationsConfig, getClinicData, fetchRemoteClinicData } from '../lib/adminStore';
import { MapPin, Clock, ExternalLink, Map, Building2, Send, Check, AlertCircle, Mail, Phone, PhoneCall, MessageCircle, MessageSquare, Sparkles, Search, DollarSign, Plus, Trash2, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OurLocationsConfig, LocationItemConfig } from '../types';
import { CLINIC_DATA, ClinicData } from '../data/clinicInfo';
import ContactDrawerModal from './ContactDrawerModal';
import AppointmentDatePicker from './AppointmentDatePicker';
import { PackageSelectModal } from './pricing/PackageSelectModal';
import { ClinicImageWithPlaceholder } from './common/ClinicImageWithPlaceholder';
import type { TreatmentPricingItem, PricingPackage } from '../data/treatmentPricing';
import { useTreatmentCart } from '../context/TreatmentCartContext';

import { 
  CLINICAL_AREAS_DB, 
  AreaItem, 
  CategoryItem, 
  TreatmentItem, 
  findTreatmentInDB, 
  findTreatmentItemInDB, 
  resolveTreatmentToPricingItem,
  getAllClinicalTreatments,
} from '../data/clinicalTreatments';

export type { TreatmentItem, CategoryItem, AreaItem };
export { 
  CLINICAL_AREAS_DB, 
  findTreatmentInDB, 
  findTreatmentItemInDB, 
  resolveTreatmentToPricingItem,
  getAllClinicalTreatments 
};

import { CLINIC_LOCATION_IMAGES } from '../data/clinicImages';
import location1Img from '../assets/images/clinic/locations/location1_img.jpg';
import location2Img from '../assets/images/clinic/locations/location2_img.jpg';

const clinicDevonshire = CLINIC_LOCATION_IMAGES['devonshire-place-clinic'].primary;
const clinicHarleyStreet = CLINIC_LOCATION_IMAGES['harley-street-flagship'].primary;

const DEFAULT_LOCATION_IMAGES: Record<string, string> = {
  'location-1791722960928': location1Img,
  'location-1791728808656': location2Img,
  'loc-1': location1Img,
  'loc-2': location2Img,
};

const LOCATION_FALLBACKS = [location1Img, location2Img, clinicHarleyStreet, clinicDevonshire];

interface LocationsAndConsultationProps {
  preselectedService?: string;
  onTreatmentClick?: (name: string) => void;
}

const FALLBACK_BEST_TIME_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
];

const FALLBACK_HEAR_ABOUT_US_OPTIONS = [
  { value: 'search', label: 'Search Engine (Google)' },
  { value: 'social', label: 'Social Media' },
  { value: 'referral', label: 'Friend/Family Referral' },
  { value: 'other', label: 'Other' },
];

export default function LocationsAndConsultation({ preselectedService, onTreatmentClick }: LocationsAndConsultationProps = {}) {
  const { addTreatment: addGlobalTreatment } = useTreatmentCart();
  const [mounted, setMounted] = useState<boolean>(false);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('face-injectables');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('anti-wrinkle');
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [selectedTreatmentPackages, setSelectedTreatmentPackages] = useState<Record<string, PricingPackage>>({});
  const [activePricingModalTreatment, setActivePricingModalTreatment] = useState<TreatmentPricingItem | null>(null);
  const [pricingReturnToDrawer, setPricingReturnToDrawer] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isTreatmentCardOpen, setIsTreatmentCardOpen] = useState<boolean>(false);
  const [viewingTreatment, setViewingTreatment] = useState<TreatmentItem | null>(null);
  const [openMenu, setOpenMenu] = useState<'area' | 'category' | 'treatment' | null>(null);
  const [activeConsultMenu, setActiveConsultMenu] = useState<'doctor' | 'bestTime' | 'hearAboutUs' | 'location' | null>(null);
  const [menuDirection, setMenuDirection] = useState<'down' | 'up'>('down');
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const consultMenuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Listen for treatment plan application events from the Treatment Cart Drawer
    const handleApplyTreatmentPlan = (e: any) => {
      if (e.detail?.treatmentPlan && Array.isArray(e.detail.treatmentPlan)) {
        const planItems = e.detail.treatmentPlan;
        const newIds: string[] = [];
        const newPkgs: Record<string, PricingPackage> = {};

        planItems.forEach((item: any) => {
          if (item?.treatment?.id && item?.selectedPackage) {
            newIds.push(item.treatment.id);
            newPkgs[item.treatment.id] = item.selectedPackage;
          }
        });

        if (newIds.length > 0) {
          setSelectedTreatments(prev => Array.from(new Set([...prev, ...newIds])));
          setSelectedTreatmentPackages(prev => ({ ...prev, ...newPkgs }));
          setBooking(prev => ({
            ...prev,
            procedure: newIds[0],
            notes: prev.notes ? `${prev.notes}\n[Treatment Plan: ${e.detail.servicesSummary || ''}]` : `[Treatment Plan: ${e.detail.servicesSummary || ''}]`,
          }));
        }
      }
    };

    window.addEventListener('arc_apply_treatment_plan', handleApplyTreatmentPlan);
    return () => {
      window.removeEventListener('arc_apply_treatment_plan', handleApplyTreatmentPlan);
    };
  }, []);

  // Lock body scroll when drawer or modal is open
  useEffect(() => {
    if (isDrawerOpen || isTreatmentCardOpen || activePricingModalTreatment) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isDrawerOpen, isTreatmentCardOpen, activePricingModalTreatment]);

  const toggleMenu = (menu: 'area' | 'category' | 'treatment', e: React.MouseEvent<HTMLButtonElement>) => {
    if (openMenu === menu) {
      setOpenMenu(null);
    } else {
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      const scrollContainer = target.closest('.overflow-y-auto');
      const containerRect = scrollContainer ? scrollContainer.getBoundingClientRect() : null;
      const spaceBelow = containerRect ? (containerRect.bottom - rect.bottom) : (window.innerHeight - rect.bottom);
      const spaceAbove = containerRect ? (rect.top - containerRect.top) : rect.top;

      if (spaceBelow < 240 && spaceAbove > 140) {
        setMenuDirection('up');
      } else {
        setMenuDirection('down');
      }
      setOpenMenu(menu);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
      if (consultMenuContainerRef.current && !consultMenuContainerRef.current.contains(event.target as Node)) {
        setActiveConsultMenu(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
        setActiveConsultMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const addTreatment = (id: string) => {
    if (!selectedTreatments.includes(id)) {
      setSelectedTreatments(prev => [...prev, id]);
    }
  };

  const removeTreatment = (id: string) => {
    setSelectedTreatments(prev => prev.filter(t => t !== id));
    setSelectedTreatmentPackages(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (booking.procedure === id) {
      setBooking(prev => ({ ...prev, procedure: '' }));
    }
  };

  const handleSelectPackageFromModal = (treatmentItem: TreatmentPricingItem, selectedPackage: PricingPackage) => {
    addTreatment(treatmentItem.id);
    setSelectedTreatmentPackages(prev => ({
      ...prev,
      [treatmentItem.id]: selectedPackage
    }));
    setBooking(prev => ({
      ...prev,
      procedure: treatmentItem.id
    }));
    // Sync with global treatment cart
    addGlobalTreatment(treatmentItem, selectedPackage, 1, false);

    setActivePricingModalTreatment(null);
    setIsDrawerOpen(false);
    setPricingReturnToDrawer(false);
  };

  const handleClosePricingModal = () => {
    setActivePricingModalTreatment(null);
    if (pricingReturnToDrawer) {
      setIsDrawerOpen(true);
      setPricingReturnToDrawer(false);
    }
  };

  const handleBackFromPricingModal = () => {
    setActivePricingModalTreatment(null);
    setIsDrawerOpen(true);
    setPricingReturnToDrawer(false);
  };

  const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/[^0-9]/g, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 0 : num;
  };

  const getSelectedTreatmentsData = () => {
    const list: Array<{ 
      areaName: string; 
      catName: string; 
      id: string; 
      name: string; 
      price: string; 
      time: string; 
      desc: string;
      packageName?: string;
      sessions?: number;
    }> = [];
    selectedTreatments.forEach(tid => {
      for (const area of CLINICAL_AREAS_DB) {
        for (const cat of area.categories) {
          const found = cat.items.find(i => i.id === tid);
          if (found) {
            const pkg = selectedTreatmentPackages[tid];
            list.push({
              areaName: area.name,
              catName: cat.name,
              id: found.id,
              name: found.name,
              price: pkg ? `£${pkg.price}` : found.price,
              time: found.time,
              desc: found.desc,
              packageName: pkg ? pkg.name : undefined,
              sessions: pkg ? pkg.sessions : undefined,
            });
            break;
          }
        }
      }
    });
    return list;
  };

  // Handle Area Change
  const handleAreaChange = (areaId: string) => {
    setSelectedAreaId(areaId);
    const area = CLINICAL_AREAS_DB.find(a => a.id === areaId);
    if (area && area.categories.length > 0) {
      const firstCat = area.categories[0];
      setSelectedCategoryId(firstCat.id);
      setBooking(prev => ({ ...prev, procedure: '' }));
      setIsTreatmentCardOpen(false);
    }
  };

  // Handle Category Change
  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    setBooking(prev => ({ ...prev, procedure: '' }));
    setIsTreatmentCardOpen(false);
  };

  // Listen to preselected service changes
  useEffect(() => {
    if (preselectedService) {
      const found = findTreatmentInDB(preselectedService);
      if (found) {
        setSelectedAreaId(found.area.id);
        setSelectedCategoryId(found.category.id);
        setBooking(prev => ({
          ...prev,
          procedure: found.item.id,
          improvement: `Inquiry about ${found.item.name}`
        }));
        setSelectedTreatments([found.item.id]);
      } else {
        setSelectedAreaId('face-injectables');
        setSelectedCategoryId('anti-wrinkle');
        setBooking(prev => ({
          ...prev,
          procedure: '',
          improvement: `Inquiry about ${preselectedService}`
        }));
        setSelectedTreatments([]);
      }
    } else {
      setSelectedAreaId('face-injectables');
      setSelectedCategoryId('anti-wrinkle');
      setBooking(prev => ({
        ...prev,
        procedure: ''
      }));
      setSelectedTreatments([]);
    }
  }, [preselectedService]);

  const [locationsConfig, setLocationsConfig] = useState<OurLocationsConfig | null>(null);
  const [activeDrawerLocation, setActiveDrawerLocation] = useState<LocationItemConfig | null>(null);
  const [clinicData, setClinicData] = useState<ClinicData>(getClinicData());

  useEffect(() => {
    setLocationsConfig(getOurLocationsConfig());
    setClinicData(getClinicData());

    // Fetch remote clinic data from server on mount to guarantee fresh server state across deployments
    fetchRemoteClinicData().then((remoteData) => {
      if (remoteData) {
        setClinicData(remoteData);
      }
    });

    const handleClinicDataChange = (e: any) => {
      const nextData = e?.detail || getClinicData();
      setClinicData(nextData);
      setLocationsConfig(getOurLocationsConfig());
    };

    const handleLocationsConfigChange = (e: any) => {
      if (e?.detail) {
        setLocationsConfig(e.detail);
      } else {
        setLocationsConfig(getOurLocationsConfig());
      }
    };

    window.addEventListener('clinic_data_changed', handleClinicDataChange);
    window.addEventListener('consultation_config_updated', handleClinicDataChange);
    window.addEventListener('locations_config_changed', handleLocationsConfigChange);
    window.addEventListener('storage', handleClinicDataChange);
    return () => {
      window.removeEventListener('clinic_data_changed', handleClinicDataChange);
      window.removeEventListener('consultation_config_updated', handleClinicDataChange);
      window.removeEventListener('locations_config_changed', handleLocationsConfigChange);
      window.removeEventListener('storage', handleClinicDataChange);
    };
  }, []);

  // Locations directly mapped from clinic info data file (src/data/clinicInfo.ts) or reactive store
  const activeLocations: LocationItemConfig[] = (clinicData.locations && clinicData.locations.length > 0 ? clinicData.locations : CLINIC_DATA.locations).map((loc, idx) => {
    const locId = loc.id || `loc-${idx + 1}`;
    
    // Clean formatted address without trailing commas
    const addressParts = [
      loc.address?.trim(),
      (loc.city && !loc.address?.toLowerCase().includes(loc.city.toLowerCase())) ? loc.city.trim() : null,
      loc.postalCode?.trim() || null
    ].filter(Boolean);
    const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : (loc.address || 'London, United Kingdom');
    
    const mapsUrl = loc.directionsUrl && loc.directionsUrl.trim().length > 0
      ? loc.directionsUrl
      : `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`;
      
    const fallbackImg = DEFAULT_LOCATION_IMAGES[locId] || LOCATION_FALLBACKS[idx % LOCATION_FALLBACKS.length];

    const adminLoc = locationsConfig?.locations?.find(
      (al) => al.id === locId || al.id === `loc-${idx + 1}` || al.name.toLowerCase() === loc.name.toLowerCase()
    );

    // Prioritize loc.image || loc.gallery?.[0] from reactive clinicData.locations, then admin config, then fallback
    const primaryLocAsset =
      (loc.image && loc.image.trim().length > 0 ? loc.image.trim() : '') ||
      (Array.isArray(loc.gallery) && loc.gallery[0] && loc.gallery[0].trim().length > 0
        ? loc.gallery[0].trim()
        : '');

    const resolvedImageUrl = primaryLocAsset
      ? primaryLocAsset
      : (adminLoc?.imageUrl && !adminLoc.imageUrl.includes('Interactive'))
      ? adminLoc.imageUrl
      : fallbackImg;

    return {
      id: locId,
      name: loc.name,
      address: fullAddress,
      hours: loc.hours || clinicData.openingHours || CLINIC_DATA.openingHours,
      phone: loc.phone || clinicData.phone || CLINIC_DATA.phone,
      mapsUrl: mapsUrl,
      bannerType: adminLoc?.bannerType || 'Clinic',
      imageUrl: resolvedImageUrl,
    };
  });

  // Main Consultation Booking Form State
  const [booking, setBooking] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    procedure: '',
    improvement: '',
    doctor: '',
    preferredLocation: '',
    date: '',
    appointmentTime: '',
    bestTime: 'morning',
    hearAboutUs: 'search',
    stayInTouch: [] as string[],
    notes: '',
    agreePrivacy: false,
    agreeOffers: false
  });

  // Reactive Book Consultation Configuration from clinicInfo.ts / Central Store
  const consultationConfig = clinicData.consultationConfig || CLINIC_DATA.consultationConfig;
  const specialistLabel = consultationConfig?.specialistLabel || 'Preferred Specialist';
  const allDoctors = consultationConfig?.doctors || CLINIC_DATA.consultationConfig?.doctors || [];

  const selectedLocationObj = activeLocations.find(
    (loc) => loc.name === booking.preferredLocation || loc.id === booking.preferredLocation
  );

  const availableDoctors = allDoctors.filter((doc) => {
    if (!booking.preferredLocation) return true;
    if (!doc.locationIds || doc.locationIds.length === 0) return true;
    return doc.locationIds.some(
      (locId) =>
        locId === booking.preferredLocation ||
        (selectedLocationObj &&
          (locId === selectedLocationObj.id ||
            locId.toLowerCase() === selectedLocationObj.name.toLowerCase()))
    );
  });

  const doctorOptions = [
    { value: '', label: 'Select a specialist (Optional)', specialty: '' },
    ...availableDoctors.map((doc) => ({
      value: doc.id,
      label: doc.name,
      specialty: doc.specialty || '',
    })),
  ];

  const selectedDoctorObj = allDoctors.find((d) => d.id === booking.doctor || d.name === booking.doctor);

  const allowedDaysOfWeek: number[] =
    selectedDoctorObj && Array.isArray(selectedDoctorObj.availableDays) && selectedDoctorObj.availableDays.length > 0
      ? selectedDoctorObj.availableDays
      : [1, 2, 3, 4, 5, 6];

  const availableTimeSlots: string[] =
    selectedDoctorObj && Array.isArray(selectedDoctorObj.timeSlots) && selectedDoctorObj.timeSlots.length > 0
      ? selectedDoctorObj.timeSlots
      : consultationConfig?.defaultTimeSlots && consultationConfig.defaultTimeSlots.length > 0
      ? consultationConfig.defaultTimeSlots
      : ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];

  const availabilityHint = (() => {
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (selectedDoctorObj) {
      const daysText = (selectedDoctorObj.availableDays || [])
        .map((d) => dayLabels[d])
        .filter(Boolean)
        .join(', ');
      return `${selectedDoctorObj.name}${daysText ? ` (${daysText})` : ''}`;
    }
    if (booking.preferredLocation) {
      return `${booking.preferredLocation} (Mon–Sat)`;
    }
    return undefined;
  })();

  const bestTimeOptions =
    consultationConfig?.bestTimeOptions && consultationConfig.bestTimeOptions.length > 0
      ? consultationConfig.bestTimeOptions
      : FALLBACK_BEST_TIME_OPTIONS;

  const hearAboutUsOptions =
    consultationConfig?.hearAboutUsOptions && consultationConfig.hearAboutUsOptions.length > 0
      ? consultationConfig.hearAboutUsOptions
      : FALLBACK_HEAR_ABOUT_US_OPTIONS;

  const visibleStayInTouchChannels = (
    consultationConfig?.stayInTouchChannels ||
    CLINIC_DATA.consultationConfig?.stayInTouchChannels ||
    []
  ).filter((ch) => ch.enabled);

  // Keep selected doctor, date, and time slot valid when location or specialist changes
  useEffect(() => {
    setBooking((prev) => {
      let nextDoctor = prev.doctor;
      if (
        nextDoctor &&
        !availableDoctors.some((d) => d.id === nextDoctor || d.name === nextDoctor)
      ) {
        nextDoctor = '';
      }

      let nextDate = prev.date;
      let nextTime = prev.appointmentTime;
      if (nextDate) {
        const parsed = new Date(nextDate + 'T00:00:00');
        if (!isNaN(parsed.getTime()) && !allowedDaysOfWeek.includes(parsed.getDay())) {
          nextDate = '';
          nextTime = '';
        }
      }
      if (nextTime && !availableTimeSlots.includes(nextTime)) {
        nextTime = nextDate ? (availableTimeSlots[0] || '') : '';
      }

      const nextBestTime = bestTimeOptions.some((o) => o.value === prev.bestTime)
        ? prev.bestTime
        : bestTimeOptions[0]?.value || 'morning';
      const nextHearAbout = hearAboutUsOptions.some((o) => o.value === prev.hearAboutUs)
        ? prev.hearAboutUs
        : hearAboutUsOptions[0]?.value || 'search';

      if (
        nextDoctor === prev.doctor &&
        nextDate === prev.date &&
        nextTime === prev.appointmentTime &&
        nextBestTime === prev.bestTime &&
        nextHearAbout === prev.hearAboutUs
      ) {
        return prev;
      }
      return {
        ...prev,
        doctor: nextDoctor,
        date: nextDate,
        appointmentTime: nextTime,
        bestTime: nextBestTime,
        hearAboutUs: nextHearAbout,
      };
    });
  }, [booking.preferredLocation, booking.doctor, clinicData]);

  const toggleStayInTouch = (option: string) => {
    setBooking(prev => {
      const alreadySelected = prev.stayInTouch.includes(option);
      return {
        ...prev,
        stayInTouch: alreadySelected
          ? prev.stayInTouch.filter(item => item !== option)
          : [...prev.stayInTouch, option]
      };
    });
  };
  const [submittedBooking, setSubmittedBooking] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'available' | 'limited'>('idle');

  useEffect(() => {
    if (booking.date) {
      setAvailabilityStatus('checking');
      const timer = setTimeout(() => {
        const dateObj = new Date(booking.date + 'T00:00:00');
        const day = dateObj.getDay();
        // Weekend or Friday afternoons generally limited
        if (day === 0 || day === 6 || (day === 5 && booking.bestTime === 'afternoon')) {
          setAvailabilityStatus('limited');
        } else {
          setAvailabilityStatus('available');
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setAvailabilityStatus('idle');
    }
  }, [booking.date, booking.bestTime]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTreatmentsData = getSelectedTreatmentsData().map(item => ({
      id: item.id,
      name: item.name,
      price: item.price
    }));

    const locationNote = booking.preferredLocation ? `[Preferred Location: ${booking.preferredLocation}]` : '';
    const timeNote = booking.appointmentTime ? `[Preferred Time: ${booking.appointmentTime}]` : '';
    const fullNotes = [locationNote, timeNote, booking.notes].filter(Boolean).join('\n');

    saveConsultation({
      firstName: booking.firstName,
      lastName: booking.lastName,
      email: booking.email,
      phone: booking.phone,
      date: booking.date,
      appointmentTime: booking.appointmentTime,
      preferredLocation: booking.preferredLocation,
      bestTime: booking.bestTime,
      hearAboutUs: booking.hearAboutUs,
      notes: fullNotes,
      improvement: booking.improvement,
      doctor: selectedDoctorObj ? selectedDoctorObj.name : booking.doctor,
      stayInTouch: booking.stayInTouch,
      agreePrivacy: booking.agreePrivacy,
      agreeOffers: booking.agreeOffers,
      treatments: selectedTreatmentsData
    });

    setSubmittedBooking(true);
  };

  return (
    <div className="w-full">
      {/* 1. Our Locations Section */}
      <section 
        id="locations"
        className="py-20 relative overflow-hidden border-b border-luxury-border/40 isolate bg-luxury-secondary/30 transform-gpu"
      >
        {/* Hardware-Accelerated Isolated Background Texture Layer (Zero scroll lag or paint tearing) */}
        <div className="absolute inset-0 z-0 pointer-events-none transform-gpu overflow-hidden">
          <img
            src={locationsConfig?.backgroundImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuASZKoKhij5mKIMYIaSVfVDbHCQQhOAHm8VMWFbq2S9QwpVP-JCdU5_c4F2CWomVS7s0nYacWblWSVAmRkM3JF7HYiH8YGA1tQYJ9P4_Wz36RmFZc5TRrU9zSh9sLum6Usm_7XuOGMK7KjFm1bhV-DZ_m8xWC2FrOkjqbzaH29MaU4j4NFRn3lufmvMKk_n5DbqDPwFUbfl7PVHFBiM4oZmy3SaXkVVSPxZPj-hJudGKMUQUMAwsSL-8yF78wwhmkFx6ryzzjEFtw'}
            alt="Clinic Locations Background"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="w-full h-full object-cover object-center transform-gpu"
            style={{ transform: 'translateZ(0)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/20 to-white/25 pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-light text-luxury-text mb-6 tracking-tight leading-tight">
              {locationsConfig?.heading || 'Our Locations'}
            </h2>
            <p className="font-sans text-sm md:text-base text-luxury-subtext max-w-2xl mx-auto font-light leading-relaxed">
              {locationsConfig?.description || `${clinicData?.name || 'Age Reversal Clinic'} — conveniently located across London, providing world-class aesthetic dermatology, clinical consultations, and personalized care.`}
            </p>
            <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-8" />
          </div>

          <div className={`grid grid-cols-1 ${activeLocations.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'} gap-6 lg:gap-8`}>
            {activeLocations.map((loc, idx) => {
              const displayImage = loc.imageUrl;

              return (
                <div key={loc.id} className="flex flex-col bg-luxury-card rounded-[24px] sm:rounded-[28px] overflow-hidden border border-luxury-border shadow-sm hover:border-luxury-gold/70 transition-all duration-500 animate-fade-in group transform-gpu will-change-transform">
                  
                  {/* Clinical Location Image with Overlayed Details (clinic name, location, opening time, telephone) */}
                  <ClinicImageWithPlaceholder
                    src={displayImage}
                    alt={loc.name}
                    slotId={`clinic-location-${loc.id}`}
                    logoSize="lg"
                    showBrandText={true}
                    fallbackUrl={DEFAULT_LOCATION_IMAGES[loc.id] || LOCATION_FALLBACKS[idx % LOCATION_FALLBACKS.length]}
                    containerClassName="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-luxury-secondary flex flex-col justify-between"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106 transform-gpu"
                  >
                    {/* Gradient scrim brought down so the upper architecture remains bright and clear */}
                    <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/95 via-black/55 via-50% to-transparent pointer-events-none" />

                    {/* Top pill badge */}
                    <div className="relative z-10 p-3.5 sm:p-4 md:p-5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-sans font-semibold tracking-wider uppercase bg-white/95 sm:backdrop-blur-md text-luxury-text border border-white/80 shadow-xs">
                        <Building2 className="h-3 w-3 text-luxury-gold" />
                        <span>Clinical Facility</span>
                      </span>
                    </div>

                    {/* Overlayed Details: Clinic Name, Location (Address), Opening Time, and Telephone */}
                    <div className="relative z-10 p-4 sm:p-5 md:p-6 flex flex-col justify-end text-white">
                      <h3 className="font-serif font-light text-xl sm:text-2xl md:text-[25px] text-white mb-2 leading-snug drop-shadow-sm group-hover:text-luxury-gold transition-colors duration-300">
                        {loc.name}
                      </h3>
                      
                      <div className="space-y-1.5 font-sans font-light text-xs sm:text-sm">
                        <div className="flex items-start gap-2.5 text-white/95">
                          <MapPin className="h-4 w-4 text-luxury-gold shrink-0 mt-0.5" />
                          <span className="leading-relaxed drop-shadow-xs">{loc.address}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-white/85">
                          <Clock className="h-4 w-4 text-luxury-gold shrink-0" />
                          <span className="drop-shadow-xs">{loc.hours}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-white/85">
                          <Phone className="h-4 w-4 text-luxury-gold shrink-0" />
                          <a 
                            href={`tel:${loc.phone.replace(/[^0-9+]/g, '')}`}
                            className="drop-shadow-xs hover:text-luxury-gold transition-colors"
                          >
                            {loc.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </ClinicImageWithPlaceholder>

                  {/* Standalone Action Items (Message, Book Here, & Get Directions) */}
                  <div className="p-4 sm:p-5 px-5 sm:px-6 flex items-center justify-between bg-luxury-card border-t border-luxury-border/60">
                    <button
                      type="button"
                      onClick={() => setActiveDrawerLocation(loc)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold font-sans text-luxury-text hover:text-luxury-gold transition-colors duration-200 cursor-pointer group"
                    >
                      <Mail className="h-3.5 w-3.5 text-luxury-gold group-hover:scale-110 transition-transform" />
                      <span>Message</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBooking(prev => ({ ...prev, preferredLocation: loc.name }));
                        const elem = document.getElementById('preferred-consultation');
                        if (elem) {
                          elem.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold font-sans text-luxury-text hover:text-luxury-gold transition-colors duration-200 cursor-pointer group"
                    >
                      <Clock className="h-3.5 w-3.5 text-luxury-gold group-hover:scale-110 transition-transform" />
                      <span>Book Here</span>
                    </button>

                    <a 
                      href={loc.mapsUrl}
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold font-sans text-luxury-text hover:text-luxury-gold transition-colors duration-200 group cursor-pointer"
                    >
                      <span>Get Directions</span>
                      <ExternalLink className="h-3.5 w-3.5 stroke-[2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-luxury-gold" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Standalone Reusable Contact Drawer Modal */}
        <ContactDrawerModal
          isOpen={!!activeDrawerLocation}
          onClose={() => setActiveDrawerLocation(null)}
          location={activeDrawerLocation}
        />
      </section>

      {/* 2. Book Consultation Form Section */}
      <section 
        id="preferred-consultation" 
        className="py-24 bg-gradient-to-b from-[#fbf8f3] via-[#f6efe4] to-[#fbf9f5] text-stone-900 border-b border-[#D8C2A3]/40 relative overflow-hidden selection:bg-[#D8C2A3]/30 isolate transform-gpu"
      >
        {/* Luxury Gold & Champagne Ambient Lighting (GPU-accelerated pre-computed radial gradients) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-85 transform-gpu"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(216, 194, 163, 0.4) 0%, rgba(236, 220, 200, 0.2) 45%, transparent 75%), radial-gradient(circle 380px at 100% 25%, rgba(236, 220, 200, 0.3) 0%, transparent 70%), radial-gradient(circle 380px at 0% 80%, rgba(228, 210, 188, 0.35) 0%, transparent 70%)',
            transform: 'translateZ(0)'
          }}
        />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-light text-stone-900 mb-6 tracking-tight leading-tight">
              {consultationConfig?.heading || 'Book a Preferred Consultation'}
            </h2>
            <p className="font-sans text-sm md:text-base text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
              {consultationConfig?.subheading || 'Take the first step towards world-class care. Fill out the form below and our team will contact you to finalize your appointment.'}
            </p>
            <div className="w-12 h-[1px] bg-[#a88d6b] mx-auto mt-8" />
          </div>

          <AnimatePresence mode="wait">
            {!submittedBooking ? (
              <motion.form 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleBookingSubmit} 
                className="space-y-6"
              >
                {/* Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">First Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter your first name"
                      value={booking.firstName}
                      onChange={(e) => setBooking({ ...booking, firstName: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">Last Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter your last name"
                      value={booking.lastName}
                      onChange={(e) => setBooking({ ...booking, lastName: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="email@example.com"
                      value={booking.email}
                      onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="Enter your phone number"
                      value={booking.phone}
                      onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Dynamic 3-Step Selection Flow matching the Navbar Structure */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">
                      Select From Our Clinic's Specialist Treatments
                    </label>
                  </div>

                  {/* When no treatment is added, display clean Add Treatment UI */}
                  {selectedTreatments.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(true)}
                      className="w-full bg-white hover:bg-slate-50/90 border-2 border-dashed border-luxury-border hover:border-luxury-gold/70 rounded-2xl p-5 sm:p-6 text-left transition-all duration-200 shadow-xs group flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="p-3 rounded-xl bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 group-hover:scale-105 transition-transform shrink-0">
                          <Plus className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif font-bold text-base text-luxury-text group-hover:text-luxury-subtext transition-colors">
                            Add Treatment
                          </h4>
                          <p className="text-xs text-luxury-subtext truncate font-light mt-0.5">
                            Tap to browse clinic categories and select specialist procedures
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-white bg-black group-hover:bg-luxury-text px-3.5 py-2 rounded-xl transition-colors shadow-xs flex items-center gap-1.5">
                          <Plus className="h-3.5 w-3.5" /> Select
                        </span>
                      </div>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {/* List of Added Treatments */}
                      <div className="space-y-2.5">
                        {getSelectedTreatmentsData().map((item) => (
                          <div
                            key={item.id}
                            className="bg-white hover:bg-slate-50/80 border border-luxury-border/80 hover:border-luxury-gold/50 rounded-2xl p-4 transition-all duration-200 shadow-xs flex items-center justify-between gap-3 group"
                          >
                            <div 
                              onClick={() => {
                                setBooking(prev => ({ ...prev, procedure: item.id }));
                                const foundItem = findTreatmentItemInDB(item.id);
                                if (foundItem) {
                                  const pricingItem = resolveTreatmentToPricingItem(foundItem, item.catName);
                                  setPricingReturnToDrawer(false);
                                  setActivePricingModalTreatment(pricingItem);
                                }
                              }}
                              className="min-w-0 flex-1 cursor-pointer"
                            >
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-luxury-gold bg-luxury-gold/10 px-2.5 py-0.5 rounded">
                                  {item.areaName} • {item.catName}
                                </span>
                                {item.packageName && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                                    {item.packageName}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-serif font-bold text-sm sm:text-base text-luxury-text mt-1 truncate group-hover:text-luxury-subtext transition-colors">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-3 mt-1 text-xs text-luxury-subtext">
                                <span className="font-serif font-bold text-luxury-text">{item.price}</span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-luxury-muted" /> {item.time}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setBooking(prev => ({ ...prev, procedure: item.id }));
                                  const foundItem = findTreatmentItemInDB(item.id);
                                  if (foundItem) {
                                    const pricingItem = resolveTreatmentToPricingItem(foundItem, item.catName);
                                    setPricingReturnToDrawer(false);
                                    setActivePricingModalTreatment(pricingItem);
                                  }
                                }}
                                title="Select package & session options"
                                className="text-xs font-bold text-luxury-text bg-luxury-secondary/80 hover:bg-luxury-secondary px-3 py-1.5 rounded-xl border border-luxury-border/50 transition-colors cursor-pointer hidden sm:inline-block"
                              >
                                {item.packageName ? 'Change Package' : 'Select Package'}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeTreatment(item.id);
                                }}
                                title="Remove treatment"
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Another Treatment Button */}
                      <button
                        type="button"
                        onClick={() => setIsDrawerOpen(true)}
                        className="w-full bg-slate-50/80 hover:bg-slate-100 border border-dashed border-luxury-border hover:border-luxury-gold/60 rounded-xl py-3 px-4 text-xs font-bold text-luxury-text flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Plus className="h-4 w-4 text-luxury-gold" />
                        <span>Add Another Treatment</span>
                      </button>

                      {/* Consultation Plan Summary Bar */}
                      <div 
                        onClick={() => setIsDrawerOpen(true)}
                        className="bg-black p-4 sm:p-4.5 rounded-2xl flex items-center justify-between shadow-md hover:shadow-lg transition-all cursor-pointer border border-luxury-text/20 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Clean minimal circular badge for mobile screen only */}
                          <div className="sm:hidden flex items-center justify-center w-6 h-6 rounded-full bg-luxury-gold text-luxury-text text-[11px] font-black shrink-0 shadow-sm">
                            {selectedTreatments.length}
                          </div>
                          {/* Desktop badge with Sparkles */}
                          <div className="hidden sm:block relative p-2.5 bg-luxury-gold/20 rounded-xl text-luxury-gold shrink-0 group-hover:scale-105 transition-transform">
                            <Sparkles className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-text text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-luxury-text">
                              {selectedTreatments.length}
                            </span>
                          </div>
                          <div className="text-left min-w-0">
                            <span className="text-[9px] uppercase tracking-wider text-slate-300 font-extrabold block">Consultation Plan</span>
                            <span className="text-xs font-bold text-white block truncate">
                              {selectedTreatments.length} Procedure{selectedTreatments.length > 1 ? 's' : ''} Selected
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="text-[9px] uppercase tracking-wider text-luxury-gold/90 block font-extrabold">Total Est.</span>
                            <span className="text-sm font-bold font-serif text-luxury-gold">
                              ${getSelectedTreatmentsData().reduce((sum, item) => sum + parsePrice(item.price), 0).toLocaleString()}
                            </span>
                          </div>
                          <span className="hidden sm:inline-block bg-white/10 px-3 py-1.5 rounded-xl text-[10px] font-bold hover:bg-white/15 transition-all text-white border border-white/5 uppercase tracking-wide shrink-0">
                            Review
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Custom Bottom Drawer for Category Selection & Selected Treatments */}
                  {mounted && typeof document !== 'undefined' && createPortal(
                    <AnimatePresence>
                      {isDrawerOpen && (
                        <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center">
                          {/* Backdrop Overlay */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            onClick={() => {
                              setOpenMenu(null);
                              setIsDrawerOpen(false);
                            }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                          />
                          {/* Slide-Up Drawer: On mobile docked at bottom of viewport, on desktop centered */}
                          <motion.div
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="relative w-full md:max-w-2xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col font-sans z-10 max-h-[88vh] overflow-hidden"
                          >
                          
                          
                          {/* Header */}
                          <div className="px-5 sm:px-6 pt-4 pb-1 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div>
                              <h4 className="font-serif font-bold text-lg text-luxury-text">Choose Specialist Treatment</h4>
                              <p className="text-xs text-slate-500">Select clinical preferred treatment</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenu(null);
                                setIsDrawerOpen(false);
                              }}
                              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-all cursor-pointer"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Content */}
                          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
                            {/* 3-Step Selection Flow inside Drawer */}
                            <div ref={menuContainerRef} className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative">
                              {/* Step 1: Area */}
                              {(() => {
                                const currentArea = CLINICAL_AREAS_DB.find(a => a.id === selectedAreaId) || CLINICAL_AREAS_DB[0];
                                return (
                                  <div className="space-y-1.5 relative">
                                    <span className="text-[10px] font-bold text-luxury-muted uppercase tracking-wider block">
                                      Step 1 • Anatomical Area
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => toggleMenu('area', e)}
                                      className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-luxury-text font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer shadow-xs ${
                                        openMenu === 'area' ? 'border-luxury-gold ring-1 ring-luxury-gold/50 shadow-md' : 'border-luxury-border hover:border-luxury-gold/60'
                                      }`}
                                    >
                                      <span className="truncate">{currentArea?.name || 'Select Area'}</span>
                                      <ChevronDown className={`h-4 w-4 text-luxury-muted transition-transform duration-200 shrink-0 ml-2 ${openMenu === 'area' ? 'rotate-180 text-luxury-gold' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                      {openMenu === 'area' && (
                                        <motion.div
                                          initial={{ opacity: 0, y: menuDirection === 'up' ? 4 : -4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: menuDirection === 'up' ? 4 : -4 }}
                                          transition={{ duration: 0.12 }}
                                          className={`absolute left-0 right-0 z-50 bg-white rounded-2xl border border-luxury-border shadow-2xl overflow-hidden max-h-56 overflow-y-auto py-1.5 ${
                                            menuDirection === 'up' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                                          }`}
                                        >
                                          {CLINICAL_AREAS_DB.map(area => {
                                            const isSelected = area.id === selectedAreaId;
                                            return (
                                              <button
                                                key={area.id}
                                                type="button"
                                                onClick={() => {
                                                  handleAreaChange(area.id);
                                                  setOpenMenu(null);
                                                }}
                                                className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                                                  isSelected 
                                                    ? 'bg-luxury-secondary/90 font-bold text-luxury-text' 
                                                    : 'text-luxury-subtext hover:bg-luxury-secondary/40 hover:text-luxury-text font-medium'
                                                }`}
                                              >
                                                <span className="truncate">{area.name}</span>
                                                {isSelected && <Check className="h-4 w-4 text-luxury-gold shrink-0 ml-2" />}
                                              </button>
                                            );
                                          })}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })()}

                              {/* Step 2: Category */}
                              {(() => {
                                const currentCategories = CLINICAL_AREAS_DB.find(a => a.id === selectedAreaId)?.categories || [];
                                const currentCategory = currentCategories.find(c => c.id === selectedCategoryId) || currentCategories[0];
                                return (
                                  <div className="space-y-1.5 relative">
                                    <span className="text-[10px] font-bold text-luxury-muted uppercase tracking-wider block">
                                      Step 2 • Treatment Category
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => toggleMenu('category', e)}
                                      className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-luxury-text font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer shadow-xs ${
                                        openMenu === 'category' ? 'border-luxury-gold ring-1 ring-luxury-gold/50 shadow-md' : 'border-luxury-border hover:border-luxury-gold/60'
                                      }`}
                                    >
                                      <span className="truncate">{currentCategory?.name || 'Select Category'}</span>
                                      <ChevronDown className={`h-4 w-4 text-luxury-muted transition-transform duration-200 shrink-0 ml-2 ${openMenu === 'category' ? 'rotate-180 text-luxury-gold' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                      {openMenu === 'category' && (
                                        <motion.div
                                          initial={{ opacity: 0, y: menuDirection === 'up' ? 4 : -4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: menuDirection === 'up' ? 4 : -4 }}
                                          transition={{ duration: 0.12 }}
                                          className={`absolute left-0 right-0 z-50 bg-white rounded-2xl border border-luxury-border shadow-2xl overflow-hidden max-h-56 overflow-y-auto py-1.5 ${
                                            menuDirection === 'up' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                                          }`}
                                        >
                                          {currentCategories.length === 0 ? (
                                            <div className="px-4 py-3 text-xs text-luxury-muted text-center">No categories available</div>
                                          ) : (
                                            currentCategories.map(cat => {
                                              const isSelected = cat.id === selectedCategoryId;
                                              return (
                                                <button
                                                  key={cat.id}
                                                  type="button"
                                                  onClick={() => {
                                                    handleCategoryChange(cat.id);
                                                    setOpenMenu(null);
                                                  }}
                                                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                                                    isSelected 
                                                      ? 'bg-luxury-secondary/90 font-bold text-luxury-text' 
                                                      : 'text-luxury-subtext hover:bg-luxury-secondary/40 hover:text-luxury-text font-medium'
                                                  }`}
                                                >
                                                  <span className="truncate">{cat.name}</span>
                                                  {isSelected && <Check className="h-4 w-4 text-luxury-gold shrink-0 ml-2" />}
                                                </button>
                                              );
                                            })
                                          )}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })()}

                               {/* Step 3: Specific Treatment */}
                              {(() => {
                                const areaObj = CLINICAL_AREAS_DB.find(a => a.id === selectedAreaId);
                                const catObj = areaObj?.categories.find(c => c.id === selectedCategoryId);
                                const currentItems = catObj?.items || [];
                                const currentItem = booking.procedure ? currentItems.find(i => i.id === booking.procedure) : null;
                                return (
                                  <div className="space-y-1.5 relative">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-luxury-muted uppercase tracking-wider block">
                                        Step 3 • Specific Treatment
                                      </span>
                                      {currentItem && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenu(null);
                                            setPricingReturnToDrawer(true);
                                            setIsDrawerOpen(false);
                                            const pricingItem = resolveTreatmentToPricingItem(currentItem, catObj?.name);
                                            setActivePricingModalTreatment(pricingItem);
                                          }}
                                          className="text-[10px] font-bold text-luxury-gold hover:underline cursor-pointer flex items-center gap-1"
                                        >
                                          <span>View Packages</span>
                                        </button>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        if (currentItems.length === 1) {
                                          const singleItem = currentItems[0];
                                          setBooking(prev => ({ ...prev, procedure: singleItem.id }));
                                          setOpenMenu(null);
                                          setPricingReturnToDrawer(true);
                                          setIsDrawerOpen(false);
                                          const pricingItem = resolveTreatmentToPricingItem(singleItem, catObj?.name);
                                          setActivePricingModalTreatment(pricingItem);
                                          return;
                                        }
                                        toggleMenu('treatment', e);
                                      }}
                                      className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-luxury-text font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer shadow-xs ${
                                        openMenu === 'treatment' ? 'border-luxury-gold ring-1 ring-luxury-gold/50 shadow-md' : 'border-luxury-border hover:border-luxury-gold/60'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate min-w-0 pr-2">
                                        <span className={`truncate ${!currentItem ? 'text-luxury-subtext font-normal' : ''}`}>
                                          {currentItem?.name || 'Select Treatment'}
                                        </span>
                                        {currentItem?.price && (
                                          <span className="text-[10px] font-bold text-luxury-gold bg-luxury-gold/10 px-1.5 py-0.5 rounded shrink-0">
                                            {currentItem.price}
                                          </span>
                                        )}
                                      </div>
                                      <ChevronDown className={`h-4 w-4 text-luxury-muted transition-transform duration-200 shrink-0 ml-2 ${openMenu === 'treatment' ? 'rotate-180 text-luxury-gold' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                      {openMenu === 'treatment' && (
                                        <motion.div
                                          initial={{ opacity: 0, y: menuDirection === 'up' ? 4 : -4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: menuDirection === 'up' ? 4 : -4 }}
                                          transition={{ duration: 0.12 }}
                                          className={`absolute left-0 right-0 z-50 bg-white rounded-2xl border border-luxury-border shadow-2xl overflow-hidden max-h-60 overflow-y-auto py-1.5 divide-y divide-luxury-border/30 ${
                                            menuDirection === 'up' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                                          }`}
                                        >
                                          {currentItems.length === 0 ? (
                                            <div className="px-4 py-3 text-xs text-luxury-muted text-center">No treatments available</div>
                                          ) : (
                                            currentItems.map(item => {
                                              const isSelected = item.id === booking.procedure;
                                              return (
                                                <button
                                                  key={item.id}
                                                  type="button"
                                                  onClick={() => {
                                                    setBooking(prev => ({ ...prev, procedure: item.id }));
                                                    setOpenMenu(null);
                                                    setPricingReturnToDrawer(true);
                                                    setIsDrawerOpen(false);
                                                    const pricingItem = resolveTreatmentToPricingItem(item, catObj?.name);
                                                    setActivePricingModalTreatment(pricingItem);
                                                  }}
                                                  className={`w-full px-4 py-2.5 text-left transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                                                    isSelected 
                                                      ? 'bg-luxury-secondary/90 text-luxury-text' 
                                                      : 'text-luxury-subtext hover:bg-luxury-secondary/40 hover:text-luxury-text'
                                                  }`}
                                                >
                                                  <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                      <span className={`text-xs sm:text-sm truncate ${isSelected ? 'font-bold text-luxury-text' : 'font-medium'}`}>
                                                        {item.name}
                                                      </span>
                                                      <span className="text-[10px] font-bold text-luxury-gold bg-luxury-gold/10 px-1.5 py-0.5 rounded shrink-0">
                                                        {item.price}
                                                      </span>
                                                    </div>
                                                    {item.desc && (
                                                      <p className="text-[11px] text-luxury-muted line-clamp-1 mt-0.5 font-light truncate">
                                                        {item.desc}
                                                      </p>
                                                    )}
                                                  </div>
                                                  {isSelected && <Check className="h-4 w-4 text-luxury-gold shrink-0 ml-1.5" />}
                                                </button>
                                              );
                                            })
                                          )}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Consultation Plan item placed with/below the select treatment selections */}
                            {selectedTreatments.length > 0 && (
                              <div 
                                onClick={() => {
                                  if (booking.procedure) {
                                    setIsTreatmentCardOpen(true);
                                  }
                                }}
                                className="bg-black p-4 sm:p-4.5 rounded-2xl flex items-center justify-between shadow-md border border-luxury-text/20 cursor-pointer"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="sm:hidden flex items-center justify-center w-6 h-6 rounded-full bg-luxury-gold text-luxury-text text-[11px] font-black shrink-0 shadow-sm">
                                    {selectedTreatments.length}
                                  </div>
                                  <div className="hidden sm:block relative p-2.5 bg-luxury-gold/20 rounded-xl text-luxury-gold shrink-0">
                                    <Sparkles className="h-5 w-5" />
                                    <span className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-text text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-luxury-text">
                                      {selectedTreatments.length}
                                    </span>
                                  </div>
                                  <div className="text-left min-w-0">
                                    <span className="text-[9px] uppercase tracking-wider text-slate-300 font-extrabold block">Consultation Plan</span>
                                    <span className="text-xs font-bold text-white block truncate">
                                      {selectedTreatments.length} Procedure{selectedTreatments.length > 1 ? 's' : ''} Selected
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <div className="text-right">
                                    <span className="text-[9px] uppercase tracking-wider text-luxury-gold/90 block font-extrabold">Total Est.</span>
                                    <span className="text-sm font-bold font-serif text-luxury-gold">
                                      ${getSelectedTreatmentsData().reduce((sum, item) => sum + parsePrice(item.price), 0).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>,
                  document.body
                )}

                  {/* Clean Mobile Drawer Sheet for Selected Treatment Card Details (Without a header) */}
                  {mounted && typeof document !== 'undefined' && createPortal(
                    <AnimatePresence>
                      {isTreatmentCardOpen && booking.procedure && (() => {
                        const areaObj = CLINICAL_AREAS_DB.find(a => a.id === selectedAreaId);
                        const catObj = areaObj?.categories.find(c => c.id === selectedCategoryId);
                        const currentTreatment = catObj?.items.find(i => i.id === booking.procedure);
                        if (!currentTreatment || !catObj) return null;

                        return (
                          <div className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center">
                            {/* Backdrop Overlay */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.18 }}
                              onClick={() => setIsTreatmentCardOpen(false)}
                              className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                            />

                            {/* Clean Mobile Drawer Sheet without Header - Details render directly on modal */}
                            <motion.div
                              initial={{ opacity: 0, y: 28 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 20 }}
                              transition={{ duration: 0.22, ease: "easeOut" }}
                              className="relative w-full md:max-w-xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col font-sans z-10 max-h-[85vh] overflow-y-auto p-5 sm:p-6 space-y-4"
                            >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
                              {/* Title & Category */}
                              <div className="space-y-1.5">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-luxury-subtext bg-black/10 px-2.5 py-0.5 rounded-full w-fit inline-block">
                                  {catObj.name}
                                </span>
                                <h4 
                                  onClick={() => {
                                    setIsTreatmentCardOpen(false);
                                    setIsDrawerOpen(false);
                                    onTreatmentClick?.(currentTreatment.name);
                                  }}
                                  className="text-base sm:text-lg font-serif font-bold text-luxury-text hover:text-luxury-subtext transition-colors leading-snug cursor-pointer block hover:underline decoration-rose-gold decoration-2 underline-offset-4"
                                  title="Click to view full clinical details"
                                >
                                  {currentTreatment.name}
                                </h4>
                                <p className="text-xs text-luxury-subtext leading-relaxed max-w-xl">
                                  {currentTreatment.desc}
                                </p>
                              </div>

                              {/* Info Badges (Time & Price) */}
                              <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 shrink-0 w-full md:w-auto">
                                {/* Price Card */}
                                <div 
                                  onClick={() => {
                                    setIsTreatmentCardOpen(false);
                                    setIsDrawerOpen(false);
                                    onTreatmentClick?.(currentTreatment.name);
                                  }}
                                  title="Click to view treatment details"
                                  className="flex-1 md:flex-none flex items-center gap-2.5 bg-luxury-secondary/30 border border-luxury-border/40 hover:border-luxury-text/60 px-3.5 py-2 rounded-xl shadow-xs hover:shadow-sm min-w-0 sm:min-w-[140px] cursor-pointer transition-all hover:bg-slate-50 active:scale-[0.98]"
                                >
                                  <div className="p-1.5 bg-black text-luxury-gold rounded-lg shrink-0">
                                    <DollarSign className="h-3.5 w-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-[8.5px] uppercase tracking-wider text-luxury-subtext/60 block font-bold truncate">Investment</span>
                                    <span className="text-xs sm:text-sm font-bold text-luxury-text font-serif block truncate">{currentTreatment.price}</span>
                                  </div>
                                </div>

                                {/* Duration Card */}
                                <div 
                                  onClick={() => {
                                    setIsTreatmentCardOpen(false);
                                    setIsDrawerOpen(false);
                                    onTreatmentClick?.(currentTreatment.name);
                                  }}
                                  title="Click to view treatment details"
                                  className="flex-1 md:flex-none flex items-center gap-2.5 bg-luxury-secondary/30 border border-luxury-border/40 hover:border-luxury-text/60 px-3.5 py-2 rounded-xl shadow-xs hover:shadow-sm min-w-0 sm:min-w-[140px] cursor-pointer transition-all hover:bg-slate-50 active:scale-[0.98]"
                                >
                                  <div className="p-1.5 bg-black text-luxury-gold rounded-lg shrink-0">
                                    <Clock className="h-3.5 w-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-[8.5px] uppercase tracking-wider text-luxury-subtext/60 block font-bold truncate">Duration</span>
                                    <span className="text-xs sm:text-sm font-bold text-luxury-text block truncate">{currentTreatment.time}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Toggle Add to Selection Button */}
                            <div className="pt-3 border-t border-luxury-text/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                              <p className="text-xs text-slate-500 font-sans">
                                {selectedTreatments.includes(currentTreatment.id)
                                  ? "✓ This treatment is in your consultation plan."
                                  : "Would you like to add this treatment to your consultation?"}
                              </p>
                              {selectedTreatments.includes(currentTreatment.id) ? (
                                <button
                                  type="button"
                                  disabled={selectedTreatments.length <= 1}
                                  onClick={() => removeTreatment(currentTreatment.id)}
                                  className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                    selectedTreatments.length <= 1
                                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent"
                                      : "bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-150 cursor-pointer"
                                  }`}
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Remove from Plan
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => addTreatment(currentTreatment.id)}
                                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-black hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                                >
                                  <Plus className="h-3.5 w-3.5" /> Add to Plan
                                </button>
                              )}
                            </div>

                            {/* Clean action button at bottom of sheet */}
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => setIsTreatmentCardOpen(false)}
                                className="w-full py-2.5 bg-black hover:bg-black/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Done
                              </button>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })()}
                  </AnimatePresence>,
                  document.body
                )}
              </div>

                {/* Description what to improve */}
                <div className="space-y-2">
                  <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">What would you like to improve?</label>
                  <textarea 
                    placeholder="Tell us about your concerns..." 
                    rows={3}
                    value={booking.improvement}
                    onChange={(e) => setBooking({ ...booking, improvement: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all resize-none font-medium"
                  />
                </div>

                {/* Doctor and Date Selection */}
                <div ref={consultMenuContainerRef} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Custom Dropdown: Preferred Clinic Location */}
                    <div className="space-y-2 relative">
                      <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">
                        Preferred Location
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveConsultMenu(activeConsultMenu === 'location' ? null : 'location')}
                        className={`w-full px-5 py-4 rounded-xl border bg-white text-sm text-luxury-text font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer shadow-xs ${
                          activeConsultMenu === 'location' ? 'border-luxury-gold ring-1 ring-luxury-gold/50 shadow-md' : 'border-luxury-border hover:border-luxury-gold/60'
                        }`}
                      >
                        <span className={`truncate ${!booking.preferredLocation ? 'text-luxury-subtext font-normal' : ''}`}>
                          {booking.preferredLocation || 'Select clinic location'}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-luxury-muted transition-transform duration-200 shrink-0 ml-2 ${activeConsultMenu === 'location' ? 'rotate-180 text-luxury-gold' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {activeConsultMenu === 'location' && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.12 }}
                            className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl border border-luxury-border shadow-2xl overflow-hidden py-1.5 divide-y divide-luxury-border/20 max-h-60 overflow-y-auto"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setBooking({ ...booking, preferredLocation: '' });
                                setActiveConsultMenu(null);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                                !booking.preferredLocation
                                  ? 'bg-luxury-secondary/90 font-bold text-luxury-text'
                                  : 'text-luxury-subtext hover:bg-luxury-secondary/40 hover:text-luxury-text font-medium'
                              }`}
                            >
                              <span className="truncate">Any Location (First Available)</span>
                              {!booking.preferredLocation && <Check className="h-4 w-4 text-luxury-gold shrink-0 ml-2" />}
                            </button>
                            {activeLocations.map((loc) => {
                              const isSelected = booking.preferredLocation === loc.name;
                              return (
                                <button
                                  key={loc.id}
                                  type="button"
                                  onClick={() => {
                                    setBooking({ ...booking, preferredLocation: loc.name });
                                    setActiveConsultMenu(null);
                                  }}
                                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-luxury-secondary/90 font-bold text-luxury-text'
                                      : 'text-luxury-subtext hover:bg-luxury-secondary/40 hover:text-luxury-text font-medium'
                                  }`}
                                >
                                  <div className="truncate text-left">
                                    <span className="block font-semibold">{loc.name}</span>
                                    <span className="block text-[11px] text-slate-400 font-normal truncate">{loc.address}</span>
                                  </div>
                                  {isSelected && <Check className="h-4 w-4 text-luxury-gold shrink-0 ml-2" />}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Custom Dropdown: Preferred Specialist */}
                    <div className="space-y-2 relative">
                      <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">
                        {specialistLabel}
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveConsultMenu(activeConsultMenu === 'doctor' ? null : 'doctor')}
                        className={`w-full px-5 py-4 rounded-xl border bg-white text-sm text-luxury-text font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer shadow-xs ${
                          activeConsultMenu === 'doctor' ? 'border-luxury-gold ring-1 ring-luxury-gold/50 shadow-md' : 'border-luxury-border hover:border-luxury-gold/60'
                        }`}
                      >
                        <span className={`truncate ${!booking.doctor ? 'text-luxury-subtext font-normal' : ''}`}>
                          {doctorOptions.find(d => d.value === booking.doctor)?.label || 'Select a specialist'}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-luxury-muted transition-transform duration-200 shrink-0 ml-2 ${activeConsultMenu === 'doctor' ? 'rotate-180 text-luxury-gold' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {activeConsultMenu === 'doctor' && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.12 }}
                            className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl border border-luxury-border shadow-2xl overflow-hidden py-1.5 divide-y divide-luxury-border/20 max-h-60 overflow-y-auto"
                          >
                            {doctorOptions.map((doc) => {
                              const isSelected = booking.doctor === doc.value;
                              return (
                                <button
                                  key={doc.value || 'none'}
                                  type="button"
                                  onClick={() => {
                                    setBooking({ ...booking, doctor: doc.value });
                                    setActiveConsultMenu(null);
                                  }}
                                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-luxury-secondary/90 font-bold text-luxury-text'
                                      : 'text-luxury-subtext hover:bg-luxury-secondary/40 hover:text-luxury-text font-medium'
                                  }`}
                                >
                                  <div className="truncate text-left">
                                    <span className="block truncate">{doc.label}</span>
                                    {doc.specialty && (
                                      <span className="block text-[11px] text-slate-400 font-normal truncate">{doc.specialty}</span>
                                    )}
                                  </div>
                                  {isSelected && <Check className="h-4 w-4 text-luxury-gold shrink-0 ml-2" />}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <AppointmentDatePicker
                      value={booking.date}
                      onChange={(dateStr) =>
                        setBooking((prev) => ({
                          ...prev,
                          date: dateStr,
                          appointmentTime:
                            prev.appointmentTime && availableTimeSlots.includes(prev.appointmentTime)
                              ? prev.appointmentTime
                              : availableTimeSlots[0] || '',
                        }))
                      }
                      label="Preferred Appointment Date"
                      placeholder="Select appointment date"
                      allowedDaysOfWeek={allowedDaysOfWeek}
                      availableTimeSlots={availableTimeSlots}
                      selectedTime={booking.appointmentTime}
                      onSelectTime={(timeStr) => setBooking((prev) => ({ ...prev, appointmentTime: timeStr }))}
                      availabilityHint={availabilityHint}
                    />
                  </div>

                  {/* Best reach time and feedback medium */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Custom Dropdown: Best Time to Reach You */}
                    <div className="space-y-2 relative">
                      <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">Best Time to Reach You</label>
                      <button
                        type="button"
                        onClick={() => setActiveConsultMenu(activeConsultMenu === 'bestTime' ? null : 'bestTime')}
                        className={`w-full px-5 py-4 rounded-xl border bg-white text-sm text-luxury-text font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer shadow-xs ${
                          activeConsultMenu === 'bestTime' ? 'border-luxury-gold ring-1 ring-luxury-gold/50 shadow-md' : 'border-luxury-border hover:border-luxury-gold/60'
                        }`}
                      >
                        <span className="truncate">
                          {bestTimeOptions.find(t => t.value === booking.bestTime)?.label || bestTimeOptions[0]?.label || 'Morning'}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-luxury-muted transition-transform duration-200 shrink-0 ml-2 ${activeConsultMenu === 'bestTime' ? 'rotate-180 text-luxury-gold' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {activeConsultMenu === 'bestTime' && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.12 }}
                            className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl border border-luxury-border shadow-2xl overflow-hidden py-1.5 divide-y divide-luxury-border/20 max-h-60 overflow-y-auto"
                          >
                            {bestTimeOptions.map((time) => {
                              const isSelected = booking.bestTime === time.value;
                              return (
                                <button
                                  key={time.value}
                                  type="button"
                                  onClick={() => {
                                    setBooking({ ...booking, bestTime: time.value });
                                    setActiveConsultMenu(null);
                                  }}
                                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-luxury-secondary/90 font-bold text-luxury-text'
                                      : 'text-luxury-subtext hover:bg-luxury-secondary/40 hover:text-luxury-text font-medium'
                                  }`}
                                >
                                  <span className="truncate">{time.label}</span>
                                  {isSelected && <Check className="h-4 w-4 text-luxury-gold shrink-0 ml-2" />}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Custom Dropdown: How did you hear about us? */}
                    <div className="space-y-2 relative">
                      <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">How did you hear about us?</label>
                      <button
                        type="button"
                        onClick={() => setActiveConsultMenu(activeConsultMenu === 'hearAboutUs' ? null : 'hearAboutUs')}
                        className={`w-full px-5 py-4 rounded-xl border bg-white text-sm text-luxury-text font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer shadow-xs ${
                          activeConsultMenu === 'hearAboutUs' ? 'border-luxury-gold ring-1 ring-luxury-gold/50 shadow-md' : 'border-luxury-border hover:border-luxury-gold/60'
                        }`}
                      >
                        <span className="truncate">
                          {hearAboutUsOptions.find(h => h.value === booking.hearAboutUs)?.label || hearAboutUsOptions[0]?.label || 'Search Engine (Google)'}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-luxury-muted transition-transform duration-200 shrink-0 ml-2 ${activeConsultMenu === 'hearAboutUs' ? 'rotate-180 text-luxury-gold' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {activeConsultMenu === 'hearAboutUs' && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.12 }}
                            className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl border border-luxury-border shadow-2xl overflow-hidden py-1.5 divide-y divide-luxury-border/20 max-h-60 overflow-y-auto"
                          >
                            {hearAboutUsOptions.map((opt) => {
                              const isSelected = booking.hearAboutUs === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    setBooking({ ...booking, hearAboutUs: opt.value });
                                    setActiveConsultMenu(null);
                                  }}
                                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-luxury-secondary/90 font-bold text-luxury-text'
                                      : 'text-luxury-subtext hover:bg-luxury-secondary/40 hover:text-luxury-text font-medium'
                                  }`}
                                >
                                  <span className="truncate">{opt.label}</span>
                                  {isSelected && <Check className="h-4 w-4 text-luxury-gold shrink-0 ml-2" />}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Availability Status Display */}
                <AnimatePresence mode="wait">
                  {booking.date && availabilityStatus !== 'idle' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium ${
                        availabilityStatus === 'checking' 
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : availabilityStatus === 'available'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}>
                        {availabilityStatus === 'checking' && (
                          <>
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
                            <span>Checking clinic availability for selected date...</span>
                          </>
                        )}
                        {availabilityStatus === 'available' && (
                          <>
                            <Check className="h-4 w-4 shrink-0" />
                            <span>
                              Good availability on {new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              {booking.appointmentTime ? ` at ${booking.appointmentTime}` : ` (${bestTimeOptions.find(t => t.value === booking.bestTime)?.label || booking.bestTime})`}
                              {selectedDoctorObj ? ` with ${selectedDoctorObj.name}` : ''}.
                            </span>
                          </>
                        )}
                        {availabilityStatus === 'limited' && (
                          <>
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>
                              Limited availability on {new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              {booking.appointmentTime ? ` at ${booking.appointmentTime}` : ` (${bestTimeOptions.find(t => t.value === booking.bestTime)?.label || booking.bestTime})`}. We'll try our best to accommodate you.
                            </span>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Stay in Touch Preferences Section */}
                {visibleStayInTouchChannels.length > 0 && (
                  <div className="space-y-3">
                    <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text block">
                      Stay in Touch (Preferred Contact Channels)
                    </label>
                    <p className="text-xs text-luxury-subtext/70 font-sans -mt-1">
                      Please select your preferred option(s) for updates, notifications, and future communications:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {visibleStayInTouchChannels.map((channel) => {
                        const isSelected = booking.stayInTouch.includes(channel.id);
                        const iconMap: Record<string, React.ElementType> = {
                          email: Mail,
                          phone: Phone,
                          telephone: PhoneCall,
                          post: MapPin,
                          whatsapp: MessageCircle,
                          sms: MessageSquare,
                        };
                        const IconComponent = iconMap[channel.id.toLowerCase()] || Mail;
                        return (
                          <button
                            key={channel.id}
                            type="button"
                            onClick={() => toggleStayInTouch(channel.id)}
                            className={`flex items-center gap-2.5 p-3 rounded-lg border transition-all duration-200 cursor-pointer text-left ${
                              isSelected
                                ? 'bg-black border-luxury-text text-white shadow-sm'
                                : 'bg-luxury-secondary border-luxury-border text-luxury-text hover:bg-slate-50'
                            }`}
                          >
                            <IconComponent className={`h-4 w-4 shrink-0 ${isSelected ? 'text-luxury-gold' : 'text-luxury-text'}`} />
                            <span className="font-sans text-xs font-semibold tracking-wide">{channel.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Additional notes */}
                <div className="space-y-2">
                  <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">Additional Notes</label>
                  <textarea 
                    placeholder="Any other information..." 
                    rows={2}
                    value={booking.notes}
                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all resize-none font-medium"
                  />
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-4 pt-4 border-t border-luxury-border/40">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required
                      checked={booking.agreePrivacy}
                      onChange={(e) => setBooking({ ...booking, agreePrivacy: e.target.checked })}
                      className="mt-1 rounded border-luxury-border text-luxury-text focus:ring-luxury-text h-4.5 w-4.5"
                    />
                    <span className="text-sm text-luxury-subtext font-medium leading-relaxed">
                      I agree to the collection and processing of my personal information in accordance with the <a href="#" onClick={(e) => e.preventDefault()} className="text-luxury-text font-bold hover:underline">Privacy Policy</a>.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={booking.agreeOffers}
                      onChange={(e) => setBooking({ ...booking, agreeOffers: e.target.checked })}
                      className="mt-1 rounded border-luxury-border text-luxury-text focus:ring-luxury-text h-4.5 w-4.5"
                    />
                    <span className="text-sm text-luxury-subtext font-medium leading-relaxed">
                      I'd like to receive exclusive offers and skincare updates.
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-6">
                  <button 
                    type="submit"
                    className="w-full bg-black hover:bg-black text-white py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-md active:scale-[0.99] cursor-pointer"
                  >
                    Book My Consultation
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                className="bg-luxury-secondary border border-luxury-border/40 p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl text-center max-w-2xl mx-auto shadow-sm"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/10 flex items-center justify-center mx-auto mb-4 text-luxury-text">
                  <Check className="h-5 w-5 sm:h-8 sm:w-8 animate-pulse" />
                </div>
                <h3 className="font-serif font-bold text-lg sm:text-2xl text-luxury-text mb-2 px-1 tracking-tight">
                  Consultation Request Received
                </h3>
                <p className="text-xs sm:text-sm text-luxury-subtext/95 mb-5 sm:mb-6 font-medium leading-relaxed max-w-lg mx-auto px-1 sm:px-3 break-words text-slate-600">
                  Thank you, <span className="font-bold text-luxury-text">{booking.firstName}</span>. Our specialist client care team will contact you shortly via email (<span className="font-semibold text-luxury-text break-all inline-block hover:underline">{booking.email}</span>) or phone (<span className="font-semibold text-luxury-text whitespace-nowrap inline-block">{booking.phone}</span>) to finalize your preferred date and time.
                </p>

                {/* Selected Treatments Summary inside success view - highly responsive and clean */}
                <div className="my-5 sm:my-6 bg-white border border-luxury-border/30 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-left max-w-md mx-auto space-y-3.5 shadow-sm">
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block border-b border-luxury-border/20 pb-2">
                    Consultation Request Summary ({selectedTreatments.length})
                  </span>
                  <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                    {getSelectedTreatmentsData().map((item) => (
                      <div key={item.id} className="flex justify-between items-start gap-3 text-xs">
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-luxury-text block truncate text-xs">{item.name}</span>
                          <span className="text-[9px] text-luxury-subtext/60 font-mono tracking-wider uppercase block">{item.areaName} • {item.time}</span>
                        </div>
                        <span className="font-serif font-bold text-luxury-gold shrink-0 text-right text-xs sm:text-sm">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-luxury-border/20 pt-3 flex justify-between items-center text-xs font-bold text-luxury-text">
                    <span>Total Estimated Investment:</span>
                    <span className="font-serif text-sm sm:text-base text-luxury-gold">
                      ${getSelectedTreatmentsData().reduce((sum, item) => sum + parsePrice(item.price), 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {booking.stayInTouch.length > 0 && (
                  <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 bg-white border border-luxury-border/20 p-2.5 sm:px-4 sm:py-2.5 rounded-xl text-[11px] text-luxury-text max-w-md mx-auto w-full">
                    <span className="font-bold shrink-0 text-xs text-luxury-text">Stay in Touch Via:</span>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {booking.stayInTouch.map(id => {
                        const channelObj = (consultationConfig?.stayInTouchChannels || []).find(c => c.id === id);
                        const fallbackMap: Record<string, string> = {
                          email: 'Email',
                          phone: 'Phone',
                          telephone: 'Tel Phone',
                          post: 'Post Mail',
                          whatsapp: 'WhatsApp',
                          sms: 'SMS',
                        };
                        return (
                          <span key={id} className="bg-black/5 text-luxury-text font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider border border-luxury-text/10">
                            {channelObj?.label || fallbackMap[id] || id}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                  {booking.preferredLocation && (
                    <div className="inline-flex items-center gap-1.5 bg-white border border-luxury-border/30 px-3.5 py-1.5 rounded-full text-xs text-luxury-text shadow-2xs">
                      <MapPin className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
                      <span>Location: <strong>{booking.preferredLocation}</strong></span>
                    </div>
                  )}
                  {selectedDoctorObj && (
                    <div className="inline-flex items-center gap-1.5 bg-white border border-luxury-border/30 px-3.5 py-1.5 rounded-full text-xs text-luxury-text shadow-2xs">
                      <Sparkles className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
                      <span>{specialistLabel}: <strong>{selectedDoctorObj.name}</strong></span>
                    </div>
                  )}
                  {booking.date && (
                    <div className="inline-flex items-center gap-1.5 bg-white border border-luxury-border/30 px-3.5 py-1.5 rounded-full text-xs text-luxury-text shadow-2xs">
                      <Clock className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
                      <span>
                        Requested: <strong>{new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}{booking.appointmentTime ? ` • ${booking.appointmentTime}` : ''}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-center w-full px-1 sm:px-0 pt-2">
                  <button 
                    onClick={() => {
                      setSubmittedBooking(false);
                      setSelectedTreatments(['exosome']);
                      setBooking({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        procedure: 'exosome',
                        improvement: '',
                        doctor: '',
                        preferredLocation: '',
                        date: '',
                        appointmentTime: '',
                        bestTime: bestTimeOptions[0]?.value || 'morning',
                        hearAboutUs: hearAboutUsOptions[0]?.value || 'search',
                        stayInTouch: [],
                        notes: '',
                        agreePrivacy: false,
                        agreeOffers: false
                      });
                    }}
                    className="w-full sm:w-auto bg-black hover:bg-black text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                  >
                    Book Another Consultation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* Pricing Package Selector Modal */}
      {activePricingModalTreatment && (
        <PackageSelectModal
          treatment={activePricingModalTreatment}
          onClose={handleClosePricingModal}
          onBack={pricingReturnToDrawer ? handleBackFromPricingModal : undefined}
          backLabel="Back to treatments"
          onBookPackage={handleSelectPackageFromModal}
        />
      )}
    </div>
  );
}
