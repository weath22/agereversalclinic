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
              className="bg-silver-100 p-8 md:p-10 rounded-2xl relative shadow-sm border border-silver-200 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <img
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                      src={testimonial.image}
                    />
                    <div>
                      <h3 className="text-lg font-bold text-silver-900">{testimonial.name}</h3>
                      <p className="text-xs text-silver-500 font-semibold uppercase tracking-wider mt-0.5">
                        {testimonial.role}
                      </p>
                      
                      {/* Rating Stars */}
                      <div className="flex text-rose-gold mt-1.5">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current text-rose-gold" />
                        ))}
                        <span className="ml-2 text-silver-800 font-bold text-xs">{testimonial.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Icon */}
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {idx % 3 === 0 ? (
                      <Instagram className="w-5 h-5 text-[#E1306C]" />
                    ) : idx % 3 === 1 ? (
                      <Facebook className="w-5 h-5 text-[#1877F2]" />
                    ) : (
                      // TikTok Icon
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#000000">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.63-.37 3.25-1.11 4.7-1.18 2.27-3.23 3.96-5.69 4.63-2.47.66-5.16.49-7.5-.59-2.34-1.07-4.32-2.92-5.46-5.23-1.15-2.31-1.39-4.99-.7-7.44.69-2.45 2.15-4.63 4.2-6.13 2.05-1.51 4.54-2.28 7.08-2.2v4.06c-1.57-.1-3.13.25-4.49 1.02-1.35.77-2.43 1.95-3.08 3.39-.64 1.44-.79 3.06-.41 4.57.38 1.51 1.25 2.86 2.47 3.84 1.23.98 2.76 1.48 4.31 1.4 1.56-.08 3.04-.73 4.17-1.84 1.13-1.11 1.83-2.61 1.97-4.18.15-1.57-.24-3.15-1.08-4.47V.02z"/>
                      </svg>
                    )}
                  </div>
                </div>

                <p className="text-silver-600 leading-relaxed italic text-sm md:text-base">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>

              {/* Verified patient marker */}
              <div className="mt-6 pt-4 border-t border-silver-200/50 flex items-center justify-between text-xs text-silver-400 font-semibold">
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
