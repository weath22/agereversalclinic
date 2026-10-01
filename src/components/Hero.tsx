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
            className="w-full h-full object-cover object-center brightness-[0.65]"
            src={heroConfig?.mediaUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC"}
            alt="Hero Background"
          />
        ) : (
          <video
            className="w-full h-full object-cover object-center brightness-[0.65]"
            src={heroConfig?.mediaUrl || "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-receiving-a-facial-treatment-40541-large.mp4"}
            autoPlay
            loop
            muted
            playsInline
          />
        )}
        {/* Dark overlay for mobile text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/60 pointer-events-none" />
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

      {/* Background Decorative Gradient on the left side (Desktop only) */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-luxury-primary pointer-events-none hidden md:block z-0" />
      
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
            className="text-[34px] sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] font-serif font-light text-white md:text-luxury-text leading-[1.15] md:leading-tight mt-4 sm:mt-6 md:mt-0 mb-4 sm:mb-6 md:mb-8 whitespace-pre-line drop-shadow-sm md:drop-shadow-none"
          >
            {heroConfig?.title ? heroConfig.title : <>Exceptional Results<br />with <span className="italic text-luxury-gold">Age Reversal</span></>}
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-white/90 md:text-luxury-subtext font-sans font-light mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-md drop-shadow-sm md:drop-shadow-none"
          >
            {heroConfig?.description || "Advanced dermatology care tailored to your unique skin. Where science meets compassion."}
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-10 md:mb-12"
          >
            <button
              onClick={onBookClick}
              className="bg-white text-black md:bg-black md:text-white px-6 sm:px-9 py-3.5 sm:py-4 rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 font-sans font-medium tracking-wide flex items-center space-x-2.5 text-sm sm:text-base group cursor-pointer shadow-md"
            >
              <span>Book Appointment</span>
              <Calendar className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-black md:text-luxury-chrome group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            </button>
            <button
              onClick={onExploreClick}
              className="bg-black/40 backdrop-blur-md md:bg-white border border-white/30 md:border-luxury-border text-white md:text-luxury-text px-6 sm:px-9 py-3.5 sm:py-4 rounded-full hover:bg-white/20 md:hover:bg-luxury-secondary transition-colors duration-300 font-sans font-medium tracking-wide flex items-center space-x-2.5 group text-sm sm:text-base cursor-pointer"
            >
              <span>Explore</span>
              <ArrowRight className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white/80 md:text-luxury-muted group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 border-t border-white/20 md:border-luxury-border pt-4 sm:pt-6 md:pt-10"
          >
            <div className="flex -space-x-3 sm:-space-x-4 shrink-0">
              <img 
                alt="Patient 1" 
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border-2 md:border-[3px] border-white/40 md:border-luxury-primary object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0sGBWhyvflKKvPKdNj9eTy54fC48-JeBgjZKNpiFsfm5GPsH22DxfzanRDBWS6t55bXcWKOjgOqIsqlmeaYRkXfOm_34vmiaqGCOiG6frIQ6lgsfQ1SK38rV8reNQxw2gaK5cbvht1BZL0sbw78SliDjayEPSBPV1ruNcJDL_3fTwp7tSkRliTiXkNU3NvSGLVZenP6kPpqYUALPaAIH5mXlF9ZEIx-MrSgU7Xj4QfBa6iA8A5U8mrOKjPAqIlH1NRfLek5EGyZL4"
              />
              <img 
                alt="Patient 2" 
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border-2 md:border-[3px] border-white/40 md:border-luxury-primary object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR"
              />
              <img 
                alt="Patient 3" 
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border-2 md:border-[3px] border-white/40 md:border-luxury-primary object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-sans font-medium text-white md:text-luxury-text mb-0.5 md:mb-1">Trusted by 10,000+ patients</p>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <div className="flex text-amber-400 space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 fill-current text-amber-400 md:text-silver-950" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-sans font-light text-white/80 md:text-luxury-subtext">4.9 (1,200+ reviews)</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
