import React from 'react';
import { ArrowLeft, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ServiceHeroProps {
  data: {
    category: string;
    title: string;
    imageUrl: string;
    price?: string;
  };
  onClose: () => void;
  onBook: (serviceName: string) => void;
}

export default function ServiceHero({ data, onClose, onBook }: ServiceHeroProps) {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
  };

  const handleBookClick = () => {
    onBook(data.title);
  };

  return (
    <section id="service-hero" className="relative bg-white overflow-hidden min-h-[calc(100vh-100px)] flex items-center pt-20 pb-0 md:pt-24 md:pb-12 border-b border-silver-150">
      <div className="absolute top-4 sm:top-6 left-4 md:left-8 z-30 flex flex-wrap items-center gap-y-1 text-[10px] sm:text-xs md:text-sm text-silver-400 font-sans tracking-wide leading-relaxed max-w-[calc(100%-2rem)]">
        <button onClick={onClose} className="hover:text-black transition-colors font-semibold cursor-pointer shrink-0">Home</button>
        <span className="mx-1 sm:mx-2 text-silver-300 shrink-0">&gt;</span>
        <span className="font-medium text-silver-500 shrink-0">{data.category}</span>
        <span className="mx-1 sm:mx-2 text-silver-300 shrink-0">&gt;</span>
        <span className="text-rose-gold font-bold break-words">{data.title}</span>
      </div>

      {/* Desktop Full-bleed Right Half Image */}
      <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden hidden md:block z-0">
        <img
          className="w-full h-full object-cover brightness-[0.96] contrast-[1.02] transition-transform duration-10000 hover:scale-105"
          src={data.imageUrl}
          alt={data.title}
          referrerPolicy="no-referrer"
        />
        {/* Subtle overlay for beautiful text blend and professional appearance */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent w-32 pointer-events-none" />
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      </div>

      {/* Decorative background gradient on the left half */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-silver-50/30 to-white pointer-events-none z-0" />

      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row min-h-[calc(100vh-140px)] items-center gap-12 pt-8 pb-0 md:py-8">
        
        {/* Left Column: Heading, Category, Call to action */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
          }}
          className="w-full md:w-1/2 flex flex-col justify-center max-w-xl relative z-10"
        >
          <motion.div 
            variants={textVariants} 
            className="inline-flex items-center space-x-2 bg-silver-100 text-silver-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider w-fit mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-rose-gold animate-pulse" />
            <span>{data.category}</span>
          </motion.div>

          <motion.h1 
            variants={textVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-silver-900 leading-tight mb-6 chrome-text"
          >
            {data.title}
          </motion.h1>

          <motion.p 
            variants={textVariants}
            className="text-base sm:text-lg text-silver-600 mb-8 leading-relaxed max-w-md font-medium"
          >
            Experience the pinnacle of non-surgical rejuvenation. Our state-of-the-art clinical protocol is fully tailored to restore, elevate, and refine your skin architecture.
          </motion.p>

          <motion.div 
            variants={textVariants}
            className="mb-8 flex items-center gap-3"
          >
            <div className="border-l-2 border-rose-gold pl-4">
              <span className="text-[10px] font-extrabold text-silver-400 uppercase tracking-widest block">Clinical Excellence</span>
              <span className="text-lg font-semibold text-silver-900">Starting from {data.price || '$150'}</span>
            </div>
          </motion.div>

          <motion.div 
            variants={textVariants}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={handleBookClick}
              className="bg-silver-900 text-white px-8 py-3.5 rounded shadow hover:bg-black transition-colors font-medium flex items-center space-x-2 text-sm md:text-base group cursor-pointer"
              id="hero-book-btn"
            >
              <span>Book Appointment</span>
              <Calendar className="h-5 w-5 text-silver-400 group-hover:scale-110 transition-transform" />
            </button>
            
            <button
              onClick={() => {
                const el = document.getElementById('clinical-details-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white border border-silver-300 text-silver-800 px-8 py-3.5 rounded shadow-sm hover:bg-silver-50 transition-colors font-medium flex items-center space-x-2 group text-sm md:text-base cursor-pointer"
              id="hero-explore-details-btn"
            >
              <span>Clinical Details</span>
              <ArrowRight className="h-5 w-5 text-silver-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>

        {/* Mobile View Media - displays below text on small screens */}
        <div className="md:hidden mt-0 relative z-10 -mx-4 w-[calc(100%+2rem)]">
          <div className="relative aspect-video w-full overflow-hidden shadow-lg border-y border-silver-200">
            <img
              className="w-full h-full object-cover brightness-[0.96] contrast-[1.02]"
              src={data.imageUrl}
              alt={data.title}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
