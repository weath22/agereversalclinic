import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TREATMENT_DETAILS_DB, 
  TreatmentDetail,
  DEFAULT_TREATMENT_DETAILS
} from './treatments/treatmentData';
import { CLINICAL_AREAS_DB } from '../data/clinicalTreatments';
import { 
  getTreatmentDetailsConfig, 
  saveTreatmentDetailsConfig,
  getBeforeAfterGalleryConfig,
  saveBeforeAfterGalleryConfig,
  uploadBeforeAfterWebpImage,
  registerMediaAsset,
  uploadAssetFile 
} from '../lib/adminStore';
import { BeforeAfterGalleryConfig, BeforeAfterPair } from '../types';
import { EXISTING_BEFORE_AFTER_TREATMENT_GROUPS } from '../data/transformationsData';
import { 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Sparkles, 
  Layers, 
  Image as ImageIcon, 
  ClipboardList, 
  AlertCircle, 
  Check, 
  FileText, 
  Clock, 
  Smile, 
  ShieldAlert, 
  Calendar,
  ChevronRight,
  ChevronDown,
  Database,
  Search,
  BookOpen,
  Sparkle,
  Activity,
  Heart,
  FolderHeart,
  Sliders,
  Zap,
  Flame,
  Cpu,
  Eye,
  EyeOff,
  X,
  Wand2,
  Compass,
  Link2,
  Link2Off,
  Edit3,
  ExternalLink,
  Upload,
  ImagePlus,
  FolderOpen,
  Loader2
} from 'lucide-react';

const DEFAULT_LAYER_SPECS: Record<'Epidermis' | 'Dermis' | 'Subdermal Adipose' | 'SMAS Muscle Layer', {
  depth: string;
  frequency: string;
  energy: string;
  temperature: string;
  mechanism: string;
}> = {
  Epidermis: {
    depth: '0.1mm - 0.5mm',
    frequency: '2940 nm (Er:YAG) / Plasma Sublimation',
    energy: '1.2 - 2.5 J/cm²',
    temperature: '37°C - 42°C (Ablation range)',
    mechanism: 'Superficial epidermal resurfacing & micro-peeling'
  },
  Dermis: {
    depth: '1.0mm - 3.0mm',
    frequency: '1 MHz - 4 MHz Bipolar Radiofrequency',
    energy: '15 - 45 J/cm³',
    temperature: '60°C - 65°C (Neocollagenesis optimal)',
    mechanism: 'Fibroblast stimulation & dermal remodeling'
  },
  'Subdermal Adipose': {
    depth: '3.0mm - 4.5mm',
    frequency: 'Calibrated Radiofrequency Needling',
    energy: '25 - 60 J/cm³',
    temperature: '65°C - 70°C (Adipose contraction)',
    mechanism: 'Adipose tissue remodeling & lipid clearing'
  },
  'SMAS Muscle Layer': {
    depth: '4.5mm+',
    frequency: '4 MHz High-Intensity Focused Ultrasound (HIFU)',
    energy: '0.45 - 1.2 J/mm²',
    temperature: '65°C - 72°C (Protein coagulation)',
    mechanism: 'SMAS contracture & deep structural hoisting'
  }
};

const CLINICAL_PRESETS = [
  {
    name: 'RF Microneedling',
    targetLayer: 'Dermis' as const,
    depth: '1.5mm - 2.5mm',
    frequency: '1 MHz - 4 MHz Bipolar Radiofrequency',
    energy: '15 - 45 J/cm³',
    temperature: '60°C - 65°C (Neocollagenesis optimal)',
    mechanism: 'Fibroblast stimulation & dermal remodeling'
  },
  {
    name: 'Er:YAG Laser Resurfacing',
    targetLayer: 'Epidermis' as const,
    depth: '0.1mm - 0.5mm',
    frequency: '2940 nm (Er:YAG) / Plasma Sublimation',
    energy: '1.2 - 2.5 J/cm²',
    temperature: '37°C - 42°C (Ablation range)',
    mechanism: 'Superficial epidermal resurfacing & micro-peeling'
  },
  {
    name: 'HIFU / SMAS Deep Lift',
    targetLayer: 'SMAS Muscle Layer' as const,
    depth: '4.5mm+',
    frequency: '4 MHz High-Intensity Focused Ultrasound (HIFU)',
    energy: '0.45 - 1.2 J/mm²',
    temperature: '65°C - 72°C (Protein coagulation)',
    mechanism: 'SMAS contracture & deep structural hoisting'
  },
  {
    name: 'Subdermal Contouring',
    targetLayer: 'Subdermal Adipose' as const,
    depth: '3.0mm - 4.5mm',
    frequency: 'Calibrated Radiofrequency Needling',
    energy: '25 - 60 J/cm³',
    temperature: '65°C - 70°C (Adipose contraction)',
    mechanism: 'Adipose tissue remodeling & lipid clearing'
  },
  {
    name: 'Bio-Cellular Infusion',
    targetLayer: 'Dermis' as const,
    depth: '1.0mm - 2.0mm',
    frequency: 'Acoustic Micro-Transdermal Infusion',
    energy: 'Passive Biocompatible Dermal Saturation',
    temperature: '37°C (Physiological equilibrium)',
    mechanism: 'Cellular mRNA signaling & neo-collagenesis'
  }
];

export default function ServiceViewDetailsEditor() {
  const [db, setDb] = useState<Record<string, TreatmentDetail>>({});
  const [selectedKey, setSelectedKey] = useState<string>('botox-1-area');
  const [formData, setFormData] = useState<TreatmentDetail | null>(null);
  
  // Dynamic navigation search and filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Dermal profiler modal state
  const [isProfilerModalOpen, setIsProfilerModalOpen] = useState(false);

  // Central Before & After Gallery mirroring state
  const [galleryConfig, setGalleryConfig] = useState<BeforeAfterGalleryConfig>(() => getBeforeAfterGalleryConfig());

  // Custom Before/After Case modal state
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<{
    id: string;
    beforeImage: string;
    afterImage: string;
    title: string;
    duration?: string;
    sessions?: number | string;
    beforeAltText?: string;
    afterAltText?: string;
  } | null>(null);
  
  // Custom service page creation modal/form state
  const [isCreating, setIsCreating] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPrice, setNewPrice] = useState('$350');
  
  // Input for adding a single new additional image URL
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // File Storage Upload Handler (General media: backdrop, hero, cards, portfolio)
  const handleFileUpload = async (file: File, onSuccess: (url: string) => void) => {
    setIsUploading(true);
    setStatusMessage({ type: 'success', text: `Loading "${file.name}" from file storage...` });
    try {
      const res = await uploadAssetFile(file);
      if (res.success && res.url) {
        onSuccess(res.url);
        setStatusMessage({ type: 'success', text: `Loaded "${file.name}" successfully!` });
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            onSuccess(reader.result);
            setStatusMessage({ type: 'success', text: `Loaded "${file.name}" from storage!` });
            setTimeout(() => setStatusMessage(null), 3000);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSuccess(reader.result);
          setStatusMessage({ type: 'success', text: `Loaded "${file.name}" from storage!` });
          setTimeout(() => setStatusMessage(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Dedicated Before & After WebP Storage Upload Handler
  // Converts to WebP and writes directly to /assets/transformations/ on physical disk for build/deployment durability
  const handleBeforeAfterPhotoUpload = async (
    file: File,
    slot: 'before' | 'after',
    caseTitle: string,
    onSuccess: (url: string) => void
  ) => {
    setIsUploading(true);
    setStatusMessage({ type: 'success', text: `Converting & saving "${file.name}" to /assets/transformations/...` });
    try {
      // 1. Client-side conversion to WebP format for high quality and minimal footprint
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
        pairId: editingCase?.id || formData?.id
      });

      if (uploaded?.url) {
        const versionedUrl = `${uploaded.url}?v=${Date.now()}`;
        onSuccess(versionedUrl);
        setStatusMessage({ type: 'success', text: `Saved to ${uploaded.url} on disk permanently!` });
        setTimeout(() => setStatusMessage(null), 3500);

        // Register into Central Media Library for Google Image SEO tracking
        try {
          registerMediaAsset({
            name: `${formData?.title || caseTitle} (${slot === 'before' ? 'Before' : 'After'})`,
            url: uploaded.url,
            mediaType: 'image',
            category: 'Before & After',
            altText: `${formData?.title || caseTitle} ${slot === 'before' ? 'Before Treatment' : 'After Treatment Result'} at Age Reversal Clinics`,
            seoKeywords: [
              `${(formData?.title || '').toLowerCase()} before and after`,
              'clinical aesthetic results',
              'harley street aesthetics'
            ]
          });
        } catch {}
      } else {
        // Fallback to asset upload if transformation endpoint is unreachable
        const fallbackRes = await uploadAssetFile(file);
        if (fallbackRes.success && fallbackRes.url) {
          onSuccess(fallbackRes.url);
          setStatusMessage({ type: 'success', text: `Saved "${file.name}" to storage.` });
          setTimeout(() => setStatusMessage(null), 3000);
        } else {
          onSuccess(webpDataUrl);
        }
      }
    } catch (err) {
      console.warn('Error saving transformation photo:', err);
      handleFileUpload(file, onSuccess);
    } finally {
      setIsUploading(false);
    }
  };

  // Tree expanded state
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({
    face: true,
    body: false,
    buttocks: false,
    'minor-surgery-scars': false,
    custom: true
  });

  const toggleArea = (areaId: string) => {
    setExpandedAreas(prev => ({ ...prev, [areaId]: !prev[areaId] }));
  };

  // Load database from adminStore / localStorage or default db
  useEffect(() => {
    const loaded = getTreatmentDetailsConfig();
    if (loaded) {
      // Ensure we fill in any missing treatments just in case
      const merged = { ...TREATMENT_DETAILS_DB, ...loaded };
      setDb(merged);
    } else {
      setDb(TREATMENT_DETAILS_DB);
    }
  }, []);

  // Listen for Before & After Gallery updates from other tabs/admin editors
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

  // Update formData when selected treatment changes or db finishes loading
  useEffect(() => {
    if (db[selectedKey]) {
      const selectedData = JSON.parse(JSON.stringify(db[selectedKey]));
      // Ensure arrays exist
      if (!selectedData.additionalImages) {
        selectedData.additionalImages = [];
      }
      if (!selectedData.customBeforeAfterPairs) {
        selectedData.customBeforeAfterPairs = [];
      }
      if (!selectedData.excludedGalleryPairIds) {
        selectedData.excludedGalleryPairIds = [];
      }
      setFormData(selectedData);
    } else {
      // Find item in CLINICAL_AREAS_DB to dynamically initialize missing keys
      let foundName = selectedKey;
      let foundCategory = 'General Practice';
      for (const area of CLINICAL_AREAS_DB) {
        for (const cat of area.categories) {
          const matchedItem = cat.items.find(item => item.id === selectedKey);
          if (matchedItem) {
            foundName = matchedItem.name;
            foundCategory = cat.name;
            break;
          }
        }
      }
      
      const defaultData = DEFAULT_TREATMENT_DETAILS(foundName);
      defaultData.id = selectedKey;
      defaultData.category = foundCategory;
      defaultData.additionalImages = [];
      defaultData.customBeforeAfterPairs = [];
      defaultData.excludedGalleryPairIds = [];
      setFormData(defaultData);
    }
  }, [selectedKey, db]);

  // Auto expand selected key's parent area
  useEffect(() => {
    // 1. Check in core database
    for (const area of CLINICAL_AREAS_DB) {
      for (const cat of area.categories) {
        if (cat.items.some(item => item.id === selectedKey)) {
          setExpandedAreas(prev => ({ ...prev, [area.id]: true }));
          return;
        }
      }
    }
    // 2. If it's a custom-added service, expand custom
    setExpandedAreas(prev => ({ ...prev, custom: true }));
  }, [selectedKey]);

  // Find all matching pairs mirrored from central Before & After Gallery
  const matchingGalleryCases = React.useMemo(() => {
    if (!formData || !galleryConfig?.categories) return [];
    const normId = (formData.id || selectedKey || '').toLowerCase().trim();
    const normTitle = (formData.title || '').toLowerCase().trim();
    const normCategory = (formData.category || '').toLowerCase().trim();

    const matchingGroupIds = new Set<string>();
    EXISTING_BEFORE_AFTER_TREATMENT_GROUPS.forEach((g) => {
      const pCat = g.pricingCategory.toLowerCase();
      const tCat = g.transformationCategory.toLowerCase();
      const gName = g.name.toLowerCase();
      if (
        (normCategory && (normCategory.includes(pCat) || pCat.includes(normCategory) || normCategory.includes(tCat) || normCategory.includes(gName))) ||
        (normTitle && (
          (normTitle.includes('hair') && g.id === 'clinical-hair') ||
          ((normTitle.includes('scar') || normTitle.includes('acne') || normTitle.includes('peel') || normTitle.includes('laser')) && g.id === 'acne-scarring') ||
          ((normTitle.includes('filler') || normTitle.includes('lip') || normTitle.includes('jaw') || normTitle.includes('morpheus')) && g.id === 'facial-harmony') ||
          ((normTitle.includes('body') || normTitle.includes('sculpt') || normTitle.includes('fat') || normTitle.includes('aqualyx') || normTitle.includes('buttock')) && g.id === 'body-sculpting') ||
          ((normTitle.includes('facial') || normTitle.includes('hydra')) && g.id === 'advanced-facials') ||
          ((normTitle.includes('exosome') || normTitle.includes('profhilo') || normTitle.includes('ultherapy') || normTitle.includes('anti-aging')) && g.id === 'anti-aging')
        ))
      ) {
        matchingGroupIds.add(g.id);
      }
    });

    const matched: Array<{ pair: BeforeAfterPair; groupName: string; isDirect: boolean }> = [];
    const seenPairIds = new Set<string>();

    galleryConfig.categories.forEach((cat) => {
      (cat.pairs || []).forEach((p) => {
        if (!p.hidden && p.beforeImage && p.afterImage && !seenPairIds.has(p.id)) {
          const pLinkedId = (p.linkedTreatmentId || '').toLowerCase().trim();
          const pLinkedTitle = (p.linkedTreatmentTitle || '').toLowerCase().trim();
          const pTitle = (p.title || '').toLowerCase().trim();

          const isDirect =
            (normId && pLinkedId && (pLinkedId === normId || pLinkedId.includes(normId) || normId.includes(pLinkedId))) ||
            (normTitle && pLinkedTitle && (pLinkedTitle === normTitle || pLinkedTitle.includes(normTitle) || normTitle.includes(pLinkedTitle))) ||
            (normId && normId.length >= 3 && (pLinkedTitle.includes(normId) || pTitle.includes(normId)));

          const isGroupMatch = matchingGroupIds.has(cat.id) || (p.treatmentGroupId && matchingGroupIds.has(p.treatmentGroupId));

          if (isDirect || isGroupMatch) {
            seenPairIds.add(p.id);
            matched.push({ pair: p, groupName: cat.name, isDirect: Boolean(isDirect) });
          }
        }
      });
    });

    return matched;
  }, [formData?.id, formData?.title, formData?.category, selectedKey, galleryConfig]);

  // Handlers for Custom Before & After Cases
  const handleOpenAddCaseModal = () => {
    setEditingCase({
      id: `custom-case-${Date.now()}`,
      beforeImage: '',
      afterImage: '',
      title: `${formData?.title || 'Clinical'} Case Outcome`,
      duration: '8 Weeks',
      sessions: 2,
      beforeAltText: '',
      afterAltText: ''
    });
    setIsCaseModalOpen(true);
  };

  const handleOpenEditCaseModal = (item: NonNullable<TreatmentDetail['customBeforeAfterPairs']>[0]) => {
    setEditingCase({ ...item });
    setIsCaseModalOpen(true);
  };

  const handleSaveCase = () => {
    if (!formData || !editingCase) return;
    if (!editingCase.beforeImage.trim() || !editingCase.afterImage.trim()) {
      setStatusMessage({ type: 'error', text: 'Please provide both Before and After image URLs.' });
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    const currentPairs = [...(formData.customBeforeAfterPairs || [])];
    const existingIndex = currentPairs.findIndex((p) => p.id === editingCase.id);
    if (existingIndex >= 0) {
      currentPairs[existingIndex] = editingCase;
    } else {
      currentPairs.push(editingCase);
    }
    handleFieldChange('customBeforeAfterPairs', currentPairs);
    if (!formData.beforeImage) handleFieldChange('beforeImage', editingCase.beforeImage);
    if (!formData.afterImage) handleFieldChange('afterImage', editingCase.afterImage);
    
    setIsCaseModalOpen(false);
    setEditingCase(null);
    setStatusMessage({ type: 'success', text: `Saved "${editingCase.title}" Before & After case!` });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDeleteCustomCase = (id: string) => {
    if (!formData) return;
    const currentPairs = (formData.customBeforeAfterPairs || []).filter((p) => p.id !== id);
    handleFieldChange('customBeforeAfterPairs', currentPairs);
  };

  const handleToggleExcludeGalleryPair = (pairId: string) => {
    if (!formData) return;
    const currentExcluded = new Set(formData.excludedGalleryPairIds || []);
    if (currentExcluded.has(pairId)) {
      currentExcluded.delete(pairId);
    } else {
      currentExcluded.add(pairId);
    }
    handleFieldChange('excludedGalleryPairIds', Array.from(currentExcluded));
  };

  const handleFieldChange = (field: keyof TreatmentDetail, value: any) => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  // List editor helper functions (for preCare, postCare, concerns)
  const handleListElementChange = (field: 'preCare' | 'postCare' | 'concerns', index: number, value: string) => {
    if (!formData) return;
    const currentList = [...(formData[field] || [])];
    currentList[index] = value;
    handleFieldChange(field, currentList);
  };

  const addListElement = (field: 'preCare' | 'postCare' | 'concerns') => {
    if (!formData) return;
    const currentList = [...(formData[field] || [])];
    currentList.push('');
    handleFieldChange(field, currentList);
  };

  const removeListElement = (field: 'preCare' | 'postCare' | 'concerns', index: number) => {
    if (!formData) return;
    const currentList = [...(formData[field] || [])].filter((_, i) => i !== index);
    handleFieldChange(field, currentList);
  };

  // Additional Image Gallery handlers
  const handleAddAdditionalImage = () => {
    if (!formData || !newImageUrlInput.trim()) return;
    const currentImages = [...(formData.additionalImages || [])];
    currentImages.push(newImageUrlInput.trim());
    handleFieldChange('additionalImages', currentImages);
    setNewImageUrlInput('');
    setStatusMessage({ type: 'success', text: 'Added image URL to gallery queue. Click Save to persist changes!' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleRemoveAdditionalImage = (index: number) => {
    if (!formData) return;
    const currentImages = [...(formData.additionalImages || [])].filter((_, i) => i !== index);
    handleFieldChange('additionalImages', currentImages);
  };

  const handleUpdateAdditionalImage = (index: number, value: string) => {
    if (!formData) return;
    const currentImages = [...(formData.additionalImages || [])];
    currentImages[index] = value;
    handleFieldChange('additionalImages', currentImages);
  };

  // Save changes to active database
  const handleSave = () => {
    if (!formData) return;
    const updatedDb = {
      ...db,
      [selectedKey]: formData
    };
    setDb(updatedDb);
    saveTreatmentDetailsConfig(updatedDb);

    // Synchronize custom Before & After pairs with Central Gallery for dual-end mirroring & disk persistence
    try {
      if (formData.customBeforeAfterPairs && formData.customBeforeAfterPairs.length > 0) {
        const centralGallery = getBeforeAfterGalleryConfig();
        if (centralGallery && Array.isArray(centralGallery.categories)) {
          const normTitle = (formData.title || '').toLowerCase();
          const normCategory = (formData.category || '').toLowerCase();
          let targetCatId = 'anti-aging';
          if (normTitle.includes('hair') || normCategory.includes('hair')) targetCatId = 'clinical-hair';
          else if (normTitle.includes('scar') || normTitle.includes('acne') || normCategory.includes('scar') || normCategory.includes('acne')) targetCatId = 'acne-scarring';
          else if (normTitle.includes('filler') || normTitle.includes('lip') || normTitle.includes('jaw') || normCategory.includes('inject')) targetCatId = 'facial-harmony';
          else if (normTitle.includes('body') || normTitle.includes('fat') || normCategory.includes('body') || normCategory.includes('sculpt')) targetCatId = 'body-sculpting';
          else if (normTitle.includes('facial') || normCategory.includes('facial')) targetCatId = 'advanced-facials';

          let galleryChanged = false;
          const updatedCategories = centralGallery.categories.map((cat) => {
            if (cat.id !== targetCatId) return cat;
            const existingPairs = [...(cat.pairs || [])];
            formData.customBeforeAfterPairs?.forEach((customPair) => {
              if (!customPair.beforeImage || !customPair.afterImage) return;
              const existingIdx = existingPairs.findIndex((p) => p.id === customPair.id);
              const mappedPair: BeforeAfterPair = {
                id: customPair.id,
                title: customPair.title || `${formData.title} Outcome`,
                beforeImage: customPair.beforeImage,
                afterImage: customPair.afterImage,
                duration: customPair.duration || '8 Weeks',
                sessions: typeof customPair.sessions === 'number' ? customPair.sessions : Number(customPair.sessions) || 2,
                linkedTreatmentId: formData.id || selectedKey,
                linkedTreatmentTitle: formData.title,
                treatmentGroupId: cat.id,
                beforeAltText: customPair.beforeAltText || `${formData.title} Before Treatment at Age Reversal Clinics`,
                afterAltText: customPair.afterAltText || `${formData.title} After Treatment Result at Age Reversal Clinics`,
                seoTitle: `${formData.title} — Before & After Results`,
                seoKeywords: [
                  `${formData.title.toLowerCase()} before and after`,
                  `${cat.name.toLowerCase()} london`,
                  'clinical transformation'
                ],
                updatedAt: Date.now()
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

    setStatusMessage({ type: 'success', text: `Successfully updated components & clinical parameters for ${formData.title}!` });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Reset selected treatment to defaults
  const handleResetSelected = () => {
    if (!window.confirm(`Are you sure you want to reset "${db[selectedKey]?.title || selectedKey}" clinical parameters back to factory defaults? This cannot be undone.`)) {
      return;
    }
    const defaultData = TREATMENT_DETAILS_DB[selectedKey];
    if (defaultData) {
      const updatedDb = {
        ...db,
        [selectedKey]: JSON.parse(JSON.stringify(defaultData))
      };
      setDb(updatedDb);
      saveTreatmentDetailsConfig(updatedDb);
      setStatusMessage({ type: 'success', text: `Restored ${defaultData.title} to standard clinic specifications.` });
      setTimeout(() => setStatusMessage(null), 4000);
    } else {
      // For custom items, just reset empty/template values
      const fallbackData = createDefaultService(selectedKey, db[selectedKey]?.title || 'Custom Service', db[selectedKey]?.category || 'General');
      const updatedDb = {
        ...db,
        [selectedKey]: fallbackData
      };
      setDb(updatedDb);
      saveTreatmentDetailsConfig(updatedDb);
      setStatusMessage({ type: 'success', text: `Reset custom service parameters to baseline templates.` });
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Create default service helper
  const createDefaultService = (key: string, title: string, category: string): TreatmentDetail => ({
    id: key,
    title,
    category,
    description: 'Enter deep-dive clinical specifications, procedure methodologies, and patient support parameters for this custom service.',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
    badgeText: 'Advanced Clinical Procedure',
    procedureTime: '30 - 60 Minutes',
    comfortLevel: 'Mildly tolerable with topical numbing',
    downtime: '1 - 3 Days',
    recommendedSessions: '3 - 4 Sessions spaced 4-6 weeks apart',
    concerns: ['Skin texture irregular', 'Acne scars', 'Enlarged pores'],
    price: newPrice || '$350',
    targetLayer: 'Dermis',
    targetLayerDepth: '1.0mm - 2.0mm',
    beforeImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600',
    afterImage: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=600',
    preCare: ['Avoid direct sun exposure for 72 hours.', 'Discontinue retinols 5 days before.'],
    postCare: ['Apply hydrating hyaluronic acid serum.', 'Wear broad-spectrum SPF 50+ daily.'],
    additionalImages: []
  });

  // Handle addition of a custom service template
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedKey = newKey.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    if (!formattedKey) {
      alert('Please enter a valid unique lookup identifier (alphanumeric only).');
      return;
    }
    if (db[formattedKey]) {
      alert(`A service with the key "${formattedKey}" already exists! Please choose a unique key.`);
      return;
    }
    if (!newTitle.trim()) {
      alert('Please enter a service page title.');
      return;
    }

    const newService = createDefaultService(formattedKey, newTitle.trim(), newCategory.trim() || 'General Practice');
    const updatedDb = {
      ...db,
      [formattedKey]: newService
    };

    setDb(updatedDb);
    saveTreatmentDetailsConfig(updatedDb);
    setSelectedKey(formattedKey);
    setIsCreating(false);

    // Reset fields
    setNewKey('');
    setNewTitle('');
    setNewCategory('');
    setNewPrice('$350');

    setStatusMessage({ type: 'success', text: `Successfully registered new Service Page details: ${newService.title}!` });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Delete a service page configuration
  const handleDeleteService = (key: string) => {
    if (!window.confirm(`Are you sure you want to completely delete the service page components for "${db[key]?.title || key}"? This cannot be undone.`)) {
      return;
    }
    const updatedDb = { ...db };
    delete updatedDb[key];
    setDb(updatedDb);
    saveTreatmentDetailsConfig(updatedDb);

    // Switch to another existing key
    const remainingKeys = Object.keys(updatedDb);
    if (remainingKeys.length > 0) {
      setSelectedKey(remainingKeys[0]);
    }

    setStatusMessage({ type: 'success', text: 'Service configuration deleted successfully.' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Reset ALL treatments to default
  const handleResetAll = () => {
    if (!window.confirm('Reset ALL clinical service pages back to factory default? Any custom-written clinical guidelines, depths, and before/after URLs will be replaced with original templates.')) {
      return;
    }
    setDb(TREATMENT_DETAILS_DB);
    saveTreatmentDetailsConfig(TREATMENT_DETAILS_DB);
    setSelectedKey('botox-1-area');
    setStatusMessage({ type: 'success', text: 'All clinical service templates successfully restored to default.' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Identify core clinical area treatment IDs
  const coreTreatmentIds = React.useMemo(() => {
    const ids = new Set<string>();
    CLINICAL_AREAS_DB.forEach(area => {
      area.categories.forEach(cat => {
        cat.items.forEach(item => {
          ids.add(item.id);
        });
      });
    });
    return ids;
  }, []);

  // Determine any custom pages added by user that are not in CLINICAL_AREAS_DB
  const customServiceKeys = React.useMemo(() => {
    return Object.keys(db).filter(key => !coreTreatmentIds.has(key));
  }, [db, coreTreatmentIds]);

  if (!formData) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="text-slate-500 font-serif text-sm flex items-center gap-3 animate-pulse">
          <Database className="h-5 w-5 text-[#c5a880] shrink-0" />
          <span>Synchronizing clinical database registries...</span>
        </div>
      </div>
    );
  }

  // Generate dynamic service list directly from database state (adds dynamic additions in real-time)
  const availableServices = Object.keys(db).map(key => ({
    key,
    title: db[key]?.title || key,
    category: db[key]?.category || 'General Practice',
    id: db[key]?.id || key
  }));

  // Categories extracted dynamically from active database for filters
  const categories = ['all', ...Array.from(new Set(availableServices.map(s => s.category.trim()).filter(Boolean)))];

  // Filter service list dynamically in real-time based on search and category choice
  const filteredServices = availableServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans text-slate-800 animate-fadeIn" id="service-view-editor-root">
      
      {/* Upper Header Board */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#003334]/5 border border-[#003334]/10 rounded-3xl p-6">
        <div>
          <h3 className="text-xl font-serif font-bold text-[#003334] flex items-center gap-2.5">
            <Layers className="h-5.5 w-5.5 text-[#c5a880] shrink-0" />
            <span>Service Page Components Editor</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Build and refine clinical content, scientific dermal targets, and visual portfolios displayed inside dynamic service deep-dives.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#003334] hover:bg-black rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 text-[#c5a880]" />
            <span>Add Custom Service Page</span>
          </button>
          <button
            type="button"
            onClick={handleResetAll}
            className="px-3.5 py-2 border border-red-200 hover:bg-red-50 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Reset database to standard factory state"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restore All Defaults</span>
          </button>
        </div>
      </div>

      {/* Inline Form to Create a Custom Service */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreateService} className="bg-white border border-[#c5a880]/30 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkle className="h-4.5 w-4.5 text-[#c5a880]" />
                <h4 className="text-sm font-serif font-bold text-[#003334]">Provision New Service Component Page</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block">Unique ID Key (lowercase, no spaces)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. microneedling"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#003334] outline-none font-mono"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 block">Treatment Name / Service Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Microneedling & RF Resurfacing"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#003334] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 block">Category Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Injectables"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#003334] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#003334] hover:bg-black transition-all"
                >
                  Initialize Components Page
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {statusMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl flex items-center gap-3 border text-xs font-medium ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0" /> : <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />}
          <span>{statusMessage.text}</span>
        </motion.div>
      )}

      {/* Workspace Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Dynamic Navigation Rails */}
        <div className="lg:col-span-1 space-y-4 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block px-1 mb-2">
              Select Core Service Page
            </span>
            
            {/* Real-time Dynamic Search bar */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search services..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#003334] bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Dynamic Category Filter pills - Only show when searching */}
            {searchTerm && (
              <div className="flex flex-wrap gap-1 mb-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                      selectedCategory === cat 
                        ? 'bg-[#c5a880]/15 text-[#003334] border-[#c5a880]/40' 
                        : 'text-slate-500 border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {cat === 'all' ? 'All categories' : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Services Navigation Rail */}
          <div className="space-y-1 max-h-[550px] overflow-y-auto pr-1">
            {searchTerm ? (
              /* Flat list view for easy search filtering */
              <div className="space-y-1">
                {filteredServices.map((service) => (
                  <button
                    key={service.key}
                    type="button"
                    onClick={() => setSelectedKey(service.key)}
                    className={`w-full text-left p-3 rounded-2xl flex items-center justify-between transition-all group ${
                      selectedKey === service.key 
                        ? 'bg-[#003334] text-white shadow-md shadow-[#003334]/10' 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 max-w-[80%]">
                      <span className="text-xs font-bold leading-tight line-clamp-1">{service.title}</span>
                      <span className={`text-[9px] uppercase font-bold tracking-wider line-clamp-1 ${
                        selectedKey === service.key ? 'text-[#c5a880]' : 'text-slate-400'
                      }`}>{service.category}</span>
                    </div>
                    <ChevronRight className={`h-3 w-3 shrink-0 transition-transform ${
                      selectedKey === service.key ? 'text-[#c5a880] translate-x-0.5' : 'text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5'
                    }`} />
                  </button>
                ))}

                {filteredServices.length === 0 && (
                  <div className="text-center py-8 text-[11px] text-slate-400 italic">
                    No matching service pages.
                  </div>
                )}
              </div>
            ) : (
              /* Hierarchical Tree View aligned with clinical menu navigation mapping */
              <div className="space-y-2">
                {CLINICAL_AREAS_DB.map((area) => {
                  const isExpanded = !!expandedAreas[area.id];
                  return (
                    <div key={area.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/40">
                      <button
                        type="button"
                        onClick={() => toggleArea(area.id)}
                        className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                      >
                        <span className="text-[11px] font-extrabold tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#c5a880]" />
                          {area.name}
                        </span>
                        <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="p-1.5 space-y-2.5 bg-white border-t border-slate-50">
                          {area.categories.map((cat) => (
                            <div key={cat.id} className="space-y-1">
                              <span className="text-[8.5px] font-extrabold tracking-widest text-slate-400 uppercase block px-2 py-0.5">
                                {cat.name}
                              </span>
                              
                              <div className="space-y-0.5 pl-1">
                                {cat.items.map((item) => {
                                  const isSelected = selectedKey === item.id;
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => setSelectedKey(item.id)}
                                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[10.5px] transition-all flex items-center justify-between group ${
                                        isSelected 
                                          ? 'bg-[#003334] text-white font-bold shadow-sm shadow-[#003334]/15' 
                                          : 'hover:bg-slate-50 text-slate-600 hover:text-slate-950'
                                      }`}
                                    >
                                      <span className="truncate pr-1">{item.name}</span>
                                      <ChevronRight className={`h-2.5 w-2.5 shrink-0 transition-transform ${isSelected ? 'text-[#c5a880] translate-x-0.5' : 'text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5'}`} />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Custom Pages Group */}
                {customServiceKeys.length > 0 && (
                  <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/40">
                    <button
                      type="button"
                      onClick={() => toggleArea('custom')}
                      className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                    >
                      <span className="text-[11px] font-extrabold tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Custom Pages
                      </span>
                      <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${expandedAreas.custom ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedAreas.custom && (
                      <div className="p-1.5 space-y-0.5 bg-white border-t border-slate-50">
                        {customServiceKeys.map((key) => {
                          const isSelected = selectedKey === key;
                          const title = db[key]?.title || key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setSelectedKey(key)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[10.5px] transition-all flex items-center justify-between group ${
                                isSelected 
                                  ? 'bg-[#003334] text-white font-bold shadow-sm shadow-[#003334]/15' 
                                  : 'hover:bg-slate-50 text-slate-600 hover:text-slate-950'
                              }`}
                            >
                              <span className="truncate pr-1">{title}</span>
                              <ChevronRight className={`h-2.5 w-2.5 shrink-0 transition-transform ${isSelected ? 'text-[#c5a880] translate-x-0.5' : 'text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5'}`} />
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

        {/* Dynamic Component Editor sections styled as dedicated separate containers */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Header Dashboard section of selected service */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#c5a880] block mb-1">
                Active Component Workspace
              </span>
              <h4 className="text-lg font-serif font-bold text-[#003334]">{formData.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Database key reference: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px] text-[#003334]">{formData.id}</code></p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Only show delete button if we have multiple services or custom pages */}
              {!TREATMENT_DETAILS_DB[selectedKey] && (
                <button
                  type="button"
                  onClick={() => handleDeleteService(selectedKey)}
                  className="px-3.5 py-2 text-xs font-semibold text-red-600 hover:text-red-800 border border-red-150 hover:bg-red-50 bg-white rounded-xl flex items-center gap-1.5 transition-all"
                  title="Remove this custom service page entirely"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Custom Page</span>
                </button>
              )}
              
              <button
                type="button"
                onClick={handleResetSelected}
                className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 bg-white rounded-xl flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset to Defaults</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4.5 py-2 text-xs font-bold text-white bg-[#003334] hover:bg-[#c5a880] rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 hover:text-[#003334]"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Components</span>
              </button>
            </div>
          </div>

          {/* SECTION 1: HERO & BADGE COMPONENT CONTAINER */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h5 className="text-xs font-extrabold text-[#003334] uppercase tracking-wider flex items-center gap-2 border-b border-slate-150 pb-3">
              <Sparkles className="h-4.5 w-4.5 text-[#c5a880] shrink-0" />
              <span>1. Hero &amp; Badge Component Elements</span>
            </h5>
            <p className="text-[11px] text-slate-400 -mt-2">Customize the top headline banner, intro badges, pricing, and main backdrop of the service page.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Title & Badge */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-600 block">Hero Title &amp; Topline</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                    placeholder="e.g. Exosome Regenerative Therapy"
                  />
                  <input
                    type="text"
                    value={formData.badgeText || ''}
                    onChange={(e) => handleFieldChange('badgeText', e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                    placeholder="Badge e.g. Pioneering Biotech"
                  />
                </div>
              </div>

              {/* Category & Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Category Classification</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. Regenerative Aesthetics"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Starting Cost Indicator</label>
                <input
                  type="text"
                  value={formData.price || ''}
                  onChange={(e) => handleFieldChange('price', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. £350"
                />
              </div>

              {/* Hero Image */}
              <div className="space-y-1.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 block">Hero Backdrop Image</label>
                  <label className="inline-flex items-center gap-1 text-[11px] font-bold text-[#003334] hover:text-[#c5a880] cursor-pointer bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors">
                    <Upload className="w-3 h-3 text-[#c5a880]" />
                    <span>Add Image from Storage</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, (url) => handleFieldChange('imageUrl', url));
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none font-mono"
                    placeholder="Paste image URL or use 'Add Image from Storage' above..."
                  />
                  {formData.imageUrl && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1.5: TREATMENT OVERVIEW & PHILOSOPHY PROTOCOL */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-150 pb-3">
              <h5 className="text-xs font-extrabold text-[#003334] uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-[#c5a880] shrink-0" />
                <span>Treatment Overview &amp; Philosophy Protocol Section</span>
              </h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Customize the scientific profile, the Philosophy &amp; Protocol callout quote, and the dual overlapping clinical cards.</p>
            </div>

            {/* Narrative Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Scientific Narrative Description (Overview Body)</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none leading-relaxed"
                placeholder="Write the clinical summary regarding how this treatment revitalizes dermal cells..."
              />
            </div>

            {/* Philosophy & Protocol Callout */}
            <div className="space-y-1.5 bg-sky-50/50 p-4 rounded-2xl border border-sky-100">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-500 shrink-0" />
                <label className="text-xs font-bold text-sky-950 block">Philosophy &amp; Protocol Callout Box Text</label>
              </div>
              <p className="text-[10px] text-sky-800/80">This appears inside the highlighted blue quote box right beside the overview narrative.</p>
              <textarea
                rows={2}
                value={formData.protocolQuote || ''}
                onChange={(e) => handleFieldChange('protocolQuote', e.target.value)}
                className="w-full px-4 py-2.5 text-xs border border-sky-200 rounded-xl focus:ring-1 focus:ring-sky-500 outline-none bg-white text-slate-800 leading-relaxed font-medium"
                placeholder="e.g. Every protocol is strictly diagnostic-first, ensuring high safety parameters and clinical efficacy tailored exactly to your dermal matrix."
              />
            </div>

            {/* Dual Overlapping Procedural Media (overviewMedia) */}
            <div className="space-y-3 pt-1">
              <span className="text-[11px] font-bold text-[#003334] uppercase tracking-wider block">
                Dual Overlapping Procedural Media (Front &amp; Back Cards)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Front Card (Primary Focal) */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#003334]" />
                      Front Card (Focal Focus)
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">Bottom-Right Card</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-600 block">Image URL</label>
                      <label className="inline-flex items-center gap-1 text-[10px] font-bold text-[#003334] hover:text-[#c5a880] cursor-pointer">
                        <Upload className="w-3 h-3 text-[#c5a880]" />
                        <span>Add from Storage</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file, (url) => {
                                const current = formData.overviewMedia || {
                                  backCard: { url: '', altText: '', seoKeywords: [] },
                                  frontCard: { url: '', altText: '', seoKeywords: [] },
                                };
                                handleFieldChange('overviewMedia', {
                                  ...current,
                                  frontCard: {
                                    ...current.frontCard,
                                    url,
                                    altText: current.frontCard?.altText || `${formData.title} procedural profile - front focal`,
                                  },
                                });
                              });
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.overviewMedia?.frontCard?.url || ''}
                        onChange={(e) => {
                          const current = formData.overviewMedia || {
                            backCard: { url: '', altText: '', seoKeywords: [] },
                            frontCard: { url: '', altText: '', seoKeywords: [] },
                          };
                          handleFieldChange('overviewMedia', {
                            ...current,
                            frontCard: {
                              ...current.frontCard,
                              url: e.target.value,
                              altText: current.frontCard?.altText || `${formData.title} procedural profile - front focal`,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white outline-none font-mono"
                        placeholder="Paste image URL or use 'Add from Storage' above..."
                      />
                      {formData.overviewMedia?.frontCard?.url && (
                        <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                          <img src={formData.overviewMedia.frontCard.url} alt="front card preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 block">SEO Alt Text</label>
                    <input
                      type="text"
                      value={formData.overviewMedia?.frontCard?.altText || ''}
                      onChange={(e) => {
                        const current = formData.overviewMedia || {
                          backCard: { url: '', altText: '', seoKeywords: [] },
                          frontCard: { url: '', altText: '', seoKeywords: [] },
                        };
                        handleFieldChange('overviewMedia', {
                          ...current,
                          frontCard: {
                            ...current.frontCard,
                            altText: e.target.value,
                          },
                        });
                      }}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white outline-none"
                      placeholder={`e.g. ${formData.title} clinical serum application and deep dermal micro-infusion`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 block">Card Hover / SEO Title</label>
                    <input
                      type="text"
                      value={formData.overviewMedia?.frontCard?.seoTitle || ''}
                      onChange={(e) => {
                        const current = formData.overviewMedia || {
                          backCard: { url: '', altText: '', seoKeywords: [] },
                          frontCard: { url: '', altText: '', seoKeywords: [] },
                        };
                        handleFieldChange('overviewMedia', {
                          ...current,
                          frontCard: {
                            ...current.frontCard,
                            seoTitle: e.target.value,
                          },
                        });
                      }}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white outline-none"
                      placeholder={formData.title}
                    />
                  </div>
                </div>

                {/* Back Card (Secondary Framing) */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
                      Back Card (Framing Depth)
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">Top-Left Card</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-600 block">Image URL</label>
                      <label className="inline-flex items-center gap-1 text-[10px] font-bold text-[#003334] hover:text-[#c5a880] cursor-pointer">
                        <Upload className="w-3 h-3 text-[#c5a880]" />
                        <span>Add from Storage</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file, (url) => {
                                const current = formData.overviewMedia || {
                                  backCard: { url: '', altText: '', seoKeywords: [] },
                                  frontCard: { url: '', altText: '', seoKeywords: [] },
                                };
                                handleFieldChange('overviewMedia', {
                                  ...current,
                                  backCard: {
                                    ...current.backCard,
                                    url,
                                    altText: current.backCard?.altText || `${formData.title} procedural profile - back framing`,
                                  },
                                });
                              });
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.overviewMedia?.backCard?.url || ''}
                        onChange={(e) => {
                          const current = formData.overviewMedia || {
                            backCard: { url: '', altText: '', seoKeywords: [] },
                            frontCard: { url: '', altText: '', seoKeywords: [] },
                          };
                          handleFieldChange('overviewMedia', {
                            ...current,
                            backCard: {
                              ...current.backCard,
                              url: e.target.value,
                              altText: current.backCard?.altText || `${formData.title} procedural profile - back framing`,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white outline-none font-mono"
                        placeholder="Paste image URL or use 'Add from Storage' above..."
                      />
                      {formData.overviewMedia?.backCard?.url && (
                        <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                          <img src={formData.overviewMedia.backCard.url} alt="back card preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 block">SEO Alt Text</label>
                    <input
                      type="text"
                      value={formData.overviewMedia?.backCard?.altText || ''}
                      onChange={(e) => {
                        const current = formData.overviewMedia || {
                          backCard: { url: '', altText: '', seoKeywords: [] },
                          frontCard: { url: '', altText: '', seoKeywords: [] },
                        };
                        handleFieldChange('overviewMedia', {
                          ...current,
                          backCard: {
                            ...current.backCard,
                            altText: e.target.value,
                          },
                        });
                      }}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white outline-none"
                      placeholder={`e.g. ${formData.title} procedural profile - back framing`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 block">Card Hover / SEO Title</label>
                    <input
                      type="text"
                      value={formData.overviewMedia?.backCard?.seoTitle || ''}
                      onChange={(e) => {
                        const current = formData.overviewMedia || {
                          backCard: { url: '', altText: '', seoKeywords: [] },
                          frontCard: { url: '', altText: '', seoKeywords: [] },
                        };
                        handleFieldChange('overviewMedia', {
                          ...current,
                          backCard: {
                            ...current.backCard,
                            seoTitle: e.target.value,
                          },
                        });
                      }}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white outline-none"
                      placeholder={formData.title}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: CLINICAL EXPECTATIONS COMPONENT CONTAINER */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h5 className="text-xs font-extrabold text-[#003334] uppercase tracking-wider flex items-center gap-2 border-b border-slate-150 pb-3">
              <Clock className="h-4.5 w-4.5 text-[#c5a880] shrink-0" />
              <span>2. Clinical Expectations &amp; Timeline Parameters</span>
            </h5>
            <p className="text-[11px] text-slate-400 -mt-2">Provide patient summaries for procedure time, comfort rating, downtime, session intervals, numbing, and longevity.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {/* Procedure Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Typical Procedure Time</label>
                <input
                  type="text"
                  value={formData.procedureTime}
                  onChange={(e) => handleFieldChange('procedureTime', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. 45 - 60 Minutes"
                />
              </div>

              {/* Comfort Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Patient Comfort Rating</label>
                <input
                  type="text"
                  value={formData.comfortLevel}
                  onChange={(e) => handleFieldChange('comfortLevel', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. Mildly Pinching (Topical Numbing Applied)"
                />
              </div>

              {/* Downtime */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Recovery / Skin Downtime</label>
                <input
                  type="text"
                  value={formData.downtime}
                  onChange={(e) => handleFieldChange('downtime', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. 12 - 24 Hours (Mild pink glow)"
                />
              </div>

              {/* Recommended Sessions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Optimal Sessions Protocol</label>
                <input
                  type="text"
                  value={formData.recommendedSessions}
                  onChange={(e) => handleFieldChange('recommendedSessions', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. 3 sessions spaced 4 weeks apart"
                />
              </div>

              {/* Anesthesia / Numbing Options */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Anesthesia / Numbing Options</label>
                <input
                  type="text"
                  value={formData.anesthesia || ''}
                  onChange={(e) => handleFieldChange('anesthesia', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. Topical lidocaine applied 30 mins prior"
                />
              </div>

              {/* Long-term Longevity Expectation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Expected Results Longevity</label>
                <input
                  type="text"
                  value={formData.longevity || ''}
                  onChange={(e) => handleFieldChange('longevity', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                  placeholder="e.g. 6 - 12 Months (Maintenance session recommended)"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: INTERACTIVE DERMAL PROFILER CALIBRATION STUDIO */}
          {(() => {
            const currentLayer = (formData.targetLayer as 'Epidermis' | 'Dermis' | 'Subdermal Adipose' | 'SMAS Muscle Layer') || 'Dermis';
            const activeDefaultSpecs = DEFAULT_LAYER_SPECS[currentLayer] || DEFAULT_LAYER_SPECS.Dermis;
            const hasCustomSpecs = Boolean(
              formData.dermalSpecs?.frequency ||
              formData.dermalSpecs?.energy ||
              formData.dermalSpecs?.temperature ||
              formData.dermalSpecs?.mechanism
            );

            const activeFrequency = formData.dermalSpecs?.frequency || activeDefaultSpecs.frequency;
            const activeEnergy = formData.dermalSpecs?.energy || activeDefaultSpecs.energy;
            const activeTemp = formData.dermalSpecs?.temperature || activeDefaultSpecs.temperature;
            const activeMechanism = formData.dermalSpecs?.mechanism || activeDefaultSpecs.mechanism;

            const layerOptions: Array<{ id: 'Epidermis' | 'Dermis' | 'Subdermal Adipose' | 'SMAS Muscle Layer'; label: string; depth: string }> = [
              { id: 'Epidermis', label: 'Epidermis', depth: '0.1mm - 0.5mm' },
              { id: 'Dermis', label: 'Dermis', depth: '1.0mm - 3.0mm' },
              { id: 'Subdermal Adipose', label: 'Adipose', depth: '3.0mm - 4.5mm' },
              { id: 'SMAS Muscle Layer', label: 'SMAS Muscle', depth: '4.5mm+' },
            ];

            return (
              <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-5">
                {/* Section Header with Show/Hide Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 pb-4">
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-extrabold text-[#003334] uppercase tracking-wider flex items-center gap-2">
                      <Activity className="h-4.5 w-4.5 text-[#c5a880] shrink-0" />
                      <span>3. Interactive Dermal Profiler Calibration Studio</span>
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Calibrate anatomical targeting and live HUD diagnostic telemetry rendered by SkinLayerTargets.
                    </p>
                  </div>

                  {/* Show/Hide Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleFieldChange('profilerEnabled', formData.profilerEnabled === false ? true : false)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                      formData.profilerEnabled !== false
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {formData.profilerEnabled !== false ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Profiler Active</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        <span>Disabled on Page</span>
                      </>
                    )}
                  </button>
                </div>

                {/* State when Profiler is Disabled */}
                {formData.profilerEnabled === false ? (
                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-600">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-200/70 flex items-center justify-center shrink-0">
                        <EyeOff className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 block">Dermal Profiler is Hidden</span>
                        <p className="text-[11px] text-slate-500">
                          Disabled for non-dermal procedures (e.g. IV Nutritional Drips, Hair Salon, or Massages).
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('profilerEnabled', true)}
                      className="px-3.5 py-1.5 bg-[#003334] text-white rounded-xl text-xs font-bold hover:bg-[#002526] transition-colors shrink-0 cursor-pointer"
                    >
                      Enable Profiler
                    </button>
                  </div>
                ) : (
                  /* Active Profiler Calibration Interface */
                  <div className="space-y-5">
                    {/* 1. Target Layer Selector (Interactive Cards) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 block">
                          Target Anatomical Layer
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Selected: <strong className="text-[#003334]">{formData.targetLayer}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                        {layerOptions.map((opt) => {
                          const isSelected = formData.targetLayer === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                handleFieldChange('targetLayer', opt.id);
                                if (!formData.targetLayerDepth || formData.targetLayerDepth === '1.5mm - 4.5mm') {
                                  handleFieldChange('targetLayerDepth', opt.depth);
                                }
                              }}
                              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                                isSelected
                                  ? 'bg-[#003334] text-white border-[#003334] shadow-md shadow-[#003334]/15 ring-2 ring-[#c5a880]/40'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold truncate">{opt.label}</span>
                                {isSelected ? (
                                  <span className="w-2 h-2 rounded-full bg-[#c5a880] shrink-0" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-slate-400 shrink-0" />
                                )}
                              </div>
                              <span className={`text-[10px] font-mono block ${isSelected ? 'text-[#c5a880]' : 'text-slate-400'}`}>
                                {opt.depth}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Target Depth Range with Quick Preset Chips */}
                    <div className="space-y-2 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <label className="text-xs font-bold text-slate-700 block">
                          Calibrated Delivery Depth Range
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">e.g. 1.5mm - 2.5mm</span>
                      </div>

                      <input
                        type="text"
                        value={formData.targetLayerDepth}
                        onChange={(e) => handleFieldChange('targetLayerDepth', e.target.value)}
                        className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] bg-white outline-none font-mono font-medium text-slate-800"
                        placeholder="e.g. 1.5mm - 2.5mm"
                      />

                      {/* Quick depth chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">Quick Fill:</span>
                        {[
                          { label: '0.1mm - 0.5mm', tag: 'Epidermal' },
                          { label: '1.0mm - 2.5mm', tag: 'Mid-Dermis' },
                          { label: '3.0mm - 4.5mm', tag: 'Adipose' },
                          { label: '4.5mm+', tag: 'SMAS Lift' },
                        ].map((chip) => (
                          <button
                            key={chip.label}
                            type="button"
                            onClick={() => handleFieldChange('targetLayerDepth', chip.label)}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white border border-slate-200 hover:border-[#c5a880] hover:text-[#003334] text-slate-600 transition-colors cursor-pointer"
                          >
                            {chip.label} <span className="text-slate-400 text-[9px]">({chip.tag})</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Diagnostic Telemetry HUD Summary Card & Calibration Modal Trigger */}
                    <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-900 text-white space-y-3.5 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-[#c5a880] animate-pulse" />
                          <span className="text-xs font-bold tracking-wide uppercase text-slate-200">
                            HUD Telemetry Calibration
                          </span>
                          {hasCustomSpecs ? (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/40">
                              Custom Overrides Active
                            </span>
                          ) : (
                            <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/15">
                              Layer Factory Defaults
                            </span>
                          )}
                        </div>

                        {/* Modal Opener Button */}
                        <div className="flex items-center gap-2">
                          {hasCustomSpecs && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange('dermalSpecs', undefined)}
                              className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer transition-colors"
                            >
                              Reset to Defaults
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setIsProfilerModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#c5a880] hover:bg-[#b59870] text-[#003334] text-xs font-bold transition-all shadow-sm cursor-pointer"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Calibrate Specs</span>
                          </button>
                        </div>
                      </div>

                      {/* Clean 4-Column Live Spec Readout */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1">
                          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Frequency / Wave</span>
                          <span className="text-xs font-mono font-bold text-white block truncate">{activeFrequency}</span>
                        </div>
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1">
                          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Energy Output</span>
                          <span className="text-xs font-mono font-bold text-[#c5a880] block truncate">{activeEnergy}</span>
                        </div>
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1">
                          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Thermal Profile</span>
                          <span className="text-xs font-mono font-bold text-rose-300 block truncate flex items-center gap-1">
                            <Flame className="w-3 h-3 text-rose-400 shrink-0" />
                            <span>{activeTemp}</span>
                          </span>
                        </div>
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1">
                          <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Mechanism</span>
                          <span className="text-xs text-slate-300 block truncate">{activeMechanism}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL / MOBILE BOTTOM SHEET: TELEMETRY CALIBRATION STUDIO */}
                <AnimatePresence>
                  {isProfilerModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                      {/* Dark Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsProfilerModalOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
                      />

                      {/* Modal Card (Sliding bottom sheet on mobile, centered modal on tablet/desktop) */}
                      <motion.div
                        initial={{ y: '100%', opacity: 0.8 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                        className="relative z-10 w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto space-y-5"
                      >
                        {/* Mobile Drag Pill */}
                        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto -mt-1 sm:hidden" />

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-150 pb-3.5">
                          <div className="space-y-0.5">
                            <h4 className="text-sm sm:text-base font-bold text-[#003334] flex items-center gap-2">
                              <Sliders className="w-4 h-4 text-[#c5a880]" />
                              <span>Calibrate Diagnostic Telemetry</span>
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Custom clinical parameters for {formData.title} ({formData.targetLayer})
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsProfilerModalOpen(false)}
                            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Quick Presets Menu Bar */}
                        <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Quick Clinical Presets
                          </span>
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
                                className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-white border border-slate-200 hover:border-[#c5a880] hover:text-[#003334] text-slate-700 transition-colors cursor-pointer shadow-2xs"
                              >
                                {preset.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Form Inputs (clean, intuitive, no text walls) */}
                        <div className="space-y-3.5">
                          {/* Frequency / Wavelength */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 text-[#c5a880]" />
                              <span>Frequency / Wavelength</span>
                            </label>
                            <input
                              type="text"
                              value={formData.dermalSpecs?.frequency || ''}
                              onChange={(e) => {
                                handleFieldChange('dermalSpecs', {
                                  ...formData.dermalSpecs,
                                  frequency: e.target.value,
                                });
                              }}
                              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none font-mono"
                              placeholder={activeDefaultSpecs.frequency}
                            />
                          </div>

                          {/* Energy Output */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Cpu className="w-3.5 h-3.5 text-[#c5a880]" />
                              <span>Energy Output</span>
                            </label>
                            <input
                              type="text"
                              value={formData.dermalSpecs?.energy || ''}
                              onChange={(e) => {
                                handleFieldChange('dermalSpecs', {
                                  ...formData.dermalSpecs,
                                  energy: e.target.value,
                                });
                              }}
                              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none font-mono"
                              placeholder={activeDefaultSpecs.energy}
                            />
                          </div>

                          {/* Thermal Calibration */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Flame className="w-3.5 h-3.5 text-rose-500" />
                              <span>Thermal Calibration</span>
                            </label>
                            <input
                              type="text"
                              value={formData.dermalSpecs?.temperature || ''}
                              onChange={(e) => {
                                handleFieldChange('dermalSpecs', {
                                  ...formData.dermalSpecs,
                                  temperature: e.target.value,
                                });
                              }}
                              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none font-mono"
                              placeholder={activeDefaultSpecs.temperature}
                            />
                          </div>

                          {/* Clinical Action / Mechanism */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Compass className="w-3.5 h-3.5 text-[#003334]" />
                              <span>Clinical Action / Mechanism</span>
                            </label>
                            <input
                              type="text"
                              value={formData.dermalSpecs?.mechanism || ''}
                              onChange={(e) => {
                                handleFieldChange('dermalSpecs', {
                                  ...formData.dermalSpecs,
                                  mechanism: e.target.value,
                                });
                              }}
                              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                              placeholder={activeDefaultSpecs.mechanism}
                            />
                          </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="pt-2 border-t border-slate-150 flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              handleFieldChange('dermalSpecs', undefined);
                              setIsProfilerModalOpen(false);
                            }}
                            className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          >
                            Reset to Layer Defaults
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsProfilerModalOpen(false)}
                            className="px-5 py-2 bg-[#003334] hover:bg-[#002526] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                          >
                            Apply Calibration
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            );
          })()}

          {/* SECTION 4: BEFORE & AFTER CASES (MIRRORED FROM GALLERY & CUSTOM) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-5">
            {/* Header with Title and Add Case button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 pb-4">
              <div className="space-y-0.5">
                <h5 className="text-xs font-extrabold text-[#003334] uppercase tracking-wider flex items-center gap-2">
                  <Smile className="h-4.5 w-4.5 text-[#c5a880] shrink-0" />
                  <span>4. Clinical Before &amp; After Cases</span>
                </h5>
                <p className="text-[11px] text-slate-400">
                  Mirrored from the central Before &amp; After Gallery or customized specifically for this service page.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddCaseModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#003334] hover:bg-[#002526] text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Case</span>
              </button>
            </div>

            {/* Subsection 4.1: Mirrored Cases from Main Gallery */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Mirrored from Main Gallery ({matchingGalleryCases.length})</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  Auto-matched by treatment group &amp; ID
                </span>
              </div>

              {matchingGalleryCases.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center space-y-1">
                  <span className="text-xs font-medium text-slate-500 block">
                    No matching cases found in the central Before &amp; After Gallery for this treatment.
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    You can add custom before/after cases below, or assign this treatment in the Before &amp; After Editor.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {matchingGalleryCases.map(({ pair, groupName, isDirect }) => {
                    const isExcluded = Boolean(formData.excludedGalleryPairIds?.includes(pair.id));
                    return (
                      <div
                        key={pair.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          isExcluded
                            ? 'bg-slate-50/80 border-slate-200 opacity-60'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-800 line-clamp-1">
                              {pair.title || 'Clinical Outcome'}
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                {isDirect ? 'Direct Treatment Match' : groupName}
                              </span>
                              {pair.duration && (
                                <span className="text-[9px] font-mono text-slate-400">
                                  {pair.duration}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Detach / Re-attach Action */}
                          <button
                            type="button"
                            onClick={() => handleToggleExcludeGalleryPair(pair.id)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0 ${
                              isExcluded
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            {isExcluded ? (
                              <>
                                <Link2 className="w-3 h-3" />
                                <span>Re-attach</span>
                              </>
                            ) : (
                              <>
                                <Link2Off className="w-3 h-3" />
                                <span>Remove from Page</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Dual Thumbnail Comparison Preview */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                            <img
                              src={pair.beforeImage}
                              alt="Before preview"
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as any).style.display = 'none'; }}
                            />
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[8px] font-bold uppercase tracking-wider">
                              Before
                            </span>
                          </div>
                          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                            <img
                              src={pair.afterImage}
                              alt="After preview"
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as any).style.display = 'none'; }}
                            />
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#003334]/85 text-[#c5a880] text-[8px] font-bold uppercase tracking-wider">
                              After
                            </span>
                          </div>
                        </div>

                        {isExcluded && (
                          <div className="mt-2 text-[9px] font-mono text-slate-500 italic text-center">
                            Excluded: Will not appear in this service page slider
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Subsection 4.2: Custom Cases Added Specifically for this Treatment */}
            <div className="space-y-3 pt-3 border-t border-slate-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#003334]" />
                  <span>Custom Service Cases ({(formData.customBeforeAfterPairs || []).length})</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  Exclusive to this service page
                </span>
              </div>

              {(formData.customBeforeAfterPairs || []).length === 0 ? (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-700 block">No Custom Cases Added Yet</span>
                    <span className="text-[10px] text-slate-400 block">
                      Add unique before &amp; after photographic cases specifically for this procedure.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddCaseModal}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#c5a880] text-xs font-bold text-[#003334] rounded-xl transition-all shrink-0 cursor-pointer shadow-2xs"
                  >
                    + Add Custom Case
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(formData.customBeforeAfterPairs || []).map((cCase) => (
                    <div
                      key={cCase.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800 line-clamp-1">{cCase.title}</span>
                          <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {cCase.duration || 'Clinical Outcome'}
                          </span>
                        </div>

                        {/* Edit and Delete Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCaseModal(cCase)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Case"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomCase(cCase.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Case"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Dual Thumbnails */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img
                            src={cCase.beforeImage}
                            alt="Before preview"
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as any).style.display = 'none'; }}
                          />
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[8px] font-bold uppercase tracking-wider">
                            Before
                          </span>
                        </div>
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img
                            src={cCase.afterImage}
                            alt="After preview"
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as any).style.display = 'none'; }}
                          />
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#003334]/85 text-[#c5a880] text-[8px] font-bold uppercase tracking-wider">
                            After
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subsection 4.3: Baseline Fallback Pair (Backwards Compatible) */}
            <div className="space-y-2 pt-3 border-t border-slate-150">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Primary Baseline Fallback URLs (Single Pair)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-600 block">Baseline (Before) Image</label>
                    <label className="inline-flex items-center gap-1 text-[10px] font-bold text-[#003334] hover:text-[#c5a880] cursor-pointer">
                      <Upload className="w-3 h-3 text-[#c5a880]" />
                      <span>Add from Storage</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleBeforeAfterPhotoUpload(file, 'before', formData.title || 'Baseline', (url) => handleFieldChange('beforeImage', url));
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.beforeImage}
                    onChange={(e) => handleFieldChange('beforeImage', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none font-mono bg-white"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-600 block">Outcome (After) Image</label>
                    <label className="inline-flex items-center gap-1 text-[10px] font-bold text-[#003334] hover:text-[#c5a880] cursor-pointer">
                      <Upload className="w-3 h-3 text-[#c5a880]" />
                      <span>Add from Storage</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleBeforeAfterPhotoUpload(file, 'after', formData.title || 'Outcome', (url) => handleFieldChange('afterImage', url));
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.afterImage}
                    onChange={(e) => handleFieldChange('afterImage', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none font-mono bg-white"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
            </div>

            {/* MODAL / BOTTOM SHEET: ADD & EDIT BEFORE/AFTER CASE */}
            <AnimatePresence>
              {isCaseModalOpen && editingCase && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      setIsCaseModalOpen(false);
                      setEditingCase(null);
                    }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
                  />

                  {/* Modal Container (Bottom sheet on mobile, centered dialog on desktop) */}
                  <motion.div
                    initial={{ y: '100%', opacity: 0.8 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto space-y-4"
                  >
                    {/* Mobile Drag Pill */}
                    <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto -mt-1 sm:hidden" />

                    {/* Modal Header */}
                    <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                      <div className="space-y-0.5">
                        <h4 className="text-sm sm:text-base font-bold text-[#003334] flex items-center gap-2">
                          <Smile className="w-4 h-4 text-[#c5a880]" />
                          <span>
                            {formData.customBeforeAfterPairs?.some((p) => p.id === editingCase.id)
                              ? 'Edit Before & After Case'
                              : 'Add New Before & After Case'}
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          For {formData.title} clinical transformation slider
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCaseModalOpen(false);
                          setEditingCase(null);
                        }}
                        className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3.5">
                      {/* Case Title */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Case Outcome Title</label>
                        <input
                          type="text"
                          value={editingCase.title}
                          onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                          placeholder="e.g. 8 Weeks Post-Treatment (Mid-Face Volumization)"
                        />
                      </div>

                      {/* Duration / Protocol Badge */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Protocol Duration / Badge</label>
                        <input
                          type="text"
                          value={editingCase.duration || ''}
                          onChange={(e) => setEditingCase({ ...editingCase, duration: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none"
                          placeholder="e.g. 8 Weeks • 2 Sessions"
                        />
                      </div>

                      {/* Before Image with Storage Upload */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 block">Baseline (Before) Image</label>
                          <label className="inline-flex items-center gap-1 text-[11px] font-bold text-[#003334] hover:text-[#c5a880] cursor-pointer bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors">
                            <Upload className="w-3 h-3 text-[#c5a880]" />
                            <span>Add Image from Storage</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleBeforeAfterPhotoUpload(file, 'before', editingCase.title || formData.title, (url) => {
                                    setEditingCase((prev) => prev ? { ...prev, beforeImage: url } : null);
                                  });
                                }
                                e.target.value = '';
                              }}
                            />
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingCase.beforeImage}
                            onChange={(e) => setEditingCase({ ...editingCase, beforeImage: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none font-mono"
                            placeholder="Paste image URL or use 'Add Image from Storage' above..."
                          />
                          {editingCase.beforeImage && (
                            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                              <img
                                src={editingCase.beforeImage}
                                alt="Before preview"
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as any).style.display = 'none'; }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* After Image with Storage Upload */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 block">Outcome (After) Image</label>
                          <label className="inline-flex items-center gap-1 text-[11px] font-bold text-[#003334] hover:text-[#c5a880] cursor-pointer bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors">
                            <Upload className="w-3 h-3 text-[#c5a880]" />
                            <span>Add Image from Storage</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleBeforeAfterPhotoUpload(file, 'after', editingCase.title || formData.title, (url) => {
                                    setEditingCase((prev) => prev ? { ...prev, afterImage: url } : null);
                                  });
                                }
                                e.target.value = '';
                              }}
                            />
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingCase.afterImage}
                            onChange={(e) => setEditingCase({ ...editingCase, afterImage: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none font-mono"
                            placeholder="Paste image URL or use 'Add Image from Storage' above..."
                          />
                          {editingCase.afterImage && (
                            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                              <img
                                src={editingCase.afterImage}
                                alt="After preview"
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as any).style.display = 'none'; }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="pt-3 border-t border-slate-150 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCaseModalOpen(false);
                          setEditingCase(null);
                        }}
                        className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveCase}
                        className="px-5 py-2 bg-[#003334] hover:bg-[#002526] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        Save Case
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 5: CLINICAL GALLERY IMAGES WITH MULTIPLE ADDS */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h5 className="text-xs font-extrabold text-[#003334] uppercase tracking-wider flex items-center gap-2 border-b border-slate-150 pb-3">
              <ImageIcon className="h-4.5 w-4.5 text-[#c5a880] shrink-0" />
              <span>5. Detailed Clinical Media Portfolio Gallery</span>
            </h5>
            <p className="text-[11px] text-slate-400 -mt-2">Dynamically append more microscopic, anatomical, or treatment session image URLs to the service detail page.</p>
            
            <div className="space-y-4 pt-1">
              {/* Image insertion tool */}
              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h6 className="text-[11px] font-extrabold text-[#003334] uppercase tracking-wider">Append Reference Images</h6>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 hover:border-[#c5a880] text-[#003334] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs">
                    <FolderOpen className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>Add Image from Storage</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (!files.length || !formData) return;
                        files.forEach((file) => {
                          handleFileUpload(file, (url) => {
                            setFormData((prev) => {
                              if (!prev) return prev;
                              const currentImages = [...(prev.additionalImages || [])];
                              currentImages.push(url);
                              return { ...prev, additionalImages: currentImages };
                            });
                          });
                        });
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    placeholder="Or paste online image URL here..."
                    className="w-full px-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#003334] outline-none font-sans bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddAdditionalImage}
                    className="px-4 py-2 bg-[#003334] hover:bg-[#c5a880] text-white hover:text-[#003334] text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add URL</span>
                  </button>
                </div>
              </div>

              {/* Render existing images list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(formData.additionalImages || []).map((imgUrl, index) => (
                  <div 
                    key={index} 
                    className="bg-white border border-slate-200 p-3 rounded-2xl relative shadow-xs flex flex-col justify-between space-y-3 group"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                      <img 
                        src={imgUrl} 
                        alt={`Preview Reference #${index + 1}`} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                        onError={(e) => { 
                          (e.target as any).src = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800'; 
                        }} 
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAdditionalImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-white/95 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-full border border-slate-150 transition-all shadow-sm"
                        title="Delete image URL"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    
                    {/* Editable image URL text box */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400">REFERENCE DETAIL #{index + 1}</span>
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => handleUpdateAdditionalImage(index, e.target.value)}
                        className="w-full px-2.5 py-1 text-[10px] border border-slate-150 rounded-lg focus:ring-1 focus:ring-[#003334] outline-none font-mono text-slate-500 bg-slate-50/50"
                      />
                    </div>
                  </div>
                ))}

                {(!formData.additionalImages || formData.additionalImages.length === 0) && (
                  <div className="sm:col-span-2 md:col-span-3 text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs italic">
                    No custom portfolio gallery images added yet. Append clean image URLs above.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 6: TARGET CONCERNS ARRAY COMPONENT */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <h5 className="text-xs font-extrabold text-[#003334] uppercase tracking-wider flex items-center gap-2">
                <Heart className="h-4.5 w-4.5 text-[#c5a880] shrink-0" />
                <span>6. Dynamic Target Concerns / Indications</span>
              </h5>
              <button
                type="button"
                onClick={() => addListElement('concerns')}
                className="px-2.5 py-1 text-[10px] font-bold text-white bg-[#003334] hover:bg-[#c5a880] hover:text-[#003334] rounded-lg flex items-center gap-1 transition-all shadow-sm"
              >
                <Plus className="h-3 w-3" />
                <span>Add Indication</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 -mt-2">Outline the direct visual skin concerns or laxities that this protocol biomechanically resolves.</p>
            
            <div className="space-y-2 pt-1">
              {formData.concerns.map((concern, index) => (
                <div key={index} className="flex gap-2 items-center animate-fadeIn">
                  <span className="text-[10px] font-mono text-slate-400 font-bold w-5">{index + 1}.</span>
                  <input
                    type="text"
                    value={concern}
                    onChange={(e) => handleListElementChange('concerns', index, e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#003334] outline-none bg-white"
                    placeholder="e.g. Fine lines and superficial skin laxity"
                  />
                  <button
                    type="button"
                    onClick={() => removeListElement('concerns', index)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}
              {formData.concerns.length === 0 && (
                <p className="text-[10px] text-slate-400 text-center italic py-2">No items listed. Click Add Indication to create one.</p>
              )}
            </div>
          </div>

          {/* SECTION 7: CLINICAL INSTRUCTIONS ARRAYS (PRE-CARE & POST-CARE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PRE-CARE */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                <h5 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-4.5 w-4.5 text-[#c5a880] shrink-0" />
                  <span>Pre-Care Guidelines</span>
                </h5>
                <button
                  type="button"
                  onClick={() => addListElement('preCare')}
                  className="px-2.5 py-1 text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center gap-1 transition-all border border-amber-200"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Line</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 -mt-2">What steps the patient must fulfill prior to session delivery.</p>

              <div className="space-y-2 pt-1">
                {formData.preCare.map((instruction, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-[10px] font-mono text-amber-700/60 font-bold w-5">{index + 1}.</span>
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) => handleListElementChange('preCare', index, e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-amber-200/50 rounded-lg focus:ring-1 focus:ring-amber-500 outline-none bg-white text-slate-800"
                      placeholder="e.g. Avoid blood-thinners 5 days prior."
                    />
                    <button
                      type="button"
                      onClick={() => removeListElement('preCare', index)}
                      className="p-2 text-amber-600/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Remove item"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
                {formData.preCare.length === 0 && (
                  <p className="text-[10px] text-slate-400 text-center italic py-2">No pre-care parameters defined.</p>
                )}
              </div>
            </div>

            {/* POST-CARE */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                <h5 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span>Post-Care Recovery Protocols</span>
                </h5>
                <button
                  type="button"
                  onClick={() => addListElement('postCare')}
                  className="px-2.5 py-1 text-[10px] font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-1 transition-all border border-emerald-200"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Line</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 -mt-2">Mandatory healing guidelines for patients to achieve secure dermal outcomes.</p>

              <div className="space-y-2 pt-1">
                {formData.postCare.map((instruction, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-[10px] font-mono text-emerald-700/60 font-bold w-5">{index + 1}.</span>
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) => handleListElementChange('postCare', index, e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-emerald-200/50 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800"
                      placeholder="e.g. Wear mineral sunscreen (SPF 50+)."
                    />
                    <button
                      type="button"
                      onClick={() => removeListElement('postCare', index)}
                      className="p-2 text-emerald-600/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Remove item"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
                {formData.postCare.length === 0 && (
                  <p className="text-[10px] text-slate-400 text-center italic py-2">No post-care guidelines defined.</p>
                )}
              </div>
            </div>

          </div>

          {/* Master bottom save panel */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
            <span className="text-xs text-slate-500 font-serif italic">Be sure to save your work before switching to another treatment.</span>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-3 text-xs font-bold text-white bg-[#003334] hover:bg-[#c5a880] rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:text-[#003334]"
            >
              <Save className="h-4 w-4 text-[#c5a880]" />
              <span>Save All Components Details</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
