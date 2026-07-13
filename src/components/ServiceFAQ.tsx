import React, { useState } from 'react';
import { Sparkles, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceFAQProps {
  treatmentName: string;
  category: string;
  comfortLevel: string;
  recommendedSessions: string;
  downtime: string;
}

export default function ServiceFAQ({
  treatmentName,
  category,
  comfortLevel,
  recommendedSessions,
  downtime
}: ServiceFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Dynamically generated FAQs based on selected treatment properties
  const faqs: FAQItem[] = [
    {
      question: `Is ${treatmentName} painful, and what can I expect?`,
      answer: `This clinical protocol is calibrated with patient comfort in mind. The typical sensation is described as: ${comfortLevel}. Our team uses advanced numbing compounds or cooling systems to ensure your session is as restorative and comfortable as possible.`
    },
    {
      question: `How many sessions of ${treatmentName} will I need to see optimal results?`,
      answer: `While initial cellular improvements can often be seen within weeks, our recommended schedule for premium clinical results is: ${recommendedSessions}. This matches the natural tissue remodeling cycle to build cumulative, long-lasting structure.`
    },
    {
      question: `Is there any downtime, and how soon can I return to normal activity?`,
      answer: `The expected recovery timeframe for this treatment is: ${downtime}. For most sessions, you can return immediately to light activities, following our premium aftercare guidelines (such as applying medical-grade SPF and avoiding intense saunas or heavy sweating for 24-48 hours).`
    },
    {
      question: `Can I combine ${treatmentName} with other clinical procedures?`,
      answer: `Yes, at our flagship clinic we often design integrated multi-depth protocol programs. For instance, combining deep structural lifting (like Ultherapy) with epidermal bioregeneration (like Polynucleotides or Exosomes) maximizes cellular synergy and accelerates overall matrix repair. A personalized combined pathway will be curated during your in-depth diagnostic consultation.`
    },
    {
      question: `How should I prepare my skin on the day of my appointment?`,
      answer: `We advise arriving with clean, makeup-free skin and drinking plenty of water. Please stop using any active acids or prescription-strength retinoids (like Retin-A) 3 to 5 days prior to your session, and avoid intense, direct sun exposure to prevent skin sensitivity.`
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col space-y-6 w-full bg-[#f8fafd] border border-[#eaedf6] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10">
      
      {/* FAQ Header Block: Centered matching the reference image but with reduced text sizing */}
      <div className="text-center space-y-1.5 max-w-2xl mx-auto">
        <span className="text-[10px] sm:text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] block">
          TRUSTED BY
        </span>
        <h4 className="text-xl sm:text-2xl md:text-3xl font-sans font-bold text-[#111827] tracking-tight leading-tight">
          Frequently Asked Questions
        </h4>
      </div>

      {/* Accordion List with reduced max-width and items vertical spacing */}
      <div className="space-y-2.5 max-w-3xl mx-auto w-full">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              id={`faq-item-${idx}`}
              className={`rounded-xl sm:rounded-2xl transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'bg-white border border-[#e5e9f0] shadow-sm'
                  : 'bg-[#f0f4fc] hover:bg-[#e7eefb] border border-transparent'
              }`}
            >
              {/* Trigger header button with reduced padding */}
              <button
                onClick={() => handleToggle(idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors cursor-pointer gap-4"
                aria-expanded={isOpen}
              >
                <span className="text-xs sm:text-sm md:text-base font-bold text-neutral-900 tracking-tight leading-snug">
                  {faq.question}
                </span>
                
                {/* Custom circular action button - smaller scale */}
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isOpen 
                    ? 'bg-[#edf2fa] text-[#2b3652] hover:bg-[#e1e8f5]' 
                    : 'bg-white text-[#2b3652] shadow-sm'
                }`}>
                  {isOpen ? (
                    <X className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[2.5]" />
                  ) : (
                    <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[2.5]" />
                  )}
                </div>
              </button>

              {/* Accordion collapse panel with reduced padding and text sizes */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                      <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Consult Disclaimer block - more compact */}
      <div className="bg-white border border-[#eaedf6] rounded-xl sm:rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto w-full shadow-sm mt-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#f0f4fc] text-[#2b3652] rounded-xl shrink-0">
            <Sparkles className="h-4 w-4 text-rose-gold" />
          </div>
          <div className="text-left">
            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block">Bespoke Skin Mapping</span>
            <p className="text-xs text-neutral-600 font-medium">Have a specific question about your individual dermal matrix?</p>
          </div>
        </div>
        <div className="text-[10px] font-bold text-white uppercase bg-[#003334] hover:bg-[#003334]/95 px-3 py-2 rounded-lg transition-colors cursor-pointer select-none shrink-0 text-center w-full sm:w-auto">
          Answered at consultation
        </div>
      </div>
    </div>
  );
}
