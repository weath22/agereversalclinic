import React, { useState, useEffect } from 'react';
import { Article, ArticleContentBlock } from '../types';
import ConsultantProfile from './ConsultantProfile';
import LogoOutlineSkeleton from './LogoOutlineSkeleton';

interface ArticleContentProps {
  article: Article;
  onViewProfile?: () => void;
}

function ArticleInlineImage({
  src,
  alt,
  caption,
}: {
  src?: string;
  alt: string;
  caption?: string;
}) {
  const [hasError, setHasError] = useState(false);
  const cleanSrc = (src || '').trim();

  useEffect(() => {
    setHasError(false);
  }, [cleanSrc]);

  return (
    <figure className="my-8 sm:my-10 space-y-2.5">
      <div className="rounded-2xl overflow-hidden border border-[#e8dcc8] bg-[#faf8f5] shadow-xs">
        {!cleanSrc || hasError ? (
          <div className="aspect-[16/9] w-full flex items-center justify-center">
            <LogoOutlineSkeleton size="md" showLabel={false} className="w-full h-full border-0" />
          </div>
        ) : (
          <img
            src={cleanSrc}
            alt={alt}
            loading="lazy"
            onError={() => setHasError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[540px] object-cover"
          />
        )}
      </div>
      {caption && (
        <figcaption className="text-xs sm:text-sm text-luxury-muted italic text-center font-serif px-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function renderContentBlock(block: ArticleContentBlock, index: number, articleTitle: string) {
  const key = block.id || `block-${index}`;

  switch (block.type) {
    case 'h2':
      return (
        <h2
          key={key}
          className="text-2xl sm:text-3xl md:text-4xl font-serif text-luxury-text font-normal mt-10 sm:mt-14 mb-4 sm:mb-6 leading-snug tracking-tight"
        >
          {block.heading || block.text}
        </h2>
      );

    case 'h3':
      return (
        <h3
          key={key}
          className="text-xl sm:text-2xl md:text-3xl font-serif text-luxury-text font-normal mt-8 sm:mt-11 mb-3.5 sm:mb-5 leading-snug"
        >
          {block.heading || block.text}
        </h3>
      );

    case 'paragraph': {
      const paragraphs = block.paragraphs?.length
        ? block.paragraphs
        : block.text
        ? [block.text]
        : [];
      return (
        <React.Fragment key={key}>
          {paragraphs.map((para, pIdx) => (
            <p
              key={`${key}-p-${pIdx}`}
              className="mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg md:text-xl text-luxury-subtext font-light"
            >
              {para}
            </p>
          ))}
        </React.Fragment>
      );
    }

    case 'callout':
      return (
        <blockquote
          key={key}
          className="border-l-4 border-luxury-gold pl-5 sm:pl-7 my-8 sm:my-10 italic text-base sm:text-lg md:text-xl text-luxury-text font-serif leading-relaxed bg-[#faf8f5] py-5 sm:py-6 pr-5 rounded-r-2xl"
        >
          <p className="m-0">"{block.calloutQuote || block.text}"</p>
          {block.calloutAttribution && (
            <footer className="mt-2.5 not-italic font-sans text-xs sm:text-sm font-medium text-luxury-muted tracking-wide">
              — {block.calloutAttribution}
            </footer>
          )}
        </blockquote>
      );

    case 'bullets':
      if (!block.bulletPoints || block.bulletPoints.length === 0) return null;
      return (
        <ul
          key={key}
          className="mb-6 sm:mb-8 pl-5 sm:pl-6 space-y-2.5 sm:space-y-3 list-disc marker:text-luxury-gold text-base sm:text-lg md:text-xl text-luxury-subtext font-light leading-relaxed"
        >
          {block.bulletPoints.map((item, bIdx) => (
            <li key={`${key}-li-${bIdx}`} className="pl-1">
              {item}
            </li>
          ))}
        </ul>
      );

    case 'image':
      return (
        <ArticleInlineImage
          key={key}
          src={block.imageUrl}
          alt={block.imageAlt || block.imageCaption || articleTitle}
          caption={block.imageCaption}
        />
      );

    default:
      return null;
  }
}

export default function ArticleContent({ article, onViewProfile }: ArticleContentProps) {
  const hasStructuredBlocks =
    Array.isArray(article.contentBlocks) && article.contentBlocks.length > 0;
  const hasFaqItems = Array.isArray(article.faqItems) && article.faqItems.length > 0;

  return (
    <article className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-20">
        <div className="prose prose-base sm:prose-lg md:prose-xl max-w-none text-luxury-text font-sans">
          <p className="text-lg sm:text-xl md:text-2xl text-luxury-text font-serif italic mb-8 sm:mb-10 leading-relaxed font-normal">
            {article.description}
          </p>

          {hasStructuredBlocks ? (
            article.contentBlocks!.map((block, index) =>
              renderContentBlock(block, index, article.title)
            )
          ) : (
            <>
              <p className="mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg md:text-xl text-luxury-subtext font-light">
                Every clinical procedure and patient pathway at Age Reversal Clinic begins with a thorough diagnostic assessment. We combine leading dermatological technology with tailored treatment protocols to achieve natural, refined, and lasting outcomes.
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-luxury-text font-normal mt-10 sm:mt-14 mb-4 sm:mb-6">
                A Commitment to Clinical Excellence
              </h2>
              <p className="mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg md:text-xl text-luxury-subtext font-light">
                Our medical specialists utilize scientifically proven modalities, from bio-remodeling injectables to precision cellular renewal therapies. Each bespoke protocol honors individual facial harmony and anatomical integrity.
              </p>
              <blockquote className="border-l-4 border-luxury-gold pl-5 sm:pl-7 my-8 sm:my-10 italic text-base sm:text-lg md:text-xl text-luxury-text font-serif leading-relaxed bg-[#faf8f5] py-5 sm:py-6 pr-5 rounded-r-2xl">
                "Our primary focus is delivering exceptional aesthetic care through innovative treatments and a compassionate, doctor-led approach that sets the benchmark in medical aesthetics."
              </blockquote>
              <p className="mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg md:text-xl text-luxury-subtext font-light">
                Through ongoing research and collaboration with world-renowned aesthetic physicians, we continuously refine our minimally invasive techniques to ensure minimal downtime and maximum patient satisfaction.
              </p>
            </>
          )}

          {hasFaqItems && (
            <section className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-luxury-border">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-luxury-text font-normal mb-6">
                Frequently Asked Clinical Questions
              </h2>
              <div className="space-y-4">
                {article.faqItems!.map((faq, idx) => (
                  <div
                    key={faq.id || `faq-${idx}`}
                    className="rounded-2xl border border-luxury-border/80 bg-[#faf8f5]/60 p-4 sm:p-5"
                  >
                    <h3 className="text-base sm:text-lg font-serif font-medium text-luxury-text mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm sm:text-base text-luxury-subtext font-light leading-relaxed m-0">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Consultant Profile Item */}
        <ConsultantProfile authorName={article.author} onViewProfile={onViewProfile} />
      </div>
    </article>
  );
}
