import { TREATMENTS, TREATMENT_IMAGES } from '../data';
import { motion } from 'motion/react';
import { Sparkles, Calendar } from 'lucide-react';
import { TreatmentsConfig } from '../types';

interface TreatmentsProps {
  onBookClick: () => void;
  onTreatmentClick?: (treatmentName: string) => void;
  treatmentsConfig?: TreatmentsConfig;
}

export default function Treatments({ onBookClick, onTreatmentClick, treatmentsConfig }: TreatmentsProps) {
  // Motion settings for list stagger
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring' as const, stiffness: 100 }
    }
  };

  return (
    <section id="treatments" className="py-24 md:py-32 bg-luxury-primary overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Column: Text & Editorial Content */}
          <div className="w-full lg:w-5/12 lg:max-w-[380px] relative">
            <div className="relative mb-6 lg:mb-2">
              <span className="absolute -top-10 left-0 text-5xl md:text-6xl lg:text-3xl font-serif italic text-luxury-border select-none opacity-60 uppercase">
                {treatmentsConfig?.editorialHeading || "rejuvenation"}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-2xl font-light font-serif text-luxury-text leading-tight uppercase relative z-10 pt-4 lg:pt-1">
                {treatmentsConfig?.editorialSub || "Begin your transformation"}
              </h2>
            </div>
            
            <div className="w-12 h-[1px] bg-luxury-gold mb-8 lg:mb-6" />

            <p className="text-luxury-subtext font-sans font-light mb-8 lg:mb-8 leading-relaxed text-base lg:text-sm lg:leading-relaxed">
              {treatmentsConfig?.description || "At Age Reversal Clinic, we believe that aesthetic harmony elevates self-confidence. Our clinical therapists custom-tailor skin therapy sessions, premium facials, and micropigmentation protocols to support your personal wellness ritual."}
            </p>

            {/* Treatment list */}
            <motion.ul 
              variants={listContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="space-y-4 lg:space-y-3 mb-10 lg:mb-8"
            >
              {(treatmentsConfig?.treatments || TREATMENTS).map((treatment) => (
                <motion.li 
                  key={treatment.id}
                  variants={listItemVariants}
                  onClick={() => onTreatmentClick?.(treatment.name)}
                  className="flex items-center space-x-3 group cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-luxury-muted group-hover:border-luxury-gold group-hover:scale-125 transition-all duration-300 shrink-0" />
                  <span className="text-luxury-text font-sans font-light group-hover:text-luxury-subtext transition-colors duration-300 text-sm md:text-base lg:text-sm">
                    {treatment.name}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            <button
              onClick={onBookClick}
              className="bg-black text-white px-8 py-3.5 rounded-full shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-sans font-normal tracking-wide flex items-center space-x-2 w-fit group text-sm md:text-base lg:text-sm"
            >
              <Calendar className="h-4 w-4 text-luxury-chrome group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span>Schedule Spa Day</span>
            </button>
          </div>

          {/* Right Column: Orderly, aligned straight-line grid (no staggered overlaps) */}
          <div className="w-full lg:w-7/12 relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5 relative max-w-lg md:max-w-2xl mx-auto">
              
              {/* Card 1 */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="aspect-square rounded-full overflow-hidden shadow-md border-2 border-white relative group"
              >
                <img 
                  alt="Clinical Facial Treatment" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src={TREATMENT_IMAGES[0]}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="aspect-square rounded-full overflow-hidden shadow-md border-2 border-white relative group"
              >
                <img 
                  alt="Specialist Skin Mapping" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src={TREATMENT_IMAGES[1]}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="aspect-square rounded-full overflow-hidden shadow-md border-2 border-white relative group"
              >
                <img 
                  alt="Rejuvenation Serum Infusion" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src={TREATMENT_IMAGES[2]}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </motion.div>

              {/* Card 4 */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="aspect-square rounded-full overflow-hidden shadow-md border-2 border-white relative group"
              >
                <img 
                  alt="Dermatology Peels" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src={TREATMENT_IMAGES[3]}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </motion.div>

              {/* Card 5 */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="aspect-square rounded-full overflow-hidden shadow-md border-2 border-white relative group"
              >
                <img 
                  alt="Non-invasive lift" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src={TREATMENT_IMAGES[4]}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </motion.div>

              {/* Card 6 */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="aspect-square rounded-full overflow-hidden shadow-md border-2 border-white relative group"
              >
                <img 
                  alt="Laser Rejuvenation Room" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src={TREATMENT_IMAGES[5]}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </motion.div>

            </div>

            {/* Carousel Pagination */}
            <div className="flex items-center justify-center gap-6 pt-12 relative z-10">
              <button
                aria-label="Previous Page"
                className="w-12 h-12 flex items-center justify-center rounded-full border border-luxury-border text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text transition-colors duration-300 shrink-0 bg-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              
              <div className="flex items-center gap-3">
                {[1, 2, 3].map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-sans text-sm transition-all duration-300 ${
                      pageNum === 1
                        ? 'bg-luxury-text text-luxury-primary font-normal'
                        : 'text-luxury-subtext hover:bg-luxury-card'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                aria-label="Next Page"
                className="w-12 h-12 flex items-center justify-center rounded-full border border-luxury-border text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text transition-colors duration-300 shrink-0 bg-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>

            {/* Back decorative element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-luxury-border rounded-[40px] z-[-1] pointer-events-none opacity-40" />
          </div>

        </div>
      </div>
    </section>
  );
}
