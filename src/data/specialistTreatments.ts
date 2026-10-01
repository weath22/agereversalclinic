export interface SpecialistTreatment {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  badge?: string;
}

export const ALL_SPECIALIST_TREATMENTS: SpecialistTreatment[] = [
  // Page 1: Signature Facial Rejuvenation & Biotech
  {
    id: 'facial-injectables',
    title: 'Facial Injectables',
    category: 'Facial Aesthetics',
    description: 'Advanced clinical injectables and facial contouring tailored for natural lift, harmony, and structural rejuvenation.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOPTQtfj8J1bbB7SlVVRU6fYo2gWaZ-vP4FOmbQ0GK-wiSWxgFv7RrufflpNtjGP9Dk5eLV2kMfUIPVx1N4ETnRWMUGQ-pnWBcZCa97apM4cg71CV6hKaKDiQOlU26NKqLXuvzRkHrDNd-vXfy5u3MHCvpyxfbnHdk9lkm5vhjg9zIrK1aYJGwOOOPurVrXxbRr7FprgjD7ZzrUzhcc4DM6YdWc6J8P_jEx9W_ffwKfL2E8x3PIYt0_G8MTcbFUJlLtFYmgOa7s-OK',
    badge: 'Signature'
  },
  {
    id: 'skin-rejuvenation',
    title: 'Skin Rejuvenation',
    category: 'Medical Dermatology',
    description: 'State-of-the-art medical grade facials, laser therapies, and cellular treatments for luminous, clear skin.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2a_0Datjn8f2On3mNF7IY6_QgXkw0AQl1Il2WqYPqYqTU7wUKYRpJUg2xdA_d0B8SfBpbvVzzYOczvA85hXWv6hkb0snKG0UXUjP3EUDr0nkt_A_nINJJOIpGcQ2X_iD94V14qlhvJmRUp8In6cOEtlONSRSf5Kpdd8uA6VUX3SFIaBku4xsVbSvg9fE6K0FWVX-QGNWmY4jhYY70yZCEdfN_V3cezSz0jiycoy31X-hMxrw-bNoMrpEVo43FV1z8TnWKiqVpTdlK',
    badge: 'Popular'
  },
  {
    id: 'body-contouring',
    title: 'Body Contouring',
    category: 'Body Sculpting',
    description: 'High-definition body shaping using advanced clinical techniques, including dermal fillers and fat reduction.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClIGVnrpyhbZbn4skniRN95s8fe43niaHTpE2PHrPr4EAZc-kvyMu1k6JL4FcYCAw-SE1G2rBygkpuYimKkujZ8Ch9rHKJwqguHanaAZbAL8-ujTZWI6ThpC_rihPWbmp-seHAxJjDCFpT3JHdZknmaCVpfRjqS3n6DVdZCyDo4SBhN_q4D4NflwD5qBwDUw7uXpgpjXln7PkJWypOLjdKW-xVYzB53vh6hXOmAgbAecmaayoHjY2ZousTGNq_zRShg3Go2f8V0O4R',
    badge: 'High-Def'
  },
  {
    id: 'hair-restoration',
    title: 'Hair Restoration',
    category: 'Trichology',
    description: 'Elite follicle stimulation and clinical growth induction therapies for healthy, robust hair restoration.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCauimUjLiG4FTybnhAOQgEeV5EX6ZPVafVgrL3ZQsSct4k3azc70DZOUL83NrLvzdJb2f8vDkSR-JW3kDIXtIlaDRE7geAe7clP3VWiV3uUxojtpMPuJEi5OqDgxLNHx9CkD10MbA89eiJWjBKIGS_6wyql817jtfy9hiYYvBvNSkfl-hWqMAYjqlQY60-eyfLsAJrUNmaucXp2XyxxJ3g8KII7-qGALB6o42Cwv1YMd51LLVpOMqPrCEUk2hzlWKV6lTlxBcieuUH',
    badge: 'Clinical'
  },

  // Page 2: Regenerative Aesthetics
  {
    id: 'exosome-therapy',
    title: 'Exosome Regenerative Therapy',
    category: 'Regenerative Aesthetics',
    description: 'Groundbreaking cellular communication therapy delivering pure growth factors and signaling proteins to reverse dermal aging.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    badge: 'Biotech'
  },
  {
    id: 'profhilo-hydration',
    title: 'Profhilo Injectable Hydration',
    category: 'Bio-Remodeling',
    description: 'High-concentration hyaluronic acid bio-remodeling that stimulates four types of collagen for deep, luminous hydration.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC',
    badge: 'Award-Winning'
  },
  {
    id: 'polynucleotides-dna',
    title: 'Polynucleotide DNA Repair',
    category: 'DNA Cellular Repair',
    description: 'Natural DNA fractions that repair compromised microvasculature, resolve under-eye hollows, and promote cellular turnover.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    badge: 'Cellular'
  },
  {
    id: 'morpheus8-rf',
    title: 'Morpheus8 RF Microneedling',
    category: 'Fractional Remodeling',
    description: 'Subdermal adipose remodeling combining insulated microneedles with deep radiofrequency for profound skin tightening.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOtBKp33pnPLoKpvckXkiIS-1G2cj7yNpUXZYP7v7nB3HgYFreRRFM-F6UZt2uwFsUMzf2u0m_0SvHcja7AjjBjq8B4mo1Gk_Y3ihgY2qmmbr1Vc48W8QizQ3BLTsaPHv9ojoje0Q8wG64F4zjwPy98roZuGAorsk2N5TxRUibfaZ4gZ7L9r7cFXGqA6jBiryjo3-fh10ZWdkryws_w14ASGtvXypafuUczwEFeVz6SywQsQKFg--N76UkgP9d4Um3Q5Snz8eG_XyS',
    badge: 'Tightening'
  },

  // Page 3: Advanced Lifting & Contouring
  {
    id: 'ultherapy-lift',
    title: 'Ultherapy SMAS Lift',
    category: 'Ultrasound Therapy',
    description: 'FDA-cleared micro-focused ultrasound targeting the deep SMAS foundational layer to lift the brows, jawline, and neck.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
    badge: 'Non-Surgical'
  },
  {
    id: 'precision-lip',
    title: 'Precision Lip Enhancement',
    category: 'Dermal Fillers',
    description: 'Artistic contouring and vermillion border definition using ultra-smooth hyaluronic acid formulas for delicate natural volume.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww',
    badge: 'Artistry'
  },
  {
    id: 'non-surgical-rhinoplasty',
    title: 'Non-Surgical Rhinoplasty',
    category: 'Facial Sculpting',
    description: 'Micro-droplet dermal filler positioning to straighten nasal bridges, camouflage dorsal humps, and lift nasal tips instantly.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxFMpWCmamXBrqtr3byekk8IxhE2yyDGA5Csl0k1gX-QAm0WlSNnY7JWxBhi_P-0cI9aXcm0u37Lx1mJD71bT1r7vkf_hkUKHQ5r5ZHO1lyWEJGrjcCjqbPHtMrqaADl5RHnV6wrOK5t6lYD0eDfR9A9e6HQrhvFCGQfDHqTSilyjMctWh0oe2v6Ftf0bnAmbfY9UxcG-hz6RqHNvavTumhSjzrQQzAMwwmIBBDPhKeG4tnbCMg1vvBC-d0H-SmLSihL8Yr0X6CCgA',
    badge: 'Instant Results'
  },
  {
    id: 'tear-trough-rejuvenation',
    title: 'Tear Trough Rejuvenation',
    category: 'Under-Eye Solutions',
    description: 'Micro-cannula filler placement in the delicate infraorbital groove to erase hollow shadows and eradicate dark tired eyes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvTYE6O7-KUUhCD-DEa_kWziNerDAQzqbJJakBZ4fXCoZvCTmzQAT_VOqYbyHZ5ElTXNJ_6Ln6p-YkNwBsZJFL9AXe3LSjvR3Yo7ftDk8xjfRWbH-zoSfBc3kToZ27GZUJWEW92bJxW2lA9BVYy3gX8dDmrNGjy8D1mdKFG2EZebtfKtYbMYZdhT253WKmBSW9WsfRYdezgr1Pi8xzRL7L90-MH4HGeOKjiUDl_jnVpZwr6O_LiLdVSAZ-87OmvVUbzsaA1NJZ1nac',
    badge: 'Refreshed Eyes'
  },

  // Page 4: Facial Architecture & Symmetry
  {
    id: 'jawline-contouring',
    title: 'Contouring The Jawline',
    category: 'Structural Aesthetics',
    description: 'High-density G-prime dermal fillers placed along the mandibular angle to sculpt sharp, youthful definition.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIu85aRvZNCnJgLddXBAuzq6-ZrHWm-RCio9ODG39WwLFMrukeSSTm7pYkErIfMtjwLveWBFsg7ViYoAHOh-QpVTrmygr1xGSzufZe33L847MBWThvbDnB59YUMqTnpKSUf_k70zg7HLIgogkrC3OyyAAH8Hcs-TZE835yDj',
    badge: 'Definition'
  },
  {
    id: 'chin-enhancement',
    title: 'Chin Enhancement & Projection',
    category: 'Facial Balance',
    description: 'Harmonize your facial profile and strengthen retrognathic chins with precise filler placement to balance nose and lips.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r',
    badge: 'Profile Balance'
  },
  {
    id: 'cheek-sculpting',
    title: 'Cheek Midface Volumisation',
    category: 'Malar Rejuvenation',
    description: 'Restore youthful Ogee curves and lift the nasolabial folds by replenishing age-related malar bone volume loss.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs',
    badge: 'Midface Lift'
  },
  {
    id: 'temple-filler',
    title: 'Temple Volume Restoration',
    category: 'Upper Face',
    description: 'Softens hollow temporal depressions that contribute to an aged appearance, creating an unbroken youthful oval silhouette.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXc7SORxoXUK7Kzbf256KDGjYoiGB3XeCLNYObBtlw7h8260KwmKxaiEQL7E2Wg3BTQhjpJs0Iw9GVYkNkpYhd4WPz_jdW6PA2i4yXAVvmrMoBCqMX479nyNRdb7X8GwVNjcQtb1OIG8li-NYXrs-55c2CPQIIew0siqNajiO8--wLogFbflBlElSPQ9GlaxJ2VmWkjKCbGUr2QX1FhpzqTBOU86kyynhHW4UjQMqKe-XDBVsXygiZM-ACB4nUWQl8J4dDjsBIEw',
    badge: 'Symmetry'
  },

  // Page 5: Neuromodulators & Wrinkle Relaxation
  {
    id: 'lines-wrinkles-smoothing',
    title: 'Lines & Wrinkles Smoothing',
    category: 'Neuromodulators',
    description: 'Expert dosage targeting forehead lines, frown furrows, and crow\'s feet while retaining expressive, completely natural movement.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4fJHIJX0K1v-oz5txqtrtxpaIViJ65RYhXP0GvCvV9X-BUkcVQEzgBqKS8YzsomPWnOJfJG0bHH7KhmjwFqawKN0Ss4I6mWbR3ZNdU44GSg2NLrvKAwaRieRBsOOT7KE8OriZhzgqvAFhE2KvoiitHEBwjWSBKT4Y81onojL9xa2DBvQY3ooaY_hI5oMtsQHGTkAhp4nYkzSmtJGApHA0MjH-_XS-vhuGsAAtT9vX_mD_3h-ImzrSsTJQk47WHJvD5amFx30t_g',
    badge: 'Natural Look'
  },
  {
    id: 'jaw-reduction-masseter',
    title: 'Masseter Jaw Slimming',
    category: 'Facial Slimming',
    description: 'Targeted relaxation of hypertrophic masseter muscles to relieve nocturnal bruxism and achieve an elegant V-line facial shape.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSewylSW1YbrYNaLbxZiwxQF6qhQmFTupVXlyUicJq7mls_9KiS0PKgUNmGBOXbGpaLuWRlegLQQDTQbvbNoC7CkLSz2F7KwNAc-d1s8luKt2R6VcojE1oK87g_TmfoFqurEFqbHSXUephHqQH3cIeAEMpzhaqXbEjIVKRBDAQMypjwZ3r-r3Um4iGWAwLDcARQTOD0Hw6TZmIYW9jH-_qH3xAxZVfPts2b6Qg_4UdK0nwL7q9pfmgOvUiiwB4ATkn09Vp0ctO6w',
    badge: 'V-Shape'
  },
  {
    id: 'gummy-smile-treatment',
    title: 'Gummy Smile Correction',
    category: 'Micro-Injections',
    description: 'Subtle neuromodulation of the levator muscles to balance the gingival show and restore comfortable confidence when smiling.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUloxcWsT4NRCnTfn0RneF4Q4BwymxBAMsqFKJv9IIvSzEjhVsjT_MDtI4irgzGW0su__ZFlPbs8_2ebSsDU3aWDop2YR9ea2x21K8fdCKFFVUTyJj9U_xiYZFY63zL5Btb43hR-HaxmbiKFgUp8DqEgm5D4mrjpPpfVzplLWjcWFD75MC4S3cc8dnLB7CywLocC5PIZJPdVTfCwgrgG4WqwQZabVdZ8OAlRAeHeZCBxQt2rP-Gm1MJcgjtoht4nVH3CBwLsNAF8OI',
    badge: 'Smile Care'
  },
  {
    id: 'eyebrow-lifting',
    title: 'Chemical Brow Elevation',
    category: 'Periorbital Care',
    description: 'Strategically release orbicularis oculi downward tension to open tired eyelids and restore an arched, refreshed brow contour.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    badge: 'Brow Lift'
  },

  // Page 6: Advanced Bio-Stimulation & Collagen
  {
    id: 'collagen-stimulator',
    title: 'Collagen Stimulator (Poly-L-Lactic)',
    category: 'Deep Bio-Stimulation',
    description: 'Stimulate gradual, enduring de novo collagen synthesis across depleted dermal layers, restoring structural bounce for over two years.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC',
    badge: 'Long-Lasting'
  },
  {
    id: 'facetite-rf',
    title: 'FaceTite Radiofrequency Contouring',
    category: 'Minimally Invasive',
    description: 'Directional RFAL technology that safely coagulates subcutaneous fat and contracts fibroseptal networks for dramatic lower face lifting.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    badge: 'Dramatic'
  },
  {
    id: 'pdo-threads',
    title: 'PDO Thread Vector Lift',
    category: 'Mechanical Vector Lifting',
    description: 'Absorbable polydioxanone barbed threads positioned along tensile vectors to reposition descending jowls and midface soft tissue.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
    badge: 'Vector Lift'
  },
  {
    id: 'dermal-dissolving',
    title: 'Hyaluronidase Filler Reversal',
    category: 'Corrective Aesthetics',
    description: 'Precision ultrasound-guided enzymatic dissolving of misplaced, migrated, or overfilled hyaluronic acid dermal products.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r',
    badge: 'Correction'
  },

  // Page 7: Laser Resurfacing & Clinical Peels
  {
    id: 'fractional-co2-laser',
    title: 'Fractional CO2 Laser Resurfacing',
    category: 'Ablative Laser',
    description: 'Microscopic columns of thermal ablation that trigger complete epidermal renewal, vaporize deep wrinkles, and erase heavy acne scars.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR',
    badge: 'Total Renewal'
  },
  {
    id: 'prx-t33-peel',
    title: 'PRX-T33 Biorevitalisation',
    category: 'No-Peel Biorevitalisation',
    description: 'Patented TCA formulation with hydrogen peroxide that penetrates deep without frosting or peeling, producing instant luminous glass skin.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs',
    badge: 'Glass Skin'
  },
  {
    id: 'cosmelan-depigmentation',
    title: 'Cosmelan Depigmentation Protocol',
    category: 'Melasma & Pigment',
    description: 'The world\'s leading clinical depigmenting treatment targeting severe melasma, chloasma, and persistent age spots at the enzymatic source.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpc9iwUPHl5YjJPUY9E95ThzCowbFO32u1yMI6QpZqPrQnBL7p9nmkyqw3JRkKKEl26-mJIFP0r8QNgHxIYxWnrIiagTCmDfr3L4TeyGpRJ4Ye8dwjLxT7kUVB0sTqVntaOcMm7700Jj3-8xh75QQkY3xOMGH04owJPA05JB3wRuKL7kUttqlyk-sOqZIwumYKh7VveixAFn2QXvlC7f8-S3zwQXujNvI0qHEwsxPonmj_-kRlbSiRVOcy67FFlTBCjBFzzvhYYOQ1',
    badge: 'Depigmenting'
  },
  {
    id: 'skinpen-microneedling',
    title: 'SkinPen Precision Collagen Induction',
    category: 'Medical Microneedling',
    description: 'FDA-cleared medical microneedling engineered to break down fibrotic scar tissue and trigger massive natural collagen remodelling.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOPTQtfj8J1bbB7SlVVRU6fYo2gWaZ-vP4FOmbQ0GK-wiSWxgFv7RrufflpNtjGP9Dk5eLV2kMfUIPVx1N4ETnRWMUGQ-pnWBcZCa97apM4cg71CV6hKaKDiQOlU26NKqLXuvzRkHrDNd-vXfy5u3MHCvpyxfbnHdk9lkm5vhjg9zIrK1aYJGwOOOPurVrXxbRr7FprgjD7ZzrUzhcc4DM6YdWc6J8P_jEx9W_ffwKfL2E8x3PIYt0_G8MTcbFUJlLtFYmgOa7s-OK',
    badge: 'Collagen Boost'
  },

  // Page 8: Body Sculpting & Fat Reduction
  {
    id: 'aqualyx-lipolysis',
    title: 'Aqualyx Adipose Dissolving',
    category: 'Injectable Lipolysis',
    description: 'Deoxycholic acid micro-injections that safely liquefy localized fat deposits beneath the chin, love handles, and abdomen.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpc9iwUPHl5YjJPUY9E95ThzCowbFO32u1yMI6QpZqPrQnBL7p9nmkyqw3JRkKKEl26-mJIFP0r8QNgHxIYxWnrIiagTCmDfr3L4TeyGpRJ4Ye8dwjLxT7kUVB0sTqVntaOcMm7700Jj3-8xh75QQkY3xOMGH04owJPA05JB3wRuKL7kUttqlyk-sOqZIwumYKh7VveixAFn2QXvlC7f8-S3zwQXujNvI0qHEwsxPonmj_-kRlbSiRVOcy67FFlTBCjBFzzvhYYOQ1',
    badge: 'Localized Fat'
  },
  {
    id: 'desobody-lipolysis',
    title: 'Desoface & Desobody Slimming',
    category: 'Next-Gen Lipolysis',
    description: 'Next-generation sodium deoxycholate formulated for comfortable, uniform contouring of stubborn adipose pockets.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2a_0Datjn8f2On3mNF7IY6_QgXkw0AQl1Il2WqYPqYqTU7wUKYRpJUg2xdA_d0B8SfBpbvVzzYOczvA85hXWv6hkb0snKG0UXUjP3EUDr0nkt_A_nINJJOIpGcQ2X_iD94V14qlhvJmRUp8In6cOEtlONSRSf5Kpdd8uA6VUX3SFIaBku4xsVbSvg9fE6K0FWVX-QGNWmY4jhYY70yZCEdfN_V3cezSz0jiycoy31X-hMxrw-bNoMrpEVo43FV1z8TnWKiqVpTdlK',
    badge: 'Precision Slim'
  },
  {
    id: 'cellulite-subcision',
    title: 'Deep-Tissue Cellulite Subcision',
    category: 'Cellulite Release',
    description: 'Microsurgical release of tight fibrous septa causing stubborn skin dimpling on thighs and glutes, combined with biostimulators.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClIGVnrpyhbZbn4skniRN95s8fe43niaHTpE2PHrPr4EAZc-kvyMu1k6JL4FcYCAw-SE1G2rBygkpuYimKkujZ8Ch9rHKJwqguHanaAZbAL8-ujTZWI6ThpC_rihPWbmp-seHAxJjDCFpT3JHdZknmaCVpfRjqS3n6DVdZCyDo4SBhN_q4D4NflwD5qBwDUw7uXpgpjXln7PkJWypOLjdKW-xVYzB53vh6hXOmAgbAecmaayoHjY2ZousTGNq_zRShg3Go2f8V0O4R',
    badge: 'Smooth Finish'
  },
  {
    id: 'radiesse-hands',
    title: 'Radiesse Hand Rejuvenation',
    category: 'Hand Aesthetics',
    description: 'Calcium hydroxylapatite microspheres replenish lost soft tissue volume in hands, masking prominent veins and tendons.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCauimUjLiG4FTybnhAOQgEeV5EX6ZPVafVgrL3ZQsSct4k3azc70DZOUL83NrLvzdJb2f8vDkSR-JW3kDIXtIlaDRE7geAe7clP3VWiV3uUxojtpMPuJEi5OqDgxLNHx9CkD10MbA89eiJWjBKIGS_6wyql817jtfy9hiYYvBvNSkfl-hWqMAYjqlQY60-eyfLsAJrUNmaucXp2XyxxJ3g8KII7-qGALB6o42Cwv1YMd51LLVpOMqPrCEUk2hzlWKV6lTlxBcieuUH',
    badge: 'Ageless Hands'
  },

  // Page 9: Buttocks & Hip Contouring
  {
    id: 'buttock-lift-lanluma',
    title: 'Non-Surgical Buttock Lift (Lanluma)',
    category: 'Gluteal Sculpting',
    description: 'Injectable PLLA collagen stimulation that naturally rounds and lifts the gluteal contour without implants or downtime.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r',
    badge: 'Volume & Lift'
  },
  {
    id: 'sculptra-butt-lift',
    title: 'Sculptra Gluteal Volumisation',
    category: 'Bio-Stimulation',
    description: 'Subdermal micro-particle therapy creating gradual, authentic gluteal projection and tightening overlying skin laxity.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    badge: 'Natural Curve'
  },
  {
    id: 'hip-dip-correction',
    title: 'Hip Dip Correction Protocol',
    category: 'Body Contouring',
    description: 'Strategic bio-stimulator volumisation filling lateral trochanteric depressions for an uninterrupted hourglass silhouette.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC',
    badge: 'Hourglass'
  },
  {
    id: 'radiofrequency-body',
    title: 'Radiofrequency Body Tightening',
    category: 'Thermal Contouring',
    description: 'Non-invasive thermal collagen stimulation that contracts loose abdominal, arm, and thigh skin following weight loss.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    badge: 'Skin Firming'
  },

  // Page 10: Minor Surgery & Scar Treatment
  {
    id: 'mole-lesion-removal',
    title: 'Precision Mole & Lesion Removal',
    category: 'Minor Surgery',
    description: 'Scar-sparing radiofrequency micro-ablation and plastic surgical excision for skin tags, moles, and benign lesions.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOtBKp33pnPLoKpvckXkiIS-1G2cj7yNpUXZYP7v7nB3HgYFreRRFM-F6UZt2uwFsUMzf2u0m_0SvHcja7AjjBjq8B4mo1Gk_Y3ihgY2qmmbr1Vc48W8QizQ3BLTsaPHv9ojoje0Q8wG64F4zjwPy98roZuGAorsk2N5TxRUibfaZ4gZ7L9r7cFXGqA6jBiryjo3-fh10ZWdkryws_w14ASGtvXypafuUczwEFeVz6SywQsQKFg--N76UkgP9d4Um3Q5Snz8eG_XyS',
    badge: 'Scar-Free'
  },
  {
    id: 'cyst-excision',
    title: 'Clinical Sebaceous Cyst Removal',
    category: 'Minor Surgery',
    description: 'Complete encapsulated cyst excision performed under local anesthesia with delicate micro-suturing techniques.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
    badge: 'Clean Excision'
  },
  {
    id: 'plasma-blepharoplasty',
    title: 'Non-Surgical Plasma Blepharoplasty',
    category: 'Periorbital Rejuvenation',
    description: 'Sublimation of excess upper and lower eyelid skin using targeted micro-plasma arc technology without incisions.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs',
    badge: 'Eyelid Tight'
  },
  {
    id: 'scar-subcision',
    title: 'Subcision Acne Scar Therapy',
    category: 'Scar Revision',
    description: 'Nokor needle dissection under tethered rolling and boxcar scars to elevate depressed indentations permanently.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR',
    badge: 'Smooth Surface'
  },

  // Page 11: Medical Skin Health & Obagi
  {
    id: 'obagi-nu-derm',
    title: 'Obagi Nu-Derm System Transformation',
    category: 'Medical Skincare',
    description: 'Gold-standard prescription cellular turnaround targeting chronic sun damage, coarse wrinkles, and deep dermal hyperpigmentation.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww',
    badge: 'Prescription'
  },
  {
    id: 'zo-skin-health',
    title: 'ZO Skin Health Anti-Aging Regimen',
    category: 'Dermatological Regimens',
    description: 'Dr. Zein Obagi clinical protocols utilizing stabilized retinol and growth factors to normalize melanocytes and firm skin.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXc7SORxoXUK7Kzbf256KDGjYoiGB3XeCLNYObBtlw7h8260KwmKxaiEQL7E2Wg3BTQhjpJs0Iw9GVYkNkpYhd4WPz_jdW6PA2i4yXAVvmrMoBCqMX479nyNRdb7X8GwVNjcQtb1OIG8li-NYXrs-55c2CPQIIew0siqNajiO8--wLogFbflBlElSPQ9GlaxJ2VmWkjKCbGUr2QX1FhpzqTBOU86kyynhHW4UjQMqKe-XDBVsXygiZM-ACB4nUWQl8J4dDjsBIEw',
    badge: 'Doctor Led'
  },
  {
    id: 'mesotherapy-infusion',
    title: 'Clinical Mesotherapy Infusion',
    category: 'Micro-Nutrient Infusion',
    description: 'Dermal intradermal delivery of 54 active multivitamins, amino acids, and coenzymes for maximum cellular luminosity.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4fJHIJX0K1v-oz5txqtrtxpaIViJ65RYhXP0GvCvV9X-BUkcVQEzgBqKS8YzsomPWnOJfJG0bHH7KhmjwFqawKN0Ss4I6mWbR3ZNdU44GSg2NLrvKAwaRieRBsOOT7KE8OriZhzgqvAFhE2KvoiitHEBwjWSBKT4Y81onojL9xa2DBvQY3ooaY_hI5oMtsQHGTkAhp4nYkzSmtJGApHA0MjH-_XS-vhuGsAAtT9vX_mD_3h-ImzrSsTJQk47WHJvD5amFx30t_g',
    badge: 'Nourish'
  },
  {
    id: 'treatments-for-men',
    title: 'Executive Aesthetic Protocols For Men',
    category: 'Men\'s Aesthetics',
    description: 'Tailored subtle treatments maintaining masculine angles, reducing stress lines, and refining rough texture with zero downtime.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSewylSW1YbrYNaLbxZiwxQF6qhQmFTupVXlyUicJq7mls_9KiS0PKgUNmGBOXbGpaLuWRlegLQQDTQbvbNoC7CkLSz2F7KwNAc-d1s8luKt2R6VcojE1oK87g_TmfoFqurEFqbHSXUephHqQH3cIeAEMpzhaqXbEjIVKRBDAQMypjwZ3r-r3Um4iGWAwLDcARQTOD0Hw6TZmIYW9jH-_qH3xAxZVfPts2b6Qg_4UdK0nwL7q9pfmgOvUiiwB4ATkn09Vp0ctO6w',
    badge: 'Men\'s Clinic'
  },

  // Page 12: Vascular & Specialty Dermatology
  {
    id: 'port-wine-vascular',
    title: 'Port Wine Stain & Vascular Laser',
    category: 'Vascular Lasers',
    description: 'Long-pulsed Nd:YAG laser targeted selectively at oxyhemoglobin to collapse spider veins and resolve deep port wine stains.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUloxcWsT4NRCnTfn0RneF4Q4BwymxBAMsqFKJv9IIvSzEjhVsjT_MDtI4irgzGW0su__ZFlPbs8_2ebSsDU3aWDop2YR9ea2x21K8fdCKFFVUTyJj9U_xiYZFY63zL5Btb43hR-HaxmbiKFgUp8DqEgm5D4mrjpPpfVzplLWjcWFD75MC4S3cc8dnLB7CywLocC5PIZJPdVTfCwgrgG4WqwQZabVdZ8OAlRAeHeZCBxQt2rP-Gm1MJcgjtoht4nVH3CBwLsNAF8OI',
    badge: 'Vascular'
  },
  {
    id: 'leg-veins-sclero',
    title: 'Leg Veins Microsclerotherapy',
    category: 'Phlebology',
    description: 'Micro-needle injection of sclerosing solutions that safely close visible reticular and thread veins on legs.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    badge: 'Leg Care'
  },
  {
    id: 'excessive-sweating',
    title: 'Hyperhidrosis Sweat Reduction',
    category: 'Medical Neuromodulation',
    description: 'Neuromuscular blocking of eccrine sweat glands providing 6-9 months of dry comfort in underarms, palms, and feet.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC',
    badge: 'Dry Comfort'
  },
  {
    id: 'hayfever-injection',
    title: 'Hay Fever Clinical Management',
    category: 'Allergy Therapy',
    description: 'Targeted medical intervention for severe seasonal allergic rhinitis resistant to standard oral antihistamines.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    badge: 'Seasonal Relief'
  },

  // Page 13: Clinical Intimate Aesthetics
  {
    id: 'labia-enhancement',
    title: 'Labia Majora Rejuvenation',
    category: 'Female Intimate Wellness',
    description: 'Bespoke hyaluronic acid volumetric restoration providing comfortable cushioning, symmetry, and youthful turgor.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
    badge: 'Confidential'
  },
  {
    id: 'intimate-dryness',
    title: 'Desirial Intimate Hydration',
    category: 'Cellular Hydration',
    description: 'Bio-stimulating hyaluronic gel formulated specifically for delicate mucosa to relieve chronic discomfort and dryness.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r',
    badge: 'Wellness'
  },
  {
    id: 'male-penoplasty',
    title: 'Non-Surgical Penoplasty',
    category: 'Male Intimate Wellness',
    description: 'Specialized dermal volumetric enhancement performed under sterile surgical standards for natural girth increase.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR',
    badge: 'Private'
  },
  {
    id: 'earlobe-repair',
    title: 'Earlobe Repair & Restoration',
    category: 'Minor Surgery',
    description: 'Reconstruction of split, elongated, or torn earlobes from heavy jewelry, finished with micro-plastic suture lines.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs',
    badge: 'Reconstruction'
  },

  // Page 14: Cellular Wellness & Longevity
  {
    id: 'cellular-wellness-iv',
    title: 'Cellular Wellness Micronutrient Therapy',
    category: 'Longevity Medicine',
    description: 'High-bioavailability intravenous infusions of glutathione, NAD+, and cofactors for cellular vitality and detoxification.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r',
    badge: 'Vitality'
  },
  {
    id: 'longevity-screen-map',
    title: 'Comprehensive Longevity Screening',
    category: 'Preventative Health',
    description: 'Full-spectrum biological age assessment, vascular stiffness mapping, and epigenetic profiling for life optimization.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOPTQtfj8J1bbB7SlVVRU6fYo2gWaZ-vP4FOmbQ0GK-wiSWxgFv7RrufflpNtjGP9Dk5eLV2kMfUIPVx1N4ETnRWMUGQ-pnWBcZCa97apM4cg71CV6hKaKDiQOlU26NKqLXuvzRkHrDNd-vXfy5u3MHCvpyxfbnHdk9lkm5vhjg9zIrK1aYJGwOOOPurVrXxbRr7FprgjD7ZzrUzhcc4DM6YdWc6J8P_jEx9W_ffwKfL2E8x3PIYt0_G8MTcbFUJlLtFYmgOa7s-OK',
    badge: 'Preventative'
  },
  {
    id: 'prp-hair-therapy',
    title: 'PRP Hair Follicle Biostimulation',
    category: 'Hair Regeneration',
    description: 'Autologous platelet-rich plasma concentrated with active growth factors injected into the scalp to reverse miniaturization.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCauimUjLiG4FTybnhAOQgEeV5EX6ZPVafVgrL3ZQsSct4k3azc70DZOUL83NrLvzdJb2f8vDkSR-JW3kDIXtIlaDRE7geAe7clP3VWiV3uUxojtpMPuJEi5OqDgxLNHx9CkD10MbA89eiJWjBKIGS_6wyql817jtfy9hiYYvBvNSkfl-hWqMAYjqlQY60-eyfLsAJrUNmaucXp2XyxxJ3g8KII7-qGALB6o42Cwv1YMd51LLVpOMqPrCEUk2hzlWKV6lTlxBcieuUH',
    badge: 'Density'
  },
  {
    id: 'laser-nail-fungus',
    title: 'Laser Onychomycosis Clearance',
    category: 'Clinical Podiatry',
    description: 'Targeted laser wavelength eradicating fungal pathogens within the nail matrix without systemic medication burdens.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpc9iwUPHl5YjJPUY9E95ThzCowbFO32u1yMI6QpZqPrQnBL7p9nmkyqw3JRkKKEl26-mJIFP0r8QNgHxIYxWnrIiagTCmDfr3L4TeyGpRJ4Ye8dwjLxT7kUVB0sTqVntaOcMm7700Jj3-8xh75QQkY3xOMGH04owJPA05JB3wRuKL7kUttqlyk-sOqZIwumYKh7VveixAFn2QXvlC7f8-S3zwQXujNvI0qHEwsxPonmj_-kRlbSiRVOcy67FFlTBCjBFzzvhYYOQ1',
    badge: 'Targeted'
  },

  // Page 15: Specialized Facial Rejuvenation
  {
    id: 'prp-microneedling-vampire',
    title: 'PRP Microneedling Facial',
    category: 'Autologous Therapy',
    description: 'Concentrated autologous growth factor infusion driven deep into skin micro-channels for unparalleled natural radiance.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww',
    badge: 'Autologous'
  },
  {
    id: 'frown-line-botox',
    title: 'Glabellar Frown Line Protocol',
    category: 'Upper Face',
    description: 'Precision smoothing of deep furrow lines between the brows, softening angry or stressed resting expressions.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2a_0Datjn8f2On3mNF7IY6_QgXkw0AQl1Il2WqYPqYqTU7wUKYRpJUg2xdA_d0B8SfBpbvVzzYOczvA85hXWv6hkb0snKG0UXUjP3EUDr0nkt_A_nINJJOIpGcQ2X_iD94V14qlhvJmRUp8In6cOEtlONSRSf5Kpdd8uA6VUX3SFIaBku4xsVbSvg9fE6K0FWVX-QGNWmY4jhYY70yZCEdfN_V3cezSz0jiycoy31X-hMxrw-bNoMrpEVo43FV1z8TnWKiqVpTdlK',
    badge: 'Expression'
  },
  {
    id: 'forehead-horizontal-smoothing',
    title: 'Forehead Horizontal Smoothing',
    category: 'Upper Face',
    description: 'Light-touch micro-dosing for frontalis muscle relaxation while avoiding brow heaviness or ptosis.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClIGVnrpyhbZbn4skniRN95s8fe43niaHTpE2PHrPr4EAZc-kvyMu1k6JL4FcYCAw-SE1G2rBygkpuYimKkujZ8Ch9rHKJwqguHanaAZbAL8-ujTZWI6ThpC_rihPWbmp-seHAxJjDCFpT3JHdZknmaCVpfRjqS3n6DVdZCyDo4SBhN_q4D4NflwD5qBwDUw7uXpgpjXln7PkJWypOLjdKW-xVYzB53vh6hXOmAgbAecmaayoHjY2ZousTGNq_zRShg3Go2f8V0O4R',
    badge: 'Subtle'
  },
  {
    id: 'neck-decollete-rejuvenation',
    title: 'Neck & Décolletage Tightening',
    category: 'Neck Rejuvenation',
    description: 'Combination ultrasound and bio-remodeling to resolve horizontal necklace bands and crepey chest wrinkling.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOPTQtfj8J1bbB7SlVVRU6fYo2gWaZ-vP4FOmbQ0GK-wiSWxgFv7RrufflpNtjGP9Dk5eLV2kMfUIPVx1N4ETnRWMUGQ-pnWBcZCa97apM4cg71CV6hKaKDiQOlU26NKqLXuvzRkHrDNd-vXfy5u3MHCvpyxfbnHdk9lkm5vhjg9zIrK1aYJGwOOOPurVrXxbRr7FprgjD7ZzrUzhcc4DM6YdWc6J8P_jEx9W_ffwKfL2E8x3PIYt0_G8MTcbFUJlLtFYmgOa7s-OK',
    badge: 'Firming'
  },

  // Page 16: Comprehensive Bespoke Aesthetics & Consultation
  {
    id: 'medical-grade-facial',
    title: 'Clinical Medical Grade Facial',
    category: 'Facial Protocols',
    description: 'Multi-step clinical facial incorporating ultrasonic peeling, galvanic serum infusion, and therapeutic LED light healing.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs',
    badge: 'Essential'
  },
  {
    id: 'migraine-relief-protocol',
    title: 'Chronic Migraine Clinical Therapy',
    category: 'Therapeutic Aesthetics',
    description: 'Targeted head and neck trigger point neuromodulation providing significant reduction in headache severity and frequency.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4fJHIJX0K1v-oz5txqtrtxpaIViJ65RYhXP0GvCvV9X-BUkcVQEzgBqKS8YzsomPWnOJfJG0bHH7KhmjwFqawKN0Ss4I6mWbR3ZNdU44GSg2NLrvKAwaRieRBsOOT7KE8OriZhzgqvAFhE2KvoiitHEBwjWSBKT4Y81onojL9xa2DBvQY3ooaY_hI5oMtsQHGTkAhp4nYkzSmtJGApHA0MjH-_XS-vhuGsAAtT9vX_mD_3h-ImzrSsTJQk47WHJvD5amFx30t_g',
    badge: 'Clinical Relief'
  },
  {
    id: 'steroid-scar-flattening',
    title: 'Keloid & Hypertrophic Scar Injections',
    category: 'Dermatological Revision',
    description: 'Intralesional corticosteroid micro-injections that soften and flatten thick, raised keloids and surgical scars.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR',
    badge: 'Targeted'
  },
  {
    id: 'bespoke-signature-assessment',
    title: 'Bespoke Age Reversal Consultation',
    category: 'Comprehensive Diagnostics',
    description: 'In-depth computerized facial mapping, 3D volume analysis, and tailored treatment masterplan curated by our Harley Street doctors.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    badge: 'Harley St'
  }
];
