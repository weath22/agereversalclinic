import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Sparkles } from 'lucide-react';
import {
  FaceCleansingIcon,
  SheetMaskIcon,
  RadianceGlowIcon,
  FacialMappingIcon,
  MicroDropletInfusionIcon,
  ContourLiftIcon,
  BioShieldSealingIcon
} from './icons/ClinicalProtocolIcons';
import { 
  getClinicalProtocolsConfig, 
  getClinicalProtocolByTreatmentId 
} from '../lib/adminStore';
import { ProtocolStepItem, TreatmentProtocolGroup } from '../types';

export interface HowItWorksStep {
  id?: string;
  stepNumber?: number;
  title: string;
  description: string;
  image?: string;
  phaseTag?: string;
  duration?: string;
  focusArea?: string;
  icon?: React.ComponentType<any>;
}

interface HowItWorksTimelineProps {
  treatmentId: string;
  treatmentName?: string;
  className?: string;
}

const DEFAULT_FALLBACK_IMAGE = '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg';

// Hardcoded initial fallback steps if store is uninitialized
const getStaticFallbackSteps = (id: string): HowItWorksStep[] => {
  switch (id) {
    case 'exosome':
      return [
        {
          id: 'exo-1',
          stepNumber: 1,
          title: 'Epidermal Clearing',
          description: 'The skin surface is meticulously cleansed and prepared using medical-grade formulations to ensure zero barrier interference.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 1 • 10 mins',
          duration: '10 mins',
          focusArea: 'Surface Epidermis'
        },
        {
          id: 'exo-2',
          stepNumber: 2,
          title: 'Pathway Micro-Channels',
          description: 'Microscopic pathways are gently opened in the dermis, setting up the structural guide channels for deep cell permeability.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 2 • 15 mins',
          duration: '15 mins',
          focusArea: 'Upper Papillary Dermis'
        },
        {
          id: 'exo-3',
          stepNumber: 3,
          title: 'Exosome Influx',
          description: 'Pure, clinical-grade signaling exosomes are introduced, delivering growth factors and signaling lipids directly to the deep dermal matrix.',
          image: '/assets/aistudio/Sheet_Face_Mask_Vector_Illustration_-_Graphics_by_Canva_a7a34ce5.jpg',
          phaseTag: 'Phase 3 • 20 mins',
          duration: '20 mins',
          focusArea: 'Deep Dermal Matrix'
        },
        {
          id: 'exo-4',
          stepNumber: 4,
          title: 'Cellular Sealing',
          description: 'A soothing bio-active sealant is applied to calm the tissue, lock in the exosomes, and initiate immediate cellular repair.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 4 • 10 mins',
          duration: '10 mins',
          focusArea: 'Lipid Moisture Barrier'
        }
      ];
    default:
      return [
        {
          id: 'gen-1',
          stepNumber: 1,
          title: 'Barrier Diagnosis & Cleansing',
          description: 'We analyze your skin barrier, hydration levels, and target goals to tailor an optimal aesthetic prescription.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 1 • 10 mins',
          duration: '10 mins',
          focusArea: 'Stratum Corneum'
        },
        {
          id: 'gen-2',
          stepNumber: 2,
          title: 'Custom Pre-Conditioning',
          description: 'Preparing the dermal matrix with premium medical-grade formulations specific to your skin health requirements.',
          image: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
          phaseTag: 'Phase 2 • 15 mins',
          duration: '15 mins',
          focusArea: 'Epidermal Barrier'
        },
        {
          id: 'gen-3',
          stepNumber: 3,
          title: 'Precision Protocol Phase',
          description: 'Administering targeted technologies or infusions under strict clinical safety and medical calibration parameters.',
          image: '/assets/aistudio/Sheet_Face_Mask_Vector_Illustration_-_Graphics_by_Canva_a7a34ce5.jpg',
          phaseTag: 'Phase 3 • 25 mins',
          duration: '25 mins',
          focusArea: 'Target Dermis'
        },
        {
          id: 'gen-4',
          stepNumber: 4,
          title: 'Protective Bio-Shielding',
          description: 'Applying specialized regenerative formulations to soothe, seal, and maximize sustained cellular rejuvenation.',
          image: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
          phaseTag: 'Phase 4 • 10 mins',
          duration: '10 mins',
          focusArea: 'Lipid Moisture Barrier'
        }
      ];
  }
};

/**
 * High-fidelity responsive image icon renderer with luxury aesthetic styling,
 * smooth image load transition, and resilient error fallback.
 */
interface StepVisualProps {
  step: HowItWorksStep;
  isMobile?: boolean;
}

function StepVisual({ step, isMobile = false }: StepVisualProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sizing: Generously proportioned for visual clarity as requested
  const frameClass = isMobile 
    ? "w-20 h-20 sm:w-24 sm:h-24" 
    : "w-28 h-28 md:w-36 md:h-36";

  const iconClass = isMobile 
    ? "w-14 h-14 sm:w-16 sm:h-16" 
    : "w-20 h-20 md:w-24 md:h-24";

  // Check if step points to a real image (file path or web URL)
  const isRealImage = Boolean(
    step.image && 
    !step.image.startsWith('svg_preset:') && 
    !imageError
  );

  if (isRealImage && step.image) {
    return (
      <div className={`relative ${frameClass} rounded-2xl overflow-hidden ${
        isMobile 
          ? 'bg-white border-0 shadow-none' 
          : 'bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5EFEB] border border-[#c5a880]/25 shadow-inner'
      } flex items-center justify-center p-2.5 transition-transform duration-500 group-hover:scale-105`}>
        {/* Soft luxury ambient background glow (desktop only) */}
        {!isMobile && (
          <div className="absolute inset-0 bg-[#c5a880]/5 rounded-2xl pointer-events-none" />
        )}

        {/* Loading shimmer placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c5a880]/10 to-transparent animate-pulse rounded-2xl" />
        )}

        {/* Real Image Icon */}
        <img
          src={step.image}
          alt={step.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setImageError(true);
          }}
          className={`w-full h-full object-contain rounded-xl transition-all duration-500 ease-out ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        />
      </div>
    );
  }

  // Pre-bundled SVG preset keys (or fallback if image fails)
  const presetKey = step.image?.startsWith('svg_preset:') 
    ? step.image.replace('svg_preset:', '') 
    : '';

  const renderPresetSvg = () => {
    switch (presetKey) {
      case 'facewash':
        return <FaceCleansingIcon className={`${iconClass} text-[#c5a880]`} />;
      case 'sheetmask':
        return <SheetMaskIcon className={`${iconClass} text-[#c5a880]`} />;
      case 'radiance':
        return <RadianceGlowIcon className={`${iconClass} text-[#c5a880]`} />;
      case 'mapping':
        return <FacialMappingIcon className={`${iconClass} text-[#c5a880]`} />;
      case 'infusion':
        return <MicroDropletInfusionIcon className={`${iconClass} text-[#c5a880]`} />;
      case 'contour':
        return <ContourLiftIcon className={`${iconClass} text-[#c5a880]`} />;
      case 'shield':
        return <BioShieldSealingIcon className={`${iconClass} text-[#c5a880]`} />;
      default:
        if (step.icon) {
          const StepIcon = step.icon;
          return <StepIcon className={`${iconClass} text-[#c5a880]`} />;
        }
        return <RadianceGlowIcon className={`${iconClass} text-[#c5a880]`} />;
    }
  };

  return (
    <div className={`relative ${frameClass} rounded-2xl overflow-hidden ${
      isMobile 
        ? 'bg-white border-0 shadow-none' 
        : 'bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5EFEB] border border-[#c5a880]/25 shadow-inner'
    } flex items-center justify-center p-3 transition-transform duration-500 group-hover:scale-105`}>
      {!isMobile && <div className="absolute inset-0 bg-[#c5a880]/5 rounded-2xl pointer-events-none" />}
      {renderPresetSvg()}
    </div>
  );
}

export default function HowItWorksTimeline({ 
  treatmentId, 
  treatmentName, 
  className = '' 
}: HowItWorksTimelineProps) {
  // Protocol Group State connected to getClinicalProtocolsConfig()
  const [protocolGroup, setProtocolGroup] = useState<TreatmentProtocolGroup | null>(null);
  const [steps, setSteps] = useState<HowItWorksStep[]>([]);

  // Synchronize with clinical protocol store
  const syncProtocols = () => {
    try {
      const normalizedId = (treatmentId || '').toLowerCase().trim();
      const group = getClinicalProtocolByTreatmentId(normalizedId);

      if (group && Array.isArray(group.steps) && group.steps.length > 0) {
        setProtocolGroup(group);
        setSteps(group.steps);
      } else {
        const fallbacks = getStaticFallbackSteps(normalizedId);
        setSteps(fallbacks);
        setProtocolGroup(null);
      }
    } catch (err) {
      console.warn('Could not load clinical protocols from store:', err);
      setSteps(getStaticFallbackSteps(treatmentId));
    }
  };

  useEffect(() => {
    syncProtocols();

    // Listen to real-time updates from Admin Studio
    const handleUpdate = () => syncProtocols();
    window.addEventListener('clinical_protocols_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('clinical_protocols_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [treatmentId]);

  const displayTitle = protocolGroup?.name || treatmentName || 'The Clinical Protocol';
  const displaySubtitle = protocolGroup?.subtitle || 
    'A calibrated, sequential aesthetic journey designed for cellular revitalization and precision results.';

  return (
    <div 
      id="how-it-works-timeline" 
      className={`-mx-4 md:mx-0 w-[calc(100%+2rem)] md:w-full bg-[#FAF9F5] border-y border-[#c5a880]/15 py-12 md:py-24 my-10 md:my-12 relative overflow-hidden ${className}`}
    >
      {/* Ambient background light gradients */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-white/70 rounded-full blur-3xl pointer-events-none select-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#c5a880]/10 rounded-full blur-3xl pointer-events-none select-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2">
            <span className="text-[10px] md:text-xs font-black tracking-[0.25em] text-[#c5a880] uppercase font-mono">
              How it Works?
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-zinc-900 tracking-tight">
            {displayTitle}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto leading-relaxed">
            {displaySubtitle}
          </p>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative">
          {/* Central Vertical Connector Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#c5a880]/20 via-[#c5a880]/40 to-[#c5a880]/20 -translate-x-1/2 pointer-events-none" />

          {/* Left Line Connector (Mobile) */}
          <div className="block md:hidden absolute left-5 sm:left-6 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#c5a880]/20 via-[#c5a880]/40 to-[#c5a880]/20 -translate-x-1/2 pointer-events-none" />

          {/* Steps Sequence */}
          <div className="space-y-10 md:space-y-20">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 1; // Alternating layout for rhythm (0-indexed)
              const stepNum = String(step.stepNumber || idx + 1).padStart(2, '0');

              return (
                <motion.div 
                  key={step.id || idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="relative"
                >
                  {/* Central Timeline Node (Step Number Bubble) */}
                  <div className="absolute left-5 sm:left-6 md:left-1/2 top-1 md:top-1/2 -translate-y-0 md:-translate-y-1/2 -translate-x-1/2 z-20">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full bg-[#FAF9F5] md:bg-white border-2 border-[#c5a880] shadow-[0_2px_8px_rgba(197,168,128,0.2)] flex items-center justify-center text-xs md:text-sm font-bold text-zinc-900 font-mono tracking-wider">
                      {stepNum}
                    </div>
                  </div>

                  {/* DESKTOP ALTERNATING ZIGZAG LAYOUT */}
                  <div className="hidden md:grid grid-cols-12 items-center gap-0 w-full">
                    {/* Left Column */}
                    <div className={`col-span-5 ${isEven ? 'text-right pr-12' : 'flex justify-center pr-8'}`}>
                      {isEven ? (
                        /* Text on Left (Steps 02, 04, ...) */
                        <div className="space-y-2.5">
                          {step.phaseTag && (
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#c5a880] block font-mono">
                              {step.phaseTag}
                            </span>
                          )}
                          <h3 className="text-lg md:text-xl font-bold font-serif text-zinc-900 tracking-wide">
                            {step.title}
                          </h3>
                          <p className="text-xs md:text-sm text-zinc-600 leading-relaxed font-normal">
                            {step.description}
                          </p>
                          {(step.duration || step.focusArea) && (
                            <div className="flex items-center justify-end gap-3 pt-1 text-[11px] text-zinc-500">
                              {step.duration && !step.phaseTag?.includes(step.duration) && (
                                <span className="flex items-center gap-1 font-mono text-[#c5a880]">
                                  <Clock className="w-3.5 h-3.5" />
                                  {step.duration}
                                </span>
                              )}
                              {step.focusArea && (
                                <span className="italic text-zinc-400">
                                  Focus: {step.focusArea}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Image Icon Card on Left (Steps 01, 03, ...) */
                        <div className="p-4 md:p-6 bg-white/95 rounded-[2.25rem] border border-[#c5a880]/20 shadow-[0_12px_40px_rgba(0,0,0,0.035)] hover:shadow-[0_20px_50px_rgba(197,168,128,0.18)] hover:border-[#c5a880]/40 transition-all duration-300 flex items-center justify-center group">
                          <StepVisual step={step} isMobile={false} />
                        </div>
                      )}
                    </div>

                    {/* Middle Timeline Spacer */}
                    <div className="col-span-2" />

                    {/* Right Column */}
                    <div className={`col-span-5 ${isEven ? 'flex justify-center pl-8' : 'text-left pl-12'}`}>
                      {isEven ? (
                        /* Image Icon Card on Right (Steps 02, 04, ...) */
                        <div className="p-4 md:p-6 bg-white/95 rounded-[2.25rem] border border-[#c5a880]/20 shadow-[0_12px_40px_rgba(0,0,0,0.035)] hover:shadow-[0_20px_50px_rgba(197,168,128,0.18)] hover:border-[#c5a880]/40 transition-all duration-300 flex items-center justify-center group">
                          <StepVisual step={step} isMobile={false} />
                        </div>
                      ) : (
                        /* Text on Right (Steps 01, 03, ...) */
                        <div className="space-y-2.5">
                          {step.phaseTag && (
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#c5a880] block font-mono">
                              {step.phaseTag}
                            </span>
                          )}
                          <h3 className="text-lg md:text-xl font-bold font-serif text-zinc-900 tracking-wide">
                            {step.title}
                          </h3>
                          <p className="text-xs md:text-sm text-zinc-600 leading-relaxed font-normal">
                            {step.description}
                          </p>
                          {(step.duration || step.focusArea) && (
                            <div className="flex items-center justify-start gap-3 pt-1 text-[11px] text-zinc-500">
                              {step.duration && !step.phaseTag?.includes(step.duration) && (
                                <span className="flex items-center gap-1 font-mono text-[#c5a880]">
                                  <Clock className="w-3.5 h-3.5" />
                                  {step.duration}
                                </span>
                              )}
                              {step.focusArea && (
                                <span className="italic text-zinc-400">
                                  Focus: {step.focusArea}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MOBILE RESPONSIVE STEP LAYOUT (Unboxed, sitting directly on section background) */}
                  <div className="block md:hidden pl-12 sm:pl-16 pr-1 sm:pr-2">
                    <div className="p-0 bg-transparent rounded-none border-0 shadow-none flex flex-col sm:flex-row items-start gap-3.5 sm:gap-4 group">
                      <div className="shrink-0 flex items-center justify-start">
                        <StepVisual step={step} isMobile={true} />
                      </div>

                      <div className="space-y-1.5 text-left min-w-0">
                        {step.phaseTag && (
                          <span className="text-[9px] uppercase font-bold tracking-wider text-[#c5a880] block font-mono">
                            {step.phaseTag}
                          </span>
                        )}
                        <h4 className="text-sm sm:text-base font-bold font-serif text-zinc-900">
                          {step.title}
                        </h4>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                          {step.description}
                        </p>
                        {(step.duration || step.focusArea) && (
                          <div className="flex items-center justify-start gap-2.5 pt-1 text-[10px] text-zinc-500">
                            {step.duration && !step.phaseTag?.includes(step.duration) && (
                              <span className="flex items-center gap-1 font-mono text-[#c5a880]">
                                <Clock className="w-3 h-3" />
                                {step.duration}
                              </span>
                            )}
                            {step.focusArea && (
                              <span className="italic text-zinc-400">
                                {step.focusArea}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Clinical Assurance Note */}
        <div className="mt-16 text-center border-t border-[#c5a880]/15 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-2 text-[10px] md:text-[11px] uppercase tracking-[0.18em] md:tracking-[0.2em] text-[#c5a880] font-mono font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
              <span>Specialist Administered Protocol</span>
            </span>
            <span className="hidden md:inline opacity-60">•</span>
            <span>Age Reversal Clinics London</span>
          </div>
        </div>
      </div>
    </div>
  );
}
