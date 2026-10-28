import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SpecialistAreasConfig, SpecialistArea } from '../types';
import Pagination from './Pagination';
import { ALL_SPECIALIST_TREATMENTS, SpecialistTreatment } from '../data/specialistTreatments';
import {
  getTreatmentDetailsConfig,
  getMasterServices,
  getSpecialistAreasConfig,
  normalizeMasterBranch,
  inferTransformationCategoryFromBranch,
} from '../lib/adminStore';

interface SpecialistAreasProps {
  onBookClick: (serviceName?: string) => void;
  onTreatmentClick?: (treatmentName: string, branchCategory?: string) => void;
  onExploreAllClick?: () => void;
  specialistAreasConfig?: SpecialistAreasConfig;
}

export default function SpecialistAreas({
  onBookClick,
  onTreatmentClick,
  onExploreAllClick,
  specialistAreasConfig
}: SpecialistAreasProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [masterServices, setMasterServices] = useState<SpecialistArea[]>(() => getMasterServices());
  const [liveAreasConfig, setLiveAreasConfig] = useState<SpecialistAreasConfig | undefined>(
    () => specialistAreasConfig || getSpecialistAreasConfig()
  );

  useEffect(() => {
    if (specialistAreasConfig) {
      setLiveAreasConfig(specialistAreasConfig);
    }
  }, [specialistAreasConfig]);

  useEffect(() => {
    const handleMasterServicesUpdate = () => {
      setMasterServices(getMasterServices());
      setLiveAreasConfig(getSpecialistAreasConfig());
    };
    window.addEventListener('master_services_updated', handleMasterServicesUpdate);
    window.addEventListener('specialist_areas_updated', handleMasterServicesUpdate);
    window.addEventListener('storage', handleMasterServicesUpdate);
    return () => {
      window.removeEventListener('master_services_updated', handleMasterServicesUpdate);
      window.removeEventListener('specialist_areas_updated', handleMasterServicesUpdate);
      window.removeEventListener('storage', handleMasterServicesUpdate);
    };
  }, []);

  // Derive specialist area cards directly from live masterServices ("Services & Branches")
  const treatmentsList: SpecialistTreatment[] = useMemo(() => {
    const sourceServices =
      masterServices && masterServices.length > 0 ? masterServices : ALL_SPECIALIST_TREATMENTS;

    return sourceServices.map((service) => {
      const staticMatch = ALL_SPECIALIST_TREATMENTS.find(
        (m) =>
          m.id.toLowerCase() === service.id.toLowerCase() ||
          m.title.toLowerCase() === service.title.toLowerCase()
      );
      const areaMatch = liveAreasConfig?.areas?.find(
        (a) =>
          a.id.toLowerCase() === service.id.toLowerCase() ||
          a.title.toLowerCase() === service.title.toLowerCase()
      );
      const branch = normalizeMasterBranch(
        service.pricingCategory || service.category || staticMatch?.pricingCategory,
        service.title
      );
      const transformationCategory =
        service.transformationCategory ||
        inferTransformationCategoryFromBranch(branch, service.title);

      const resolvedImage =
        service.image ||
        areaMatch?.image ||
        service.coverMedia?.url ||
        areaMatch?.coverMedia?.url ||
        staticMatch?.image ||
        '';

      return {
        id: service.id,
        title: service.title,
        category: branch,
        pricingCategory: branch,
        transformationCategory,
        description:
          service.description || areaMatch?.description || staticMatch?.description || '',
        image: resolvedImage,
        badge: staticMatch?.badge,
        duration: service.duration || staticMatch?.duration,
        coverMedia: service.coverMedia
          ? { ...service.coverMedia, url: resolvedImage }
          : areaMatch?.coverMedia
          ? { ...areaMatch.coverMedia, url: resolvedImage }
          : staticMatch?.coverMedia
          ? { ...staticMatch.coverMedia, url: resolvedImage }
          : undefined,
        seoKeywords: service.seoKeywords || areaMatch?.seoKeywords || staticMatch?.seoKeywords,
      };
    });
  }, [masterServices, liveAreasConfig]);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(treatmentsList.length / itemsPerPage) || 1;

  // Chunk treatments by page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTreatments = treatmentsList.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="w-full">
      {/* 1. Explore Specialist Areas Section (Reduced bottom spacing on mobile) */}
      <section
        id="specialist-areas"
        className="pt-12 sm:pt-20 md:py-32 pb-6 sm:pb-12 md:pb-24 bg-transparent border-b border-luxury-border/40 isolate transform-gpu"
      >
        <div className="container mx-auto px-4 md:px-12 max-w-7xl">
          {/* Header Layout */}
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 sm:gap-8 mb-10 sm:mb-14 md:mb-16">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-light text-luxury-text mb-4 sm:mb-6 tracking-tight leading-tight">
                {specialistAreasConfig?.heading ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: specialistAreasConfig.heading.replace(
                        'areas',
                        '<span class="italic text-luxury-gold">areas</span>'
                      )
                    }}
                  />
                ) : (
                  <>
                    Explore our specialist <span className="italic text-luxury-gold">areas</span>
                  </>
                )}
              </h2>
              <p className="font-sans text-xs sm:text-sm md:text-base text-luxury-subtext font-light leading-relaxed">
                {specialistAreasConfig?.description ||
                  "At Age Reversal Clinic, we offer advanced aesthetic diagnostics, world-leading consultants, and fast access to appointments - often within 48 hours - so your transformation can begin in days, not months. Explore our full clinical directory of advanced treatments below."}
              </p>
            </div>
            <div className="shrink-0">
              <button
                onClick={() => (onExploreAllClick ? onExploreAllClick() : onBookClick('All Specialty Areas'))}
                className="bg-white sm:bg-white/95 sm:backdrop-blur-md border border-luxury-border/80 text-silver-900 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full hover:bg-white hover:border-luxury-gold transition-all duration-300 font-sans text-xs sm:text-sm font-medium tracking-wide flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>See all treatment areas ({treatmentsList.length})</span>
                <ChevronRight className="h-4 w-4 text-silver-500 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </button>
            </div>
          </header>

          {/* Cards Grid: 2 per row on desktop screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 mb-6 sm:mb-10 md:mb-14 -mx-1.5">
            <AnimatePresence mode="wait">
              {currentTreatments.map((treatment, idx) => (
                <motion.article
                  key={`${currentPage}-${treatment.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, delay: idx * 0.05, ease: 'easeOut' }}
                  onClick={() =>
                    onTreatmentClick
                      ? onTreatmentClick(treatment.title, treatment.pricingCategory)
                      : onBookClick(treatment.title)
                  }
                  className="group bg-white/98 sm:bg-white/95 sm:backdrop-blur-md overflow-hidden border border-white/40 hover:border-white transition-all duration-300 cursor-pointer flex flex-col h-full shadow-[0_8px_30px_-5px_rgba(0,0,0,0.2)] hover:shadow-2xl hover:-translate-y-1 rounded-xl transform-gpu will-change-transform"
                >
                  <div className="aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/9] overflow-hidden bg-luxury-secondary relative">
                    <img
                      src={treatment.image || treatment.coverMedia?.url}
                      alt={treatment.coverMedia?.altText || treatment.title}
                      title={treatment.coverMedia?.seoTitle || treatment.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                    {treatment.category && (
                      <span className="absolute top-3 left-3 bg-white/95 text-luxury-text text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border border-luxury-border shadow-xs">
                        {treatment.category}
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 sm:p-6 md:p-7 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2 sm:mb-3">
                        <h3 className="font-serif font-normal text-base sm:text-xl text-luxury-text group-hover:text-luxury-subtext transition-colors leading-tight">
                          {treatment.title}
                        </h3>
                        <ChevronRight
                          className="h-4 w-4 text-luxury-muted group-hover:translate-x-1 transition-transform shrink-0"
                          strokeWidth={1.5}
                        />
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-luxury-subtext font-light leading-relaxed line-clamp-3">
                        {treatment.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {/* Clean Modular Pagination with Reduced Bottom Space on Mobile */}
          <div className="pt-1 pb-0 sm:py-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
