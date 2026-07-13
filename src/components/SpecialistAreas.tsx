import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SpecialistAreasConfig } from '../types';

interface SpecialistAreasProps {
  onBookClick: (serviceName?: string) => void;
  onTreatmentClick?: (treatmentName: string) => void;
  onExploreAllClick?: () => void;
  specialistAreasConfig?: SpecialistAreasConfig;
}

interface AreaItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export default function SpecialistAreas({ onBookClick, onTreatmentClick, onExploreAllClick, specialistAreasConfig }: SpecialistAreasProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 3 Pages of clinical & aesthetic specialist areas. Page 1 matches the HTML perfectly.
  const staticPagesData: Record<number, AreaItem[]> = {
    1: [
      {
        id: 'cancer-care',
        title: 'Cancer care',
        description: 'Expert consultants and advanced therapies for fast, world-class private cancer treatment.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXc7SORxoXUK7Kzbf256KDGjYoiGB3XeCLNYObBtlw7h8260KwmKxaiEQL7E2Wg3BTQhjpJs0Iw9GVYkNkpYhd4WPz_jdW6PA2i4yXAVvmrMoBCqMX479nyNRdb7X8GwVNjcQtb1OIG8li-NYXrs-55c2CPQIIew0siqNajiO8--wLogFbflBlElSPQ9GlaxJ2VmWkjKCbGUr2QX1FhpzqTBOU86kyynhHW4UjQMqKe-XDBVsXygiZM-ACB4nUWQl8J4dDjsBIEw'
      },
      {
        id: 'eye-centre',
        title: 'Eye Centre',
        description: 'Rapid diagnostics and tailored treatment for cataracts, eye disease and complex conditions.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4fJHIJX0K1v-oz5txqtrtxpaIViJ65RYhXP0GvCvV9X-BUkcVQEzgBqKS8YzsomPWnOJfJG0bHH7KhmjwFqawKN0Ss4I6mWbR3ZNdU44GSg2NLrvKAwaRieRBsOOT7KE8OriZhzgqvAFhE2KvoiitHEBwjWSBKT4Y81onojL9xa2DBvQY3ooaY_hI5oMtsQHGTkAhp4nYkzSmtJGApHA0MjH-_XS-vhuGsAAtT9vX_mD_3h-ImzrSsTJQk47WHJvD5amFx30t_g'
      },
      {
        id: 'lung-centre',
        title: 'Lung Centre',
        description: 'Fast access to lung diagnostics, therapies and minimally invasive treatments.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSewylSW1YbrYNaLbxZiwxQF6qhQmFTupVXlyUicJq7mls_9KiS0PKgUNmGBOXbGpaLuWRlegLQQDTQbvbNoC7CkLSz2F7KwNAc-d1s8luKt2R6VcojE1oK87g_TmfoFqurEFqbHSXUephHqQH3cIeAEMpzhaqXbEjIVKRBDAQMypjwZ3r-r3Um4iGWAwLDcARQTOD0Hw6TZmIYW9jH-_qH3xAxZVfPts2b6Qg_4UdK0nwL7q9pfmgOvUiiwB4ATkn09Vp0ctO6w'
      },
      {
        id: 'breast',
        title: 'Breast',
        description: 'Expert breast diagnostics with advanced, comfortable imaging for symptoms or family history concerns.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUloxcWsT4NRCnTfn0RneF4Q4BwymxBAMsqFKJv9IIvSzEjhVsjT_MDtI4irgzGW0su__ZFlPbs8_2ebSsDU3aWDop2YR9ea2x21K8fdCKFFVUTyJj9U_xiYZFY63zL5Btb43hR-HaxmbiKFgUp8DqEgm5D4mrjpPpfVzplLWjcWFD75MC4S3cc8dnLB7CywLocC5PIZJPdVTfCwgrgG4WqwQZabVdZ8OAlRAeHeZCBxQt2rP-Gm1MJcgjtoht4nVH3CBwLsNAF8OI'
      }
    ],
    2: [
      {
        id: 'dermatology',
        title: 'Dermatology & Acne',
        description: 'Advanced clinical diagnostics and personalized therapies for persistent acne, rosacea, and cellular scarring.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX'
      },
      {
        id: 'laser-skin',
        title: 'Laser Skin Centre',
        description: 'State-of-the-art fractional CO2 and picosecond laser technologies for complete resurfacing and pigments.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC'
      },
      {
        id: 'facial-contouring',
        title: 'Facial Contouring',
        description: 'Precision aesthetic enhancements combining neuromodulators, fillers, and skin boosters for natural lift.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ'
      },
      {
        id: 'hair-restoration',
        title: 'Hair Restoration',
        description: 'Elite follicle stimulation, PRP and clinical growth induction therapies for healthy, robust hair.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW'
      }
    ],
    3: [
      {
        id: 'cellular-wellness',
        title: 'Cellular Wellness',
        description: 'Intravenous micronutrient therapies and custom cellular vitalizations tailored to bio-markers.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r'
      },
      {
        id: 'longevity-screen',
        title: 'Longevity Screening',
        description: 'Pioneering early stage risk profiles, metabolic evaluations, and long-term vitality maps.',
        image: 'https://lh3.googleusercontent.com/aida/AP1WRLsFtpFDuaNJSlvtgV5ykI3LUHSXc0rzKFYXGGNqkYq6ujIGrmaVAI-UUZWBC9h6l95unMnlba0hL6OSt_W08ItQlzC4HTVhrV4H7Itfm0m7scTAtpBiomP9SY89c7Uj0Q5mgYXMjovpZuGcczZeQepLx4ye1bw1emHNdm8GxyKyt8TftVi79q1QOO0MHef213jXO6KWOkNL6ufVfwZSrPS20twzy3Jy2_MEVCz9mR9pJVAW24L2KhOTQP9P'
      },
      {
        id: 'body-sculpting',
        title: 'Body Sculpting',
        description: 'High-definition body shaping using advanced clinical electromagnetic waves and cryolipolysis.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR'
      },
      {
        id: 'clinical-facials',
        title: 'Medical Grade Facials',
        description: 'Intense dermal cleansing, microcurrent contouring, and medical peels with botanical antioxidants.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs'
      }
    ]
  };

  // Compute dynamic pages based on specialistAreasConfig.areas
  const areas = specialistAreasConfig?.areas || [];
  const chunkedPages: Record<number, AreaItem[]> = {};
  const itemsPerPage = 4;

  if (areas.length > 0) {
    for (let i = 0; i < areas.length; i += itemsPerPage) {
      const pageNum = Math.floor(i / itemsPerPage) + 1;
      chunkedPages[pageNum] = areas.slice(i, i + itemsPerPage);
    }
  }

  const pagesData = Object.keys(chunkedPages).length > 0 ? chunkedPages : staticPagesData;
  const totalPages = Object.keys(pagesData).length || 1;

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));
  };

  return (
    <div className="w-full">
      {/* 1. Explore Specialist Areas Section (HTML replica with premium touch) */}
      <section id="specialist-areas" className="py-24 md:py-32 bg-luxury-secondary border-b border-luxury-border">
        <div className="container mx-auto px-4 md:px-12 max-w-7xl">
          
          {/* Header Layout */}
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-serif font-light text-luxury-text mb-6 tracking-tight leading-tight">
                {specialistAreasConfig?.heading ? (
                   <span dangerouslySetInnerHTML={{ __html: specialistAreasConfig.heading.replace('areas', '<span class="italic text-luxury-gold">areas</span>') }} />
                ) : (
                  <>Explore our specialist <span className="italic text-luxury-gold">areas</span></>
                )}
              </h2>
              <p className="font-sans text-sm md:text-base text-luxury-subtext font-light leading-relaxed">
                {specialistAreasConfig?.description || "At The London Clinic, we offer advanced diagnostics, world-leading consultants and fast access to appointments - often within 48 hours - so your treatment can begin in days, not months. Whether you're worried about cancer, fatigue, weight loss, unexplained symptoms or a family medical history, we move quickly to get you the right help."}
              </p>
            </div>
            <div className="shrink-0 mt-4 lg:mt-0">
              <button
                onClick={() => onExploreAllClick ? onExploreAllClick() : onBookClick('All Specialty Areas')}
                className="bg-white border border-luxury-border text-luxury-text px-8 py-3.5 rounded-full hover:bg-luxury-card transition-colors duration-300 font-sans font-normal tracking-wide flex items-center gap-2 cursor-pointer"
              >
                <span>See all treatment areas</span>
                <ChevronRight className="h-4 w-4 text-luxury-muted group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </button>
            </div>
          </header>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <AnimatePresence mode="wait">
              {pagesData[currentPage].map((area, idx) => (
                <motion.article
                  key={`${currentPage}-${area.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                  onClick={() => onTreatmentClick ? onTreatmentClick(area.title) : onBookClick(area.title)}
                  className="group bg-luxury-card overflow-hidden border border-luxury-border hover:border-luxury-chrome transition-all duration-500 cursor-pointer flex flex-col h-full shadow-[0_4px_40px_-10px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-luxury-secondary relative">
                    <img
                      src={area.image}
                      alt={area.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  </div>
                  <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-serif font-normal text-xl text-luxury-text group-hover:text-luxury-subtext transition-colors leading-tight">
                          {area.title}
                        </h3>
                        <ChevronRight className="h-4 w-4 text-luxury-muted group-hover:translate-x-1 transition-transform shrink-0" strokeWidth={1.5} />
                      </div>
                      <p className="font-sans text-sm text-luxury-subtext font-light leading-relaxed">
                        {area.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {/* Carousel Pagination */}
          <div className="flex items-center justify-center gap-6 py-4">
            <button
              onClick={handlePrevPage}
              aria-label="Previous Page"
              className="w-12 h-12 flex items-center justify-center rounded-full border border-luxury-border text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text transition-colors duration-300 shrink-0"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            
            <div className="flex items-center gap-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-sans text-sm transition-all duration-300 ${
                    currentPage === pageNum
                      ? 'bg-luxury-text text-luxury-primary font-normal'
                      : 'text-luxury-subtext hover:bg-luxury-card'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              aria-label="Next Page"
              className="w-12 h-12 flex items-center justify-center rounded-full border border-luxury-border text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text transition-colors duration-300 shrink-0"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
