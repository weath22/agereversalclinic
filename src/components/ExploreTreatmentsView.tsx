import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronRight, X } from 'lucide-react';
import { SPECIALIST_AREAS } from '../data';

interface ExploreTreatmentsViewProps {
  onBookClick: (serviceName?: string) => void;
  onTreatmentClick: (treatmentName: string) => void;
  onClose: () => void;
}

export default function ExploreTreatmentsView({ onBookClick, onTreatmentClick, onClose }: ExploreTreatmentsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAreas = SPECIALIST_AREAS.filter(area => 
    area.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    area.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section with Search */}
      <section className="relative bg-[#003334] text-white pt-32 pb-40 overflow-hidden">
        <div className="absolute top-6 left-4 md:left-8 z-30 flex items-center text-sm text-silver-400 font-sans tracking-wide">
          <button onClick={onClose} className="hover:text-white transition-colors font-semibold cursor-pointer">Home</button>
          <span className="mx-2 text-silver-500">&gt;</span>
          <span className="font-medium text-silver-300">Specialist Areas</span>
        </div>

        {/* Subtle Background Elements */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#c5a880] rounded-full blur-[100px]" />
          <div className="absolute top-40 -left-20 w-72 h-72 bg-[#a9ece5] rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              {/* Left Column */}
              <div className="text-left">
                <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight">
                  Explore Our<br/>Specialist Areas
                </h1>
              </div>

              {/* Right Column */}
              <div className="text-left max-w-xl lg:mt-12">
                <p className="text-silver-300 text-lg md:text-xl mb-6 font-sans leading-relaxed">
                  Discover advanced diagnostics, world-leading consultants, and fast access to treatments tailored to your unique needs.
                </p>
                
                {/* Search Bar */}
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search services..."
                    className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-lg py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-[#c5a880] transition-all shadow-md font-sans text-base"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Curve Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10" style={{ transform: 'translateY(1px)' }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="relative block w-full h-[40px] md:h-[80px]"
          >
            <path 
              d="M0,120 L0,20 Q600,80 1200,40 L1200,120 Z" 
              className="fill-slate-50" 
            ></path>
          </svg>
        </div>
      </section>

      {/* Treatments Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="mb-10 flex justify-between items-center border-b border-silver-200 pb-4">
            <h2 className="text-2xl font-serif font-bold text-[#003334]">
              {searchQuery ? `Search Results (${filteredAreas.length})` : 'All Specialist Areas'}
            </h2>
          </div>

          {filteredAreas.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-silver-500 text-lg mb-6">No treatments found matching "{searchQuery}".</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[#003334] font-semibold underline hover:text-[#c5a880] transition-colors"
              >
                Clear search and view all
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAreas.map((area, idx) => (
                <motion.article
                  key={area.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => onTreatmentClick(area.title)}
                  className="group bg-white rounded-xl overflow-hidden border border-silver-200 hover:border-[#003334] transition-all duration-300 cursor-pointer flex flex-col h-full shadow-sm hover:shadow-md hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-silver-50">
                    <img
                      src={area.image}
                      alt={area.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-serif font-bold text-[18px] text-[#003334] group-hover:text-[#236963] transition-colors leading-tight">
                          {area.title}
                        </h3>
                        <ChevronRight className="h-4 w-4 text-[#003334] group-hover:translate-x-1 transition-transform shrink-0" />
                      </div>
                      <p className="text-[#3f4849] text-sm leading-relaxed line-clamp-3">
                        {area.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
