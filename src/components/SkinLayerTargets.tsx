import { useState, useEffect } from 'react';
import { Shield, ChevronRight, Activity, Zap, Cpu, Flame, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SkinLayer {
  id: 'Epidermis' | 'Dermis' | 'Subdermal Adipose' | 'SMAS Muscle Layer';
  name: string;
  depth: string;
  description: string;
  function: string;
  // Dynamic diagnostic details for high-fidelity interactive display
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
}

export default function SkinLayerTargets({ targetLayer, targetDepth, treatmentName }: SkinLayerTargetsProps) {
  const [selectedLayerId, setSelectedLayerId] = useState<SkinLayer['id']>(targetLayer);

  // Sync selected layer if targetLayer prop changes (e.g. navigation to another service)
  useEffect(() => {
    setSelectedLayerId(targetLayer);
  }, [targetLayer]);

  const layers: SkinLayer[] = [
    {
      id: 'Epidermis',
      name: 'Epidermis (Surface Layer)',
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
      description: 'The subcutaneous fat layer responsible for volume retention, structural cushioning, and support of facial lines.',
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

  const activeLayer = layers.find(l => l.id === selectedLayerId) || layers[0];
  const isPrimaryTreatmentTarget = selectedLayerId === targetLayer;

  // Visual percentages representing depth on the right-hand simulator
  const activeHeights: Record<SkinLayer['id'], string> = {
    'Epidermis': '12%',
    'Dermis': '38%',
    'Subdermal Adipose': '65%',
    'SMAS Muscle Layer': '88%'
  };

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-rose-gold block">
          Target Depth Analysis
        </span>
        <h4 className="text-xl font-serif font-bold text-silver-950 flex items-center gap-2">
          <Activity className="h-5 w-5 text-rose-gold animate-pulse" />
          <span>Interactive Dermal Profiler</span>
        </h4>
      </div>

      {/* Main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Block: Interactive Layer List Container */}
        <div className="lg:col-span-7 bg-[#0e121a] border border-slate-800 rounded-none p-4 md:p-8 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Unlike generic topical cosmetics, <span className="font-semibold text-rose-gold">{treatmentName}</span> penetrates to precise depths. Click on any layer to simulate targeting and view calibrated clinical parameters.
            </p>
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-none border border-slate-700 text-[10px] text-slate-400 font-medium shrink-0">
              <span className="w-1.5 h-1.5 rounded-none bg-rose-gold animate-ping" />
              <span>Interactive Simulator Mode</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center flex-1 mt-4">
            {layers.map((layer, index) => {
              const isSelected = layer.id === selectedLayerId;
              const isPrimary = layer.id === targetLayer;

              return (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`relative overflow-hidden p-4 rounded-none border transition-all duration-300 cursor-pointer group ${
                    isSelected
                      ? 'bg-[#151b24] border-rose-gold/80 shadow-[0_8px_25px_rgba(197,168,128,0.15)] ring-1 ring-rose-gold/20'
                      : 'bg-[#10141b] border-slate-800/80 hover:bg-slate-800/20'
                  }`}
                >
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-gold/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center space-x-3.5">
                      {/* Interactive Radio-style circular node */}
                      <div className={`w-4 h-4 rounded-none shrink-0 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-rose-gold ring-4 ring-rose-gold/15' 
                          : 'bg-slate-800 group-hover:bg-slate-700'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-none" />}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs md:text-sm font-bold block ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {layer.name}
                          </span>
                          {isPrimary && (
                            <span className="text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-none bg-rose-gold/10 text-rose-gold border border-rose-gold/20">
                              Primary Target
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono tracking-wider block mt-0.5">
                          Standard clinical depth: {layer.depth}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill Indicator */}
                    <div className="shrink-0">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 bg-[#052d2e] text-[#c5a880] font-bold text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-none border border-[#0c4f51]">
                          <Zap className="h-2.5 w-2.5 text-[#c5a880] animate-pulse" />
                          <span>Simulating Target</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-900 text-slate-400 font-bold text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-none border border-slate-800 group-hover:text-slate-300 transition-colors">
                          Inspect Layer
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expandable detailed content with animation */}
                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-3.5 border-t border-slate-800 text-xs text-slate-300 space-y-3 leading-relaxed">
                          <p>{layer.description}</p>
                          <div className="flex items-start gap-1.5 font-semibold text-slate-200 bg-[#0a0d13] p-2.5 rounded-none border border-slate-800">
                            <ChevronRight className="h-4 w-4 text-rose-gold shrink-0 mt-0.5" />
                            <span><strong className="text-white font-bold">Aesthetic Outcome:</strong> {layer.function}</span>
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

        {/* Right Block: Dynamic Interactive HUD Diagnostic Card */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative flex-1 min-h-[360px] lg:min-h-full rounded-none overflow-hidden border border-slate-850 bg-black flex flex-col justify-between p-5">
            
            {/* Top Banner: Simulated HUD header */}
            <div className="z-10 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-none bg-rose-gold animate-ping" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-silver-400">
                  Depth Profiler HUD
                </span>
              </div>
              <span className="font-mono text-[8px] text-silver-500 uppercase">
                Sys_Calib: LOCK_OK
              </span>
            </div>

            {/* Central: Dynamic Skin Layers Cross-Section visualization */}
            <div className="relative flex-1 my-4 flex items-center justify-center min-h-[220px]">
              {/* Simulated depth ticks on the left side */}
              <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between font-mono text-[8px] text-silver-500 py-2 border-r border-white/10 z-10 select-none">
                <span>0.0mm</span>
                <span>1.0mm</span>
                <span>2.0mm</span>
                <span>3.0mm</span>
                <span>4.0mm</span>
                <span>5.0mm+</span>
              </div>

              {/* Skin stack container */}
              <div className="absolute inset-y-0 left-12 right-0 flex flex-col justify-between overflow-hidden rounded-none bg-neutral-900 border border-white/5">
                {/* Epidermis Block (Surface Layer) */}
                <div 
                  onClick={() => setSelectedLayerId('Epidermis')}
                  className={`h-[15%] transition-all duration-300 cursor-pointer relative flex items-center justify-center ${
                    selectedLayerId === 'Epidermis'
                      ? 'bg-rose-gold/25 border-y border-rose-gold/40'
                      : 'bg-orange-500/5 hover:bg-orange-500/10'
                  }`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:8px_8px]" />
                  <span className="absolute left-3 text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest select-none">Epidermis</span>
                </div>

                {/* Dermis Block (Collagen) */}
                <div 
                  onClick={() => setSelectedLayerId('Dermis')}
                  className={`h-[35%] transition-all duration-300 cursor-pointer relative flex items-center justify-center border-t border-white/5 ${
                    selectedLayerId === 'Dermis'
                      ? 'bg-rose-gold/25 border-y border-rose-gold/40'
                      : 'bg-rose-400/5 hover:bg-rose-400/10'
                  }`}
                >
                  {/* Tiny collagen-like wavy lines represented subtly */}
                  <div className="absolute inset-0 opacity-15 overflow-hidden">
                    <svg className="w-full h-full text-rose-gold stroke-current fill-none stroke-[0.5]" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path d="M0,5 Q25,20 50,5 T100,5" />
                      <path d="M0,15 Q25,30 50,15 T100,15" />
                      <path d="M0,25 Q25,10 50,25 T100,25" />
                    </svg>
                  </div>
                  <span className="absolute left-3 text-[8px] font-mono font-bold text-rose-300 uppercase tracking-widest select-none">Dermis</span>
                </div>

                {/* Subdermal Adipose Block */}
                <div 
                  onClick={() => setSelectedLayerId('Subdermal Adipose')}
                  className={`h-[30%] transition-all duration-300 cursor-pointer relative flex items-center justify-center border-t border-white/5 ${
                    selectedLayerId === 'Subdermal Adipose'
                      ? 'bg-rose-gold/25 border-y border-rose-gold/40'
                      : 'bg-yellow-500/5 hover:bg-yellow-500/10'
                  }`}
                >
                  {/* Micro lipids pattern overlay */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_#c5a880_1px,_transparent_1.5px)] [background-size:10px_10px]" />
                  <span className="absolute left-3 text-[8px] font-mono font-bold text-yellow-400 uppercase tracking-widest select-none">Adipose</span>
                </div>

                {/* SMAS Muscle Block */}
                <div 
                  onClick={() => setSelectedLayerId('SMAS Muscle Layer')}
                  className={`h-[20%] transition-all duration-300 cursor-pointer relative flex items-center justify-center border-t border-white/5 ${
                    selectedLayerId === 'SMAS Muscle Layer'
                      ? 'bg-rose-gold/25 border-t border-rose-gold/40'
                      : 'bg-red-500/5 hover:bg-red-500/10'
                  }`}
                >
                  {/* Subtle striated line pattern for muscle */}
                  <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,_#ef4444,_#ef4444_1px,_transparent_1px,_transparent_4px)]" />
                  <span className="absolute left-3 text-[8px] font-mono font-bold text-red-400 uppercase tracking-widest select-none">SMAS Muscle</span>
                </div>

                {/* Active Laser Targeting Beam */}
                <motion.div
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-gold to-transparent shadow-[0_0_10px_#c5a880] z-20 pointer-events-none flex justify-end pr-4 items-center"
                  animate={{
                    top: activeHeights[selectedLayerId]
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 90,
                    damping: 14
                  }}
                >
                  {/* Micro laser glowing target crosshair point */}
                  <div className="w-1.5 h-1.5 rounded-none bg-white shadow-[0_0_8px_#ffffff] animate-ping" />
                  <div className="absolute right-1 px-1 py-0.5 bg-rose-gold text-neutral-950 font-mono text-[7px] font-black rounded-none scale-90 -translate-y-3 uppercase select-none tracking-widest">
                    Beam Calibrated
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Bottom: HUD Telemetry Stats (updates dynamically based on state) */}
            <div className="z-10 bg-[#06080c] backdrop-blur-md rounded-none p-3 border border-white/10 space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <Cpu className="h-3 w-3 text-rose-gold animate-pulse" />
                  <span className="text-[8px] font-mono uppercase tracking-widest text-silver-300">
                    Telemetry specs
                  </span>
                </div>
                {isPrimaryTreatmentTarget ? (
                  <div className="text-[7px] font-bold text-[#c5a880] uppercase bg-[#c5a880]/15 px-1.5 py-0.5 rounded-none border border-[#c5a880]/20">
                    Optimal Target
                  </div>
                ) : (
                  <div className="text-[7px] font-bold text-silver-400 uppercase bg-white/5 px-1.5 py-0.5 rounded-none border border-white/10">
                    Simulated Depth
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                <div>
                  <span className="text-[7px] uppercase font-bold text-neutral-500 block tracking-wider">Modality Frequency</span>
                  <span className="text-[10px] font-mono font-bold text-white block truncate">{activeLayer.specs.frequency}</span>
                </div>
                <div>
                  <span className="text-[7px] uppercase font-bold text-neutral-500 block tracking-wider">Calibration Depth</span>
                  <span className="text-[10px] font-mono font-bold text-[#c5a880] block">{activeLayer.depth}</span>
                </div>
                <div>
                  <span className="text-[7px] uppercase font-bold text-neutral-500 block tracking-wider">Energy Density</span>
                  <span className="text-[10px] font-mono font-bold text-white block">{activeLayer.specs.energy}</span>
                </div>
                <div>
                  <span className="text-[7px] uppercase font-bold text-neutral-500 block tracking-wider">Thermal Profile</span>
                  <span className="text-[10px] font-mono font-bold text-red-400 block flex items-center gap-1">
                    <Flame className="h-2.5 w-2.5" />
                    <span>{activeLayer.specs.temperature}</span>
                  </span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-2 flex items-center gap-1.5">
                <Compass className="h-3 w-3 text-rose-gold shrink-0" />
                <span className="text-[8px] text-slate-300 leading-normal font-sans">
                  <strong className="text-white">Mechanism:</strong> {activeLayer.specs.mechanism}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
