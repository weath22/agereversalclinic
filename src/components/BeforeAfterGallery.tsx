"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBeforeAfterGalleryConfig } from '../lib/adminStore';
import { BeforeAfterGalleryConfig } from '../types';

interface PolaroidComparisonProps {
  key?: string;
  title: string;
  beforeImage: string;
  afterImage: string;
}

function PolaroidComparison({ title, beforeImage, afterImage }: PolaroidComparisonProps) {
  return (
    <div className="flex flex-col items-center w-full px-1">
      {/* Side-by-side frames with overlapping negative space */}
      <div className="flex flex-row items-center justify-center -space-x-5 sm:-space-x-5 md:-space-x-6 lg:-space-x-8 xl:-space-x-10 py-3 sm:py-4 w-full">
        
        {/* Left Frame: Before */}
        <motion.div
          initial={{ opacity: 0, x: -15, rotate: -3 }}
          whileInView={{ opacity: 1, x: 0, rotate: -1.5 }}
          viewport={{ once: true, margin: "-50px" }}
          whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
          transition={{ type: 'spring', stiffness: 90, damping: 15 }}
          className="bg-luxury-card p-3 sm:p-4 rounded-[20px] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.06)] border border-luxury-border flex flex-col relative group cursor-pointer flex-1 min-w-[110px] max-w-[155px] sm:max-w-[180px] md:max-w-[210px] lg:max-w-[220px] xl:max-w-[240px] z-10"
        >
          {/* Main Photo Container */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-luxury-secondary border border-luxury-border/60 rounded-[12px]">
            <img 
              src={beforeImage} 
              alt={`${title} Before Treatment`} 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* "Before" Pill Badge */}
          <div className="absolute bottom-[16px] sm:bottom-[20px] md:bottom-[24px] left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
            <div className="bg-luxury-primary px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-luxury-border text-luxury-muted font-sans text-[8px] sm:text-[9px] md:text-[10px] font-normal shadow-[0_4px_12px_rgba(0,0,0,0.03)] tracking-[0.1em] uppercase">
              Before
            </div>
          </div>
        </motion.div>

        {/* Right Frame: After */}
        <motion.div
          initial={{ opacity: 0, x: 15, rotate: 3 }}
          whileInView={{ opacity: 1, x: 0, rotate: 1.5 }}
          viewport={{ once: true, margin: "-50px" }}
          whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
          transition={{ type: 'spring', stiffness: 90, damping: 15 }}
          className="bg-luxury-card p-3 sm:p-4 rounded-[20px] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.06)] border border-luxury-border flex flex-col relative group cursor-pointer flex-1 min-w-[110px] max-w-[155px] sm:max-w-[180px] md:max-w-[210px] lg:max-w-[220px] xl:max-w-[240px] z-20"
        >
          {/* Main Photo Container */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-luxury-secondary border border-luxury-border/60 rounded-[12px]">
            <img 
              src={afterImage} 
              alt={`${title} After Treatment`} 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* "After" Pill Badge */}
          <div className="absolute bottom-[16px] sm:bottom-[20px] md:bottom-[24px] left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
            <div className="bg-black text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-black font-sans text-[8px] sm:text-[9px] md:text-[10px] font-normal shadow-[0_4px_12px_rgba(0,0,0,0.15)] tracking-[0.1em] uppercase flex items-center gap-1.5">
              <Sparkles className="h-2 w-2 text-luxury-gold shrink-0 animate-pulse" strokeWidth={1.5} />
              <span>After</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Polaroid Title label text */}
      <h4 className="text-center font-sans text-[11px] sm:text-xs font-normal text-luxury-text uppercase tracking-widest mt-4 px-1">
        {title}
      </h4>
    </div>
  );
}

export default function BeforeAfterGallery() {
  const [config, setConfig] = useState<BeforeAfterGalleryConfig | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setConfig(getBeforeAfterGalleryConfig());
  }, []);

  if (!config || config.categories.length === 0) {
    return null;
  }

  const allCategories = [
    { id: 'all', name: 'All' },
    ...config.categories
  ];

  const currentCategoryData = activeCategory === 'all'
    ? config.categories.flatMap(c => c.pairs)
    : (config.categories.find(c => c.id === activeCategory)?.pairs || []);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(currentCategoryData.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visiblePairs = currentCategoryData.slice(currentIndex * itemsPerPage, currentIndex * itemsPerPage + itemsPerPage);

  return (
    <section id="gallery" className="py-24 md:py-32 bg-luxury-secondary overflow-hidden relative border-y border-luxury-border">
      {/* Subtle aesthetic canvas highlights for floating depth */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-luxury-primary rounded-full blur-[100px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-luxury-primary rounded-full blur-[100px] pointer-events-none opacity-50" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[11px] font-sans font-normal text-luxury-subtext uppercase tracking-[0.2em] block mb-4">
            Before &amp; After Gallery
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-luxury-text mb-6 leading-tight">
            {config.heading}
          </h2>
          <p className="font-sans text-sm md:text-base text-luxury-subtext font-light max-w-2xl mx-auto leading-relaxed mb-8">
            {config.description}
          </p>
          <div className="w-12 h-[1px] bg-luxury-gold mx-auto" />
        </div>

        {/* Category Selector Tabs */}
        <div 
          className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-x-visible justify-start md:justify-center gap-3 mb-16 max-w-3xl mx-auto pb-4 md:pb-0 px-4 md:px-0 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setCurrentIndex(0);
              }}
              className={`px-6 py-3 rounded-full font-sans text-[11px] md:text-xs font-normal tracking-[0.15em] uppercase border transition-all duration-300 shrink-0 snap-center whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-black text-white border-black shadow-md scale-102'
                  : 'bg-luxury-card text-luxury-subtext border-luxury-border hover:text-luxury-text hover:bg-luxury-secondary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 2x2 Grid for 4 pairs (desktop) or 1 pair (mobile) */}
        <div className="overflow-hidden min-h-[340px] md:min-h-[480px]">
          <AnimatePresence mode="wait">
            {visiblePairs.length > 0 ? (
              <motion.div 
                key={`${activeCategory}-${currentIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-10 sm:gap-y-14 lg:gap-x-16 lg:gap-y-16 max-w-6xl mx-auto justify-items-center"
              >
                {visiblePairs.map((item) => (
                  <PolaroidComparison 
                    key={item.id}
                    title={item.title}
                    beforeImage={item.beforeImage}
                    afterImage={item.afterImage}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12 text-luxury-muted font-sans font-light">
                No items in this category.
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Premium numbered back and forth pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 pt-16">
            <button
              onClick={prevSlide}
              aria-label="Previous Page"
              className="w-12 h-12 flex items-center justify-center rounded-full border border-luxury-border text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text transition-colors duration-300 shrink-0 bg-white"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>
            
            <div className="flex items-center gap-3">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-sans text-sm transition-all duration-300 ${
                      currentIndex === i
                        ? 'bg-luxury-text text-luxury-primary font-normal shadow-sm'
                        : 'text-luxury-subtext hover:bg-luxury-card'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next Page"
              className="w-12 h-12 flex items-center justify-center rounded-full border border-luxury-border text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text transition-colors duration-300 shrink-0 bg-white"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
