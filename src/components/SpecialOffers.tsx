import { useState, useRef } from 'react';
import { SPECIAL_OFFERS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface SpecialOffersProps {
  onClaimOffer: (offerTitle: string) => void;
  treatmentId?: string;
  category?: string;
}

export default function SpecialOffers({ onClaimOffer, treatmentId, category }: SpecialOffersProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [desktopPage, setDesktopPage] = useState(1);

  // Filter special offers based on relevance, fallback to all standard if none
  const matched = treatmentId ? SPECIAL_OFFERS.filter(o => o.treatmentId === treatmentId) : [];
  let allOffers = [...matched];

  if (category) {
    const categoryMatched = SPECIAL_OFFERS.filter(
      o => o.category === category && !allOffers.some(existing => existing.id === o.id)
    );
    allOffers = [...allOffers, ...categoryMatched];
  }

  const standard = SPECIAL_OFFERS.filter(
    o => !allOffers.some(existing => existing.id === o.id)
  );
  allOffers = [...allOffers, ...standard];

  // Desktop pagination
  const desktopItemsPerPage = 2;
  const totalDesktopPages = Math.ceil(allOffers.length / desktopItemsPerPage) || 1;
  const currentDesktopOffers = allOffers.slice(
    (desktopPage - 1) * desktopItemsPerPage,
    desktopPage * desktopItemsPerPage
  );

  // Mobile slide tracking
  const handleMobileScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const cardWidth = clientWidth * 0.76;
    const newIndex = Math.round(scrollLeft / (cardWidth || 1));
    setActiveSlideIndex(Math.min(Math.max(0, newIndex), allOffers.length - 1));
  };

  const scrollToSlide = (index: number) => {
    if (!scrollContainerRef.current) return;
    const cards = scrollContainerRef.current.children;
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest'
      });
      setActiveSlideIndex(index);
    }
  };

  const handlePrevSlide = () => {
    const newIndex = Math.max(0, activeSlideIndex - 1);
    scrollToSlide(newIndex);
  };

  const handleNextSlide = () => {
    const newIndex = Math.min(allOffers.length - 1, activeSlideIndex + 1);
    scrollToSlide(newIndex);
  };

  return (
    <section id="offers" className="py-16 sm:py-20 md:py-24 bg-white border-t border-silver-200 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Title Block */}
        <div className="text-center mb-10 sm:mb-14 md:mb-16">
          <span className="text-xs font-bold text-silver-500 uppercase tracking-[0.25em] block mb-3">
            Limited Time
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-silver-900 mb-4 font-sans tracking-tight">
            Special Clinic Offers
          </h2>
          <div className="w-16 h-0.5 bg-rose-gold mx-auto" />
        </div>

        {/* 1. MOBILE & TABLET VIEW: Horizontally scrollable cards with slightly visible next card */}
        <div
          ref={scrollContainerRef}
          onScroll={handleMobileScroll}
          className="flex lg:hidden overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 max-w-6xl mx-auto pb-4 px-4 -mx-4 no-scrollbar scroll-smooth items-stretch"
        >
          {allOffers.map((offer) => {
            const isRose = offer.theme === 'rose';
            return (
              <div
                key={offer.id}
                className={`w-[76vw] min-w-[76vw] max-w-[76vw] sm:w-[360px] sm:min-w-[360px] sm:max-w-[360px] min-h-[410px] sm:min-h-[460px] snap-start shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden border shadow-sm relative transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${
                  isRose
                    ? 'bg-gradient-to-r from-[#fdf2f2] to-[#fce7e7] border-[#f9d5d5]'
                    : 'bg-gradient-to-r from-silver-100 to-silver-200 border-silver-300'
                }`}
              >
                {/* Floating decor badge */}
                <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 bg-white/70 backdrop-blur-sm p-1.5 rounded-full">
                  <Sparkles className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isRose ? 'text-rose-gold-dark' : 'text-silver-700'}`} />
                </div>

                <div className="flex flex-col items-center p-6 sm:p-8 h-full justify-between gap-5">
                  {/* Info text panel */}
                  <div className="w-full flex flex-col justify-center text-left">
                    <h3 className="text-lg sm:text-2xl font-bold text-silver-900 mb-1 sm:mb-2 line-clamp-2 leading-tight">
                      {offer.title}
                    </h3>
                    <p className="text-base sm:text-2xl font-serif italic text-silver-700 mb-2 sm:mb-3">
                      {offer.discount}
                    </p>
                    <p className="text-xs sm:text-sm text-silver-600 mb-4 sm:mb-6 leading-relaxed max-w-xs line-clamp-2 sm:line-clamp-none">
                      {offer.description}
                    </p>
                    <button
                      onClick={() => onClaimOffer(offer.title)}
                      className={`px-5 py-2.5 sm:px-7 sm:py-3 rounded-full font-bold tracking-widest uppercase text-[10px] sm:text-xs transition-colors shadow-md w-fit cursor-pointer ${
                        isRose
                          ? 'bg-rose-gold hover:bg-rose-gold-dark text-white'
                          : 'bg-silver-800 hover:bg-black text-white'
                      }`}
                    >
                      {offer.buttonText}
                    </button>
                  </div>

                  {/* Aesthetic Product image overlay */}
                  <div className="w-full flex justify-center relative mt-2 sm:mt-4">
                    <img
                      alt={`${offer.title} Promotional Pack`}
                      className={`h-32 sm:h-42 w-auto object-contain drop-shadow-md transition-transform duration-500 hover:scale-105 ${
                        !isRose ? 'grayscale opacity-90' : ''
                      }`}
                      src={offer.image}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MOBILE SLIDE UI CONTROLS */}
        <div className="flex items-center justify-center gap-4 pt-6 sm:pt-8 lg:hidden">
          <button
            onClick={handlePrevSlide}
            disabled={activeSlideIndex === 0}
            aria-label="Previous Offer"
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
              activeSlideIndex === 0
                ? 'border-silver-200 text-silver-300 cursor-not-allowed opacity-50'
                : 'border-silver-300 text-silver-700 hover:bg-silver-100 cursor-pointer shadow-xs'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Interactive Slide indicator pills */}
          <div className="flex items-center gap-1.5">
            {allOffers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlideIndex === idx
                    ? 'w-6 bg-silver-900'
                    : 'w-1.5 bg-silver-300 hover:bg-silver-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNextSlide}
            disabled={activeSlideIndex === allOffers.length - 1}
            aria-label="Next Offer"
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
              activeSlideIndex === allOffers.length - 1
                ? 'border-silver-200 text-silver-300 cursor-not-allowed opacity-50'
                : 'border-silver-300 text-silver-700 hover:bg-silver-100 cursor-pointer shadow-xs'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2. DESKTOP VIEW: Side-by-side 2-column Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {currentDesktopOffers.map((offer, index) => {
              const isRose = offer.theme === 'rose';
              return (
                <motion.div
                  key={`${desktopPage}-${offer.id}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                  className={`rounded-3xl overflow-hidden border shadow-sm relative transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${
                    isRose
                      ? 'bg-gradient-to-r from-[#fdf2f2] to-[#fce7e7] border-[#f9d5d5]'
                      : 'bg-gradient-to-r from-silver-100 to-silver-200 border-silver-300'
                  }`}
                >
                  {/* Floating decor badge */}
                  <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm p-1.5 rounded-full">
                    <Sparkles className={`h-4 w-4 ${isRose ? 'text-rose-gold-dark' : 'text-silver-700'}`} />
                  </div>

                  <div className="flex flex-row items-center p-10 xl:p-12 h-full gap-6">
                    {/* Info text panel */}
                    <div className="w-1/2 flex flex-col justify-center text-left">
                      <h3 className="text-2xl xl:text-3xl font-bold text-silver-900 mb-2">
                        {offer.title}
                      </h3>
                      <p className="text-2xl font-serif italic text-silver-700 mb-4">
                        {offer.discount}
                      </p>
                      <p className="text-xs xl:text-sm text-silver-600 mb-8 leading-relaxed max-w-xs">
                        {offer.description}
                      </p>
                      <button
                        onClick={() => onClaimOffer(offer.title)}
                        className={`px-8 py-3 rounded-full font-bold tracking-widest uppercase text-xs transition-colors shadow-md w-fit cursor-pointer ${
                          isRose
                            ? 'bg-rose-gold hover:bg-rose-gold-dark text-white'
                            : 'bg-silver-800 hover:bg-black text-white'
                        }`}
                      >
                        {offer.buttonText}
                      </button>
                    </div>

                    {/* Aesthetic Product image overlay */}
                    <div className="w-1/2 flex justify-end relative">
                      <img
                        alt={`${offer.title} Promotional Pack`}
                        className={`h-48 xl:h-52 w-auto object-contain drop-shadow-lg transition-transform duration-500 hover:scale-105 ${
                          !isRose ? 'grayscale opacity-90' : ''
                        }`}
                        src={offer.image}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* DESKTOP PAGINATION: < 1 2 3 > */}
        <div className="hidden lg:flex items-center justify-center gap-6 pt-16">
          <button
            onClick={() => setDesktopPage((prev) => Math.max(1, prev - 1))}
            disabled={desktopPage === 1}
            aria-label="Previous Page"
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors shrink-0 ${
              desktopPage === 1
                ? 'border-silver-200 text-silver-300 cursor-not-allowed'
                : 'border-silver-300 text-silver-600 hover:bg-silver-100 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3">
            {Array.from({ length: totalDesktopPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setDesktopPage(pageNum)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all duration-200 cursor-pointer ${
                  pageNum === desktopPage
                    ? 'bg-silver-900 text-white font-extrabold shadow-sm'
                    : 'text-silver-600 hover:bg-silver-100'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => setDesktopPage((prev) => Math.min(totalDesktopPages, prev + 1))}
            disabled={desktopPage === totalDesktopPages}
            aria-label="Next Page"
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors shrink-0 ${
              desktopPage === totalDesktopPages
                ? 'border-silver-200 text-silver-300 cursor-not-allowed'
                : 'border-silver-300 text-silver-600 hover:bg-silver-100 cursor-pointer'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
