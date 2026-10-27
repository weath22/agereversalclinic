"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getBeforeAfterGalleryConfig, fetchRemoteBeforeAfterGalleryConfig } from '../lib/adminStore';
import { BeforeAfterGalleryConfig, BeforeAfterPair } from '../types';
import Pagination from './Pagination';

interface TreatmentServiceFrameComparisonProps {
  pair: BeforeAfterPair;
}

// Exactly mirrors the Treatment Services Page before/after frame styling with Google Image SEO attributes
function TreatmentServiceFrameComparison({ pair }: TreatmentServiceFrameComparisonProps) {
  const {
    title,
    beforeImage,
    afterImage,
    beforeAltText,
    afterAltText,
    seoTitle,
    duration,
    sessions,
    linkedTreatmentTitle,
  } = pair;

  const resolvedBeforeAlt =
    beforeAltText || `${title} Before Treatment at Age Reversal Clinics London`;
  const resolvedAfterAlt =
    afterAltText || `${title} After Treatment Result at Age Reversal Clinics London`;
  const resolvedSeoTitle =
    seoTitle || `${title} — Before & After Result | Age Reversal Clinics`;

  return (
    <div className="flex flex-col items-center space-y-3 sm:space-y-4 w-full">
      {/* Title / Case label header */}
      <div className="flex flex-col items-center gap-1 px-2 text-center">
        <div className="text-xs sm:text-sm font-serif font-medium text-silver-900 tracking-wide">
          {title}
        </div>
        {(linkedTreatmentTitle || duration || sessions) && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-sans text-slate-700">
            {linkedTreatmentTitle && (
              <span className="bg-white/80 border border-slate-900/15 px-2 py-0.5 rounded-full font-medium">
                {linkedTreatmentTitle}
              </span>
            )}
            {(duration || sessions) && (
              <span className="bg-slate-950/10 px-2 py-0.5 rounded-full font-medium">
                {[duration, sessions ? `${sessions} ${sessions === 1 ? 'Session' : 'Sessions'}` : null]
                  .filter(Boolean)
                  .join(' • ')}
              </span>
            )}
          </div>
        )}
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
              alt={resolvedBeforeAlt}
              title={`${resolvedSeoTitle} (Before)`}
              loading="lazy"
              decoding="async"
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
              alt={resolvedAfterAlt}
              title={`${resolvedSeoTitle} (After)`}
              loading="lazy"
              decoding="async"
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

// Comprehensive clinical before-after pairs pool aligned with the 24 specialist services
const COMPREHENSIVE_GALLERY_PAIRS: Array<BeforeAfterPair & { categoryId: string }> = [
  {
    id: 'pair-1',
    categoryId: 'facial-skin-care',
    treatmentGroupId: 'facial-skin-care',
    linkedTreatmentId: 'facial-skin-care',
    linkedTreatmentTitle: 'Facial skin care',
    title: 'Facial skin care',
    duration: '12 Weeks',
    sessions: 3,
    beforeAltText: 'Facial skin care Before Treatment at Age Reversal Clinics London',
    afterAltText: 'Facial skin care After 12 Weeks at Age Reversal Clinics London',
    seoTitle: 'Facial skin care Before & After | Age Reversal Clinics',
    seoKeywords: ['facial skin care before and after', 'anti-aging clinic london', 'clinical facial results'],
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6YRX4oWEimDRlPfT4ZvP49QVjagike9HlAOT7FsLhwf61UL4dCKCGWr1FS7SmMqMhd9VheV3RuR4bKmR_H3dRMFEAxUvuwj56dIFiriv8niGvOiz7XVef6Gjx4h3iHxaFayLl_g4p2ViKYOGEKxMw4bAR7W5VL-rkDMyy7LQjrabplnGUsrY6j9fECzUiFYmk_OZ_-hBZJAePOaKJjK0lqqjd7ahusnbsXJYKmIG5Rs5lmafypBuU_b9wqYQQG0v8O8BfCz2mokhu',
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtnTWTfvtjmgPs1n1Q2b5gdUnZqNuGV3e-_ZLF0KZFSWWrFhA3eAIX2iTTuaY-hDvVwQ5PKReB6fFMP3tq1WnzmcGJr11CXLsLkYmYd8zLGLdL5zETq6wohVWzqLcykLevZUPnJ_LG55HukqRiTUllO8pE80UJFXvPUytiYATX5fbzVCDVz_cqX20l_6dKdFzb4UaffXMlUAbDiZwQL531mZiVM9lUuSozSA_-uLXJhit8mpHzT04T8XOmmy7yIYQyPOkWqJTIqPfO'
  },
  {
    id: 'pair-5',
    categoryId: 'profhilo-2ml',
    treatmentGroupId: 'profhilo-2ml',
    linkedTreatmentId: 'profhilo-2ml',
    linkedTreatmentTitle: 'Profhilo 2ml',
    title: 'Profhilo 2ml',
    duration: '8 Weeks',
    sessions: 2,
    beforeAltText: 'Profhilo 2ml Before Treatment at Age Reversal Clinics London',
    afterAltText: 'Profhilo 2ml After 8 Weeks at Age Reversal Clinics London',
    seoTitle: 'Profhilo 2ml Before & After Result | Age Reversal Clinics',
    seoKeywords: ['profhilo 2ml before and after london', 'anti-aging treatment results', 'collagen bio-remodeling'],
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQHcq9zpePKkMqtIMFzx_zJA6A2MHoEn6csMvjhOOX7ANTgntEGIHbHHzkJdrRGuvr_rnNYa6j_vcZm7V9bkSv83qNQwd18XJJA14YTUOLU2diwqx3hP_e-l8axRA5ZOsfN1xGiRO0pPe2sb4cNQEz8psyAxBRjvefn1MvexT-2iAwkVKIyT8R_56LKMScwW7_sMvuBzMGXxdp0I1cFNoqfp7K5RhhrtrwcfrUPw1dRPmX60Zc0esbeUgaFqwO959IBqnu8sf8OA4w',
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZoLjpjMEmJNM6EwzVC9AzZEWfQUVa-TmVyM-NgPL8ONCjzwY7nZ6rFqOxJ9jyK0OMnlIij8h8SOt93jaHfSglwGqtwAN3uabUuoux0yNyPzieFFX7iyB4YhjLSsBzd2BRDjEDVB1RlXcG4VC8SswApL8QbBnPLshzCzMX8LSdFYZsa0PRI6MM6b7I67HIl-B6YLhZAH5ZI9mcghNQsybRemIqmq4LWl9BCKjn5KaTyU1RyMrHYkwMgx1ABZOJ1-OJiLkjF-5mIKY0'
  },
  {
    id: 'pair-2',
    categoryId: 'co2-laser-from',
    treatmentGroupId: 'co2-laser-from',
    linkedTreatmentId: 'co2-laser-from',
    linkedTreatmentTitle: 'Co@ Laser from',
    title: 'Co@ Laser from',
    duration: '12 Weeks',
    sessions: 3,
    beforeAltText: 'Co@ Laser from Before Treatment at Age Reversal Clinics London',
    afterAltText: 'Co@ Laser from After Treatment at Age Reversal Clinics London',
    seoTitle: 'Co@ Laser from Before & After | Age Reversal Clinics',
    seoKeywords: ['co2 laser before and after', 'skin resurfacing london', 'dermal texture revision'],
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKPf3nijQRz9NaEd_b-5EiczAejYyrgh_dwMC6S-1-7Hi8EJJnt8_x2x-i1qG-qJ0BxvXbk_PeIeusHvMggQrPf2ijjCJ-yYtr-Ur19sJw4_NIIAlLMv1S2ct_OUVp3CJNba1hCLXrrPOcfhQAQUcgqZJFcuUL6Q4KXUwM1ALRAeo6Bb79xdI4FoLRUFAP9_MlbZ8tUedBAnuVrheDWpnRtLnB17gtdOx3OFGMbTVs5jhXXnZD6b-y7OCBnlBNOtqOPMcKxAdzDKRk',
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFNbqNx3wVVcZoA9IP87KJkDnMZI-8uRSd-RL2-LhuxC6ADEkgMcpBDJ22CU3U7a_ZOllNge5XasdFvVaBYUhCDohAZdRi0HT1ymJ1s_FMyiXt8pJl7NGhaLkKATrZlXl3B2mFW01fD4Mzp3ixyyLcDfCdjXdPi58MzBZ-GTgGk7w7Ks96hydwAbc4rURmQ3Pel8YEcOvxIX5UbwIKvB4OdEuyDc-z_RnH-USDoP7hJ2AJkw4zTdCS7FDF6Vo4RFbWikgnECIa4gKP'
  },
  {
    id: 'pair-6',
    categoryId: 'salmon-sperm-injection',
    treatmentGroupId: 'salmon-sperm-injection',
    linkedTreatmentId: 'salmon-sperm-injection',
    linkedTreatmentTitle: 'Salmon sperm injection',
    title: 'Salmon sperm injection',
    duration: '8 Weeks',
    sessions: 3,
    beforeAltText: 'Salmon sperm injection Before Treatment at Age Reversal Clinics London',
    afterAltText: 'Salmon sperm injection After Treatment at Age Reversal Clinics London',
    seoTitle: 'Salmon sperm injection Before & After | Age Reversal Clinics',
    seoKeywords: ['salmon sperm injection before and after', 'polynucleotides london', 'skin texture repair'],
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY'
  },
  {
    id: 'pair-3',
    categoryId: 'dermal-fillers-1ml',
    treatmentGroupId: 'dermal-fillers-1ml',
    linkedTreatmentId: 'dermal-fillers-1ml',
    linkedTreatmentTitle: 'Dermal Fillers-1ml',
    title: 'Dermal Fillers-1ml',
    duration: 'Single Session',
    sessions: 1,
    beforeAltText: 'Dermal Fillers-1ml Before Treatment at Age Reversal Clinics London',
    afterAltText: 'Dermal Fillers-1ml After Treatment at Age Reversal Clinics London',
    seoTitle: 'Dermal Fillers-1ml Before & After | Age Reversal Clinics',
    seoKeywords: ['dermal fillers 1ml before and after london', 'facial harmonisation results', 'lip and chin filler london'],
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD20NLhroXmHS02eweFz9RBF-OhZ1RaQuMYe3uKrQ3iyvZ-roWLw57bJ33sw80W5DRjj47x5XfDBbMjHImuC7GRyDB99DirCCEbVZV8CTtkxIlVvsv3muJIAVMTHXiXqyc5zkYEu_ONKT40va6LO1TTmuJIgnYDdf4IauNPrqGL0pqV8S7wijzbRu89PlKh7cdxVcMqll1kYNG8e8Oy-dy4Ftdm6rYT9ZMn2IlwhqOYW0ekq6d9NnIYN_xGqSaNcN5s4N1iiVJMk3GV',
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDccMXAIYxuO2yvwTqN8m4d8QLiy48sfir-uvPIXURN6mHE9KnhgzWARsOBlK9Mr7YK53ev5SNz0PPuGxVRLSblgomVrpZxwnyuJUkmY-Ozf1hCAotsXBatMbvNCyS04ZJlkaYgvTJNROZ-js6VboTaV_3ll-A3k6pNoAAipu9StjstMbS0Laznf_O50IKrmUFaecZ-yeGpZtc8RnmuWeJ_Qsqe53K1Vl0UbckdWbcqY249cXQYBmdHpG1v0uiCq0Ly6hPEjF90b3le'
  },
  {
    id: 'pair-7',
    categoryId: 'morpheus8-treatment',
    treatmentGroupId: 'morpheus8-treatment',
    linkedTreatmentId: 'morpheus8-treatment',
    linkedTreatmentTitle: 'Morpheus8 treatment',
    title: 'Morpheus8 treatment',
    duration: '12 Weeks',
    sessions: 3,
    beforeAltText: 'Morpheus8 treatment Before Treatment at Age Reversal Clinics London',
    afterAltText: 'Morpheus8 treatment After Treatment at Age Reversal Clinics London',
    seoTitle: 'Morpheus8 treatment Before & After | Age Reversal Clinics',
    seoKeywords: ['morpheus8 treatment before and after london', 'jawline tightening results', 'rf microneedling london'],
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLv5evIx7Bexs-9iJGxOP9dKFElgqCjw3duyD5PU_MlEubT0SyTO7PuZhJtmqUZf6JcUhS8jDhV8HW0kBhWUb4MYYalT72IO5pVBeVZs2593mjjAC6tI1ZOA1a9xGgg-M5J5waWMYO9uVD4zle9guZj31tQOME7032wvttEoahsd7HhWFooW0oUTyDgrytGK4oKIN0d2mGO5oLnx-NQ5sF7-OZHtA3a9_sCrUegKiXGZwpy_05469C2zVgo'
  },
  {
    id: 'pair-4',
    categoryId: 'platelet-rich-plasma-prp',
    treatmentGroupId: 'platelet-rich-plasma-prp',
    linkedTreatmentId: 'platelet-rich-plasma-prp',
    linkedTreatmentTitle: 'Platelet-Rich Plasma (PRP)',
    title: 'Platelet-Rich Plasma (PRP)',
    duration: '20 Weeks',
    sessions: 4,
    beforeAltText: 'Platelet-Rich Plasma (PRP) Before Treatment at Age Reversal Clinics London',
    afterAltText: 'Platelet-Rich Plasma (PRP) After 20 Weeks at Age Reversal Clinics London',
    seoTitle: 'Platelet-Rich Plasma (PRP) Before & After | Age Reversal Clinics',
    seoKeywords: ['platelet rich plasma prp before and after london', 'prp hair loss results', 'scalp density treatment'],
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt4dLQWWadBxtTzBpplagu2J9MUvwKtNJkgViQjChgH82bAH_iO6gF6p-TSVCSZ2jViPeml_xgEZ7Iq6F_NEVjRCtxJ7KhPFDOYT5byV1VJXaplQwCg6QybxEWi8wHT_QpGlWU8xBqFyhtpBZao172mEYVtF0UVKABJBqCwM5SU30IS2ON1eLnGldXQRWwBGjBQU7aTfniH71oyqdfhnTK_-tGbm5YfhUmEG8QjW9Nsh3NLL2fC3UAJ83TDu-VoVMkNkLRQQdclSVR',
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkakM8tbhNmtYeKmoQBAAzTei0SDwQVg3jf4IfrTGNP8I8WmzYu8BL-eZUD6ccSBm9fY3UgWCvjrJX1rBeyzCvPpnD3Fa7-r7rI5pw8wP459wQIwtGxvpKIrc7paJJ_LgbbcH6SrOD3cwg6mM0x7ZahhhPNgqR7PkR4wXem9rqOpBJQQq8lP3Zmij233vHOLihq3N7Pxxs00WXjWevFzHxFsHzlNU6_pv9H7yfM-0JpAPd-C0UGYVLJ7BZ6WyP8HWAt41DR1q8v6Hd'
  },
  {
    id: 'pair-8',
    categoryId: 'emface-skin-tightening-and-lifting',
    treatmentGroupId: 'emface-skin-tightening-and-lifting',
    linkedTreatmentId: 'emface-skin-tightening-and-lifting',
    linkedTreatmentTitle: 'Emface skin tightening and lifting',
    title: 'Emface skin tightening and lifting',
    duration: '16 Weeks',
    sessions: 3,
    beforeAltText: 'Emface skin tightening and lifting Before Treatment at Age Reversal Clinics London',
    afterAltText: 'Emface skin tightening and lifting After Treatment at Age Reversal Clinics London',
    seoTitle: 'Emface skin tightening and lifting Before & After | Age Reversal Clinics',
    seoKeywords: ['emface skin tightening and lifting before and after london', 'non-surgical facelift results', 'facial lifting clinic'],
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
    if (typeof window !== 'undefined' && !window.localStorage.getItem('homepage_gallery_config_v6')) {
      fetchRemoteBeforeAfterGalleryConfig().then((remote) => {
        if (remote) setConfig(remote);
      });
    }
    const handleGalleryUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<BeforeAfterGalleryConfig>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      } else {
        setConfig(getBeforeAfterGalleryConfig());
      }
    };
    window.addEventListener('before_after_gallery_updated', handleGalleryUpdate);
    window.addEventListener('master_services_updated', handleGalleryUpdate);
    window.addEventListener('storage', handleGalleryUpdate);
    return () => {
      window.removeEventListener('before_after_gallery_updated', handleGalleryUpdate);
      window.removeEventListener('master_services_updated', handleGalleryUpdate);
      window.removeEventListener('storage', handleGalleryUpdate);
    };
  }, []);

  const allCategories = useMemo(() => {
    if (!config?.categories) return [{ id: 'all', name: 'All' }];
    return [{ id: 'all', name: 'All' }, ...config.categories];
  }, [config]);

  // Render admin-configured pairs directly (all 8 default clinical pairs live in DEFAULT_GALLERY_CONFIG so edits, hiding, and deletions take effect immediately)
  const currentCategoryData = useMemo(() => {
    if (config?.categories) {
      const pairs =
        activeCategory === 'all'
          ? config.categories.flatMap((c) => c.pairs || [])
          : config.categories.find((c) => c.id === activeCategory)?.pairs || [];
      return pairs.filter((p) => !p.hidden);
    }

    return activeCategory === 'all'
      ? COMPREHENSIVE_GALLERY_PAIRS
      : COMPREHENSIVE_GALLERY_PAIRS.filter((p) => p.categoryId === activeCategory);
  }, [config, activeCategory]);

  // Schema.org/ImageObject Structured Data for Google Image Search
  const structuredDataJson = useMemo(() => {
    const imageObjects = currentCategoryData.flatMap((pair) => {
      const keywordsStr = (pair.seoKeywords || []).join(', ');
      return [
        {
          '@type': 'ImageObject',
          contentUrl: pair.beforeImage,
          name: pair.seoTitle ? `${pair.seoTitle} (Before)` : `${pair.title} Before Treatment`,
          description:
            pair.beforeAltText ||
            `${pair.title} Before Treatment at Age Reversal Clinics London`,
          keywords: keywordsStr || `${pair.title}, before treatment, Age Reversal Clinics`,
          creator: {
            '@type': 'MedicalBusiness',
            name: 'Age Reversal Clinics',
          },
        },
        {
          '@type': 'ImageObject',
          contentUrl: pair.afterImage,
          name: pair.seoTitle ? `${pair.seoTitle} (After)` : `${pair.title} After Treatment`,
          description:
            pair.afterAltText ||
            `${pair.title} After Treatment Result at Age Reversal Clinics London`,
          keywords: keywordsStr || `${pair.title}, after treatment result, Age Reversal Clinics`,
          creator: {
            '@type': 'MedicalBusiness',
            name: 'Age Reversal Clinics',
          },
        },
      ];
    });

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: config?.heading || 'Age Reversal Clinics Before & After Clinical Results',
      description:
        config?.description ||
        'Verified patient before and after clinical photography at Age Reversal Clinics London.',
      image: imageObjects,
    });
  }, [currentCategoryData, config]);

  // 4 pairs per page to display 4 cards at a time
  const itemsPerPage = 4;
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
      className="pt-10 pb-6 sm:pt-16 sm:pb-12 md:py-28 bg-transparent overflow-hidden relative"
    >
      {/* Google Image Search Schema.org ImageObject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredDataJson }}
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Title Block (Reduced mobile margins) */}
        <div className="text-center mb-6 sm:mb-10 md:mb-14 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-light text-slate-950 mb-3 sm:mb-5 leading-tight">
            {config?.heading || "Before & After Results"}
          </h2>
          <p className="font-sans text-xs sm:text-sm md:text-base text-slate-900 font-normal max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-6">
            {config?.description || "Witness the transformative journeys of our patients. These unretouched, real clinical cases illustrate the precision-guided results we achieve daily."}
          </p>
          <div className="w-12 h-[1.5px] bg-slate-950 mx-auto" />
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
                  ? 'bg-slate-950 text-white border-black shadow-sm scale-102 font-medium'
                  : 'bg-white/85 backdrop-blur-md text-slate-800 border-white/60 hover:text-black hover:bg-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Comparison Showcase Grid (Exact Treatment Services Page Frames) */}
        <div className="min-h-[360px] sm:min-h-[460px]">
          <AnimatePresence mode="wait">
            {visiblePairs.length > 0 ? (
              <motion.div
                key={`${activeCategory}-${currentPage}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-10 gap-y-8 sm:gap-y-10 md:gap-y-14 max-w-6xl mx-auto justify-items-center"
              >
                {visiblePairs.map((item) => (
                  <TreatmentServiceFrameComparison
                    key={item.id}
                    pair={item}
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
