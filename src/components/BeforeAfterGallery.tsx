"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  getBeforeAfterGalleryConfig,
  fetchRemoteBeforeAfterGalleryConfig,
  getMasterServices,
  loadSiteCustomizations,
} from '../lib/adminStore';
import {
  CLINICAL_TRANSFORMATION_CASES,
  ADMIN_SYNCED_TRANSFORMATION_CASES,
  EXISTING_BEFORE_AFTER_TREATMENT_GROUPS,
} from '../data/transformationsData';
import { BeforeAfterGalleryConfig, BeforeAfterPair, SpecialistArea } from '../types';
import { ClinicImageWithPlaceholder } from './common/ClinicImageWithPlaceholder';
import Pagination from './Pagination';

type EnrichedBeforeAfterPair = BeforeAfterPair & {
  categoryId?: string;
  categoryName?: string;
};

interface TreatmentServiceFrameComparisonProps {
  pair: EnrichedBeforeAfterPair;
  onSelect?: (pair: EnrichedBeforeAfterPair) => void;
}

// Exactly mirrors the Treatment Services Page before/after frame styling with Google Image SEO attributes
function TreatmentServiceFrameComparison({ pair, onSelect }: TreatmentServiceFrameComparisonProps) {
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
    <div
      onClick={() => onSelect?.(pair)}
      className="flex flex-col items-center space-y-3 sm:space-y-4 w-full"
    >
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
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="bg-white p-2.5 pb-9 sm:p-3.5 sm:pb-13 md:p-4 md:pb-14 rounded-xs shadow-[0_12px_32px_rgba(0,0,0,0.07)] border border-neutral-100/90 flex flex-col relative group cursor-pointer flex-1 max-w-[145px] sm:max-w-[210px] md:max-w-[230px] lg:max-w-[260px] z-10 transform-gpu will-change-transform"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-50 border border-neutral-200/50 rounded-xs">
            <ClinicImageWithPlaceholder
              src={beforeImage}
              alt={resolvedBeforeAlt}
              title={`${resolvedSeoTitle} (Before)`}
              loading="lazy"
              logoSize="sm"
              showBrandText={false}
              containerClassName="relative w-full h-full overflow-hidden bg-neutral-50 flex items-center justify-center"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 transform-gpu"
              imgStyle={{ transform: 'translateZ(0)' }}
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
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="bg-white p-2.5 pb-9 sm:p-3.5 sm:pb-13 md:p-4 md:pb-14 rounded-xs shadow-[0_12px_32px_rgba(0,0,0,0.07)] border border-neutral-100/90 flex flex-col relative group cursor-pointer flex-1 max-w-[145px] sm:max-w-[210px] md:max-w-[230px] lg:max-w-[260px] z-20 transform-gpu will-change-transform"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-50 border border-neutral-200/50 rounded-xs">
            <ClinicImageWithPlaceholder
              src={afterImage}
              alt={resolvedAfterAlt}
              title={`${resolvedSeoTitle} (After)`}
              loading="lazy"
              logoSize="sm"
              showBrandText={false}
              containerClassName="relative w-full h-full overflow-hidden bg-neutral-50 flex items-center justify-center"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 transform-gpu"
              imgStyle={{ transform: 'translateZ(0)' }}
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

function normalizeCategoryKey(val?: string): string {
  return (val || '').trim().toLowerCase();
}

function doesPairMatchCategory(
  pair: EnrichedBeforeAfterPair,
  catId: string,
  catName?: string
): boolean {
  if (!pair || !catId) return false;
  if (catId === 'all') return true;

  const targetId = normalizeCategoryKey(catId);
  const targetName = normalizeCategoryKey(catName);

  if (
    normalizeCategoryKey(pair.categoryId) === targetId ||
    normalizeCategoryKey(pair.treatmentGroupId) === targetId ||
    normalizeCategoryKey(pair.linkedTreatmentId) === targetId
  ) {
    return true;
  }

  if (targetName) {
    if (
      normalizeCategoryKey(pair.title) === targetName ||
      normalizeCategoryKey(pair.linkedTreatmentTitle) === targetName ||
      normalizeCategoryKey(pair.categoryName) === targetName
    ) {
      return true;
    }
  }

  return false;
}

export default function BeforeAfterGallery() {
  const [config, setConfig] = useState<BeforeAfterGalleryConfig | null>(() =>
    getBeforeAfterGalleryConfig()
  );
  const [masterServices, setMasterServices] = useState<SpecialistArea[]>(() => getMasterServices());
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedModalPair, setSelectedModalPair] = useState<EnrichedBeforeAfterPair | null>(null);

  useEffect(() => {
    setConfig(getBeforeAfterGalleryConfig());
    setMasterServices(getMasterServices());

    // Hydrate siteCustomizations.json first, then fetch latest remote config from server
    loadSiteCustomizations().then(() => {
      setConfig(getBeforeAfterGalleryConfig());
      setMasterServices(getMasterServices());
      fetchRemoteBeforeAfterGalleryConfig().then((remote) => {
        if (remote) setConfig(remote);
      });
    });

    const handleGalleryUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<BeforeAfterGalleryConfig>;
      if (customEvent.detail && customEvent.detail.categories) {
        setConfig(customEvent.detail);
      } else {
        setConfig(getBeforeAfterGalleryConfig());
      }
      setMasterServices(getMasterServices());
    };

    window.addEventListener('before_after_gallery_updated', handleGalleryUpdate);
    window.addEventListener('clinic_before_after_updated', handleGalleryUpdate);
    window.addEventListener('master_services_updated', handleGalleryUpdate);
    window.addEventListener('storage', handleGalleryUpdate);
    return () => {
      window.removeEventListener('before_after_gallery_updated', handleGalleryUpdate);
      window.removeEventListener('clinic_before_after_updated', handleGalleryUpdate);
      window.removeEventListener('master_services_updated', handleGalleryUpdate);
      window.removeEventListener('storage', handleGalleryUpdate);
    };
  }, []);

  const [pillsPage, setPillsPage] = useState(1);
  const measureContainerRef = useRef<HTMLDivElement>(null);

  // Merge pairs from galleryConfig, ADMIN_SYNCED_TRANSFORMATION_CASES, CLINICAL_TRANSFORMATION_CASES, and COMPREHENSIVE_GALLERY_PAIRS
  const allMergedVisiblePairs = useMemo<EnrichedBeforeAfterPair[]>(() => {
    const hiddenIds = new Set<string>();
    const hiddenGroupIds = new Set<string>();

    (config?.categories || []).forEach((cat) => {
      (cat.pairs || []).forEach((p) => {
        if (p?.hidden && p.id) {
          hiddenIds.add(p.id);
          if (p.treatmentGroupId) hiddenGroupIds.add(`${p.treatmentGroupId}::${p.beforeImage}`);
        }
      });
    });

    const groupLookup = new Map<string, string>();
    EXISTING_BEFORE_AFTER_TREATMENT_GROUPS.forEach((g) => groupLookup.set(g.id, g.name));
    (masterServices || []).forEach((s) => groupLookup.set(s.id, s.title));
    (config?.categories || []).forEach((c) => {
      if (c?.id && c?.name) groupLookup.set(c.id, c.name);
    });

    const defaultPairMap = new Map<string, BeforeAfterPair>(
      COMPREHENSIVE_GALLERY_PAIRS.map((p) => [p.id, p])
    );
    const defaultCaseIds = new Set<string>(CLINICAL_TRANSFORMATION_CASES.map((c) => c.id));

    // 1. Admin/config pairs (split into custom/modified pairs first, unmodified default pairs after)
    const allConfigPairs: EnrichedBeforeAfterPair[] = (config?.categories || []).flatMap((cat) =>
      (cat.pairs || [])
        .filter((p) => Boolean(p && !p.hidden && p.id))
        .map((p) => {
          const resolvedCatId = p.treatmentGroupId || p.linkedTreatmentId || cat.id;
          const resolvedName =
            groupLookup.get(resolvedCatId) || cat.name || p.linkedTreatmentTitle || p.title;
          return {
            ...p,
            categoryId: resolvedCatId,
            categoryName: resolvedName,
            treatmentGroupId: p.treatmentGroupId || resolvedCatId,
            linkedTreatmentId: p.linkedTreatmentId || resolvedCatId,
            linkedTreatmentTitle: p.linkedTreatmentTitle || resolvedName,
          };
        })
    );

    const isUnmodifiedDefaultPair = (p: EnrichedBeforeAfterPair): boolean => {
      if (defaultCaseIds.has(p.id)) return true;
      const def = defaultPairMap.get(p.id);
      if (!def) return false;
      if (p.updatedAt) return false;
      return def.beforeImage === p.beforeImage && def.afterImage === p.afterImage;
    };

    const customConfigPairs = allConfigPairs.filter((p) => !isUnmodifiedDefaultPair(p));
    const defaultConfigPairs = allConfigPairs.filter((p) => isUnmodifiedDefaultPair(p));

    const mapTransformationCaseToPair = (c: (typeof CLINICAL_TRANSFORMATION_CASES)[number]): EnrichedBeforeAfterPair => {
      const resolvedCatId = c.treatmentGroupId || c.linkedTreatmentId || c.id;
      const resolvedName = groupLookup.get(resolvedCatId) || c.tag || c.title;
      return {
        id: c.id,
        categoryId: resolvedCatId,
        categoryName: resolvedName,
        treatmentGroupId: resolvedCatId,
        linkedTreatmentId: c.linkedTreatmentId || resolvedCatId,
        linkedTreatmentTitle: resolvedName,
        title: resolvedName || c.title,
        duration: c.duration,
        sessions: c.sessions,
        beforeImage: c.beforeImage,
        afterImage: c.afterImage,
        beforeAltText: c.beforeAltText,
        afterAltText: c.afterAltText,
        seoTitle: c.seoTitle,
        seoKeywords: c.seoKeywords,
        featured: c.featured,
        updatedAt: c.updatedAt,
      };
    };

    // 2. Synced admin transformation cases (placed before defaults, matching TransformationsPageView)
    const syncedAdminPairs: EnrichedBeforeAfterPair[] = ADMIN_SYNCED_TRANSFORMATION_CASES
      .filter((c) => Boolean(c && !c.hidden && c.id && !hiddenIds.has(c.id)))
      .map(mapTransformationCaseToPair);

    // 3. Static clinical transformation cases
    const clinicalStaticPairs: EnrichedBeforeAfterPair[] = CLINICAL_TRANSFORMATION_CASES
      .filter((c) => Boolean(c && !c.hidden && c.id && !hiddenIds.has(c.id)))
      .map(mapTransformationCaseToPair);

    // 4. Fallback comprehensive pairs
    const fallbackPairs: EnrichedBeforeAfterPair[] = COMPREHENSIVE_GALLERY_PAIRS.filter(
      (p) => Boolean(p && !p.hidden && p.id && !hiddenIds.has(p.id))
    ).map((p) => ({
      ...p,
      categoryName: groupLookup.get(p.categoryId) || p.linkedTreatmentTitle || p.title,
    }));

    const combined = [
      ...customConfigPairs,
      ...syncedAdminPairs,
      ...defaultConfigPairs,
      ...clinicalStaticPairs,
      ...fallbackPairs,
    ];
    const seenIds = new Set<string>();
    const seenGroupSignature = new Set<string>();

    return combined.filter((item) => {
      if (!item || !item.id || hiddenIds.has(item.id)) return false;
      const sig = `${item.treatmentGroupId || item.categoryId || ''}::${item.beforeImage || ''}::${item.afterImage || ''}`;
      if (
        item.treatmentGroupId &&
        hiddenGroupIds.has(`${item.treatmentGroupId}::${item.beforeImage}`)
      ) {
        return false;
      }
      if (seenIds.has(item.id) || (item.beforeImage && seenGroupSignature.has(sig))) {
        return false;
      }
      seenIds.add(item.id);
      if (item.beforeImage) seenGroupSignature.add(sig);
      return true;
    });
  }, [config, masterServices]);

  // Filter category tabs so ONLY categories that contain at least 1 visible Before & After pair are shown
  const allCategories = useMemo(() => {
    const candidateMap = new Map<string, { id: string; name: string }>();

    (config?.categories || []).forEach((c) => {
      if (c && c.id && c.name) {
        candidateMap.set(c.id, { id: c.id, name: c.name });
      }
    });

    allMergedVisiblePairs.forEach((p) => {
      const catId = p.categoryId || p.treatmentGroupId || p.linkedTreatmentId;
      const catName = p.categoryName || p.linkedTreatmentTitle || p.title;
      if (catId && catName && !candidateMap.has(catId)) {
        candidateMap.set(catId, { id: catId, name: catName });
      }
    });

    const populatedCategories = Array.from(candidateMap.values()).filter((cat) =>
      allMergedVisiblePairs.some((pair) => doesPairMatchCategory(pair, cat.id, cat.name))
    );

    return [{ id: 'all', name: 'All' }, ...populatedCategories];
  }, [config, allMergedVisiblePairs]);

  // Reset activeCategory to 'all' if the currently active category has no pairs
  useEffect(() => {
    if (
      activeCategory !== 'all' &&
      !allCategories.some((c) => c.id === activeCategory)
    ) {
      setActiveCategory('all');
      setCurrentPage(1);
    }
  }, [allCategories, activeCategory]);

  const allCategoriesRef = useRef(allCategories);
  useEffect(() => {
    allCategoriesRef.current = allCategories;
  }, [allCategories]);

  // Pill pages chunked so that tablets and desktop screens never exceed 3 visual rows per page
  const [pillPages, setPillPages] = useState<Array<typeof allCategories>>([allCategories]);

  useEffect(() => {
    const measurePillsRows = () => {
      const container = measureContainerRef.current;
      if (!container) return;
      if (container.offsetWidth === 0) return;

      const currentCats = allCategoriesRef.current;
      if (!currentCats || !currentCats.length) return;

      const children = Array.from(container.children) as HTMLElement[];
      // If the rendered DOM children count does not match category count yet, wait for DOM update
      if (children.length !== currentCats.length) return;

      const rows: (typeof allCategories)[] = [];
      let currentRow: typeof allCategories = [];
      let lastTop: number | null = null;

      children.forEach((child, index) => {
        const cat = currentCats[index];
        if (!cat || !cat.id) return;

        const top = child.offsetTop;
        if (lastTop === null || Math.abs(top - lastTop) < 6) {
          currentRow.push(cat);
          if (lastTop === null) lastTop = top;
        } else {
          if (currentRow.length > 0) {
            rows.push(currentRow);
          }
          currentRow = [cat];
          lastTop = top;
        }
      });
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }

      // Max 3 row lines per page as requested
      const MAX_ROWS_PER_PAGE = 3;
      const pages: (typeof allCategories)[] = [];
      for (let i = 0; i < rows.length; i += MAX_ROWS_PER_PAGE) {
        const chunk = rows.slice(i, i + MAX_ROWS_PER_PAGE).flat().filter((c) => Boolean(c && c.id));
        if (chunk.length > 0) {
          pages.push(chunk);
        }
      }

      if (pages.length > 0) {
        setPillPages(pages);
      }
    };

    const rafId = requestAnimationFrame(measurePillsRows);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && measureContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        measurePillsRows();
      });
      resizeObserver.observe(measureContainerRef.current);
    }

    window.addEventListener('resize', measurePillsRows);

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', measurePillsRows);
    };
  }, [allCategories]);

  const totalPillsPages = Math.max(1, pillPages.length);
  const safePillsPage = Math.min(Math.max(1, pillsPage), totalPillsPages);

  useEffect(() => {
    if (pillsPage > totalPillsPages && totalPillsPages > 0) {
      setPillsPage(totalPillsPages);
    }
  }, [totalPillsPages, pillsPage]);

  // Current pills for visible tablet & desktop page (up to 3 rows max per page)
  const visibleCategoriesDesktop = useMemo(() => {
    const page = pillPages[safePillsPage - 1];
    if (Array.isArray(page) && page.length > 0) {
      const valid = page.filter((c) => Boolean(c && c.id));
      if (valid.length > 0) return valid;
    }
    return allCategories.filter((c) => Boolean(c && c.id));
  }, [pillPages, safePillsPage, allCategories]);

  // Split categories into two rows for mobile horizontal scrolling
  const { mobileRow1, mobileRow2 } = useMemo(() => {
    const valid = allCategories.filter((c) => Boolean(c && c.id));
    const r1: typeof valid = [];
    const r2: typeof valid = [];
    valid.forEach((cat, idx) => {
      if (idx % 2 === 0) {
        r1.push(cat);
      } else {
        r2.push(cat);
      }
    });
    return { mobileRow1: r1, mobileRow2: r2 };
  }, [allCategories]);

  // Filter merged pairs using smart category matching
  const currentCategoryData = useMemo(() => {
    if (activeCategory === 'all') {
      return allMergedVisiblePairs;
    }
    const activeCatObj = allCategories.find((c) => c.id === activeCategory);
    return allMergedVisiblePairs.filter((pair) =>
      doesPairMatchCategory(pair, activeCategory, activeCatObj?.name)
    );
  }, [allMergedVisiblePairs, activeCategory, allCategories]);

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
      className="pt-10 pb-6 sm:pt-16 sm:pb-12 md:py-28 bg-transparent overflow-hidden relative isolate transform-gpu"
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

        {/* Category Selector Tabs & Filter Section */}
        <div className="mb-6 sm:mb-10 md:mb-12 max-w-4xl mx-auto relative">
          {/* Hidden measurement container for 3-rows-max pagination calculation on tablet/desktop */}
          <div
            ref={measureContainerRef}
            aria-hidden="true"
            className="invisible absolute -top-[9999px] left-0 right-0 pointer-events-none opacity-0 hidden sm:flex flex-wrap justify-center gap-2.5 md:gap-3"
          >
            {allCategories.filter((cat) => Boolean(cat && cat.id)).map((cat) => (
              <span
                key={cat.id}
                className="px-5 md:px-6 py-2.5 rounded-full font-sans text-xs font-normal tracking-[0.12em] uppercase border whitespace-nowrap inline-block"
              >
                {cat.name}
              </span>
            ))}
          </div>

          {/* Mobile Only: Horizontal scroll with all pills in two rows */}
          <div className="flex sm:hidden flex-col gap-2 overflow-x-auto pb-2 px-2 no-scrollbar touch-pan-x overscroll-x-contain">
            <div className="flex flex-nowrap gap-2 w-max">
              {mobileRow1.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-4 py-2 rounded-full font-sans text-[10px] font-normal tracking-[0.12em] uppercase border transition-all duration-300 shrink-0 whitespace-nowrap cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-slate-950 text-white border-black shadow-sm font-medium'
                      : 'bg-white/95 sm:bg-white/85 sm:backdrop-blur-md text-slate-800 border-white/60 hover:text-black hover:bg-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            {mobileRow2.length > 0 && (
              <div className="flex flex-nowrap gap-2 w-max">
                {mobileRow2.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-4 py-2 rounded-full font-sans text-[10px] font-normal tracking-[0.12em] uppercase border transition-all duration-300 shrink-0 whitespace-nowrap cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-slate-950 text-white border-black shadow-sm font-medium'
                        : 'bg-white/95 sm:bg-white/85 sm:backdrop-blur-md text-slate-800 border-white/60 hover:text-black hover:bg-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tablets & Desktop: Paginated Pills (Max 3 rows per page) */}
          <div className="hidden sm:flex flex-wrap justify-center gap-2.5 md:gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={safePillsPage}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex flex-wrap justify-center gap-2.5 md:gap-3"
              >
                {visibleCategoriesDesktop.filter((cat) => Boolean(cat && cat.id)).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-5 md:px-6 py-2.5 rounded-full font-sans text-xs font-normal tracking-[0.12em] uppercase border transition-all duration-300 shrink-0 whitespace-nowrap cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-slate-950 text-white border-black shadow-sm scale-102 font-medium'
                        : 'bg-white/85 backdrop-blur-md text-slate-800 border-white/60 hover:text-black hover:bg-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 1 2 3 Pagination for the Filter Pills (Tablets & Desktop Screens Only, Treatment Component Style) */}
          {totalPillsPages > 1 && (
            <div className="hidden sm:flex items-center justify-center gap-1.5 mt-5 select-none">
              <button
                type="button"
                onClick={() => setPillsPage((p) => Math.max(1, p - 1))}
                disabled={safePillsPage === 1}
                aria-label="Previous categories"
                className="p-1.5 sm:p-2 rounded-full border border-slate-950/30 text-slate-950 hover:bg-slate-950 hover:text-white transition-colors cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPillsPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = safePillsPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPillsPage(pageNum)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-sans font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-slate-950 text-white'
                        : 'text-slate-950 hover:bg-slate-950/10'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setPillsPage((p) => Math.min(totalPillsPages, p + 1))}
                disabled={safePillsPage === totalPillsPages}
                aria-label="Next categories"
                className="p-1.5 sm:p-2 rounded-full border border-slate-950/30 text-slate-950 hover:bg-slate-950 hover:text-white transition-colors cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
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
                {visiblePairs.filter((item) => Boolean(item && item.id)).map((item) => (
                  <TreatmentServiceFrameComparison
                    key={item.id}
                    pair={item}
                    onSelect={setSelectedModalPair}
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

      {/* Modal Viewer for Before & After Pair */}
      <AnimatePresence>
        {selectedModalPair && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedModalPair(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-white rounded-sm shadow-2xl border border-neutral-200 p-4 sm:p-6 md:p-8"
            >
              <button
                type="button"
                onClick={() => setSelectedModalPair(null)}
                aria-label="Close comparison viewer"
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-slate-900 transition-colors cursor-pointer z-30"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-4 sm:mb-6 pr-8">
                <h3 className="text-lg sm:text-2xl font-serif font-medium text-slate-950">
                  {selectedModalPair.title}
                </h3>
                {(selectedModalPair.linkedTreatmentTitle ||
                  selectedModalPair.duration ||
                  selectedModalPair.sessions) && (
                  <p className="text-xs sm:text-sm font-sans text-slate-600 mt-1">
                    {[
                      selectedModalPair.linkedTreatmentTitle,
                      selectedModalPair.duration,
                      selectedModalPair.sessions
                        ? `${selectedModalPair.sessions} ${
                            selectedModalPair.sessions === 1 ? 'Session' : 'Sessions'
                          }`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(' • ')}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                <div className="flex flex-col items-center">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xs border border-neutral-200 bg-neutral-50">
                    <ClinicImageWithPlaceholder
                      src={selectedModalPair.beforeImage}
                      alt={
                        selectedModalPair.beforeAltText ||
                        `${selectedModalPair.title} Before Treatment at Age Reversal Clinics London`
                      }
                      title={`${selectedModalPair.seoTitle || selectedModalPair.title} (Before)`}
                      logoSize="md"
                      showBrandText={true}
                      containerClassName="relative w-full h-full overflow-hidden bg-neutral-50 flex items-center justify-center"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="mt-2.5 bg-white px-4 py-1 rounded-full border border-neutral-200 text-silver-700 font-sans text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                    Before
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xs border border-neutral-200 bg-neutral-50">
                    <ClinicImageWithPlaceholder
                      src={selectedModalPair.afterImage}
                      alt={
                        selectedModalPair.afterAltText ||
                        `${selectedModalPair.title} After Treatment Result at Age Reversal Clinics London`
                      }
                      title={`${selectedModalPair.seoTitle || selectedModalPair.title} (After)`}
                      logoSize="md"
                      showBrandText={true}
                      containerClassName="relative w-full h-full overflow-hidden bg-neutral-50 flex items-center justify-center"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="mt-2.5 bg-[#003334] text-white px-4 py-1 rounded-full border border-[#003334] font-sans text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                    After
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

