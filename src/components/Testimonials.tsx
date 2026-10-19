import { TESTIMONIALS } from '../data';
import { Star, Instagram, Facebook } from 'lucide-react';
import { motion } from 'motion/react';

interface TestimonialsProps {
  treatmentId?: string;
  category?: string;
}

export default function Testimonials({ treatmentId, category }: TestimonialsProps = {}) {
  // Filter testimonials based on relevance, fallback to general/all if none
  const matched = treatmentId ? TESTIMONIALS.filter(t => t.treatmentId === treatmentId) : [];
  let displayTestimonials = [...matched];

  if (displayTestimonials.length < 2 && category) {
    const categoryMatched = TESTIMONIALS.filter(
      t => t.category === category && !displayTestimonials.some(existing => existing.id === t.id)
    );
    displayTestimonials = [...displayTestimonials, ...categoryMatched];
  }

  if (displayTestimonials.length < 2) {
    const standard = TESTIMONIALS.filter(
      t => !displayTestimonials.some(existing => existing.id === t.id)
    );
    displayTestimonials = [...displayTestimonials, ...standard].slice(0, 2);
  } else {
    displayTestimonials = displayTestimonials.slice(0, 2);
  }

  return (
    <section id="reviews" className="py-24 bg-white border-t border-silver-200">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header Block */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="w-8 h-0.5 bg-rose-gold"></span>
            <span className="text-xs font-bold text-silver-500 uppercase tracking-[0.25em]">
              Client Testimonials
            </span>
            <span className="w-8 h-0.5 bg-rose-gold"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-sans text-silver-900 leading-tight">
            What My <span className="italic font-serif text-rose-gold">Clients Are Saying</span>
          </h2>
          <p className="text-silver-500 text-sm mt-4">
            Hear from patients who have experienced our premier rejuvenation therapies firsthand.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {displayTestimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-silver-100 p-4.5 sm:p-7 md:p-10 rounded-2xl relative shadow-sm border border-silver-200 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start sm:items-center justify-between gap-2.5 sm:gap-3 mb-3.5 sm:mb-6">
                  <div className="flex items-center space-x-2.5 sm:space-x-3.5 md:space-x-4 min-w-0 flex-1">
                    <img
                      alt={testimonial.name}
                      loading="lazy"
                      decoding="async"
                      className="w-10 h-10 sm:w-13 sm:h-13 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                      src={testimonial.image}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-silver-900 truncate leading-tight">{testimonial.name}</h3>
                      <p className="text-[10px] sm:text-[11px] md:text-xs text-silver-500 font-semibold uppercase tracking-wider mt-0.5 truncate">
                        {testimonial.role}
                      </p>
                      
                      {/* Rating Stars */}
                      <div className="flex items-center text-rose-gold mt-1 sm:mt-1.5 gap-0.5">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-current text-rose-gold shrink-0" />
                        ))}
                        <span className="ml-1 sm:ml-1.5 text-silver-800 font-bold text-[10px] sm:text-xs">{testimonial.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Icon */}
                  <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-silver-200/50">
                    {idx % 3 === 0 ? (
                      <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-[#E1306C]" />
                    ) : idx % 3 === 1 ? (
                      <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-[#1877F2]" />
                    ) : (
                      // TikTok Icon - centered & proportionally fitted
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-black shrink-0" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.3 6.3 0 0 0 1.87-4.5V8.5a8.28 8.28 0 0 0 4.84 1.55v-3.36h-.94z"/>
                      </svg>
                    )}
                  </div>
                </div>

                <p className="text-silver-600 leading-relaxed italic text-xs sm:text-sm md:text-base">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>

              {/* Verified patient marker */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-silver-200/50 flex items-center justify-between text-[10px] sm:text-[11px] text-silver-400 font-semibold tracking-wider">
                <span>VERIFIED RECIPIENT</span>
                <span>HARLEY STREET CLINIC</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Carousel Pagination */}
        <div className="flex items-center justify-center gap-6 pt-16">
          <button
            aria-label="Previous Page"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-silver-300 text-silver-600 hover:bg-silver-200 transition-colors shrink-0"
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
                    : 'text-silver-600 hover:bg-silver-200'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            aria-label="Next Page"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-silver-300 text-silver-600 hover:bg-silver-200 transition-colors shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

      </div>
    </section>
  );
}
