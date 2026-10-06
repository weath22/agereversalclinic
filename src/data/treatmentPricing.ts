export interface PricingPackage {
  id: string;
  name: string;
  price: number;
  perSessionPrice?: number;
  savingsBadge?: string;
  isPopular?: boolean;
  sessions: number;
  description: string;
  includes: string[];
}

export interface TreatmentPricingItem {
  id: string;
  title: string;
  category: 'Face & Injectables' | 'Dermal Fillers' | 'Skin Rejuvenation' | 'Body & Sculpting' | 'Regenerative & Biotech' | 'Minor Surgery & Scars';
  description: string;
  image: string;
  startingPrice: number;
  currency: string;
  procedureTime: string;
  downtime: string;
  badge?: string;
  popular?: boolean;
  packages: PricingPackage[];
}

export const TREATMENT_PRICING_DATA: TreatmentPricingItem[] = [
  // 1. Exosome Regenerative Therapy
  {
    id: 'exosome',
    title: 'Exosome Regenerative Therapy',
    category: 'Regenerative & Biotech',
    description: 'Pioneering cellular-level skin rejuvenation using pure clinical-grade exosomes to accelerate cell repair and stimulate profound collagen synthesis.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    startingPrice: 650,
    currency: '£',
    procedureTime: '45 - 60 Mins',
    downtime: '12 - 24 Hours',
    badge: 'Biotech Choice',
    popular: true,
    packages: [
      {
        id: 'exosome-single',
        name: 'Single Initial Session',
        price: 650,
        sessions: 1,
        description: 'Comprehensive baseline clinical consultation and single intensive exosome infusion session.',
        includes: [
          'Full digital skin analysis & diagnostic mapping',
          'Medical-grade topical numbing protocol',
          'Full-face clinical exosome infusion',
          'Post-treatment calming biocellulose mask'
        ]
      },
      {
        id: 'exosome-course',
        name: 'Recommended Course (3 Sessions)',
        price: 1650,
        perSessionPrice: 550,
        savingsBadge: 'Save £300 · Best Value',
        isPopular: true,
        sessions: 3,
        description: 'The clinically recommended 3-stage protocol spaced 4 weeks apart for transformative dermal renewal.',
        includes: [
          '3 Full exosome infusion sessions',
          'Complimentary digital skin scan at each stage',
          'Take-home medical barrier recovery kit (£140 value)',
          'Direct priority clinical follow-up'
        ]
      },
      {
        id: 'exosome-complete',
        name: 'Complete Regenerative Protocol (5 Sessions)',
        price: 2600,
        perSessionPrice: 520,
        savingsBadge: 'Save £650 · Maximum Impact',
        sessions: 5,
        description: 'Comprehensive cellular transformation for advanced aging, scars, or persistent laxity.',
        includes: [
          '5 Full exosome infusion sessions',
          'Face, Neck & Décolletage coverage',
          'Complete Age Reversal clinical homecare regimen',
          'Quarterly maintenance skin health review'
        ]
      }
    ]
  },

  // 2. Profhilo Injectable Hydration
  {
    id: 'profhilo',
    title: 'Profhilo Injectable Hydration',
    category: 'Face & Injectables',
    description: 'Award-winning ultra-pure hyaluronic acid bio-remodeling that triggers prolonged hydration and stimulates four types of collagen.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzrmp3whmfv7pLv3Fr-yjXcn5qQ71pKNkDzY9EledCrI80O0nFvETqMzSq0ftkBSWkU80dIxXn9lMsY8Yb-RpPpIPDRIo33mpcKERZMozFUrbPLy5p-hjFgLE2ZYAovAxiNtaTJQkLQ7QLJlLviEbGrGDrQ0Arccq3tYHauA6Y-BAm5tbswnCb8TIQrvlY9OgNHBw4j5yK_PHikIG4gOgGR6Nnw94baPdBheg7SY9Qd3LEc5fu0tqKkNAPsMTs3Zg0pHxVdOxxcrRC',
    startingPrice: 450,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: '24 Hours',
    badge: 'Award-Winning',
    popular: true,
    packages: [
      {
        id: 'profhilo-single',
        name: 'Single Maintenance Session',
        price: 450,
        sessions: 1,
        description: 'Single bio-remodeling session ideal for periodic maintenance or localized hydration boost.',
        includes: [
          'Doctor consultation & anatomical evaluation',
          'BAP 5-point precision injection protocol',
          'High-potency 2ml ultra-pure hyaluronic acid',
          'Post-procedure soothing serum'
        ]
      },
      {
        id: 'profhilo-course',
        name: 'Complete 2-Stage Protocol (Recommended)',
        price: 800,
        perSessionPrice: 400,
        savingsBadge: 'Save £100 · Clinically Proven',
        isPopular: true,
        sessions: 2,
        description: 'The essential two-session clinical standard spaced 4 weeks apart for optimal dermal firmness.',
        includes: [
          '2 Full Profhilo bio-remodeling treatments (4ml total)',
          'Pre & post clinical imaging review',
          'Post-treatment calming soothing cream',
          '6-month review consultation'
        ]
      },
      {
        id: 'profhilo-face-neck',
        name: 'Face & Neck Duo Package',
        price: 1500,
        perSessionPrice: 375,
        savingsBadge: 'Save £300 · Full Area',
        sessions: 4,
        description: 'Comprehensive two-stage treatment covering both face and neck for harmonious youthful tightening.',
        includes: [
          '2 Sessions for Face + 2 Sessions for Neck (8ml total)',
          'Comprehensive multi-zone dermal matrix regeneration',
          'Take-home restorative peptide balm',
          'VIP priority scheduling'
        ]
      }
    ]
  },

  // 3. Polynucleotide Bio-Regeneration
  {
    id: 'polynucleotide',
    title: 'Polynucleotide Bio-Regeneration',
    category: 'Regenerative & Biotech',
    description: 'Natural DNA fractions that repair compromised microvasculature, resolve under-eye hollows, and promote cellular turnover.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    startingPrice: 490,
    currency: '£',
    procedureTime: '40 Mins',
    downtime: '1 - 2 Days',
    badge: 'Under-Eye Star',
    packages: [
      {
        id: 'poly-single',
        name: 'Single Target Session',
        price: 490,
        sessions: 1,
        description: 'Targeted single-area treatment (Periorbital eye zone or localized dermal thinning).',
        includes: [
          'Detailed vascular & skin elasticity check',
          'Ultra-fine micro-cannula administration',
          '1 Full vial purified salmon DNA nucleotides',
          'Cold compression soothing aftercare'
        ]
      },
      {
        id: 'poly-course',
        name: 'Intensive Repair Course (3 Sessions)',
        price: 1300,
        perSessionPrice: 433,
        savingsBadge: 'Save £170 · Recommended',
        isPopular: true,
        sessions: 3,
        description: 'Full 3-stage cellular reconstruction course for profound tear-trough and dark circle reversal.',
        includes: [
          '3 Full nucleotide repair sessions (spaced 3 weeks apart)',
          'High-definition micro-vascular tracking',
          'Eye recovery clinical soothing eye gel',
          'Complimentary 3-month review'
        ]
      }
    ]
  },

  // 4. Morpheus8 RF Microneedling
  {
    id: 'morpheus8',
    title: 'Morpheus8 RF Microneedling',
    category: 'Skin Rejuvenation',
    description: 'Subdermal adipose remodeling combining insulated micro-pins with deep radiofrequency for dramatic skin tightening and contouring.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOtBKp33pnPLoKpvckXkiIS-1G2cj7yNpUXZYP7v7nB3HgYFreRRFM-F6UZt2uwFsUMzf2u0m_0SvHcja7AjjBjq8B4mo1Gk_Y3ihgY2qmmbr1Vc48W8QizQ3BLTsaPHv9ojoje0Q8wG64F4zjwPy98roZuGAorsk2N5TxRUibfaZ4gZ7L9r7cFXGqA6jBiryjo3-fh10ZWdkryws_w14ASGtvXypafuUczwEFeVz6SywQsQKFg--N76UkgP9d4Um3Q5Snz8eG_XyS',
    startingPrice: 850,
    currency: '£',
    procedureTime: '60 - 90 Mins',
    downtime: '2 - 3 Days',
    badge: 'Deep Tightening',
    popular: true,
    packages: [
      {
        id: 'morpheus-single',
        name: 'Single Full Face Session',
        price: 850,
        sessions: 1,
        description: 'Complete full-face deep RF microneedling subdermal remodeling session.',
        includes: [
          'High-strength topical anesthetic preparation (45 mins)',
          'Full-face personalized depth mapping (up to 4mm)',
          'Sterile single-use gold-plated needle cartridge',
          'Post-procedure thermal cooling mask'
        ]
      },
      {
        id: 'morpheus-course',
        name: 'Transformative Course (3 Sessions)',
        price: 2200,
        perSessionPrice: 733,
        savingsBadge: 'Save £350 · Gold Standard',
        isPopular: true,
        sessions: 3,
        description: 'Complete remodeling series spaced 5-6 weeks apart for maximum jawline definition and pore reduction.',
        includes: [
          '3 Full-face Morpheus8 treatments',
          '3 New sterile clinical cartridges',
          'Post-laser soothing recovery complex (£120 value)',
          'Follow-up structural assessment'
        ]
      },
      {
        id: 'morpheus-face-neck',
        name: 'Face & Neck Complete Series (3 Sessions)',
        price: 2950,
        perSessionPrice: 983,
        savingsBadge: 'Save £600 · Most Popular',
        sessions: 3,
        description: 'Full face, submental jawline, and neck tightening series for complete non-surgical structural lift.',
        includes: [
          '3 Full Face & Full Neck Morpheus8 treatments',
          'Submental fat reduction protocol included',
          'Full post-care medical barrier repair collection',
          'Priority direct clinician access'
        ]
      }
    ]
  },

  // 5. Ultherapy Non-Surgical SMAS Lift
  {
    id: 'ultherapy',
    title: 'Ultherapy Non-Surgical Lift',
    category: 'Skin Rejuvenation',
    description: 'FDA-cleared micro-focused ultrasound that visualizes and lifts the deep foundational SMAS muscle layer without surgery.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
    startingPrice: 1200,
    currency: '£',
    procedureTime: '60 - 120 Mins',
    downtime: 'Zero Downtime',
    badge: 'FDA Cleared',
    packages: [
      {
        id: 'ultherapy-lower-face',
        name: 'Lower Face & Jawline Definition',
        price: 1200,
        sessions: 1,
        description: 'Targeted ultrasound lifting along the jawline, jowls, and submental chin area.',
        includes: [
          'Real-time DeepSEE ultrasound imaging visualization',
          'Precision SMAS depth vector mapping',
          'Full lower-face transducer pulse protocol',
          'Zero recovery time required'
        ]
      },
      {
        id: 'ultherapy-full-face',
        name: 'Full Face & Brow Elevation',
        price: 1950,
        savingsBadge: 'Signature Protocol',
        isPopular: true,
        sessions: 1,
        description: 'Comprehensive upper, mid, and lower face SMAS lifting to elevate brows, cheeks, and jawline.',
        includes: [
          'Full face ultrasound coverage (up to 800 lines)',
          'Cheek elevation and brow lifting vectors',
          'Ultrasound verification scan',
          '6-month collagen remodeling review'
        ]
      },
      {
        id: 'ultherapy-face-neck',
        name: 'Total Face & Neck Transformation',
        price: 2750,
        savingsBadge: 'Save £500 · Complete Lift',
        sessions: 1,
        description: 'The ultimate non-surgical facelift covering the entire face, jawline, submentum, and neck.',
        includes: [
          'Comprehensive multi-depth ultrasound protocol',
          'Full Neck & Décolletage smoothing lines',
          'Complimentary post-care antioxidant serum',
          '1-year longevity check-in'
        ]
      }
    ]
  },

  // 6. FaceTite Radiofrequency
  {
    id: 'facetite',
    title: 'FaceTite Radiofrequency',
    category: 'Skin Rejuvenation',
    description: 'Minimally invasive subdermal tightening combining internal RF energy with internal tissue coagulation for dramatic jowl and neck contouring.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 1800,
    currency: '£',
    procedureTime: '90 Mins',
    downtime: '3 - 5 Days',
    badge: 'Surgical Alternative',
    popular: true,
    packages: [
      {
        id: 'facetite-jaw-neck',
        name: 'Lower Face & Submental Tightening',
        price: 1800,
        sessions: 1,
        description: 'Complete internal radiofrequency liquefaction and skin contraction along the lower face and double chin.',
        includes: [
          'Local tumescent anesthetic comfort protocol',
          'Dual internal and external temperature monitoring',
          'Custom compression garment fitting',
          'Post-procedure follow-up reviews at 1 week and 3 months'
        ]
      },
      {
        id: 'facetite-morpheus-combo',
        name: 'FaceTite + Morpheus8 Ultimate Contour Duo',
        price: 2450,
        savingsBadge: 'Save £400 · Synergy Protocol',
        isPopular: true,
        sessions: 1,
        description: 'Combined internal FaceTite submental coagulation with surface Morpheus8 fractional remodeling.',
        includes: [
          'Full FaceTite internal contouring protocol',
          'Same-session full face & neck Morpheus8 pass',
          'Medical-grade healing recovery pack (£160 value)',
          'Direct surgeon consultation and aftercare hotline'
        ]
      }
    ]
  },

  // 7. Precision Lip Enhancement
  {
    id: 'lip',
    title: 'Precision Lip Enhancement',
    category: 'Dermal Fillers',
    description: 'Artistic contouring and vermillion border definition using ultra-smooth hyaluronic acid for delicate, natural, balanced volume.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww',
    startingPrice: 380,
    currency: '£',
    procedureTime: '30 - 45 Mins',
    downtime: '24 - 48 Hours',
    badge: 'Patient Favorite',
    popular: true,
    packages: [
      {
        id: 'lip-subtle',
        name: 'Natural Subtle Touch (0.5ml)',
        price: 380,
        sessions: 1,
        description: 'Delicate hydration and soft vermillion definition for an ultra-subtle, undetectable refresh.',
        includes: [
          'Full lip aesthetic symmetry consultation',
          'Topical anesthetic compound cream',
          '0.5ml Premium Swiss hyaluronic acid',
          'Post-treatment soothing lip balm'
        ]
      },
      {
        id: 'lip-full',
        name: 'Signature Full Volume (1.0ml)',
        price: 480,
        savingsBadge: 'Most Requested',
        isPopular: true,
        sessions: 1,
        description: 'Complete contouring, cupid’s bow shaping, and balanced plumpness with premium cohesive filler.',
        includes: [
          '1.0ml High-cohesivity hyaluronic acid',
          'Micro-cannula / fine needle precision technique',
          'Complimentary 2-week refinement touch-up assessment',
          'Emergency out-of-hours clinician support'
        ]
      }
    ]
  },

  // 8. Jawline & Chin Contouring
  {
    id: 'jawline-contouring',
    title: 'Contouring the Jaw Line',
    category: 'Dermal Fillers',
    description: 'High-density structural hyaluronic acid placed precisely along the mandibular angle and chin to sculpt a sleek profile.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOPTQtfj8J1bbB7SlVVRU6fYo2gWaZ-vP4FOmbQ0GK-wiSWxgFv7RrufflpNtjGP9Dk5eLV2kMfUIPVx1N4ETnRWMUGQ-pnWBcZCa97apM4cg71CV6hKaKDiQOlU26NKqLXuvzRkHrDNd-vXfy5u3MHCvpyxfbnHdk9lkm5vhjg9zIrK1aYJGwOOOPurVrXxbRr7FprgjD7ZzrUzhcc4DM6YdWc6J8P_jEx9W_ffwKfL2E8x3PIYt0_G8MTcbFUJlLtFYmgOa7s-OK',
    startingPrice: 580,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: '24 Hours',
    badge: 'Profile Sculpting',
    packages: [
      {
        id: 'jawline-2ml',
        name: 'Targeted Definition (2ml)',
        price: 580,
        sessions: 1,
        description: 'Targeted placement along the jawline angles or chin apex for refined structural projection.',
        includes: [
          'Full 3D profile vector assessment',
          '2ml High-G-prime structural dermal filler',
          'Micro-cannula trauma reduction protocol',
          'Review session at 2 weeks'
        ]
      },
      {
        id: 'jawline-4ml',
        name: 'Full Profile Transformation (4ml)',
        price: 1050,
        savingsBadge: 'Save £110 · Complete Jawline',
        isPopular: true,
        sessions: 1,
        description: 'Complete mandibular line, gonial angle, and chin projection sculpting for high-definition contour.',
        includes: [
          '4ml Premium structural volumizer',
          'Multi-point mandibular border sculpting',
          'Chin projection and pre-jowl smoothing',
          'Comprehensive aftercare pack'
        ]
      }
    ]
  },

  // 9. Non-Surgical Rhinoplasty
  {
    id: 'rhinoplasty',
    title: 'Non-Surgical Rhinoplasty',
    category: 'Dermal Fillers',
    description: 'Micro-droplet liquid nose reshaping using high-cohesivity fillers to camouflage dorsal humps and lift nasal tips instantly.',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=80',
    startingPrice: 650,
    currency: '£',
    procedureTime: '30 - 45 Mins',
    downtime: 'Minimal (24 hrs)',
    badge: 'Instant Results',
    packages: [
      {
        id: 'rhino-standard',
        name: 'Complete Liquid Rhinoplasty Protocol',
        price: 650,
        sessions: 1,
        description: 'Master clinician nose reshaping to straighten bridge angles, lift droopy tips, and smooth profiles.',
        includes: [
          'Detailed nasal vascular anatomy assessment',
          'Ultra-precise micro-needle filler placement',
          'Complimentary 2-week top-up review',
          'Longevity lasting 12 to 18 months'
        ]
      }
    ]
  },

  // 10. Lines & Wrinkles Smoothing
  {
    id: 'smoothing',
    title: 'Lines & Wrinkles Smoothing',
    category: 'Face & Injectables',
    description: 'Expert dynamic smoothing targeting forehead, frown lines (11s), and crows feet for a refreshed, natural appearance.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2a_0Datjn8f2On3mNF7IY6_QgXkw0AQl1Il2WqYPqYqTU7wUKYRpJUg2xdA_d0B8SfBpbvVzzYOczvA85hXWv6hkb0snKG0UXUjP3EUDr0nkt_A_nINJJOIpGcQ2X_iD94V14qlhvJmRUp8In6cOEtlONSRSf5Kpdd8uA6VUX3SFIaBku4xsVbSvg9fE6K0FWVX-QGNWmY4jhYY70yZCEdfN_V3cezSz0jiycoy31X-hMxrw-bNoMrpEVo43FV1z8TnWKiqVpTdlK',
    startingPrice: 350,
    currency: '£',
    procedureTime: '20 - 30 Mins',
    downtime: 'Zero Downtime',
    badge: 'Clinic Essential',
    popular: true,
    packages: [
      {
        id: 'smoothing-1area',
        name: '1 Target Area',
        price: 350,
        sessions: 1,
        description: 'Targeted single region smoothing (e.g. Crow’s feet or Glabella frown lines).',
        includes: [
          'Facial muscle mobility analysis',
          'Precision dosing for 1 distinct zone',
          'Complimentary 2-week check & touch-up',
          'Prescription-grade product only'
        ]
      },
      {
        id: 'smoothing-2areas',
        name: '2 Upper Facial Areas',
        price: 450,
        savingsBadge: 'Save £250 vs Single',
        sessions: 1,
        description: 'Comprehensive upper face harmony (e.g. Forehead + Glabella frown lines).',
        includes: [
          '2 Full facial area treatments',
          'Natural movement preservation technique',
          'Complimentary 2-week review & refinement',
          'Zero downtime'
        ]
      },
      {
        id: 'smoothing-3areas',
        name: '3 Areas (Full Upper Face)',
        price: 520,
        savingsBadge: 'Best Value · Most Popular',
        isPopular: true,
        sessions: 1,
        description: 'Complete upper facial rejuvenation covering Forehead, Frown Lines, and Crow’s Feet.',
        includes: [
          'Full 3-zone treatment protocol',
          'Micro-fine needles for painless comfort',
          'Complimentary 2-week adjustment guarantee',
          'Results lasting 3 to 5 months'
        ]
      }
    ]
  },

  // 11. Lanluma Buttock Contouring
  {
    id: 'lanluma',
    title: 'Lanluma Volume Contouring',
    category: 'Body & Sculpting',
    description: 'PLLA-based body sculpting formulation to restore deep structural volume, correct hip dips, and elevate gluteal curves.',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80',
    startingPrice: 1800,
    currency: '£',
    procedureTime: '60 Mins',
    downtime: '48 Hours',
    badge: 'Body Sculpting',
    popular: true,
    packages: [
      {
        id: 'lanluma-2vials',
        name: 'Hip Dip Smoothing (2 Vials)',
        price: 1800,
        sessions: 1,
        description: 'Targeted lateral hip dip contouring and silhouette smoothing.',
        includes: [
          '3D pelvic contour evaluation',
          '2 Vials Lanluma structural PLLA',
          'Specialist blunt cannula administration',
          'Aftercare lymphatic massage guide'
        ]
      },
      {
        id: 'lanluma-4vials',
        name: 'Full Gluteal Curve & Lift (4 Vials)',
        price: 3200,
        savingsBadge: 'Save £400 · High Impact',
        isPopular: true,
        sessions: 1,
        description: 'Enhanced projection, upper pole fullness, and deep tissue lifting for dramatic natural curves.',
        includes: [
          '4 Vials Lanluma structural PLLA',
          'Upper gluteal projection and hip dip integration',
          'Post-procedure firming compression garment',
          '3-month progress scan'
        ]
      }
    ]
  },

  // 12. Aqualyx Fat Dissolving Injection
  {
    id: 'aqualyx',
    title: 'Aqualyx Fat Dissolving Injection',
    category: 'Body & Sculpting',
    description: 'Targeted specialized localized fat lipolysis via deoxycholic acid formulation to eliminate stubborn fat pockets.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f02e69f83f2?auto=format&fit=crop&w=800&q=80',
    startingPrice: 350,
    currency: '£',
    procedureTime: '30 - 45 Mins',
    downtime: '24 - 48 Hours',
    badge: 'Stubborn Fat',
    packages: [
      {
        id: 'aqualyx-single',
        name: 'Single Region Session (e.g., Chin)',
        price: 350,
        sessions: 1,
        description: 'Targeted lipolytic micro-injections into localized submental or small body fat pocket.',
        includes: [
          'Adipose tissue depth evaluation',
          'Lidocaine-infused comfort formulation',
          'Targeted intralipotherapy technique',
          'Post-treatment lymphatic drainage instructions'
        ]
      },
      {
        id: 'aqualyx-course',
        name: 'Recommended 3-Session Course',
        price: 890,
        perSessionPrice: 297,
        savingsBadge: 'Save £160 · Best Results',
        isPopular: true,
        sessions: 3,
        description: 'Complete 3-session fat dissolution protocol spaced 4 weeks apart for permanent fat cell clearance.',
        includes: [
          '3 Full fat-dissolving clinical sessions',
          'Caliper & 3D body metric monitoring',
          'Complimentary soothing anti-swelling compress',
          'Review session at 8 weeks'
        ]
      }
    ]
  },

  // 13. Minor Surgery - Mole & Cyst Removal
  {
    id: 'mole-removal',
    title: 'Mole & Lesion Removal',
    category: 'Minor Surgery & Scars',
    description: 'Safe clinical removal of benign facial and body skin lesions by GMC-registered aesthetic surgeons.',
    image: '/src/assets/images/clinic/procedures/minor_surgery_scars.jpg',
    startingPrice: 290,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: '2 - 5 Days',
    badge: 'GMC Surgeons',
    packages: [
      {
        id: 'mole-single',
        name: 'Single Lesion Removal & Histology',
        price: 290,
        sessions: 1,
        description: 'Complete surgical or radiosurgical removal of 1 skin lesion with local anesthesia and sterile closure.',
        includes: [
          'Pre-procedure clinical dermoscopy examination',
          'Local anesthetic comfort protocol',
          'Precision minimal-scar surgical excision',
          'Sterile dressing & aftercare kit'
        ]
      },
      {
        id: 'mole-multi',
        name: 'Multiple Lesions Package (Up to 3)',
        price: 580,
        savingsBadge: 'Save £290 · Multi-Lesion',
        isPopular: true,
        sessions: 1,
        description: 'Removal of up to 3 facial or body lesions in a single appointment session.',
        includes: [
          'Complete excision of up to 3 lesions',
          'Scar prevention silicone gel included',
          'Suture removal & wound review appointment',
          'Priority laboratory pathology histology service'
        ]
      }
    ]
  },

  // 14. Fractional CO2 Laser
  {
    id: 'co2-laser',
    title: 'Fractional CO2 Laser',
    category: 'Minor Surgery & Scars',
    description: 'Ablative laser resurfacing targeting deep acne pitting, surgical scars, and severe photodamage for smooth dermal texture.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCauimUjLiG4FTybnhAOQgEeV5EX6ZPVafVgrL3ZQsSct4k3azc70DZOUL83NrLvzdJb2f8vDkSR-JW3kDIXtIlaDRE7geAe7clP3VWiV3uUxojtpMPuJEi5OqDgxLNHx9CkD10MbA89eiJWjBKIGS_6wyql817jtfy9hiYYvBvNSkfl-hWqMAYjqlQY60-eyfLsAJrUNmaucXp2XyxxJ3g8KII7-qGALB6o42Cwv1YMd51LLVpOMqPrCEUk2hzlWKV6lTlxBcieuUH',
    startingPrice: 590,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: '4 - 7 Days',
    badge: 'Deep Resurfacing',
    packages: [
      {
        id: 'co2-single',
        name: 'Single Full-Face Laser Resurfacing',
        price: 590,
        sessions: 1,
        description: 'Single high-density fractional ablative laser pass for dramatic texture and scar leveling.',
        includes: [
          'High-strength topical anesthetic compound',
          'Custom micro-thermal ablation grid setting',
          'Cold-air cryo-cooling during procedure',
          'Epithelial recovery balm and soothing mask'
        ]
      },
      {
        id: 'co2-course',
        name: 'Complete 3-Stage Laser Protocol',
        price: 1450,
        perSessionPrice: 483,
        savingsBadge: 'Save £320 · Maximum Renewal',
        isPopular: true,
        sessions: 3,
        description: 'The clinically recommended 3-session series to elevate depressed scars and smooth skin permanently.',
        includes: [
          '3 Full fractional CO2 laser treatments',
          'Integrated polynucleotide bio-repair booster (£250 value)',
          'Full medical barrier repair skincare regimen',
          'Post-treatment dermal remodeling check-in'
        ]
      }
    ]
  },

  // 15. PRP Hair Restoration Therapy
  {
    id: 'prp-hair',
    title: 'PRP Hair Restoration Therapy',
    category: 'Regenerative & Biotech',
    description: 'Autologous platelet concentration injected into the scalp to stimulate dormant follicles and halt hair thinning.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    startingPrice: 450,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: 'Minimal (0 - 12 Hrs)',
    badge: 'Trichology',
    packages: [
      {
        id: 'prp-hair-single',
        name: 'Single Scalp Induction Session',
        price: 450,
        sessions: 1,
        description: 'Diagnostic scalp trichoscopy evaluation and single high-concentration PRP micro-injection session.',
        includes: [
          'Digital hair density and follicle mapping',
          'Double-spin high platelet yield extraction',
          'Multi-point mesotherapy delivery across thinning zones',
          'Post-procedure follicle calming spray'
        ]
      },
      {
        id: 'prp-hair-course',
        name: 'Recommended Course (4 Sessions)',
        price: 1500,
        perSessionPrice: 375,
        savingsBadge: 'Save £300 · Full Regrowth Protocol',
        isPopular: true,
        sessions: 4,
        description: 'Comprehensive 4-stage follicular revival protocol spaced monthly for visible density restoration.',
        includes: [
          '4 Complete high-potency PRP scalp sessions',
          'Quarterly phototrichogram progress tracking',
          'Take-home peptide trichology serum (£95 value)',
          '6-month physician hair health review'
        ]
      }
    ]
  }
];

export const PRICING_CATEGORIES = [
  'All Procedures',
  'Face & Injectables',
  'Dermal Fillers',
  'Skin Rejuvenation',
  'Regenerative & Biotech',
  'Body & Sculpting',
  'Minor Surgery & Scars'
] as const;

export type PricingCategory = typeof PRICING_CATEGORIES[number];

/**
 * Helper to fetch a pricing item by ID
 */
export const getPricingItemById = (id: string): TreatmentPricingItem | undefined => {
  const searchId = id.toLowerCase().trim();
  return TREATMENT_PRICING_DATA.find((item) => item.id.toLowerCase() === searchId);
};
