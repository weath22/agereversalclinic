import React, { useState, useEffect } from 'react';
import { getLatestNewsConfig } from '../lib/adminStore';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BookOpen, Calendar, User } from 'lucide-react';
import { Article } from '../types';
import { NEWS_ARTICLES, STORY_ARTICLES } from '../data';

interface LatestNewsProps {
  onArticleClick?: (article: Article) => void;
}

export default function LatestNews({ onArticleClick }: LatestNewsProps = {}) {
  const [activeTab, setActiveTab] = useState<'news' | 'stories'>('news');
  const [config, setConfig] = useState(getLatestNewsConfig());

  useEffect(() => {
    setConfig(getLatestNewsConfig());
  }, []);

  const currentArticles = activeTab === 'news' ? NEWS_ARTICLES : STORY_ARTICLES;

  return (
    <section id="latest-news" className="bg-luxury-primary py-24 md:py-32 px-4 md:px-12 border-b border-luxury-border">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-light text-luxury-text mb-6 tracking-tight leading-tight">
            {config.heading}
          </h2>
          <p className="font-sans text-sm md:text-base text-luxury-subtext max-w-2xl mx-auto font-light leading-relaxed">
            {config.description}
          </p>
          <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-8" />
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-8 py-3 rounded-full font-sans font-normal tracking-wide text-sm transition-all duration-300 cursor-pointer ${
              activeTab === 'news'
                ? 'bg-black text-white shadow-md'
                : 'border border-luxury-border bg-luxury-card text-luxury-subtext hover:bg-luxury-secondary hover:text-luxury-text'
            }`}
          >
            News
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-8 py-3 rounded-full font-sans font-normal tracking-wide text-sm transition-all duration-300 cursor-pointer ${
              activeTab === 'stories'
                ? 'bg-black text-white shadow-md'
                : 'border border-luxury-border bg-luxury-card text-luxury-subtext hover:bg-luxury-secondary hover:text-luxury-text'
            }`}
          >
            Patient stories
          </button>
        </div>

        {/* Articles Grid with transition */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <AnimatePresence mode="wait">
            {currentArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                onClick={() => onArticleClick?.(article)}
                className="flex flex-col bg-luxury-card rounded-[24px] overflow-hidden border border-luxury-border shadow-[0_4px_40px_-10px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-luxury-chrome hover:-translate-y-1 transition-all duration-500 group cursor-pointer"
              >
                {/* Image Container */}
                <div className="aspect-[16/10] overflow-hidden bg-luxury-secondary relative">
                  <img
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    src={article.image}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  <div className="absolute top-5 left-5 bg-luxury-primary/95 backdrop-blur-sm text-luxury-text font-sans font-normal text-[10px] tracking-[0.15em] uppercase px-4 py-1.5 rounded-full shadow-sm border border-luxury-border">
                    {article.tag}
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 md:p-8 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-luxury-muted font-sans text-xs mb-4 font-light tracking-wide">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-luxury-gold" strokeWidth={1.5} />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-luxury-gold" strokeWidth={1.5} />
                        {article.author}
                      </span>
                    </div>

                    <h3 className="font-serif font-normal text-xl text-luxury-text mb-4 leading-snug group-hover:text-luxury-subtext transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="font-sans text-sm text-luxury-subtext font-light leading-relaxed mb-8">
                      {article.description}
                    </p>
                  </div>

                  {/* CTA button */}
                  <div className="pt-2">
                    <button className="bg-white border border-luxury-border text-luxury-text group-hover:bg-luxury-secondary px-6 py-2.5 rounded-full font-sans font-normal tracking-wide text-xs flex items-center gap-2 transition-all duration-300 w-fit cursor-pointer">
                      <span>Find out more</span>
                      <ArrowRight className="h-3.5 w-3.5 text-luxury-muted group-hover:translate-x-1 transition-transform duration-300" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Carousel Pagination */}
        <div className="flex items-center justify-center gap-6 pt-16">
          <button
            aria-label="Previous Page"
            className="w-12 h-12 flex items-center justify-center rounded-full border border-luxury-border text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text transition-colors duration-300 shrink-0 bg-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((pageNum) => (
              <button
                key={pageNum}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-sans text-sm transition-all duration-300 ${
                  pageNum === 1
                    ? 'bg-luxury-text text-luxury-primary font-normal'
                    : 'text-luxury-subtext hover:bg-luxury-card'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            aria-label="Next Page"
            className="w-12 h-12 flex items-center justify-center rounded-full border border-luxury-border text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text transition-colors duration-300 shrink-0 bg-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

      </div>
    </section>
  );
}
