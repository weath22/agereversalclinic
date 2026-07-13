"use client";

import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getWhyChooseUsConfig } from '../lib/adminStore';
import { WhyChooseUsConfig } from '../types';

export default function WhyChooseUs() {
  const [config, setConfig] = useState<WhyChooseUsConfig | null>(null);

  useEffect(() => {
    setConfig(getWhyChooseUsConfig());
  }, []);

  if (!config) return null;

  return (
    <section className="bg-luxury-secondary py-24 md:py-32 border-b border-luxury-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif font-light text-luxury-text mb-6 tracking-tight leading-tight">
            {config.heading}
          </h2>
          <p className="font-sans text-sm md:text-base text-luxury-subtext max-w-2xl mx-auto font-light leading-relaxed">
            {config.description}
          </p>
          <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-8" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {config.pillars.map((pillar) => {
            // Dynamically resolve the Lucide icon from the string config
            const IconComponent = (Icons as any)[pillar.iconName] || Icons.Building;

            return (
              <div key={pillar.id} className="flex flex-row md:flex-col items-start md:items-center md:text-center group gap-6 md:gap-0">
                <div className="shrink-0 md:mb-8 p-5 rounded-full bg-luxury-card shadow-sm border border-luxury-border group-hover:bg-luxury-primary group-hover:border-luxury-gold transition-all duration-500">
                  <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-luxury-text group-hover:text-luxury-gold transition-colors duration-500" strokeWidth={1.5} />
                </div>
                <div className="text-left md:text-center mt-1 md:mt-0">
                  <h3 className="font-serif font-normal text-luxury-text text-lg mb-3 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-sm text-luxury-subtext font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
