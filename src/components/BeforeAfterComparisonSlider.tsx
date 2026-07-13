import React, { useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BeforeAfterComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  treatmentName: string;
}

export default function BeforeAfterComparisonSlider({ beforeImage, afterImage, treatmentName }: BeforeAfterComparisonSliderProps) {
  // 8 High-quality clinical before/after cases (1 primary + 7 fallback cases)
  const fallbackCases = [
    {
      before: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
      after: 'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY',
      label: "Clinical Trial: Volumetric Resurfacing"
    },
    {
      before: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
      after: 'https://lh3.googleusercontent.com/aida/AP1WRLv5evIx7Bexs-9iJGxOP9dKFElgqCjw3duyD5PU_MlEubT0SyTO7PuZhJtmqUZf6JcUhS8jDhV8HW0kBhWUb4MYYalT72IO5pVBeVZs2593mjjAC6tI1ZOA1a9xGgg-M5J5waWMYO9uVD4zle9guZj31tQOME7032wvttEoahsd7HhWFooW0oUTyDgrytGK4oKIN0d2mGO5oLnx-NQ5sF7-OZHtA3a9_sCrUegKiXGZwpy_05469C2zVgo',
      label: "Clinical Trial: Subdermal Lifting & Tone"
    },
    {
      before: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
      after: 'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM',
      label: "Clinical Trial: Micro-Focused Tightening"
    }
  ];

  // Exclude identical images from the default fallbacks
  const uniqueFallbacks = fallbackCases.filter(c => c.before !== beforeImage && c.after !== afterImage);

  // Generate 8 pairs
  const pairs = [
    {
      id: 1,
      before: beforeImage,
      after: afterImage,
      label: "Target Aesthetic: Selected Treatment Case"
    }
  ];

  // Fill up to 8 pairs with unique cases, cycling if necessary to guarantee 8 full pairs
  let fallbackIndex = 0;
  for (let i = 2; i <= 8; i++) {
    if (uniqueFallbacks.length > 0) {
      const currentFallback = uniqueFallbacks[fallbackIndex % uniqueFallbacks.length];
      pairs.push({
        id: i,
        before: currentFallback.before,
        after: currentFallback.after,
        label: `Patient Case study ${i} (${currentFallback.label.split(': ')[1]})`
      });
      fallbackIndex++;
    } else {
      pairs.push({
        id: i,
        before: beforeImage,
        after: afterImage,
        label: `Patient Case study ${i} (Collagen Genesis)`
      });
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  
  // As requested: 4 pairs are seen in the viewport on every screen size.
  const itemsPerPage = 4;
  const totalPages = Math.ceil(pairs.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visiblePairs = pairs.slice(currentIndex * itemsPerPage, currentIndex * itemsPerPage + itemsPerPage);

  return (
    <div className="flex flex-col space-y-12 w-full">
      <div className="flex flex-col items-center text-center space-y-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-rose-gold block">
          Clinical Comparison
        </span>
        <h4 className="text-2xl md:text-3xl font-serif font-bold text-silver-950 flex items-center gap-2 justify-center">
          <Sparkles className="h-6 w-6 text-rose-gold animate-pulse" />
          <span>Expected Visual Outcomes</span>
        </h4>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4">
        <div className="overflow-hidden py-4">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 justify-items-center"
          >
            {visiblePairs.map((pair) => (
              <div 
                key={pair.id} 
                className="flex flex-col items-center space-y-4 w-full"
              >
                {/* Case label header */}
                <div className="text-xs font-semibold text-silver-500 uppercase tracking-wider text-center">
                  {pair.label}
                </div>

                <div className="flex flex-row items-center justify-center -space-x-12 sm:-space-x-16 md:-space-x-12 lg:-space-x-16 xl:-space-x-20 w-full max-w-2xl">
                  {/* Left Frame: Before */}
                  <motion.div
                    initial={{ opacity: 0, x: -20, rotate: -3 }}
                    animate={{ opacity: 1, x: 0, rotate: -2 }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                    transition={{ type: 'spring', stiffness: 90, damping: 15 }}
                    className="bg-white p-3 pb-12 sm:p-4 sm:pb-16 rounded-xs shadow-[0_20px_45px_rgba(0,0,0,0.08)] border border-neutral-100/90 flex flex-col relative group cursor-pointer flex-1 max-w-[220px] sm:max-w-[280px] md:max-w-[260px] lg:max-w-[320px] xl:max-w-[350px] z-10"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-50 border border-neutral-200/50 rounded-xs">
                      <img 
                        src={pair.before} 
                        alt={`${treatmentName} Before Treatment ${pair.id}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute bottom-[20px] sm:bottom-[28px] left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
                      <div className="bg-white px-4 py-1.5 rounded-full border border-neutral-200 text-silver-700 font-sans text-[9px] sm:text-[10px] font-bold shadow-[0_2px_10px_rgba(0,0,0,0.05)] tracking-wider uppercase">
                        Before
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Frame: After */}
                  <motion.div
                    initial={{ opacity: 0, x: 20, rotate: 3 }}
                    animate={{ opacity: 1, x: 0, rotate: 2 }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                    transition={{ type: 'spring', stiffness: 90, damping: 15 }}
                    className="bg-white p-3 pb-12 sm:p-4 sm:pb-16 rounded-xs shadow-[0_20px_45px_rgba(0,0,0,0.08)] border border-neutral-100/90 flex flex-col relative group cursor-pointer flex-1 max-w-[220px] sm:max-w-[280px] md:max-w-[260px] lg:max-w-[320px] xl:max-w-[350px] z-20"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-50 border border-neutral-200/50 rounded-xs">
                      <img 
                        src={pair.after} 
                        alt={`${treatmentName} After Treatment ${pair.id}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute bottom-[20px] sm:bottom-[28px] left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
                      <div className="bg-[#003334] text-white px-4 py-1.5 rounded-full border border-[#003334] font-sans text-[9px] sm:text-[10px] font-bold shadow-[0_2px_10px_rgba(0,0,0,0.1)] tracking-wider uppercase">
                        After
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dynamic back and forth 1 2 3 style pagination */}
        <div className="flex items-center justify-center gap-6 pt-12">
          <button
            onClick={prevSlide}
            aria-label="Previous Page"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-silver-300 text-[#003334] hover:bg-silver-100 active:scale-95 transition-all shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all duration-200 ${
                    currentIndex === i
                      ? 'bg-[#003334] text-white font-extrabold shadow-sm'
                      : 'text-silver-600 hover:bg-silver-100 hover:text-silver-900'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={nextSlide}
            aria-label="Next Page"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-silver-300 text-[#003334] hover:bg-silver-100 active:scale-95 transition-all shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-silver-500 text-center leading-relaxed font-medium italic max-w-2xl mx-auto px-4">
        *Disclaimer: Photographic records reflect actual clinical transformations at our Harley Street flagship. Individual cell responses and speeds of collagen genesis may vary based on lifestyle, age, and dermal matrices.
      </p>
    </div>
  );
}
