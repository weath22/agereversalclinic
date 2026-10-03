import React, { useEffect, useRef } from 'react';
import { ArrowRight, Calendar, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { HeroConfig } from '../types';

interface HeroProps {
  onBookClick: () => void;
  onExploreClick: () => void;
  heroConfig?: HeroConfig;
}

export default function Hero({ onBookClick, onExploreClick, heroConfig }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      const videos = sectionRef.current.querySelectorAll('video');
      videos.forEach(video => {
        video.playbackRate = 0.5;
      });
    }
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
    }
  };

  const imgVariants = {
    hidden: { opacity: 0, scale: 0.95, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' as const }
    }
  };

  return (
    <section id="home" ref={sectionRef} className="relative bg-luxury-primary overflow-hidden min-h-0 md:min-h-[calc(100vh-140px)] flex items-center py-8 sm:py-12 md:pt-6 md:pb-16 border-b border-luxury-border">
      {/* Mobile Full-bleed Background Media */}
      <div className="absolute inset-0 w-full h-full overflow-hidden md:hidden z-0">
        {(heroConfig?.mediaType || 'video') === 'image' ? (
          <img
            className="w-full h-full object-cover object-center brightness-100 contrast-[1.02] opacity-85"
            src={heroConfig?.mediaUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC"}
            alt="Hero Background"
          />
        ) : (
          <video
            className="w-full h-full object-cover object-center brightness-100 contrast-[1.02] opacity-85"
            src={heroConfig?.mediaUrl || "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-receiving-a-facial-treatment-40541-large.mp4"}
            autoPlay
            loop
            muted
            playsInline
          />
        )}
        {/* Subtle, Reduced White Fade Overlay (Matching SpecialistAreas & Treatments) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/40 backdrop-blur-[0.5px] pointer-events-none" />

        {/* Ambient Light Blooms for Luxury Depth */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[480px] h-[320px] bg-gradient-to-b from-[#D8C2A3]/25 via-[#ecdcc8]/15 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-2 -left-10 w-[280px] h-[280px] bg-[#ecdcc8]/20 rounded-full blur-2xl" />
        </div>
      </div>

      {/* Desktop Full-bleed Right Half Slow-motion Media */}
      <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden hidden md:block z-0">
        {(heroConfig?.mediaType || 'video') === 'image' ? (
          <img
            className="w-full h-full object-cover"
            src={heroConfig?.mediaUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC"}
            alt="Hero Background"
          />
        ) : (
          <video
            className="w-full h-full object-cover"
            src={heroConfig?.mediaUrl || "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-receiving-a-facial-treatment-40541-large.mp4"}
            autoPlay
            loop
            muted
            playsInline
          />
        )}
        {/* Crisp subtle dark overlay for text readability and high-end feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary via-transparent to-transparent w-48 pointer-events-none" />
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      </div>

      {/* Background Decorative Elements on the left side (Desktop only) */}
      <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden pointer-events-none hidden md:block z-0 select-none">
        {/* Soft Warm Champagne & Gold Ambient Glows */}
        <div className="absolute -top-20 -left-20 w-[540px] h-[540px] bg-gradient-to-br from-[#D8C2A3]/22 via-[#ecdcc8]/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-10 w-[420px] h-[420px] bg-gradient-to-tr from-[#fbf8f3] via-[#D8C2A3]/15 to-transparent rounded-full blur-2xl" />
        <div className="absolute -bottom-16 left-1/3 w-[360px] h-[360px] bg-[#ecdcc8]/20 rounded-full blur-3xl" />

        {/* Precision Fine Line Art SVG (Contour Mapping, Concentric Golden Arcs, Luxury Crosshairs & Watermark) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-70"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 700 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="heroGoldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D8C2A3" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#C5A880" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D8C2A3" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="heroVerticalLine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D8C2A3" stopOpacity="0.05" />
              <stop offset="25%" stopColor="#D8C2A3" stopOpacity="0.35" />
              <stop offset="75%" stopColor="#C5A880" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#D8C2A3" stopOpacity="0.05" />
            </linearGradient>
            <pattern id="heroMicroGrid" width="48" height="48" patternUnits="userSpaceOnUse">
              <circle cx="24" cy="24" r="1.2" fill="#C5A880" fillOpacity="0.18" />
            </pattern>
          </defs>

          {/* Micro dot matrix pattern across the left quadrant */}
          <rect width="100%" height="100%" fill="url(#heroMicroGrid)" />

          {/* Vertical Architectural Pinstripe Lines */}
          <line x1="84" y1="0" x2="84" y2="800" stroke="url(#heroVerticalLine)" strokeWidth="1" />
          <line x1="280" y1="0" x2="280" y2="800" stroke="url(#heroVerticalLine)" strokeWidth="1" strokeDasharray="4 6" />
          <line x1="520" y1="0" x2="520" y2="800" stroke="url(#heroVerticalLine)" strokeWidth="1" strokeOpacity="0.4" />

          {/* Golden Ratio & Facial Contour Concentric Arcs */}
          <g transform="translate(140, 240)">
            <circle cx="0" cy="0" r="110" fill="none" stroke="url(#heroGoldStroke)" strokeWidth="1" strokeDasharray="3 6" />
            <circle cx="0" cy="0" r="210" fill="none" stroke="url(#heroGoldStroke)" strokeWidth="1" strokeOpacity="0.55" />
            <circle cx="0" cy="0" r="330" fill="none" stroke="url(#heroGoldStroke)" strokeWidth="1" strokeDasharray="6 8" strokeOpacity="0.35" />
            <circle cx="0" cy="0" r="450" fill="none" stroke="url(#heroGoldStroke)" strokeWidth="1" strokeOpacity="0.2" />

            {/* Subtle Crosshairs & Coordinates at Center Pivot */}
            <g stroke="#C5A880" strokeWidth="1" strokeOpacity="0.5">
              <line x1="-14" y1="0" x2="14" y2="0" />
              <line x1="0" y1="-14" x2="0" y2="14" />
              <circle cx="0" cy="0" r="3.5" fill="#D8C2A3" fillOpacity="0.6" stroke="none" />
            </g>

            {/* Luxury Diamond Emblem Watermark */}
            <path
              d="M 0,-26 L 7,-7 L 26,0 L 7,7 L 0,26 L -7,7 L -26,0 L -7,-7 Z"
              fill="none"
              stroke="#D8C2A3"
              strokeWidth="1.2"
              strokeOpacity="0.4"
            />
          </g>

          {/* Secondary Facial Contour Mapping Flow Waves */}
          <path
            d="M -40,540 C 130,470 250,610 460,530 C 580,480 640,550 740,500"
            fill="none"
            stroke="url(#heroGoldStroke)"
            strokeWidth="1.2"
            strokeDasharray="3 5"
            opacity="0.6"
          />
          <path
            d="M -40,580 C 150,510 270,650 480,570 C 600,520 660,590 760,540"
            fill="none"
            stroke="url(#heroGoldStroke)"
            strokeWidth="1"
            opacity="0.35"
          />

          {/* Precision Clinical Registration Crosshairs (+) */}
          <g transform="translate(84, 150)" stroke="#C5A880" strokeWidth="1" strokeOpacity="0.45">
            <line x1="-6" y1="0" x2="6" y2="0" />
            <line x1="0" y1="-6" x2="0" y2="6" />
          </g>
          <g transform="translate(84, 520)" stroke="#C5A880" strokeWidth="1" strokeOpacity="0.45">
            <line x1="-6" y1="0" x2="6" y2="0" />
            <line x1="0" y1="-6" x2="0" y2="6" />
          </g>
          <g transform="translate(280, 670)" stroke="#C5A880" strokeWidth="1" strokeOpacity="0.45">
            <line x1="-6" y1="0" x2="6" y2="0" />
            <line x1="0" y1="-6" x2="0" y2="6" />
          </g>
          <g transform="translate(520, 180)" stroke="#C5A880" strokeWidth="1" strokeOpacity="0.35">
            <line x1="-6" y1="0" x2="6" y2="0" />
            <line x1="0" y1="-6" x2="0" y2="6" />
          </g>
        </svg>

        {/* Right-edge soft gradient feathering for seamless transition to center video */}
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-luxury-primary pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row min-h-0 md:min-h-[calc(100vh-140px)] items-center gap-6 md:gap-12 py-2 md:py-4">
        
        {/* Left Column: Heading and Description */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-1/2 flex flex-col justify-center max-w-xl relative z-10 text-left"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-[34px] sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] font-serif font-light text-luxury-text leading-[1.15] md:leading-tight mt-4 sm:mt-6 md:mt-0 mb-4 sm:mb-6 md:mb-8 whitespace-pre-line"
          >
            {heroConfig?.title ? heroConfig.title : <>Exceptional Results<br />with <span className="italic text-luxury-gold">Age Reversal</span></>}
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-luxury-subtext font-sans font-light mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-md"
          >
            {heroConfig?.description || "Advanced dermatology care tailored to your unique skin. Where science meets compassion."}
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-10 md:mb-12"
          >
            <button
              onClick={onBookClick}
              className="bg-black hover:bg-neutral-900 text-white px-7 sm:px-9 py-3.5 sm:py-4 rounded-full border border-luxury-gold/50 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-sans font-medium tracking-wide flex items-center space-x-2.5 text-sm sm:text-base group cursor-pointer"
            >
              <span>Book Appointment</span>
              <Calendar className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-luxury-gold group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            </button>
            <button
              onClick={onExploreClick}
              className="bg-white/95 backdrop-blur-md border border-luxury-border hover:border-luxury-gold/60 text-luxury-text px-7 sm:px-9 py-3.5 sm:py-4 rounded-full hover:bg-luxury-secondary hover:-translate-y-0.5 transition-all duration-300 font-sans font-medium tracking-wide flex items-center space-x-2.5 group text-sm sm:text-base cursor-pointer shadow-xs"
            >
              <span>Explore</span>
              <ArrowRight className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-luxury-muted group-hover:text-luxury-gold group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
            </button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 border-t border-luxury-border/80 pt-4 sm:pt-6 md:pt-10"
          >
            <div className="flex -space-x-3 sm:-space-x-4 shrink-0">
              <img 
                alt="Patient 1" 
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border-2 md:border-[3px] border-white shadow-xs object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0sGBWhyvflKKvPKdNj9eTy54fC48-JeBgjZKNpiFsfm5GPsH22DxfzanRDBWS6t55bXcWKOjgOqIsqlmeaYRkXfOm_34vmiaqGCOiG6frIQ6lgsfQ1SK38rV8reNQxw2gaK5cbvht1BZL0sbw78SliDjayEPSBPV1ruNcJDL_3fTwp7tSkRliTiXkNU3NvSGLVZenP6kPpqYUALPaAIH5mXlF9ZEIx-MrSgU7Xj4QfBa6iA8A5U8mrOKjPAqIlH1NRfLek5EGyZL4"
              />
              <img 
                alt="Patient 2" 
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border-2 md:border-[3px] border-white shadow-xs object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR"
              />
              <img 
                alt="Patient 3" 
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border-2 md:border-[3px] border-white shadow-xs object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-sans font-medium text-luxury-text mb-0.5 md:mb-1">Trusted by 10,000+ patients</p>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <div className="flex text-luxury-gold space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 fill-luxury-gold text-luxury-gold" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-sans font-light text-luxury-subtext">4.9 (1,200+ reviews)</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
