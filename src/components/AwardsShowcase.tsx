"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getAwardsConfig } from '../lib/adminStore';
import { AwardsConfig } from '../types';

import awardDermatology from '../assets/images/award_dermatology_clinic_1790683429721.jpg';
import awardRejuvenation from '../assets/images/award_rejuvenation_1790683444883.jpg';
import awardPatientSafety from '../assets/images/award_patient_safety_1790683459184.jpg';
import awardLaserClinic from '../assets/images/award_laser_clinic_1790683474325.jpg';

const DEFAULT_AWARD_IMAGES: Record<string, string> = {
  'aw-1': awardDermatology,
  'aw-2': awardRejuvenation,
  'aw-3': awardPatientSafety,
  'aw-4': awardLaserClinic,
};

const FALLBACK_LIST = [
  awardDermatology,
  awardRejuvenation,
  awardPatientSafety,
  awardLaserClinic
];

export default function AwardsShowcase() {
  const [config, setConfig] = useState<AwardsConfig | null>(null);

  useEffect(() => {
    setConfig(getAwardsConfig());
  }, []);

  if (!config || config.awards.length === 0) return null;

  // Duplicate awards to create a seamless infinite scrolling marquee effect
  const scrollingAwards = [...config.awards, ...config.awards, ...config.awards, ...config.awards];

  return (
    <section className="py-14 sm:py-20 md:py-28 bg-luxury-secondary border-y border-luxury-border overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-8 mb-10 sm:mb-14">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-luxury-text mb-3 leading-tight tracking-tight">
            Awards & Clinical Recognition
          </h2>
          {config.subheading && (
            <p className="font-sans text-xs sm:text-sm text-luxury-subtext max-w-lg mx-auto font-light leading-relaxed">
              {config.subheading}
            </p>
          )}
          <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-5 sm:mt-7" />
        </div>
      </div>

      {/* Scrolling Marquee Area */}
      <div className="relative w-full flex overflow-x-hidden py-2 group/track">
        <motion.div
          className="flex space-x-5 sm:space-x-7 shrink-0 pr-5 sm:pr-7"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 36,
          }}
        >
          {scrollingAwards.map((award, index) => {
            const fallbackImg = DEFAULT_AWARD_IMAGES[award.id] || FALLBACK_LIST[index % FALLBACK_LIST.length];
            const imageUrl = award.imageUrl || fallbackImg;

            return (
              <div
                key={`${award.id}-${index}`}
                className="w-[260px] sm:w-[300px] md:w-[320px] shrink-0 bg-luxury-card rounded-2xl sm:rounded-3xl border border-luxury-border/80 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-luxury-gold/50 transition-all duration-500 overflow-hidden flex flex-col group cursor-pointer"
              >
                {/* 1. Award Image on top */}
                <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-luxury-secondary">
                  <img
                    src={imageUrl}
                    alt={award.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    referrerPolicy="no-referrer"
                  />
                  {/* Status badge floating on image */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-sans font-semibold tracking-wider uppercase bg-white/95 backdrop-blur-md text-luxury-text border border-white/80 shadow-xs">
                      {award.year} Honors
                    </span>
                  </div>
                </div>

                {/* 2. Details below the image (No icon item) */}
                <div className="p-4 sm:p-5 flex flex-col justify-center bg-luxury-card">
                  <span className="text-[10px] sm:text-[11px] font-sans font-semibold text-luxury-gold uppercase tracking-[0.16em] block mb-1.5 truncate">
                    {award.organization}
                  </span>
                  <h4 className="text-sm sm:text-base font-serif font-normal text-luxury-text leading-snug group-hover:text-luxury-subtext transition-colors duration-300">
                    {award.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
