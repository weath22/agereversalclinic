import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SpecialistAreasConfig } from '../types';
import Pagination from './Pagination';
import { ALL_SPECIALIST_TREATMENTS, SpecialistTreatment } from '../data/specialistTreatments';

interface SpecialistAreasProps {
  onBookClick: (serviceName?: string) => void;
  onTreatmentClick?: (treatmentName: string) => void;
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

  // Use configured areas if customized with multiple pages, otherwise use full comprehensive clinical treatments
  const treatmentsList: SpecialistTreatment[] = 
    specialistAreasConfig?.areas && specialistAreasConfig.areas.length > 4
      ? specialistAreasConfig.areas.map(a => ({
          id: a.id,
          title: a.title,
          category: 'Specialist Care',
          description: a.description,
          image: a.image
        }))
      : ALL_SPECIALIST_TREATMENTS;

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
        className="pt-12 sm:pt-20 md:py-32 pb-6 sm:pb-12 md:pb-24 bg-transparent border-b border-luxury-border/40"
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
                className="bg-white/95 backdrop-blur-md border border-luxury-border/80 text-silver-900 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full hover:bg-white hover:border-luxury-gold transition-all duration-300 font-sans text-xs sm:text-sm font-medium tracking-wide flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>See all treatment areas ({treatmentsList.length})</span>
                <ChevronRight className="h-4 w-4 text-silver-500 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </button>
            </div>
          </header>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-6 sm:mb-10 md:mb-14">
            <AnimatePresence mode="wait">
              {currentTreatments.map((treatment, idx) => (
                <motion.article
                  key={`${currentPage}-${treatment.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, delay: idx * 0.05, ease: 'easeOut' }}
                  onClick={() =>
                    onTreatmentClick ? onTreatmentClick(treatment.title) : onBookClick(treatment.title)
                  }
                  className="group bg-white/95 backdrop-blur-md overflow-hidden border border-white/30 hover:border-white transition-all duration-300 cursor-pointer flex flex-col h-full shadow-[0_10px_35px_-5px_rgba(0,0,0,0.25)] hover:shadow-2xl hover:-translate-y-1 rounded-xl"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-luxury-secondary relative">
                    <img
                      src={treatment.image}
                      alt={treatment.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                    {treatment.badge && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-luxury-text text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border border-luxury-border shadow-xs">
                        {treatment.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5 sm:p-6 md:p-7 flex-grow flex flex-col justify-between">
                    <div>
                      {treatment.category && (
                        <span className="text-[10px] uppercase tracking-widest text-luxury-muted font-medium block mb-1">
                          {treatment.category}
                        </span>
                      )}
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-serif font-normal text-lg sm:text-xl text-luxury-text group-hover:text-luxury-subtext transition-colors leading-tight">
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
