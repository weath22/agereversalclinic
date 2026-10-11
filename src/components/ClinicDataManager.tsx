import React, { useState, useEffect, useRef } from 'react';
import { 
  getClinicData, 
  saveClinicDataToFile, 
  resetClinicDataToDefault,
  uploadAssetFile
} from '../lib/adminStore';
import { ClinicData, ClinicLocation } from '../data/clinicInfo';

export default function ClinicDataManager() {
  const [data, setData] = useState<ClinicData>(getClinicData());
  const [activeMenuOption, setActiveMenuOption] = useState<
    'all' | 'brand' | 'assets' | 'contact' | 'commercial' | 'accreditations' | 'locations' | 'socials' | 'code'
  >('all');
  
  const [saveStatus, setSaveStatus] = useState<{
    state: 'idle' | 'saving' | 'saved' | 'error';
    message?: string;
  }>({ state: 'idle' });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadCallbackRef = useRef<((url: string) => void) | null>(null);

  // Trigger file upload and callback
  const triggerImageUpload = (callback: (url: string) => void, targetName: string) => {
    uploadCallbackRef.current = callback;
    setUploadingTarget(targetName);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadCallbackRef.current) return;
    
    setSaveStatus({ state: 'saving', message: `Uploading ${file.name} to assets...` });
    try {
      const res = await uploadAssetFile(file);
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
    }
  };

  // Bottom Modal State (for mobile screens and quick item edit)
  const [modalType, setModalType] = useState<
    null | 'location' | 'keywords' | 'accreditations' | 'payments' | 'specialties' | 'languages' | 'interiorPhotos'
  >(null);
  const [editingLocationIndex, setEditingLocationIndex] = useState<number | null>(null);
  const [locationDraft, setLocationDraft] = useState<ClinicLocation | null>(null);
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
      message: `Are you sure you want to delete "${locName}"? Click "Delete Location" below to confirm.`,
      onConfirm: () => {
        const currentLocations = [...(data.locations || [])].filter((_, idx) => idx !== index);
        updateField('locations', currentLocations);
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
            onClick={() => triggerImageUpload((newUrl) => onChange(newUrl), targetKey)}
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
            { id: 'code', label: '08. Raw Code Preview' }
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
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (data.interiorPhotos || []).filter((_, idx) => idx !== i);
                          updateField('interiorPhotos', updated);
                        }}
                        className="mt-1 text-[10px] uppercase font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
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

        {/* SECTION 8: RAW TYPESCRIPT CODE PREVIEW */}
        {(activeMenuOption === 'all' || activeMenuOption === 'code') && (
          <section className="w-full py-8 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#c5a880] tracking-wider">
                  08 / Source Code
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
                  {modalType === 'location' ? 'Location Facility Editor' : 'Item Array Editor'}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#003334]">
                  {modalType === 'location' 
                    ? (editingLocationIndex !== null ? 'Edit Clinic Location' : 'Add New Clinic Location')
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
                        }, 'loc_image')}
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

              {/* EDIT ARRAY ITEMS */}
              {modalType !== 'location' && (
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
                          <button
                            onClick={() => removeArrayItem(idx)}
                            className="text-rose-600 hover:text-rose-800 font-bold uppercase text-[11px] px-2 py-0.5 rounded cursor-pointer shrink-0"
                          >
                            Remove
                          </button>
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
                onClick={modalType === 'location' ? saveLocationDraft : saveArrayDraft}
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
