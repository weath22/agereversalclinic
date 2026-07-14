import {
  Service,
  TreatmentType,
  ProcessStep,
  FacilityRoom,
  GalleryItem,
  Testimonial,
  SpecialOffer,
  Product,
  TeamMember,
  BrandPartner,
  Article
} from './types';

export const SPECIALIST_AREAS = [
  {
    id: 'cancer-care',
    title: 'Cancer care',
    description: 'Expert consultants and advanced therapies for fast, world-class private cancer treatment.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXc7SORxoXUK7Kzbf256KDGjYoiGB3XeCLNYObBtlw7h8260KwmKxaiEQL7E2Wg3BTQhjpJs0Iw9GVYkNkpYhd4WPz_jdW6PA2i4yXAVvmrMoBCqMX479nyNRdb7X8GwVNjcQtb1OIG8li-NYXrs-55c2CPQIIew0siqNajiO8--wLogFbflBlElSPQ9GlaxJ2VmWkjKCbGUr2QX1FhpzqTBOU86kyynhHW4UjQMqKe-XDBVsXygiZM-ACB4nUWQl8J4dDjsBIEw'
  },
  {
    id: 'eye-centre',
    title: 'Eye Centre',
    description: 'Rapid diagnostics and tailored treatment for cataracts, eye disease and complex conditions.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4fJHIJX0K1v-oz5txqtrtxpaIViJ65RYhXP0GvCvV9X-BUkcVQEzgBqKS8YzsomPWnOJfJG0bHH7KhmjwFqawKN0Ss4I6mWbR3ZNdU44GSg2NLrvKAwaRieRBsOOT7KE8OriZhzgqvAFhE2KvoiitHEBwjWSBKT4Y81onojL9xa2DBvQY3ooaY_hI5oMtsQHGTkAhp4nYkzSmtJGApHA0MjH-_XS-vhuGsAAtT9vX_mD_3h-ImzrSsTJQk47WHJvD5amFx30t_g'
  },
  {
    id: 'lung-centre',
    title: 'Lung Centre',
    description: 'Fast access to lung diagnostics, therapies and minimally invasive treatments.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSewylSW1YbrYNaLbxZiwxQF6qhQmFTupVXlyUicJq7mls_9KiS0PKgUNmGBOXbGpaLuWRlegLQQDTQbvbNoC7CkLSz2F7KwNAc-d1s8luKt2R6VcojE1oK87g_TmfoFqurEFqbHSXUephHqQH3cIeAEMpzhaqXbEjIVKRBDAQMypjwZ3r-r3Um4iGWAwLDcARQTOD0Hw6TZmIYW9jH-_qH3xAxZVfPts2b6Qg_4UdK0nwL7q9pfmgOvUiiwB4ATkn09Vp0ctO6w'
  },
  {
    id: 'breast',
    title: 'Breast',
    description: 'Expert breast diagnostics with advanced, comfortable imaging for symptoms or family history concerns.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUloxcWsT4NRCnTfn0RneF4Q4BwymxBAMsqFKJv9IIvSzEjhVsjT_MDtI4irgzGW0su__ZFlPbs8_2ebSsDU3aWDop2YR9ea2x21K8fdCKFFVUTyJj9U_xiYZFY63zL5Btb43hR-HaxmbiKFgUp8DqEgm5D4mrjpPpfVzplLWjcWFD75MC4S3cc8dnLB7CywLocC5PIZJPdVTfCwgrgG4WqwQZabVdZ8OAlRAeHeZCBxQt2rP-Gm1MJcgjtoht4nVH3CBwLsNAF8OI'
  },
  {
    id: 'dermatology',
    title: 'Dermatology & Acne',
    description: 'Advanced clinical diagnostics and personalized therapies for persistent acne, rosacea, and cellular scarring.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX'
  },
  {
    id: 'laser-skin',
    title: 'Laser Skin Centre',
    description: 'State-of-the-art fractional CO2 and picosecond laser technologies for complete resurfacing and pigments.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC'
  },
  {
    id: 'facial-contouring',
    title: 'Facial Contouring',
    description: 'Precision aesthetic enhancements combining neuromodulators, fillers, and skin boosters for natural lift.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ'
  },
  {
    id: 'hair-restoration',
    title: 'Hair Restoration',
    description: 'Elite follicle stimulation, PRP and clinical growth induction therapies for healthy, robust hair.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW'
  },
  {
    id: 'cellular-wellness',
    title: 'Cellular Wellness',
    description: 'Intravenous micronutrient therapies and custom cellular vitalizations tailored to bio-markers.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r'
  },
  {
    id: 'longevity-screen',
    title: 'Longevity Screening',
    description: 'Pioneering early stage risk profiles, metabolic evaluations, and long-term vitality maps.',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLsFtpFDuaNJSlvtgV5ykI3LUHSXc0rzKFYXGGNqkYq6ujIGrmaVAI-UUZWBC9h6l95unMnlba0hL6OSt_W08ItQlzC4HTVhrV4H7Itfm0m7scTAtpBiomP9SY89c7Uj0Q5mgYXMjovpZuGcczZeQepLx4ye1bw1emHNdm8GxyKyt8TftVi79q1QOO0MHef213jXO6KWOkNL6ufVfwZSrPS20twzy3Jy2_MEVCz9mR9pJVAW24L2KhOTQP9P'
  },
  {
    id: 'body-sculpting',
    title: 'Body Sculpting',
    description: 'High-definition body shaping using advanced clinical electromagnetic waves and cryolipolysis.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR'
  },
  {
    id: 'clinical-facials',
    title: 'Medical Grade Facials',
    description: 'Intense dermal cleansing, microcurrent contouring, and medical peels with botanical antioxidants.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs'
  }
];

export const SERVICES: Service[] = [
  {
    id: 'acne',
    title: 'Acne Treatment',
    description: 'Advanced clinical solutions for persistent acne and scarring.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    isFeatured: false
  },
  {
    id: 'laser',
    title: 'Laser Therapy',
    description: 'Cutting-edge laser technology for pigmentation and resurfacing.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC',
    isFeatured: false
  },
  {
    id: 'anti-aging',
    title: 'Anti-Aging',
    description: 'Precision age-reversal protocols including fillers and neuromodulators.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    isFeatured: true
  },
  {
    id: 'pigmentation',
    title: 'Pigmentation',
    description: 'Targeted protocols for dark spots and uneven skin tone.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOtBKp33pnPLoKpvckXkiIS-1G2cj7yNpUXZYP7v7nB3HgYFreRRFM-F6UZt2uwFsUMzf2u0m_0SvHcja7AjjBjq8B4mo1Gk_Y3ihgY2qmmbr1Vc48W8QizQ3BLTsaPHv9ojoje0Q8wG64F4zjwPy98roZuGAorsk2N5TxRUibfaZ4gZ7L9r7cFXGqA6jBiryjo3-fh10ZWdkryws_w14ASGtvXypafuUczwEFeVz6SywQsQKFg--N76UkgP9d4Um3Q5Snz8eG_XyS',
    isFeatured: false
  },
  {
    id: 'hair',
    title: 'Hair Restoration',
    description: 'Clinical hair transplant and growth induction therapies.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
    isFeatured: false
  }
];

export const TREATMENTS: TreatmentType[] = [
  { id: '1', name: 'Permanent cosmetic makeup' },
  { id: '2', name: 'Cosmetic makeup services' },
  { id: '3', name: 'Facial Services' },
  { id: '4', name: 'Tinting' }
];

export const TREATMENT_IMAGES: string[] = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCxFMpWCmamXBrqtr3byekk8IxhE2yyDGA5Csl0k1gX-QAm0WlSNnY7JWxBhi_P-0cI9aXcm0u37Lx1mJD71bT1r7vkf_hkUKHQ5r5ZHO1lyWEJGrjcCjqbPHtMrqaADl5RHnV6wrOK5t6lYD0eDfR9A9e6HQrhvFCGQfDHqTSilyjMctWh0oe2v6Ftf0bnAmbfY9UxcG-hz6RqHNvavTumhSjzrQQzAMwwmIBBDPhKeG4tnbCMg1vvBC-d0H-SmLSihL8Yr0X6CCgA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDvTYE6O7-KUUhCD-DEa_kWziNerDAQzqbJJakBZ4fXCoZvCTmzQAT_VOqYbyHZ5ElTXNJ_6Ln6p-YkNwBsZJFL9AXe3LSjvR3Yo7ftDk8xjfRWbH-zoSfBc3kToZ27GZUJWEW92bJxW2lA9BVYy3gX8dDmrNGjy8D1mdKFG2EZebtfKtYbMYZdhT253WKmBSW9WsfRYdezgr1Pi8xzRL7L90-MH4HGeOKjiUDl_jnVpZwr6O_LiLdVSAZ-87OmvVUbzsaA1NJZ1nac',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBIu85aRvZNCnJgLddXBAuzq6-ZrHWm-RCio9ODG39WwLFMrukeSSTm7pYkErIfMtjwLveWBFsg7ViYoAHOh-QpVTrmygr1xGSzufZe33L847MBWThvbDnB59YUMqTnpKSUf_k70zg7HLIgogkrC3OyyAAH8Hcs-TZE835yDjkfMC6FaUE0n1AAualUfDS6PcpLLRKFuDA2-0kCYDlD_bp8d3XUW4lHWmr4BgevDidjZ7pwi7AyMs3U2GGDhbyxTNQbGZyNFQy2fQ3K',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCBxc6jP4hwXmQAzK3tOFmOz01LuueI8W0hSIcK2DE2SABrkLHEv8Ir49ZoGZsfZLViL2VdWZ7yOKCB5FoH43oJHDQMrUpaCmOkZuhYy3q3UU4IpKlxE7_v2EflID5JK5VR6RMJ3zrRPfCIrYzqF_ueg50cJ4P9k2qm02BPYhbGP97PzrriNaC3xudZCREYN2ybBQ8xUqHvOHbiE4r1IiptX6ceyF6s4M6_eqEN0av1Ndlshm2Xo1FKfVoc4a7R8d9dZl0C725aPVBG',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDlmnYf268DNBiW5kr7wG6Rujwjm9_r8RsUzCCIqJkMcpvqAgCuaCi-59_j-gZFmdFSwmrp1Q2hsuf1Vtoc6m0GvNJQfgaOPg1MVO-cyW4GKU73Rsf1dIW4s2iNlFlZQDv59YC-Hk2FTSuBEosGoMNX_a6IoJ7zqQBVIfWX3t7893ujN8TaqY_A-BHF9C3Q7PHWrKFjNOzQZcgoS61s0w0LagUIPzxmg1XVX79K6mixi8XyV_D-1SLZBuQLNYflozdvXEEcxy5niGBi',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAfyaPnt49TSDExL3DFORb4iSrfzaSamXu0UsuQBQ9GIOmTbQH49AElmwuGiyCDzguae9MH_5eHl6L-xpegZgYHaAk8itk3Q_3qDfnShjTa5620iiLX689z8EhhYPRQ2M0YylIDc6NTbza_0nHLgZ6ZqiGgYNLoZKZzGGtyt6_nPq3y_PkSsWmWoR5i4INdAuYrkIONjx4p477p9hBTwiH6x5aHhYPZMLmzMBq-Ji0Smi_Qle79-XWd0toXMYVtUi2VFvvxDRQT1s_1'
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: '1',
    stepNumber: '01',
    title: 'Consultation',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM4gEBGdyFtz-HxER-7Drrk9cLUdAuFPLy9wL9O6k-1_W9PNavk4d2zixzveXN5FfVK2kNvhRlDK3OZ21DLN47_vavlvtfZxrBUnE8lSqx1hREUDfYAa6RPy-CSKXT_lH5fTZ9XzDhPSZAVc7bPGwuRNyHZifjesgAzqDx4Bdh4AXS3AYJskMQmpP6Gm9wt9YO7QQBAN7_gJlMzXqWJqcvj0BC5ga98XxZtTVfC2CQq8RBFi6E6Vx0JqFIS2HIqfVKeuiO4mhhkUyI'
  },
  {
    id: '2',
    stepNumber: '02',
    title: 'Treatment',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpc9iwUPHl5YjJPUY9E95ThzCowbFO32u1yMI6QpZqPrQnBL7p9nmkyqw3JRkKKEl26-mJIFP0r8QNgHxIYxWnrIiagTCmDfr3L4TeyGpRJ4Ye8dwjLxT7kUVB0sTqVntaOcMm7700Jj3-8xh75QQkY3xOMGH04owJPA05JB3wRuKL7kUttqlyk-sOqZIwumYKh7VveixAFn2QXvlC7f8-S3zwQXujNvI0qHEwsxPonmj_-kRlbSiRVOcy67FFlTBCjBFzzvhYYOQ1'
  },
  {
    id: '3',
    stepNumber: '03',
    title: 'Care & Follow-up',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww'
  }
];

export const FACILITIES: FacilityRoom[] = [
  {
    id: 'facility-1',
    title: 'Reception Lounge',
    tag: 'Main Entrance',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLvP3DFx2If1DMSMz3JKM0HPzM540kXV5qx4ncam1B_CstR80gJfBU5AgVz_YsPJ7u8V1nICj4IKO0ho2mOZo1vuUDFZEw-Ayq4p14_4qW8gAEOq6vYJFfmXi02IYti-uAUEojYV7cVHRx8-IjuVyoJ6AdGSCYT0VhPznGkC--nZZbr2vqIbtzvJQaOoTpF7vm4dZGfUyfQgXnhGm3ra1mjdJAGKWeB3fhbxho_WV4iW-9ZUAe7bRastfXY'
  },
  {
    id: 'facility-2',
    title: 'Advanced Therapy',
    tag: 'Clinical Suite',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLvbGkim0rHF7Ruf3smBfq7BlZDg7FTbjFo3KTx21CJ86qX2T7gThqEfQmaS69rYUNtNQrnGPXJIOJTcoIOz_hCdUGzS-Cyeio7-DWxIyZZVQH95grNa2bbhnLGjt5IANWtQWycAC7JKxw6K1syY9H1W4ty0-Mpc3D-dH4coJR0zr5IaxigQ7G2BRK9YnWheyv8CjvRuSu4fbTW4fj4AP8QhZU3p2G1Rg0ztNQS13w1SZT_7bU3qioomJ9_f'
  },
  {
    id: 'facility-3',
    title: 'Private Consultation',
    tag: 'Expert Advice',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLsFtpFDuaNJSlvtgV5ykI3LUHSXc0rzKFYXGGNqkYq6ujIGrmaVAI-UUZWBC9h6l95unMnlba0hL6OSt_W08ItQlzC4HTVhrV4H7Itfm0m7scTAtpBiomP9SY89c7Uj0Q5mgYXMjovpZuGcczZeQepLx4ye1bw1emHNdm8GxyKyt8TftVi79q1QOO0MHef213jXO6KWOkNL6ufVfwZSrPS20twzy3Jy2_MEVCz9mR9pJVAW24L2KhOTQP9P'
  },
  {
    id: 'facility-4',
    title: 'Wellness Sanctuary',
    tag: 'Patient Comfort',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-acne',
    title: 'Acne Treatment',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY'
  },
  {
    id: 'gal-antiaging',
    title: 'Anti-Aging',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLv5evIx7Bexs-9iJGxOP9dKFElgqCjw3duyD5PU_MlEubT0SyTO7PuZhJtmqUZf6JcUhS8jDhV8HW0kBhWUb4MYYalT72IO5pVBeVZs2593mjjAC6tI1ZOA1a9xGgg-M5J5waWMYO9uVD4zle9guZj31tQOME7032wvttEoahsd7HhWFooW0oUTyDgrytGK4oKIN0d2mGO5oLnx-NQ5sF7-OZHtA3a9_sCrUegKiXGZwpy_05469C2zVgo'
  },
  {
    id: 'gal-hair',
    title: 'Hair Restoration',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Sandra Blake',
    role: 'CEO, Digital Agency',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0sGBWhyvflKKvPKdNj9eTy54fC48-JeBgjZKNpiFsfm5GPsH22DxfzanRDBWS6t55bXcWKOjgOqIsqlmeaYRkXfOm_34vmiaqGCOiG6frIQ6lgsfQ1SK38rV8reNQxw2gaK5cbvht1BZL0sbw78SliDjayEPSBPV1ruNcJDL_3fTwp7tSkRliTiXkNU3NvSGLVZenP6kPpqYUALPaAIH5mXlF9ZEIx-MrSgU7Xj4QfBa6iA8A5U8mrOKjPAqIlH1NRfLek5EGyZL4',
    rating: 5,
    quote: "The Regenerative Exosome therapy completely changed my skin barrier. After just two sessions, my hyperpigmentation faded, and my skin feels incredibly smooth and hydrated. Dr. Selina is a absolute genius!",
    treatmentId: 'exosome',
    category: 'Regenerative Aesthetics'
  },
  {
    id: 'test-2',
    name: 'Paula Reynolds',
    role: 'CEO, Flower Delivery App',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR',
    rating: 5,
    quote: "Profhilo Injectable Hydration is literally a magic elixir. I had crepey skin on my cheeks, and this treatment restored a plump, glowing, deeply hydrated look. Highly recommend!",
    treatmentId: 'profhilo',
    category: 'Bio-Remodeling'
  },
  {
    id: 'test-3',
    name: 'Eleanor Vance',
    role: 'Venture Partner',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs',
    rating: 5,
    quote: "The Morpheus8 treatment completely contoured my jawline and tightened my jowls. Yes, there is a little bit of flaking for a few days, but the results are extraordinarily natural and durable.",
    treatmentId: 'morpheus8',
    category: 'Fractional Skin Remodeling'
  },
  {
    id: 'test-4',
    name: 'Victoria Sterling',
    role: 'Creative Director',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOcCZPaRxweEHVCXW2lbb5PG8ZLYLZiq2I2USRuAe1FMZNRZhSR-LB9y5d2NrEWRTmck9iCwFhaHarc08zQ_uZA40Iu5ayTxuTgRI52IhFJ0VPuNKf7g0MGT2NDHsnKFZufsL9P6-_d8fVMKxDgZ2nkjkfGoH-Fno5vzxnIXyXqbyoqqhej93y11Xogy4v9z5ivSDeiVVeYJVm2UBtLI5S_J-1PSQqKRBCZjNeOLG7fnyrCzWpuBxwPYiB2FOSMF-7OG5gYAhV9bf1',
    rating: 5,
    quote: "Ultherapy is the gold standard for a non-surgical lift. Dr. Selina mapped out the ultrasound lines with ultimate care. My brows and neck look so much more lifted and defined over the last 3 months.",
    treatmentId: 'ultherapy',
    category: 'Micro-Focused Ultrasound'
  },
  {
    id: 'test-5',
    name: 'Amelia Hughes',
    role: 'Senior Editorial Manager',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDddaCi7PsPNTwV7AiEWxAoBSKDc9x7oJb4yFMVO41f99W4wxnnsgcI6AzvsOCf4kSCE8EDCAOgvLeEfBhBAJqjpM00DsGFv8_3x2tYtIe6sFTplMAF9SLyrwFaIWhlfrTIF4wOh7dR5swda_bf9ss9jn1vOr5QOYEgWeCxEODworWQ1wvIOUWEoW4mKN15tNvMocfNZjw7xG4qU0sKbOB2UrkHu3YPQoq-WswAXNY-4y2nGG1mBgta8XV5lBlewVQ242-xoDTjIW1l',
    rating: 5,
    quote: "Polynucleotide therapy completely restored my tear troughs and erased dark circles. My under-eye skin feels significantly thicker, hydrated, and much healthier. It's a miracle!",
    treatmentId: 'polynucleotide',
    category: 'DNA Cellular Repair'
  },
  {
    id: 'test-6',
    name: 'Grace Darling',
    role: 'Fashion Consultant',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0sGBWhyvflKKvPKdNj9eTy54fC48-JeBgjZKNpiFsfm5GPsH22DxfzanRDBWS6t55bXcWKOjgOqIsqlmeaYRkXfOm_34vmiaqGCOiG6frIQ6lgsfQ1SK38rV8reNQxw2gaK5cbvht1BZL0sbw78SliDjayEPSBPV1ruNcJDL_3fTwp7tSkRliTiXkNU3NvSGLVZenP6kPpqYUALPaAIH5mXlF9ZEIx-MrSgU7Xj4QfBa6iA8A5U8mrOKjPAqIlH1NRfLek5EGyZL4',
    rating: 5,
    quote: "Finally, lips that look plump but perfectly natural and hydrated! Dr. Selina's clinical technique respects facial symmetry beautifully. I am in love with the vermillion definition.",
    treatmentId: 'lip',
    category: 'Dermal Sculpting'
  },
  {
    id: 'test-7',
    name: 'Charlotte Finch',
    role: 'Wellness Influencer',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR',
    rating: 5,
    quote: "The bio-stimulating non-surgical buttock lift was exactly what I wanted. It rounded my hip dips and tightened lax skin with absolutely no downtime. The results are phenomenal.",
    treatmentId: 'buttock',
    category: 'Body Contouring'
  },
  {
    id: 'test-8',
    name: 'Isabella Rossi',
    role: 'Interior Architect',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs',
    rating: 5,
    quote: "My hooded eyelids made me look tired all the time. The Plasma Blepharoplasty sublimated the excess skin flawlessly. Highly recommend this over any surgical option!",
    treatmentId: 'blepharoplasty',
    category: 'Eyelid Sublimation'
  },
  {
    id: 'test-9',
    name: 'Sophia Thorne',
    role: 'Financial Analyst',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOcCZPaRxweEHVCXW2lbb5PG8ZLYLZiq2I2USRuAe1FMZNRZhSR-LB9y5d2NrEWRTmck9iCwFhaHarc08zQ_uZA40Iu5ayTxuTgRI52IhFJ0VPuNKf7g0MGT2NDHsnKFZufsL9P6-_d8fVMKxDgZ2nkjkfGoH-Fno5vzxnIXyXqbyoqqhej93y11Xogy4v9z5ivSDeiVVeYJVm2UBtLI5S_J-1PSQqKRBCZjNeOLG7fnyrCzWpuBxwPYiB2FOSMF-7OG5gYAhV9bf1',
    rating: 5,
    quote: "Aqualyx fat dissolving completely eliminated my stubborn double chin. Two sessions spaced 4 weeks apart did the trick. Dr. Selina's hand is extremely precise and comforting.",
    treatmentId: 'aqualyx',
    category: 'Injectable Lipolysis'
  }
];

export const SPECIAL_OFFERS: SpecialOffer[] = [
  {
    id: 'offer-1',
    title: 'Spring Beauty Sale',
    discount: 'Up to 40% Off',
    description: 'Exclusive discounts on our premium skincare range and advanced clinical treatments. Limited time only.',
    buttonText: 'SHOP NOW',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcfjRtV-07yUdNgYvtM8FVZ2hnX0kjmQG5p7h_OVhSTU-EHBIjcHkJ6uF1xJ-miU2NjdoNBjpuHpilqynwxmJI_7nmLade5KVPft5LvJN815DbEHDRAKb8j8HpeUzHIUj75e9Cd3V5eni5rOU940wzqI1bhB2nCmQYktnwA9GAEqSbj3cwNXbLWcRYjL49Iu-Wa5wFn2hMRvIbGBWXO4QSBQdPo53zAOZ23E_vxS2ZmRiCh2p1Ndbffn_A6r5xqpzm0jNzxWW97yz4',
    theme: 'rose'
  },
  {
    id: 'offer-2',
    title: 'New Patient Special',
    discount: 'Flat 20% Off',
    description: 'Your first consultation and treatment session at a special introductory price. Start your journey today.',
    buttonText: 'BOOK NOW',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    theme: 'dark'
  },
  {
    id: 'offer-morpheus8',
    title: 'Morpheus8 Glow Package',
    discount: 'Save $250 Today',
    description: 'Book a full package of 3 Morpheus8 sessions and receive a complimentary Exosome Regenerative calming treatment to accelerate repair.',
    buttonText: 'CLAIM OFFER',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOtBKp33pnPLoKpvckXkiIS-1G2cj7yNpUXZYP7v7nB3HgYFreRRFM-F6UZt2uwFsUMzf2u0m_0SvHcja7AjjBjq8B4mo1Gk_Y3ihgY2qmmbr1Vc48W8QizQ3BLTsaPHv9ojoje0Q8wG64F4zjwPy98roZuGAorsk2N5TxRUibfaZ4gZ7L9r7cFXGqA6jBiryjo3-fh10ZWdkryws_w14ASGtvXypafuUczwEFeVz6SywQsQKFg--N76UkgP9d4Um3Q5Snz8eG_XyS',
    theme: 'rose',
    treatmentId: 'morpheus8',
    category: 'Fractional Skin Remodeling'
  },
  {
    id: 'offer-ultherapy',
    title: 'Ultherapy Lift Special',
    discount: '15% Off Neck Add-on',
    description: 'Get 15% off when you combine full face Ultherapy Non-Surgical Lift with a targeted neck tightening session.',
    buttonText: 'RESERVE OFFER',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
    theme: 'dark',
    treatmentId: 'ultherapy',
    category: 'Micro-Focused Ultrasound'
  },
  {
    id: 'offer-profhilo',
    title: 'Profhilo Hydration Duo',
    discount: '2 Sessions for $799',
    description: 'Experience the ultimate bio-remodeling hydration protocol. Reserve your 2-session recommended plan today.',
    buttonText: 'BOOK PROTOCOL',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC',
    theme: 'rose',
    treatmentId: 'profhilo',
    category: 'Bio-Remodeling'
  },
  {
    id: 'offer-polynucleotide',
    title: 'Polynucleotide Bright Eye',
    discount: 'Complimentary Product',
    description: 'Book a full course of 3 Polynucleotide sessions and receive a complimentary medical Hydra-Mist product for home care.',
    buttonText: 'CLAIM OFFER',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    theme: 'dark',
    treatmentId: 'polynucleotide',
    category: 'DNA Cellular Repair'
  },
  {
    id: 'offer-lip',
    title: 'Lush Lips Definition Special',
    discount: '$50 Off First Session',
    description: 'Bespoke, proportional lip contouring and hydration using premium hyaluronic acid gel formulas. Limited sessions.',
    buttonText: 'RESERVE SPOT',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww',
    theme: 'rose',
    treatmentId: 'lip',
    category: 'Dermal Sculpting'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    brand: 'ARC ESSENTIALS',
    name: 'Renewing Serum',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    price: '$85.00',
    category: 'Serums'
  },
  {
    id: 'prod-2',
    brand: 'ARC ESSENTIALS',
    name: 'Lumina Cleanser',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    price: '$42.00',
    category: 'Cleansers'
  },
  {
    id: 'prod-3',
    brand: 'ARC ESSENTIALS',
    name: 'Hydra-Mist',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC',
    price: '$38.00',
    category: 'Mists'
  },
  {
    id: 'prod-4',
    brand: 'ARC ESSENTIALS',
    name: 'Night Recovery Cream',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOtBKp33pnPLoKpvckXkiIS-1G2cj7yNpUXZYP7v7nB3HgYFreRRFM-F6UZt2uwFsUMzf2u0m_0SvHcja7AjjBjq8B4mo1Gk_Y3ihgY2qmmbr1Vc48W8QizQ3BLTsaPHv9ojoje0Q8wG64F4zjwPy98roZuGAorsk2N5TxRUibfaZ4gZ7L9r7cFXGqA6jBiryjo3-fh10ZWdkryws_w14ASGtvXypafuUczwEFeVz6SywQsQKFg--N76UkgP9d4Um3Q5Snz8eG_XyS',
    price: '$95.00',
    category: 'Creams'
  }
];

export const FOUNDER: TeamMember = {
  id: 'dr-selina',
  name: 'Adv. Faith Chris',
  role: 'FOUNDER & CEO',
  description: 'Adv. Faith Chris founded Age Reversal Clinic with a vision to bridge the gap between clinical dermatology and luxury wellness. With over two decades of experience, she has pioneered several non-invasive rejuvenation techniques.\n\nHer philosophy centers on enhancing natural beauty through science-backed protocols, ensuring every patient receives a bespoke treatment plan that honors their unique skin journey.',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDddaCi7PsPNTwV7AiEWxAoBSKDc9x7oJb4yFMVO41f99W4wxnnsgcI6AzvsOCf4kSCE8EDCAOgvLeEfBhBAJqjpM00DsGFv8_3x2tYtIe6sFTplMAF9SLyrwFaIWhlfrTIF4wOh7dR5swda_bf9ss9jn1vOr5QOYEgWeCxEODworWQ1wvIOUWEoW4mKN15tNvMocfNZjw7xG4qU0sKbOB2UrkHu3YPQoq-WswAXNY-4y2nGG1mBgta8XV5lBlewVQ242-xoDTjIW1l'
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Ava Martinez',
    role: 'ESTHETICIAN',
    description: 'Specializing in advanced facial therapies and chemical peels.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0sGBWhyvflKKvPKdNj9eTy54fC48-JeBgjZKNpiFsfm5GPsH22DxfzanRDBWS6t55bXcWKOjgOqIsqlmeaYRkXfOm_34vmiaqGCOiG6frIQ6lgsfQ1SK38rV8reNQxw2gaK5cbvht1BZL0sbw78SliDjayEPSBPV1ruNcJDL_3fTwp7tSkRliTiXkNU3NvSGLVZenP6kPpqYUALPaAIH5mXlF9ZEIx-MrSgU7Xj4QfBa6iA8A5U8mrOKjPAqIlH1NRfLek5EGyZL4'
  },
  {
    id: 'member-2',
    name: 'Dr. Sophia Chang',
    role: 'MEDICAL DIRECTOR',
    description: 'Expert in injectable treatments and laser dermatology.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR'
  },
  {
    id: 'member-3',
    name: 'Nadia Johnson',
    role: 'WELLNESS COORDINATOR',
    description: 'Guiding patients through holistic skin health and nutrition.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs'
  },
  {
    id: 'member-4',
    name: 'Lena Kozlov',
    role: 'SPA MANAGER',
    description: 'Ensuring a seamless and luxurious experience for every guest.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOcCZPaRxweEHVCXW2lbb5PG8ZLYLZiq2I2USRuAe1FMZNRZhSR-LB9y5d2NrEWRTmck9iCwFhaHarc08zQ_uZA40Iu5ayTxuTgRI52IhFJ0VPuNKf7g0MGT2NDHsnKFZufsL9P6-_d8fVMKxDgZ2nkjkfGoH-Fno5vzxnIXyXqbyoqqhej93y11Xogy4v9z5ivSDeiVVeYJVm2UBtLI5S_J-1PSQqKRBCZjNeOLG7fnyrCzWpuBxwPYiB2FOSMF-7OG5gYAhV9bf1'
  }
];

export const BRAND_PARTNERS: BrandPartner[] = [
  { id: 'bp-1', name: 'Lumina', iconType: 'circle' },
  { id: 'bp-2', name: 'Aether', iconType: 'layers' },
  { id: 'bp-3', name: 'Vera', iconType: 'pill' },
  { id: 'bp-4', name: 'Zenith', iconType: 'shield' },
  { id: 'bp-5', name: 'Nexus', iconType: 'instagram' }
];

export const NEWS_ARTICLES: Article[] = [
  {
    id: 'news-1',
    title: 'Podiatrist Saj returns to Wimbledon to care for world’s greatest tennis superstars... feet',
    description: 'Podiatrist Mr Saj Afzal returns to Wimbledon for a sixth year, revealing what it takes to keep the world\'s top tennis players on their feet.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXc7SORxoXUK7Kzbf256KDGjYoiGB3XeCLNYObBtlw7h8260KwmKxaiEQL7E2Wg3BTQhjpJs0Iw9GVYkNkpYhd4WPz_jdW6PA2i4yXAVvmrMoBCqMX479nyNRdb7X8GwVNjcQtb1OIG8li-NYXrs-55c2CPQIIew0siqNajiO8--wLogFbflBlElSPQ9GlaxJ2VmWkjKCbGUr2QX1FhpzqTBOU86kyynhHW4UjQMqKe-XDBVsXygiZM-ACB4nUWQl8J4dDjsBIEw',
    date: 'July 5, 2026',
    author: 'Mr Saj Afzal',
    tag: 'Sports Medicine'
  },
  {
    id: 'news-2',
    title: 'National Clean Air Day Expert Q&A',
    description: 'Respiratory specialist Dr Ricardo José explains how air pollution affects your lungs and shares practical steps to reduce exposure.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSewylSW1YbrYNaLbxZiwxQF6qhQmFTupVXlyUicJq7mls_9KiS0PKgUNmGBOXbGpaLuWRlegLQQDTQbvbNoC7CkLSz2F7KwNAc-d1s8luKt2R6VcojE1oK87g_TmfoFqurEFqbHSXUephHqQH3cIeAEMpzhaqXbEjIVKRBDAQMypjwZ3r-r3Um4iGWAwLDcARQTOD0Hw6TZmIYW9jH-_qH3xAxZVfPts2b6Qg_4UdK0nwL7q9pfmgOvUiiwB4ATkn09Vp0ctO6w',
    date: 'June 18, 2026',
    author: 'Dr Ricardo José',
    tag: 'Respiratory'
  },
  {
    id: 'news-3',
    title: 'Fundraising to honor my childhood best friend Dave and help others',
    description: 'Fundraiser Jason Smith, in conversation with Psychologist Rupali Kulshreshtha, talk about the 321 Cycle Challenge and supporting others.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4fJHIJX0K1v-oz5txqtrtxpaIViJ65RYhXP0GvCvV9X-BUkcVQEzgBqKS8YzsomPWnOJfJG0bHH7KhmjwFqawKN0Ss4I6mWbR3ZNdU44GSg2NLrvKAwaRieRBsOOT7KE8OriZhzgqvAFhE2KvoiitHEBwjWSBKT4Y81onojL9xa2DBvQY3ooaY_hI5oMtsQHGTkAhp4nYkzSmtJGApHA0MjH-_XS-vhuGsAAtT9vX_mD_3h-ImzrSsTJQk47WHJvD5amFx30t_g',
    date: 'May 24, 2026',
    author: 'Jason Smith',
    tag: 'Community'
  }
];

export const STORY_ARTICLES: Article[] = [
  {
    id: 'story-1',
    title: 'Overcoming Breast Cancer: Emily’s Journey of Hope and Precision Care',
    description: 'How rapid diagnostic breast screenings and world-class oncological care at The London Clinic gave Emily her life and peace of mind back.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUloxcWsT4NRCnTfn0RneF4Q4BwymxBAMsqFKJv9IIvSzEjhVsjT_MDtI4irgzGW0su__ZFlPbs8_2ebSsDU3aWDop2YR9ea2x21K8fdCKFFVUTyJj9U_xiYZFY63zL5Btb43hR-HaxmbiKFgUp8DqEgm5D4mrjpPpfVzplLWjcWFD75MC4S3cc8dnLB7CywLocC5PIZJPdVTfCwgrgG4WqwQZabVdZ8OAlRAeHeZCBxQt2rP-Gm1MJcgjtoht4nVH3CBwLsNAF8OI',
    date: 'April 12, 2026',
    author: 'Emily Watson',
    tag: 'Breast Care'
  },
  {
    id: 'story-2',
    title: 'Regaining Crystal Clear Vision: Robert’s Eye Centre Success Story',
    description: 'Robert shares his experience of undergoing state-of-the-art cataract surgery and receiving premium private care from our leading consultants.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4fJHIJX0K1v-oz5txqtrtxpaIViJ65RYhXP0GvCvV9X-BUkcVQEzgBqKS8YzsomPWnOJfJG0bHH7KhmjwFqawKN0Ss4I6mWbR3ZNdU44GSg2NLrvKAwaRieRBsOOT7KE8OriZhzgqvAFhE2KvoiitHEBwjWSBKT4Y81onojL9xa2DBvQY3ooaY_hI5oMtsQHGTkAhp4nYkzSmtJGApHA0MjH-_XS-vhuGsAAtT9vX_mD_3h-ImzrSsTJQk47WHJvD5amFx30t_g',
    date: 'March 3, 2026',
    author: 'Robert Davies',
    tag: 'Eye Centre'
  },
  {
    id: 'story-3',
    title: 'A New Lease on Life: Advancing Lung Diagnostics at the Clinic',
    description: 'After years of unexplained fatigue and breathing issues, specialized pulmonary therapies provided immediate answers and lasting relief.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSewylSW1YbrYNaLbxZiwxQF6qhQmFTupVXlyUicJq7mls_9KiS0PKgUNmGBOXbGpaLuWRlegLQQDTQbvbNoC7CkLSz2F7KwNAc-d1s8luKt2R6VcojE1oK87g_TmfoFqurEFqbHSXUephHqQH3cIeAEMpzhaqXbEjIVKRBDAQMypjwZ3r-r3Um4iGWAwLDcARQTOD0Hw6TZmIYW9jH-_qH3xAxZVfPts2b6Qg_4UdK0nwL7q9pfmgOvUiiwB4ATkn09Vp0ctO6w',
    date: 'Feb 15, 2026',
    author: 'Michael Vance',
    tag: 'Lung Centre'
  }
];
