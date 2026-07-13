import React from 'react';
import { ArrowLeft, Calendar, Star, Shield, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { ProfilePageConfig } from '../types';

interface ProfileHeroProps {
  authorName: string;
  onClose: () => void;
  onBookClick: () => void;
  config: ProfilePageConfig;
}

export default function ProfileHero({ authorName, onClose, onBookClick, config }: ProfileHeroProps) {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
  };

  const {
    roleTag = 'Lead Consultant',
    specialtySubtitle = 'Specialist in Regenerative Aesthetics & Dermatology',
    photoUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2v_Qy0F12eTq307-F4t22D5-5B2vF5W5vE9p6hB9aJ6pU2yH6eZ5f-L6r3q8c9U4F8C9zK2L2eJ7qH1a_P8X9sE8hR2W8B1c2Q7K9wM7cR3X2Y7J3vL2D4aH5Y6R4W5F6E3B8D9H4F2K5M9J2P3L9Y8X7P3H6K7N8B2',
    experienceYears = '15+ Years Experience',
    gmcStatus = 'GMC Registered',
    awardStatus = 'Award Winning'
  } = config || {};

  return (
    <section className="relative bg-[#f8f9ff] overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 border-b border-[#bfc8c8]/40">
      <div className="absolute top-6 left-4 md:left-8 z-30 flex items-center text-sm text-[#3f4849] font-sans tracking-wide">
        <button onClick={onClose} className="hover:text-[#003334] transition-colors font-semibold cursor-pointer flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="flex-1 text-center lg:text-left"
        >
          {roleTag && (
            <motion.div variants={textVariants} className="inline-flex items-center space-x-2 bg-[#d9e3f6] text-[#003334] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-[#bfc8c8]/30">
              {roleTag}
            </motion.div>
          )}
          <motion.h1 variants={textVariants} className="text-4xl md:text-5xl font-serif font-bold text-[#003334] mb-3">
            {authorName}
          </motion.h1>
          {specialtySubtitle && (
            <motion.h2 variants={textVariants} className="text-xl text-[#236963] font-sans font-medium mb-6">
              {specialtySubtitle}
            </motion.h2>
          )}

          <motion.div variants={textVariants} className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
            {experienceYears && (
              <div className="flex items-center gap-2 text-[#3f4849] font-medium text-sm bg-white px-4 py-2 rounded-lg shadow-sm border border-[#bfc8c8]/30">
                <Star className="w-4 h-4 text-rose-gold" />
                <span>{experienceYears}</span>
              </div>
            )}
            {gmcStatus && (
              <div className="flex items-center gap-2 text-[#3f4849] font-medium text-sm bg-white px-4 py-2 rounded-lg shadow-sm border border-[#bfc8c8]/30">
                <Shield className="w-4 h-4 text-rose-gold" />
                <span>{gmcStatus}</span>
              </div>
            )}
            {awardStatus && (
              <div className="flex items-center gap-2 text-[#3f4849] font-medium text-sm bg-white px-4 py-2 rounded-lg shadow-sm border border-[#bfc8c8]/30">
                <Award className="w-4 h-4 text-rose-gold" />
                <span>{awardStatus}</span>
              </div>
            )}
          </motion.div>

          <motion.div variants={textVariants}>
            <button
              onClick={onBookClick}
              className="bg-[#003334] text-white px-8 py-3.5 rounded-xl shadow-md hover:bg-black transition-all font-medium flex items-center space-x-2 text-sm md:text-base group cursor-pointer hover:scale-[1.02] mx-auto lg:mx-0"
            >
              <span>Book Consultation</span>
              <Calendar className="h-5 w-5 text-white/70 group-hover:scale-110 transition-transform" />
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[320px] lg:max-w-[400px] aspect-square rounded-3xl overflow-hidden shrink-0 border-8 border-white shadow-xl mx-auto lg:mx-0"
        >
          <img 
            src={photoUrl} 
            alt={authorName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>
    </section>
  );
}
