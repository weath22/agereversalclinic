import React from 'react';
import { ScanFace, Droplet, Target, ShieldCheck, Sparkles } from 'lucide-react';

interface HowItWorksStep {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface HowItWorksTimelineProps {
  treatmentId: string;
}

const getHowItWorksSteps = (id: string): HowItWorksStep[] => {
  switch (id) {
    case 'exosome':
      return [
        {
          title: 'Epidermal Clearing',
          description: 'The skin surface is meticulously cleansed and prepared using medical-grade formulations to ensure zero barrier interference.',
          icon: ScanFace
        },
        {
          title: 'Pathway Micro-Channels',
          description: 'Microscopic pathways are gently opened in the dermis, setting up the structural guide channels for deep cell permeability.',
          icon: Target
        },
        {
          title: 'Exosome Influx',
          description: 'Pure, clinical-grade signaling exosomes are introduced, delivering growth factors and signaling lipids directly to the deep dermal matrix.',
          icon: Sparkles
        },
        {
          title: 'Cellular Sealing',
          description: 'A soothing bio-active sealant is applied to calm the tissue, lock in the exosomes, and initiate immediate cellular repair.',
          icon: ShieldCheck
        }
      ];
    case 'profhilo':
      return [
        {
          title: 'BAP Mapping',
          description: 'Meticulous marking of the 5 key Bio Aesthetic Points (BAP) on each side of the face to optimize dermal diffusion.',
          icon: ScanFace
        },
        {
          title: 'Micro-Targeted Delivery',
          description: 'Ultra-pure hyaluronic acid is precisely injected at calibrated depths into each designated BAP site with minimal discomfort.',
          icon: Target
        },
        {
          title: 'Dynamic Hydration Diffusion',
          description: 'The dual-weight hyaluronic acid complex begins to slowly diffuse evenly across the surrounding skin tissues.',
          icon: Droplet
        },
        {
          title: 'Bio-Remodeling Cycle',
          description: 'Continuous stimulation of 4 distinct collagen and elastin types, progressively lifting and remodeling sagging skin tissue.',
          icon: Sparkles
        }
      ];
    case 'morpheus8':
      return [
        {
          title: 'Subdermal Mapping',
          description: 'Calibrating needle penetration depths (ranging from 1mm to 4mm) to target the specific thickness of skin and localized fat.',
          icon: ScanFace
        },
        {
          title: 'Micro-Needle Penetration',
          description: 'Gold-plated microneedles gently enter the skin to the exact pre-calibrated depth to deliver subdermal energy.',
          icon: Target
        },
        {
          title: 'RF Coagulation & Contraction',
          description: 'Radiofrequency energy pulses through the needle tips, heating and remodeling subdermal adipose tissue and contracting fibers.',
          icon: Sparkles
        },
        {
          title: 'Neocollagenesis Trigger',
          description: 'Immediate contraction coupled with long-term collagen building results in a tighter, contoured, and lifted facial structure.',
          icon: ShieldCheck
        }
      ];
    case 'ultherapy':
      return [
        {
          title: 'Real-Time Visualization',
          description: 'Using high-resolution ultrasound imaging to see beneath the skin and precisely identify the target SMAS muscle layers.',
          icon: ScanFace
        },
        {
          title: 'Calibrated Energy Delivery',
          description: 'Directing focused thermal points precisely at three distinct depths (1.5mm, 3.0mm, and 4.5mm) bypassing the skin surface.',
          icon: Target
        },
        {
          title: 'Tissue Coagulation',
          description: 'Micro-focused ultrasound waves create tiny thermal spots that trigger immediate contraction of the foundational SMAS layer.',
          icon: Sparkles
        },
        {
          title: 'Progressive Tissue Lifting',
          description: 'A natural healing cascade begins, building new, healthy collagen fibers that lift and firm the skin over 2 to 3 months.',
          icon: ShieldCheck
        }
      ];
    case 'polynucleotide':
      return [
        {
          title: 'Dermal Scanning & Marking',
          description: 'Mapping targeted treatment zones such as the delicate under-eye tear troughs, lip lines, or areas of active dehydration.',
          icon: ScanFace
        },
        {
          title: 'DNA Fraction Infusion',
          description: 'Administering micro-droplets of highly purified polynucleotides directly into the damaged dermal layers.',
          icon: Target
        },
        {
          title: 'Cellular Instruction',
          description: 'The polynucleotide chains bind to cellular receptors, instructing fatigued cells to actively repair and regenerate tissue.',
          icon: Droplet
        },
        {
          title: 'Structural Regeneration',
          description: 'Accelerated synthesis of Type I collagen, enhanced skin elasticity, and improved micro-circulation for a glowing finish.',
          icon: ShieldCheck
        }
      ];
    case 'lip':
      return [
        {
          title: 'Symmetry Analysis',
          description: 'Evaluating lip proportions, Cupid\'s bow definition, and lip borders to design a custom, harmonious shape.',
          icon: ScanFace
        },
        {
          title: 'Calibrated Micro-Needling',
          description: 'Utilizing premium hyaluronic gel blended with anesthetic lidocaine to ensure a comfortable and controlled sculpting session.',
          icon: Target
        },
        {
          title: 'Precision Volumization',
          description: 'Delicate dermal sculpting to fill vertical lines, restore proportional volume, and define natural borders.',
          icon: Droplet
        },
        {
          title: 'Hydration Integration',
          description: 'The hyaluronic gel integrates with the lip tissue, locking in deep moisture for a soft, lush, and hydrated pout.',
          icon: ShieldCheck
        }
      ];
    case 'buttock':
      return [
        {
          title: 'Vector Mapping',
          description: 'Charting gluteal contours, highlighting hip dips, and mapping target vectors for optimal projection and lift.',
          icon: ScanFace
        },
        {
          title: 'Bio-Stimulator Infusion',
          description: 'Administering high-density poly-L-lactic acid (PLLA) bio-stimulator gel into the deep subcutaneous adipose layers.',
          icon: Target
        },
        {
          title: 'Structural Massage',
          description: 'Using specialized manual massage techniques to distribute the micro-particles evenly for perfectly smooth contours.',
          icon: Droplet
        },
        {
          title: 'Sustained Collagenesis',
          description: 'The bio-stimulating particles trigger gradual, long-term collagen building, filling and rounding contours over 4-6 weeks.',
          icon: ShieldCheck
        }
      ];
    case 'blepharoplasty':
      return [
        {
          title: 'Laxity Mapping',
          description: 'Analyzing excess upper or lower eyelid skin and marking the micro-contraction guide path for exact sublimation.',
          icon: ScanFace
        },
        {
          title: 'Plasma Arc Application',
          description: 'A precision device creates focused plasma energy points, instantly sublimating the outermost epidermal layer.',
          icon: Target
        },
        {
          title: 'Immediate Contraction',
          description: 'The plasma micro-arcs trigger immediate shrinkage of loose skin cells, tightening drooping tissue with zero bleeding.',
          icon: Sparkles
        },
        {
          title: 'Epidermal Re-Surfacing',
          description: 'Micro-crusts form and naturally shed over 5-7 days, revealing fresh, remarkably tightened, and lifted eyelid skin.',
          icon: ShieldCheck
        }
      ];
    case 'aqualyx':
      return [
        {
          title: 'Adipose Assessment',
          description: 'Identifying localized, stubborn fat pockets (such as double chins or love handles) and marking a precise grid guide.',
          icon: ScanFace
        },
        {
          title: 'Lipolytic Infusion',
          description: 'Injecting the specialized Aqualyx deoxycholic acid formula directly into the center of the subcutaneous fat layer.',
          icon: Target
        },
        {
          title: 'Membrane Liquefaction',
          description: 'The formulation dissolves the rigid lipid membranes, safely breaking down and liquefying target fat cells.',
          icon: Droplet
        },
        {
          title: 'Metabolic Clearance',
          description: 'The lymphatic system naturally processes and permanently flushes the dissolved fat lipids out of your body.',
          icon: ShieldCheck
        }
      ];
    default:
      return [
        {
          title: 'Barrier Diagnosis',
          description: 'We analyze your skin barrier, hydration levels, and target goals to tailor an optimal aesthetic prescription.',
          icon: ScanFace
        },
        {
          title: 'Custom Pre-Conditioning',
          description: 'Preparing the dermal matrix with premium medical-grade formulations specific to your skin health requirements.',
          icon: Target
        },
        {
          title: 'Precision Protocol Phase',
          description: 'Administering the chosen targeted technologies or infusions under strict clinical safety parameters.',
          icon: Sparkles
        },
        {
          title: 'Protective Bio-Shielding',
          description: 'Applying specialized regenerative formulations to soothe, seal, and maximize cellular rejuvenation.',
          icon: ShieldCheck
        }
      ];
  }
};

export default function HowItWorksTimeline({ treatmentId }: HowItWorksTimelineProps) {
  const steps = getHowItWorksSteps(treatmentId);

  return (
    <div id="how-it-works-timeline" className="w-full bg-[#FAF9F5] border-y border-silver-150 py-16 md:py-20 my-12 relative overflow-hidden">
      {/* Absolute decorative ambient light spots */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/60 rounded-full blur-3xl pointer-events-none select-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-gold/5 rounded-full blur-3xl pointer-events-none select-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="text-center space-y-3 mb-16 md:mb-20">
          <span className="text-[10px] md:text-xs font-black tracking-[0.25em] text-rose-gold uppercase block">
            How It Works?
          </span>
          <h2 className="text-2xl md:text-3.5xl font-serif font-bold text-silver-950">
            The Clinical Protocol
          </h2>
          <p className="text-xs md:text-sm text-silver-500 max-w-lg mx-auto">
            A seamless, step-by-step aesthetic journey designed for precision calibration and cellular regeneration.
          </p>
        </div>

        {/* Vertical Timeline container */}
        <div className="relative">
          {/* Central vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-silver-200/70 -translate-x-1/2 pointer-events-none" />

          {/* Steps map */}
          <div className="space-y-12 md:space-y-20">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isEven = idx % 2 === 1; // Even steps: text on left, icon on right (0-indexed)

            return (
              <div key={idx} className="relative">
                {/* Central/Left step bubble */}
                <div className="absolute left-6 md:left-1/2 top-2 md:top-1/2 -translate-y-0 md:-translate-y-1/2 -translate-x-1/2 z-10">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-silver-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center text-[10px] md:text-xs font-bold text-silver-800 tracking-wider">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* DESKTOP LAYOUT (Zigzag) */}
                <div className="hidden md:grid grid-cols-12 items-center gap-0 w-full">
                  {/* Left Column */}
                  <div className={`col-span-5 ${isEven ? 'text-right pr-12' : 'flex justify-center pr-8'}`}>
                    {isEven ? (
                      /* Text on left for even indices (01, 03 are odd, 02, 04 are even) */
                      <div className="space-y-2">
                        <h4 className="text-base md:text-lg font-bold font-serif text-silver-950">
                          {step.title}
                        </h4>
                        <p className="text-xs md:text-sm text-silver-600 leading-relaxed font-normal">
                          {step.description}
                        </p>
                      </div>
                    ) : (
                      /* Icon on left for odd indices (Step 01, 03) */
                      <div className="p-5 bg-white rounded-3xl border border-silver-100 shadow-[0_10px_35px_rgba(0,0,0,0.03)] text-rose-gold transform hover:scale-105 transition-transform duration-300">
                        <StepIcon className="h-9 w-9 stroke-[1.25] text-rose-gold" />
                      </div>
                    )}
                  </div>

                  {/* Middle Spacer */}
                  <div className="col-span-2" />

                  {/* Right Column */}
                  <div className={`col-span-5 ${isEven ? 'flex justify-center pl-8' : 'text-left pl-12'}`}>
                    {isEven ? (
                      /* Icon on right for even indices */
                      <div className="p-5 bg-white rounded-3xl border border-silver-100 shadow-[0_10px_35px_rgba(0,0,0,0.03)] text-rose-gold transform hover:scale-105 transition-transform duration-300">
                        <StepIcon className="h-9 w-9 stroke-[1.25] text-rose-gold" />
                      </div>
                    ) : (
                      /* Text on right for odd indices */
                      <div className="space-y-2">
                        <h4 className="text-base md:text-lg font-bold font-serif text-silver-950">
                          {step.title}
                        </h4>
                        <p className="text-xs md:text-sm text-silver-600 leading-relaxed font-normal">
                          {step.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* MOBILE LAYOUT (Single-direction) */}
                <div className="block md:hidden pl-16">
                  <div className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-silver-50/40 rounded-2xl border border-silver-100/50">
                    <div className="p-3 bg-white rounded-xl border border-silver-100 shadow-sm text-rose-gold shrink-0">
                      <StepIcon className="h-6 w-6 stroke-[1.5] text-rose-gold" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold font-serif text-silver-950">
                        {step.title}
                      </h4>
                      <p className="text-xs text-silver-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
     </div>
    </div>
  );
}
