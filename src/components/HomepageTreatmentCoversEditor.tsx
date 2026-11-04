"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  getHomepageTreatmentCoversConfig,
  saveHomepageTreatmentCoversConfig,
  fetchRemoteHomepageTreatmentCoversConfig,
  getPaginatedHomepageTreatmentCovers,
  fetchPaginatedHomepageTreatmentCovers,
  uploadHomepageTreatmentCoverWebp,
  resetHomepageTreatmentCoversToDefaults,
  getTreatmentTaxonomy,
  listProjectAssets,
  loadSiteCustomizations,
} from '../lib/adminStore';
import { HomepageTreatmentCoverImage } from '../types';
import { TreatmentTaxonomyGroup } from '../data/treatmentPricing';
import {
  Plus,
  Search,
  MoreVertical,
  Star,
  Check,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  FolderOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PAGE_SIZE = 12;

interface SubcategoryOption {
  id: string;
  name: string;
  branchCategory: string;
}

function buildAutoCoverSeo(
  subCategoryName: string,
  branchCategory: string,
  customTitle?: string
): {
  altText: string;
  seoTitle: string;
  seoKeywords: string[];
} {
  const cleanSub = (subCategoryName || 'Clinical Aesthetic Treatment').trim();
  const cleanBranch = (branchCategory || 'Face & Injectables').trim();
  const cleanTitle = (customTitle || cleanSub).trim();

  return {
    altText: `${cleanTitle} — ${cleanSub} (${cleanBranch}) at Age Reversal Clinic London`,
    seoTitle: `${cleanTitle} | ${cleanSub} — Age Reversal Clinic`,
    seoKeywords: Array.from(
      new Set([
        cleanSub.toLowerCase(),
        cleanBranch.toLowerCase(),
        `${cleanSub.toLowerCase()} london`,
        `${cleanTitle.toLowerCase()} london`,
        'age reversal clinic treatment',
        'medical aesthetics london',
      ])
    ),
  };
}

export default function HomepageTreatmentCoversEditor() {
  // Taxonomy for subcategories & parent branches
  const [taxonomy, setTaxonomy] = useState<TreatmentTaxonomyGroup[]>(() =>
    getTreatmentTaxonomy()
  );

  // Full items in local state (for instant optimistic updates) + paginated slice
  const [allItems, setAllItems] = useState<HomepageTreatmentCoverImage[]>(() => {
    const cfg = getHomepageTreatmentCoversConfig();
    return cfg.items || [];
  });
  const [paginatedItems, setPaginatedItems] = useState<HomepageTreatmentCoverImage[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [subcategoryCounts, setSubcategoryCounts] = useState<Record<string, number>>({});
  const [defaultGridCount, setDefaultGridCount] = useState<number>(0);

  // Filter & pagination controls
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('ALL');
  const [onlyDefaultGrid, setOnlyDefaultGrid] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Loading / saving / toast states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [errorBanner, setErrorBanner] = useState<string>('');

  // Context menu state (3-dot MoreVertical on card: desktop popover + mobile bottom sheet)
  const [activeMenuCardId, setActiveMenuCardId] = useState<string | null>(null);
  const [isTopActionsMenuOpen, setIsTopActionsMenuOpen] = useState<boolean>(false);

  // Add / Edit Modal (Desktop Modal & Mobile Bottom Sheet)
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingCover, setEditingCover] = useState<HomepageTreatmentCoverImage | null>(null);
  const [formSubCategoryId, setFormSubCategoryId] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formCaption, setFormCaption] = useState<string>('');
  const [formShowInDefaultGrid, setFormShowInDefaultGrid] = useState<boolean>(true);
  const [formHidden, setFormHidden] = useState<boolean>(false);
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [formAdditionalUrls, setFormAdditionalUrls] = useState<string[]>([]);
  const [formAltText, setFormAltText] = useState<string>('');
  const [formSeoTitle, setFormSeoTitle] = useState<string>('');
  const [formSeoKeywords, setFormSeoKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState<string>('');
  const [isSeoAccordionOpen, setIsSeoAccordionOpen] = useState<boolean>(false);
  const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadedModalCoverIds, setUploadedModalCoverIds] = useState<Record<string, string>>({});

  // Asset Library Picker Sub-Modal
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState<boolean>(false);
  const [serverAssets, setServerAssets] = useState<Array<{ name: string; url: string; location: string }>>([]);
  const [assetSearch, setAssetSearch] = useState<string>('');

  // Delete Confirmation Modal
  const [deletingCover, setDeletingCover] = useState<HomepageTreatmentCoverImage | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? '' : prev));
    }, 3200);
  };

  // Flatten all subcategories from taxonomy + any existing cover items
  const subcategoryOptions = useMemo<SubcategoryOption[]>(() => {
    const map = new Map<string, SubcategoryOption>();
    for (const group of taxonomy) {
      for (const sub of group.subGroups || []) {
        if (sub && sub.id) {
          map.set(sub.id.toLowerCase(), {
            id: sub.id,
            name: sub.name,
            branchCategory: group.name,
          });
        }
      }
    }
    for (const item of allItems) {
      const key = String(item.subCategoryId || '').toLowerCase();
      if (key && !map.has(key)) {
        map.set(key, {
          id: item.subCategoryId,
          name: item.subCategoryName || item.subCategoryId,
          branchCategory: item.branchCategory || 'Face & Injectables',
        });
      }
    }
    return Array.from(map.values());
  }, [taxonomy, allItems]);

  // Subcategories filtered by selected parent branch (if any)
  const visibleSubcategoryPills = useMemo<SubcategoryOption[]>(() => {
    if (selectedBranch === 'ALL') return subcategoryOptions;
    return subcategoryOptions.filter(
      (s) => s.branchCategory.toLowerCase() === selectedBranch.toLowerCase()
    );
  }, [subcategoryOptions, selectedBranch]);

  // Hydrate from remote server & siteCustomizations.json on mount
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    loadSiteCustomizations()
      .then(() => fetchRemoteHomepageTreatmentCoversConfig())
      .then((reconciled) => {
        if (!mounted) return;
        setAllItems(reconciled.items || []);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    const handleTaxonomyUpdated = () => {
      setTaxonomy(getTreatmentTaxonomy());
    };
    const handleCoversUpdated = () => {
      const cfg = getHomepageTreatmentCoversConfig();
      setAllItems(cfg.items || []);
    };

    window.addEventListener('treatment_taxonomy_updated', handleTaxonomyUpdated);
    window.addEventListener('homepage_treatment_covers_updated', handleCoversUpdated);
    return () => {
      mounted = false;
      window.removeEventListener('treatment_taxonomy_updated', handleTaxonomyUpdated);
      window.removeEventListener('homepage_treatment_covers_updated', handleCoversUpdated);
    };
  }, []);

  // Recompute paginated slice whenever filters, page, or allItems change
  useEffect(() => {
    const localPage = getPaginatedHomepageTreatmentCovers({
      page: currentPage,
      limit: PAGE_SIZE,
      subCategoryId: selectedSubCategory === 'ALL' ? undefined : selectedSubCategory,
      branchCategory: selectedBranch === 'ALL' ? undefined : selectedBranch,
      showInDefaultGrid: onlyDefaultGrid ? true : undefined,
      includeHidden: true,
      search: searchQuery,
    });

    setPaginatedItems(localPage.items);
    setTotalCount(localPage.totalCount);
    setTotalPages(localPage.totalPages);
    setSubcategoryCounts(localPage.subcategoryCounts);
    setDefaultGridCount(localPage.defaultGridCount);

    if (currentPage > localPage.totalPages && localPage.totalPages >= 1) {
      setCurrentPage(localPage.totalPages);
    }
  }, [allItems, selectedBranch, selectedSubCategory, onlyDefaultGrid, searchQuery, currentPage]);

  // Also verify paginated query with server when page/filter changes
  useEffect(() => {
    let active = true;
    fetchPaginatedHomepageTreatmentCovers({
      page: currentPage,
      limit: PAGE_SIZE,
      subCategoryId: selectedSubCategory === 'ALL' ? undefined : selectedSubCategory,
      branchCategory: selectedBranch === 'ALL' ? undefined : selectedBranch,
      showInDefaultGrid: onlyDefaultGrid ? true : undefined,
      includeHidden: true,
      search: searchQuery,
    })
      .then((res) => {
        if (!active) return;
        setPaginatedItems(res.items);
        setTotalCount(res.totalCount);
        setTotalPages(res.totalPages);
        setSubcategoryCounts(res.subcategoryCounts);
        setDefaultGridCount(res.defaultGridCount);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [selectedBranch, selectedSubCategory, onlyDefaultGrid, searchQuery, currentPage]);

  const activeMenuCard = useMemo(
    () => allItems.find((c) => c.id === activeMenuCardId) || null,
    [allItems, activeMenuCardId]
  );

  // Persist helper
  const persistItemsList = async (
    nextItems: HomepageTreatmentCoverImage[],
    options?: { deletedIds?: string[]; restoredDefaults?: boolean; toast?: string }
  ) => {
    setIsSaving(true);
    setErrorBanner('');
    try {
      setAllItems(nextItems);
      const saved = await saveHomepageTreatmentCoversConfig(
        { items: nextItems },
        {
          deletedIds: options?.deletedIds,
          restoredDefaults: options?.restoredDefaults,
        }
      );
      setAllItems(saved.items || []);
      if (options?.toast) {
        showToast(options.toast);
      }
    } catch (err) {
      setErrorBanner(String(err));
    } finally {
      setIsSaving(false);
    }
  };

  // Quick toggle "Visible on Homepage Default" directly on card or from menu
  const handleToggleDefaultGrid = async (cover: HomepageTreatmentCoverImage) => {
    const nextVal = !cover.showInDefaultGrid;
    const nextItems = allItems.map((it) =>
      it.id === cover.id
        ? { ...it, showInDefaultGrid: nextVal, updatedAt: Date.now() }
        : it
    );
    await persistItemsList(nextItems, {
      toast: nextVal
        ? `"${cover.subCategoryName}" cover pinned to Homepage Default view`
        : `Removed from Homepage Default view`,
    });
  };

  // Quick toggle Hidden state
  const handleToggleHidden = async (cover: HomepageTreatmentCoverImage) => {
    const nextHidden = !cover.hidden;
    const nextItems = allItems.map((it) =>
      it.id === cover.id
        ? { ...it, hidden: nextHidden, updatedAt: Date.now() }
        : it
    );
    setActiveMenuCardId(null);
    await persistItemsList(nextItems, {
      toast: nextHidden ? 'Cover image hidden' : 'Cover image visible',
    });
  };

  // Reorder card up/down
  const handleMoveOrder = async (cover: HomepageTreatmentCoverImage, direction: 'up' | 'down') => {
    const sorted = [...allItems].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    const idx = sorted.findIndex((it) => it.id === cover.id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const swapped = [...sorted];
    const temp = swapped[idx];
    swapped[idx] = swapped[targetIdx];
    swapped[targetIdx] = temp;

    const reindexed = swapped.map((it, i) => ({
      ...it,
      order: i + 1,
      updatedAt: it.id === cover.id ? Date.now() : it.updatedAt,
    }));
    setActiveMenuCardId(null);
    await persistItemsList(reindexed, {
      toast: `Updated display order`,
    });
  };

  // Open Add Cover Modal (optionally pre-selecting a subcategory)
  const openAddCoverModal = (preselectedSubCatId?: string) => {
    const fallbackSub =
      subcategoryOptions.find(
        (s) =>
          s.id.toLowerCase() ===
          (preselectedSubCatId ||
            (selectedSubCategory !== 'ALL' ? selectedSubCategory : '')).toLowerCase()
      ) || subcategoryOptions[0];

    const subId = fallbackSub?.id || 'facial-skin-care';
    const subName = fallbackSub?.name || 'Facial skin care';
    const branch = fallbackSub?.branchCategory || 'Face & Injectables';
    const seo = buildAutoCoverSeo(subName, branch, subName);

    setEditingCover(null);
    setFormSubCategoryId(subId);
    setFormTitle(subName);
    setFormCaption('45 - 60 Mins');
    setFormShowInDefaultGrid(defaultGridCount < 6);
    setFormHidden(false);
    setFormImageUrl('');
    setFormAdditionalUrls([]);
    setUploadedModalCoverIds({});
    setFormAltText(seo.altText);
    setFormSeoTitle(seo.seoTitle);
    setFormSeoKeywords(seo.seoKeywords);
    setKeywordInput('');
    setIsSeoAccordionOpen(false);
    setActiveMenuCardId(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Cover Modal
  const openEditCoverModal = (cover: HomepageTreatmentCoverImage) => {
    setEditingCover(cover);
    setFormSubCategoryId(cover.subCategoryId);
    setFormTitle(cover.title || cover.subCategoryName);
    setFormCaption(cover.caption || '');
    setFormShowInDefaultGrid(Boolean(cover.showInDefaultGrid));
    setFormHidden(Boolean(cover.hidden));
    setFormImageUrl(cover.imageUrl || '');
    setFormAdditionalUrls([]);
    setUploadedModalCoverIds({});
    setFormAltText(cover.altText || '');
    setFormSeoTitle(cover.seoTitle || '');
    setFormSeoKeywords(Array.isArray(cover.seoKeywords) ? cover.seoKeywords : []);
    setKeywordInput('');
    setIsSeoAccordionOpen(false);
    setActiveMenuCardId(null);
    setIsFormModalOpen(true);
  };

  // Handle subcategory change inside modal
  const handleModalSubCategoryChange = (newSubCatId: string) => {
    setFormSubCategoryId(newSubCatId);
    const matched = subcategoryOptions.find(
      (s) => s.id.toLowerCase() === newSubCatId.toLowerCase()
    );
    if (matched) {
      if (!editingCover) {
        setFormTitle(matched.name);
      }
      const seo = buildAutoCoverSeo(
        matched.name,
        matched.branchCategory,
        editingCover ? formTitle : matched.name
      );
      setFormAltText(seo.altText);
      setFormSeoTitle(seo.seoTitle);
      setFormSeoKeywords(seo.seoKeywords);
    }
  };

  // Handle single or multi-file WebP upload inside modal
  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      setErrorBanner('Please select valid image files (JPG, PNG, WebP).');
      return;
    }

    const matchedSub =
      subcategoryOptions.find(
        (s) => s.id.toLowerCase() === formSubCategoryId.toLowerCase()
      ) || subcategoryOptions[0];
    const subId = matchedSub?.id || formSubCategoryId || 'facial-skin-care';
    const subName = matchedSub?.name || subId;
    const branch = matchedSub?.branchCategory || 'Face & Injectables';

    setIsUploadingImages(true);
    setErrorBanner('');

    try {
      const uploadedUrls: string[] = [];
      let latestItems = [...allItems];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgressText(
          files.length > 1
            ? `Converting & saving WebP (${i + 1} of ${files.length})...`
            : 'Converting & saving WebP to /assets/treatments/...'
        );

        const isEditingSingle = Boolean(editingCover && i === 0 && files.length === 1);
        const targetCoverId = isEditingSingle
          ? editingCover!.id
          : `cover-${subId.toLowerCase().replace(/[^a-z0-9_-]+/g, '-')}-${Date.now()}-${i + 1}`;

        const seo = buildAutoCoverSeo(subName, branch, formTitle || subName);

        const res = await uploadHomepageTreatmentCoverWebp(file, {
          id: targetCoverId,
          subCategoryId: subId,
          subCategoryName: subName,
          branchCategory: branch,
          title: formTitle || subName,
          caption: formCaption || '45 - 60 Mins',
          altText: formAltText || seo.altText,
          seoTitle: formSeoTitle || seo.seoTitle,
          seoKeywords: formSeoKeywords.length > 0 ? formSeoKeywords : seo.seoKeywords,
          showInDefaultGrid: formShowInDefaultGrid,
          hidden: formHidden,
          order: isEditingSingle ? editingCover!.order : latestItems.length + i + 1,
          previousUrl: isEditingSingle ? editingCover!.imageUrl : undefined,
        });

        if (res.success && (res.versionedUrl || res.url)) {
          const finalUrl = res.versionedUrl || res.url!;
          const cleanUrl = finalUrl.split('?')[0];
          uploadedUrls.push(finalUrl);
          setUploadedModalCoverIds((prev) => ({
            ...prev,
            [finalUrl]: res.id || targetCoverId,
            [cleanUrl]: res.id || targetCoverId,
          }));
          if (res.updatedConfig?.items) {
            latestItems = res.updatedConfig.items;
          }
        } else if (res.error) {
          setErrorBanner(res.error);
        }
      }

      if (uploadedUrls.length > 0) {
        setAllItems(latestItems);
        setFormImageUrl(uploadedUrls[0]);
        if (uploadedUrls.length > 1) {
          setFormAdditionalUrls((prev) => [...prev, ...uploadedUrls.slice(1)]);
          showToast(
            `Uploaded & persisted ${uploadedUrls.length} WebP cover images to "${subName}"!`
          );
        } else {
          showToast(`Cover image saved to /assets/treatments/`);
        }
      }
    } catch (err) {
      setErrorBanner(String(err));
    } finally {
      setIsUploadingImages(false);
      setUploadProgressText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Save Add / Edit Modal
  const handleSaveModalForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImageUrl.trim()) {
      setErrorBanner('Please upload a cover image or select one from the Asset Library.');
      return;
    }

    const matchedSub =
      subcategoryOptions.find(
        (s) => s.id.toLowerCase() === formSubCategoryId.toLowerCase()
      ) || subcategoryOptions[0];
    const subId = matchedSub?.id || formSubCategoryId || 'facial-skin-care';
    const subName = matchedSub?.name || subId;
    const branch = matchedSub?.branchCategory || 'Face & Injectables';
    const autoSeo = buildAutoCoverSeo(subName, branch, formTitle || subName);

    const now = Date.now();

    if (editingCover) {
      const updatedItem: HomepageTreatmentCoverImage = {
        ...editingCover,
        subCategoryId: subId,
        subCategoryName: subName,
        branchCategory: branch,
        imageUrl: formImageUrl.trim(),
        title: (formTitle || subName).trim(),
        caption: formCaption.trim(),
        altText: (formAltText || autoSeo.altText).trim(),
        seoTitle: (formSeoTitle || autoSeo.seoTitle).trim(),
        seoKeywords: formSeoKeywords.length > 0 ? formSeoKeywords : autoSeo.seoKeywords,
        showInDefaultGrid: formShowInDefaultGrid,
        hidden: formHidden,
        updatedAt: now,
      };

      const existsInAll = allItems.some((it) => it.id === editingCover.id);
      const nextItems = existsInAll
        ? allItems.map((it) => (it.id === editingCover.id ? updatedItem : it))
        : [...allItems, updatedItem];

      setIsFormModalOpen(false);
      await persistItemsList(nextItems, {
        toast: `Saved changes to "${subName}" cover image`,
      });
      return;
    }

    // Adding new cover(s)
    // Check if handleFilesSelected already auto-upserted the uploaded URLs into `allItems`
    const allUploadedUrls = [formImageUrl.trim(), ...formAdditionalUrls.map((u) => u.trim())].filter(
      Boolean
    );
    const nextItems = [...allItems];

    for (let i = 0; i < allUploadedUrls.length; i++) {
      const url = allUploadedUrls[i];
      const cleanUrl = url.split('?')[0];
      const trackedUploadId = uploadedModalCoverIds[url] || uploadedModalCoverIds[cleanUrl];

      const existingIdx = trackedUploadId
        ? nextItems.findIndex((it) => it.id === trackedUploadId)
        : nextItems.findIndex(
            (it) =>
              !String(it.id).startsWith('cover-seed-') &&
              (it.imageUrl === url || it.imageUrl.split('?')[0] === cleanUrl)
          );

      if (existingIdx !== -1) {
        nextItems[existingIdx] = {
          ...nextItems[existingIdx],
          subCategoryId: subId,
          subCategoryName: subName,
          branchCategory: branch,
          imageUrl: url,
          title: (formTitle || subName).trim(),
          caption: formCaption.trim(),
          altText: (formAltText || autoSeo.altText).trim(),
          seoTitle: (formSeoTitle || autoSeo.seoTitle).trim(),
          seoKeywords: formSeoKeywords.length > 0 ? formSeoKeywords : autoSeo.seoKeywords,
          showInDefaultGrid: formShowInDefaultGrid,
          hidden: formHidden,
          updatedAt: now,
        };
      } else {
        const newId =
          trackedUploadId ||
          `cover-${subId.toLowerCase().replace(/[^a-z0-9_-]+/g, '-')}-${now}-${i + 1}`;
        nextItems.push({
          id: newId,
          subCategoryId: subId,
          subCategoryName: subName,
          branchCategory: branch,
          imageUrl: url,
          title: (formTitle || subName).trim(),
          caption: formCaption.trim(),
          altText: (formAltText || autoSeo.altText).trim(),
          seoTitle: (formSeoTitle || autoSeo.seoTitle).trim(),
          seoKeywords: formSeoKeywords.length > 0 ? formSeoKeywords : autoSeo.seoKeywords,
          showInDefaultGrid: formShowInDefaultGrid,
          hidden: formHidden,
          order: nextItems.length + 1,
          updatedAt: now,
        });
      }
    }

    setUploadedModalCoverIds({});
    setIsFormModalOpen(false);
    await persistItemsList(nextItems, {
      toast:
        allUploadedUrls.length > 1
          ? `Saved ${allUploadedUrls.length} cover images to "${subName}"`
          : `Added cover image to "${subName}"`,
    });
  };

  // Confirm delete cover image
  const handleConfirmDelete = async () => {
    if (!deletingCover) return;
    const target = deletingCover;
    setDeletingCover(null);
    setActiveMenuCardId(null);

    const remaining = allItems.filter((it) => it.id !== target.id);
    await persistItemsList(remaining, {
      deletedIds: [target.id],
      toast: `Deleted cover image from "${target.subCategoryName}"`,
    });
  };

  // Confirm reset to defaults
  const handleConfirmResetDefaults = async () => {
    setIsResetConfirmOpen(false);
    setIsTopActionsMenuOpen(false);
    setIsSaving(true);
    try {
      const restored = await resetHomepageTreatmentCoversToDefaults();
      setAllItems(restored.items || []);
      setCurrentPage(1);
      showToast('Restored default Homepage Treatment Cover Images');
    } catch (err) {
      setErrorBanner(String(err));
    } finally {
      setIsSaving(false);
    }
  };

  // Load assets when Asset Picker Sub-Modal opens
  const openAssetLibraryPicker = async () => {
    setIsAssetPickerOpen(true);
    try {
      const assets = await listProjectAssets();
      const imageAssets = assets
        .filter((a) => a.mediaType !== 'video')
        .map((a) => ({
          name: a.name,
          url: a.url,
          location: a.location || 'Media Library',
        }));
      setServerAssets(imageAssets);
    } catch {}
  };

  const filteredServerAssets = useMemo(() => {
    const q = assetSearch.trim().toLowerCase();
    return serverAssets.filter((a) => {
      if (!q) return true;
      return a.name.toLowerCase().includes(q) || a.url.toLowerCase().includes(q);
    });
  }, [serverAssets, assetSearch]);

  const handleAddKeywordChip = () => {
    const clean = keywordInput.trim();
    if (!clean) return;
    if (!formSeoKeywords.includes(clean)) {
      setFormSeoKeywords([...formSeoKeywords, clean]);
    }
    setKeywordInput('');
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-2.5 bg-[#003334] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#c5a880]/40 text-xs font-bold"
          >
            <CheckCircle2 className="h-4 w-4 text-[#c5a880] shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Banner */}
      {errorBanner && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl flex items-center justify-between gap-3 text-xs font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorBanner('')}
            className="p-1 hover:bg-rose-100 rounded-lg text-rose-600 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Minimal Top Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#003334]/8 text-[#003334]">
                <Layers className="h-3 w-3 text-[#c5a880]" />
                Homepage Treatments Cover Gallery
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                {defaultGridCount} on Homepage Default
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {allItems.length} Total Covers
              </span>
            </div>
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#003334]">
              Treatments Cover Images
            </h2>
          </div>

          {/* Search + Primary Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:flex-initial sm:w-56">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search subcategory or label..."
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]/20 focus:border-[#003334]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                openAddCoverModal(selectedSubCategory !== 'ALL' ? selectedSubCategory : undefined)
              }
              className="inline-flex items-center justify-center gap-2 bg-[#003334] hover:bg-[#144b4c] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 text-[#c5a880]" />
              <span>
                {selectedSubCategory !== 'ALL'
                  ? 'Add to Subcategory'
                  : 'Add Cover Image'}
              </span>
            </button>

            {/* More Options Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTopActionsMenuOpen((prev) => !prev)}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-[#003334] transition-colors cursor-pointer"
                title="More options"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {isTopActionsMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsTopActionsMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl z-40 p-1.5 space-y-1"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setIsTopActionsMenuOpen(false);
                          setOnlyDefaultGrid((prev) => !prev);
                          setCurrentPage(1);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        <Star className="h-3.5 w-3.5 text-amber-500" />
                        <span>
                          {onlyDefaultGrid
                            ? 'Show All Cover Images'
                            : 'Filter: Default Grid Only'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsTopActionsMenuOpen(false);
                          setIsResetConfirmOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Restore Default Covers</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Parent Branch Compact Selector + "On Homepage Default" Quick Filter */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => {
                setSelectedBranch('ALL');
                setSelectedSubCategory('ALL');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedBranch === 'ALL'
                  ? 'bg-[#003334] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              All Branches
            </button>
            {taxonomy.map((branch) => {
              const active = selectedBranch.toLowerCase() === branch.name.toLowerCase();
              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => {
                    setSelectedBranch(branch.name);
                    setSelectedSubCategory('ALL');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#003334] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {branch.name}
                </button>
              );
            })}
          </div>

          {/* Toggle pill to view/select Homepage Default Grid covers */}
          <button
            type="button"
            onClick={() => {
              setOnlyDefaultGrid((prev) => !prev);
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer shrink-0 border ${
              onlyDefaultGrid
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-2xs'
                : 'bg-amber-50/70 text-amber-900 border-amber-200 hover:bg-amber-100/80'
            }`}
          >
            <Star
              className={`h-3.5 w-3.5 ${
                onlyDefaultGrid ? 'fill-slate-950 text-slate-950' : 'fill-amber-500 text-amber-500'
              }`}
            />
            <span>Homepage Default ({defaultGridCount})</span>
          </button>
        </div>

        {/* Sticky Horizontally Scrollable Subcategory Pills (with "All" Option + Counts) */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => {
              setSelectedSubCategory('ALL');
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
              selectedSubCategory === 'ALL'
                ? 'bg-[#c5a880] text-[#003334] border-[#c5a880] shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-[#003334]/40'
            }`}
          >
            <span>All Subcategories</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                selectedSubCategory === 'ALL'
                  ? 'bg-[#003334]/15 text-[#003334]'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {allItems.length}
            </span>
          </button>

          {visibleSubcategoryPills.map((sub) => {
            const isSelected = selectedSubCategory.toLowerCase() === sub.id.toLowerCase();
            const count = subcategoryCounts[sub.id.toLowerCase()] || 0;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  setSelectedSubCategory(sub.id);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-[#c5a880] text-[#003334] border-[#c5a880] shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#003334]/40'
                }`}
              >
                <span>{sub.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isSelected
                      ? 'bg-[#003334]/15 text-[#003334]'
                      : count > 1
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Subcategory Quick Context Bar (when a specific subcategory is selected) */}
      {selectedSubCategory !== 'ALL' && (
        <div className="bg-[#003334] text-white px-5 py-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#c5a880] uppercase tracking-wider">
              Subcategory:
            </span>
            <span className="font-serif font-bold text-base">
              {subcategoryOptions.find(
                (s) => s.id.toLowerCase() === selectedSubCategory.toLowerCase()
              )?.name || selectedSubCategory}
            </span>
            <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full text-slate-200 font-semibold">
              {totalCount} {totalCount === 1 ? 'cover image' : 'cover images'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openAddCoverModal(selectedSubCategory)}
              className="inline-flex items-center gap-1.5 bg-[#c5a880] hover:bg-[#d4b890] text-[#003334] px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Another Image</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedSubCategory('ALL')}
              className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>View All</span>
            </button>
          </div>
        </div>
      )}

      {/* Clean, Low-Text Visual Card Grid */}
      {isLoading && paginatedItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-[#003334]" />
          <span className="text-xs font-bold">Loading cover images...</span>
        </div>
      ) : paginatedItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ImageIcon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base text-[#003334]">
              No cover images match this filter
            </h3>
            <p className="text-xs text-slate-500">
              Add one or multiple cover images to this treatment subcategory.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              openAddCoverModal(selectedSubCategory !== 'ALL' ? selectedSubCategory : undefined)
            }
            className="inline-flex items-center gap-2 bg-[#003334] text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#c5a880]" />
            <span>Add Cover Image</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedItems.map((cover) => {
            const subTotal =
              subcategoryCounts[String(cover.subCategoryId || '').toLowerCase()] || 1;
            const isMenuOpen = activeMenuCardId === cover.id;

            return (
              <div
                key={cover.id}
                className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
                  cover.hidden
                    ? 'opacity-60 border-slate-200'
                    : cover.showInDefaultGrid
                    ? 'border-amber-300/90 shadow-sm hover:shadow-md'
                    : 'border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300'
                }`}
              >
                {/* Cover Thumbnail Frame */}
                <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                  <img
                    src={cover.imageUrl}
                    alt={cover.altText || cover.subCategoryName}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/assets/images/treatments/specialist-profhilo.jpg';
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/30 pointer-events-none" />

                  {/* Top-Left: Subcategory Pill + Multi-Image Count */}
                  <div className="absolute top-2.5 left-2.5 right-20 flex flex-wrap items-center gap-1.5 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-white text-[10px] font-bold tracking-wide truncate max-w-full">
                      {cover.subCategoryName}
                    </span>
                    {subTotal > 1 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#c5a880] text-[#003334] text-[9px] font-extrabold">
                        {subTotal} imgs
                      </span>
                    )}
                    {cover.hidden && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-600/90 text-white text-[9px] font-bold uppercase">
                        Hidden
                      </span>
                    )}
                  </div>

                  {/* Top-Right: Quick Default Grid Toggle + 3-Dot Action Menu Button */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                    <button
                      type="button"
                      onClick={() => handleToggleDefaultGrid(cover)}
                      title={
                        cover.showInDefaultGrid
                          ? 'Visible on Homepage Default ("All") — Click to remove'
                          : 'Click to show on Homepage Default ("All")'
                      }
                      className={`h-8 px-2.5 rounded-xl flex items-center gap-1 text-[10px] font-extrabold transition-all cursor-pointer backdrop-blur-md ${
                        cover.showInDefaultGrid
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-black/55 text-white/90 hover:bg-black/75'
                      }`}
                    >
                      <Star
                        className={`h-3.5 w-3.5 ${
                          cover.showInDefaultGrid
                            ? 'fill-slate-950 text-slate-950'
                            : 'text-white/90'
                        }`}
                      />
                      <span className="hidden xs:inline">
                        {cover.showInDefaultGrid ? 'Default' : 'Pin'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuCardId(isMenuOpen ? null : cover.id);
                      }}
                      className="h-8 w-8 rounded-xl bg-black/55 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                      aria-label="Cover options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Bottom Overlay: Minimal Label */}
                  <div
                    onClick={() => openEditCoverModal(cover)}
                    className="absolute bottom-0 inset-x-0 p-3 flex items-end justify-between gap-2 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-white font-serif font-bold text-sm truncate leading-snug">
                        {cover.title || cover.subCategoryName}
                      </p>
                      <p className="text-[10px] text-white/75 font-medium truncate">
                        {cover.branchCategory}
                        {cover.caption ? ` • ${cover.caption}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Context Dropdown Menu (sm and up) */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <>
                      <div
                        className="hidden sm:block fixed inset-0 z-20"
                        onClick={() => setActiveMenuCardId(null)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className="hidden sm:block absolute top-12 right-2.5 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl z-30 p-1.5 space-y-0.5"
                      >
                        <button
                          type="button"
                          onClick={() => openEditCoverModal(cover)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-[#003334]" />
                          <span>Edit Cover Image</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuCardId(null);
                            handleToggleDefaultGrid(cover);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          <Star
                            className={`h-3.5 w-3.5 ${
                              cover.showInDefaultGrid
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-slate-400'
                            }`}
                          />
                          <span>
                            {cover.showInDefaultGrid
                              ? 'Remove from Default View'
                              : 'Show on Homepage Default'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openAddCoverModal(cover.subCategoryId)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Add Another to Subcategory</span>
                        </button>

                        <div className="flex items-center gap-1 px-1 py-0.5">
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(cover, 'up')}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <ArrowUp className="h-3 w-3" />
                            <span>Move Earlier</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(cover, 'down')}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <ArrowDown className="h-3 w-3" />
                            <span>Move Later</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleHidden(cover)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          {cover.hidden ? (
                            <>
                              <Eye className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Unhide Cover</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                              <span>Hide Cover</span>
                            </>
                          )}
                        </button>

                        <div className="border-t border-slate-100 my-1" />

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuCardId(null);
                            setDeletingCover(cover);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete Cover</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Page <strong className="text-[#003334]">{currentPage}</strong> of{' '}
            <strong className="text-[#003334]">{totalPages}</strong> ({totalCount} covers)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          MOBILE BOTTOM SHEET: CARD 3-DOT ACTION MENU (< sm screens)
      ===================================================================== */}
      <AnimatePresence>
        {activeMenuCard && (
          <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs">
            <div
              className="flex-1"
              onClick={() => setActiveMenuCardId(null)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="bg-white rounded-t-3xl p-5 space-y-3 shadow-2xl border-t border-slate-200"
            >
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-1" />
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <img
                  src={activeMenuCard.imageUrl}
                  alt={activeMenuCard.subCategoryName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-serif font-bold text-sm text-[#003334] truncate">
                    {activeMenuCard.title || activeMenuCard.subCategoryName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {activeMenuCard.subCategoryName} • {activeMenuCard.branchCategory}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMenuCardId(null)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => openEditCoverModal(activeMenuCard)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-xs font-bold text-slate-800 hover:bg-slate-50"
                >
                  <Edit3 className="h-4 w-4 text-[#003334]" />
                  <span>Edit Cover Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const target = activeMenuCard;
                    setActiveMenuCardId(null);
                    handleToggleDefaultGrid(target);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-xs font-bold text-slate-800 hover:bg-slate-50"
                >
                  <Star
                    className={`h-4 w-4 ${
                      activeMenuCard.showInDefaultGrid
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>
                    {activeMenuCard.showInDefaultGrid
                      ? 'Remove from Homepage Default View'
                      : 'Show on Homepage Default View ("All")'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => openAddCoverModal(activeMenuCard.subCategoryId)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-xs font-bold text-slate-800 hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4 text-emerald-600" />
                  <span>Add Another Image to {activeMenuCard.subCategoryName}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleHidden(activeMenuCard)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-xs font-bold text-slate-800 hover:bg-slate-50"
                >
                  {activeMenuCard.hidden ? (
                    <>
                      <Eye className="h-4 w-4 text-emerald-600" />
                      <span>Unhide Cover Image</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 text-slate-500" />
                      <span>Hide Cover Image</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const target = activeMenuCard;
                    setActiveMenuCardId(null);
                    setDeletingCover(target);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Cover Image</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          ADD / EDIT COVER IMAGE MODAL (Desktop Modal & Mobile Bottom Sheet)
      ===================================================================== */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-[#003334] text-white px-5 py-4 flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a880] block">
                    Homepage Treatments Cover
                  </span>
                  <h3 className="font-serif font-bold text-base sm:text-lg">
                    {editingCover ? 'Edit Cover Image' : 'Add Cover Image(s)'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSaveModalForm} className="p-5 overflow-y-auto space-y-4 flex-1">
                {/* 1. Target Treatment Subcategory Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Treatment Subcategory Option
                  </label>
                  <select
                    value={formSubCategoryId}
                    onChange={(e) => handleModalSubCategoryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-bold text-[#003334] focus:outline-none focus:ring-2 focus:ring-[#003334]"
                  >
                    {taxonomy.map((group) => (
                      <optgroup key={group.id} label={group.name}>
                        {(group.subGroups || []).map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name} (
                            {subcategoryCounts[sub.id.toLowerCase()] || 0} covers)
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* 2. Drag & Drop / Multi-Image WebP Upload + Asset Library Picker */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Cover Image {!editingCover && '(Single or Multiple)'}
                    </label>
                    <button
                      type="button"
                      onClick={openAssetLibraryPicker}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#003334] hover:text-[#236963] cursor-pointer"
                    >
                      <FolderOpen className="h-3.5 w-3.5 text-[#c5a880]" />
                      <span>Choose from Library</span>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple={!editingCover}
                    onChange={(e) => handleFilesSelected(e.target.files)}
                    className="hidden"
                  />

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      handleFilesSelected(e.dataTransfer.files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                      isDragOver
                        ? 'border-[#003334] bg-[#003334]/5'
                        : 'border-slate-200 hover:border-[#003334]/50 bg-slate-50/60'
                    }`}
                  >
                    {formImageUrl ? (
                      <div className="relative aspect-[16/10] w-full bg-slate-100">
                        <img
                          src={formImageUrl}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/35 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-3.5 py-2 rounded-xl bg-white text-[#003334] text-xs font-bold shadow-md flex items-center gap-1.5">
                            <Upload className="h-3.5 w-3.5" />
                            Replace / Add WebP Image
                          </span>
                        </div>
                        {formAdditionalUrls.length > 0 && (
                          <div className="absolute bottom-2.5 left-2.5 bg-[#003334]/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                            +{formAdditionalUrls.length} more image(s) queued
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-8 px-4 text-center space-y-2">
                        <div className="w-10 h-10 rounded-2xl bg-[#003334]/10 text-[#003334] flex items-center justify-center mx-auto">
                          <Upload className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#003334]">
                            Click or drop image(s) here
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Auto-converted to WebP & saved to /assets/treatments/
                          </p>
                        </div>
                      </div>
                    )}

                    {isUploadingImages && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center gap-2 p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-[#003334]" />
                        <span className="text-xs font-bold text-[#003334]">
                          {uploadProgressText || 'Uploading WebP...'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Toggle: Show in Homepage Default View ('All') */}
                <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <div className="flex items-center gap-2.5">
                    <Star
                      className={`h-4 w-4 shrink-0 ${
                        formShowInDefaultGrid
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-amber-600'
                      }`}
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Show in Homepage Default View ("All")
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Display this cover before any subcategory is clicked
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormShowInDefaultGrid((v) => !v)}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer shrink-0 ${
                      formShowInDefaultGrid ? 'bg-[#003334]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        formShowInDefaultGrid ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 4. Compact Optional Label & Caption */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Display Label (Optional)
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g., Profhilo Bio-Remodelling"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Duration / Tag (Optional)
                    </label>
                    <input
                      type="text"
                      value={formCaption}
                      onChange={(e) => setFormCaption(e.target.value)}
                      placeholder="e.g., 45 - 60 Mins"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
                    />
                  </div>
                </div>

                {/* 5. Collapsible SEO & Alt Text Section */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsSeoAccordionOpen((o) => !o)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#c5a880]" />
                      <span>Google Image SEO & Alt Text</span>
                    </span>
                    {isSeoAccordionOpen ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </button>

                  {isSeoAccordionOpen && (
                    <div className="p-3.5 space-y-3 bg-white border-t border-slate-100">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const matched = subcategoryOptions.find(
                              (s) => s.id.toLowerCase() === formSubCategoryId.toLowerCase()
                            );
                            const seo = buildAutoCoverSeo(
                              matched?.name || formSubCategoryId,
                              matched?.branchCategory || 'Face & Injectables',
                              formTitle
                            );
                            setFormAltText(seo.altText);
                            setFormSeoTitle(seo.seoTitle);
                            setFormSeoKeywords(seo.seoKeywords);
                          }}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#003334] bg-[#c5a880]/20 hover:bg-[#c5a880]/35 px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Auto-Fill SEO</span>
                        </button>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Image Alt Text
                        </label>
                        <input
                          type="text"
                          value={formAltText}
                          onChange={(e) => setFormAltText(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          SEO Keywords
                        </label>
                        <div className="flex gap-1.5 mb-2">
                          <input
                            type="text"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddKeywordChip();
                              }
                            }}
                            placeholder="Add keyword..."
                            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                          />
                          <button
                            type="button"
                            onClick={handleAddKeywordChip}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {formSeoKeywords.map((kw) => (
                            <span
                              key={kw}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold"
                            >
                              {kw}
                              <button
                                type="button"
                                onClick={() =>
                                  setFormSeoKeywords(formSeoKeywords.filter((k) => k !== kw))
                                }
                                className="text-slate-400 hover:text-rose-600 cursor-pointer"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingImages || isSaving}
                    className="px-5 py-2.5 rounded-xl bg-[#003334] hover:bg-[#144b4c] text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Check className="h-4 w-4 text-[#c5a880]" />
                    <span>{editingCover ? 'Save Changes' : 'Save Cover'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          ASSET LIBRARY PICKER SUB-MODAL
      ===================================================================== */}
      <AnimatePresence>
        {isAssetPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-serif font-bold text-base text-[#003334]">
                  Select from Clinic Asset Library
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAssetPickerOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 border-b border-slate-100">
                <input
                  type="text"
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                  placeholder="Filter assets by filename..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 flex-1">
                {filteredServerAssets.map((asset) => (
                  <button
                    key={asset.url}
                    type="button"
                    onClick={() => {
                      setFormImageUrl(asset.url);
                      setIsAssetPickerOpen(false);
                    }}
                    className="group rounded-xl border border-slate-200 hover:border-[#003334] overflow-hidden text-left transition-all cursor-pointer bg-slate-50"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-200">
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          DELETE CONFIRMATION MODAL
      ===================================================================== */}
      <AnimatePresence>
        {deletingCover && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-slate-900">
                    Delete Cover Image?
                  </h4>
                  <p className="text-xs text-slate-500">
                    Remove from <strong>{deletingCover.subCategoryName}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingCover(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                >
                  Delete Cover
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          RESTORE DEFAULTS CONFIRMATION MODAL
      ===================================================================== */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-slate-900">
                    Restore Default Covers?
                  </h4>
                  <p className="text-xs text-slate-500">
                    Reset the cover gallery to the 24 default subcategory covers.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetDefaults}
                  className="px-4 py-2 rounded-xl bg-[#003334] hover:bg-[#144b4c] text-white text-xs font-bold cursor-pointer"
                >
                  Restore Defaults
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
