import React from 'react';
import { Sparkles, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ArticleRelatedTreatmentsProps {
  onBookClick: (treatmentName?: string) => void;
}

const FEATURED_TREATMENTS = [
  {
    id: 'morpheus8',
    title: 'Morpheus8 Fractional Remodeling',
    category: 'Collagen Remodeling',
    duration: '60 Mins',
    description: 'Subdermal fractional radiofrequency energy that tightens jowls, sculpts jawline, and refines texture.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR',
    benefits: ['Stimulates Deep Collagen', 'Tightens Facial Laxity', 'Minimal Downtime']
  },
  {
    id: 'profhilo',
    title: 'Profhilo Bio-Remodeling Hydration',
    category: 'Injectable Hydration',
    duration: '30 Mins',
    description: 'Ultra-pure hyaluronic acid micro-injections stimulating 4 types of collagen for deep cellular plumping.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs',
    benefits: ['Intense Dermal Hydration', 'Restores Elasticity', 'Subtle Natural Radiance']
  },
  {
    id: 'facials',
    title: 'Medical Grade Clinical Facials',
    category: 'Dermal Rejuvenation',
    duration: '45 Mins',
    description: 'Bespoke dermal infusion, ultrasonic extraction, and antioxidant serums tailored to your skin barrier.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC',
    benefits: ['Deep Pore Detox', 'Instant Luminous Glow', 'Custom Botanical Serums']
  }
];

export default function ArticleRelatedTreatments({ onBookClick }: ArticleRelatedTreatmentsProps) {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 bg-[#ff8656] text-slate-950 border-b border-[#e57042] overflow-hidden relative selection:bg-orange-200">
      {/* Soft Fade Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/25 to-white/45 backdrop-blur-[0.5px] pointer-events-none" />

      {/* Luminous Ambient Light Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[950px] h-[550px] bg-white/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-20 w-[550px] h-[550px] bg-white/25 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs sm:text-sm font-sans font-semibold text-slate-900 uppercase tracking-[0.24em] block mb-2">
            Recommended Procedures
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-slate-950 tracking-tight mb-3">
            Related Clinical Treatments
          </h2>
          <p className="text-sm sm:text-base text-slate-800 max-w-xl mx-auto font-light leading-relaxed">
            Scientifically backed medical protocols designed to address the skin health concerns discussed in this article.
          </p>
          <div className="w-12 h-0.5 bg-slate-900/60 mx-auto mt-4 sm:mt-5" />
        </div>

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {FEATURED_TREATMENTS.map((treatment, idx) => (
            <motion.div
              key={treatment.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl overflow-hidden border border-white/90 shadow-[0_8px_30px_-8px_rgba(229,112,66,0.3)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Media image container */}
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <img
                  src={treatment.image}
                  alt={treatment.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-900 font-sans font-medium text-xs tracking-wider uppercase px-3 py-1 rounded-full shadow-xs border border-white/80">
                  {treatment.category}
                </div>
                <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs text-white font-sans text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange-200" />
                  <span>{treatment.duration}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-normal text-slate-950 mb-2 leading-snug">
                    {treatment.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4 font-light line-clamp-2">
                    {treatment.description}
                  </p>

                  {/* Benefit highlights */}
                  <div className="space-y-2 mb-5">
                    {treatment.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-[#e57042] shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Book button */}
                <div className="pt-3 border-t border-slate-200/60">
                  <button
                    onClick={() => onBookClick(treatment.title)}
                    className="w-full bg-slate-950 hover:bg-slate-800 text-white py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-sans font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 group/btn cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>Book Consultation</span>
                    <ArrowRight className="w-4 h-4 text-orange-200 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
