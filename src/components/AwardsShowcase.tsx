"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { getAwardsConfig } from '../lib/adminStore';
import { AwardsConfig } from '../types';

export default function AwardsShowcase() {
  const [config, setConfig] = useState<AwardsConfig | null>(null);

  useEffect(() => {
    setConfig(getAwardsConfig());
  }, []);

  if (!config || config.awards.length === 0) return null;

  // Double/triple the list to create a seamless infinite scrolling marquee effect
  const scrollingAwards = [...config.awards, ...config.awards, ...config.awards, ...config.awards];

  return (
    <section className="py-16 md:py-24 bg-luxury-secondary border-y border-luxury-border overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-8 mb-12">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[11px] font-sans font-normal text-luxury-subtext uppercase tracking-[0.2em] block mb-2">
            {config.heading}
          </span>
          {config.subheading && (
            <p className="font-sans text-xs text-luxury-subtext max-w-md mx-auto font-light leading-relaxed mt-4">
              {config.subheading}
            </p>
          )}
          <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-6" />
        </div>
      </div>

      {/* Scrolling Marquee Area */}
      <div className="relative w-full flex overflow-x-hidden py-4 mask-gradient">
        {/* Left and right fade overlays for high-end aesthetic */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-luxury-secondary to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-luxury-secondary to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex space-x-6 shrink-0"
          animate={{ x: [0, -1920] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 35,
          }}
        >
          {scrollingAwards.map((award, index) => {
            const IconComponent = (Icons as any)[award.iconName] || Icons.Award;

            return (
              <div
                key={`${award.id}-${index}`}
                className="flex items-center space-x-4 bg-luxury-card px-6 py-5 rounded-[20px] border border-luxury-border shadow-[0_4px_40px_-10px_rgba(0,0,0,0.03)] w-[300px] shrink-0 hover:border-luxury-chrome transition-colors duration-500"
              >
                <div className="p-3 bg-luxury-primary rounded-[12px]">
                  <IconComponent className="w-10 h-10 text-luxury-text stroke-[1]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-sans font-normal text-luxury-gold uppercase tracking-[0.15em] block mb-1">
                    {award.organization}
                  </span>
                  <h4 className="text-sm font-serif font-normal text-luxury-text truncate">
                    {award.title}
                  </h4>
                  <span className="text-[11px] text-luxury-muted font-sans font-light block mt-1">
                    Winner • {award.year}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
