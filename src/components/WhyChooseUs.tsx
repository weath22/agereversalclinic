"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import { getWhyChooseUsConfig, getClinicData, fetchRemoteClinicData } from '../lib/adminStore';
import { WhyChooseUsConfig } from '../types';

// Fallback high-aesthetic UI images and badges for Why Choose Us pillars
const PILLAR_IMAGES_FALLBACK: Record<string, { image: string; badge: string }> = {
  p1: {
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLvP3DFx2If1DMSMz3JKM0HPzM540kXV5qx4ncam1B_CstR80gJfBU5AgVz_YsPJ7u8V1nICj4IKO0ho2mOZo1vuUDFZEw-Ayq4p14_4qW8gAEOq6vYJFfmXi02IYti-uAUEojYV7cVHRx8-IjuVyoJ6AdGSCYT0VhPznGkC--nZZbr2vqIbtzvJQaOoTpF7vm4dZGfUyfQgXnhGm3ra1mjdJAGKWeB3fhbxho_WV4iW-9ZUAe7bRastfXY',
    badge: 'Harley St Flagship'
  },
  p2: {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww',
    badge: '4.9/5 ★ (2,000+ Reviews)'
  },
  p3: {
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLvbGkim0rHF7Ruf3smBfq7BlZDg7FTbjFo3KTx21CJ86qX2T7gThqEfQmaS69rYUNtNQrnGPXJIOJTcoIOz_hCdUGzS-Cyeio7-DWxIyZZVQH95grNa2bbhnLGjt5IANWtQWycAC7JKxw6K1syY9H1W4ty0-Mpc3D-dH4coJR0zr5IaxigQ7G2BRK9YnWheyv8CjvRuSu4fbTW4fj4AP8QhZU3p2G1Rg0ztNQS13w1SZT_7bU3qioomJ9_f',
    badge: 'FDA-Cleared Tech'
  },
  p4: {
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLsFtpFDuaNJSlvtgV5ykI3LUHSXc0rzKFYXGGNqkYq6ujIGrmaVAI-UUZWBC9h6l95unMnlba0hL6OSt_W08ItQlzC4HTVhrV4H7Itfm0m7scTAtpBiomP9SY89c7Uj0Q5mgYXMjovpZuGcczZeQepLx4ye1bw1emHNdm8GxyKyt8TftVi79q1QOO0MHef213jXO6KWOkNL6ufVfwZSrPS20twzy3Jy2_MEVCz9mR9pJVAW24L2KhOTQP9P',
    badge: 'GMC Registered'
  }
};

export default function WhyChooseUs() {
  const [config, setConfig] = useState<WhyChooseUsConfig | null>(() => getWhyChooseUsConfig());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeScrollIndex, setActiveScrollIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag-to-scroll support for desktop and tablet pointing devices
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  useEffect(() => {
    const syncFromStore = () => {
      const clinicWhy = getClinicData()?.whyChooseUs;
      if (clinicWhy && Array.isArray(clinicWhy.pillars) && clinicWhy.pillars.length > 0) {
        setConfig({
          heading: clinicWhy.heading,
          subheading: clinicWhy.subheading,
          description: clinicWhy.subheading || '',
          pillars: clinicWhy.pillars,
        });
      } else {
        setConfig(getWhyChooseUsConfig());
      }
    };

    syncFromStore();
    fetchRemoteClinicData().then((remote) => {
      if (remote?.whyChooseUs && Array.isArray(remote.whyChooseUs.pillars) && remote.whyChooseUs.pillars.length > 0) {
        setConfig({
          heading: remote.whyChooseUs.heading,
          subheading: remote.whyChooseUs.subheading,
          description: remote.whyChooseUs.subheading || '',
          pillars: remote.whyChooseUs.pillars,
        });
      }
    });

    window.addEventListener('clinic_data_changed', syncFromStore);
    window.addEventListener('why_choose_us_updated', syncFromStore);
    return () => {
      window.removeEventListener('clinic_data_changed', syncFromStore);
      window.removeEventListener('why_choose_us_updated', syncFromStore);
    };
  }, []);

  const isProgrammaticScrollRef = useRef(false);
  const programmaticTimeoutRef = useRef<number | null>(null);

  const updateScrollState = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth, children } = scrollContainerRef.current;
    const maxIndex = (config?.pillars.length || 4) - 1;

    setCanScrollLeft(scrollLeft > 8 || activeScrollIndex > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8 || activeScrollIndex < maxIndex);

    if (!isProgrammaticScrollRef.current && children.length > 0) {
      const firstChild = children[0] as HTMLElement;
      const cardWidth = firstChild.getBoundingClientRect().width;
      const gap = 24;
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setActiveScrollIndex(Math.max(0, Math.min(index, maxIndex)));
    }
  }, [config?.pillars.length, activeScrollIndex]);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => {
      window.removeEventListener('resize', updateScrollState);
      if (programmaticTimeoutRef.current) {
        window.clearTimeout(programmaticTimeoutRef.current);
      }
    };
  }, [updateScrollState]);

  const scrollToPillar = (index: number) => {
    const maxIndex = (config?.pillars.length || 4) - 1;
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    setActiveScrollIndex(clampedIndex);

    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const targetCard = container.children[clampedIndex] as HTMLElement | undefined;
    if (targetCard) {
      isProgrammaticScrollRef.current = true;
      if (programmaticTimeoutRef.current) {
        window.clearTimeout(programmaticTimeoutRef.current);
      }
      const targetLeft = targetCard.offsetLeft - container.offsetLeft;
      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth'
      });
      programmaticTimeoutRef.current = window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 450);
    }
  };

  const slide = (direction: 'left' | 'right') => {
    const maxIndex = (config?.pillars.length || 4) - 1;
    const nextIndex =
      direction === 'left'
        ? Math.max(0, activeScrollIndex - 1)
        : Math.min(maxIndex, activeScrollIndex + 1);
    scrollToPillar(nextIndex);
  };

  // Drag-to-scroll event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isProgrammaticScrollRef.current = false;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftPos(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.4;
    scrollContainerRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  if (!config) return null;

  return (
    <section className="bg-transparent pt-10 pb-12 sm:pt-16 sm:pb-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Subtle ambient lighting highlights */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-luxury-primary rounded-full blur-[100px] pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-luxury-gold/10 rounded-full blur-[100px] pointer-events-none opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        
        {/* Header Block (Classic centered styling without top buttons) */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <span className="text-[10px] sm:text-xs font-sans font-medium text-luxury-gold uppercase tracking-[0.25em] block mb-2 sm:mb-3">
            Clinical Distinction
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-light text-luxury-text mb-3 sm:mb-5 tracking-tight leading-tight">
            {config.heading}
          </h2>
          {(config.subheading || config.description) && (
            <p className="font-sans text-xs sm:text-sm text-luxury-subtext max-w-xl mx-auto font-light leading-relaxed">
              {config.subheading || config.description}
            </p>
          )}
          <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-5 sm:mt-8" />
        </div>

        {/* Carousel Wrapper: Edge Navigation Brackets on Desktop & Tablet Only */}
        <div className="relative group/carousel">
          {/* Left Navigation Bracket: Placed on the edge of the cards on desktop and tablet only */}
          <button
            type="button"
            onClick={() => slide('left')}
            disabled={!canScrollLeft}
            aria-label="Previous standard"
            className="hidden md:flex absolute -left-3 md:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 lg:w-12 lg:h-12 rounded-full border border-luxury-border/90 hover:border-luxury-gold bg-white/95 backdrop-blur-md text-luxury-text hover:text-luxury-gold items-center justify-center transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none shadow-md hover:shadow-xl active:scale-95 cursor-pointer"
          >
            <Icons.ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </button>

          {/* Pillars Track: Slidable horizontally on mobile, tablet, and desktop */}
          <div
            ref={scrollContainerRef}
            onScroll={updateScrollState}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex gap-4 sm:gap-6 lg:gap-7 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar items-stretch pl-4 pr-6 sm:px-6 md:px-1 -mx-4 sm:-mx-6 md:mx-0 scroll-pl-4 sm:scroll-pl-6 md:scroll-pl-1 py-3 ${
              isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
          >
            {config.pillars.map((pillar, idx) => {
              // Resolve icon dynamically
              const IconComponent = (Icons as any)[pillar.iconName] || Icons.Building;
              
              // Resolve image & badge (from pillar config, with fallback)
              const fallback = PILLAR_IMAGES_FALLBACK[pillar.id] || {
                image: 'https://lh3.googleusercontent.com/aida/AP1WRLvP3DFx2If1DMSMz3JKM0HPzM540kXV5qx4ncam1B_CstR80gJfBU5AgVz_YsPJ7u8V1nICj4IKO0ho2mOZo1vuUDFZEw-Ayq4p14_4qW8gAEOq6vYJFfmXi02IYti-uAUEojYV7cVHRx8-IjuVyoJ6AdGSCYT0VhPznGkC--nZZbr2vqIbtzvJQaOoTpF7vm4dZGfUyfQgXnhGm3ra1mjdJAGKWeB3fhbxho_WV4iW-9ZUAe7bRastfXY',
                badge: 'Aesthetic Standard'
              };
              const imageUrl = pillar.imageUrl || fallback.image;
              const badgeText = pillar.badge || fallback.badge;
              const isFocusedCard = activeScrollIndex === idx;

              return (
                <motion.div
                  key={pillar.id}
                  tabIndex={0}
                  onClick={() => scrollToPillar(idx)}
                  onFocus={() => setActiveScrollIndex(idx)}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className={`w-[270px] sm:w-[310px] md:w-[340px] lg:w-[330px] xl:w-[360px] shrink-0 snap-start group relative overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] flex flex-col justify-between select-none focus:outline-none ${
                    isFocusedCard
                      ? 'border-2 border-luxury-gold ring-2 ring-luxury-gold/30 shadow-xl'
                      : 'border border-luxury-border/80 hover:border-luxury-gold/60 shadow-xs hover:shadow-xl'
                  }`}
                >
                  {/* High-visibility inner border ring so the focus border stays crisp above the full-bleed image and bottom bar */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 z-30 rounded-2xl transition-all duration-300 ${
                      isFocusedCard
                        ? 'border-2 border-luxury-gold shadow-[inset_0_0_0_1px_rgba(216,194,163,0.35)]'
                        : 'border border-transparent group-hover:border-luxury-gold/50 group-focus-visible:border-2 group-focus-visible:border-luxury-gold'
                    }`}
                  />

                  {/* Full-bleed background image with smooth zoom */}
                  <img
                    src={imageUrl}
                    alt={pillar.title}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />

                  {/* Subtle top gradient scrim for badge & icon clarity */}
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 via-black/15 to-transparent pointer-events-none" />

                  {/* Top Overlay Bar: Clean outlined Badge & Outlined Icon with enhanced size and border */}
                  <div className="relative z-10 p-3.5 sm:p-4 md:p-4.5 flex items-center justify-between w-full pointer-events-none">
                    <span
                      className={`inline-flex items-center px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-sans font-medium tracking-wider uppercase bg-transparent border-[1.5px] backdrop-blur-[2px] shadow-xs transition-colors duration-300 ${
                        isFocusedCard
                          ? 'border-luxury-gold text-luxury-gold'
                          : 'border-white/80 text-white group-hover:border-luxury-gold group-hover:text-luxury-gold'
                      }`}
                    >
                      {badgeText}
                    </span>

                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-transparent border-[1.5px] flex items-center justify-center backdrop-blur-[2px] shadow-xs transition-colors duration-300 ${
                        isFocusedCard
                          ? 'border-luxury-gold text-luxury-gold'
                          : 'border-white/80 text-white group-hover:border-luxury-gold group-hover:text-luxury-gold'
                      }`}
                    >
                      <IconComponent className="h-4 w-4 sm:h-4.5 sm:w-4.5" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Bottom Dark Transparent Bar: Styled like treatment pricing cards */}
                  <div className="absolute inset-x-0 bottom-0 w-full bg-noir-900/65 sm:bg-noir-900/60 backdrop-blur-[2px] border-t border-white/10 p-3.5 sm:p-4 md:p-4.5 z-20 flex flex-col justify-end pointer-events-none transition-colors duration-300 group-hover:bg-noir-900/75">
                    <h3
                      className={`font-serif font-normal text-sm sm:text-base md:text-lg mb-1 leading-snug drop-shadow-sm transition-colors duration-300 ${
                        isFocusedCard
                          ? 'text-luxury-gold'
                          : 'text-white group-hover:text-luxury-gold'
                      }`}
                    >
                      {pillar.title}
                    </h3>
                    
                    <p className="font-sans text-xs sm:text-[13px] md:text-sm text-white/90 font-light leading-relaxed line-clamp-3">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Navigation Bracket: Placed on the edge of the cards on desktop and tablet only */}
          <button
            type="button"
            onClick={() => slide('right')}
            disabled={!canScrollRight}
            aria-label="Next standard"
            className="hidden md:flex absolute -right-3 md:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 lg:w-12 lg:h-12 rounded-full border border-luxury-border/90 hover:border-luxury-gold bg-white/95 backdrop-blur-md text-luxury-text hover:text-luxury-gold items-center justify-center transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none shadow-md hover:shadow-xl active:scale-95 cursor-pointer"
          >
            <Icons.ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Mobile Swipe Navigation Dots (Mobile only) */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-4 pt-2">
          {config.pillars.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToPillar(i)}
              aria-label={`Scroll to standard ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeScrollIndex === i ? 'w-6 bg-luxury-text' : 'w-1.5 bg-luxury-border'
              }`}
            />
          ))}
        </div>

        {/* Mobile Swipe Hint (Mobile only) */}
        <div className="md:hidden text-center mt-2">
          <span className="font-sans text-[10px] text-luxury-muted tracking-wider uppercase">
            &larr; Swipe to view all standards &rarr;
          </span>
        </div>

        {/* Desktop & Tablet Navigation Dots */}
        <div className="hidden md:flex items-center justify-center gap-2 mt-6 pt-2">
          {config.pillars.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToPillar(i)}
              aria-label={`Scroll to standard ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeScrollIndex === i 
                  ? 'w-7 lg:w-8 bg-luxury-text shadow-xs' 
                  : 'w-1.5 lg:w-2 bg-luxury-border hover:bg-luxury-gold/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
