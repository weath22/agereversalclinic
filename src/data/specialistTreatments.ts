import { TreatmentMediaItem } from '../types';

export type ParentPricingCategory =
  | 'Face & Injectables'
  | 'Body Sculpting'
  | 'Advanced Facials'
  | 'Hair & Beauty'
  | 'IV Drips & Wellness';

export type TransformationCategoryType =
  | 'Facial Rejuvenation'
  | 'Skin Texture & Scars'
  | 'Lifting & Contouring'
  | 'Regenerative Biotech'
  | 'Hair Density';

export interface SpecialistTreatment {
  id: string;
  title: string;
  category: string;
  pricingCategory: ParentPricingCategory;
  transformationCategory: TransformationCategoryType;
  description: string;
  image: string;
  badge?: string;
  duration?: string;
  icon?: string;
  coverMedia?: TreatmentMediaItem;
  seoKeywords?: string[];
}

const RAW_SPECIALIST_TREATMENTS: SpecialistTreatment[] = [
  {
    "id": "lash-eyebrow",
    "title": "lash & eyebrow",
    "category": "Hair & Beauty",
    "pricingCategory": "Hair & Beauty",
    "transformationCategory": "Facial Rejuvenation",
    "description": "Bespoke brow architecture, precision tinting, lamination, and lash enhancement tailored to frame and elevate your natural facial features.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX",
    "badge": "Bespoke Styling",
    "duration": "45 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX",
      "mediaType": "image",
      "altText": "lash & eyebrow clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "lash & eyebrow - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "hair & beauty",
        "lash & eyebrow",
        "clinical aesthetic treatments"
      ],
      "caption": "Bespoke Styling"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "hair & beauty",
      "lash & eyebrow",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "body-waxing",
    "title": "body waxing",
    "category": "Hair & Beauty",
    "pricingCategory": "Hair & Beauty",
    "transformationCategory": "Skin Texture & Scars",
    "description": "Gentle, medical-grade hypoallergenic waxing protocols formulated for smooth, long-lasting hair removal and calm, conditioned skin.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuClIGVnrpyhbZbn4skniRN95s8fe43niaHTpE2PHrPr4EAZc-kvyMu1k6JL4FcYCAw-SE1G2rBygkpuYimKkujZ8Ch9rHKJwqguHanaAZbAL8-ujTZWI6ThpC_rihPWbmp-seHAxJjDCFpT3JHdZknmaCVpfRjqS3n6DVdZCyDo4SBhN_q4D4NflwD5qBwDUw7uXpgpjXln7PkJWypOLjdKW-xVYzB53vh6hXOmAgbAecmaayoHjY2ZousTGNq_zRShg3Go2f8V0O4R",
    "badge": "Smooth Care",
    "duration": "30 - 60 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuClIGVnrpyhbZbn4skniRN95s8fe43niaHTpE2PHrPr4EAZc-kvyMu1k6JL4FcYCAw-SE1G2rBygkpuYimKkujZ8Ch9rHKJwqguHanaAZbAL8-ujTZWI6ThpC_rihPWbmp-seHAxJjDCFpT3JHdZknmaCVpfRjqS3n6DVdZCyDo4SBhN_q4D4NflwD5qBwDUw7uXpgpjXln7PkJWypOLjdKW-xVYzB53vh6hXOmAgbAecmaayoHjY2ZousTGNq_zRShg3Go2f8V0O4R",
      "mediaType": "image",
      "altText": "body waxing clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "body waxing - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "hair & beauty",
        "body waxing",
        "clinical aesthetic treatments"
      ],
      "caption": "Smooth Care"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "hair & beauty",
      "body waxing",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "ladies-girls-cut-collors-treatments",
    "title": "Ladies & Girls Cut, Collors, Treatments",
    "category": "Hair & Beauty",
    "pricingCategory": "Hair & Beauty",
    "transformationCategory": "Hair Density",
    "description": "Artisanal hair cutting, dimensional colour formulation, and deep bond-repair conditioning treatments for luminous, healthy hair.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCauimUjLiG4FTybnhAOQgEeV5EX6ZPVafVgrL3ZQsSct4k3azc70DZOUL83NrLvzdJb2f8vDkSR-JW3kDIXtIlaDRE7geAe7clP3VWiV3uUxojtpMPuJEi5OqDgxLNHx9CkD10MbA89eiJWjBKIGS_6wyql817jtfy9hiYYvBvNSkfl-hWqMAYjqlQY60-eyfLsAJrUNmaucXp2XyxxJ3g8KII7-qGALB6o42Cwv1YMd51LLVpOMqPrCEUk2hzlWKV6lTlxBcieuUH",
    "badge": "Salon Couture",
    "duration": "60 - 120 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCauimUjLiG4FTybnhAOQgEeV5EX6ZPVafVgrL3ZQsSct4k3azc70DZOUL83NrLvzdJb2f8vDkSR-JW3kDIXtIlaDRE7geAe7clP3VWiV3uUxojtpMPuJEi5OqDgxLNHx9CkD10MbA89eiJWjBKIGS_6wyql817jtfy9hiYYvBvNSkfl-hWqMAYjqlQY60-eyfLsAJrUNmaucXp2XyxxJ3g8KII7-qGALB6o42Cwv1YMd51LLVpOMqPrCEUk2hzlWKV6lTlxBcieuUH",
      "mediaType": "image",
      "altText": "Ladies & Girls Cut, Collors, Treatments clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Ladies & Girls Cut, Collors, Treatments - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "hair & beauty",
        "ladies & girls cut, collors, treatments",
        "clinical aesthetic treatments"
      ],
      "caption": "Salon Couture"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "hair & beauty",
      "ladies & girls cut, collors, treatments",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "men-and-kids",
    "title": "Men and Kids",
    "category": "Hair & Beauty",
    "pricingCategory": "Hair & Beauty",
    "transformationCategory": "Hair Density",
    "description": "Tailored precision grooming, contemporary styling, and gentle hair care services designed for gentlemen and young clients.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBSewylSW1YbrYNaLbxZiwxQF6qhQmFTupVXlyUicJq7mls_9KiS0PKgUNmGBOXbGpaLuWRlegLQQDTQbvbNoC7CkLSz2F7KwNAc-d1s8luKt2R6VcojE1oK87g_TmfoFqurEFqbHSXUephHqQH3cIeAEMpzhaqXbEjIVKRBDAQMypjwZ3r-r3Um4iGWAwLDcARQTOD0Hw6TZmIYW9jH-_qH3xAxZVfPts2b6Qg_4UdK0nwL7q9pfmgOvUiiwB4ATkn09Vp0ctO6w",
    "badge": "Grooming",
    "duration": "30 - 45 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBSewylSW1YbrYNaLbxZiwxQF6qhQmFTupVXlyUicJq7mls_9KiS0PKgUNmGBOXbGpaLuWRlegLQQDTQbvbNoC7CkLSz2F7KwNAc-d1s8luKt2R6VcojE1oK87g_TmfoFqurEFqbHSXUephHqQH3cIeAEMpzhaqXbEjIVKRBDAQMypjwZ3r-r3Um4iGWAwLDcARQTOD0Hw6TZmIYW9jH-_qH3xAxZVfPts2b6Qg_4UdK0nwL7q9pfmgOvUiiwB4ATkn09Vp0ctO6w",
      "mediaType": "image",
      "altText": "Men and Kids clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Men and Kids - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "hair & beauty",
        "men and kids",
        "clinical aesthetic treatments"
      ],
      "caption": "Grooming"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "hair & beauty",
      "men and kids",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "men-kids-services",
    "title": "Men / kids services",
    "category": "Hair & Beauty",
    "pricingCategory": "Hair & Beauty",
    "transformationCategory": "Hair Density",
    "description": "Complete specialist grooming, scalp vitality care, and bespoke styling packages crafted for men and children.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuA4fJHIJX0K1v-oz5txqtrtxpaIViJ65RYhXP0GvCvV9X-BUkcVQEzgBqKS8YzsomPWnOJfJG0bHH7KhmjwFqawKN0Ss4I6mWbR3ZNdU44GSg2NLrvKAwaRieRBsOOT7KE8OriZhzgqvAFhE2KvoiitHEBwjWSBKT4Y81onojL9xa2DBvQY3ooaY_hI5oMtsQHGTkAhp4nYkzSmtJGApHA0MjH-_XS-vhuGsAAtT9vX_mD_3h-ImzrSsTJQk47WHJvD5amFx30t_g",
    "badge": "Specialist Care",
    "duration": "45 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuA4fJHIJX0K1v-oz5txqtrtxpaIViJ65RYhXP0GvCvV9X-BUkcVQEzgBqKS8YzsomPWnOJfJG0bHH7KhmjwFqawKN0Ss4I6mWbR3ZNdU44GSg2NLrvKAwaRieRBsOOT7KE8OriZhzgqvAFhE2KvoiitHEBwjWSBKT4Y81onojL9xa2DBvQY3ooaY_hI5oMtsQHGTkAhp4nYkzSmtJGApHA0MjH-_XS-vhuGsAAtT9vX_mD_3h-ImzrSsTJQk47WHJvD5amFx30t_g",
      "mediaType": "image",
      "altText": "Men / kids services clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Men / kids services - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "hair & beauty",
        "men / kids services",
        "clinical aesthetic treatments"
      ],
      "caption": "Specialist Care"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "hair & beauty",
      "men / kids services",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "facial-skin-care",
    "title": "Facial skin care",
    "category": "Advanced Facials",
    "pricingCategory": "Advanced Facials",
    "transformationCategory": "Skin Texture & Scars",
    "description": "Multi-step clinical facial protocols combining deep pore purification, active botanical serums, and cellular barrier restoration.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuB2a_0Datjn8f2On3mNF7IY6_QgXkw0AQl1Il2WqYPqYqTU7wUKYRpJUg2xdA_d0B8SfBpbvVzzYOczvA85hXWv6hkb0snKG0UXUjP3EUDr0nkt_A_nINJJOIpGcQ2X_iD94V14qlhvJmRUp8In6cOEtlONSRSf5Kpdd8uA6VUX3SFIaBku4xsVbSvg9fE6K0FWVX-QGNWmY4jhYY70yZCEdfN_V3cezSz0jiycoy31X-hMxrw-bNoMrpEVo43FV1z8TnWKiqVpTdlK",
    "badge": "Dermal Glow",
    "duration": "60 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuB2a_0Datjn8f2On3mNF7IY6_QgXkw0AQl1Il2WqYPqYqTU7wUKYRpJUg2xdA_d0B8SfBpbvVzzYOczvA85hXWv6hkb0snKG0UXUjP3EUDr0nkt_A_nINJJOIpGcQ2X_iD94V14qlhvJmRUp8In6cOEtlONSRSf5Kpdd8uA6VUX3SFIaBku4xsVbSvg9fE6K0FWVX-QGNWmY4jhYY70yZCEdfN_V3cezSz0jiycoy31X-hMxrw-bNoMrpEVo43FV1z8TnWKiqVpTdlK",
      "mediaType": "image",
      "altText": "Facial skin care clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Facial skin care - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "advanced facials",
        "facial skin care",
        "clinical aesthetic treatments"
      ],
      "caption": "Dermal Glow"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "advanced facials",
      "facial skin care",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "aqualyx-course-3",
    "title": "Aqualyx Course 3",
    "category": "Body Sculpting",
    "pricingCategory": "Body Sculpting",
    "transformationCategory": "Lifting & Contouring",
    "description": "Comprehensive 3-session deoxycholic acid lipolysis protocol engineered to dissolve stubborn localized fat pockets with lasting contour definition.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBpc9iwUPHl5YjJPUY9E95ThzCowbFO32u1yMI6QpZqPrQnBL7p9nmkyqw3JRkKKEl26-mJIFP0r8QNgHxIYxWnrIiagTCmDfr3L4TeyGpRJ4Ye8dwjLxT7kUVB0sTqVntaOcMm7700Jj3-8xh75QQkY3xOMGH04owJPA05JB3wRuKL7kUttqlyk-sOqZIwumYKh7VveixAFn2QXvlC7f8-S3zwQXujNvI0qHEwsxPonmj_-kRlbSiRVOcy67FFlTBCjBFzzvhYYOQ1",
    "badge": "3-Session Course",
    "duration": "45 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBpc9iwUPHl5YjJPUY9E95ThzCowbFO32u1yMI6QpZqPrQnBL7p9nmkyqw3JRkKKEl26-mJIFP0r8QNgHxIYxWnrIiagTCmDfr3L4TeyGpRJ4Ye8dwjLxT7kUVB0sTqVntaOcMm7700Jj3-8xh75QQkY3xOMGH04owJPA05JB3wRuKL7kUttqlyk-sOqZIwumYKh7VveixAFn2QXvlC7f8-S3zwQXujNvI0qHEwsxPonmj_-kRlbSiRVOcy67FFlTBCjBFzzvhYYOQ1",
      "mediaType": "image",
      "altText": "Aqualyx Course 3 clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Aqualyx Course 3 - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "body sculpting",
        "aqualyx course 3",
        "clinical aesthetic treatments"
      ],
      "caption": "3-Session Course"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "body sculpting",
      "aqualyx course 3",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "deso-face-and-body-course-of-1",
    "title": "Deso Face and body Course of 1",
    "category": "Body Sculpting",
    "pricingCategory": "Body Sculpting",
    "transformationCategory": "Lifting & Contouring",
    "description": "Targeted single-session next-generation DesoFace and DesoBody lipolysis for precise submental and body fat sculpting.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r",
    "badge": "Single Course",
    "duration": "45 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r",
      "mediaType": "image",
      "altText": "Deso Face and body Course of 1 clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Deso Face and body Course of 1 - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "body sculpting",
        "deso face and body course of 1",
        "clinical aesthetic treatments"
      ],
      "caption": "Single Course"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "body sculpting",
      "deso face and body course of 1",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "deso-face-and-body-course-of-3",
    "title": "Deso Face and body Course of 3",
    "category": "Body Sculpting",
    "pricingCategory": "Body Sculpting",
    "transformationCategory": "Lifting & Contouring",
    "description": "Progressive 3-session DesoFace and DesoBody contouring program designed for optimal adipose reduction and sculpted definition.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW",
    "badge": "3-Session Course",
    "duration": "45 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW",
      "mediaType": "image",
      "altText": "Deso Face and body Course of 3 clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Deso Face and body Course of 3 - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "body sculpting",
        "deso face and body course of 3",
        "clinical aesthetic treatments"
      ],
      "caption": "3-Session Course"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "body sculpting",
      "deso face and body course of 3",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "slimming-pen",
    "title": "Slimming pen",
    "category": "Body Sculpting",
    "pricingCategory": "Body Sculpting",
    "transformationCategory": "Lifting & Contouring",
    "description": "Clinically supervised metabolic weight management and appetite regulation protocol supporting sustainable body slimming.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC",
    "badge": "Metabolic Support",
    "duration": "30 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC",
      "mediaType": "image",
      "altText": "Slimming pen clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Slimming pen - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "body sculpting",
        "slimming pen",
        "clinical aesthetic treatments"
      ],
      "caption": "Metabolic Support"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "body sculpting",
      "slimming pen",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "platelet-rich-plasma-prp",
    "title": "Platelet-Rich Plasma (PRP)",
    "category": "Face & Injectables",
    "pricingCategory": "Face & Injectables",
    "transformationCategory": "Regenerative Biotech",
    "description": "Autologous platelet growth factor therapy that accelerates dermal collagen synthesis, tissue repair, and natural hair follicle vitality.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ",
    "badge": "Regenerative",
    "duration": "60 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ",
      "mediaType": "image",
      "altText": "Platelet-Rich Plasma (PRP) clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Platelet-Rich Plasma (PRP) - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "face & injectables",
        "platelet-rich plasma (prp)",
        "clinical aesthetic treatments"
      ],
      "caption": "Regenerative"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "face & injectables",
      "platelet-rich plasma (prp)",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "co2-laser-from",
    "title": "Co@ Laser from",
    "category": "Advanced Facials",
    "pricingCategory": "Advanced Facials",
    "transformationCategory": "Skin Texture & Scars",
    "description": "Fractional ablative laser resurfacing engineered to remodel deep acne scarring, refine pore architecture, and renew aged epidermis.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR",
    "badge": "Laser Resurfacing",
    "duration": "60 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR",
      "mediaType": "image",
      "altText": "Co@ Laser from clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Co@ Laser from - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "advanced facials",
        "co@ laser from",
        "clinical aesthetic treatments"
      ],
      "caption": "Laser Resurfacing"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "advanced facials",
      "co@ laser from",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "endolift-fiber-lift",
    "title": "Endolift - Fiber Lift",
    "category": "Face & Injectables",
    "pricingCategory": "Face & Injectables",
    "transformationCategory": "Lifting & Contouring",
    "description": "Minimally invasive interstitial laser fiber lifting that contracts deep subdermal septa, melts jowl adiposity, and sculpts the jawline.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBIu85aRvZNCnJgLddXBAuzq6-ZrHWm-RCio9ODG39WwLFMrukeSSTm7pYkErIfMtjwLveWBFsg7ViYoAHOh-QpVTrmygr1xGSzufZe33L847MBWThvbDnB59YUMqTnpKSUf_k70zg7HLIgogkrC3OyyAAH8Hcs-TZE835yDj",
    "badge": "Fiber Laser Lift",
    "duration": "60 - 90 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBIu85aRvZNCnJgLddXBAuzq6-ZrHWm-RCio9ODG39WwLFMrukeSSTm7pYkErIfMtjwLveWBFsg7ViYoAHOh-QpVTrmygr1xGSzufZe33L847MBWThvbDnB59YUMqTnpKSUf_k70zg7HLIgogkrC3OyyAAH8Hcs-TZE835yDj",
      "mediaType": "image",
      "altText": "Endolift - Fiber Lift clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Endolift - Fiber Lift - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "face & injectables",
        "endolift - fiber lift",
        "clinical aesthetic treatments"
      ],
      "caption": "Fiber Laser Lift"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "face & injectables",
      "endolift - fiber lift",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "salmon-sperm-injection",
    "title": "Salmon sperm injection",
    "category": "Face & Injectables",
    "pricingCategory": "Face & Injectables",
    "transformationCategory": "Regenerative Biotech",
    "description": "Ultra-purified polynucleotide DNA bio-revitalisation that repairs cellular damage, boosts elasticity, and illuminates delicate under-eye and facial skin.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDvTYE6O7-KUUhCD-DEa_kWziNerDAQzqbJJakBZ4fXCoZvCTmzQAT_VOqYbyHZ5ElTXNJ_6Ln6p-YkNwBsZJFL9AXe3LSjvR3Yo7ftDk8xjfRWbH-zoSfBc3kToZ27GZUJWEW92bJxW2lA9BVYy3gX8dDmrNGjy8D1mdKFG2EZebtfKtYbMYZdhT253WKmBSW9WsfRYdezgr1Pi8xzRL7L90-MH4HGeOKjiUDl_jnVpZwr6O_LiLdVSAZ-87OmvVUbzsaA1NJZ1nac",
    "badge": "Polynucleotide DNA",
    "duration": "45 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDvTYE6O7-KUUhCD-DEa_kWziNerDAQzqbJJakBZ4fXCoZvCTmzQAT_VOqYbyHZ5ElTXNJ_6Ln6p-YkNwBsZJFL9AXe3LSjvR3Yo7ftDk8xjfRWbH-zoSfBc3kToZ27GZUJWEW92bJxW2lA9BVYy3gX8dDmrNGjy8D1mdKFG2EZebtfKtYbMYZdhT253WKmBSW9WsfRYdezgr1Pi8xzRL7L90-MH4HGeOKjiUDl_jnVpZwr6O_LiLdVSAZ-87OmvVUbzsaA1NJZ1nac",
      "mediaType": "image",
      "altText": "Salmon sperm injection clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Salmon sperm injection - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "face & injectables",
        "salmon sperm injection",
        "clinical aesthetic treatments"
      ],
      "caption": "Polynucleotide DNA"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "face & injectables",
      "salmon sperm injection",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "semi-permanent-makeup",
    "title": "Semi-permanent makeup",
    "category": "Hair & Beauty",
    "pricingCategory": "Hair & Beauty",
    "transformationCategory": "Facial Rejuvenation",
    "description": "Micro-pigment artistry for natural-looking brow strokes, lip blush tinting, and subtle lash-line definition with medical-grade pigments.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww",
    "badge": "Micro-Pigment",
    "duration": "90 - 120 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww",
      "mediaType": "image",
      "altText": "Semi-permanent makeup clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Semi-permanent makeup - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "hair & beauty",
        "semi-permanent makeup",
        "clinical aesthetic treatments"
      ],
      "caption": "Micro-Pigment"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "hair & beauty",
      "semi-permanent makeup",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "tattoo-removal",
    "title": "Tattoo removal",
    "category": "Advanced Facials",
    "pricingCategory": "Advanced Facials",
    "transformationCategory": "Skin Texture & Scars",
    "description": "High-powered multi-wavelength laser pulses that shatter unwanted ink particles across all pigment spectrums without harming surrounding tissue.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAUloxcWsT4NRCnTfn0RneF4Q4BwymxBAMsqFKJv9IIvSzEjhVsjT_MDtI4irgzGW0su__ZFlPbs8_2ebSsDU3aWDop2YR9ea2x21K8fdCKFFVUTyJj9U_xiYZFY63zL5Btb43hR-HaxmbiKFgUp8DqEgm5D4mrjpPpfVzplLWjcWFD75MC4S3cc8dnLB7CywLocC5PIZJPdVTfCwgrgG4WqwQZabVdZ8OAlRAeHeZCBxQt2rP-Gm1MJcgjtoht4nVH3CBwLsNAF8OI",
    "badge": "Laser Clearance",
    "duration": "30 - 45 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuAUloxcWsT4NRCnTfn0RneF4Q4BwymxBAMsqFKJv9IIvSzEjhVsjT_MDtI4irgzGW0su__ZFlPbs8_2ebSsDU3aWDop2YR9ea2x21K8fdCKFFVUTyJj9U_xiYZFY63zL5Btb43hR-HaxmbiKFgUp8DqEgm5D4mrjpPpfVzplLWjcWFD75MC4S3cc8dnLB7CywLocC5PIZJPdVTfCwgrgG4WqwQZabVdZ8OAlRAeHeZCBxQt2rP-Gm1MJcgjtoht4nVH3CBwLsNAF8OI",
      "mediaType": "image",
      "altText": "Tattoo removal clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Tattoo removal - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "advanced facials",
        "tattoo removal",
        "clinical aesthetic treatments"
      ],
      "caption": "Laser Clearance"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "advanced facials",
      "tattoo removal",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "morpheus8-treatment",
    "title": "Morpheus8 treatment",
    "category": "Advanced Facials",
    "pricingCategory": "Advanced Facials",
    "transformationCategory": "Lifting & Contouring",
    "description": "Fractional radiofrequency microneedling penetrating deep subdermal layers to remodel collagen, tighten skin laxity, and refine facial contours.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAOtBKp33pnPLoKpvckXkiIS-1G2cj7yNpUXZYP7v7nB3HgYFreRRFM-F6UZt2uwFsUMzf2u0m_0SvHcja7AjjBjq8B4mo1Gk_Y3ihgY2qmmbr1Vc48W8QizQ3BLTsaPHv9ojoje0Q8wG64F4zjwPy98roZuGAorsk2N5TxRUibfaZ4gZ7L9r7cFXGqA6jBiryjo3-fh10ZWdkryws_w14ASGtvXypafuUczwEFeVz6SywQsQKFg--N76UkgP9d4Um3Q5Snz8eG_XyS",
    "badge": "RF Microneedling",
    "duration": "60 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuAOtBKp33pnPLoKpvckXkiIS-1G2cj7yNpUXZYP7v7nB3HgYFreRRFM-F6UZt2uwFsUMzf2u0m_0SvHcja7AjjBjq8B4mo1Gk_Y3ihgY2qmmbr1Vc48W8QizQ3BLTsaPHv9ojoje0Q8wG64F4zjwPy98roZuGAorsk2N5TxRUibfaZ4gZ7L9r7cFXGqA6jBiryjo3-fh10ZWdkryws_w14ASGtvXypafuUczwEFeVz6SywQsQKFg--N76UkgP9d4Um3Q5Snz8eG_XyS",
      "mediaType": "image",
      "altText": "Morpheus8 treatment clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Morpheus8 treatment - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "advanced facials",
        "morpheus8 treatment",
        "clinical aesthetic treatments"
      ],
      "caption": "RF Microneedling"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "advanced facials",
      "morpheus8 treatment",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "emface-skin-tightening-and-lifting",
    "title": "Emface skin tightening and lifting",
    "category": "Face & Injectables",
    "pricingCategory": "Face & Injectables",
    "transformationCategory": "Lifting & Contouring",
    "description": "Needle-free synchronized radiofrequency and HIFES facial muscle stimulation that elevates brow, cheek, and jawline architecture naturally.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs",
    "badge": "Needle-Free Lift",
    "duration": "30 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuA7UgkEtf-bZluGv7l-41WwJhNf6ZeHMpU9TjZpAKKiahvk1t9bfl0Mkxg5NCQ_kRYgAnrTTt9RUksFV8p444Zgd0ZMqNFOFXOEUq_yiCVZq9Zx1D2i-vo7LwPyVVHKmbDWQaWZ5DOA_pbZzyNvC111kWejO_nRgRCXCXLJFWWVeF1P2jY2q2e9yvoW5K2BqB9p4WMOweJldiczqPsdtmVnL2IVUWpgCA6FGEy0IBW2dpqISk24QrqJkcprWIL-_yJpN2okgDYT8IWs",
      "mediaType": "image",
      "altText": "Emface skin tightening and lifting clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Emface skin tightening and lifting - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "face & injectables",
        "emface skin tightening and lifting",
        "clinical aesthetic treatments"
      ],
      "caption": "Needle-Free Lift"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "face & injectables",
      "emface skin tightening and lifting",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "emscuplt-body-sculpt-and-tightening",
    "title": "Emscuplt body sculpt and tightening",
    "category": "Body Sculpting",
    "pricingCategory": "Body Sculpting",
    "transformationCategory": "Lifting & Contouring",
    "description": "High-intensity electromagnetic supramaximal contractions paired with thermal energy to build core muscle tone and burn stubborn fat.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDXc7SORxoXUK7Kzbf256KDGjYoiGB3XeCLNYObBtlw7h8260KwmKxaiEQL7E2Wg3BTQhjpJs0Iw9GVYkNkpYhd4WPz_jdW6PA2i4yXAVvmrMoBCqMX479nyNRdb7X8GwVNjcQtb1OIG8li-NYXrs-55c2CPQIIew0siqNajiO8--wLogFbflBlElSPQ9GlaxJ2VmWkjKCbGUr2QX1FhpzqTBOU86kyynhHW4UjQMqKe-XDBVsXygiZM-ACB4nUWQl8J4dDjsBIEw",
    "badge": "Muscle & Sculpt",
    "duration": "30 - 45 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDXc7SORxoXUK7Kzbf256KDGjYoiGB3XeCLNYObBtlw7h8260KwmKxaiEQL7E2Wg3BTQhjpJs0Iw9GVYkNkpYhd4WPz_jdW6PA2i4yXAVvmrMoBCqMX479nyNRdb7X8GwVNjcQtb1OIG8li-NYXrs-55c2CPQIIew0siqNajiO8--wLogFbflBlElSPQ9GlaxJ2VmWkjKCbGUr2QX1FhpzqTBOU86kyynhHW4UjQMqKe-XDBVsXygiZM-ACB4nUWQl8J4dDjsBIEw",
      "mediaType": "image",
      "altText": "Emscuplt body sculpt and tightening clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Emscuplt body sculpt and tightening - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "body sculpting",
        "emscuplt body sculpt and tightening",
        "clinical aesthetic treatments"
      ],
      "caption": "Muscle & Sculpt"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "body sculpting",
      "emscuplt body sculpt and tightening",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "body-slimming-fat-loss-cellulite-reduction",
    "title": "Body slimming for fat and loss Cellulite reduction",
    "category": "Body Sculpting",
    "pricingCategory": "Body Sculpting",
    "transformationCategory": "Lifting & Contouring",
    "description": "Multi-modality acoustic wave, lymphatic drainage, and thermal lipolysis protocol to smooth fibrous dimpling and contour the silhouette.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuClIGVnrpyhbZbn4skniRN95s8fe43niaHTpE2PHrPr4EAZc-kvyMu1k6JL4FcYCAw-SE1G2rBygkpuYimKkujZ8Ch9rHKJwqguHanaAZbAL8-ujTZWI6ThpC_rihPWbmp-seHAxJjDCFpT3JHdZknmaCVpfRjqS3n6DVdZCyDo4SBhN_q4D4NflwD5qBwDUw7uXpgpjXln7PkJWypOLjdKW-xVYzB53vh6hXOmAgbAecmaayoHjY2ZousTGNq_zRShg3Go2f8V0O4R",
    "badge": "Cellulite Smooth",
    "duration": "60 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuClIGVnrpyhbZbn4skniRN95s8fe43niaHTpE2PHrPr4EAZc-kvyMu1k6JL4FcYCAw-SE1G2rBygkpuYimKkujZ8Ch9rHKJwqguHanaAZbAL8-ujTZWI6ThpC_rihPWbmp-seHAxJjDCFpT3JHdZknmaCVpfRjqS3n6DVdZCyDo4SBhN_q4D4NflwD5qBwDUw7uXpgpjXln7PkJWypOLjdKW-xVYzB53vh6hXOmAgbAecmaayoHjY2ZousTGNq_zRShg3Go2f8V0O4R",
      "mediaType": "image",
      "altText": "Body slimming for fat and loss Cellulite reduction clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Body slimming for fat and loss Cellulite reduction - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "body sculpting",
        "body slimming for fat and loss cellulite reduction",
        "clinical aesthetic treatments"
      ],
      "caption": "Cellulite Smooth"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "body sculpting",
      "body slimming for fat and loss cellulite reduction",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "anti-wrinkles-injection",
    "title": "Anti-wrinkle's injection",
    "category": "Face & Injectables",
    "pricingCategory": "Face & Injectables",
    "transformationCategory": "Facial Rejuvenation",
    "description": "Precision micro-dosed neuromodulator injections that relax dynamic forehead, frown, and periorbital lines while preserving natural expression.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAOPTQtfj8J1bbB7SlVVRU6fYo2gWaZ-vP4FOmbQ0GK-wiSWxgFv7RrufflpNtjGP9Dk5eLV2kMfUIPVx1N4ETnRWMUGQ-pnWBcZCa97apM4cg71CV6hKaKDiQOlU26NKqLXuvzRkHrDNd-vXfy5u3MHCvpyxfbnHdk9lkm5vhjg9zIrK1aYJGwOOOPurVrXxbRr7FprgjD7ZzrUzhcc4DM6YdWc6J8P_jEx9W_ffwKfL2E8x3PIYt0_G8MTcbFUJlLtFYmgOa7s-OK",
    "badge": "Expression Care",
    "duration": "30 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuAOPTQtfj8J1bbB7SlVVRU6fYo2gWaZ-vP4FOmbQ0GK-wiSWxgFv7RrufflpNtjGP9Dk5eLV2kMfUIPVx1N4ETnRWMUGQ-pnWBcZCa97apM4cg71CV6hKaKDiQOlU26NKqLXuvzRkHrDNd-vXfy5u3MHCvpyxfbnHdk9lkm5vhjg9zIrK1aYJGwOOOPurVrXxbRr7FprgjD7ZzrUzhcc4DM6YdWc6J8P_jEx9W_ffwKfL2E8x3PIYt0_G8MTcbFUJlLtFYmgOa7s-OK",
      "mediaType": "image",
      "altText": "Anti-wrinkle's injection clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Anti-wrinkle's injection - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "face & injectables",
        "anti-wrinkle's injection",
        "clinical aesthetic treatments"
      ],
      "caption": "Expression Care"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "face & injectables",
      "anti-wrinkle's injection",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "iv-drip-lounge-course-of-1",
    "title": "IV Drip Lounge-course of 1",
    "category": "IV Drips & Wellness",
    "pricingCategory": "IV Drips & Wellness",
    "transformationCategory": "Regenerative Biotech",
    "description": "Single-session intravenous micronutrient, antioxidant, and hydration infusion formulated for rapid cellular replenishment and immunity.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r",
    "badge": "IV Wellness",
    "duration": "45 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r",
      "mediaType": "image",
      "altText": "IV Drip Lounge-course of 1 clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "IV Drip Lounge-course of 1 - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "iv drips & wellness",
        "iv drip lounge-course of 1",
        "clinical aesthetic treatments"
      ],
      "caption": "IV Wellness"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "iv drips & wellness",
      "iv drip lounge-course of 1",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "dermal-fillers-1ml",
    "title": "Dermal Fillers-1ml",
    "category": "Face & Injectables",
    "pricingCategory": "Face & Injectables",
    "transformationCategory": "Facial Rejuvenation",
    "description": "Bespoke 1ml hyaluronic acid structural contouring for balanced lip volume, cheek definition, jawline sculpting, or fold softening.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCxFMpWCmamXBrqtr3byekk8IxhE2yyDGA5Csl0k1gX-QAm0WlSNnY7JWxBhi_P-0cI9aXcm0u37Lx1mJD71bT1r7vkf_hkUKHQ5r5ZHO1lyWEJGrjcCjqbPHtMrqaADl5RHnV6wrOK5t6lYD0eDfR9A9e6HQrhvFCGQfDHqTSilyjMctWh0oe2v6Ftf0bnAmbfY9UxcG-hz6RqHNvavTumhSjzrQQzAMwwmIBBDPhKeG4tnbCMg1vvBC-d0H-SmLSihL8Yr0X6CCgA",
    "badge": "1ml Precision",
    "duration": "45 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCxFMpWCmamXBrqtr3byekk8IxhE2yyDGA5Csl0k1gX-QAm0WlSNnY7JWxBhi_P-0cI9aXcm0u37Lx1mJD71bT1r7vkf_hkUKHQ5r5ZHO1lyWEJGrjcCjqbPHtMrqaADl5RHnV6wrOK5t6lYD0eDfR9A9e6HQrhvFCGQfDHqTSilyjMctWh0oe2v6Ftf0bnAmbfY9UxcG-hz6RqHNvavTumhSjzrQQzAMwwmIBBDPhKeG4tnbCMg1vvBC-d0H-SmLSihL8Yr0X6CCgA",
      "mediaType": "image",
      "altText": "Dermal Fillers-1ml clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Dermal Fillers-1ml - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "face & injectables",
        "dermal fillers-1ml",
        "clinical aesthetic treatments"
      ],
      "caption": "1ml Precision"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "face & injectables",
      "dermal fillers-1ml",
      "clinical aesthetic treatments"
    ]
  },
  {
    "id": "profhilo-2ml",
    "title": "Profhilo 2ml",
    "category": "Face & Injectables",
    "pricingCategory": "Face & Injectables",
    "transformationCategory": "Regenerative Biotech",
    "description": "Award-winning 2ml ultra-pure hyaluronic acid bio-remodeling treatment that stimulates 4 types of collagen and elastin for dewy skin firmness.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC",
    "badge": "2ml Bio-Remodeling",
    "duration": "30 mins",
    "coverMedia": {
      "url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC",
      "mediaType": "image",
      "altText": "Profhilo 2ml clinical aesthetic treatment at Age Reversal Clinic",
      "seoTitle": "Profhilo 2ml - Specialist Care",
      "seoKeywords": [
        "anti-aging clinic london",
        "face & injectables",
        "profhilo 2ml",
        "clinical aesthetic treatments"
      ],
      "caption": "2ml Bio-Remodeling"
    },
    "seoKeywords": [
      "anti-aging clinic london",
      "face & injectables",
      "profhilo 2ml",
      "clinical aesthetic treatments"
    ]
  }
];

export function enrichSpecialistTreatment(t: SpecialistTreatment): SpecialistTreatment {
  const defaultKeywords = t.seoKeywords && t.seoKeywords.length > 0 ? t.seoKeywords : [
    'anti-aging clinic london',
    t.pricingCategory.toLowerCase(),
    t.title.toLowerCase(),
    'clinical aesthetic treatments'
  ];
  return {
    ...t,
    seoKeywords: defaultKeywords,
    coverMedia: t.coverMedia || {
      url: t.image,
      mediaType: 'image',
      altText: `${t.title} clinical aesthetic treatment at Age Reversal Clinic`,
      seoTitle: `${t.title} - Specialist Care`,
      seoKeywords: defaultKeywords,
      caption: t.badge || 'Signature Protocol'
    }
  };
}

export const ALL_SPECIALIST_TREATMENTS: SpecialistTreatment[] = RAW_SPECIALIST_TREATMENTS.map(enrichSpecialistTreatment);
