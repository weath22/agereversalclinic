import React, { useState, useEffect, useRef } from 'react';
import { 
  getClinicData, 
  saveClinicDataToFile, 
  resetClinicDataToDefault,
  uploadAssetFile
} from '../lib/adminStore';
import { 
  ClinicData, 
  ClinicLocation, 
  ClinicWhyChooseUsPillar, 
  ClinicAwardItem,
  ClinicConsultationDoctor,
  ClinicConsultationConfig
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

export default function ClinicDataManager() {
  const [data, setData] = useState<ClinicData>(getClinicData());
  const [activeMenuOption, setActiveMenuOption] = useState<
    'all' | 'brand' | 'assets' | 'contact' | 'commercial' | 'accreditations' | 'locations' | 'socials' | 'whyChooseUs' | 'awards' | 'consultation' | 'code'
  >('all');
  
  const [saveStatus, setSaveStatus] = useState<{
    state: 'idle' | 'saving' | 'saved' | 'error';
    message?: string;
  }>({ state: 'idle' });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadCallbackRef = useRef<((url: string) => void) | null>(null);
  const uploadPreviousUrlRef = useRef<string | undefined>(undefined);

  // Trigger file upload and callback (passing previousUrl when replacing an existing image)
  const triggerImageUpload = (
    callback: (url: string) => void,
    targetName: string,
    previousUrl?: string
  ) => {
    uploadCallbackRef.current = callback;
    uploadPreviousUrlRef.current = previousUrl?.trim() || undefined;
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
    setSaveStatus({ state: 'saving', message: `Uploading ${file.name} to assets...` });
    try {
      const res = await uploadAssetFile(file, prevUrl);
      if (res.success && res.url) {
        uploadCallbackRef.current(res.url);
        setHasUnsavedChanges(true);
        setSaveStatus({ 
          state: 'saved', 
          message: `Uploaded "${file.name}" successfully! Saved to ${res.url}` 
        });
      } else {
        setSaveStatus({ state: 'error', message: res.error || 'Failed to upload image file' });
      }
    } catch (err) {
      setSaveStatus({ state: 'error', message: `Upload error: ${String(err)}` });
    } finally {
      setUploadingTarget(null);
      uploadPreviousUrlRef.current = undefined;
    }
  };

  // Bottom Modal State (for mobile screens and quick item edit)
  const [modalType, setModalType] = useState<
    null | 'location' | 'pillar' | 'award' | 'doctor' | 'keywords' | 'accreditations' | 'payments' | 'specialties' | 'languages' | 'interiorPhotos'
  >(null);
  const [editingLocationIndex, setEditingLocationIndex] = useState<number | null>(null);
  const [locationDraft, setLocationDraft] = useState<ClinicLocation | null>(null);
  const [editingPillarIndex, setEditingPillarIndex] = useState<number | null>(null);
  const [pillarDraft, setPillarDraft] = useState<ClinicWhyChooseUsPillar | null>(null);
  const [editingAwardIndex, setEditingAwardIndex] = useState<number | null>(null);
  const [awardDraft, setAwardDraft] = useState<ClinicAwardItem | null>(null);
  const [editingDoctorIndex, setEditingDoctorIndex] = useState<number | null>(null);
  const [doctorDraft, setDoctorDraft] = useState<ClinicConsultationDoctor | null>(null);
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
    setData(getClinicData());
  }, []);

  const updateField = <K extends keyof ClinicData>(key: K, value: ClinicData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
    setSaveStatus({ state: 'idle' });
  };

  const updateNestedField = (parent: 'logo' | 'socials', field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
    setSaveStatus({ state: 'idle' });
  };

  const updateWhyChooseUsHeader = (field: 'heading' | 'subheading', value: string) => {
    setData(prev => ({
      ...prev,
      whyChooseUs: {
        heading: prev.whyChooseUs?.heading || 'Why choose Age Reversal Clinic London?',
        subheading: prev.whyChooseUs?.subheading || '',
        pillars: prev.whyChooseUs?.pillars || [],
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
    setSaveStatus({ state: 'idle' });
  };

  const updateAwardsHeader = (field: 'heading' | 'subheading', value: string) => {
    setData(prev => ({
      ...prev,
      awardsShowcase: {
        heading: prev.awardsShowcase?.heading || 'Awards & Recognition',
        subheading: prev.awardsShowcase?.subheading || '',
        awards: prev.awardsShowcase?.awards || [],
        [field]: value
      }
    }));
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
      return {
        ...prev,
        consultationConfig: nextConfig
      };
    });
    setHasUnsavedChanges(true);
    setSaveStatus({ state: 'idle' });
  };

  const handleSaveToFile = async () => {
    setSaveStatus({ state: 'saving', message: 'Writing directly to src/data/clinicInfo.ts on disk...' });
    try {
      const res = await saveClinicDataToFile(data);
      if (res.success) {
        setSaveStatus({ 
          state: 'saved', 
          message: 'Saved to src/data/clinicInfo.ts & siteCustomizations.json successfully!' 
        });
        setHasUnsavedChanges(false);
      } else {
        setSaveStatus({ state: 'error', message: res.error || 'Failed to save to disk' });
      }
    } catch (e) {
      setSaveStatus({ state: 'error', message: String(e) });
    }
  };

  const handleResetToDefault = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset to Factory Defaults',
      message: 'Are you sure you want to restore all clinic data to default original settings? This will clear custom clinic locations, contacts, and assets.',
      onConfirm: () => {
        const def = resetClinicDataToDefault();
        setData(def);
        setHasUnsavedChanges(true);
        setSaveStatus({ state: 'idle' });
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
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
    setEditingLocationIndex(null);
    setLocationDraft({
      id: `location-${Date.now()}`,
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
    const currentLocations = [...(data.locations || [])];
    if (editingLocationIndex !== null && editingLocationIndex >= 0) {
      currentLocations[editingLocationIndex] = locationDraft;
    } else {
      currentLocations.push(locationDraft);
    }
    updateField('locations', currentLocations);
    setModalType(null);
    setLocationDraft(null);
  };

  const deleteLocation = (index: number) => {
    const locToDelete = data.locations?.[index];
    const locName = locToDelete?.name || `Location #${index + 1}`;
    
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Clinic Location',
      message: `Are you sure you want to delete "${locName}"? Click "Confirm Delete" below to confirm.`,
      onConfirm: () => {
        const currentLocations = [...(data.locations || [])].filter((_, idx) => idx !== index);
        updateField('locations', currentLocations);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
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
    setEditingPillarIndex(null);
    setPillarDraft({
      id: `pillar-${Date.now()}`,
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
    const currentPillars = [...(data.whyChooseUs?.pillars || [])];
    if (editingPillarIndex !== null && editingPillarIndex >= 0) {
      currentPillars[editingPillarIndex] = pillarDraft;
    } else {
      currentPillars.push(pillarDraft);
    }
    updateField('whyChooseUs', {
      heading: data.whyChooseUs?.heading || 'Why choose Age Reversal Clinic London?',
      subheading: data.whyChooseUs?.subheading || '',
      pillars: currentPillars
    });
    setModalType(null);
    setPillarDraft(null);
  };

  const deletePillar = (index: number) => {
    const item = data.whyChooseUs?.pillars?.[index];
    const itemName = item?.title || `Pillar #${index + 1}`;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Pillar',
      message: `Are you sure you want to delete "${itemName}"?`,
      onConfirm: () => {
        const nextPillars = (data.whyChooseUs?.pillars || []).filter((_, idx) => idx !== index);
        updateField('whyChooseUs', {
          heading: data.whyChooseUs?.heading || 'Why choose Age Reversal Clinic London?',
          subheading: data.whyChooseUs?.subheading || '',
          pillars: nextPillars
        });
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Awards Showcase management
  const openEditAwardModal = (index: number) => {
    const target = data.awardsShowcase?.awards?.[index];
    if (!target) return;
    setEditingAwardIndex(index);
    setAwardDraft({ ...target });
    setModalType('award');
  };

  const openNewAwardModal = () => {
    setEditingAwardIndex(null);
    setAwardDraft({
      id: `aw-${Date.now()}`,
      title: '',
      organization: '',
      year: new Date().getFullYear().toString(),
      imageUrl: ''
    });
    setModalType('award');
  };

  const saveAwardDraft = () => {
    if (!awardDraft) return;
    const currentAwards = [...(data.awardsShowcase?.awards || [])];
    if (editingAwardIndex !== null && editingAwardIndex >= 0) {
      currentAwards[editingAwardIndex] = awardDraft;
    } else {
      currentAwards.push(awardDraft);
    }
    updateField('awardsShowcase', {
      heading: data.awardsShowcase?.heading || 'Awards & Recognition',
      subheading: data.awardsShowcase?.subheading || '',
      awards: currentAwards
    });
    setModalType(null);
    setAwardDraft(null);
  };

  const deleteAward = (index: number) => {
    const item = data.awardsShowcase?.awards?.[index];
    const itemName = item?.title || `Award #${index + 1}`;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Award',
      message: `Are you sure you want to delete "${itemName}"?`,
      onConfirm: () => {
        const nextAwards = (data.awardsShowcase?.awards || []).filter((_, idx) => idx !== index);
        updateField('awardsShowcase', {
          heading: data.awardsShowcase?.heading || 'Awards & Recognition',
          subheading: data.awardsShowcase?.subheading || '',
          awards: nextAwards
        });
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
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
    updateConsultationConfig(curr => {
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
      return {
        ...curr,
        doctors: nextDoctors,
      };
    });
    setModalType(null);
    setDoctorDraft(null);
  };

  const deleteDoctor = (index: number) => {
    const item = data.consultationConfig?.doctors?.[index];
    const itemName = item?.name || `Specialist #${index + 1}`;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Specialist',
      message: `Are you sure you want to remove "${itemName}" from Book Consultation?`,
      onConfirm: () => {
        updateConsultationConfig(curr => ({
          ...curr,
          doctors: (curr.doctors || []).filter((_, idx) => idx !== index),
        }));
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
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
    if (modalType === 'keywords') updateField('brandKeywords', arrayDraft);
    if (modalType === 'accreditations') updateField('accreditations', arrayDraft);
    if (modalType === 'payments') updateField('acceptedPayments', arrayDraft);
    if (modalType === 'specialties') updateField('medicalSpecialties', arrayDraft);
    if (modalType === 'languages') updateField('languagesSpoken', arrayDraft);
    if (modalType === 'interiorPhotos') updateField('interiorPhotos', arrayDraft);
    setModalType(null);
  };

  /**
   * Reusable Image Asset Field with:
   * 1. Direct text/URL editing
   * 2. "Add Image" file upload button (uploads directly to project assets/images on disk)
   * 3. Live image thumbnail preview
   * 4. Clear/Remove button
   */
  const renderImageField = (
    label: string, 
    value: string, 
    onChange: (val: string) => void, 
    targetKey: string,
    placeholder: string = '/assets/... or https://...'
  ) => {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase text-slate-700">{label}</label>
          <button
            type="button"
            onClick={() => triggerImageUpload((newUrl) => onChange(newUrl), targetKey, value)}
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
              onClick={() => onChange('')}
              className="px-2 py-2 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer"
              title="Clear Image"
            >
              Clear
            </button>
          )}
        </div>

        {value && (
          <div className="mt-1.5 flex items-center gap-3 p-2 bg-slate-100 border border-slate-200 rounded-lg">
            <img 
              src={value} 
              alt={label} 
              className="h-12 w-12 object-cover rounded border border-slate-300 bg-white"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="flex-1 min-w-0 text-xs">
              <span className="font-mono text-slate-600 block truncate">{value}</span>
              <span className="text-[10px] text-emerald-700 font-bold uppercase">Asset Active</span>
            </div>
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
            { id: 'code', label: '11. Raw Code Preview' }
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
                'ogImage'
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

        {/* SECTION 2: BRAND VISUAL ASSETS & LOGOS */}
        {(activeMenuOption === 'all' || activeMenuOption === 'assets') && (
          <section className="w-full border-b border-slate-200 py-8 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                  02 / Configuration
                </span>
                <h2 className="text-xl font-bold text-[#003334]">Brand Visual Assets & Logos</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono mt-1 sm:mt-0">
                Maps to CLINIC_DATA.logo, exteriorPhoto, interiorPhotos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderImageField(
                'Logo Icon Asset',
                data.logo?.icon || '',
                (val) => updateNestedField('logo', 'icon', val),
                'logo_icon',
                '/assets/logo.svg or image URL'
              )}

              {renderImageField(
                'Full Logo Asset',
                data.logo?.full || '',
                (val) => updateNestedField('logo', 'full', val),
                'logo_full',
                '/assets/logo-full.svg or image URL'
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

              <div className="col-span-full md:col-span-2">
                {renderImageField(
                  'Clinic Exterior Photo',
                  data.exteriorPhoto || '',
                  (val) => updateField('exteriorPhoto', val),
                  'exteriorPhoto',
                  '/assets/exterior.jpg or image URL'
                )}
              </div>

              <div className="col-span-full space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-700 block">
                      Interior Photo Assets ({data.interiorPhotos?.length || 0})
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openArrayModal('interiorPhotos')}
                      className="px-2.5 py-1.5 text-xs font-bold uppercase bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-800 cursor-pointer"
                    >
                      Manage Gallery
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {(data.interiorPhotos || []).map((url, i) => (
                    <div key={i} className="border border-slate-200 bg-white rounded-lg p-2 text-xs group relative hover:border-slate-300 transition-all">
                      <img 
                        src={url} 
                        alt={`Interior ${i + 1}`} 
                        className="w-full h-24 object-cover rounded bg-slate-100 mb-1.5 border border-slate-100"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.opacity = '0.4';
                        }}
                      />
                      <div className="truncate font-mono text-[11px] text-slate-700" title={url}>
                        {url}
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            triggerImageUpload(
                              (newUrl) => {
                                const updated = [...(data.interiorPhotos || [])];
                                updated[i] = newUrl;
                                updateField('interiorPhotos', updated);
                              },
                              `interior_${i}`,
                              url
                            )
                          }
                          className="text-[10px] uppercase font-bold text-[#003334] hover:underline cursor-pointer"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (data.interiorPhotos || []).filter((_, idx) => idx !== i);
                            updateField('interiorPhotos', updated);
                          }}
                          className="text-[10px] uppercase font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

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
        {(activeMenuOption === 'all' || activeMenuOption === 'accreditations') && (
          <section className="w-full border-b border-slate-200 py-8 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                  05 / Configuration
                </span>
                <h2 className="text-xl font-bold text-[#003334]">Clinical Accreditations & Compliance</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono mt-1 sm:mt-0">
                Maps to gmcRegistration, cqcStatus, accreditations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="col-span-full space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-slate-700">
                    Accreditations List ({data.accreditations?.length || 0})
                  </label>
                  <button
                    onClick={() => openArrayModal('accreditations')}
                    className="px-2.5 py-1 text-xs font-bold uppercase bg-slate-200 hover:bg-slate-300 rounded text-slate-800 cursor-pointer"
                  >
                    Edit Accreditations
                  </button>
                </div>
                <div className="space-y-1.5">
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
        )}

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
                      {loc.image && (
                        <img 
                          src={loc.image} 
                          alt={loc.name} 
                          className="h-12 w-12 sm:h-14 sm:w-14 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
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
                    {pillar.imageUrl && (
                      <img
                        src={pillar.imageUrl}
                        alt={pillar.title}
                        className="h-14 w-14 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
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
                    {award.imageUrl && (
                      <img
                        src={award.imageUrl}
                        alt={award.title}
                        className="h-14 w-14 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono font-bold text-[#c5a880] uppercase truncate">
                        {award.year || 'Year'} &middot; {award.organization || 'Organization'}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 truncate">{award.title || 'Untitled Award'}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
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

        {/* SECTION 11: RAW TYPESCRIPT CODE PREVIEW */}
        {(activeMenuOption === 'all' || activeMenuOption === 'code') && (
          <section className="w-full py-8 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                  11 / Source Code
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
                        onClick={() => triggerImageUpload((newUrl) => {
                          setLocationDraft({ ...locationDraft, image: newUrl });
                        }, 'loc_image', locationDraft.image)}
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
                        placeholder="/assets/clinic.jpg or image URL"
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
                    {locationDraft.image && (
                      <div className="mt-1 flex items-center gap-2 p-1.5 bg-slate-100 rounded-lg">
                        <img 
                          src={locationDraft.image} 
                          alt="Location Preview" 
                          className="h-10 w-10 object-cover rounded border border-slate-300"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                        <span className="font-mono text-slate-600 text-[11px] truncate">{locationDraft.image}</span>
                      </div>
                    )}
                  </div>

                  {/* Location Gallery Images (locations[i].gallery[i]) */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="font-bold uppercase text-slate-700">
                        Location Gallery ({locationDraft.gallery?.length || 0})
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          triggerImageUpload((newUrl) => {
                            const nextGallery = [...(locationDraft.gallery || []), newUrl];
                            setLocationDraft({ ...locationDraft, gallery: nextGallery });
                          }, 'loc_gallery_add')
                        }
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
                              <img
                                src={gUrl}
                                alt={`Gallery ${gIdx + 1}`}
                                className="h-8 w-8 object-cover rounded border border-slate-300 shrink-0"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                                }}
                              />
                              <span className="font-mono text-slate-600 text-[11px] truncate">{gUrl}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  triggerImageUpload(
                                    (newUrl) => {
                                      const nextGallery = [...(locationDraft.gallery || [])];
                                      nextGallery[gIdx] = newUrl;
                                      setLocationDraft({ ...locationDraft, gallery: nextGallery });
                                    },
                                    `loc_gallery_${gIdx}`,
                                    gUrl
                                  )
                                }
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
                        onClick={() => triggerImageUpload((newUrl) => {
                          setPillarDraft({ ...pillarDraft, imageUrl: newUrl });
                        }, 'pillar_image', pillarDraft.imageUrl)}
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
                        placeholder="/assets/pillar.jpg or image URL"
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
                    {pillarDraft.imageUrl && (
                      <div className="mt-1 flex items-center gap-2 p-1.5 bg-slate-100 rounded-lg">
                        <img
                          src={pillarDraft.imageUrl}
                          alt="Pillar Preview"
                          className="h-10 w-10 object-cover rounded border border-slate-300"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                        <span className="font-mono text-slate-600 text-[11px] truncate">{pillarDraft.imageUrl}</span>
                      </div>
                    )}
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
                        onClick={() => triggerImageUpload((newUrl) => {
                          setAwardDraft({ ...awardDraft, imageUrl: newUrl });
                        }, 'award_image', awardDraft.imageUrl)}
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
                    {awardDraft.imageUrl && (
                      <div className="mt-1 flex items-center gap-2 p-1.5 bg-slate-100 rounded-lg">
                        <img
                          src={awardDraft.imageUrl}
                          alt="Award Preview"
                          className="h-10 w-10 object-cover rounded border border-slate-300"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                        <span className="font-mono text-slate-600 text-[11px] truncate">{awardDraft.imageUrl}</span>
                      </div>
                    )}
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

              {/* EDIT ARRAY ITEMS */}
              {modalType !== 'location' && modalType !== 'pillar' && modalType !== 'award' && modalType !== 'doctor' && (
                <div className="space-y-4">
                  {modalType === 'interiorPhotos' && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Upload New Interior Photo</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => triggerImageUpload((newUrl) => {
                          setArrayDraft(prev => [...prev, newUrl]);
                        }, 'modal_interior')}
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
                              <img 
                                src={item} 
                                alt={`Item ${idx + 1}`} 
                                className="h-8 w-8 object-cover rounded bg-slate-200 shrink-0"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                              />
                            )}
                            <span className="truncate">{item}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {modalType === 'interiorPhotos' && (
                              <button
                                type="button"
                                onClick={() =>
                                  triggerImageUpload(
                                    (newUrl) => {
                                      setArrayDraft((prev) =>
                                        prev.map((val, i) => (i === idx ? newUrl : val))
                                      );
                                    },
                                    `modal_interior_${idx}`,
                                    item
                                  )
                                }
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
