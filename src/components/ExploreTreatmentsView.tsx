import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, X } from 'lucide-react';
import {
  SpecialistAreaCard,
  useResolvedSpecialistTreatments,
} from './SpecialistAreas';

interface ExploreTreatmentsViewProps {
  onBookClick: (serviceName?: string) => void;
  onTreatmentClick: (treatmentName: string, branchCategory?: string) => void;
  onClose: () => void;
}

export default function ExploreTreatmentsView({ onBookClick, onTreatmentClick, onClose }: ExploreTreatmentsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { treatmentsList, isHydratingAreas } = useResolvedSpecialistTreatments();

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredAreas = treatmentsList.filter(
    (area) =>
      area.title.toLowerCase().includes(normalizedQuery) ||
      area.description.toLowerCase().includes(normalizedQuery) ||
      (area.category && area.category.toLowerCase().includes(normalizedQuery))
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section with Search */}
      <section className="relative bg-[#003334] text-white pt-5 pb-12 sm:pt-7 sm:pb-14 md:pt-9 md:pb-18 lg:pt-10 lg:pb-24 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-[#c5a880] rounded-full blur-[90px]" />
          <div className="absolute top-24 -left-20 w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-[#a9ece5] rounded-full blur-[90px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl relative z-10">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center text-xs sm:text-sm text-silver-400 font-sans tracking-wide mb-4 sm:mb-6 lg:mb-8"
          >
            <button
              onClick={onClose}
              className="hover:text-white transition-colors font-semibold cursor-pointer"
            >
              Home
            </button>
            <span className="mx-2 text-silver-500">&gt;</span>
            <span className="font-medium text-silver-300">Specialist Areas</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6 lg:gap-12 xl:gap-20 items-center">
              {/* Left Column */}
              <div className="text-left lg:col-span-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[54px] font-serif font-bold leading-[1.15] tracking-tight">
                  Explore Our{' '}
                  <br className="hidden sm:block" />
                  Specialist Areas
                </h1>
              </div>

              {/* Right Column */}
              <div className="text-left max-w-xl lg:max-w-none lg:col-span-6">
                <p className="text-silver-300 text-xs sm:text-sm md:text-base lg:text-lg mb-3.5 sm:mb-4 lg:mb-5 font-sans leading-relaxed">
                  Discover advanced diagnostics, world-leading consultants, and fast access to treatments tailored to your unique needs.
                </p>

                {/* Search Bar */}
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-3.5 sm:left-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search services..."
                    className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-lg py-2.5 sm:py-3 lg:py-3.5 pl-10 sm:pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-[#c5a880] transition-all shadow-md font-sans text-sm sm:text-base"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Curve Divider */}
        <div
          className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10"
          style={{ transform: 'translateY(1px)' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[22px] sm:h-[32px] md:h-[44px] lg:h-[60px]"
          >
            <path
              d="M0,120 L0,20 Q600,80 1200,40 L1200,120 Z"
              className="fill-slate-50"
            ></path>
          </svg>
        </div>
      </section>

      {/* Treatments Grid Section */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-12 max-w-7xl">
          <div className="mb-6 sm:mb-8 md:mb-10 flex justify-between items-center border-b border-silver-200 pb-3 sm:pb-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#003334]">
              {searchQuery ? `Search Results (${filteredAreas.length})` : 'All Specialist Areas'}
            </h2>
          </div>

          {filteredAreas.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-silver-500 text-lg mb-6">No treatments found matching "{searchQuery}".</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[#003334] font-semibold underline hover:text-[#c5a880] transition-colors cursor-pointer"
              >
                Clear search and view all
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 -mx-1.5">
              {filteredAreas.map((treatment, idx) => (
                <SpecialistAreaCard
                  key={treatment.id}
                  treatment={treatment}
                  idx={idx}
                  isHydratingAreas={isHydratingAreas}
                  onTreatmentClick={onTreatmentClick}
                  onBookClick={onBookClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

