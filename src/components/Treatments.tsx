import { useState, useEffect, useMemo } from 'react';
import { TREATMENTS, TREATMENT_IMAGES } from '../data';
import { ALL_SPECIALIST_TREATMENTS } from '../data/specialistTreatments';
import { motion } from 'motion/react';
import { Calendar, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { TreatmentsConfig, SpecialistArea } from '../types';
import { getTreatmentImagePath } from '../utils/treatmentImageHelper';
import { getMasterServices, getTreatmentsConfig, normalizeMasterBranch } from '../lib/adminStore';

interface TreatmentsProps {
  onBookClick: () => void;
  onTreatmentClick?: (treatmentName: string, branchCategory?: string) => void;
  treatmentsConfig?: TreatmentsConfig;
}

const ITEMS_PER_PAGE = 6;

export default function Treatments({ onBookClick, onTreatmentClick, treatmentsConfig }: TreatmentsProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [masterServices, setMasterServices] = useState<SpecialistArea[]>(() => getMasterServices());
  const [liveTreatmentsConfig, setLiveTreatmentsConfig] = useState<TreatmentsConfig | undefined>(
    () => treatmentsConfig || getTreatmentsConfig()
  );

  useEffect(() => {
    if (treatmentsConfig) {
      setLiveTreatmentsConfig(treatmentsConfig);
    }
  }, [treatmentsConfig]);

  useEffect(() => {
    const handleMasterServicesUpdate = () => {
      setMasterServices(getMasterServices());
      setLiveTreatmentsConfig(getTreatmentsConfig());
    };
    window.addEventListener('master_services_updated', handleMasterServicesUpdate);
    window.addEventListener('storage', handleMasterServicesUpdate);
    return () => {
      window.removeEventListener('master_services_updated', handleMasterServicesUpdate);
      window.removeEventListener('storage', handleMasterServicesUpdate);
    };
  }, []);

  // Merge configured treatments with live master services metadata (01 through N)
  const activeTreatments = useMemo(() => {
    const sourceMaster =
      masterServices && masterServices.length > 0 ? masterServices : ALL_SPECIALIST_TREATMENTS;

    const rawTreatments =
      liveTreatmentsConfig?.treatments && liveTreatmentsConfig.treatments.length > 0
        ? liveTreatmentsConfig.treatments
        : TREATMENTS;

    // Prefer masterServices order and count so added/deleted/renamed services are immediately reflected
    return sourceMaster.map((masterItem, idx) => {
      const cfgMatch = rawTreatments.find(
        (t) =>
          t.id === masterItem.id ||
          (t.name || '').toLowerCase() === masterItem.title.toLowerCase()
      );
      const staticMatch = ALL_SPECIALIST_TREATMENTS.find((s) => s.id === masterItem.id);
      const fallbackImg = TREATMENT_IMAGES[idx % TREATMENT_IMAGES.length];
      const branch = normalizeMasterBranch(
        masterItem.pricingCategory || masterItem.category || cfgMatch?.tag,
        masterItem.title
      );

      return {
        id: masterItem.id,
        name: masterItem.title,
        stepNumber: String(idx + 1).padStart(2, '0'),
        description:
          masterItem.description ||
          cfgMatch?.description ||
          staticMatch?.description ||
          'Bespoke clinical protocol tailored by our aesthetic specialists for natural, lasting results.',
        tag: branch,
        image: masterItem.image || cfgMatch?.image || staticMatch?.image || fallbackImg,
        duration: masterItem.duration || cfgMatch?.duration || staticMatch?.duration || '45 - 60 Mins',
      };
    });
  }, [masterServices, liveTreatmentsConfig]);

  const totalPages = Math.max(1, Math.ceil(activeTreatments.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages - 1);
  const visibleTreatments = activeTreatments.slice(
    safePage * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  // Bento grid layout classes for the 6 cards on each page
  const gridSpanClasses = [
    'md:col-span-7 aspect-[4/3]',
    'md:col-span-5 aspect-square md:aspect-auto',
    'md:col-span-5 aspect-[4/3] md:aspect-square',
    'md:col-span-7 aspect-[16/9] md:aspect-auto',
    'md:col-span-6 aspect-square',
    'md:col-span-6 aspect-square'
  ];

  return (
    <section id="treatments" className="pt-10 pb-12 sm:pt-16 sm:pb-20 md:py-24 lg:py-32 bg-[#ff8656] text-slate-950 border-b border-[#e57042] overflow-hidden relative selection:bg-orange-200 isolate">
      {/* Soft Fade Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white/50 pointer-events-none" />

      {/* Luminous Ambient Light Glow (GPU-optimized pre-computed radial gradients) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-85" 
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 0%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.1) 45%, transparent 75%), radial-gradient(circle 350px at 0% 90%, rgba(255, 255, 255, 0.28) 0%, transparent 70%)'
        }}
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-8 sm:gap-12 lg:gap-16">
          
          {/* Left Column: Text, Accordion List (01 through 24) & Controls */}
          <div className="w-full lg:w-5/12 lg:max-w-[460px] relative">
            <div className="relative mb-4 sm:mb-6">
              <span className="absolute -top-5 sm:-top-7 md:-top-9 left-0 text-3xl sm:text-5xl md:text-6xl lg:text-4xl font-serif italic text-black/15 select-none uppercase tracking-wider pointer-events-none">
                {treatmentsConfig?.editorialHeading || "rejuvenation"}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl font-light font-serif text-slate-950 leading-tight uppercase relative z-10 pt-2 sm:pt-3">
                {treatmentsConfig?.editorialSub || "Begin your transformation"}
              </h2>
            </div>
            
            <div className="w-12 h-[1.5px] bg-slate-950 mb-4 sm:mb-6" />

            <p className="text-slate-950 font-sans font-normal mb-6 leading-relaxed text-sm sm:text-base">
              {treatmentsConfig?.description || "At Age Reversal Clinic, we believe that aesthetic harmony elevates self-confidence. Our clinical therapists custom-tailor skin therapy sessions, premium facials, and micropigmentation protocols to support your personal wellness ritual."}
            </p>

            {/* Treatment Accordion List (01 through 24) */}
            <div className="divide-y divide-slate-950/15 border-y border-slate-950/20 mb-6">
              {visibleTreatments.map((treatment) => {
                const isExpanded = expandedId === treatment.id;
                return (
                  <div key={treatment.id} className="py-3 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : treatment.id)
                        }
                        className="flex items-center space-x-3 text-left group flex-1 cursor-pointer"
                      >
                        <span className="font-mono text-xs font-semibold text-slate-950/60 group-hover:text-slate-950 transition-colors w-6 shrink-0">
                          {treatment.stepNumber}
                        </span>
                        <span className="text-slate-950 font-sans font-medium group-hover:text-black transition-colors duration-200 text-sm sm:text-base leading-snug">
                          {treatment.name}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onTreatmentClick?.(treatment.name, treatment.tag)}
                        title={`Explore ${treatment.name}`}
                        className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold uppercase tracking-wider text-slate-950/75 hover:text-slate-950 px-2 py-1 rounded-md hover:bg-white/30 transition-colors cursor-pointer shrink-0"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-2.5 pl-9 pr-2 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-sans uppercase tracking-[0.14em] font-semibold px-2 py-0.5 rounded bg-slate-950/10 text-slate-900">
                            {treatment.tag}
                          </span>
                          {treatment.duration && (
                            <span className="text-[11px] font-sans text-slate-900/75">
                              {treatment.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-900/90 leading-relaxed">
                          {treatment.description}
                        </p>
                        <button
                          type="button"
                          onClick={() => onTreatmentClick?.(treatment.name, treatment.tag)}
                          className="text-xs font-sans font-semibold underline underline-offset-4 text-slate-950 hover:text-black cursor-pointer"
                        >
                          Explore protocol &amp; pricing
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination controls for 01 - 24 services */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-3 mb-6">
                <span className="text-xs font-sans font-medium text-slate-950/80">
                  Showing {String(safePage * ITEMS_PER_PAGE + 1).padStart(2, '0')}–
                  {String(Math.min((safePage + 1) * ITEMS_PER_PAGE, activeTreatments.length)).padStart(2, '0')} of{' '}
                  {String(activeTreatments.length).padStart(2, '0')} services
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => (p > 0 ? p - 1 : totalPages - 1))}
                    aria-label="Previous services page"
                    className="p-2 rounded-full border border-slate-950/30 hover:bg-slate-950 hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPage(idx)}
                      className={`w-7 h-7 rounded-full text-xs font-sans font-semibold transition-colors cursor-pointer ${
                        safePage === idx
                          ? 'bg-slate-950 text-white'
                          : 'text-slate-950 hover:bg-slate-950/10'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => (p < totalPages - 1 ? p + 1 : 0))}
                    aria-label="Next services page"
                    className="p-2 rounded-full border border-slate-950/30 hover:bg-slate-950 hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={onBookClick}
              className="bg-slate-950 hover:bg-black text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 font-sans font-medium tracking-wide flex items-center space-x-2 w-fit group text-xs sm:text-sm cursor-pointer active:scale-95 border border-white/40"
            >
              <Calendar className="h-4 w-4 text-orange-200 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span>Schedule Spa Day</span>
            </button>
          </div>

          {/* Right Column: Orderly, aligned straight-line grid synced with visible 24 services */}
          <div className="w-full lg:w-7/12 relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative w-full">
              {visibleTreatments.map((treatment, idx) => {
                const spanClass = gridSpanClasses[idx % gridSpanClasses.length];
                const fallbackImage = TREATMENT_IMAGES[idx % TREATMENT_IMAGES.length];
                return (
                  <motion.div
                    key={treatment.id}
                    whileHover={{ scale: 1.01, y: -2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    onClick={() => onTreatmentClick?.(treatment.name, treatment.tag)}
                    className={`${spanClass} group relative overflow-hidden bg-orange-300/30 border border-white/80 rounded-2xl cursor-pointer shadow-[0_6px_25px_-4px_rgba(180,60,20,0.25)] hover:border-white hover:shadow-[0_12px_32px_-4px_rgba(180,60,20,0.4)] transition-all`}
                  >
                    <img
                      alt={treatment.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={getTreatmentImagePath(treatment.id, treatment.image || fallbackImage)}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = fallbackImage;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                      <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-orange-200 mb-1.5 font-bold">
                        {treatment.stepNumber} • {treatment.tag}
                      </span>
                      <h3 className="font-serif text-xl md:text-2xl font-light text-white mb-1">
                        {treatment.name}
                      </h3>
                      <p className="font-sans text-xs text-white/80 line-clamp-2">
                        {treatment.description}
                      </p>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-5 group-hover:opacity-0 transition-opacity">
                      <span className="block font-sans text-[10px] tracking-[0.15em] uppercase text-orange-200/95 font-semibold mb-0.5">
                        {treatment.stepNumber} • {treatment.tag}
                      </span>
                      <span className="block font-serif text-base md:text-lg text-white font-light truncate">
                        {treatment.name}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
