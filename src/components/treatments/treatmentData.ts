import {
  TreatmentMediaItem,
  OverviewMediaConfig,
  ClinicalComparisonMediaConfig,
  ClinicalGuidanceMediaConfig
} from '../../types';

export interface TreatmentDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  badgeText?: string;
  procedureTime: string;
  comfortLevel: string;
  downtime: string;
  recommendedSessions: string;
  concerns: string[];
  price?: string;
  // Expanded dynamic clinical fields
  targetLayer: 'Epidermis' | 'Dermis' | 'Subdermal Adipose' | 'SMAS Muscle Layer';
  targetLayerDepth: string;
  beforeImage: string;
  afterImage: string;
  preCare: string[];
  postCare: string[];
  additionalImages?: string[];

  // 6 Dedicated Component Slots (Rich Media & SEO)
  coverMedia?: TreatmentMediaItem;
  heroMedia?: TreatmentMediaItem;
  overviewMedia?: OverviewMediaConfig;
  targetConcernsMedia?: TreatmentMediaItem;
  clinicalComparisonMedia?: ClinicalComparisonMediaConfig;
  clinicalGuidanceMedia?: ClinicalGuidanceMediaConfig;
  seoKeywords?: string[];
}

// Shared Clinical Visual Assets for Treatment Slots
const SHARED_VISUALS = {
  skinPrepSerum:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww',
  recoverySanctuary:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r',
  diagnosticCloseup:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR',
  overviewBack:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR'
};

export const TREATMENT_DETAILS_DB: Record<string, TreatmentDetail> = {
  exosome: {
    id: 'exosome',
    title: 'Exosome Regenerative Therapy',
    category: 'Regenerative Aesthetics',
    description: 'Pioneering cellular-level skin rejuvenation using pure clinical-grade exosomes. This state-of-the-art procedure transmits vital signaling proteins, growth factors, and lipids directly to tired skin cells, triggering natural cellular renewal, accelerating skin repair, and boosting collagen synthesis for an extraordinarily youthful skin texture.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    badgeText: 'Pioneering Biotech',
    procedureTime: '45 - 60 Minutes',
    comfortLevel: 'Highly Comfortable (Minimal Pinching)',
    downtime: '12 - 24 Hours (Mild Redness)',
    recommendedSessions: '3 - 5 Sessions spaced 4 weeks apart',
    concerns: [
      'Advanced signs of aging and deep wrinkles',
      'Hyperpigmentation and uneven skin tone',
      'Enlarged pores and textural roughness',
      'Compromised or slow-healing skin barrier'
    ],
    price: '$650',
    targetLayer: 'Dermis',
    targetLayerDepth: '1.5mm - 2.5mm',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY',
    preCare: [
      'Avoid blood-thinning supplements (Vitamin E, Ginkgo) 5 days prior.',
      'Discontinue prescription retinoids (Retin-A) 72 hours before.',
      'Arrive with a completely clean, makeup-free face.',
      'Stay extremely well-hydrated 24 hours prior to your session.'
    ],
    postCare: [
      'Do not wash or apply skincare products to the treated area for 6 hours.',
      'Avoid high-intensity aerobic exercises and saunas for 48 hours.',
      'Apply only pure clinical mineral sunscreen (SPF 50+) daily.',
      'Refrain from touching, scratching, or rubbing the skin surface.'
    ],
    seoKeywords: [
      'cellular skin regeneration',
      'exosome therapy london',
      'anti-aging clinic london',
      'stem cell growth factors',
      'collagen bio-synthesis',
      'micro-needling exosomes',
      'aesthetic dermatology'
    ],
    coverMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
      mediaType: 'image',
      altText: 'Exosome Regenerative Therapy card preview at Age Reversal Clinic London',
      seoTitle: 'Exosome Regenerative Therapy - Specialist Area',
      seoKeywords: ['cellular skin regeneration', 'exosome therapy london', 'anti-aging clinic london'],
      caption: 'Pioneering Biotech'
    },
    heroMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
      mediaType: 'image',
      altText: 'Clinical Exosome cellular signaling and skin barrier renewal therapy hero',
      seoTitle: 'Exosome Regenerative Therapy Clinical Procedure',
      seoKeywords: ['cellular skin regeneration', 'stem cell growth factors', 'anti-aging clinic london']
    },
    overviewMedia: {
      backCard: {
        url: SHARED_VISUALS.overviewBack,
        mediaType: 'image',
        altText: 'Exosome cellular signaling and skin barrier renewal procedural framing',
        seoKeywords: ['cellular skin regeneration', 'skin barrier renewal']
      },
      frontCard: {
        url: SHARED_VISUALS.diagnosticCloseup,
        mediaType: 'image',
        altText: 'Exosome clinical serum application and deep dermal micro-infusion',
        seoKeywords: ['exosome therapy london', 'collagen bio-synthesis']
      }
    },
    targetConcernsMedia: {
      url: SHARED_VISUALS.diagnosticCloseup,
      mediaType: 'image',
      altText: 'Targeted bio-calibration for deep wrinkles, enlarged pores, and hyperpigmentation',
      seoTitle: 'Targeted Bio-Calibration Diagnosis',
      caption: 'Targeted Bio-Calibration',
      seoKeywords: ['wrinkle reduction', 'pore refinement', 'anti-aging london']
    },
    clinicalComparisonMedia: {
      before: {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
        mediaType: 'image',
        altText: 'Before Exosome regenerative treatment showing compromised barrier and fine lines',
        seoKeywords: ['before exosome treatment', 'skin texture before']
      },
      after: {
        url: 'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY',
        mediaType: 'image',
        altText: 'After Exosome regenerative treatment showing collagen remodeling and restored radiance',
        seoKeywords: ['after exosome treatment', 'collagen bio-remodeling']
      },
      caseTitle: 'Clinical Trial: Volumetric Resurfacing'
    },
    clinicalGuidanceMedia: {
      preCare: {
        url: SHARED_VISUALS.skinPrepSerum,
        mediaType: 'image',
        altText: 'Clinical Skin Prep Serum Application - Epidermal Prime & Hydration',
        seoTitle: 'Clinical Skin Prep Protocol',
        caption: 'Epidermal Prime & Hydration',
        seoKeywords: ['clinical skin prep', 'serum application protocol', 'medical grade pre-care protocol']
      },
      postCare: {
        url: SHARED_VISUALS.recoverySanctuary,
        mediaType: 'image',
        altText: 'Clinical Recovery Spa Sanctuary - Cellular Healing & Protection',
        seoTitle: 'Clinical Recovery Protocol',
        caption: 'Cellular Healing & Protection',
        seoKeywords: ['post-care recovery', 'cellular healing', 'clinical skin recovery']
      }
    }
  },
  profhilo: {
    id: 'profhilo',
    title: 'Profhilo Injectable Hydration',
    category: 'Bio-Remodeling',
    description: 'An innovative, award-winning skin remodeling treatment with one of the highest concentrations of pure, ultra-pure Hyaluronic Acid. Profhilo does not simply add artificial volume; instead, it triggers a slow, prolonged cellular release of hydration that stimulates 4 different types of collagen and elastin, literally remodeling sagging skin tissue.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC',
    badgeText: 'Skin Elixir',
    procedureTime: '30 Minutes',
    comfortLevel: 'Mild Pinpricks (Topical Numbing Optional)',
    downtime: '24 - 48 Hours (Small localized bumps)',
    recommendedSessions: '2 Sessions spaced 4 weeks apart',
    concerns: [
      'Dehydrated, dull, or lusterless complexion',
      'Crepey skin texture on cheeks, neck, and hands',
      'Loss of skin elasticity and overall firmness',
      'Fine lines and superficial laxity'
    ],
    price: '$450',
    targetLayer: 'Dermis',
    targetLayerDepth: '1.0mm - 2.0mm',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLv5evIx7Bexs-9iJGxOP9dKFElgqCjw3duyD5PU_MlEubT0SyTO7PuZhJtmqUZf6JcUhS8jDhV8HW0kBhWUb4MYYalT72IO5pVBeVZs2593mjjAC6tI1ZOA1a9xGgg-M5J5waWMYO9uVD4zle9guZj31tQOME7032wvttEoahsd7HhWFooW0oUTyDgrytGK4oKIN0d2mGO5oLnx-NQ5sF7-OZHtA3a9_sCrUegKiXGZwpy_05469C2zVgo',
    preCare: [
      'Avoid aspirin, ibuprofen, or alcohol for 24 hours before.',
      'Notify your practitioner of any active cold sores.',
      'Eat a light meal or snack prior to the injections.',
      'Ensure you do not have any major social events for 48 hours.'
    ],
    postCare: [
      'Expect small bumps at the injection sites; these naturally dissolve within 24 hours.',
      'Do not apply makeup for at least 12 hours after injection.',
      'Avoid chemical peels, laser sessions, or facials for 2 weeks.',
      'Massage is strictly discouraged; let the product diffuse naturally.'
    ],
    seoKeywords: [
      'collagen bio-remodeling',
      'profhilo london clinic',
      'hyaluronic acid injectable',
      'skin laxity treatment',
      'anti-aging clinic london',
      'glow and hydration booster',
      'crepey skin repair'
    ],
    coverMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC',
      mediaType: 'image',
      altText: 'Profhilo Injectable Hydration bio-remodeling at Age Reversal Clinic',
      seoTitle: 'Profhilo Injectable Hydration - Bio-Remodeling',
      seoKeywords: ['collagen bio-remodeling', 'profhilo london clinic', 'hyaluronic acid injectable'],
      caption: 'Award-Winning'
    },
    heroMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC',
      mediaType: 'image',
      altText: 'Profhilo multi-point bio-remodeling hero visual',
      seoTitle: 'Profhilo Clinical Injection Treatment',
      seoKeywords: ['collagen bio-remodeling', 'glow and hydration booster', 'anti-aging clinic london']
    },
    overviewMedia: {
      backCard: {
        url: SHARED_VISUALS.overviewBack,
        mediaType: 'image',
        altText: 'Profhilo multi-point injection distribution pattern',
        seoKeywords: ['collagen bio-remodeling', 'bio-remodeling']
      },
      frontCard: {
        url: SHARED_VISUALS.diagnosticCloseup,
        mediaType: 'image',
        altText: 'Pure high and low molecular weight hyaluronic acid complex diffusion',
        seoKeywords: ['hyaluronic acid injectable', 'skin laxity treatment']
      }
    },
    targetConcernsMedia: {
      url: SHARED_VISUALS.diagnosticCloseup,
      mediaType: 'image',
      altText: 'Targeted skin hydration and laxity assessment card',
      seoTitle: 'Targeted Bio-Calibration Diagnosis',
      caption: 'Targeted Bio-Calibration',
      seoKeywords: ['crepey skin repair', 'skin laxity treatment', 'collagen bio-remodeling']
    },
    clinicalComparisonMedia: {
      before: {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
        mediaType: 'image',
        altText: 'Before Profhilo session showing dullness and dry crepey skin texture',
        seoKeywords: ['before profhilo', 'crepey skin before']
      },
      after: {
        url: 'https://lh3.googleusercontent.com/aida/AP1WRLv5evIx7Bexs-9iJGxOP9dKFElgqCjw3duyD5PU_MlEubT0SyTO7PuZhJtmqUZf6JcUhS8jDhV8HW0kBhWUb4MYYalT72IO5pVBeVZs2593mjjAC6tI1ZOA1a9xGgg-M5J5waWMYO9uVD4zle9guZj31tQOME7032wvttEoahsd7HhWFooW0oUTyDgrytGK4oKIN0d2mGO5oLnx-NQ5sF7-OZHtA3a9_sCrUegKiXGZwpy_05469C2zVgo',
        mediaType: 'image',
        altText: 'After Profhilo session showing intense glass-skin hydration and collagen elasticity',
        seoKeywords: ['after profhilo', 'collagen bio-remodeling']
      },
      caseTitle: 'Clinical Trial: Subdermal Lifting & Tone'
    },
    clinicalGuidanceMedia: {
      preCare: {
        url: SHARED_VISUALS.skinPrepSerum,
        mediaType: 'image',
        altText: 'Clinical Skin Prep Serum Application - Epidermal Prime & Hydration',
        seoTitle: 'Profhilo Pre-Care Protocol',
        caption: 'Epidermal Prime & Hydration',
        seoKeywords: ['clinical skin prep', 'serum application protocol', 'medical grade pre-care protocol']
      },
      postCare: {
        url: SHARED_VISUALS.recoverySanctuary,
        mediaType: 'image',
        altText: 'Clinical Recovery Spa Sanctuary - Cellular Healing & Protection',
        seoTitle: 'Profhilo Post-Care Protocol',
        caption: 'Cellular Healing & Protection',
        seoKeywords: ['post-care recovery', 'cellular healing', 'clinical skin recovery']
      }
    }
  },
  morpheus8: {
    id: 'morpheus8',
    title: 'Morpheus8 RF Microneedling',
    category: 'Fractional Skin Remodeling',
    description: 'A subdermal adipose remodeling device that combines advanced microneedling with deep radiofrequency (RF) energy. By penetrating deep into the subdermal layers, Morpheus8 coagulates fat and contracts connective tissues to tighten, lift, and contour the face, jawline, and body for incredibly dramatic non-surgical results.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOtBKp33pnPLoKpvckXkiIS-1G2cj7yNpUXZYP7v7nB3HgYFreRRFM-F6UZt2uwFsUMzf2u0m_0SvHcja7AjjBjq8B4mo1Gk_Y3ihgY2qmmbr1Vc48W8QizQ3BLTsaPHv9ojoje0Q8wG64F4zjwPy98roZuGAorsk2N5TxRUibfaZ4gZ7L9r7cFXGqA6jBiryjo3-fh10ZWdkryws_w14ASGtvXypafuUczwEFeVz6SywQsQKFg--N76UkgP9d4Um3Q5Snz8eG_XyS',
    badgeText: 'Ultimate Contour',
    procedureTime: '60 - 90 Minutes',
    comfortLevel: 'Moderate (Medical-grade numbing applied)',
    downtime: '3 - 5 Days (Moderate swelling & flaking)',
    recommendedSessions: '3 Sessions spaced 4 - 6 weeks apart',
    concerns: [
      'Submental fat (double chin) and jowls',
      'Moderate to severe skin sagging and laxity',
      'Deep acne scars and uneven surface texture',
      'Active skin crepiness and wrinkling'
    ],
    price: '$850',
    targetLayer: 'Subdermal Adipose',
    targetLayerDepth: '4.0mm - 7.0mm',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM',
    preCare: [
      'Discontinue tanning or direct intensive sun exposure 2 weeks prior.',
      'Stop using chemical exfoliators, AHA/BHAs, and retinoids 5 days before.',
      'Arrive with clean skin. Ensure no moisturizers or oils are applied.',
      'Inform staff of any implants, fillers, or thread lifts in the area.'
    ],
    postCare: [
      'Apply post-procedure soothing ointment (such as Aquaphor) for the first 48 hours.',
      'Avoid washing the treated area with hot water for 3 days.',
      'Do not pick at tiny scabs or micro-crusts that form; they heal naturally.',
      'Use a gentle physical-only broad spectrum SPF 50 daily.'
    ],
    seoKeywords: [
      'morpheus8 rf microneedling',
      'subdermal adipose remodeling',
      'jawline contouring london',
      'anti-wrinkle clinic london',
      'acne scar revision',
      'non-surgical dermal lift',
      'radiofrequency skin tightening'
    ],
    coverMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOtBKp33pnPLoKpvckXkiIS-1G2cj7yNpUXZYP7v7nB3HgYFreRRFM-F6UZt2uwFsUMzf2u0m_0SvHcja7AjjBjq8B4mo1Gk_Y3ihgY2qmmbr1Vc48W8QizQ3BLTsaPHv9ojoje0Q8wG64F4zjwPy98roZuGAorsk2N5TxRUibfaZ4gZ7L9r7cFXGqA6jBiryjo3-fh10ZWdkryws_w14ASGtvXypafuUczwEFeVz6SywQsQKFg--N76UkgP9d4Um3Q5Snz8eG_XyS',
      mediaType: 'image',
      altText: 'Morpheus8 RF Microneedling facial remodeling session',
      seoTitle: 'Morpheus8 Radiofrequency Microneedling',
      seoKeywords: ['morpheus8 rf microneedling', 'jawline contouring london', 'non-surgical dermal lift'],
      caption: 'Ultimate Contour'
    },
    heroMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOtBKp33pnPLoKpvckXkiIS-1G2cj7yNpUXZYP7v7nB3HgYFreRRFM-F6UZt2uwFsUMzf2u0m_0SvHcja7AjjBjq8B4mo1Gk_Y3ihgY2qmmbr1Vc48W8QizQ3BLTsaPHv9ojoje0Q8wG64F4zjwPy98roZuGAorsk2N5TxRUibfaZ4gZ7L9r7cFXGqA6jBiryjo3-fh10ZWdkryws_w14ASGtvXypafuUczwEFeVz6SywQsQKFg--N76UkgP9d4Um3Q5Snz8eG_XyS',
      mediaType: 'image',
      altText: 'Morpheus8 subdermal radiofrequency energy delivery system hero',
      seoTitle: 'Morpheus8 Inmode Clinical Treatment',
      seoKeywords: ['subdermal adipose remodeling', 'radiofrequency skin tightening', 'anti-wrinkle clinic london']
    },
    overviewMedia: {
      backCard: {
        url: SHARED_VISUALS.overviewBack,
        mediaType: 'image',
        altText: 'Micro-pins thermal coagulation profile diagram',
        seoKeywords: ['subdermal adipose remodeling', 'radiofrequency skin tightening']
      },
      frontCard: {
        url: SHARED_VISUALS.diagnosticCloseup,
        mediaType: 'image',
        altText: 'Fractional radiofrequency tip delivering energy to subdermal fat layer',
        seoKeywords: ['morpheus8 rf microneedling', 'jawline contouring london']
      }
    },
    targetConcernsMedia: {
      url: SHARED_VISUALS.diagnosticCloseup,
      mediaType: 'image',
      altText: 'Morpheus8 clinical target depth calibration for jowls and double chin',
      seoTitle: 'Targeted Bio-Calibration Diagnosis',
      caption: 'Targeted Bio-Calibration',
      seoKeywords: ['jawline contouring london', 'subdermal adipose remodeling', 'acne scar revision']
    },
    clinicalComparisonMedia: {
      before: {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
        mediaType: 'image',
        altText: 'Before Morpheus8 treatment displaying laxity along jawline and acne scarring',
        seoKeywords: ['before morpheus8', 'jawline laxity before']
      },
      after: {
        url: 'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM',
        mediaType: 'image',
        altText: 'After Morpheus8 treatment showing tightened mandibular angle and smoothed skin texture',
        seoKeywords: ['after morpheus8', 'jawline contouring london']
      },
      caseTitle: 'Clinical Trial: Micro-Focused Tightening'
    },
    clinicalGuidanceMedia: {
      preCare: {
        url: SHARED_VISUALS.skinPrepSerum,
        mediaType: 'image',
        altText: 'Clinical Skin Prep Serum Application - Epidermal Prime & Hydration',
        seoTitle: 'Morpheus8 Pre-Care Protocol',
        caption: 'Epidermal Prime & Hydration',
        seoKeywords: ['clinical skin prep', 'serum application protocol', 'medical grade pre-care protocol']
      },
      postCare: {
        url: SHARED_VISUALS.recoverySanctuary,
        mediaType: 'image',
        altText: 'Clinical Recovery Spa Sanctuary - Cellular Healing & Protection',
        seoTitle: 'Morpheus8 Post-Care Protocol',
        caption: 'Cellular Healing & Protection',
        seoKeywords: ['post-care recovery', 'cellular healing', 'clinical skin recovery']
      }
    }
  },
  ultherapy: {
    id: 'ultherapy',
    title: 'Ultherapy Non-Surgical Lift',
    category: 'Micro-Focused Ultrasound',
    description: 'The Gold Standard in non-invasive skin lifting. Ultherapy delivers micro-focused ultrasound energy to the identical foundational tissue layers (SMAS) typically addressed by plastic surgeons in surgical facelifts, completely bypassing the skin surface to stimulate new collagen production from the inside out.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
    badgeText: 'FDA-Cleared Lift',
    procedureTime: '60 - 120 Minutes',
    comfortLevel: 'Intense Warmth (Comfort management provided)',
    downtime: 'Zero Downtime (Immediate return to routine)',
    recommendedSessions: '1 Session, with annual maintenance',
    concerns: [
      'Sagging jawlines and drooping brow lines',
      'Crepey skin and laxity of the neck',
      'Wrinkled décolletage (chest area)',
      'General loss of structural jaw definition'
    ],
    price: '$1,200',
    targetLayer: 'SMAS Muscle Layer',
    targetLayerDepth: '4.5mm (Muscle Foundation)',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM',
    preCare: [
      'No specific preparations required; normal skincare routines are fine.',
      'Avoid laser procedures or chemical peels 2 weeks prior.',
      'Comfort options are discussed; we suggest arriving 30 mins early.',
      'A healthy, high-vitamin diet supports maximum collagen synthesis.'
    ],
    postCare: [
      'Mild tenderness along the jawline is normal and resolves in 1-2 weeks.',
      'Normal skincare and makeup can be applied immediately.',
      'Avoid high heat treatments (hot tubs, heavy saunas) for 48 hours.',
      'A lift develops gradually over 2 to 3 months as new collagen fibers form.'
    ],
    seoKeywords: [
      'ultherapy non-surgical lift',
      'smas muscle lifting',
      'non-surgical dermal lift',
      'micro-focused ultrasound',
      'anti-aging clinic london',
      'jawline definition',
      'neck skin tightening'
    ],
    coverMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
      mediaType: 'image',
      altText: 'Ultherapy Non-Surgical Ultrasound Lift session',
      seoTitle: 'Ultherapy Non-Surgical Lift',
      seoKeywords: ['ultherapy non-surgical lift', 'smas muscle lifting', 'non-surgical dermal lift'],
      caption: 'FDA-Cleared Lift'
    },
    heroMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
      mediaType: 'image',
      altText: 'Ultherapy deep SMAS layer visualization transducer hero',
      seoTitle: 'Ultherapy Ultrasound Technology',
      seoKeywords: ['micro-focused ultrasound', 'smas muscle lifting', 'anti-aging clinic london']
    },
    overviewMedia: {
      backCard: {
        url: SHARED_VISUALS.overviewBack,
        mediaType: 'image',
        altText: 'SMAS foundation layer target visualization',
        seoKeywords: ['smas muscle lifting', 'micro-focused ultrasound']
      },
      frontCard: {
        url: SHARED_VISUALS.diagnosticCloseup,
        mediaType: 'image',
        altText: 'Ultherapy precise 4.5mm thermal coagulation micro-points',
        seoKeywords: ['ultherapy non-surgical lift', 'non-surgical dermal lift']
      }
    },
    targetConcernsMedia: {
      url: SHARED_VISUALS.diagnosticCloseup,
      mediaType: 'image',
      altText: 'Ultherapy targeted deep tissue diagnostic visualization',
      seoTitle: 'Targeted Bio-Calibration Diagnosis',
      caption: 'Targeted Bio-Calibration',
      seoKeywords: ['jawline definition', 'neck skin tightening', 'smas muscle lifting']
    },
    clinicalComparisonMedia: {
      before: {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
        mediaType: 'image',
        altText: 'Before Ultherapy showing lower face gravitational descent and jowling',
        seoKeywords: ['before ultherapy', 'gravitational descent before']
      },
      after: {
        url: 'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM',
        mediaType: 'image',
        altText: 'After Ultherapy showing clear structural jaw elevation and tighter neck contours',
        seoKeywords: ['after ultherapy', 'non-surgical dermal lift']
      },
      caseTitle: 'Clinical Trial: Micro-Focused Ultrasound Lift'
    },
    clinicalGuidanceMedia: {
      preCare: {
        url: SHARED_VISUALS.skinPrepSerum,
        mediaType: 'image',
        altText: 'Clinical Skin Prep Serum Application - Epidermal Prime & Hydration',
        seoTitle: 'Ultherapy Pre-Care Protocol',
        caption: 'Epidermal Prime & Hydration',
        seoKeywords: ['clinical skin prep', 'serum application protocol', 'medical grade pre-care protocol']
      },
      postCare: {
        url: SHARED_VISUALS.recoverySanctuary,
        mediaType: 'image',
        altText: 'Clinical Recovery Spa Sanctuary - Cellular Healing & Protection',
        seoTitle: 'Ultherapy Post-Care Protocol',
        caption: 'Cellular Healing & Protection',
        seoKeywords: ['post-care recovery', 'cellular healing', 'clinical skin recovery']
      }
    }
  },
  polynucleotide: {
    id: 'polynucleotide',
    title: 'Polynucleotide Bio-Regeneration',
    category: 'DNA Cellular Repair',
    description: 'An advanced regenerative medicine breakthrough. Polynucleotides are natural, ultra-purified DNA fractions that instruct damaged skin cells to repair and regenerate. They act as robust antioxidants, stimulate hydration, synthesize new Type I collagen, and promote healthy microvascular circulation for a healthy, glowing dermis.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    badgeText: 'Biomedical Rejuvenation',
    procedureTime: '40 Minutes',
    comfortLevel: 'Mild (Topical anesthetic applied)',
    downtime: '24 Hours (Minor redness or puffiness)',
    recommendedSessions: '3 Sessions spaced 3 - 4 weeks apart',
    concerns: [
      'Dark under-eye circles and tear-trough hollows',
      'Chronic skin dehydration and inflammation',
      'Fine vertical smoker lines around the lips',
      'Atrophic scarring and post-inflammatory erythema'
    ],
    price: '$490',
    targetLayer: 'Dermis',
    targetLayerDepth: '1.5mm',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY',
    preCare: [
      'Avoid blood-thinning medication (ibuprofen, omega supplements) for 3 days.',
      'Avoid alcohol for 24 hours prior to injections.',
      'Drink plenty of fluids on the day of treatment.',
      'Ensure the treatment area is clean and clear of any inflammation.'
    ],
    postCare: [
      'Avoid applying heavy eye creams or makeup to the area for 12 hours.',
      'Slight swelling under the eyes is normal; avoid sleeping face-down.',
      'Do not rub, massage, or put pressure on the injection pathways.',
      'Wash with a mild hydrating cleanser; avoid acid-based scrubs.'
    ],
    seoKeywords: [
      'polynucleotide bio-regeneration',
      'dna cellular repair',
      'under-eye tear trough clinic',
      'salmon dna injection london',
      'anti-aging clinic london',
      'collagen bio-remodeling',
      'atrophic scar healing'
    ],
    coverMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
      mediaType: 'image',
      altText: 'Polynucleotide Bio-Regeneration cellular DNA restoration card',
      seoTitle: 'Polynucleotide DNA Cellular Repair',
      seoKeywords: ['polynucleotide bio-regeneration', 'dna cellular repair', 'under-eye tear trough clinic'],
      caption: 'Biomedical Rejuvenation'
    },
    heroMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
      mediaType: 'image',
      altText: 'Polynucleotides pure cellular fraction injection hero',
      seoTitle: 'Polynucleotide Bio-Regeneration Clinical Session',
      seoKeywords: ['dna cellular repair', 'salmon dna injection london', 'anti-aging clinic london']
    },
    overviewMedia: {
      backCard: {
        url: SHARED_VISUALS.overviewBack,
        mediaType: 'image',
        altText: 'Polynucleotide DNA micro-chains stimulating fibroblast activity',
        seoKeywords: ['dna cellular repair', 'collagen bio-remodeling']
      },
      frontCard: {
        url: SHARED_VISUALS.diagnosticCloseup,
        mediaType: 'image',
        altText: 'Delicate peri-orbital and facial micro-injection delivery',
        seoKeywords: ['polynucleotide bio-regeneration', 'under-eye tear trough clinic']
      }
    },
    targetConcernsMedia: {
      url: SHARED_VISUALS.diagnosticCloseup,
      mediaType: 'image',
      altText: 'Targeted peri-orbital diagnostic scan for tear trough hollows',
      seoTitle: 'Targeted Bio-Calibration Diagnosis',
      caption: 'Targeted Bio-Calibration',
      seoKeywords: ['under-eye tear trough clinic', 'atrophic scar healing', 'dna cellular repair']
    },
    clinicalComparisonMedia: {
      before: {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
        mediaType: 'image',
        altText: 'Before Polynucleotides showing dark bluish under-eye hollows and crepey skin',
        seoKeywords: ['before polynucleotides', 'under eye dark circles before']
      },
      after: {
        url: 'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY',
        mediaType: 'image',
        altText: 'After Polynucleotides showing lightened under-eye tone and dense dermal thickening',
        seoKeywords: ['after polynucleotides', 'collagen bio-remodeling']
      },
      caseTitle: 'Clinical Trial: DNA Regenerative Repair'
    },
    clinicalGuidanceMedia: {
      preCare: {
        url: SHARED_VISUALS.skinPrepSerum,
        mediaType: 'image',
        altText: 'Clinical Skin Prep Serum Application - Epidermal Prime & Hydration',
        seoTitle: 'Polynucleotide Pre-Care Protocol',
        caption: 'Epidermal Prime & Hydration',
        seoKeywords: ['clinical skin prep', 'serum application protocol', 'medical grade pre-care protocol']
      },
      postCare: {
        url: SHARED_VISUALS.recoverySanctuary,
        mediaType: 'image',
        altText: 'Clinical Recovery Spa Sanctuary - Cellular Healing & Protection',
        seoTitle: 'Polynucleotide Post-Care Protocol',
        caption: 'Cellular Healing & Protection',
        seoKeywords: ['post-care recovery', 'cellular healing', 'clinical skin recovery']
      }
    }
  },
  lip: {
    id: 'lip',
    title: 'Precision Lip Enhancement',
    category: 'Dermal Sculpting',
    description: "Expert, bespoke lip contouring and volumization using industry-leading hyaluronic acid gel formulas. Our philosophy emphasizes proportional symmetry, subtle definition of the Cupid's bow, and deep vermillion hydration, ensuring a lush yet completely natural-looking result.",
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww',
    badgeText: 'Master Artistry',
    procedureTime: '30 - 45 Minutes',
    comfortLevel: 'Comfortable (Formula contains Lidocaine)',
    downtime: '2 - 3 Days (Temporary swelling & bruising)',
    recommendedSessions: 'As required (Usually 1 session, lasting 9 - 12 months)',
    concerns: [
      'Thin or structurally asymmetrical lips',
      'Loss of lip borders and dry vertical lines',
      'Downward turning mouth corners',
      'Desire for a subtle, youthful, hydrated pout'
    ],
    price: '$380',
    targetLayer: 'Dermis',
    targetLayerDepth: '1.2mm (Submucosal)',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLv5evIx7Bexs-9iJGxOP9dKFElgqCjw3duyD5PU_MlEubT0SyTO7PuZhJtmqUZf6JcUhS8jDhV8HW0kBhWUb4MYYalT72IO5pVBeVZs2593mjjAC6tI1ZOA1a9xGgg-M5J5waWMYO9uVD4zle9guZj31tQOME7032wvttEoahsd7HhWFooW0oUTyDgrytGK4oKIN0d2mGO5oLnx-NQ5sF7-OZHtA3a9_sCrUegKiXGZwpy_05469C2zVgo',
    preCare: [
      'Stop using blood thinners (aspirin, anti-inflammatories) 5 days before.',
      'Avoid drinking alcohol for 24-48 hours prior to appointment.',
      'Take Arnica Montana tablets starting 2 days prior to minimize bruising.',
      'Discontinue topical lip exfoliators 48 hours before.'
    ],
    postCare: [
      'Use cold compresses on the lips to minimize swelling on Day 1.',
      'Avoid hot drinks, spicy foods, or vaping/smoking for 48 hours.',
      'Apply post-care soothing lip barrier balm provided by the clinic.',
      'Do not perform heavy dental procedures for 2 weeks after.'
    ],
    seoKeywords: [
      'precision lip enhancement',
      'dermal filler london',
      'natural lip filler clinic',
      'cupids bow definition',
      'vermillion border hydration',
      'anti-aging clinic london',
      'lip contouring'
    ],
    coverMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww',
      mediaType: 'image',
      altText: 'Precision Lip Enhancement master dermal sculpting at Age Reversal Clinic',
      seoTitle: 'Precision Lip Enhancement',
      seoKeywords: ['precision lip enhancement', 'dermal filler london', 'natural lip filler clinic'],
      caption: 'Master Artistry'
    },
    heroMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww',
      mediaType: 'image',
      altText: 'Bespoke natural lip contouring and Cupid bow definition hero',
      seoTitle: 'Precision Lip Enhancement Procedure',
      seoKeywords: ['cupids bow definition', 'vermillion border hydration', 'lip contouring']
    },
    overviewMedia: {
      backCard: {
        url: SHARED_VISUALS.overviewBack,
        mediaType: 'image',
        altText: 'Anatomical vermillion border and micro-cannula mapping',
        seoKeywords: ['vermillion border hydration', 'lip contouring']
      },
      frontCard: {
        url: SHARED_VISUALS.diagnosticCloseup,
        mediaType: 'image',
        altText: 'Subtle micro-droplet hyaluronic acid lip sculpting',
        seoKeywords: ['precision lip enhancement', 'natural lip filler clinic']
      }
    },
    targetConcernsMedia: {
      url: SHARED_VISUALS.diagnosticCloseup,
      mediaType: 'image',
      altText: 'Targeted lip symmetry and hydration diagnostic assessment',
      seoTitle: 'Targeted Bio-Calibration Diagnosis',
      caption: 'Targeted Bio-Calibration',
      seoKeywords: ['cupids bow definition', 'vermillion border hydration', 'dermal filler london']
    },
    clinicalComparisonMedia: {
      before: {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
        mediaType: 'image',
        altText: 'Before Lip Enhancement showing thin upper lip and faded vermillion border',
        seoKeywords: ['before lip filler', 'thin lips before']
      },
      after: {
        url: 'https://lh3.googleusercontent.com/aida/AP1WRLv5evIx7Bexs-9iJGxOP9dKFElgqCjw3duyD5PU_MlEubT0SyTO7PuZhJtmqUZf6JcUhS8jDhV8HW0kBhWUb4MYYalT72IO5pVBeVZs2593mjjAC6tI1ZOA1a9xGgg-M5J5waWMYO9uVD4zle9guZj31tQOME7032wvttEoahsd7HhWFooW0oUTyDgrytGK4oKIN0d2mGO5oLnx-NQ5sF7-OZHtA3a9_sCrUegKiXGZwpy_05469C2zVgo',
        mediaType: 'image',
        altText: 'After Lip Enhancement displaying symmetrical, hydrated, natural volume pout',
        seoKeywords: ['after lip filler', 'natural lip filler clinic']
      },
      caseTitle: 'Clinical Trial: Proportional Lip Architecture'
    },
    clinicalGuidanceMedia: {
      preCare: {
        url: SHARED_VISUALS.skinPrepSerum,
        mediaType: 'image',
        altText: 'Clinical Skin Prep Serum Application - Epidermal Prime & Hydration',
        seoTitle: 'Lip Filler Pre-Care Protocol',
        caption: 'Epidermal Prime & Hydration',
        seoKeywords: ['clinical skin prep', 'serum application protocol', 'medical grade pre-care protocol']
      },
      postCare: {
        url: SHARED_VISUALS.recoverySanctuary,
        mediaType: 'image',
        altText: 'Clinical Recovery Spa Sanctuary - Cellular Healing & Protection',
        seoTitle: 'Lip Filler Post-Care Protocol',
        caption: 'Cellular Healing & Protection',
        seoKeywords: ['post-care recovery', 'cellular healing', 'clinical skin recovery']
      }
    }
  },
  buttock: {
    id: 'buttock',
    title: 'Non-Surgical Buttock Lift',
    category: 'Body Contouring',
    description: 'Sculpt, round, and lift the buttocks without surgery. Using high-density bio-stimulators like Lanluma or Sculptra, this premium procedure induces deep, long-term collagen synthesis within the deep dermal layers to safely fill hip dips, project volume, and tighten sagging skin tissues.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r',
    badgeText: 'Sculpt & Lift',
    procedureTime: '60 Minutes',
    comfortLevel: 'Mild (Local anesthetic blended in)',
    downtime: '2 - 4 Days (Slight soreness or swelling)',
    recommendedSessions: '2 - 3 Sessions spaced 6 weeks apart',
    concerns: [
      'Flat or deflated gluteal volume',
      'Asymmetrical gluteal projection or hip dips',
      'Mild cellulite and tissue laxity on thighs/buttocks',
      'Desire for rounder, contoured athletic profile'
    ],
    price: '$1,500',
    targetLayer: 'Subdermal Adipose',
    targetLayerDepth: '6.0mm - 12.0mm',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM',
    preCare: [
      'Wear loose-fitting, dark comfortable clothing to your session.',
      'Discontinue strenuous lower-body exercises 24 hours prior.',
      'Shave or wax the gluteal area 48 hours prior if necessary.',
      'Avoid blood thinners and alcohol to prevent bruising.'
    ],
    postCare: [
      'Perform 5-minute deep circular massages 5 times a day for 5 days.',
      'Avoid prolonged sitting directly on the gluteal area for the first 72 hours.',
      'Sleep on your stomach or side for the first 5 nights.',
      'Expect deep tenderness; resume physical activity slowly in 5-7 days.'
    ],
    seoKeywords: [
      'non-surgical buttock lift',
      'body contouring clinic london',
      'lanluma collagen stimulation',
      'hip dip correction london',
      'sculptra body contouring',
      'non-surgical dermal lift',
      'gluteal volume restoration'
    ],
    coverMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r',
      mediaType: 'image',
      altText: 'Non-Surgical Buttock Lift bio-stimulatory collagen body sculpting',
      seoTitle: 'Non-Surgical Buttock Lift',
      seoKeywords: ['non-surgical buttock lift', 'body contouring clinic london', 'lanluma collagen stimulation'],
      caption: 'Sculpt & Lift'
    },
    heroMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r',
      mediaType: 'image',
      altText: 'Bio-stimulator gluteal curve and hip dip restoration hero',
      seoTitle: 'Non-Surgical Buttock Lift Clinical Procedure',
      seoKeywords: ['hip dip correction london', 'sculptra body contouring', 'gluteal volume restoration']
    },
    overviewMedia: {
      backCard: {
        url: SHARED_VISUALS.overviewBack,
        mediaType: 'image',
        altText: 'Deep dermal bio-stimulatory collagen mesh network projection',
        seoKeywords: ['lanluma collagen stimulation', 'gluteal volume restoration']
      },
      frontCard: {
        url: SHARED_VISUALS.diagnosticCloseup,
        mediaType: 'image',
        altText: 'Subdermal micro-cannula body contouring technique',
        seoKeywords: ['non-surgical buttock lift', 'body contouring clinic london']
      }
    },
    targetConcernsMedia: {
      url: SHARED_VISUALS.diagnosticCloseup,
      mediaType: 'image',
      altText: 'Targeted gluteal volume and hip dip diagnostic calibration',
      seoTitle: 'Targeted Bio-Calibration Diagnosis',
      caption: 'Targeted Bio-Calibration',
      seoKeywords: ['hip dip correction london', 'non-surgical buttock lift', 'body contouring clinic london']
    },
    clinicalComparisonMedia: {
      before: {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
        mediaType: 'image',
        altText: 'Before Non-Surgical Buttock Lift showing hollow hip dips and flattened curvature',
        seoKeywords: ['before buttock lift', 'hip dips before']
      },
      after: {
        url: 'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM',
        mediaType: 'image',
        altText: 'After Non-Surgical Buttock Lift displaying rounded athletic curve and filled hip dips',
        seoKeywords: ['after buttock lift', 'gluteal volume restoration']
      },
      caseTitle: 'Clinical Trial: Gluteal Matrix Contouring'
    },
    clinicalGuidanceMedia: {
      preCare: {
        url: SHARED_VISUALS.skinPrepSerum,
        mediaType: 'image',
        altText: 'Clinical Skin Prep Serum Application - Epidermal Prime & Hydration',
        seoTitle: 'Body Lift Pre-Care Protocol',
        caption: 'Epidermal Prime & Hydration',
        seoKeywords: ['clinical skin prep', 'serum application protocol', 'medical grade pre-care protocol']
      },
      postCare: {
        url: SHARED_VISUALS.recoverySanctuary,
        mediaType: 'image',
        altText: 'Clinical Recovery Spa Sanctuary - Cellular Healing & Protection',
        seoTitle: 'Body Lift Post-Care Protocol',
        caption: 'Cellular Healing & Protection',
        seoKeywords: ['post-care recovery', 'cellular healing', 'clinical skin recovery']
      }
    }
  },
  blepharoplasty: {
    id: 'blepharoplasty',
    title: 'Plasma Blepharoplasty (Non-Surgical)',
    category: 'Eyelid Sublimation',
    description: 'A revolutionary alternative to surgical eyelid reduction. Utilizing localized plasma arc technology, this non-invasive system sublimates the surface skin cells of drooping upper or lower eyelids. It induces immediate tissue contraction and tightens crepey under-eye bags with microscopic precision.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs',
    badgeText: 'Eyelid Refining',
    procedureTime: '45 - 60 Minutes',
    comfortLevel: 'Mild (Numbing cream applied)',
    downtime: '5 - 7 Days (Micro-crusts & temporary swelling)',
    recommendedSessions: '1 - 2 Sessions spaced 8 weeks apart',
    concerns: [
      'Heavy, drooping hooded upper eyelids',
      'Crepey skin and fine lines under the eyes',
      'Mild fat herniation/bags under the eyes',
      'Tired-looking eye appearance and laxity'
    ],
    price: '$750',
    targetLayer: 'Epidermis',
    targetLayerDepth: '0.2mm - 0.5mm',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY',
    preCare: [
      'Do not wear contact lenses on the day of treatment (bring glasses).',
      'Avoid eyelash extensions, tints, or perms for at least 1 week prior.',
      'Ensure you do not have any active eyelid infections or dry eye flare-ups.',
      'Stop using retinoids or acids around the eyes for 5 days.'
    ],
    postCare: [
      'Keep the eye area completely clean and dry; do not wash with water on Day 1.',
      'Tiny brown micro-crusts will form; do not rub, scratch, or pick at them.',
      'Wear protective UV sunglasses outside and apply physical mineral SPF daily.',
      'Do not apply makeup or mascara until the micro-crusts have shed completely.'
    ],
    seoKeywords: [
      'plasma blepharoplasty london',
      'non-surgical eyelid lift',
      'hooded eyelid sublimation',
      'under-eye bag tightening',
      'anti-aging clinic london',
      'fibroblast plasma lift',
      'crepey eye skin treatment'
    ],
    coverMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs',
      mediaType: 'image',
      altText: 'Plasma Blepharoplasty non-surgical eyelid tightening at Age Reversal Clinic',
      seoTitle: 'Plasma Blepharoplasty Eyelid Lift',
      seoKeywords: ['plasma blepharoplasty london', 'non-surgical eyelid lift', 'hooded eyelid sublimation'],
      caption: 'Eyelid Refining'
    },
    heroMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs',
      mediaType: 'image',
      altText: 'Micro-plasma arc sublimation for drooping eyelids hero',
      seoTitle: 'Non-Surgical Plasma Blepharoplasty',
      seoKeywords: ['hooded eyelid sublimation', 'under-eye bag tightening', 'fibroblast plasma lift']
    },
    overviewMedia: {
      backCard: {
        url: SHARED_VISUALS.overviewBack,
        mediaType: 'image',
        altText: 'Micro-plasma arc epidermal tissue contraction grid',
        seoKeywords: ['hooded eyelid sublimation', 'fibroblast plasma lift']
      },
      frontCard: {
        url: SHARED_VISUALS.diagnosticCloseup,
        mediaType: 'image',
        altText: 'Sublimation electrode delivering micro-millimeter precision arcs',
        seoKeywords: ['plasma blepharoplasty london', 'non-surgical eyelid lift']
      }
    },
    targetConcernsMedia: {
      url: SHARED_VISUALS.diagnosticCloseup,
      mediaType: 'image',
      altText: 'Targeted peri-orbital diagnostic scan for excess lid skin and crepiness',
      seoTitle: 'Targeted Bio-Calibration Diagnosis',
      caption: 'Targeted Bio-Calibration',
      seoKeywords: ['under-eye bag tightening', 'crepey eye skin treatment', 'plasma blepharoplasty london']
    },
    clinicalComparisonMedia: {
      before: {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
        mediaType: 'image',
        altText: 'Before Plasma Blepharoplasty showing hooded upper eyelids and heavy skin folds',
        seoKeywords: ['before plasma blepharoplasty', 'hooded eyelids before']
      },
      after: {
        url: 'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY',
        mediaType: 'image',
        altText: 'After Plasma Blepharoplasty showing wide open, refreshed, tightened eyelid contours',
        seoKeywords: ['after plasma blepharoplasty', 'non-surgical eyelid lift']
      },
      caseTitle: 'Clinical Trial: Peri-Orbital Sublimation'
    },
    clinicalGuidanceMedia: {
      preCare: {
        url: SHARED_VISUALS.skinPrepSerum,
        mediaType: 'image',
        altText: 'Clinical Skin Prep Serum Application - Epidermal Prime & Hydration',
        seoTitle: 'Eyelid Pre-Care Protocol',
        caption: 'Epidermal Prime & Hydration',
        seoKeywords: ['clinical skin prep', 'serum application protocol', 'medical grade pre-care protocol']
      },
      postCare: {
        url: SHARED_VISUALS.recoverySanctuary,
        mediaType: 'image',
        altText: 'Clinical Recovery Spa Sanctuary - Cellular Healing & Protection',
        seoTitle: 'Eyelid Post-Care Protocol',
        caption: 'Cellular Healing & Protection',
        seoKeywords: ['post-care recovery', 'cellular healing', 'clinical skin recovery']
      }
    }
  },
  aqualyx: {
    id: 'aqualyx',
    title: 'Aqualyx Fat Dissolving Injection',
    category: 'Injectable Lipolysis',
    description: 'A safe, highly effective fat dissolving treatment engineered to target stubborn, localized pockets of adipose tissue. Formulated with deoxycholic acid derivatives, Aqualyx liquefies fat cell membranes, causing them to break down and flush naturally out of the body through the lymphatic system.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpc9iwUPHl5YjJPUY9E95ThzCowbFO32u1yMI6QpZqPrQnBL7p9nmkyqw3JRkKKEl26-mJIFP0r8QNgHxIYxWnrIiagTCmDfr3L4TeyGpRJ4Ye8dwjLxT7kUVB0sTqVntaOcMm7700Jj3-8xh75QQkY3xOMGH04owJPA05JB3wRuKL7kUttqlyk-sOqZIwumYKh7VveixAFn2QXvlC7f8-S3zwQXujNvI0qHEwsxPonmj_-kRlbSiRVOcy67FFlTBCjBFzzvhYYOQ1',
    badgeText: 'Precision Slimming',
    procedureTime: '30 - 45 Minutes',
    comfortLevel: 'Mildly uncomfortable (Burning sensation during active injection)',
    downtime: '3 - 5 Days (Noticeable swelling and tenderness)',
    recommendedSessions: '2 - 4 Sessions spaced 4 weeks apart',
    concerns: [
      'Submental fat under the chin (double chin)',
      'Love handles and lower abdomen pockets',
      'Inner thigh or upper arm localized fat',
      'Stubborn fat deposits resistant to diet & exercise'
    ],
    price: '$350',
    targetLayer: 'Subdermal Adipose',
    targetLayerDepth: '6.0mm - 10.0mm',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM',
    preCare: [
      'Avoid drinking alcohol for 48 hours to minimize severe bruising risks.',
      'Wear loose clothing around the area being injected.',
      'Stay hydrated; drink 2 liters of water on the day of treatment.',
      'Arrive without any active skin irritation in the treatment zone.'
    ],
    postCare: [
      'Wear compression garments (chin strap, spanx) if advised for 3-5 days.',
      'Expect localized burning, redness, and swelling; do not take ibuprofen.',
      'Drink 2-3 liters of water daily to accelerate the flushing of lysed fat cells.',
      'Avoid high-cardio exercises for 72 hours following treatment.'
    ],
    seoKeywords: [
      'aqualyx fat dissolving injection',
      'injectable lipolysis london',
      'double chin fat reduction',
      'submental fullness treatment',
      'body sculpting london',
      'deoxycholic acid fat removal',
      'non-surgical body contouring'
    ],
    coverMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpc9iwUPHl5YjJPUY9E95ThzCowbFO32u1yMI6QpZqPrQnBL7p9nmkyqw3JRkKKEl26-mJIFP0r8QNgHxIYxWnrIiagTCmDfr3L4TeyGpRJ4Ye8dwjLxT7kUVB0sTqVntaOcMm7700Jj3-8xh75QQkY3xOMGH04owJPA05JB3wRuKL7kUttqlyk-sOqZIwumYKh7VveixAFn2QXvlC7f8-S3zwQXujNvI0qHEwsxPonmj_-kRlbSiRVOcy67FFlTBCjBFzzvhYYOQ1',
      mediaType: 'image',
      altText: 'Aqualyx Fat Dissolving Injection submental contouring preview',
      seoTitle: 'Aqualyx Fat Dissolving Injection',
      seoKeywords: ['aqualyx fat dissolving injection', 'injectable lipolysis london', 'double chin fat reduction'],
      caption: 'Precision Slimming'
    },
    heroMedia: {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpc9iwUPHl5YjJPUY9E95ThzCowbFO32u1yMI6QpZqPrQnBL7p9nmkyqw3JRkKKEl26-mJIFP0r8QNgHxIYxWnrIiagTCmDfr3L4TeyGpRJ4Ye8dwjLxT7kUVB0sTqVntaOcMm7700Jj3-8xh75QQkY3xOMGH04owJPA05JB3wRuKL7kUttqlyk-sOqZIwumYKh7VveixAFn2QXvlC7f8-S3zwQXujNvI0qHEwsxPonmj_-kRlbSiRVOcy67FFlTBCjBFzzvhYYOQ1',
      mediaType: 'image',
      altText: 'Aqualyx deoxycholic acid lipolysis targeted micro-injections hero',
      seoTitle: 'Aqualyx Clinical Lipolysis Treatment',
      seoKeywords: ['submental fullness treatment', 'deoxycholic acid fat removal', 'body sculpting london']
    },
    overviewMedia: {
      backCard: {
        url: SHARED_VISUALS.overviewBack,
        mediaType: 'image',
        altText: 'Adipocyte cell membrane dissolution schematic diagram',
        seoKeywords: ['deoxycholic acid fat removal', 'injectable lipolysis london']
      },
      frontCard: {
        url: SHARED_VISUALS.diagnosticCloseup,
        mediaType: 'image',
        altText: 'Submental and adipose grid injection delivery',
        seoKeywords: ['aqualyx fat dissolving injection', 'double chin fat reduction']
      }
    },
    targetConcernsMedia: {
      url: SHARED_VISUALS.diagnosticCloseup,
      mediaType: 'image',
      altText: 'Targeted submental and abdominal localized fat diagnostic mapping',
      seoTitle: 'Targeted Bio-Calibration Diagnosis',
      caption: 'Targeted Bio-Calibration',
      seoKeywords: ['double chin fat reduction', 'submental fullness treatment', 'aqualyx fat dissolving injection']
    },
    clinicalComparisonMedia: {
      before: {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
        mediaType: 'image',
        altText: 'Before Aqualyx showing submental fullness under chin and blunted jaw profile',
        seoKeywords: ['before aqualyx', 'double chin before']
      },
      after: {
        url: 'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM',
        mediaType: 'image',
        altText: 'After Aqualyx showing sharply carved jawline and eliminated submental fat pocket',
        seoKeywords: ['after aqualyx', 'non-surgical body contouring']
      },
      caseTitle: 'Clinical Trial: Submental Lipolysis Contouring'
    },
    clinicalGuidanceMedia: {
      preCare: {
        url: SHARED_VISUALS.skinPrepSerum,
        mediaType: 'image',
        altText: 'Clinical Skin Prep Serum Application - Epidermal Prime & Hydration',
        seoTitle: 'Lipolysis Pre-Care Protocol',
        caption: 'Epidermal Prime & Hydration',
        seoKeywords: ['clinical skin prep', 'serum application protocol', 'medical grade pre-care protocol']
      },
      postCare: {
        url: SHARED_VISUALS.recoverySanctuary,
        mediaType: 'image',
        altText: 'Clinical Recovery Spa Sanctuary - Cellular Healing & Protection',
        seoTitle: 'Lipolysis Post-Care Protocol',
        caption: 'Cellular Healing & Protection',
        seoKeywords: ['post-care recovery', 'cellular healing', 'clinical skin recovery']
      }
    }
  }
};

/**
 * Ensures any dynamic treatment record has all 6 dedicated slots and SEO fields populated
 */
export function populateTreatmentMediaDefaults(item: TreatmentDetail): TreatmentDetail {
  const defaultSeoKeywords = item.seoKeywords && item.seoKeywords.length > 0
    ? item.seoKeywords
    : [
        'cellular skin regeneration',
        'anti-wrinkle clinic london',
        'collagen bio-remodeling',
        'non-surgical dermal lift',
        'medical grade pre-care protocol'
      ];

  const primaryImage = item.imageUrl || SHARED_VISUALS.diagnosticCloseup;
  const beforeImg = item.beforeImage || primaryImage;
  const afterImg = item.afterImage || primaryImage;

  return {
    ...item,
    seoKeywords: defaultSeoKeywords,
    coverMedia: item.coverMedia || {
      url: primaryImage,
      mediaType: 'image',
      altText: `${item.title} specialized clinical protocol at Age Reversal Clinic`,
      seoTitle: item.title,
      seoKeywords: defaultSeoKeywords.slice(0, 3),
      caption: item.badgeText || 'Specialist Protocol'
    },
    heroMedia: item.heroMedia || {
      url: primaryImage,
      mediaType: 'image',
      altText: `${item.title} advanced clinical treatment hero presentation`,
      seoTitle: `${item.title} - Age Reversal Clinic London`,
      seoKeywords: defaultSeoKeywords
    },
    overviewMedia: item.overviewMedia || {
      backCard: {
        url: SHARED_VISUALS.overviewBack,
        mediaType: 'image',
        altText: `${item.title} scientific procedural and diagnostic profile framing`,
        seoKeywords: defaultSeoKeywords.slice(0, 2)
      },
      frontCard: {
        url: primaryImage,
        mediaType: 'image',
        altText: `${item.title} clinical protocol execution closeup`,
        seoKeywords: defaultSeoKeywords.slice(2, 4)
      }
    },
    targetConcernsMedia: item.targetConcernsMedia || {
      url: SHARED_VISUALS.diagnosticCloseup,
      mediaType: 'image',
      altText: `High-precision targeted aesthetic treatment technology for ${item.title}`,
      seoTitle: 'Targeted Bio-Calibration Diagnosis',
      caption: 'Targeted Bio-Calibration',
      seoKeywords: defaultSeoKeywords
    },
    clinicalComparisonMedia: item.clinicalComparisonMedia || {
      before: {
        url: beforeImg,
        mediaType: 'image',
        altText: `Before ${item.title} baseline assessment photograph`,
        seoKeywords: [`before ${item.title.toLowerCase()}`, defaultSeoKeywords[0]]
      },
      after: {
        url: afterImg,
        mediaType: 'image',
        altText: `After ${item.title} clinical transformation outcome photograph`,
        seoKeywords: [`after ${item.title.toLowerCase()}`, defaultSeoKeywords[1]]
      },
      caseTitle: `Clinical Trial: ${item.title} Case Study`
    },
    clinicalGuidanceMedia: item.clinicalGuidanceMedia || {
      preCare: {
        url: SHARED_VISUALS.skinPrepSerum,
        mediaType: 'image',
        altText: 'Clinical Skin Prep Serum Application - Epidermal Prime & Hydration',
        seoTitle: 'Clinical Skin Prep Protocol',
        caption: 'Epidermal Prime & Hydration',
        seoKeywords: ['clinical skin prep', 'serum application protocol', 'medical grade pre-care protocol']
      },
      postCare: {
        url: SHARED_VISUALS.recoverySanctuary,
        mediaType: 'image',
        altText: 'Clinical Recovery Spa Sanctuary - Cellular Healing & Protection',
        seoTitle: 'Clinical Recovery Protocol',
        caption: 'Cellular Healing & Protection',
        seoKeywords: ['post-care recovery', 'cellular healing', 'clinical skin recovery']
      }
    }
  };
}

export const DEFAULT_TREATMENT_DETAILS = (name: string): TreatmentDetail => {
  const baseItem: TreatmentDetail = {
    id: 'bespoke',
    title: `${name}`,
    category: 'Custom Bespoke Care',
    description: `Experience a premium, fully customized clinical session designed exclusively around the unique requirements of your skin. Our clinical specialists will analyze your skin barrier, hydration levels, and target goals to form an integrated, bespoke plan of action tailored exactly for you.`,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0sGBWhyvflKKvPKdNj9eTy54fC48-JeBgjZKNpiFsfm5GPsH22DxfzanRDBWS6t55bXcWKOjgOqIsqlmeaYRkXfOm_34vmiaqGCOiG6frIQ6lgsfQ1SK38rV8reNQxw2gaK5cbvht1BZL0sbw78SliDjayEPSBPV1ruNcJDL_3fTwp7tSkRliTiXkNU3NvSGLVZenP6kPpqYUALPaAIH5mXlF9ZEIx-MrSgU7Xj4QfBa6iA8A5U8mrOKjPAqIlH1NRfLek5EGyZL4',
    badgeText: 'Custom Designed',
    procedureTime: 'Customizable (Usually 45 - 90 mins)',
    comfortLevel: 'Mild (Comfort strategies customized dynamically)',
    downtime: 'Minimal (Tailored to active protocols selected)',
    recommendedSessions: 'Customized based on personal assessment',
    concerns: [
      'General skin health preservation and barrier support',
      'Customized anti-aging and texturizing protocols',
      'Bespoke hydration infusion',
      'Individualized aesthetic goals'
    ],
    price: '$150',
    targetLayer: 'Dermis',
    targetLayerDepth: '1.5mm',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY',
    preCare: [
      'Arrive with a completely clean face, free from cosmetic products.',
      'Discontinue strong prescription acids 4 days before your consultation.',
      'Keep hydrated and avoid direct sunburns.',
      'Prepare to discuss your long-term skin goals and routine.'
    ],
    postCare: [
      'Follow the customized care regimen provided during your session.',
      'Always apply a physical daily SPF 50 sunscreen.',
      'Avoid extreme heat (sweating, saunas) for 24 hours.',
      'Avoid touching your face unnecessarily for 12 hours.'
    ]
  };

  return populateTreatmentMediaDefaults(baseItem);
};
