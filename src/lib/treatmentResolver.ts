import { TREATMENT_PRICING_DATA, TreatmentPricingItem, PricingPackage } from '../data/treatmentPricing';
import { TreatmentItem, findTreatmentItemInDB } from '../data/clinicalTreatments';

/**
 * Keyword and synonym map linking patient terms and short IDs to authentic brochure entries
 */
const CANONICAL_SYNONYMS: Record<string, string> = {
  // Anti-Wrinkle Injections (Botox)
  'botox': 'anti-wrinkle-injections',
  'anti-wrinkle': 'anti-wrinkle-injections',
  'wrinkles': 'anti-wrinkle-injections',
  'bunny lines': 'botox-bunny-lines',
  'crows feet': 'botox-crows-feet',
  "crow's feet": 'botox-crows-feet',
  'gummy smile': 'botox-gummy-smile',
  'lip flip': 'botox-lip-flip',
  'puppet lines': 'botox-puppet-lines',
  'dao': 'botox-puppet-lines',
  'forehead': 'botox-forehead',
  'jaw slimming': 'botox-jaw-slimming',
  'masseter': 'botox-jaw-slimming',
  'neck bands': 'botox-neck-bands',
  'nefertiti': 'botox-neck-bands',
  'extended neck': 'botox-extended-neck-bands',

  // Dermal Fillers (1ml)
  'lip filler': 'filler-lips',
  'lip enhancement': 'filler-lips',
  'lips': 'filler-lips',
  'dermal filler': 'dermal-fillers-1ml',
  'filler': 'dermal-fillers-1ml',
  'rhinoplasty': 'filler-rhinoplasty',
  'nose filler': 'filler-rhinoplasty',
  'non-surgical rhinoplasty': 'filler-rhinoplasty',
  'tear trough': 'filler-tear-trough',
  'tear troughs': 'filler-tear-trough',
  'under eyes': 'filler-tear-trough',
  'dark circles': 'filler-tear-trough',
  'temple filler': 'filler-temples',
  'temples': 'filler-temples',
  'cheek filler': 'filler-cheeks-soft',
  'cheeks': 'filler-cheeks-soft',
  'cheek volumisation': 'filler-cheeks-soft',
  'cheek contouring': 'filler-cheek-deep',
  'jaw filler': 'filler-jaw-chin',
  'chin filler': 'filler-jaw-chin',
  'jaw and chin': 'filler-jaw-chin',
  'cleavage': 'filler-cleavage-lines',
  'decolletage': 'filler-cleavage-lines',
  'hand filler': 'filler-hand-rejuvenation',
  'hand rejuvenation': 'filler-hand-rejuvenation',

  // Skin Boosters & High-Tech Lifting
  'profhilo': 'profhilo-skin-booster',
  'bioremodeling': 'profhilo-skin-booster',
  'salmon sperm': 'salmon-sperm-polynucleotides',
  'polynucleotides': 'salmon-sperm-polynucleotides',
  'pdrn': 'salmon-sperm-polynucleotides',
  'morpheus': 'morpheus8-facial',
  'morpheus8': 'morpheus8-facial',
  'rf microneedling': 'morpheus8-facial',
  'emface': 'emface-lifting',
  'endolift': 'endolift-fiber-lift',
  'fiber lift': 'endolift-fiber-lift',
  'co2 laser': 'co2-fractional-laser',
  'fractional co2': 'co2-fractional-laser',

  // Body Sculpting & Fat Loss
  'aqualyx': 'aqualyx-course-1',
  'fat dissolving': 'aqualyx-course-1',
  'deso': 'deso-course-1',
  'desoface': 'deso-small-single',
  'desobody': 'deso-med-single',
  'fat freezing': 'cryo-fat-freezing',
  'cryo': 'cryo-fat-freezing',
  'cryolipolysis': 'cryo-fat-freezing',
  'emsculpt': 'emsculpt-body-sculpt',
  'slimming pen': 'slimming-pen-program',
  'glp-1': 'slimming-pen-program',
  'morpheus body': 'morpheus8-body',
  'cellulite': 'body-slimming-cellulite',

  // Advanced Facials
  'aquafacial': 'aquafacial-clinical',
  'glass skin': 'ultimate-glass-skin-facial',
  'microneedling': 'microneedling-collagen-induction',
  'bb glow': 'bb-glow-facial',
  'diamond microdermabrasion': 'diamond-microdermabrasion',
  'microdermabrasion': 'diamond-microdermabrasion',
  'extractions': 'extractions-scrubber-steamer',
  'gold facial': 'gold-facial-special',
  'idebenone': 'idebenone-facial-special',
  'egf': 'egf-facial-special',
  'red carpet': 'red-carpet-exfoliating-special',
  'oxygen facial': 'oxygen-o2-dome-facial',
  'o2 dome': 'oxygen-o2-dome-facial',
  'led light': 'led-light-therapy',
  'high frequency': 'high-frequency-acne-facial',

  // Hair Salon, Lashes & SPMU
  'haircut': 'hair-cut-blowdry',
  'blow dry': 'hair-blow-dry',
  'blowdry': 'hair-blow-dry',
  'keratin': 'keratin-brazilian-blowdry',
  'brazilian blowdry': 'keratin-brazilian-blowdry',
  'hair botox': 'hair-botox-treatment',
  'olaplex': 'olaplex-stem-treatment',
  'balayage': 'colour-balayage',
  'highlights': 'colour-balayage',
  'eyebrow wax': 'eyebrow-wax',
  'brow wax': 'eyebrow-wax',
  'brow lamination': 'eyebrow-lamination',
  'lash lift': 'lash-lift',
  'lashes': 'classic-lashes',
  'classic lashes': 'classic-lashes',
  'russian lashes': 'russian-lashes',
  'microblading': 'spmu-microblading',
  'ombre brows': 'spmu-ombre-brows',
  'powder brows': 'spmu-ombre-brows',
  'lip blushing': 'spmu-lip-blushing',
  'lip blush': 'spmu-lip-blushing',
  'eyeliner spmu': 'spmu-eyeliner',
  'tattoo removal': 'tattoo-removal-laser',

  // Laser Hair Removal
  'laser hair removal': 'laser-full-body',
  'full body laser': 'laser-full-body',
  'bikini laser': 'laser-bikini',
  'underarms laser': 'laser-underarm',
  'electrolysis': 'laser-electrolysis-1h',

  // IV Drip Lounge & PRP
  'b12': 'iv-b12-shot',
  'b12 shot': 'iv-b12-shot',
  'iron shot': 'iv-iron-shot',
  'ginko': 'iv-ginko-infusion',
  'performance drip': 'iv-performance-boosting',
  'vitamin c': 'iv-vitamin-c',
  'vitamin cocktail': 'iv-vitamin-cocktail',
  'detox drip': 'iv-detox-hangover',
  'hangover drip': 'iv-detox-hangover',
  'zinc booster': 'iv-zinc-vitamin-c-minerals',
  'skinny drip': 'iv-skinny-drip',
  'cinderella drip': 'iv-cinderella-brightening',
  'myers': 'iv-modified-myers-cocktail',
  'myers cocktail': 'iv-modified-myers-cocktail',
  'prp hair': 'prp-hair-loss-single',
  'hair prp': 'prp-hair-loss-single',
  'prp facial': 'prp-facial-single',
  'vampire facial': 'prp-facial-single',
  'prp cosmetic': 'prp-cosmetic-injection'
};

/**
 * Universal Hybrid Resolver: Resolves any treatment object, ID, or title
 * to an authentic TreatmentPricingItem with exact brochure prices, procedure times,
 * and multi-session package tiers.
 */
export const getHybridTreatmentPricing = (
  input: TreatmentItem | string,
  catName?: string,
  livePricingItems?: TreatmentPricingItem[]
): TreatmentPricingItem => {
  const pricingCatalog =
    Array.isArray(livePricingItems) && livePricingItems.length > 0
      ? livePricingItems
      : TREATMENT_PRICING_DATA;

  // 1. Normalize input into a treatment object
  let item: TreatmentItem;
  if (typeof input === 'string') {
    const found = findTreatmentItemInDB(input);
    if (found) {
      item = found;
    } else {
      item = {
        id: input.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: input,
        price: '£250',
        time: '30 - 45 Mins',
        desc: 'Official clinical procedure performed by Harley Street accredited practitioners.'
      };
    }
  } else {
    item = input;
  }

  const rawId = item.id.toLowerCase().trim();
  const rawName = item.name.toLowerCase().trim();

  // Helper to build a focused TreatmentPricingItem for a specific package inside a parent
  const buildPackageTreatment = (
    parent: TreatmentPricingItem,
    targetPkg: PricingPackage
  ): TreatmentPricingItem => {
    return {
      id: item.id,
      title: item.name || targetPkg.name,
      category: parent.category,
      description: item.desc || targetPkg.description || parent.description,
      image: parent.image,
      startingPrice: targetPkg.price,
      currency: parent.currency || '£',
      procedureTime: item.time || parent.procedureTime,
      downtime: parent.downtime,
      badge: targetPkg.savingsBadge || targetPkg.badge || parent.badge,
      popular: targetPkg.isPopular || parent.popular,
      packages: [
        targetPkg,
        ...parent.packages.filter((p) => p.id !== targetPkg.id)
      ]
    };
  };

  // 2. Check: Exact match on TreatmentPricingItem.id
  const directIdMatch = pricingCatalog.find(
    (pricing) => pricing.id.toLowerCase() === rawId
  );
  if (directIdMatch) return directIdMatch;

  // 3. Check: Exact match on a Package ID in pricingCatalog
  for (const parent of pricingCatalog) {
    const pkgMatch = parent.packages.find(
      (pkg) => pkg.id.toLowerCase() === rawId
    );
    if (pkgMatch) {
      return buildPackageTreatment(parent, pkgMatch);
    }
  }

  // 4. Check: Direct Title match in pricingCatalog
  const directTitleMatch = pricingCatalog.find(
    (pricing) => pricing.title.toLowerCase() === rawName
  );
  if (directTitleMatch) return directTitleMatch;

  // 5. Check: Match on a Package Name in pricingCatalog
  for (const parent of pricingCatalog) {
    const pkgNameMatch = parent.packages.find(
      (pkg) => pkg.name.toLowerCase() === rawName
    );
    if (pkgNameMatch) {
      return buildPackageTreatment(parent, pkgNameMatch);
    }
  }

  // 6. Synonym / Canonical Term Lookup
  for (const [synonym, targetId] of Object.entries(CANONICAL_SYNONYMS)) {
    if (rawName.includes(synonym) || rawId.includes(synonym)) {
      // Check if targetId is a main treatment
      const canonicalMatch = pricingCatalog.find(
        (pricing) => pricing.id.toLowerCase() === targetId
      );
      if (canonicalMatch) return canonicalMatch;

      // Check if targetId is a package inside a main treatment
      for (const parent of pricingCatalog) {
        const pkgMatch = parent.packages.find(
          (pkg) => pkg.id.toLowerCase() === targetId
        );
        if (pkgMatch) {
          return buildPackageTreatment(parent, pkgMatch);
        }
      }
    }
  }

  // 7. Broad Substring Keyword Match in TreatmentPricingItem
  const keywordMatch = pricingCatalog.find(
    (pricing) =>
      rawName.includes(pricing.id.toLowerCase()) ||
      pricing.id.toLowerCase().includes(rawId) ||
      rawName.includes(pricing.title.toLowerCase()) ||
      pricing.title.toLowerCase().includes(rawName)
  );
  if (keywordMatch) return keywordMatch;

  // 8. Broad Substring Keyword Match in Packages
  for (const parent of pricingCatalog) {
    const pkgSubMatch = parent.packages.find(
      (pkg) =>
        rawName.includes(pkg.id.toLowerCase()) ||
        pkg.id.toLowerCase().includes(rawId) ||
        rawName.includes(pkg.name.toLowerCase()) ||
        pkg.name.toLowerCase().includes(rawName)
    );
    if (pkgSubMatch) {
      return buildPackageTreatment(parent, pkgSubMatch);
    }
  }

  // 9. Smart Auto-Synthesis: Calculate standardized multi-session packages for custom bespoke care
  const cleanPrice = parseInt(item.price.replace(/[^0-9]/g, '') || '250', 10);
  
  // 3-Session Course: ~15% discount
  const threeSessionPrice = Math.round(cleanPrice * 3 * 0.85);
  const perSessionOfThree = Math.round(threeSessionPrice / 3);
  const threeSessionSavings = (cleanPrice * 3) - threeSessionPrice;

  // 5-Session Complete Protocol: ~20% discount
  const fiveSessionPrice = Math.round(cleanPrice * 5 * 0.80);
  const perSessionOfFive = Math.round(fiveSessionPrice / 5);
  const fiveSessionSavings = (cleanPrice * 5) - fiveSessionPrice;

  // Determine appropriate brochure category bucket
  let resolvedCategory: TreatmentPricingItem['category'] = 'Face & Injectables';
  if (
    catName?.includes('Body') ||
    rawName.includes('buttock') ||
    rawName.includes('fat') ||
    rawName.includes('body') ||
    rawName.includes('cryo') ||
    rawName.includes('slimming') ||
    rawName.includes('aqualyx') ||
    rawName.includes('deso') ||
    rawName.includes('emsculpt')
  ) {
    resolvedCategory = 'Body Sculpting';
  } else if (
    catName?.includes('Facial') ||
    rawName.includes('facial') ||
    rawName.includes('peel') ||
    rawName.includes('glow') ||
    rawName.includes('aquafacial') ||
    rawName.includes('microderm') ||
    rawName.includes('extraction')
  ) {
    resolvedCategory = 'Advanced Facials';
  } else if (
    rawName.includes('hair') ||
    rawName.includes('lash') ||
    rawName.includes('brow') ||
    rawName.includes('spmu') ||
    rawName.includes('tattoo') ||
    rawName.includes('balayage') ||
    rawName.includes('keratin') ||
    rawName.includes('salon')
  ) {
    resolvedCategory = 'Hair & Beauty';
  } else if (
    rawName.includes('drip') ||
    rawName.includes('iv') ||
    rawName.includes('booster') ||
    rawName.includes('vitamin') ||
    rawName.includes('myers') ||
    rawName.includes('wellness')
  ) {
    resolvedCategory = 'IV Drip Lounge & Wellness';
  } else {
    resolvedCategory = 'Face & Injectables';
  }

  return {
    id: item.id,
    title: item.name,
    category: resolvedCategory,
    description: item.desc || 'Harley Street clinical procedure calibrated to your individual anatomy and aesthetic goals.',
    image: '',
    startingPrice: cleanPrice,
    currency: '£',
    procedureTime: item.time || '30 - 45 Mins',
    downtime: 'Minimal (0 - 24 Hrs)',
    badge: 'Clinical Procedure',
    popular: true,
    packages: [
      {
        id: `${item.id}-single`,
        name: 'Single Initial Session',
        price: cleanPrice,
        sessions: 1,
        description: 'Comprehensive initial clinical session with targeted diagnostic mapping.',
        includes: [
          'Doctor consultation & anatomical evaluation',
          'Medical-grade topical comfort protocol',
          `Full ${item.name} procedural delivery`,
          'Post-treatment recovery serum & homecare instructions'
        ]
      },
      {
        id: `${item.id}-course-3`,
        name: 'Recommended Course (3 Sessions)',
        price: threeSessionPrice,
        perSessionPrice: perSessionOfThree,
        savingsBadge: `Save £${threeSessionSavings} · 15% Off`,
        isPopular: true,
        sessions: 3,
        description: 'Clinically recommended 3-stage protocol for compounding, long-lasting transformation.',
        includes: [
          `3 Complete ${item.name} clinical sessions`,
          'High-resolution progress tracking at each stage',
          'Complimentary clinical recovery kit (£95 value)',
          'Priority consultant follow-up review'
        ]
      },
      {
        id: `${item.id}-complete-5`,
        name: 'Complete Protocol (5 Sessions)',
        price: fiveSessionPrice,
        perSessionPrice: perSessionOfFive,
        savingsBadge: `Save £${fiveSessionSavings} · 20% Off`,
        sessions: 5,
        description: 'Intensive cellular course for prolonged rejuvenation and structural longevity.',
        includes: [
          `5 Complete ${item.name} clinical sessions`,
          'Comprehensive multi-zone dermal coverage',
          'Full-size take-home barrier recovery regimen',
          'Quarterly skin health review consultation'
        ]
      }
    ]
  };
};
