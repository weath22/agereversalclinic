"use client";

import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import { getWhyChooseUsConfig } from '../lib/adminStore';
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
  const [config, setConfig] = useState<WhyChooseUsConfig | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeScrollIndex, setActiveScrollIndex] = useState(0);

  useEffect(() => {
    setConfig(getWhyChooseUsConfig());
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const newIndex = Math.round(scrollLeft / (clientWidth * 0.75));
    setActiveScrollIndex(Math.min(newIndex, (config?.pillars.length || 4) - 1));
  };

  const scrollToPillar = (index: number) => {
    if (!scrollContainerRef.current) return;
    const cards = scrollContainerRef.current.children;
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest'
      });
    }
  };

  if (!config) return null;

  return (
    <section className="bg-transparent pt-10 pb-12 sm:pt-16 sm:pb-16 md:py-24 lg:py-32 border-b border-luxury-border/30 relative overflow-hidden">
      {/* Subtle ambient lighting highlights */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-luxury-primary rounded-full blur-[100px] pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-luxury-gold/10 rounded-full blur-[100px] pointer-events-none opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        
        {/* Header Block (Responsive margins) */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <span className="text-[10px] sm:text-xs font-sans font-medium text-luxury-gold uppercase tracking-[0.25em] block mb-2 sm:mb-3">
            Clinical Distinction
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-light text-luxury-text mb-3 sm:mb-5 tracking-tight leading-tight">
            {config.heading}
          </h2>
          <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-5 sm:mt-8" />
        </div>

        {/* Pillars Container: Clean full-bleed image cards with overlay details */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory px-4 sm:px-6 md:px-0 -mx-4 sm:-mx-6 md:mx-0 pb-4 md:pb-0 no-scrollbar items-stretch"
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

            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="min-w-[260px] sm:min-w-[280px] md:min-w-0 flex-1 snap-center group relative overflow-hidden rounded-2xl border border-luxury-border/80 hover:border-luxury-gold/60 transition-all duration-500 cursor-pointer shadow-xs hover:shadow-xl aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] flex flex-col justify-between"
              >
                {/* Full-bleed background image with smooth zoom */}
                <img
                  src={imageUrl}
                  alt={pillar.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  referrerPolicy="no-referrer"
                />

                {/* Bottom gradient scrim affecting only the details text */}
                <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/92 via-black/60 to-transparent pointer-events-none transition-opacity duration-300" />

                {/* Top Overlay Bar: Badge & Floating Icon (closer to top and edges) */}
                <div className="relative z-10 p-2.5 sm:p-3 md:p-3.5 flex items-center justify-between w-full">
                  <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8.5px] sm:text-[9.5px] font-sans font-semibold tracking-wider uppercase bg-white/90 backdrop-blur-md text-luxury-text border border-white/80 shadow-xs">
                    {badgeText}
                  </span>

                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md border border-white/80 flex items-center justify-center text-luxury-text group-hover:bg-luxury-text group-hover:text-luxury-gold transition-all duration-300 shadow-xs">
                    <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
                  </div>
                </div>

                {/* Bottom Overlay: Details positioned closer to edges, cleanly integrated over the image */}
                <div className="relative z-10 p-2.5 sm:p-3 md:p-3.5 pb-3 sm:pb-3.5 md:pb-4 flex flex-col justify-end">
                  <h3 className="font-serif font-normal text-white text-sm sm:text-base md:text-lg mb-1 leading-snug drop-shadow-sm group-hover:text-luxury-gold transition-colors duration-300">
                    {pillar.title}
                  </h3>
                  
                  <p className="font-sans text-[10.5px] sm:text-[11.5px] text-white/80 font-light leading-relaxed line-clamp-3">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Swipe Navigation Dots */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-4 pt-2">
          {config.pillars.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToPillar(i)}
              aria-label={`Scroll to benefit ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeScrollIndex === i ? 'w-6 bg-luxury-text' : 'w-1.5 bg-luxury-border'
              }`}
            />
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="md:hidden text-center mt-2">
          <span className="font-sans text-[10px] text-luxury-muted tracking-wider uppercase">
            &larr; View all standards &rarr;
          </span>
        </div>
      </div>
    </section>
  );
}
