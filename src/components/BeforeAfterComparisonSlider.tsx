import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import {
  BeforeAfterGalleryConfig,
  BeforeAfterPair,
  ClinicalComparisonMediaConfig,
} from '../types';
import {
  getBeforeAfterGalleryConfig,
  fetchRemoteBeforeAfterGalleryConfig,
  getMasterServices,
  normalizeMasterBranch,
} from '../lib/adminStore';
import { EXISTING_BEFORE_AFTER_TREATMENT_GROUPS } from '../data/transformationsData';
import { CLINICAL_AREAS_DB } from '../data/clinicalTreatments';
import Pagination from './Pagination';
import ClinicImageWithPlaceholder from './common/ClinicImageWithPlaceholder';
import { cleanServiceImageUrl } from './treatments/treatmentData';

interface BeforeAfterComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  treatmentName: string;
  treatmentId?: string;
  treatmentCategory?: string;
  subCategoryId?: string;
  subCategoryName?: string;
  clinicalComparisonMedia?: ClinicalComparisonMediaConfig;
  customBeforeAfterPairs?: Array<{
    id: string;
    beforeImage: string;
    afterImage: string;
    singleFrameImage?: string;
    title: string;
    duration?: string;
    sessions?: number | string;
    beforeAltText?: string;
    afterAltText?: string;
    seoTitle?: string;
    seoKeywords?: string[];
  }>;
  excludedGalleryPairIds?: string[];
}

interface ResolvedSliderPair {
  id: string;
  before: string;
  after: string;
  singleFrameImage?: string;
  singleFrameAltText?: string;
  label: string;
  durationBadge?: string;
  beforeAltText: string;
  afterAltText: string;
  seoTitle: string;
  seoKeywords: string[];
}

const STRICT_SUBCATEGORY_ALIASES: Record<string, string> = {
  profhilo: 'profhilo-2ml',
  'profhilo-injectable-hydration': 'profhilo-2ml',
  morpheus8: 'morpheus8-treatment',
  'morpheus8-rf-microneedling': 'morpheus8-treatment',
  polynucleotide: 'salmon-sperm-injection',
  'polynucleotide-skin-regen': 'salmon-sperm-injection',
  'salmon-sperm': 'salmon-sperm-injection',
  exosome: 'salmon-sperm-injection',
  'exosome-regenerative-therapy': 'salmon-sperm-injection',
  'co2-laser': 'co2-laser-from',
  'co-laser-from': 'co2-laser-from',
  prp: 'platelet-rich-plasma-prp',
  'platelet-rich-plasma': 'platelet-rich-plasma-prp',
  emface: 'emface-skin-tightening-and-lifting',
  ultherapy: 'emface-skin-tightening-and-lifting',
  emsculpt: 'emscuplt-body-sculpt-and-tightening',
  emscuplt: 'emscuplt-body-sculpt-and-tightening',
  buttock: 'emscuplt-body-sculpt-and-tightening',
  'dermal-fillers': 'dermal-fillers-1ml',
  'dermal-filler': 'dermal-fillers-1ml',
  lip: 'dermal-fillers-1ml',
  'lip-fillers': 'dermal-fillers-1ml',
  endolift: 'endolift-fiber-lift',
  blepharoplasty: 'endolift-fiber-lift',
  'anti-wrinkle': 'anti-wrinkles-injection',
  'anti-wrinkles': 'anti-wrinkles-injection',
  'anti-wrinkle-s-injection': 'anti-wrinkles-injection',
  aqualyx: 'aqualyx-course-3',
  'iv-drip': 'iv-drip-lounge-course-of-1',
  'iv-drip-lounge': 'iv-drip-lounge-course-of-1',
};

function normalizeSlugKey(value?: string): string {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/@/g, '2')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeCompactKey(value?: string): string {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/@/g, '2')
    .replace(/[^a-z0-9]/g, '');
}

export default function BeforeAfterComparisonSlider({
  treatmentName,
  treatmentId,
  treatmentCategory,
  subCategoryId,
  subCategoryName,
  customBeforeAfterPairs,
  excludedGalleryPairIds,
}: BeforeAfterComparisonSliderProps) {
  const [galleryConfig, setGalleryConfig] = useState<BeforeAfterGalleryConfig>(() =>
    getBeforeAfterGalleryConfig()
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setGalleryConfig(getBeforeAfterGalleryConfig());
    fetchRemoteBeforeAfterGalleryConfig()
      .then((remote) => {
        if (remote) setGalleryConfig(remote);
      })
      .catch(() => {});

    const handleGalleryUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<BeforeAfterGalleryConfig>;
      if (customEvent.detail) {
        setGalleryConfig(customEvent.detail);
      } else {
        setGalleryConfig(getBeforeAfterGalleryConfig());
      }
    };
    window.addEventListener('before_after_gallery_updated', handleGalleryUpdate);
    window.addEventListener('site_customizations_hydrated', handleGalleryUpdate);
    return () => {
      window.removeEventListener('before_after_gallery_updated', handleGalleryUpdate);
      window.removeEventListener('site_customizations_hydrated', handleGalleryUpdate);
    };
  }, []);

  // Reset pagination to page 1 when switching treatments
  useEffect(() => {
    setCurrentIndex(0);
  }, [treatmentId, treatmentName, treatmentCategory, subCategoryId, subCategoryName]);

  const pairs = useMemo<ResolvedSliderPair[]>(() => {
    const rawIdSlug = normalizeSlugKey(treatmentId === 'bespoke' ? '' : treatmentId);
    const nameSlug = normalizeSlugKey(treatmentName);
    const compactName = normalizeCompactKey(treatmentName);

    // 1. Identify exact Treatment Name keys
    const treatmentNameSlugs = new Set<string>([rawIdSlug, nameSlug].filter(Boolean));
    const treatmentNameCompacts = new Set<string>(
      [normalizeCompactKey(rawIdSlug), compactName].filter(Boolean)
    );

    // 2. Identify the Treatment's Subcategory keys
    let resolvedSubCatId = normalizeSlugKey(subCategoryId);
    let resolvedSubCatName = normalizeSlugKey(subCategoryName);

    // Check CLINICAL_AREAS_DB to find which subcategory contains this treatment item
    if (!resolvedSubCatId) {
      for (const area of CLINICAL_AREAS_DB) {
        for (const cat of area.categories) {
          const catSlug = normalizeSlugKey(cat.id);
          const catNameSlug = normalizeSlugKey(cat.name);
          if (treatmentNameSlugs.has(catSlug) || treatmentNameSlugs.has(catNameSlug)) {
            resolvedSubCatId = catSlug;
            resolvedSubCatName = catNameSlug;
            break;
          }
          const foundItem = cat.items.find(
            (i) =>
              treatmentNameSlugs.has(normalizeSlugKey(i.id)) ||
              treatmentNameSlugs.has(normalizeSlugKey(i.name))
          );
          if (foundItem) {
            resolvedSubCatId = catSlug;
            resolvedSubCatName = catNameSlug;
            break;
          }
        }
        if (resolvedSubCatId) break;
      }
    }

    const aliasSubCatId =
      STRICT_SUBCATEGORY_ALIASES[resolvedSubCatId] ||
      STRICT_SUBCATEGORY_ALIASES[rawIdSlug] ||
      STRICT_SUBCATEGORY_ALIASES[nameSlug] ||
      resolvedSubCatId ||
      rawIdSlug ||
      nameSlug;

    const subCategorySlugs = new Set<string>(
      [resolvedSubCatId, resolvedSubCatName, aliasSubCatId, rawIdSlug, nameSlug].filter(Boolean)
    );

    // Match against the 24 Master Services / Treatment Groups
    const masterServices = getMasterServices();
    const matchedMaster = masterServices.find((s) => {
      const sIdSlug = normalizeSlugKey(s.id);
      const sTitleSlug = normalizeSlugKey(s.title);
      const sCompact = normalizeCompactKey(s.title);
      return (
        subCategorySlugs.has(sIdSlug) ||
        subCategorySlugs.has(sTitleSlug) ||
        (compactName && sCompact === compactName)
      );
    });

    if (matchedMaster) {
      subCategorySlugs.add(normalizeSlugKey(matchedMaster.id));
      subCategorySlugs.add(normalizeSlugKey(matchedMaster.title));
    }

    const matchedGroup = EXISTING_BEFORE_AFTER_TREATMENT_GROUPS.find((g) => {
      const gIdSlug = normalizeSlugKey(g.id);
      const gNameSlug = normalizeSlugKey(g.name);
      return subCategorySlugs.has(gIdSlug) || subCategorySlugs.has(gNameSlug);
    });

    if (matchedGroup) {
      subCategorySlugs.add(normalizeSlugKey(matchedGroup.id));
      subCategorySlugs.add(normalizeSlugKey(matchedGroup.name));
    }

    const subCategoryCompacts = new Set<string>(
      Array.from(subCategorySlugs).map((k) => normalizeCompactKey(k)).filter(Boolean)
    );

    const excludedSet = new Set(
      (excludedGalleryPairIds || []).map((id) => (id || '').toLowerCase().trim())
    );

    const toResolved = (p: BeforeAfterPair, groupName: string): ResolvedSliderPair => {
      const durationBadge = [
        p.duration,
        p.sessions && (!p.duration || !p.duration.toLowerCase().includes('session'))
          ? `${p.sessions} ${p.sessions === 1 ? 'Session' : 'Sessions'}`
          : null,
      ]
        .filter(Boolean)
        .join(' • ');

      const cleanSingle = cleanServiceImageUrl(p.singleFrameImage);
      const cleanBefore = cleanServiceImageUrl(p.beforeImage);
      const cleanAfter = cleanServiceImageUrl(p.afterImage);

      return {
        id: p.id,
        before: cleanBefore || cleanSingle,
        after: cleanAfter || cleanSingle,
        singleFrameImage: cleanSingle || undefined,
        singleFrameAltText:
          p.singleFrameAltText ||
          `${p.title || treatmentName} Before & After Result at Age Reversal Clinics London`,
        label: p.title || `${groupName || treatmentName} Clinical Case`,
        durationBadge: durationBadge || undefined,
        beforeAltText:
          p.beforeAltText ||
          `${p.title || treatmentName} Before Treatment at Age Reversal Clinics London`,
        afterAltText:
          p.afterAltText ||
          `${p.title || treatmentName} After Treatment Result at Age Reversal Clinics London`,
        seoTitle:
          p.seoTitle ||
          `${p.title || treatmentName} — Before & After Result | Age Reversal Clinics`,
        seoKeywords:
          p.seoKeywords && p.seoKeywords.length > 0
            ? p.seoKeywords
            : [
                `${treatmentName.toLowerCase()} before and after`,
                `${groupName.toLowerCase()} london`,
              ],
      };
    };

    // Custom before/after cases configured directly on this treatment in ServiceViewDetailsEditor
    const customResolved: ResolvedSliderPair[] = (customBeforeAfterPairs || [])
      .map((cp) => {
        const durationBadge = [
          cp.duration,
          cp.sessions && (!cp.duration || !cp.duration.toLowerCase().includes('session'))
            ? `${cp.sessions} ${cp.sessions === 1 ? 'Session' : 'Sessions'}`
            : null,
        ]
          .filter(Boolean)
          .join(' • ');

        const cleanSingle = cleanServiceImageUrl(cp.singleFrameImage);
        const cleanBefore = cleanServiceImageUrl(cp.beforeImage);
        const cleanAfter = cleanServiceImageUrl(cp.afterImage);

        return {
          id: cp.id,
          before: cleanBefore || cleanSingle,
          after: cleanAfter || cleanSingle,
          singleFrameImage: cleanSingle || undefined,
          label: cp.title || `${treatmentName} Clinical Case`,
          durationBadge: durationBadge || undefined,
          beforeAltText:
            cp.beforeAltText ||
            `${cp.title || treatmentName} Before Treatment at Age Reversal Clinics London`,
          afterAltText:
            cp.afterAltText ||
            `${cp.title || treatmentName} After Treatment Result at Age Reversal Clinics London`,
          seoTitle:
            cp.seoTitle ||
            `${cp.title || treatmentName} — Before & After Result | Age Reversal Clinics`,
          seoKeywords:
            cp.seoKeywords && cp.seoKeywords.length > 0
              ? cp.seoKeywords
              : [`${treatmentName.toLowerCase()} before and after`],
        };
      })
      .filter((cp) => (cp.before && cp.after) || cp.singleFrameImage);

    // Separate buckets:
    // A) Exact Treatment Name matches
    // B) Existing Subcategory image pairs
    const exactTreatmentPairs: ResolvedSliderPair[] = [...customResolved];
    const subCategoryPairs: ResolvedSliderPair[] = [];

    (galleryConfig?.categories || []).forEach((cat) => {
      const catIdSlug = normalizeSlugKey(cat.id);
      const catNameSlug = normalizeSlugKey(cat.name);
      const catCompact = normalizeCompactKey(cat.name);

      const isSubCategoryBucket =
        subCategorySlugs.has(catIdSlug) ||
        subCategorySlugs.has(catNameSlug) ||
        subCategoryCompacts.has(catCompact);

      (cat.pairs || []).forEach((p) => {
        const cleanBefore = cleanServiceImageUrl(p.beforeImage);
        const cleanAfter = cleanServiceImageUrl(p.afterImage);
        const cleanSingle = cleanServiceImageUrl(p.singleFrameImage);
        const hasSplitImages = Boolean(cleanBefore && cleanAfter);
        const hasSingleFrame = Boolean(cleanSingle);
        if (
          p.hidden ||
          (!hasSplitImages && !hasSingleFrame) ||
          excludedSet.has((p.id || '').toLowerCase().trim())
        ) {
          return;
        }

        const pGroupSlug = normalizeSlugKey(p.treatmentGroupId);
        const pLinkedIdSlug = normalizeSlugKey(p.linkedTreatmentId);
        const pLinkedTitleSlug = normalizeSlugKey(p.linkedTreatmentTitle);
        const pLinkedCompact = normalizeCompactKey(p.linkedTreatmentTitle);
        const pTitleSlug = normalizeSlugKey(p.title);
        const pTitleCompact = normalizeCompactKey(p.title);

        const isExactNameMatch =
          (pLinkedIdSlug && treatmentNameSlugs.has(pLinkedIdSlug)) ||
          (pLinkedTitleSlug && treatmentNameSlugs.has(pLinkedTitleSlug)) ||
          (pTitleSlug && treatmentNameSlugs.has(pTitleSlug)) ||
          (pLinkedCompact && treatmentNameCompacts.has(pLinkedCompact)) ||
          (pTitleCompact && treatmentNameCompacts.has(pTitleCompact));

        const isSubCategoryMatch =
          isSubCategoryBucket ||
          (pGroupSlug && subCategorySlugs.has(pGroupSlug)) ||
          (pLinkedIdSlug && subCategorySlugs.has(pLinkedIdSlug)) ||
          (pLinkedTitleSlug && subCategorySlugs.has(pLinkedTitleSlug)) ||
          (pLinkedCompact && subCategoryCompacts.has(pLinkedCompact));

        const resolvedPair = toResolved(p, cat.name);

        if (isExactNameMatch) {
          exactTreatmentPairs.push(resolvedPair);
        }
        if (isSubCategoryMatch) {
          subCategoryPairs.push(resolvedPair);
        }
      });
    });

    const getImageKey = (item: ResolvedSliderPair) =>
      item.singleFrameImage
        ? `single:${item.singleFrameImage.split('?')[0]}`
        : `${item.before.split('?')[0]}|${item.after.split('?')[0]}`;

    // 1. Add unique exact treatment name pairs first
    const uniqueResult: ResolvedSliderPair[] = [];
    const seenImageKeys = new Set<string>();

    for (const item of exactTreatmentPairs) {
      const hasSingle = Boolean(item.singleFrameImage && item.singleFrameImage.trim());
      const hasBeforeAfter = Boolean(item.before && item.before.trim() && item.after && item.after.trim());
      if (!hasSingle && !hasBeforeAfter) continue;
      const key = getImageKey(item);
      if (seenImageKeys.has(key)) continue;
      seenImageKeys.add(key);
      uniqueResult.push(item);
    }

    // 2. If the treatment name has fewer than 4 pairs (or to show all dynamic pairs in its subcategory),
    // pull existing image pairs from its subcategory to fill it up dynamically.
    if (uniqueResult.length < 4) {
      for (const item of subCategoryPairs) {
        const hasSingle = Boolean(item.singleFrameImage && item.singleFrameImage.trim());
        const hasBeforeAfter = Boolean(item.before && item.before.trim() && item.after && item.after.trim());
        if (!hasSingle && !hasBeforeAfter) continue;
        const key = getImageKey(item);
        if (seenImageKeys.has(key)) continue;
        seenImageKeys.add(key);
        uniqueResult.push(item);
      }
    }

    // 3. If no real image pair exists yet, return a single comparison frame with empty URLs
    // so the Before & After cards display the brand logo placeholder until a real image is added.
    if (uniqueResult.length === 0) {
      return [
        {
          id: `placeholder-${rawIdSlug || nameSlug || 'default'}`,
          before: '',
          after: '',
          label: `${treatmentName} Clinical Case`,
          beforeAltText: `${treatmentName} Before Treatment at Age Reversal Clinics London`,
          afterAltText: `${treatmentName} After Treatment Result at Age Reversal Clinics London`,
          seoTitle: `${treatmentName} — Before & After Result | Age Reversal Clinics`,
          seoKeywords: [`${treatmentName.toLowerCase()} before and after`],
        },
      ];
    }

    return uniqueResult;
  }, [
    galleryConfig,
    treatmentId,
    treatmentName,
    treatmentCategory,
    subCategoryId,
    subCategoryName,
    customBeforeAfterPairs,
    excludedGalleryPairIds,
  ]);

  // 4 pairs per page on every screen size
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(pairs.length / itemsPerPage));

  const visiblePairs = pairs.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  // Schema.org/ImageObject Structured Data for Google Image Search on the Treatment Service Page
  const structuredDataJson = useMemo(() => {
    const imageObjects = pairs.flatMap((p) => {
      const kw = (p.seoKeywords || []).join(', ');
      if (p.singleFrameImage && (!p.before || !p.after || p.before === p.after)) {
        return [
          {
            '@type': 'ImageObject',
            contentUrl: p.singleFrameImage,
            name: `${p.seoTitle} (Before & After)`,
            description: p.singleFrameAltText || p.beforeAltText,
            keywords: kw || `${treatmentName}, before and after treatment, Age Reversal Clinics`,
            creator: {
              '@type': 'MedicalBusiness',
              name: 'Age Reversal Clinics',
            },
          },
        ];
      }
      return [
        {
          '@type': 'ImageObject',
          contentUrl: p.before,
          name: `${p.seoTitle} (Before)`,
          description: p.beforeAltText,
          keywords: kw || `${treatmentName}, before treatment, Age Reversal Clinics`,
          creator: {
            '@type': 'MedicalBusiness',
            name: 'Age Reversal Clinics',
          },
        },
        {
          '@type': 'ImageObject',
          contentUrl: p.after,
          name: `${p.seoTitle} (After)`,
          description: p.afterAltText,
          keywords: kw || `${treatmentName}, after treatment result, Age Reversal Clinics`,
          creator: {
            '@type': 'MedicalBusiness',
            name: 'Age Reversal Clinics',
          },
        },
      ];
    });

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: `${treatmentName} — Before & After Clinical Results | Age Reversal Clinics`,
      description: `Verified Before and After clinical photography for ${treatmentName} at Age Reversal Clinics London.`,
      image: imageObjects,
    });
  }, [pairs, treatmentName]);

  if (pairs.length === 0) {
    return null;
  }

  return (
    <div className="pt-16 border-t border-silver-100 max-w-6xl mx-auto w-full flex flex-col space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredDataJson }}
      />

      <div className="flex flex-col items-center text-center space-y-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-rose-gold block">
          Clinical Comparison
        </span>
        <h4 className="text-2xl md:text-3xl font-serif font-bold text-silver-950 flex items-center gap-2 justify-center">
          <Sparkles className="h-6 w-6 text-rose-gold animate-pulse" />
          <span>Expected Visual Outcomes</span>
        </h4>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4">
        <div className="overflow-hidden py-4">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className={`grid grid-cols-1 ${
              visiblePairs.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-2xl mx-auto'
            } gap-12 lg:gap-16 justify-items-center`}
          >
            {visiblePairs.map((pair) => {
              const isSingleFrameOnly = Boolean(
                pair.singleFrameImage &&
                  (!pair.before || !pair.after || pair.before === pair.after)
              );

              return (
                <div
                  key={pair.id}
                  className="flex flex-col items-center space-y-4 w-full"
                >
                  {/* Case label header + duration badge */}
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div className="text-xs font-semibold text-silver-500 uppercase tracking-wider">
                      {pair.label}
                    </div>
                    {pair.durationBadge && (
                      <span className="text-[10px] font-sans font-medium text-silver-600 bg-silver-100/80 border border-silver-200 px-2.5 py-0.5 rounded-full">
                        {pair.durationBadge}
                      </span>
                    )}
                  </div>

                  {isSingleFrameOnly ? (
                    <div className="flex items-center justify-center w-full max-w-lg">
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.03, zIndex: 30 }}
                        transition={{ type: 'spring', stiffness: 90, damping: 15 }}
                        className="bg-white p-3 pb-12 sm:p-4 sm:pb-16 rounded-xs shadow-[0_20px_45px_rgba(0,0,0,0.08)] border border-neutral-100/90 flex flex-col relative group cursor-pointer w-full max-w-[340px] sm:max-w-[420px] z-10"
                      >
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-50 border border-neutral-200/50 rounded-xs">
                          <ClinicImageWithPlaceholder
                            src={pair.singleFrameImage}
                            alt={pair.singleFrameAltText || pair.beforeAltText}
                            title={`${pair.seoTitle} (Before & After)`}
                            loading="lazy"
                            decoding="async"
                            containerClassName="w-full h-full"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            skeletonVariant="light"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="absolute bottom-[20px] sm:bottom-[28px] left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
                          <div className="bg-[#003334] text-white px-4 py-1.5 rounded-full border border-[#003334] font-sans text-[9px] sm:text-[10px] font-bold shadow-[0_2px_10px_rgba(0,0,0,0.1)] tracking-wider uppercase whitespace-nowrap">
                            Before &amp; After
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center justify-center -space-x-12 sm:-space-x-16 md:-space-x-12 lg:-space-x-16 xl:-space-x-20 w-full max-w-2xl">
                      {/* Left Frame: Before */}
                      <motion.div
                        initial={{ opacity: 0, x: -20, rotate: -3 }}
                        animate={{ opacity: 1, x: 0, rotate: -2 }}
                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                        transition={{ type: 'spring', stiffness: 90, damping: 15 }}
                        className="bg-white p-3 pb-12 sm:p-4 sm:pb-16 rounded-xs shadow-[0_20px_45px_rgba(0,0,0,0.08)] border border-neutral-100/90 flex flex-col relative group cursor-pointer flex-1 max-w-[220px] sm:max-w-[280px] md:max-w-[260px] lg:max-w-[320px] xl:max-w-[350px] z-10"
                      >
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-50 border border-neutral-200/50 rounded-xs">
                          <ClinicImageWithPlaceholder
                            src={pair.before}
                            alt={pair.beforeAltText}
                            title={`${pair.seoTitle} (Before)`}
                            loading="lazy"
                            decoding="async"
                            containerClassName="w-full h-full"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            skeletonVariant="light"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="absolute bottom-[20px] sm:bottom-[28px] left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
                          <div className="bg-white px-4 py-1.5 rounded-full border border-neutral-200 text-silver-700 font-sans text-[9px] sm:text-[10px] font-bold shadow-[0_2px_10px_rgba(0,0,0,0.05)] tracking-wider uppercase">
                            Before
                          </div>
                        </div>
                      </motion.div>

                      {/* Right Frame: After */}
                      <motion.div
                        initial={{ opacity: 0, x: 20, rotate: 3 }}
                        animate={{ opacity: 1, x: 0, rotate: 2 }}
                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                        transition={{ type: 'spring', stiffness: 90, damping: 15 }}
                        className="bg-white p-3 pb-12 sm:p-4 sm:pb-16 rounded-xs shadow-[0_20px_45px_rgba(0,0,0,0.08)] border border-neutral-100/90 flex flex-col relative group cursor-pointer flex-1 max-w-[220px] sm:max-w-[280px] md:max-w-[260px] lg:max-w-[320px] xl:max-w-[350px] z-20"
                      >
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-50 border border-neutral-200/50 rounded-xs">
                          <ClinicImageWithPlaceholder
                            src={pair.after}
                            alt={pair.afterAltText}
                            title={`${pair.seoTitle} (After)`}
                            loading="lazy"
                            decoding="async"
                            containerClassName="w-full h-full"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            skeletonVariant="light"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="absolute bottom-[20px] sm:bottom-[28px] left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
                          <div className="bg-[#003334] text-white px-4 py-1.5 rounded-full border border-[#003334] font-sans text-[9px] sm:text-[10px] font-bold shadow-[0_2px_10px_rgba(0,0,0,0.1)] tracking-wider uppercase">
                            After
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Dynamic reusable pagination */}
        {totalPages > 1 && (
          <div className="pt-10">
            <Pagination
              currentPage={currentIndex + 1}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentIndex(page - 1)}
            />
          </div>
        )}
      </div>

      <p className="text-[11px] text-silver-500 text-center leading-relaxed font-medium italic max-w-2xl mx-auto px-4">
        *Disclaimer: Photographic records reflect actual clinical transformations at our Harley Street flagship. Individual cell responses and speeds of collagen genesis may vary based on lifestyle, age, and dermal matrices.
      </p>
    </div>
  );
}
