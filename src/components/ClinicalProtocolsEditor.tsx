import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  RefreshCw, 
  Layers, 
  Sparkles, 
  Clock, 
  Tag, 
  ChevronRight,
  ExternalLink,
  Eye,
  Sliders,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Copy,
  Image as ImageIcon,
  Search,
  X,
  FolderPlus,
  ArrowUpDown,
  Filter,
  Upload,
  Link2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getClinicalProtocolsConfig, 
  saveClinicalProtocolsConfig, 
  getClinicalProtocolByTreatmentId, 
  saveClinicalProtocolForTreatment, 
  resetClinicalProtocolsToDefault,
  getTreatmentPricingData,
  uploadAssetFile
} from '../lib/adminStore';
import { ClinicalProtocolsConfig, TreatmentProtocolGroup, ProtocolStepItem } from '../types';
import ClinicalProtocolModal, { CLINICAL_PRESETS, PresetIconItem } from './ClinicalProtocolModal';
import { 
  FaceCleansingIcon, 
  SheetMaskIcon, 
  RadianceGlowIcon, 
  FacialMappingIcon, 
  MicroDropletInfusionIcon, 
  ContourLiftIcon, 
  BioShieldSealingIcon 
} from './icons/ClinicalProtocolIcons';
import { PRICING_CATEGORIES, PricingCategory, TreatmentCategory } from '../data/treatmentPricing';
import { CLINICAL_AREAS_DB, CategoryItem, findTreatmentInDB } from '../data/clinicalTreatments';

const OFFICIAL_TREATMENT_CATEGORIES: TreatmentCategory[] = PRICING_CATEGORIES.filter(
  (c): c is TreatmentCategory => c !== 'All Procedures'
);

/**
 * Returns the official CLINICAL_AREAS_DB sub-branches for a selected PRICING_CATEGORIES item.
 */
function getBranchesForCategory(category: PricingCategory): CategoryItem[] {
  if (category === 'All Procedures') return [];

  if (category === 'IV Drip Lounge & Wellness') {
    for (const area of CLINICAL_AREAS_DB) {
      const ivBranch = area.categories.find((c) => c.id === 'iv-lounge-prp');
      if (ivBranch) return [ivBranch];
    }
    return [];
  }

  const matchedArea = CLINICAL_AREAS_DB.find(
    (area) => area.name.toLowerCase() === category.toLowerCase()
  );
  if (!matchedArea) return [];

  if (category === 'Hair & Beauty') {
    return matchedArea.categories.filter((c) => c.id !== 'iv-lounge-prp');
  }

  return matchedArea.categories;
}

interface UnifiedProtocolCatalogEntry {
  group: TreatmentProtocolGroup;
  isCustom: boolean;
  inheritanceLabel: 'Custom' | 'Branch' | 'Default';
}

/**
 * Infers the best matching CLINICAL_AREAS_DB branch for a pricing catalog item
 * when its ID is not directly listed in CLINICAL_AREAS_DB.
 */
function inferBranchForPricingItem(
  id: string,
  title: string,
  category: string
): { branchId: string; branchName: string } {
  const dbHit = findTreatmentInDB(id);
  if (dbHit) {
    return { branchId: dbHit.category.id, branchName: dbHit.category.name };
  }

  const text = `${id} ${title}`.toLowerCase();
  const cat = (category || '').toLowerCase();

  if (cat.includes('iv drip') || text.includes('iv-') || text.includes('drip') || text.includes('nad+')) {
    return { branchId: 'iv-lounge-prp', branchName: 'IV Drip Lounge & PRP Regenerative' };
  }

  if (cat.includes('body')) {
    if (
      text.includes('aqualyx') ||
      text.includes('deso') ||
      text.includes('lemon') ||
      text.includes('dissolv') ||
      text.includes('lipolysis')
    ) {
      return {
        branchId: 'fat-dissolving',
        branchName: 'Fat Dissolving Injections (Aqualyx & Deso)'
      };
    }
    return { branchId: 'body-contouring', branchName: 'Body Contouring & Fat Loss' };
  }

  if (cat.includes('advanced facial')) {
    if (text.includes('special') || text.includes('monday') || text.includes('friday') || text.includes('light') || text.includes('led')) {
      return {
        branchId: 'specials-light',
        branchName: 'Monday & Friday Specials & Light Therapy'
      };
    }
    return { branchId: 'medical-facials', branchName: 'Clinical & Medical Facials' };
  }

  if (cat.includes('hair')) {
    if (text.includes('laser-hair') || text.includes('soprano') || text.includes('diode') || text.includes('hair-removal')) {
      return { branchId: 'laser-hair-removal', branchName: 'Laser Hair Removal' };
    }
    if (text.includes('lash') || text.includes('brow') || text.includes('spmu') || text.includes('microblad') || text.includes('blush')) {
      return { branchId: 'lashes-brows-spmu', branchName: 'Lashes, Brows & SPMU' };
    }
    return { branchId: 'hair-salon', branchName: 'Hair Salon & Trichology' };
  }

  // Default: Face & Injectables branches
  if (
    text.includes('botox') ||
    text.includes('anti-wrinkle') ||
    text.includes('masseter') ||
    text.includes('hyperhidrosis') ||
    text.includes('nefertiti') ||
    text.includes('frown') ||
    text.includes('forehead') ||
    text.includes('crows-feet') ||
    text.includes('bunny-lines') ||
    text.includes('gummy-smile')
  ) {
    return { branchId: 'anti-wrinkle', branchName: 'Anti-Wrinkle Injections (Botox)' };
  }

  if (
    text.includes('profhilo') ||
    text.includes('polynucleotide') ||
    text.includes('salmon') ||
    text.includes('seventy-hyal') ||
    text.includes('jalupro') ||
    text.includes('lumi-eyes') ||
    text.includes('booster') ||
    text.includes('bioremodel')
  ) {
    return { branchId: 'skin-boosters', branchName: 'Skin Boosters & Bioremodeling' };
  }

  if (
    text.includes('morpheus') ||
    text.includes('ultherapy') ||
    text.includes('hifu') ||
    text.includes('blepharoplasty') ||
    text.includes('plasma') ||
    text.includes('endolift') ||
    text.includes('rf-') ||
    text.includes('lifting') ||
    text.includes('laser')
  ) {
    return { branchId: 'high-tech-lifting', branchName: 'High-Tech Lifting & Laser' };
  }

  return { branchId: 'dermal-fillers', branchName: 'Dermal Fillers (1ml)' };
}

/**
 * Merges config.protocols, CLINICAL_AREAS_DB, and getTreatmentPricingData() into a single
 * unified catalog so every treatment across the 5 categories & 12 branches can be selected and customized.
 */
function buildUnifiedProtocolCatalog(config: ClinicalProtocolsConfig): UnifiedProtocolCatalogEntry[] {
  const catalogMap = new Map<string, UnifiedProtocolCatalogEntry>();

  // 1. Seed all explicitly configured custom protocols first
  for (const [rawKey, group] of Object.entries(config.protocols)) {
    if (!group || typeof group !== 'object') continue;
    const id = (group.id || rawKey).toLowerCase().trim();
    const inferred =
      group.branchId && group.branchName
        ? { branchId: group.branchId, branchName: group.branchName }
        : inferBranchForPricingItem(id, group.name || id, group.category || 'Face & Injectables');

    catalogMap.set(id, {
      group: {
        ...group,
        id,
        branchId: group.branchId || inferred.branchId,
        branchName: group.branchName || inferred.branchName
      },
      isCustom: true,
      inheritanceLabel: 'Custom'
    });
  }

  // 2. Merge all treatments from CLINICAL_AREAS_DB across all 4 areas & 12 branches
  for (const area of CLINICAL_AREAS_DB) {
    for (const branch of area.categories) {
      const officialCategory =
        branch.id === 'iv-lounge-prp' ? 'IV Drip Lounge & Wellness' : area.name;

      for (const item of branch.items) {
        const id = item.id.toLowerCase().trim();
        const existing = catalogMap.get(id);
        if (existing) {
          existing.group = {
            ...existing.group,
            category: existing.group.category || officialCategory,
            branchId: existing.group.branchId || branch.id,
            branchName: existing.group.branchName || branch.name
          };
          continue;
        }

        const resolved = getClinicalProtocolByTreatmentId(id);
        const isDefaultSteps = resolved.steps === config.defaultSteps;

        catalogMap.set(id, {
          group: {
            ...resolved,
            id,
            name: item.name,
            subtitle: item.desc || resolved.subtitle || `${branch.name} • Clinical Procedure`,
            category: officialCategory,
            branchId: branch.id,
            branchName: branch.name,
            steps: resolved.steps?.length ? resolved.steps : config.defaultSteps
          },
          isCustom: false,
          inheritanceLabel: isDefaultSteps ? 'Default' : 'Branch'
        });
      }
    }
  }

  // 3. Merge all treatments from getTreatmentPricingData()
  const pricingCatalog = getTreatmentPricingData();
  for (const pricingItem of pricingCatalog) {
    if (!pricingItem || !pricingItem.id) continue;
    const id = pricingItem.id.toLowerCase().trim();
    const existing = catalogMap.get(id);
    const inferred = inferBranchForPricingItem(id, pricingItem.title, pricingItem.category);

    if (existing) {
      existing.group = {
        ...existing.group,
        category: existing.group.category || pricingItem.category,
        branchId: existing.group.branchId || inferred.branchId,
        branchName: existing.group.branchName || inferred.branchName
      };
      continue;
    }

    const resolved = getClinicalProtocolByTreatmentId(id);
    const isDefaultSteps = resolved.steps === config.defaultSteps;

    catalogMap.set(id, {
      group: {
        ...resolved,
        id,
        name: pricingItem.title,
        subtitle:
          pricingItem.description ||
          resolved.subtitle ||
          `${inferred.branchName} • Clinical Procedure`,
        category: pricingItem.category,
        branchId: resolved.branchId || inferred.branchId,
        branchName: resolved.branchName || inferred.branchName,
        steps: resolved.steps?.length ? resolved.steps : config.defaultSteps
      },
      isCustom: false,
      inheritanceLabel: isDefaultSteps ? 'Default' : 'Branch'
    });
  }

  // Sort so Custom Protocols appear first, then alphabetically/catalog order
  return Array.from(catalogMap.values()).sort((a, b) => {
    if (a.isCustom !== b.isCustom) {
      return a.isCustom ? -1 : 1;
    }
    return 0;
  });
}

export default function ClinicalProtocolsEditor() {
  const [config, setConfig] = useState<ClinicalProtocolsConfig | null>(null);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>('exosome');
  
  // Search, Category & Sub-Branch Filtering connected to PRICING_CATEGORIES & CLINICAL_AREAS_DB
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<PricingCategory>('All Procedures');
  const [activeBranchId, setActiveBranchId] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<ProtocolStepItem | null>(null);
  const [nextStepNumber, setNextStepNumber] = useState<number>(1);

  // Quick Change Image Modal state
  const [imageSwapStep, setImageSwapStep] = useState<ProtocolStepItem | null>(null);
  const [quickImageTab, setQuickImageTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [quickImageUrl, setQuickImageUrl] = useState('');
  const [isQuickUploading, setIsQuickUploading] = useState(false);
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  // Add / Edit Treatment Protocol Modal state
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isEditingGroupMetadata, setIsEditingGroupMetadata] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupId, setNewGroupId] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState<TreatmentCategory>('Face & Injectables');
  const [newGroupBranchId, setNewGroupBranchId] = useState<string>('anti-wrinkle');
  const [newGroupSubtitle, setNewGroupSubtitle] = useState('');
  const [addGroupError, setAddGroupError] = useState<string | null>(null);

  // Kebab Menu Active Dropdown State
  const [activeMenuStepId, setActiveMenuStepId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Feedback & Preview
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // Close kebab menu on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuStepId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Load config on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    const loaded = getClinicalProtocolsConfig();
    setConfig(loaded);
  };

  if (!config) return null;

  // Build unified catalog from config.protocols + CLINICAL_AREAS_DB + getTreatmentPricingData()
  const unifiedCatalog = buildUnifiedProtocolCatalog(config);
  const selectedCatalogEntry = unifiedCatalog.find(
    (entry) => entry.group.id === selectedTreatmentId.toLowerCase().trim()
  );

  const currentGroup: TreatmentProtocolGroup =
    selectedCatalogEntry?.group ||
    config.protocols[selectedTreatmentId] ||
    getClinicalProtocolByTreatmentId(selectedTreatmentId);

  const isCurrentGroupCustom = Boolean(
    config.protocols[selectedTreatmentId.toLowerCase().trim()]
  );

  // Official category + branch matching
  const availableBranches = getBranchesForCategory(activeCategory);

  const matchesCategoryAndBranch = (
    group: TreatmentProtocolGroup,
    cat: PricingCategory,
    branchId: string
  ): boolean => {
    if (cat !== 'All Procedures') {
      const groupCategory = (group.category || '').trim();
      if (groupCategory.toLowerCase() !== cat.toLowerCase()) {
        return false;
      }
    }

    if (branchId !== 'all') {
      if ((group.branchId || '').toLowerCase() !== branchId.toLowerCase()) {
        return false;
      }
    }

    return true;
  };

  // Filtered Unified Entries based on official category, sub-branch & search term
  const filteredEntries = unifiedCatalog.filter(({ group, inheritanceLabel }) => {
    if (!matchesCategoryAndBranch(group, activeCategory, activeBranchId)) {
      return false;
    }

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const matchesName = group.name.toLowerCase().includes(term);
    const matchesSub = (group.subtitle || '').toLowerCase().includes(term);
    const matchesId = group.id.toLowerCase().includes(term);
    const matchesCategoryName = (group.category || '').toLowerCase().includes(term);
    const matchesBranchName = (group.branchName || '').toLowerCase().includes(term);
    const matchesStatus = inheritanceLabel.toLowerCase().includes(term);
    const matchesStep = group.steps?.some(s => 
      s.title.toLowerCase().includes(term) || 
      s.description.toLowerCase().includes(term)
    );

    return (
      matchesName ||
      matchesSub ||
      matchesId ||
      matchesCategoryName ||
      matchesBranchName ||
      matchesStatus ||
      matchesStep
    );
  });

  const customCountInFilter = filteredEntries.filter((e) => e.isCustom).length;
  const inheritedCountInFilter = filteredEntries.length - customCountInFilter;

  // One-click promote inherited protocol into a dedicated Custom Protocol
  const handleCustomizeInheritedProtocol = () => {
    const clonedSteps: ProtocolStepItem[] = (currentGroup.steps || []).map((s, idx) => ({
      ...s,
      id: `${currentGroup.id}-step-${idx + 1}-${Date.now().toString(36)}`,
      stepNumber: idx + 1
    }));

    const promotedGroup: TreatmentProtocolGroup = {
      ...currentGroup,
      id: currentGroup.id.toLowerCase().trim(),
      steps: clonedSteps,
      updatedAt: new Date().toISOString()
    };

    saveClinicalProtocolForTreatment(promotedGroup.id, promotedGroup);
    loadConfig();
    setSaveSuccess(
      `Activated dedicated Custom Protocol for "${promotedGroup.name}" (${clonedSteps.length} steps ready to edit)`
    );
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Switch treatment handler
  const handleSelectTreatment = (id: string) => {
    setSelectedTreatmentId(id);
    setActiveMenuStepId(null);
  };

  // Open modal for editing existing step (Task 3: Kebab - Edit Step)
  const handleEditStep = (step: ProtocolStepItem) => {
    setActiveMenuStepId(null);
    setEditingStep(step);
    setIsModalOpen(true);
  };

  // Open modal for adding new step (Task 3: Add Step)
  const handleAddStep = () => {
    setActiveMenuStepId(null);
    setEditingStep(null);
    setNextStepNumber((currentGroup.steps?.length || 0) + 1);
    setIsModalOpen(true);
  };

  // Open quick image swap modal (Task 3: Kebab - Change Image)
  const handleOpenChangeImage = (step: ProtocolStepItem) => {
    setActiveMenuStepId(null);
    setImageSwapStep(step);
    setQuickImageUrl(step.image?.startsWith('http') ? step.image : '');
    setQuickImageTab(
      CLINICAL_PRESETS.some(p => p.src === step.image) ? 'presets' : 
      step.image?.startsWith('http') ? 'url' : 'upload'
    );
  };

  // Quick swap image apply
  const handleApplyQuickImage = (newImageSrc: string) => {
    if (!imageSwapStep || !newImageSrc) return;
    const updatedSteps = currentGroup.steps.map(s => 
      s.id === imageSwapStep.id ? { ...s, image: newImageSrc } : s
    );

    const updatedGroup: TreatmentProtocolGroup = {
      ...currentGroup,
      steps: updatedSteps,
      updatedAt: new Date().toISOString()
    };

    saveClinicalProtocolForTreatment(selectedTreatmentId, updatedGroup);
    loadConfig();
    setImageSwapStep(null);
    setSaveSuccess(`Updated visual icon for "${imageSwapStep.title}"`);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Duplicate step handler (Task 3: Kebab - Duplicate)
  const handleDuplicateStep = (step: ProtocolStepItem) => {
    setActiveMenuStepId(null);
    const index = currentGroup.steps.findIndex(s => s.id === step.id);
    if (index === -1) return;

    const clonedStep: ProtocolStepItem = {
      ...step,
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: `${step.title} (Copy)`,
      stepNumber: step.stepNumber + 1
    };

    const newSteps = [...currentGroup.steps];
    newSteps.splice(index + 1, 0, clonedStep);

    // Re-index step numbers sequentially
    const sequentialSteps = newSteps.map((s, idx) => ({
      ...s,
      stepNumber: idx + 1
    }));

    const updatedGroup: TreatmentProtocolGroup = {
      ...currentGroup,
      steps: sequentialSteps,
      updatedAt: new Date().toISOString()
    };

    saveClinicalProtocolForTreatment(selectedTreatmentId, updatedGroup);
    loadConfig();

    setSaveSuccess(`Duplicated "${step.title}" successfully`);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Move step up or down (Task 3: Kebab - Move Up / Move Down)
  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    setActiveMenuStepId(null);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentGroup.steps.length) return;

    const newSteps = [...currentGroup.steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;

    // Recalculate step numbers
    const updatedSteps = newSteps.map((s, idx) => ({
      ...s,
      stepNumber: idx + 1
    }));

    const updatedGroup: TreatmentProtocolGroup = {
      ...currentGroup,
      steps: updatedSteps,
      updatedAt: new Date().toISOString()
    };

    saveClinicalProtocolForTreatment(selectedTreatmentId, updatedGroup);
    loadConfig();
  };

  // Delete step handler (Task 3: Kebab - Delete)
  const handleDeleteStep = (stepId: string) => {
    setActiveMenuStepId(null);
    const stepToDelete = currentGroup.steps.find(s => s.id === stepId);
    const stepName = stepToDelete ? `"${stepToDelete.title}"` : 'this step';

    if (!confirm(`Are you sure you want to delete ${stepName}?`)) return;

    const updatedSteps = currentGroup.steps
      .filter(s => s.id !== stepId)
      .map((s, idx) => ({ ...s, stepNumber: idx + 1 }));

    const updatedGroup: TreatmentProtocolGroup = {
      ...currentGroup,
      steps: updatedSteps,
      updatedAt: new Date().toISOString()
    };

    saveClinicalProtocolForTreatment(selectedTreatmentId, updatedGroup);
    loadConfig();

    setSaveSuccess('Protocol step removed');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  // Save step from modal
  const handleSaveStep = (savedStep: ProtocolStepItem) => {
    const existingIndex = currentGroup.steps.findIndex(s => s.id === savedStep.id);
    let updatedSteps: ProtocolStepItem[];

    if (existingIndex >= 0) {
      updatedSteps = [...currentGroup.steps];
      updatedSteps[existingIndex] = savedStep;
    } else {
      updatedSteps = [...currentGroup.steps, savedStep];
    }

    // Re-index step numbers sequentially
    updatedSteps = updatedSteps.map((s, idx) => ({
      ...s,
      stepNumber: idx + 1
    }));

    const updatedGroup: TreatmentProtocolGroup = {
      ...currentGroup,
      steps: updatedSteps,
      updatedAt: new Date().toISOString()
    };

    saveClinicalProtocolForTreatment(selectedTreatmentId, updatedGroup);
    loadConfig();

    setSaveSuccess(`Protocol step "${savedStep.title}" saved successfully`);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Open modal to create a brand-new treatment protocol group
  const handleOpenAddGroupModal = () => {
    const initialCat: TreatmentCategory =
      activeCategory !== 'All Procedures' ? activeCategory : 'Face & Injectables';
    const branchesForInitial = getBranchesForCategory(initialCat);
    const initialBranch =
      activeBranchId !== 'all' && branchesForInitial.some((b) => b.id === activeBranchId)
        ? activeBranchId
        : branchesForInitial[0]?.id || '';

    setIsEditingGroupMetadata(false);
    setNewGroupName('');
    setNewGroupId('');
    setNewGroupCategory(initialCat);
    setNewGroupBranchId(initialBranch);
    setNewGroupSubtitle('');
    setAddGroupError(null);
    setIsAddGroupModalOpen(true);
  };

  // Open modal to edit active treatment protocol's category, sub-branch, name & subtitle
  const handleOpenEditGroupModal = () => {
    const currentCat = OFFICIAL_TREATMENT_CATEGORIES.includes(
      currentGroup.category as TreatmentCategory
    )
      ? (currentGroup.category as TreatmentCategory)
      : 'Face & Injectables';
    const branchesForCurrent = getBranchesForCategory(currentCat);
    const currentBranch =
      currentGroup.branchId && branchesForCurrent.some((b) => b.id === currentGroup.branchId)
        ? currentGroup.branchId
        : branchesForCurrent[0]?.id || '';

    setIsEditingGroupMetadata(true);
    setNewGroupName(currentGroup.name || '');
    setNewGroupId(currentGroup.id || selectedTreatmentId);
    setNewGroupCategory(currentCat);
    setNewGroupBranchId(currentBranch);
    setNewGroupSubtitle(currentGroup.subtitle || '');
    setAddGroupError(null);
    setIsAddGroupModalOpen(true);
  };

  // Add or Update Treatment Protocol Group (Task 4: Official Categories & Branches)
  const handleCreateTreatmentGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      setAddGroupError('Treatment name is required.');
      return;
    }

    const slug = isEditingGroupMetadata
      ? currentGroup.id.toLowerCase().trim()
      : newGroupId.trim()
      ? newGroupId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-')
      : newGroupName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '');

    if (!slug) {
      setAddGroupError('A valid treatment identifier could not be generated.');
      return;
    }

    if (!isEditingGroupMetadata && config.protocols[slug]) {
      setAddGroupError(
        `A custom protocol with ID "${slug}" already exists. Select it from the bar or use a different identifier.`
      );
      return;
    }

    const modalBranches = getBranchesForCategory(newGroupCategory);
    const selectedBranchObj =
      modalBranches.find((b) => b.id === newGroupBranchId) || modalBranches[0];

    if (isEditingGroupMetadata) {
      const updatedGroup: TreatmentProtocolGroup = {
        ...currentGroup,
        id: slug,
        name: newGroupName.trim(),
        subtitle:
          newGroupSubtitle.trim() ||
          `${selectedBranchObj?.name || newGroupCategory} • Clinical Procedure`,
        category: newGroupCategory,
        branchId: selectedBranchObj?.id,
        branchName: selectedBranchObj?.name,
        updatedAt: new Date().toISOString()
      };

      saveClinicalProtocolForTreatment(slug, updatedGroup);
      loadConfig();
      setIsAddGroupModalOpen(false);
      setAddGroupError(null);
      setSaveSuccess(`Updated "${updatedGroup.name}" (${newGroupCategory} • ${selectedBranchObj?.name || 'Branch'})`);
      setTimeout(() => setSaveSuccess(null), 3500);
      return;
    }

    // Resolve branch template steps if available, otherwise 3 clinical steps
    const templateGroup = getClinicalProtocolByTreatmentId(slug);
    const initialSteps: ProtocolStepItem[] =
      templateGroup && Array.isArray(templateGroup.steps) && templateGroup.steps.length > 0
        ? templateGroup.steps.map((s, idx) => ({
            ...s,
            id: `${slug}-${idx + 1}`,
            stepNumber: idx + 1
          }))
        : [
            {
              id: `${slug}-1`,
              stepNumber: 1,
              title: 'Epidermal Clearing & Prep',
              description:
                'Meticulous purification of the skin barrier to clear cellular debris and prepare target tissue.',
              image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
              phaseTag: 'Phase 1 • 10 mins',
              duration: '10 mins',
              focusArea: 'Surface Stratum Corneum'
            },
            {
              id: `${slug}-2`,
              stepNumber: 2,
              title: 'Precision Micro-Channeling',
              description:
                'Calibrated delivery pathways opened to ensure maximum bio-absorption of active clinical agents.',
              image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
              phaseTag: 'Phase 2 • 20 mins',
              duration: '20 mins',
              focusArea: 'Upper Papillary Dermis'
            },
            {
              id: `${slug}-3`,
              stepNumber: 3,
              title: 'Bio-Cellular Finishing Seal',
              description:
                'Regenerative bioactive peptide veil applied to lock in active ingredients and calm treated skin.',
              image:
                '/assets/aistudio/Sheet_Face_Mask_Vector_Illustration_-_Graphics_by_Canva_a7a34ce5.jpg',
              phaseTag: 'Phase 3 • 15 mins',
              duration: '15 mins',
              focusArea: 'Lipid Moisture Barrier'
            }
          ];

    const newGroup: TreatmentProtocolGroup = {
      id: slug,
      name: newGroupName.trim(),
      subtitle:
        newGroupSubtitle.trim() ||
        `${selectedBranchObj?.name || newGroupCategory} • Custom Clinical Protocol`,
      category: newGroupCategory,
      branchId: selectedBranchObj?.id,
      branchName: selectedBranchObj?.name,
      updatedAt: new Date().toISOString(),
      steps: initialSteps
    };

    saveClinicalProtocolForTreatment(slug, newGroup);
    loadConfig();
    setSelectedTreatmentId(slug);
    setIsAddGroupModalOpen(false);
    setNewGroupName('');
    setNewGroupId('');
    setNewGroupSubtitle('');
    setAddGroupError(null);

    setSaveSuccess(
      `Created "${newGroup.name}" under ${newGroupCategory}${
        selectedBranchObj ? ` • ${selectedBranchObj.name}` : ''
      }`
    );
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Reset defaults handler
  const handleResetDefaults = () => {
    if (confirm('Restore default clinical protocols for all treatments? Any custom steps will be reset.')) {
      resetClinicalProtocolsToDefault();
      loadConfig();
      setSaveSuccess('Clinical protocols restored to default presets');
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  // Render Visual helper
  const renderVisual = (imgSrc: string, sizeClass = "w-12 h-12") => {
    if (!imgSrc) return null;

    if (imgSrc.startsWith('svg_preset:')) {
      const key = imgSrc.replace('svg_preset:', '');
      switch (key) {
        case 'facewash':
          return <FaceCleansingIcon className={`${sizeClass} text-[#c5a880]`} />;
        case 'sheetmask':
          return <SheetMaskIcon className={`${sizeClass} text-[#c5a880]`} />;
        case 'radiance':
          return <RadianceGlowIcon className={`${sizeClass} text-[#c5a880]`} />;
        case 'mapping':
          return <FacialMappingIcon className={`${sizeClass} text-[#c5a880]`} />;
        case 'infusion':
          return <MicroDropletInfusionIcon className={`${sizeClass} text-[#c5a880]`} />;
        case 'contour':
          return <ContourLiftIcon className={`${sizeClass} text-[#c5a880]`} />;
        case 'shield':
          return <BioShieldSealingIcon className={`${sizeClass} text-[#c5a880]`} />;
        default:
          return <RadianceGlowIcon className={`${sizeClass} text-[#c5a880]`} />;
      }
    }

    return (
      <img 
        src={imgSrc} 
        alt="Protocol step icon" 
        className={`${sizeClass} object-contain rounded-xl bg-white border border-slate-200/80 p-1 shadow-xs`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg';
        }}
      />
    );
  };

  const categories: PricingCategory[] = [...PRICING_CATEGORIES];

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* 1. TOP BANNER / WORKSPACE HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#9e7e56] bg-[#FAF9F5] px-2.5 py-0.5 rounded-full border border-[#c5a880]/40 font-mono">
                Admin Studio Workspace
              </span>
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-xs text-slate-500 font-medium">Clinical Protocol Timeline</span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#003334] tracking-wide">
              Clinical Protocols & Icons
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Configure image icons, clinical sequences, and concise descriptions directly reflected on patient treatment journey pages.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 min-h-[44px] cursor-pointer ${
                previewMode 
                  ? 'bg-[#c5a880]/15 text-[#003334] border-[#c5a880]/50 font-semibold shadow-xs' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>{previewMode ? 'Hide Preview' : 'Patient View'}</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors flex items-center gap-1.5 min-h-[44px] cursor-pointer"
              title="Reset all treatment protocols to default presets"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            {/* + Add Treatment Protocol Button */}
            <button
              onClick={handleOpenAddGroupModal}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#003334] bg-[#FAF9F5] hover:bg-[#c5a880]/10 border border-[#c5a880]/40 transition-all flex items-center gap-1.5 min-h-[44px] cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-[#c5a880]" />
              <span>+ Add Treatment Protocol</span>
            </button>

            {/* + Add Step Button */}
            <button
              onClick={handleAddStep}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-950 bg-gradient-to-r from-amber-200 via-[#c5a880] to-amber-300 hover:brightness-105 shadow-[0_4px_14px_rgba(197,168,128,0.3)] transition-all flex items-center gap-1.5 min-h-[44px] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add Step</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}
      </div>

      {/* 2. TREATMENT GROUP SELECTOR & SEARCH */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3.5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Official PRICING_CATEGORIES Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-[#c5a880]" /> Category:
            </span>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveBranchId('all');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[36px] cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#003334] text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Treatment Input */}
          <div className="relative min-w-[220px] lg:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search treatments or steps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#c5a880] rounded-xl pl-8.5 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Sub-Branch Filter Row (from CLINICAL_AREAS_DB) */}
        {activeCategory !== 'All Procedures' && availableBranches.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1.5 px-3 bg-[#FAF9F5] border border-[#c5a880]/25 rounded-xl">
            <span className="text-[10px] font-mono text-[#9e7e56] uppercase tracking-wider mr-1.5 flex items-center gap-1 shrink-0 font-bold">
              <Layers className="w-3 h-3 text-[#c5a880]" /> Branch:
            </span>
            <button
              onClick={() => setActiveBranchId('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all min-h-[30px] cursor-pointer whitespace-nowrap ${
                activeBranchId === 'all'
                  ? 'bg-[#c5a880] text-zinc-950 font-bold shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              All Branches
            </button>
            {availableBranches.map((branch) => {
              const isBranchActive = activeBranchId === branch.id;
              return (
                <button
                  key={branch.id}
                  onClick={() => setActiveBranchId(branch.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all min-h-[30px] cursor-pointer whitespace-nowrap ${
                    isBranchActive
                      ? 'bg-[#c5a880] text-zinc-950 font-bold shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  {branch.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Catalog Status Legend & Counter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[11px] text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono uppercase tracking-wider text-[10px] text-slate-400">
              Showing <strong className="text-[#003334]">{filteredEntries.length}</strong> procedures
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF9F5] border border-[#c5a880]/40 text-[#8a6d46] font-mono text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
              {customCountInFilter} Custom Protocol{customCountInFilter === 1 ? '' : 's'}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-mono text-[10px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              {inheritedCountInFilter} Inherited (Branch / Default)
            </span>
          </div>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Click any treatment chip to inspect or customize its clinical steps
          </span>
        </div>

        {/* Treatment Selector Horizontal Grid / Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
          {filteredEntries.length === 0 ? (
            <div className="py-2 text-xs text-slate-500 italic">
              No treatment protocols found
              {searchTerm ? ` matching "${searchTerm}"` : ''} in {activeCategory}
              {activeBranchId !== 'all'
                ? ` (${availableBranches.find((b) => b.id === activeBranchId)?.name || activeBranchId})`
                : ''}
              .
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All Procedures');
                  setActiveBranchId('all');
                }}
                className="ml-2 text-[#9e7e56] font-semibold hover:underline not-italic cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredEntries.map(({ group, isCustom, inheritanceLabel }) => {
              const isSelected = selectedTreatmentId.toLowerCase() === group.id.toLowerCase();
              return (
                <button
                  key={group.id}
                  onClick={() => handleSelectTreatment(group.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 shrink-0 min-h-[44px] cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF9F5] text-[#003334] border-2 border-[#c5a880] shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <span className="font-semibold">{group.name}</span>
                  {isCustom ? (
                    <span
                      title="Dedicated Custom Protocol configured"
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold inline-flex items-center gap-1 border ${
                        isSelected
                          ? 'bg-[#c5a880]/25 text-[#003334] border-[#c5a880]/60'
                          : 'bg-[#FAF9F5] text-[#8a6d46] border-[#c5a880]/40'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                      Custom • {group.steps?.length || 0}
                    </span>
                  ) : (
                    <span
                      title={`Inheriting ${inheritanceLabel} protocol steps — click to customize`}
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium inline-flex items-center gap-1 bg-slate-200/75 text-slate-600 border border-slate-300/70"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      {inheritanceLabel} • {group.steps?.length || 0}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 3. ACTIVE TREATMENT INFO HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h3 className="text-base font-serif font-bold text-[#003334] flex items-center gap-2 flex-wrap">
            <span>{currentGroup.name}</span>
            <span className="text-[11px] font-mono font-semibold text-[#9e7e56] bg-[#FAF9F5] px-2.5 py-0.5 rounded-md border border-[#c5a880]/40">
              {currentGroup.category || 'Clinical Treatment'}
            </span>
            {currentGroup.branchName && (
              <span className="text-[11px] font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                {currentGroup.branchName}
              </span>
            )}
            {isCurrentGroupCustom ? (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8a6d46] bg-[#c5a880]/20 px-2.5 py-0.5 rounded-full border border-[#c5a880]/50 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#9e7e56]" /> Custom Protocol
              </span>
            ) : (
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300 inline-flex items-center gap-1">
                Inherited ({selectedCatalogEntry?.inheritanceLabel || 'Branch'} Steps)
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            {currentGroup.subtitle || 'Sequential patient protocol steps with calibrated image icons.'}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleOpenEditGroupModal}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Edit treatment protocol category, sub-branch, name, or subtitle"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Edit Category &amp; Info</span>
          </button>
          {!isCurrentGroupCustom && (
            <button
              onClick={handleCustomizeInheritedProtocol}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#003334] bg-[#FAF9F5] hover:bg-[#c5a880]/20 border border-[#c5a880]/50 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Create a dedicated custom protocol for this treatment"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Customize Protocol</span>
            </button>
          )}
          <span>Protocol Sequence: <strong className="text-[#003334]">{currentGroup.steps?.length || 0} Steps</strong></span>
          <button
            onClick={handleAddStep}
            className="text-xs text-[#9e7e56] hover:text-[#003334] flex items-center gap-1 font-semibold cursor-pointer underline-offset-4 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Add Step
          </button>
        </div>
      </div>

      {/* 4. LIVE PATIENT JOURNEY PREVIEW (TOGGLEABLE) */}
      {previewMode && (
        <div className="bg-[#FAF9F5] border border-amber-200/50 rounded-3xl p-6 md:p-8 shadow-inner space-y-6 animate-fadeIn">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-black tracking-[0.25em] text-[#c5a880] uppercase block font-mono">
              Live Patient Journey Preview
            </span>
            <h4 className="text-lg md:text-xl font-serif font-bold text-zinc-900">
              The Clinical Protocol
            </h4>
            <p className="text-xs text-zinc-600 max-w-md mx-auto">
              Step-by-step aesthetic sequence as displayed on customer-facing pages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {currentGroup.steps.map((step, idx) => (
              <div 
                key={step.id || idx}
                className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm flex flex-col items-center text-center space-y-3"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-800">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-center">
                  {renderVisual(step.image, "w-16 h-16")}
                </div>

                <div className="space-y-1">
                  <h5 className="text-sm font-bold font-serif text-zinc-900">
                    {step.title}
                  </h5>
                  <p className="text-xs text-zinc-600 line-clamp-3">
                    {step.description}
                  </p>
                </div>

                {(step.phaseTag || step.duration) && (
                  <div className="pt-2 flex items-center gap-1 text-[10px] text-[#c5a880] font-medium">
                    <span>{step.phaseTag || step.duration}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MINIMALIST PROTOCOL STEPS CARD GRID */}
      {(!currentGroup.steps || currentGroup.steps.length === 0) ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FAF9F5] text-[#c5a880] border border-[#c5a880]/30 mx-auto flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <p className="text-sm font-serif font-bold text-[#003334]">No protocol steps defined yet</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add step 1 to configure the clinical preparation and aesthetic icon for this treatment.
          </p>
          <button
            onClick={handleAddStep}
            className="mt-2 px-4 py-2 bg-[#c5a880] text-zinc-950 rounded-xl text-xs font-semibold hover:bg-amber-300 transition-colors inline-flex items-center gap-1.5 min-h-[44px] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Step</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {currentGroup.steps.map((step, index) => {
            const isFirst = index === 0;
            const isLast = index === currentGroup.steps.length - 1;
            const isMenuOpen = activeMenuStepId === step.id;

            return (
              <div
                key={step.id || index}
                className="bg-white border border-slate-200 hover:border-[#c5a880]/60 rounded-2xl p-4.5 transition-all shadow-sm hover:shadow-md flex flex-col justify-between relative group"
              >
                <div>
                  {/* Card Header: Step Badge, Title & Kebab Menu */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#FAF9F5] border border-[#c5a880]/30 flex items-center justify-center text-[#003334] font-mono text-xs font-bold shrink-0">
                        {String(step.stepNumber || index + 1).padStart(2, '0')}
                      </div>
                      <h4 className="text-sm font-serif font-bold text-[#003334] truncate tracking-wide">
                        {step.title}
                      </h4>
                    </div>

                    {/* KEBAB DROPDOWN MENU */}
                    <div className="relative shrink-0" ref={isMenuOpen ? menuRef : undefined}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuStepId(isMenuOpen ? null : step.id);
                        }}
                        className={`p-2 rounded-xl text-slate-400 hover:text-[#003334] hover:bg-slate-100 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer ${
                          isMenuOpen ? 'bg-slate-100 text-[#003334]' : ''
                        }`}
                        title="Step Options"
                        aria-label="Step options menu"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu Popup */}
                      {isMenuOpen && (
                        <div 
                          className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-40 text-xs animate-fadeIn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Option 1: Edit Step */}
                          <button
                            type="button"
                            onClick={() => handleEditStep(step)}
                            className="w-full px-3 py-2 text-left text-slate-700 hover:text-[#003334] hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#c5a880]" />
                            <span>Edit Step</span>
                          </button>

                          {/* Option 2: Change Image */}
                          <button
                            type="button"
                            onClick={() => handleOpenChangeImage(step)}
                            className="w-full px-3 py-2 text-left text-slate-700 hover:text-[#003334] hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                            <span>Change Image</span>
                          </button>

                          {/* Option 3: Duplicate */}
                          <button
                            type="button"
                            onClick={() => handleDuplicateStep(step)}
                            className="w-full px-3 py-2 text-left text-slate-700 hover:text-[#003334] hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                          >
                            <Copy className="w-3.5 h-3.5 text-teal-600" />
                            <span>Duplicate</span>
                          </button>

                          <div className="h-px bg-slate-100 my-1" />

                          {/* Option 4: Move Up */}
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => handleMoveStep(index, 'up')}
                            className="w-full px-3 py-2 text-left text-slate-700 hover:text-[#003334] hover:bg-slate-50 disabled:opacity-35 disabled:pointer-events-none flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                          >
                            <ArrowUp className="w-3.5 h-3.5 text-slate-400" />
                            <span>Move Up</span>
                          </button>

                          {/* Option 4: Move Down */}
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => handleMoveStep(index, 'down')}
                            className="w-full px-3 py-2 text-left text-slate-700 hover:text-[#003334] hover:bg-slate-50 disabled:opacity-35 disabled:pointer-events-none flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                            <span>Move Down</span>
                          </button>

                          <div className="h-px bg-slate-100 my-1" />

                          {/* Option 5: Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteStep(step.id)}
                            className="w-full px-3 py-2 text-left text-rose-600 hover:text-rose-700 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visual Image / Thumbnail Frame with Quick Swap Trigger */}
                  <div className="my-3 flex items-center justify-center p-3 bg-[#FAF9F5] rounded-xl border border-slate-100 relative group/img">
                    <div className="w-16 h-16 flex items-center justify-center">
                      {renderVisual(step.image, "w-16 h-16")}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenChangeImage(step)}
                      className="absolute inset-0 bg-[#003334]/80 opacity-0 group-hover/img:opacity-100 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-semibold text-white transition-opacity backdrop-blur-xs cursor-pointer"
                      title="Quick Swap Image Icon"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>Change Icon</span>
                    </button>
                  </div>

                  {/* Description Summary (kept clean and brief) */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">
                    {step.description || 'No description provided.'}
                  </p>
                </div>

                {/* Footer Badges & Quick Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    {step.phaseTag && (
                      <span className="text-[10px] font-mono bg-[#FAF9F5] text-[#9e7e56] border border-[#c5a880]/30 px-2 py-0.5 rounded-md truncate font-medium">
                        {step.phaseTag}
                      </span>
                    )}
                    {step.duration && !step.phaseTag?.includes(step.duration) && (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-[#c5a880]" />
                        {step.duration}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleEditStep(step)}
                    className="text-[11px] font-semibold text-[#003334] hover:text-[#9e7e56] px-2.5 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#c5a880]/15 border border-[#c5a880]/30 transition-colors cursor-pointer shrink-0"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}

          {/* Minimalist Card-Grid Add Step Placeholder */}
          <button
            type="button"
            onClick={handleAddStep}
            className="border-2 border-dashed border-slate-300 hover:border-[#c5a880] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-[#003334] transition-all min-h-[220px] bg-[#FAF9F5]/60 hover:bg-[#FAF9F5] cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 group-hover:border-[#c5a880]/40 group-hover:bg-[#c5a880]/15 text-[#c5a880] flex items-center justify-center transition-colors shadow-2xs">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">Add Protocol Step</span>
            <span className="text-[11px] text-slate-400 font-mono">Step {currentGroup.steps.length + 1}</span>
          </button>
        </div>
      )}

      {/* 6. RESPONSIVE QUICK CHANGE IMAGE MODAL / BOTTOM DRAWER */}
      <AnimatePresence>
        {imageSwapStep && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setImageSwapStep(null)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            {/* Modal / Bottom Drawer Container */}
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full sm:max-w-xl bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              {/* Mobile Drag Handle */}
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-serif font-bold text-[#003334]">
                    Swap Icon for Step {imageSwapStep.stepNumber}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {imageSwapStep.title}
                  </p>
                </div>
                <button
                  onClick={() => setImageSwapStep(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Selector Tabs: Presets, Upload, URL */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mt-4 border border-slate-200/80">
                {[
                  { id: 'presets', label: 'Curated Presets', icon: Sparkles },
                  { id: 'upload', label: 'Upload Asset', icon: Upload },
                  { id: 'url', label: 'Image URL', icon: Link2 }
                ].map(t => {
                  const Icon = t.icon;
                  const isActive = quickImageTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setQuickImageTab(t.id as any)}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-white text-[#003334] font-bold shadow-xs border border-slate-200/60' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Presets Grid */}
              {quickImageTab === 'presets' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
                  {CLINICAL_PRESETS.map((preset) => {
                    const isSelected = imageSwapStep.image === preset.src;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyQuickImage(preset.src)}
                        className={`p-3 rounded-xl border text-left flex flex-col items-center text-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FAF9F5] border-[#c5a880] text-[#003334] shadow-xs ring-1 ring-[#c5a880]/40'
                            : 'bg-slate-50/70 border-slate-200 hover:border-[#c5a880]/50 hover:bg-white text-slate-700'
                        }`}
                      >
                        <div className="w-12 h-12 flex items-center justify-center">
                          {renderVisual(preset.src, "w-12 h-12")}
                        </div>
                        <div className="w-full">
                          <p className="text-xs font-semibold truncate text-[#003334]">{preset.name}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{preset.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Upload Tab */}
              {quickImageTab === 'upload' && (
                <div className="mt-4 space-y-3">
                  <input
                    type="file"
                    ref={quickFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsQuickUploading(true);
                      try {
                        const result = await uploadAssetFile(file);
                        if (result.success && result.url) {
                          handleApplyQuickImage(result.url);
                        } else {
                          alert(result.error || 'Upload failed');
                        }
                      } catch (err) {
                        alert(String(err));
                      } finally {
                        setIsQuickUploading(false);
                      }
                    }}
                  />
                  <div 
                    onClick={() => quickFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#c5a880] rounded-2xl p-8 text-center cursor-pointer bg-[#FAF9F5]/60 hover:bg-[#FAF9F5] transition-all flex flex-col items-center justify-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-[#c5a880] animate-bounce" />
                    <p className="text-xs font-bold text-[#003334]">
                      {isQuickUploading ? 'Optimizing & Uploading...' : 'Click to upload image or vector asset'}
                    </p>
                    <p className="text-[10px] text-slate-500">Supports WebP, PNG, JPG, SVG up to 10MB</p>
                  </div>
                </div>
              )}

              {/* URL Tab */}
              {quickImageTab === 'url' && (
                <div className="mt-4 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-semibold">Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/aesthetic-icon.png"
                        value={quickImageUrl}
                        onChange={(e) => setQuickImageUrl(e.target.value)}
                        className="flex-1 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#c5a880]"
                      />
                      <button
                        type="button"
                        disabled={!quickImageUrl.trim()}
                        onClick={() => handleApplyQuickImage(quickImageUrl.trim())}
                        className="px-4 py-2 bg-[#c5a880] hover:bg-amber-300 disabled:opacity-40 text-zinc-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                  {quickImageUrl.trim() && (
                    <div className="p-3 bg-[#FAF9F5] rounded-xl border border-slate-200 flex items-center gap-3">
                      <img 
                        src={quickImageUrl} 
                        alt="Preview" 
                        className="w-12 h-12 object-contain bg-white rounded-lg border border-slate-200 p-1"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span className="text-xs text-slate-600 font-medium">Live preview</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. ADD / EDIT TREATMENT PROTOCOL MODAL / BOTTOM DRAWER */}
      <AnimatePresence>
        {isAddGroupModalOpen && (() => {
          const modalBranches = getBranchesForCategory(newGroupCategory);
          const activeModalBranch =
            modalBranches.find((b) => b.id === newGroupBranchId) || modalBranches[0];
          const branchProcedures = activeModalBranch?.items || [];

          return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddGroupModalOpen(false)}
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
              />

              <motion.div
                initial={{ y: '100%', opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full sm:max-w-xl bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[88vh] overflow-y-auto no-scrollbar"
              >
                {/* Drag handle */}
                <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />

                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-serif font-bold text-[#003334]">
                      {isEditingGroupMetadata
                        ? 'Edit Treatment Protocol Category & Branch'
                        : 'Add Treatment Protocol Group'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isEditingGroupMetadata
                        ? 'Update official category, clinical sub-branch, title, and subtitle.'
                        : 'Select an official category and clinical sub-branch to configure a treatment protocol.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddGroupModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateTreatmentGroup} className="mt-4 space-y-4">
                  {addGroupError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{addGroupError}</span>
                    </div>
                  )}

                  {/* Official 5 PRICING_CATEGORIES Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>Official Treatment Category</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {OFFICIAL_TREATMENT_CATEGORIES.map((cat) => {
                        const isSelected = newGroupCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setNewGroupCategory(cat);
                              const nextBranches = getBranchesForCategory(cat);
                              setNewGroupBranchId(nextBranches[0]?.id || '');
                            }}
                            className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-[#003334] text-white font-bold border-[#003334] shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            <span className="truncate">{cat}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Sub-Branch Selector (Populated from CLINICAL_AREAS_DB) */}
                  {modalBranches.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#c5a880]" />
                        <span>Clinical Sub-Branch ({newGroupCategory})</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-[#FAF9F5] border border-[#c5a880]/30 rounded-2xl">
                        {modalBranches.map((branch) => {
                          const isBranchSelected =
                            (activeModalBranch?.id || newGroupBranchId) === branch.id;
                          return (
                            <button
                              key={branch.id}
                              type="button"
                              onClick={() => setNewGroupBranchId(branch.id)}
                              className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all flex items-center justify-between cursor-pointer ${
                                isBranchSelected
                                  ? 'bg-[#c5a880] text-zinc-950 font-bold border-[#c5a880] shadow-xs'
                                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                              }`}
                            >
                              <span className="truncate">{branch.name}</span>
                              <span
                                className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                                  isBranchSelected
                                    ? 'bg-zinc-950/15 text-zinc-950 font-bold'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {branch.items.length}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quick-Pick Procedure from Selected Branch (When Adding) */}
                  {!isEditingGroupMetadata && branchProcedures.length > 0 && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">
                        Quick-Fill from {activeModalBranch?.name} Catalog (Optional)
                      </label>
                      <select
                        value=""
                        onChange={(e) => {
                          const chosenId = e.target.value;
                          const chosenItem = branchProcedures.find((i) => i.id === chosenId);
                          if (chosenItem) {
                            setNewGroupName(chosenItem.name);
                            setNewGroupId(chosenItem.id);
                            setNewGroupSubtitle(chosenItem.desc || '');
                          }
                        }}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#c5a880] cursor-pointer"
                      >
                        <option value="">
                          — Select a procedure in {activeModalBranch?.name} to auto-fill, or type custom below —
                        </option>
                        {branchProcedures.map((proc) => (
                          <option key={proc.id} value={proc.id}>
                            {proc.name} ({proc.price}) {config.protocols[proc.id] ? '• [Custom Configured]' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Treatment Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Polynucleotides Eyes & Neck"
                      value={newGroupName}
                      onChange={(e) => {
                        setNewGroupName(e.target.value);
                        if (!isEditingGroupMetadata && !newGroupId) {
                          setNewGroupId(
                            e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, '-')
                              .replace(/[^a-z0-9_-]/g, '')
                          );
                        }
                      }}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Subtitle / Clinical Focus</label>
                    <input
                      type="text"
                      placeholder="e.g. Cellular Bio-Stimulation & Dermal Matrix Remodeling"
                      value={newGroupSubtitle}
                      onChange={(e) => setNewGroupSubtitle(e.target.value)}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Unique Identifier / Slug</label>
                    <input
                      type="text"
                      disabled={isEditingGroupMetadata}
                      placeholder="e.g. polynucleotides-eyes"
                      value={newGroupId}
                      onChange={(e) => setNewGroupId(e.target.value)}
                      className={`w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono placeholder-slate-400 focus:outline-none focus:border-[#c5a880] ${
                        isEditingGroupMetadata
                          ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-50 focus:bg-white text-slate-800'
                      }`}
                    />
                    <p className="text-[10px] text-slate-500">
                      {isEditingGroupMetadata
                        ? 'Treatment identifier slug is locked to preserve page routing.'
                        : 'Auto-generated or custom key matching service page references.'}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsAddGroupModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors min-h-[44px] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-950 bg-[#c5a880] hover:bg-amber-300 transition-colors min-h-[44px] cursor-pointer shadow-sm"
                    >
                      {isEditingGroupMetadata ? 'Save Changes' : 'Create Treatment Protocol'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* 8. RESPONSIVE FULL STEP EDIT MODAL / BOTTOM DRAWER */}
      <ClinicalProtocolModal
        isOpen={isModalOpen}
        step={editingStep}
        stepNumber={nextStepNumber}
        treatmentName={currentGroup.name}
        onSave={handleSaveStep}
        onClose={() => setIsModalOpen(false)}
        onDelete={editingStep ? () => handleDeleteStep(editingStep.id) : undefined}
      />
    </div>
  );
}
