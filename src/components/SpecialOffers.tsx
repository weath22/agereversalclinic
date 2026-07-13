import { SPECIAL_OFFERS } from '../data';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface SpecialOffersProps {
  onClaimOffer: (offerTitle: string) => void;
  treatmentId?: string;
  category?: string;
}

export default function SpecialOffers({ onClaimOffer, treatmentId, category }: SpecialOffersProps) {
  // Filter special offers based on relevance, fallback to general if none
  const matched = treatmentId ? SPECIAL_OFFERS.filter(o => o.treatmentId === treatmentId) : [];
  let displayOffers = [...matched];

  if (displayOffers.length < 2 && category) {
    const categoryMatched = SPECIAL_OFFERS.filter(
      o => o.category === category && !displayOffers.some(existing => existing.id === o.id)
    );
    displayOffers = [...displayOffers, ...categoryMatched];
  }

  if (displayOffers.length < 2) {
    const standard = SPECIAL_OFFERS.filter(
      o => !displayOffers.some(existing => existing.id === o.id)
    );
    displayOffers = [...displayOffers, ...standard].slice(0, 2);
  } else {
    displayOffers = displayOffers.slice(0, 2);
  }

  return (
    <section id="offers" className="py-24 bg-white border-t border-silver-200 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Title Block */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-silver-500 uppercase tracking-[0.25em] block mb-3">
            Limited Time
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-silver-900 mb-4 font-sans tracking-tight">
            Special Clinic Offers
          </h2>
          <div className="w-16 h-0.5 bg-rose-gold mx-auto" />
        </div>

        {/* Offers list (Horizontal scroll on mobile, side-by-side on desktop) */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {displayOffers.map((offer, index) => {
            const isRose = offer.theme === 'rose';
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                className={`flex-1 rounded-3xl overflow-hidden border shadow-sm relative transition-all duration-300 hover:shadow-lg ${
                  isRose
                    ? 'bg-gradient-to-r from-[#fdf2f2] to-[#fce7e7] border-[#f9d5d5]'
                    : 'bg-gradient-to-r from-silver-100 to-silver-200 border-silver-300'
                }`}
              >
                {/* Floating decor badge */}
                <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm p-1.5 rounded-full">
                  <Sparkles className={`h-4 w-4 ${isRose ? 'text-rose-gold-dark' : 'text-silver-700'}`} />
                </div>

                <div className="flex flex-col md:flex-row items-center p-8 md:p-12 h-full gap-6">
                  {/* Info text panel */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-silver-900 mb-2">
                      {offer.title}
                    </h3>
                    <p className="text-2xl font-serif italic text-silver-700 mb-4">
                      {offer.discount}
                    </p>
                    <p className="text-xs md:text-sm text-silver-600 mb-8 leading-relaxed max-w-xs">
                      {offer.description}
                    </p>
                    <button
                      onClick={() => onClaimOffer(offer.title)}
                      className={`px-8 py-3 rounded-full font-bold tracking-widest uppercase text-xs transition-colors shadow-md w-fit ${
                        isRose
                          ? 'bg-rose-gold hover:bg-rose-gold-dark text-white'
                          : 'bg-silver-800 hover:bg-black text-white'
                      }`}
                    >
                      {offer.buttonText}
                    </button>
                  </div>

                  {/* Aesthetic Product image overlay */}
                  <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
                    <img
                      alt={`${offer.title} Promotional Pack`}
                      className={`h-40 md:h-52 w-auto object-contain drop-shadow-lg transition-transform duration-500 hover:scale-105 ${
                        !isRose ? 'grayscale opacity-90' : ''
                      }`}
                      src={offer.image}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Pagination */}
        <div className="flex items-center justify-center gap-6 pt-16">
          <button
            aria-label="Previous Page"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-silver-300 text-silver-600 hover:bg-silver-100 transition-colors shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((pageNum) => (
              <button
                key={pageNum}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all duration-200 ${
                  pageNum === 1
                    ? 'bg-silver-900 text-white font-extrabold'
                    : 'text-silver-600 hover:bg-silver-100'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            aria-label="Next Page"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-silver-300 text-silver-600 hover:bg-silver-100 transition-colors shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

      </div>
    </section>
  );
}
