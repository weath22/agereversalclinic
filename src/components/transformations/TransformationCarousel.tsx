import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

interface TransformationCarouselProps {
  title: string;
  images: string[];
  beforeImage?: string;
  afterImage?: string;
  singleFrameImage?: string;
  singleFrameAltText?: string;
  beforeAltText?: string;
  afterAltText?: string;
  seoTitle?: string;
}

type FrameSlide =
  | { type: 'single'; imageUrl: string; alt: string }
  | { type: 'pair'; beforeUrl: string; afterUrl: string; beforeAlt: string; afterAlt: string };

export const TransformationCarousel: React.FC<TransformationCarouselProps> = ({
  title,
  images,
  beforeImage,
  afterImage,
  singleFrameImage,
  singleFrameAltText,
  beforeAltText,
  afterAltText,
  seoTitle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const cleanSingleFrame = (singleFrameImage || '').trim();
  const cleanBefore = (beforeImage || '').trim();
  const cleanAfter = (afterImage || '').trim();

  // Build unified single-frame slides:
  // 1) If a dedicated singleFrameImage is set, show it as a single frame.
  // 2) If beforeImage & afterImage are provided (two-slot pair images), combine them inside ONE single unified frame.
  // 3) Any additional gallery images are also displayed in the single frame.
  const frameSlides = useMemo<FrameSlide[]>(() => {
    const resolvedBeforeAlt =
      beforeAltText || `${title} — Before Treatment at Age Reversal Clinics London`;
    const resolvedAfterAlt =
      afterAltText || `${title} — After Treatment Result at Age Reversal Clinics London`;
    const resolvedSingleAlt =
      singleFrameAltText ||
      beforeAltText ||
      `${title} — Clinical Before & After Result at Age Reversal Clinics London`;

    if (cleanSingleFrame) {
      return [
        {
          type: 'single',
          imageUrl: cleanSingleFrame,
          alt: resolvedSingleAlt,
        },
      ];
    }

    const isPreCombinedSingleImage = (url: string) =>
      url.includes('lexaesthetics.com/storage/');

    const slides: FrameSlide[] = [];
    const usedUrls = new Set<string>();

    // If the case has a two-slot Before & After pair (and they aren't already pre-combined single images),
    // display the pair together inside ONE single frame
    if (
      cleanBefore &&
      cleanAfter &&
      !isPreCombinedSingleImage(cleanBefore) &&
      !isPreCombinedSingleImage(cleanAfter)
    ) {
      slides.push({
        type: 'pair',
        beforeUrl: cleanBefore,
        afterUrl: cleanAfter,
        beforeAlt: resolvedBeforeAlt,
        afterAlt: resolvedAfterAlt,
      });
      usedUrls.add(cleanBefore);
      usedUrls.add(cleanAfter);
    }

    const remainingImages = (images || [])
      .map((u) => (u || '').trim())
      .filter((u) => Boolean(u) && !usedUrls.has(u));

    let i = 0;
    while (i < remainingImages.length) {
      const current = remainingImages[i];
      const next = remainingImages[i + 1];

      if (isPreCombinedSingleImage(current) || !next || isPreCombinedSingleImage(next)) {
        slides.push({
          type: 'single',
          imageUrl: current,
          alt: resolvedSingleAlt,
        });
        i += 1;
      } else {
        slides.push({
          type: 'pair',
          beforeUrl: current,
          afterUrl: next,
          beforeAlt: slides.length === 0 ? resolvedBeforeAlt : `${title} — Before Result`,
          afterAlt: slides.length === 0 ? resolvedAfterAlt : `${title} — After Result`,
        });
        i += 2;
      }
    }

    if (slides.length === 0 && (cleanBefore || cleanAfter)) {
      slides.push({
        type: 'single',
        imageUrl: cleanBefore || cleanAfter,
        alt: resolvedSingleAlt,
      });
    }

    return slides;
  }, [
    cleanSingleFrame,
    cleanBefore,
    cleanAfter,
    images,
    title,
    singleFrameAltText,
    beforeAltText,
    afterAltText,
  ]);

  const totalSlides = frameSlides.length;
  const maxIndex = Math.max(0, totalSlides - 1);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(0);
    }
  }, [currentIndex, maxIndex]);

  // Autoplay when multiple single-frame slides exist
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex, totalSlides]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  if (frameSlides.length === 0) return null;

  return (
    <div
      className="w-full text-center my-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Elementor Heading Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-stone-900 tracking-tight font-normal text-center mb-3">
        {title}
      </h2>

      {/* 2. Elementor Divider with 3 dots Icon */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <div className="flex items-center w-full max-w-xs sm:max-w-md">
          <div className="flex-grow border-t border-[#D8C2A3]/60"></div>
          <span className="px-3 text-[#C5A880]">
            <MoreHorizontal className="w-5 h-5 text-[#C5A880]" />
          </span>
          <div className="flex-grow border-t border-[#D8C2A3]/60"></div>
        </div>
      </div>

      {/* 3. Single Unified Large Frame (Displays either a Single Frame Image or the Before & After Pair inside One Single Frame) */}
      <div className="relative -mx-4 sm:mx-auto w-[calc(100%+2rem)] sm:w-full max-w-4xl px-0 sm:px-4">
        <div
          ref={containerRef}
          className="overflow-hidden rounded-none sm:rounded-2xl bg-white border-y sm:border border-stone-200/90 shadow-sm relative select-none"
        >
          <motion.div
            className="flex"
            drag={totalSlides > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (totalSlides <= 1) return;
              const swipeThreshold = 50;
              if (info.offset.x < -swipeThreshold) {
                handleNext();
              } else if (info.offset.x > swipeThreshold) {
                handlePrev();
              }
            }}
            animate={{
              x: `-${currentIndex * 100}%`,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            {frameSlides.map((slide, slideIdx) => (
              <div key={slideIdx} className="w-full shrink-0">
                {slide.type === 'single' ? (
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-stone-100 group">
                    <img
                      src={slide.imageUrl}
                      alt={slide.alt}
                      title={
                        seoTitle ||
                        `${title} — Before & After Transformation | Age Reversal Clinics`
                      }
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 sm:group-hover:scale-[1.02] pointer-events-none"
                    />
                  </div>
                ) : (
                  /* Pair images combined inside ONE single large frame */
                  <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-stone-200/80 grid grid-cols-2 gap-[2px] group">
                    {/* Left Half of Single Frame: Before */}
                    <div className="relative w-full h-full overflow-hidden bg-stone-100">
                      <img
                        src={slide.beforeUrl}
                        alt={slide.beforeAlt}
                        title={
                          seoTitle
                            ? `${seoTitle} (Before)`
                            : `${title} — Before | Age Reversal Clinics`
                        }
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 sm:group-hover:scale-[1.02] pointer-events-none"
                      />
                      <span className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 bg-black/70 backdrop-blur-xs text-white text-[9px] sm:text-[11px] font-sans font-semibold uppercase tracking-wider px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-xs">
                        Before
                      </span>
                    </div>

                    {/* Right Half of Single Frame: After */}
                    <div className="relative w-full h-full overflow-hidden bg-stone-100">
                      <img
                        src={slide.afterUrl}
                        alt={slide.afterAlt}
                        title={
                          seoTitle
                            ? `${seoTitle} (After)`
                            : `${title} — After | Age Reversal Clinics`
                        }
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 sm:group-hover:scale-[1.02] pointer-events-none"
                      />
                      <span className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 bg-[#003334]/90 backdrop-blur-xs text-white text-[9px] sm:text-[11px] font-sans font-semibold uppercase tracking-wider px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-xs">
                        After
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Carousel Navigation Arrows (when multiple single-frame slides exist) */}
        {totalSlides > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous slide"
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-stone-800 hover:text-black border border-stone-200/80 shadow-md flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer hover:shadow-lg"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next slide"
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-stone-800 hover:text-black border border-stone-200/80 shadow-md flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer hover:shadow-lg"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Swiper Pagination Bullets */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-5 sm:mt-6">
            {Array.from({ length: totalSlides }).map((_, dotIdx) => {
              const isPrimaryActive = dotIdx === currentIndex;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => handleDotClick(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isPrimaryActive
                      ? 'w-6 sm:w-7 bg-stone-900'
                      : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

