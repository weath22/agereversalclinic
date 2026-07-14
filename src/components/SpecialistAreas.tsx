import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SpecialistAreasConfig } from '../types';

interface SpecialistAreasProps {
  onBookClick: (serviceName?: string) => void;
  onTreatmentClick?: (treatmentName: string) => void;
  onExploreAllClick?: () => void;
  specialistAreasConfig?: SpecialistAreasConfig;
}

interface AreaItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export default function SpecialistAreas({ onBookClick, onTreatmentClick, onExploreAllClick, specialistAreasConfig }: SpecialistAreasProps) {
  
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Compute dynamic pages based on specialistAreasConfig.areas
  const areas = specialistAreasConfig?.areas || [];
  const chunkedPages: Record<number, AreaItem[]> = {};
  const itemsPerPage = 4;

  if (areas.length > 0) {
    for (let i = 0; i < areas.length; i += itemsPerPage) {
      const pageNum = Math.floor(i / itemsPerPage) + 1;
      chunkedPages[pageNum] = areas.slice(i, i + itemsPerPage);
    }
  }

  const pagesData = Object.keys(chunkedPages).length > 0 ? chunkedPages : { 1: [] };
  const totalPages = Object.keys(pagesData).length || 1;


  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));
  };

  return (
    <div className="w-full">
      {/* 1. Explore Specialist Areas Section (HTML replica with premium touch) */}
      <section id="specialist-areas" className="py-24 md:py-32 bg-luxury-secondary border-b border-luxury-border">
        <div className="container mx-auto px-4 md:px-12 max-w-7xl">
          
          {/* Header Layout */}
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-serif font-light text-luxury-text mb-6 tracking-tight leading-tight">
                {specialistAreasConfig?.heading ? (
                   <span dangerouslySetInnerHTML={{ __html: specialistAreasConfig.heading.replace('areas', '<span class="italic text-luxury-gold">areas</span>') }} />
                ) : (
                  <>Explore our specialist <span className="italic text-luxury-gold">areas</span></>
                )}
              </h2>
              <p className="font-sans text-sm md:text-base text-luxury-subtext font-light leading-relaxed">
                {specialistAreasConfig?.description || "At The London Clinic, we offer advanced diagnostics, world-leading consultants and fast access to appointments - often within 48 hours - so your treatment can begin in days, not months. Whether you're worried about cancer, fatigue, weight loss, unexplained symptoms or a family medical history, we move quickly to get you the right help."}
              </p>
            </div>
            <div className="shrink-0 mt-4 lg:mt-0">
              <button
                onClick={() => onExploreAllClick ? onExploreAllClick() : onBookClick('All Specialty Areas')}
                className="bg-white border border-luxury-border text-luxury-text px-8 py-3.5 rounded-full hover:bg-luxury-card transition-colors duration-300 font-sans font-normal tracking-wide flex items-center gap-2 cursor-pointer"
              >
                <span>See all treatment areas</span>
                <ChevronRight className="h-4 w-4 text-luxury-muted group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </button>
            </div>
          </header>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <AnimatePresence mode="wait">
              {pagesData[currentPage].map((area, idx) => (
                <motion.article
                  key={`${currentPage}-${area.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                  onClick={() => onTreatmentClick ? onTreatmentClick(area.title) : onBookClick(area.title)}
                  className="group bg-luxury-card overflow-hidden border border-luxury-border hover:border-luxury-chrome transition-all duration-500 cursor-pointer flex flex-col h-full shadow-[0_4px_40px_-10px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-luxury-secondary relative">
                    <img
                      src={area.image}
                      alt={area.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  </div>
                  <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-serif font-normal text-xl text-luxury-text group-hover:text-luxury-subtext transition-colors leading-tight">
                          {area.title}
                        </h3>
                        <ChevronRight className="h-4 w-4 text-luxury-muted group-hover:translate-x-1 transition-transform shrink-0" strokeWidth={1.5} />
                      </div>
                      <p className="font-sans text-sm text-luxury-subtext font-light leading-relaxed">
                        {area.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {/* Carousel Pagination */}
          <div className="flex items-center justify-center gap-6 py-4">
            <button
              onClick={handlePrevPage}
              aria-label="Previous Page"
              className="w-12 h-12 flex items-center justify-center rounded-full border border-luxury-border text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text transition-colors duration-300 shrink-0"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            
            <div className="flex items-center gap-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-sans text-sm transition-all duration-300 ${
                    currentPage === pageNum
                      ? 'bg-luxury-text text-luxury-primary font-normal'
                      : 'text-luxury-subtext hover:bg-luxury-card'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              aria-label="Next Page"
              className="w-12 h-12 flex items-center justify-center rounded-full border border-luxury-border text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text transition-colors duration-300 shrink-0"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
