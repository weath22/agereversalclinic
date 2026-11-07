import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TREATMENT_DETAILS_DB,
  TreatmentDetail,
  DEFAULT_TREATMENT_DETAILS,
  populateTreatmentMediaDefaults,
  getServiceComponentSlotId,
} from './treatments/treatmentData';
import { CLINICAL_AREAS_DB } from '../data/clinicalTreatments';
import {
  getTreatmentDetailsConfig,
  getTreatmentDetailsConfigDeferred,
  saveTreatmentDetailsConfig,
  getBeforeAfterGalleryConfig,
  saveBeforeAfterGalleryConfig,
  uploadBeforeAfterWebpImage,
  registerMediaAsset,
  uploadAssetFile,
  listProjectAssets,
  getRegisteredMediaAssets,
} from '../lib/adminStore';
import { BeforeAfterGalleryConfig, BeforeAfterPair, TreatmentMediaItem } from '../types';
import { ClinicImageWithPlaceholder } from './common/ClinicImageWithPlaceholder';
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Image as ImageIcon,
  AlertCircle,
  Check,
  FileText,
  Clock,
  Smile,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  Database,
  Search,
  Activity,
  Heart,
  Sliders,
  Zap,
  Flame,
  Cpu,
  Eye,
  EyeOff,
  X,
  Compass,
  Link2,
  Link2Off,
  Edit3,
  Upload,
  FolderOpen,
  Loader2,
  MoreVertical,
  Globe,
  Tag,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  PanelLeft,
  Wand2,
} from 'lucide-react';

const DEFAULT_LAYER_SPECS: Record<
  'Epidermis' | 'Dermis' | 'Subdermal Adipose' | 'SMAS Muscle Layer',
  {
    depth: string;
    frequency: string;
    energy: string;
    temperature: string;
    mechanism: string;
  }
> = {
  Epidermis: {
    depth: '0.1mm - 0.5mm',
    frequency: '2940 nm (Er:YAG) / Plasma Sublimation',
    energy: '1.2 - 2.5 J/cm²',
    temperature: '37°C - 42°C (Ablation range)',
    mechanism: 'Superficial epidermal resurfacing & micro-peeling',
  },
  Dermis: {
    depth: '1.0mm - 3.0mm',
    frequency: '1 MHz - 4 MHz Bipolar Radiofrequency',
    energy: '15 - 45 J/cm³',
    temperature: '60°C - 65°C (Neocollagenesis optimal)',
    mechanism: 'Fibroblast stimulation & dermal remodeling',
  },
  'Subdermal Adipose': {
    depth: '3.0mm - 4.5mm',
    frequency: 'Calibrated Radiofrequency Needling',
    energy: '25 - 60 J/cm³',
    temperature: '65°C - 70°C (Adipose contraction)',
    mechanism: 'Adipose tissue remodeling & lipid clearing',
  },
  'SMAS Muscle Layer': {
    depth: '4.5mm+',
    frequency: '4 MHz High-Intensity Focused Ultrasound (HIFU)',
    energy: '0.45 - 1.2 J/mm²',
    temperature: '65°C - 72°C (Protein coagulation)',
    mechanism: 'SMAS contracture & deep structural hoisting',
  },
};

const CLINICAL_PRESETS = [
  {
    name: 'RF Microneedling',
    targetLayer: 'Dermis' as const,
    depth: '1.5mm - 2.5mm',
    frequency: '1 MHz - 4 MHz Bipolar Radiofrequency',
    energy: '15 - 45 J/cm³',
    temperature: '60°C - 65°C (Neocollagenesis optimal)',
    mechanism: 'Fibroblast stimulation & dermal remodeling',
  },
  {
    name: 'Er:YAG Laser Resurfacing',
    targetLayer: 'Epidermis' as const,
    depth: '0.1mm - 0.5mm',
    frequency: '2940 nm (Er:YAG) / Plasma Sublimation',
    energy: '1.2 - 2.5 J/cm²',
    temperature: '37°C - 42°C (Ablation range)',
    mechanism: 'Superficial epidermal resurfacing & micro-peeling',
  },
  {
    name: 'HIFU / SMAS Deep Lift',
    targetLayer: 'SMAS Muscle Layer' as const,
    depth: '4.5mm+',
    frequency: '4 MHz High-Intensity Focused Ultrasound (HIFU)',
    energy: '0.45 - 1.2 J/mm²',
    temperature: '65°C - 72°C (Protein coagulation)',
    mechanism: 'SMAS contracture & deep structural hoisting',
  },
  {
    name: 'Subdermal Contouring',
    targetLayer: 'Subdermal Adipose' as const,
    depth: '3.0mm - 4.5mm',
    frequency: 'Calibrated Radiofrequency Needling',
    energy: '25 - 60 J/cm³',
    temperature: '65°C - 70°C (Adipose contraction)',
    mechanism: 'Adipose tissue remodeling & lipid clearing',
  },
  {
    name: 'Bio-Cellular Infusion',
    targetLayer: 'Dermis' as const,
    depth: '1.0mm - 2.0mm',
    frequency: 'Acoustic Micro-Transdermal Infusion',
    energy: 'Passive Biocompatible Dermal Saturation',
    temperature: '37°C (Physiological equilibrium)',
    mechanism: 'Cellular mRNA signaling & neo-collagenesis',
  },
];

type EditorSectionFilter =
  | 'all'
  | 'hero'
  | 'overview'
  | 'expectations'
  | 'profiler'
  | 'before-after'
  | 'concerns'
  | 'care'
  | 'portfolio';

type SeoSlotTarget =
  | 'page-hero'
  | 'overview-front'
  | 'overview-back'
  | 'concerns-media'
  | 'pre-care-media'
  | 'post-care-media'
  | { type: 'portfolio'; index: number };

type AssetPickerTarget =
  | { slot: 'hero' }
  | { slot: 'overview-front' }
  | { slot: 'overview-back' }
  | { slot: 'concerns-media' }
  | { slot: 'pre-care-media' }
  | { slot: 'post-care-media' }
  | { slot: 'case-before' }
  | { slot: 'case-after' }
  | { slot: 'portfolio-add' }
  | { slot: 'portfolio-replace'; index: number };

export default function ServiceViewDetailsEditor() {
  const [db, setDb] = useState<Record<string, TreatmentDetail>>(() => {
    const loaded = getTreatmentDetailsConfig();
    return loaded ? { ...TREATMENT_DETAILS_DB, ...loaded } : { ...TREATMENT_DETAILS_DB };
  });
  const [selectedKey, setSelectedKey] = useState<string>('botox-1-area');
  const [formData, setFormData] = useState<TreatmentDetail | null>(null);

  // Navigation & Section Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSectionTab, setActiveSectionTab] = useState<EditorSectionFilter>('all');
  const [isMobileServiceDrawerOpen, setIsMobileServiceDrawerOpen] = useState(false);

  // Context Menus (3-dot MoreVertical)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Modals & Drawers
  const [isHeroEditModalOpen, setIsHeroEditModalOpen] = useState(false);
  const [isOverviewTextModalOpen, setIsOverviewTextModalOpen] = useState(false);
  const [isExpectationsModalOpen, setIsExpectationsModalOpen] = useState(false);
  const [isProfilerModalOpen, setIsProfilerModalOpen] = useState(false);
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    danger?: boolean;
    onConfirm: () => void;
  } | null>(null);

  // List Item Add/Edit Modal (for Target Concerns, Pre-Care, Post-Care)
  const [listEditModal, setListEditModal] = useState<{
    field: 'concerns' | 'preCare' | 'postCare';
    title: string;
    index: number | null; // null = adding new
    value: string;
  } | null>(null);

  // SEO Drawer / Modal State
  const [seoTarget, setSeoTarget] = useState<SeoSlotTarget | null>(null);
  const [seoForm, setSeoForm] = useState<{
    label: string;
    seoTitle: string;
    altText: string;
    caption: string;
    keywords: string[];
    keywordInput: string;
  }>({
    label: '',
    seoTitle: '',
    altText: '',
    caption: '',
    keywords: [],
    keywordInput: '',
  });

  // Asset Library Picker Sub-Modal
  const [assetPickerTarget, setAssetPickerTarget] = useState<AssetPickerTarget | null>(null);
  const [libraryAssets, setLibraryAssets] = useState<
    Array<{ name: string; url: string; location: string }>
  >([]);
  const [assetSearch, setAssetSearch] = useState('');

  // Central Before & After Gallery mirroring state
  const [galleryConfig, setGalleryConfig] = useState<BeforeAfterGalleryConfig>(() =>
    getBeforeAfterGalleryConfig()
  );

  // Custom Before/After Case modal state
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [isCaseSeoOpen, setIsCaseSeoOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<{
    id: string;
    beforeImage: string;
    afterImage: string;
    title: string;
    duration?: string;
    sessions?: number | string;
    beforeAltText?: string;
    afterAltText?: string;
    seoTitle?: string;
    seoKeywords?: string[];
  } | null>(null);
  const [caseKeywordInput, setCaseKeywordInput] = useState('');

  // Custom service page creation form state
  const [newKey, setNewKey] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPrice, setNewPrice] = useState('£350');

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Hidden file inputs for direct 1-click uploads
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);
  const frontCardFileInputRef = useRef<HTMLInputElement | null>(null);
  const backCardFileInputRef = useRef<HTMLInputElement | null>(null);
  const concernsFileInputRef = useRef<HTMLInputElement | null>(null);
  const preCareFileInputRef = useRef<HTMLInputElement | null>(null);
  const postCareFileInputRef = useRef<HTMLInputElement | null>(null);
  const portfolioFileInputRef = useRef<HTMLInputElement | null>(null);
  const [replacePortfolioIdx, setReplacePortfolioIdx] = useState<number | null>(null);
  const replacePortfolioInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage((prev) => (prev?.text === text ? null : prev));
    }, 3200);
  };

  // Close 3-dot menus on outside click
  useEffect(() => {
    const handleOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      window.addEventListener('click', handleOutside);
      return () => window.removeEventListener('click', handleOutside);
    }
  }, [openMenuId]);

  // Load Asset Library when picker opens
  useEffect(() => {
    if (!assetPickerTarget) return;
    const registered = getRegisteredMediaAssets().map((a) => ({
      name: a.name || 'Clinic Asset',
      url: a.url,
      location: a.category || 'Library',
    }));
    setLibraryAssets(registered);
    listProjectAssets()
      .then((serverList) => {
        const map = new Map<string, { name: string; url: string; location: string }>();
        [...serverList, ...registered].forEach((item) => {
          if (item?.url) map.set(item.url, item);
        });
        setLibraryAssets(Array.from(map.values()));
      })
      .catch(() => {});
  }, [assetPickerTarget]);

  // Helper to commit and immediately persist updated service details with deterministic IDs
  const commitAndPersistFormData = (nextRaw: TreatmentDetail, toastMsg?: string) => {
    const populated = {
      ...populateTreatmentMediaDefaults({
        ...nextRaw,
        id: selectedKey,
      }),
      updatedAt: Date.now(),
      isCustomized: true,
    } as TreatmentDetail;
    setFormData(populated);
    const updatedDb = {
      ...db,
      [selectedKey]: populated,
    };
    setDb(updatedDb);
    saveTreatmentDetailsConfig(updatedDb);
    if (toastMsg) {
      showToast(toastMsg);
    }
  };

  // File Storage Upload Handler with deterministic component slot ID (e.g. service-exosome-hero)
  const handleFileUpload = async (
    file: File,
    onSuccess: (url: string) => void,
    slotKey?: string,
    previousUrl?: string
  ) => {
    setIsUploading(true);
    const deterministicSlotId = slotKey
      ? getServiceComponentSlotId(selectedKey, slotKey)
      : undefined;
    showToast(`Uploading "${file.name}"...`);
    try {
      const res = await uploadAssetFile(file, previousUrl, {
        folder: 'treatments',
        convertToWebp: true,
        slotId: deterministicSlotId,
      });
      if (res.success && res.url) {
        onSuccess(res.url);
        showToast(`Saved "${file.name}"`);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            onSuccess(reader.result);
            showToast(`Loaded "${file.name}"`);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSuccess(reader.result);
          showToast(`Loaded "${file.name}"`);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Dedicated Before & After WebP Storage Upload Handler
  const handleBeforeAfterPhotoUpload = async (
    file: File,
    slot: 'before' | 'after',
    caseTitle: string,
    onSuccess: (url: string) => void
  ) => {
    setIsUploading(true);
    showToast(`Optimizing "${file.name}" to WebP...`);
    try {
      const webpDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.naturalWidth || img.width;
            let height = img.naturalHeight || img.height;
            const maxDim = 1600;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
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

      const baseSlug = (formData?.title || caseTitle || 'transformation')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const fileName = `ba-${baseSlug}-${slot}.webp`;

      const uploaded = await uploadBeforeAfterWebpImage({
        fileName,
        dataUrl: webpDataUrl,
        slot,
        pairId: editingCase?.id || formData?.id,
      });

      if (uploaded?.url) {
        const versionedUrl = `${uploaded.url}?v=${Date.now()}`;
        onSuccess(versionedUrl);
        showToast(`Saved ${slot} image`);
        try {
          registerMediaAsset({
            name: `${formData?.title || caseTitle} (${slot === 'before' ? 'Before' : 'After'})`,
            url: uploaded.url,
            mediaType: 'image',
            category: 'Before & After',
            altText: `${formData?.title || caseTitle} ${
              slot === 'before' ? 'Before Treatment' : 'After Treatment Result'
            } at Age Reversal Clinics`,
            seoKeywords: [
              `${(formData?.title || '').toLowerCase()} before and after`,
              'clinical aesthetic results',
              'harley street aesthetics',
            ],
          });
        } catch {}
      } else {
        const fallbackRes = await uploadAssetFile(file);
        if (fallbackRes.success && fallbackRes.url) {
          onSuccess(fallbackRes.url);
          showToast(`Saved "${file.name}"`);
        } else {
          onSuccess(webpDataUrl);
        }
      }
    } catch {
      handleFileUpload(file, onSuccess);
    } finally {
      setIsUploading(false);
    }
  };

  // Tree expanded state
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({
    'face-injectables': true,
    face: true,
    body: false,
    buttocks: false,
    'minor-surgery-scars': false,
    custom: true,
  });

  const toggleArea = (areaId: string) => {
    setExpandedAreas((prev) => ({ ...prev, [areaId]: !prev[areaId] }));
  };

  // Load database from adminStore / localStorage or default db + deferred server sync
  useEffect(() => {
    const mergeDetailsPreservingEdits = (
      prev: Record<string, TreatmentDetail>,
      incoming: Record<string, any> | null | undefined
    ): Record<string, TreatmentDetail> => {
      const next: Record<string, TreatmentDetail> = { ...TREATMENT_DETAILS_DB, ...prev };
      if (!incoming || typeof incoming !== 'object') return next;
      for (const [k, v] of Object.entries(incoming)) {
        if (!v || typeof v !== 'object') continue;
        const prevEntry = prev[k];
        const prevTime = Number((prevEntry as any)?.updatedAt) || 0;
        const incTime = Number((v as any).updatedAt) || 0;
        const prevCustom = Boolean((prevEntry as any)?.isCustomized || prevTime > 0);
        const incCustom = Boolean((v as any).isCustomized || incTime > 0);

        if (prevCustom && !incCustom) continue;
        if (!prevCustom && incCustom) {
          next[k] = v as TreatmentDetail;
          continue;
        }
        if (incTime >= prevTime) {
          next[k] = v as TreatmentDetail;
        }
      }
      return next;
    };

    const loaded = getTreatmentDetailsConfig();
    if (loaded) {
      setDb((prev) => mergeDetailsPreservingEdits(prev, loaded));
    }

    getTreatmentDetailsConfigDeferred()
      .then((deferred) => {
        if (deferred && typeof deferred === 'object') {
          setDb((prev) => mergeDetailsPreservingEdits(prev, deferred));
        }
      })
      .catch(() => {});

    const handleHydrated = () => {
      const latest = getTreatmentDetailsConfig();
      if (latest) {
        setDb((prev) => mergeDetailsPreservingEdits(prev, latest));
      }
    };
    window.addEventListener('site_customizations_hydrated', handleHydrated);
    return () => window.removeEventListener('site_customizations_hydrated', handleHydrated);
  }, []);

  // Listen for Before & After Gallery updates
  useEffect(() => {
    const handleGalleryUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<BeforeAfterGalleryConfig>;
      if (customEvent.detail) {
        setGalleryConfig(customEvent.detail);
      } else {
        setGalleryConfig(getBeforeAfterGalleryConfig());
      }
    };
    window.addEventListener('before_after_gallery_updated', handleGalleryUpdate);
    return () => window.removeEventListener('before_after_gallery_updated', handleGalleryUpdate);
  }, []);

  // Update formData when selected treatment changes
  useEffect(() => {
    if (db[selectedKey]) {
      const rawCopy = JSON.parse(JSON.stringify(db[selectedKey]));
      rawCopy.id = selectedKey;
      const selectedData = populateTreatmentMediaDefaults(rawCopy);
      if (!selectedData.additionalImages) selectedData.additionalImages = [];
      if (!selectedData.customBeforeAfterPairs) selectedData.customBeforeAfterPairs = [];
      if (!selectedData.excludedGalleryPairIds) selectedData.excludedGalleryPairIds = [];
      setFormData(selectedData);
    } else {
      let foundName = selectedKey;
      let foundCategory = 'General Practice';
      let foundPrice: string | undefined;
      let foundTime: string | undefined;
      let foundDesc: string | undefined;
      let foundBadge: string | undefined;
      let parentCatId: string | undefined;
      let childItemIds: string[] = [];

      for (const area of CLINICAL_AREAS_DB) {
        for (const cat of area.categories) {
          if (cat.id === selectedKey) {
            foundName = cat.name;
            foundCategory = area.name;
            parentCatId = cat.id;
            childItemIds = cat.items.map((item) => item.id);
            if (cat.items.length > 0) {
              foundPrice = cat.items[0].price;
              foundTime = cat.items[0].time;
              foundDesc = cat.items[0].desc;
              foundBadge = cat.items[0].badge;
            }
            break;
          }
          const matchedItem = cat.items.find((item) => item.id === selectedKey);
          if (matchedItem) {
            foundName = matchedItem.name;
            foundCategory = cat.name;
            foundPrice = matchedItem.price;
            foundTime = matchedItem.time;
            foundDesc = matchedItem.desc;
            foundBadge = matchedItem.badge;
            parentCatId = cat.id;
            childItemIds = cat.items.map((item) => item.id);
            break;
          }
        }
      }

      const lowerProbe = `${selectedKey} ${foundName}`.toLowerCase();
      let templateSource: TreatmentDetail | undefined;

      if (parentCatId && db[parentCatId]) {
        templateSource = db[parentCatId];
      } else {
        const matchedChildKey = childItemIds.find((cid) => Boolean(db[cid]));
        if (matchedChildKey) {
          templateSource = db[matchedChildKey];
        } else if (lowerProbe.includes('exosome')) {
          templateSource = db.exosome || TREATMENT_DETAILS_DB.exosome;
        } else if (lowerProbe.includes('profhilo')) {
          templateSource = db.profhilo || TREATMENT_DETAILS_DB.profhilo;
        } else if (lowerProbe.includes('morpheus')) {
          templateSource = db.morpheus8 || TREATMENT_DETAILS_DB.morpheus8;
        } else if (lowerProbe.includes('ultherapy') || lowerProbe.includes('emface')) {
          templateSource = db.ultherapy || TREATMENT_DETAILS_DB.ultherapy;
        } else if (lowerProbe.includes('polynucleotide') || lowerProbe.includes('salmon sperm')) {
          templateSource = db.polynucleotide || TREATMENT_DETAILS_DB.polynucleotide;
        } else if (lowerProbe.includes('lip')) {
          templateSource = db.lip || TREATMENT_DETAILS_DB.lip;
        } else if (lowerProbe.includes('buttock') || lowerProbe.includes('bbl') || lowerProbe.includes('emsculpt')) {
          templateSource = db.buttock || TREATMENT_DETAILS_DB.buttock;
        } else if (lowerProbe.includes('bleph') || lowerProbe.includes('eyelid')) {
          templateSource = db.blepharoplasty || TREATMENT_DETAILS_DB.blepharoplasty;
        } else if (lowerProbe.includes('aqualyx') || lowerProbe.includes('fat dissolve') || lowerProbe.includes('deso')) {
          templateSource = db.aqualyx || TREATMENT_DETAILS_DB.aqualyx;
        }
      }

      const baseCopy: TreatmentDetail = templateSource
        ? JSON.parse(JSON.stringify(templateSource))
        : DEFAULT_TREATMENT_DETAILS(foundName);

      baseCopy.id = selectedKey;
      baseCopy.title = foundName;
      baseCopy.category = foundCategory;
      if (!templateSource) {
        if (foundPrice) baseCopy.price = foundPrice;
        if (foundTime) baseCopy.procedureTime = foundTime;
        if (foundDesc) baseCopy.description = foundDesc;
        if (foundBadge) baseCopy.badgeText = foundBadge;
      } else if (foundPrice && !templateSource.isCustomized) {
        baseCopy.price = foundPrice;
      }
      if (!baseCopy.additionalImages) baseCopy.additionalImages = [];
      if (!baseCopy.customBeforeAfterPairs) baseCopy.customBeforeAfterPairs = [];
      if (!baseCopy.excludedGalleryPairIds) baseCopy.excludedGalleryPairIds = [];
      setFormData(populateTreatmentMediaDefaults(baseCopy));
    }
  }, [selectedKey, db]);

  // Auto expand selected key's parent area
  useEffect(() => {
    for (const area of CLINICAL_AREAS_DB) {
      for (const cat of area.categories) {
        if (cat.items.some((item) => item.id === selectedKey)) {
          setExpandedAreas((prev) => ({ ...prev, [area.id]: true }));
          return;
        }
      }
    }
    setExpandedAreas((prev) => ({ ...prev, custom: true }));
  }, [selectedKey]);

  // Find matching pairs mirrored from central Before & After Gallery
  const matchingGalleryCases = useMemo(() => {
    if (!formData || !galleryConfig?.categories) return [];
    const normalizeSlug = (val?: string) =>
      (val || '')
        .toLowerCase()
        .trim()
        .replace(/@/g, '2')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    const normalizeCompact = (val?: string) =>
      (val || '')
        .toLowerCase()
        .trim()
        .replace(/@/g, '2')
        .replace(/[^a-z0-9]/g, '');

    const rawIdSlug = normalizeSlug(
      formData.id && formData.id !== 'bespoke' ? formData.id : selectedKey
    );
    const titleSlug = normalizeSlug(formData.title);
    const compactTitle = normalizeCompact(formData.title);

    // Check CLINICAL_AREAS_DB for subcategory match
    let subCatSlug = '';
    let subCatNameSlug = '';
    for (const area of CLINICAL_AREAS_DB) {
      for (const cat of area.categories) {
        const cId = normalizeSlug(cat.id);
        const cName = normalizeSlug(cat.name);
        if (cId === rawIdSlug || cName === titleSlug) {
          subCatSlug = cId;
          subCatNameSlug = cName;
          break;
        }
        const item = cat.items.find(
          (i) => normalizeSlug(i.id) === rawIdSlug || normalizeSlug(i.name) === titleSlug
        );
        if (item) {
          subCatSlug = cId;
          subCatNameSlug = cName;
          break;
        }
      }
      if (subCatSlug) break;
    }

    const aliasMap: Record<string, string> = {
      profhilo: 'profhilo-2ml',
      'profhilo-injectable-hydration': 'profhilo-2ml',
      morpheus8: 'morpheus8-treatment',
      'morpheus8-rf-microneedling': 'morpheus8-treatment',
      polynucleotide: 'salmon-sperm-injection',
      'polynucleotide-skin-regen': 'salmon-sperm-injection',
      'salmon-sperm': 'salmon-sperm-injection',
      'co2-laser': 'co2-laser-from',
      'co-laser-from': 'co2-laser-from',
      prp: 'platelet-rich-plasma-prp',
      'platelet-rich-plasma': 'platelet-rich-plasma-prp',
      emface: 'emface-skin-tightening-and-lifting',
      emsculpt: 'emscuplt-body-sculpt-and-tightening',
      emscuplt: 'emscuplt-body-sculpt-and-tightening',
      'dermal-fillers': 'dermal-fillers-1ml',
      'dermal-filler': 'dermal-fillers-1ml',
      endolift: 'endolift-fiber-lift',
      'anti-wrinkle': 'anti-wrinkles-injection',
      'anti-wrinkles': 'anti-wrinkles-injection',
      'anti-wrinkle-s-injection': 'anti-wrinkles-injection',
      aqualyx: 'aqualyx-course-3',
      'iv-drip': 'iv-drip-lounge-course-of-1',
      'iv-drip-lounge': 'iv-drip-lounge-course-of-1',
    };

    const canonicalTargetId =
      aliasMap[subCatSlug] ||
      aliasMap[rawIdSlug] ||
      aliasMap[titleSlug] ||
      subCatSlug ||
      rawIdSlug ||
      titleSlug;

    const targetIds = new Set<string>(
      [rawIdSlug, titleSlug, subCatSlug, subCatNameSlug, canonicalTargetId].filter(Boolean)
    );
    const targetCompacts = new Set<string>(
      Array.from(targetIds)
        .map((k) => normalizeCompact(k))
        .filter(Boolean)
    );
    if (compactTitle) targetCompacts.add(compactTitle);

    const directMatched: Array<{ pair: BeforeAfterPair; groupName: string; isDirect: boolean }> =
      [];
    const seenPairIds = new Set<string>();

    galleryConfig.categories.forEach((cat) => {
      const catIdSlug = normalizeSlug(cat.id);
      const catNameSlug = normalizeSlug(cat.name);
      const catCompact = normalizeCompact(cat.name);

      const categoryIsMatch =
        targetIds.has(catIdSlug) ||
        targetIds.has(catNameSlug) ||
        targetCompacts.has(catCompact);

      (cat.pairs || []).forEach((p) => {
        const hasImages = Boolean(
          (p.beforeImage && p.afterImage) || (p.singleFrameImage && p.singleFrameImage.trim())
        );
        if (!p.hidden && hasImages && !seenPairIds.has(p.id)) {
          const pGroupSlug = normalizeSlug(p.treatmentGroupId);
          const pLinkedIdSlug = normalizeSlug(p.linkedTreatmentId);
          const pLinkedTitleSlug = normalizeSlug(p.linkedTreatmentTitle);
          const pLinkedCompact = normalizeCompact(p.linkedTreatmentTitle);

          const isExactTreatmentMatch =
            pLinkedIdSlug === rawIdSlug || pLinkedTitleSlug === titleSlug;

          const isMatch =
            categoryIsMatch ||
            (pGroupSlug && targetIds.has(pGroupSlug)) ||
            (pLinkedIdSlug && targetIds.has(pLinkedIdSlug)) ||
            (pLinkedTitleSlug && targetIds.has(pLinkedTitleSlug)) ||
            (pLinkedCompact && targetCompacts.has(pLinkedCompact));

          if (isMatch) {
            seenPairIds.add(p.id);
            directMatched.push({
              pair: p,
              groupName: cat.name,
              isDirect: isExactTreatmentMatch,
            });
          }
        }
      });
    });

    return directMatched;
  }, [formData?.id, formData?.title, selectedKey, galleryConfig]);

  const handleFieldChange = (field: keyof TreatmentDetail, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  // Helper to update specific media slot URLs with deterministic slot IDs and auto-persist
  const updateMediaSlotUrl = (
    slot:
      | 'hero'
      | 'overview-front'
      | 'overview-back'
      | 'concerns-media'
      | 'pre-care-media'
      | 'post-care-media',
    url: string
  ) => {
    if (!formData) return;
    let nextFormData: TreatmentDetail = { ...formData, id: selectedKey };

    if (slot === 'hero') {
      const slotId = getServiceComponentSlotId(selectedKey, 'hero');
      const nextHero: TreatmentMediaItem = {
        ...(formData.heroMedia || {
          altText: `${formData.title} - Age Reversal Clinic London`,
          seoTitle: formData.title,
          seoKeywords: formData.seoKeywords || [],
        }),
        id: slotId,
        url,
        mediaType: url.match(/\.(mp4|webm|mov)(\?|$)/i) ? 'video' : 'image',
      };
      nextFormData = {
        ...nextFormData,
        imageUrl: url,
        heroMedia: nextHero,
        coverMedia: {
          ...(formData.coverMedia || nextHero),
          id: getServiceComponentSlotId(selectedKey, 'cover'),
          url: url || formData.coverMedia?.url || '',
        },
      };
    } else if (slot === 'overview-front') {
      const slotId = getServiceComponentSlotId(selectedKey, 'overview-front');
      const current: Partial<NonNullable<TreatmentDetail['overviewMedia']>> =
        formData.overviewMedia || {};
      const existingFront = current.frontCard || current.frontImage || {
        url: '',
        altText: `${formData.title} procedural profile - front focal`,
        seoTitle: formData.title,
        seoKeywords: formData.seoKeywords || [],
      };
      const updatedFront: TreatmentMediaItem = { ...existingFront, id: slotId, url };
      nextFormData = {
        ...nextFormData,
        overviewMedia: {
          ...(current as NonNullable<TreatmentDetail['overviewMedia']>),
          frontCard: updatedFront,
          frontImage: updatedFront,
        },
      };
    } else if (slot === 'overview-back') {
      const slotId = getServiceComponentSlotId(selectedKey, 'overview-back');
      const current: Partial<NonNullable<TreatmentDetail['overviewMedia']>> =
        formData.overviewMedia || {};
      const existingBack = current.backCard || current.backImage || {
        url: '',
        altText: `${formData.title} procedural profile - back framing`,
        seoTitle: formData.title,
        seoKeywords: formData.seoKeywords || [],
      };
      const updatedBack: TreatmentMediaItem = { ...existingBack, id: slotId, url };
      nextFormData = {
        ...nextFormData,
        overviewMedia: {
          ...(current as NonNullable<TreatmentDetail['overviewMedia']>),
          backCard: updatedBack,
          backImage: updatedBack,
        },
      };
    } else if (slot === 'concerns-media') {
      const slotId = getServiceComponentSlotId(selectedKey, 'target-concerns');
      const existing = formData.targetConcernsMedia || {
        url: '',
        altText: `High-precision targeted aesthetic treatment technology for ${formData.title}`,
        seoTitle: formData.title,
        caption: 'Targeted Bio-Calibration',
        seoKeywords: formData.seoKeywords || [],
      };
      nextFormData = {
        ...nextFormData,
        targetConcernsMedia: { ...existing, id: slotId, url },
      };
    } else if (slot === 'pre-care-media') {
      const slotId = getServiceComponentSlotId(selectedKey, 'pre-care');
      const current: Partial<NonNullable<TreatmentDetail['clinicalGuidanceMedia']>> =
        formData.clinicalGuidanceMedia || {};
      const existingPre = current.preCare || current.preCareVisual || {
        url: '',
        altText: `${formData.title} Clinical Pre-Care Protocol`,
        seoTitle: `${formData.title} Pre-Care`,
        caption: 'Epidermal Prime & Hydration',
        seoKeywords: ['clinical skin prep', 'pre-care protocol'],
      };
      const updatedPre: TreatmentMediaItem = { ...existingPre, id: slotId, url };
      nextFormData = {
        ...nextFormData,
        clinicalGuidanceMedia: {
          ...(current as NonNullable<TreatmentDetail['clinicalGuidanceMedia']>),
          preCare: updatedPre,
          preCareVisual: updatedPre,
        },
      };
    } else if (slot === 'post-care-media') {
      const slotId = getServiceComponentSlotId(selectedKey, 'post-care');
      const current: Partial<NonNullable<TreatmentDetail['clinicalGuidanceMedia']>> =
        formData.clinicalGuidanceMedia || {};
      const existingPost = current.postCare || current.postCareVisual || {
        url: '',
        altText: `${formData.title} Clinical Post-Care Recovery Protocol`,
        seoTitle: `${formData.title} Post-Care`,
        caption: 'Cellular Healing & Protection',
        seoKeywords: ['post-care recovery', 'cellular healing'],
      };
      const updatedPost: TreatmentMediaItem = { ...existingPost, id: slotId, url };
      nextFormData = {
        ...nextFormData,
        clinicalGuidanceMedia: {
          ...(current as NonNullable<TreatmentDetail['clinicalGuidanceMedia']>),
          postCare: updatedPost,
          postCareVisual: updatedPost,
        },
      };
    }

    commitAndPersistFormData(nextFormData);
  };

  // Open SEO Modal / Drawer for any component slot
  const openSeoModal = (target: SeoSlotTarget) => {
    if (!formData) return;
    setSeoTarget(target);

    if (target === 'page-hero') {
      const hero = formData.heroMedia;
      setSeoForm({
        label: 'Hero & Page SEO Metadata',
        seoTitle: hero?.seoTitle || `${formData.title} | Age Reversal Clinics London`,
        altText: hero?.altText || `${formData.title} clinical procedure at Age Reversal Clinics`,
        caption: formData.badgeText || '',
        keywords:
          formData.seoKeywords && formData.seoKeywords.length > 0
            ? [...formData.seoKeywords]
            : [`${formData.title.toLowerCase()} london`, 'age reversal clinics'],
        keywordInput: '',
      });
    } else if (target === 'overview-front') {
      const front = formData.overviewMedia?.frontCard || formData.overviewMedia?.frontImage;
      setSeoForm({
        label: 'Overview — Front Card SEO',
        seoTitle: front?.seoTitle || `${formData.title} Focal Procedure`,
        altText: front?.altText || `${formData.title} procedural profile - front focal`,
        caption: front?.caption || '',
        keywords: front?.seoKeywords?.length
          ? [...front.seoKeywords]
          : [`${formData.title.toLowerCase()} procedure`],
        keywordInput: '',
      });
    } else if (target === 'overview-back') {
      const back = formData.overviewMedia?.backCard || formData.overviewMedia?.backImage;
      setSeoForm({
        label: 'Overview — Back Card SEO',
        seoTitle: back?.seoTitle || `${formData.title} Diagnostic Framing`,
        altText: back?.altText || `${formData.title} procedural profile - back framing`,
        caption: back?.caption || '',
        keywords: back?.seoKeywords?.length
          ? [...back.seoKeywords]
          : [`${formData.title.toLowerCase()} diagnostics`],
        keywordInput: '',
      });
    } else if (target === 'concerns-media') {
      const tc = formData.targetConcernsMedia;
      setSeoForm({
        label: 'Target Concerns Visual SEO',
        seoTitle: tc?.seoTitle || `${formData.title} Target Indications`,
        altText:
          tc?.altText ||
          `High-precision targeted aesthetic treatment technology for ${formData.title}`,
        caption: tc?.caption || 'Targeted Bio-Calibration',
        keywords: tc?.seoKeywords?.length
          ? [...tc.seoKeywords]
          : [`${formData.title.toLowerCase()} indications`],
        keywordInput: '',
      });
    } else if (target === 'pre-care-media') {
      const pre =
        formData.clinicalGuidanceMedia?.preCare ||
        formData.clinicalGuidanceMedia?.preCareVisual;
      setSeoForm({
        label: 'Pre-Care Protocol Visual SEO',
        seoTitle: pre?.seoTitle || `${formData.title} Pre-Care Protocol`,
        altText: pre?.altText || `Clinical Skin Prep for ${formData.title}`,
        caption: pre?.caption || 'Epidermal Prime & Hydration',
        keywords: pre?.seoKeywords?.length
          ? [...pre.seoKeywords]
          : ['clinical skin prep', 'pre-care protocol'],
        keywordInput: '',
      });
    } else if (target === 'post-care-media') {
      const post =
        formData.clinicalGuidanceMedia?.postCare ||
        formData.clinicalGuidanceMedia?.postCareVisual;
      setSeoForm({
        label: 'Post-Care Recovery Visual SEO',
        seoTitle: post?.seoTitle || `${formData.title} Post-Care Recovery`,
        altText: post?.altText || `Clinical Recovery Protocol for ${formData.title}`,
        caption: post?.caption || 'Cellular Healing & Protection',
        keywords: post?.seoKeywords?.length
          ? [...post.seoKeywords]
          : ['post-care recovery', 'cellular healing'],
        keywordInput: '',
      });
    } else if (typeof target === 'object' && target.type === 'portfolio') {
      const idx = target.index;
      setSeoForm({
        label: `Portfolio Image #${idx + 1} SEO`,
        seoTitle: `${formData.title} — Reference Detail #${idx + 1}`,
        altText: `${formData.title} Clinical Reference Photograph #${idx + 1} at Age Reversal Clinics`,
        caption: `Reference Detail #${idx + 1}`,
        keywords: [`${formData.title.toLowerCase()} gallery`, 'clinical portfolio london'],
        keywordInput: '',
      });
    }
  };

  const handleAutoGenerateSeoForm = () => {
    if (!formData) return;
    const baseName = formData.title.trim();
    const baseCat = (formData.category || 'Clinical Aesthetics').trim();
    setSeoForm((prev) => ({
      ...prev,
      seoTitle: `${baseName} | ${baseCat} — Age Reversal Clinics London`,
      altText: `${baseName} (${baseCat}) specialist clinical procedure at Age Reversal Clinics London`,
      keywords: Array.from(
        new Set([
          `${baseName.toLowerCase()} london`,
          `${baseCat.toLowerCase()} london`,
          `${baseName.toLowerCase()} before and after`,
          'age reversal clinics london',
          'harley street aesthetics',
        ])
      ),
    }));
  };

  const handleSaveSeoModal = () => {
    if (!formData || !seoTarget) return;
    const cleanKeywords = seoForm.keywords.filter(Boolean);
    let nextFormData: TreatmentDetail = { ...formData, id: selectedKey };

    if (seoTarget === 'page-hero') {
      const nextHero: TreatmentMediaItem = {
        ...(formData.heroMedia || { url: formData.imageUrl }),
        id: getServiceComponentSlotId(selectedKey, 'hero'),
        url: formData.heroMedia?.url || formData.imageUrl,
        seoTitle: seoForm.seoTitle,
        altText: seoForm.altText,
        seoKeywords: cleanKeywords,
      };
      nextFormData = {
        ...nextFormData,
        badgeText: seoForm.caption || nextFormData.badgeText,
        seoKeywords: cleanKeywords,
        heroMedia: nextHero,
      };
    } else if (seoTarget === 'overview-front') {
      const current: Partial<NonNullable<TreatmentDetail['overviewMedia']>> =
        formData.overviewMedia || {};
      const front = current.frontCard || current.frontImage || { url: formData.imageUrl };
      const updated: TreatmentMediaItem = {
        ...front,
        id: getServiceComponentSlotId(selectedKey, 'overview-front'),
        seoTitle: seoForm.seoTitle,
        altText: seoForm.altText,
        caption: seoForm.caption,
        seoKeywords: cleanKeywords,
      };
      nextFormData = {
        ...nextFormData,
        overviewMedia: {
          ...(current as NonNullable<TreatmentDetail['overviewMedia']>),
          frontCard: updated,
          frontImage: updated,
        },
      };
    } else if (seoTarget === 'overview-back') {
      const current: Partial<NonNullable<TreatmentDetail['overviewMedia']>> =
        formData.overviewMedia || {};
      const back = current.backCard || current.backImage || { url: formData.imageUrl };
      const updated: TreatmentMediaItem = {
        ...back,
        id: getServiceComponentSlotId(selectedKey, 'overview-back'),
        seoTitle: seoForm.seoTitle,
        altText: seoForm.altText,
        caption: seoForm.caption,
        seoKeywords: cleanKeywords,
      };
      nextFormData = {
        ...nextFormData,
        overviewMedia: {
          ...(current as NonNullable<TreatmentDetail['overviewMedia']>),
          backCard: updated,
          backImage: updated,
        },
      };
    } else if (seoTarget === 'concerns-media') {
      const current = formData.targetConcernsMedia || { url: formData.imageUrl };
      nextFormData = {
        ...nextFormData,
        targetConcernsMedia: {
          ...current,
          id: getServiceComponentSlotId(selectedKey, 'target-concerns'),
          seoTitle: seoForm.seoTitle,
          altText: seoForm.altText,
          caption: seoForm.caption || 'Targeted Bio-Calibration',
          seoKeywords: cleanKeywords,
        },
      };
    } else if (seoTarget === 'pre-care-media') {
      const current: Partial<NonNullable<TreatmentDetail['clinicalGuidanceMedia']>> =
        formData.clinicalGuidanceMedia || {};
      const pre = current.preCare || current.preCareVisual || { url: '' };
      const updated: TreatmentMediaItem = {
        ...pre,
        id: getServiceComponentSlotId(selectedKey, 'pre-care'),
        seoTitle: seoForm.seoTitle,
        altText: seoForm.altText,
        caption: seoForm.caption || 'Epidermal Prime & Hydration',
        seoKeywords: cleanKeywords,
      };
      nextFormData = {
        ...nextFormData,
        clinicalGuidanceMedia: {
          ...(current as NonNullable<TreatmentDetail['clinicalGuidanceMedia']>),
          preCare: updated,
          preCareVisual: updated,
        },
      };
    } else if (seoTarget === 'post-care-media') {
      const current: Partial<NonNullable<TreatmentDetail['clinicalGuidanceMedia']>> =
        formData.clinicalGuidanceMedia || {};
      const post = current.postCare || current.postCareVisual || { url: '' };
      const updated: TreatmentMediaItem = {
        ...post,
        id: getServiceComponentSlotId(selectedKey, 'post-care'),
        seoTitle: seoForm.seoTitle,
        altText: seoForm.altText,
        caption: seoForm.caption || 'Cellular Healing & Protection',
        seoKeywords: cleanKeywords,
      };
      nextFormData = {
        ...nextFormData,
        clinicalGuidanceMedia: {
          ...(current as NonNullable<TreatmentDetail['clinicalGuidanceMedia']>),
          postCare: updated,
          postCareVisual: updated,
        },
      };
    } else if (typeof seoTarget === 'object' && seoTarget.type === 'portfolio') {
      const idx = seoTarget.index;
      const targetUrl = formData.additionalImages?.[idx];
      if (targetUrl) {
        const nextPort = [...(formData.portfolioMedia || [])];
        nextPort[idx] = {
          id: getServiceComponentSlotId(selectedKey, `portfolio-${idx + 1}`),
          url: targetUrl,
          mediaType: 'image',
          seoTitle: seoForm.seoTitle,
          altText: seoForm.altText,
          caption: seoForm.caption || `Reference Detail #${idx + 1}`,
          seoKeywords: cleanKeywords,
        };
        nextFormData = {
          ...nextFormData,
          portfolioMedia: nextPort,
        };
        try {
          registerMediaAsset({
            name: seoForm.seoTitle || `${formData.title} Reference #${idx + 1}`,
            url: targetUrl,
            mediaType: 'image',
            category: 'Treatments',
            altText: seoForm.altText,
            seoKeywords: cleanKeywords,
          });
        } catch {}
      }
    }

    commitAndPersistFormData(nextFormData, 'SEO metadata saved');
    setSeoTarget(null);
  };

  // Handlers for Custom Before & After Cases
  const handleOpenAddCaseModal = () => {
    setEditingCase({
      id: `custom-case-${Date.now()}`,
      beforeImage: '',
      afterImage: '',
      title: `${formData?.title || 'Clinical'} Outcome`,
      duration: '8 Weeks',
      sessions: 2,
      beforeAltText: `${formData?.title || 'Treatment'} Before Treatment at Age Reversal Clinics London`,
      afterAltText: `${formData?.title || 'Treatment'} After Treatment Result at Age Reversal Clinics London`,
      seoTitle: `${formData?.title || 'Treatment'} — Before & After Result`,
      seoKeywords: [
        `${(formData?.title || 'treatment').toLowerCase()} before and after`,
        'age reversal clinics london',
      ],
    });
    setIsCaseSeoOpen(false);
    setIsCaseModalOpen(true);
  };

  const handleOpenEditCaseModal = (
    item: NonNullable<TreatmentDetail['customBeforeAfterPairs']>[0]
  ) => {
    setEditingCase({
      ...item,
      seoTitle: (item as any).seoTitle || `${item.title} — Before & After Result`,
      seoKeywords: (item as any).seoKeywords || [
        `${(formData?.title || 'treatment').toLowerCase()} before and after`,
      ],
    });
    setIsCaseSeoOpen(false);
    setIsCaseModalOpen(true);
  };

  const syncTreatmentCasesToCentralGallery = (treatmentForm: TreatmentDetail) => {
    try {
      if (
        treatmentForm.customBeforeAfterPairs &&
        treatmentForm.customBeforeAfterPairs.length > 0
      ) {
        const centralGallery = getBeforeAfterGalleryConfig();
        if (
          centralGallery &&
          Array.isArray(centralGallery.categories) &&
          centralGallery.categories.length > 0
        ) {
          const rawId = (treatmentForm.id || selectedKey || '').toLowerCase().trim();
          const normTitle = (treatmentForm.title || '').toLowerCase();
          const normCategory = (treatmentForm.category || '').toLowerCase();

          let matchedCat =
            centralGallery.categories.find((c) => c.id.toLowerCase() === rawId) ||
            centralGallery.categories.find(
              (c) =>
                c.name.toLowerCase() === normTitle ||
                normTitle.includes(c.name.toLowerCase()) ||
                c.name.toLowerCase().includes(normTitle)
            );

          if (!matchedCat) {
            let fallbackGroupId = 'facial-skin-care';
            if (normTitle.includes('hair') || normCategory.includes('hair'))
              fallbackGroupId = 'platelet-rich-plasma-prp';
            else if (
              normTitle.includes('scar') ||
              normTitle.includes('acne') ||
              normCategory.includes('scar')
            )
              fallbackGroupId = 'co2-laser-from';
            else if (
              normTitle.includes('filler') ||
              normTitle.includes('lip') ||
              normTitle.includes('jaw')
            )
              fallbackGroupId = 'dermal-fillers-1ml';
            else if (
              normTitle.includes('body') ||
              normTitle.includes('sculpt') ||
              normTitle.includes('emsculpt')
            )
              fallbackGroupId = 'emscuplt-body-sculpt-and-tightening';
            else if (normTitle.includes('profhilo')) fallbackGroupId = 'profhilo-2ml';
            else if (normTitle.includes('morpheus')) fallbackGroupId = 'morpheus8-treatment';
            else if (normTitle.includes('emface'))
              fallbackGroupId = 'emface-skin-tightening-and-lifting';
            matchedCat =
              centralGallery.categories.find((c) => c.id === fallbackGroupId) ||
              centralGallery.categories[0];
          }

          const targetCatId = matchedCat.id;
          let galleryChanged = false;

          const updatedCategories = centralGallery.categories.map((cat) => {
            if (cat.id !== targetCatId) return cat;
            const existingPairs = [...(cat.pairs || [])];
            treatmentForm.customBeforeAfterPairs?.forEach((customPair) => {
              if (!customPair.beforeImage || !customPair.afterImage) return;
              const existingIdx = existingPairs.findIndex((p) => p.id === customPair.id);
              const mappedPair: BeforeAfterPair = {
                id: customPair.id,
                title: customPair.title || `${treatmentForm.title} Outcome`,
                beforeImage: customPair.beforeImage,
                afterImage: customPair.afterImage,
                duration: customPair.duration || '8 Weeks',
                sessions:
                  typeof customPair.sessions === 'number'
                    ? customPair.sessions
                    : Number(customPair.sessions) || 2,
                linkedTreatmentId: treatmentForm.id || selectedKey,
                linkedTreatmentTitle: treatmentForm.title,
                treatmentGroupId: cat.id as any,
                beforeAltText:
                  customPair.beforeAltText ||
                  `${treatmentForm.title} Before Treatment at Age Reversal Clinics`,
                afterAltText:
                  customPair.afterAltText ||
                  `${treatmentForm.title} After Treatment Result at Age Reversal Clinics`,
                seoTitle:
                  (customPair as any).seoTitle ||
                  `${treatmentForm.title} — Before & After Results`,
                seoKeywords:
                  (customPair as any).seoKeywords && (customPair as any).seoKeywords.length > 0
                    ? (customPair as any).seoKeywords
                    : [
                        `${treatmentForm.title.toLowerCase()} before and after`,
                        `${cat.name.toLowerCase()} london`,
                        'clinical transformation',
                      ],
                updatedAt: Date.now(),
              };
              if (existingIdx >= 0) {
                existingPairs[existingIdx] = { ...existingPairs[existingIdx], ...mappedPair };
                galleryChanged = true;
              } else {
                existingPairs.push(mappedPair);
                galleryChanged = true;
              }
            });
            return { ...cat, pairs: existingPairs };
          });

          if (galleryChanged) {
            saveBeforeAfterGalleryConfig({ ...centralGallery, categories: updatedCategories });
          }
        }
      }
    } catch (gSyncErr) {
      console.warn('Could not sync custom pairs to central Before & After gallery:', gSyncErr);
    }
  };

  const handleSaveCase = () => {
    if (!formData || !editingCase) return;
    if (!editingCase.beforeImage.trim() || !editingCase.afterImage.trim()) {
      showToast('Please add both Before and After images.', 'error');
      return;
    }
    const currentPairs = [...(formData.customBeforeAfterPairs || [])];
    const existingIndex = currentPairs.findIndex((p) => p.id === editingCase.id);
    if (existingIndex >= 0) {
      currentPairs[existingIndex] = editingCase;
    } else {
      currentPairs.push(editingCase);
    }
    const nextFormData: TreatmentDetail = {
      ...formData,
      customBeforeAfterPairs: currentPairs,
      beforeImage: formData.beforeImage || editingCase.beforeImage,
      afterImage: formData.afterImage || editingCase.afterImage,
      updatedAt: Date.now(),
      isCustomized: true,
    };
    commitAndPersistFormData(nextFormData, `Saved "${editingCase.title}"`);
    syncTreatmentCasesToCentralGallery(nextFormData);

    setIsCaseModalOpen(false);
    setEditingCase(null);
  };

  const handleDeleteCustomCase = (id: string) => {
    if (!formData) return;
    const currentPairs = (formData.customBeforeAfterPairs || []).filter((p) => p.id !== id);
    const nextFormData: TreatmentDetail = {
      ...formData,
      customBeforeAfterPairs: currentPairs,
      updatedAt: Date.now(),
      isCustomized: true,
    };
    commitAndPersistFormData(nextFormData, 'Removed custom case');
  };

  const handleToggleExcludeGalleryPair = (pairId: string) => {
    if (!formData) return;
    const currentExcluded = new Set(formData.excludedGalleryPairIds || []);
    if (currentExcluded.has(pairId)) {
      currentExcluded.delete(pairId);
    } else {
      currentExcluded.add(pairId);
    }
    commitAndPersistFormData({
      ...formData,
      excludedGalleryPairIds: Array.from(currentExcluded),
    });
  };

  // List helpers (concerns, preCare, postCare)
  const moveListElement = (
    field: 'preCare' | 'postCare' | 'concerns',
    index: number,
    direction: -1 | 1
  ) => {
    if (!formData) return;
    const list = [...(formData[field] || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    commitAndPersistFormData({ ...formData, [field]: list });
  };

  const removeListElement = (field: 'preCare' | 'postCare' | 'concerns', index: number) => {
    if (!formData) return;
    const currentList = [...(formData[field] || [])].filter((_, i) => i !== index);
    commitAndPersistFormData({ ...formData, [field]: currentList });
  };

  const handleSaveListModal = () => {
    if (!formData || !listEditModal || !listEditModal.value.trim()) return;
    const currentList = [...(formData[listEditModal.field] || [])];
    if (listEditModal.index === null) {
      currentList.push(listEditModal.value.trim());
    } else {
      currentList[listEditModal.index] = listEditModal.value.trim();
    }
    commitAndPersistFormData(
      { ...formData, [listEditModal.field]: currentList },
      'Saved guideline item'
    );
    setListEditModal(null);
  };

  // Portfolio Gallery handlers
  const handleRemoveAdditionalImage = (index: number) => {
    if (!formData) return;
    const currentImages = [...(formData.additionalImages || [])].filter((_, i) => i !== index);
    commitAndPersistFormData({ ...formData, additionalImages: currentImages }, 'Removed image');
  };

  const handleMoveAdditionalImage = (index: number, direction: -1 | 1) => {
    if (!formData) return;
    const list = [...(formData.additionalImages || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    commitAndPersistFormData({ ...formData, additionalImages: list });
  };

  // Handle selecting an image from the Asset Library Picker
  const handlePickLibraryAsset = (url: string) => {
    if (!assetPickerTarget || !formData) return;
    if (assetPickerTarget.slot === 'hero') {
      updateMediaSlotUrl('hero', url);
    } else if (assetPickerTarget.slot === 'overview-front') {
      updateMediaSlotUrl('overview-front', url);
    } else if (assetPickerTarget.slot === 'overview-back') {
      updateMediaSlotUrl('overview-back', url);
    } else if (assetPickerTarget.slot === 'concerns-media') {
      updateMediaSlotUrl('concerns-media', url);
    } else if (assetPickerTarget.slot === 'pre-care-media') {
      updateMediaSlotUrl('pre-care-media', url);
    } else if (assetPickerTarget.slot === 'post-care-media') {
      updateMediaSlotUrl('post-care-media', url);
    } else if (assetPickerTarget.slot === 'case-before') {
      setEditingCase((prev) => (prev ? { ...prev, beforeImage: url } : null));
    } else if (assetPickerTarget.slot === 'case-after') {
      setEditingCase((prev) => (prev ? { ...prev, afterImage: url } : null));
    } else if (assetPickerTarget.slot === 'portfolio-add') {
      const currentImages = [...(formData.additionalImages || [])];
      currentImages.push(url);
      commitAndPersistFormData({ ...formData, additionalImages: currentImages });
    } else if (assetPickerTarget.slot === 'portfolio-replace') {
      const currentImages = [...(formData.additionalImages || [])];
      currentImages[assetPickerTarget.index] = url;
      commitAndPersistFormData({ ...formData, additionalImages: currentImages });
    }
    setAssetPickerTarget(null);
    showToast('Selected & saved image from library');
  };

  // Save changes to active database
  const handleSave = () => {
    if (!formData) return;
    const populated = {
      ...populateTreatmentMediaDefaults({ ...formData, id: selectedKey }),
      updatedAt: Date.now(),
      isCustomized: true,
    } as TreatmentDetail;
    setFormData(populated);
    const updatedDb = {
      ...db,
      [selectedKey]: populated,
    };
    setDb(updatedDb);
    saveTreatmentDetailsConfig(updatedDb);
    syncTreatmentCasesToCentralGallery(populated);
    showToast(`Saved ${populated.title}`);
  };

  // Reset selected treatment to defaults
  const handleResetSelected = () => {
    setConfirmDialog({
      title: 'Reset Service Components',
      message: `Reset "${db[selectedKey]?.title || selectedKey}" back to default specifications?`,
      confirmLabel: 'Reset Service',
      danger: true,
      onConfirm: () => {
        const defaultData = TREATMENT_DETAILS_DB[selectedKey];
        if (defaultData) {
          const restored = {
            ...JSON.parse(JSON.stringify(defaultData)),
            updatedAt: Date.now(),
          };
          const updatedDb = {
            ...db,
            [selectedKey]: restored,
          };
          setDb(updatedDb);
          saveTreatmentDetailsConfig(updatedDb);
          showToast(`Restored ${defaultData.title} to defaults`);
        } else {
          const fallbackData = createDefaultService(
            selectedKey,
            db[selectedKey]?.title || 'Custom Service',
            db[selectedKey]?.category || 'General'
          );
          const updatedDb = {
            ...db,
            [selectedKey]: fallbackData,
          };
          setDb(updatedDb);
          saveTreatmentDetailsConfig(updatedDb);
          showToast('Reset custom service parameters');
        }
        setConfirmDialog(null);
      },
    });
  };

  const createDefaultService = (
    key: string,
    title: string,
    category: string
  ): TreatmentDetail => ({
    ...populateTreatmentMediaDefaults({
      id: key,
      title,
      category,
      description:
        'Precision-guided clinical protocol tailored to restore dermal vitality, structural harmony, and cellular longevity.',
      imageUrl: '',
      badgeText: 'Specialist Protocol',
      procedureTime: '30 - 60 Minutes',
      comfortLevel: 'Comfortable (Topical numbing)',
      downtime: '24 - 48 Hours',
      recommendedSessions: '3 Sessions spaced 4 weeks apart',
      concerns: ['Dermal laxity & fine lines', 'Uneven texture & pores', 'Cellular hydration'],
      price: newPrice || '£350',
      targetLayer: 'Dermis',
      targetLayerDepth: '1.0mm - 2.0mm',
      beforeImage: '',
      afterImage: '',
      preCare: [
        'Avoid direct sun exposure for 72 hours prior.',
        'Discontinue active retinoids 5 days before treatment.',
      ],
      postCare: [
        'Apply hydrating hyaluronic serum as directed.',
        'Wear mineral SPF 50+ daily.',
      ],
      additionalImages: [],
    }),
    updatedAt: Date.now(),
    isCustomized: true,
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedKey = newKey.toLowerCase().replace(/[^a-z0-9-]/g, '').trim();
    if (!formattedKey || !newTitle.trim()) {
      showToast('Please provide a valid ID key and service title.', 'error');
      return;
    }
    if (db[formattedKey]) {
      showToast(`Service key "${formattedKey}" already exists.`, 'error');
      return;
    }

    const newService = createDefaultService(
      formattedKey,
      newTitle.trim(),
      newCategory.trim() || 'General Practice'
    );
    const updatedDb = {
      ...db,
      [formattedKey]: newService,
    };

    setDb(updatedDb);
    saveTreatmentDetailsConfig(updatedDb);
    setSelectedKey(formattedKey);
    setIsCreatingModalOpen(false);
    setNewKey('');
    setNewTitle('');
    setNewCategory('');
    setNewPrice('£350');
    showToast(`Created ${newService.title}`);
  };

  const handleDeleteService = (key: string) => {
    setConfirmDialog({
      title: 'Delete Custom Service Page',
      message: `Permanently delete "${db[key]?.title || key}"? This cannot be undone.`,
      confirmLabel: 'Delete Page',
      danger: true,
      onConfirm: () => {
        const updatedDb = { ...db };
        delete updatedDb[key];
        setDb(updatedDb);
        saveTreatmentDetailsConfig(updatedDb);
        const remainingKeys = Object.keys(updatedDb);
        if (remainingKeys.length > 0) setSelectedKey(remainingKeys[0]);
        setConfirmDialog(null);
        showToast('Deleted custom service page');
      },
    });
  };

  const handleResetAll = () => {
    setConfirmDialog({
      title: 'Restore All Defaults',
      message: 'Reset all clinical service pages back to factory defaults?',
      confirmLabel: 'Restore All',
      danger: true,
      onConfirm: () => {
        setDb(TREATMENT_DETAILS_DB);
        saveTreatmentDetailsConfig(TREATMENT_DETAILS_DB);
        setSelectedKey('botox-1-area');
        setConfirmDialog(null);
        showToast('Restored all service pages to defaults');
      },
    });
  };

  const coreTreatmentIds = useMemo(() => {
    const ids = new Set<string>();
    CLINICAL_AREAS_DB.forEach((area) => {
      area.categories.forEach((cat) => {
        ids.add(cat.id);
        cat.items.forEach((item) => {
          ids.add(item.id);
        });
      });
    });
    return ids;
  }, []);

  const customServiceKeys = useMemo(() => {
    return Object.keys(db).filter((key) => !coreTreatmentIds.has(key));
  }, [db, coreTreatmentIds]);

  if (!formData) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
        <div className="text-slate-500 text-sm flex items-center gap-3">
          <Database className="h-5 w-5 text-[#c5a880]" />
          <span>Loading service components...</span>
        </div>
      </div>
    );
  }

  const availableServices = Object.keys(db).map((key) => ({
    key,
    title: db[key]?.title || key,
    category: db[key]?.category || 'General Practice',
    id: db[key]?.id || key,
  }));

  const categories = [
    'all',
    ...Array.from(new Set(availableServices.map((s) => s.category.trim()).filter(Boolean))),
  ];

  const filteredServices = availableServices.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Resolve current visual URLs for each component slot
  const heroImageUrl = formData.heroMedia?.url || formData.imageUrl || '';
  const frontCardMedia =
    formData.overviewMedia?.frontCard || formData.overviewMedia?.frontImage;
  const backCardMedia =
    formData.overviewMedia?.backCard || formData.overviewMedia?.backImage;
  const concernsMedia = formData.targetConcernsMedia;
  const preCareMedia =
    formData.clinicalGuidanceMedia?.preCare ||
    formData.clinicalGuidanceMedia?.preCareVisual;
  const postCareMedia =
    formData.clinicalGuidanceMedia?.postCare ||
    formData.clinicalGuidanceMedia?.postCareVisual;

  const sectionTabs: Array<{ id: EditorSectionFilter; label: string }> = [
    { id: 'all', label: 'All Components' },
    { id: 'hero', label: 'Hero & SEO' },
    { id: 'overview', label: 'Overview & Cards' },
    { id: 'expectations', label: 'Expectations' },
    { id: 'profiler', label: 'Dermal Profiler' },
    { id: 'before-after', label: 'Before & After' },
    { id: 'concerns', label: 'Target Concerns' },
    { id: 'care', label: 'Care Protocols' },
    { id: 'portfolio', label: 'Media Portfolio' },
  ];

  const showSection = (sec: EditorSectionFilter) =>
    activeSectionTab === 'all' || activeSectionTab === sec;

  // Reusable Service Tree Renderer (used in desktop sidebar + mobile drawer)
  const renderServiceNavigationList = (onSelectCallback?: () => void) => (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search treatments..."
          className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334] bg-slate-50 focus:bg-white"
        />
      </div>

      {searchTerm && (
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#003334] text-white border-[#003334]'
                  : 'text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
        {searchTerm ? (
          <div className="space-y-1">
            {filteredServices.map((service) => (
              <button
                key={service.key}
                type="button"
                onClick={() => {
                  setSelectedKey(service.key);
                  onSelectCallback?.();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  selectedKey === service.key
                    ? 'bg-[#003334] text-white'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-semibold truncate">{service.title}</div>
                  <div
                    className={`text-[10px] truncate ${
                      selectedKey === service.key ? 'text-[#c5a880]' : 'text-slate-400'
                    }`}
                  >
                    {service.category}
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
              </button>
            ))}
            {filteredServices.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400">No matches found</div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {CLINICAL_AREAS_DB.map((area) => {
              const isExpanded = !!expandedAreas[area.id];
              return (
                <div
                  key={area.id}
                  className="border border-slate-200/80 rounded-xl overflow-hidden bg-white"
                >
                  <button
                    type="button"
                    onClick={() => toggleArea(area.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  >
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {area.name}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="p-1.5 space-y-2 bg-white border-t border-slate-100">
                      {area.categories.map((cat) => {
                        const isCatSelected = selectedKey === cat.id;
                        return (
                          <div key={cat.id} className="space-y-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedKey(cat.id);
                                onSelectCallback?.();
                              }}
                              className={`w-full text-left px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                isCatSelected
                                  ? 'bg-[#003334] text-[#c5a880]'
                                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                              }`}
                            >
                              <span className="truncate">{cat.name}</span>
                              {isCatSelected && <Check className="h-3 w-3 shrink-0" />}
                            </button>
                            <div className="space-y-0.5 pl-1">
                              {cat.items.map((item) => {
                                const isSelected = selectedKey === item.id;
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedKey(item.id);
                                      onSelectCallback?.();
                                    }}
                                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                                      isSelected
                                        ? 'bg-[#003334] text-white font-semibold'
                                        : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                                    }`}
                                  >
                                    <span className="truncate pr-1">{item.name}</span>
                                    <ChevronRight
                                      className={`h-3 w-3 shrink-0 ${
                                        isSelected ? 'text-[#c5a880]' : 'text-slate-300'
                                      }`}
                                    />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {customServiceKeys.length > 0 && (
              <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleArea('custom')}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                >
                  <span className="text-xs font-semibold text-slate-800">Custom Pages</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                      expandedAreas.custom ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedAreas.custom && (
                  <div className="p-1.5 space-y-0.5 bg-white border-t border-slate-100">
                    {customServiceKeys.map((key) => {
                      const isSelected = selectedKey === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setSelectedKey(key);
                            onSelectCallback?.();
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#003334] text-white font-semibold'
                              : 'hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <span className="truncate pr-1">{db[key]?.title || key}</span>
                          <ChevronRight className="h-3 w-3 shrink-0 opacity-60" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-5 font-sans text-slate-800" id="service-view-editor-root">
      {/* Hidden File Inputs for Clean 1-Click Image Uploads (With Deterministic Slot IDs) */}
      <input
        ref={heroFileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(
              file,
              (url) => updateMediaSlotUrl('hero', url),
              'hero',
              heroImageUrl
            );
          }
          e.target.value = '';
        }}
      />
      <input
        ref={frontCardFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(
              file,
              (url) => updateMediaSlotUrl('overview-front', url),
              'overview-front',
              frontCardMedia?.url
            );
          }
          e.target.value = '';
        }}
      />
      <input
        ref={backCardFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(
              file,
              (url) => updateMediaSlotUrl('overview-back', url),
              'overview-back',
              backCardMedia?.url
            );
          }
          e.target.value = '';
        }}
      />
      <input
        ref={concernsFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(
              file,
              (url) => updateMediaSlotUrl('concerns-media', url),
              'target-concerns',
              concernsMedia?.url
            );
          }
          e.target.value = '';
        }}
      />
      <input
        ref={preCareFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(
              file,
              (url) => updateMediaSlotUrl('pre-care-media', url),
              'pre-care',
              preCareMedia?.url
            );
          }
          e.target.value = '';
        }}
      />
      <input
        ref={postCareFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(
              file,
              (url) => updateMediaSlotUrl('post-care-media', url),
              'post-care',
              postCareMedia?.url
            );
          }
          e.target.value = '';
        }}
      />
      <input
        ref={portfolioFileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (!files.length) return;
          const startIdx = (formData.additionalImages || []).length;
          files.forEach((file, offset) => {
            const slotIdx = startIdx + offset + 1;
            handleFileUpload(
              file,
              (url) => {
                setFormData((prev) => {
                  if (!prev) return prev;
                  const nextImages = [...(prev.additionalImages || []), url];
                  const nextData: TreatmentDetail = {
                    ...populateTreatmentMediaDefaults({
                      ...prev,
                      id: selectedKey,
                      additionalImages: nextImages,
                    }),
                    updatedAt: Date.now(),
                    isCustomized: true,
                  };
                  setDb((prevDb) => {
                    const updatedDb = { ...prevDb, [selectedKey]: nextData };
                    saveTreatmentDetailsConfig(updatedDb);
                    return updatedDb;
                  });
                  return nextData;
                });
              },
              `portfolio-${slotIdx}`
            );
          });
          e.target.value = '';
        }}
      />
      <input
        ref={replacePortfolioInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && replacePortfolioIdx !== null) {
            const targetIdx = replacePortfolioIdx;
            const prevUrl = formData.additionalImages?.[targetIdx];
            handleFileUpload(
              file,
              (url) => {
                setFormData((prev) => {
                  if (!prev) return prev;
                  const next = [...(prev.additionalImages || [])];
                  next[targetIdx] = url;
                  const nextData: TreatmentDetail = {
                    ...populateTreatmentMediaDefaults({
                      ...prev,
                      id: selectedKey,
                      additionalImages: next,
                    }),
                    updatedAt: Date.now(),
                    isCustomized: true,
                  };
                  setDb((prevDb) => {
                    const updatedDb = { ...prevDb, [selectedKey]: nextData };
                    saveTreatmentDetailsConfig(updatedDb);
                    return updatedDb;
                  });
                  return nextData;
                });
              },
              `portfolio-${targetIdx + 1}`,
              prevUrl
            );
          }
          setReplacePortfolioIdx(null);
          e.target.value = '';
        }}
      />

      {/* Top Sticky Action & Service Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile / Tablet Service Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileServiceDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 shrink-0 cursor-pointer"
          >
            <PanelLeft className="w-4 h-4 text-[#003334]" />
            <span>Services</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{formData.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px]">{formData.id}</span>
              {formData.price && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[#003334]">{formData.price}</span>
                </>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#003334] truncate">
              {formData.title}
            </h3>
          </div>
        </div>

        {/* Right Actions: Page SEO Drawer + Save + 3-Dot Menu */}
        <div className="flex items-center gap-2 shrink-0">
          {isUploading && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 mr-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c5a880]" />
              <span>Uploading</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => openSeoModal('page-hero')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-[#c5a880] bg-white text-xs font-semibold text-slate-700 hover:text-[#003334] flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Globe className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Page SEO</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#003334] hover:bg-[#002526] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Save className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Save Changes</span>
          </button>

          {/* Top 3-Dot Menu for Page Management */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpenMenuId(openMenuId === 'top-page-menu' ? null : 'top-page-menu')}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
              aria-label="More service actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {openMenuId === 'top-page-menu' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-40 text-xs"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuId(null);
                      setIsCreatingModalOpen(true);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#003334]" />
                    <span>New Custom Service Page</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuId(null);
                      setIsMobileServiceDrawerOpen(true);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-500" />
                    <span>Switch Service Drawer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuId(null);
                      handleResetSelected();
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reset Current Service</span>
                  </button>
                  {!TREATMENT_DETAILS_DB[selectedKey] && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        handleDeleteService(selectedKey);
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Custom Service</span>
                    </button>
                  )}
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuId(null);
                      handleResetAll();
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore All Defaults</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`px-4 py-3 rounded-xl flex items-center justify-between border text-xs font-medium ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Segmented Component Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {sectionTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSectionTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSectionTab === tab.id
                ? 'bg-[#003334] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Desktop Service Selector */}
        <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 sticky top-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-800">Select Treatment</span>
            <button
              type="button"
              onClick={() => setIsCreatingModalOpen(true)}
              className="text-[11px] font-semibold text-[#003334] hover:text-[#c5a880] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>
          {renderServiceNavigationList()}
        </aside>

        {/* Right Main Column: Clean, Low-Text Component Cards */}
        <div className="lg:col-span-9 space-y-6">
          {/* 1. HERO & BANNER COMPONENT */}
          {showSection('hero') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#c5a880]" />
                  <h4 className="text-sm font-bold text-[#003334]">1. Hero &amp; Banner</h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openSeoModal('page-hero')}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#c5a880] text-xs font-medium text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>SEO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsHeroEditModalOpen(true)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Details</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                {/* Prominent Visual Hero Image Card (No URL Input) */}
                <div className="md:col-span-5">
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                    <ClinicImageWithPlaceholder
                      src={heroImageUrl}
                      alt={formData.heroMedia?.altText || formData.title}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Top-right 3-dot menu on image card */}
                    <div
                      className="absolute top-2.5 right-2.5 z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(openMenuId === 'hero-img-menu' ? null : 'hero-img-menu')
                        }
                        className="p-1.5 rounded-lg bg-black/50 hover:bg-black/75 text-white backdrop-blur-xs cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {openMenuId === 'hero-img-menu' && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-30 text-xs"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                heroFileInputRef.current?.click();
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                            >
                              <Upload className="w-3.5 h-3.5 text-[#003334]" />
                              <span>Upload Image</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                setAssetPickerTarget({ slot: 'hero' });
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                            >
                              <FolderOpen className="w-3.5 h-3.5 text-[#c5a880]" />
                              <span>Asset Library</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                openSeoModal('page-hero');
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                            >
                              <Globe className="w-3.5 h-3.5 text-slate-500" />
                              <span>Edit Image SEO</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Prominent Add / Change Image Action Bar */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                      <span className="text-xs font-semibold text-white truncate">
                        Hero Backdrop
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => heroFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-white text-[#003334] hover:bg-[#c5a880] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{heroImageUrl ? 'Change Image' : 'Add Image'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAssetPickerTarget({ slot: 'hero' })}
                          className="p-1.5 rounded-lg bg-black/50 hover:bg-black/75 text-white backdrop-blur-xs cursor-pointer"
                          title="Choose from Asset Library"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Hero Summary Details */}
                <div className="md:col-span-7 flex flex-col justify-between bg-slate-50/70 rounded-xl p-4 border border-slate-200/80">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Headline Title</span>
                      <span className="text-sm font-bold text-slate-900">{formData.title}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Intro Kicker</span>
                      <span className="text-sm font-medium text-slate-700">
                        {formData.badgeText || 'Specialist Protocol'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Category</span>
                      <span className="text-xs font-medium text-slate-700">
                        {formData.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Starting Price</span>
                      <span className="text-sm font-mono font-bold text-[#003334] tabular-nums">
                        {formData.price || '£150'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate">
                      SEO: {formData.seoKeywords?.length || 0} keywords ·{' '}
                      {formData.heroMedia?.altText ? 'Alt text set' : 'Auto alt text'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsHeroEditModalOpen(true)}
                      className="text-[#003334] font-semibold hover:underline shrink-0 ml-2 cursor-pointer"
                    >
                      Edit Headline &amp; Price
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. OVERVIEW & DUAL PROCEDURAL MEDIA CARDS */}
          {showSection('overview') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#c5a880]" />
                  <h4 className="text-sm font-bold text-[#003334]">
                    2. Overview &amp; Dual Media Cards
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOverviewTextModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Narrative &amp; Quote</span>
                </button>
              </div>

              {/* Clean Narrative Summary Box */}
              <div
                onClick={() => setIsOverviewTextModalOpen(true)}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-colors cursor-pointer space-y-2"
              >
                <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                  {formData.description}
                </p>
                <p className="text-xs text-slate-500 italic line-clamp-1">
                  “
                  {formData.protocolQuote ||
                    'Every protocol is strictly diagnostic-first, ensuring high safety parameters and clinical efficacy.'}
                  ”
                </p>
              </div>

              {/* Dual Overlapping Image Cards (Zero URL Inputs — Standout Add Image Buttons + SEO) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    key: 'overview-front' as const,
                    title: 'Front Focal Card',
                    subtitle: 'Bottom-Right Foreground',
                    media: frontCardMedia,
                    fallbackUrl: formData.imageUrl,
                    inputRef: frontCardFileInputRef,
                    menuId: 'overview-front-menu',
                  },
                  {
                    key: 'overview-back' as const,
                    title: 'Back Framing Card',
                    subtitle: 'Top-Left Background',
                    media: backCardMedia,
                    fallbackUrl: '',
                    inputRef: backCardFileInputRef,
                    menuId: 'overview-back-menu',
                  },
                ].map((card) => {
                  const imgUrl = card.media?.url || card.fallbackUrl || '';
                  return (
                    <div
                      key={card.key}
                      className="rounded-xl border border-slate-200 overflow-hidden bg-white flex flex-col"
                    >
                      <div className="relative aspect-[16/10] w-full bg-slate-50 overflow-hidden">
                        <ClinicImageWithPlaceholder
                          src={imgUrl}
                          alt={card.media?.altText || card.title}
                          containerClassName="w-full h-full"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                        {/* 3-Dot Menu */}
                        <div
                          className="absolute top-2.5 right-2.5 z-20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(openMenuId === card.menuId ? null : card.menuId)
                            }
                            className="p-1.5 rounded-lg bg-black/50 hover:bg-black/75 text-white backdrop-blur-xs cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <AnimatePresence>
                            {openMenuId === card.menuId && (
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-30 text-xs"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    card.inputRef.current?.click();
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                >
                                  <Upload className="w-3.5 h-3.5 text-[#003334]" />
                                  <span>Upload Image</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setAssetPickerTarget({ slot: card.key });
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                >
                                  <FolderOpen className="w-3.5 h-3.5 text-[#c5a880]" />
                                  <span>Asset Library</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    openSeoModal(card.key);
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                >
                                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Card SEO &amp; Alt</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Standout Add Image Controls */}
                        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-white block truncate">
                              {card.title}
                            </span>
                            <span className="text-[10px] text-white/75 block truncate">
                              {card.subtitle}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => card.inputRef.current?.click()}
                              className="px-3 py-1.5 rounded-lg bg-white text-[#003334] hover:bg-[#c5a880] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{imgUrl ? 'Change' : 'Add Image'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openSeoModal(card.key)}
                              className="px-2.5 py-1.5 rounded-lg bg-black/55 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-xs cursor-pointer"
                              title="Edit Card SEO"
                            >
                              SEO
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. CLINICAL EXPECTATIONS (Clean Summary Grid + Modal Editor) */}
          {showSection('expectations') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#c5a880]" />
                  <h4 className="text-sm font-bold text-[#003334]">3. Clinical Expectations</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExpectationsModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Parameters</span>
                </button>
              </div>

              <div
                onClick={() => setIsExpectationsModalOpen(true)}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 cursor-pointer"
              >
                {[
                  { label: 'Procedure Time', value: formData.procedureTime },
                  { label: 'Comfort Level', value: formData.comfortLevel },
                  { label: 'Downtime', value: formData.downtime },
                  { label: 'Sessions', value: formData.recommendedSessions },
                  { label: 'Anesthesia', value: formData.anesthesia || 'Topical numbing' },
                  { label: 'Longevity', value: formData.longevity || '6 - 12 Months' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-colors"
                  >
                    <span className="text-[11px] text-slate-400 block">{stat.label}</span>
                    <span className="text-xs font-semibold text-slate-800 mt-0.5 block truncate">
                      {stat.value || 'Not set'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. INTERACTIVE DERMAL PROFILER CALIBRATION */}
          {showSection('profiler') &&
            (() => {
              const currentLayer =
                (formData.targetLayer as
                  | 'Epidermis'
                  | 'Dermis'
                  | 'Subdermal Adipose'
                  | 'SMAS Muscle Layer') || 'Dermis';
              const activeDefaultSpecs =
                DEFAULT_LAYER_SPECS[currentLayer] || DEFAULT_LAYER_SPECS.Dermis;
              const activeFrequency =
                formData.dermalSpecs?.frequency || activeDefaultSpecs.frequency;
              const activeEnergy = formData.dermalSpecs?.energy || activeDefaultSpecs.energy;
              const activeTemp =
                formData.dermalSpecs?.temperature || activeDefaultSpecs.temperature;
              const activeMechanism =
                formData.dermalSpecs?.mechanism || activeDefaultSpecs.mechanism;

              const layerOptions: Array<{
                id: 'Epidermis' | 'Dermis' | 'Subdermal Adipose' | 'SMAS Muscle Layer';
                label: string;
                depth: string;
              }> = [
                { id: 'Epidermis', label: 'Epidermis', depth: '0.1mm - 0.5mm' },
                { id: 'Dermis', label: 'Dermis', depth: '1.0mm - 3.0mm' },
                { id: 'Subdermal Adipose', label: 'Adipose', depth: '3.0mm - 4.5mm' },
                { id: 'SMAS Muscle Layer', label: 'SMAS Muscle', depth: '4.5mm+' },
              ];

              return (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-[#c5a880]" />
                      <h4 className="text-sm font-bold text-[#003334]">4. Dermal Layer Profiler</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          commitAndPersistFormData(
                            {
                              ...formData,
                              profilerEnabled:
                                formData.profilerEnabled === false ? true : false,
                            },
                            formData.profilerEnabled === false
                              ? 'Dermal Profiler enabled'
                              : 'Dermal Profiler hidden'
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                          formData.profilerEnabled !== false
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {formData.profilerEnabled !== false ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>

                      {formData.profilerEnabled !== false && (
                        <button
                          type="button"
                          onClick={() => setIsProfilerModalOpen(true)}
                          className="px-3 py-1.5 rounded-lg bg-[#003334] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5 text-[#c5a880]" />
                          <span>Calibrate</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {formData.profilerEnabled !== false && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                        {layerOptions.map((opt) => {
                          const isSelected = formData.targetLayer === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                commitAndPersistFormData(
                                  {
                                    ...formData,
                                    targetLayer: opt.id,
                                    targetLayerDepth: opt.depth,
                                  },
                                  `Saved target layer: ${opt.label}`
                                );
                              }}
                              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#003334] text-white border-[#003334]'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              <span className="text-xs font-bold block truncate">{opt.label}</span>
                              <span
                                className={`text-[11px] font-mono tabular-nums block ${
                                  isSelected ? 'text-[#c5a880]' : 'text-slate-400'
                                }`}
                              >
                                {opt.depth}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-900 text-white">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Depth</span>
                          <span className="text-xs font-mono font-bold text-[#c5a880] truncate block">
                            {formData.targetLayerDepth}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Frequency</span>
                          <span className="text-xs font-mono truncate block">
                            {activeFrequency}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Energy / Temp</span>
                          <span className="text-xs font-mono truncate block">
                            {activeEnergy} · {activeTemp}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Mechanism</span>
                          <span className="text-xs text-slate-300 truncate block">
                            {activeMechanism}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

          {/* 5. BEFORE & AFTER CASES (Visual Cards + 3-Dot Menu + Clean Modal without URL Inputs) */}
          {showSection('before-after') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Smile className="h-4 w-4 text-[#c5a880]" />
                  <h4 className="text-sm font-bold text-[#003334]">
                    5. Before &amp; After Comparisons
                  </h4>
                  <span className="text-xs text-slate-400 tabular-nums">
                    ({(formData.customBeforeAfterPairs || []).length + matchingGalleryCases.length})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddCaseModal}
                  className="px-3.5 py-1.5 bg-[#003334] hover:bg-[#002526] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Add Case</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Custom Service Cases */}
                {(formData.customBeforeAfterPairs || []).map((cCase) => {
                  const menuKey = `custom-case-${cCase.id}`;
                  return (
                    <div
                      key={cCase.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 block truncate">
                            {cCase.title}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Custom Case · {cCase.duration || 'Clinical Outcome'}
                          </span>
                        </div>

                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(openMenuId === menuKey ? null : menuKey)
                            }
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <AnimatePresence>
                            {openMenuId === menuKey && (
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                className="absolute right-0 mt-1 w-40 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-30 text-xs"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    handleOpenEditCaseModal(cCase);
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit Case &amp; SEO</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    handleDeleteCustomCase(cCase.id);
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-rose-50 flex items-center gap-2 text-rose-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Case</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          <ClinicImageWithPlaceholder
                            src={cCase.beforeImage}
                            alt={cCase.beforeAltText || 'Before'}
                            containerClassName="w-full h-full"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold uppercase">
                            Before
                          </span>
                        </div>
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          <ClinicImageWithPlaceholder
                            src={cCase.afterImage}
                            alt={cCase.afterAltText || 'After'}
                            containerClassName="w-full h-full"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#003334]/90 text-[#c5a880] text-[9px] font-bold uppercase">
                            After
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Mirrored Gallery Cases */}
                {matchingGalleryCases.map(({ pair, groupName, isDirect }) => {
                  const isExcluded = Boolean(formData.excludedGalleryPairIds?.includes(pair.id));
                  return (
                    <div
                      key={pair.id}
                      className={`p-3.5 rounded-xl border transition-opacity space-y-2.5 ${
                        isExcluded
                          ? 'bg-slate-50 border-slate-200 opacity-55'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 block truncate">
                            {pair.title || 'Clinical Outcome'}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {isDirect ? 'Direct Match' : `Subcategory: ${groupName}`}
                            {pair.duration ? ` · ${pair.duration}` : ''}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleExcludeGalleryPair(pair.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer shrink-0 ${
                            isExcluded
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          {isExcluded ? (
                            <>
                              <Link2 className="w-3 h-3" />
                              <span>Show</span>
                            </>
                          ) : (
                            <>
                              <Link2Off className="w-3 h-3" />
                              <span>Hide</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          <ClinicImageWithPlaceholder
                            src={pair.beforeImage || pair.singleFrameImage}
                            alt={pair.beforeAltText || 'Before'}
                            containerClassName="w-full h-full"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold uppercase">
                            Before
                          </span>
                        </div>
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          <ClinicImageWithPlaceholder
                            src={pair.afterImage || pair.singleFrameImage}
                            alt={pair.afterAltText || 'After'}
                            containerClassName="w-full h-full"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#003334]/90 text-[#c5a880] text-[9px] font-bold uppercase">
                            After
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {(formData.customBeforeAfterPairs || []).length === 0 &&
                matchingGalleryCases.length === 0 && (
                  <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      No Before &amp; After pairs assigned to this treatment or subcategory yet.
                    </span>
                    <button
                      type="button"
                      onClick={handleOpenAddCaseModal}
                      className="px-3.5 py-2 bg-white border border-slate-200 hover:border-[#c5a880] text-xs font-bold text-[#003334] rounded-xl cursor-pointer shrink-0"
                    >
                      + Add First Case
                    </button>
                  </div>
                )}
            </div>
          )}

          {/* 6. TARGET CONCERNS & VISUAL CARD */}
          {showSection('concerns') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-[#c5a880]" />
                  <h4 className="text-sm font-bold text-[#003334]">6. Target Concerns</h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openSeoModal('concerns-media')}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#c5a880] text-xs font-medium text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>SEO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setListEditModal({
                        field: 'concerns',
                        title: 'Add Target Concern',
                        index: null,
                        value: '',
                      })
                    }
                    className="px-3 py-1.5 bg-[#003334] text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>Add Concern</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                {/* Left: Clean Concerns List */}
                <div className="md:col-span-7 space-y-2">
                  {formData.concerns.map((concern, index) => {
                    const menuKey = `concern-${index}`;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/70"
                      >
                        <span className="text-xs font-medium text-slate-800">{concern}</span>
                        <div
                          className="relative shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(openMenuId === menuKey ? null : menuKey)
                            }
                            className="p-1 rounded-lg hover:bg-slate-200/70 text-slate-500 cursor-pointer"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                          <AnimatePresence>
                            {openMenuId === menuKey && (
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                className="absolute right-0 mt-1 w-36 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-30 text-xs"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setListEditModal({
                                      field: 'concerns',
                                      title: 'Edit Target Concern',
                                      index,
                                      value: concern,
                                    });
                                  }}
                                  className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      moveListElement('concerns', index, -1);
                                    }}
                                    className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                    <span>Move Up</span>
                                  </button>
                                )}
                                {index < formData.concerns.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      moveListElement('concerns', index, 1);
                                    }}
                                    className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                    <span>Move Down</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    removeListElement('concerns', index);
                                  }}
                                  className="w-full px-3 py-1.5 text-left hover:bg-rose-50 flex items-center gap-2 text-rose-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                  {formData.concerns.length === 0 && (
                    <div className="text-xs text-slate-400 py-4 text-center">
                      No target concerns added yet.
                    </div>
                  )}
                </div>

                {/* Right: Target Concerns Visual Card (Zero URL Input) */}
                <div className="md:col-span-5">
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <ClinicImageWithPlaceholder
                      src={concernsMedia?.url}
                      alt={concernsMedia?.altText || formData.title}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                      <span className="text-xs font-bold text-white truncate">
                        {concernsMedia?.caption || 'Targeted Bio-Calibration'}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => concernsFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-white text-[#003334] hover:bg-[#c5a880] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Add Image</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAssetPickerTarget({ slot: 'concerns-media' })}
                          className="p-1.5 rounded-lg bg-black/55 hover:bg-black/80 text-white cursor-pointer"
                          title="Choose from Library"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. CLINICAL CARE PROTOCOLS (Pre-Care & Post-Care + Visual Cards & SEO) */}
          {showSection('care') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  field: 'preCare' as const,
                  title: 'Pre-Care Guidelines',
                  media: preCareMedia,
                  seoSlot: 'pre-care-media' as const,
                  inputRef: preCareFileInputRef,
                  defaultCaption: 'Epidermal Prime & Hydration',
                },
                {
                  field: 'postCare' as const,
                  title: 'Post-Care Recovery',
                  media: postCareMedia,
                  seoSlot: 'post-care-media' as const,
                  inputRef: postCareFileInputRef,
                  defaultCaption: 'Cellular Healing & Protection',
                },
              ].map((panel) => (
                <div
                  key={panel.field}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-[#c5a880]" />
                      <h4 className="text-sm font-bold text-[#003334]">{panel.title}</h4>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openSeoModal(panel.seoSlot)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-[#c5a880] text-xs font-medium text-slate-700 cursor-pointer"
                      >
                        SEO
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setListEditModal({
                            field: panel.field,
                            title: `Add ${panel.title} Step`,
                            index: null,
                            value: '',
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-[#003334] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-[#c5a880]" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                  {/* Standout Visual Card for Care Protocol (No URL Input) */}
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <ClinicImageWithPlaceholder
                      src={panel.media?.url}
                      alt={panel.media?.altText || panel.title}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between gap-2 z-10">
                      <span className="text-xs font-semibold text-white truncate">
                        {panel.media?.caption || panel.defaultCaption}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => panel.inputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-white text-[#003334] hover:bg-[#c5a880] text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Add Image</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAssetPickerTarget({ slot: panel.seoSlot })}
                          className="p-1.5 rounded-lg bg-black/55 hover:bg-black/80 text-white cursor-pointer"
                          title="Choose from Library"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Checklist Items with 3-Dot Action Menu */}
                  <div className="space-y-1.5">
                    {formData[panel.field].map((instruction, index) => {
                      const menuKey = `${panel.field}-${index}`;
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70"
                        >
                          <span className="text-xs text-slate-700 leading-snug">
                            {instruction}
                          </span>
                          <div
                            className="relative shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuId(openMenuId === menuKey ? null : menuKey)
                              }
                              className="p-1 rounded-lg hover:bg-slate-200/70 text-slate-500 cursor-pointer"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                            <AnimatePresence>
                              {openMenuId === menuKey && (
                                <motion.div
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 4 }}
                                  className="absolute right-0 mt-1 w-36 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-30 text-xs"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setListEditModal({
                                        field: panel.field,
                                        title: `Edit ${panel.title}`,
                                        index,
                                        value: instruction,
                                      });
                                    }}
                                    className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      removeListElement(panel.field, index);
                                    }}
                                    className="w-full px-3 py-1.5 text-left hover:bg-rose-50 flex items-center gap-2 text-rose-600"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 8. CLINICAL MEDIA PORTFOLIO GALLERY (Zero URL Inputs — Visual Cards + 3-Dot Menus) */}
          {showSection('portfolio') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-[#c5a880]" />
                  <h4 className="text-sm font-bold text-[#003334]">
                    8. Clinical Media Portfolio
                  </h4>
                  <span className="text-xs text-slate-400 tabular-nums">
                    ({(formData.additionalImages || []).length})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAssetPickerTarget({ slot: 'portfolio-add' })}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#c5a880] text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>From Library</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => portfolioFileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-[#003334] hover:bg-[#002526] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>Add Images</span>
                  </button>
                </div>
              </div>

              {(formData.additionalImages || []).length === 0 ? (
                <div
                  onClick={() => portfolioFileInputRef.current?.click()}
                  className="p-8 rounded-xl border border-dashed border-slate-200 hover:border-[#c5a880] bg-slate-50/60 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-[#003334]" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    Click to Add Portfolio Images
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Supports single or multiple images (auto-optimized)
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {(formData.additionalImages || []).map((imgUrl, index) => {
                    const menuKey = `portfolio-card-${index}`;
                    return (
                      <div
                        key={`${imgUrl}-${index}`}
                        className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
                      >
                        <ClinicImageWithPlaceholder
                          src={imgUrl}
                          alt={`${formData.title} Portfolio #${index + 1}`}
                          containerClassName="w-full h-full"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                        <span className="absolute bottom-2 left-2.5 text-[11px] font-semibold text-white">
                          #{index + 1}
                        </span>

                        {/* 3-Dot Action Menu */}
                        <div
                          className="absolute top-2 right-2 z-20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(openMenuId === menuKey ? null : menuKey)
                            }
                            className="p-1.5 rounded-lg bg-black/50 hover:bg-black/75 text-white backdrop-blur-xs cursor-pointer"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                          <AnimatePresence>
                            {openMenuId === menuKey && (
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                className="absolute right-0 mt-1 w-40 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-30 text-xs"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setReplacePortfolioIdx(index);
                                    setTimeout(
                                      () => replacePortfolioInputRef.current?.click(),
                                      20
                                    );
                                  }}
                                  className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Replace Image</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setAssetPickerTarget({
                                      slot: 'portfolio-replace',
                                      index,
                                    });
                                  }}
                                  className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                >
                                  <FolderOpen className="w-3.5 h-3.5 text-[#c5a880]" />
                                  <span>From Library</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    openSeoModal({ type: 'portfolio', index });
                                  }}
                                  className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                >
                                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Edit SEO</span>
                                </button>
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      handleMoveAdditionalImage(index, -1);
                                    }}
                                    className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                    <span>Move Earlier</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    handleRemoveAdditionalImage(index);
                                  }}
                                  className="w-full px-3 py-1.5 text-left hover:bg-rose-50 flex items-center gap-2 text-rose-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
          SUPPORTIVE MODALS, MOBILE BOTTOM SHEETS & SLIDE-OVER DRAWERS
      ===================================================================== */}

      {/* 1. MOBILE / TABLET SERVICE SWITCHER DRAWER */}
      <AnimatePresence>
        {isMobileServiceDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileServiceDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="relative z-10 w-80 max-w-[85vw] bg-white h-full p-5 overflow-y-auto shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-bold text-[#003334]">Select Service Page</span>
                <button
                  type="button"
                  onClick={() => setIsMobileServiceDrawerOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {renderServiceNavigationList(() => setIsMobileServiceDrawerOpen(false))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. COMPONENT & IMAGE SEO DRAWER / BOTTOM SHEET */}
      <AnimatePresence>
        {seoTarget && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSeoTarget(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto -mt-1 sm:hidden" />

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#c5a880]" />
                  <h4 className="text-sm font-bold text-[#003334]">{seoForm.label}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoGenerateSeoForm}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-[#003334] flex items-center gap-1 cursor-pointer"
                  >
                    <Wand2 className="w-3 h-3 text-[#c5a880]" />
                    <span>Auto-Fill SEO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeoTarget(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    SEO Title / Hover Title
                  </label>
                  <input
                    type="text"
                    value={seoForm.seoTitle}
                    onChange={(e) => setSeoForm({ ...seoForm, seoTitle: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Image Alt Text (Accessibility &amp; Google Images)
                  </label>
                  <input
                    type="text"
                    value={seoForm.altText}
                    onChange={(e) => setSeoForm({ ...seoForm, altText: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Display Caption / Badge Label
                  </label>
                  <input
                    type="text"
                    value={seoForm.caption}
                    onChange={(e) => setSeoForm({ ...seoForm, caption: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    SEO Keywords
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={seoForm.keywordInput}
                      onChange={(e) => setSeoForm({ ...seoForm, keywordInput: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && seoForm.keywordInput.trim()) {
                          e.preventDefault();
                          setSeoForm((prev) => ({
                            ...prev,
                            keywords: Array.from(
                              new Set([...prev.keywords, prev.keywordInput.trim()])
                            ),
                            keywordInput: '',
                          }));
                        }
                      }}
                      placeholder="Add keyword and press Enter..."
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!seoForm.keywordInput.trim()) return;
                        setSeoForm((prev) => ({
                          ...prev,
                          keywords: Array.from(
                            new Set([...prev.keywords, prev.keywordInput.trim()])
                          ),
                          keywordInput: '',
                        }));
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 shrink-0"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {seoForm.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px]"
                      >
                        <Tag className="w-2.5 h-2.5 text-[#c5a880]" />
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setSeoForm((prev) => ({
                              ...prev,
                              keywords: prev.keywords.filter((k) => k !== kw),
                            }))
                          }
                          className="text-slate-400 hover:text-rose-600 ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSeoTarget(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSeoModal}
                  className="px-5 py-2 rounded-xl bg-[#003334] text-white text-xs font-semibold cursor-pointer"
                >
                  Apply SEO
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. HERO HEADLINE & PRICE EDIT MODAL / BOTTOM SHEET */}
      <AnimatePresence>
        {isHeroEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                commitAndPersistFormData(formData, 'Saved Hero details');
                setIsHeroEditModalOpen(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-[#003334]">Edit Hero Banner Details</h4>
                <button
                  type="button"
                  onClick={() => {
                    commitAndPersistFormData(formData, 'Saved Hero details');
                    setIsHeroEditModalOpen(false);
                  }}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Service Headline Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Intro Badge / Topline
                  </label>
                  <input
                    type="text"
                    value={formData.badgeText || ''}
                    onChange={(e) => handleFieldChange('badgeText', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Starting Price
                    </label>
                    <input
                      type="text"
                      value={formData.price || ''}
                      onChange={(e) => handleFieldChange('price', e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    commitAndPersistFormData(formData, 'Saved Hero details');
                    setIsHeroEditModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#003334] text-white text-xs font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. OVERVIEW NARRATIVE & QUOTE MODAL / BOTTOM SHEET */}
      <AnimatePresence>
        {isOverviewTextModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                commitAndPersistFormData(formData, 'Saved Overview text');
                setIsOverviewTextModalOpen(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-[#003334]">
                  Edit Overview Narrative &amp; Protocol Quote
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    commitAndPersistFormData(formData, 'Saved Overview text');
                    setIsOverviewTextModalOpen(false);
                  }}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Scientific Overview Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334] leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Philosophy &amp; Protocol Callout Quote
                  </label>
                  <textarea
                    rows={3}
                    value={formData.protocolQuote || ''}
                    onChange={(e) => handleFieldChange('protocolQuote', e.target.value)}
                    placeholder="Every protocol is strictly diagnostic-first..."
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334] leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    commitAndPersistFormData(formData, 'Saved Overview text');
                    setIsOverviewTextModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#003334] text-white text-xs font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. CLINICAL EXPECTATIONS MODAL / BOTTOM SHEET */}
      <AnimatePresence>
        {isExpectationsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                commitAndPersistFormData(formData, 'Saved Clinical Expectations');
                setIsExpectationsModalOpen(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-[#003334]">Edit Clinical Expectations</h4>
                <button
                  type="button"
                  onClick={() => {
                    commitAndPersistFormData(formData, 'Saved Clinical Expectations');
                    setIsExpectationsModalOpen(false);
                  }}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Procedure Time
                  </label>
                  <input
                    type="text"
                    value={formData.procedureTime}
                    onChange={(e) => handleFieldChange('procedureTime', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Comfort Rating
                  </label>
                  <input
                    type="text"
                    value={formData.comfortLevel}
                    onChange={(e) => handleFieldChange('comfortLevel', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Recovery / Downtime
                  </label>
                  <input
                    type="text"
                    value={formData.downtime}
                    onChange={(e) => handleFieldChange('downtime', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Recommended Sessions
                  </label>
                  <input
                    type="text"
                    value={formData.recommendedSessions}
                    onChange={(e) => handleFieldChange('recommendedSessions', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Anesthesia / Numbing
                  </label>
                  <input
                    type="text"
                    value={formData.anesthesia || ''}
                    onChange={(e) => handleFieldChange('anesthesia', e.target.value)}
                    placeholder="Topical lidocaine 30 mins prior"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Expected Longevity
                  </label>
                  <input
                    type="text"
                    value={formData.longevity || ''}
                    onChange={(e) => handleFieldChange('longevity', e.target.value)}
                    placeholder="6 - 12 Months"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    commitAndPersistFormData(formData, 'Saved Clinical Expectations');
                    setIsExpectationsModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#003334] text-white text-xs font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. DERMAL PROFILER CALIBRATION MODAL / BOTTOM SHEET */}
      <AnimatePresence>
        {isProfilerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                commitAndPersistFormData(formData, 'Saved Dermal Profiler specs');
                setIsProfilerModalOpen(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#c5a880]" />
                  <h4 className="text-sm font-bold text-[#003334]">
                    Calibrate Dermal Profiler Specs
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    commitAndPersistFormData(formData, 'Saved Dermal Profiler specs');
                    setIsProfilerModalOpen(false);
                  }}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-1.5">
                {CLINICAL_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      handleFieldChange('targetLayer', preset.targetLayer);
                      handleFieldChange('targetLayerDepth', preset.depth);
                      handleFieldChange('dermalSpecs', {
                        frequency: preset.frequency,
                        energy: preset.energy,
                        temperature: preset.temperature,
                        mechanism: preset.mechanism,
                      });
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-[#003334] hover:text-white text-slate-700 transition-colors cursor-pointer"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Target Delivery Depth
                  </label>
                  <input
                    type="text"
                    value={formData.targetLayerDepth}
                    onChange={(e) => handleFieldChange('targetLayerDepth', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>Frequency / Wavelength</span>
                  </label>
                  <input
                    type="text"
                    value={formData.dermalSpecs?.frequency || ''}
                    onChange={(e) =>
                      handleFieldChange('dermalSpecs', {
                        ...formData.dermalSpecs,
                        frequency: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>Energy Output</span>
                  </label>
                  <input
                    type="text"
                    value={formData.dermalSpecs?.energy || ''}
                    onChange={(e) =>
                      handleFieldChange('dermalSpecs', {
                        ...formData.dermalSpecs,
                        energy: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>Thermal Profile</span>
                  </label>
                  <input
                    type="text"
                    value={formData.dermalSpecs?.temperature || ''}
                    onChange={(e) =>
                      handleFieldChange('dermalSpecs', {
                        ...formData.dermalSpecs,
                        temperature: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#003334]" />
                    <span>Mechanism</span>
                  </label>
                  <input
                    type="text"
                    value={formData.dermalSpecs?.mechanism || ''}
                    onChange={(e) =>
                      handleFieldChange('dermalSpecs', {
                        ...formData.dermalSpecs,
                        mechanism: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    commitAndPersistFormData(
                      { ...formData, dermalSpecs: undefined },
                      'Reset Dermal Profiler specs'
                    );
                    setIsProfilerModalOpen(false);
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={() => {
                    commitAndPersistFormData(formData, 'Saved Dermal Profiler specs');
                    setIsProfilerModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#003334] text-white text-xs font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. BEFORE & AFTER CASE MODAL / BOTTOM SHEET (Zero URL Inputs + Collapsible SEO) */}
      <AnimatePresence>
        {isCaseModalOpen && editingCase && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCaseModalOpen(false);
                setEditingCase(null);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-[#003334]">
                  {formData.customBeforeAfterPairs?.some((p) => p.id === editingCase.id)
                    ? 'Edit Before & After Case'
                    : 'Add Before & After Case'}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setIsCaseModalOpen(false);
                    setEditingCase(null);
                  }}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Prominent Side-by-Side Visual Image Upload Cards (No URL Input) */}
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    {
                      slot: 'before' as const,
                      label: 'Before Image',
                      imgUrl: editingCase.beforeImage,
                      pickerSlot: 'case-before' as const,
                    },
                    {
                      slot: 'after' as const,
                      label: 'After Image',
                      imgUrl: editingCase.afterImage,
                      pickerSlot: 'case-after' as const,
                    },
                  ] as const
                ).map((side) => (
                  <div
                    key={side.slot}
                    className="relative aspect-[4/5] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col justify-between p-2.5"
                  >
                    {side.imgUrl ? (
                      <img
                        src={side.imgUrl}
                        alt={side.label}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    <span className="relative z-10 text-[10px] font-bold uppercase tracking-wider text-white bg-black/50 px-2 py-0.5 rounded w-fit">
                      {side.label}
                    </span>

                    <div className="relative z-10 flex flex-col gap-1.5">
                      <label className="w-full py-2 px-2.5 rounded-lg bg-white text-[#003334] hover:bg-[#c5a880] text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{side.imgUrl ? 'Change Image' : 'Add Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleBeforeAfterPhotoUpload(
                                file,
                                side.slot,
                                editingCase.title || formData.title,
                                (url) => {
                                  setEditingCase((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          [side.slot === 'before'
                                            ? 'beforeImage'
                                            : 'afterImage']: url,
                                        }
                                      : null
                                  );
                                }
                              );
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setAssetPickerTarget({ slot: side.pickerSlot })}
                        className="w-full py-1.5 px-2 rounded-lg bg-black/55 hover:bg-black/80 text-white text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <FolderOpen className="w-3 h-3 text-[#c5a880]" />
                        <span>From Library</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Case Title</label>
                  <input
                    type="text"
                    value={editingCase.title}
                    onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Duration Badge
                  </label>
                  <input
                    type="text"
                    value={editingCase.duration || ''}
                    onChange={(e) => setEditingCase({ ...editingCase, duration: e.target.value })}
                    placeholder="e.g. 8 Weeks • 2 Sessions"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Compact Collapsible SEO Drawer inside Case Modal */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsCaseSeoOpen(!isCaseSeoOpen)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>SEO &amp; Alt Text</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isCaseSeoOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isCaseSeoOpen && (
                  <div className="p-3.5 space-y-2.5 bg-white border-t border-slate-100">
                    <input
                      type="text"
                      value={editingCase.seoTitle || ''}
                      onChange={(e) =>
                        setEditingCase({ ...editingCase, seoTitle: e.target.value })
                      }
                      placeholder="SEO Title"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none"
                    />
                    <input
                      type="text"
                      value={editingCase.beforeAltText || ''}
                      onChange={(e) =>
                        setEditingCase({ ...editingCase, beforeAltText: e.target.value })
                      }
                      placeholder="Before Image Alt Text"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none"
                    />
                    <input
                      type="text"
                      value={editingCase.afterAltText || ''}
                      onChange={(e) =>
                        setEditingCase({ ...editingCase, afterAltText: e.target.value })
                      }
                      placeholder="After Image Alt Text"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none"
                    />
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={caseKeywordInput}
                        onChange={(e) => setCaseKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && caseKeywordInput.trim()) {
                            e.preventDefault();
                            setEditingCase((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    seoKeywords: Array.from(
                                      new Set([
                                        ...(prev.seoKeywords || []),
                                        caseKeywordInput.trim(),
                                      ])
                                    ),
                                  }
                                : null
                            );
                            setCaseKeywordInput('');
                          }
                        }}
                        placeholder="Add SEO keyword..."
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCaseModalOpen(false);
                    setEditingCase(null);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCase}
                  className="px-5 py-2 bg-[#003334] text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Save Case
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. LIST ITEM ADD / EDIT MODAL (Concerns, Pre-Care, Post-Care) */}
      <AnimatePresence>
        {listEditModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setListEditModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-[#003334]">{listEditModal.title}</h4>
                <button
                  type="button"
                  onClick={() => setListEditModal(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                autoFocus
                value={listEditModal.value}
                onChange={(e) => setListEditModal({ ...listEditModal, value: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSaveListModal();
                  }
                }}
                placeholder="Enter clinical guideline or indication..."
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setListEditModal(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveListModal}
                  className="px-5 py-2 rounded-xl bg-[#003334] text-white text-xs font-semibold cursor-pointer"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. CREATE CUSTOM SERVICE PAGE MODAL */}
      <AnimatePresence>
        {isCreatingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreatingModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.form
              onSubmit={handleCreateService}
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-[#003334]">New Custom Service Page</h4>
                <button
                  type="button"
                  onClick={() => setIsCreatingModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Service Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => {
                      setNewTitle(e.target.value);
                      if (!newKey) {
                        setNewKey(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-|-$/g, '')
                        );
                      }
                    }}
                    placeholder="e.g. Exosome Facial Protocol"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">ID Key</label>
                    <input
                      type="text"
                      required
                      value={newKey}
                      onChange={(e) =>
                        setNewKey(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                      }
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">Category</label>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Face & Injectables"
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#003334] text-white text-xs font-semibold cursor-pointer"
                >
                  Create Page
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* 10. ASSET LIBRARY PICKER SUB-MODAL */}
      <AnimatePresence>
        {assetPickerTarget && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAssetPickerTarget(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="relative z-10 w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl p-5 max-h-[85vh] flex flex-col space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-[#c5a880]" />
                  <h4 className="text-sm font-bold text-[#003334]">Select from Asset Library</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setAssetPickerTarget(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                  placeholder="Search uploaded clinic images..."
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-y-auto pr-1 max-h-[55vh]">
                {libraryAssets
                  .filter(
                    (a) =>
                      !assetSearch ||
                      a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
                      a.url.toLowerCase().includes(assetSearch.toLowerCase())
                  )
                  .map((asset, i) => (
                    <button
                      key={`${asset.url}-${i}`}
                      type="button"
                      onClick={() => handlePickLibraryAsset(asset.url)}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 hover:border-[#003334] bg-slate-50 text-left cursor-pointer"
                    >
                      <ClinicImageWithPlaceholder
                        src={asset.url}
                        alt={asset.name}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/65 p-1.5">
                        <span className="text-[10px] text-white block truncate">
                          {asset.name}
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 11. CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDialog(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 space-y-4"
            >
              <h4 className="text-sm font-bold text-slate-900">{confirmDialog.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{confirmDialog.message}</p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDialog.onConfirm}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer ${
                    confirmDialog.danger
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-[#003334] hover:bg-[#002526]'
                  }`}
                >
                  {confirmDialog.confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
