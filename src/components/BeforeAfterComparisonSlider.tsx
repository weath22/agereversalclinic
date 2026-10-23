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
} from '../lib/adminStore';
import { EXISTING_BEFORE_AFTER_TREATMENT_GROUPS } from '../data/transformationsData';
import Pagination from './Pagination';

interface BeforeAfterComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  treatmentName: string;
  treatmentId?: string;
  treatmentCategory?: string;
  clinicalComparisonMedia?: ClinicalComparisonMediaConfig;
  customBeforeAfterPairs?: Array<{
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
  }>;
  excludedGalleryPairIds?: string[];
}

interface ResolvedSliderPair {
  id: string;
  before: string;
  after: string;
  label: string;
  durationBadge?: string;
  beforeAltText: string;
  afterAltText: string;
  seoTitle: string;
  seoKeywords: string[];
}

export default function BeforeAfterComparisonSlider({
  beforeImage,
  afterImage,
  treatmentName,
  treatmentId,
  treatmentCategory,
  clinicalComparisonMedia,
  customBeforeAfterPairs,
  excludedGalleryPairIds,
}: BeforeAfterComparisonSliderProps) {
  const [galleryConfig, setGalleryConfig] = useState<BeforeAfterGalleryConfig>(() =>
    getBeforeAfterGalleryConfig()
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setGalleryConfig(getBeforeAfterGalleryConfig());
    if (typeof window !== 'undefined' && !window.localStorage.getItem('homepage_gallery_config_v6')) {
      fetchRemoteBeforeAfterGalleryConfig().then((remote) => {
        if (remote) setGalleryConfig(remote);
      });
    }
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

  // Reset pagination to page 1 when switching treatments
  useEffect(() => {
    setCurrentIndex(0);
  }, [treatmentId, treatmentName]);

  const effectiveBefore = clinicalComparisonMedia?.beforeImage?.url || beforeImage;
  const effectiveAfter = clinicalComparisonMedia?.afterImage?.url || afterImage;
  const effectiveLabel =
    clinicalComparisonMedia?.caseLabel || `Target Aesthetic: ${treatmentName}`;

  const pairs = useMemo<ResolvedSliderPair[]>(() => {
    const normId = (treatmentId || '').toLowerCase().trim();
    const normName = (treatmentName || '').toLowerCase().trim();
    const normCategory = (treatmentCategory || '').toLowerCase().trim();

    // Flatten all non-hidden pairs from the Before & After Gallery config
    const excludedSet = new Set((excludedGalleryPairIds || []).map((id) => (id || '').toLowerCase().trim()));
    const allAdminPairs: Array<{ pair: BeforeAfterPair; groupId: string; groupName: string }> = [];
    (galleryConfig?.categories || []).forEach((cat) => {
      (cat.pairs || []).forEach((p) => {
        if (!p.hidden && p.beforeImage && p.afterImage && !excludedSet.has((p.id || '').toLowerCase().trim())) {
          allAdminPairs.push({
            pair: p,
            groupId: cat.id,
            groupName: cat.name,
          });
        }
      });
    });

    const toResolved = (p: BeforeAfterPair, groupName: string): ResolvedSliderPair => {
      const durationBadge = [
        p.duration,
        p.sessions && (!p.duration || !p.duration.toLowerCase().includes('session'))
          ? `${p.sessions} ${p.sessions === 1 ? 'Session' : 'Sessions'}`
          : null,
      ]
        .filter(Boolean)
        .join(' • ');

      return {
        id: p.id,
        before: p.beforeImage,
        after: p.afterImage,
        label: p.title || `${treatmentName} Clinical Case`,
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
            : [`${treatmentName.toLowerCase()} before and after`, `${groupName.toLowerCase()} london`],
      };
    };

    // 1. Direct Linked Treatment matches (by linkedTreatmentId, linkedTreatmentTitle, or case title)
    const directMatches: ResolvedSliderPair[] = [];
    // 2. Same Treatment Group matches
    const groupMatches: ResolvedSliderPair[] = [];
    // 3. Other gallery pairs
    const otherGalleryMatches: ResolvedSliderPair[] = [];

    // Identify which Treatment Group IDs match this service page's category or name
    const matchingGroupIds = new Set<string>();
    EXISTING_BEFORE_AFTER_TREATMENT_GROUPS.forEach((g) => {
      const pCat = g.pricingCategory.toLowerCase();
      const tCat = g.transformationCategory.toLowerCase();
      const gName = g.name.toLowerCase();
      if (
        (normCategory &&
          (normCategory.includes(pCat) ||
            pCat.includes(normCategory) ||
            normCategory.includes(tCat) ||
            normCategory.includes(gName))) ||
        (normName &&
          ((normName.includes('hair') && g.id === 'clinical-hair') ||
            ((normName.includes('scar') || normName.includes('acne') || normName.includes('peel') || normName.includes('laser')) &&
              g.id === 'acne-scarring') ||
            ((normName.includes('filler') || normName.includes('lip') || normName.includes('jaw') || normName.includes('morpheus')) &&
              g.id === 'facial-harmony') ||
            ((normName.includes('body') || normName.includes('sculpt') || normName.includes('fat') || normName.includes('aqualyx') || normName.includes('buttock')) &&
              g.id === 'body-sculpting') ||
            ((normName.includes('facial') || normName.includes('hydra')) &&
              g.id === 'advanced-facials') ||
            ((normName.includes('exosome') || normName.includes('profhilo') || normName.includes('ultherapy') || normName.includes('anti-aging')) &&
              g.id === 'anti-aging')))
      ) {
        matchingGroupIds.add(g.id);
      }
    });

    allAdminPairs.forEach(({ pair, groupId, groupName }) => {
      const pLinkedId = (pair.linkedTreatmentId || '').toLowerCase().trim();
      const pLinkedTitle = (pair.linkedTreatmentTitle || '').toLowerCase().trim();
      const pTitle = (pair.title || '').toLowerCase().trim();

      const isDirectMatch =
        (normId &&
          pLinkedId &&
          (pLinkedId === normId ||
            pLinkedId.includes(normId) ||
            normId.includes(pLinkedId))) ||
        (normName &&
          pLinkedTitle &&
          (pLinkedTitle === normName ||
            pLinkedTitle.includes(normName) ||
            normName.includes(pLinkedTitle))) ||
        (normId && normId.length >= 3 && (pLinkedTitle.includes(normId) || pTitle.includes(normId)));

      if (isDirectMatch) {
        directMatches.push(toResolved(pair, groupName));
      } else if (matchingGroupIds.has(groupId) || (pair.treatmentGroupId && matchingGroupIds.has(pair.treatmentGroupId))) {
        groupMatches.push(toResolved(pair, groupName));
      } else {
        otherGalleryMatches.push(toResolved(pair, groupName));
      }
    });

    // Treatment's own primary comparison pair
    const primaryTreatmentPair: ResolvedSliderPair = {
      id: `primary-${normId || 'case'}`,
      before: effectiveBefore,
      after: effectiveAfter,
      label: effectiveLabel,
      beforeAltText:
        clinicalComparisonMedia?.beforeImage?.altText ||
        `${treatmentName} Before Treatment at Age Reversal Clinics London`,
      afterAltText:
        clinicalComparisonMedia?.afterImage?.altText ||
        `${treatmentName} After Treatment Result at Age Reversal Clinics London`,
      seoTitle:
        clinicalComparisonMedia?.beforeImage?.seoTitle ||
        `${treatmentName} Before & After Result | Age Reversal Clinics`,
      seoKeywords: [
        `${treatmentName.toLowerCase()} before and after`,
        `age reversal clinics ${treatmentName.toLowerCase()} results`,
      ],
    };

    // Fallback clinical cases if gallery has fewer than 8 items
    const fallbackCases: ResolvedSliderPair[] = [
      {
        id: 'fallback-1',
        before:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
        after:
          'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY',
        label: 'Clinical Trial: Volumetric Resurfacing',
        beforeAltText: `${treatmentName} Before Volumetric Resurfacing`,
        afterAltText: `${treatmentName} After Volumetric Resurfacing`,
        seoTitle: `${treatmentName} Volumetric Resurfacing Before & After`,
        seoKeywords: [`${treatmentName.toLowerCase()} before and after`],
      },
      {
        id: 'fallback-2',
        before:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
        after:
          'https://lh3.googleusercontent.com/aida/AP1WRLv5evIx7Bexs-9iJGxOP9dKFElgqCjw3duyD5PU_MlEubT0SyTO7PuZhJtmqUZf6JcUhS8jDhV8HW0kBhWUb4MYYalT72IO5pVBeVZs2593mjjAC6tI1ZOA1a9xGgg-M5J5waWMYO9uVD4zle9guZj31tQOME7032wvttEoahsd7HhWFooW0oUTyDgrytGK4oKIN0d2mGO5oLnx-NQ5sF7-OZHtA3a9_sCrUegKiXGZwpy_05469C2zVgo',
        label: 'Clinical Trial: Subdermal Lifting & Tone',
        beforeAltText: `${treatmentName} Before Subdermal Lifting`,
        afterAltText: `${treatmentName} After Subdermal Lifting`,
        seoTitle: `${treatmentName} Subdermal Lifting Before & After`,
        seoKeywords: [`${treatmentName.toLowerCase()} before and after`],
      },
      {
        id: 'fallback-3',
        before:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
        after:
          'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM',
        label: 'Clinical Trial: Micro-Focused Tightening',
        beforeAltText: `${treatmentName} Before Micro-Focused Tightening`,
        afterAltText: `${treatmentName} After Micro-Focused Tightening`,
        seoTitle: `${treatmentName} Micro-Focused Tightening Before & After`,
        seoKeywords: [`${treatmentName.toLowerCase()} before and after`],
      },
    ];

    // Custom before/after cases configured directly in ServiceViewDetailsEditor
    const customResolved: ResolvedSliderPair[] = (customBeforeAfterPairs || []).map((cp) => {
      const durationBadge = [
        cp.duration,
        cp.sessions && (!cp.duration || !cp.duration.toLowerCase().includes('session'))
          ? `${cp.sessions} ${cp.sessions === 1 ? 'Session' : 'Sessions'}`
          : null,
      ]
        .filter(Boolean)
        .join(' • ');

      return {
        id: cp.id,
        before: cp.beforeImage,
        after: cp.afterImage,
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
    });

    // Assemble deduplicated list prioritizing custom pairs -> direct matches -> primary -> group matches -> other gallery pairs -> fallbacks
    const orderedCandidates = [
      ...customResolved,
      ...directMatches,
      primaryTreatmentPair,
      ...groupMatches,
      ...otherGalleryMatches,
      ...fallbackCases,
    ];

    const uniqueResult: ResolvedSliderPair[] = [];
    const seenImageKeys = new Set<string>();

    for (const item of orderedCandidates) {
      if (!item.before || !item.after) continue;
      const key = `${item.before.split('?')[0]}|${item.after.split('?')[0]}`;
      if (seenImageKeys.has(key)) continue;
      seenImageKeys.add(key);
      uniqueResult.push(item);
    }

    // Ensure at least 4 pairs for a full page if needed
    return uniqueResult.length > 0 ? uniqueResult : [primaryTreatmentPair];
  }, [
    galleryConfig,
    treatmentId,
    treatmentName,
    treatmentCategory,
    effectiveBefore,
    effectiveAfter,
    effectiveLabel,
    clinicalComparisonMedia,
    customBeforeAfterPairs,
    excludedGalleryPairIds,
  ]);

  // 4 pairs per page on every screen size
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(pairs.length / itemsPerPage));

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visiblePairs = pairs.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  // Schema.org/ImageObject Structured Data for Google Image Search on the Treatment Service Page
  const structuredDataJson = useMemo(() => {
    const imageObjects = pairs.flatMap((p) => {
      const kw = (p.seoKeywords || []).join(', ');
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

  return (
    <div className="flex flex-col space-y-12 w-full">
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
            className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 justify-items-center"
          >
            {visiblePairs.map((pair) => (
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
                      <img
                        src={pair.before}
                        alt={pair.beforeAltText}
                        title={`${pair.seoTitle} (Before)`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                      <img
                        src={pair.after}
                        alt={pair.afterAltText}
                        title={`${pair.seoTitle} (After)`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
              </div>
            ))}
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
