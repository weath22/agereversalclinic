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
    <section id="offers" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-[#fbf8f3] via-[#f5ede1] to-[#faf7f2] border-t border-[#D8C2A3]/40 overflow-hidden relative selection:bg-[#D8C2A3]/30">
      {/* Soft Fade Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-white/45 backdrop-blur-[0.5px] pointer-events-none" />

      {/* Luxury Ambient Light Blooms */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[950px] h-[550px] bg-gradient-to-b from-[#D8C2A3]/30 via-[#ecdcc8]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-28 w-[500px] h-[500px] bg-[#ecdcc8]/25 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-28 w-[500px] h-[500px] bg-[#e4d2bc]/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="text-center mb-10 sm:mb-14 md:mb-16">
          <span className="text-[11px] font-sans font-medium text-luxury-gold uppercase tracking-[0.28em] block mb-3">
            Limited Time
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-luxury-text mb-4 tracking-tight">
            Special Clinic Offers
          </h2>
          <div className="w-16 h-0.5 bg-luxury-gold mx-auto" />
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
                className={`w-[76vw] min-w-[76vw] max-w-[76vw] sm:w-[360px] sm:min-w-[360px] sm:max-w-[360px] min-h-[410px] sm:min-h-[460px] snap-start shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden border relative transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${
                  isRose
                    ? 'bg-gradient-to-br from-[#ffffff] via-[#fff5f5] to-[#fdebeb] border-[#f5d0d0] shadow-[0_10px_30px_-8px_rgba(244,180,180,0.35)]'
                    : 'bg-gradient-to-br from-[#ffffff] via-[#fbf8f3] to-[#f4ece0] border-[#e8dcc8] shadow-[0_10px_30px_-8px_rgba(216,194,163,0.35)]'
                }`}
              >
                {/* Floating decor badge */}
                <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-md border border-white/60 p-2 rounded-full shadow-xs">
                  <Sparkles className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isRose ? 'text-rose-gold-dark' : 'text-luxury-gold'}`} />
                </div>

                <div className="flex flex-col items-center p-6 sm:p-8 h-full justify-between gap-5">
                  {/* Info text panel */}
                  <div className="w-full flex flex-col justify-center text-left">
                    <h3 className="text-xl sm:text-2xl font-serif font-light text-luxury-text mb-1 sm:mb-2 line-clamp-2 leading-tight">
                      {offer.title}
                    </h3>
                    <p className={`text-base sm:text-2xl font-serif italic mb-2 sm:mb-3 ${isRose ? 'text-rose-gold-dark' : 'text-luxury-gold'}`}>
                      {offer.discount}
                    </p>
                    <p className="text-xs sm:text-sm text-luxury-subtext font-sans font-light mb-4 sm:mb-6 leading-relaxed max-w-xs line-clamp-2 sm:line-clamp-none">
                      {offer.description}
                    </p>
                    <button
                      onClick={() => onClaimOffer(offer.title)}
                      className={`px-6 py-2.5 sm:px-7 sm:py-3 rounded-full font-sans font-medium tracking-widest uppercase text-[10px] sm:text-xs transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 w-fit cursor-pointer ${
                        isRose
                          ? 'bg-gradient-to-r from-rose-gold to-rose-gold-dark hover:from-rose-gold-dark hover:to-[#c97979] text-white'
                          : 'bg-black hover:bg-neutral-900 text-white border border-luxury-gold/40'
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
                        !isRose ? 'opacity-95' : ''
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
                ? 'border-luxury-border text-luxury-muted cursor-not-allowed opacity-50'
                : 'border-luxury-gold/60 text-luxury-text hover:bg-white bg-white/70 cursor-pointer shadow-xs'
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
                    ? 'w-6 bg-luxury-gold'
                    : 'w-1.5 bg-luxury-border hover:bg-luxury-gold/60'
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
                ? 'border-luxury-border text-luxury-muted cursor-not-allowed opacity-50'
                : 'border-luxury-gold/60 text-luxury-text hover:bg-white bg-white/70 cursor-pointer shadow-xs'
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
                  className={`rounded-3xl overflow-hidden border relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between ${
                    isRose
                      ? 'bg-gradient-to-br from-[#ffffff] via-[#fff5f5] to-[#fdebeb] border-[#f5d0d0] shadow-[0_12px_35px_-8px_rgba(244,180,180,0.35)]'
                      : 'bg-gradient-to-br from-[#ffffff] via-[#fbf8f3] to-[#f4ece0] border-[#e8dcc8] shadow-[0_12px_35px_-8px_rgba(216,194,163,0.35)]'
                  }`}
                >
                  {/* Floating decor badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-white/60 p-2.5 rounded-full shadow-xs">
                    <Sparkles className={`h-4 w-4 ${isRose ? 'text-rose-gold-dark' : 'text-luxury-gold'}`} />
                  </div>

                  <div className="flex flex-row items-center p-10 xl:p-12 h-full gap-6">
                    {/* Info text panel */}
                    <div className="w-1/2 flex flex-col justify-center text-left">
                      <h3 className="text-2xl xl:text-3xl font-serif font-light text-luxury-text mb-2">
                        {offer.title}
                      </h3>
                      <p className={`text-2xl font-serif italic mb-4 ${isRose ? 'text-rose-gold-dark' : 'text-luxury-gold'}`}>
                        {offer.discount}
                      </p>
                      <p className="text-xs xl:text-sm text-luxury-subtext font-sans font-light mb-8 leading-relaxed max-w-xs">
                        {offer.description}
                      </p>
                      <button
                        onClick={() => onClaimOffer(offer.title)}
                        className={`px-8 py-3.5 rounded-full font-sans font-medium tracking-widest uppercase text-xs transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 w-fit cursor-pointer ${
                          isRose
                            ? 'bg-gradient-to-r from-rose-gold to-rose-gold-dark hover:from-rose-gold-dark hover:to-[#c97979] text-white'
                            : 'bg-black hover:bg-neutral-900 text-white border border-luxury-gold/50'
                        }`}
                      >
                        {offer.buttonText}
                      </button>
                    </div>

                    {/* Aesthetic Product image overlay */}
                    <div className="w-1/2 flex justify-end relative">
                      <img
                        alt={`${offer.title} Promotional Pack`}
                        className={`h-48 xl:h-52 w-auto object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105 ${
                          !isRose ? 'opacity-95' : ''
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
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${
              desktopPage === 1
                ? 'border-luxury-border text-luxury-muted cursor-not-allowed opacity-50'
                : 'border-luxury-gold/50 text-luxury-text hover:bg-white bg-white/70 shadow-xs cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3">
            {Array.from({ length: totalDesktopPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setDesktopPage(pageNum)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-sans font-medium text-xs transition-all duration-200 cursor-pointer ${
                  pageNum === desktopPage
                    ? 'bg-black text-white font-semibold shadow-md border border-luxury-gold/40 scale-105'
                    : 'text-luxury-subtext hover:text-luxury-text hover:bg-white/80 border border-transparent'
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
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${
              desktopPage === totalDesktopPages
                ? 'border-luxury-border text-luxury-muted cursor-not-allowed opacity-50'
                : 'border-luxury-gold/50 text-luxury-text hover:bg-white bg-white/70 shadow-xs cursor-pointer'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
