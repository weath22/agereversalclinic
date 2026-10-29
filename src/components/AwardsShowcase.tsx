"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getAwardsConfig, getClinicData, fetchRemoteClinicData } from '../lib/adminStore';
import { AwardsConfig } from '../types';
import { ClinicImageWithPlaceholder } from './common/ClinicImageWithPlaceholder';

import { CLINIC_AWARDS_MEDIA } from '../data/clinicImages';

const awardDermatology = CLINIC_AWARDS_MEDIA[0].image;
const awardRejuvenation = CLINIC_AWARDS_MEDIA[3].image;
const awardPatientSafety = CLINIC_AWARDS_MEDIA[2].image;
const awardLaserClinic = CLINIC_AWARDS_MEDIA[1].image;

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
  const [config, setConfig] = useState<AwardsConfig | null>(() => getAwardsConfig());
  const [isInView, setIsInView] = useState<boolean>(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const syncFromStore = () => {
      const clinicAwards = getClinicData()?.awardsShowcase;
      if (clinicAwards && Array.isArray(clinicAwards.awards) && clinicAwards.awards.length > 0) {
        setConfig({
          heading: clinicAwards.heading,
          subheading: clinicAwards.subheading,
          awards: clinicAwards.awards,
        });
      } else {
        setConfig(getAwardsConfig());
      }
    };

    syncFromStore();
    fetchRemoteClinicData().then((remote) => {
      if (remote?.awardsShowcase && Array.isArray(remote.awardsShowcase.awards) && remote.awardsShowcase.awards.length > 0) {
        setConfig({
          heading: remote.awardsShowcase.heading,
          subheading: remote.awardsShowcase.subheading,
          awards: remote.awardsShowcase.awards,
        });
      }
    });

    window.addEventListener('clinic_data_changed', syncFromStore);
    window.addEventListener('awards_config_updated', syncFromStore);
    return () => {
      window.removeEventListener('clinic_data_changed', syncFromStore);
      window.removeEventListener('awards_config_updated', syncFromStore);
    };
  }, []);

  // IntersectionObserver to pause marquee when off-screen (saves GPU/CPU cycles and prevents heating)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '150px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!config || config.awards.length === 0) return null;

  // Duplicate awards to create a seamless infinite scrolling marquee effect
  const scrollingAwards = [...config.awards, ...config.awards, ...config.awards, ...config.awards];

  return (
    <section 
      ref={sectionRef}
      className="py-14 sm:py-20 md:py-28 bg-[#faf9f8] border-y border-luxury-border overflow-hidden relative isolate transform-gpu"
    >
      {/* Keyframes for Hardware-Accelerated translate3d Infinite Marquee */}
      <style>{`
        @keyframes awardsMarqueeHardware {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .awards-hardware-track {
          display: flex;
          width: max-content;
          will-change: transform;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          animation: awardsMarqueeHardware 38s linear infinite;
        }
        .awards-hardware-track.paused {
          animation-play-state: paused !important;
        }
        @media (hover: hover) {
          .group\\/track:hover .awards-hardware-track {
            animation-play-state: paused;
          }
        }
      `}</style>

      {/* Background Image Layer (Hardware-Accelerated Compositor Texture) */}
      <div className="absolute inset-0 z-0 pointer-events-none transform-gpu overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtB50YnOlyADPuedg2qMzTGO8xfnwOcB7t2-m7_npkuSx1BTCC5UlaJwIdCO6x9ZxKYyMLa3yMXQul9a3Eqcb0D99YLu85cpSvpTEPjnGb1LASgnsPiZNc16H2bbqdwGvMNfakarMRTE7wT9V_i8C6YgRCdQCCE_ym_S8foYNXQtMhkCUQPh0nS01kyTovtyQCHAmrQD15ZBojWP5UyPQs3_I2UV1O9uA38vdL-97__HRpL4P8mETpoJKWggqKuB8N-w"
          alt="Atelier Aura Prestigious Gold Sculptures and Laureate Trophies"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="w-full h-full object-cover object-center brightness-100 contrast-105 opacity-90 transform-gpu"
          style={{ transform: 'translateZ(0)' }}
        />
        {/* Subtle whitish fade overlay for aesthetic clarity & contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white/50 pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 md:px-8 mb-10 sm:mb-14 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-luxury-text mb-3 leading-tight tracking-tight">
            {config.heading || 'Awards & Clinical Recognition'}
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
      <div className="relative z-10 w-full flex overflow-x-hidden py-2 group/track isolate transform-gpu">
        <div
          className={`awards-hardware-track space-x-5 sm:space-x-7 shrink-0 pr-5 sm:pr-7 ${
            !isInView ? 'paused' : ''
          }`}
        >
          {scrollingAwards.map((award, index) => {
            const fallbackImg = DEFAULT_AWARD_IMAGES[award.id] || FALLBACK_LIST[index % FALLBACK_LIST.length];
            const imageUrl = award.imageUrl || fallbackImg;

            return (
              <div
                key={`${award.id}-${index}`}
                className="w-[260px] sm:w-[300px] md:w-[320px] shrink-0 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.10)] hover:shadow-2xl hover:border-luxury-gold/60 transition-all duration-500 overflow-hidden flex flex-col group cursor-pointer transform-gpu will-change-transform"
              >
                {/* 1. Award Image on top */}
                <ClinicImageWithPlaceholder
                  src={imageUrl}
                  slotId={`clinic-award-${award.id}`}
                  alt={award.title}
                  logoSize="md"
                  showBrandText={true}
                  brandSubtext={`${award.year} Honors`}
                  fallbackUrl={fallbackImg}
                  containerClassName="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-luxury-secondary flex items-center justify-center"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106 transform-gpu"
                >
                  {/* Status badge floating on image */}
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-sans font-semibold tracking-wider uppercase bg-white/95 text-luxury-text border border-white/80 shadow-xs">
                      {award.year} Honors
                    </span>
                  </div>
                </ClinicImageWithPlaceholder>

                {/* 2. Details below the image */}
                <div className="p-4 sm:p-5 flex flex-col justify-center bg-white">
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
        </div>
      </div>
    </section>
  );
}
