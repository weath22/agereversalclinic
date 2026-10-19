import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { Article } from '../types';

interface RelatedArticlesProps {
  currentArticle: Article;
  onArticleClick: (article: Article) => void;
  articles: Article[];
}

export default function RelatedArticles({ currentArticle, onArticleClick, articles }: RelatedArticlesProps) {
  // Filter out current and take up to 3
  const related = articles.filter(a => a.id !== currentArticle.id).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-[#fbf8f3] via-[#f5ede1] to-[#faf7f2] py-10 sm:py-14 md:py-20 border-t border-[#D8C2A3]/40 relative overflow-hidden">
      {/* Soft Fade Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/15 to-white/40 backdrop-blur-[0.5px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 md:mb-10 gap-2">
          <div>
            <span className="text-[10px] sm:text-[11px] font-sans font-medium text-luxury-gold uppercase tracking-[0.24em] block mb-1">
              Curated Reading
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-luxury-text tracking-tight">
              Related Articles &amp; Stories
            </h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {related.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              onClick={() => onArticleClick(article)}
              className="flex flex-col bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden border border-[#e8dcc8] shadow-[0_4px_20px_-6px_rgba(216,194,163,0.3)] hover:shadow-xl hover:border-luxury-gold hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              {/* Image Container */}
              <div className="aspect-[16/9] sm:aspect-[16/10] overflow-hidden bg-neutral-100 relative">
                <img
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  src={article.image}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-luxury-text font-sans font-medium text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs border border-[#e8dcc8]">
                  {article.tag || article.category}
                </div>
              </div>

              {/* Content Box */}
              <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow justify-between">
                <div>
                  {/* Meta */}
                  <div className="flex items-center gap-2 text-luxury-muted font-sans text-[11px] sm:text-xs mb-2 font-normal">
                    <Calendar className="h-3.5 w-3.5 text-luxury-gold" strokeWidth={1.5} />
                    <span>{article.date}</span>
                  </div>
                  
                  <h3 className="font-serif font-normal text-base sm:text-lg text-luxury-text mb-3 leading-snug group-hover:text-luxury-subtext transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </div>
                
                {/* CTA button */}
                <div className="pt-2">
                  <span className="text-black font-sans font-medium text-xs flex items-center gap-1.5 group-hover:text-luxury-gold transition-all uppercase tracking-wider">
                    <span>Read story</span>
                    <ArrowRight className="h-3.5 w-3.5 text-luxury-gold group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
