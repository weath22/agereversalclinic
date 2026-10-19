import React, { useState, useMemo } from 'react';
import { TESTIMONIALS, CLINIC_INFO } from '../../data';
import { Testimonial } from '../../types';
import { Star, Instagram, Facebook, Search, ArrowLeft, SlidersHorizontal, Sparkles, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ClinicalSEOHead from '../ClinicalSEOHead';

interface ReviewsPageViewProps {
  onClose: () => void;
  onBookClick?: (serviceName?: string) => void;
}

export const ReviewsPageView: React.FC<ReviewsPageViewProps> = ({
  onClose,
  onBookClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<number | 'All'>('All');

  // Extract unique categories from testimonials
  const categories = useMemo(() => {
    const set = new Set<string>();
    TESTIMONIALS.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return TESTIMONIALS.filter((t) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.role && t.role.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || t.category === selectedCategory;

      const matchesRating =
        selectedRating === 'All' || t.rating === selectedRating;

      return matchesSearch && matchesCategory && matchesRating;
    });
  }, [searchQuery, selectedCategory, selectedRating]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf8f3] via-[#f6efe4] to-[#fbf9f5] text-stone-900 relative selection:bg-[#D8C2A3]/30">
      {/* Dynamic SEO metadata for Patient Reviews */}
      <ClinicalSEOHead
        customTitle="Patient Reviews & Verified Testimonials | Europe's Top Rated Clinic"
        customDescription="Read 100k+ verified 5-star clinical reviews and transformation stories from real patients at Age Reversal Clinics London Harley Street."
        canonicalPath="#reviews"
      />

      {/* Top Floating Back Bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#D8C2A3]/40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-stone-900 hover:text-black font-semibold text-sm transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-[#8a7250] group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[#7a6242] bg-[#f7f0e6] border border-[#D8C2A3]/70 px-3.5 py-1 rounded-full shadow-xs">
            <Star className="w-3.5 h-3.5 fill-[#D4B726] text-[#D4B726] shrink-0" />
            100k+ 5-Star Verified Feedback
          </span>
          {onBookClick && (
            <button
              type="button"
              onClick={() => onBookClick('Consultation from Reviews')}
              className="bg-black hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-full transition-all shadow-sm cursor-pointer"
            >
              Book Consultation
            </button>
          )}
        </div>
      </div>

      {/* Hero UI specified by User */}
      <section className="relative h-[46vh] sm:h-[52vh] md:h-[60vh] w-full overflow-hidden bg-cream">
        <div className="h-full bg-noir-900">
          <div className="h-full w-full lg:w-full opacity-60">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover object-top opacity-80"
            >
              <source
                src="https://stream.mux.com/DcCAj02UTqZ1LTrd15Dx6Zlg8skemwVh12LP02mh8dgkQ/capped-1080p.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 z-10 h-2/3 w-full bg-gradient-to-t from-noir-900/50 to-transparent"></div>
        <div className="relative z-10 mx-auto max-w-screen-2xl">
          <div className="absolute bottom-0 left-0 w-full">
            <div className="space-y-2.5 sm:space-y-4 md:space-y-8 px-4 sm:px-6 pb-5 sm:pb-8 lg:pb-20 2xl:px-0">
              <div className="space-y-1.5 sm:space-y-2 md:w-1/2">
                <h1 className="mb-0 block text-3xl md:text-4xl lg:text-5xl xl:text-7xl leading-tight sm:leading-tight md:leading-tight text-white antialiased">
                  Europe’s Top Rated Aesthetics Clinic
                </h1>
                <div>
                  <div className="flex flex-row py-1 sm:py-2 gap-0.5 sm:gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="#D4B726"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-star w-4 h-4 sm:w-5 sm:h-5 md:h-7 md:w-7 text-[#D4B726]"
                      aria-hidden="true"
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="#D4B726"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-star w-4 h-4 sm:w-5 sm:h-5 md:h-7 md:w-7 text-[#D4B726]"
                      aria-hidden="true"
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="#D4B726"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-star w-4 h-4 sm:w-5 sm:h-5 md:h-7 md:w-7 text-[#D4B726]"
                      aria-hidden="true"
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="#D4B726"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-star w-4 h-4 sm:w-5 sm:h-5 md:h-7 md:w-7 text-[#D4B726]"
                      aria-hidden="true"
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="#D4B726"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-star w-4 h-4 sm:w-5 sm:h-5 md:h-7 md:w-7 text-[#D4B726]"
                      aria-hidden="true"
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-white text-sm sm:text-lg md:text-xl lg:text-2xl font-light sm:font-normal">
                  100k+ five star reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Gold & Champagne Ambient Lighting matching Shop Page */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-[#D8C2A3]/50 via-[#ecdcc8]/30 to-transparent rounded-full blur-3xl opacity-90" />
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-[#ecdcc8]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-40 w-[600px] h-[600px] bg-[#e4d2bc]/45 rounded-full blur-3xl" />
      </div>

      {/* Main Clean Page Content Layout matching Shop Page */}
      <main className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-12 sm:pb-16">
        {/* Filter and Search Bar */}
        <div className="bg-white/80 backdrop-blur-md -mx-4 sm:mx-0 px-4 py-4.5 sm:p-6 rounded-none sm:rounded-3xl border-y sm:border border-[#D8C2A3]/40 shadow-[0_4px_20px_-4px_rgba(216,194,163,0.18)] mt-0 mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Left: Heading & Count */}
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl lg:text-3xl font-normal text-stone-950 tracking-tight">
                Testimonial Stories
              </h2>
              <span className="bg-[#f3ebdF] text-[#7a6242] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#D8C2A3]/60">
                ({filteredReviews.length})
              </span>
            </div>

            {/* Right: Search Input */}
            <div className="relative flex-1 md:max-w-xs">
              <input
                type="text"
                placeholder="Search treatments or reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/95 rounded-full text-xs sm:text-sm border border-[#D8C2A3]/70 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 shadow-xs"
              />
              <Search className="w-4 h-4 text-[#8a7250] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="mt-4 pt-4 border-t border-[#D8C2A3]/30 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8a7250]" />
              Treatment Area:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-white/90 text-stone-700 border border-[#D8C2A3]/60 hover:border-[#8a7250] hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Existing Review Cards Grid */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white/80 backdrop-blur-md rounded-2xl border border-silver-200 my-8 shadow-xs">
            <p className="font-serif text-lg sm:text-xl text-silver-900 font-medium mb-2">
              No matching reviews found
            </p>
            <p className="text-xs sm:text-sm text-silver-500 mb-6 max-w-sm mx-auto px-4">
              Try adjusting your search terms or selecting &quot;All&quot; categories to explore more verified stories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedRating('All');
              }}
              className="bg-silver-900 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-silver-800 transition-colors shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 max-w-5xl mx-auto">
            {filteredReviews.map((testimonial, idx) => (
              <motion.div
                key={testimonial.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
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
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-silver-900 truncate leading-tight">
                          {testimonial.name}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] md:text-xs text-silver-500 font-semibold uppercase tracking-wider mt-0.5 truncate">
                          {testimonial.role}
                        </p>
                        
                        {/* Rating Stars - scaled appropriately for mobile */}
                        <div className="flex items-center text-rose-gold mt-1 sm:mt-1.5 gap-0.5">
                          {[...Array(testimonial.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-current text-rose-gold shrink-0" />
                          ))}
                          <span className="ml-1 sm:ml-1.5 text-silver-800 font-bold text-[10px] sm:text-xs">
                            {(testimonial.rating || 5).toFixed(1)}
                          </span>
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

                {/* Verified patient marker - reduced text */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-silver-200/50 flex items-center justify-between text-[10px] sm:text-[11px] text-silver-400 font-semibold tracking-wider">
                  <span>VERIFIED RECIPIENT</span>
                  <span>HARLEY STREET CLINIC</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Clean "Add Review" UI with Luxury SVG Frame Design */}
        <div className="relative mt-12 sm:mt-16 bg-gradient-to-b from-[#ffffff] via-[#fdfbf7] to-[#f7f1e6] rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 border border-[#D8C2A3]/70 shadow-[0_12px_45px_-8px_rgba(216,194,163,0.32)] max-w-2xl mx-auto text-center overflow-hidden">
          
          {/* 1. Scalable SVG Architectural Frame & Border System */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 360"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="goldOuterStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C4A57B" stopOpacity="0.85" />
                <stop offset="25%" stopColor="#E9DEC9" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#A68353" stopOpacity="0.75" />
                <stop offset="75%" stopColor="#DFCEB6" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#C4A57B" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="goldInnerStroke" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C4A57B" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#DFCEB6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#A68353" stopOpacity="0.6" />
              </linearGradient>
              <radialGradient id="centerGoldGlow" cx="50%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#D8C2A3" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#EADBCA" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient Center Glow */}
            <rect x="0" y="0" width="640" height="360" fill="url(#centerGoldGlow)" />

            {/* Primary Outer SVG Hairline Frame */}
            <rect
              x="8"
              y="8"
              width="624"
              height="344"
              rx="18"
              fill="none"
              stroke="url(#goldOuterStroke)"
              strokeWidth="1.25"
            />

            {/* Concentric Inset Dashed SVG Luxury Border */}
            <rect
              x="14"
              y="14"
              width="612"
              height="332"
              rx="13"
              fill="none"
              stroke="url(#goldInnerStroke)"
              strokeWidth="0.85"
              strokeDasharray="4 3"
            />

            {/* Mid-edge Ornamental Diamond Accents */}
            <polygon points="8,180 12,175 16,180 12,185" fill="#A68353" />
            <polygon points="632,180 628,175 624,180 628,185" fill="#A68353" />
            <polygon points="320,8 325,12 320,16 315,12" fill="#A68353" />
            <polygon points="320,352 325,348 320,344 315,348" fill="#A68353" />
          </svg>

          {/* 2. Delicate Guilloche Engraving Watermark in SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06] text-[#8a7250]"
            viewBox="0 0 600 340"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern id="clinicGuilloche" width="48" height="48" patternUnits="userSpaceOnUse">
                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="0.75" />
                <circle cx="24" cy="24" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                <path d="M 0 24 Q 24 0 48 24 Q 24 48 0 24 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="24" cy="24" r="2" fill="currentColor" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="600" height="340" fill="url(#clinicGuilloche)" />
          </svg>

          {/* 3. Luxury Corner Filigrees / Brackets in SVG (Independent aspect ratio for crisp rendering) */}
          {/* Top-Left Corner */}
          <svg
            className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 w-8 h-8 sm:w-12 sm:h-12 text-[#9e7d47] pointer-events-none"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M 4 24 V 10 C 4 6.7 6.7 4 10 4 H 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 8 20 V 12 C 8 9.8 9.8 8 12 8 H 20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 4 4 L 14 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <circle cx="14" cy="14" r="2" fill="currentColor" />
            <circle cx="6" cy="6" r="1" fill="currentColor" />
          </svg>

          {/* Top-Right Corner */}
          <svg
            className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 w-8 h-8 sm:w-12 sm:h-12 text-[#9e7d47] pointer-events-none"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M 44 24 V 10 C 44 6.7 41.3 4 38 4 H 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 40 20 V 12 C 40 9.8 38.2 8 36 8 H 28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 44 4 L 34 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <circle cx="34" cy="14" r="2" fill="currentColor" />
            <circle cx="42" cy="6" r="1" fill="currentColor" />
          </svg>

          {/* Bottom-Left Corner */}
          <svg
            className="absolute bottom-2 left-2 sm:bottom-3.5 sm:left-3.5 w-8 h-8 sm:w-12 sm:h-12 text-[#9e7d47] pointer-events-none"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M 4 24 V 38 C 4 41.3 6.7 44 10 44 H 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 8 28 V 36 C 8 38.2 9.8 40 12 40 H 20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 4 44 L 14 34" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <circle cx="14" cy="34" r="2" fill="currentColor" />
            <circle cx="6" cy="42" r="1" fill="currentColor" />
          </svg>

          {/* Bottom-Right Corner */}
          <svg
            className="absolute bottom-2 right-2 sm:bottom-3.5 sm:right-3.5 w-8 h-8 sm:w-12 sm:h-12 text-[#9e7d47] pointer-events-none"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M 44 24 V 38 C 44 41.3 41.3 44 38 44 H 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 40 28 V 36 C 40 38.2 38.2 40 36 40 H 28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 44 44 L 34 34" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <circle cx="34" cy="34" r="2" fill="currentColor" />
            <circle cx="42" cy="42" r="1" fill="currentColor" />
          </svg>

          {/* 4. Container Content & Medical Crest Seal */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Ornate Clinical Heritage Medallion SVG */}
            <div className="relative mb-3">
              <svg
                className="w-14 h-14 sm:w-16 sm:h-16 text-[#8a7250] drop-shadow-sm"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer decorative notched star ring */}
                <circle cx="32" cy="32" r="30" stroke="#D8C2A3" strokeWidth="1.25" strokeDasharray="3 3" />
                <circle cx="32" cy="32" r="26" fill="#FAF6F0" stroke="#C4A57B" strokeWidth="1" />
                
                {/* Laurel Leaves SVG Accents */}
                <path d="M 18 36 C 18 28 22 24 25 22 C 24 26 23 32 26 36" stroke="#8a7250" strokeWidth="1" fill="none" strokeLinecap="round" />
                <path d="M 46 36 C 46 28 42 24 39 22 C 40 26 41 32 38 36" stroke="#8a7250" strokeWidth="1" fill="none" strokeLinecap="round" />

                {/* Central Gold Star Motif */}
                <path
                  d="M32 18l3.2 7.7 8.3.7-6.3 5.5 1.9 8.1-7.1-4.3-7.1 4.3 1.9-8.1-6.3-5.5 8.3-.7z"
                  fill="#D4B726"
                  stroke="#8a7250"
                  strokeWidth="0.75"
                />
                <circle cx="32" cy="32" r="3" fill="#FFF8EB" />
              </svg>

              {/* Tiny Harley Street seal badge overlay */}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-stone-900 text-[#D8C2A3] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-[#D8C2A3]/50 shadow-xs whitespace-nowrap">
                GMC Registered
              </span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-stone-950 font-normal tracking-tight mb-2 mt-1">
              Share Your Clinical Experience
            </h3>
            
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-4 leading-relaxed font-light">
              Have you visited Age Reversal Clinics? Leave a verified Google review to help others seeking specialist dermatologist and aesthetic care.
            </p>

            {/* SVG Decorative Dividing Line with Diamond Ornament */}
            <div className="w-full max-w-xs mx-auto mb-5 flex items-center justify-center gap-3 opacity-70">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C4A57B] to-transparent" />
              <svg className="w-3 h-3 text-[#8a7250] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" />
              </svg>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C4A57B] to-transparent" />
            </div>

            {/* Google Review Primary Action Link */}
            <a
              href={CLINIC_INFO.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-stone-50 text-stone-950 border border-[#C4A57B] hover:border-stone-900 px-6 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer group"
            >
              {/* Google G icon */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.41 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 10.03 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.59 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Write a Google Review</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#8a7250] group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Subtle verification badge footer in SVG */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF6F0] border border-[#D8C2A3]/70 text-[#7a6242] text-[10px] sm:text-xs font-semibold mt-3.5 shadow-2xs">
              <Star className="w-3 h-3 fill-[#D4B726] text-[#D4B726]" />
              <span>Direct Verification Portal · Harley Street Clinic London</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Booking Banner - seamlessly flush with the footer video grid display */}
      <section className="w-full bg-gradient-to-r from-[#17171d] via-[#101014] to-[#0a0a0d] rounded-none px-4 py-8 sm:py-14 text-white text-center relative overflow-hidden border-t border-[#D8C2A3]/30 shadow-2xl mb-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D8C2A3]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h3 className="font-serif text-2xl sm:text-4xl text-white font-normal leading-tight">
            Begin Your Aesthetic Journey With Age Reversal
          </h3>
          <p className="text-white/70 text-xs sm:text-base font-light">
            Join thousands of satisfied patients across Europe. Reserve your private doctor consultation at our Harley Street or Devonshire Place clinics today.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {onBookClick && (
              <button
                type="button"
                onClick={() => onBookClick('Consultation from Reviews')}
                className="w-full sm:w-auto bg-gradient-to-r from-[#D8C2A3] to-[#c9ad88] text-black font-semibold text-sm px-8 py-3.5 rounded-full hover:brightness-105 transition-all shadow-lg cursor-pointer"
              >
                Book Private Consultation
              </button>
            )}
            <a
              href={CLINIC_INFO.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-all border border-white/20 cursor-pointer"
            >
              <span>Add a Google Review</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/70" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-all border border-white/20 cursor-pointer"
            >
              Return to Clinic Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ReviewsPageView;
