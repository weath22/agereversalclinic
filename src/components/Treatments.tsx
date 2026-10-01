import { TREATMENTS, TREATMENT_IMAGES } from '../data';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';
import { TreatmentsConfig } from '../types';

interface TreatmentsProps {
  onBookClick: () => void;
  onTreatmentClick?: (treatmentName: string) => void;
  treatmentsConfig?: TreatmentsConfig;
}

// Default comprehensive clinical treatment list for aesthetic harmony
const CLINICAL_TREATMENT_ITEMS = [
  { id: '1', name: 'Facial Injectables & Volume Contouring' },
  { id: '2', name: 'Morpheus8 RF & Deep Skin Tightening' },
  { id: '3', name: 'Ultherapy Non-Surgical SMAS Lift' },
  { id: '4', name: 'Precision Lip & Facial Dermal Fillers' },
  { id: '5', name: 'Polynucleotide & Exosome Cellular Therapy' },
  { id: '6', name: 'Fractional CO2 Laser & Skin Resurfacing' },
  { id: '7', name: 'Minor Surgery & Scars' }
];

export default function Treatments({ onBookClick, onTreatmentClick, treatmentsConfig }: TreatmentsProps) {
  // Motion settings for list stagger
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring' as const, stiffness: 100 }
    }
  };

  const activeTreatments = treatmentsConfig?.treatments && treatmentsConfig.treatments.length >= 4
    ? treatmentsConfig.treatments
    : CLINICAL_TREATMENT_ITEMS;

  return (
    <section id="treatments" className="pt-10 pb-12 sm:pt-16 sm:pb-20 md:py-24 lg:py-32 bg-luxury-primary overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20">
          
          {/* Left Column: Text & Editorial Content (Properly scaled for mobile screens) */}
          <div className="w-full lg:w-5/12 lg:max-w-[420px] relative">
            <div className="relative mb-4 sm:mb-6">
              <span className="absolute -top-6 sm:-top-8 md:-top-10 left-0 text-3xl sm:text-5xl md:text-6xl lg:text-4xl font-serif italic text-luxury-border select-none opacity-50 uppercase tracking-wider">
                {treatmentsConfig?.editorialHeading || "rejuvenation"}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl font-light font-serif text-luxury-text leading-tight uppercase relative z-10 pt-2 sm:pt-3">
                {treatmentsConfig?.editorialSub || "Begin your transformation"}
              </h2>
            </div>
            
            <div className="w-12 h-[1px] bg-luxury-gold mb-4 sm:mb-6" />

            <p className="text-luxury-subtext font-sans font-light mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              {treatmentsConfig?.description || "At Age Reversal Clinic, we believe that aesthetic harmony elevates self-confidence. Our clinical therapists custom-tailor skin therapy sessions, premium facials, and micropigmentation protocols to support your personal wellness ritual."}
            </p>

            {/* Treatment list with full text visibility on mobile screens */}
            <motion.ul 
              variants={listContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="space-y-3 sm:space-y-3.5 mb-6 sm:mb-8"
            >
              {activeTreatments.map((treatment) => (
                <motion.li 
                  key={treatment.id}
                  variants={listItemVariants}
                  onClick={() => onTreatmentClick?.(treatment.name)}
                  className="flex items-center space-x-3 group cursor-pointer"
                >
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full border border-luxury-muted group-hover:border-luxury-gold group-hover:scale-125 transition-all duration-300 shrink-0" />
                  <span className="text-luxury-text font-sans font-normal sm:font-light group-hover:text-luxury-subtext transition-colors duration-300 text-sm sm:text-base leading-snug">
                    {treatment.name}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            <button
              onClick={onBookClick}
              className="bg-black text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-sans font-medium tracking-wide flex items-center space-x-2 w-fit group text-xs sm:text-sm cursor-pointer active:scale-95"
            >
              <Calendar className="h-4 w-4 text-luxury-chrome group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span>Schedule Spa Day</span>
            </button>
          </div>

          {/* Right Column: Orderly, aligned straight-line grid (no staggered overlaps) */}
          <div className="w-full lg:w-7/12 relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative w-full">
              {/* Image 1 */}
              <motion.div 
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="md:col-span-7 group relative overflow-hidden aspect-[4/3] border border-luxury-border rounded-2xl cursor-pointer"
              >
                <img 
                  alt="Radiance Protocol" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={TREATMENT_IMAGES[0]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-luxury-gold mb-2">DERMAL CARE</span>
                  <h3 className="font-serif text-xl md:text-2xl font-light text-white">Radiance Protocol</h3>
                </div>
                <div className="absolute bottom-6 left-6 font-sans text-[10px] tracking-[0.15em] uppercase text-white/70 group-hover:opacity-0 transition-opacity">
                  Radiance Protocol
                </div>
              </motion.div>

              {/* Image 2 */}
              <motion.div 
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="md:col-span-5 group relative overflow-hidden aspect-square md:aspect-auto border border-luxury-border rounded-2xl cursor-pointer"
              >
                <img 
                  alt="Volume Definition" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={TREATMENT_IMAGES[1]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-luxury-gold mb-2">FACIAL SCULPTING</span>
                  <h3 className="font-serif text-xl md:text-2xl font-light text-white">Volume Definition</h3>
                </div>
                <div className="absolute bottom-6 left-6 font-sans text-[10px] tracking-[0.15em] uppercase text-white/70 group-hover:opacity-0 transition-opacity">
                  Precision Sculpting
                </div>
              </motion.div>

              {/* Image 3 */}
              <motion.div 
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="md:col-span-5 group relative overflow-hidden aspect-[4/3] md:aspect-square border border-luxury-border rounded-2xl cursor-pointer"
              >
                <img 
                  alt="Symmetry Mastered" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={TREATMENT_IMAGES[2]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-luxury-gold mb-2">BROW ARCHITECTURE</span>
                  <h3 className="font-serif text-xl md:text-2xl font-light text-white">Symmetry Mastered</h3>
                </div>
                <div className="absolute bottom-6 left-6 font-sans text-[10px] tracking-[0.15em] uppercase text-white/70 group-hover:opacity-0 transition-opacity">
                  Brow Restoration
                </div>
              </motion.div>

              {/* Image 4 */}
              <motion.div 
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="md:col-span-7 group relative overflow-hidden aspect-[16/9] md:aspect-auto border border-luxury-border rounded-2xl cursor-pointer"
              >
                <img 
                  alt="Anatomical Precision" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={TREATMENT_IMAGES[3]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-luxury-gold mb-2">BODY CONTOURING</span>
                  <h3 className="font-serif text-xl md:text-2xl font-light text-white">Anatomical Precision</h3>
                </div>
                <div className="absolute bottom-6 left-6 font-sans text-[10px] tracking-[0.15em] uppercase text-white/70 group-hover:opacity-0 transition-opacity">
                  Contour Refining
                </div>
              </motion.div>

              {/* Image 5 */}
              <motion.div 
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="md:col-span-6 group relative overflow-hidden aspect-square border border-luxury-border rounded-2xl cursor-pointer"
              >
                <img 
                  alt="Lash Extension Art" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={TREATMENT_IMAGES[4]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-luxury-gold mb-2">OCULAR BEAUTY</span>
                  <h3 className="font-serif text-xl md:text-2xl font-light text-white">Lash Extension Art</h3>
                </div>
                <div className="absolute bottom-6 left-6 font-sans text-[10px] tracking-[0.15em] uppercase text-white/70 group-hover:opacity-0 transition-opacity">
                  Lash Enhancement
                </div>
              </motion.div>

              {/* Image 6 */}
              <motion.div 
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="md:col-span-6 group relative overflow-hidden aspect-square border border-luxury-border rounded-2xl cursor-pointer"
              >
                <img 
                  alt="Advanced Portrait" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={TREATMENT_IMAGES[5]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-luxury-gold mb-2">CLINICAL FACIAL</span>
                  <h3 className="font-serif text-xl md:text-2xl font-light text-white">Advanced Aesthetics</h3>
                </div>
                <div className="absolute bottom-6 left-6 font-sans text-[10px] tracking-[0.15em] uppercase text-white/70 group-hover:opacity-0 transition-opacity">
                  Portrait Art
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
