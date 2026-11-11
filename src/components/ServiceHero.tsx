import React from 'react';
import { ArrowLeft, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

import { TreatmentMediaItem } from '../types';
import ClinicImageWithPlaceholder from './common/ClinicImageWithPlaceholder';
import { cleanServiceImageUrl } from './treatments/treatmentData';

interface ServiceHeroProps {
  data: {
    id?: string;
    category: string;
    title: string;
    imageUrl: string;
    badgeText?: string;
    price?: string;
    heroMedia?: TreatmentMediaItem;
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

  const heroMedia = data.heroMedia;
  const heroMediaId = heroMedia?.id || `service-${data.id || 'default'}-hero`;
  const mediaUrl = cleanServiceImageUrl(heroMedia?.url) || cleanServiceImageUrl(data.imageUrl);
  const isVideo = Boolean(mediaUrl) && (heroMedia?.mediaType === 'video' || !!mediaUrl.match(/\.(mp4|webm|mov)(\?|$)/i));
  const altText = heroMedia?.altText || `${data.title} - Age Reversal Clinic London`;
  const seoTitle = heroMedia?.seoTitle || data.title;

  return (
    <section
      id="service-hero"
      data-media-id={heroMediaId}
      className="relative bg-white overflow-hidden min-h-0 md:min-h-[calc(100vh-100px)] flex items-center pt-16 pb-12 sm:pt-20 sm:pb-14 md:pt-24 md:pb-12 border-b border-silver-150"
    >
      {/* Mobile Full-bleed Background Image/Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden md:hidden z-0">
        {isVideo ? (
          <video
            className="w-full h-full object-cover object-center"
            src={mediaUrl}
            poster={heroMedia?.videoPoster}
            autoPlay={heroMedia?.autoPlay ?? true}
            loop={heroMedia?.loop ?? true}
            muted={heroMedia?.muted ?? true}
            playsInline
          />
        ) : (
          <ClinicImageWithPlaceholder
            src={mediaUrl}
            alt={altText}
            title={seoTitle}
            loading="eager"
            containerClassName="relative w-full h-full overflow-hidden bg-slate-900 flex items-center justify-center"
            className="w-full h-full object-cover object-center"
            logoSize="lg"
            referrerPolicy="no-referrer"
          />
        )}
        {/* Lighter gradient overlay for mobile text legibility without heavy black fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/35 pointer-events-none" />
      </div>

      {/* Breadcrumb Path */}
      <div className="absolute top-4 sm:top-6 left-4 md:left-8 z-30 flex flex-wrap items-center gap-y-1 text-[10px] sm:text-xs md:text-sm text-white/80 md:text-silver-400 font-sans tracking-wide leading-relaxed max-w-[calc(100%-2rem)]">
        <button onClick={onClose} className="text-white md:text-silver-700 hover:text-rose-gold md:hover:text-black transition-colors font-semibold cursor-pointer shrink-0">Home</button>
        <span className="mx-1 sm:mx-2 text-white/60 md:text-silver-300 shrink-0">&gt;</span>
        <span className="font-medium text-white/80 md:text-silver-500 shrink-0">{data.category}</span>
        <span className="mx-1 sm:mx-2 text-white/60 md:text-silver-300 shrink-0">&gt;</span>
        <span className="text-rose-gold font-bold break-words">{data.title}</span>
      </div>

      {/* Desktop Full-bleed Right Half Image/Video */}
      <div
        id={heroMediaId}
        data-media-id={heroMediaId}
        className="absolute top-0 right-0 w-1/2 h-full overflow-hidden hidden md:block z-0"
      >
        {isVideo ? (
          <video
            className="w-full h-full object-cover"
            src={mediaUrl}
            poster={heroMedia?.videoPoster}
            autoPlay={heroMedia?.autoPlay ?? true}
            loop={heroMedia?.loop ?? true}
            muted={heroMedia?.muted ?? true}
            playsInline
          />
        ) : (
          <ClinicImageWithPlaceholder
            src={mediaUrl}
            alt={altText}
            title={seoTitle}
            loading="eager"
            containerClassName="relative w-full h-full overflow-hidden bg-slate-50 flex items-center justify-center"
            className="w-full h-full object-cover transition-transform duration-10000 hover:scale-105"
            logoSize="lg"
            referrerPolicy="no-referrer"
          />
        )}
        {/* Subtle overlay for beautiful text blend and professional appearance */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent w-32 pointer-events-none" />
      </div>

      {/* Decorative background gradient on the left half (Desktop only) */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-silver-50/30 to-white pointer-events-none hidden md:block z-0" />

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 relative z-10 flex flex-col md:flex-row min-h-0 md:min-h-[calc(100vh-140px)] items-center gap-8 md:gap-12 pt-6 pb-2 md:py-8">
        
        {/* Left Column: Heading, Category, Call to action */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
          }}
          className="w-full md:w-1/2 flex flex-col justify-center max-w-xl relative z-10 text-left"
        >
          <motion.div 
            variants={textVariants} 
            className="inline-flex items-center space-x-2 bg-white/20 md:bg-silver-100 text-white md:text-silver-700 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider w-fit mb-4 md:mb-6 border border-white/20 md:border-transparent"
          >
            <span className="w-2 h-2 rounded-full bg-rose-gold animate-pulse" />
            <span>{data.category}</span>
          </motion.div>

          <motion.h1 
            variants={textVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white md:text-silver-900 leading-tight mb-3 sm:mb-4 md:mb-6 drop-shadow-md md:drop-shadow-none"
          >
            {data.title}
          </motion.h1>

          <motion.p 
            variants={textVariants}
            className="text-sm sm:text-base md:text-lg text-white/90 md:text-silver-600 mb-6 md:mb-8 leading-relaxed max-w-md font-normal md:font-medium drop-shadow-sm md:drop-shadow-none"
          >
            Experience the pinnacle of non-surgical rejuvenation. Our state-of-the-art clinical protocol is fully tailored to restore, elevate, and refine your skin architecture.
          </motion.p>

          <motion.div 
            variants={textVariants}
            className="mb-6 md:mb-8 flex items-center gap-3"
          >
            <div className="border-l-2 border-rose-gold pl-3 sm:pl-4">
              <span className="text-[9px] sm:text-[10px] font-extrabold text-white/70 md:text-silver-400 uppercase tracking-widest block">
                {data.badgeText || 'Clinical Excellence'}
              </span>
              <span className="text-base sm:text-lg font-semibold text-white md:text-silver-900">Starting from {data.price || '£150'}</span>
            </div>
          </motion.div>

          <motion.div 
            variants={textVariants}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <button
              onClick={handleBookClick}
              className="bg-white text-black md:bg-silver-900 md:text-white px-5 sm:px-8 py-3 sm:py-3.5 rounded-full md:rounded shadow hover:bg-silver-100 md:hover:bg-black transition-colors font-medium flex items-center space-x-2 text-xs sm:text-sm md:text-base group cursor-pointer"
              id="hero-book-btn"
            >
              <span>Book Appointment</span>
              <Calendar className="h-4 w-4 md:h-5 md:w-5 text-black md:text-silver-400 group-hover:scale-110 transition-transform" />
            </button>
            
            <button
              onClick={() => {
                const el = document.getElementById('clinical-details-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-black/40 backdrop-blur-md md:bg-white border border-white/30 md:border-silver-300 text-white md:text-silver-800 px-5 sm:px-8 py-3 sm:py-3.5 rounded-full md:rounded shadow-sm hover:bg-white/20 md:hover:bg-silver-50 transition-colors font-medium flex items-center space-x-2 group text-xs sm:text-sm md:text-base cursor-pointer"
              id="hero-explore-details-btn"
            >
              <span>Clinical Details</span>
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-white/80 md:text-silver-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
