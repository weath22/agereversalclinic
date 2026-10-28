"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  getTreatmentsConfig,
  saveTreatmentsConfig,
  resetTreatmentsConfigToDefaults,
  projectHomepageTreatmentCard,
  fetchPaginatedHomepageTreatments,
  uploadHomepageTreatmentWebpImage,
  getTreatmentTaxonomy,
  HomepageTreatmentCardItem,
} from '../lib/adminStore';
import { TreatmentsConfig } from '../types';
import {
  TreatmentTaxonomyGroup,
  TreatmentSubGroup,
} from '../data/treatmentPricing';
import {
  Sparkles,
  Search,
  Upload,
  Check,
  RefreshCw,
  Wand2,
  Tag,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Image as ImageIcon,
  Globe,
  CheckCircle2,
  AlertCircle,
  Layers,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';

const DEFAULT_PAGE_SIZE = 6;

/**
 * Computes Google Image SEO readiness for a treatment card based on:
 * - Clean image asset URL
 * - Descriptive crawlable alt text (>= 20 chars)
 * - SEO Title attribute (>= 15 chars)
 * - At least 3 targeted SEO keywords
 */
function evaluateCardSeoReadiness(card: HomepageTreatmentCardItem): {
  isReady: boolean;
  score: number;
  label: string;
  missing: string[];
} {
  const missing: string[] = [];
  let score = 0;

  if (card.image && card.image.trim().length > 0) {
    score += 25;
  } else {
    missing.push('Image');
  }

  if (card.imageAlt && card.imageAlt.trim().length >= 20) {
    score += 25;
  } else {
    missing.push('Alt Text');
  }

  if (card.seoTitle && card.seoTitle.trim().length >= 15) {
    score += 25;
  } else {
    missing.push('SEO Title');
  }

  if (Array.isArray(card.seoKeywords) && card.seoKeywords.length >= 3) {
    score += 25;
  } else {
    missing.push('3+ Keywords');
  }

  const isReady = score === 100;
  const label = isReady
    ? 'Google Image SEO Ready'
    : score >= 75
    ? 'Good • Enhance Metadata'
    : 'Needs SEO Optimization';

  return { isReady, score, label, missing };
}

/**
 * Generates clinic + treatment + subcategory + location-optimized Google Image SEO metadata in one click
 */
function buildAutoSeoForCard(card: HomepageTreatmentCardItem): {
  imageAlt: string;
  seoTitle: string;
  seoKeywords: string[];
} {
  const cleanName = (card.name || 'Clinical Aesthetic Treatment').trim();
  const cleanSub = (card.subCategory || cleanName).trim();
  const cleanBranch = (card.tag || 'Face & Injectables').trim();
  const lowerName = cleanName.toLowerCase();
  const lowerSub = cleanSub.toLowerCase();
  const lowerBranch = cleanBranch.toLowerCase();

  const imageAlt = `${cleanName} — ${cleanSub} (${cleanBranch}) at Age Reversal Clinic London`;
  const seoTitle = `${cleanName} | ${cleanSub} — Age Reversal Clinic London`;

  const generatedKeywords = Array.from(
    new Set([
      `${lowerName} london`,
      `${cleanName} Age Reversal Clinic`,
      `${lowerSub} london`,
      `${lowerBranch} london clinic`,
      `non-surgical ${lowerName}`,
      `harley street ${lowerSub}`,
      'age reversal clinic london',
      ...(card.seoKeywords || []),
    ])
  )
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 8);

  return {
    imageAlt,
    seoTitle,
    seoKeywords: generatedKeywords,
  };
}

export default function HomepageTreatmentsEditor() {
  // Dynamic two-tier taxonomy (Parent Branches & Subcategories) from data file / store
  const [taxonomy, setTaxonomy] = useState<TreatmentTaxonomyGroup[]>(() =>
    getTreatmentTaxonomy()
  );

  // Section-level copy & projected card list (strictly needed card & SEO columns)
  const [editorialHeading, setEditorialHeading] = useState<string>('');
  const [editorialSub, setEditorialSub] = useState<string>('');
  const [sectionDescription, setSectionDescription] = useState<string>('');
  const [sectionKeywords, setSectionKeywords] = useState<string[]>([]);
  const [sectionKeywordInput, setSectionKeywordInput] = useState<string>('');

  const [cards, setCards] = useState<HomepageTreatmentCardItem[]>([]);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Two-tier Filter (Parent Branch + Subcategory), Search & Pagination state
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedSubGroupId, setSelectedSubGroupId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  // Per-card keyword input & upload state
  const [cardKeywordInputs, setCardKeywordInputs] = useState<Record<string, string>>({});
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Load initial dynamic config & taxonomy from data files / store
  useEffect(() => {
    const initialTax = getTreatmentTaxonomy();
    setTaxonomy(initialTax);

    const initial = getTreatmentsConfig();
    setEditorialHeading(initial.editorialHeading || '');
    setEditorialSub(initial.editorialSub || '');
    setSectionDescription(initial.description || '');
    setSectionKeywords(Array.isArray(initial.seoKeywords) ? initial.seoKeywords : []);
    setCards(
      (initial.treatments || []).map((item, idx) =>
        projectHomepageTreatmentCard(item, idx)
      )
    );

    // Also verify remote paginated endpoint if no local override is present
    if (
      typeof window !== 'undefined' &&
      !window.localStorage.getItem('homepage_treatments_config')
    ) {
      fetchPaginatedHomepageTreatments({ page: 1, limit: 200 })
        .then((remote) => {
          if (remote && Array.isArray(remote.items) && remote.items.length > 0) {
            setEditorialHeading(remote.sectionMeta.editorialHeading || '');
            setEditorialSub(remote.sectionMeta.editorialSub || '');
            setSectionDescription(remote.sectionMeta.description || '');
            setSectionKeywords(remote.sectionMeta.seoKeywords || []);
            setCards(
              remote.items.map((item, idx) =>
                projectHomepageTreatmentCard(item, idx)
              )
            );
          }
        })
        .catch(() => {});
    }
  }, []);

  // Listen for dynamic updates from Services & Branches, Treatment Pricing, or Taxonomy
  useEffect(() => {
    const handleExternalUpdate = () => {
      setTaxonomy(getTreatmentTaxonomy());
      if (isDirty) return;
      const latest = getTreatmentsConfig();
      setEditorialHeading(latest.editorialHeading || '');
      setEditorialSub(latest.editorialSub || '');
      setSectionDescription(latest.description || '');
      setSectionKeywords(Array.isArray(latest.seoKeywords) ? latest.seoKeywords : []);
      setCards(
        (latest.treatments || []).map((item, idx) =>
          projectHomepageTreatmentCard(item, idx)
        )
      );
    };

    window.addEventListener('treatments_config_updated', handleExternalUpdate);
    window.addEventListener('treatment_taxonomy_updated', handleExternalUpdate);
    window.addEventListener('master_services_updated', handleExternalUpdate);
    return () => {
      window.removeEventListener('treatments_config_updated', handleExternalUpdate);
      window.removeEventListener('treatment_taxonomy_updated', handleExternalUpdate);
      window.removeEventListener('master_services_updated', handleExternalUpdate);
    };
  }, [isDirty]);

  // Reset to page 1 when parent branch, subcategory filter, search, or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBranch, selectedSubGroupId, searchQuery, pageSize]);

  // Helper to match a card to a parent branch from dynamic taxonomy
  const matchesParentBranch = (
    card: HomepageTreatmentCardItem,
    branchNameOrId: string
  ): boolean => {
    if (!branchNameOrId || branchNameOrId === 'All') return true;
    const targetLower = branchNameOrId.toLowerCase().trim();
    const cardTagLower = (card.tag || '').toLowerCase().trim();
    if (cardTagLower === targetLower) return true;

    const matchedBranch = taxonomy.find(
      (b) =>
        b.id.toLowerCase() === targetLower || b.name.toLowerCase() === targetLower
    );
    if (matchedBranch) {
      if (
        cardTagLower === matchedBranch.name.toLowerCase() ||
        cardTagLower === matchedBranch.id.toLowerCase()
      ) {
        return true;
      }
      // Also match if card's subGroupId belongs to this parent branch in taxonomy
      if (
        (matchedBranch.subGroups || []).some(
          (s) =>
            s.id.toLowerCase() === (card.subGroupId || '').toLowerCase() ||
            s.name.toLowerCase() === (card.subCategory || '').toLowerCase()
        )
      ) {
        return true;
      }
    }
    return false;
  };

  // Helper to match a card to a subcategory from dynamic taxonomy
  const matchesSubCategory = (
    card: HomepageTreatmentCardItem,
    sub: TreatmentSubGroup
  ): boolean => {
    const cardSubId = (card.subGroupId || '').toLowerCase().trim();
    const cardSubName = (card.subCategory || '').toLowerCase().trim();
    return (
      cardSubId === sub.id.toLowerCase().trim() ||
      cardSubName === sub.name.toLowerCase().trim()
    );
  };

  // Dynamic Parent Branch list from taxonomy (plus any custom branch tags present on cards)
  const parentBranches = useMemo(() => {
    const list: Array<{ id: string; name: string; subGroups: TreatmentSubGroup[] }> =
      taxonomy.map((b) => ({
        id: b.id,
        name: b.name,
        subGroups: b.subGroups || [],
      }));

    const seenNames = new Set(list.map((b) => b.name.toLowerCase()));
    for (const card of cards) {
      const t = (card.tag || '').trim();
      if (t && !seenNames.has(t.toLowerCase())) {
        seenNames.add(t.toLowerCase());
        list.push({
          id: t.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: t,
          subGroups: [],
        });
      }
    }
    return list;
  }, [taxonomy, cards]);

  // Active Parent Branch object (when a specific parent pill is selected)
  const activeParentBranchObj = useMemo(() => {
    if (selectedBranch === 'All') return null;
    return (
      parentBranches.find(
        (b) =>
          b.name.toLowerCase() === selectedBranch.toLowerCase() ||
          b.id.toLowerCase() === selectedBranch.toLowerCase()
      ) || null
    );
  }, [parentBranches, selectedBranch]);

  // Dynamic Subcategory list for Row 2 Filter Pills (below Parent Filter Pills)
  const availableSubGroups = useMemo(() => {
    const baseSubs: Array<TreatmentSubGroup & { parentName: string }> = [];
    const seenIds = new Set<string>();

    const sourceBranches = activeParentBranchObj
      ? [activeParentBranchObj]
      : parentBranches;

    for (const branch of sourceBranches) {
      for (const sub of branch.subGroups || []) {
        const key = sub.id.toLowerCase();
        if (!seenIds.has(key)) {
          seenIds.add(key);
          baseSubs.push({
            id: sub.id,
            name: sub.name,
            parentName: branch.name,
          });
        }
      }
    }

    // Also include any dynamic subcategories present on cards in the current parent scope
    for (const card of cards) {
      if (selectedBranch !== 'All' && !matchesParentBranch(card, selectedBranch)) {
        continue;
      }
      const subId = (card.subGroupId || '').trim();
      const subName = (card.subCategory || '').trim();
      if (subId && subName && !seenIds.has(subId.toLowerCase())) {
        seenIds.add(subId.toLowerCase());
        baseSubs.push({
          id: subId,
          name: subName,
          parentName: card.tag,
        });
      }
    }

    return baseSubs;
  }, [activeParentBranchObj, parentBranches, cards, selectedBranch]);

  // Parent Branch counts for Row 1 filter pills
  const branchCounts = useMemo(() => {
    const counts: Record<string, number> = { All: cards.length };
    for (const branch of parentBranches) {
      counts[branch.name] = cards.filter((c) =>
        matchesParentBranch(c, branch.name)
      ).length;
    }
    return counts;
  }, [cards, parentBranches]);

  // Subcategory counts for Row 2 filter pills
  const subGroupCounts = useMemo(() => {
    const parentScopedCards =
      selectedBranch === 'All'
        ? cards
        : cards.filter((c) => matchesParentBranch(c, selectedBranch));

    const counts: Record<string, number> = { all: parentScopedCards.length };
    for (const sub of availableSubGroups) {
      counts[sub.id] = parentScopedCards.filter((c) =>
        matchesSubCategory(c, sub)
      ).length;
    }
    return counts;
  }, [cards, selectedBranch, availableSubGroups]);

  // Filtered & searched cards (for selected Parent Branch + selected Subcategory + search query)
  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cards.filter((card) => {
      if (
        selectedBranch !== 'All' &&
        !matchesParentBranch(card, selectedBranch)
      ) {
        return false;
      }
      if (selectedSubGroupId !== 'all') {
        const activeSub = availableSubGroups.find(
          (s) =>
            s.id.toLowerCase() === selectedSubGroupId.toLowerCase() ||
            s.name.toLowerCase() === selectedSubGroupId.toLowerCase()
        );
        if (activeSub) {
          if (!matchesSubCategory(card, activeSub)) return false;
        } else if (
          (card.subGroupId || '').toLowerCase() !== selectedSubGroupId.toLowerCase() &&
          (card.subCategory || '').toLowerCase() !== selectedSubGroupId.toLowerCase()
        ) {
          return false;
        }
      }
      if (q) {
        const haystack = `${card.name} ${card.stepNumber} ${card.tag} ${card.subCategory} ${card.description} ${card.imageAlt} ${card.seoTitle} ${(card.seoKeywords || []).join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [cards, selectedBranch, selectedSubGroupId, availableSubGroups, searchQuery]);

  // Paginated slice for current page
  const totalCount = filteredCards.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedCards = useMemo(() => {
    const offset = (safePage - 1) * pageSize;
    return filteredCards.slice(offset, offset + pageSize);
  }, [filteredCards, safePage, pageSize]);

  // Overall SEO Readiness Stats
  const seoStats = useMemo(() => {
    if (cards.length === 0) return { readyCount: 0, total: 0, percentage: 100 };
    const readyCount = cards.filter((c) => evaluateCardSeoReadiness(c).isReady).length;
    return {
      readyCount,
      total: cards.length,
      percentage: Math.round((readyCount / cards.length) * 100),
    };
  }, [cards]);

  // Handlers for Section Header & Section SEO Keywords
  const handleAddSectionKeyword = () => {
    const trimmed = sectionKeywordInput.trim();
    if (!trimmed) return;
    const additions = trimmed
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const merged = Array.from(new Set([...sectionKeywords, ...additions]));
    setSectionKeywords(merged);
    setSectionKeywordInput('');
    setIsDirty(true);
  };

  const handleRemoveSectionKeyword = (kw: string) => {
    setSectionKeywords((prev) => prev.filter((item) => item !== kw));
    setIsDirty(true);
  };

  const handleAutoGenerateSectionSeo = () => {
    const dynamicBranchKeywords = parentBranches.map(
      (b) => `${b.name.toLowerCase()} london`
    );
    const dynamicSubKeywords = availableSubGroups
      .slice(0, 4)
      .map((s) => `${s.name.toLowerCase()} london`);
    setSectionKeywords(
      Array.from(
        new Set([
          ...sectionKeywords,
          ...dynamicBranchKeywords,
          ...dynamicSubKeywords,
        ])
      )
    );
    setIsDirty(true);
    showToast('Generated dynamic section-level Google SEO keywords');
  };

  // Handlers for individual Bento Card updates
  const updateCardField = <K extends keyof HomepageTreatmentCardItem>(
    cardId: string,
    field: K,
    value: HomepageTreatmentCardItem[K]
  ) => {
    setCards((prev) =>
      prev.map((card, idx) =>
        card.id === cardId
          ? projectHomepageTreatmentCard({ ...card, [field]: value }, idx)
          : card
      )
    );
    setIsDirty(true);
  };

  // Update card's Parent Branch & automatically align Subcategory if needed
  const handleUpdateCardBranch = (cardId: string, newBranchName: string) => {
    const branchObj = parentBranches.find(
      (b) => b.name.toLowerCase() === newBranchName.toLowerCase()
    );
    const firstSub = branchObj?.subGroups?.[0];

    setCards((prev) =>
      prev.map((card, idx) => {
        if (card.id !== cardId) return card;
        const subStillInBranch = branchObj?.subGroups?.some(
          (s) => s.id === card.subGroupId
        );
        return projectHomepageTreatmentCard(
          {
            ...card,
            tag: newBranchName,
            subGroupId: subStillInBranch
              ? card.subGroupId
              : firstSub?.id || card.subGroupId,
            subCategory: subStillInBranch
              ? card.subCategory
              : firstSub?.name || card.subCategory,
          },
          idx
        );
      })
    );
    setIsDirty(true);
  };

  // Update card's Subcategory dynamically from taxonomy
  const handleUpdateCardSubCategory = (cardId: string, newSubGroupId: string) => {
    let foundSub: TreatmentSubGroup | undefined;
    let foundParentName: string | undefined;

    for (const branch of parentBranches) {
      const match = (branch.subGroups || []).find((s) => s.id === newSubGroupId);
      if (match) {
        foundSub = match;
        foundParentName = branch.name;
        break;
      }
    }

    setCards((prev) =>
      prev.map((card, idx) => {
        if (card.id !== cardId) return card;
        return projectHomepageTreatmentCard(
          {
            ...card,
            tag: foundParentName || card.tag,
            subGroupId: foundSub?.id || newSubGroupId,
            subCategory: foundSub?.name || card.subCategory,
          },
          idx
        );
      })
    );
    setIsDirty(true);
  };

  const handleAutoGenerateCardSeo = (card: HomepageTreatmentCardItem) => {
    const generated = buildAutoSeoForCard(card);
    setCards((prev) =>
      prev.map((item, idx) =>
        item.id === card.id
          ? projectHomepageTreatmentCard(
              {
                ...item,
                imageAlt: generated.imageAlt,
                seoTitle: generated.seoTitle,
                seoKeywords: generated.seoKeywords,
              },
              idx
            )
          : item
      )
    );
    setIsDirty(true);
    showToast(`Auto-generated Google Image SEO for "${card.name}"`);
  };

  const handleAutoGenerateAllCardsSeo = () => {
    setCards((prev) =>
      prev.map((card, idx) => {
        const generated = buildAutoSeoForCard(card);
        return projectHomepageTreatmentCard(
          {
            ...card,
            imageAlt: generated.imageAlt,
            seoTitle: generated.seoTitle,
            seoKeywords: generated.seoKeywords,
          },
          idx
        );
      })
    );
    setIsDirty(true);
    showToast(`Auto-generated SEO metadata across all ${cards.length} treatment cards`);
  };

  const handleAddCardKeyword = (cardId: string) => {
    const rawInput = (cardKeywordInputs[cardId] || '').trim();
    if (!rawInput) return;
    const newChips = rawInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setCards((prev) =>
      prev.map((card, idx) => {
        if (card.id !== cardId) return card;
        const merged = Array.from(new Set([...(card.seoKeywords || []), ...newChips]));
        return projectHomepageTreatmentCard({ ...card, seoKeywords: merged }, idx);
      })
    );
    setCardKeywordInputs((prev) => ({ ...prev, [cardId]: '' }));
    setIsDirty(true);
  };

  const handleRemoveCardKeyword = (cardId: string, keywordToRemove: string) => {
    setCards((prev) =>
      prev.map((card, idx) => {
        if (card.id !== cardId) return card;
        const nextKw = (card.seoKeywords || []).filter((k) => k !== keywordToRemove);
        return projectHomepageTreatmentCard({ ...card, seoKeywords: nextKw }, idx);
      })
    );
    setIsDirty(true);
  };

  // Dedicated Clean WebP Image Upload for a Bento Card
  const handleUploadCardImage = async (
    card: HomepageTreatmentCardItem,
    file?: File | null
  ) => {
    if (!file) return;
    setUploadingCardId(card.id);

    try {
      const seoFallback = buildAutoSeoForCard(card);
      const nextAlt = card.imageAlt?.trim() || seoFallback.imageAlt;
      const nextTitle = card.seoTitle?.trim() || seoFallback.seoTitle;
      const nextKeywords =
        Array.isArray(card.seoKeywords) && card.seoKeywords.length > 0
          ? card.seoKeywords
          : seoFallback.seoKeywords;

      const result = await uploadHomepageTreatmentWebpImage({
        id: card.id,
        file,
        previousUrl: card.image,
        name: card.name,
        imageAlt: nextAlt,
        seoTitle: nextTitle,
        seoKeywords: nextKeywords,
      });

      if (result.success && result.url) {
        const updatedCards = cards.map((item, idx) =>
          item.id === card.id
            ? projectHomepageTreatmentCard(
                {
                  ...item,
                  image: result.url!,
                  imageAlt: nextAlt,
                  seoTitle: nextTitle,
                  seoKeywords: nextKeywords,
                },
                idx
              )
            : item
        );
        setCards(updatedCards);

        // Immediately persist so the uploaded WebP image is saved and live on the homepage
        const nextConfig: TreatmentsConfig = {
          editorialHeading: editorialHeading.trim(),
          editorialSub: editorialSub.trim(),
          description: sectionDescription.trim(),
          seoKeywords: sectionKeywords,
          treatments: updatedCards,
        };
        saveTreatmentsConfig(nextConfig);
        setIsDirty(false);
        showToast(`Uploaded clean WebP image for "${card.name}"`);
      } else {
        showToast(result.error || 'Failed to upload WebP image', 'error');
      }
    } catch (err) {
      showToast(`Upload error: ${String(err)}`, 'error');
    } finally {
      setUploadingCardId(null);
      if (fileInputRefs.current[card.id]) {
        fileInputRefs.current[card.id]!.value = '';
      }
    }
  };

  // Primary Save Changes Action
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const nextConfig: TreatmentsConfig = {
        editorialHeading: editorialHeading.trim(),
        editorialSub: editorialSub.trim(),
        description: sectionDescription.trim(),
        seoKeywords: sectionKeywords,
        treatments: cards.map((card, idx) =>
          projectHomepageTreatmentCard(card, idx)
        ),
      };

      const saved = saveTreatmentsConfig(nextConfig);
      setCards(
        (saved.treatments || []).map((item, idx) =>
          projectHomepageTreatmentCard(item, idx)
        )
      );
      setIsDirty(false);
      showToast('Homepage Treatments & Google Image SEO saved and synced!');
    } catch (err) {
      showToast(`Failed to save changes: ${String(err)}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Restore Defaults Action
  const handleRestoreDefaults = () => {
    const reset = resetTreatmentsConfigToDefaults();
    setTaxonomy(getTreatmentTaxonomy());
    setEditorialHeading(reset.editorialHeading || '');
    setEditorialSub(reset.editorialSub || '');
    setSectionDescription(reset.description || '');
    setSectionKeywords(Array.isArray(reset.seoKeywords) ? reset.seoKeywords : []);
    setCards(
      (reset.treatments || []).map((item, idx) =>
        projectHomepageTreatmentCard(item, idx)
      )
    );
    setSelectedBranch('All');
    setSelectedSubGroupId('all');
    setIsDirty(false);
    setConfirmResetOpen(false);
    showToast('Restored default Homepage Treatments configuration from data file');
  };

  // Active Subcategory display name for header badge
  const activeSubCategoryObj = useMemo(() => {
    if (selectedSubGroupId === 'all') return null;
    return (
      availableSubGroups.find(
        (s) =>
          s.id.toLowerCase() === selectedSubGroupId.toLowerCase() ||
          s.name.toLowerCase() === selectedSubGroupId.toLowerCase()
      ) || null
    );
  }, [availableSubGroups, selectedSubGroupId]);

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Floating Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-xs font-bold transition-all ${
            toast.type === 'error'
              ? 'bg-rose-950 text-rose-100 border-rose-700'
              : 'bg-[#003334] text-white border-emerald-500/40'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Section Header & Copy Controls Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-9 h-9 rounded-xl bg-[#003334]/10 flex items-center justify-center text-[#003334]">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-serif font-bold text-xl md:text-2xl text-[#003334]">
                Homepage: Treatments Bento & Image SEO Editor
              </h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Globe className="h-3 w-3" />
                <span>
                  {seoStats.readyCount}/{seoStats.total} Cards SEO Ready ({seoStats.percentage}%)
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-3xl">
              Filter by Parent Branch and Subcategory to manage dedicated clean WebP card images, alt text, SEO titles, and targeted Google Image Search keywords for every subcategory treatment card.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleAutoGenerateAllCardsSeo}
              className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="Auto-generate Google Image SEO metadata across all treatment cards"
            >
              <Wand2 className="h-3.5 w-3.5 text-amber-600" />
              <span>Auto-SEO All Cards</span>
            </button>

            {!confirmResetOpen ? (
              <button
                type="button"
                onClick={() => setConfirmResetOpen(true)}
                className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Restore Defaults</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-300 px-3 py-1.5 rounded-xl">
                <span className="text-[11px] font-bold text-rose-800">Reset all?</span>
                <button
                  type="button"
                  onClick={handleRestoreDefaults}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResetOpen(false)}
                  className="text-slate-600 hover:text-slate-900 px-2 py-1 text-[11px] font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-[#003334] hover:bg-[#1a524f] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              <span>{isDirty ? 'Save & Sync Changes *' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Section Header Copy & Section-Level SEO Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Editorial Watermark (Script Text)
            </label>
            <input
              type="text"
              value={editorialHeading}
              onChange={(e) => {
                setEditorialHeading(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Enter editorial watermark..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] text-sm text-slate-800 font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Main Section Heading
            </label>
            <input
              type="text"
              value={editorialSub}
              onChange={(e) => {
                setEditorialSub(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Enter section heading..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] text-sm text-slate-800 font-medium"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Section Description
            </label>
            <textarea
              rows={2}
              value={sectionDescription}
              onChange={(e) => {
                setSectionDescription(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Describe the clinic's bespoke treatment protocols..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] text-sm text-slate-800 font-medium resize-none"
            />
          </div>

          {/* Section-level SEO Keywords */}
          <div className="space-y-2.5 md:col-span-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-[#003334]" />
                <span>Section-Level SEO Keywords ({sectionKeywords.length})</span>
              </label>
              <button
                type="button"
                onClick={handleAutoGenerateSectionSeo}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#003334] hover:text-emerald-700 cursor-pointer"
              >
                <Wand2 className="h-3 w-3" />
                <span>Auto-Populate Section Keywords</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={sectionKeywordInput}
                onChange={(e) => setSectionKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSectionKeyword();
                  }
                }}
                placeholder="Add section SEO keyword(s), comma-separated..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
              />
              <button
                type="button"
                onClick={handleAddSectionKeyword}
                className="inline-flex items-center gap-1 bg-[#003334] hover:bg-[#1a524f] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>

            {sectionKeywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {sectionKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-medium shadow-2xs"
                  >
                    <span>{kw}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSectionKeyword(kw)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Remove keyword"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two-Tier Filter Bar (Parent Filter Pills + Subcategory Filter Pills), Search & Pagination */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* ROW 1: Dynamic Parent Branch Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedBranch('All');
                setSelectedSubGroupId('all');
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                selectedBranch === 'All'
                  ? 'bg-[#003334] text-white border-[#003334] shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>All</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  selectedBranch === 'All'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200/70 text-slate-600'
                }`}
              >
                {branchCounts.All ?? cards.length}
              </span>
            </button>

            {parentBranches.map((branch) => {
              const active =
                selectedBranch.toLowerCase() === branch.name.toLowerCase() ||
                selectedBranch.toLowerCase() === branch.id.toLowerCase();
              const count = branchCounts[branch.name] ?? 0;
              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => {
                    setSelectedBranch(branch.name);
                    setSelectedSubGroupId('all');
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                    active
                      ? 'bg-[#003334] text-white border-[#003334] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{branch.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Page Size Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="relative min-w-[240px]">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search treatment, subcategory, keyword..."
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 shrink-0">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-medium">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-transparent font-bold text-[#003334] focus:outline-none cursor-pointer"
              >
                <option value={6}>6 cards</option>
                <option value={12}>12 cards</option>
                <option value={24}>24 cards</option>
              </select>
            </div>
          </div>
        </div>

        {/* ROW 2: Dynamic Subcategory Filter Pills (Directly Below Parent Filter Pills) */}
        <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1.5 shrink-0">
            Subcategories:
          </span>

          {/* All Subcategories Pill */}
          <button
            type="button"
            onClick={() => setSelectedSubGroupId('all')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              selectedSubGroupId === 'all'
                ? 'bg-[#003334] text-[#c5a880] border-[#003334] shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>
              {selectedBranch === 'All'
                ? 'All Subcategories'
                : `All ${selectedBranch}`}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                selectedSubGroupId === 'all'
                  ? 'bg-[#c5a880] text-[#003334]'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {subGroupCounts.all ?? 0}
            </span>
          </button>

          {/* Dynamic Subcategory Pills */}
          {availableSubGroups.map((sub) => {
            const isSubActive =
              selectedSubGroupId.toLowerCase() === sub.id.toLowerCase() ||
              selectedSubGroupId.toLowerCase() === sub.name.toLowerCase();
            const count = subGroupCounts[sub.id] ?? 0;

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubGroupId(sub.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  isSubActive
                    ? 'bg-[#003334] text-white border-[#003334] shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{sub.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isSubActive
                      ? 'bg-[#c5a880] text-[#003334]'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Showing Range & Top Pagination Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-1.5">
            <span>
              Showing{' '}
              <span className="font-bold text-slate-800">
                {totalCount === 0 ? 0 : (safePage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-bold text-slate-800">
                {Math.min(safePage * pageSize, totalCount)}
              </span>{' '}
              of <span className="font-bold text-slate-800">{totalCount}</span> treatment cards
            </span>
            {activeSubCategoryObj && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#003334]/10 text-[#003334] font-bold text-[11px]">
                <span>Subcategory: {activeSubCategoryObj.name}</span>
              </span>
            )}
            <span className="text-[11px] text-emerald-700 font-medium">
              (Dynamic data-file projection active)
            </span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed font-bold"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    pageNum === safePage
                      ? 'bg-[#003334] text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed font-bold"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Paginated Subcategory Treatment Cards Grid */}
        {paginatedCards.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
            <ImageIcon className="h-8 w-8 text-slate-400 mx-auto" />
            <div className="text-sm font-bold text-slate-700">
              No treatment cards match your filter
            </div>
            <p className="text-xs text-slate-500">
              Try switching the parent or subcategory filter pill or clearing your search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedCards.map((card) => {
              const readiness = evaluateCardSeoReadiness(card);
              const isUploading = uploadingCardId === card.id;
              const kwInput = cardKeywordInputs[card.id] || '';
              const cardBranchObj =
                parentBranches.find(
                  (b) => b.name.toLowerCase() === (card.tag || '').toLowerCase()
                ) || parentBranches[0];
              const subOptionsForCardBranch =
                cardBranchObj?.subGroups && cardBranchObj.subGroups.length > 0
                  ? cardBranchObj.subGroups
                  : availableSubGroups;

              return (
                <div
                  key={card.id}
                  className="bg-slate-50/60 rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-all"
                >
                  <div>
                    {/* Clean Image Preview Header with Step Badge, Parent Branch, Subcategory & Upload Button */}
                    <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden group">
                      <img
                        src={card.image}
                        alt={card.imageAlt || card.name}
                        title={card.seoTitle || card.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/35" />

                      {/* Top Badges: Step Number, Parent Branch & Subcategory */}
                      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-white font-mono text-[11px] font-bold border border-white/15 shrink-0">
                          #{card.stepNumber}
                        </span>
                        <div className="flex flex-col items-end gap-1 min-w-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-[#003334]/90 backdrop-blur-md text-amber-200 text-[10px] font-bold uppercase tracking-wider border border-white/15 truncate max-w-full">
                            {card.tag}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-[#003334] text-[10px] font-bold truncate max-w-full">
                            {card.subCategory}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Overlay: Card Title & One-Click WebP Upload Button */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-serif font-bold text-white text-base leading-snug truncate">
                            {card.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-white/80">
                            <Clock className="h-3 w-3 text-amber-300 shrink-0" />
                            <span>{card.duration}</span>
                          </div>
                        </div>

                        <input
                          ref={(el) => {
                            fileInputRefs.current[card.id] = el;
                          }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleUploadCardImage(card, e.target.files?.[0])
                          }
                        />
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => fileInputRefs.current[card.id]?.click()}
                          className="inline-flex items-center gap-1.5 bg-white/95 hover:bg-white text-[#003334] px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-60"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#003334]" />
                              <span>Converting WebP...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-3.5 w-3.5 text-[#003334]" />
                              <span>Upload WebP</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Card Body Controls */}
                    <div className="p-4 space-y-4">
                      {/* Live SEO Readiness Status Bar */}
                      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/70">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            readiness.isReady
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {readiness.isReady ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Sparkles className="h-3 w-3 text-amber-600" />
                          )}
                          <span>{readiness.label}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => handleAutoGenerateCardSeo(card)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#003334] hover:text-emerald-700 bg-white border border-slate-200 hover:border-emerald-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                          title="Auto-Generate clinic + treatment + subcategory + location-optimized Alt Text, Title & Keywords"
                        >
                          <Wand2 className="h-3 w-3 text-amber-600" />
                          <span>Auto-Generate SEO</span>
                        </button>
                      </div>

                      {/* Direct WebP / Asset URL Input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Clean WebP Image URL (Homepage Treatments Only)
                        </label>
                        <input
                          type="text"
                          value={card.image}
                          onChange={(e) =>
                            updateCardField(card.id, 'image', e.target.value)
                          }
                          placeholder="/assets/treatments/homepage-..."
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#003334]"
                        />
                      </div>

                      {/* Dynamic Step #, Parent Branch & Subcategory Selectors */}
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase block">
                            Step #
                          </label>
                          <input
                            type="text"
                            value={card.stepNumber}
                            onChange={(e) =>
                              updateCardField(card.id, 'stepNumber', e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-bold text-slate-800"
                          />
                        </div>
                        <div className="col-span-9 space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase block">
                            Parent Branch
                          </label>
                          <select
                            value={card.tag}
                            onChange={(e) =>
                              handleUpdateCardBranch(card.id, e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
                          >
                            {parentBranches.map((branch) => (
                              <option key={branch.id} value={branch.name}>
                                {branch.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-12 space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase block">
                            Subcategory
                          </label>
                          <select
                            value={card.subGroupId}
                            onChange={(e) =>
                              handleUpdateCardSubCategory(card.id, e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-[#003334] focus:outline-none focus:ring-2 focus:ring-[#003334]"
                          >
                            {subOptionsForCardBranch.map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                {sub.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Google Image SEO Controls Box */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#003334] flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span>Google Image Search SEO</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {readiness.score}% Score
                          </span>
                        </div>

                        {/* Image Alt Text (alt) */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase block">
                            Image Alt Text (alt attribute)
                          </label>
                          <input
                            type="text"
                            value={card.imageAlt}
                            onChange={(e) =>
                              updateCardField(card.id, 'imageAlt', e.target.value)
                            }
                            placeholder={`${card.name} — ${card.subCategory} (${card.tag}) at Age Reversal Clinic London`}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
                          />
                        </div>

                        {/* SEO Title (title attribute) */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase block">
                            SEO Title (title / hover attribute)
                          </label>
                          <input
                            type="text"
                            value={card.seoTitle}
                            onChange={(e) =>
                              updateCardField(card.id, 'seoTitle', e.target.value)
                            }
                            placeholder={`${card.name} | ${card.subCategory} — Age Reversal Clinic`}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
                          />
                        </div>

                        {/* SEO Keywords Tag Manager */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-between">
                            <span>SEO Keywords ({(card.seoKeywords || []).length})</span>
                            <span className="text-[9px] font-normal text-slate-400">
                              Press Enter to add
                            </span>
                          </label>

                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={kwInput}
                              onChange={(e) =>
                                setCardKeywordInputs((prev) => ({
                                  ...prev,
                                  [card.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCardKeyword(card.id);
                                }
                              }}
                              placeholder="Add keyword..."
                              className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddCardKeyword(card.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shrink-0"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {(card.seoKeywords || []).length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1 max-h-24 overflow-y-auto">
                              {(card.seoKeywords || []).map((kw) => (
                                <span
                                  key={kw}
                                  className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-medium"
                                >
                                  <span>{kw}</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveCardKeyword(card.id, kw)
                                    }
                                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                                  >
                                    <X className="h-2.5 w-2.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Pagination & Save Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {totalPages > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous Page</span>
              </button>
              <span className="text-xs font-bold text-slate-600 px-2">
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Next Page</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              All {totalCount} matching cards displayed
            </div>
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#003334] hover:bg-[#1a524f] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              <span>Save & Sync Homepage Treatments</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
