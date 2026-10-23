"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  getBeforeAfterGalleryConfig,
  saveBeforeAfterGalleryConfig,
  fetchRemoteBeforeAfterGalleryConfig,
  uploadBeforeAfterWebpImage,
  resetAdminStoreToDefaults,
  getTreatmentPricingData,
  listProjectAssets,
} from '../lib/adminStore';
import {
  BeforeAfterGalleryConfig,
  BeforeAfterPair,
  ExistingTreatmentGroupId,
} from '../types';
import { EXISTING_BEFORE_AFTER_TREATMENT_GROUPS } from '../data/transformationsData';
import {
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Sparkles,
  Search,
  MoreVertical,
  ArrowLeftRight,
  Tag,
  Eye,
  EyeOff,
  Star,
  Upload,
  X,
  Clock,
  Layers,
  Wand2,
  AlertTriangle,
  Link2,
  Image as ImageIcon,
  FolderOpen,
} from 'lucide-react';

interface FlattenedPairItem {
  pair: BeforeAfterPair;
  groupId: string;
  groupName: string;
}

interface EditorModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  focusSection?: 'details' | 'seo';
  groupId: string;
  pair: BeforeAfterPair;
}

interface ProjectAssetItem {
  name: string;
  url: string;
  mediaType?: 'image' | 'video';
  category?: string;
  altText?: string;
  seoKeywords?: string[];
}

export default function GalleryEditor() {
  const [config, setConfig] = useState<BeforeAfterGalleryConfig | null>(() =>
    getBeforeAfterGalleryConfig()
  );
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuPairId, setOpenMenuPairId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compact Delete Confirmation Modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    groupId: string;
    pairId: string;
    title: string;
  } | null>(null);

  // Create / Edit Modal & Mobile Bottom Sheet state
  const [editorModal, setEditorModal] = useState<EditorModalState | null>(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [uploadingSlot, setUploadingSlot] = useState<'before' | 'after' | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<'before' | 'after' | null>(null);

  // Asset Library Picker state (for Step 2 "Pick from Asset Library")
  const [assetPickerSlot, setAssetPickerSlot] = useState<'before' | 'after' | null>(null);
  const [assetLibraryItems, setAssetLibraryItems] = useState<ProjectAssetItem[]>([]);
  const [assetSearch, setAssetSearch] = useState('');
  const [loadingAssets, setLoadingAssets] = useState(false);

  const beforeFileInputRef = useRef<HTMLInputElement | null>(null);
  const afterFileInputRef = useRef<HTMLInputElement | null>(null);
  const seoStepRef = useRef<HTMLDivElement | null>(null);

  // Load existing catalog treatments for Step 1 linking & Step 3 keyword generation
  const existingTreatments = useMemo(() => {
    try {
      return getTreatmentPricingData().filter((t) => !t.hidden && t.isActive !== false);
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    setConfig(getBeforeAfterGalleryConfig());
    if (typeof window !== 'undefined' && !window.localStorage.getItem('homepage_gallery_config_v6')) {
      fetchRemoteBeforeAfterGalleryConfig().then((remote) => {
        if (remote) setConfig(remote);
      });
    }
  }, []);

  // Scroll to Step 3 when opened via "Manage SEO & Alt Text"
  useEffect(() => {
    if (editorModal?.isOpen && editorModal.focusSection === 'seo') {
      const timer = setTimeout(() => {
        seoStepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [editorModal?.isOpen, editorModal?.focusSection]);

  // Close 3-dot dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuPairId(null);
    if (openMenuPairId) {
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuPairId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const persistConfig = (nextConfig: BeforeAfterGalleryConfig, message?: string) => {
    setConfig(nextConfig);
    saveBeforeAfterGalleryConfig(nextConfig);
    if (message) showToast(message);
  };

  const handleReset = () => {
    resetAdminStoreToDefaults();
    const fresh = getBeforeAfterGalleryConfig();
    setConfig(fresh);
    showToast('Restored default Before & After pairs');
  };

  // Helper to build Google Image Search Alt Text & SEO Title from treatment/group
  const buildAutoSeoMetadata = (
    groupId: string,
    treatmentTitle: string,
    caseTitle: string,
    duration?: string
  ) => {
    const groupMeta =
      EXISTING_BEFORE_AFTER_TREATMENT_GROUPS.find((g) => g.id === groupId) ||
      EXISTING_BEFORE_AFTER_TREATMENT_GROUPS[0];
    const subject = treatmentTitle.trim() || caseTitle.trim() || groupMeta.name;
    const durationSuffix = duration?.trim() ? ` (${duration.trim()})` : '';

    return {
      beforeAltText: `Before ${subject} treatment at Age Reversal Clinics London — baseline clinical photography`,
      afterAltText: `After ${subject} treatment result${durationSuffix} at Age Reversal Clinics London — verified transformation`,
      seoTitle: `${subject} Before & After Results${durationSuffix} | Age Reversal Clinics London`,
    };
  };

  // Helper to generate clinical SEO keywords for a treatment + group
  const buildClinicalSeoKeywords = (
    groupId: string,
    treatmentId?: string,
    treatmentTitle?: string,
    caseTitle?: string
  ): string[] => {
    const groupMeta =
      EXISTING_BEFORE_AFTER_TREATMENT_GROUPS.find((g) => g.id === groupId) ||
      EXISTING_BEFORE_AFTER_TREATMENT_GROUPS[0];
    const matchedTreatment = existingTreatments.find(
      (t) =>
        (treatmentId && t.id === treatmentId) ||
        (treatmentTitle && t.title.toLowerCase() === treatmentTitle.toLowerCase())
    );

    const subject = (
      matchedTreatment?.title ||
      treatmentTitle ||
      caseTitle ||
      groupMeta.name
    )
      .trim()
      .toLowerCase();

    const keywords = new Set<string>();
    keywords.add(`before and after ${subject} london`);
    keywords.add(`${subject} before and after`);
    keywords.add(`age reversal clinics ${subject} results`);
    keywords.add(`${groupMeta.name.toLowerCase()} results london`);
    groupMeta.defaultKeywords.forEach((k) => keywords.add(k.toLowerCase()));
    if (matchedTreatment?.seoKeywords) {
      matchedTreatment.seoKeywords.forEach((k) => keywords.add(k.toLowerCase()));
    }
    return Array.from(keywords);
  };

  // Flatten all pairs across existing treatment groups for filtering & counts
  const allFlattenedPairs = useMemo<FlattenedPairItem[]>(() => {
    if (!config) return [];
    const list: FlattenedPairItem[] = [];
    config.categories.forEach((cat) => {
      (cat.pairs || []).forEach((pair) => {
        list.push({
          pair,
          groupId: cat.id,
          groupName: cat.name,
        });
      });
    });
    return list;
  }, [config]);

  // Group counts for filter pills
  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: allFlattenedPairs.length };
    EXISTING_BEFORE_AFTER_TREATMENT_GROUPS.forEach((g) => {
      counts[g.id] = 0;
    });
    allFlattenedPairs.forEach((item) => {
      counts[item.groupId] = (counts[item.groupId] || 0) + 1;
    });
    return counts;
  }, [allFlattenedPairs]);

  // Filtered pairs by group pill + search query
  const filteredPairs = useMemo(() => {
    return allFlattenedPairs.filter(({ pair, groupId, groupName }) => {
      if (activeGroupFilter !== 'ALL' && groupId !== activeGroupFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const inTitle = pair.title.toLowerCase().includes(q);
      const inGroup = groupName.toLowerCase().includes(q);
      const inTreatment = (pair.linkedTreatmentTitle || '').toLowerCase().includes(q);
      const inKeywords = (pair.seoKeywords || []).some((k) => k.toLowerCase().includes(q));
      return inTitle || inGroup || inTreatment || inKeywords;
    });
  }, [allFlattenedPairs, activeGroupFilter, searchQuery]);

  // Treatments sorted so procedures matching the selected treatment group appear first
  const groupedTreatmentsForModal = useMemo(() => {
    if (!editorModal) return { matching: [], others: [] };
    const groupMeta = EXISTING_BEFORE_AFTER_TREATMENT_GROUPS.find(
      (g) => g.id === editorModal.groupId
    );
    const targetCategory = groupMeta?.pricingCategory;
    const matching = existingTreatments.filter((t) => t.category === targetCategory);
    const others = existingTreatments.filter((t) => t.category !== targetCategory);
    return {
      groupCategoryName: targetCategory || 'Recommended Procedures',
      matching,
      others,
    };
  }, [editorModal?.groupId, existingTreatments]);

  // Suggested keywords for the currently selected treatment & group in the modal
  const modalSuggestedKeywords = useMemo(() => {
    if (!editorModal) return [];
    const candidates = buildClinicalSeoKeywords(
      editorModal.groupId,
      editorModal.pair.linkedTreatmentId,
      editorModal.pair.linkedTreatmentTitle,
      editorModal.pair.title
    );
    const currentSet = new Set(
      (editorModal.pair.seoKeywords || []).map((k) => k.toLowerCase())
    );
    return candidates.filter((k) => !currentSet.has(k.toLowerCase()));
  }, [editorModal, existingTreatments]);

  const filteredAssetsForPicker = useMemo(() => {
    if (!assetSearch.trim()) return assetLibraryItems;
    const q = assetSearch.toLowerCase().trim();
    return assetLibraryItems.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.category || '').toLowerCase().includes(q) ||
        (a.altText || '').toLowerCase().includes(q)
    );
  }, [assetLibraryItems, assetSearch]);

  if (!config) return null;

  // Open Modal / Bottom Sheet to Create a new Before & After pair
  const openCreateModal = () => {
    const defaultGroupId =
      activeGroupFilter !== 'ALL'
        ? activeGroupFilter
        : EXISTING_BEFORE_AFTER_TREATMENT_GROUPS[0].id;
    const groupMeta =
      EXISTING_BEFORE_AFTER_TREATMENT_GROUPS.find((g) => g.id === defaultGroupId) ||
      EXISTING_BEFORE_AFTER_TREATMENT_GROUPS[0];

    const firstMatchingTreatment = existingTreatments.find(
      (t) => t.category === groupMeta.pricingCategory
    );

    const initialTreatmentId = firstMatchingTreatment?.id || '';
    const initialTreatmentTitle = firstMatchingTreatment?.title || '';
    const initialDuration = '6 Weeks • 3 Sessions';
    const autoMeta = buildAutoSeoMetadata(
      groupMeta.id,
      initialTreatmentTitle,
      initialTreatmentTitle || `${groupMeta.name} Case`,
      initialDuration
    );
    const initialKeywords = buildClinicalSeoKeywords(
      groupMeta.id,
      initialTreatmentId,
      initialTreatmentTitle,
      initialTreatmentTitle
    );

    const newPair: BeforeAfterPair = {
      id: `pair-${Date.now()}`,
      title: initialTreatmentTitle ? `${initialTreatmentTitle} Transformation` : '',
      treatmentGroupId: groupMeta.id,
      linkedTreatmentId: initialTreatmentId,
      linkedTreatmentTitle: initialTreatmentTitle,
      beforeImage: '',
      afterImage: '',
      beforeAltText: autoMeta.beforeAltText,
      afterAltText: autoMeta.afterAltText,
      seoTitle: autoMeta.seoTitle,
      seoKeywords: initialKeywords,
      duration: initialDuration,
      sessions: 3,
      featured: false,
      hidden: false,
      updatedAt: Date.now(),
    };

    setKeywordInput('');
    setEditorModal({
      isOpen: true,
      mode: 'create',
      focusSection: 'details',
      groupId: groupMeta.id,
      pair: newPair,
    });
  };

  // Open Modal / Bottom Sheet to Edit an existing Before & After pair
  const openEditModal = (
    groupId: string,
    pair: BeforeAfterPair,
    focusSection: 'details' | 'seo' = 'details'
  ) => {
    const autoMeta = buildAutoSeoMetadata(
      groupId,
      pair.linkedTreatmentTitle || '',
      pair.title,
      pair.duration
    );
    setKeywordInput('');
    setEditorModal({
      isOpen: true,
      mode: 'edit',
      focusSection,
      groupId,
      pair: {
        ...pair,
        treatmentGroupId: pair.treatmentGroupId || groupId,
        beforeAltText: pair.beforeAltText || autoMeta.beforeAltText,
        afterAltText: pair.afterAltText || autoMeta.afterAltText,
        seoTitle: pair.seoTitle || autoMeta.seoTitle,
        seoKeywords: Array.isArray(pair.seoKeywords) ? [...pair.seoKeywords] : [],
      },
    });
  };

  // Open Asset Library Picker for 'before' or 'after' slot
  const openAssetLibraryPicker = async (slot: 'before' | 'after') => {
    setAssetPickerSlot(slot);
    setAssetSearch('');
    setLoadingAssets(true);
    try {
      const assets = await listProjectAssets();
      const imageAssets = assets.filter((a) => a.mediaType !== 'video');
      setAssetLibraryItems(imageAssets);
    } catch (err) {
      console.warn('Could not load asset library:', err);
    } finally {
      setLoadingAssets(false);
    }
  };

  // Quick Action on Card: Swap Before & After Photos
  const handleQuickSwapPhotos = (groupId: string, pairId: string) => {
    const nextConfig: BeforeAfterGalleryConfig = {
      ...config,
      categories: config.categories.map((cat) => {
        if (cat.id !== groupId) return cat;
        return {
          ...cat,
          pairs: cat.pairs.map((p) =>
            p.id === pairId
              ? {
                  ...p,
                  beforeImage: p.afterImage,
                  afterImage: p.beforeImage,
                  beforeAltText: p.afterAltText,
                  afterAltText: p.beforeAltText,
                  updatedAt: Date.now(),
                }
              : p
          ),
        };
      }),
    };
    persistConfig(nextConfig, 'Swapped Before ⇄ After photos');
  };

  // Step 2 Action inside Modal: 1-Click Swap Before ⇄ After
  const handleModalSwapPhotos = () => {
    if (!editorModal) return;
    setEditorModal({
      ...editorModal,
      pair: {
        ...editorModal.pair,
        beforeImage: editorModal.pair.afterImage,
        afterImage: editorModal.pair.beforeImage,
        beforeAltText: editorModal.pair.afterAltText,
        afterAltText: editorModal.pair.beforeAltText,
        updatedAt: Date.now(),
      },
    });
  };

  // Quick Action: Toggle Featured or Hidden flag
  const handleTogglePairFlag = (
    groupId: string,
    pairId: string,
    flag: 'featured' | 'hidden'
  ) => {
    let statusMsg = '';
    const nextConfig: BeforeAfterGalleryConfig = {
      ...config,
      categories: config.categories.map((cat) => {
        if (cat.id !== groupId) return cat;
        return {
          ...cat,
          pairs: cat.pairs.map((p) => {
            if (p.id !== pairId) return p;
            const nextVal = !p[flag];
            statusMsg =
              flag === 'featured'
                ? nextVal
                  ? 'Marked as Featured result'
                  : 'Removed from Featured'
                : nextVal
                ? 'Hidden from public gallery'
                : 'Visible on public gallery';
            return { ...p, [flag]: nextVal, updatedAt: Date.now() };
          }),
        };
      }),
    };
    persistConfig(nextConfig, statusMsg);
  };

  // Confirm Delete Pair
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const nextConfig: BeforeAfterGalleryConfig = {
      ...config,
      categories: config.categories.map((cat) => {
        if (cat.id !== deleteTarget.groupId) return cat;
        return {
          ...cat,
          pairs: cat.pairs.filter((p) => p.id !== deleteTarget.pairId),
        };
      }),
    };
    setDeleteTarget(null);
    persistConfig(nextConfig, 'Deleted Before & After pair');
  };

  // Convert uploaded file to optimized WebP and upload to /api/admin/upload-asset
  const handleImageFileUpload = async (file: File, slot: 'before' | 'after') => {
    if (!editorModal) return;
    setUploadingSlot(slot);

    try {
      const webpDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new window.Image();
          img.onload = () => {
            const maxDim = 1400;
            let width = img.width;
            let height = img.height;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(reader.result as string);
              return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/webp', 0.88));
          };
          img.onerror = reject;
          img.src = reader.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const baseSlug = (
        editorModal.pair.linkedTreatmentTitle ||
        editorModal.pair.title ||
        editorModal.pair.id ||
        'before-after'
      )
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const fileName = `ba-${baseSlug}-${slot}.webp`;

      const uploaded = await uploadBeforeAfterWebpImage({
        fileName,
        dataUrl: webpDataUrl,
        slot,
        pairId: editorModal.pair.id,
      });

      let finalUrl = webpDataUrl;
      if (uploaded?.url) {
        finalUrl = `${uploaded.url}?v=${Date.now()}`;
      }

      setEditorModal((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          pair: {
            ...prev.pair,
            [slot === 'before' ? 'beforeImage' : 'afterImage']: finalUrl,
            updatedAt: Date.now(),
          },
        };
      });
    } catch (err) {
      console.error('Error uploading Before/After photo:', err);
    } finally {
      setUploadingSlot(null);
    }
  };

  // Step 3: 1-Click Auto-Suggest Clinical SEO Keywords & Auto-Fill Alt Texts
  const handleAutoSuggestClinicalSeo = () => {
    if (!editorModal) return;
    const { pair, groupId } = editorModal;
    const generatedKeywords = buildClinicalSeoKeywords(
      groupId,
      pair.linkedTreatmentId,
      pair.linkedTreatmentTitle,
      pair.title
    );
    const mergedKeywords = Array.from(
      new Set([...(pair.seoKeywords || []), ...generatedKeywords])
    );
    const autoMeta = buildAutoSeoMetadata(
      groupId,
      pair.linkedTreatmentTitle || '',
      pair.title,
      pair.duration
    );

    setEditorModal({
      ...editorModal,
      pair: {
        ...pair,
        beforeAltText: autoMeta.beforeAltText,
        afterAltText: autoMeta.afterAltText,
        seoTitle: autoMeta.seoTitle,
        seoKeywords: mergedKeywords,
      },
    });
  };

  // Save Pair from Modal / Bottom Sheet
  const handleSaveModalPair = () => {
    if (!editorModal) return;
    const { mode, groupId, pair } = editorModal;

    const groupMeta =
      EXISTING_BEFORE_AFTER_TREATMENT_GROUPS.find((g) => g.id === groupId) ||
      EXISTING_BEFORE_AFTER_TREATMENT_GROUPS[0];

    const finalTitle =
      pair.title.trim() ||
      (pair.linkedTreatmentTitle
        ? `${pair.linkedTreatmentTitle} Transformation`
        : `${groupMeta.name} Transformation`);

    const autoMeta = buildAutoSeoMetadata(
      groupId,
      pair.linkedTreatmentTitle || '',
      finalTitle,
      pair.duration
    );

    const finalPair: BeforeAfterPair = {
      ...pair,
      title: finalTitle,
      treatmentGroupId: groupId as ExistingTreatmentGroupId,
      beforeAltText: pair.beforeAltText?.trim() || autoMeta.beforeAltText,
      afterAltText: pair.afterAltText?.trim() || autoMeta.afterAltText,
      seoTitle: pair.seoTitle?.trim() || autoMeta.seoTitle,
      seoKeywords:
        pair.seoKeywords && pair.seoKeywords.length > 0
          ? pair.seoKeywords
          : buildClinicalSeoKeywords(
              groupId,
              pair.linkedTreatmentId,
              pair.linkedTreatmentTitle,
              finalTitle
            ),
      updatedAt: Date.now(),
    };

    const nextCategories = config.categories.map((cat) => {
      const filtered = cat.pairs.filter((p) => p.id !== finalPair.id);
      if (cat.id !== groupId) {
        return { ...cat, pairs: filtered };
      }
      if (mode === 'create') {
        return { ...cat, pairs: [finalPair, ...filtered] };
      }
      const existsInTarget = cat.pairs.some((p) => p.id === finalPair.id);
      return {
        ...cat,
        pairs: existsInTarget
          ? cat.pairs.map((p) => (p.id === finalPair.id ? finalPair : p))
          : [finalPair, ...filtered],
      };
    });

    const nextConfig: BeforeAfterGalleryConfig = {
      ...config,
      categories: nextCategories,
    };

    setEditorModal(null);
    persistConfig(
      nextConfig,
      mode === 'create'
        ? 'Added Before & After pair & synced SEO keywords to treatment'
        : 'Updated Before & After pair & synced SEO keywords to treatment'
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Main Container */}
      <div className="bg-white -mx-4 -my-4 sm:mx-0 sm:my-0 rounded-none sm:rounded-3xl border-y sm:border border-slate-200 p-4 sm:p-5 md:p-7 shadow-sm space-y-6">
        {/* Compact Top Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#003334]/5 border border-[#003334]/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-[#003334]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg md:text-xl text-[#003334]">
                Before & After Images
              </h3>
              <p className="text-xs text-slate-500">
                Add Before & After pairs under existing treatment groups with Google Image Search SEO.
              </p>
            </div>
          </div>

          {/* Search + Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases, treatments, SEO tags..."
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]/20 focus:border-[#003334]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openCreateModal}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#003334] hover:bg-[#236963] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span> Add Before & After</span>
              </button>

              <button
                onClick={handleReset}
                title="Restore Default Pairs"
                className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Existing Treatment Group Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveGroupFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeGroupFilter === 'ALL'
                ? 'bg-[#003334] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <span>All Groups</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeGroupFilter === 'ALL'
                  ? 'bg-white/20 text-white'
                  : 'bg-white text-slate-500'
              }`}
            >
              {groupCounts.ALL || 0}
            </span>
          </button>

          {EXISTING_BEFORE_AFTER_TREATMENT_GROUPS.map((group) => {
            const isActive = activeGroupFilter === group.id;
            const count = groupCounts[group.id] || 0;
            return (
              <button
                key={group.id}
                onClick={() => setActiveGroupFilter(group.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#003334] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <span>{group.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-800">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Clean Visual Before & After Card Grid */}
        {filteredPairs.length === 0 ? (
          <div className="text-center py-14 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-700">No Before & After pairs found</p>
              <p className="text-xs text-slate-500">
                Add a Before & After transformation under an existing treatment group.
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 bg-[#003334] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#236963] transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Add Before & After</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPairs.map(({ pair, groupId, groupName }) => {
              const seoTagCount = (pair.seoKeywords || []).length;
              const isMenuOpen = openMenuPairId === pair.id;

              return (
                <div
                  key={pair.id}
                  className={`group bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                    pair.hidden
                      ? 'border-slate-200 opacity-65'
                      : 'border-slate-200/90 hover:border-[#003334]/40 hover:shadow-md'
                  }`}
                >
                  {/* Side-by-Side Before & After Visual Thumbnail Preview */}
                  <div
                    onClick={() => openEditModal(groupId, pair, 'details')}
                    className="relative grid grid-cols-2 gap-0.5 bg-slate-100 aspect-[16/10] cursor-pointer overflow-hidden"
                  >
                    {/* Before Image */}
                    <div className="relative w-full h-full bg-slate-100 overflow-hidden">
                      {pair.beforeImage ? (
                        <img
                          src={pair.beforeImage}
                          alt={pair.beforeAltText || `${pair.title} Before`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-400 font-medium">
                          No Before
                        </div>
                      )}
                      <span className="absolute bottom-2 left-2 bg-black/65 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        Before
                      </span>
                    </div>

                    {/* After Image */}
                    <div className="relative w-full h-full bg-slate-100 overflow-hidden">
                      {pair.afterImage ? (
                        <img
                          src={pair.afterImage}
                          alt={pair.afterAltText || `${pair.title} After`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-400 font-medium">
                          No After
                        </div>
                      )}
                      <span className="absolute bottom-2 right-2 bg-[#003334]/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        After
                      </span>
                    </div>

                    {/* Top Left Group Badge + Status Pills */}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1 max-w-[80%]">
                      <span className="bg-white/95 backdrop-blur-sm text-[#003334] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm truncate">
                        {groupName}
                      </span>
                      {pair.featured && (
                        <span className="bg-amber-400 text-amber-950 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm inline-flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 fill-current" />
                          Featured
                        </span>
                      )}
                      {pair.hidden && (
                        <span className="bg-slate-800/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm inline-flex items-center gap-0.5">
                          <EyeOff className="h-2.5 w-2.5" />
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Minimal Card Body */}
                  <div className="p-4 flex items-start justify-between gap-2">
                    <div
                      onClick={() => openEditModal(groupId, pair, 'details')}
                      className="space-y-2 min-w-0 flex-1 cursor-pointer"
                    >
                      <h4 className="font-serif font-bold text-sm text-[#003334] truncate">
                        {pair.title}
                      </h4>

                      {/* Compact Metadata Chips: Linked Treatment, Duration, SEO Keyword Count */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {pair.linkedTreatmentTitle && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#003334]/8 text-[#003334] px-2 py-0.5 rounded-md truncate max-w-[180px]">
                            <Link2 className="h-2.5 w-2.5 shrink-0" />
                            <span className="truncate">{pair.linkedTreatmentTitle}</span>
                          </span>
                        )}

                        {(pair.duration || pair.sessions) && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            <Clock className="h-2.5 w-2.5 text-slate-400" />
                            <span>
                              {pair.duration ||
                                (pair.sessions ? `${pair.sessions} Sessions` : '')}
                            </span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(groupId, pair, 'seo');
                          }}
                          className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/70 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                        >
                          <Tag className="h-2.5 w-2.5" />
                          <span>{seoTagCount} SEO tags</span>
                        </button>
                      </div>
                    </div>

                    {/* Three-Dot Context Menu (MoreVertical) */}
                    <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuPairId(isMenuOpen ? null : pair.id)
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#003334] hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Pair options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 bottom-9 w-52 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-30 text-xs font-medium text-slate-700 animate-fadeIn">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuPairId(null);
                              openEditModal(groupId, pair, 'details');
                            }}
                            className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                          >
                            <Layers className="h-3.5 w-3.5 text-[#003334]" />
                            <span>Edit Before & After Pair</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuPairId(null);
                              handleQuickSwapPhotos(groupId, pair.id);
                            }}
                            className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                          >
                            <ArrowLeftRight className="h-3.5 w-3.5 text-slate-500" />
                            <span>Quick-Swap Photos</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuPairId(null);
                              openEditModal(groupId, pair, 'seo');
                            }}
                            className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                          >
                            <Tag className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Manage SEO & Alt Text</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuPairId(null);
                              handleTogglePairFlag(groupId, pair.id, 'featured');
                            }}
                            className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                          >
                            <Star
                              className={`h-3.5 w-3.5 ${
                                pair.featured ? 'text-amber-500 fill-amber-400' : 'text-slate-400'
                              }`}
                            />
                            <span>
                              {pair.featured ? 'Remove Featured Badge' : 'Mark as Featured'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuPairId(null);
                              handleTogglePairFlag(groupId, pair.id, 'hidden');
                            }}
                            className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                          >
                            {pair.hidden ? (
                              <>
                                <Eye className="h-3.5 w-3.5 text-slate-500" />
                                <span>Show in Public Gallery</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3.5 w-3.5 text-slate-500" />
                                <span>Hide from Public Gallery</span>
                              </>
                            )}
                          </button>

                          <div className="my-1 border-t border-slate-100" />

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuPairId(null);
                              setDeleteTarget({
                                groupId,
                                pairId: pair.id,
                                title: pair.title,
                              });
                            }}
                            className="w-full px-3.5 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer font-bold"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete Pair</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Compact Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-5 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-slate-900">
                  Delete Before & After Pair?
                </h4>
                <p className="text-xs text-slate-500">
                  Remove <span className="font-bold text-slate-700">"{deleteTarget.title}"</span> from this treatment group?
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Delete Pair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task 4: Desktop Modal (sm:max-w-xl) & Mobile Bottom-Sheet Editor (rounded-t-3xl) */}
      {editorModal && editorModal.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4"
          onClick={() => setEditorModal(null)}
        >
          <div
            className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Slide-Up Bottom Sheet Drag Handle */}
            <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
              <div className="w-11 h-1.5 rounded-full bg-slate-300" />
            </div>

            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">
              <div>
                <h4 className="font-serif font-bold text-base md:text-lg text-[#003334]">
                  {editorModal.mode === 'create'
                    ? 'Add Before & After Pair'
                    : 'Edit Before & After Pair'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Link to an existing treatment group & sync Google Image Search SEO.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditorModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Unified 3-Step Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              {/* STEP 1 — Select Existing Treatment Group & Treatment */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#003334] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#003334]">
                    Select Existing Treatment Group & Procedure
                  </h5>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Treatment Group *
                    </label>
                    <select
                      value={editorModal.groupId}
                      onChange={(e) => {
                        const nextGroupId = e.target.value;
                        const autoMeta = buildAutoSeoMetadata(
                          nextGroupId,
                          editorModal.pair.linkedTreatmentTitle || '',
                          editorModal.pair.title,
                          editorModal.pair.duration
                        );
                        setEditorModal({
                          ...editorModal,
                          groupId: nextGroupId,
                          pair: {
                            ...editorModal.pair,
                            treatmentGroupId: nextGroupId as ExistingTreatmentGroupId,
                            beforeAltText: autoMeta.beforeAltText,
                            afterAltText: autoMeta.afterAltText,
                            seoTitle: autoMeta.seoTitle,
                          },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#003334] bg-white focus:outline-none focus:ring-2 focus:ring-[#003334]/20"
                    >
                      {EXISTING_BEFORE_AFTER_TREATMENT_GROUPS.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Existing Procedure *
                    </label>
                    <select
                      value={editorModal.pair.linkedTreatmentId || ''}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const matched = existingTreatments.find(
                          (t) => t.id === selectedId
                        );
                        const nextTreatmentTitle = matched ? matched.title : '';
                        const nextCaseTitle = matched
                          ? `${matched.title} Transformation`
                          : editorModal.pair.title;
                        const autoMeta = buildAutoSeoMetadata(
                          editorModal.groupId,
                          nextTreatmentTitle,
                          nextCaseTitle,
                          editorModal.pair.duration
                        );
                        const nextKeywords = buildClinicalSeoKeywords(
                          editorModal.groupId,
                          selectedId,
                          nextTreatmentTitle,
                          nextCaseTitle
                        );

                        setEditorModal({
                          ...editorModal,
                          pair: {
                            ...editorModal.pair,
                            title: nextCaseTitle,
                            linkedTreatmentId: selectedId,
                            linkedTreatmentTitle: nextTreatmentTitle,
                            beforeAltText: autoMeta.beforeAltText,
                            afterAltText: autoMeta.afterAltText,
                            seoTitle: autoMeta.seoTitle,
                            seoKeywords: Array.from(
                              new Set([
                                ...(editorModal.pair.seoKeywords || []),
                                ...nextKeywords,
                              ])
                            ),
                          },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#003334]/20"
                    >
                      <option value="">Select existing procedure...</option>
                      {groupedTreatmentsForModal.matching.length > 0 && (
                        <optgroup
                          label={`${groupedTreatmentsForModal.groupCategoryName} (Recommended)`}
                        >
                          {groupedTreatmentsForModal.matching.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.title}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {groupedTreatmentsForModal.others.length > 0 && (
                        <optgroup label="All Other Clinic Procedures">
                          {groupedTreatmentsForModal.others.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.title} ({t.category})
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  {/* Compact Case Title + Timeframe Pill */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Case Label
                    </label>
                    <input
                      type="text"
                      value={editorModal.pair.title}
                      onChange={(e) =>
                        setEditorModal({
                          ...editorModal,
                          pair: { ...editorModal.pair, title: e.target.value },
                        })
                      }
                      placeholder="e.g., Profhilo Bio-Remodeling"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Duration / Sessions Pill
                    </label>
                    <input
                      type="text"
                      value={editorModal.pair.duration || ''}
                      onChange={(e) =>
                        setEditorModal({
                          ...editorModal,
                          pair: { ...editorModal.pair, duration: e.target.value },
                        })
                      }
                      placeholder="e.g., 8 Weeks • 3 Sessions"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 2 — Side-by-Side Before & After Dropzones + 1-Click Swap */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#003334] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#003334]">
                      Before & After Photos (Auto-WebP)
                    </h5>
                  </div>

                  <button
                    type="button"
                    onClick={handleModalSwapPhotos}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#003334] text-slate-700 hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                    <span>Swap Before ⇄ After</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* BEFORE DROPZONE */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverSlot('before');
                    }}
                    onDragLeave={() => setDragOverSlot(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverSlot(null);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleImageFileUpload(file, 'before');
                    }}
                    className={`p-3 rounded-2xl border transition-all space-y-2 ${
                      dragOverSlot === 'before'
                        ? 'border-[#003334] bg-[#003334]/5'
                        : 'border-slate-200 bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                        Before Photo *
                      </span>
                      {uploadingSlot === 'before' && (
                        <span className="text-[10px] font-bold text-[#003334] animate-pulse">
                          Converting WebP...
                        </span>
                      )}
                    </div>

                    <div
                      onClick={() => beforeFileInputRef.current?.click()}
                      className="aspect-[4/3] rounded-xl bg-white border border-dashed border-slate-300 hover:border-[#003334] overflow-hidden flex items-center justify-center cursor-pointer relative group"
                    >
                      {editorModal.pair.beforeImage ? (
                        <>
                          <img
                            src={editorModal.pair.beforeImage}
                            alt="Before preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                            Replace Photo
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-3 space-y-1">
                          <Upload className="h-5 w-5 text-slate-400 mx-auto" />
                          <p className="text-[10px] font-bold text-slate-600">
                            Drop or click to upload
                          </p>
                          <p className="text-[9px] text-slate-400">Auto-WebP</p>
                        </div>
                      )}
                    </div>

                    <input
                      ref={beforeFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFileUpload(file, 'before');
                        e.target.value = '';
                      }}
                    />

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => beforeFileInputRef.current?.click()}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:border-[#003334] text-[10px] font-bold text-slate-700 cursor-pointer"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Upload</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openAssetLibraryPicker('before')}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:border-[#003334] text-[10px] font-bold text-[#003334] cursor-pointer"
                      >
                        <FolderOpen className="h-3 w-3" />
                        <span>Asset Library</span>
                      </button>
                    </div>
                  </div>

                  {/* AFTER DROPZONE */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverSlot('after');
                    }}
                    onDragLeave={() => setDragOverSlot(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverSlot(null);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleImageFileUpload(file, 'after');
                    }}
                    className={`p-3 rounded-2xl border transition-all space-y-2 ${
                      dragOverSlot === 'after'
                        ? 'border-[#003334] bg-[#003334]/5'
                        : 'border-slate-200 bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#003334]">
                        After Photo *
                      </span>
                      {uploadingSlot === 'after' && (
                        <span className="text-[10px] font-bold text-[#003334] animate-pulse">
                          Converting WebP...
                        </span>
                      )}
                    </div>

                    <div
                      onClick={() => afterFileInputRef.current?.click()}
                      className="aspect-[4/3] rounded-xl bg-white border border-dashed border-slate-300 hover:border-[#003334] overflow-hidden flex items-center justify-center cursor-pointer relative group"
                    >
                      {editorModal.pair.afterImage ? (
                        <>
                          <img
                            src={editorModal.pair.afterImage}
                            alt="After preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                            Replace Photo
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-3 space-y-1">
                          <Upload className="h-5 w-5 text-slate-400 mx-auto" />
                          <p className="text-[10px] font-bold text-slate-600">
                            Drop or click to upload
                          </p>
                          <p className="text-[9px] text-slate-400">Auto-WebP</p>
                        </div>
                      )}
                    </div>

                    <input
                      ref={afterFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFileUpload(file, 'after');
                        e.target.value = '';
                      }}
                    />

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => afterFileInputRef.current?.click()}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:border-[#003334] text-[10px] font-bold text-slate-700 cursor-pointer"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Upload</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openAssetLibraryPicker('after')}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:border-[#003334] text-[10px] font-bold text-[#003334] cursor-pointer"
                      >
                        <FolderOpen className="h-3 w-3" />
                        <span>Asset Library</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3 — Google Image SEO & Keyword Tagging */}
              <div ref={seoStepRef} className="space-y-3 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#003334]">
                      Google Image SEO & Keyword Tagging
                    </h5>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoSuggestClinicalSeo}
                    className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    <Wand2 className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Auto-Suggest Clinical SEO Keywords</span>
                  </button>
                </div>

                <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-3.5">
                  {/* Keyword Input + Active Tag Pills */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && keywordInput.trim()) {
                            e.preventDefault();
                            const clean = keywordInput.trim().toLowerCase();
                            if (!(editorModal.pair.seoKeywords || []).includes(clean)) {
                              setEditorModal({
                                ...editorModal,
                                pair: {
                                  ...editorModal.pair,
                                  seoKeywords: [
                                    ...(editorModal.pair.seoKeywords || []),
                                    clean,
                                  ],
                                },
                              });
                            }
                            setKeywordInput('');
                          }
                        }}
                        placeholder="Add clinical keyword (e.g., before and after profhilo london) & press Enter"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const clean = keywordInput.trim().toLowerCase();
                          if (!clean) return;
                          if (!(editorModal.pair.seoKeywords || []).includes(clean)) {
                            setEditorModal({
                              ...editorModal,
                              pair: {
                                ...editorModal.pair,
                                seoKeywords: [
                                  ...(editorModal.pair.seoKeywords || []),
                                  clean,
                                ],
                              },
                            });
                          }
                          setKeywordInput('');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#003334] text-white text-xs font-bold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                    {/* Active Keyword Tag Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {(editorModal.pair.seoKeywords || []).map((kw) => (
                        <span
                          key={kw}
                          className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-medium"
                        >
                          <Tag className="h-2.5 w-2.5 text-emerald-600" />
                          <span>{kw}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditorModal({
                                ...editorModal,
                                pair: {
                                  ...editorModal.pair,
                                  seoKeywords: (editorModal.pair.seoKeywords || []).filter(
                                    (k) => k !== kw
                                  ),
                                },
                              })
                            }
                            className="text-emerald-600 hover:text-emerald-950 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* 1-Click Suggested Keyword Chips */}
                    {modalSuggestedKeywords.length > 0 && (
                      <div className="pt-1 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Tap to add treatment SEO keywords:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {modalSuggestedKeywords.slice(0, 6).map((sug) => (
                            <button
                              key={sug}
                              type="button"
                              onClick={() =>
                                setEditorModal({
                                  ...editorModal,
                                  pair: {
                                    ...editorModal.pair,
                                    seoKeywords: [
                                      ...(editorModal.pair.seoKeywords || []),
                                      sug,
                                    ],
                                  },
                                })
                              }
                              className="inline-flex items-center gap-1 text-[10px] font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                            >
                              <Plus className="h-2.5 w-2.5" />
                              <span>{sug}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Auto-Filled & Editable Before / After Image Alt Text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200/70">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Before Image Alt Text (Google Images)
                      </label>
                      <input
                        type="text"
                        value={editorModal.pair.beforeAltText || ''}
                        onChange={(e) =>
                          setEditorModal({
                            ...editorModal,
                            pair: { ...editorModal.pair, beforeAltText: e.target.value },
                          })
                        }
                        placeholder="Before [Treatment] at Age Reversal Clinics London"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-[11px] text-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        After Image Alt Text (Google Images)
                      </label>
                      <input
                        type="text"
                        value={editorModal.pair.afterAltText || ''}
                        onChange={(e) =>
                          setEditorModal({
                            ...editorModal,
                            pair: { ...editorModal.pair, afterAltText: e.target.value },
                          })
                        }
                        placeholder="After [Treatment] result at Age Reversal Clinics London"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-[11px] text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editorModal.pair.featured)}
                    onChange={(e) =>
                      setEditorModal({
                        ...editorModal,
                        pair: { ...editorModal.pair, featured: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-[#003334] focus:ring-[#003334]"
                  />
                  <span>Featured</span>
                </label>

                <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editorModal.pair.hidden)}
                    onChange={(e) =>
                      setEditorModal({
                        ...editorModal,
                        pair: { ...editorModal.pair, hidden: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-[#003334] focus:ring-[#003334]"
                  />
                  <span>Hide</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditorModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveModalPair}
                  disabled={!editorModal.pair.beforeImage || !editorModal.pair.afterImage}
                  className="px-5 py-2 rounded-xl bg-[#003334] hover:bg-[#236963] disabled:opacity-45 text-white text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>
                    {editorModal.mode === 'create' ? 'Add Pair & Sync SEO' : 'Save Changes'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Asset Library Picker Sub-Modal / Bottom Drawer */}
      {assetPickerSlot && editorModal && (
        <div
          className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4"
          onClick={() => setAssetPickerSlot(null)}
        >
          <div
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl max-h-[82vh] flex flex-col overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-base text-[#003334]">
                  Select {assetPickerSlot === 'before' ? 'Before' : 'After'} Photo from Asset Library
                </h4>
                <p className="text-[11px] text-slate-500">
                  Choose an existing clinic image asset
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssetPickerSlot(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                  placeholder="Search clinic media assets..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {loadingAssets ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Loading clinic asset library...
                </div>
              ) : filteredAssetsForPicker.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No matching image assets found.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredAssetsForPicker.map((asset, idx) => (
                    <button
                      key={`${asset.url}-${idx}`}
                      type="button"
                      onClick={() => {
                        setEditorModal({
                          ...editorModal,
                          pair: {
                            ...editorModal.pair,
                            [assetPickerSlot === 'before'
                              ? 'beforeImage'
                              : 'afterImage']: asset.url,
                            updatedAt: Date.now(),
                          },
                        });
                        setAssetPickerSlot(null);
                      }}
                      className="group text-left rounded-xl border border-slate-200 hover:border-[#003334] overflow-hidden bg-slate-50 transition-all cursor-pointer"
                    >
                      <div className="aspect-square bg-slate-100 overflow-hidden">
                        <img
                          src={asset.url}
                          alt={asset.altText || asset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-[10px] font-bold text-slate-700 truncate">
                          {asset.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
