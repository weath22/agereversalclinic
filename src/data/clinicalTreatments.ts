import { TreatmentPricingItem } from './treatmentPricing';
import { getHybridTreatmentPricing } from '../lib/treatmentResolver';

export interface TreatmentItem {
  id: string;
  name: string;
  price: string;
  time: string;
  desc: string;
  badge?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  items: TreatmentItem[];
}

export interface AreaItem {
  id: string;
  name: string;
  categories: CategoryItem[];
}

/**
 * Authentic Clinical Areas & Consultation Hierarchy
 * Strictly aligned with the official clinic brochure:
 * 1. face-injectables (Anti-Wrinkle, Dermal Fillers, Skin Boosters, Lifting)
 * 2. body-sculpting (Fat Dissolving, EMSCULPT, Cryo, Slimming Pen)
 * 3. advanced-facials (Medical Facials, Mon & Fri Specials, Light Therapy)
 * 4. hair-beauty (Hair Salon, Lashes & Brows, SPMU, Laser Hair Removal, IV Lounge & PRP)
 */
export const CLINICAL_AREAS_DB: AreaItem[] = [
  // =========================================================================
  // 1. FACE & INJECTABLES
  // =========================================================================
  {
    id: 'face-injectables',
    name: 'Face & Injectables',
    categories: [
      {
        id: 'anti-wrinkle',
        name: 'Anti-Wrinkle Injections (Botox)',
        items: [
          {
            id: 'botox-bunny-lines',
            name: 'Bunny Lines',
            price: '£160',
            time: '20 Mins',
            desc: 'Smooths fine wrinkles along the sides and bridge of the nose when smiling.'
          },
          {
            id: 'botox-crows-feet',
            name: "Crow's Feet",
            price: '£160',
            time: '20 Mins',
            desc: 'Softens delicate lateral periorbital lines around the eye corners.'
          },
          {
            id: 'botox-gummy-smile',
            name: 'Gummy Smile',
            price: '£160',
            time: '15 Mins',
            desc: 'Relaxes hyperactive upper lip elevators for a balanced, harmonious smile.'
          },
          {
            id: 'botox-lip-flip',
            name: 'Lip Flip',
            price: '£160',
            time: '15 Mins',
            desc: 'Gently rolls the vermilion border outward for subtle upper lip enhancement.'
          },
          {
            id: 'botox-puppet-lines',
            name: 'Puppet Lines (DAO)',
            price: '£160',
            time: '20 Mins',
            desc: 'Relaxes downward pulling muscles at the mouth corners to lift rested facial expression.'
          },
          {
            id: 'botox-1-area',
            name: '1 Area Full Treatment',
            price: '£180',
            time: '20 Mins',
            desc: "Focused relaxation of one full area (Frown, Forehead, or Crow's Feet)."
          },
          {
            id: 'botox-forehead',
            name: 'Forehead Lines',
            price: '£230',
            time: '30 Mins',
            desc: 'Smooths horizontal forehead expression creases while preserving natural brow animation.'
          },
          {
            id: 'botox-2-areas',
            name: '2 Areas Full Treatment',
            price: '£250',
            time: '30 Mins',
            desc: 'Dual upper-face area synergy for smooth forehead, glabella, or eye contouring.'
          },
          {
            id: 'botox-3-areas',
            name: '3 Areas (Complete Upper Face)',
            price: '£280',
            time: '30 Mins',
            desc: 'Comprehensive upper facial anti-ageing across Forehead, Frown lines, and Crow’s Feet.'
          },
          {
            id: 'botox-neck-bands',
            name: 'Neck Bands (Nefertiti Lift)',
            price: '£290',
            time: '30 Mins',
            desc: 'Relaxes downward platysmal pulling bands along the neck and defined jawline.'
          },
          {
            id: 'botox-jaw-slimming',
            name: 'Jaw Slimming (Masseter)',
            price: '£320',
            time: '30 Mins',
            desc: 'Slims broad lower facial angles and alleviates teeth grinding / clenching.'
          },
          {
            id: 'botox-extended-neck-bands',
            name: 'Extended Neck Bands',
            price: '£370',
            time: '35 Mins',
            desc: 'Comprehensive multi-band platysmal therapy across the entire neck and lower border.'
          }
        ]
      },
      {
        id: 'dermal-fillers',
        name: 'Dermal Fillers (1ml)',
        items: [
          {
            id: 'filler-cheeks-soft',
            name: 'Cheeks Soft Volumisation (1ml)',
            price: '£290',
            time: '30 Mins',
            desc: 'Gentle mid-face volume restoration to lift tired cheeks and soften nasolabial folds.'
          },
          {
            id: 'filler-lips',
            name: 'Lip Enhancement (1ml)',
            price: '£290',
            time: '30 - 45 Mins',
            desc: "Subtle plumping, border definition, Cupid's bow contouring, and hydration."
          },
          {
            id: 'filler-rhinoplasty',
            name: 'Non-Surgical Rhinoplasty',
            price: '£290',
            time: '30 - 45 Mins',
            desc: 'Straightens dorsal humps, refines nasal bridge angles, and elevates nasal tips without surgery.'
          },
          {
            id: 'filler-tear-trough',
            name: 'Tear Troughs & Under Eyes',
            price: '£290',
            time: '30 Mins',
            desc: 'Brightens tired dark hollows beneath the eyes using specialised low-swelling HA.'
          },
          {
            id: 'filler-temples',
            name: 'Temples Rejuvenation',
            price: '£290',
            time: '30 Mins',
            desc: 'Restores hollowed temporal fossa to deliver youthful, balanced heart-shaped contours.'
          },
          {
            id: 'filler-cleavage-lines',
            name: 'Cleavage & Decolletage Lines',
            price: '£290',
            time: '30 Mins',
            desc: 'Smooths vertical sleep and sun-damage lines across the upper chest.'
          },
          {
            id: 'filler-cheek-deep',
            name: 'Cheeks Deep Contouring (1ml)',
            price: '£350',
            time: '40 Mins',
            desc: 'High-definition zygomatic arch enhancement for razor-sharp cheekbone definition.'
          },
          {
            id: 'filler-jaw-chin',
            name: 'Jaw & Chin Contouring (1ml)',
            price: '£350',
            time: '40 Mins',
            desc: 'Sculpts a defined jawline border, sharpens chin projection, and slims lower face.'
          },
          {
            id: 'filler-hand-rejuvenation',
            name: 'Hand Rejuvenation (1ml)',
            price: '£470',
            time: '30 Mins',
            desc: 'Restores volume over dorsal veins and tendons on the back of hands for youthful skin.'
          }
        ]
      },
      {
        id: 'skin-boosters',
        name: 'Skin Boosters & Bioremodeling',
        items: [
          {
            id: 'profhilo-skin-booster',
            name: 'Profhilo® 2ml Bioremodeling',
            price: '£350',
            time: '30 Mins',
            desc: 'Ultra-pure stabilized hyaluronic acid stimulating 4 types of collagen and elastin (Single £350, Course of 2 £560).'
          },
          {
            id: 'salmon-sperm-polynucleotides',
            name: 'Salmon Sperm / Polynucleotides (PDRN)',
            price: '£350',
            time: '40 Mins',
            desc: 'Purified DNA fragments repairing damaged cellular structures, fading pigmentation, and firming delicate eye tissue.'
          }
        ]
      },
      {
        id: 'high-tech-lifting',
        name: 'High-Tech Lifting & Laser',
        items: [
          {
            id: 'morpheus8-facial',
            name: 'Morpheus8 Facial RF Microneedling',
            price: '£190',
            time: '60 Mins',
            desc: 'Subdermal adipose remodeling combining microneedling with radiofrequency to tighten skin up to 4mm deep.'
          },
          {
            id: 'emface-lifting',
            name: 'EMFACE® Tightening & Muscle Lifting',
            price: '£250',
            time: '20 Mins',
            desc: 'Simultaneous synchronized RF and HIFES™ muscle stimulation to lift cheek elevators and smooth forehead.'
          },
          {
            id: 'endolift-fiber-lift',
            name: 'Endolift® Subdermal Laser Fiber Lift',
            price: '£950',
            time: '60 - 90 Mins',
            desc: 'Minimally invasive internal micro-optical laser melting localized fat and retracting jawline and neck tissue.'
          },
          {
            id: 'co2-fractional-laser',
            name: 'CO2 Fractional Ablative Laser Resurfacing',
            price: '£100',
            time: '45 - 60 Mins',
            desc: 'Micro-ablative laser technology vaporizing damaged tissue (Scars £100, Hands £200, Stretch Marks £200, Face & Neck £300).'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 2. BODY SCULPTING
  // =========================================================================
  {
    id: 'body-sculpting',
    name: 'Body Sculpting',
    categories: [
      {
        id: 'fat-dissolving',
        name: 'Fat Dissolving Injections (Aqualyx & Deso)',
        items: [
          {
            id: 'aqualyx-small-single',
            name: 'Aqualyx Small Area (Chin / Jowls)',
            price: '£170',
            time: '30 Mins',
            desc: 'Targeted single treatment for localized small pockets like double chin or buccal pad (Course of 3: £408).'
          },
          {
            id: 'aqualyx-med-single',
            name: 'Aqualyx Medium Area (Arms / Flanks)',
            price: '£190',
            time: '30 Mins',
            desc: 'Single session for medium deposits such as love handles or bra bulge (Course of 3: £456).'
          },
          {
            id: 'aqualyx-large-single',
            name: 'Aqualyx Large Area (Abdomen / Thighs)',
            price: '£230',
            time: '45 Mins',
            desc: 'Comprehensive single session across lower abdomen, outer thighs, or back (Course of 3: £552).'
          },
          {
            id: 'deso-small-single',
            name: 'DesoFace Small Area (Double Chin)',
            price: '£150',
            time: '30 Mins',
            desc: 'Specialized sodium deoxycholate formulated specifically for submental double chin (Course of 3: £360).'
          },
          {
            id: 'deso-med-single',
            name: 'DesoBody Medium Area (Flanks / Arms)',
            price: '£170',
            time: '30 Mins',
            desc: 'Targeted formulation for flanks, inner knees, or underarm bulge (Course of 3: £408).'
          },
          {
            id: 'deso-large-single',
            name: 'DesoBody Large Area (Abdomen / Thighs)',
            price: '£210',
            time: '45 Mins',
            desc: 'Maximum fat cell destruction across abdomen or thigh zones (Course of 3: £504).'
          }
        ]
      },
      {
        id: 'body-contouring',
        name: 'Body Contouring & Fat Loss',
        items: [
          {
            id: 'cryo-fat-freezing',
            name: 'Fat Freezing Cryo Slimming (Cryolipolysis)',
            price: '£95',
            time: '45 - 60 Mins',
            desc: 'Controlled medical cooling freezing fat cells to -9°C triggering natural apoptosis (Dual Applicator: £180).'
          },
          {
            id: 'emsculpt-body-sculpt',
            name: 'EMSCULPT® Body Sculpt & Muscle Tightening',
            price: '£275',
            time: '30 Mins',
            desc: 'HIFEM producing 20,000 supramaximal contractions per session to build muscle and burn deep fat (Course of 4: £950).'
          },
          {
            id: 'slimming-pen-program',
            name: 'Medical Slimming Pen Program',
            price: '£155',
            time: 'Medical Consult',
            desc: 'Physician-prescribed GLP-1 weight management (1 Month £155, 3 Months with doctor reviews & progress logs £450).'
          },
          {
            id: 'morpheus8-body',
            name: 'Morpheus8 Body Treatment',
            price: '£200',
            time: '60 Mins',
            desc: 'Deep RF microneedling penetrating up to 7-8mm to melt fat and tighten skin on abdomen and thighs (Course of 3: £550).'
          },
          {
            id: 'body-slimming-cellulite',
            name: 'Body Slimming for Fat Loss & Cellulite Reduction',
            price: '£195',
            time: '60 Mins',
            desc: 'Multi-technology lymphatic drainage and radiofrequency vacuum cavitation smoothing orange-peel skin texture.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 3. ADVANCED FACIALS
  // =========================================================================
  {
    id: 'advanced-facials',
    name: 'Advanced Facials',
    categories: [
      {
        id: 'medical-facials',
        name: 'Clinical & Medical Facials',
        items: [
          {
            id: 'aquafacial-clinical',
            name: 'Aquafacial Deep Hydration & Extraction',
            price: '£150',
            time: '60 Mins',
            desc: 'Vortex-fusion medical facial utilizing saline and AHA/BHA serums for painless vacuum extractions and peptide infusion.'
          },
          {
            id: 'ultimate-glass-skin-facial',
            name: 'Ultimate Glass Skin Facial (VIP Ritual)',
            price: '£250',
            time: '120 Mins',
            desc: '2-hour medical facial ritual combining diamond peel, hyperbaric oxygen, microcurrent, and peptide layering.'
          },
          {
            id: 'microneedling-collagen-induction',
            name: 'Micro-Needling Collagen Induction Therapy',
            price: '£150',
            time: '60 Mins',
            desc: 'Medical precision dermapen creating thousands of micro-punctures to stimulate neocollagenesis and shrink pores.'
          },
          {
            id: 'bb-glow-facial',
            name: 'BB Glow Semi-Permanent Foundation Facial',
            price: '£180',
            time: '60 Mins',
            desc: 'Nano-needling infusion of nutrient-rich tinted pigments into the upper epidermis for a radiant soft-focus glow.'
          },
          {
            id: 'diamond-microdermabrasion',
            name: 'Diamond Tip Microdermabrasion',
            price: '£60',
            time: '45 Mins',
            desc: 'Non-chemical diamond exfoliation vacuuming dead surface cells away to smooth coarse texture and dullness.'
          },
          {
            id: 'extractions-scrubber-steamer',
            name: 'Facial Extractions with Scrubber & Steamer',
            price: '£55',
            time: '45 Mins',
            desc: 'Warm ozone steam, ultrasonic spatula vibrations, and gentle suction extractions to unclog pores.'
          }
        ]
      },
      {
        id: 'specials-light',
        name: 'Monday & Friday Specials & Light Therapy',
        items: [
          {
            id: 'gold-facial-special',
            name: '24K Gold Facial (Mon & Fri Special)',
            price: '£95',
            time: '40 Mins',
            desc: 'Monday & Friday Special: Decadent 24-karat gold leaf facial infused with cellular antioxidants.'
          },
          {
            id: 'idebenone-facial-special',
            name: 'Idebenone Antioxidant Facial (Mon & Fri Special)',
            price: '£105',
            time: '40 Mins',
            desc: 'Monday & Friday Special: Ultra-potent Idebenone antioxidant infusion shielding against pollution and photo-ageing.'
          },
          {
            id: 'egf-facial-special',
            name: 'EGF Epidermal Growth Factor Facial (Mon & Fri Special)',
            price: '£115',
            time: '40 Mins',
            desc: 'Monday & Friday Special: Concentrated biotech peptide infusion accelerating cellular repair and skin turnover.'
          },
          {
            id: 'red-carpet-exfoliating-special',
            name: 'Red Carpet Exfoliating Facial (Mon & Fri Special)',
            price: '£120',
            time: '45 Mins',
            desc: 'Monday & Friday Special: Instant event-ready glow treatment combining fruit acid resurfacing and oxygen mist.'
          },
          {
            id: 'oxygen-o2-dome-facial',
            name: 'Oxygen O2 Dome Hyperbaric Facial',
            price: '£90',
            time: '45 Mins',
            desc: 'Pure 90% hyperbaric oxygen and anion mist accelerating cellular repair and eliminating acne bacteria.'
          },
          {
            id: 'led-light-therapy',
            name: 'Clinical LED Light Therapy',
            price: '£25',
            time: '45 Mins',
            desc: 'Medical light wavelengths (Red 633nm for collagen, Blue 415nm for acne, Near-Infrared 830nm for deep healing).'
          },
          {
            id: 'high-frequency-acne-facial',
            name: 'High Frequency Facial for Acne',
            price: '£55',
            time: '30 Mins',
            desc: 'Gentle electrical ozone current eliminating acne-causing bacteria and speeding breakout recovery.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 4. HAIR & BEAUTY
  // =========================================================================
  {
    id: 'hair-beauty',
    name: 'Hair & Beauty',
    categories: [
      {
        id: 'hair-salon',
        name: 'Hair Salon & Trichology',
        items: [
          {
            id: 'hair-wash-cut',
            name: 'Ladies Wash & Cut',
            price: '£20',
            time: '30 Mins',
            desc: 'Invigorating hair wash with luxury salon conditioning and precision haircut.'
          },
          {
            id: 'hair-cut-blowdry',
            name: 'Cut & Blow Dry',
            price: '£25',
            time: '45 Mins',
            desc: 'Wash, precision cut, and professional volume blow dry styling.'
          },
          {
            id: 'hair-blow-dry',
            name: 'Salon Blow Dry (Standard / Long)',
            price: '£35',
            time: '30 - 45 Mins',
            desc: 'Professional blow dry styling (Standard £35 / Long & Curly thermal styling £45).'
          },
          {
            id: 'keratin-brazilian-blowdry',
            name: 'Keratin / Brazilian Blowdry',
            price: '£60',
            time: '90 Mins',
            desc: 'Semi-permanent protein smoothing eliminating 95% of frizz for up to 3-4 months.'
          },
          {
            id: 'hair-botox-treatment',
            name: 'Hair Botox Deep Repair',
            price: '£65',
            time: '60 Mins',
            desc: 'Non-chemical deep conditioning reconstructing broken cortex fibers with hyaluronic & caviar extract.'
          },
          {
            id: 'olaplex-stem-treatment',
            name: 'Olaplex Stand-Alone Intensive Treatment',
            price: '£65',
            time: '45 Mins',
            desc: 'Complete multi-step bond rebuilding ritual restoring heavily bleached or damaged hair (Colour Add-On: £15).'
          },
          {
            id: 'colour-balayage',
            name: 'Hair Highlights & Balayage',
            price: '£70',
            time: '60 - 120 Mins',
            desc: 'Expert multidimensional colour (T-Section £70, Half Head £90, Balayage £90, Full Head £110).'
          }
        ]
      },
      {
        id: 'lashes-brows-spmu',
        name: 'Lashes, Brows & SPMU',
        items: [
          {
            id: 'eyebrow-wax',
            name: 'Eyebrow Wax & Shape',
            price: '£8',
            time: '15 Mins',
            desc: 'Clean waxing and arch definition with soothing aloe vera finish.'
          },
          {
            id: 'eyebrow-lamination',
            name: 'Eyebrow Lamination',
            price: '£30',
            time: '45 Mins',
            desc: 'Relaxes and sets brow hairs in an upward, brushed-up fluffy runway look.'
          },
          {
            id: 'lash-lift',
            name: 'Lash Lift (Perm & Curl)',
            price: '£30',
            time: '45 Mins',
            desc: 'Lifts and curls natural eyelashes from root to tip for 6-8 weeks.'
          },
          {
            id: 'classic-lashes',
            name: 'Classic Individual Lash Extensions',
            price: '£55',
            time: '60 Mins',
            desc: '1-to-1 extension application for a natural, elegant mascara finish.'
          },
          {
            id: 'russian-lashes',
            name: 'Russian Volume Lash Extensions',
            price: '£65',
            time: '75 Mins',
            desc: 'Handmade multi-lash lightweight fans applied to each lash for thick, fluffy, dark volume.'
          },
          {
            id: 'spmu-eyeliner',
            name: 'Semi-Permanent Eyeliner',
            price: '£200',
            time: '90 Mins',
            desc: 'Crisp lash-line enhancement or winged eyeliner cosmetic pigment tattoo.'
          },
          {
            id: 'spmu-microblading',
            name: 'Microblading Eyebrows (Hair Strokes)',
            price: '£250',
            time: '120 Mins',
            desc: 'Hand-etched crisp realistic hair strokes filling sparse brows with natural flow.'
          },
          {
            id: 'spmu-ombre-brows',
            name: 'Ombré Brows / Powder Brows',
            price: '£250',
            time: '120 Mins',
            desc: 'Soft misted gradient fading from light at the front to defined at the tail.'
          },
          {
            id: 'spmu-lip-blushing',
            name: 'Lip Blushing (Tint & Contour)',
            price: '£250',
            time: '120 Mins',
            desc: 'Infuses youthful nude, rose, or berry blush into pale lips with defined borders.'
          },
          {
            id: 'tattoo-removal-laser',
            name: 'Laser Tattoo & SPMU Removal',
            price: '£350',
            time: '30 - 45 Mins',
            desc: 'Q-Switched laser breaking down cosmetic or body ink pigments without scarring.'
          }
        ]
      },
      {
        id: 'laser-hair-removal',
        name: 'Laser Hair Removal',
        items: [
          {
            id: 'laser-full-body',
            name: 'Alma Soprano ICE Full Body Laser Package',
            price: '£250',
            time: '60 - 90 Mins',
            desc: 'Virtually painless diode laser hair removal safe across all Fitzpatrick skin tones.'
          },
          {
            id: 'laser-bikini',
            name: 'Standard / High Bikini Laser',
            price: '£40',
            time: '15 Mins',
            desc: 'Neat perimeter or high cut bikini border permanent hair reduction.'
          },
          {
            id: 'laser-underarm',
            name: 'Underarms Laser',
            price: '£40',
            time: '15 Mins',
            desc: 'Quick 10-minute permanent diode laser hair reduction on both underarms.'
          },
          {
            id: 'laser-half-arm',
            name: 'Arms Laser (Half / Full)',
            price: '£40',
            time: '20 - 40 Mins',
            desc: 'Forearms (£40) or full arms down to wrists (£65).'
          },
          {
            id: 'laser-half-leg',
            name: 'Legs Laser (Half / Full)',
            price: '£65',
            time: '30 - 60 Mins',
            desc: 'Lower legs including knees (£65) or full legs from thighs to toes (£85).'
          },
          {
            id: 'laser-electrolysis-1h',
            name: 'Electrolysis Permanent Hair Removal (1 Hour)',
            price: '£50',
            time: '60 Mins',
            desc: 'Permanent galvanic / thermolysis removal ideal for stubborn hormonal or blonde/grey hairs (£50/hour).'
          }
        ]
      },
      {
        id: 'iv-lounge-prp',
        name: 'IV Drip Lounge & PRP Regenerative',
        items: [
          {
            id: 'iv-b12-shot',
            name: 'Vitamin B12 Booster Shot (Intramuscular)',
            price: '£45',
            time: '15 Mins',
            desc: 'Instant energy shot boosting metabolism, red blood cell synthesis, and mental clarity.'
          },
          {
            id: 'iv-iron-shot',
            name: 'Iron Wellness Shot',
            price: '£75',
            time: '15 Mins',
            desc: 'Replenishes iron stores to fight systemic fatigue, hair shedding, and low stamina.'
          },
          {
            id: 'iv-ginko-infusion',
            name: 'Ginko Biloba Cognitive Infusion',
            price: '£80',
            time: '30 Mins',
            desc: 'Enhances micro-circulation, cerebral blood flow, focus, and memory recall.'
          },
          {
            id: 'iv-performance-boosting',
            name: 'Performance Boosting Cocktail',
            price: '£90',
            time: '40 Mins',
            desc: 'Formulated with amino acids, B-Complex, and electrolytes for athletic peak power and post-workout muscle repair.'
          },
          {
            id: 'iv-vitamin-c',
            name: 'High-Dose Vitamin C Infusion',
            price: '£100',
            time: '40 Mins',
            desc: 'Pure intravenous ascorbic acid stimulating collagen production and neutralising cellular oxidative stress.'
          },
          {
            id: 'iv-vitamin-cocktail',
            name: 'Essential Vitamin Cocktail',
            price: '£110',
            time: '40 Mins',
            desc: 'Comprehensive multi-vitamin drip replenishing depleted micronutrient reserves.'
          },
          {
            id: 'iv-detox-hangover',
            name: 'Detox & Hangover Cure Infusion',
            price: '£125',
            time: '45 Mins',
            desc: 'Fast-acting saline rehydration with anti-nausea, electrolytes, and liver detoxifiers.'
          },
          {
            id: 'iv-zinc-vitamin-c-minerals',
            name: 'Zinc, Vitamin C & Mineral Booster',
            price: '£130',
            time: '45 Mins',
            desc: 'Immune powerhouse blend strengthening mucosal barriers and accelerating recovery.'
          },
          {
            id: 'iv-skinny-drip',
            name: 'Skinny Drip (Metabolic & Fat Burner)',
            price: '£160',
            time: '45 Mins',
            desc: 'L-Carnitine and lipotropic nutrients stimulating liver metabolism to burn fat stores efficiently.'
          },
          {
            id: 'iv-cinderella-brightening',
            name: 'Cinderella Brightening Glow Drip',
            price: '£200',
            time: '45 Mins',
            desc: '1200mg Glutathione master antioxidant paired with high-dose Vitamin C and Alpha Lipoic Acid.'
          },
          {
            id: 'iv-modified-myers-cocktail',
            name: 'Modified Myers Cocktail (Immune Booster)',
            price: '£200',
            time: '45 Mins',
            desc: 'The world-famous gold standard wellness drip combining magnesium, B-complex, and high-potency Vitamin C.'
          },
          {
            id: 'prp-hair-loss-single',
            name: 'PRP for Hair Loss Treatment',
            price: '£150',
            time: '45 Mins',
            desc: 'Subdermal platelet growth factor injections into thinning areas of the scalp.'
          },
          {
            id: 'prp-facial-single',
            name: 'PRP Facial Treatment (Vampire Facial)',
            price: '£120',
            time: '45 Mins',
            desc: 'Autologous platelet micro-infusion across the face for collagen synthesis and radiance.'
          },
          {
            id: 'prp-cosmetic-injection',
            name: 'PRP Cosmetic Targeted Injection',
            price: '£180',
            time: '30 Mins',
            desc: 'High-density platelet injection targeting under-eye hollows, smile lines, or scars.'
          }
        ]
      }
    ]
  }
];

/**
 * Helper to search the clinical catalog by ID or keyword
 */
export const findTreatmentInDB = (searchKey: string) => {
  const searchLower = searchKey.toLowerCase().trim();
  for (const area of CLINICAL_AREAS_DB) {
    for (const cat of area.categories) {
      for (const item of cat.items) {
        if (
          item.id === searchLower || 
          item.name.toLowerCase() === searchLower ||
          item.name.toLowerCase().includes(searchLower) || 
          searchLower.includes(item.id)
        ) {
          return { area, category: cat, item };
        }
      }
    }
  }
  return null;
};

/**
 * Helper to find a specific TreatmentItem by ID
 */
export const findTreatmentItemInDB = (id: string): TreatmentItem | null => {
  const cleanId = id.toLowerCase().trim();
  for (const area of CLINICAL_AREAS_DB) {
    for (const cat of area.categories) {
      const found = cat.items.find((i) => i.id.toLowerCase() === cleanId);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Returns a flat list of all treatments across all clinical areas
 */
export const getAllClinicalTreatments = (): TreatmentItem[] => {
  const treatments: TreatmentItem[] = [];
  for (const area of CLINICAL_AREAS_DB) {
    for (const cat of area.categories) {
      treatments.push(...cat.items);
    }
  }
  return treatments;
};

/**
 * Hybrid resolver that links any catalog treatment to bespoke pricing packages
 * or synthesizes smart standardized packages on demand.
 */
export const resolveTreatmentToPricingItem = (
  treatmentItem: TreatmentItem,
  catName?: string
): TreatmentPricingItem => {
  return getHybridTreatmentPricing(treatmentItem, catName);
};

export { getHybridTreatmentPricing };
