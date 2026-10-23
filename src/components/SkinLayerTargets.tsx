import { useState, useEffect } from 'react';
import { ChevronRight, Activity, Zap, Cpu, Flame, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SkinLayer {
  id: 'Epidermis' | 'Dermis' | 'Subdermal Adipose' | 'SMAS Muscle Layer';
  name: string;
  depth: string;
  description: string;
  function: string;
  specs: {
    frequency: string;
    energy: string;
    temperature: string;
    mechanism: string;
  };
}

interface SkinLayerTargetsProps {
  targetLayer: 'Epidermis' | 'Dermis' | 'Subdermal Adipose' | 'SMAS Muscle Layer';
  targetDepth: string;
  treatmentName: string;
  customSpecs?: {
    frequency?: string;
    energy?: string;
    temperature?: string;
    mechanism?: string;
  };
}

export default function SkinLayerTargets({ targetLayer, targetDepth, treatmentName, customSpecs }: SkinLayerTargetsProps) {
  const [selectedLayerId, setSelectedLayerId] = useState<SkinLayer['id']>(targetLayer);

  // Sync selected layer if targetLayer prop changes (e.g. navigation to another service)
  useEffect(() => {
    setSelectedLayerId(targetLayer);
  }, [targetLayer]);

  const layers: SkinLayer[] = [
    {
      id: 'Epidermis',
      name: 'Epidermis (Surface Barrier)',
      depth: '0.1mm - 0.5mm',
      description: 'The outermost protective barrier of the skin. Regulates moisture preservation, melanin synthesis, and cellular shedding.',
      function: 'Improves skin tone, fine lines, micro-texture, and surface radiance.',
      specs: {
        frequency: '2940 nm (Er:YAG) / Plasma Sublimation',
        energy: '1.2 - 2.5 J/cm²',
        temperature: '37°C - 42°C (Ablation range)',
        mechanism: 'Superficial epidermal resurfacing & micro-peeling'
      }
    },
    {
      id: 'Dermis',
      name: 'Dermis (Collagen Matrix)',
      depth: '1.0mm - 3.0mm',
      description: 'The thick, elastic matrix containing fibroblast cells, capillaries, and the foundational collagen and elastin structural networks.',
      function: 'Restores deep firmness, diminishes wrinkles, and stimulates natural collagen synthesis.',
      specs: {
        frequency: '1 MHz - 4 MHz Bipolar Radiofrequency',
        energy: '15 - 45 J/cm³',
        temperature: '60°C - 65°C (Neocollagenesis optimal)',
        mechanism: 'Fibroblast stimulation & dermal remodeling'
      }
    },
    {
      id: 'Subdermal Adipose',
      name: 'Subdermal Adipose (Fat Layer)',
      depth: '3.0mm - 4.5mm',
      description: 'The subcutaneous fat layer responsible for volume retention, structural cushioning, and support of facial contours.',
      function: 'Triggers localized lipolysis, tissue contraction, and micro-contouring.',
      specs: {
        frequency: 'Calibrated Radiofrequency Needling',
        energy: '25 - 60 J/cm³',
        temperature: '65°C - 70°C (Adipose contraction)',
        mechanism: 'Adipose tissue remodeling & lipid clearing'
      }
    },
    {
      id: 'SMAS Muscle Layer',
      name: 'SMAS (Muscle & Fascial Foundation)',
      depth: '4.5mm+',
      description: 'The Superficial Musculoaponeurotic System. The deep, dense fibrous muscle foundation that supports the entire facial structure.',
      function: 'Delivers non-surgical gravity-defying lifts, tightening the foundational jaw and cheek drapes.',
      specs: {
        frequency: '4 MHz High-Intensity Focused Ultrasound (HIFU)',
        energy: '0.45 - 1.2 J/mm²',
        temperature: '65°C - 72°C (Protein coagulation)',
        mechanism: 'SMAS contracture & deep structural hoisting'
      }
    }
  ];

  const baseActiveLayer = layers.find(l => l.id === selectedLayerId) || layers[0];
  const isPrimaryTreatmentTarget = selectedLayerId === targetLayer;

  const activeLayer: SkinLayer = {
    ...baseActiveLayer,
    depth: isPrimaryTreatmentTarget && targetDepth ? targetDepth : baseActiveLayer.depth,
    specs: {
      frequency: (isPrimaryTreatmentTarget && customSpecs?.frequency) || baseActiveLayer.specs.frequency,
      energy: (isPrimaryTreatmentTarget && customSpecs?.energy) || baseActiveLayer.specs.energy,
      temperature: (isPrimaryTreatmentTarget && customSpecs?.temperature) || baseActiveLayer.specs.temperature,
      mechanism: (isPrimaryTreatmentTarget && customSpecs?.mechanism) || baseActiveLayer.specs.mechanism,
    }
  };

  // Visual percentages representing depth on the right-hand simulator
  const activeHeights: Record<SkinLayer['id'], string> = {
    'Epidermis': '12%',
    'Dermis': '38%',
    'Subdermal Adipose': '65%',
    'SMAS Muscle Layer': '88%'
  };

  return (
    <div className="flex flex-col space-y-6 w-full">
      {/* Section Header */}
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#D8C2A3] block">
          Target Depth Analysis
        </span>
        <h4 className="text-xl font-serif font-bold text-silver-950 flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#D8C2A3] animate-pulse" />
          <span>Interactive Dermal Profiler</span>
        </h4>
        <p className="text-xs sm:text-sm text-silver-600 font-light max-w-xl">
          A visual guide showing how deep {treatmentName} goes into the skin and layers it targets.
        </p>
      </div>

      {/* Main Luxury Profiler Canvas Container (Outermost container disabled on mobile screens only) */}
      <div className="bg-transparent sm:bg-gradient-to-b sm:from-[#14161f] sm:via-[#0f1118] sm:to-[#0a0b10] border-0 sm:border sm:border-[#D8C2A3]/30 rounded-none sm:rounded-3xl p-0 sm:p-7 md:p-9 shadow-none sm:shadow-2xl relative overflow-visible sm:overflow-hidden text-white">
        {/* Subtle champagne & rose ambient illumination blooms (Desktop/Tablet only) */}
        <div className="hidden sm:block absolute top-0 right-1/4 w-[450px] h-[300px] bg-[#D8C2A3]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden sm:block absolute bottom-0 left-10 w-[350px] h-[350px] bg-rose-gold/10 rounded-full blur-3xl pointer-events-none" />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-stretch relative z-10">
          
          {/* Left Block: Interactive Layer Selector */}
          <div className="lg:col-span-7 bg-[#14161f] sm:bg-white/[0.04] backdrop-blur-md border border-[#D8C2A3]/25 sm:border-white/10 rounded-2xl p-4 sm:p-6 md:p-7 flex flex-col justify-between space-y-4 sm:space-y-5 shadow-lg sm:shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
                Unlike generic topical cosmetics, <span className="font-medium text-[#D8C2A3]">{treatmentName}</span> delivers energy to calibrated dermal depths. Click any stratum to inspect its clinical specs.
              </p>
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/15 text-[10px] text-white/80 font-sans tracking-wide shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8C2A3] animate-ping" />
                <span>Live Simulator</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 justify-center flex-1">
              {layers.map((layer) => {
                const isSelected = layer.id === selectedLayerId;
                const isPrimary = layer.id === targetLayer;

                return (
                  <div
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-300 cursor-pointer group ${
                      isSelected
                        ? 'bg-white/10 border-[#D8C2A3] shadow-[0_4px_25px_rgba(216,194,163,0.18)] ring-1 ring-[#D8C2A3]/30'
                        : 'bg-white/[0.025] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center space-x-3.5">
                        {/* Radio Selection Indicator */}
                        <div className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center transition-all mt-0.5 sm:mt-0 ${
                          isSelected 
                            ? 'bg-[#D8C2A3] ring-4 ring-[#D8C2A3]/20' 
                            : 'bg-white/20 group-hover:bg-white/30'
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs sm:text-sm font-medium tracking-wide block ${isSelected ? 'text-white' : 'text-white/80'}`}>
                              {layer.name}
                            </span>
                            {isPrimary && (
                              <span className="text-[8.5px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D8C2A3]/20 text-[#D8C2A3] border border-[#D8C2A3]/40">
                                Primary Target
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-white/50 font-sans tracking-wide block mt-0.5">
                            {isPrimary ? 'Calibrated delivery depth: ' : 'Standard clinical depth: '}
                            <span className={isPrimary ? 'text-[#D8C2A3] font-semibold' : 'text-white/70'}>
                              {isPrimary && targetDepth ? targetDepth : layer.depth}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <div className="shrink-0 self-start sm:self-auto">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1.5 bg-[#D8C2A3]/20 text-[#D8C2A3] font-sans font-medium text-[9px] uppercase tracking-wider px-3 py-1 rounded-full border border-[#D8C2A3]/40">
                            <Zap className="h-2.5 w-2.5 text-[#D8C2A3] animate-pulse" />
                            <span>Simulating</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-white/5 text-white/50 font-sans text-[9px] uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 group-hover:text-white/80 group-hover:border-white/20 transition-colors">
                            Inspect
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expandable detailed content */}
                    <AnimatePresence initial={false}>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3.5 pt-3.5 border-t border-white/10 text-xs text-white/80 space-y-2.5 leading-relaxed font-light">
                            <p>{layer.description}</p>
                            <div className="flex items-start gap-2 bg-white/[0.05] p-3 rounded-lg border border-[#D8C2A3]/25 text-white/90">
                              <ChevronRight className="h-4 w-4 text-[#D8C2A3] shrink-0 mt-0.5" />
                              <span><strong className="text-white font-medium">Aesthetic Outcome:</strong> {layer.function}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Block: Dynamic Cross-Section Visualizer & HUD */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative flex-1 min-h-[380px] lg:min-h-full rounded-2xl overflow-hidden border border-[#D8C2A3]/25 sm:border-white/10 bg-[#14161f] sm:bg-white/[0.04] backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 shadow-lg sm:shadow-inner">
              
              {/* HUD Header */}
              <div className="z-10 flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#D8C2A3] animate-ping" />
                  <span className="font-mono text-[9.5px] uppercase tracking-widest text-[#D8C2A3]">
                    Depth Profiler HUD
                  </span>
                </div>
                <span className="font-mono text-[8.5px] text-white/50 uppercase tracking-wider">
                  Sys_Calib: LOCK_OK
                </span>
              </div>

              {/* Central: Dynamic Skin Layers Cross-Section Visualization */}
              <div className="relative flex-1 my-5 flex items-center justify-center min-h-[220px]">
                {/* Depth Gauge on Left */}
                <div className="absolute left-0 top-0 bottom-0 w-9 flex flex-col justify-between font-mono text-[8.5px] text-white/40 py-2 border-r border-white/10 z-10 select-none">
                  <span>0.0mm</span>
                  <span>1.0mm</span>
                  <span>2.0mm</span>
                  <span>3.0mm</span>
                  <span>4.0mm</span>
                  <span>5.0mm+</span>
                </div>

                {/* Skin Stack Visual Canvas */}
                <div className="absolute inset-y-0 left-12 right-0 flex flex-col justify-between overflow-hidden rounded-xl bg-black/60 border border-white/10">
                  {/* Epidermis */}
                  <div 
                    onClick={() => setSelectedLayerId('Epidermis')}
                    className={`h-[15%] transition-all duration-300 cursor-pointer relative flex items-center justify-center ${
                      selectedLayerId === 'Epidermis'
                        ? 'bg-gradient-to-r from-amber-500/30 via-amber-400/20 to-transparent border-y border-[#D8C2A3]'
                        : 'bg-amber-500/10 hover:bg-amber-500/15'
                    }`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:8px_8px]" />
                    <span className="absolute left-3 text-[8.5px] font-mono font-semibold text-amber-200 uppercase tracking-widest select-none">
                      Epidermis
                    </span>
                  </div>

                  {/* Dermis */}
                  <div 
                    onClick={() => setSelectedLayerId('Dermis')}
                    className={`h-[35%] transition-all duration-300 cursor-pointer relative flex items-center justify-center border-t border-white/10 ${
                      selectedLayerId === 'Dermis'
                        ? 'bg-gradient-to-r from-rose-400/30 via-rose-300/20 to-transparent border-y border-[#D8C2A3]'
                        : 'bg-rose-400/10 hover:bg-rose-400/15'
                    }`}
                  >
                    <div className="absolute inset-0 opacity-20 overflow-hidden">
                      <svg className="w-full h-full text-[#D8C2A3] stroke-current fill-none stroke-[0.6]" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <path d="M0,5 Q25,20 50,5 T100,5" />
                        <path d="M0,15 Q25,30 50,15 T100,15" />
                        <path d="M0,25 Q25,10 50,25 T100,25" />
                      </svg>
                    </div>
                    <span className="absolute left-3 text-[8.5px] font-mono font-semibold text-rose-200 uppercase tracking-widest select-none">
                      Dermis
                    </span>
                  </div>

                  {/* Subdermal Adipose */}
                  <div 
                    onClick={() => setSelectedLayerId('Subdermal Adipose')}
                    className={`h-[30%] transition-all duration-300 cursor-pointer relative flex items-center justify-center border-t border-white/10 ${
                      selectedLayerId === 'Subdermal Adipose'
                        ? 'bg-gradient-to-r from-yellow-500/30 via-amber-300/20 to-transparent border-y border-[#D8C2A3]'
                        : 'bg-yellow-500/10 hover:bg-yellow-500/15'
                    }`}
                  >
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle,_#D8C2A3_1px,_transparent_1.5px)] [background-size:10px_10px]" />
                    <span className="absolute left-3 text-[8.5px] font-mono font-semibold text-yellow-200 uppercase tracking-widest select-none">
                      Adipose
                    </span>
                  </div>

                  {/* SMAS Muscle */}
                  <div 
                    onClick={() => setSelectedLayerId('SMAS Muscle Layer')}
                    className={`h-[20%] transition-all duration-300 cursor-pointer relative flex items-center justify-center border-t border-white/10 ${
                      selectedLayerId === 'SMAS Muscle Layer'
                        ? 'bg-gradient-to-r from-red-500/30 via-rose-600/20 to-transparent border-t border-[#D8C2A3]'
                        : 'bg-red-500/10 hover:bg-red-500/15'
                    }`}
                  >
                    <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,_#ef4444,_#ef4444_1px,_transparent_1px,_transparent_4px)]" />
                    <span className="absolute left-3 text-[8.5px] font-mono font-semibold text-red-200 uppercase tracking-widest select-none">
                      SMAS Muscle
                    </span>
                  </div>

                  {/* Calibrated Laser / Ultrasound Targeting Beam */}
                  <motion.div
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D8C2A3] to-white shadow-[0_0_12px_#D8C2A3] z-20 pointer-events-none flex justify-end pr-4 items-center"
                    animate={{
                      top: activeHeights[selectedLayerId]
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 90,
                      damping: 14
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ffffff] animate-ping" />
                    <div className="absolute right-1 px-2 py-0.5 bg-[#D8C2A3] text-black font-sans text-[7.5px] font-bold rounded-full scale-90 -translate-y-3.5 uppercase select-none tracking-widest shadow-md">
                      Beam Calibrated
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Bottom HUD Telemetry Stats */}
              <div className="z-10 bg-black/50 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5 text-[#D8C2A3] animate-pulse" />
                    <span className="text-[8.5px] font-mono uppercase tracking-widest text-white/70">
                      Telemetry Parameters
                    </span>
                  </div>
                  {isPrimaryTreatmentTarget ? (
                    <div className="text-[7.5px] font-semibold text-[#D8C2A3] uppercase bg-[#D8C2A3]/20 px-2 py-0.5 rounded-full border border-[#D8C2A3]/30">
                      Optimal Target
                    </div>
                  ) : (
                    <div className="text-[7.5px] font-semibold text-white/60 uppercase bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                      Simulated Depth
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  <div>
                    <span className="text-[7.5px] uppercase font-sans font-medium text-white/50 block tracking-wider">Modality Frequency</span>
                    <span className="text-[10px] font-mono font-medium text-white block truncate">{activeLayer.specs.frequency}</span>
                  </div>
                  <div>
                    <span className="text-[7.5px] uppercase font-sans font-medium text-white/50 block tracking-wider">Calibration Depth</span>
                    <span className="text-[10px] font-mono font-semibold text-[#D8C2A3] block">{activeLayer.depth}</span>
                  </div>
                  <div>
                    <span className="text-[7.5px] uppercase font-sans font-medium text-white/50 block tracking-wider">Energy Density</span>
                    <span className="text-[10px] font-mono font-medium text-white block">{activeLayer.specs.energy}</span>
                  </div>
                  <div>
                    <span className="text-[7.5px] uppercase font-sans font-medium text-white/50 block tracking-wider">Thermal Profile</span>
                    <span className="text-[10px] font-mono font-medium text-rose-300 flex items-center gap-1">
                      <Flame className="h-3 w-3 text-rose-400" />
                      <span>{activeLayer.specs.temperature}</span>
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-2 flex items-center gap-2">
                  <Compass className="h-3.5 w-3.5 text-[#D8C2A3] shrink-0" />
                  <span className="text-[8.5px] text-white/80 leading-normal font-sans font-light">
                    <strong className="text-white font-medium">Mechanism:</strong> {activeLayer.specs.mechanism}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
