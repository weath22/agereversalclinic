import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TransformationCarouselProps {
  title: string;
  images: string[];
  beforeAltText?: string;
  afterAltText?: string;
  seoTitle?: string;
}

export const TransformationCarousel: React.FC<TransformationCarouselProps> = ({
  title,
  images,
  beforeAltText,
  afterAltText,
  seoTitle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive items per view: 2 on tablet/desktop, 1 on mobile
  const [slidesToShow, setSlidesToShow] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else {
        setSlidesToShow(2);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = images.length;
  const maxIndex = Math.max(0, totalSlides - slidesToShow);

  // Autoplay
  useEffect(() => {
    if (isPaused || totalSlides <= slidesToShow) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex, totalSlides, slidesToShow]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

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

      {/* 3. Elementor Image Carousel Slider */}
      <div className="relative -mx-4 sm:mx-auto w-[calc(100%+2rem)] sm:w-full max-w-5xl px-0 sm:px-4">
        {/* Carousel Viewport Container */}
        <div 
          ref={containerRef}
          className="overflow-hidden rounded-none sm:rounded-2xl relative shadow-xs bg-stone-100/50 sm:bg-transparent"
        >
          <motion.div
            className="flex gap-0 sm:gap-5"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              const swipeThreshold = 50;
              if (info.offset.x < -swipeThreshold) {
                handleNext();
              } else if (info.offset.x > swipeThreshold) {
                handlePrev();
              }
            }}
            animate={{
              x: `calc(-${currentIndex * (100 / slidesToShow)}% - ${currentIndex * (slidesToShow === 1 ? 0 : 1.25)}rem / ${slidesToShow})`,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            {images.map((imgUrl, imgIdx) => {
              const resolvedAlt =
                imgIdx === 0 && beforeAltText
                  ? beforeAltText
                  : imgIdx === 1 && afterAltText
                  ? afterAltText
                  : `${title} - Clinical Result ${imgIdx + 1} at Age Reversal Clinics London`;
              const resolvedTitle = seoTitle
                ? `${seoTitle} (${imgIdx === 0 ? 'Before' : imgIdx === 1 ? 'After' : `View ${imgIdx + 1}`})`
                : `${title} — Age Reversal Clinics`;

              return (
                <div
                  key={imgIdx}
                  className="shrink-0 w-full sm:w-[calc(50%-0.625rem)] overflow-hidden rounded-none sm:rounded-xl bg-stone-100 border-y sm:border border-stone-200/80 group select-none"
                >
                  <div className="relative aspect-[1/1] sm:aspect-[16/11] w-full overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={resolvedAlt}
                      title={resolvedTitle}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover sm:object-cover transition-transform duration-700 sm:group-hover:scale-105 pointer-events-none"
                    />
                    <div className="absolute bottom-3 right-3 sm:bottom-2.5 sm:right-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] sm:text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full shadow-sm">
                      {imgIdx + 1} / {images.length}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Carousel Navigation Arrows */}
        {totalSlides > slidesToShow && (
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
              const isActive = dotIdx === currentIndex || (slidesToShow === 2 && dotIdx === currentIndex + 1);
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
                      : isActive
                      ? 'w-3 bg-stone-600'
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
