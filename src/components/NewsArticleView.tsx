import React from 'react';
import { ArrowLeft, Calendar, User, ArrowRight, Link2, Linkedin, Facebook, Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import { Article } from '../types';
import ArticleContent from './ArticleContent';
import RelatedArticles from './RelatedArticles';
import { NEWS_ARTICLES, STORY_ARTICLES } from '../data';

interface NewsArticleProps {
  article: Article;
  onClose: () => void;
  onBookClick: () => void;
  onArticleClick: (article: Article) => void;
  onViewProfile: () => void;
}

export default function NewsArticleView({ article, onClose, onBookClick, onArticleClick, onViewProfile }: NewsArticleProps) {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
  };
  
  // Combine all articles to find related ones
  const allArticles = [...NEWS_ARTICLES, ...STORY_ARTICLES];

  return (
    <>
      <section className="relative bg-[#f8f9ff] overflow-hidden min-h-[calc(100vh-100px)] flex items-center pt-20 pb-0 md:pt-24 md:pb-12 border-b border-[#bfc8c8]/40">
      <div className="absolute top-6 left-4 md:left-8 z-30 flex items-center text-sm text-[#3f4849] font-sans tracking-wide">
        <button onClick={onClose} className="hover:text-[#003334] transition-colors font-semibold cursor-pointer">News</button>
        <span className="mx-2 text-[#bfc8c8]">&gt;</span>
        <span className="font-medium text-[#236963]">{article.tag || article.category}</span>
        <span className="mx-2 text-[#bfc8c8]">&gt;</span>
        <span className="text-[#003334] font-bold truncate max-w-[150px] sm:max-w-xs md:max-w-md">{article.title}</span>
      </div>

      {/* Desktop Full-bleed Right Half Image */}
      <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden hidden md:block z-0 bg-white">
        <img
          className="w-full h-full object-cover brightness-[0.96] contrast-[1.02] transition-transform duration-10000 hover:scale-105"
          src={article.image}
          alt={article.title}
          referrerPolicy="no-referrer"
        />
        {/* Subtle overlay for beautiful text blend and professional appearance */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9ff] via-[#f8f9ff]/50 to-transparent w-48 pointer-events-none" />
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      </div>

      {/* Decorative background gradient on the left half */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#e6eeff]/30 to-[#f8f9ff] pointer-events-none z-0" />

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
            className="inline-flex items-center space-x-2 bg-[#d9e3f6] text-[#003334] px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider w-fit mb-6 shadow-sm border border-[#bfc8c8]/30"
          >
            <span className="w-2 h-2 rounded-full bg-[#003334] animate-pulse" />
            <span>{article.tag || article.category}</span>
          </motion.div>

          <motion.h1 
            variants={textVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#003334] leading-tight mb-6"
          >
            {article.title}
          </motion.h1>

          <motion.div variants={textVariants} className="flex flex-wrap items-center gap-4 text-[#3f4849] font-sans text-sm mb-6 font-medium bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-[#bfc8c8]/30 w-fit">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#236963]" />
              {article.date}
            </span>
            <span className="text-[#bfc8c8]">|</span>
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-[#236963]" />
              {article.author}
            </span>
          </motion.div>

          <motion.p 
            variants={textVariants}
            className="text-base sm:text-lg text-[#3f4849] mb-8 leading-relaxed max-w-md"
          >
            {article.description}
          </motion.p>

          <motion.div 
            variants={textVariants}
            className="flex flex-wrap items-center gap-4 mb-10"
          >
            <button
              onClick={onBookClick}
              className="bg-[#003334] text-white px-8 py-3.5 rounded-xl shadow-md hover:bg-black transition-all font-medium flex items-center space-x-2 text-sm md:text-base group cursor-pointer hover:scale-[1.02]"
            >
              <span>Book Appointment</span>
              <Calendar className="h-5 w-5 text-white/70 group-hover:scale-110 transition-transform" />
            </button>
            
            <button
              onClick={onClose}
              className="bg-white border border-[#bfc8c8] text-[#3f4849] px-8 py-3.5 rounded-xl shadow-sm hover:bg-[#e6eeff]/60 hover:text-[#003334] transition-all font-medium flex items-center space-x-2 group text-sm md:text-base cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5 text-[#3f4849] group-hover:-translate-x-1 transition-transform" />
              <span>Back to News</span>
            </button>
          </motion.div>

          <motion.div
            variants={textVariants}
            className="flex flex-col gap-4 mt-2"
          >
            <span className="text-[#003334] font-medium text-lg font-sans">Share this post</span>
            <div className="flex items-center gap-3">
              <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:scale-110 active:scale-95 group">
                <Link2 className="w-5 h-5 text-black" strokeWidth={2.5} />
              </button>
              <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:scale-110 active:scale-95 group">
                <Linkedin className="w-5 h-5 text-black" strokeWidth={2.5} />
              </button>
              <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:scale-110 active:scale-95 group">
                <Facebook className="w-5 h-5 text-black" strokeWidth={2.5} />
              </button>
              <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:scale-110 active:scale-95 group">
                <Instagram className="w-5 h-5 text-black" strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile View Media - displays below text on small screens */}
        <div className="md:hidden mt-0 relative z-10 -mx-4 w-[calc(100%+2rem)]">
          <div className="relative aspect-[4/3] w-full overflow-hidden shadow-lg border-y border-[#bfc8c8]/50">
            <img
              className="w-full h-full object-cover brightness-[0.96] contrast-[1.02]"
              src={article.image}
              alt={article.title}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>
    <ArticleContent article={article} onViewProfile={onViewProfile} />
    <RelatedArticles currentArticle={article} onArticleClick={onArticleClick} articles={allArticles} />
    </>
  );
}
