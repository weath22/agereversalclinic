import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { TREATMENT_DETAILS_DB, DEFAULT_TREATMENT_DETAILS } from './treatments/treatmentData';
import { CLINICAL_AREAS_DB } from './LocationsAndConsultation';
import { getTreatmentDetailsConfig } from '../lib/adminStore';
import BeforeAfterComparisonSlider from './BeforeAfterComparisonSlider';
import SkinLayerTargets from './SkinLayerTargets';
import PrePostCareGuidelines from './PrePostCareGuidelines';
import ServiceFAQ from './ServiceFAQ';
import HowItWorksTimeline from './HowItWorksTimeline';
import ServiceHero from './ServiceHero';
import ServiceOverview from './ServiceOverview';
import ClinicalExpectations from './ClinicalExpectations';
import TargetConcerns from './TargetConcerns';
import ServiceBottomCTA from './ServiceBottomCTA';
import Testimonials from './Testimonials';
import SpecialOffers from './SpecialOffers';

interface ServicePageViewProps {
  treatmentName: string;
  onClose: () => void;
  onBook: (serviceName: string) => void;
}

export default function ServicePageView({ treatmentName, onClose, onBook }: ServicePageViewProps) {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [treatmentName]);

  // Resolve matching treatment metadata dynamically using key lookup
  const getTreatmentData = () => {
    const lowerName = treatmentName.toLowerCase().trim();
    const config = getTreatmentDetailsConfig();
    const db = config || TREATMENT_DETAILS_DB;

    // 1. Search CLINICAL_AREAS_DB for a matching treatment name to get its exact ID key
    let matchedId: string | null = null;
    for (const area of CLINICAL_AREAS_DB) {
      for (const cat of area.categories) {
        const item = cat.items.find(i => i.name.toLowerCase() === lowerName || i.id.toLowerCase() === lowerName);
        if (item) {
          matchedId = item.id;
          break;
        }
      }
      if (matchedId) break;
    }

    // 2. If we found a core ID key and it exists in our customized database config, return it!
    if (matchedId && db[matchedId]) {
      return db[matchedId];
    }

    // 3. Check for direct key match
    if (db[lowerName]) {
      return db[lowerName];
    }
    const slugKey = lowerName.replace(/[^a-z0-9]/g, '');
    if (db[slugKey]) {
      return db[slugKey];
    }

    // 4. Fallback to original hardcoded name substring matches
    if (lowerName.includes('exosome')) return db.exosome || TREATMENT_DETAILS_DB.exosome;
    if (lowerName.includes('profhilo')) return db.profhilo || TREATMENT_DETAILS_DB.profhilo;
    if (lowerName.includes('morpheus') || lowerName.includes('morpheus8')) return db.morpheus8 || TREATMENT_DETAILS_DB.morpheus8;
    if (lowerName.includes('ultherapy')) return db.ultherapy || TREATMENT_DETAILS_DB.ultherapy;
    if (lowerName.includes('polynucleotide')) return db.polynucleotide || TREATMENT_DETAILS_DB.polynucleotide;
    if (lowerName.includes('lip') || lowerName.includes('lips')) return db.lip || TREATMENT_DETAILS_DB.lip;
    if (lowerName.includes('buttock') || lowerName.includes('bbl') || lowerName.includes('butt')) return db.buttock || TREATMENT_DETAILS_DB.buttock;
    if (lowerName.includes('bleph') || lowerName.includes('eyelid') || lowerName.includes('blepharoplasty')) return db.blepharoplasty || TREATMENT_DETAILS_DB.blepharoplasty;
    if (lowerName.includes('aqualyx') || lowerName.includes('fat dissolve')) return db.aqualyx || TREATMENT_DETAILS_DB.aqualyx;

    // Fall back to custom bespoke template if no exact match is found
    return DEFAULT_TREATMENT_DETAILS(treatmentName);
  };

  const data = getTreatmentData();

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="bg-white min-h-screen flex flex-col relative z-10"
      id="service-page-view"
    >
      {/* 2. Service Hero Section */}
      <ServiceHero data={data} onClose={onClose} onBook={onBook} />

      {/* 3. Detailed Clinical Information Section (Under the Hero) */}
      <section id="clinical-details-section" className="bg-white py-16 md:py-24 border-b border-silver-150 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
          
          {/* Section 3.1: Scientific Profile & Overview (Full Width row) */}
          <ServiceOverview data={data} />

          {/* 4. Bottom Action Area */}
          <section className="bg-white py-2 border-t border-silver-150 relative z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <ServiceBottomCTA data={data} onBook={onBook} />
            </div>
          </section>

          {/* Section 3.1.5: How It Works? Dynamic Vertical Timeline */}
          <HowItWorksTimeline treatmentId={data.id} />

          {/* Section 3.2: Clinical Expectations Quick Facts */}
          <ClinicalExpectations data={data} />

          {/* Section 3.3: Target Concerns (Full Width row) */}
          <TargetConcerns data={data} />

          {/* Section 3.2: Clinical Before/After Comparison - Spacious Full Showcase */}
          <div className="pt-16 border-t border-silver-100 max-w-6xl mx-auto w-full">
            <BeforeAfterComparisonSlider
              beforeImage={data.beforeImage}
              afterImage={data.afterImage}
              treatmentName={data.title}
            />
          </div>

          {/* Section 3.2.5: Additional Clinical Gallery Showcase */}
          {data.additionalImages && data.additionalImages.length > 0 && (
            <div className="pt-16 border-t border-silver-100 max-w-6xl mx-auto w-full">
              <div className="flex flex-col items-center text-center space-y-2 mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#c5a880] block">
                  Detailed Clinical Gallery
                </span>
                <h4 className="text-2xl md:text-3xl font-serif font-bold text-[#003334] flex items-center gap-2 justify-center">
                  <ImageIcon className="h-6 w-6 text-[#c5a880] shrink-0" />
                  <span>Procedure &amp; Treatment Portfolio</span>
                </h4>
                <p className="text-xs text-slate-500 max-w-xl mx-auto">
                  Examine detailed zoom-ins, anatomical target areas, and microscopic skin repair progressions for {data.title}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data.additionalImages.map((imgUrl: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col space-y-3 group cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 rounded-xl border border-slate-100">
                      <img 
                        src={imgUrl} 
                        alt={`${data.title} Gallery Reference ${idx + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                    </div>
                    <div className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider text-center">
                      Reference Detail #{idx + 1}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3.3: Dermal Layer Depth Analysis - Spacious Full Showcase */}
          <div className="pt-16 border-t border-silver-100 max-w-5xl mx-auto w-full">
            <SkinLayerTargets
              targetLayer={data.targetLayer}
              targetDepth={data.targetLayerDepth}
              treatmentName={data.title}
            />
          </div>

          {/* Section 3.4: Clinical Care Guidelines - Spacious Full Showcase */}
          <div className="pt-16 border-t border-silver-100 max-w-5xl mx-auto w-full">
            <PrePostCareGuidelines
              preCare={data.preCare}
              postCare={data.postCare}
              treatmentName={data.title}
            />
          </div>

          {/* Section 3.5: Dynamic Treatment FAQs */}
          <div className="pt-16 border-t border-silver-100 max-w-5xl mx-auto w-full">
            <ServiceFAQ
              treatmentName={data.title}
              category={data.category}
              comfortLevel={data.comfortLevel}
              recommendedSessions={data.recommendedSessions}
              downtime={data.downtime}
            />
          </div>

        </div>
      </section>

      {/* 3.6 What My Clients Are Saying - Dynamic Testimonials */}
      <Testimonials treatmentId={data.id} category={data.category} />

      {/* 3.7 Special Clinic Offers - Dynamic Special Offers */}
      <SpecialOffers 
        onClaimOffer={(offerTitle) => {
          onBook(`${data.title} - ${offerTitle}`);
        }} 
        treatmentId={data.id} 
        category={data.category} 
      />

    </motion.div>
  );
}
