"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  getTreatmentPricingData, 
  saveTreatmentPricingData, 
  resetTreatmentPricingDataToDefault,
  uploadAssetFile,
  fetchRemoteTreatmentPricingData,
  getTreatmentTaxonomy,
  saveTreatmentTaxonomy,
  resetTreatmentTaxonomy,
  fetchRemoteTreatmentTaxonomy
} from '../lib/adminStore';
import { 
  TreatmentPricingItem, 
  PricingPackage, 
  TreatmentCategory, 
  PRICING_CATEGORIES,
  TreatmentTaxonomyGroup,
  TreatmentSubGroup,
  DEFAULT_TREATMENT_TAXONOMY,
  LEGACY_BROCHURE_SUBGROUP_IDS,
  inferTreatmentSubGroup
} from '../data/treatmentPricing';
import { getTreatmentImagePath, setTreatmentImageVersion, convertImageFileToWebP } from '../utils/treatmentImageHelper';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Copy, 
  Image as ImageIcon, 
  Clock, 
  Sparkles, 
  Check, 
  X, 
  Upload, 
  RefreshCw, 
  Layers, 
  Star, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  SlidersHorizontal,
  FolderPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Curated preset clinical aesthetic cover photos for quick-swap
const PRESET_CLINIC_PHOTOS = [
  { label: 'Facial Aesthetics', url: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lip & Dermal Fillers', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Skin Boosters & Glow', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Body Sculpting', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Clinical Facial Care', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80' },
  { label: 'IV Wellness Infusion', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80' },
  { label: 'Laser & Tightening', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Hair & Scalp Health', url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80' },
];

export default function TreatmentPricingEditor() {
  // Helper to ensure every treatment's subGroupId and subCategory match Services & Branches
  const normalizeTreatmentsWithTaxonomy = (list: TreatmentPricingItem[]): TreatmentPricingItem[] => {
    return list.map((t) => {
      const hasLegacySub = Boolean(t.subGroupId && LEGACY_BROCHURE_SUBGROUP_IDS.has(t.subGroupId));
      if (!t.subCategory || !t.subGroupId || hasLegacySub) {
        const inferred = inferTreatmentSubGroup(t);
        return {
          ...t,
          category: (inferred.parentCategory || t.category) as TreatmentCategory,
          subCategory: hasLegacySub ? inferred.subCategory : (t.subCategory || inferred.subCategory),
          subGroupId: hasLegacySub ? inferred.subGroupId : (t.subGroupId || inferred.subGroupId),
        };
      }
      return t;
    });
  };

  // Master pricing data from persistent store (with Services & Branches sub-groups populated)
  const [treatments, setTreatments] = useState<TreatmentPricingItem[]>(() =>
    normalizeTreatmentsWithTaxonomy(getTreatmentPricingData())
  );

  // Master taxonomy branches & sub-groups (synced 100% with Services & Branches)
  const [taxonomy, setTaxonomy] = useState<TreatmentTaxonomyGroup[]>(() => getTreatmentTaxonomy());

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string>('all');
  const [selectedSubGroupId, setSelectedSubGroupId] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc'>('default');
  
  // Save & Sync feedback state
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Contextual Menu State
  const [activeMenuTreatmentId, setActiveMenuTreatmentId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  // Modals & Bottom Sheets State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<TreatmentPricingItem | null>(null);
  const [isNewTreatment, setIsNewTreatment] = useState(false);

  const [isPackagesModalOpen, setIsPackagesModalOpen] = useState(false);
  const [packagingTreatment, setPackagingTreatment] = useState<TreatmentPricingItem | null>(null);

  const [isImageSwapModalOpen, setIsImageSwapModalOpen] = useState(false);
  const [imageSwapTreatment, setImageSwapTreatment] = useState<TreatmentPricingItem | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteConfirmTreatment, setDeleteConfirmTreatment] = useState<TreatmentPricingItem | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [benefitInputMap, setBenefitInputMap] = useState<Record<number, string>>({});

  // Branch & Sub-Group Management Modals State
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');

  const [branchToRename, setBranchToRename] = useState<TreatmentTaxonomyGroup | null>(null);
  const [renameBranchName, setRenameBranchName] = useState('');

  const [branchToDelete, setBranchToDelete] = useState<TreatmentTaxonomyGroup | null>(null);
  const [reassignBranchTargetId, setReassignBranchTargetId] = useState<string>('');

  const [isAddSubGroupModalOpen, setIsAddSubGroupModalOpen] = useState(false);
  const [parentForNewSubGroup, setParentForNewSubGroup] = useState<TreatmentTaxonomyGroup | null>(null);
  const [newSubGroupName, setNewSubGroupName] = useState('');

  const [subGroupToRename, setSubGroupToRename] = useState<{ parentBranch: TreatmentTaxonomyGroup; subGroup: TreatmentSubGroup } | null>(null);
  const [renameSubGroupName, setRenameSubGroupName] = useState('');

  const [subGroupToDelete, setSubGroupToDelete] = useState<{ parentBranch: TreatmentTaxonomyGroup; subGroup: TreatmentSubGroup } | null>(null);
  const [reassignSubGroupTargetId, setReassignSubGroupTargetId] = useState<string>('');

  // Inline Quick-Add Sub-Group inside Edit Treatment modal
  const [isModalQuickAddOpen, setIsModalQuickAddOpen] = useState(false);
  const [modalQuickAddName, setModalQuickAddName] = useState('');

  // Sync with remote server or storage updates for treatments, taxonomy & Services & Branches
  useEffect(() => {
    const handleTreatmentUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setTreatments(normalizeTreatmentsWithTaxonomy(e.detail));
      } else {
        setTreatments(normalizeTreatmentsWithTaxonomy(getTreatmentPricingData()));
      }
    };
    const handleTaxonomyUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setTaxonomy(e.detail);
      } else {
        setTaxonomy(getTreatmentTaxonomy());
      }
    };
    const handleMasterServicesUpdate = () => {
      setTaxonomy(getTreatmentTaxonomy());
    };

    window.addEventListener('treatment_pricing_updated', handleTreatmentUpdate);
    window.addEventListener('treatment_taxonomy_updated', handleTaxonomyUpdate);
    window.addEventListener('master_services_updated', handleMasterServicesUpdate);

    // Initial background fetch from remote server
    fetchRemoteTreatmentPricingData().then((res) => {
      if (res && Array.isArray(res)) {
        setTreatments(normalizeTreatmentsWithTaxonomy(res));
      }
    });
    fetchRemoteTreatmentTaxonomy().then((res) => {
      if (res && Array.isArray(res)) {
        setTaxonomy(res);
      }
    });

    return () => {
      window.removeEventListener('treatment_pricing_updated', handleTreatmentUpdate);
      window.removeEventListener('treatment_taxonomy_updated', handleTaxonomyUpdate);
      window.removeEventListener('master_services_updated', handleMasterServicesUpdate);
    };
  }, []);

  // Show floating toast
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 3500);
  };

  // Close dropdown menu on outside click or escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenuTreatmentId(null);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.treatment-context-menu-trigger') &&
          !(e.target as HTMLElement).closest('.treatment-context-menu-container')) {
        setActiveMenuTreatmentId(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Normalization helper for category matching
  const normalizeCat = (cat?: string) => {
    if (!cat) return '';
    const c = cat.toLowerCase().trim();
    if (c.includes('face') || c.includes('inject')) return 'face-injectables';
    if (c.includes('body')) return 'body-sculpting';
    if (c.includes('facial') || c.includes('advanced')) return 'advanced-facials';
    if (c.includes('hair') || c.includes('beauty')) return 'hair-beauty';
    if (c.includes('iv') || c.includes('wellness') || c.includes('drip')) return 'iv-drips-wellness';
    return c;
  };

  // Check if a treatment belongs to a parent branch
  const matchesParentBranch = (t: TreatmentPricingItem, branch: TreatmentTaxonomyGroup) => {
    if (!branch) return false;
    if (t.category === branch.name) return true;
    if (normalizeCat(t.category) === branch.id) return true;
    if (normalizeCat(t.category) === normalizeCat(branch.name)) return true;
    return false;
  };

  // Check if a treatment belongs to a subgroup within a parent branch
  const matchesSubGroup = (t: TreatmentPricingItem, parentBranch: TreatmentTaxonomyGroup, subGroup: TreatmentSubGroup) => {
    if (!matchesParentBranch(t, parentBranch)) return false;
    const hasLegacySub = Boolean(t.subGroupId && LEGACY_BROCHURE_SUBGROUP_IDS.has(t.subGroupId));
    if (!hasLegacySub) {
      if (t.subGroupId === subGroup.id) return true;
      if (t.subCategory && t.subCategory.toLowerCase() === subGroup.name.toLowerCase()) return true;
    }

    const inferred = inferTreatmentSubGroup(t);
    if (inferred.subGroupId === subGroup.id) return true;
    if (inferred.subCategory.toLowerCase() === subGroup.name.toLowerCase()) return true;

    return false;
  };

  // Active Parent Branch object (if not 'all')
  const selectedParentBranch = useMemo(() => {
    if (selectedParentId === 'all') return null;
    return taxonomy.find((b) => b.id === selectedParentId || b.name === selectedParentId) || null;
  }, [taxonomy, selectedParentId]);

  // Filtered & Sorted treatments
  const filteredTreatments = useMemo(() => {
    let result = [...treatments];

    // Parent branch filter
    if (selectedParentId !== 'all') {
      const activeBranch = taxonomy.find((b) => b.id === selectedParentId || b.name === selectedParentId);
      if (activeBranch) {
        result = result.filter((t) => matchesParentBranch(t, activeBranch));

        // Subgroup filter (within active branch)
        if (selectedSubGroupId !== 'all') {
          const activeSub = activeBranch.subGroups.find((s) => s.id === selectedSubGroupId || s.name === selectedSubGroupId);
          if (activeSub) {
            result = result.filter((t) => matchesSubGroup(t, activeBranch, activeSub));
          }
        }
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.subCategory && t.subCategory.toLowerCase().includes(q)) ||
          (t.badge && t.badge.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          t.packages.some((p) => p.name.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortOption === 'name-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [treatments, taxonomy, selectedParentId, selectedSubGroupId, searchQuery, sortOption]);

  // Persist Taxonomy changes
  const persistTaxonomy = async (updatedTaxonomy: TreatmentTaxonomyGroup[], successMsg?: string) => {
    setTaxonomy(updatedTaxonomy);
    try {
      const res = await saveTreatmentTaxonomy(updatedTaxonomy);
      if (res.success && successMsg) {
        showToast(successMsg, 'success');
      }
    } catch (err) {
      if (successMsg) showToast(successMsg, 'info');
    }
  };

  // Save changes to store and disk
  const persistTreatments = async (updatedData: TreatmentPricingItem[], successMsg: string) => {
    setTreatments(updatedData);
    setIsSaving(true);
    try {
      const res = await saveTreatmentPricingData(updatedData);
      if (res.success) {
        showToast(successMsg, 'success');
      } else {
        showToast(`Saved locally. Disk warning: ${res.error || 'Server offline'}`, 'info');
      }
    } catch (err) {
      showToast('Saved to local storage with broadcast update', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Branch Management Handlers ---
  const handleAddBranchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newBranchName.trim();
    if (!name) {
      showToast('Please enter a branch name', 'error');
      return;
    }
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `branch-${Date.now()}`;
    if (taxonomy.some((b) => b.id === id || b.name.toLowerCase() === name.toLowerCase())) {
      showToast('A branch with this name or ID already exists', 'error');
      return;
    }

    const newGroup: TreatmentTaxonomyGroup = {
      id,
      name,
      subGroups: [],
    };
    const updatedTaxonomy = [...taxonomy, newGroup];
    await persistTaxonomy(updatedTaxonomy, `Created branch "${name}"`);
    setSelectedParentId(id);
    setSelectedSubGroupId('all');
    setIsAddBranchModalOpen(false);
    setNewBranchName('');
  };

  const handleRenameBranchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchToRename) return;
    const newName = renameBranchName.trim();
    if (!newName) {
      showToast('Branch name cannot be empty', 'error');
      return;
    }
    if (newName === branchToRename.name) {
      setBranchToRename(null);
      return;
    }

    const oldName = branchToRename.name;
    const updatedTaxonomy = taxonomy.map((b) => (b.id === branchToRename.id ? { ...b, name: newName } : b));

    // Update all treatments whose category matched this branch
    const updatedTreatments = treatments.map((t) => {
      if (matchesParentBranch(t, branchToRename)) {
        return { ...t, category: newName as any };
      }
      return t;
    });

    await persistTaxonomy(updatedTaxonomy);
    await persistTreatments(updatedTreatments, `Renamed "${oldName}" to "${newName}" and updated assigned treatments`);
    if (selectedParentId === branchToRename.id || selectedParentId === branchToRename.name) {
      setSelectedParentId(branchToRename.id);
    }
    setBranchToRename(null);
  };

  const executeDeleteBranch = async () => {
    if (!branchToDelete) return;
    const targetBranch = taxonomy.find((b) => b.id === reassignBranchTargetId);
    const updatedTaxonomy = taxonomy.filter((b) => b.id !== branchToDelete.id);

    const updatedTreatments = treatments.map((t) => {
      if (matchesParentBranch(t, branchToDelete)) {
        if (targetBranch) {
          const defaultSub = targetBranch.subGroups[0];
          return {
            ...t,
            category: targetBranch.name as any,
            subCategory: defaultSub?.name,
            subGroupId: defaultSub?.id,
          };
        } else {
          return {
            ...t,
            category: 'Unassigned' as any,
            subCategory: undefined,
            subGroupId: undefined,
          };
        }
      }
      return t;
    });

    if (selectedParentId === branchToDelete.id || selectedParentId === branchToDelete.name) {
      setSelectedParentId('all');
      setSelectedSubGroupId('all');
    }

    await persistTaxonomy(updatedTaxonomy);
    await persistTreatments(
      updatedTreatments,
      `Deleted branch "${branchToDelete.name}" and ${targetBranch ? `reassigned treatments to ${targetBranch.name}` : 'unassigned treatments'}`
    );
    setBranchToDelete(null);
  };

  // --- Sub-Group Management Handlers ---
  const handleAddSubGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentForNewSubGroup) return;
    const name = newSubGroupName.trim();
    if (!name) {
      showToast('Please enter a sub-group name', 'error');
      return;
    }
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `sub-${Date.now()}`;
    if (parentForNewSubGroup.subGroups.some((s) => s.id === id || s.name.toLowerCase() === name.toLowerCase())) {
      showToast('A sub-group with this name already exists in this branch', 'error');
      return;
    }

    const newSub: TreatmentSubGroup = { id, name };
    const updatedTaxonomy = taxonomy.map((b) => {
      if (b.id === parentForNewSubGroup.id) {
        return { ...b, subGroups: [...b.subGroups, newSub] };
      }
      return b;
    });

    await persistTaxonomy(updatedTaxonomy, `Added sub-group "${name}" to ${parentForNewSubGroup.name}`);
    setSelectedSubGroupId(id);
    setIsAddSubGroupModalOpen(false);
    setParentForNewSubGroup(null);
    setNewSubGroupName('');
  };

  const handleRenameSubGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subGroupToRename) return;
    const newName = renameSubGroupName.trim();
    if (!newName) {
      showToast('Sub-group name cannot be empty', 'error');
      return;
    }
    const { parentBranch, subGroup } = subGroupToRename;
    if (newName === subGroup.name) {
      setSubGroupToRename(null);
      return;
    }

    const updatedTaxonomy = taxonomy.map((b) => {
      if (b.id === parentBranch.id) {
        return {
          ...b,
          subGroups: b.subGroups.map((s) => (s.id === subGroup.id ? { ...s, name: newName } : s)),
        };
      }
      return b;
    });

    // Automatically update subCategory field of all assigned treatments!
    const updatedTreatments = treatments.map((t) => {
      if (matchesSubGroup(t, parentBranch, subGroup)) {
        return {
          ...t,
          subCategory: newName,
          subGroupId: subGroup.id,
        };
      }
      return t;
    });

    await persistTaxonomy(updatedTaxonomy);
    await persistTreatments(updatedTreatments, `Renamed sub-group to "${newName}" and updated assigned treatments`);
    if (selectedSubGroupId === subGroup.id || selectedSubGroupId === subGroup.name) {
      setSelectedSubGroupId(subGroup.id);
    }
    setSubGroupToRename(null);
  };

  const executeDeleteSubGroup = async () => {
    if (!subGroupToDelete) return;
    const { parentBranch, subGroup } = subGroupToDelete;
    const targetSub = parentBranch.subGroups.find((s) => s.id === reassignSubGroupTargetId);

    const updatedTaxonomy = taxonomy.map((b) => {
      if (b.id === parentBranch.id) {
        return {
          ...b,
          subGroups: b.subGroups.filter((s) => s.id !== subGroup.id),
        };
      }
      return b;
    });

    const updatedTreatments = treatments.map((t) => {
      if (matchesSubGroup(t, parentBranch, subGroup)) {
        if (targetSub) {
          return {
            ...t,
            subCategory: targetSub.name,
            subGroupId: targetSub.id,
          };
        } else {
          return {
            ...t,
            subCategory: undefined,
            subGroupId: undefined,
          };
        }
      }
      return t;
    });

    if (selectedSubGroupId === subGroup.id || selectedSubGroupId === subGroup.name) {
      setSelectedSubGroupId('all');
    }

    await persistTaxonomy(updatedTaxonomy);
    await persistTreatments(
      updatedTreatments,
      `Deleted sub-group "${subGroup.name}" and ${targetSub ? `moved treatments to ${targetSub.name}` : 'left treatments unassigned'}`
    );
    setSubGroupToDelete(null);
  };

  // Inline quick-add sub-group within Edit Treatment modal
  const handleModalQuickAddSubGroup = async () => {
    if (!editingTreatment || !modalQuickAddName.trim()) return;
    const name = modalQuickAddName.trim();
    const newId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const activeBranch = taxonomy.find(
      (b) => b.name === editingTreatment.category || b.id === normalizeCat(editingTreatment.category)
    );

    if (!activeBranch) {
      showToast('Please select a valid parent branch first', 'error');
      return;
    }

    if (activeBranch.subGroups.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      showToast(`Sub-group "${name}" already exists in ${activeBranch.name}`, 'info');
      setEditingTreatment({
        ...editingTreatment,
        subCategory: name,
        subGroupId: newId,
      });
      setIsModalQuickAddOpen(false);
      setModalQuickAddName('');
      return;
    }

    const updatedSubGroups: TreatmentSubGroup[] = [
      ...activeBranch.subGroups,
      { id: newId, name }
    ];

    const updatedTaxonomy = taxonomy.map((b) =>
      b.id === activeBranch.id ? { ...b, subGroups: updatedSubGroups } : b
    );

    await persistTaxonomy(updatedTaxonomy, `Added sub-group "${name}" under ${activeBranch.name}`);
    
    // Auto-select the newly created subgroup in the modal
    setEditingTreatment({
      ...editingTreatment,
      subCategory: name,
      subGroupId: newId,
    });
    setModalQuickAddName('');
    setIsModalQuickAddOpen(false);
    showToast(`Created & assigned "${name}" to this procedure`, 'success');
  };

  // Open modal for new treatment
  const handleOpenNewTreatment = () => {
    const newId = `treatment-${Date.now()}`;
    const defaultBranch = selectedParentBranch?.name || taxonomy[0]?.name || 'Face & Injectables';
    const activeBranchObj = taxonomy.find((b) => b.name === defaultBranch || b.id === normalizeCat(defaultBranch));
    const firstSub = activeBranchObj?.subGroups[0];

    const defaultTreatment: TreatmentPricingItem = {
      id: newId,
      title: '',
      category: defaultBranch as any,
      subCategory: firstSub?.name,
      subGroupId: firstSub?.id,
      description: 'Comprehensive clinical aesthetic procedure customized to individual skin and facial anatomy.',
      image: PRESET_CLINIC_PHOTOS[0].url,
      startingPrice: 150,
      currency: '£',
      procedureTime: '30 Mins',
      downtime: 'None / Minimal',
      badge: 'Popular Treatment',
      popular: true,
      packages: [
        {
          id: `${newId}-single`,
          name: 'Single Session',
          price: 150,
          sessions: 1,
          description: 'Standard single session protocol including clinical consultation and post-treatment assessment.',
          includes: ['Doctor consultation', 'Topical numbing if required', 'Full procedure application', 'Aftercare serum application'],
        },
      ],
    };
    setIsModalQuickAddOpen(false);
    setModalQuickAddName('');
    setEditingTreatment(defaultTreatment);
    setIsNewTreatment(true);
    setIsEditModalOpen(true);
  };

  // Open modal to edit existing treatment
  const handleOpenEditTreatment = (treatment: TreatmentPricingItem) => {
    const itemCopy: TreatmentPricingItem = JSON.parse(JSON.stringify(treatment));
    if (!itemCopy.subCategory || !itemCopy.subGroupId) {
      const inferred = inferTreatmentSubGroup(treatment);
      if (!itemCopy.subCategory) itemCopy.subCategory = inferred.subCategory;
      if (!itemCopy.subGroupId) itemCopy.subGroupId = inferred.subGroupId;
    }
    setIsModalQuickAddOpen(false);
    setModalQuickAddName('');
    setEditingTreatment(itemCopy);
    setIsNewTreatment(false);
    setIsEditModalOpen(true);
    setActiveMenuTreatmentId(null);
  };

  // Open packages modal
  const handleOpenPackagesModal = (treatment: TreatmentPricingItem) => {
    setPackagingTreatment(JSON.parse(JSON.stringify(treatment)));
    setIsPackagesModalOpen(true);
    setActiveMenuTreatmentId(null);
  };

  // Open image swap modal
  const handleOpenImageSwapModal = (treatment: TreatmentPricingItem) => {
    setImageSwapTreatment(treatment);
    setCustomImageUrl(treatment.image);
    setIsImageSwapModalOpen(true);
    setActiveMenuTreatmentId(null);
  };

  // Duplicate treatment
  const handleDuplicateTreatment = (treatment: TreatmentPricingItem) => {
    const inferred = inferTreatmentSubGroup(treatment);
    const cloneId = `${treatment.id}-copy-${Date.now().toString().slice(-4)}`;
    const clonedItem: TreatmentPricingItem = {
      ...JSON.parse(JSON.stringify(treatment)),
      id: cloneId,
      title: `${treatment.title} (Copy)`,
      category: treatment.category || 'Face & Injectables',
      subCategory: treatment.subCategory || inferred.subCategory,
      subGroupId: treatment.subGroupId || inferred.subGroupId,
      packages: treatment.packages.map((pkg, idx) => ({
        ...pkg,
        id: `${cloneId}-pkg-${idx + 1}`,
      })),
    };

    const updated = [clonedItem, ...treatments];
    persistTreatments(updated, `Duplicated "${treatment.title}"`);
    setActiveMenuTreatmentId(null);
  };

  // Toggle popular / featured
  const handleTogglePopular = (treatmentId: string) => {
    const updated = treatments.map((t) =>
      t.id === treatmentId ? { ...t, popular: !t.popular } : t
    );
    const target = updated.find((t) => t.id === treatmentId);
    persistTreatments(
      updated,
      target?.popular ? `Marked "${target.title}" as Popular` : `Removed popular badge`
    );
    setActiveMenuTreatmentId(null);
  };

  // Toggle Active / Hide (Quick visibility toggle without deleting)
  const handleToggleVisibility = (treatmentId: string) => {
    const updated = treatments.map((t) => {
      if (t.id === treatmentId) {
        const nextHidden = !t.hidden;
        return { ...t, hidden: nextHidden, isActive: !nextHidden };
      }
      return t;
    });
    const target = updated.find((t) => t.id === treatmentId);
    persistTreatments(
      updated,
      target?.hidden 
        ? `Hidden "${target.title}" from public pricing view` 
        : `Restored "${target?.title}" to public pricing view (Active)`
    );
    setActiveMenuTreatmentId(null);
  };

  // Confirm delete treatment
  const handleDeleteTreatment = (treatment: TreatmentPricingItem) => {
    setDeleteConfirmTreatment(treatment);
    setActiveMenuTreatmentId(null);
  };

  const executeDeleteTreatment = () => {
    if (!deleteConfirmTreatment) return;
    const updated = treatments.filter((t) => t.id !== deleteConfirmTreatment.id);
    persistTreatments(updated, `Deleted "${deleteConfirmTreatment.title}"`);
    setDeleteConfirmTreatment(null);
  };

  // Save Treatment from modal
  const handleSaveTreatmentModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTreatment) return;

    if (!editingTreatment.title.trim()) {
      showToast('Please enter a treatment title', 'error');
      return;
    }

    // Ensure subCategory and subGroupId match the active branch in taxonomy
    const activeBranch = taxonomy.find(
      (b) => b.name === editingTreatment.category || b.id === normalizeCat(editingTreatment.category)
    );
    let finalSubCategory = editingTreatment.subCategory;
    let finalSubGroupId = editingTreatment.subGroupId;

    if (activeBranch && finalSubCategory) {
      const matched = activeBranch.subGroups.find(
        (s) => s.name === finalSubCategory || s.id === finalSubGroupId
      );
      if (matched) {
        finalSubCategory = matched.name;
        finalSubGroupId = matched.id;
      }
    }

    const treatmentToSave: TreatmentPricingItem = {
      ...editingTreatment,
      subCategory: finalSubCategory,
      subGroupId: finalSubGroupId,
    };

    let updated: TreatmentPricingItem[];
    if (isNewTreatment) {
      updated = [treatmentToSave, ...treatments];
    } else {
      updated = treatments.map((t) =>
        t.id === treatmentToSave.id ? treatmentToSave : t
      );
    }

    persistTreatments(
      updated,
      isNewTreatment ? `Added "${treatmentToSave.title}"` : `Updated "${treatmentToSave.title}"`
    );
    setIsEditModalOpen(false);
    setEditingTreatment(null);
    setIsModalQuickAddOpen(false);
    setModalQuickAddName('');
  };

  // Save packages modal
  const handleSavePackagesModal = () => {
    if (!packagingTreatment) return;
    const updated = treatments.map((t) =>
      t.id === packagingTreatment.id ? packagingTreatment : t
    );
    persistTreatments(updated, `Updated packages for "${packagingTreatment.title}"`);
    setIsPackagesModalOpen(false);
    setPackagingTreatment(null);
  };

  const handleAddBenefitToPackage = (pkgIndex: number, benefitText?: string) => {
    if (!packagingTreatment) return;
    const textToAdd = (benefitText || benefitInputMap[pkgIndex] || '').trim();
    if (!textToAdd) return;

    const updatedPkgs = [...packagingTreatment.packages];
    const targetPkg = updatedPkgs[pkgIndex];
    const currentIncludes = targetPkg.includes || [];
    if (!currentIncludes.includes(textToAdd)) {
      updatedPkgs[pkgIndex] = {
        ...targetPkg,
        includes: [...currentIncludes, textToAdd]
      };
      setPackagingTreatment({ ...packagingTreatment, packages: updatedPkgs });
    }
    setBenefitInputMap((prev) => ({ ...prev, [pkgIndex]: '' }));
  };

  const handleRemoveBenefitFromPackage = (pkgIndex: number, benefitIndex: number) => {
    if (!packagingTreatment) return;
    const updatedPkgs = [...packagingTreatment.packages];
    const targetPkg = updatedPkgs[pkgIndex];
    updatedPkgs[pkgIndex] = {
      ...targetPkg,
      includes: (targetPkg.includes || []).filter((_, i) => i !== benefitIndex)
    };
    setPackagingTreatment({ ...packagingTreatment, packages: updatedPkgs });
  };

  // Save cover image swap
  const handleApplyImageSwap = (newUrl: string) => {
    if (!imageSwapTreatment) return;
    const trimmedUrl = newUrl.trim();
    if (!trimmedUrl) {
      showToast('Please select or provide a valid image URL', 'error');
      return;
    }

    // If Edit Treatment Modal is currently open, sync its state too
    if (editingTreatment) {
      setEditingTreatment((prev) => prev ? { ...prev, image: trimmedUrl } : null);
    }

    // If modifying an existing treatment in the list, persist to store and disk
    const exists = treatments.some((t) => t.id === imageSwapTreatment.id);
    if (exists) {
      const updated = treatments.map((t) =>
        t.id === imageSwapTreatment.id ? { ...t, image: trimmedUrl } : t
      );
      persistTreatments(updated, `Updated cover photo for "${imageSwapTreatment.title || 'Treatment'}"`);
    } else {
      showToast(`Selected cover photo for "${imageSwapTreatment.title || 'New Treatment'}"`, 'success');
    }

    setIsImageSwapModalOpen(false);
    setImageSwapTreatment(null);
  };

  // 1-Click Upload directly to /api/admin/treatments/:id/image (Deletes previous image on server)
  const handleDirectTreatmentImageUpload = async (treatment: TreatmentPricingItem, file: File) => {
    if (!file || !treatment) return;
    setIsUploadingImage(true);
    showToast(`Optimizing & converting photo to WebP for "${treatment.title || treatment.id}"...`, 'info');

    try {
      // Convert any uploaded format (PNG, JPEG, HEIC, etc.) to true WebP
      const dataUrl = await convertImageFileToWebP(file, 0.92);

      const response = await fetch(`/api/admin/treatments/${encodeURIComponent(treatment.id)}/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataUrl,
          fileName: `${treatment.id}.webp`,
          extension: '.webp'
        })
      });

      const data = await response.json();
      if (data.success && data.imagePath) {
        // Register image cache version for instant live refresh
        setTreatmentImageVersion(treatment.id, data.version);

        // Update treatment in state
        const updated = treatments.map((t) =>
          t.id === treatment.id
            ? { ...t, image: data.rawPath || data.imagePath, updatedAt: data.version }
            : t
        );
        setTreatments(updated);
        saveTreatmentPricingData(updated);

        // If editing modal is open for this treatment, update it
        if (editingTreatment && editingTreatment.id === treatment.id) {
          setEditingTreatment((prev) => prev ? { ...prev, image: data.rawPath || data.imagePath, updatedAt: data.version } : null);
        }

        const purgeInfo = data.deletedFiles && data.deletedFiles.length > 0
          ? ` (Cleaned previous ${data.deletedFiles.join(', ')})`
          : '';
        showToast(`Card photo updated for "${treatment.title || treatment.id}"!${purgeInfo}`, 'success');
      } else {
        showToast(data.error || 'Failed to update treatment card photo', 'error');
      }
    } catch (err) {
      console.error('Error uploading treatment image:', err);
      showToast('Upload error: ' + String(err), 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle local file upload in Image Swap modal
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !imageSwapTreatment) return;

    // Use direct ID-based treatment upload route
    await handleDirectTreatmentImageUpload(imageSwapTreatment, file);
    setIsImageSwapModalOpen(false);
    setImageSwapTreatment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    const defaultData = resetTreatmentPricingDataToDefault();
    const defaultTax = resetTreatmentTaxonomy();
    setTreatments(defaultData);
    setTaxonomy(defaultTax);
    setSelectedParentId('all');
    setSelectedSubGroupId('all');
    setIsResetConfirmOpen(false);
    showToast('Restored default treatment catalog and taxonomy from source data', 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Notification Pill */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md ${
              toastMessage.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-800'
                : toastMessage.type === 'info'
                ? 'bg-slate-900/90 text-amber-200 border-amber-800'
                : 'bg-[#003334]/95 text-[#c5a880] border-[#c5a880]/30'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-[#c5a880] shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input for asset uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* =========================================================================
          HEADER BAR: Title, Search, Primary Actions, Stats
         ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 md:p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-[#003334]/10 text-[#003334] rounded-xl">
                <Sparkles className="h-5 w-5 text-[#c5a880]" />
              </span>
              <div>
                <h2 className="font-serif font-bold text-xl md:text-2xl text-[#003334]">
                  Treatment Pricing & Media Editor
                </h2>
                <p className="text-xs text-slate-500 font-sans">
                  Manage live procedure listings, pricing tiers, durations, and cover imagery.
                </p>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Restore standard clinic pricing brochure catalog"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              onClick={handleOpenNewTreatment}
              className="bg-[#003334] hover:bg-[#004d4f] text-[#c5a880] hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#003334]/10 flex items-center gap-2 cursor-pointer border border-[#c5a880]/30"
            >
              <Plus className="h-4 w-4" />
              <span>New Treatment</span>
            </button>
          </div>
        </div>

        {/* Search, Sort and Count Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search procedures by name, category, or tag..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9.5 pr-8 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector & Count Badge */}
          <div className="flex items-center gap-2.5 justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-transparent text-xs font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="default">Default Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            <div className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl">
              <span className="text-[#003334] font-black">{filteredTreatments.length}</span>
              <span className="text-slate-400"> / {treatments.length}</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TWO-TIER INTERACTIVE FILTER PILL BAR
           ========================================================================= */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          {/* ROW 1: PARENT BRANCHES BAR */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {/* All Procedures pill */}
            <button
              onClick={() => {
                setSelectedParentId('all');
                setSelectedSubGroupId('all');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedParentId === 'all'
                  ? 'bg-[#003334] text-white shadow-sm ring-1 ring-[#c5a880]/40'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              <span>All Procedures</span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                  selectedParentId === 'all'
                    ? 'bg-[#c5a880] text-[#003334]'
                    : 'bg-white/80 text-slate-500'
                }`}
              >
                {treatments.length}
              </span>
            </button>

            {/* Each Parent Branch Pill with Live Active Count and Hover/Action Icons */}
            {taxonomy.map((branch) => {
              const isParentActive = selectedParentId === branch.id || selectedParentId === branch.name;
              const count = treatments.filter((t) => matchesParentBranch(t, branch)).length;

              return (
                <div
                  key={branch.id}
                  className={`group relative flex items-center rounded-full transition-all ${
                    isParentActive
                      ? 'bg-[#003334] text-white shadow-sm ring-1 ring-[#c5a880]/50'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {/* Branch Select Button */}
                  <button
                    onClick={() => {
                      if (selectedParentId !== branch.id) {
                        setSelectedParentId(branch.id);
                        setSelectedSubGroupId('all');
                      }
                    }}
                    className="flex items-center gap-2 pl-3.5 pr-1.5 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer"
                  >
                    <span>{branch.name}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                        isParentActive
                          ? 'bg-[#c5a880] text-[#003334]'
                          : 'bg-white/80 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>

                  {/* Hover / Action Icons: Edit & Delete */}
                  <div className="flex items-center pr-2 pl-1 gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBranchToRename(branch);
                        setRenameBranchName(branch.name);
                      }}
                      title={`Rename branch "${branch.name}"`}
                      className={`p-1 rounded-full cursor-pointer transition-colors ${
                        isParentActive
                          ? 'text-slate-300 hover:text-white hover:bg-white/20'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-300/60'
                      }`}
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBranchToDelete(branch);
                        const other = taxonomy.filter((b) => b.id !== branch.id);
                        setReassignBranchTargetId(other[0]?.id || '');
                      }}
                      title={`Delete branch "${branch.name}"`}
                      className={`p-1 rounded-full cursor-pointer transition-colors ${
                        isParentActive
                          ? 'text-rose-300 hover:text-rose-100 hover:bg-rose-900/40'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-100'
                      }`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* + Add Branch Button */}
            <button
              onClick={() => {
                setNewBranchName('');
                setIsAddBranchModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border border-dashed border-[#003334]/40 hover:border-[#003334] text-[#003334] hover:bg-[#003334]/5 transition-all cursor-pointer shrink-0"
              title="Add new parent service branch"
            >
              <Plus className="h-3.5 w-3.5 text-[#003334]" />
              <span>Add Branch</span>
            </button>
          </div>

          {/* ROW 2: SUB-GROUPS BAR (Contextual to Selected Parent) */}
          <AnimatePresence>
            {selectedParentBranch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-0.5"
              >
                <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-1 shrink-0">
                    <span>Sub-Groups:</span>
                  </div>

                  {/* All [Parent Name] pill */}
                  <button
                    onClick={() => setSelectedSubGroupId('all')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedSubGroupId === 'all'
                        ? 'bg-[#003334] text-[#c5a880] shadow-xs ring-1 ring-[#c5a880]/30'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span>All {selectedParentBranch.name}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                        selectedSubGroupId === 'all'
                          ? 'bg-[#c5a880] text-[#003334]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {treatments.filter((t) => matchesParentBranch(t, selectedParentBranch)).length}
                    </span>
                  </button>

                  {/* Each Sub-Group Pill with count badge and hover action icons */}
                  {selectedParentBranch.subGroups.map((sub) => {
                    const isSubActive = selectedSubGroupId === sub.id || selectedSubGroupId === sub.name;
                    const count = treatments.filter((t) => matchesSubGroup(t, selectedParentBranch, sub)).length;

                    return (
                      <div
                        key={sub.id}
                        className={`group relative flex items-center rounded-full transition-all ${
                          isSubActive
                            ? 'bg-[#003334] text-white shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <button
                          onClick={() => setSelectedSubGroupId(sub.id)}
                          className="flex items-center gap-1.5 pl-3 pr-1 py-1 text-[11px] font-semibold whitespace-nowrap cursor-pointer"
                        >
                          <span>{sub.name}</span>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                              isSubActive
                                ? 'bg-[#c5a880] text-[#003334]'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {count}
                          </span>
                        </button>

                        {/* Action Icons: Edit & Delete */}
                        <div className="flex items-center pr-1.5 pl-0.5 gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSubGroupToRename({ parentBranch: selectedParentBranch, subGroup: sub });
                              setRenameSubGroupName(sub.name);
                            }}
                            title={`Rename sub-group "${sub.name}"`}
                            className={`p-1 rounded-full cursor-pointer transition-colors ${
                              isSubActive
                                ? 'text-slate-300 hover:text-white hover:bg-white/20'
                                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <Edit3 className="h-2.5 w-2.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSubGroupToDelete({ parentBranch: selectedParentBranch, subGroup: sub });
                              const other = selectedParentBranch.subGroups.filter((s) => s.id !== sub.id);
                              setReassignSubGroupTargetId(other[0]?.id || '');
                            }}
                            title={`Delete sub-group "${sub.name}"`}
                            className={`p-1 rounded-full cursor-pointer transition-colors ${
                              isSubActive
                                ? 'text-rose-300 hover:text-rose-100 hover:bg-rose-900/40'
                                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-100'
                            }`}
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* + Add Sub-Group Button */}
                  <button
                    onClick={() => {
                      setParentForNewSubGroup(selectedParentBranch);
                      setNewSubGroupName('');
                      setIsAddSubGroupModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border border-dashed border-[#c5a880] text-[#003334] hover:bg-[#c5a880]/15 transition-all cursor-pointer shrink-0"
                    title={`Add sub-group under ${selectedParentBranch.name}`}
                  >
                    <Plus className="h-3 w-3 text-[#c5a880]" />
                    <span>Add Sub-Group</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* =========================================================================
          VISUAL CARD GRID LAYOUT
         ========================================================================= */}
      {filteredTreatments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl w-fit mx-auto">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-slate-700">No procedures found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No treatments match your search "{searchQuery}" or selected branch and sub-group filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedParentId('all');
              setSelectedSubGroupId('all');
            }}
            className="text-xs font-bold text-[#003334] hover:underline cursor-pointer pt-2 inline-block"
          >
            Clear filters & show all procedures
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTreatments.map((treatment) => {
            const isMenuOpen = activeMenuTreatmentId === treatment.id;

            return (
              <div
                key={treatment.id}
                className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 group relative flex flex-col overflow-hidden ${
                  treatment.hidden 
                    ? 'border-dashed border-amber-300/80 bg-amber-50/15 opacity-80' 
                    : 'border-slate-200/90 hover:border-[#c5a880]/60'
                }`}
              >
                {/* 1. Cover Image Thumbnail with Quick-Swap Hover Overlay */}
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={getTreatmentImagePath(treatment.id, treatment.image, (treatment as any).updatedAt)}
                    alt={treatment.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = treatment.image || PRESET_CLINIC_PHOTOS[0].url;
                    }}
                  />

                  {/* Gradient shade for top badges */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

                  {/* Top-Left Category / Promotional Tag / Hidden Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap pointer-events-none">
                    {treatment.hidden && (
                      <span className="bg-slate-900/90 backdrop-blur-md text-amber-300 border border-amber-400/40 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                        <EyeOff className="h-2.5 w-2.5" />
                        <span>Hidden</span>
                      </span>
                    )}
                    {treatment.badge && (
                      <span className="bg-[#003334]/85 backdrop-blur-md text-[#c5a880] border border-[#c5a880]/30 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                        {treatment.badge}
                      </span>
                    )}
                    {treatment.popular && (
                      <span className="bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        <span>Popular</span>
                      </span>
                    )}
                  </div>

                  {/* Quick-Swap Hover Overlay */}
                  <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3 text-center z-20">
                    {/* 1-Click Direct File Upload */}
                    <label className="w-full max-w-[200px] bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Update Card Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleDirectTreatmentImageUpload(treatment, f);
                          e.target.value = '';
                        }}
                      />
                    </label>

                    <button
                      onClick={() => handleOpenImageSwapModal(treatment)}
                      className="w-full max-w-[200px] bg-white text-[#003334] hover:bg-[#c5a880] hover:text-[#003334] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      <span>Presets & Custom URL</span>
                    </button>
                    <button
                      onClick={() => handleOpenEditTreatment(treatment)}
                      className="w-full max-w-[200px] bg-black/50 hover:bg-black/80 text-white border border-white/20 px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit Details & Pricing</span>
                    </button>
                  </div>

                  {/* Always-visible Quick Update Photo badge on bottom right of thumbnail */}
                  <label
                    title="1-Click upload photo for this treatment ID"
                    className="absolute bottom-2 right-2 z-10 bg-black/75 hover:bg-black text-amber-300 hover:text-white px-2 py-1 rounded-lg backdrop-blur-md transition-all shadow cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Upload className="h-3 w-3 text-amber-400" />
                    <span>Update Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleDirectTreatmentImageUpload(treatment, f);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>

                {/* 2. Card Content & Metadata */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div className="space-y-2">
                    {/* Header Row: Title and Three-Dot Context Menu */}
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className="font-serif font-bold text-sm text-[#003334] line-clamp-2 leading-snug group-hover:text-[#c5a880] transition-colors"
                        title={treatment.title}
                      >
                        {treatment.title}
                      </h3>

                      {/* Three-Dot Menu Trigger */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuTreatmentId(isMenuOpen ? null : treatment.id);
                          }}
                          className="treatment-context-menu-trigger p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                          aria-label="Procedure actions menu"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {/* Floating Contextual Dropdown Menu */}
                        {isMenuOpen && (
                          <div className="treatment-context-menu-container absolute right-0 top-7 z-40 w-56 bg-white rounded-2xl border border-slate-200 shadow-2xl p-1.5 space-y-0.5 animate-in fade-in zoom-in-95">
                            {/* 1. Edit Details & Pricing */}
                            <button
                              onClick={() => handleOpenEditTreatment(treatment)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#003334] transition-colors cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                              <span>Edit Details & Pricing</span>
                            </button>

                            {/* 1-Click Update Card Photo */}
                            <label className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors cursor-pointer">
                              <Upload className="h-3.5 w-3.5 text-amber-600" />
                              <span>Update Card Photo (1-Click)</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleDirectTreatmentImageUpload(treatment, f);
                                  e.target.value = '';
                                  setActiveMenuTreatmentId(null);
                                }}
                              />
                            </label>

                            {/* 2. Change Cover Image (Modal with Presets) */}
                            <button
                              onClick={() => handleOpenImageSwapModal(treatment)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#003334] transition-colors cursor-pointer"
                            >
                              <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
                              <span>Change Image (Presets / URL)</span>
                            </button>

                            {/* 3. Duplicate Procedure */}
                            <button
                              onClick={() => handleDuplicateTreatment(treatment)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#003334] transition-colors cursor-pointer"
                            >
                              <Copy className="h-3.5 w-3.5 text-slate-400" />
                              <span>Duplicate Procedure</span>
                            </button>

                            {/* 4. Toggle Active / Hide */}
                            <button
                              onClick={() => handleToggleVisibility(treatment.id)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#003334] transition-colors cursor-pointer"
                            >
                              {treatment.hidden ? (
                                <>
                                  <Eye className="h-3.5 w-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">Toggle Active (Unhide)</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3.5 w-3.5 text-amber-600" />
                                  <span>Toggle Active / Hide</span>
                                </>
                              )}
                            </button>

                            {/* Additional Helpful Actions */}
                            <button
                              onClick={() => handleOpenPackagesModal(treatment)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#003334] transition-colors cursor-pointer"
                            >
                              <Layers className="h-3.5 w-3.5 text-slate-400" />
                              <span>Manage Packages ({treatment.packages?.length || 0})</span>
                            </button>

                            <button
                              onClick={() => handleTogglePopular(treatment.id)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#003334] transition-colors cursor-pointer"
                            >
                              <Star className={`h-3.5 w-3.5 ${treatment.popular ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                              <span>{treatment.popular ? 'Remove Popular' : 'Set as Popular'}</span>
                            </button>

                            <div className="border-t border-slate-100 my-1" />

                            {/* 5. Delete with Confirmation */}
                            <button
                              onClick={() => handleDeleteTreatment(treatment)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dual Hierarchy Badge: [Face & Injectables] › [Anti-wrinkle's injection] */}
                    {(() => {
                      const inferred = inferTreatmentSubGroup(treatment);
                      const hasLegacySub = Boolean(treatment.subGroupId && LEGACY_BROCHURE_SUBGROUP_IDS.has(treatment.subGroupId));
                      const activeBranch = taxonomy.find((b) => matchesParentBranch(treatment, b));
                      const matchedSub = activeBranch?.subGroups.find(
                        (s) => s.id === (hasLegacySub ? inferred.subGroupId : (treatment.subGroupId || inferred.subGroupId))
                      );
                      const displayBranch = activeBranch?.name || treatment.category || 'Face & Injectables';
                      const displaySub =
                        matchedSub?.name ||
                        (hasLegacySub ? inferred.subCategory : (treatment.subCategory || inferred.subCategory));
                      return (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-[#003334] bg-[#003334]/8 border border-[#003334]/15 px-2 py-0.5 rounded-md">
                            {displayBranch}
                          </span>
                          <span className="text-slate-300 text-xs font-bold">›</span>
                          <span className="text-[10px] font-semibold text-[#8b6938] bg-[#c5a880]/15 border border-[#c5a880]/30 px-2 py-0.5 rounded-md">
                            {displaySub}
                          </span>
                        </div>
                      );
                    })()}

                    {/* Starting Price Chip & Package Count Badge */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="bg-[#003334]/5 border border-[#003334]/10 rounded-lg px-2.5 py-1 text-xs">
                        <span className="text-[10px] text-slate-500 font-sans mr-1">From</span>
                        <span className="font-serif font-black text-[#003334] text-sm">
                          {treatment.currency || '£'}{treatment.startingPrice}
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenPackagesModal(treatment)}
                        className="flex items-center gap-1 bg-slate-100 hover:bg-[#c5a880]/20 text-slate-600 hover:text-[#003334] px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                        title="Click to view and edit package tiers"
                      >
                        <Layers className="h-3 w-3 text-slate-400" />
                        <span>{treatment.packages?.length || 1} {treatment.packages?.length === 1 ? 'Package' : 'Packages'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. Procedure Time and Downtime Indicators with Icons (Minimal Text) */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    {/* Time indicator */}
                    <div className="flex items-center gap-1.5" title={`Procedure duration: ${treatment.procedureTime}`}>
                      <Clock className="h-3.5 w-3.5 text-[#c5a880] shrink-0" />
                      <span className="font-medium text-slate-600">{treatment.procedureTime || '30 Mins'}</span>
                    </div>

                    {/* Downtime indicator */}
                    <div className="flex items-center gap-1.5" title={`Downtime: ${treatment.downtime}`}>
                      <Sparkles className="h-3.5 w-3.5 text-[#003334] shrink-0" />
                      <span className="font-medium text-slate-600 truncate max-w-[110px]">
                        {treatment.downtime || 'None / Minimal'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: EDIT / CREATE TREATMENT (Responsive Modal / Bottom Sheet)
         ========================================================================= */}
      <AnimatePresence>
        {isEditModalOpen && editingTreatment && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white w-full sm:max-w-xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            >
              {/* Modal Header */}
              <div className="px-6 py-4.5 border-b border-slate-150 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-[#003334]/10 text-[#003334] rounded-lg">
                    <Edit3 className="h-4 w-4" />
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#003334]">
                    {isNewTreatment ? 'Add New Clinical Treatment' : `Edit: ${editingTreatment.title}`}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSaveTreatmentModal} className="p-6 overflow-y-auto space-y-4.5 flex-1 text-xs">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Procedure Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTreatment.title}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, title: e.target.value })}
                    placeholder="E.g., Profhilo Skin Remodeling"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] text-xs font-semibold text-slate-800"
                  />
                </div>

                {/* Parent Branch & Sub-Group Selection with Cascading & Inline Quick-Add */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                      Parent Branch
                    </label>
                    <select
                      value={editingTreatment.category}
                      onChange={(e) => {
                        const newCat = e.target.value as TreatmentCategory;
                        const matchingBranch = taxonomy.find(
                          (b) => b.name === newCat || b.id === normalizeCat(newCat)
                        );
                        const firstSub = matchingBranch?.subGroups[0];
                        setEditingTreatment({
                          ...editingTreatment,
                          category: newCat,
                          subCategory: firstSub?.name || '',
                          subGroupId: firstSub?.id || '',
                        });
                        setIsModalQuickAddOpen(false);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#003334] text-xs font-medium text-slate-800"
                    >
                      {taxonomy.map((branch) => (
                        <option key={branch.id} value={branch.name}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                        Specialist Sub-Group
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalQuickAddOpen(!isModalQuickAddOpen);
                          setModalQuickAddName('');
                        }}
                        className="text-[10px] font-bold text-[#c5a880] hover:text-[#003334] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        <span>{isModalQuickAddOpen ? 'Cancel' : '+ New Sub-Group'}</span>
                      </button>
                    </div>

                    {isModalQuickAddOpen && (
                      <div className="flex items-center gap-1.5 p-1.5 bg-[#003334]/5 border border-[#003334]/15 rounded-xl mb-1.5 animate-in fade-in zoom-in-95">
                        <input
                          type="text"
                          value={modalQuickAddName}
                          onChange={(e) => setModalQuickAddName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleModalQuickAddSubGroup();
                            }
                          }}
                          placeholder="New sub-group name..."
                          className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#003334]"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleModalQuickAddSubGroup}
                          className="px-2.5 py-1.5 bg-[#003334] text-[#c5a880] hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                        >
                          Add
                        </button>
                      </div>
                    )}

                    {(() => {
                      const activeBranchForEdit = taxonomy.find(
                        (b) => b.name === editingTreatment.category || b.id === normalizeCat(editingTreatment.category)
                      );
                      const subGroups = activeBranchForEdit?.subGroups || [];
                      return (
                        <select
                          value={editingTreatment.subCategory || editingTreatment.subGroupId || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '__quick_add__') {
                              setIsModalQuickAddOpen(true);
                              return;
                            }
                            const selectedSub = subGroups.find((s) => s.id === val || s.name === val);
                            setEditingTreatment({
                              ...editingTreatment,
                              subCategory: selectedSub?.name || val,
                              subGroupId: selectedSub?.id || val,
                            });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#003334] text-xs font-medium text-slate-800"
                        >
                          {subGroups.length === 0 ? (
                            <option value="">No sub-groups in this branch</option>
                          ) : (
                            subGroups.map((sub) => (
                              <option key={sub.id} value={sub.name}>
                                {sub.name}
                              </option>
                            ))
                          )}
                          <option value="__quick_add__" className="text-[#003334] font-bold">
                            + Add New Sub-Group...
                          </option>
                        </select>
                      );
                    })()}
                  </div>
                </div>

                {/* Badge Label */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Tag / Promotional Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingTreatment.badge || ''}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, badge: e.target.value })}
                    placeholder="E.g., Popular, Clinical Favorite, Signature"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] text-xs font-medium text-slate-800"
                  />
                </div>

                {/* Starting Price, Catalog Visibility & Featured Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                      Starting Price (£) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingTreatment.startingPrice}
                      onChange={(e) => setEditingTreatment({ ...editingTreatment, startingPrice: Number(e.target.value) })}
                      placeholder="160"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] text-xs font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                      Catalog Visibility
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditingTreatment({ 
                        ...editingTreatment, 
                        hidden: !editingTreatment.hidden, 
                        isActive: !!editingTreatment.hidden 
                      })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        editingTreatment.hidden
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      }`}
                    >
                      {editingTreatment.hidden ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5 text-amber-600" />
                          <span>Hidden</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Active</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                      Featured Status
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditingTreatment({ ...editingTreatment, popular: !editingTreatment.popular })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        editingTreatment.popular
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <Star className={`h-3.5 w-3.5 ${editingTreatment.popular ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                      <span>{editingTreatment.popular ? 'Popular' : 'Standard'}</span>
                    </button>
                  </div>
                </div>

                {/* Time & Downtime */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                      Procedure Time (e.g., 20 Mins, 45 Mins)
                    </label>
                    <input
                      type="text"
                      value={editingTreatment.procedureTime}
                      onChange={(e) => setEditingTreatment({ ...editingTreatment, procedureTime: e.target.value })}
                      placeholder="30 Mins"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] text-xs text-slate-800 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                      Downtime (e.g., None, Minimal / 24 hrs)
                    </label>
                    <input
                      type="text"
                      value={editingTreatment.downtime}
                      onChange={(e) => setEditingTreatment({ ...editingTreatment, downtime: e.target.value })}
                      placeholder="None / 2 Hours"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] text-xs text-slate-800 font-medium"
                    />
                  </div>
                </div>

                {/* Cover Image URL & Preview */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Cover Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingTreatment.image}
                      onChange={(e) => setEditingTreatment({ ...editingTreatment, image: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] text-xs font-mono text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageSwapTreatment(editingTreatment);
                        setCustomImageUrl(editingTreatment.image);
                        setIsImageSwapModalOpen(true);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      <span>Choose</span>
                    </button>
                  </div>

                  {editingTreatment.image && (
                    <div className="mt-2 w-full h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img
                        src={editingTreatment.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PRESET_CLINIC_PHOTOS[0].url;
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Procedure Summary / Clinical Notes
                  </label>
                  <textarea
                    rows={2.5}
                    value={editingTreatment.description}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, description: e.target.value })}
                    placeholder="Brief description explaining procedure benefits and clinical results..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] text-xs text-slate-800 leading-relaxed"
                  />
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-slate-150 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#003334] hover:bg-[#004d4f] text-[#c5a880] hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow cursor-pointer border border-[#c5a880]/30"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 2: MANAGE PACKAGES & TIERS (Responsive Modal / Bottom Sheet)
         ========================================================================= */}
      <AnimatePresence>
        {isPackagesModalOpen && packagingTreatment && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white w-full sm:max-w-2xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            >
              {/* Header */}
              <div className="px-6 py-4.5 border-b border-slate-150 flex items-center justify-between bg-slate-50/80">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#003334]">
                    Packages for: {packagingTreatment.title}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Configure brochure packages, session discounts, and bundle inclusions.
                  </p>
                </div>
                <button
                  onClick={() => setIsPackagesModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Package list */}
              <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Active Packages ({packagingTreatment.packages?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newPkgId = `${packagingTreatment.id}-pkg-${Date.now()}`;
                      const newPkg: PricingPackage = {
                        id: newPkgId,
                        name: 'Course of 3 Sessions',
                        price: Math.round(packagingTreatment.startingPrice * 2.7),
                        sessions: 3,
                        perSessionPrice: Math.round((packagingTreatment.startingPrice * 2.7) / 3),
                        savingsBadge: 'Save 10%',
                        isPopular: true,
                        description: 'Course protocol structured over 6 to 12 weeks for optimal biological rejuvenation.',
                        includes: [
                          'Initial diagnostic consultation',
                          '3 full treatment sessions',
                          'Post-course clinical review',
                        ],
                      };
                      setPackagingTreatment({
                        ...packagingTreatment,
                        packages: [...(packagingTreatment.packages || []), newPkg],
                      });
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#003334]/10 hover:bg-[#003334]/20 text-[#003334] px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Package Tier</span>
                  </button>
                </div>

                {packagingTreatment.packages?.map((pkg, idx) => (
                  <div
                    key={pkg.id || idx}
                    className="bg-slate-50 rounded-2xl border border-slate-200 p-2 space-y-3.5 relative"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#c5a880] bg-[#003334] px-2 py-0.5 rounded-md">
                        Tier #{idx + 1}
                      </span>
                      {packagingTreatment.packages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setPackagingTreatment({
                              ...packagingTreatment,
                              packages: packagingTreatment.packages.filter((_, i) => i !== idx),
                            });
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove package tier"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                          Package Name
                        </label>
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) => {
                            const updatedPkgs = [...packagingTreatment.packages];
                            updatedPkgs[idx] = { ...pkg, name: e.target.value };
                            setPackagingTreatment({ ...packagingTreatment, packages: updatedPkgs });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                          Total Price (£)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={pkg.price}
                          onChange={(e) => {
                            const price = Number(e.target.value);
                            const updatedPkgs = [...packagingTreatment.packages];
                            const perSession = pkg.sessions > 0 ? Math.round(price / pkg.sessions) : price;
                            updatedPkgs[idx] = { ...pkg, price, perSessionPrice: perSession };
                            setPackagingTreatment({ ...packagingTreatment, packages: updatedPkgs });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                          Sessions Count
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={pkg.sessions}
                          onChange={(e) => {
                            const sessions = Number(e.target.value);
                            const updatedPkgs = [...packagingTreatment.packages];
                            const perSession = sessions > 0 ? Math.round(pkg.price / sessions) : pkg.price;
                            updatedPkgs[idx] = { ...pkg, sessions, perSessionPrice: perSession };
                            setPackagingTreatment({ ...packagingTreatment, packages: updatedPkgs });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                          Savings Badge (e.g. Save 15%)
                        </label>
                        <input
                          type="text"
                          value={pkg.savingsBadge || ''}
                          onChange={(e) => {
                            const updatedPkgs = [...packagingTreatment.packages];
                            updatedPkgs[idx] = { ...pkg, savingsBadge: e.target.value };
                            setPackagingTreatment({ ...packagingTreatment, packages: updatedPkgs });
                          }}
                          placeholder="Optional (e.g. Save 20%)"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                          Featured / Popular Tier
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedPkgs = [...packagingTreatment.packages];
                            updatedPkgs[idx] = { ...pkg, isPopular: !pkg.isPopular };
                            setPackagingTreatment({ ...packagingTreatment, packages: updatedPkgs });
                          }}
                          className={`w-full px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            pkg.isPopular
                              ? 'bg-amber-100/70 border-amber-300 text-amber-900'
                              : 'bg-white border-slate-200 text-slate-500'
                          }`}
                        >
                          <Star className={`h-3 w-3 ${pkg.isPopular ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                          <span>{pkg.isPopular ? 'Popular' : 'Normal'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Unique Procedure Time & Downtime per Package Tier */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200/50">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                          Procedure Duration (Unique to this tier)
                        </label>
                        <input
                          type="text"
                          value={pkg.procedureTime || ''}
                          placeholder={packagingTreatment.procedureTime || 'e.g. 30 Mins'}
                          onChange={(e) => {
                            const updatedPkgs = [...packagingTreatment.packages];
                            updatedPkgs[idx] = { ...pkg, procedureTime: e.target.value };
                            setPackagingTreatment({ ...packagingTreatment, packages: updatedPkgs });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder-slate-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                          Downtime (Unique to this tier)
                        </label>
                        <input
                          type="text"
                          value={pkg.downtime || ''}
                          placeholder={packagingTreatment.downtime || 'e.g. None / Minimal'}
                          onChange={(e) => {
                            const updatedPkgs = [...packagingTreatment.packages];
                            updatedPkgs[idx] = { ...pkg, downtime: e.target.value };
                            setPackagingTreatment({ ...packagingTreatment, packages: updatedPkgs });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder-slate-400"
                        />
                      </div>
                    </div>

                    {/* Package Description / Protocol Details */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                        Tier Protocol Description & Details
                      </label>
                      <input
                        type="text"
                        value={pkg.description || ''}
                        placeholder="e.g. Structured protocol across 6-8 weeks with clinical aftercare assessment"
                        onChange={(e) => {
                          const updatedPkgs = [...packagingTreatment.packages];
                          updatedPkgs[idx] = { ...pkg, description: e.target.value };
                          setPackagingTreatment({ ...packagingTreatment, packages: updatedPkgs });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400"
                      />
                    </div>

                    {/* Package Benefits & Inclusions Checklist */}
                    <div className="space-y-2 pt-2 border-t border-slate-200/60">
                      <div className="flex items-center">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                          Package Benefits ({pkg.includes?.length || 0})
                        </label>
                      </div>

                      {/* Benefits tags list */}
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.includes && pkg.includes.length > 0 ? (
                          pkg.includes.map((benefit, bIdx) => (
                            <span
                              key={bIdx}
                              className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] text-slate-700 shadow-2xs"
                            >
                              <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                              <span>{benefit}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveBenefitFromPackage(idx, bIdx)}
                                className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors"
                                title="Remove benefit"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No benefits added yet.</span>
                        )}
                      </div>

                      {/* Add benefit input row */}
                      <div className="flex gap-1.5 pt-1">
                        <input
                          type="text"
                          value={benefitInputMap[idx] || ''}
                          onChange={(e) => setBenefitInputMap({ ...benefitInputMap, [idx]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddBenefitToPackage(idx);
                            }
                          }}
                          placeholder="Type a new benefit (e.g. Doctor consultation, Numbing cream)..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#003334]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddBenefitToPackage(idx)}
                          className="bg-[#003334] text-[#c5a880] hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                        >
                          + Add
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-150 flex items-center justify-end gap-2.5 bg-slate-50/80">
                <button
                  type="button"
                  onClick={() => setIsPackagesModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePackagesModal}
                  className="bg-[#003334] hover:bg-[#004d4f] text-[#c5a880] hover:text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow cursor-pointer border border-[#c5a880]/30"
                >
                  Save Packages
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 3: QUICK-SWAP COVER IMAGE (Bottom Sheet / Modal)
         ========================================================================= */}
      <AnimatePresence>
        {isImageSwapModalOpen && imageSwapTreatment && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white w-full sm:max-w-xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            >
              {/* Header */}
              <div className="px-6 py-4.5 border-b border-slate-150 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-[#003334]/10 text-[#003334] rounded-lg">
                    <ImageIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#003334]">
                      Change Cover Photo
                    </h3>
                    <p className="text-[11px] text-slate-500">{imageSwapTreatment.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsImageSwapModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
                {/* 1. Direct File Upload Button */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Upload from Computer / Device
                  </label>
                  <button
                    type="button"
                    disabled={isUploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-6 border-2 border-dashed border-slate-300 hover:border-[#003334] rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className={`h-6 w-6 text-[#003334] ${isUploadingImage ? 'animate-bounce' : ''}`} />
                    <span className="text-xs font-bold text-slate-700">
                      {isUploadingImage ? 'Uploading & Saving to Server...' : 'Click to Upload High-Res Image'}
                    </span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, WebP supported</span>
                  </button>
                </div>

                {/* 2. Choose from Presets */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Or Select from Clinic Curated Aesthetics
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PRESET_CLINIC_PHOTOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCustomImageUrl(preset.url)}
                        className={`group/preset relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all cursor-pointer ${
                          customImageUrl === preset.url
                            ? 'border-[#003334] ring-2 ring-[#003334]/20'
                            : 'border-transparent hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover group-hover/preset:scale-105 transition-transform"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs p-1 text-[9px] font-medium text-white truncate text-center">
                          {preset.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Custom Image URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Or Paste Custom Image URL
                  </label>
                  <input
                    type="text"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] text-xs font-mono text-slate-800"
                  />
                </div>

                {/* Preview */}
                {customImageUrl && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Live Preview
                    </label>
                    <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img
                        src={customImageUrl}
                        alt="Selected Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PRESET_CLINIC_PHOTOS[0].url;
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-150 flex items-center justify-end gap-2.5 bg-slate-50/80">
                <button
                  type="button"
                  onClick={() => setIsImageSwapModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyImageSwap(customImageUrl)}
                  className="bg-[#003334] hover:bg-[#004d4f] text-[#c5a880] hover:text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow cursor-pointer border border-[#c5a880]/30"
                >
                  Apply Cover Photo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 4: DELETE CONFIRMATION
         ========================================================================= */}
      <AnimatePresence>
        {deleteConfirmTreatment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Delete Treatment?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to remove <strong>"{deleteConfirmTreatment.title}"</strong> from the clinic pricing catalog?
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmTreatment(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDeleteTreatment}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 5: RESET CATALOG CONFIRMATION
         ========================================================================= */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Reset Catalog to Defaults?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This will restore all procedures and brochure pricing tiers back to the original database defaults.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetToDefault}
                  className="flex-1 py-2.5 rounded-xl bg-[#003334] hover:bg-[#004d4f] text-[#c5a880] text-xs font-bold transition-all shadow cursor-pointer border border-[#c5a880]/30"
                >
                  Reset Defaults
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* =========================================================================
          MODAL 6: ADD NEW PARENT BRANCH
         ========================================================================= */}
      <AnimatePresence>
        {isAddBranchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-[#003334]/10 text-[#003334] rounded-xl">
                    <FolderPlus className="h-5 w-5 text-[#c5a880]" />
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#003334]">
                      Add Service Branch
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Create a new top-level parent branch for clinic treatments.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddBranchModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddBranchSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="e.g., Men's Aesthetics, Wellness Lounge"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddBranchModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#003334] hover:bg-[#004d4f] text-[#c5a880] hover:text-white text-xs font-bold transition-all shadow cursor-pointer border border-[#c5a880]/30"
                  >
                    Create Branch
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 7: RENAME PARENT BRANCH
         ========================================================================= */}
      <AnimatePresence>
        {branchToRename && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-[#003334]/10 text-[#003334] rounded-xl">
                    <Edit3 className="h-5 w-5 text-[#c5a880]" />
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#003334]">
                      Rename Service Branch
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Renaming will automatically update all {treatments.filter((t) => matchesParentBranch(t, branchToRename)).length} assigned treatments.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setBranchToRename(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleRenameBranchSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={renameBranchName}
                    onChange={(e) => setRenameBranchName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setBranchToRename(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#003334] hover:bg-[#004d4f] text-[#c5a880] hover:text-white text-xs font-bold transition-all shadow cursor-pointer border border-[#c5a880]/30"
                  >
                    Save Rename
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 8: DELETE PARENT BRANCH WITH SAFE REASSIGNMENT
         ========================================================================= */}
      <AnimatePresence>
        {branchToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">
                    Delete Branch: {branchToDelete.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {treatments.filter((t) => matchesParentBranch(t, branchToDelete)).length} treatments currently belong to this branch.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  Reassign Treatments To:
                </label>
                <select
                  value={reassignBranchTargetId}
                  onChange={(e) => setReassignBranchTargetId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
                >
                  {taxonomy
                    .filter((b) => b.id !== branchToDelete.id)
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        Move treatments to: {b.name}
                      </option>
                    ))}
                  <option value="">Leave treatments Unassigned</option>
                </select>
                <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2.5 leading-relaxed">
                  Removing this branch safely relocates all procedure listings, preserving all pricing and packaging tiers.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBranchToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDeleteBranch}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow cursor-pointer"
                >
                  Delete & Reassign
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 9: ADD NEW SUB-GROUP
         ========================================================================= */}
      <AnimatePresence>
        {isAddSubGroupModalOpen && parentForNewSubGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-[#003334]/10 text-[#003334] rounded-xl">
                    <Plus className="h-5 w-5 text-[#c5a880]" />
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#003334]">
                      Add Specialist Sub-Group
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Adding under branch: <span className="font-semibold text-slate-700">{parentForNewSubGroup.name}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsAddSubGroupModalOpen(false);
                    setParentForNewSubGroup(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubGroupSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Sub-Group Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newSubGroupName}
                    onChange={(e) => setNewSubGroupName(e.target.value)}
                    placeholder="e.g., Profhilo & Bioremodeling, Red Carpet Facials"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddSubGroupModalOpen(false);
                      setParentForNewSubGroup(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#003334] hover:bg-[#004d4f] text-[#c5a880] hover:text-white text-xs font-bold transition-all shadow cursor-pointer border border-[#c5a880]/30"
                  >
                    Add Sub-Group
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 10: RENAME SUB-GROUP
         ========================================================================= */}
      <AnimatePresence>
        {subGroupToRename && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-[#003334]/10 text-[#003334] rounded-xl">
                    <Edit3 className="h-5 w-5 text-[#c5a880]" />
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#003334]">
                      Rename Sub-Group
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Under {subGroupToRename.parentBranch.name} ({treatments.filter((t) => matchesSubGroup(t, subGroupToRename.parentBranch, subGroupToRename.subGroup)).length} treatments will be updated)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSubGroupToRename(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleRenameSubGroupSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Sub-Group Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={renameSubGroupName}
                    onChange={(e) => setRenameSubGroupName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSubGroupToRename(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#003334] hover:bg-[#004d4f] text-[#c5a880] hover:text-white text-xs font-bold transition-all shadow cursor-pointer border border-[#c5a880]/30"
                  >
                    Save Rename
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 11: DELETE SUB-GROUP WITH CASCADE REASSIGNMENT
         ========================================================================= */}
      <AnimatePresence>
        {subGroupToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">
                    Delete Sub-Group: {subGroupToDelete.subGroup.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {treatments.filter((t) => matchesSubGroup(t, subGroupToDelete.parentBranch, subGroupToDelete.subGroup)).length} treatments currently in this sub-group.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  Cascade Options for Assigned Treatments:
                </label>
                <select
                  value={reassignSubGroupTargetId}
                  onChange={(e) => setReassignSubGroupTargetId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
                >
                  {subGroupToDelete.parentBranch.subGroups
                    .filter((s) => s.id !== subGroupToDelete.subGroup.id)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        Move treatments to: {s.name}
                      </option>
                    ))}
                  <option value="">Leave Unassigned (Clear sub-group tag)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubGroupToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDeleteSubGroup}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow cursor-pointer"
                >
                  Delete & Reassign
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
