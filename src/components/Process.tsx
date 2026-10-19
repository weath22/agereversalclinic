import { PROCESS_STEPS } from '../data';
import { motion } from 'motion/react';

export default function Process() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <section id="process" className="py-24 md:py-32 bg-luxury-primary border-t border-luxury-border">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header Title */}
        <div className="text-center mb-16 md:mb-24 max-w-2xl mx-auto">
          <span className="text-[11px] md:text-xs font-sans text-luxury-muted uppercase tracking-[0.2em] block mb-4">
            Our Process
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-luxury-text mb-6">
            The Journey to <span className="text-luxury-gold italic">Radiance</span>
          </h2>
          <p className="text-luxury-subtext text-sm md:text-base leading-relaxed font-sans font-light">
            Experience a seamless journey from consultation to transformation, guided by medical expertise and boutique care.
          </p>
        </div>

        {/* 3 Step Process Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8"
        >
          {PROCESS_STEPS.map((step) => (
            <motion.div 
              key={step.id}
              variants={cardVariants}
              className="group flex flex-col cursor-default"
            >
              {/* Image box with overlay */}
              <div className="aspect-[4/3] rounded-[24px] overflow-hidden mb-8 bg-luxury-secondary border border-luxury-border/50 relative">
                <img 
                  alt={step.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
                  src={step.image}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
              </div>

              {/* Step info row */}
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-3xl font-serif font-light text-luxury-chrome transition-colors duration-500 group-hover:text-luxury-gold">
                  {step.stepNumber}
                </span>
                <h3 className="text-xl md:text-2xl font-serif font-normal text-luxury-text">
                  {step.title}
                </h3>
              </div>

              {/* Underline separator */}
              <div className="h-[1px] w-full bg-luxury-border mt-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-0 h-full bg-luxury-gold group-hover:w-full transition-all duration-700 ease-in-out" />
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
