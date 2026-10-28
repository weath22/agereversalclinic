import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Save,
  Check,
  Pencil,
  Trash2,
  Camera,
  Loader2,
  X,
  RotateCcw,
  FolderOpen,
  Layers,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  MASTER_BRANCH_CATEGORIES,
  MasterBranchCategory,
  SpecialistArea,
} from '../types';
import {
  getMasterServices,
  saveMasterServices,
  resetMasterServicesToDefaults,
  normalizeMasterBranch,
  inferTransformationCategoryFromBranch,
  uploadAssetFile,
  listProjectAssets,
} from '../lib/adminStore';

const BRANCH_BADGE_STYLES: Record<MasterBranchCategory, string> = {
  'Face & Injectables': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Body Sculpting': 'bg-amber-50 text-amber-800 border-amber-200',
  'Advanced Facials': 'bg-teal-50 text-teal-800 border-teal-200',
  'Hair & Beauty': 'bg-rose-50 text-rose-800 border-rose-200',
  'IV Drips & Wellness': 'bg-sky-50 text-sky-800 border-sky-200',
};

function slugifyServiceId(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `service-${Date.now()}`
  );
}

interface ServiceModalDraft {
  id: string;
  title: string;
  pricingCategory: MasterBranchCategory;
  image: string;
  description: string;
  price: string;
  duration: string;
  isNew: boolean;
}

export const MasterServicesManager: React.FC = () => {
  const [services, setServices] = useState<SpecialistArea[]>(() => getMasterServices());
  const [selectedBranch, setSelectedBranch] = useState<'ALL' | MasterBranchCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);

  // Add / Edit modal state
  const [modalDraft, setModalDraft] = useState<ServiceModalDraft | null>(null);
  const [isUploadingModalImage, setIsUploadingModalImage] = useState(false);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [projectAssets, setProjectAssets] = useState<string[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  // Confirmation modal state (no window.confirm)
  const [deleteTarget, setDeleteTarget] = useState<SpecialistArea | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setServices(getMasterServices());
    };
    window.addEventListener('master_services_updated', refresh);
    return () => window.removeEventListener('master_services_updated', refresh);
  }, []);

  const branchCounts = useMemo(() => {
    const counts: Record<MasterBranchCategory, number> = {
      'Face & Injectables': 0,
      'Body Sculpting': 0,
      'Advanced Facials': 0,
      'Hair & Beauty': 0,
      'IV Drips & Wellness': 0,
    };
    services.forEach((s) => {
      const branch = normalizeMasterBranch(s.pricingCategory || s.category, s.title);
      counts[branch] = (counts[branch] || 0) + 1;
    });
    return counts;
  }, [services]);

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return services.filter((service) => {
      const branch = normalizeMasterBranch(service.pricingCategory || service.category, service.title);
      if (selectedBranch !== 'ALL' && branch !== selectedBranch) return false;
      if (!q) return true;
      return (
        service.title.toLowerCase().includes(q) ||
        branch.toLowerCase().includes(q) ||
        (service.description || '').toLowerCase().includes(q)
      );
    });
  }, [services, selectedBranch, searchQuery]);

  const persistAndSync = (nextServices: SpecialistArea[], message = 'Synced across site') => {
    setIsSaving(true);
    try {
      const normalized = saveMasterServices(nextServices);
      setServices(normalized);
      setSaveSuccess(true);
      setStatusNote(message);
      setTimeout(() => {
        setSaveSuccess(false);
        setStatusNote(null);
      }, 2200);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = () => {
    persistAndSync(services, 'Saved & synced');
  };

  const handleInlineBranchChange = (serviceId: string, newBranch: MasterBranchCategory) => {
    const updated = services.map((s) =>
      s.id === serviceId
        ? {
            ...s,
            pricingCategory: newBranch,
            category: newBranch,
            transformationCategory: inferTransformationCategoryFromBranch(newBranch, s.title),
          }
        : s
    );
    persistAndSync(updated, `Moved to ${newBranch}`);
  };

  const uploadServiceImagePersisted = async (serviceId: string, file: File, previousUrl?: string): Promise<string | null> => {
    // Primary: Upload to general /api/admin/upload-asset endpoint (writes to public/assets & src/assets/images)
    // so Services & Branches images target the Homepage "Specialist Areas" cards without overwriting treatment pricing images
    const assetRes = await uploadAssetFile(file, previousUrl);
    if (assetRes.success && assetRes.url) {
      return assetRes.url;
    }

    // Fallback to direct dataUrl endpoint if needed
    const cleanId = slugifyServiceId(`specialist-area-${serviceId || file.name.replace(/\.[^/.]+$/, '')}`);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      const res = await fetch(`/api/admin/treatments/${encodeURIComponent(cleanId)}/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cleanId,
          fileName: file.name,
          dataUrl,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && (data.imagePath || data.rawPath)) {
          return data.imagePath || data.rawPath;
        }
      }
    } catch (err) {
      console.warn('Direct image endpoint fallback failed:', err);
    }

    return null;
  };

  const handleQuickPhotoUpload = async (serviceId: string, file: File) => {
    setUploadingCardId(serviceId);
    try {
      const currentService = services.find((s) => s.id === serviceId);
      const uploadedUrl = await uploadServiceImagePersisted(serviceId, file, currentService?.image);
      if (uploadedUrl) {
        const updated = services.map((s) =>
          s.id === serviceId
            ? {
                ...s,
                image: uploadedUrl,
                coverMedia: {
                  ...(s.coverMedia || {
                    mediaType: 'image',
                    altText: `${s.title} clinical aesthetic treatment at Age Reversal Clinic`,
                    seoTitle: `${s.title} - Specialist Care`,
                    seoKeywords: s.seoKeywords || [s.title.toLowerCase()],
                  }),
                  url: uploadedUrl,
                },
              }
            : s
        );
        persistAndSync(updated, 'Photo saved to Specialist Areas');
      }
    } catch (err) {
      console.error('Failed to upload card image:', err);
    } finally {
      setUploadingCardId(null);
    }
  };

  const openAddModal = () => {
    const defaultBranch: MasterBranchCategory =
      selectedBranch === 'ALL' ? 'Face & Injectables' : selectedBranch;
    setShowAssetPicker(false);
    setModalDraft({
      id: '',
      title: '',
      pricingCategory: defaultBranch,
      image: '/assets/images/treatments/specialist-profhilo.jpg',
      description: '',
      price: 'From £150',
      duration: '45–60 Mins',
      isNew: true,
    });
  };

  const openEditModal = (service: SpecialistArea) => {
    const branch = normalizeMasterBranch(service.pricingCategory || service.category, service.title);
    setShowAssetPicker(false);
    setModalDraft({
      id: service.id,
      title: service.title,
      pricingCategory: branch,
      image: service.image || '/assets/images/treatments/specialist-profhilo.jpg',
      description: service.description || '',
      price: service.price || 'From £150',
      duration: service.duration || '45–60 Mins',
      isNew: false,
    });
  };

  const handleModalImageUpload = async (file: File) => {
    if (!modalDraft) return;
    setIsUploadingModalImage(true);
    try {
      const targetId = modalDraft.id || slugifyServiceId(modalDraft.title || file.name);
      const uploadedUrl = await uploadServiceImagePersisted(targetId, file, modalDraft.image);
      if (uploadedUrl) {
        setModalDraft((prev) => (prev ? { ...prev, image: uploadedUrl } : null));
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploadingModalImage(false);
    }
  };

  const handleOpenAssetPicker = async () => {
    setShowAssetPicker((prev) => !prev);
    if (projectAssets.length === 0) {
      setIsLoadingAssets(true);
      try {
        const assets = await listProjectAssets();
        const urls = assets
          .filter((a) => a && typeof a.url === 'string' && a.mediaType !== 'video')
          .map((a) => a.url);
        setProjectAssets(urls);
      } finally {
        setIsLoadingAssets(false);
      }
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalDraft || !modalDraft.title.trim()) return;

    const cleanTitle = modalDraft.title.trim();
    const branch = modalDraft.pricingCategory;
    const transformationCategory = inferTransformationCategoryFromBranch(branch, cleanTitle);

    if (modalDraft.isNew) {
      const baseSlug = slugifyServiceId(cleanTitle);
      const existingIds = new Set(services.map((s) => s.id));
      let uniqueId = baseSlug;
      let counter = 2;
      while (existingIds.has(uniqueId)) {
        uniqueId = `${baseSlug}-${counter}`;
        counter += 1;
      }

      const resolvedNewImage = modalDraft.image.trim() || '/assets/images/treatments/specialist-profhilo.jpg';
      const newService: SpecialistArea = {
        id: uniqueId,
        number: String(services.length + 1).padStart(2, '0'),
        title: cleanTitle,
        description:
          modalDraft.description.trim() ||
          `Bespoke ${cleanTitle} treatment tailored for natural, clinically proven results.`,
        image: resolvedNewImage,
        coverMedia: {
          url: resolvedNewImage,
          mediaType: 'image',
          altText: `${cleanTitle} clinical aesthetic treatment at Age Reversal Clinic`,
          seoTitle: `${cleanTitle} - Specialist Care`,
          seoKeywords: [cleanTitle.toLowerCase()],
        },
        pricingCategory: branch,
        category: branch,
        transformationCategory,
        price: modalDraft.price.trim() || 'From £150',
        duration: modalDraft.duration.trim() || '45–60 Mins',
        icon: 'Sparkles',
      };

      const next = [...services, newService];
      persistAndSync(next, `Added "${cleanTitle}"`);
    } else {
      const next = services.map((s) => {
        if (s.id !== modalDraft.id) return s;
        const resolvedImg = modalDraft.image.trim() || s.image;
        return {
          ...s,
          title: cleanTitle,
          pricingCategory: branch,
          category: branch,
          transformationCategory,
          image: resolvedImg,
          coverMedia: {
            ...(s.coverMedia || {
              mediaType: 'image',
              altText: `${cleanTitle} clinical aesthetic treatment at Age Reversal Clinic`,
              seoTitle: `${cleanTitle} - Specialist Care`,
              seoKeywords: s.seoKeywords || [cleanTitle.toLowerCase()],
            }),
            url: resolvedImg,
          },
          description: modalDraft.description.trim() || s.description,
          price: modalDraft.price.trim() || s.price || 'From £150',
          duration: modalDraft.duration.trim() || s.duration || '45–60 Mins',
        };
      });
      persistAndSync(next, `Updated "${cleanTitle}"`);
    }

    setModalDraft(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const next = services
      .filter((s) => s.id !== deleteTarget.id)
      .map((s, idx) => ({
        ...s,
        number: String(idx + 1).padStart(2, '0'),
      }));
    const deletedTitle = deleteTarget.title;
    setDeleteTarget(null);
    persistAndSync(next, `Removed "${deletedTitle}"`);
  };

  const handleConfirmReset = () => {
    const defaults = resetMasterServicesToDefaults();
    setServices(defaults);
    setConfirmResetOpen(false);
    setSaveSuccess(true);
    setStatusNote('Reset to 24 default services');
    setTimeout(() => {
      setSaveSuccess(false);
      setStatusNote(null);
    }, 2200);
  };

  return (
    <div className="space-y-4">
      {/* Compact Header & Action Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#003334] text-[#c5a880] flex items-center justify-center shadow-sm">
              <Layers size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#003334]">Services & Branches</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                  {services.length}
                </span>
              </div>
              {statusNote && (
                <p className="text-[11px] font-medium text-emerald-600">{statusNote}</p>
              )}
            </div>
          </div>

          {/* Search + Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search service..."
                className="pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#003334] focus:bg-white w-44 sm:w-52 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#c5a880] text-[#003334] hover:bg-[#b8976c] transition-colors shadow-xs"
            >
              <Plus size={14} />
              <span>Add Service</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#003334] text-white hover:bg-[#004d4e]'
              }`}
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : saveSuccess ? (
                <Check size={14} />
              ) : (
                <Save size={14} />
              )}
              <span>{saveSuccess ? 'Synced' : 'Save & Sync'}</span>
            </button>

            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              title="Reset to 24 default services"
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-[#003334] hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* 6 Compact Branch Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setSelectedBranch('ALL')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedBranch === 'ALL'
                ? 'bg-[#003334] text-white shadow-xs'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>All</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                selectedBranch === 'ALL'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200/80 text-gray-700'
              }`}
            >
              {services.length}
            </span>
          </button>

          {MASTER_BRANCH_CATEGORIES.map((branch) => {
            const active = selectedBranch === branch;
            const count = branchCounts[branch] || 0;
            return (
              <button
                key={branch}
                type="button"
                onClick={() => setSelectedBranch(branch)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#003334] text-white shadow-xs'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{branch}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                    active ? 'bg-[#c5a880] text-[#003334]' : 'bg-gray-200/80 text-gray-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Service Cards Grid (Minimal Text) */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">No matching services.</p>
          <button
            type="button"
            onClick={openAddModal}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#003334] text-white"
          >
            <Plus size={14} />
            <span>Add Service</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredServices.map((service, index) => {
            const branch = normalizeMasterBranch(
              service.pricingCategory || service.category,
              service.title
            );
            const badgeStyle = BRANCH_BADGE_STYLES[branch];
            const isUploading = uploadingCardId === service.id;

            return (
              <div
                key={service.id}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#c5a880]/60 transition-all flex flex-col"
              >
                {/* Thumbnail Image with Quick Camera Overlay */}
                <div className="relative h-32 bg-gray-100 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/assets/images/treatments/specialist-profhilo.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15" />

                  {/* Number Badge */}
                  <span className="absolute top-2 left-2 text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/55 text-white backdrop-blur-xs">
                    {service.number || String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Quick Camera Swap Overlay + Edit / Delete Icons */}
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <label
                      title="Change photo"
                      className="cursor-pointer p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-700 hover:text-[#003334] shadow-xs transition-colors"
                    >
                      {isUploading ? (
                        <Loader2 size={13} className="animate-spin text-[#003334]" />
                      ) : (
                        <Camera size={13} />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleQuickPhotoUpload(service.id, file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => openEditModal(service)}
                      title="Edit service"
                      className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-700 hover:text-[#003334] shadow-xs transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(service)}
                      title="Delete service"
                      className="p-1.5 rounded-lg bg-white/90 hover:bg-rose-50 text-gray-600 hover:text-rose-600 shadow-xs transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Card Body: Service Name + Inline Branch Selector */}
                <div className="p-3 flex-1 flex flex-col justify-between gap-2.5">
                  <h3
                    className="text-sm font-bold text-[#003334] leading-snug line-clamp-1"
                    title={service.title}
                  >
                    {service.title}
                  </h3>

                  {/* Inline Branch Dropdown Selector */}
                  <div className="relative">
                    <select
                      value={branch}
                      onChange={(e) =>
                        handleInlineBranchChange(
                          service.id,
                          e.target.value as MasterBranchCategory
                        )
                      }
                      aria-label={`Branch for ${service.title}`}
                      className={`w-full appearance-none text-[11px] font-semibold pl-2.5 pr-6 py-1.5 rounded-lg border cursor-pointer focus:outline-none transition-colors ${badgeStyle}`}
                    >
                      {MASTER_BRANCH_CATEGORIES.map((b) => (
                        <option key={b} value={b} className="bg-white text-gray-800">
                          {b}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-70"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clean Add / Edit Service Modal */}
      {modalDraft && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-[#003334] text-white">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#c5a880]" />
                <h3 className="text-sm font-bold">
                  {modalDraft.isNew ? 'Add Service' : 'Edit Service'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalDraft(null)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-3.5">
              {/* Service Name */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={modalDraft.title}
                  onChange={(e) =>
                    setModalDraft((prev) => (prev ? { ...prev, title: e.target.value } : null))
                  }
                  placeholder="e.g. Profhilo 2ml"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#003334]"
                />
              </div>

              {/* Parent Branch Dropdown */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Branch
                </label>
                <select
                  value={modalDraft.pricingCategory}
                  onChange={(e) =>
                    setModalDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            pricingCategory: e.target.value as MasterBranchCategory,
                          }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#003334]"
                >
                  {MASTER_BRANCH_CATEGORIES.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Cover Photo
                </label>
                <div className="flex items-center gap-2.5">
                  <img
                    src={modalDraft.image}
                    alt={modalDraft.title || 'Preview'}
                    className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0 bg-gray-50"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/assets/images/treatments/specialist-profhilo.jpg';
                    }}
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={modalDraft.image}
                      onChange={(e) =>
                        setModalDraft((prev) =>
                          prev ? { ...prev, image: e.target.value } : null
                        )
                      }
                      placeholder="/assets/images/treatments/..."
                      className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#003334]"
                    />
                    <div className="flex items-center gap-1.5">
                      <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                        {isUploadingModalImage ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Camera size={12} />
                        )}
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleModalImageUpload(file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleOpenAssetPicker}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        <FolderOpen size={12} />
                        <span>Library</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Compact Asset Picker */}
                {showAssetPicker && (
                  <div className="mt-2 p-2 border border-gray-200 rounded-lg bg-gray-50 max-h-36 overflow-y-auto">
                    {isLoadingAssets ? (
                      <div className="flex items-center justify-center py-4 text-xs text-gray-500 gap-1.5">
                        <Loader2 size={13} className="animate-spin" />
                        <span>Loading photos...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-5 gap-1.5">
                        {projectAssets.slice(0, 40).map((asset) => (
                          <button
                            key={asset}
                            type="button"
                            onClick={() => {
                              setModalDraft((prev) =>
                                prev ? { ...prev, image: asset } : null
                              );
                              setShowAssetPicker(false);
                            }}
                            className={`relative h-11 rounded overflow-hidden border-2 transition-all ${
                              modalDraft.image === asset
                                ? 'border-[#003334]'
                                : 'border-transparent hover:border-[#c5a880]'
                            }`}
                          >
                            <img
                              src={asset}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Short Description (compact 2-line input) */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={modalDraft.description}
                  onChange={(e) =>
                    setModalDraft((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                  placeholder="Brief clinical summary..."
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#003334] resize-none"
                />
              </div>

              {/* Starting Price & Duration */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    value={modalDraft.price}
                    onChange={(e) =>
                      setModalDraft((prev) =>
                        prev ? { ...prev, price: e.target.value } : null
                      )
                    }
                    placeholder="From £150"
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#003334]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={modalDraft.duration}
                    onChange={(e) =>
                      setModalDraft((prev) =>
                        prev ? { ...prev, duration: e.target.value } : null
                      )
                    }
                    placeholder="45–60 Mins"
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#003334]"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalDraft(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#003334] text-white hover:bg-[#004d4e] transition-colors"
                >
                  <Check size={14} />
                  <span>{modalDraft.isNew ? 'Add & Sync' : 'Save & Sync'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Compact Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#003334]">Remove Service?</h4>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={15} />
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Remove <span className="font-semibold text-gray-900">{deleteTarget.title}</span> from
              all synced sections?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compact Reset Confirmation Modal */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#003334]">Reset to 24 Defaults?</h4>
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={15} />
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Restore the default 24 services and branch assignments across the site.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#003334] text-white hover:bg-[#004d4e]"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
