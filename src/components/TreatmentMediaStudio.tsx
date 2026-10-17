import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Camera, 
  Video, 
  Image as ImageIcon, 
  Search, 
  Filter, 
  Check, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  Edit3, 
  RefreshCw, 
  Upload, 
  MoreVertical, 
  Layers, 
  Globe, 
  Sliders, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown, 
  Play, 
  FileText, 
  Tag, 
  Plus, 
  Trash2,
  Sparkles,
  AlertCircle,
  Eye,
  CheckCircle,
  Info,
  Maximize2,
  Copy,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TreatmentMediaItem, 
  OverviewMediaConfig, 
  ClinicalComparisonMediaConfig, 
  ClinicalGuidanceMediaConfig 
} from '../types';
import { 
  TREATMENT_DETAILS_DB, 
  TreatmentDetail, 
  populateTreatmentMediaDefaults 
} from './treatments/treatmentData';
import { 
  getTreatmentDetailsConfig, 
  saveTreatmentDetailsConfig, 
  registerMediaAsset, 
  uploadAssetFile,
  syncConfigToFile,
  getSpecialistAreasConfig,
  saveSpecialistAreasConfig,
  getTreatmentPricingData,
  saveTreatmentPricingData
} from '../lib/adminStore';
import AssetLibraryPicker from './AssetLibraryPicker';
import MediaEditModal from './MediaEditModal';
import MobileMediaSheet from './MobileMediaSheet';
import LiveComponentPreviewModal from './LiveComponentPreviewModal';

// Suggested high-impact clinical SEO keywords for 1-click tagging
const SUGGESTED_CLINICAL_KEYWORDS = [
  'cellular skin regeneration',
  'anti-wrinkle clinic london',
  'collagen bio-remodeling',
  'non-surgical dermal lift',
  'medical grade pre-care protocol',
  'subdermal adipose remodeling',
  'targeted bio-calibration',
  'exosome therapy london',
  'harley street clinic',
  'smas muscle lifting',
  'hyaluronic acid bio-stimulator',
  'clinical skin prep serum',
  'dermal matrix repair',
  'non-surgical blepharoplasty',
  'polynucleotide rejuvenation'
];

export type SlotKey = 
  | 'coverMedia' 
  | 'heroMedia' 
  | 'overviewMedia_back' 
  | 'overviewMedia_front' 
  | 'targetConcernsMedia' 
  | 'clinicalComparison_before' 
  | 'clinicalComparison_after' 
  | 'clinicalGuidance_pre' 
  | 'clinicalGuidance_post';

export interface SlotMetaInfo {
  key: SlotKey;
  slotNumber: number;
  label: string;
  categoryTag: string;
  componentLocation: string;
  description: string;
  supportedTypes: 'image-only' | 'video-or-image';
  recommendedDimension: string;
}

export const SLOT_DEFINITIONS: SlotMetaInfo[] = [
  {
    key: 'coverMedia',
    slotNumber: 1,
    label: 'Homepage Cover Photo',
    categoryTag: 'SpecialistAreas Card',
    componentLocation: 'Homepage: SpecialistAreas Grid',
    description: 'Primary visual card shown on the homepage specialist care grid and directory.',
    supportedTypes: 'image-only',
    recommendedDimension: '4:3 (800x600px)'
  },
  {
    key: 'heroMedia',
    slotNumber: 2,
    label: 'Hero Presentation Banner',
    categoryTag: 'Top Banner Visual',
    componentLocation: 'Service Page: ServiceHero',
    description: 'Full-bleed welcome header. Can be an ultra high-res clinical photo or streaming cinematic MP4/WebM video.',
    supportedTypes: 'video-or-image',
    recommendedDimension: '16:9 (1920x1080px)'
  },
  {
    key: 'overviewMedia_back',
    slotNumber: 3,
    label: 'Overview Visual (Back Card)',
    categoryTag: 'Treatment Overview Framing',
    componentLocation: 'Service Page: ServiceOverview',
    description: 'Ambient framing backdrop card showing procedural context and clinic ambiance.',
    supportedTypes: 'image-only',
    recommendedDimension: '4:3 (900x675px)'
  },
  {
    key: 'overviewMedia_front',
    slotNumber: 3,
    label: 'Overview Visual (Front Focal)',
    categoryTag: 'Treatment Overview Focal',
    componentLocation: 'Service Page: ServiceOverview',
    description: 'Front elevated focal card highlighting close-up procedural precision.',
    supportedTypes: 'image-only',
    recommendedDimension: '4:3 (900x675px)'
  },
  {
    key: 'targetConcernsMedia',
    slotNumber: 4,
    label: 'Target Concerns Diagnostic Visual',
    categoryTag: 'Diagnostic Technology',
    componentLocation: 'Service Page: TargetConcerns',
    description: 'Close-up visual card paired with the clinical indications checklist and targeted bio-calibration.',
    supportedTypes: 'image-only',
    recommendedDimension: 'Square / 4:3 (600x600px)'
  },
  {
    key: 'clinicalComparison_before',
    slotNumber: 5,
    label: 'Clinical Comparison (Before)',
    categoryTag: 'Before & After Pair',
    componentLocation: 'Service Page: BeforeAfterComparisonSlider',
    description: 'Pre-treatment clinical baseline photo showing initial concerns before procedure.',
    supportedTypes: 'image-only',
    recommendedDimension: '4:3 (800x600px)'
  },
  {
    key: 'clinicalComparison_after',
    slotNumber: 5,
    label: 'Clinical Comparison (After)',
    categoryTag: 'Before & After Pair',
    componentLocation: 'Service Page: BeforeAfterComparisonSlider',
    description: 'Post-treatment clinical result photo showing restorative collagen and dermal renewal.',
    supportedTypes: 'image-only',
    recommendedDimension: '4:3 (800x600px)'
  },
  {
    key: 'clinicalGuidance_pre',
    slotNumber: 6,
    label: 'Clinical Skin Prep (Pre-Care)',
    categoryTag: 'Clinical Care Protocol',
    componentLocation: 'Service Page: PrePostCareGuidelines',
    description: 'Visual banner showcasing "Clinical Skin Prep Serum Application - Epidermal Prime & Hydration".',
    supportedTypes: 'image-only',
    recommendedDimension: '16:9 / 4:3 (800x500px)'
  },
  {
    key: 'clinicalGuidance_post',
    slotNumber: 6,
    label: 'Clinical Recovery Sanctuary (Post-Care)',
    categoryTag: 'Clinical Care Protocol',
    componentLocation: 'Service Page: PrePostCareGuidelines',
    description: 'Visual banner showcasing "Clinical Recovery Spa Sanctuary - Cellular Healing & Protection".',
    supportedTypes: 'image-only',
    recommendedDimension: '16:9 / 4:3 (800x500px)'
  }
];

export interface TreatmentMediaStudioProps {
  onBackToClinic?: () => void;
}

export default function TreatmentMediaStudio({ onBackToClinic }: TreatmentMediaStudioProps) {
  // Database state
  const [treatmentDb, setTreatmentDb] = useState<Record<string, TreatmentDetail>>(() => {
    const custom = getTreatmentDetailsConfig();
    const source = custom || TREATMENT_DETAILS_DB;
    const populated: Record<string, TreatmentDetail> = {};
    for (const key of Object.keys(source)) {
      populated[key] = populateTreatmentMediaDefaults(source[key]);
    }
    return populated;
  });

  const treatmentKeys = useMemo(() => Object.keys(treatmentDb), [treatmentDb]);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>(treatmentKeys[0] || 'exosome');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Active Contextual Menu state
  const [openContextDropdownId, setOpenContextDropdownId] = useState<string | null>(null);

  // Active Slot Editor Modal / Bottom-Sheet state
  const [editingSlot, setEditingSlot] = useState<{
    treatmentId: string;
    slotKey: SlotKey;
    mediaItem: TreatmentMediaItem;
  } | null>(null);

  // Live Component Preview Modal state (Task 4.1 "Preview in Live Component")
  const [previewSlot, setPreviewSlot] = useState<{
    treatmentId: string;
    slotKey: SlotKey;
  } | null>(null);

  // Asset Picker modal state
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  // Close context dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.treatment-context-menu-container')) {
        setOpenContextDropdownId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Listen for storage updates
  useEffect(() => {
    const handleStorageUpdate = (e: any) => {
      if (e.detail) {
        setTreatmentDb((prev) => ({ ...prev, ...e.detail }));
      }
    };
    window.addEventListener('treatment_details_updated', handleStorageUpdate);
    return () => window.removeEventListener('treatment_details_updated', handleStorageUpdate);
  }, []);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    Object.values(treatmentDb).forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return ['All', ...Array.from(set)];
  }, [treatmentDb]);

  // Filtered treatment records
  const filteredTreatments = useMemo(() => {
    return Object.values(treatmentDb).filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q || 
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.seoKeywords || []).some(k => k.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [treatmentDb, searchQuery, selectedCategory]);

  const currentTreatment = treatmentDb[selectedTreatmentId] || Object.values(treatmentDb)[0];

  // Helper to resolve slot media item
  const getSlotMedia = (treatment: TreatmentDetail, key: SlotKey): TreatmentMediaItem => {
    const t = populateTreatmentMediaDefaults(treatment);
    switch (key) {
      case 'coverMedia':
        return t.coverMedia || { url: t.imageUrl, altText: t.title, seoKeywords: t.seoKeywords || [] };
      case 'heroMedia':
        return t.heroMedia || { url: t.imageUrl, mediaType: 'image', altText: t.title, seoKeywords: t.seoKeywords || [] };
      case 'overviewMedia_back':
        return t.overviewMedia?.backImage || t.overviewMedia?.backCard || { url: t.imageUrl, altText: `${t.title} back overview`, seoKeywords: [] };
      case 'overviewMedia_front':
        return t.overviewMedia?.frontImage || t.overviewMedia?.frontCard || { url: t.imageUrl, altText: `${t.title} front overview`, seoKeywords: [] };
      case 'targetConcernsMedia':
        return t.targetConcernsMedia || { url: t.imageUrl, altText: `${t.title} target diagnostics`, seoKeywords: [] };
      case 'clinicalComparison_before':
        return t.clinicalComparisonMedia?.beforeImage || t.clinicalComparisonMedia?.before || { url: t.beforeImage || t.imageUrl, altText: `${t.title} before treatment`, seoKeywords: [] };
      case 'clinicalComparison_after':
        return t.clinicalComparisonMedia?.afterImage || t.clinicalComparisonMedia?.after || { url: t.afterImage || t.imageUrl, altText: `${t.title} after treatment`, seoKeywords: [] };
      case 'clinicalGuidance_pre':
        return t.clinicalGuidanceMedia?.preCareVisual || t.clinicalGuidanceMedia?.preCare || { url: t.imageUrl, altText: 'Clinical Skin Prep Serum Application', seoKeywords: [] };
      case 'clinicalGuidance_post':
        return t.clinicalGuidanceMedia?.postCareVisual || t.clinicalGuidanceMedia?.postCare || { url: t.imageUrl, altText: 'Clinical Recovery Spa Sanctuary', seoKeywords: [] };
    }
  };

  // Open the Slot Editor
  const handleOpenSlotEditor = (treatmentId: string, slotKey: SlotKey) => {
    const tr = treatmentDb[treatmentId];
    if (!tr) return;
    const item = getSlotMedia(tr, slotKey);

    setEditingSlot({
      treatmentId,
      slotKey,
      mediaItem: item
    });
    setOpenContextDropdownId(null);
  };

  // Save Slot from Modal or Sheet
  const handleSaveSlot = async (updatedMediaItem: TreatmentMediaItem) => {
    if (!editingSlot) return;
    const { treatmentId, slotKey } = editingSlot;
    const targetTreatment = treatmentDb[treatmentId];
    if (!targetTreatment) return;

    // 1. Auto Register to Central Asset Library (Task 2.1)
    try {
      registerMediaAsset({
        name: `${targetTreatment.title} (${SLOT_DEFINITIONS.find(s => s.key === slotKey)?.label || 'Media Slot'})`,
        url: updatedMediaItem.url,
        mediaType: updatedMediaItem.mediaType || 'image',
        category: updatedMediaItem.mediaType === 'video' ? 'Videos' : 'Treatments',
        altText: updatedMediaItem.altText,
        seoKeywords: updatedMediaItem.seoKeywords
      });
    } catch (e) {
      console.warn('Could not auto-register asset:', e);
    }

    // 2. Update specific slot inside treatment object
    const updatedTreatment: TreatmentDetail = { ...targetTreatment };

    switch (slotKey) {
      case 'coverMedia':
        updatedTreatment.coverMedia = updatedMediaItem;
        updatedTreatment.imageUrl = updatedMediaItem.url;
        break;
      case 'heroMedia':
        updatedTreatment.heroMedia = updatedMediaItem;
        break;
      case 'overviewMedia_back':
        updatedTreatment.overviewMedia = {
          backCard: updatedMediaItem,
          frontCard: updatedTreatment.overviewMedia?.frontCard || updatedTreatment.overviewMedia?.frontImage || updatedMediaItem,
          backImage: updatedMediaItem,
          frontImage: updatedTreatment.overviewMedia?.frontImage || updatedTreatment.overviewMedia?.frontCard || updatedMediaItem
        };
        break;
      case 'overviewMedia_front':
        updatedTreatment.overviewMedia = {
          backCard: updatedTreatment.overviewMedia?.backCard || updatedTreatment.overviewMedia?.backImage || updatedMediaItem,
          frontCard: updatedMediaItem,
          backImage: updatedTreatment.overviewMedia?.backImage || updatedTreatment.overviewMedia?.backCard || updatedMediaItem,
          frontImage: updatedMediaItem
        };
        break;
      case 'targetConcernsMedia':
        updatedTreatment.targetConcernsMedia = updatedMediaItem;
        break;
      case 'clinicalComparison_before':
        updatedTreatment.clinicalComparisonMedia = {
          before: updatedMediaItem,
          after: updatedTreatment.clinicalComparisonMedia?.after || updatedTreatment.clinicalComparisonMedia?.afterImage || updatedMediaItem,
          beforeImage: updatedMediaItem,
          afterImage: updatedTreatment.clinicalComparisonMedia?.afterImage || updatedTreatment.clinicalComparisonMedia?.after || updatedMediaItem
        };
        updatedTreatment.beforeImage = updatedMediaItem.url;
        break;
      case 'clinicalComparison_after':
        updatedTreatment.clinicalComparisonMedia = {
          before: updatedTreatment.clinicalComparisonMedia?.before || updatedTreatment.clinicalComparisonMedia?.beforeImage || updatedMediaItem,
          after: updatedMediaItem,
          beforeImage: updatedTreatment.clinicalComparisonMedia?.beforeImage || updatedTreatment.clinicalComparisonMedia?.before || updatedMediaItem,
          afterImage: updatedMediaItem
        };
        updatedTreatment.afterImage = updatedMediaItem.url;
        break;
      case 'clinicalGuidance_pre':
        updatedTreatment.clinicalGuidanceMedia = {
          preCare: updatedMediaItem,
          postCare: updatedTreatment.clinicalGuidanceMedia?.postCare || updatedTreatment.clinicalGuidanceMedia?.postCareVisual || updatedMediaItem,
          preCareVisual: updatedMediaItem,
          postCareVisual: updatedTreatment.clinicalGuidanceMedia?.postCareVisual || updatedTreatment.clinicalGuidanceMedia?.postCare || updatedMediaItem
        };
        break;
      case 'clinicalGuidance_post':
        updatedTreatment.clinicalGuidanceMedia = {
          preCare: updatedTreatment.clinicalGuidanceMedia?.preCare || updatedTreatment.clinicalGuidanceMedia?.preCareVisual || updatedMediaItem,
          postCare: updatedMediaItem,
          preCareVisual: updatedTreatment.clinicalGuidanceMedia?.preCareVisual || updatedTreatment.clinicalGuidanceMedia?.preCare || updatedMediaItem,
          postCareVisual: updatedMediaItem
        };
        break;
    }

    // Merge SEO keywords to treatment
    if (updatedMediaItem.seoKeywords && updatedMediaItem.seoKeywords.length > 0) {
      const merged = Array.from(new Set([...(updatedTreatment.seoKeywords || []), ...updatedMediaItem.seoKeywords]));
      updatedTreatment.seoKeywords = merged;
    }

    // 3. Save to admin store & dispatch live sync
    const newDb = { ...treatmentDb, [treatmentId]: updatedTreatment };
    setTreatmentDb(newDb);
    saveTreatmentDetailsConfig(newDb);
    syncConfigToFile('clinical_treatment_details', newDb);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('treatment_details_updated', { detail: newDb }));
    }

    // 4. Cross-component sync to homepage SpecialistAreas & Pricing if cover photo changed
    if (slotKey === 'coverMedia') {
      try {
        const specConfig = getSpecialistAreasConfig();
        if (specConfig.areas) {
          const areaIndex = specConfig.areas.findIndex(
            a => a.id.toLowerCase() === treatmentId.toLowerCase() || a.title.toLowerCase() === targetTreatment.title.toLowerCase()
          );
          if (areaIndex >= 0) {
            const newAreas = [...specConfig.areas];
            newAreas[areaIndex] = {
              ...newAreas[areaIndex],
              image: updatedMediaItem.url,
              coverMedia: updatedMediaItem
            };
            saveSpecialistAreasConfig({ ...specConfig, areas: newAreas });
          }
        }

        const pricing = getTreatmentPricingData();
        const pIndex = pricing.findIndex(
          p => p.id.toLowerCase() === treatmentId.toLowerCase() || p.title.toLowerCase() === targetTreatment.title.toLowerCase()
        );
        if (pIndex >= 0) {
          const newPricing = [...pricing];
          newPricing[pIndex] = {
            ...newPricing[pIndex],
            image: updatedMediaItem.url,
            coverMedia: updatedMediaItem
          };
          saveTreatmentPricingData(newPricing);
        }
      } catch (err) {
        console.warn('Cross sync error:', err);
      }
    }

    showToast(`Saved and synced "${SLOT_DEFINITIONS.find(s => s.key === slotKey)?.label}" for ${targetTreatment.title}!`);
    setEditingSlot(null);
  };

  // Reset entire treatment slots to defaults
  const handleResetTreatmentMedia = (treatmentId: string) => {
    const original = TREATMENT_DETAILS_DB[treatmentId];
    if (!original) {
      showToast('No factory default record found for this treatment', 'info');
      return;
    }
    const restored = populateTreatmentMediaDefaults(original);
    const newDb = { ...treatmentDb, [treatmentId]: restored };
    setTreatmentDb(newDb);
    saveTreatmentDetailsConfig(newDb);
    syncConfigToFile('clinical_treatment_details', newDb);
    showToast(`Restored all 6 slots for "${original.title}" to clinical factory defaults`);
    setOpenContextDropdownId(null);
  };

  // Reset a single slot to clinical default
  const handleResetSlotToDefault = (treatmentId: string, slotKey: SlotKey) => {
    const original = TREATMENT_DETAILS_DB[treatmentId];
    if (!original) {
      showToast('No factory default found', 'info');
      return;
    }
    const populated = populateTreatmentMediaDefaults(original);
    const originalSlotItem = getSlotMedia(populated, slotKey);

    const currentT = treatmentDb[treatmentId];
    if (!currentT) return;
    const updated = { ...currentT };

    switch (slotKey) {
      case 'coverMedia':
        updated.coverMedia = originalSlotItem;
        updated.imageUrl = originalSlotItem.url;
        break;
      case 'heroMedia':
        updated.heroMedia = originalSlotItem;
        break;
      case 'overviewMedia_back':
        updated.overviewMedia = {
          backCard: originalSlotItem,
          frontCard: updated.overviewMedia?.frontCard || originalSlotItem,
          backImage: originalSlotItem,
          frontImage: updated.overviewMedia?.frontImage || originalSlotItem
        };
        break;
      case 'overviewMedia_front':
        updated.overviewMedia = {
          backCard: updated.overviewMedia?.backCard || originalSlotItem,
          frontCard: originalSlotItem,
          backImage: updated.overviewMedia?.backImage || originalSlotItem,
          frontImage: originalSlotItem
        };
        break;
      case 'targetConcernsMedia':
        updated.targetConcernsMedia = originalSlotItem;
        break;
      case 'clinicalComparison_before':
        updated.clinicalComparisonMedia = {
          before: originalSlotItem,
          after: updated.clinicalComparisonMedia?.after || originalSlotItem,
          beforeImage: originalSlotItem,
          afterImage: updated.clinicalComparisonMedia?.afterImage || originalSlotItem
        };
        updated.beforeImage = originalSlotItem.url;
        break;
      case 'clinicalComparison_after':
        updated.clinicalComparisonMedia = {
          before: updated.clinicalComparisonMedia?.before || originalSlotItem,
          after: originalSlotItem,
          beforeImage: updated.clinicalComparisonMedia?.beforeImage || originalSlotItem,
          afterImage: originalSlotItem
        };
        updated.afterImage = originalSlotItem.url;
        break;
      case 'clinicalGuidance_pre':
        updated.clinicalGuidanceMedia = {
          preCare: originalSlotItem,
          postCare: updated.clinicalGuidanceMedia?.postCare || originalSlotItem,
          preCareVisual: originalSlotItem,
          postCareVisual: updated.clinicalGuidanceMedia?.postCareVisual || originalSlotItem
        };
        break;
      case 'clinicalGuidance_post':
        updated.clinicalGuidanceMedia = {
          preCare: updated.clinicalGuidanceMedia?.preCare || originalSlotItem,
          postCare: originalSlotItem,
          preCareVisual: updated.clinicalGuidanceMedia?.preCareVisual || originalSlotItem,
          postCareVisual: originalSlotItem
        };
        break;
    }

    const newDb = { ...treatmentDb, [treatmentId]: updated };
    setTreatmentDb(newDb);
    saveTreatmentDetailsConfig(newDb);
    syncConfigToFile('clinical_treatment_details', newDb);
    showToast(`Reset slot to clinical factory default!`);
    setOpenContextDropdownId(null);
  };

  // Copy Direct URL (Task 4.1)
  const handleCopyDirectUrl = (mediaUrl: string) => {
    if (!mediaUrl) {
      showToast('No media URL to copy', 'error');
      return;
    }
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(mediaUrl);
    } else {
      const ta = document.createElement('textarea');
      ta.value = mediaUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    showToast('Copied direct media URL to clipboard!', 'success');
    setOpenContextDropdownId(null);
  };

  // Contextual 5-Action Menu Component (Task 4.1)
  const renderContextDropdownMenu = (
    dropdownId: string,
    treatmentId: string,
    slotKey: SlotKey,
    mediaUrl: string
  ) => {
    const isOpen = openContextDropdownId === dropdownId;
    if (!isOpen) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 4, scale: 0.95 }}
        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-40 text-xs overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
          Slot Context Menu
        </div>
        
        {/* 1. Edit Media & SEO */}
        <button
          onClick={() => handleOpenSlotEditor(treatmentId, slotKey)}
          className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-[#003334] font-medium transition-colors cursor-pointer"
        >
          <Edit3 className="h-4 w-4 text-[#c5a880]" />
          <span>Edit Media &amp; SEO</span>
        </button>

        {/* 2. Replace from Clinic Assets */}
        <button
          onClick={() => {
            handleOpenSlotEditor(treatmentId, slotKey);
            setIsAssetPickerOpen(true);
            setOpenContextDropdownId(null);
          }}
          className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-[#003334] font-medium transition-colors cursor-pointer"
        >
          <Layers className="h-4 w-4 text-purple-600" />
          <span>Replace from Clinic Assets</span>
        </button>

        {/* 3. Preview in Live Component */}
        <button
          onClick={() => {
            setPreviewSlot({ treatmentId, slotKey });
            setOpenContextDropdownId(null);
          }}
          className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-[#003334] font-medium transition-colors cursor-pointer"
        >
          <Eye className="h-4 w-4 text-sky-600" />
          <span>Preview in Live Component</span>
        </button>

        {/* 4. Copy Direct URL */}
        <button
          onClick={() => handleCopyDirectUrl(mediaUrl)}
          className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-[#003334] font-medium transition-colors cursor-pointer"
        >
          <Copy className="h-4 w-4 text-emerald-600" />
          <span>Copy Direct URL</span>
        </button>

        <div className="border-t border-slate-100 my-1" />

        {/* 5. Reset to Clinical Default */}
        <button
          onClick={() => handleResetSlotToDefault(treatmentId, slotKey)}
          className="w-full text-left px-3.5 py-2.5 hover:bg-rose-50 flex items-center gap-2.5 text-rose-600 font-bold transition-colors cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset to Clinical Default</span>
        </button>
      </motion.div>
    );
  };

  // Metrics
  const stats = useMemo(() => {
    const list = Object.values(treatmentDb);
    const totalTreatments = list.length;
    let filledSlots = 0;
    let seoOptimizedCount = 0;
    const allKeywords = new Set<string>();

    list.forEach(t => {
      const d = populateTreatmentMediaDefaults(t);
      if (d.coverMedia?.url) filledSlots++;
      if (d.heroMedia?.url) filledSlots++;
      if (d.overviewMedia?.backImage?.url || d.overviewMedia?.backCard?.url) filledSlots++;
      if (d.targetConcernsMedia?.url) filledSlots++;
      if (d.clinicalComparisonMedia?.beforeImage?.url || d.clinicalComparisonMedia?.before?.url) filledSlots++;
      if (d.clinicalGuidanceMedia?.preCareVisual?.url || d.clinicalGuidanceMedia?.preCare?.url) filledSlots++;

      if (d.coverMedia?.altText && d.coverMedia.altText.length > 5) seoOptimizedCount++;
      (d.seoKeywords || []).forEach(k => allKeywords.add(k));
    });

    const maxSlots = totalTreatments * 6;
    const percentage = Math.round((filledSlots / maxSlots) * 100);

    return {
      totalTreatments,
      filledSlots,
      maxSlots,
      percentage,
      seoOptimizedCount,
      uniqueKeywordsCount: allKeywords.size
    };
  }, [treatmentDb]);

  const activeSlotMeta = editingSlot ? SLOT_DEFINITIONS.find(s => s.key === editingSlot.slotKey) : null;
  const activePreviewMeta = previewSlot ? SLOT_DEFINITIONS.find(s => s.key === previewSlot.slotKey) : null;

  return (
    <div className="space-y-6 animate-fadeIn font-sans pb-16">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-bold ${
              toast.type === 'error'
                ? 'bg-rose-950 text-white border-rose-600'
                : toast.type === 'info'
                ? 'bg-[#003334] text-white border-sky-400'
                : 'bg-[#003334] text-white border-[#c5a880]'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-[#c5a880] shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner: Studio Cockpit */}
      <div className="bg-gradient-to-r from-[#003334] via-[#094042] to-[#002627] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-[#c5a880]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a880]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a880]/20 border border-[#c5a880]/40 text-[#c5a880] text-[10px] font-bold uppercase tracking-wider">
              <Camera className="h-3 w-3" />
              <span>SEO &amp; Media Studio</span>
            </div>
            <h2 className="font-serif font-bold text-xl sm:text-3xl tracking-tight text-white">
              Treatment Media &amp; SEO Studio
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Manage high-res visual slots, 4K videos, and Google clinical SEO across clinic treatments.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Treatments</span>
              <p className="text-xl font-mono font-bold text-white">{stats.totalTreatments}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#c5a880] tracking-wider block">Slots Ready</span>
              <p className="text-xl font-mono font-bold text-[#c5a880]">{stats.percentage}%</p>
            </div>
            <div className="col-span-2 sm:col-span-1 space-y-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">SEO Keywords</span>
              <p className="text-xl font-mono font-bold text-emerald-400">{stats.uniqueKeywordsCount} Tagged</p>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Sparkles className="h-4 w-4 text-[#c5a880]" />
            <span>Automatic Asset Library Registration active on all uploads and URL entries.</span>
          </div>

          <button
            onClick={() => setIsAssetPickerOpen(true)}
            className="inline-flex items-center gap-2 bg-[#c5a880] hover:bg-[#d6b991] text-[#003334] font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Browse Central Asset Library</span>
          </button>
        </div>
      </div>

      {/* Sticky Filter Bar & Treatment Selector (Task 3.3) */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Quick Treatment Selector & Instant Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Dropdown Jump */}
          <div className="relative min-w-[240px]">
            <select
              value={selectedTreatmentId}
              onChange={(e) => setSelectedTreatmentId(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-xs font-bold text-[#003334] focus:outline-none focus:ring-2 focus:ring-[#003334] transition-all cursor-pointer"
            >
              {Object.values(treatmentDb).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.category})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Instant Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search treatments by title, category, or clinical keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003334] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-1 mr-0.5" />
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#003334] text-[#c5a880] shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Focus: Selected Treatment Detail & 6 Slot Matrix */}
      {currentTreatment && (
        <div className="bg-transparent sm:bg-white sm:rounded-3xl sm:border sm:border-slate-200 p-0 sm:p-8 shadow-none sm:shadow-sm space-y-6 sm:space-y-8">
          
          {/* Treatment Header with Contextual Menu Options (Task 4.1) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-150">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#003334]/10 text-[#003334]">
                  {currentTreatment.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">ID: {currentTreatment.id}</span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#003334] flex items-center gap-2">
                <span>{currentTreatment.title}</span>
              </h3>
              <p className="text-xs text-slate-500 max-w-2xl line-clamp-2">
                {currentTreatment.description}
              </p>
            </div>

            {/* Contextual Action Menu Dropdown */}
            <div className="relative treatment-context-menu-container flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenContextDropdownId(
                    openContextDropdownId === `header-${currentTreatment.id}` ? null : `header-${currentTreatment.id}`
                  );
                }}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer shadow-xs"
              >
                <span>Actions &amp; Slots</span>
                <MoreVertical className="h-4 w-4" />
              </button>

              {/* Context Dropdown Popover */}
              <AnimatePresence>
                {openContextDropdownId === `header-${currentTreatment.id}` && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-40 text-xs overflow-hidden"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      Contextual Treatment Actions
                    </div>
                    
                    <button
                      onClick={() => handleOpenSlotEditor(currentTreatment.id, 'coverMedia')}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-[#003334] font-medium"
                    >
                      <Edit3 className="h-4 w-4 text-[#c5a880]" />
                      <span>Edit Media &amp; SEO</span>
                    </button>

                    <button
                      onClick={() => {
                        handleOpenSlotEditor(currentTreatment.id, 'coverMedia');
                        setIsAssetPickerOpen(true);
                        setOpenContextDropdownId(null);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-[#003334] font-medium"
                    >
                      <Layers className="h-4 w-4 text-purple-600" />
                      <span>Replace from Clinic Assets</span>
                    </button>

                    <button
                      onClick={() => {
                        setPreviewSlot({ treatmentId: currentTreatment.id, slotKey: 'heroMedia' });
                        setOpenContextDropdownId(null);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-[#003334] font-medium"
                    >
                      <Eye className="h-4 w-4 text-sky-600" />
                      <span>Preview in Live Component</span>
                    </button>

                    <button
                      onClick={() => handleCopyDirectUrl(currentTreatment.imageUrl)}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-[#003334] font-medium"
                    >
                      <Copy className="h-4 w-4 text-emerald-600" />
                      <span>Copy Direct URL</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => handleResetTreatmentMedia(currentTreatment.id)}
                      className="w-full text-left px-4 py-2.5 hover:bg-rose-50 flex items-center gap-2.5 text-rose-600 font-bold"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Reset to Clinical Default</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Clinical SEO Keywords Section for this Treatment */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-[#c5a880]" />
                <h4 className="text-xs font-bold text-[#003334] uppercase tracking-wider">
                  Target Clinical SEO Keywords (Google Image &amp; Search Indexing)
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {(currentTreatment.seoKeywords || []).length} Keywords Active
              </span>
            </div>

            {/* Current Keywords Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {(currentTreatment.seoKeywords || []).map((keyword, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs"
                >
                  <span>{keyword}</span>
                </span>
              ))}
              <button
                onClick={() => handleOpenSlotEditor(currentTreatment.id, 'coverMedia')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#003334] hover:text-[#236963] px-2.5 py-1 rounded-lg bg-[#c5a880]/15 hover:bg-[#c5a880]/25 transition-colors cursor-pointer"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit SEO Keywords</span>
              </button>
            </div>
          </div>

          {/* 6 Dedicated Slots Interactive Grid (Task 1.2, Task 4.1 3-dot menus) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-lg text-[#003334]">
                The 6 Dedicated Media &amp; Component Slots
              </h4>
              <span className="text-xs text-slate-400">
                Click any slot card or 3-dot menu to edit, replace from assets, or preview in live component
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SLOT_DEFINITIONS.map((def) => {
                const mediaItem = getSlotMedia(currentTreatment, def.key);
                const isVideo = mediaItem.mediaType === 'video';
                const dropdownId = `slot-${def.key}`;

                return (
                  <motion.div
                    key={def.key}
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group relative"
                  >
                    {/* Media Preview Box */}
                    <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                      {isVideo ? (
                        <video
                          src={mediaItem.url}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <img
                          src={mediaItem.url}
                          alt={mediaItem.altText || def.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800';
                          }}
                        />
                      )}

                      {/* Top Badges & 3-Dot Context Menu Button */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#003334]/90 text-[#c5a880] backdrop-blur-md border border-[#c5a880]/30 shadow-xs pointer-events-none">
                          Slot #{def.slotNumber}
                        </span>

                        <div className="flex items-center gap-1.5 treatment-context-menu-container">
                          {isVideo ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-sky-500 text-white flex items-center gap-1 shadow-xs pointer-events-none">
                              <Video className="h-3 w-3" />
                              <span>Video</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs pointer-events-none">
                              <ImageIcon className="h-3 w-3" />
                              <span>Photo</span>
                            </span>
                          )}

                          {/* 3-Dot Menu Button on each slot (Task 4.1) */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenContextDropdownId(
                                  openContextDropdownId === dropdownId ? null : dropdownId
                                );
                              }}
                              className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all shadow-md cursor-pointer"
                              title="Slot Menu Options"
                              aria-label="Slot Options"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>

                            {/* Context Dropdown Popover */}
                            <AnimatePresence>
                              {renderContextDropdownMenu(dropdownId, currentTreatment.id, def.key, mediaItem.url)}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      {/* Hover Action Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 z-10 pointer-events-none">
                        <button
                          onClick={() => handleOpenSlotEditor(currentTreatment.id, def.key)}
                          className="pointer-events-auto bg-white hover:bg-slate-100 text-[#003334] px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-1.5"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-[#c5a880]" />
                          <span>Edit Visual &amp; SEO</span>
                        </button>
                      </div>
                    </div>

                    {/* Card Content & SEO Info */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#c5a880]">
                          {def.categoryTag}
                        </div>
                        <h5 className="font-bold text-sm text-[#003334] leading-snug">
                          {def.label}
                        </h5>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                          {def.description}
                        </p>
                      </div>

                      {/* SEO Alt Text Status */}
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold uppercase tracking-wider">Alt Tag SEO:</span>
                          <span className="font-mono text-emerald-600 font-bold flex items-center gap-0.5">
                            <Check className="h-3 w-3" /> Google Ready
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-1" title={mediaItem.altText}>
                          {mediaItem.altText || 'Not specified yet'}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleOpenSlotEditor(currentTreatment.id, def.key)}
                          className="text-[11px] font-bold text-[#003334] hover:text-[#236963] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Configure Slot</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setPreviewSlot({ treatmentId: currentTreatment.id, slotKey: def.key });
                            }}
                            className="p-1.5 text-slate-400 hover:text-[#003334] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Preview in Live Component"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedTreatmentId(currentTreatment.id);
                              setIsAssetPickerOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-[#003334] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Select from Central Asset Library"
                          >
                            <Layers className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Full Treatments Grid Directory (Search & Browse All) with 3-Dot Menus (Task 4.1) */}
      <div className="bg-transparent sm:bg-white sm:rounded-3xl sm:border sm:border-slate-200 p-0 sm:p-8 shadow-none sm:shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif font-bold text-xl text-[#003334]">
              All Clinic Treatments Directory ({filteredTreatments.length})
            </h4>
            <p className="text-xs text-slate-500">
              Browse any procedure to inspect its 6 media slots, update cover photos, or seed medical SEO keywords.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTreatments.map((treatment) => {
            const isSelected = treatment.id === selectedTreatmentId;
            const cover = getSlotMedia(treatment, 'coverMedia');
            const dropdownId = `treatment-card-${treatment.id}`;

            return (
              <div
                key={treatment.id}
                onClick={() => setSelectedTreatmentId(treatment.id)}
                className={`bg-white rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-md relative ${
                  isSelected ? 'border-[#003334] ring-2 ring-[#003334]/20 shadow-sm' : 'border-slate-200'
                }`}
              >
                <div className="flex gap-3.5 items-start">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative">
                    <img
                      src={cover.url}
                      alt={cover.altText || treatment.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#c5a880] uppercase tracking-wider block truncate">
                      {treatment.category}
                    </span>
                    <h5 className="font-bold text-sm text-[#003334] leading-tight truncate">
                      {treatment.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {treatment.description}
                    </p>
                  </div>

                  {/* 3-Dot Menu on each treatment card (Task 4.1) */}
                  <div className="relative treatment-context-menu-container">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenContextDropdownId(
                          openContextDropdownId === dropdownId ? null : dropdownId
                        );
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Treatment Actions"
                      aria-label="Treatment Menu"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    <AnimatePresence>
                      {renderContextDropdownMenu(dropdownId, treatment.id, 'coverMedia', cover.url)}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {(treatment.seoKeywords || []).length} SEO Keywords
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTreatmentId(treatment.id);
                      handleOpenSlotEditor(treatment.id, 'coverMedia');
                    }}
                    className="text-[11px] font-bold text-[#003334] hover:text-[#236963] inline-flex items-center gap-1"
                  >
                    <span>Manage Slots</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task 4.2: Desktop Modal (MediaEditModal.tsx) */}
      {editingSlot && activeSlotMeta && (
        <MediaEditModal
          isOpen={true}
          onClose={() => setEditingSlot(null)}
          onSave={handleSaveSlot}
          slotKey={editingSlot.slotKey}
          slotNumber={activeSlotMeta.slotNumber}
          slotLabel={activeSlotMeta.label}
          slotCategory={activeSlotMeta.categoryTag}
          componentLocation={activeSlotMeta.componentLocation}
          treatmentTitle={treatmentDb[editingSlot.treatmentId]?.title || ''}
          treatmentCategory={treatmentDb[editingSlot.treatmentId]?.category || ''}
          initialMedia={editingSlot.mediaItem}
          onOpenAssetPicker={() => setIsAssetPickerOpen(true)}
          onUploadFile={async (file: File) => {
            return await uploadAssetFile(file);
          }}
        />
      )}

      {/* Task 4.3: Mobile Floating Bottom Sheet (MobileMediaSheet.tsx) */}
      {editingSlot && activeSlotMeta && (
        <MobileMediaSheet
          isOpen={true}
          onClose={() => setEditingSlot(null)}
          onSave={handleSaveSlot}
          slotKey={editingSlot.slotKey}
          slotNumber={activeSlotMeta.slotNumber}
          slotLabel={activeSlotMeta.label}
          slotCategory={activeSlotMeta.categoryTag}
          treatmentTitle={treatmentDb[editingSlot.treatmentId]?.title || ''}
          treatmentCategory={treatmentDb[editingSlot.treatmentId]?.category || ''}
          initialMedia={editingSlot.mediaItem}
          onOpenAssetPicker={() => setIsAssetPickerOpen(true)}
          onUploadFile={async (file: File) => {
            return await uploadAssetFile(file);
          }}
        />
      )}

      {/* Task 4.1: Live Component Preview Modal (Preview in Live Component) */}
      {previewSlot && activePreviewMeta && treatmentDb[previewSlot.treatmentId] && (
        <LiveComponentPreviewModal
          isOpen={true}
          onClose={() => setPreviewSlot(null)}
          treatment={treatmentDb[previewSlot.treatmentId]}
          slotKey={previewSlot.slotKey}
          slotLabel={activePreviewMeta.label}
          componentLocation={activePreviewMeta.componentLocation}
          onEditSlot={() => handleOpenSlotEditor(previewSlot.treatmentId, previewSlot.slotKey)}
        />
      )}

      {/* Central Asset Library Picker Modal (Task 2.2) */}
      <AssetLibraryPicker
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        allowedTypes={editingSlot?.slotKey === 'heroMedia' ? 'all' : 'image-only'}
        treatmentContextName={currentTreatment?.title}
        onSelect={(asset) => {
          if (editingSlot) {
            setEditingSlot({
              ...editingSlot,
              mediaItem: {
                ...editingSlot.mediaItem,
                url: asset.url,
                mediaType: asset.mediaType || 'image',
                altText: asset.altText || editingSlot.mediaItem.altText,
                seoTitle: asset.seoTitle || editingSlot.mediaItem.seoTitle,
                seoKeywords: asset.seoKeywords && asset.seoKeywords.length > 0 ? asset.seoKeywords : editingSlot.mediaItem.seoKeywords
              }
            });
          }
          showToast(`Selected "${asset.name || 'asset'}" from Central Asset Library!`);
        }}
      />
    </div>
  );
}
