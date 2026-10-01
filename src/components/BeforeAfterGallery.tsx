"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getBeforeAfterGalleryConfig } from '../lib/adminStore';
import { BeforeAfterGalleryConfig } from '../types';
import Pagination from './Pagination';

interface TreatmentServiceFrameComparisonProps {
  title: string;
  beforeImage: string;
  afterImage: string;
}

// Exactly mirrors the Treatment Services Page before/after frame styling
function TreatmentServiceFrameComparison({ title, beforeImage, afterImage }: TreatmentServiceFrameComparisonProps) {
  return (
    <div className="flex flex-col items-center space-y-3 sm:space-y-4 w-full">
      {/* Title / Case label header */}
      <div className="text-xs sm:text-sm font-serif font-medium text-silver-900 text-center tracking-wide px-2">
        {title}
      </div>

      {/* Side-by-side polaroid clinical frames identical to Treatment Services page */}
      <div className="flex flex-row items-center justify-center -space-x-8 sm:-space-x-12 md:-space-x-10 lg:-space-x-14 xl:-space-x-16 w-full max-w-lg">
        {/* Left Frame: Before */}
        <motion.div
          initial={{ opacity: 0, x: -15, rotate: -3 }}
          whileInView={{ opacity: 1, x: 0, rotate: -2 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.04, rotate: 0, zIndex: 30 }}
          transition={{ type: 'spring', stiffness: 90, damping: 15 }}
          className="bg-white p-2.5 pb-9 sm:p-3.5 sm:pb-13 md:p-4 md:pb-14 rounded-xs shadow-[0_20px_45px_rgba(0,0,0,0.08)] border border-neutral-100/90 flex flex-col relative group cursor-pointer flex-1 max-w-[145px] sm:max-w-[210px] md:max-w-[230px] lg:max-w-[260px] z-10"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-50 border border-neutral-200/50 rounded-xs">
            <img 
              src={beforeImage} 
              alt={`${title} Before Treatment`} 
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-[14px] sm:bottom-[20px] md:bottom-[24px] left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
            <div className="bg-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-neutral-200 text-silver-700 font-sans text-[8px] sm:text-[9px] md:text-[10px] font-bold shadow-[0_2px_10px_rgba(0,0,0,0.05)] tracking-wider uppercase whitespace-nowrap">
              Before
            </div>
          </div>
        </motion.div>

        {/* Right Frame: After */}
        <motion.div
          initial={{ opacity: 0, x: 15, rotate: 3 }}
          whileInView={{ opacity: 1, x: 0, rotate: 2 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.04, rotate: 0, zIndex: 30 }}
          transition={{ type: 'spring', stiffness: 90, damping: 15 }}
          className="bg-white p-2.5 pb-9 sm:p-3.5 sm:pb-13 md:p-4 md:pb-14 rounded-xs shadow-[0_20px_45px_rgba(0,0,0,0.08)] border border-neutral-100/90 flex flex-col relative group cursor-pointer flex-1 max-w-[145px] sm:max-w-[210px] md:max-w-[230px] lg:max-w-[260px] z-20"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-50 border border-neutral-200/50 rounded-xs">
            <img 
              src={afterImage} 
              alt={`${title} After Treatment`} 
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-[14px] sm:bottom-[20px] md:bottom-[24px] left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
            <div className="bg-[#003334] text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#003334] font-sans text-[8px] sm:text-[9px] md:text-[10px] font-bold shadow-[0_2px_10px_rgba(0,0,0,0.1)] tracking-wider uppercase whitespace-nowrap">
              After
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Comprehensive clinical before-after pairs pool
const COMPREHENSIVE_GALLERY_PAIRS = [
  {
    id: 'pair-1',
    categoryId: 'anti-aging',
    title: 'Skin Treatment - 12 Wks',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6YRX4oWEimDRlPfT4ZvP49QVjagike9HlAOT7FsLhwf61UL4dCKCGWr1FS7SmMqMhd9VheV3RuR4bKmR_H3dRMFEAxUvuwj56dIFiriv8niGvOiz7XVef6Gjx4h3iHxaFayLl_g4p2ViKYOGEKxMw4bAR7W5VL-rkDMyy7LQjrabplnGUsrY6j9fECzUiFYmk_OZ_-hBZJAePOaKJjK0lqqjd7ahusnbsXJYKmIG5Rs5lmafypBuU_b9wqYQQG0v8O8BfCz2mokhu',
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtnTWTfvtjmgPs1n1Q2b5gdUnZqNuGV3e-_ZLF0KZFSWWrFhA3eAIX2iTTuaY-hDvVwQ5PKReB6fFMP3tq1WnzmcGJr11CXLsLkYmYd8zLGLdL5zETq6wohVWzqLcykLevZUPnJ_LG55HukqRiTUllO8pE80UJFXvPUytiYATX5fbzVCDVz_cqX20l_6dKdFzb4UaffXMlUAbDiZwQL531mZiVM9lUuSozSA_-uLXJhit8mpHzT04T8XOmmy7yIYQyPOkWqJTIqPfO'
  },
  {
    id: 'pair-5',
    categoryId: 'anti-aging',
    title: 'Anti-Aging - 8 Wks',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQHcq9zpePKkMqtIMFzx_zJA6A2MHoEn6csMvjhOOX7ANTgntEGIHbHHzkJdrRGuvr_rnNYa6j_vcZm7V9bkSv83qNQwd18XJJA14YTUOLU2diwqx3hP_e-l8axRA5ZOsfN1xGiRO0pPe2sb4cNQEz8psyAxBRjvefn1MvexT-2iAwkVKIyT8R_56LKMScwW7_sMvuBzMGXxdp0I1cFNoqfp7K5RhhrtrwcfrUPw1dRPmX60Zc0esbeUgaFqwO959IBqnu8sf8OA4w',
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZoLjpjMEmJNM6EwzVC9AzZEWfQUVa-TmVyM-NgPL8ONCjzwY7nZ6rFqOxJ9jyK0OMnlIij8h8SOt93jaHfSglwGqtwAN3uabUuoux0yNyPzieFFX7iyB4YhjLSsBzd2BRDjEDVB1RlXcG4VC8SswApL8QbBnPLshzCzMX8LSdFYZsa0PRI6MM6b7I67HIl-B6YLhZAH5ZI9mcghNQsybRemIqmq4LWl9BCKjn5KaTyU1RyMrHYkwMgx1ABZOJ1-OJiLkjF-5mIKY0'
  },
  {
    id: 'pair-2',
    categoryId: 'acne-scarring',
    title: 'Laser Therapy & Skin Revision',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKPf3nijQRz9NaEd_b-5EiczAejYyrgh_dwMC6S-1-7Hi8EJJnt8_x2x-i1qG-qJ0BxvXbk_PeIeusHvMggQrPf2ijjCJ-yYtr-Ur19sJw4_NIIAlLMv1S2ct_OUVp3CJNba1hCLXrrPOcfhQAQUcgqZJFcuUL6Q4KXUwM1ALRAeo6Bb79xdI4FoLRUFAP9_MlbZ8tUedBAnuVrheDWpnRtLnB17gtdOx3OFGMbTVs5jhXXnZD6b-y7OCBnlBNOtqOPMcKxAdzDKRk',
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFNbqNx3wVVcZoA9IP87KJkDnMZI-8uRSd-RL2-LhuxC6ADEkgMcpBDJ22CU3U7a_ZOllNge5XasdFvVaBYUhCDohAZdRi0HT1ymJ1s_FMyiXt8pJl7NGhaLkKATrZlXl3B2mFW01fD4Mzp3ixyyLcDfCdjXdPi58MzBZ-GTgGk7w7Ks96hydwAbc4rURmQ3Pel8YEcOvxIX5UbwIKvB4OdEuyDc-z_RnH-USDoP7hJ2AJkw4zTdCS7FDF6Vo4RFbWikgnECIa4gKP'
  },
  {
    id: 'pair-6',
    categoryId: 'acne-scarring',
    title: 'Volumetric Resurfacing & Texture',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY'
  },
  {
    id: 'pair-3',
    categoryId: 'facial-harmony',
    title: 'Advanced Aesthetics Profile',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD20NLhroXmHS02eweFz9RBF-OhZ1RaQuMYe3uKrQ3iyvZ-roWLw57bJ33sw80W5DRjj47x5XfDBbMjHImuC7GRyDB99DirCCEbVZV8CTtkxIlVvsv3muJIAVMTHXiXqyc5zkYEu_ONKT40va6LO1TTmuJIgnYDdf4IauNPrqGL0pqV8S7wijzbRu89PlKh7cdxVcMqll1kYNG8e8Oy-dy4Ftdm6rYT9ZMn2IlwhqOYW0ekq6d9NnIYN_xGqSaNcN5s4N1iiVJMk3GV',
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDccMXAIYxuO2yvwTqN8m4d8QLiy48sfir-uvPIXURN6mHE9KnhgzWARsOBlK9Mr7YK53ev5SNz0PPuGxVRLSblgomVrpZxwnyuJUkmY-Ozf1hCAotsXBatMbvNCyS04ZJlkaYgvTJNROZ-js6VboTaV_3ll-A3k6pNoAAipu9StjstMbS0Laznf_O50IKrmUFaecZ-yeGpZtc8RnmuWeJ_Qsqe53K1Vl0UbckdWbcqY249cXQYBmdHpG1v0uiCq0Ly6hPEjF90b3le'
  },
  {
    id: 'pair-7',
    categoryId: 'facial-harmony',
    title: 'Subdermal Lifting & Tone',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLv5evIx7Bexs-9iJGxOP9dKFElgqCjw3duyD5PU_MlEubT0SyTO7PuZhJtmqUZf6JcUhS8jDhV8HW0kBhWUb4MYYalT72IO5pVBeVZs2593mjjAC6tI1ZOA1a9xGgg-M5J5waWMYO9uVD4zle9guZj31tQOME7032wvttEoahsd7HhWFooW0oUTyDgrytGK4oKIN0d2mGO5oLnx-NQ5sF7-OZHtA3a9_sCrUegKiXGZwpy_05469C2zVgo'
  },
  {
    id: 'pair-4',
    categoryId: 'clinical-hair',
    title: 'Vertical Hair Follicle Density',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt4dLQWWadBxtTzBpplagu2J9MUvwKtNJkgViQjChgH82bAH_iO6gF6p-TSVCSZ2jViPeml_xgEZ7Iq6F_NEVjRCtxJ7KhPFDOYT5byV1VJXaplQwCg6QybxEWi8wHT_QpGlWU8xBqFyhtpBZao172mEYVtF0UVKABJBqCwM5SU30IS2ON1eLnGldXQRWwBGjBQU7aTfniH71oyqdfhnTK_-tGbm5YfhUmEG8QjW9Nsh3NLL2fC3UAJ83TDu-VoVMkNkLRQQdclSVR',
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkakM8tbhNmtYeKmoQBAAzTei0SDwQVg3jf4IfrTGNP8I8WmzYu8BL-eZUD6ccSBm9fY3UgWCvjrJX1rBeyzCvPpnD3Fa7-r7rI5pw8wP459wQIwtGxvpKIrc7paJJ_LgbbcH6SrOD3cwg6mM0x7ZahhhPNgqR7PkR4wXem9rqOpBJQQq8lP3Zmij233vHOLihq3N7Pxxs00WXjWevFzHxFsHzlNU6_pv9H7yfM-0JpAPd-C0UGYVLJ7BZ6WyP8HWAt41DR1q8v6Hd'
  },
  {
    id: 'pair-8',
    categoryId: 'anti-aging',
    title: 'Micro-Focused SMAS Tightening',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM'
  }
];

export default function BeforeAfterGallery() {
  const [config, setConfig] = useState<BeforeAfterGalleryConfig | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setConfig(getBeforeAfterGalleryConfig());
  }, []);

  const allCategories = useMemo(() => {
    if (!config?.categories) return [{ id: 'all', name: 'All' }];
    return [{ id: 'all', name: 'All' }, ...config.categories];
  }, [config]);

  // Combine customized store pairs with comprehensive cases pool
  const currentCategoryData = useMemo(() => {
    // If admin custom pairs exist, use them
    const configuredPairs = config?.categories 
      ? (activeCategory === 'all' 
          ? config.categories.flatMap(c => c.pairs) 
          : (config.categories.find(c => c.id === activeCategory)?.pairs || []))
      : [];

    if (configuredPairs.length >= 6) {
      return configuredPairs;
    }

    // Default to comprehensive pool
    if (activeCategory === 'all') {
      return COMPREHENSIVE_GALLERY_PAIRS;
    }
    const matched = COMPREHENSIVE_GALLERY_PAIRS.filter(p => p.categoryId === activeCategory);
    return matched.length > 0 ? matched : COMPREHENSIVE_GALLERY_PAIRS.slice(0, 4);
  }, [config, activeCategory]);

  // 2 pairs per page for optimal viewing and clear pagination
  const itemsPerPage = 2;
  const totalPages = Math.ceil(currentCategoryData.length / itemsPerPage) || 1;

  // Reset page when category changes
  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visiblePairs = currentCategoryData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section
      id="gallery"
      className="pt-10 pb-6 sm:pt-16 sm:pb-12 md:py-28 bg-luxury-secondary overflow-hidden relative border-y border-luxury-border"
    >
      {/* Subtle aesthetic canvas highlights for floating depth */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-luxury-primary rounded-full blur-[100px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-luxury-primary rounded-full blur-[100px] pointer-events-none opacity-50" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Title Block (Reduced mobile margins) */}
        <div className="text-center mb-6 sm:mb-10 md:mb-14 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-light text-luxury-text mb-3 sm:mb-5 leading-tight">
            {config?.heading || "Before & After Results"}
          </h2>
          <p className="font-sans text-xs sm:text-sm md:text-base text-luxury-subtext font-light max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-6">
            {config?.description || "Witness the transformative journeys of our patients. These unretouched, real clinical cases illustrate the precision-guided results we achieve daily."}
          </p>
          <div className="w-12 h-[1px] bg-luxury-gold mx-auto" />
        </div>

        {/* Category Selector Tabs (Reduced mobile margins) */}
        <div
          className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-x-visible justify-start md:justify-center gap-2 sm:gap-3 mb-6 sm:mb-10 md:mb-12 max-w-3xl mx-auto pb-2 md:pb-0 px-2 md:px-0 snap-x no-scrollbar"
        >
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-sans text-[10px] sm:text-xs font-normal tracking-[0.12em] uppercase border transition-all duration-300 shrink-0 snap-center whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-black text-white border-black shadow-xs scale-102 font-medium'
                  : 'bg-white text-luxury-subtext border-luxury-border hover:text-luxury-text hover:bg-luxury-card'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Comparison Showcase Grid (Exact Treatment Services Page Frames) */}
        <div className="min-h-[300px] sm:min-h-[360px] md:min-h-[420px]">
          <AnimatePresence mode="wait">
            {visiblePairs.length > 0 ? (
              <motion.div
                key={`${activeCategory}-${currentPage}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 sm:gap-y-10 md:gap-y-12 max-w-5xl mx-auto justify-items-center"
              >
                {visiblePairs.map((item) => (
                  <TreatmentServiceFrameComparison
                    key={item.id}
                    title={item.title}
                    beforeImage={item.beforeImage}
                    afterImage={item.afterImage}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12 text-luxury-muted font-sans font-light">
                No items in this category.
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Universal Pagination (Same type as Specialist Areas) */}
        {totalPages > 1 && (
          <div className="pt-4 sm:pt-8 md:pt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </section>
  );
}
