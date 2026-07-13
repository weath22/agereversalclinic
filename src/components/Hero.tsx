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
    <section id="home" ref={sectionRef} className="relative bg-luxury-primary overflow-hidden min-h-[calc(100vh-140px)] flex items-center pt-4 pb-0 md:pt-6 md:pb-16 border-b border-luxury-border">
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

      {/* Background Decorative Gradient on the left side */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-luxury-primary pointer-events-none z-0" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row min-h-[calc(100vh-140px)] items-center gap-12 pt-2 pb-0 md:pt-1 md:pb-4">
        
        {/* Left Column: Heading and Description */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-1/2 flex flex-col justify-center max-w-xl relative z-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-luxury-secondary border border-luxury-border/50 text-luxury-muted px-4 py-2 rounded-full text-[10px] sm:text-xs font-sans uppercase tracking-[0.15em] w-fit mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
            <span>{heroConfig?.badge || "Expert Care. Advanced Solutions."}</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-luxury-text leading-tight mb-8 whitespace-pre-line"
          >
            {heroConfig?.title ? heroConfig.title : <>Exceptional Results<br />with <span className="italic text-luxury-gold">Age Reversal</span></>}
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-luxury-subtext font-sans font-light mb-10 leading-relaxed max-w-md"
          >
            {heroConfig?.description || "Advanced dermatology care tailored to your unique skin. Where science meets compassion."}
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 mb-8 sm:mb-12"
          >
            <button
              onClick={onBookClick}
              className="bg-black text-white px-8 py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 font-sans font-normal tracking-wide flex items-center space-x-2 text-sm md:text-base group"
            >
              <span>Book Appointment</span>
              <Calendar className="h-4 w-4 text-luxury-chrome group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            </button>
            <button
              onClick={onExploreClick}
              className="bg-white border border-luxury-border text-luxury-text px-8 py-3.5 rounded-full hover:bg-luxury-secondary transition-colors duration-300 font-sans font-normal tracking-wide flex items-center space-x-2 group text-sm md:text-base"
            >
              <span>Explore Services</span>
              <ArrowRight className="h-4 w-4 text-luxury-muted group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-t border-luxury-border pt-6 sm:pt-10"
          >
            <div className="flex -space-x-4 shrink-0">
              <img 
                alt="Patient 1" 
                className="w-12 h-12 rounded-full border-[3px] border-luxury-primary object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0sGBWhyvflKKvPKdNj9eTy54fC48-JeBgjZKNpiFsfm5GPsH22DxfzanRDBWS6t55bXcWKOjgOqIsqlmeaYRkXfOm_34vmiaqGCOiG6frIQ6lgsfQ1SK38rV8reNQxw2gaK5cbvht1BZL0sbw78SliDjayEPSBPV1ruNcJDL_3fTwp7tSkRliTiXkNU3NvSGLVZenP6kPpqYUALPaAIH5mXlF9ZEIx-MrSgU7Xj4QfBa6iA8A5U8mrOKjPAqIlH1NRfLek5EGyZL4"
              />
              <img 
                alt="Patient 2" 
                className="w-12 h-12 rounded-full border-[3px] border-luxury-primary object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR"
              />
              <img 
                alt="Patient 3" 
                className="w-12 h-12 rounded-full border-[3px] border-luxury-primary object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-sans font-normal text-luxury-text mb-1">Trusted by 10,000+ patients</p>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex text-amber-400 space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current text-silver-950" />
                  ))}
                </div>
                <span className="text-sm font-sans font-light text-luxury-subtext">4.9 (1,200+ reviews)</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile View Media: Shows on small screens below the text, spanning full width */}
        <div className="md:hidden mt-4 relative z-10 -mx-4 w-[calc(100%+2rem)]">
          <motion.div 
            variants={imgVariants}
            initial="hidden"
            animate="visible"
            className="relative aspect-video w-full overflow-hidden"
          >
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
          </motion.div>
        </div>

      </div>
    </section>
  );
}
