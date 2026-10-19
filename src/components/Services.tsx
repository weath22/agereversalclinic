import { useState } from 'react';
import { SERVICES } from '../data';
import { ArrowRight, Sparkles, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Service } from '../types';

interface ServicesProps {
  onBookAppointment: (serviceName?: string) => void;
}

export default function Services({ onBookAppointment }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Elaborate details to present in a luxury modal if they click!
  const serviceExtendedDetails: Record<string, { benefits: string[]; duration: string; recovery: string }> = {
    acne: {
      benefits: ['Deep pore cleansing', 'Reduction in active acne lesions', 'Scar tissue smoothing', 'Prevention of future breakouts'],
      duration: '45 - 60 mins',
      recovery: 'No downtime, mild redness for a few hours'
    },
    laser: {
      benefits: ['Pigmentation break-down', 'Collagen production boost', 'Fine lines smoothing', 'Even skin texture and tone'],
      duration: '30 - 45 mins',
      recovery: '1 - 2 days of mild peeling, sunscreen required'
    },
    'anti-aging': {
      benefits: ['Instant wrinkle smoothing', 'Facial contouring and lift', 'Skin hydration enhancement', 'Long-lasting natural rejuvenation'],
      duration: '45 - 75 mins',
      recovery: 'Minimal swelling, fully healed in 24 - 48 hours'
    },
    pigmentation: {
      benefits: ['Targeted dark spot fading', 'Melasma management', 'Brightened complexion', 'UV damage repair'],
      duration: '45 mins',
      recovery: 'Zero downtime'
    },
    hair: {
      benefits: ['Hair follicles stimulation', 'Increases density and thickness', 'Safe clinical growth induction', 'Clinically proven results'],
      duration: '60 - 90 mins',
      recovery: 'Minimal soreness for 24 hours'
    }
  };

  return (
    <section id="services" className="py-24 bg-white border-t border-silver-100">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Title Block */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-silver-500 uppercase tracking-[0.25em] block mb-3">
            Our Services
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-silver-900 mb-4 leading-tight">
            Comprehensive Skin Care Solutions
          </h2>
          <div className="w-16 h-0.5 bg-rose-gold mx-auto mb-6" />
          <p className="text-silver-600 text-sm md:text-base">
            Expertly-curated aesthetic treatments combining dermatological expertise with state-of-the-art technologies for flawless, age-reversed results.
          </p>
        </div>

        {/* Modular Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 border border-silver-200 rounded-2xl overflow-hidden shadow-sm bg-silver-100">
          {SERVICES.map((service, index) => {
            const isAntiAging = service.id === 'anti-aging';
            return (
              <motion.div
                key={service.id}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${
                  isAntiAging
                    ? 'bg-gradient-to-b from-silver-900 to-black text-white shadow-xl z-10 md:scale-105 md:rounded-2xl lg:mx-0'
                    : 'bg-white hover:bg-silver-100/30 text-silver-800'
                } ${
                  index !== SERVICES.length - 1 && !isAntiAging ? 'border-b md:border-b-0 md:border-r border-silver-200' : ''
                }`}
                onClick={() => setSelectedService(service)}
              >
                {isAntiAging && (
                  <div className="absolute top-4 right-4 bg-rose-gold text-silver-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow">
                    <Sparkles className="h-2.5 w-2.5 fill-current" />
                    <span>POPULAR</span>
                  </div>
                )}

                <div>
                  {/* Image wrapper */}
                  <div className="aspect-[4/3] w-full mb-6 overflow-hidden rounded-xl bg-silver-100 border border-silver-200">
                    <img
                      alt={service.title}
                      className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${isAntiAging ? 'grayscale' : ''}`}
                      src={service.image}
                    />
                  </div>

                  <h3 className={`text-xl font-bold mb-2 ${isAntiAging ? 'text-white' : 'text-silver-900'}`}>
                    {service.title}
                  </h3>
                  <p className={`text-sm mb-6 ${isAntiAging ? 'text-silver-400' : 'text-silver-600'}`}>
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-silver-100/30">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-gold hover:underline">
                    View Protocol
                  </span>
                  <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isAntiAging ? 'text-white' : 'text-silver-400'}`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Treatment Booking Incentive */}
        <div className="mt-12 text-center">
          <p className="text-sm text-silver-500">
            Unsure which protocol matches your skin?{' '}
            <button 
              onClick={() => onBookAppointment()} 
              className="text-silver-900 font-bold underline hover:text-rose-gold transition-colors"
            >
              Book a bespoke clinical consultation
            </button>
          </p>
        </div>

        {/* Interactive Luxury Service Detail Modal */}
        <AnimatePresence>
          {selectedService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedService(null)}
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full relative z-10 border border-silver-200"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 bg-silver-100 hover:bg-silver-200 text-silver-700 p-2 rounded-full transition-colors z-20"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Hero Image inside Modal */}
                <div className="h-48 w-full overflow-hidden relative">
                  <img
                    alt={selectedService.title}
                    className="w-full h-full object-cover"
                    src={selectedService.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-rose-gold uppercase block mb-1">
                        CLINICAL PROTOCOL
                      </span>
                      <h4 className="text-2xl font-bold font-serif text-white">
                        {selectedService.title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-6">
                  <p className="text-silver-600 text-sm leading-relaxed mb-6">
                    {selectedService.description} Our specialist dermatologists utilize medically validated technologies to deliver premium safety and transformative results.
                  </p>

                  <div className="mb-6">
                    <h5 className="text-xs font-bold text-silver-800 uppercase tracking-wider mb-3">
                      Targeted Benefits:
                    </h5>
                    <ul className="space-y-2">
                      {serviceExtendedDetails[selectedService.id]?.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center text-sm text-silver-700 gap-2">
                          <span className="w-4 h-4 rounded-full bg-rose-gold/10 flex items-center justify-center text-rose-gold-dark shrink-0">
                            <Check className="h-3 w-3 stroke-[3px]" />
                          </span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Practical treatment specs */}
                  <div className="grid grid-cols-2 gap-4 bg-silver-100 p-4 rounded-xl mb-6 text-xs font-semibold text-silver-700">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-silver-400 block mb-0.5">Duration</span>
                      <span className="text-sm font-bold text-silver-800">{serviceExtendedDetails[selectedService.id]?.duration}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-silver-400 block mb-0.5">Downtime / Recovery</span>
                      <span className="text-sm font-bold text-silver-800">{serviceExtendedDetails[selectedService.id]?.recovery}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        onBookAppointment(selectedService.title);
                        setSelectedService(null);
                      }}
                      className="flex-1 bg-silver-900 hover:bg-black text-white text-center py-3 rounded-lg font-bold transition-all shadow text-sm"
                    >
                      Book Treatment
                    </button>
                    <button
                      onClick={() => setSelectedService(null)}
                      className="flex-1 border border-silver-300 text-silver-700 hover:bg-silver-100 py-3 rounded-lg font-semibold transition-all text-sm"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
