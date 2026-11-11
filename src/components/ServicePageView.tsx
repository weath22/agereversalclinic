import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { TREATMENT_DETAILS_DB, DEFAULT_TREATMENT_DETAILS, populateTreatmentMediaDefaults, cleanServiceImageUrl } from './treatments/treatmentData';
import { CLINICAL_AREAS_DB } from '../data/clinicalTreatments';
import {
  getTreatmentDetailsConfig,
  getTreatmentDetailsConfigDeferred,
  loadSiteCustomizations,
  getMasterServices,
  normalizeMasterBranch,
} from '../lib/adminStore';
import { SpecialistArea, TreatmentMediaItem } from '../types';
import BeforeAfterComparisonSlider from './BeforeAfterComparisonSlider';
import SkinLayerTargets from './SkinLayerTargets';
import PrePostCareGuidelines from './PrePostCareGuidelines';
import ServiceFAQ from './ServiceFAQ';
import HowItWorksTimeline from './HowItWorksTimeline';
import ServiceHero from './ServiceHero';
import ServiceOverview from './ServiceOverview';
import ClinicalExpectations from './ClinicalExpectations';
import TargetConcerns from './TargetConcerns';
import ServiceBottomCTA from './ServiceBottomCTA';
import Testimonials from './Testimonials';
import SpecialOffers from './SpecialOffers';
import ClinicalSEOHead from './ClinicalSEOHead';
import ClinicImageWithPlaceholder from './common/ClinicImageWithPlaceholder';

interface ServicePageViewProps {
  treatmentName: string;
  onClose: () => void;
  onBook: (serviceName: string) => void;
}

export default function ServicePageView({ treatmentName, onClose, onBook }: ServicePageViewProps) {
  const [masterServices, setMasterServices] = useState<SpecialistArea[]>(() => getMasterServices());
  const [detailsConfig, setDetailsConfig] = useState<Record<string, any> | null>(() =>
    getTreatmentDetailsConfig()
  );

  // Scroll to top and hydrate deferred customizations on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const immediate = getTreatmentDetailsConfig();
    if (immediate && typeof immediate === 'object') {
      setDetailsConfig({ ...immediate });
    }
    loadSiteCustomizations().catch(() => {});
    getTreatmentDetailsConfigDeferred()
      .then((deferred) => {
        const latest = getTreatmentDetailsConfig() || deferred;
        if (latest && typeof latest === 'object') {
          setDetailsConfig({ ...latest });
        }
      })
      .catch(() => {});
  }, [treatmentName]);

  useEffect(() => {
    const handleStoreUpdate = () => {
      setMasterServices(getMasterServices());
      const latestDetails = getTreatmentDetailsConfig();
      if (latestDetails) {
        setDetailsConfig({ ...latestDetails });
      }
    };
    window.addEventListener('before_after_gallery_updated', handleStoreUpdate);
    window.addEventListener('master_services_updated', handleStoreUpdate);
    window.addEventListener('treatment_details_updated', handleStoreUpdate);
    window.addEventListener('site_customizations_hydrated', handleStoreUpdate);
    window.addEventListener('storage', handleStoreUpdate);
    return () => {
      window.removeEventListener('before_after_gallery_updated', handleStoreUpdate);
      window.removeEventListener('master_services_updated', handleStoreUpdate);
      window.removeEventListener('treatment_details_updated', handleStoreUpdate);
      window.removeEventListener('site_customizations_hydrated', handleStoreUpdate);
      window.removeEventListener('storage', handleStoreUpdate);
    };
  }, []);

  // Resolve matching treatment metadata dynamically using key lookup + live master service branch
  const getTreatmentData = () => {
    const cleanedName = treatmentName
      .replace(/\s*\([£$€]\s*\d[^)]*\)\s*$/, '')
      .trim();
    const lowerName = cleanedName.toLowerCase();
    const rawLowerName = treatmentName.toLowerCase().trim();
    const slugName = lowerName.replace(/@/g, '2').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const slugKey = lowerName.replace(/[^a-z0-9]/g, '');
    const config = detailsConfig || getTreatmentDetailsConfig();
    const db = config || TREATMENT_DETAILS_DB;

    let matchedMaster = masterServices.find(
      (s) =>
        s.id.toLowerCase() === lowerName ||
        s.id.toLowerCase() === slugName ||
        s.title.toLowerCase() === lowerName ||
        s.title.toLowerCase() === rawLowerName
    );

    // 1. Search CLINICAL_AREAS_DB for a matching treatment name or subcategory
    let matchedId: string | null = matchedMaster?.id || null;
    let resolvedSubCategoryId: string | undefined = matchedMaster?.id;
    let resolvedSubCategoryName: string | undefined = matchedMaster?.title;
    let siblingItemIds: string[] = [];

    for (const area of CLINICAL_AREAS_DB) {
      for (const cat of area.categories) {
        const catIdLower = cat.id.toLowerCase();
        const catNameLower = cat.name.toLowerCase();
        if (
          catIdLower === lowerName ||
          catIdLower === slugName ||
          catNameLower === lowerName ||
          catNameLower === rawLowerName
        ) {
          resolvedSubCategoryId = cat.id;
          resolvedSubCategoryName = cat.name;
          siblingItemIds = cat.items.map((i) => i.id);
          if (!matchedId) matchedId = cat.id;
        }
        const item = cat.items.find((i) => {
          const itemIdLower = i.id.toLowerCase();
          const itemNameLower = i.name.toLowerCase();
          return (
            itemNameLower === lowerName ||
            itemNameLower === rawLowerName ||
            itemIdLower === lowerName ||
            itemIdLower === slugName
          );
        });
        if (item) {
          matchedId = item.id;
          resolvedSubCategoryId = cat.id;
          resolvedSubCategoryName = cat.name;
          siblingItemIds = cat.items.map((i) => i.id);
          break;
        }
      }
      if (matchedId && resolvedSubCategoryId && siblingItemIds.length > 0) break;
    }

    if (!matchedMaster && resolvedSubCategoryId) {
      matchedMaster = masterServices.find(
        (s) => s.id.toLowerCase() === resolvedSubCategoryId!.toLowerCase()
      );
    }

    // 2. Check if admin has saved a customized record for this exact service, its subcategory, or child item
    let customEntry: any = null;
    let directCandidate: any = null;
    if (config && typeof config === 'object') {
      const isEntryCustomized = (e: any) =>
        Boolean(e && typeof e === 'object' && (e.isCustomized || Number(e.updatedAt) > 0));

      directCandidate =
        (matchedId && config[matchedId]) ||
        config[lowerName] ||
        config[rawLowerName] ||
        config[slugName] ||
        config[slugKey] ||
        Object.values(config).find((entry: any) => {
          if (!entry || typeof entry !== 'object') return false;
          const eId = String(entry.id || '').toLowerCase().trim();
          const eTitle = String(entry.title || '').toLowerCase().trim();
          return (
            (matchedId && eId === matchedId.toLowerCase()) ||
            eId === lowerName ||
            eId === slugName ||
            eTitle === lowerName ||
            eTitle === rawLowerName
          );
        });

      const subCatCandidate =
        resolvedSubCategoryId && config[resolvedSubCategoryId]
          ? config[resolvedSubCategoryId]
          : null;

      const siblingCandidates = siblingItemIds
        .map((cid) => config[cid])
        .filter((entry) => entry && typeof entry === 'object')
        .sort((a: any, b: any) => {
          const aCustom = isEntryCustomized(a) ? 1 : 0;
          const bCustom = isEntryCustomized(b) ? 0 : 0; // wait: fix below
          if (aCustom !== (isEntryCustomized(b) ? 1 : 0)) {
            return (isEntryCustomized(b) ? 1 : 0) - aCustom;
          }
          return (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0);
        });
      const bestSibling = siblingCandidates[0] || null;

      // Pick the most recently updated customized record across direct, subcategory, and sibling
      const customizedPool = [
        { entry: directCandidate, priority: 3, isDirect: true },
        { entry: subCatCandidate, priority: 2, isDirect: false },
        { entry: bestSibling, priority: 1, isDirect: false },
      ]
        .filter((c) => isEntryCustomized(c.entry))
        .sort((a, b) => {
          const timeDiff = (Number(b.entry.updatedAt) || 0) - (Number(a.entry.updatedAt) || 0);
          if (timeDiff !== 0) return timeDiff;
          return b.priority - a.priority;
        });

      if (customizedPool.length > 0) {
        const winner = customizedPool[0];
        if (directCandidate && !winner.isDirect) {
          const defaultWinnerTitle = TREATMENT_DETAILS_DB[winner.entry.id]?.title;
          const wasWinnerTitleEdited =
            Boolean(winner.entry.title) &&
            Boolean(defaultWinnerTitle) &&
            winner.entry.title !== defaultWinnerTitle;

          customEntry = {
            ...directCandidate,
            ...winner.entry,
            id: directCandidate.id || winner.entry.id,
            title: wasWinnerTitleEdited
              ? winner.entry.title
              : directCandidate.title || cleanedName || winner.entry.title,
          };
        } else {
          customEntry = winner.entry;
        }
      } else {
        customEntry = directCandidate || subCatCandidate || bestSibling || null;
      }
    }

    let baseDetails: any = customEntry;

    // 3. Fallback to keyword / static database if not found via direct/subcategory lookup
    if (!baseDetails) {
      const lowerProbe = `${lowerName} ${matchedId || ''} ${resolvedSubCategoryId || ''}`.toLowerCase();
      if (lowerProbe.includes('exosome')) {
        baseDetails = db.exosome || TREATMENT_DETAILS_DB.exosome;
      } else if (lowerProbe.includes('profhilo')) {
        baseDetails = db['profhilo-2ml'] || db.profhilo || TREATMENT_DETAILS_DB.profhilo;
      } else if (lowerProbe.includes('morpheus') || lowerProbe.includes('morpheus8')) {
        baseDetails = db['morpheus8-treatment'] || db.morpheus8 || TREATMENT_DETAILS_DB.morpheus8;
      } else if (lowerProbe.includes('ultherapy') || lowerProbe.includes('emface')) {
        baseDetails = db['emface-skin-tightening-and-lifting'] || db.ultherapy || TREATMENT_DETAILS_DB.ultherapy;
      } else if (lowerProbe.includes('polynucleotide') || lowerProbe.includes('salmon sperm')) {
        baseDetails = db['salmon-sperm-injection'] || db.polynucleotide || TREATMENT_DETAILS_DB.polynucleotide;
      } else if (lowerProbe.includes('lip') || lowerProbe.includes('lips')) {
        baseDetails = db['dermal-fillers-1ml'] || db.lip || TREATMENT_DETAILS_DB.lip;
      } else if (
        lowerProbe.includes('buttock') ||
        lowerProbe.includes('bbl') ||
        lowerProbe.includes('butt') ||
        lowerProbe.includes('emsculpt')
      ) {
        baseDetails = db['emscuplt-body-sculpt-and-tightening'] || db.buttock || TREATMENT_DETAILS_DB.buttock;
      } else if (
        lowerProbe.includes('bleph') ||
        lowerProbe.includes('eyelid') ||
        lowerProbe.includes('blepharoplasty')
      ) {
        baseDetails = db['endolift-fiber-lift'] || db.blepharoplasty || TREATMENT_DETAILS_DB.blepharoplasty;
      } else if (
        lowerProbe.includes('aqualyx') ||
        lowerProbe.includes('fat dissolve') ||
        lowerProbe.includes('deso')
      ) {
        baseDetails = db['aqualyx-course-3'] || db.aqualyx || TREATMENT_DETAILS_DB.aqualyx;
      } else {
        baseDetails = DEFAULT_TREATMENT_DETAILS(matchedMaster?.title || cleanedName);
      }
    }

    const hasCustomDetails = Boolean(
      customEntry ||
        baseDetails?.isCustomized ||
        baseDetails?.updatedAt ||
        (baseDetails?.id &&
          baseDetails.id !== 'bespoke' &&
          config &&
          config[baseDetails.id])
    );

    const isDirectSubcategoryClick =
      matchedMaster &&
      (matchedMaster.id.toLowerCase() === lowerName ||
        matchedMaster.id.toLowerCase() === slugName ||
        matchedMaster.title.toLowerCase() === lowerName ||
        matchedMaster.title.toLowerCase() === rawLowerName);

    const effectiveId =
      matchedId ||
      (customEntry?.id && customEntry.id !== 'bespoke' ? customEntry.id : null) ||
      (isDirectSubcategoryClick ? matchedMaster?.id : null) ||
      (baseDetails?.id && baseDetails.id !== 'bespoke' ? baseDetails.id : null) ||
      slugName;

    if (matchedMaster) {
      const liveBranch = normalizeMasterBranch(
        matchedMaster.pricingCategory || matchedMaster.category,
        matchedMaster.title
      );
      return {
        ...baseDetails,
        id: effectiveId,
        title: hasCustomDetails
          ? baseDetails.title || cleanedName || matchedMaster.title
          : isDirectSubcategoryClick
          ? matchedMaster.title || baseDetails.title
          : cleanedName || matchedMaster.title || baseDetails.title,
        subCategoryId: resolvedSubCategoryId || matchedMaster.id,
        subCategoryName: resolvedSubCategoryName || matchedMaster.title,
        category: hasCustomDetails
          ? baseDetails.category || liveBranch
          : liveBranch,
        pricingCategory: liveBranch,
        description: hasCustomDetails
          ? baseDetails.description || matchedMaster.description
          : matchedMaster.description || baseDetails.description,
        imageUrl: hasCustomDetails
          ? cleanServiceImageUrl(baseDetails.heroMedia?.url) ||
            cleanServiceImageUrl(baseDetails.imageUrl) ||
            cleanServiceImageUrl(matchedMaster.image)
          : cleanServiceImageUrl(baseDetails.heroMedia?.url) ||
            cleanServiceImageUrl(matchedMaster.image) ||
            cleanServiceImageUrl(baseDetails.imageUrl),
        price: hasCustomDetails
          ? baseDetails.price || matchedMaster.price
          : matchedMaster.price || baseDetails.price,
        procedureTime: hasCustomDetails
          ? baseDetails.procedureTime || matchedMaster.duration
          : matchedMaster.duration || baseDetails.procedureTime,
      };
    }

    return {
      ...baseDetails,
      id: effectiveId,
      title: (hasCustomDetails && baseDetails.title) || cleanedName || baseDetails.title,
      subCategoryId: resolvedSubCategoryId,
      subCategoryName: resolvedSubCategoryName,
    };
  };

  const rawData = getTreatmentData();
  const data = populateTreatmentMediaDefaults(rawData);
  const portfolioItems: TreatmentMediaItem[] =
    data.portfolioMedia && data.portfolioMedia.length > 0
      ? data.portfolioMedia.filter((m) => m && cleanServiceImageUrl(m.url))
      : (data.additionalImages || [])
          .map((imgUrl: string) => cleanServiceImageUrl(imgUrl))
          .filter(Boolean)
          .map((imgUrl: string, idx: number) => ({
            id: `service-${data.id}-portfolio-${idx}`,
            url: imgUrl,
            mediaType: 'image' as const,
            altText: `${data.title} Gallery Reference ${idx + 1}`,
            seoTitle: `${data.title} - Portfolio Reference #${idx + 1}`,
            seoKeywords: data.seoKeywords || [],
            caption: `Reference Detail #${idx + 1}`,
          }));

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="bg-white min-h-screen flex flex-col relative z-10"
      id="service-page-view"
    >
      {/* 1. Google SEO & Schema.org JSON-LD structured data export (Task 5.3) */}
      <ClinicalSEOHead
        customTitle={data.seoMetaTitle || `${data.title} | ${data.category}`}
        customDescription={data.seoMetaDescription || data.description}
        customImage={data.heroMedia?.url || data.coverMedia?.url || data.imageUrl}
        canonicalPath={`#treatment-${data.id}`}
        customKeywords={data.seoKeywords}
        treatmentData={data}
      />

      {/* 2. Service Hero Section */}
      <ServiceHero data={data} onClose={onClose} onBook={onBook} />

      {/* 3. Detailed Clinical Information Section (Under the Hero) */}
      <section id="clinical-details-section" className="bg-white py-16 md:py-24 border-b border-silver-150 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
          
          {/* Section 3.0: Clinical Expectations Quick Facts (Directly below Hero) */}
          <ClinicalExpectations data={data} />

          {/* Section 3.1: Scientific Profile & Overview (Full Width row) */}
          <ServiceOverview data={data} />

          {/* 4. Treatment Pricing & Package Selector */}
          <div className="pt-8 pb-4 border-t border-silver-150 max-w-5xl mx-auto w-full">
            <ServiceBottomCTA data={data} onBook={onBook} />
          </div>

          {/* Section 3.1.5: How It Works? Dynamic Vertical Timeline */}
          <HowItWorksTimeline treatmentId={data.id} />

          {/* Section 3.3: Target Concerns (Full Width row) */}
          <TargetConcerns data={data} />

          {/* Section 3.2: Clinical Before/After Comparison - Spacious Full Showcase */}
          <BeforeAfterComparisonSlider
            beforeImage={data.beforeImage}
            afterImage={data.afterImage}
            treatmentName={data.title}
            treatmentId={data.id}
            treatmentCategory={data.category}
            subCategoryId={(rawData as any).subCategoryId}
            subCategoryName={(rawData as any).subCategoryName}
            clinicalComparisonMedia={data.clinicalComparisonMedia}
            customBeforeAfterPairs={data.customBeforeAfterPairs}
            excludedGalleryPairIds={data.excludedGalleryPairIds}
          />

          {/* Section 3.2.5: Additional Clinical Gallery Showcase */}
          {portfolioItems.length > 0 && (
            <div className="pt-16 border-t border-silver-100 max-w-6xl mx-auto w-full">
              <div className="flex flex-col items-center text-center space-y-2 mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#c5a880] block">
                  Detailed Clinical Gallery
                </span>
                <h4 className="text-2xl md:text-3xl font-serif font-bold text-[#003334] flex items-center gap-2 justify-center">
                  <ImageIcon className="h-6 w-6 text-[#c5a880] shrink-0" />
                  <span>Procedure &amp; Treatment Portfolio</span>
                </h4>
                <p className="text-xs text-slate-500 max-w-xl mx-auto">
                  Examine detailed zoom-ins, anatomical target areas, and microscopic skin repair progressions for {data.title}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {portfolioItems.map((item, idx) => (
                  <motion.div 
                    key={item.id || `portfolio-${idx}`}
                    id={item.id}
                    data-media-id={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col space-y-3 group cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 rounded-xl border border-slate-100">
                      <ClinicImageWithPlaceholder
                        src={item.url}
                        alt={item.altText || `${data.title} Gallery Reference ${idx + 1}`}
                        title={item.seoTitle || data.title}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        skeletonVariant="light"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider text-center truncate px-2">
                      {item.caption || `Reference Detail #${idx + 1}`}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3.3: Dermal Layer Depth Analysis - Spacious Full Showcase */}
          {data.profilerEnabled !== false && (
            <div className="pt-16 border-t border-silver-100 max-w-5xl mx-auto w-full relative isolate transform-gpu">
              <SkinLayerTargets
                targetLayer={data.targetLayer}
                targetDepth={data.targetLayerDepth}
                treatmentName={data.title}
                customSpecs={data.dermalSpecs}
              />
            </div>
          )}

          {/* Section 3.4: Clinical Care Guidelines - Spacious Full Showcase */}
          <div className="pt-16 border-t border-silver-100 max-w-5xl mx-auto w-full">
            <PrePostCareGuidelines
              preCare={data.preCare}
              postCare={data.postCare}
              treatmentName={data.title}
              clinicalGuidanceMedia={data.clinicalGuidanceMedia}
            />
          </div>

          {/* Section 3.5: Dynamic Treatment FAQs */}
          <div className="pt-16 border-t border-silver-100 max-w-5xl mx-auto w-full">
            <ServiceFAQ
              treatmentName={data.title}
              category={data.category}
              comfortLevel={data.comfortLevel}
              recommendedSessions={data.recommendedSessions}
              downtime={data.downtime}
            />
          </div>

        </div>
      </section>

      {/* 3.6 What My Clients Are Saying - Dynamic Testimonials */}
      <Testimonials treatmentId={data.id} category={data.category} />

      {/* 3.7 Special Clinic Offers - Dynamic Special Offers */}
      <SpecialOffers 
        onClaimOffer={(offerTitle) => {
          onBook(`${data.title} - ${offerTitle}`);
        }} 
        treatmentId={data.id} 
        category={data.category} 
      />

    </motion.div>
  );
}
