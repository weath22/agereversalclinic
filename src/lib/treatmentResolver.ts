import { TREATMENT_PRICING_DATA, TreatmentPricingItem, PricingPackage } from '../data/treatmentPricing';
import { TreatmentItem, CLINICAL_AREAS_DB, findTreatmentItemInDB } from '../data/clinicalTreatments';

/**
 * Keyword and synonym map linking colloquial or variant treatment terms to canonical pricing entries
 */
const CANONICAL_SYNONYMS: Record<string, string> = {
  // Injectables & Smoothing
  'botox': 'smoothing',
  'anti-wrinkle': 'smoothing',
  'wrinkles': 'smoothing',
  'frown lines': 'smoothing',
  'crows feet': 'smoothing',
  'neurotoxin': 'smoothing',

  // Bio-Regenerative
  'exosomes': 'exosome',
  'exosome therapy': 'exosome',
  'profhilo hydration': 'profhilo',
  'bio-remodeling': 'profhilo',
  'polynucleotides': 'polynucleotide',
  'salmon dna': 'polynucleotide',
  'tear trough': 'teartrough-darkcircles',
  'dark circles': 'teartrough-darkcircles',

  // Energy & Tightening
  'morpheus': 'morpheus8',
  'rf microneedling': 'morpheus8',
  'radiofrequency microneedling': 'morpheus8',
  'ulthera': 'ultherapy',
  'smas lift': 'ultherapy',
  'facetite rf': 'facetite',
  'radiofrequency tightening': 'facetite',

  // Fillers & Contouring
  'lips': 'lip',
  'lip filler': 'lip',
  'lip enhancement': 'lip',
  'nose filler': 'rhinoplasty',
  'liquid rhinoplasty': 'rhinoplasty',
  'liquid nose job': 'rhinoplasty',
  'jaw': 'jawline-contouring',
  'jawline': 'jawline-contouring',
  'chin': 'chin-enhancement',
  'cheeks': 'cheek-enhancement',

  // Body & Sculpting
  'buttock lift': 'lanluma',
  'hip dip': 'lanluma',
  'hip dips': 'lanluma',
  'fat dissolving': 'aqualyx',
  'desoface': 'aqualyx',
  'desobody': 'aqualyx',

  // Minor Surgery & Scars
  'mole': 'mole-removal',
  'cyst': 'mole-removal',
  'skin tag': 'mole-removal',
  'fractional co2': 'co2-laser',
  'acne scars': 'co2-laser',
  'scar revision': 'co2-laser',

  // Hair & Scalp
  'hair prp': 'prp-hair',
  'hair loss': 'prp-hair',
  'scalp prp': 'prp-hair',
  'hair restoration': 'prp-hair'
};

/**
 * Universal Hybrid Resolver: Resolves any treatment object, ID, or title
 * to an authentic TreatmentPricingItem with multi-session pricing packages.
 */
export const getHybridTreatmentPricing = (
  input: TreatmentItem | string,
  catName?: string
): TreatmentPricingItem => {
  // Normalize input into a treatment object if a string was passed
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
        desc: 'Bespoke clinical treatment customized to individual patient anatomy.'
      };
    }
  } else {
    item = input;
  }

  const rawId = item.id.toLowerCase().trim();
  const rawName = item.name.toLowerCase().trim();

  // 1. Primary Check: Direct ID match in TREATMENT_PRICING_DATA
  const directIdMatch = TREATMENT_PRICING_DATA.find(
    (pricing) => pricing.id.toLowerCase() === rawId
  );
  if (directIdMatch) return directIdMatch;

  // 2. Primary Check: Direct Title match in TREATMENT_PRICING_DATA
  const directTitleMatch = TREATMENT_PRICING_DATA.find(
    (pricing) =>
      pricing.title.toLowerCase() === rawName ||
      rawName === pricing.title.toLowerCase()
  );
  if (directTitleMatch) return directTitleMatch;

  // 3. Synonym / Canonical Term Lookup
  for (const [synonym, targetId] of Object.entries(CANONICAL_SYNONYMS)) {
    if (rawName.includes(synonym) || rawId.includes(synonym)) {
      const canonicalMatch = TREATMENT_PRICING_DATA.find(
        (pricing) => pricing.id.toLowerCase() === targetId
      );
      if (canonicalMatch) return canonicalMatch;
    }
  }

  // 4. Broad Substring Keyword Match
  const keywordMatch = TREATMENT_PRICING_DATA.find(
    (pricing) =>
      rawName.includes(pricing.id.toLowerCase()) ||
      pricing.id.toLowerCase().includes(rawId) ||
      rawName.includes(pricing.title.toLowerCase()) ||
      pricing.title.toLowerCase().includes(rawName)
  );
  if (keywordMatch) return keywordMatch;

  // 5. Smart Auto-Synthesis: Calculate standardized multi-session packages
  const cleanPrice = parseInt(item.price.replace(/[^0-9]/g, '') || '250', 10);
  
  // 3-Session Course: ~15% discount
  const threeSessionPrice = Math.round(cleanPrice * 3 * 0.85);
  const perSessionOfThree = Math.round(threeSessionPrice / 3);
  const threeSessionSavings = (cleanPrice * 3) - threeSessionPrice;

  // 5-Session Complete Protocol: ~20% discount
  const fiveSessionPrice = Math.round(cleanPrice * 5 * 0.80);
  const perSessionOfFive = Math.round(fiveSessionPrice / 5);
  const fiveSessionSavings = (cleanPrice * 5) - fiveSessionPrice;

  // Determine appropriate category bucket
  let resolvedCategory: TreatmentPricingItem['category'] = 'Skin Rejuvenation';
  if (catName?.includes('Filler') || rawName.includes('filler') || rawName.includes('lip')) {
    resolvedCategory = 'Dermal Fillers';
  } else if (catName?.includes('Inject') || rawName.includes('inject') || rawName.includes('wrinkle') || rawName.includes('smoothing')) {
    resolvedCategory = 'Face & Injectables';
  } else if (rawName.includes('exosome') || rawName.includes('dna') || rawName.includes('nucleotide') || rawName.includes('prp')) {
    resolvedCategory = 'Regenerative & Biotech';
  } else if (catName?.includes('Body') || rawName.includes('buttock') || rawName.includes('fat') || rawName.includes('body')) {
    resolvedCategory = 'Body & Sculpting';
  } else if (catName?.includes('Surgery') || rawName.includes('surgery') || rawName.includes('mole') || rawName.includes('scar') || rawName.includes('laser')) {
    resolvedCategory = 'Minor Surgery & Scars';
  }

  return {
    id: item.id,
    title: item.name,
    category: resolvedCategory,
    description: item.desc || 'Clinical treatment calibrated to your unique facial anatomy and aesthetic goals.',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
    startingPrice: cleanPrice,
    currency: '£',
    procedureTime: item.time || '30 - 45 Mins',
    downtime: 'Minimal (0 - 24 Hrs)',
    badge: 'Clinical Treatment',
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
