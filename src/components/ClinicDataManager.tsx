import React, { useState, useEffect, useRef } from 'react';
import { 
  getClinicData, 
  updateClinicData,
  saveClinicDataToFile, 
  resetClinicDataToDefault,
  uploadAssetFile,
  uploadClinicSlotAsset
} from '../lib/adminStore';
import {
  getClinicSlotId,
  getClinicImagePath,
  resolveClinicImageSrc,
  handleClinicImageError,
  normalizeClinicSlotId
} from '../utils/clinicImageHelper';
import { LogoOutlineSkeleton } from './common/LogoOutlineSkeleton';
import { 
  ClinicData, 
  ClinicLocation, 
  ClinicWhyChooseUsPillar, 
  ClinicAwardItem,
  ClinicConsultationDoctor,
  ClinicConsultationConfig,
  ClinicProcessStep,
  ClinicProcessSection,
  ClinicFacilityRoomItem,
  ClinicFacilityGallerySection,
  ClinicTrustBrandItem,
  ClinicTrustBrandsSection,
  ClinicAccreditationsSection
} from '../data/clinicInfo';

const DAY_LABELS: { day: number; short: string }[] = [
  { day: 1, short: 'Mon' },
  { day: 2, short: 'Tue' },
  { day: 3, short: 'Wed' },
  { day: 4, short: 'Thu' },
  { day: 5, short: 'Fri' },
  { day: 6, short: 'Sat' },
  { day: 0, short: 'Sun' },
];

export interface AdminSlotThumbnailProps {
  src?: string;
  slotId?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  showStatusLabel?: boolean;
  onStatusChange?: (status: 'active' | 'awaiting') => void;
}

/**
 * Module-scoped Admin Thumbnail Component with immediate LogoOutlineSkeleton fallback.
 * Defined at module top-level so parent state updates never unmount/remount thumbnails.
 */
export const AdminSlotThumbnail: React.FC<AdminSlotThumbnailProps> = ({
  src,
  slotId,
  alt,
  className = 'h-14 w-14 shrink-0',
  imgClassName = 'w-full h-full object-cover',
  showStatusLabel = false,
  onStatusChange,
}) => {
  const targetUrl = slotId ? resolveClinicImageSrc(slotId, src) : (src || '').trim();
  const [hasError, setHasError] = useState<boolean>(!targetUrl);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;
  const lastReportedStatusRef = useRef<'active' | 'awaiting' | null>(null);

  const reportStatus = (nextStatus: 'active' | 'awaiting') => {
    if (lastReportedStatusRef.current !== nextStatus) {
      lastReportedStatusRef.current = nextStatus;
      onStatusChangeRef.current?.(nextStatus);
    }
  };

  useEffect(() => {
    const isBlank = !targetUrl || targetUrl.trim() === '';
    if (isBlank) {
      setHasError(true);
      setIsLoaded(false);
      reportStatus('awaiting');
      return;
    }

    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setHasError(false);
      setIsLoaded(true);
      reportStatus('active');
    } else {
      setHasError(false);
      setIsLoaded(false);
    }
  }, [targetUrl]);

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
    reportStatus('awaiting');
  };

  return (
    <div
      className={`relative overflow-hidden rounded-lg border flex items-center justify-center select-none ${
        hasError
          ? 'border-amber-400/80 bg-gradient-to-b from-[#141b24] to-[#0a0e13]'
          : 'border-slate-200 bg-slate-100'
      } ${className}`}
    >
      {hasError ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center bg-gradient-to-b from-[#141b24] to-[#0a0e13] relative z-0">
          <LogoOutlineSkeleton size="xs" variant="gold" animate={false} />
          {showStatusLabel && (
            <span className="text-[7px] sm:text-[8px] font-bold tracking-wider text-amber-300 uppercase leading-none mt-1">
              Awaiting Upload
            </span>
          )}
        </div>
      ) : (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-900/90 z-0">
              <LogoOutlineSkeleton size="xs" variant="gold" animate={true} />
            </div>
          )}
          <img
            ref={imgRef}
            src={targetUrl}
            alt={alt}
            className={`${imgClassName} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            onLoad={() => {
              setIsLoaded(true);
              setHasError(false);
              reportStatus('active');
            }}
            onError={handleError}
          />
        </>
      )}
    </div>
  );
};

export interface AdminSlotImageFieldPreviewProps {
  value?: string;
  slotId?: string;
  label: string;
}

export const AdminSlotImageFieldPreview: React.FC<AdminSlotImageFieldPreviewProps> = ({
  value,
  slotId,
  label,
}) => {
  const hasValue = Boolean(value && value.trim());
  const [status, setStatus] = useState<'active' | 'awaiting'>(hasValue ? 'active' : 'awaiting');

  useEffect(() => {
    if (!hasValue) {
      setStatus('awaiting');
    }
  }, [hasValue]);

  return (
    <div className="mt-1.5 flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
      <AdminSlotThumbnail
        src={value}
        slotId={slotId}
        alt={label}
        className="h-14 w-14 shrink-0"
        showStatusLabel={false}
        onStatusChange={setStatus}
      />
      <div className="flex-1 min-w-0 text-xs">
        <span className="font-mono text-slate-700 font-bold block truncate">
          {hasValue ? value : (slotId ? `No file uploaded for ${slotId}.webp` : 'No file chosen')}
        </span>
        {slotId && (
          <span className="font-mono text-[10px] text-slate-500 block truncate">
            Permanent Slot: /assets/{slotId}.webp
          </span>
        )}
        <div className="mt-1">
          {status === 'active' && hasValue ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Asset Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              Awaiting Upload
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ClinicDataManager() {
  const [data, setData] = useState<ClinicData>(getClinicData());
  const dataRef = useRef<ClinicData>(data);
  dataRef.current = data;

  const [activeMenuOption, setActiveMenuOption] = useState<
    | 'all'
    | 'brand'
    | 'assets'
    | 'contact'
    | 'commercial'
    | 'accreditations'
    | 'locations'
    | 'socials'
    | 'whyChooseUs'
    | 'awards'
    | 'consultation'
    | 'process'
    | 'trustBrands'
    | 'code'
  >('all');
  
  const [saveStatus, setSaveStatus] = useState<{
    state: 'idle' | 'saving' | 'saved' | 'error';
    message?: string;
  }>({ state: 'idle' });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadCallbackRef = useRef<((url: string, fileName?: string) => void | Promise<void>) | null>(null);
  const uploadPreviousUrlRef = useRef<string | undefined>(undefined);
  const uploadSlotIdRef = useRef<string | undefined>(undefined);

  /**
   * Immediately updates React state, localStorage/adminStore, and persists to src/data/clinicInfo.ts & siteCustomizations.json
   */
  const persistClinicDataImmediately = async (nextData: ClinicData, customSuccessMsg?: string) => {
    dataRef.current = nextData;
    setData(nextData);
    updateClinicData(nextData);
    setSaveStatus({ state: 'saving', message: 'Saving changes to src/data/clinicInfo.ts...' });
    try {
      const res = await saveClinicDataToFile(nextData);
      if (res.success) {
        setHasUnsavedChanges(false);
        setSaveStatus({
          state: 'saved',
          message: customSuccessMsg || 'Saved & persisted to src/data/clinicInfo.ts and siteCustomizations.json!',
        });
      } else {
        setHasUnsavedChanges(true);
        setSaveStatus({
          state: 'error',
          message: res.error || 'Updated local store, but failed to write to clinicInfo.ts on disk',
        });
      }
    } catch (err) {
      setHasUnsavedChanges(true);
      setSaveStatus({
        state: 'error',
        message: `Save error: ${String(err)}`,
      });
    }
  };

  // Trigger file upload and callback (passing slotId and previousUrl when replacing an existing image)
  const triggerImageUpload = (
    callback: (url: string, fileName?: string) => void | Promise<void>,
    targetName: string,
    previousUrl?: string,
    slotId?: string
  ) => {
    uploadCallbackRef.current = callback;
    uploadPreviousUrlRef.current = previousUrl?.trim() || undefined;
    uploadSlotIdRef.current = slotId?.trim() || undefined;
    setUploadingTarget(targetName);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadCallbackRef.current) return;
    
    const prevUrl = uploadPreviousUrlRef.current;
    const slotId = uploadSlotIdRef.current;
    setSaveStatus({ state: 'saving', message: `Uploading ${file.name} to assets...` });
    try {
      const res = await uploadAssetFile(file, prevUrl, {
        slotId,
        convertToWebp: true,
      });
      if (res.success && res.url) {
        await Promise.resolve(uploadCallbackRef.current(res.url, file.name));
      } else {
        setSaveStatus({ state: 'error', message: res.error || 'Failed to upload image file' });
      }
    } catch (err) {
      setSaveStatus({ state: 'error', message: `Upload error: ${String(err)}` });
    } finally {
      setUploadingTarget(null);
      uploadPreviousUrlRef.current = undefined;
      uploadSlotIdRef.current = undefined;
    }
  };

  // Bottom Modal State (for mobile screens and quick item edit)
  const [modalType, setModalType] = useState<
    | null
    | 'location'
    | 'pillar'
    | 'award'
    | 'doctor'
    | 'facilityRoom'
    | 'processStep'
    | 'trustBrand'
    | 'keywords'
    | 'accreditations'
    | 'payments'
    | 'specialties'
    | 'languages'
    | 'interiorPhotos'
  >(null);
  const [editingLocationIndex, setEditingLocationIndex] = useState<number | null>(null);
  const [locationDraft, setLocationDraft] = useState<ClinicLocation | null>(null);
  const [editingPillarIndex, setEditingPillarIndex] = useState<number | null>(null);
  const [pillarDraft, setPillarDraft] = useState<ClinicWhyChooseUsPillar | null>(null);
  const [editingAwardIndex, setEditingAwardIndex] = useState<number | null>(null);
  const [awardDraft, setAwardDraft] = useState<ClinicAwardItem | null>(null);
  const [editingDoctorIndex, setEditingDoctorIndex] = useState<number | null>(null);
  const [doctorDraft, setDoctorDraft] = useState<ClinicConsultationDoctor | null>(null);
  const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null);
  const [roomDraft, setRoomDraft] = useState<ClinicFacilityRoomItem | null>(null);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [stepDraft, setStepDraft] = useState<ClinicProcessStep | null>(null);
  const [newStepKeywordInput, setNewStepKeywordInput] = useState('');
  const [editingBrandIndex, setEditingBrandIndex] = useState<number | null>(null);
  const [brandDraft, setBrandDraft] = useState<ClinicTrustBrandItem | null>(null);
  const [seoInputDrafts, setSeoInputDrafts] = useState<Record<string, string>>({});
  const [newDoctorTimeSlot, setNewDoctorTimeSlot] = useState('');
  const [newDefaultTimeSlot, setNewDefaultTimeSlot] = useState('');
  const [newBestTimeLabel, setNewBestTimeLabel] = useState('');
  const [newHearAboutLabel, setNewHearAboutLabel] = useState('');
  const [arrayDraft, setArrayDraft] = useState<string[]>([]);
  const [newArrayItem, setNewArrayItem] = useState('');

  // In-app confirmation dialog state (avoiding window.confirm which is blocked in iframes)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Initial load
  useEffect(() => {
    const initial = getClinicData();
    dataRef.current = initial;
    setData(initial);
  }, []);

  const updateField = <K extends keyof ClinicData>(key: K, value: ClinicData[K]) => {
    setData(prev => {
      const next = { ...prev, [key]: value };
      dataRef.current = next;
      return next;
    });
    setHasUnsavedChanges(true);
    setSaveStatus({ state: 'idle' });
  };

  const updateNestedField = (parent: 'logo' | 'socials', field: string, value: string) => {
    setData(prev => {
      const next = {
        ...prev,
        [parent]: {
          ...(prev[parent] as any),
          [field]: value
        }
      };
      dataRef.current = next;
      return next;
    });
    setHasUnsavedChanges(true);
    setSaveStatus({ state: 'idle' });
  };

  const updateWhyChooseUsHeader = (field: 'heading' | 'subheading', value: string) => {
    setData(prev => {
      const next = {
        ...prev,
        whyChooseUs: {
          heading: prev.whyChooseUs?.heading || 'Why choose Age Reversal Clinic London?',
          subheading: prev.whyChooseUs?.subheading || '',
          pillars: prev.whyChooseUs?.pillars || [],
          [field]: value
        }
      };
      dataRef.current = next;
      return next;
    });
    setHasUnsavedChanges(true);
    setSaveStatus({ state: 'idle' });
  };

  const updateAwardsHeader = (field: 'heading' | 'subheading', value: string) => {
    setData(prev => {
      const next = {
        ...prev,
        awardsShowcase: {
          heading: prev.awardsShowcase?.heading || 'Awards & Recognition',
          subheading: prev.awardsShowcase?.subheading || '',
          awards: prev.awardsShowcase?.awards || [],
          [field]: value
        }
      };
      dataRef.current = next;
      return next;
    });
    setHasUnsavedChanges(true);
    setSaveStatus({ state: 'idle' });
  };

  const getSafeConsultationConfig = (source?: ClinicConsultationConfig): ClinicConsultationConfig => ({
    heading: source?.heading ?? 'Book a Preferred Consultation',
    subheading: source?.subheading ?? 'Schedule your bespoke clinical assessment with our aesthetic specialists.',
    specialistLabel: source?.specialistLabel ?? 'Preferred Specialist',
    doctors: Array.isArray(source?.doctors) ? source.doctors : [],
    defaultTimeSlots: Array.isArray(source?.defaultTimeSlots) ? source.defaultTimeSlots : ['09:30', '11:00', '14:00', '16:00'],
    bestTimeOptions: Array.isArray(source?.bestTimeOptions) ? source.bestTimeOptions : [],
    hearAboutUsOptions: Array.isArray(source?.hearAboutUsOptions) ? source.hearAboutUsOptions : [],
    stayInTouchChannels: Array.isArray(source?.stayInTouchChannels) ? source.stayInTouchChannels : [],
  });

  const updateConsultationConfig = (updater: (curr: ClinicConsultationConfig) => ClinicConsultationConfig) => {
    setData(prev => {
      const nextConfig = updater(getSafeConsultationConfig(prev.consultationConfig));
      const next = {
        ...prev,
        consultationConfig: nextConfig
      };
      dataRef.current = next;
      return next;
    });
    setHasUnsavedChanges(true);
    setSaveStatus({ state: 'idle' });
  };

  // Facility Gallery Section helper
  const getSafeFacilityGallery = (source?: ClinicFacilityGallerySection, fallbackPhotos?: string[]): ClinicFacilityGallerySection => {
    const defaultRooms: ClinicFacilityRoomItem[] =
      Array.isArray(source?.rooms) && source.rooms.length > 0
        ? source.rooms
        : (fallbackPhotos || []).map((img, i) => ({
            id: `facility-room-${i + 1}`,
            title: `Clinical Suite ${i + 1}`,
            tag: 'CLINIC SUITE',
            image: img,
            imageAlt: `Clinic Suite ${i + 1} at Age Reversal Clinics London`,
          }));
    return {
      eyebrow: source?.eyebrow ?? 'Our Facility',
      heading: source?.heading ?? 'Clinic Gallery',
      seoKeywords: Array.isArray(source?.seoKeywords) ? source.seoKeywords : [],
      rooms: defaultRooms,
    };
  };

  const updateFacilityGallery = (updater: (curr: ClinicFacilityGallerySection) => ClinicFacilityGallerySection) => {
    setData(prev => {
      const nextGallery = updater(getSafeFacilityGallery(prev.facilityGallery, prev.interiorPhotos));
      const next = {
        ...prev,
        facilityGallery: nextGallery,
      };
      dataRef.current = next;
      return next;
    });
    setHasUnsavedChanges(true);
    setSaveStatus({ state: 'idle' });
  };

  // Accreditations Section helper
  const getSafeAccreditationsSection = (source?: ClinicAccreditationsSection): ClinicAccreditationsSection => ({
    eyebrow: source?.eyebrow ?? 'Accreditations & Certifications',
    heading: source?.heading ?? 'Excellence guaranteed. Trusted globally.',
    description:
      source?.description ??
      'We adhere to the highest international medical standards. Our facilities and practitioners are rigorously vetted by leading global dermatological and healthcare authorities.',
    seoKeywords: Array.isArray(source?.seoKeywords) ? source.seoKeywords : [],
  });

  const updateAccreditationsSection = (updater: (curr: ClinicAccreditationsSection) => ClinicAccreditationsSection) => {
    setData(prev => {
      const next = {
        ...prev,
        accreditationsSection: updater(getSafeAccreditationsSection(prev.accreditationsSection)),
      };
      dataRef.current = next;
      return next;
    });
    setHasUnsavedChanges(true);
    setSaveStatus({ state: 'idle' });
  };

  // Our Process Section helper
  const getSafeProcessSection = (source?: ClinicProcessSection): ClinicProcessSection => ({
    eyebrow: source?.eyebrow ?? 'Our Process',
    heading: source?.heading ?? 'The Journey to Radiance',
    subheading:
      source?.subheading ??
      'From initial diagnostic skin mapping to bespoke clinical protocols and ongoing regenerative care.',
    seoKeywords: Array.isArray(source?.seoKeywords) ? source.seoKeywords : [],
    steps: Array.isArray(source?.steps) ? source.steps : [],
  });

  const updateProcessSection = (updater: (curr: ClinicProcessSection) => ClinicProcessSection) => {
    setData(prev => {
      const next = {
        ...prev,
        processSection: updater(getSafeProcessSection(prev.processSection)),
      };
      dataRef.current = next;
      return next;
    });
    setHasUnsavedChanges(true);
    setSaveStatus({ state: 'idle' });
  };

  // Trust Brands Section helper
  const getSafeTrustBrandsSection = (source?: ClinicTrustBrandsSection): ClinicTrustBrandsSection => ({
    heading: source?.heading ?? 'Over 1,000+ Brands & Laboratories Trust Us',
    seoKeywords: Array.isArray(source?.seoKeywords) ? source.seoKeywords : [],
    brands: Array.isArray(source?.brands) ? source.brands : [],
  });

  const updateTrustBrandsSection = (updater: (curr: ClinicTrustBrandsSection) => ClinicTrustBrandsSection) => {
    setData(prev => {
      const next = {
        ...prev,
        trustBrandsSection: updater(getSafeTrustBrandsSection(prev.trustBrandsSection)),
      };
      dataRef.current = next;
      return next;
    });
    setHasUnsavedChanges(true);
    setSaveStatus({ state: 'idle' });
  };

  const handleSaveToFile = async () => {
    await persistClinicDataImmediately(
      dataRef.current,
      'Saved to src/data/clinicInfo.ts & siteCustomizations.json successfully!'
    );
  };

  const handleResetToDefault = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset to Factory Defaults',
      message: 'Are you sure you want to restore all clinic data to default original settings? This will clear custom clinic locations, contacts, and assets.',
      onConfirm: () => {
        const def = resetClinicDataToDefault();
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        void persistClinicDataImmediately(def, 'Restored clinic data to factory defaults!');
      }
    });
  };

  // Location management
  const openEditLocationModal = (index: number) => {
    setEditingLocationIndex(index);
    setLocationDraft({ ...data.locations[index] });
    setModalType('location');
  };

  const openNewLocationModal = () => {
    const newLocId = `location-${Date.now()}`;
    setEditingLocationIndex(null);
    setLocationDraft({
      id: newLocId,
      name: '',
      address: '',
      city: 'London',
      postalCode: '',
      country: 'United Kingdom',
      phone: data.phone || '',
      hours: 'Mon – Fri: 09:00 – 18:00',
      directionsUrl: '',
      latitude: 51.5173,
      longitude: -0.1472,
      parkingAvailable: true,
      wheelchairAccessible: true,
      image: '',
      imageAlt: ''
    });
    setModalType('location');
  };

  const saveLocationDraft = () => {
    if (!locationDraft) return;
    const currentLocations = [...(dataRef.current.locations || [])];
    const locId = locationDraft.id || `location-${Date.now()}`;
    const normalizedDraft: ClinicLocation = {
      ...locationDraft,
      id: locId,
      image: (locationDraft.image ?? '').trim(),
    };
    if (editingLocationIndex !== null && editingLocationIndex >= 0) {
      currentLocations[editingLocationIndex] = normalizedDraft;
    } else {
      currentLocations.push(normalizedDraft);
    }
    const nextData: ClinicData = {
      ...dataRef.current,
      locations: currentLocations,
    };
    setModalType(null);
    setLocationDraft(null);
    void persistClinicDataImmediately(
      nextData,
      `Saved location "${normalizedDraft.name || 'Clinic Location'}" to clinicInfo.ts!`
    );
  };

  const deleteLocation = (index: number) => {
    const locToDelete = data.locations?.[index];
    const locName = locToDelete?.name || `Location #${index + 1}`;
    
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Clinic Location',
      message: `Are you sure you want to delete "${locName}"? Click "Confirm Delete" below to confirm.`,
      onConfirm: () => {
        const currentLocations = [...(dataRef.current.locations || [])].filter((_, idx) => idx !== index);
        const nextData: ClinicData = {
          ...dataRef.current,
          locations: currentLocations,
        };
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        void persistClinicDataImmediately(nextData, `Deleted location "${locName}" and updated clinicInfo.ts!`);
      }
    });
  };

  // Why Choose Us Pillar management
  const openEditPillarModal = (index: number) => {
    const target = data.whyChooseUs?.pillars?.[index];
    if (!target) return;
    setEditingPillarIndex(index);
    setPillarDraft({ ...target });
    setModalType('pillar');
  };

  const openNewPillarModal = () => {
    const nextNum = (data.whyChooseUs?.pillars?.length || 0) + 1;
    const newPillarId = `p${nextNum}`;
    setEditingPillarIndex(null);
    setPillarDraft({
      id: newPillarId,
      title: '',
      description: '',
      iconName: 'Building',
      badge: '',
      imageUrl: ''
    });
    setModalType('pillar');
  };

  const savePillarDraft = () => {
    if (!pillarDraft) return;
    const currentPillars = [...(dataRef.current.whyChooseUs?.pillars || [])];
    const pillarIdx = editingPillarIndex !== null && editingPillarIndex >= 0 ? editingPillarIndex : currentPillars.length;
    const pillarId = pillarDraft.id || `p${pillarIdx + 1}`;
    const normalizedPillar: ClinicWhyChooseUsPillar = {
      ...pillarDraft,
      id: pillarId,
      imageUrl: (pillarDraft.imageUrl ?? '').trim(),
    };
    if (editingPillarIndex !== null && editingPillarIndex >= 0) {
      currentPillars[editingPillarIndex] = normalizedPillar;
    } else {
      currentPillars.push(normalizedPillar);
    }
    const nextData: ClinicData = {
      ...dataRef.current,
      whyChooseUs: {
        heading: dataRef.current.whyChooseUs?.heading || 'Why choose Age Reversal Clinic London?',
        subheading: dataRef.current.whyChooseUs?.subheading || '',
        pillars: currentPillars,
      },
    };
    setModalType(null);
    setPillarDraft(null);
    void persistClinicDataImmediately(
      nextData,
      `Saved pillar "${normalizedPillar.title || 'Why Choose Us Pillar'}" to clinicInfo.ts!`
    );
  };

  const deletePillar = (index: number) => {
    const item = data.whyChooseUs?.pillars?.[index];
    const itemName = item?.title || `Pillar #${index + 1}`;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Pillar',
      message: `Are you sure you want to delete "${itemName}"?`,
      onConfirm: () => {
        const nextPillars = (dataRef.current.whyChooseUs?.pillars || []).filter((_, idx) => idx !== index);
        const nextData: ClinicData = {
          ...dataRef.current,
          whyChooseUs: {
            heading: dataRef.current.whyChooseUs?.heading || 'Why choose Age Reversal Clinic London?',
            subheading: dataRef.current.whyChooseUs?.subheading || '',
            pillars: nextPillars,
          },
        };
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        void persistClinicDataImmediately(nextData, `Deleted pillar "${itemName}" and updated clinicInfo.ts!`);
      }
    });
  };

  // Awards Showcase management
  const openEditAwardModal = (index: number) => {
    const target = data.awardsShowcase?.awards?.[index];
    if (!target) return;
    const awardId = target.id || `award-${index + 1}`;
    setEditingAwardIndex(index);
    setAwardDraft({
      ...target,
      id: awardId,
      imageUrl: target.imageUrl ?? '',
    });
    setModalType('award');
  };

  const openNewAwardModal = () => {
    const nextIdx = (data.awardsShowcase?.awards?.length || 0) + 1;
    const awardId = `award-${nextIdx}`;
    setEditingAwardIndex(null);
    setAwardDraft({
      id: awardId,
      title: '',
      organization: '',
      year: new Date().getFullYear().toString(),
      imageUrl: ''
    });
    setModalType('award');
  };

  const saveAwardDraft = () => {
    if (!awardDraft) return;
    const currentAwards = [...(dataRef.current.awardsShowcase?.awards || [])];
    const targetIdx =
      editingAwardIndex !== null && editingAwardIndex >= 0
        ? editingAwardIndex
        : currentAwards.length;
    const awardId = awardDraft.id || `award-${targetIdx + 1}`;
    const normalizedAward: ClinicAwardItem = {
      ...awardDraft,
      id: awardId,
      imageUrl: (awardDraft.imageUrl ?? '').trim(),
    };
    if (editingAwardIndex !== null && editingAwardIndex >= 0) {
      currentAwards[editingAwardIndex] = normalizedAward;
    } else {
      currentAwards.push(normalizedAward);
    }
    const nextData: ClinicData = {
      ...dataRef.current,
      awardsShowcase: {
        heading: dataRef.current.awardsShowcase?.heading || 'Awards & Recognition',
        subheading: dataRef.current.awardsShowcase?.subheading || '',
        awards: currentAwards,
      },
    };
    setModalType(null);
    setAwardDraft(null);
    void persistClinicDataImmediately(
      nextData,
      `Saved award "${normalizedAward.title || 'Award'}" to clinicInfo.ts!`
    );
  };

  const deleteAward = (index: number) => {
    const item = data.awardsShowcase?.awards?.[index];
    const itemName = item?.title || `Award #${index + 1}`;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Award',
      message: `Are you sure you want to delete "${itemName}"?`,
      onConfirm: () => {
        const nextAwards = (dataRef.current.awardsShowcase?.awards || []).filter((_, idx) => idx !== index);
        const nextData: ClinicData = {
          ...dataRef.current,
          awardsShowcase: {
            heading: dataRef.current.awardsShowcase?.heading || 'Awards & Recognition',
            subheading: dataRef.current.awardsShowcase?.subheading || '',
            awards: nextAwards,
          },
        };
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        void persistClinicDataImmediately(nextData, `Deleted award "${itemName}" and updated clinicInfo.ts!`);
      }
    });
  };

  // Book Consultation — Preferred Specialist management
  const openEditDoctorModal = (index: number) => {
    const target = data.consultationConfig?.doctors?.[index];
    if (!target) return;
    setEditingDoctorIndex(index);
    setDoctorDraft({
      ...target,
      locationIds: [...(target.locationIds || [])],
      availableDays: [...(target.availableDays || [1, 2, 3, 4, 5])],
      timeSlots: [...(target.timeSlots || ['09:30', '11:00', '14:00', '16:00'])],
    });
    setNewDoctorTimeSlot('');
    setModalType('doctor');
  };

  const openNewDoctorModal = () => {
    setEditingDoctorIndex(null);
    setDoctorDraft({
      id: `dr-${Date.now()}`,
      name: '',
      specialty: '',
      locationIds: [],
      availableDays: [1, 2, 3, 4, 5],
      timeSlots: ['09:30', '11:00', '14:00', '16:00'],
    });
    setNewDoctorTimeSlot('');
    setModalType('doctor');
  };

  const saveDoctorDraft = () => {
    if (!doctorDraft || !doctorDraft.name.trim()) return;
    const curr = getSafeConsultationConfig(dataRef.current.consultationConfig);
    const nextDoctors = [...(curr.doctors || [])];
    const normalizedDraft: ClinicConsultationDoctor = {
      ...doctorDraft,
      name: doctorDraft.name.trim(),
      specialty: doctorDraft.specialty?.trim() || '',
    };
    if (editingDoctorIndex !== null && editingDoctorIndex >= 0) {
      nextDoctors[editingDoctorIndex] = normalizedDraft;
    } else {
      nextDoctors.push(normalizedDraft);
    }
    const nextData: ClinicData = {
      ...dataRef.current,
      consultationConfig: {
        ...curr,
        doctors: nextDoctors,
      },
    };
    setModalType(null);
    setDoctorDraft(null);
    void persistClinicDataImmediately(
      nextData,
      `Saved specialist "${normalizedDraft.name}" to clinicInfo.ts!`
    );
  };

  const deleteDoctor = (index: number) => {
    const item = data.consultationConfig?.doctors?.[index];
    const itemName = item?.name || `Specialist #${index + 1}`;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Specialist',
      message: `Are you sure you want to remove "${itemName}" from Book Consultation?`,
      onConfirm: () => {
        const curr = getSafeConsultationConfig(dataRef.current.consultationConfig);
        const nextData: ClinicData = {
          ...dataRef.current,
          consultationConfig: {
            ...curr,
            doctors: (curr.doctors || []).filter((_, idx) => idx !== index),
          },
        };
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        void persistClinicDataImmediately(nextData, `Deleted specialist "${itemName}" and updated clinicInfo.ts!`);
      }
    });
  };

  // Facility Gallery Room management
  const openEditRoomModal = (index: number) => {
    const gallery = getSafeFacilityGallery(data.facilityGallery, data.interiorPhotos);
    const target = gallery.rooms[index];
    if (!target) return;
    setEditingRoomIndex(index);
    setRoomDraft({ ...target });
    setModalType('facilityRoom');
  };

  const openNewRoomModal = () => {
    const nextIdx = (data.facilityGallery?.rooms?.length || 0) + 1;
    const newRoomId = `room-${nextIdx}`;
    setEditingRoomIndex(null);
    setRoomDraft({
      id: newRoomId,
      title: '',
      tag: 'CLINIC SUITE',
      image: '',
      imageAlt: '',
    });
    setModalType('facilityRoom');
  };

  const saveRoomDraft = () => {
    if (!roomDraft) return;
    const curr = getSafeFacilityGallery(dataRef.current.facilityGallery, dataRef.current.interiorPhotos);
    const nextRooms = [...(curr.rooms || [])];
    const roomIdx = editingRoomIndex !== null && editingRoomIndex >= 0 ? editingRoomIndex : nextRooms.length;
    const roomId = roomDraft.id || `room-${roomIdx + 1}`;
    const resolvedTitle =
      roomDraft.title.trim() || `Clinical Suite ${roomIdx + 1}`;
    const normalized: ClinicFacilityRoomItem = {
      ...roomDraft,
      id: roomId,
      title: resolvedTitle,
      tag: roomDraft.tag.trim() || 'CLINIC SUITE',
      image: (roomDraft.image ?? '').trim(),
      imageAlt: roomDraft.imageAlt?.trim() || `${resolvedTitle} at ${dataRef.current.name || 'Age Reversal Clinics'}`,
    };
    if (editingRoomIndex !== null && editingRoomIndex >= 0) {
      nextRooms[editingRoomIndex] = normalized;
    } else {
      nextRooms.push(normalized);
    }
    const nextGallery: ClinicFacilityGallerySection = {
      ...curr,
      rooms: nextRooms,
    };
    const nextData: ClinicData = {
      ...dataRef.current,
      facilityGallery: nextGallery,
    };
    setModalType(null);
    setRoomDraft(null);
    void persistClinicDataImmediately(
      nextData,
      `Saved facility suite "${normalized.title}" to clinicInfo.ts!`
    );
  };

  const deleteRoom = (index: number) => {
    const gallery = getSafeFacilityGallery(data.facilityGallery, data.interiorPhotos);
    const item = gallery.rooms[index];
    const itemName = item?.title || `Room #${index + 1}`;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Facility Room',
      message: `Are you sure you want to remove "${itemName}" from the Clinic Gallery?`,
      onConfirm: () => {
        const curr = getSafeFacilityGallery(dataRef.current.facilityGallery, dataRef.current.interiorPhotos);
        const nextRooms = (curr.rooms || []).filter((_, idx) => idx !== index);
        const nextData: ClinicData = {
          ...dataRef.current,
          facilityGallery: {
            ...curr,
            rooms: nextRooms,
          },
        };
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        void persistClinicDataImmediately(nextData, `Deleted facility suite "${itemName}" and updated clinicInfo.ts!`);
      },
    });
  };

  // Our Process Step management
  const openEditStepModal = (index: number) => {
    const target = data.processSection?.steps?.[index];
    if (!target) return;
    setEditingStepIndex(index);
    setStepDraft({
      ...target,
      seoKeywords: [...(target.seoKeywords || [])],
    });
    setNewStepKeywordInput('');
    setModalType('processStep');
  };

  const openNewStepModal = () => {
    const nextIdx = (data.processSection?.steps?.length || 0) + 1;
    const nextNum = String(nextIdx).padStart(2, '0');
    const newStepId = `step-${nextIdx}`;
    setEditingStepIndex(null);
    setStepDraft({
      id: newStepId,
      stepNumber: nextNum,
      title: '',
      image: '',
      imageAlt: '',
      seoKeywords: [],
    });
    setNewStepKeywordInput('');
    setModalType('processStep');
  };

  const saveStepDraft = () => {
    if (!stepDraft) return;
    const curr = getSafeProcessSection(dataRef.current.processSection);
    const nextSteps = [...(curr.steps || [])];
    const stepIdx = editingStepIndex !== null && editingStepIndex >= 0 ? editingStepIndex : nextSteps.length;
    const resolvedStepNum = stepDraft.stepNumber.trim() || String(stepIdx + 1).padStart(2, '0');
    const resolvedStepId = stepDraft.id || `step-${stepIdx + 1}`;
    const resolvedTitle = stepDraft.title.trim() || `Process Step ${resolvedStepNum}`;
    const normalized: ClinicProcessStep = {
      ...stepDraft,
      id: resolvedStepId,
      stepNumber: resolvedStepNum,
      title: resolvedTitle,
      image: (stepDraft.image ?? '').trim(),
      imageAlt: stepDraft.imageAlt?.trim() || `${resolvedTitle} — ${dataRef.current.name || 'Age Reversal Clinics'}`,
    };
    if (editingStepIndex !== null && editingStepIndex >= 0) {
      nextSteps[editingStepIndex] = normalized;
    } else {
      nextSteps.push(normalized);
    }
    const nextData: ClinicData = {
      ...dataRef.current,
      processSection: {
        ...curr,
        steps: nextSteps,
      },
    };
    setModalType(null);
    setStepDraft(null);
    void persistClinicDataImmediately(
      nextData,
      `Saved process step "${normalized.title}" to clinicInfo.ts!`
    );
  };

  const deleteStep = (index: number) => {
    const item = data.processSection?.steps?.[index];
    const itemName = item?.title || `Step #${index + 1}`;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Process Step',
      message: `Are you sure you want to delete "${itemName}"?`,
      onConfirm: () => {
        const curr = getSafeProcessSection(dataRef.current.processSection);
        const nextData: ClinicData = {
          ...dataRef.current,
          processSection: {
            ...curr,
            steps: (curr.steps || []).filter((_, idx) => idx !== index),
          },
        };
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        void persistClinicDataImmediately(nextData, `Deleted process step "${itemName}" and updated clinicInfo.ts!`);
      },
    });
  };

  // Trust Brands Partner management
  const openEditBrandModal = (index: number) => {
    const target = data.trustBrandsSection?.brands?.[index];
    if (!target) return;
    const brandId = target.id || `bp-${index + 1}`;
    setEditingBrandIndex(index);
    setBrandDraft({
      ...target,
      id: brandId,
      imageUrl: target.imageUrl ?? '',
    });
    setModalType('trustBrand');
  };

  const openNewBrandModal = () => {
    const curr = getSafeTrustBrandsSection(dataRef.current.trustBrandsSection);
    const nextIdx = (curr.brands?.length || 0) + 1;
    const brandId = `bp-${nextIdx}`;
    setEditingBrandIndex(null);
    setBrandDraft({
      id: brandId,
      name: '',
      iconType: 'shield',
      imageUrl: '',
    });
    setModalType('trustBrand');
  };

  const saveBrandDraft = () => {
    if (!brandDraft) return;
    const curr = getSafeTrustBrandsSection(dataRef.current.trustBrandsSection);
    const nextBrands = [...(curr.brands || [])];
    const targetIdx = editingBrandIndex !== null && editingBrandIndex >= 0 ? editingBrandIndex : nextBrands.length;
    const brandId = brandDraft.id || `bp-${targetIdx + 1}`;
    const resolvedName =
      brandDraft.name.trim() || `Partner Brand ${targetIdx + 1}`;
    const normalized: ClinicTrustBrandItem = {
      ...brandDraft,
      id: brandId,
      name: resolvedName,
      iconType: brandDraft.iconType || 'shield',
      imageUrl: (brandDraft.imageUrl ?? '').trim(),
    };
    if (editingBrandIndex !== null && editingBrandIndex >= 0) {
      nextBrands[editingBrandIndex] = normalized;
    } else {
      nextBrands.push(normalized);
    }
    const nextData: ClinicData = {
      ...dataRef.current,
      trustBrandsSection: {
        ...curr,
        brands: nextBrands,
      },
    };
    setModalType(null);
    setBrandDraft(null);
    void persistClinicDataImmediately(
      nextData,
      `Saved brand partner "${normalized.name}" to clinicInfo.ts!`
    );
  };

  const deleteBrand = (index: number) => {
    const item = data.trustBrandsSection?.brands?.[index];
    const itemName = item?.name || `Brand #${index + 1}`;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Brand Partner',
      message: `Are you sure you want to remove "${itemName}"?`,
      onConfirm: () => {
        const curr = getSafeTrustBrandsSection(dataRef.current.trustBrandsSection);
        const nextData: ClinicData = {
          ...dataRef.current,
          trustBrandsSection: {
            ...curr,
            brands: (curr.brands || []).filter((_, idx) => idx !== index),
          },
        };
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        void persistClinicDataImmediately(nextData, `Deleted brand partner "${itemName}" and updated clinicInfo.ts!`);
      },
    });
  };

  // Generic Array edit modal
  const openArrayModal = (
    type: 'keywords' | 'accreditations' | 'payments' | 'specialties' | 'languages' | 'interiorPhotos'
  ) => {
    setModalType(type);
    setNewArrayItem('');
    if (type === 'keywords') setArrayDraft([...(data.brandKeywords || [])]);
    if (type === 'accreditations') setArrayDraft([...(data.accreditations || [])]);
    if (type === 'payments') setArrayDraft([...(data.acceptedPayments || [])]);
    if (type === 'specialties') setArrayDraft([...(data.medicalSpecialties || [])]);
    if (type === 'languages') setArrayDraft([...(data.languagesSpoken || [])]);
    if (type === 'interiorPhotos') setArrayDraft([...(data.interiorPhotos || [])]);
  };

  const addArrayItem = () => {
    const trimmed = newArrayItem.trim();
    if (!trimmed) return;
    setArrayDraft(prev => [...prev, trimmed]);
    setNewArrayItem('');
  };

  const removeArrayItem = (idx: number) => {
    setArrayDraft(prev => prev.filter((_, i) => i !== idx));
  };

  const saveArrayDraft = () => {
    if (!modalType) return;
    let nextData: ClinicData = { ...dataRef.current };
    if (modalType === 'keywords') nextData = { ...nextData, brandKeywords: arrayDraft };
    if (modalType === 'accreditations') nextData = { ...nextData, accreditations: arrayDraft };
    if (modalType === 'payments') nextData = { ...nextData, acceptedPayments: arrayDraft };
    if (modalType === 'specialties') nextData = { ...nextData, medicalSpecialties: arrayDraft };
    if (modalType === 'languages') nextData = { ...nextData, languagesSpoken: arrayDraft };
    if (modalType === 'interiorPhotos') nextData = { ...nextData, interiorPhotos: arrayDraft };
    setModalType(null);
    void persistClinicDataImmediately(nextData, `Saved ${modalType} list to clinicInfo.ts!`);
  };

  /**
   * Reusable Image Asset Field with:
   * 1. Direct text/URL editing
   * 2. "Add Image" file upload button (uploads directly to project assets/images on disk)
   * 3. Live image thumbnail preview with LogoOutlineSkeleton 404 fallback
   * 4. Clear/Remove button
   */
  const renderImageField = (
    label: string, 
    value: string, 
    onChange: (val: string) => void, 
    targetKey: string,
    placeholder: string = '/assets/... or https://...',
    slotId?: string
  ) => {
    const effectiveSlotId = slotId || (
      targetKey === 'logo_icon' ? 'clinic-logo-icon' :
      targetKey === 'logo_full' ? 'clinic-logo-full' :
      targetKey === 'ogImage' ? 'clinic-og-image' :
      targetKey === 'exteriorPhoto' ? 'clinic-exterior' :
      undefined
    );

    const buildNextDataForTarget = (newUrl: string): ClinicData => {
      const curr = dataRef.current;
      if (targetKey === 'logo_icon') {
        return { ...curr, logo: { ...(curr.logo as any), icon: newUrl } };
      }
      if (targetKey === 'logo_full') {
        return { ...curr, logo: { ...(curr.logo as any), full: newUrl } };
      }
      if (targetKey === 'ogImage') {
        return { ...curr, ogImage: newUrl };
      }
      if (targetKey === 'exteriorPhoto') {
        return { ...curr, exteriorPhoto: newUrl };
      }
      return curr;
    };

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase text-slate-700">{label}</label>
          <button
            type="button"
            onClick={() =>
              triggerImageUpload(
                async (newUrl, fileName) => {
                  onChange(newUrl);
                  const nextData = buildNextDataForTarget(newUrl);
                  await persistClinicDataImmediately(
                    nextData,
                    `Uploaded "${fileName || label}" & saved permanently to ${newUrl}!`
                  );
                },
                targetKey,
                value,
                effectiveSlotId
              )
            }
            disabled={uploadingTarget === targetKey}
            className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#003334] text-white hover:bg-[#002627] rounded cursor-pointer transition-colors disabled:opacity-50"
          >
            {uploadingTarget === targetKey ? 'Uploading...' : '+ Add Image File'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                const nextData = buildNextDataForTarget('');
                void persistClinicDataImmediately(nextData, `Cleared ${label} and updated clinicInfo.ts!`);
              }}
              className="px-2 py-2 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer"
              title="Clear Image"
            >
              Clear
            </button>
          )}
        </div>

        {(value || effectiveSlotId) && (
          <AdminSlotImageFieldPreview
            value={value}
            slotId={effectiveSlotId}
            label={label}
          />
        )}
      </div>
    );
  };

  // Compact Reusable SEO Keywords Chip Editor
  const renderSeoKeywordsEditor = (
    label: string,
    keywords: string[],
    onChange: (next: string[]) => void,
    draftKey: string,
    placeholder: string = 'Add SEO keyword...'
  ) => {
    const currentInput = seoInputDrafts[draftKey] || '';
    const handleAdd = () => {
      const trimmed = currentInput.trim();
      if (!trimmed) return;
      if (!keywords.includes(trimmed)) {
        onChange([...keywords, trimmed]);
      }
      setSeoInputDrafts(prev => ({ ...prev, [draftKey]: '' }));
    };

    return (
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase text-slate-700">
            {label} ({keywords.length})
          </label>
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <input
              type="text"
              value={currentInput}
              onChange={e => setSeoInputDrafts(prev => ({ ...prev, [draftKey]: e.target.value }))}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              placeholder={placeholder}
              className="flex-1 sm:w-56 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#003334]"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="px-2.5 py-1 bg-[#003334] hover:bg-[#002627] text-white text-[11px] font-bold uppercase rounded-lg cursor-pointer shrink-0"
            >
              + Add
            </button>
          </div>
        </div>
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw, idx) => (
              <span
                key={`${kw}-${idx}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-teal-50/70 border border-teal-200 rounded-md text-xs font-medium text-[#003334]"
              >
                {kw}
                <button
                  type="button"
                  onClick={() => onChange(keywords.filter((_, i) => i !== idx))}
                  className="text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                  title="Remove keyword"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 pb-28">
      {/* Hidden File Input for Image Uploads */}
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileUploadChange} 
      />

      {/* 1. TOP STICKY BAR: MENU OPTIONS & ACTIONS */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs px-4 sm:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase font-bold tracking-widest text-[#003334]">
              Data File Editor
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#003334]">
              Clinic Master Data (src/data/clinicInfo.ts)
            </h1>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              Target: src/data/clinicInfo.ts &middot; {hasUnsavedChanges ? '[Unsaved Changes]' : '[Synced with Disk]'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleResetToDefault}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
            >
              Reset to Default
            </button>
            <button
              onClick={() => {
                setData(getClinicData());
                setHasUnsavedChanges(false);
                setSaveStatus({ state: 'idle' });
              }}
              disabled={!hasUnsavedChanges}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg cursor-pointer transition-colors"
            >
              Discard Edits
            </button>
            <button
              onClick={handleSaveToFile}
              disabled={saveStatus.state === 'saving'}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#003334] hover:bg-[#002627] active:scale-95 disabled:opacity-50 rounded-lg cursor-pointer transition-all shadow-sm"
            >
              {saveStatus.state === 'saving' ? 'Writing to Disk...' : 'Save to clinicInfo.ts'}
            </button>
          </div>
        </div>

        {/* Status banner */}
        {saveStatus.message && (
          <div className={`mt-3 py-2 px-3 rounded-lg text-xs font-medium ${
            saveStatus.state === 'saved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
            saveStatus.state === 'error' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
            'bg-teal-50 text-teal-800 border border-teal-200'
          }`}>
            {saveStatus.message}
          </div>
        )}

        {/* 2. MENU OPTIONS SELECTOR BAR */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Sections' },
            { id: 'brand', label: '01. Brand & SEO' },
            { id: 'assets', label: '02. Visual Assets' },
            { id: 'contact', label: '03. Contact Channels' },
            { id: 'commercial', label: '04. Commercial & Google' },
            { id: 'accreditations', label: '05. Accreditations' },
            { id: 'locations', label: `06. Locations (${data.locations?.length || 0})` },
            { id: 'socials', label: '07. Social & Reviews' },
            { id: 'whyChooseUs', label: `08. Why Choose Us (${data.whyChooseUs?.pillars?.length || 0})` },
            { id: 'awards', label: `09. Awards Showcase (${data.awardsShowcase?.awards?.length || 0})` },
            { id: 'consultation', label: `10. Book Consultation (${data.consultationConfig?.doctors?.length || 0})` },
            { id: 'process', label: `11. Our Process (${data.processSection?.steps?.length || 0})` },
            { id: 'trustBrands', label: `12. Trust Brands (${data.trustBrandsSection?.brands?.length || 0})` },
            { id: 'code', label: '13. Raw Code Preview' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setActiveMenuOption(opt.id as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                activeMenuOption === opt.id
                  ? 'bg-[#003334] text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. OUTER SECTIONS SITTING DIRECTLY ON THE PAGE */}
      <div className="w-full">

        {/* SECTION 1: CORE BRAND & SEO */}
        {(activeMenuOption === 'all' || activeMenuOption === 'brand') && (
          <section className="w-full border-b border-slate-200 py-8 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                  01 / Configuration
                </span>
                <h2 className="text-xl font-bold text-[#003334]">Core Brand & Google SEO</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono mt-1 sm:mt-0">
                Maps to CLINIC_DATA.name, metaDescription, canonicalUrl
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Clinic Name</label>
                <input
                  type="text"
                  value={data.name || ''}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="e.g. Age Reversal Clinics"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Tagline / Subheading</label>
                <input
                  type="text"
                  value={data.tagline || ''}
                  onChange={e => updateField('tagline', e.target.value)}
                  placeholder="e.g. Premier Medical, Surgical & Cosmetic Dermatology"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Canonical Website URL</label>
                <input
                  type="text"
                  value={data.canonicalUrl || ''}
                  onChange={e => updateField('canonicalUrl', e.target.value)}
                  placeholder="https://agereversalclinics.com"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Google SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={data.metaDescription || ''}
                  onChange={e => updateField('metaDescription', e.target.value)}
                  placeholder="Meta description for search engine listings..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>

              {renderImageField(
                'Social Share Image (OG Image)',
                data.ogImage || '',
                (val) => updateField('ogImage', val),
                'ogImage',
                '/assets/clinic-og-image.webp or image URL',
                'clinic-og-image'
              )}

              {/* Brand Keywords */}
              <div className="col-span-full space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-slate-700">
                    Brand Keywords ({data.brandKeywords?.length || 0})
                  </label>
                  <button
                    onClick={() => openArrayModal('keywords')}
                    className="px-2.5 py-1 text-xs font-bold uppercase bg-slate-200 hover:bg-slate-300 rounded text-slate-800 cursor-pointer"
                  >
                    Edit Keywords List
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(data.brandKeywords || []).map((kw, i) => (
                    <span key={i} className="inline-block px-2.5 py-1 text-xs bg-slate-200 text-slate-800 rounded font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: BRAND VISUAL ASSETS & CLINIC GALLERY */}
        {(activeMenuOption === 'all' || activeMenuOption === 'assets') && (() => {
          const activeFacilityGallery = getSafeFacilityGallery(data.facilityGallery, data.interiorPhotos);
          return (
            <section className="w-full border-b border-slate-200 py-8 px-4 sm:px-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                    02 / Configuration
                  </span>
                  <h2 className="text-xl font-bold text-[#003334]">Brand Visual Assets & Clinic Gallery</h2>
                </div>
                <span className="text-xs text-slate-500 font-mono mt-1 sm:mt-0">
                  Maps to logo, exteriorPhoto, facilityGallery &amp; interiorPhotos
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderImageField(
                  'Logo Icon Asset',
                  data.logo?.icon || '',
                  (val) => updateNestedField('logo', 'icon', val),
                  'logo_icon',
                  '/assets/clinic-logo-icon.webp or image URL',
                  'clinic-logo-icon'
                )}

                {renderImageField(
                  'Full Logo Asset',
                  data.logo?.full || '',
                  (val) => updateNestedField('logo', 'full', val),
                  'logo_full',
                  '/assets/clinic-logo-full.webp or image URL',
                  'clinic-logo-full'
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Logo Alt Description</label>
                  <input
                    type="text"
                    value={data.logo?.alt || ''}
                    onChange={e => updateNestedField('logo', 'alt', e.target.value)}
                    placeholder="Age Reversal Clinics Logo"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                  />
                </div>

                <div className="col-span-full md:col-span-1">
                  {renderImageField(
                    'Clinic Exterior Photo',
                    data.exteriorPhoto || '',
                    (val) => updateField('exteriorPhoto', val),
                    'exteriorPhoto',
                    '/assets/clinic-exterior.webp or image URL',
                    'clinic-exterior'
                  )}
                </div>

                <div className="col-span-full md:col-span-2">
                  {renderImageField(
                    'Social Share Image (OG Image)',
                    data.ogImage || '',
                    (val) => updateField('ogImage', val),
                    'ogImage',
                    '/assets/clinic-og-image.webp or image URL',
                    'clinic-og-image'
                  )}
                </div>

                {/* Clinic Interior Photos (CLINIC_DATA.interiorPhotos) */}
                <div className="col-span-full pt-4 border-t border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                        Canonical Interior Slots (/assets/clinic-interior-*.webp)
                      </span>
                      <h3 className="text-sm font-bold text-[#003334]">
                        Clinic Interior Photos ({(data.interiorPhotos || []).length})
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openArrayModal('interiorPhotos')}
                        className="px-3 py-1.5 text-xs font-bold uppercase bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg cursor-pointer"
                      >
                        Manage List
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const currentList = dataRef.current.interiorPhotos || [];
                          const nextIdx = currentList.length;
                          const slotId = getClinicSlotId('interior', nextIdx);
                          triggerImageUpload(
                            async (newUrl, fileName) => {
                              const nextPhotos = [...(dataRef.current.interiorPhotos || []), newUrl];
                              const nextData: ClinicData = {
                                ...dataRef.current,
                                interiorPhotos: nextPhotos,
                              };
                              await persistClinicDataImmediately(
                                nextData,
                                `Uploaded interior photo "${fileName || `#${nextIdx + 1}`}" & saved permanently to ${newUrl}!`
                              );
                            },
                            `interior_photo_add_${nextIdx}`,
                            undefined,
                            slotId
                          );
                        }}
                        disabled={uploadingTarget?.startsWith('interior_photo_')}
                        className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#003334] hover:bg-[#002627] text-white rounded-lg cursor-pointer disabled:opacity-50"
                      >
                        + Add Interior Photo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {(data.interiorPhotos || []).map((photoUrl, idx) => {
                      const slotId = getClinicSlotId('interior', idx);
                      return (
                        <div
                          key={`${slotId}-${idx}`}
                          className="border border-slate-200 bg-white rounded-xl p-2.5 text-xs flex flex-col justify-between hover:border-slate-300 transition-all"
                        >
                          <div>
                            <div className="relative mb-2">
                              <AdminSlotThumbnail
                                src={photoUrl}
                                slotId={slotId}
                                alt={`Clinic Interior ${idx + 1}`}
                                className="w-full h-28"
                                showStatusLabel={true}
                              />
                              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-900/75 text-white text-[9px] font-bold uppercase tracking-wider">
                                INTERIOR #{idx + 1}
                              </span>
                            </div>
                            <div className="font-mono font-bold text-slate-800 text-[11px] truncate">
                              /assets/{slotId}.webp
                            </div>
                            <div className="text-[10px] text-slate-500 truncate mt-0.5" title={photoUrl}>
                              {photoUrl}
                            </div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                triggerImageUpload(
                                  async (newUrl, fileName) => {
                                    const currentPhotos = [...(dataRef.current.interiorPhotos || [])];
                                    currentPhotos[idx] = newUrl;
                                    const nextData: ClinicData = {
                                      ...dataRef.current,
                                      interiorPhotos: currentPhotos,
                                    };
                                    await persistClinicDataImmediately(
                                      nextData,
                                      `Replaced interior photo #${idx + 1} ("${fileName || slotId}") & saved permanently to ${newUrl}!`
                                    );
                                  },
                                  `interior_photo_${idx}`,
                                  photoUrl,
                                  slotId
                                );
                              }}
                              className="text-[10px] uppercase font-bold text-[#003334] hover:underline cursor-pointer"
                            >
                              Replace Img
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const nextPhotos = (dataRef.current.interiorPhotos || []).filter((_, i) => i !== idx);
                                const nextData: ClinicData = {
                                  ...dataRef.current,
                                  interiorPhotos: nextPhotos,
                                };
                                void persistClinicDataImmediately(
                                  nextData,
                                  `Removed interior photo #${idx + 1} and updated clinicInfo.ts!`
                                );
                              }}
                              className="text-[10px] uppercase font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Our Facility — Clinic Gallery Header & SEO */}
                <div className="col-span-full pt-4 border-t border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                        Our Facility — Clinic Gallery
                      </span>
                      <h3 className="text-sm font-bold text-[#003334]">
                        Facility Gallery Suites ({activeFacilityGallery.rooms.length})
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={openNewRoomModal}
                      className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#003334] hover:bg-[#002627] text-white rounded-lg cursor-pointer self-start sm:self-auto"
                    >
                      + Add Gallery Suite
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-700">Gallery Eyebrow</label>
                      <input
                        type="text"
                        value={activeFacilityGallery.eyebrow || ''}
                        onChange={e =>
                          updateFacilityGallery(curr => ({ ...curr, eyebrow: e.target.value }))
                        }
                        placeholder="Our Facility"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-700">Gallery Heading</label>
                      <input
                        type="text"
                        value={activeFacilityGallery.heading || ''}
                        onChange={e =>
                          updateFacilityGallery(curr => ({ ...curr, heading: e.target.value }))
                        }
                        placeholder="Clinic Gallery"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                      />
                    </div>
                  </div>

                  {renderSeoKeywordsEditor(
                    'Facility Gallery SEO Keywords',
                    activeFacilityGallery.seoKeywords || [],
                    (next) => updateFacilityGallery(curr => ({ ...curr, seoKeywords: next })),
                    'facility_seo'
                  )}

                  {/* Gallery Room Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
                    {activeFacilityGallery.rooms.map((room, i) => (
                      <div
                        key={room.id || i}
                        className="border border-slate-200 bg-white rounded-xl p-2.5 text-xs flex flex-col justify-between hover:border-slate-300 transition-all"
                      >
                        <div>
                          <div className="relative mb-2">
                            <AdminSlotThumbnail
                              src={room.image}
                              slotId={getClinicSlotId('facility', room.id || i + 1)}
                              alt={room.imageAlt || room.title}
                              className="w-full h-28"
                              showStatusLabel={true}
                            />
                            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-900/75 text-white text-[9px] font-bold uppercase tracking-wider">
                              {room.tag || 'SUITE'}
                            </span>
                          </div>
                          <div className="font-bold text-slate-900 text-xs truncate">{room.title}</div>
                          <div className="text-[10px] text-slate-500 truncate mt-0.5" title={room.imageAlt || room.image}>
                            {room.imageAlt || room.image}
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditRoomModal(i)}
                              className="px-2 py-1 text-[10px] uppercase font-bold bg-slate-100 hover:bg-slate-200 text-slate-900 rounded cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const roomId = room.id || `room-${i + 1}`;
                                const slotId = getClinicSlotId('facility', roomId);
                                triggerImageUpload(
                                  async (newUrl, fileName) => {
                                    const curr = getSafeFacilityGallery(
                                      dataRef.current.facilityGallery,
                                      dataRef.current.interiorPhotos
                                    );
                                    const nextRooms = curr.rooms.map((r, idx) =>
                                      idx === i ? { ...r, id: roomId, image: newUrl } : r
                                    );
                                    const nextData: ClinicData = {
                                      ...dataRef.current,
                                      facilityGallery: {
                                        ...curr,
                                        rooms: nextRooms,
                                      },
                                    };
                                    await persistClinicDataImmediately(
                                      nextData,
                                      `Uploaded "${fileName || room.title}" & saved permanently to ${newUrl}!`
                                    );
                                  },
                                  `facility_room_${i}`,
                                  room.image,
                                  slotId
                                );
                              }}
                              className="text-[10px] uppercase font-bold text-[#003334] hover:underline cursor-pointer"
                            >
                              Replace Img
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteRoom(i)}
                            className="text-[10px] uppercase font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* SECTION 3: DIRECT COMMUNICATION CHANNELS */}
        {(activeMenuOption === 'all' || activeMenuOption === 'contact') && (
          <section className="w-full border-b border-slate-200 py-8 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                  03 / Configuration
                </span>
                <h2 className="text-xl font-bold text-[#003334]">Direct Communication Channels</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono mt-1 sm:mt-0">
                Maps to CLINIC_DATA.phone, email, whatsapp, openingHours
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Official Phone Number</label>
                <input
                  type="text"
                  value={data.phone || ''}
                  onChange={e => updateField('phone', e.target.value)}
                  placeholder="+44 20 8857 2000"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Official Contact Email</label>
                <input
                  type="email"
                  value={data.email || ''}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="info@agereversalclinics.com"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">WhatsApp Link or Number</label>
                <input
                  type="text"
                  value={data.whatsapp || ''}
                  onChange={e => updateField('whatsapp', e.target.value)}
                  placeholder="https://wa.me/442088572000"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Opening Hours Summary</label>
                <input
                  type="text"
                  value={data.openingHours || ''}
                  onChange={e => updateField('openingHours', e.target.value)}
                  placeholder="Mon – Fri: 09:00 – 19:00 | Sat: 10:00 – 17:00"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: COMMERCIAL & SEARCH DETAILS (SCHEMA.ORG / GOOGLE) */}
        {(activeMenuOption === 'all' || activeMenuOption === 'commercial') && (
          <section className="w-full border-b border-slate-200 py-8 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                  04 / Configuration
                </span>
                <h2 className="text-xl font-bold text-[#003334]">Commercial & Schema.org Details</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono mt-1 sm:mt-0">
                Maps to priceRange, currency, acceptedPayments, languagesSpoken, medicalSpecialties
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Price Range Tier</label>
                <input
                  type="text"
                  value={data.priceRange || ''}
                  onChange={e => updateField('priceRange', e.target.value)}
                  placeholder="£££"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Currency Code</label>
                <input
                  type="text"
                  value={data.currency || ''}
                  onChange={e => updateField('currency', e.target.value)}
                  placeholder="GBP"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>

              <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Accepted Payments */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-slate-700">
                      Payment Methods ({data.acceptedPayments?.length || 0})
                    </label>
                    <button
                      onClick={() => openArrayModal('payments')}
                      className="px-2 py-0.5 text-xs font-bold uppercase bg-slate-200 hover:bg-slate-300 rounded text-slate-800 cursor-pointer"
                    >
                      Edit List
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(data.acceptedPayments || []).map((p, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-200 text-slate-800 text-xs rounded">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages Spoken */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-slate-700">
                      Languages ({data.languagesSpoken?.length || 0})
                    </label>
                    <button
                      onClick={() => openArrayModal('languages')}
                      className="px-2 py-0.5 text-xs font-bold uppercase bg-slate-200 hover:bg-slate-300 rounded text-slate-800 cursor-pointer"
                    >
                      Edit List
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(data.languagesSpoken || []).map((l, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-200 text-slate-800 text-xs rounded">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Medical Specialties */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-slate-700">
                      Medical Specialties ({data.medicalSpecialties?.length || 0})
                    </label>
                    <button
                      onClick={() => openArrayModal('specialties')}
                      className="px-2 py-0.5 text-xs font-bold uppercase bg-slate-200 hover:bg-slate-300 rounded text-slate-800 cursor-pointer"
                    >
                      Edit List
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(data.medicalSpecialties || []).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-200 text-slate-800 text-xs rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5: CLINICAL ACCREDITATIONS & REGISTRATIONS */}
        {(activeMenuOption === 'all' || activeMenuOption === 'accreditations') && (() => {
          const activeAccSection = getSafeAccreditationsSection(data.accreditationsSection);
          return (
            <section className="w-full border-b border-slate-200 py-8 px-4 sm:px-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                    05 / Configuration
                  </span>
                  <h2 className="text-xl font-bold text-[#003334]">Clinical Accreditations &amp; Certifications</h2>
                </div>
                <span className="text-xs text-slate-500 font-mono mt-1 sm:mt-0">
                  Maps to accreditationsSection, gmcRegistration, cqcStatus, accreditations
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Section Eyebrow</label>
                  <input
                    type="text"
                    value={activeAccSection.eyebrow || ''}
                    onChange={e => updateAccreditationsSection(curr => ({ ...curr, eyebrow: e.target.value }))}
                    placeholder="Accreditations & Certifications"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Section Heading</label>
                  <input
                    type="text"
                    value={activeAccSection.heading || ''}
                    onChange={e => updateAccreditationsSection(curr => ({ ...curr, heading: e.target.value }))}
                    placeholder="Excellence guaranteed. Trusted globally."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                  />
                </div>

                <div className="col-span-full space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Section Description</label>
                  <textarea
                    rows={2}
                    value={activeAccSection.description || ''}
                    onChange={e => updateAccreditationsSection(curr => ({ ...curr, description: e.target.value }))}
                    placeholder="We adhere to the highest international medical standards..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">GMC Registration Statement</label>
                  <input
                    type="text"
                    value={data.gmcRegistration || ''}
                    onChange={e => updateField('gmcRegistration', e.target.value)}
                    placeholder="GMC Certified Medical Specialists"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">CQC Status Statement</label>
                  <input
                    type="text"
                    value={data.cqcStatus || ''}
                    onChange={e => updateField('cqcStatus', e.target.value)}
                    placeholder="CQC Regulated & Compliant Private Facility"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                  />
                </div>

                <div className="col-span-full pt-1">
                  {renderSeoKeywordsEditor(
                    'Accreditations SEO Keywords',
                    activeAccSection.seoKeywords || [],
                    (next) => updateAccreditationsSection(curr => ({ ...curr, seoKeywords: next })),
                    'accreditations_seo'
                  )}
                </div>

                <div className="col-span-full space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-slate-700">
                      Verified Accreditations Checklist ({data.accreditations?.length || 0})
                    </label>
                    <button
                      onClick={() => openArrayModal('accreditations')}
                      className="px-2.5 py-1 text-xs font-bold uppercase bg-slate-200 hover:bg-slate-300 rounded text-slate-800 cursor-pointer"
                    >
                      Edit Accreditations
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(data.accreditations || []).map((acc, i) => (
                      <div key={i} className="px-3 py-2 bg-white border border-slate-200 text-xs text-slate-800 font-medium rounded-lg flex items-center justify-between">
                        <span>{acc}</span>
                        <span className="font-mono text-slate-400">#{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* SECTION 6: CLINIC FACILITIES & LOCATIONS */}
        {(activeMenuOption === 'all' || activeMenuOption === 'locations') && (
          <section className="w-full border-b border-slate-200 py-6 sm:py-8 px-2 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-5 sm:mb-6 pb-2 border-b border-slate-200 px-1 sm:px-0">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                  06 / Configuration
                </span>
                <h2 className="text-xl font-bold text-[#003334]">
                  Clinic Facilities & Locations ({data.locations?.length || 0})
                </h2>
              </div>
              <button
                onClick={openNewLocationModal}
                className="mt-2 sm:mt-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#003334] hover:bg-[#002627] rounded-lg cursor-pointer"
              >
                + Add Location
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {(data.locations || []).map((loc, idx) => (
                <div key={loc.id || idx} className="border border-slate-200 bg-white rounded-xl p-3 sm:p-5 hover:border-slate-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-2.5 sm:pb-3 border-b border-slate-100">
                    <div className="flex items-start gap-2.5 sm:gap-3.5">
                      <AdminSlotThumbnail 
                        src={loc.image} 
                        slotId={getClinicSlotId('location', loc.id || idx + 1)}
                        alt={loc.name} 
                        className="h-12 w-12 sm:h-14 sm:w-14"
                        showStatusLabel={true}
                      />
                      <div>
                        <div className="text-[11px] font-mono font-bold text-[#c5a880] uppercase">
                          Location #{idx + 1} &middot; ID: {loc.id || `loc-${idx + 1}`}
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">{loc.name}</h3>
                        <div className="text-xs text-slate-600 font-medium">
                          {loc.address}, {loc.city} {loc.postalCode}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto pt-1 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => {
                          const locId = loc.id || `location-${idx + 1}`;
                          const slotId = getClinicSlotId('location', locId);
                          triggerImageUpload(
                            async (newUrl, fileName) => {
                              const currentLocations = [...(dataRef.current.locations || [])];
                              currentLocations[idx] = { ...currentLocations[idx], id: locId, image: newUrl };
                              const nextData: ClinicData = {
                                ...dataRef.current,
                                locations: currentLocations,
                              };
                              await persistClinicDataImmediately(
                                nextData,
                                `Uploaded location image "${fileName || loc.name}" & saved permanently to ${newUrl}!`
                              );
                            },
                            `location_card_${idx}`,
                            loc.image,
                            slotId
                          );
                        }}
                        className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold uppercase bg-teal-50 hover:bg-teal-100 text-[#003334] rounded-lg cursor-pointer"
                      >
                        Replace Img
                      </button>
                      <button
                        onClick={() => openEditLocationModal(idx)}
                        className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold uppercase bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg cursor-pointer"
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={() => deleteLocation(idx)}
                        className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold uppercase bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-2.5 sm:mt-3 text-xs text-slate-600">
                    <div>
                      <span className="font-bold text-slate-700 block uppercase text-[10px]">Phone</span>
                      {loc.phone || 'N/A'}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block uppercase text-[10px]">Hours</span>
                      {loc.hours || 'N/A'}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block uppercase text-[10px]">Parking</span>
                      {loc.parkingAvailable ? 'Yes' : 'No'}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block uppercase text-[10px]">Wheelchair</span>
                      {loc.wheelchairAccessible ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 7: SOCIAL MEDIA & REVIEWS */}
        {(activeMenuOption === 'all' || activeMenuOption === 'socials') && (
          <section className="w-full border-b border-slate-200 py-8 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                  07 / Configuration
                </span>
                <h2 className="text-xl font-bold text-[#003334]">Social Media Profiles & Reviews</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono mt-1 sm:mt-0">
                Maps to socials (facebook, instagram, twitter, youtube, linkedin) & googleReviewUrl
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Instagram Profile URL</label>
                <input
                  type="text"
                  value={data.socials?.instagram || ''}
                  onChange={e => updateNestedField('socials', 'instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Facebook Page URL</label>
                <input
                  type="text"
                  value={data.socials?.facebook || ''}
                  onChange={e => updateNestedField('socials', 'facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Twitter / X URL</label>
                <input
                  type="text"
                  value={data.socials?.twitter || ''}
                  onChange={e => updateNestedField('socials', 'twitter', e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">YouTube Channel URL</label>
                <input
                  type="text"
                  value={data.socials?.youtube || ''}
                  onChange={e => updateNestedField('socials', 'youtube', e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">LinkedIn Page URL</label>
                <input
                  type="text"
                  value={data.socials?.linkedin || ''}
                  onChange={e => updateNestedField('socials', 'linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>

              <div className="col-span-full md:col-span-2 space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Google Review Direct URL</label>
                <input
                  type="text"
                  value={data.googleReviewUrl || ''}
                  onChange={e => updateField('googleReviewUrl', e.target.value)}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>
            </div>
          </section>
        )}

        {/* SECTION 8: WHY CHOOSE US */}
        {(activeMenuOption === 'all' || activeMenuOption === 'whyChooseUs') && (
          <section className="w-full border-b border-slate-200 py-6 sm:py-8 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                  08 / Configuration
                </span>
                <h2 className="text-xl font-bold text-[#003334]">
                  Why Choose Us ({data.whyChooseUs?.pillars?.length || 0})
                </h2>
              </div>
              <button
                onClick={openNewPillarModal}
                className="mt-2 sm:mt-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#003334] hover:bg-[#002627] rounded-lg cursor-pointer"
              >
                + Add Pillar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Section Heading</label>
                <input
                  type="text"
                  value={data.whyChooseUs?.heading || ''}
                  onChange={e => updateWhyChooseUsHeader('heading', e.target.value)}
                  placeholder="Why choose Age Reversal Clinic London?"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Section Subheading</label>
                <input
                  type="text"
                  value={data.whyChooseUs?.subheading || ''}
                  onChange={e => updateWhyChooseUsHeader('subheading', e.target.value)}
                  placeholder="Experience the pinnacle of clinical aesthetics..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {(data.whyChooseUs?.pillars || []).map((pillar, idx) => (
                <div
                  key={pillar.id || idx}
                  className="border border-slate-200 bg-white rounded-xl p-3.5 flex items-start justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <AdminSlotThumbnail
                      src={pillar.imageUrl}
                      slotId={getClinicSlotId('pillar', pillar.id || idx + 1)}
                      alt={pillar.title}
                      className="h-14 w-14"
                      showStatusLabel={true}
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono font-bold text-[#c5a880] uppercase truncate">
                        {pillar.badge || `Pillar #${idx + 1}`} &middot; {pillar.iconName || 'Building'}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 truncate">{pillar.title || 'Untitled Pillar'}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{pillar.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const pillarId = pillar.id || `p${idx + 1}`;
                        const slotId = getClinicSlotId('pillar', pillarId);
                        triggerImageUpload(
                          async (newUrl, fileName) => {
                            const currentPillars = [...(dataRef.current.whyChooseUs?.pillars || [])];
                            currentPillars[idx] = { ...currentPillars[idx], id: pillarId, imageUrl: newUrl };
                            const nextData: ClinicData = {
                              ...dataRef.current,
                              whyChooseUs: {
                                heading: dataRef.current.whyChooseUs?.heading || 'Why choose Age Reversal Clinic London?',
                                subheading: dataRef.current.whyChooseUs?.subheading || '',
                                pillars: currentPillars,
                              },
                            };
                            await persistClinicDataImmediately(
                              nextData,
                              `Uploaded pillar image "${fileName || pillar.title}" & saved permanently to ${newUrl}!`
                            );
                          },
                          `pillar_card_${idx}`,
                          pillar.imageUrl,
                          slotId
                        );
                      }}
                      className="px-2.5 py-1 text-xs font-bold uppercase bg-teal-50 hover:bg-teal-100 text-[#003334] rounded-lg cursor-pointer"
                    >
                      Replace Img
                    </button>
                    <button
                      onClick={() => openEditPillarModal(idx)}
                      className="px-2.5 py-1 text-xs font-bold uppercase bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePillar(idx)}
                      className="px-2.5 py-1 text-xs font-bold uppercase bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 9: AWARDS SHOWCASE */}
        {(activeMenuOption === 'all' || activeMenuOption === 'awards') && (
          <section className="w-full border-b border-slate-200 py-6 sm:py-8 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                  09 / Configuration
                </span>
                <h2 className="text-xl font-bold text-[#003334]">
                  Awards Showcase ({data.awardsShowcase?.awards?.length || 0})
                </h2>
              </div>
              <button
                onClick={openNewAwardModal}
                className="mt-2 sm:mt-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#003334] hover:bg-[#002627] rounded-lg cursor-pointer"
              >
                + Add Award
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Section Heading</label>
                <input
                  type="text"
                  value={data.awardsShowcase?.heading || ''}
                  onChange={e => updateAwardsHeader('heading', e.target.value)}
                  placeholder="Awards & Recognition"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Section Subheading</label>
                <input
                  type="text"
                  value={data.awardsShowcase?.subheading || ''}
                  onChange={e => updateAwardsHeader('subheading', e.target.value)}
                  placeholder="Recognized nationally and globally..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {(data.awardsShowcase?.awards || []).map((award, idx) => (
                <div
                  key={award.id || idx}
                  className="border border-slate-200 bg-white rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AdminSlotThumbnail
                      src={award.imageUrl}
                      slotId={getClinicSlotId('award', award.id || idx + 1)}
                      alt={award.title}
                      className="h-14 w-14"
                      showStatusLabel={true}
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono font-bold text-[#c5a880] uppercase truncate">
                        {award.year || 'Year'} &middot; {award.organization || 'Organization'}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 truncate">{award.title || 'Untitled Award'}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const awardId = award.id || `award-${idx + 1}`;
                        const slotId = getClinicSlotId('award', awardId);
                        triggerImageUpload(
                          async (newUrl, fileName) => {
                            const currentAwards = [...(dataRef.current.awardsShowcase?.awards || [])];
                            currentAwards[idx] = { ...currentAwards[idx], id: awardId, imageUrl: newUrl };
                            const nextData: ClinicData = {
                              ...dataRef.current,
                              awardsShowcase: {
                                heading: dataRef.current.awardsShowcase?.heading || 'Awards & Recognition',
                                subheading: dataRef.current.awardsShowcase?.subheading || '',
                                awards: currentAwards,
                              },
                            };
                            await persistClinicDataImmediately(
                              nextData,
                              `Uploaded award image "${fileName || award.title}" & saved permanently to ${newUrl}!`
                            );
                          },
                          `award_card_${idx}`,
                          award.imageUrl,
                          slotId
                        );
                      }}
                      className="px-2.5 py-1 text-xs font-bold uppercase bg-teal-50 hover:bg-teal-100 text-[#003334] rounded-lg cursor-pointer"
                    >
                      Replace Img
                    </button>
                    <button
                      onClick={() => openEditAwardModal(idx)}
                      className="px-2.5 py-1 text-xs font-bold uppercase bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteAward(idx)}
                      className="px-2.5 py-1 text-xs font-bold uppercase bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 10: BOOK CONSULTATION */}
        {(activeMenuOption === 'all' || activeMenuOption === 'consultation') && (
          <section className="w-full border-b border-slate-200 py-6 sm:py-8 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                  10 / Configuration
                </span>
                <h2 className="text-xl font-bold text-[#003334]">
                  Book Consultation ({data.consultationConfig?.doctors?.length || 0} Specialists)
                </h2>
              </div>
              <button
                onClick={openNewDoctorModal}
                className="mt-2 sm:mt-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#003334] hover:bg-[#002627] rounded-lg cursor-pointer"
              >
                + Add Specialist
              </button>
            </div>

            {/* Section Heading, Subheading & Preferred Specialist Label */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Section Heading</label>
                <input
                  type="text"
                  value={data.consultationConfig?.heading || ''}
                  onChange={e =>
                    updateConsultationConfig(curr => ({ ...curr, heading: e.target.value }))
                  }
                  placeholder="Book a Preferred Consultation"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Section Subheading</label>
                <input
                  type="text"
                  value={data.consultationConfig?.subheading || ''}
                  onChange={e =>
                    updateConsultationConfig(curr => ({ ...curr, subheading: e.target.value }))
                  }
                  placeholder="Schedule your bespoke clinical assessment..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-700">Specialist Field Label</label>
                <input
                  type="text"
                  value={data.consultationConfig?.specialistLabel ?? 'Preferred Specialist'}
                  onChange={e =>
                    updateConsultationConfig(curr => ({ ...curr, specialistLabel: e.target.value }))
                  }
                  placeholder="Preferred Specialist"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                />
              </div>
            </div>

            {/* 1. Preferred Specialists Cards */}
            <div className="mb-6">
              <div className="text-xs font-bold uppercase text-slate-700 mb-2.5">
                {data.consultationConfig?.specialistLabel || 'Preferred Specialist'}s ({data.consultationConfig?.doctors?.length || 0})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {(data.consultationConfig?.doctors || []).map((doc, idx) => {
                  const assignedLocationNames =
                    Array.isArray(doc.locationIds) && doc.locationIds.length > 0
                      ? doc.locationIds
                          .map(locId => {
                            const match = (data.locations || []).find(l => l.id === locId || l.name === locId);
                            return match ? match.name : null;
                          })
                          .filter(Boolean)
                          .join(' • ') || 'All Locations'
                      : 'All Locations';

                  const dayNames = (doc.availableDays || [])
                    .map(d => DAY_LABELS.find(dl => dl.day === d)?.short)
                    .filter(Boolean)
                    .join(', ');

                  return (
                    <div
                      key={doc.id || idx}
                      className="border border-slate-200 bg-white rounded-xl p-3.5 flex items-start justify-between gap-3 hover:border-slate-300 transition-colors"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="text-[10px] font-mono font-bold text-[#c5a880] uppercase truncate">
                          {doc.specialty || 'Specialist'} &middot; {assignedLocationNames}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h3>
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {dayNames || 'Mon–Sat'}
                          </span>
                          {(doc.timeSlots || []).slice(0, 4).map((slot, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-teal-50 text-[#003334] border border-teal-200"
                            >
                              {slot}
                            </span>
                          ))}
                          {(doc.timeSlots || []).length > 4 && (
                            <span className="text-[10px] font-mono text-slate-500">
                              +{(doc.timeSlots || []).length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => openEditDoctorModal(idx)}
                          className="px-2.5 py-1 text-xs font-bold uppercase bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteDoctor(idx)}
                          className="px-2.5 py-1 text-xs font-bold uppercase bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Default Clinic Time Slots & Stay in Touch Channels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Default Time Slots */}
              <div className="border border-slate-200 bg-white rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-slate-700">
                    Default Time Slots ({data.consultationConfig?.defaultTimeSlots?.length || 0})
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Fallback / Any Specialist</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDefaultTimeSlot}
                    onChange={e => setNewDefaultTimeSlot(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newDefaultTimeSlot.trim()) {
                        e.preventDefault();
                        const slot = newDefaultTimeSlot.trim();
                        updateConsultationConfig(curr => ({
                          ...curr,
                          defaultTimeSlots: Array.from(new Set([...(curr.defaultTimeSlots || []), slot])),
                        }));
                        setNewDefaultTimeSlot('');
                      }
                    }}
                    placeholder="e.g. 10:30 or 15:00"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#003334]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const slot = newDefaultTimeSlot.trim();
                      if (!slot) return;
                      updateConsultationConfig(curr => ({
                        ...curr,
                        defaultTimeSlots: Array.from(new Set([...(curr.defaultTimeSlots || []), slot])),
                      }));
                      setNewDefaultTimeSlot('');
                    }}
                    className="px-3 py-1.5 bg-[#003334] text-white text-xs font-bold uppercase rounded-lg cursor-pointer"
                  >
                    + Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(data.consultationConfig?.defaultTimeSlots || []).map((slot, idx) => (
                    <span
                      key={`${slot}-${idx}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-800"
                    >
                      {slot}
                      <button
                        type="button"
                        onClick={() =>
                          updateConsultationConfig(curr => ({
                            ...curr,
                            defaultTimeSlots: (curr.defaultTimeSlots || []).filter((_, i) => i !== idx),
                          }))
                        }
                        className="text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                        title="Remove slot"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Stay in Touch Channels */}
              <div className="border border-slate-200 bg-white rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-slate-700">
                    Stay in Touch Channels
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Toggle Visible Options</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(data.consultationConfig?.stayInTouchChannels || []).map((channel, idx) => (
                    <div
                      key={channel.id || idx}
                      className={`flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg border text-xs transition-colors ${
                        channel.enabled
                          ? 'bg-teal-50/70 border-[#003334] text-[#003334]'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <label className="flex items-center gap-2 cursor-pointer min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={channel.enabled}
                          onChange={e => {
                            const checked = e.target.checked;
                            updateConsultationConfig(curr => ({
                              ...curr,
                              stayInTouchChannels: (curr.stayInTouchChannels || []).map((ch, i) =>
                                i === idx ? { ...ch, enabled: checked } : ch
                              ),
                            }));
                          }}
                          className="rounded text-[#003334] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={channel.label}
                          onChange={e => {
                            const nextLabel = e.target.value;
                            updateConsultationConfig(curr => ({
                              ...curr,
                              stayInTouchChannels: (curr.stayInTouchChannels || []).map((ch, i) =>
                                i === idx ? { ...ch, label: nextLabel } : ch
                              ),
                            }));
                          }}
                          className="bg-transparent font-bold text-xs w-full focus:outline-none truncate"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Best Time to Reach You & How Did You Hear About Us? */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Best Time to Reach You */}
              <div className="border border-slate-200 bg-white rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-slate-700">
                    Best Time to Reach You ({data.consultationConfig?.bestTimeOptions?.length || 0})
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBestTimeLabel}
                    onChange={e => setNewBestTimeLabel(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newBestTimeLabel.trim()) {
                        e.preventDefault();
                        const label = newBestTimeLabel.trim();
                        const value = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `time-${Date.now()}`;
                        updateConsultationConfig(curr => ({
                          ...curr,
                          bestTimeOptions: [...(curr.bestTimeOptions || []), { value, label }],
                        }));
                        setNewBestTimeLabel('');
                      }
                    }}
                    placeholder="e.g. Weekend (10am - 4pm)"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#003334]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const label = newBestTimeLabel.trim();
                      if (!label) return;
                      const value = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `time-${Date.now()}`;
                      updateConsultationConfig(curr => ({
                        ...curr,
                        bestTimeOptions: [...(curr.bestTimeOptions || []), { value, label }],
                      }));
                      setNewBestTimeLabel('');
                    }}
                    className="px-3 py-1.5 bg-[#003334] text-white text-xs font-bold uppercase rounded-lg cursor-pointer"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-1.5">
                  {(data.consultationConfig?.bestTimeOptions || []).map((opt, idx) => (
                    <div
                      key={opt.value || idx}
                      className="flex items-center justify-between gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <input
                        type="text"
                        value={opt.label}
                        onChange={e => {
                          const nextLabel = e.target.value;
                          updateConsultationConfig(curr => ({
                            ...curr,
                            bestTimeOptions: (curr.bestTimeOptions || []).map((item, i) =>
                              i === idx ? { ...item, label: nextLabel } : item
                            ),
                          }));
                        }}
                        className="flex-1 bg-transparent text-xs font-medium text-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateConsultationConfig(curr => ({
                            ...curr,
                            bestTimeOptions: (curr.bestTimeOptions || []).filter((_, i) => i !== idx),
                          }))
                        }
                        className="text-[11px] font-bold uppercase text-rose-600 hover:text-rose-800 cursor-pointer shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* How Did You Hear About Us? */}
              <div className="border border-slate-200 bg-white rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-slate-700">
                    How Did You Hear About Us? ({data.consultationConfig?.hearAboutUsOptions?.length || 0})
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHearAboutLabel}
                    onChange={e => setNewHearAboutLabel(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newHearAboutLabel.trim()) {
                        e.preventDefault();
                        const label = newHearAboutLabel.trim();
                        const value = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `source-${Date.now()}`;
                        updateConsultationConfig(curr => ({
                          ...curr,
                          hearAboutUsOptions: [...(curr.hearAboutUsOptions || []), { value, label }],
                        }));
                        setNewHearAboutLabel('');
                      }
                    }}
                    placeholder="e.g. Press / Magazine Feature"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#003334]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const label = newHearAboutLabel.trim();
                      if (!label) return;
                      const value = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `source-${Date.now()}`;
                      updateConsultationConfig(curr => ({
                        ...curr,
                        hearAboutUsOptions: [...(curr.hearAboutUsOptions || []), { value, label }],
                      }));
                      setNewHearAboutLabel('');
                    }}
                    className="px-3 py-1.5 bg-[#003334] text-white text-xs font-bold uppercase rounded-lg cursor-pointer"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-1.5">
                  {(data.consultationConfig?.hearAboutUsOptions || []).map((opt, idx) => (
                    <div
                      key={opt.value || idx}
                      className="flex items-center justify-between gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <input
                        type="text"
                        value={opt.label}
                        onChange={e => {
                          const nextLabel = e.target.value;
                          updateConsultationConfig(curr => ({
                            ...curr,
                            hearAboutUsOptions: (curr.hearAboutUsOptions || []).map((item, i) =>
                              i === idx ? { ...item, label: nextLabel } : item
                            ),
                          }));
                        }}
                        className="flex-1 bg-transparent text-xs font-medium text-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateConsultationConfig(curr => ({
                            ...curr,
                            hearAboutUsOptions: (curr.hearAboutUsOptions || []).filter((_, i) => i !== idx),
                          }))
                        }
                        className="text-[11px] font-bold uppercase text-rose-600 hover:text-rose-800 cursor-pointer shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 11: OUR PROCESS (THE JOURNEY TO RADIANCE) */}
        {(activeMenuOption === 'all' || activeMenuOption === 'process') && (() => {
          const activeProcess = getSafeProcessSection(data.processSection);
          return (
            <section className="w-full border-b border-slate-200 py-6 sm:py-8 px-4 sm:px-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                    11 / Configuration
                  </span>
                  <h2 className="text-xl font-bold text-[#003334]">
                    Our Process ({activeProcess.steps.length} Steps)
                  </h2>
                </div>
                <button
                  onClick={openNewStepModal}
                  className="mt-2 sm:mt-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#003334] hover:bg-[#002627] rounded-lg cursor-pointer"
                >
                  + Add Step
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Section Eyebrow</label>
                  <input
                    type="text"
                    value={activeProcess.eyebrow || ''}
                    onChange={e => updateProcessSection(curr => ({ ...curr, eyebrow: e.target.value }))}
                    placeholder="Our Process"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Section Heading</label>
                  <input
                    type="text"
                    value={activeProcess.heading || ''}
                    onChange={e => updateProcessSection(curr => ({ ...curr, heading: e.target.value }))}
                    placeholder="The Journey to Radiance"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Section Subheading</label>
                  <input
                    type="text"
                    value={activeProcess.subheading || ''}
                    onChange={e => updateProcessSection(curr => ({ ...curr, subheading: e.target.value }))}
                    placeholder="From initial diagnostic skin mapping..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                  />
                </div>
              </div>

              <div className="mb-6">
                {renderSeoKeywordsEditor(
                  'Our Process SEO Keywords',
                  activeProcess.seoKeywords || [],
                  (next) => updateProcessSection(curr => ({ ...curr, seoKeywords: next })),
                  'process_seo'
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {activeProcess.steps.map((step, idx) => (
                  <div
                    key={step.id || idx}
                    className="border border-slate-200 bg-white rounded-xl p-3.5 flex flex-col justify-between gap-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <AdminSlotThumbnail
                        src={step.image}
                        slotId={getClinicSlotId('process', step.stepNumber || step.id || idx + 1)}
                        alt={step.imageAlt || step.title}
                        className="h-14 w-14"
                        showStatusLabel={true}
                      />
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono font-bold text-[#c5a880] uppercase">
                          Step {step.stepNumber || String(idx + 1).padStart(2, '0')}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                          {step.title || 'Untitled Step'}
                        </h3>
                        {step.imageAlt && (
                          <div className="text-[10px] text-slate-500 truncate mt-0.5" title={step.imageAlt}>
                            Alt: {step.imageAlt}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-slate-400">
                        {(step.seoKeywords || []).length} SEO tags
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const stepNum = step.stepNumber || String(idx + 1).padStart(2, '0');
                            const stepId = step.id || `step-${idx + 1}`;
                            const slotId = getClinicSlotId('process', stepNum || stepId);
                            triggerImageUpload(
                              async (newUrl, fileName) => {
                                const curr = getSafeProcessSection(dataRef.current.processSection);
                                const nextSteps = curr.steps.map((s, sIdx) =>
                                  sIdx === idx ? { ...s, id: stepId, stepNumber: stepNum, image: newUrl } : s
                                );
                                const nextData: ClinicData = {
                                  ...dataRef.current,
                                  processSection: {
                                    ...curr,
                                    steps: nextSteps,
                                  },
                                };
                                await persistClinicDataImmediately(
                                  nextData,
                                  `Uploaded step image "${fileName || step.title}" & saved permanently to ${newUrl}!`
                                );
                              },
                              `process_step_${idx}`,
                              step.image,
                              slotId
                            );
                          }}
                          className="px-2.5 py-1 text-xs font-bold uppercase bg-teal-50 hover:bg-teal-100 text-[#003334] rounded-lg cursor-pointer"
                        >
                          Upload Image
                        </button>
                        <button
                          onClick={() => openEditStepModal(idx)}
                          className="px-2.5 py-1 text-xs font-bold uppercase bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteStep(idx)}
                          className="px-2.5 py-1 text-xs font-bold uppercase bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })()}

        {/* SECTION 12: TRUST BRANDS & LABORATORIES */}
        {(activeMenuOption === 'all' || activeMenuOption === 'trustBrands') && (() => {
          const activeTrustBrands = getSafeTrustBrandsSection(data.trustBrandsSection);
          return (
            <section className="w-full border-b border-slate-200 py-6 sm:py-8 px-4 sm:px-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                    12 / Configuration
                  </span>
                  <h2 className="text-xl font-bold text-[#003334]">
                    Trust Brands ({activeTrustBrands.brands.length} Partners)
                  </h2>
                </div>
                <button
                  onClick={openNewBrandModal}
                  className="mt-2 sm:mt-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#003334] hover:bg-[#002627] rounded-lg cursor-pointer"
                >
                  + Add Brand Partner
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Banner Heading</label>
                  <input
                    type="text"
                    value={activeTrustBrands.heading || ''}
                    onChange={e => updateTrustBrandsSection(curr => ({ ...curr, heading: e.target.value }))}
                    placeholder="Over 1,000+ Brands & Laboratories Trust Us"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-[#003334]"
                  />
                </div>
                <div>
                  {renderSeoKeywordsEditor(
                    'Trust Brands SEO Keywords',
                    activeTrustBrands.seoKeywords || [],
                    (next) => updateTrustBrandsSection(curr => ({ ...curr, seoKeywords: next })),
                    'trust_brands_seo'
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {activeTrustBrands.brands.map((brand, idx) => {
                  const brandId = brand.id || `bp-${idx + 1}`;
                  const slotId = getClinicSlotId('brand', brandId);
                  return (
                    <div
                      key={brandId}
                      className="border border-slate-200 bg-white rounded-xl p-3 flex flex-col justify-between gap-2.5 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <AdminSlotThumbnail
                          src={brand.imageUrl}
                          slotId={slotId}
                          alt={brand.name}
                          className="h-10 w-10 shrink-0"
                          imgClassName="w-full h-full object-contain p-1"
                          showStatusLabel={true}
                        />
                        <div className="min-w-0">
                          <div className="text-[10px] font-mono font-bold text-[#c5a880] uppercase truncate">
                            {brand.imageUrl ? 'Logo Asset' : `Icon: ${brand.iconType}`}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 truncate">{brand.name}</h3>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5 flex-wrap">
                        <button
                          onClick={() => {
                            triggerImageUpload(
                              async (newUrl, fileName) => {
                                const curr = getSafeTrustBrandsSection(dataRef.current.trustBrandsSection);
                                const nextBrands = [...(curr.brands || [])];
                                nextBrands[idx] = {
                                  ...nextBrands[idx],
                                  id: brandId,
                                  imageUrl: newUrl,
                                };
                                const nextData: ClinicData = {
                                  ...dataRef.current,
                                  trustBrandsSection: {
                                    ...curr,
                                    brands: nextBrands,
                                  },
                                };
                                await persistClinicDataImmediately(
                                  nextData,
                                  `Uploaded "${fileName || brand.name}" logo & saved permanently to ${newUrl}!`
                                );
                              },
                              'trust_brand_card',
                              brand.imageUrl,
                              slotId
                            );
                          }}
                          className="px-2 py-1 text-[11px] font-bold uppercase bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg cursor-pointer"
                        >
                          Replace Img
                        </button>
                        <button
                          onClick={() => openEditBrandModal(idx)}
                          className="px-2.5 py-1 text-xs font-bold uppercase bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteBrand(idx)}
                          className="px-2.5 py-1 text-xs font-bold uppercase bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* SECTION 13: RAW TYPESCRIPT CODE PREVIEW */}
        {(activeMenuOption === 'all' || activeMenuOption === 'code') && (
          <section className="w-full py-8 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                  13 / Source Code
                </span>
                <h2 className="text-xl font-bold text-[#003334]">Direct File TypeScript Preview</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono mt-1 sm:mt-0">
                src/data/clinicInfo.ts
              </span>
            </div>

            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-96">
              <pre>{`// Target: src/data/clinicInfo.ts
export const CLINIC_DATA = ${JSON.stringify(data, null, 2)};`}</pre>
            </div>
          </section>
        )}

      </div>

      {/* 4. MOBILE / DESKTOP BOTTOM SHEET MODAL */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 transition-opacity"
            onClick={() => setModalType(null)}
          />

          {/* Bottom sheet on mobile / centered dialog on larger screens */}
          <div className="relative w-full sm:max-w-xl max-h-[85vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden">
            
            {/* Grab handle bar for mobile */}
            <div className="sm:hidden pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1 bg-slate-300 rounded-full" />
            </div>

            {/* Modal Header */}
            <div className="px-3.5 sm:px-6 py-3 sm:py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase text-[#c5a880]">
                  {modalType === 'location'
                    ? 'Location Facility Editor'
                    : modalType === 'pillar'
                    ? 'Why Choose Us Editor'
                    : modalType === 'award'
                    ? 'Awards Showcase Editor'
                    : modalType === 'doctor'
                    ? 'Book Consultation Specialist Editor'
                    : modalType === 'facilityRoom'
                    ? 'Clinic Gallery Suite Editor'
                    : modalType === 'processStep'
                    ? 'Our Process Step Editor'
                    : modalType === 'trustBrand'
                    ? 'Trust Brand Partner Editor'
                    : 'Item Array Editor'}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#003334]">
                  {modalType === 'location' 
                    ? (editingLocationIndex !== null ? 'Edit Clinic Location' : 'Add New Clinic Location')
                    : modalType === 'pillar'
                    ? (editingPillarIndex !== null ? 'Edit Pillar' : 'Add Pillar')
                    : modalType === 'award'
                    ? (editingAwardIndex !== null ? 'Edit Award' : 'Add Award')
                    : modalType === 'doctor'
                    ? (editingDoctorIndex !== null ? 'Edit Preferred Specialist' : 'Add Preferred Specialist')
                    : modalType === 'facilityRoom'
                    ? (editingRoomIndex !== null ? 'Edit Gallery Suite' : 'Add Gallery Suite')
                    : modalType === 'processStep'
                    ? (editingStepIndex !== null ? 'Edit Process Step' : 'Add Process Step')
                    : modalType === 'trustBrand'
                    ? (editingBrandIndex !== null ? 'Edit Brand Partner' : 'Add Brand Partner')
                    : modalType === 'keywords' ? 'Edit Brand Keywords'
                    : modalType === 'accreditations' ? 'Edit Accreditations'
                    : modalType === 'payments' ? 'Edit Payment Methods'
                    : modalType === 'specialties' ? 'Edit Medical Specialties'
                    : modalType === 'languages' ? 'Edit Languages Spoken'
                    : 'Edit Interior Photos'}
                </h3>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="px-2.5 py-1 text-xs font-bold uppercase text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="p-3 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-4 flex-1">
              
              {/* EDIT LOCATION FORM */}
              {modalType === 'location' && locationDraft && (
                <div className="space-y-3 sm:space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold uppercase text-slate-700">Location Name</label>
                    <input
                      type="text"
                      value={locationDraft.name}
                      onChange={e => setLocationDraft({ ...locationDraft, name: e.target.value })}
                      placeholder="e.g. Harley Street Flagship Clinic"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold uppercase text-slate-700">Street Address</label>
                      <input
                        type="text"
                        value={locationDraft.address}
                        onChange={e => setLocationDraft({ ...locationDraft, address: e.target.value })}
                        placeholder="4 Harley Street"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase text-slate-700">City & Postal Code</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={locationDraft.city}
                          onChange={e => setLocationDraft({ ...locationDraft, city: e.target.value })}
                          placeholder="London"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                        />
                        <input
                          type="text"
                          value={locationDraft.postalCode}
                          onChange={e => setLocationDraft({ ...locationDraft, postalCode: e.target.value })}
                          placeholder="W1G 9PB"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold uppercase text-slate-700">Phone</label>
                      <input
                        type="text"
                        value={locationDraft.phone}
                        onChange={e => setLocationDraft({ ...locationDraft, phone: e.target.value })}
                        placeholder="+44 20 8857 2000"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase text-slate-700">Opening Hours</label>
                      <input
                        type="text"
                        value={locationDraft.hours}
                        onChange={e => setLocationDraft({ ...locationDraft, hours: e.target.value })}
                        placeholder="Mon – Fri: 09:00 – 19:00"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold uppercase text-slate-700">Google Maps Directions URL</label>
                    <input
                      type="text"
                      value={locationDraft.directionsUrl || ''}
                      onChange={e => setLocationDraft({ ...locationDraft, directionsUrl: e.target.value })}
                      placeholder="https://maps.google.com/..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold uppercase text-slate-700">Location Image Asset</label>
                      <button
                        type="button"
                        onClick={() => {
                          const locId = locationDraft.id || (editingLocationIndex !== null ? `loc-${editingLocationIndex + 1}` : 'new');
                          const slotId = getClinicSlotId('location', locId);
                          triggerImageUpload(
                            async (newUrl, fileName) => {
                              const updatedDraft: ClinicLocation = { ...locationDraft, image: newUrl };
                              setLocationDraft(updatedDraft);
                              const currentLocations = [...(dataRef.current.locations || [])];
                              if (editingLocationIndex !== null && editingLocationIndex >= 0) {
                                currentLocations[editingLocationIndex] = updatedDraft;
                              } else {
                                currentLocations.push(updatedDraft);
                                setEditingLocationIndex(currentLocations.length - 1);
                              }
                              const nextData: ClinicData = {
                                ...dataRef.current,
                                locations: currentLocations,
                              };
                              await persistClinicDataImmediately(
                                nextData,
                                `Uploaded "${fileName || 'Location Image'}" & saved permanently to ${newUrl}!`
                              );
                            },
                            'loc_image',
                            locationDraft.image,
                            slotId
                          );
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#003334] text-white hover:bg-[#002627] rounded cursor-pointer"
                      >
                        + Add Image File
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={locationDraft.image || ''}
                        onChange={e => setLocationDraft({ ...locationDraft, image: e.target.value })}
                        placeholder="/assets/clinic-location-1.webp or image URL"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                      {locationDraft.image && (
                        <button
                          type="button"
                          onClick={() => setLocationDraft({ ...locationDraft, image: '' })}
                          className="px-2 py-2 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 rounded-lg cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <AdminSlotImageFieldPreview
                      value={locationDraft.image}
                      slotId={getClinicSlotId('location', locationDraft.id || (editingLocationIndex !== null ? `loc-${editingLocationIndex + 1}` : 'new'))}
                      label="Location Preview"
                    />
                  </div>

                  {/* Location Gallery Images (locations[i].gallery[i]) */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="font-bold uppercase text-slate-700">
                        Location Gallery ({locationDraft.gallery?.length || 0})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const locId = locationDraft.id || (editingLocationIndex !== null ? `loc-${editingLocationIndex + 1}` : 'new');
                          const galleryIdx = (locationDraft.gallery?.length || 0);
                          const slotId = `${getClinicSlotId('location', locId)}-gallery-${galleryIdx}`;
                          triggerImageUpload(
                            async (newUrl, fileName) => {
                              const nextGallery = [...(locationDraft.gallery || []), newUrl];
                              const updatedDraft: ClinicLocation = { ...locationDraft, gallery: nextGallery };
                              setLocationDraft(updatedDraft);
                              const currentLocations = [...(dataRef.current.locations || [])];
                              if (editingLocationIndex !== null && editingLocationIndex >= 0) {
                                currentLocations[editingLocationIndex] = updatedDraft;
                              } else {
                                currentLocations.push(updatedDraft);
                                setEditingLocationIndex(currentLocations.length - 1);
                              }
                              const nextData: ClinicData = {
                                ...dataRef.current,
                                locations: currentLocations,
                              };
                              await persistClinicDataImmediately(
                                nextData,
                                `Uploaded "${fileName || 'Gallery Image'}" & saved permanently to ${newUrl}!`
                              );
                            },
                            'loc_gallery_add',
                            undefined,
                            slotId
                          );
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 hover:bg-slate-300 rounded cursor-pointer"
                      >
                        + Add Gallery Image
                      </button>
                    </div>
                    {Array.isArray(locationDraft.gallery) && locationDraft.gallery.length > 0 && (
                      <div className="space-y-1.5">
                        {locationDraft.gallery.map((gUrl, gIdx) => (
                          <div
                            key={gIdx}
                            className="flex items-center justify-between gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <AdminSlotThumbnail
                                src={gUrl}
                                slotId={`${getClinicSlotId('location', locationDraft.id || 'new')}-gallery-${gIdx}`}
                                alt={`Gallery ${gIdx + 1}`}
                                className="h-8 w-8 shrink-0"
                                showStatusLabel={false}
                              />
                              <span className="font-mono text-slate-600 text-[11px] truncate">{gUrl}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  const locId = locationDraft.id || (editingLocationIndex !== null ? `loc-${editingLocationIndex + 1}` : 'new');
                                  const slotId = `${getClinicSlotId('location', locId)}-gallery-${gIdx}`;
                                  triggerImageUpload(
                                    async (newUrl, fileName) => {
                                      const nextGallery = [...(locationDraft.gallery || [])];
                                      nextGallery[gIdx] = newUrl;
                                      const updatedDraft: ClinicLocation = { ...locationDraft, gallery: nextGallery };
                                      setLocationDraft(updatedDraft);
                                      const currentLocations = [...(dataRef.current.locations || [])];
                                      if (editingLocationIndex !== null && editingLocationIndex >= 0) {
                                        currentLocations[editingLocationIndex] = updatedDraft;
                                      } else {
                                        currentLocations.push(updatedDraft);
                                        setEditingLocationIndex(currentLocations.length - 1);
                                      }
                                      const nextData: ClinicData = {
                                        ...dataRef.current,
                                        locations: currentLocations,
                                      };
                                      await persistClinicDataImmediately(
                                        nextData,
                                        `Replaced gallery image "${fileName || gIdx + 1}" & saved to ${newUrl}!`
                                      );
                                    },
                                    `loc_gallery_${gIdx}`,
                                    gUrl,
                                    slotId
                                  );
                                }}
                                className="text-[10px] font-bold uppercase text-[#003334] hover:underline cursor-pointer"
                              >
                                Replace
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const nextGallery = (locationDraft.gallery || []).filter((_, idx) => idx !== gIdx);
                                  setLocationDraft({ ...locationDraft, gallery: nextGallery });
                                }}
                                className="text-[10px] font-bold uppercase text-rose-600 hover:text-rose-800 cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={locationDraft.parkingAvailable ?? false}
                        onChange={e => setLocationDraft({ ...locationDraft, parkingAvailable: e.target.checked })}
                        className="rounded text-[#003334]"
                      />
                      Parking Available
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={locationDraft.wheelchairAccessible ?? false}
                        onChange={e => setLocationDraft({ ...locationDraft, wheelchairAccessible: e.target.checked })}
                        className="rounded text-[#003334]"
                      />
                      Wheelchair Accessible
                    </label>
                  </div>
                </div>
              )}

              {/* EDIT PILLAR FORM */}
              {modalType === 'pillar' && pillarDraft && (
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold uppercase text-slate-700">Pillar Title</label>
                    <input
                      type="text"
                      value={pillarDraft.title}
                      onChange={e => setPillarDraft({ ...pillarDraft, title: e.target.value })}
                      placeholder="e.g. London's Premier Aesthetic Destination"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold uppercase text-slate-700">Badge Text</label>
                      <input
                        type="text"
                        value={pillarDraft.badge || ''}
                        onChange={e => setPillarDraft({ ...pillarDraft, badge: e.target.value })}
                        placeholder="e.g. Harley St Flagship"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase text-slate-700">Icon Name</label>
                      <select
                        value={pillarDraft.iconName || 'Building'}
                        onChange={e => setPillarDraft({ ...pillarDraft, iconName: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white"
                      >
                        <option value="Building">Building</option>
                        <option value="Star">Star</option>
                        <option value="Sparkles">Sparkles</option>
                        <option value="Medal">Medal</option>
                        <option value="Shield">Shield</option>
                        <option value="Award">Award</option>
                        <option value="CheckCircle">CheckCircle</option>
                        <option value="Heart">Heart</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold uppercase text-slate-700">Description</label>
                    <textarea
                      rows={3}
                      value={pillarDraft.description}
                      onChange={e => setPillarDraft({ ...pillarDraft, description: e.target.value })}
                      placeholder="Short description of this pillar..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold uppercase text-slate-700">Pillar Image Asset</label>
                      <button
                        type="button"
                        onClick={() => {
                          const pillarId = pillarDraft.id || (editingPillarIndex !== null ? `pillar-${editingPillarIndex + 1}` : 'new');
                          const slotId = getClinicSlotId('pillar', pillarId);
                          triggerImageUpload(
                            async (newUrl, fileName) => {
                              const updatedDraft: ClinicWhyChooseUsPillar = { ...pillarDraft, imageUrl: newUrl };
                              setPillarDraft(updatedDraft);
                              const currentPillars = [...(dataRef.current.whyChooseUs?.pillars || [])];
                              if (editingPillarIndex !== null && editingPillarIndex >= 0) {
                                currentPillars[editingPillarIndex] = updatedDraft;
                              } else {
                                currentPillars.push(updatedDraft);
                                setEditingPillarIndex(currentPillars.length - 1);
                              }
                              const nextData: ClinicData = {
                                ...dataRef.current,
                                whyChooseUs: {
                                  heading: dataRef.current.whyChooseUs?.heading || 'Why choose Age Reversal Clinic London?',
                                  subheading: dataRef.current.whyChooseUs?.subheading || '',
                                  pillars: currentPillars,
                                },
                              };
                              await persistClinicDataImmediately(
                                nextData,
                                `Uploaded "${fileName || 'Pillar Image'}" & saved permanently to ${newUrl}!`
                              );
                            },
                            'pillar_image',
                            pillarDraft.imageUrl,
                            slotId
                          );
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#003334] text-white hover:bg-[#002627] rounded cursor-pointer"
                      >
                        {pillarDraft.imageUrl ? 'Replace Image File' : '+ Add Image File'}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pillarDraft.imageUrl || ''}
                        onChange={e => setPillarDraft({ ...pillarDraft, imageUrl: e.target.value })}
                        placeholder="/assets/clinic-pillar-1.webp or image URL"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                      {pillarDraft.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setPillarDraft({ ...pillarDraft, imageUrl: '' })}
                          className="px-2 py-2 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 rounded-lg cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <AdminSlotImageFieldPreview
                      value={pillarDraft.imageUrl}
                      slotId={getClinicSlotId('pillar', pillarDraft.id || (editingPillarIndex !== null ? `pillar-${editingPillarIndex + 1}` : 'new'))}
                      label="Pillar Preview"
                    />
                  </div>
                </div>
              )}

              {/* EDIT AWARD FORM */}
              {modalType === 'award' && awardDraft && (
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold uppercase text-slate-700">Award Title</label>
                    <input
                      type="text"
                      value={awardDraft.title}
                      onChange={e => setAwardDraft({ ...awardDraft, title: e.target.value })}
                      placeholder="e.g. Dermatology Clinic of the Year"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold uppercase text-slate-700">Organization</label>
                      <input
                        type="text"
                        value={awardDraft.organization}
                        onChange={e => setAwardDraft({ ...awardDraft, organization: e.target.value })}
                        placeholder="e.g. Aesthetic Medicine Awards"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase text-slate-700">Year</label>
                      <input
                        type="text"
                        value={awardDraft.year}
                        onChange={e => setAwardDraft({ ...awardDraft, year: e.target.value })}
                        placeholder="2025"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold uppercase text-slate-700">Award Image Asset</label>
                      <button
                        type="button"
                        onClick={() => {
                          const awardId = awardDraft.id || (editingAwardIndex !== null ? `award-${editingAwardIndex + 1}` : 'new');
                          const slotId = getClinicSlotId('award', awardId);
                          triggerImageUpload(
                            async (newUrl, fileName) => {
                              const updatedDraft: ClinicAwardItem = { ...awardDraft, imageUrl: newUrl };
                              setAwardDraft(updatedDraft);
                              const currentAwards = [...(dataRef.current.awardsShowcase?.awards || [])];
                              if (editingAwardIndex !== null && editingAwardIndex >= 0) {
                                currentAwards[editingAwardIndex] = updatedDraft;
                              } else {
                                currentAwards.push(updatedDraft);
                                setEditingAwardIndex(currentAwards.length - 1);
                              }
                              const nextData: ClinicData = {
                                ...dataRef.current,
                                awardsShowcase: {
                                  heading: dataRef.current.awardsShowcase?.heading || 'Awards & Recognition',
                                  subheading: dataRef.current.awardsShowcase?.subheading || '',
                                  awards: currentAwards,
                                },
                              };
                              await persistClinicDataImmediately(
                                nextData,
                                `Uploaded "${fileName || 'Award Image'}" & saved permanently to ${newUrl}!`
                              );
                            },
                            'award_image',
                            awardDraft.imageUrl,
                            slotId
                          );
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#003334] text-white hover:bg-[#002627] rounded cursor-pointer"
                      >
                        {awardDraft.imageUrl ? 'Replace Image File' : '+ Add Image File'}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={awardDraft.imageUrl || ''}
                        onChange={e => setAwardDraft({ ...awardDraft, imageUrl: e.target.value })}
                        placeholder="/assets/award.jpg or image URL"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                      {awardDraft.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setAwardDraft({ ...awardDraft, imageUrl: '' })}
                          className="px-2 py-2 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 rounded-lg cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <AdminSlotImageFieldPreview
                      value={awardDraft.imageUrl}
                      slotId={getClinicSlotId(
                        'award',
                        awardDraft.id ||
                          (editingAwardIndex !== null
                            ? `award-${editingAwardIndex + 1}`
                            : `award-${(data.awardsShowcase?.awards?.length || 0) + 1}`)
                      )}
                      label="Award Preview"
                    />
                  </div>
                </div>
              )}

              {/* EDIT PREFERRED SPECIALIST FORM */}
              {modalType === 'doctor' && doctorDraft && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold uppercase text-slate-700">Specialist Name</label>
                      <input
                        type="text"
                        value={doctorDraft.name}
                        onChange={e => setDoctorDraft({ ...doctorDraft, name: e.target.value })}
                        placeholder="e.g. Dr. Alistair Smith (Lead Aesthetic Specialist)"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase text-slate-700">Specialty / Title</label>
                      <input
                        type="text"
                        value={doctorDraft.specialty || ''}
                        onChange={e => setDoctorDraft({ ...doctorDraft, specialty: e.target.value })}
                        placeholder="e.g. Lead Aesthetic Specialist"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Assigned Clinic Locations */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold uppercase text-slate-700">Assigned Clinic Locations</label>
                      <span className="text-[10px] text-slate-400 font-mono">Leave unchecked for All Locations</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(data.locations || []).map((loc, lIdx) => {
                        const locKey = loc.id || loc.name;
                        const isChecked = (doctorDraft.locationIds || []).includes(locKey);
                        return (
                          <label
                            key={locKey || lIdx}
                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                              isChecked
                                ? 'bg-teal-50/70 border-[#003334] text-[#003334] font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e => {
                                const current = doctorDraft.locationIds || [];
                                const next = e.target.checked
                                  ? Array.from(new Set([...current, locKey]))
                                  : current.filter(id => id !== locKey);
                                setDoctorDraft({ ...doctorDraft, locationIds: next });
                              }}
                              className="rounded text-[#003334]"
                            />
                            <span className="truncate">{loc.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Available Working Days */}
                  <div className="space-y-1.5">
                    <label className="font-bold uppercase text-slate-700">Available Working Days</label>
                    <div className="flex flex-wrap gap-1.5">
                      {DAY_LABELS.map(({ day, short }) => {
                        const active = (doctorDraft.availableDays || []).includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const current = doctorDraft.availableDays || [];
                              const next = active
                                ? current.filter(d => d !== day)
                                : [...current, day].sort();
                              setDoctorDraft({ ...doctorDraft, availableDays: next });
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer border transition-colors ${
                              active
                                ? 'bg-[#003334] text-white border-[#003334]'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {short}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Specialist Time Slots */}
                  <div className="space-y-1.5">
                    <label className="font-bold uppercase text-slate-700">
                      Available Time Slots ({doctorDraft.timeSlots?.length || 0})
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newDoctorTimeSlot}
                        onChange={e => setNewDoctorTimeSlot(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && newDoctorTimeSlot.trim()) {
                            e.preventDefault();
                            const slot = newDoctorTimeSlot.trim();
                            setDoctorDraft({
                              ...doctorDraft,
                              timeSlots: Array.from(new Set([...(doctorDraft.timeSlots || []), slot])),
                            });
                            setNewDoctorTimeSlot('');
                          }
                        }}
                        placeholder="e.g. 09:30 or 14:00"
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const slot = newDoctorTimeSlot.trim();
                          if (!slot) return;
                          setDoctorDraft({
                            ...doctorDraft,
                            timeSlots: Array.from(new Set([...(doctorDraft.timeSlots || []), slot])),
                          });
                          setNewDoctorTimeSlot('');
                        }}
                        className="px-3 py-1.5 bg-[#003334] text-white text-xs font-bold uppercase rounded-lg cursor-pointer"
                      >
                        + Add Slot
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(doctorDraft.timeSlots || []).map((slot, sIdx) => (
                        <span
                          key={`${slot}-${sIdx}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-800"
                        >
                          {slot}
                          <button
                            type="button"
                            onClick={() =>
                              setDoctorDraft({
                                ...doctorDraft,
                                timeSlots: (doctorDraft.timeSlots || []).filter((_, i) => i !== sIdx),
                              })
                            }
                            className="text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* EDIT FACILITY GALLERY ROOM FORM */}
              {modalType === 'facilityRoom' && roomDraft && (
                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold uppercase text-slate-700">Room / Suite Title</label>
                      <input
                        type="text"
                        value={roomDraft.title}
                        onChange={e => setRoomDraft({ ...roomDraft, title: e.target.value })}
                        placeholder="e.g. Executive Recovery Lounge"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase text-slate-700">Category Tag</label>
                      <input
                        type="text"
                        value={roomDraft.tag}
                        onChange={e => setRoomDraft({ ...roomDraft, tag: e.target.value })}
                        placeholder="e.g. VIP SUITE"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold uppercase text-slate-700">SEO Image Alt Text</label>
                    <input
                      type="text"
                      value={roomDraft.imageAlt || ''}
                      onChange={e => setRoomDraft({ ...roomDraft, imageAlt: e.target.value })}
                      placeholder="e.g. Executive Recovery Lounge at Age Reversal Clinics Harley Street"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold uppercase text-slate-700">Suite Image Asset</label>
                      <button
                        type="button"
                        onClick={() => {
                          const roomId =
                            roomDraft.id ||
                            (editingRoomIndex !== null
                              ? `room-${editingRoomIndex + 1}`
                              : `room-${(data.facilityGallery?.rooms?.length || 0) + 1}`);
                          const slotId = getClinicSlotId('facility', roomId);
                          triggerImageUpload(
                            async (newUrl, fileName) => {
                              const curr = getSafeFacilityGallery(
                                dataRef.current.facilityGallery,
                                dataRef.current.interiorPhotos
                              );
                              const nextRooms = [...(curr.rooms || [])];
                              const resolvedTitle =
                                roomDraft.title.trim() ||
                                `Clinical Suite ${(editingRoomIndex !== null ? editingRoomIndex : nextRooms.length) + 1}`;
                              const updatedDraft: ClinicFacilityRoomItem = {
                                ...roomDraft,
                                id: roomId,
                                title: resolvedTitle,
                                tag: roomDraft.tag.trim() || 'CLINIC SUITE',
                                image: newUrl,
                                imageAlt:
                                  roomDraft.imageAlt?.trim() ||
                                  `${resolvedTitle} at ${dataRef.current.name || 'Age Reversal Clinics'}`,
                              };
                              setRoomDraft(updatedDraft);
                              if (editingRoomIndex !== null && editingRoomIndex >= 0) {
                                nextRooms[editingRoomIndex] = updatedDraft;
                              } else {
                                nextRooms.push(updatedDraft);
                                setEditingRoomIndex(nextRooms.length - 1);
                              }
                              const nextData: ClinicData = {
                                ...dataRef.current,
                                facilityGallery: {
                                  ...curr,
                                  rooms: nextRooms,
                                },
                              };
                              await persistClinicDataImmediately(
                                nextData,
                                `Uploaded "${fileName || 'Suite Image'}" & saved permanently to ${newUrl}!`
                              );
                            },
                            'facility_room_modal',
                            roomDraft.image,
                            slotId
                          );
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#003334] text-white hover:bg-[#002627] rounded cursor-pointer"
                      >
                        {roomDraft.image ? 'Replace Image File' : '+ Add Image File'}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={roomDraft.image || ''}
                        onChange={e => setRoomDraft({ ...roomDraft, image: e.target.value })}
                        placeholder="/assets/clinic-facility-1.webp or image URL"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                      {roomDraft.image && (
                        <button
                          type="button"
                          onClick={() => setRoomDraft({ ...roomDraft, image: '' })}
                          className="px-2 py-2 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 rounded-lg cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <AdminSlotImageFieldPreview
                      value={roomDraft.image}
                      slotId={getClinicSlotId(
                        'facility',
                        roomDraft.id ||
                          (editingRoomIndex !== null
                            ? `room-${editingRoomIndex + 1}`
                            : `room-${(data.facilityGallery?.rooms?.length || 0) + 1}`)
                      )}
                      label={roomDraft.imageAlt || 'Suite Preview'}
                    />
                  </div>
                </div>
              )}

              {/* EDIT PROCESS STEP FORM */}
              {modalType === 'processStep' && stepDraft && (
                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold uppercase text-slate-700">Step Number</label>
                      <input
                        type="text"
                        value={stepDraft.stepNumber}
                        onChange={e => setStepDraft({ ...stepDraft, stepNumber: e.target.value })}
                        placeholder="01"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-bold uppercase text-slate-700">Step Title</label>
                      <input
                        type="text"
                        value={stepDraft.title}
                        onChange={e => setStepDraft({ ...stepDraft, title: e.target.value })}
                        placeholder="e.g. Comprehensive Consultation & Assessment"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold uppercase text-slate-700">SEO Image Alt Text</label>
                    <input
                      type="text"
                      value={stepDraft.imageAlt || ''}
                      onChange={e => setStepDraft({ ...stepDraft, imageAlt: e.target.value })}
                      placeholder="e.g. Comprehensive Consultation & Assessment at Age Reversal Clinics London"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold uppercase text-slate-700">Step Image Asset</label>
                      <button
                        type="button"
                        onClick={() => {
                          const stepIdx =
                            editingStepIndex !== null
                              ? editingStepIndex
                              : (data.processSection?.steps?.length || 0);
                          const stepNum = stepDraft.stepNumber || String(stepIdx + 1).padStart(2, '0');
                          const stepId = stepDraft.id || `step-${stepIdx + 1}`;
                          const slotId = getClinicSlotId('process', stepNum || stepId);
                          triggerImageUpload(
                            async (newUrl, fileName) => {
                              const curr = getSafeProcessSection(dataRef.current.processSection);
                              const nextSteps = [...(curr.steps || [])];
                              const resolvedStepNum =
                                stepDraft.stepNumber.trim() ||
                                String((editingStepIndex ?? nextSteps.length) + 1).padStart(2, '0');
                              const resolvedTitle = stepDraft.title.trim() || `Process Step ${resolvedStepNum}`;
                              const updatedDraft: ClinicProcessStep = {
                                ...stepDraft,
                                id: stepId,
                                stepNumber: resolvedStepNum,
                                title: resolvedTitle,
                                image: newUrl,
                                imageAlt:
                                  stepDraft.imageAlt?.trim() ||
                                  `${resolvedTitle} — ${dataRef.current.name || 'Age Reversal Clinics'}`,
                              };
                              setStepDraft(updatedDraft);
                              if (editingStepIndex !== null && editingStepIndex >= 0) {
                                nextSteps[editingStepIndex] = updatedDraft;
                              } else {
                                nextSteps.push(updatedDraft);
                                setEditingStepIndex(nextSteps.length - 1);
                              }
                              const nextData: ClinicData = {
                                ...dataRef.current,
                                processSection: {
                                  ...curr,
                                  steps: nextSteps,
                                },
                              };
                              await persistClinicDataImmediately(
                                nextData,
                                `Uploaded "${fileName || 'Process Step Image'}" & saved permanently to ${newUrl}!`
                              );
                            },
                            'process_step_modal',
                            stepDraft.image,
                            slotId
                          );
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#003334] text-white hover:bg-[#002627] rounded cursor-pointer"
                      >
                        {stepDraft.image ? 'Replace Image File' : '+ Add Image File'}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={stepDraft.image || ''}
                        onChange={e => setStepDraft({ ...stepDraft, image: e.target.value })}
                        placeholder="/assets/clinic-process-01.webp or image URL"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                      {stepDraft.image && (
                        <button
                          type="button"
                          onClick={() => setStepDraft({ ...stepDraft, image: '' })}
                          className="px-2 py-2 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 rounded-lg cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <AdminSlotImageFieldPreview
                      value={stepDraft.image}
                      slotId={getClinicSlotId(
                        'process',
                        stepDraft.stepNumber ||
                          stepDraft.id ||
                          (editingStepIndex !== null
                            ? String(editingStepIndex + 1).padStart(2, '0')
                            : String((data.processSection?.steps?.length || 0) + 1).padStart(2, '0'))
                      )}
                      label={stepDraft.imageAlt || 'Step Preview'}
                    />
                  </div>

                  {/* Step SEO Keywords */}
                  <div className="space-y-1.5">
                    <label className="font-bold uppercase text-slate-700">
                      Step SEO Keywords ({(stepDraft.seoKeywords || []).length})
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newStepKeywordInput}
                        onChange={e => setNewStepKeywordInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && newStepKeywordInput.trim()) {
                            e.preventDefault();
                            const kw = newStepKeywordInput.trim();
                            setStepDraft({
                              ...stepDraft,
                              seoKeywords: Array.from(new Set([...(stepDraft.seoKeywords || []), kw])),
                            });
                            setNewStepKeywordInput('');
                          }
                        }}
                        placeholder="e.g. skin consultation london"
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const kw = newStepKeywordInput.trim();
                          if (!kw) return;
                          setStepDraft({
                            ...stepDraft,
                            seoKeywords: Array.from(new Set([...(stepDraft.seoKeywords || []), kw])),
                          });
                          setNewStepKeywordInput('');
                        }}
                        className="px-3 py-1.5 bg-[#003334] text-white text-xs font-bold uppercase rounded-lg cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(stepDraft.seoKeywords || []).map((kw, kIdx) => (
                        <span
                          key={`${kw}-${kIdx}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-teal-50/70 border border-teal-200 rounded-md text-xs font-medium text-[#003334]"
                        >
                          {kw}
                          <button
                            type="button"
                            onClick={() =>
                              setStepDraft({
                                ...stepDraft,
                                seoKeywords: (stepDraft.seoKeywords || []).filter((_, i) => i !== kIdx),
                              })
                            }
                            className="text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* EDIT TRUST BRAND PARTNER FORM */}
              {modalType === 'trustBrand' && brandDraft && (
                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold uppercase text-slate-700">Brand / Laboratory Name</label>
                      <input
                        type="text"
                        value={brandDraft.name}
                        onChange={e => setBrandDraft({ ...brandDraft, name: e.target.value })}
                        placeholder="e.g. Lumina Bio-Labs"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase text-slate-700">Vector Icon Style</label>
                      <select
                        value={brandDraft.iconType || 'shield'}
                        onChange={e => setBrandDraft({ ...brandDraft, iconType: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white"
                      >
                        <option value="circle">Circle (Orbital)</option>
                        <option value="layers">Layers (Stacked)</option>
                        <option value="pill">Pill (Capsule)</option>
                        <option value="shield">Shield (Verified)</option>
                        <option value="instagram">Hexagon / Aperture</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold uppercase text-slate-700">Custom Brand Logo (Optional)</label>
                      <button
                        type="button"
                        onClick={() => {
                          const curr = getSafeTrustBrandsSection(dataRef.current.trustBrandsSection);
                          const targetIdx =
                            editingBrandIndex !== null && editingBrandIndex >= 0
                              ? editingBrandIndex
                              : curr.brands?.length || 0;
                          const brandId = brandDraft.id || `bp-${targetIdx + 1}`;
                          const slotId = getClinicSlotId('brand', brandId);
                          triggerImageUpload(
                            async (newUrl, fileName) => {
                              const latestCurr = getSafeTrustBrandsSection(dataRef.current.trustBrandsSection);
                              const nextBrands = [...(latestCurr.brands || [])];
                              const resolvedName =
                                brandDraft.name.trim() ||
                                `Partner Brand ${(editingBrandIndex !== null ? editingBrandIndex : nextBrands.length) + 1}`;
                              const updatedDraft: ClinicTrustBrandItem = {
                                ...brandDraft,
                                id: brandId,
                                name: resolvedName,
                                iconType: brandDraft.iconType || 'shield',
                                imageUrl: newUrl,
                              };
                              setBrandDraft(updatedDraft);
                              if (editingBrandIndex !== null && editingBrandIndex >= 0) {
                                nextBrands[editingBrandIndex] = updatedDraft;
                              } else {
                                nextBrands.push(updatedDraft);
                                setEditingBrandIndex(nextBrands.length - 1);
                              }
                              const nextData: ClinicData = {
                                ...dataRef.current,
                                trustBrandsSection: {
                                  ...latestCurr,
                                  brands: nextBrands,
                                },
                              };
                              await persistClinicDataImmediately(
                                nextData,
                                `Uploaded "${fileName || 'Brand Logo'}" & saved permanently to ${newUrl}!`
                              );
                            },
                            'trust_brand_modal',
                            brandDraft.imageUrl,
                            slotId
                          );
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#003334] text-white hover:bg-[#002627] rounded cursor-pointer"
                      >
                        {brandDraft.imageUrl ? 'Replace Logo File' : '+ Upload Logo'}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={brandDraft.imageUrl || ''}
                        onChange={e => setBrandDraft({ ...brandDraft, imageUrl: e.target.value })}
                        placeholder="/assets/clinic-brand-1.webp or leave empty to use Vector Icon"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                      {brandDraft.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setBrandDraft({ ...brandDraft, imageUrl: '' })}
                          className="px-2 py-2 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 rounded-lg cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <AdminSlotImageFieldPreview
                      value={brandDraft.imageUrl}
                      slotId={getClinicSlotId(
                        'brand',
                        brandDraft.id || (editingBrandIndex !== null ? `bp-${editingBrandIndex + 1}` : 'new')
                      )}
                      label={brandDraft.name || 'Brand Logo Preview'}
                    />
                  </div>
                </div>
              )}

              {/* EDIT ARRAY ITEMS */}
              {modalType !== 'location' &&
                modalType !== 'pillar' &&
                modalType !== 'award' &&
                modalType !== 'doctor' &&
                modalType !== 'facilityRoom' &&
                modalType !== 'processStep' &&
                modalType !== 'trustBrand' && (
                <div className="space-y-4">
                  {modalType === 'interiorPhotos' && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Upload New Interior Photo</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextIdx = arrayDraft.length;
                          const slotId = getClinicSlotId('interior', nextIdx);
                          triggerImageUpload(
                            async (newUrl, fileName) => {
                              const nextArray = [...arrayDraft, newUrl];
                              setArrayDraft(nextArray);
                              const nextData: ClinicData = {
                                ...dataRef.current,
                                interiorPhotos: nextArray,
                              };
                              await persistClinicDataImmediately(
                                nextData,
                                `Uploaded "${fileName || 'Interior Photo'}" & saved permanently to ${newUrl}!`
                              );
                            },
                            'modal_interior',
                            undefined,
                            slotId
                          );
                        }}
                        className="px-3 py-1.5 bg-[#003334] text-white text-xs font-bold uppercase rounded-lg cursor-pointer hover:bg-[#002627]"
                      >
                        + Add Image File
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newArrayItem}
                      onChange={e => setNewArrayItem(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') addArrayItem(); }}
                      placeholder={modalType === 'interiorPhotos' ? "Enter image URL or /assets/..." : "Type new item..."}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#003334]"
                    />
                    <button
                      onClick={addArrayItem}
                      className="px-4 py-2 bg-[#003334] text-white text-xs font-bold uppercase rounded-lg cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {arrayDraft.length === 0 ? (
                      <div className="text-center py-4 text-xs text-slate-400">No items added yet</div>
                    ) : (
                      arrayDraft.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium">
                          <div className="flex items-center gap-2 truncate pr-2">
                            {modalType === 'interiorPhotos' && (
                              <AdminSlotThumbnail
                                src={item}
                                slotId={getClinicSlotId('interior', idx)}
                                alt={`Item ${idx + 1}`}
                                className="h-8 w-8 shrink-0"
                                showStatusLabel={false}
                              />
                            )}
                            <span className="truncate">{item}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {modalType === 'interiorPhotos' && (
                              <button
                                type="button"
                                onClick={() => {
                                  const slotId = getClinicSlotId('interior', idx);
                                  triggerImageUpload(
                                    async (newUrl, fileName) => {
                                      const nextArray = arrayDraft.map((val, i) => (i === idx ? newUrl : val));
                                      setArrayDraft(nextArray);
                                      const nextData: ClinicData = {
                                        ...dataRef.current,
                                        interiorPhotos: nextArray,
                                      };
                                      await persistClinicDataImmediately(
                                        nextData,
                                        `Replaced interior photo "${fileName || idx + 1}" & saved to ${newUrl}!`
                                      );
                                    },
                                    `modal_interior_${idx}`,
                                    item,
                                    slotId
                                  );
                                }}
                                className="text-[#003334] hover:underline font-bold uppercase text-[11px] px-1.5 py-0.5 rounded cursor-pointer"
                              >
                                Replace
                              </button>
                            )}
                            <button
                              onClick={() => removeArrayItem(idx)}
                              className="text-rose-600 hover:text-rose-800 font-bold uppercase text-[11px] px-2 py-0.5 rounded cursor-pointer shrink-0"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setModalType(null)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={
                  modalType === 'location'
                    ? saveLocationDraft
                    : modalType === 'pillar'
                    ? savePillarDraft
                    : modalType === 'award'
                    ? saveAwardDraft
                    : modalType === 'doctor'
                    ? saveDoctorDraft
                    : modalType === 'facilityRoom'
                    ? saveRoomDraft
                    : modalType === 'processStep'
                    ? saveStepDraft
                    : modalType === 'trustBrand'
                    ? saveBrandDraft
                    : saveArrayDraft
                }
                className="px-4 sm:px-5 py-1.5 sm:py-2 bg-[#003334] hover:bg-[#002627] text-white text-xs font-bold uppercase rounded-lg cursor-pointer"
              >
                Apply Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. IN-APP CONFIRMATION MODAL (Replaces browser window.confirm) */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-10 border border-slate-200">
            <h3 className="text-base font-bold text-[#003334] mb-2">
              {confirmDialog.title}
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
