import React, { useState, useEffect, useCallback } from 'react';
import {
  getPaginatedBlogPosts,
  fetchPaginatedBlogPosts,
  getBlogPostByIdOrSlug,
  projectBlogPostCardSummary,
} from '../lib/adminStore';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Article, BlogCardSummary } from '../types';
import { NEWS_ARTICLES, STORY_ARTICLES } from '../data';
import Pagination from './Pagination';
import LogoOutlineSkeleton from './LogoOutlineSkeleton';

interface LatestNewsProps {
  onArticleClick?: (article: Article) => void;
}

const PUBLIC_POSTS_PER_PAGE = 6;

function ArticleCoverMedia({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [hasError, setHasError] = useState(false);
  const cleanSrc = (src || '').trim();

  useEffect(() => {
    setHasError(false);
  }, [cleanSrc]);

  if (!cleanSrc || hasError) {
    return (
      <div className="w-full h-full bg-[#faf7f2] flex items-center justify-center">
        <LogoOutlineSkeleton size="sm" showLabel={false} className="w-full h-full border-0" />
      </div>
    );
  }

  return (
    <img
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
      src={cleanSrc}
      referrerPolicy="no-referrer"
    />
  );
}

export default function LatestNews({ onArticleClick }: LatestNewsProps = {}) {
  const [activeTab, setActiveTab] = useState<'news' | 'stories'>('news');
  const [currentPage, setCurrentPage] = useState(1);

  const getFallbackCards = useCallback(
    (tab: 'news' | 'stories', pageNum: number): BlogCardSummary[] => {
      const source = tab === 'news' ? NEWS_ARTICLES : STORY_ARTICLES;
      const offset = (pageNum - 1) * PUBLIC_POSTS_PER_PAGE;
      return source
        .filter((a) => a.status !== 'draft')
        .slice(offset, offset + PUBLIC_POSTS_PER_PAGE)
        .map(projectBlogPostCardSummary);
    },
    []
  );

  const initialPaginated = getPaginatedBlogPosts({
    type: 'news',
    status: 'published',
    page: 1,
    limit: PUBLIC_POSTS_PER_PAGE,
    sort: 'newest',
  });

  const [cards, setCards] = useState<BlogCardSummary[]>(() =>
    initialPaginated.items.length > 0 ? initialPaginated.items : getFallbackCards('news', 1)
  );
  const [totalPages, setTotalPages] = useState<number>(
    Math.max(1, initialPaginated.totalPages || 1)
  );
  const [heading, setHeading] = useState<string>(
    initialPaginated.heading || 'Latest News & Insights'
  );
  const [description, setDescription] = useState<string>(
    initialPaginated.description || 'Stay informed on the latest clinical advancements.'
  );

  const loadPublishedPage = useCallback(async () => {
    // Immediate local projection first for zero layout shift
    const localRes = getPaginatedBlogPosts({
      type: activeTab,
      status: 'published',
      page: currentPage,
      limit: PUBLIC_POSTS_PER_PAGE,
      sort: 'newest',
    });

    if (localRes.items.length > 0) {
      setCards(localRes.items);
      setTotalPages(Math.max(1, localRes.totalPages));
    } else {
      setCards(getFallbackCards(activeTab, currentPage));
      setTotalPages(1);
    }
    if (localRes.heading) setHeading(localRes.heading);
    if (localRes.description) setDescription(localRes.description);

    // Sync with remote paginated endpoint (returns only projected BlogCardSummary columns)
    const remoteRes = await fetchPaginatedBlogPosts({
      type: activeTab,
      status: 'published',
      page: currentPage,
      limit: PUBLIC_POSTS_PER_PAGE,
      sort: 'newest',
    });
    if (remoteRes && Array.isArray(remoteRes.items)) {
      setCards(remoteRes.items);
      setTotalPages(Math.max(1, remoteRes.totalPages || 1));
      if (remoteRes.heading) setHeading(remoteRes.heading);
      if (remoteRes.description) setDescription(remoteRes.description);
    }
  }, [activeTab, currentPage, getFallbackCards]);

  useEffect(() => {
    loadPublishedPage();
  }, [loadPublishedPage]);

  useEffect(() => {
    const handleUpdated = () => {
      loadPublishedPage();
    };
    window.addEventListener('blog_posts_updated', handleUpdated);
    window.addEventListener('storage', handleUpdated);
    return () => {
      window.removeEventListener('blog_posts_updated', handleUpdated);
      window.removeEventListener('storage', handleUpdated);
    };
  }, [loadPublishedPage]);

  const handleCardSelect = (card: BlogCardSummary) => {
    if (!onArticleClick) return;
    const fullLocal =
      getBlogPostByIdOrSlug(card.id) ||
      [...NEWS_ARTICLES, ...STORY_ARTICLES].find((a) => a.id === card.id);
    if (fullLocal) {
      onArticleClick(fullLocal);
    } else {
      onArticleClick({
        id: card.id,
        slug: card.slug,
        title: card.title,
        description: card.description,
        image: card.image,
        imageAlt: card.imageAlt,
        date: card.date,
        publishedAt: card.publishedAt,
        updatedAt: card.updatedAt,
        author: card.author,
        readingTime: card.readingTime,
        tag: card.tag,
        category: card.category,
        type: card.type,
        status: card.status,
      });
    }
  };

  const displayedCards =
    cards.length > 0 ? cards : getFallbackCards(activeTab, currentPage);

  return (
    <section
      id="latest-news"
      className="py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-[#fbf8f3] via-[#f4ebe1] to-[#faf6f0] text-luxury-text border-b border-[#D8C2A3]/40 overflow-hidden relative selection:bg-[#D8C2A3]/30 isolate"
    >
      {/* Soft Fade Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/25 to-white/50 pointer-events-none" />

      {/* Luminous Champagne Ambient Light Blooms (GPU-accelerated pre-computed radial gradients) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden opacity-90 transform-gpu"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 0%, rgba(216, 194, 163, 0.35) 0%, rgba(236, 220, 200, 0.15) 50%, transparent 75%), radial-gradient(circle 380px at 0% 90%, rgba(236, 220, 200, 0.25) 0%, transparent 70%), radial-gradient(circle 380px at 100% 50%, rgba(228, 210, 188, 0.3) 0%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Block */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <span className="text-[11px] font-sans font-medium text-luxury-gold uppercase tracking-[0.28em] block mb-3">
            Journal &amp; Insights
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-light text-luxury-text mb-3 sm:mb-6 tracking-tight leading-tight">
            {heading}
          </h2>
          <p className="font-sans text-xs sm:text-sm md:text-base text-luxury-subtext max-w-2xl mx-auto font-light leading-relaxed px-2">
            {description}
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
                : 'border border-[#D8C2A3]/50 bg-white/90 text-luxury-subtext hover:bg-white hover:text-luxury-text'
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
                : 'border border-[#D8C2A3]/50 bg-white/90 text-luxury-subtext hover:bg-white hover:text-luxury-text'
            }`}
          >
            Patient stories
          </button>
        </div>

        {/* Articles Grid */}
        {displayedCards.length === 0 ? (
          <div className="bg-white/80 rounded-2xl border border-[#e8dcc8] p-10 text-center max-w-xl mx-auto">
            <p className="font-serif text-lg text-luxury-text mb-1">
              No {activeTab === 'news' ? 'news articles' : 'patient stories'} published yet
            </p>
            <p className="font-sans text-xs text-luxury-subtext">
              New clinical insights and updates will appear here once published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {displayedCards.map((article, index) => (
              <motion.article
                key={`${activeTab}-${article.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
                onClick={() => handleCardSelect(article)}
                className="flex flex-col bg-white/98 rounded-2xl sm:rounded-[22px] md:rounded-[24px] overflow-hidden border border-[#e8dcc8] shadow-[0_8px_30px_-8px_rgba(216,194,163,0.3)] hover:shadow-xl hover:border-luxury-gold hover:-translate-y-1 transition-all duration-300 group cursor-pointer transform-gpu will-change-transform"
              >
                {/* Image Container */}
                <div className="aspect-[16/9] sm:aspect-[16/10] overflow-hidden bg-[#faf7f2] relative">
                  <ArticleCoverMedia
                    src={article.image}
                    alt={article.imageAlt || article.title}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-5 md:left-5 bg-white/95 text-luxury-text font-sans font-medium text-[9px] sm:text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-xs border border-[#e8dcc8]">
                    {article.category || article.tag}
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Meta */}
                    <div className="flex items-center gap-3 sm:gap-4 text-luxury-muted font-sans text-[11px] sm:text-xs mb-2.5 sm:mb-4 font-normal tracking-wide">
                      <span className="flex items-center gap-1 sm:gap-1.5">
                        <Calendar
                          className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-luxury-gold"
                          strokeWidth={1.75}
                        />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1 sm:gap-1.5">
                        <User
                          className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-luxury-gold"
                          strokeWidth={1.75}
                        />
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
                      <ArrowRight
                        className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-luxury-gold group-hover:translate-x-1 transition-transform duration-300"
                        strokeWidth={1.75}
                      />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Global Pagination Component */}
        {displayedCards.length > 0 && (
          <div className="pt-8 sm:pt-12 md:pt-16 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.max(1, totalPages)}
              onPageChange={(nextPage) => {
                setCurrentPage(nextPage);
                const el = document.getElementById('latest-news');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
