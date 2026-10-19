import React, { useState, useEffect } from 'react';
import { getLatestNewsConfig } from '../lib/adminStore';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Article } from '../types';
import { NEWS_ARTICLES, STORY_ARTICLES } from '../data';
import Pagination from './Pagination';

interface LatestNewsProps {
  onArticleClick?: (article: Article) => void;
}

export default function LatestNews({ onArticleClick }: LatestNewsProps = {}) {
  const [activeTab, setActiveTab] = useState<'news' | 'stories'>('news');
  const [config, setConfig] = useState(getLatestNewsConfig());
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setConfig(getLatestNewsConfig());
  }, []);

  const currentArticles = activeTab === 'news' ? NEWS_ARTICLES : STORY_ARTICLES;

  return (
    <section id="latest-news" className="py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-[#fbf8f3] via-[#f4ebe1] to-[#faf6f0] text-luxury-text border-b border-[#D8C2A3]/40 overflow-hidden relative selection:bg-[#D8C2A3]/30">
      {/* Soft Fade Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-white/45 backdrop-blur-[0.5px] pointer-events-none" />

      {/* Luminous Champagne Ambient Light Blooms */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[950px] h-[550px] bg-gradient-to-b from-[#D8C2A3]/30 via-[#ecdcc8]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-20 w-[550px] h-[550px] bg-[#ecdcc8]/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-[#e4d2bc]/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <span className="text-[11px] font-sans font-medium text-luxury-gold uppercase tracking-[0.28em] block mb-3">
            Journal &amp; Insights
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-light text-luxury-text mb-3 sm:mb-6 tracking-tight leading-tight">
            {config.heading}
          </h2>
          <p className="font-sans text-xs sm:text-sm md:text-base text-luxury-subtext max-w-2xl mx-auto font-light leading-relaxed px-2">
            {config.description}
          </p>
          <div className="w-12 sm:w-16 h-[1.5px] bg-luxury-gold mx-auto mt-4 sm:mt-6 md:mt-8" />
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-2.5 sm:gap-4 mb-8 sm:mb-12 md:mb-16">
          <button
            onClick={() => {
              setActiveTab('news');
              setCurrentPage(1);
            }}
            className={`px-5 py-2 sm:px-8 sm:py-3 rounded-full font-sans font-medium tracking-wide text-xs sm:text-sm transition-all duration-300 cursor-pointer shadow-xs ${
              activeTab === 'news'
                ? 'bg-black text-white shadow-md'
                : 'border border-[#D8C2A3]/50 bg-white/85 backdrop-blur-sm text-luxury-subtext hover:bg-white hover:text-luxury-text'
            }`}
          >
            News
          </button>
          <button
            onClick={() => {
              setActiveTab('stories');
              setCurrentPage(1);
            }}
            className={`px-5 py-2 sm:px-8 sm:py-3 rounded-full font-sans font-medium tracking-wide text-xs sm:text-sm transition-all duration-300 cursor-pointer shadow-xs ${
              activeTab === 'stories'
                ? 'bg-black text-white shadow-md'
                : 'border border-[#D8C2A3]/50 bg-white/85 backdrop-blur-sm text-luxury-subtext hover:bg-white hover:text-luxury-text'
            }`}
          >
            Patient stories
          </button>
        </div>

        {/* Articles Grid with transition */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          <AnimatePresence mode="wait">
            {currentArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
                onClick={() => onArticleClick?.(article)}
                className="flex flex-col bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-[22px] md:rounded-[24px] overflow-hidden border border-[#e8dcc8] shadow-[0_8px_30px_-8px_rgba(216,194,163,0.3)] hover:shadow-xl hover:border-luxury-gold hover:-translate-y-1 transition-all duration-500 group cursor-pointer"
              >
                {/* Image Container */}
                <div className="aspect-[16/9] sm:aspect-[16/10] overflow-hidden bg-[#faf7f2] relative">
                  <img
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    src={article.image}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-5 md:left-5 bg-white/95 backdrop-blur-sm text-luxury-text font-sans font-medium text-[9px] sm:text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-xs border border-[#e8dcc8]">
                    {article.tag}
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Meta */}
                    <div className="flex items-center gap-3 sm:gap-4 text-luxury-muted font-sans text-[11px] sm:text-xs mb-2.5 sm:mb-4 font-normal tracking-wide">
                      <span className="flex items-center gap-1 sm:gap-1.5">
                        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-luxury-gold" strokeWidth={1.75} />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1 sm:gap-1.5">
                        <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-luxury-gold" strokeWidth={1.75} />
                        {article.author}
                      </span>
                    </div>

                    <h3 className="font-serif font-normal text-base sm:text-lg md:text-xl text-luxury-text mb-3 sm:mb-4 leading-snug group-hover:text-luxury-subtext transition-colors duration-300 line-clamp-2 md:line-clamp-none">
                      {article.title}
                    </h3>
                  </div>

                  {/* CTA button */}
                  <div className="pt-1 sm:pt-2">
                    <button className="bg-black text-white hover:bg-neutral-900 border border-luxury-gold/40 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-sans font-medium tracking-wide text-[11px] sm:text-xs flex items-center gap-1.5 sm:gap-2 transition-all duration-300 w-fit cursor-pointer shadow-xs">
                      <span>Find out more</span>
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-luxury-gold group-hover:translate-x-1 transition-transform duration-300" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Global Pagination Component */}
        <div className="pt-8 sm:pt-12 md:pt-16 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={3}
            onPageChange={setCurrentPage}
          />
        </div>

      </div>
    </section>
  );
}
