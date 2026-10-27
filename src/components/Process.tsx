import { useState, useEffect } from 'react';
import { PROCESS_STEPS } from '../data';
import { motion } from 'motion/react';
import { getClinicData, fetchRemoteClinicData } from '../lib/adminStore';
import { ClinicData } from '../data/clinicInfo';

export default function Process() {
  const [clinicData, setClinicData] = useState<ClinicData>(() => getClinicData());

  useEffect(() => {
    setClinicData(getClinicData());
    fetchRemoteClinicData().then((remote) => {
      if (remote) setClinicData(remote);
    });

    const handleUpdate = () => {
      setClinicData(getClinicData());
    };

    window.addEventListener('clinic_data_changed', handleUpdate);
    window.addEventListener('process_config_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('clinic_data_changed', handleUpdate);
      window.removeEventListener('process_config_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const processSection = clinicData.processSection;
  const eyebrow = processSection?.eyebrow || 'Our Process';
  const heading = processSection?.heading || 'The Journey to Radiance';
  const subheading =
    processSection?.subheading ||
    'Experience a seamless journey from consultation to transformation, guided by medical expertise and boutique care.';
  const steps =
    Array.isArray(processSection?.steps) && processSection.steps.length > 0
      ? processSection.steps
      : PROCESS_STEPS;
  const sectionKeywords = Array.from(
    new Set([
      ...(processSection?.seoKeywords || []),
      ...steps.flatMap((s) => s.seoKeywords || []),
    ])
  );

  // Format heading so the final word retains the signature italic gold styling
  const renderFormattedHeading = (text: string) => {
    const trimmed = text.trim();
    const parts = trimmed.split(/\s+/);
    if (parts.length <= 1) return trimmed;
    const lastWord = parts.pop();
    return (
      <>
        {parts.join(' ')}{' '}
        <span className="text-luxury-gold italic">{lastWord}</span>
      </>
    );
  };

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
    <section
      id="process"
      aria-label={`${eyebrow} - ${heading}`}
      data-seo-keywords={sectionKeywords.join(', ')}
      itemScope
      itemType="https://schema.org/HowTo"
      className="py-24 md:py-32 bg-luxury-primary border-t border-luxury-border"
    >
      <div className="container mx-auto px-4 md:px-8">
        {sectionKeywords.length > 0 && (
          <span className="sr-only">
            {sectionKeywords.join(', ')}
          </span>
        )}

        {/* Header Title */}
        <div className="text-center mb-16 md:mb-24 max-w-2xl mx-auto">
          <span className="text-[11px] md:text-xs font-sans text-luxury-muted uppercase tracking-[0.2em] block mb-4">
            {eyebrow}
          </span>
          <h2
            itemProp="name"
            className="text-3xl md:text-5xl font-serif font-light text-luxury-text mb-6"
          >
            {renderFormattedHeading(heading)}
          </h2>
          <p
            itemProp="description"
            className="text-luxury-subtext text-sm md:text-base leading-relaxed font-sans font-light"
          >
            {subheading}
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
          {steps.map((step, idx) => (
            <motion.div 
              key={step.id || idx}
              variants={cardVariants}
              itemProp="step"
              itemScope
              itemType="https://schema.org/HowToStep"
              className="group flex flex-col cursor-default"
            >
              {/* Image box with overlay */}
              <div className="aspect-[4/3] rounded-[24px] overflow-hidden mb-8 bg-luxury-secondary border border-luxury-border/50 relative">
                <img 
                  alt={step.imageAlt || `${step.title} — ${clinicData.name || 'Age Reversal Clinics'}`} 
                  itemProp="image"
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
                <h3
                  itemProp="name"
                  className="text-xl md:text-2xl font-serif font-normal text-luxury-text"
                >
                  {step.title}
                </h3>
              </div>

              {Array.isArray(step.seoKeywords) && step.seoKeywords.length > 0 && (
                <span className="sr-only">{step.seoKeywords.join(', ')}</span>
              )}

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
