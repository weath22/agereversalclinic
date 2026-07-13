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
}

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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
  lip: {
    id: 'lip',
    title: 'Precision Lip Enhancement',
    category: 'Dermal Sculpting',
    description: 'Expert, bespoke lip contouring and volumization using industry-leading hyaluronic acid gel formulas. Our philosophy emphasizes proportional symmetry, subtle definition of the Cupid\'s bow, and deep vermillion hydration, ensuring a lush yet completely natural-looking result.',
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
    ]
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
      'Mild cellullite and tissue laxity on thighs/buttocks',
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
    ]
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
    ]
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
    ]
  }
};

export const DEFAULT_TREATMENT_DETAILS = (name: string): TreatmentDetail => ({
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
});
