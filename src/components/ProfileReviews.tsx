import React from 'react';
import { Star, Instagram, Facebook } from 'lucide-react';
import { motion } from 'motion/react';
import { ProfilePageConfig } from '../types';

interface ProfileReviewsProps {
  config: ProfilePageConfig;
}

export default function ProfileReviews({ config }: ProfileReviewsProps) {
  const {
    reviewsTitle = 'Patient Reviews',
    reviewsRating = 5.0,
    reviewsCountText = '(124 verified reviews)',
    reviews = []
  } = config || {};

  return (
    <section className="py-16 md:py-24 bg-[#f8f9ff] border-t border-[#bfc8c8]/40">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-serif font-bold text-[#003334] mb-4">{reviewsTitle}</h2>
            <div className="flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-rose-gold fill-current" />
                ))}
              </div>
              <span className="text-[#003334] font-bold text-lg">{reviewsRating.toFixed(1)}</span>
              <span className="text-[#3f4849] text-sm">{reviewsCountText}</span>
            </div>
          </div>
          <button className="bg-white border border-[#bfc8c8] text-[#3f4849] px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#e6eeff]/60 hover:text-[#003334] transition-all shadow-sm">
            Leave a Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white p-8 md:p-10 rounded-2xl relative shadow-sm border border-[#bfc8c8]/30 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <img
                      alt={review.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                      src={review.image}
                    />
                    <div>
                      <h3 className="text-lg font-bold text-[#003334]">{review.name}</h3>
                      <p className="text-xs text-[#3f4849] font-semibold uppercase tracking-wider mt-0.5">
                        {review.role}
                      </p>
                      
                      {/* Rating Stars */}
                      <div className="flex text-rose-gold mt-1.5">
                        {[...Array(Math.round(review.rating))].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current text-rose-gold" />
                        ))}
                        <span className="ml-2 text-[#003334] font-bold text-xs">{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Icon */}
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-[#bfc8c8]/20">
                    {review.source === 'instagram' ? (
                      <Instagram className="w-5 h-5 text-[#E1306C]" />
                    ) : review.source === 'facebook' ? (
                      <Facebook className="w-5 h-5 text-[#1877F2]" />
                    ) : (
                      // TikTok Icon or fallback
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#000000">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.63-.37 3.25-1.11 4.7-1.18 2.27-3.23 3.96-5.69 4.63-2.47.66-5.16.49-7.5-.59-2.34-1.07-4.32-2.92-5.46-5.23-1.15-2.31-1.39-4.99-.7-7.44.69-2.45 2.15-4.63 4.2-6.13 2.05-1.51 4.54-2.28 7.08-2.2v4.06c-1.57-.1-3.13.25-4.49 1.02-1.35.77-2.43 1.95-3.08 3.39-.64 1.44-.79 3.06-.41 4.57.38 1.51 1.25 2.86 2.47 3.84 1.23.98 2.76 1.48 4.31 1.4 1.56-.08 3.04-.73 4.17-1.84 1.13-1.11 1.83-2.61 1.97-4.18.15-1.57-.24-3.15-1.08-4.47V.02z"/>
                      </svg>
                    )}
                  </div>
                </div>

                <p className="text-[#3f4849] font-sans leading-relaxed italic text-sm md:text-base">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              {/* Verified patient marker */}
              <div className="mt-6 pt-4 border-t border-[#bfc8c8]/30 flex items-center justify-between text-xs text-[#3f4849] font-semibold">
                <span>VERIFIED RECIPIENT</span>
                <span>HARLEY STREET CLINIC</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


