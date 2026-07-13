import React from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';
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
    <section className="bg-[#f8f9ff] py-20 md:py-28 border-t border-[#bfc8c8]/40">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#003334] tracking-tight">Related Stories</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {related.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.1 }}
              onClick={() => onArticleClick(article)}
              className="flex flex-col bg-white rounded-xl overflow-hidden border border-[#bfc8c8]/50 shadow-[0_4px_12px_rgba(0,75,77,0.03)] hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              {/* Image Container */}
              <div className="aspect-[16/10] overflow-hidden bg-neutral-50 relative">
                <img
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  src={article.image}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#003334] font-sans font-bold text-[11px] tracking-wider uppercase px-3 py-1 rounded-full shadow-xs border border-white/20">
                  {article.tag || article.category}
                </div>
              </div>

              {/* Content Box */}
              <div className="p-6 md:p-7 flex flex-col flex-grow justify-between">
                <div>
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-[#3f4849] font-sans text-xs mb-3.5 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#236963]" />
                      {article.date}
                    </span>
                  </div>
                  
                  <h3 className="font-serif font-bold text-lg md:text-[20px] text-[#003334] mb-3 leading-snug group-hover:text-[#236963] transition-colors line-clamp-3">
                    {article.title}
                  </h3>
                </div>
                
                {/* CTA button */}
                <div className="pt-6">
                  <span className="text-[#236963] font-sans font-bold text-[13px] flex items-center gap-2 group-hover:gap-3 transition-all uppercase tracking-wide">
                    Read more <ArrowRight className="h-4 w-4" />
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
