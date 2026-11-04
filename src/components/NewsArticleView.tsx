import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Link2,
  Linkedin,
  Facebook,
  Instagram,
  Check,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Article } from '../types';
import { ShopProduct } from '../types/shop';
import {
  getBlogPostByIdOrSlug,
  fetchBlogPostByIdOrSlug,
  getLatestNewsConfig,
} from '../lib/adminStore';
import ArticleContent from './ArticleContent';
import RelatedArticles from './RelatedArticles';
import ClinicalSEOHead from './ClinicalSEOHead';
import LogoOutlineSkeleton from './LogoOutlineSkeleton';

interface NewsArticleProps {
  article: Article;
  onClose: () => void;
  onBookClick: (serviceName?: string) => void;
  onArticleClick: (article: Article) => void;
  onViewProfile: () => void;
  onProductClick?: (product: ShopProduct) => void;
}

function ArticleHeroMedia({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);
  const cleanSrc = (src || '').trim();

  useEffect(() => {
    setHasError(false);
  }, [cleanSrc]);

  if (!cleanSrc || hasError) {
    return (
      <div className="w-full h-full bg-[#faf8f5] flex items-center justify-center">
        <LogoOutlineSkeleton size="lg" showLabel={false} className="w-full h-full border-0" />
      </div>
    );
  }

  return (
    <img
      className={
        className ||
        'w-full h-full object-cover brightness-[0.98] contrast-[1.02] transition-transform duration-10000 hover:scale-105'
      }
      src={cleanSrc}
      alt={alt}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
    />
  );
}

export default function NewsArticleView({
  article,
  onClose,
  onBookClick,
  onArticleClick,
  onViewProfile,
}: NewsArticleProps) {
  const [activeArticle, setActiveArticle] = useState<Article>(
    () => getBlogPostByIdOrSlug(article.id) || article
  );
  const [allPublishedArticles, setAllPublishedArticles] = useState<Article[]>(() => {
    const cfg = getLatestNewsConfig();
    return [...cfg.newsArticles, ...cfg.storyArticles].filter((a) => a.status !== 'draft');
  });
  const [copiedLink, setCopiedLink] = useState(false);

  // On-demand single post fetch for full contentBlocks, faqItems, and complete SEO metadata
  useEffect(() => {
    let isMounted = true;
    const localFull = getBlogPostByIdOrSlug(article.id) || article;
    setActiveArticle(localFull);

    fetchBlogPostByIdOrSlug(article.id).then((remoteFull) => {
      if (isMounted && remoteFull) {
        setActiveArticle(remoteFull);
      }
    });

    const refreshStoreArticles = () => {
      const cfg = getLatestNewsConfig();
      if (isMounted) {
        setAllPublishedArticles(
          [...cfg.newsArticles, ...cfg.storyArticles].filter((a) => a.status !== 'draft')
        );
        const updatedSelf = getBlogPostByIdOrSlug(article.id);
        if (updatedSelf) setActiveArticle(updatedSelf);
      }
    };

    window.addEventListener('blog_posts_updated', refreshStoreArticles);
    return () => {
      isMounted = false;
      window.removeEventListener('blog_posts_updated', refreshStoreArticles);
    };
  }, [article]);

  const handleCopyShareLink = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}${window.location.pathname}#article-${
      activeArticle.slug || activeArticle.id
    }`;
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const textVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <>
      {/* Synchronize Rich Schema.org JSON-LD (BlogPosting + MedicalWebPage + FAQPage) & OpenGraph Article Meta */}
      <ClinicalSEOHead articleData={activeArticle} />

      <section className="relative bg-gradient-to-b from-[#fbf8f3] via-[#faf7f2] to-[#ffffff] overflow-hidden min-h-0 md:min-h-[calc(100vh-100px)] flex items-center pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8 md:pb-12 border-b border-luxury-border">
        {/* Breadcrumb Navigation */}
        <div className="absolute top-4 sm:top-5 left-4 sm:left-6 md:left-8 z-30 flex items-center text-xs text-luxury-muted font-sans tracking-wide">
          <button
            onClick={onClose}
            className="hover:text-black transition-colors font-medium cursor-pointer"
          >
            News
          </button>
          <span className="mx-1.5 sm:mx-2 text-luxury-border">&gt;</span>
          <span className="font-medium text-luxury-gold">
            {activeArticle.category || activeArticle.tag}
          </span>
          <span className="mx-1.5 sm:mx-2 text-luxury-border">&gt;</span>
          <span className="text-luxury-text font-normal truncate max-w-[140px] sm:max-w-xs md:max-w-md">
            {activeArticle.title}
          </span>
        </div>

        {/* Desktop Full-bleed Right Half Image */}
        <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden hidden md:block z-0 bg-white">
          <ArticleHeroMedia
            src={activeArticle.image}
            alt={activeArticle.imageAlt || activeArticle.title}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fbf8f3] via-[#fbf8f3]/50 to-transparent w-48 pointer-events-none" />
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        </div>

        {/* Decorative background gradient on the left half */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#D8C2A3]/10 to-[#fbf8f3] pointer-events-none z-0" />

        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 flex flex-col md:flex-row min-h-0 md:min-h-[calc(100vh-140px)] items-center gap-6 sm:gap-8 md:gap-12 pt-6 sm:pt-8 md:py-8">
          {/* Left Column: Heading, Category, Call to action */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
            }}
            className="w-full md:w-1/2 flex flex-col justify-center max-w-xl relative z-10"
          >
            {/* Category Tag Badge */}
            <motion.div
              variants={textVariants}
              className="inline-flex items-center space-x-2 bg-white/95 backdrop-blur-sm text-luxury-text px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-medium tracking-wider w-fit mb-3 sm:mb-4 shadow-xs border border-luxury-border"
            >
              <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
              <span>{activeArticle.category || activeArticle.tag}</span>
            </motion.div>

            {/* Main Title Heading */}
            <motion.h1
              variants={textVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light md:font-normal text-luxury-text leading-tight mb-3 sm:mb-4 tracking-tight"
            >
              {activeArticle.title}
            </motion.h1>

            {/* Meta Date, Author & Reading Time */}
            <motion.div
              variants={textVariants}
              className="flex flex-wrap items-center gap-2 sm:gap-3 text-luxury-subtext font-sans text-[11px] sm:text-xs md:text-sm mb-3.5 sm:mb-5 font-normal bg-white/80 backdrop-blur-sm px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl border border-luxury-border/60 w-fit"
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-luxury-gold" strokeWidth={1.5} />
                {activeArticle.date}
              </span>
              <span className="text-luxury-border">|</span>
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-luxury-gold" strokeWidth={1.5} />
                {activeArticle.author}
              </span>
              {activeArticle.readingTime && (
                <>
                  <span className="text-luxury-border">|</span>
                  <span className="flex items-center gap-1">
                    <Clock
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-luxury-gold"
                      strokeWidth={1.5}
                    />
                    {activeArticle.readingTime}
                  </span>
                </>
              )}
            </motion.div>

            {/* Short Summary Description */}
            <motion.p
              variants={textVariants}
              className="text-sm sm:text-base md:text-lg text-luxury-subtext mb-5 sm:mb-7 leading-relaxed max-w-lg font-light"
            >
              {activeArticle.description}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={textVariants}
              className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
            >
              <button
                onClick={() => onBookClick(activeArticle.category || activeArticle.tag)}
                className="bg-black text-white px-7 py-3 sm:px-8 sm:py-3.5 rounded-full shadow-md hover:bg-neutral-800 transition-all font-sans font-medium flex items-center space-x-2 text-xs sm:text-sm group cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <span>Book Appointment</span>
                <Calendar className="h-4 w-4 text-luxury-gold group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={onClose}
                className="bg-white border border-luxury-border text-luxury-text px-6 py-3 sm:px-7 sm:py-3.5 rounded-full shadow-xs hover:bg-luxury-secondary transition-all font-sans font-medium flex items-center space-x-2 group text-xs sm:text-sm cursor-pointer active:scale-95"
              >
                <ArrowLeft className="h-4 w-4 text-luxury-muted group-hover:-translate-x-1 transition-transform" />
                <span>Back to News</span>
              </button>
            </motion.div>

            {/* Share Social Links */}
            <motion.div variants={textVariants} className="flex items-center gap-3 pt-1">
              <span className="text-luxury-text font-sans font-medium text-xs sm:text-sm">
                Share:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyShareLink}
                  aria-label="Copy Link"
                  title="Copy article link"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-luxury-border flex items-center justify-center shadow-xs hover:border-luxury-gold hover:text-luxury-gold transition-all cursor-pointer"
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                  ) : (
                    <Link2 className="w-4 h-4 text-luxury-subtext" strokeWidth={1.75} />
                  )}
                </button>
                <button
                  aria-label="LinkedIn"
                  onClick={handleCopyShareLink}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-luxury-border flex items-center justify-center shadow-xs hover:border-luxury-gold hover:text-luxury-gold transition-all cursor-pointer"
                >
                  <Linkedin className="w-4 h-4 text-luxury-subtext" strokeWidth={1.75} />
                </button>
                <button
                  aria-label="Facebook"
                  onClick={handleCopyShareLink}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-luxury-border flex items-center justify-center shadow-xs hover:border-luxury-gold hover:text-luxury-gold transition-all cursor-pointer"
                >
                  <Facebook className="w-4 h-4 text-luxury-subtext" strokeWidth={1.75} />
                </button>
                <button
                  aria-label="Instagram"
                  onClick={handleCopyShareLink}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-luxury-border flex items-center justify-center shadow-xs hover:border-luxury-gold hover:text-luxury-gold transition-all cursor-pointer"
                >
                  <Instagram className="w-4 h-4 text-luxury-subtext" strokeWidth={1.75} />
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Mobile View Media */}
          <div className="md:hidden w-full mt-3 mb-2 relative z-10">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-sm border border-luxury-border">
              <ArticleHeroMedia
                src={activeArticle.image}
                alt={activeArticle.imageAlt || activeArticle.title}
                className="w-full h-full object-cover brightness-[0.98] contrast-[1.02]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Clean Semantic Article Content & FAQ Rich Snippets (Recommended Treatments & Products excluded as requested) */}
      <ArticleContent article={activeArticle} onViewProfile={onViewProfile} />

      <RelatedArticles
        currentArticle={activeArticle}
        onArticleClick={onArticleClick}
        articles={allPublishedArticles}
      />
    </>
  );
}
