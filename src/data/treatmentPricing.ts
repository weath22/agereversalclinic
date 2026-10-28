export interface PricingPackage {
  id: string;
  name: string;
  price: number;
  perSessionPrice?: number;
  savingsBadge?: string;
  badge?: string;
  isPopular?: boolean;
  sessions: number;
  description: string;
  includes: string[];
  procedureTime?: string;
  downtime?: string;
}

export type TreatmentCategory =
  | 'Face & Injectables'
  | 'Body Sculpting'
  | 'Advanced Facials'
  | 'Hair & Beauty'
  | 'IV Drip Lounge & Wellness';

export interface TreatmentSubGroup {
  id: string; // e.g., 'anti-wrinkle'
  name: string; // e.g., 'Anti-Wrinkle Injections (Botox)'
}

export interface TreatmentTaxonomyGroup {
  id: string; // e.g., 'face-injectables'
  name: string; // e.g., 'Face & Injectables'
  subGroups: TreatmentSubGroup[];
}

export const DEFAULT_TREATMENT_TAXONOMY: TreatmentTaxonomyGroup[] = [
  {
    id: 'face-injectables',
    name: 'Face & Injectables',
    subGroups: [
      { id: 'anti-wrinkles-injection', name: "Anti-wrinkle's injection" },
      { id: 'dermal-fillers-1ml', name: 'Dermal Fillers-1ml' },
      { id: 'profhilo-2ml', name: 'Profhilo 2ml' },
      { id: 'salmon-sperm-injection', name: 'Salmon sperm injection' },
      { id: 'platelet-rich-plasma-prp', name: 'Platelet-Rich Plasma (PRP)' },
      { id: 'endolift-fiber-lift', name: 'Endolift - Fiber Lift' },
      { id: 'emface-skin-tightening-and-lifting', name: 'Emface skin tightening and lifting' },
    ],
  },
  {
    id: 'body-sculpting',
    name: 'Body Sculpting',
    subGroups: [
      { id: 'aqualyx-course-3', name: 'Aqualyx Course 3' },
      { id: 'deso-face-and-body-course-of-1', name: 'Deso Face and body Course of 1' },
      { id: 'deso-face-and-body-course-of-3', name: 'Deso Face and body Course of 3' },
      { id: 'slimming-pen', name: 'Slimming pen' },
      { id: 'emscuplt-body-sculpt-and-tightening', name: 'Emscuplt body sculpt and tightening' },
      { id: 'body-slimming-fat-loss-cellulite-reduction', name: 'Body slimming for fat and loss Cellulite reduction' },
    ],
  },
  {
    id: 'advanced-facials',
    name: 'Advanced Facials',
    subGroups: [
      { id: 'facial-skin-care', name: 'Facial skin care' },
      { id: 'co2-laser-from', name: 'Co@ Laser from' },
      { id: 'tattoo-removal', name: 'Tattoo removal' },
      { id: 'morpheus8-treatment', name: 'Morpheus8 treatment' },
    ],
  },
  {
    id: 'hair-beauty',
    name: 'Hair & Beauty',
    subGroups: [
      { id: 'lash-eyebrow', name: 'lash & eyebrow' },
      { id: 'body-waxing', name: 'body waxing' },
      { id: 'ladies-girls-cut-collors-treatments', name: 'Ladies & Girls Cut, Collors, Treatments' },
      { id: 'men-and-kids', name: 'Men and Kids' },
      { id: 'men-kids-services', name: 'Men / kids services' },
      { id: 'semi-permanent-makeup', name: 'Semi-permanent makeup' },
    ],
  },
  {
    id: 'iv-drips-wellness',
    name: 'IV Drips & Wellness',
    subGroups: [
      { id: 'iv-drip-lounge-course-of-1', name: 'IV Drip Lounge-course of 1' },
    ],
  },
];

export const LEGACY_BROCHURE_SUBGROUP_IDS = new Set([
  'anti-wrinkle',
  'dermal-fillers',
  'skin-boosters',
  'high-tech-lifting',
  'fat-dissolving',
  'body-contouring',
  'high-tech-body',
  'clinical-medical-facials',
  'weekly-specials',
  'light-oxygen-extractions',
  'beauty-lashes-spmu',
  'hair-salon-trichology',
  'laser-hair-removal',
  'booster-shots',
  'wellness-immunity-drips',
  'premium-infusions',
]);

export function inferTreatmentSubGroup(item: {
  id: string;
  category?: string;
  badge?: string;
  title?: string;
}): { subGroupId: string; subCategory: string; parentCategory: TreatmentCategory } {
  const cat = (item.category || '').toLowerCase();
  const id = (item.id || '').toLowerCase();
  const title = (item.title || '').toLowerCase();
  const badge = (item.badge || '').toLowerCase();
  const combined = `${id} ${title} ${badge}`;

  // Cross-check specific specialist services first regardless of legacy category
  if (combined.includes('prp') || combined.includes('platelet')) {
    return {
      subGroupId: 'platelet-rich-plasma-prp',
      subCategory: 'Platelet-Rich Plasma (PRP)',
      parentCategory: 'Face & Injectables',
    };
  }
  if (combined.includes('co2') || combined.includes('co@')) {
    return {
      subGroupId: 'co2-laser-from',
      subCategory: 'Co@ Laser from',
      parentCategory: 'Advanced Facials',
    };
  }
  if (combined.includes('tattoo')) {
    return {
      subGroupId: 'tattoo-removal',
      subCategory: 'Tattoo removal',
      parentCategory: 'Advanced Facials',
    };
  }
  if (combined.includes('morpheus8') && !combined.includes('body')) {
    return {
      subGroupId: 'morpheus8-treatment',
      subCategory: 'Morpheus8 treatment',
      parentCategory: 'Advanced Facials',
    };
  }

  // 1. Face & Injectables
  if (cat.includes('face') || cat.includes('inject')) {
    if (
      combined.includes('botox') ||
      combined.includes('wrinkle') ||
      id.startsWith('botox-') ||
      combined.includes('smile') ||
      combined.includes('puppet') ||
      combined.includes('neck bands') ||
      combined.includes('jaw slimming') ||
      combined.includes('chin dimpling')
    ) {
      return {
        subGroupId: 'anti-wrinkles-injection',
        subCategory: "Anti-wrinkle's injection",
        parentCategory: 'Face & Injectables',
      };
    }
    if (
      combined.includes('filler') ||
      id.startsWith('filler-') ||
      combined.includes('lip') ||
      combined.includes('cheek') ||
      combined.includes('rhinoplasty') ||
      combined.includes('tear trough') ||
      combined.includes('temples') ||
      combined.includes('jaw & chin') ||
      combined.includes('hand rejuvenation') ||
      combined.includes('cleavage')
    ) {
      return {
        subGroupId: 'dermal-fillers-1ml',
        subCategory: 'Dermal Fillers-1ml',
        parentCategory: 'Face & Injectables',
      };
    }
    if (combined.includes('profhilo')) {
      return {
        subGroupId: 'profhilo-2ml',
        subCategory: 'Profhilo 2ml',
        parentCategory: 'Face & Injectables',
      };
    }
    if (combined.includes('salmon') || combined.includes('polynucleotide') || combined.includes('pdrn')) {
      return {
        subGroupId: 'salmon-sperm-injection',
        subCategory: 'Salmon sperm injection',
        parentCategory: 'Face & Injectables',
      };
    }
    if (combined.includes('endolift') || combined.includes('fiber lift')) {
      return {
        subGroupId: 'endolift-fiber-lift',
        subCategory: 'Endolift - Fiber Lift',
        parentCategory: 'Face & Injectables',
      };
    }
    if (combined.includes('emface')) {
      return {
        subGroupId: 'emface-skin-tightening-and-lifting',
        subCategory: 'Emface skin tightening and lifting',
        parentCategory: 'Face & Injectables',
      };
    }
    return {
      subGroupId: 'anti-wrinkles-injection',
      subCategory: "Anti-wrinkle's injection",
      parentCategory: 'Face & Injectables',
    };
  }

  // 2. Body Sculpting
  if (cat.includes('body')) {
    if (combined.includes('aqualyx') || id.startsWith('aqualyx-')) {
      return {
        subGroupId: 'aqualyx-course-3',
        subCategory: 'Aqualyx Course 3',
        parentCategory: 'Body Sculpting',
      };
    }
    if (combined.includes('deso') || id.startsWith('deso-')) {
      if (combined.includes('course-3') || combined.includes('course of 3')) {
        return {
          subGroupId: 'deso-face-and-body-course-of-3',
          subCategory: 'Deso Face and body Course of 3',
          parentCategory: 'Body Sculpting',
        };
      }
      return {
        subGroupId: 'deso-face-and-body-course-of-1',
        subCategory: 'Deso Face and body Course of 1',
        parentCategory: 'Body Sculpting',
      };
    }
    if (combined.includes('slimming-pen') || combined.includes('slimming pen')) {
      return {
        subGroupId: 'slimming-pen',
        subCategory: 'Slimming pen',
        parentCategory: 'Body Sculpting',
      };
    }
    if (combined.includes('emsculpt') || combined.includes('emscuplt') || combined.includes('morpheus8-body')) {
      return {
        subGroupId: 'emscuplt-body-sculpt-and-tightening',
        subCategory: 'Emscuplt body sculpt and tightening',
        parentCategory: 'Body Sculpting',
      };
    }
    return {
      subGroupId: 'body-slimming-fat-loss-cellulite-reduction',
      subCategory: 'Body slimming for fat and loss Cellulite reduction',
      parentCategory: 'Body Sculpting',
    };
  }

  // 3. Advanced Facials
  if (cat.includes('facial') || cat.includes('advanced')) {
    return {
      subGroupId: 'facial-skin-care',
      subCategory: 'Facial skin care',
      parentCategory: 'Advanced Facials',
    };
  }

  // 4. Hair & Beauty
  if (cat.includes('hair') || cat.includes('beauty')) {
    if (combined.includes('lash') || combined.includes('eyebrow') || combined.includes('brow')) {
      if (
        combined.includes('spmu') ||
        combined.includes('microblading') ||
        combined.includes('micro-pigmentation') ||
        combined.includes('ombre') ||
        combined.includes('ombré') ||
        combined.includes('powder brow')
      ) {
        return {
          subGroupId: 'semi-permanent-makeup',
          subCategory: 'Semi-permanent makeup',
          parentCategory: 'Hair & Beauty',
        };
      }
      return {
        subGroupId: 'lash-eyebrow',
        subCategory: 'lash & eyebrow',
        parentCategory: 'Hair & Beauty',
      };
    }
    if (
      combined.includes('spmu') ||
      combined.includes('semi-permanent') ||
      combined.includes('lip blushing') ||
      combined.includes('eyeliner') ||
      combined.includes('party makeup')
    ) {
      return {
        subGroupId: 'semi-permanent-makeup',
        subCategory: 'Semi-permanent makeup',
        parentCategory: 'Hair & Beauty',
      };
    }
    if (combined.includes('wax') || combined.includes('laser-') || combined.includes('electrolysis') || combined.includes('soprano')) {
      return {
        subGroupId: 'body-waxing',
        subCategory: 'body waxing',
        parentCategory: 'Hair & Beauty',
      };
    }
    if (combined.includes('men') || combined.includes('kid')) {
      if (id === 'men-and-kids') {
        return {
          subGroupId: 'men-and-kids',
          subCategory: 'Men and Kids',
          parentCategory: 'Hair & Beauty',
        };
      }
      return {
        subGroupId: 'men-kids-services',
        subCategory: 'Men / kids services',
        parentCategory: 'Hair & Beauty',
      };
    }
    return {
      subGroupId: 'ladies-girls-cut-collors-treatments',
      subCategory: 'Ladies & Girls Cut, Collors, Treatments',
      parentCategory: 'Hair & Beauty',
    };
  }

  // 5. IV Drips & Wellness
  if (cat.includes('iv') || cat.includes('wellness') || cat.includes('drip')) {
    return {
      subGroupId: 'iv-drip-lounge-course-of-1',
      subCategory: 'IV Drip Lounge-course of 1',
      parentCategory: 'IV Drip Lounge & Wellness',
    };
  }

  return {
    subGroupId: 'anti-wrinkles-injection',
    subCategory: "Anti-wrinkle's injection",
    parentCategory: 'Face & Injectables',
  };
}

import { TreatmentMediaItem } from '../types';
export { getTreatmentImagePath, getTreatmentCardImage, handleTreatmentImageError } from '../utils/treatmentImageHelper';

export interface TreatmentPricingItem {
  id: string;
  title: string;
  category: TreatmentCategory;
  subCategory?: string;
  subGroupId?: string;
  description: string;
  image: string;
  startingPrice: number;
  currency: string;
  procedureTime: string;
  downtime: string;
  badge?: string;
  popular?: boolean;
  hidden?: boolean;
  isActive?: boolean;
  updatedAt?: number | string;
  packages: PricingPackage[];
  coverMedia?: TreatmentMediaItem;
  galleryImages?: string[];
  seoKeywords?: string[];
}

/**
 * Lightweight Card Summary Type (Column Projection)
 * Contains ONLY essential card fields needed to render PricingCard.
 * Strips out heavy fields: packages, procedureTime, downtime, galleryImages, seoKeywords.
 */
export interface TreatmentPricingCardSummary {
  id: string;
  title: string;
  category: TreatmentCategory;
  subCategory?: string;
  subGroupId?: string;
  description: string;
  image: string;
  startingPrice: number;
  currency: string;
  badge?: string;
  popular?: boolean;
  hidden?: boolean;
  isActive?: boolean;
  updatedAt?: number | string;
  coverMedia?: {
    url?: string;
    altText?: string;
    seoTitle?: string;
  };
}

/**
 * Exact column list for database/Supabase select queries (avoids wildcard '*' fetch)
 */
export const TREATMENT_CARD_SUMMARY_COLUMNS =
  'id, title, category, subCategory, subGroupId, description, image, startingPrice, currency, badge, popular, hidden, isActive, updatedAt, coverMedia';

const CORE_DEFAULT_BRANCH_NAMES = new Set([
  'face & injectables',
  'body sculpting',
  'advanced facials',
  'hair & beauty',
  'iv drip lounge & wellness',
  'iv drips & wellness',
]);

/**
 * Projects a full TreatmentPricingItem down to TreatmentPricingCardSummary,
 * stripping out packages, procedureTime, downtime, galleryImages, and seoKeywords.
 */
export function projectTreatmentCardSummary(
  item: TreatmentPricingItem | Record<string, any>
): TreatmentPricingCardSummary {
  const rawImage = typeof item.image === 'string' ? item.image.trim() : '';
  const cleanImage =
    rawImage.includes('images.unsplash.com') || rawImage.includes('unsplash.com')
      ? ''
      : rawImage;

  const hasLegacySubGroup = Boolean(item.subGroupId && LEGACY_BROCHURE_SUBGROUP_IDS.has(item.subGroupId));
  const needsInferred = !item.subGroupId || !item.subCategory || hasLegacySubGroup;
  const inferred = needsInferred ? inferTreatmentSubGroup(item as any) : null;

  const rawCategory = typeof item.category === 'string' ? item.category.trim() : '';
  const isCustomBranch = Boolean(rawCategory && !CORE_DEFAULT_BRANCH_NAMES.has(rawCategory.toLowerCase()));

  const resolvedCategory = isCustomBranch
    ? rawCategory
    : (inferred?.parentCategory || rawCategory || 'Face & Injectables');

  const projected: TreatmentPricingCardSummary = {
    id: item.id,
    title: item.title,
    category: resolvedCategory as TreatmentCategory,
    subCategory: (hasLegacySubGroup ? inferred?.subCategory : item.subCategory) || inferred?.subCategory,
    subGroupId: (hasLegacySubGroup ? inferred?.subGroupId : item.subGroupId) || inferred?.subGroupId,
    description: item.description,
    image: cleanImage,
    startingPrice: item.startingPrice,
    currency: item.currency || '£',
  };

  if (item.badge !== undefined) projected.badge = item.badge;
  if (item.popular !== undefined) projected.popular = item.popular;
  if (item.hidden !== undefined) projected.hidden = item.hidden;
  if (item.isActive !== undefined) projected.isActive = item.isActive;
  if (item.updatedAt !== undefined) projected.updatedAt = item.updatedAt;

  if (item.coverMedia) {
    const rawCoverUrl = typeof item.coverMedia.url === 'string' ? item.coverMedia.url.trim() : '';
    const cleanCoverUrl =
      rawCoverUrl.includes('images.unsplash.com') || rawCoverUrl.includes('unsplash.com')
        ? undefined
        : rawCoverUrl;
    projected.coverMedia = {
      url: cleanCoverUrl,
      altText: item.coverMedia.altText,
      seoTitle: item.coverMedia.seoTitle,
    };
  }

  return projected;
}

export const PRICING_CATEGORIES = [
  'All Procedures',
  'Face & Injectables',
  'Body Sculpting',
  'Advanced Facials',
  'Hair & Beauty',
  'IV Drip Lounge & Wellness'
] as const;

export const TREATMENT_PRICING_CATEGORIES = PRICING_CATEGORIES;

export type PricingCategory = typeof PRICING_CATEGORIES[number];

export type TreatmentSortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export interface TreatmentPricingQueryParams {
  page?: number;
  offset?: number;
  limit?: number;
  category?: string;
  subOptions?: string[];
  search?: string;
  sort?: TreatmentSortOption;
  fields?: 'card' | 'full';
  taxonomy?: TreatmentTaxonomyGroup[];
}

export interface PaginatedTreatmentCardsResponse {
  items: TreatmentPricingCardSummary[];
  totalCount: number;
  hasMore: boolean;
  page: number;
  offset: number;
  limit: number;
}

export interface TreatmentPackageDetails {
  id: string;
  packages: PricingPackage[];
  procedureTime: string;
  downtime: string;
}

export interface TreatmentSubOptionConfig {
  id: string;
  label: string;
  filter: (item: { id: string }) => boolean;
}

export const TREATMENT_CATEGORY_SUB_OPTIONS: Record<string, TreatmentSubOptionConfig[]> = Object.fromEntries(
  DEFAULT_TREATMENT_TAXONOMY.map((branch) => [
    branch.name,
    branch.subGroups.map((sub) => ({
      id: sub.id,
      label: sub.name,
      filter: (item: { id: string; subGroupId?: string; subCategory?: string }) =>
        item.subGroupId === sub.id ||
        (item.subCategory || '').toLowerCase() === sub.name.toLowerCase(),
    })),
  ])
);

function isIvWellnessCategory(val: string): boolean {
  const lower = (val || '').toLowerCase().trim();
  return (
    lower === 'iv drips & wellness' ||
    lower === 'iv drip lounge & wellness' ||
    lower === 'iv-drips-wellness' ||
    lower === 'iv-wellness'
  );
}

export function doesTreatmentMatchBranch(
  item: TreatmentPricingCardSummary,
  selectedCategory: string,
  taxonomy: TreatmentTaxonomyGroup[] = DEFAULT_TREATMENT_TAXONOMY
): boolean {
  if (!selectedCategory || selectedCategory === 'All Procedures') return true;

  const targetLower = selectedCategory.toLowerCase().trim();
  const itemCatLower = (item.category || '').toLowerCase().trim();

  if (itemCatLower === targetLower) return true;
  if (isIvWellnessCategory(targetLower) && isIvWellnessCategory(itemCatLower)) return true;

  const matchedBranch = taxonomy.find(
    (b) =>
      b.name.toLowerCase().trim() === targetLower ||
      b.id.toLowerCase().trim() === targetLower ||
      (isIvWellnessCategory(targetLower) && isIvWellnessCategory(b.id))
  );

  if (matchedBranch) {
    const branchNameLower = matchedBranch.name.toLowerCase().trim();
    const branchIdLower = matchedBranch.id.toLowerCase().trim();
    if (itemCatLower === branchNameLower || itemCatLower === branchIdLower) return true;
    if (isIvWellnessCategory(branchIdLower) && isIvWellnessCategory(itemCatLower)) return true;

    // Also match if the item's subGroupId or subCategory belongs to this branch in the dynamic taxonomy
    if (
      matchedBranch.subGroups.some(
        (sub) =>
          (item.subGroupId && sub.id.toLowerCase() === item.subGroupId.toLowerCase()) ||
          (item.subCategory && sub.name.toLowerCase() === item.subCategory.toLowerCase())
      )
    ) {
      return true;
    }
  }

  return false;
}

export function doesTreatmentMatchSubOptions(
  item: TreatmentPricingCardSummary,
  subOptions: string[],
  selectedCategory: string,
  taxonomy: TreatmentTaxonomyGroup[] = DEFAULT_TREATMENT_TAXONOMY
): boolean {
  if (!subOptions || subOptions.length === 0) return true;

  const itemSubIdLower = (item.subGroupId || '').toLowerCase().trim();
  const itemSubCatLower = (item.subCategory || '').toLowerCase().trim();

  for (const rawOpt of subOptions) {
    const optLower = (rawOpt || '').toLowerCase().trim();
    if (!optLower) continue;

    // 1. Direct match on dynamic subGroupId or subCategory name
    if (itemSubIdLower === optLower || itemSubCatLower === optLower) {
      return true;
    }

    // 2. Match via active taxonomy sub-group definition (handles renamed sub-groups seamlessly)
    for (const branch of taxonomy) {
      const matchedSub = (branch.subGroups || []).find(
        (s) => s.id.toLowerCase().trim() === optLower || s.name.toLowerCase().trim() === optLower
      );
      if (matchedSub) {
        if (
          itemSubIdLower === matchedSub.id.toLowerCase().trim() ||
          itemSubCatLower === matchedSub.name.toLowerCase().trim()
        ) {
          return true;
        }
      }
    }

    // 3. Fallback for any legacy filter functions if present
    const catOptions = TREATMENT_CATEGORY_SUB_OPTIONS[selectedCategory];
    const legacyOpt = catOptions?.find((o) => o.id.toLowerCase() === optLower);
    if (legacyOpt && legacyOpt.filter(item)) {
      return true;
    }
  }

  return false;
}

/**
 * Shared filter, sort, and column-projection engine for treatment card queries.
 */
export function filterAndSortTreatmentCards(
  rawList: Array<TreatmentPricingItem | TreatmentPricingCardSummary | Record<string, any>>,
  params: TreatmentPricingQueryParams = {}
): PaginatedTreatmentCardsResponse {
  const {
    category = 'All Procedures',
    subOptions = [],
    search = '',
    sort = 'featured',
    taxonomy = DEFAULT_TREATMENT_TAXONOMY,
  } = params;

  const limit = typeof params.limit === 'number' && params.limit > 0 ? params.limit : 10;
  const page = typeof params.page === 'number' && params.page > 0 ? params.page : 1;
  const offset =
    typeof params.offset === 'number' && params.offset >= 0
      ? params.offset
      : (page - 1) * limit;

  // 1. Project only essential card columns (strips packages, procedureTime, downtime, galleryImages, seoKeywords)
  let projected = rawList
    .filter((item) => !item.hidden && item.isActive !== false)
    .map(projectTreatmentCardSummary);

  // 2. Dynamic Taxonomy Category & Sub-Groups Filter
  if (category && category !== 'All Procedures') {
    projected = projected.filter((item) => doesTreatmentMatchBranch(item, category, taxonomy));

    if (subOptions.length > 0) {
      projected = projected.filter((item) =>
        doesTreatmentMatchSubOptions(item, subOptions, category, taxonomy)
      );
    }
  } else if (subOptions.length > 0) {
    projected = projected.filter((item) =>
      doesTreatmentMatchSubOptions(item, subOptions, category, taxonomy)
    );
  }

  // 3. Search filter on essential card columns (including dynamic subCategory)
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    projected = projected.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q)
    );
  }

  // 4. Sort
  switch (sort) {
    case 'price-asc':
      projected.sort((a, b) => a.startingPrice - b.startingPrice);
      break;
    case 'price-desc':
      projected.sort((a, b) => b.startingPrice - a.startingPrice);
      break;
    case 'name-asc':
      projected.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'featured':
    default:
      projected.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
      break;
  }

  const totalCount = projected.length;
  const paginatedItems = projected.slice(offset, offset + limit);
  const hasMore = offset + paginatedItems.length < totalCount;

  return {
    items: paginatedItems,
    totalCount,
    hasMore,
    page: Math.floor(offset / limit) + 1,
    offset,
    limit,
  };
}

/**
 * STANDALONE TREATMENT & PRICING DATABASE (Option B)
 * Every single sub-treatment from the official clinic brochure has its own dedicated card box.
 */
export const TREATMENT_PRICING_DATA: TreatmentPricingItem[] = [
  // =========================================================================
  // 1. FACE & INJECTABLES (Anti-Wrinkle, Dermal Fillers, Boosters, Lifting)
  // =========================================================================

  // --- Anti-Wrinkle Injections (Individual Standalone Cards) ---
  {
    id: 'botox-bunny-lines',
    title: 'Bunny Lines Anti-Wrinkle',
    category: 'Face & Injectables',
    description: 'Precision neurotoxin injection relaxing the nasalis muscle to smooth horizontal and diagonal wrinkles across the bridge of the nose when smiling or squinting.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 160,
    currency: '£',
    procedureTime: '20 Mins',
    downtime: 'None / 2 Hours',
    badge: 'Anti-Wrinkle',
    packages: [
      {
        id: 'botox-bunny-lines-pkg',
        name: 'Bunny Lines Treatment',
        price: 160,
        sessions: 1,
        description: 'Targeted nasalis muscle dosing with complimentary 2-week physician dosage review.',
        includes: ['Targeted nasalis muscle dosing', 'Pre-treatment medical mapping', 'Complimentary 2-week dosage review']
      }
    ]
  },
  {
    id: 'botox-crows-feet',
    title: "Crow's Feet Anti-Wrinkle",
    category: 'Face & Injectables',
    description: 'Micro-droplet botulinum injections targeting the lateral orbicularis oculi to soften smiling laugh lines around the outer eye corners while preserving sparkling eye animation.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    startingPrice: 160,
    currency: '£',
    procedureTime: '20 Mins',
    downtime: 'None / 2 Hours',
    badge: 'Popular',
    popular: true,
    packages: [
      {
        id: 'botox-crows-feet-pkg',
        name: "Crow's Feet Treatment",
        price: 160,
        sessions: 1,
        description: 'Bilateral lateral periorbital micro-injections around outer eye corners.',
        includes: ['Precision micro-injection around outer eye', 'Pre-treatment diagnostic assessment', '2-week physician check']
      }
    ]
  },
  {
    id: 'botox-gummy-smile',
    title: 'Gummy Smile Reduction',
    category: 'Face & Injectables',
    description: 'Calibrated neurotoxin relaxation of hyperactive LLSAN upper lip levator muscles, restoring natural balance so gums remain covered during spontaneous smiling.',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
    startingPrice: 160,
    currency: '£',
    procedureTime: '15 Mins',
    downtime: 'None',
    badge: 'Smile Rejuvenation',
    packages: [
      {
        id: 'botox-gummy-smile-pkg',
        name: 'Gummy Smile Treatment',
        price: 160,
        sessions: 1,
        description: 'Targeted LLSAN muscle relaxation for a harmonious smile ratio.',
        includes: ['Targeted LLSAN muscle relaxation', 'Doctor assessment', 'Complimentary 2-week review']
      }
    ]
  },
  {
    id: 'botox-lip-flip',
    title: 'Lip Flip (Botox)',
    category: 'Face & Injectables',
    description: 'Subtle relaxation of the superficial orbicularis oris muscle along the vermilion border, gently rolling the top lip upward to create fuller presence without filler volume.',
    image: 'https://images.unsplash.com/photo-1588515724527-074a7a56616c?auto=format&fit=crop&w=800&q=80',
    startingPrice: 160,
    currency: '£',
    procedureTime: '15 Mins',
    downtime: 'None',
    badge: 'No Filler',
    popular: true,
    packages: [
      {
        id: 'botox-lip-flip-pkg',
        name: 'Lip Flip Procedure',
        price: 160,
        sessions: 1,
        description: 'Orbicularis oris muscle relaxation for natural vermilion border eversion.',
        includes: ['Orbicularis oris micro-injections', 'Natural border eversion', 'Physician review']
      }
    ]
  },
  {
    id: 'botox-puppet-lines',
    title: 'Puppet Lines (DAO Muscle)',
    category: 'Face & Injectables',
    description: 'Targeted relaxation of the depressor anguli oris (DAO) muscle to lift downward-pulling mouth corners, eradicating resting melancholic or downturned expressions.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    startingPrice: 160,
    currency: '£',
    procedureTime: '20 Mins',
    downtime: 'None',
    badge: 'Lower Face Lift',
    packages: [
      {
        id: 'botox-puppet-lines-pkg',
        name: 'Puppet Lines Treatment',
        price: 160,
        sessions: 1,
        description: 'DAO muscle precision injection to elevate rested oral commissures.',
        includes: ['DAO muscle precision injection', 'Facial architecture alignment', '2-week check']
      }
    ]
  },
  {
    id: 'botox-1-area',
    title: 'Anti-Wrinkle: 1 Area Full Treatment',
    category: 'Face & Injectables',
    description: 'Full clinical dose targeting one major dynamic upper facial zone (Frown Glabella, Horizontal Forehead, or Bilateral Crow’s Feet) for smooth, rested skin.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 180,
    currency: '£',
    procedureTime: '20 Mins',
    downtime: 'None / 2 Hours',
    badge: '1 Zone',
    packages: [
      {
        id: 'botox-1-area-pkg',
        name: '1 Area Full Treatment',
        price: 180,
        sessions: 1,
        description: 'Full dose targeting Frown, Forehead, or Crow’s Feet.',
        includes: ['Full diagnostic consultation', 'Medical-grade botulinum protocol', 'Complimentary 2-week top-up']
      }
    ]
  },
  {
    id: 'botox-chin-dimpling',
    title: 'Chin Dimpling (Pebble / Orange Peel Chin)',
    category: 'Face & Injectables',
    description: 'Relaxes hyperactive mentalis muscle fibers to smooth golf-ball dimpling, crease tethering, and lower chin strain during speech and expression.',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    startingPrice: 180,
    currency: '£',
    procedureTime: '20 Mins',
    downtime: 'None',
    badge: 'Mentalis Smoothing',
    packages: [
      {
        id: 'botox-chin-dimpling-pkg',
        name: 'Chin Dimpling Treatment',
        price: 180,
        sessions: 1,
        description: 'Mentalis muscle relaxation to eradicate pebble chin texture.',
        includes: ['Mentalis muscle smoothing', 'Pre-treatment mapping', '2-week review']
      }
    ]
  },
  {
    id: 'botox-frown-lines',
    title: 'Frown Lines (Glabella "11" Lines)',
    category: 'Face & Injectables',
    description: 'Direct dosing of the corrugator and procerus complex between the eyebrows to erase deep vertical furrow creases and relieve habitual brow tension.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    startingPrice: 180,
    currency: '£',
    procedureTime: '20 Mins',
    downtime: 'None',
    badge: 'Glabella',
    packages: [
      {
        id: 'botox-frown-lines-pkg',
        name: 'Frown Lines Treatment',
        price: 180,
        sessions: 1,
        description: 'Glabellar complex targeting (Procerus & Corrugators).',
        includes: ['Glabellar complex targeting', 'Dose titration', 'Complimentary 2-week check']
      }
    ]
  },
  {
    id: 'botox-forehead',
    title: 'Forehead Lines Anti-Wrinkle',
    category: 'Face & Injectables',
    description: 'Expert frontalis muscle dosing that irons out horizontal expression ripples while balancing brow height to prevent heaviness or dropping.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 230,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: 'None / 2 Hours',
    badge: 'Frontalis Smoothing',
    packages: [
      {
        id: 'botox-forehead-pkg',
        name: 'Forehead Lines Treatment',
        price: 230,
        sessions: 1,
        description: 'Frontalis tailored dosage preserving open, natural brow elevation.',
        includes: ['Frontalis muscle tailored dosage', 'Balanced brow support', '2-week review']
      }
    ]
  },
  {
    id: 'botox-2-areas',
    title: 'Anti-Wrinkle: 2 Areas Treatment',
    category: 'Face & Injectables',
    description: 'Simultaneous treatment of two complementary zones (e.g. Frown + Forehead or Frown + Crow’s Feet) for cohesive upper facial rejuvenation.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 250,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: 'None / 2 Hours',
    badge: 'Save £110 vs Single',
    popular: true,
    packages: [
      {
        id: 'botox-2-areas-pkg',
        name: '2 Areas (Frown + Forehead or Eyes)',
        price: 250,
        sessions: 1,
        savingsBadge: 'Save £110 vs Single',
        description: 'Dual upper-face area synergy for smooth forehead, glabella, or eye contouring.',
        includes: ['Dual area mapping & treatment', 'Complimentary 2-week follow-up and top-up']
      }
    ]
  },
  {
    id: 'botox-3-areas',
    title: 'Anti-Wrinkle: 3 Areas (Complete Upper Face)',
    category: 'Face & Injectables',
    description: 'The definitive gold-standard upper-face anti-ageing protocol smoothing Forehead, Glabella Frown Lines, and Crow’s Feet in one seamless appointment.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    startingPrice: 280,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: 'None / 2 Hours',
    badge: 'Most Popular',
    popular: true,
    packages: [
      {
        id: 'botox-3-areas-pkg',
        name: '3 Areas (Complete Upper Face)',
        price: 280,
        isPopular: true,
        sessions: 1,
        savingsBadge: 'Most Popular · Complete Rejuvenation',
        description: 'Comprehensive upper facial anti-ageing across Forehead, Frown lines, and Crow’s Feet.',
        includes: ['Full upper-face medical mapping', '3 targeted zones', 'Complimentary 2-week review and refinement']
      }
    ]
  },
  {
    id: 'botox-neck-bands',
    title: 'Neck Bands (Nefertiti Lift)',
    category: 'Face & Injectables',
    description: 'Relaxes downward-pulling platysmal bands along the anterior neck and mandibular border, sharpening jawline definition and smoothing horizontal neck rings.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    startingPrice: 290,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: 'None',
    badge: 'Jawline Definition',
    packages: [
      {
        id: 'botox-neck-bands-pkg',
        name: 'Neck Bands (Nefertiti Lift)',
        price: 290,
        sessions: 1,
        description: 'Platysmal band relaxation to sharpen lower jawline and smooth neck contouring.',
        includes: ['Platysmal band mapping', 'Jawline contour elevation', '2-week review']
      }
    ]
  },
  {
    id: 'botox-jaw-slimming',
    title: 'Jaw Slimming (Masseter Reduction / Bruxism)',
    category: 'Face & Injectables',
    description: 'High-dose neurotoxin targeting hypertrophic masseter chewing muscles to slim a square lower face into a refined V-shape while relieving teeth grinding.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 320,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: 'None',
    badge: 'Facial Slimming',
    popular: true,
    packages: [
      {
        id: 'botox-jaw-slimming-pkg',
        name: 'Jaw Slimming (Masseter)',
        price: 320,
        sessions: 1,
        description: 'Bilateral masseter dose titration for contour slimming and bruxism relief.',
        includes: ['Bilateral masseter dose titration', 'Facial slimming mapping', 'Bruxism relief review']
      }
    ]
  },
  {
    id: 'botox-extended-neck-bands',
    title: 'Extended Neck Bands Therapy',
    category: 'Face & Injectables',
    description: 'Comprehensive multi-vector platysmal therapy across the anterior, lateral, and lower neck borders to smooth intense vertical cords and crepey bands.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    startingPrice: 370,
    currency: '£',
    procedureTime: '35 Mins',
    downtime: 'None',
    badge: 'Extended Protocol',
    packages: [
      {
        id: 'botox-extended-neck-bands-pkg',
        name: 'Extended Neck Bands',
        price: 370,
        sessions: 1,
        description: 'Full platysma relaxation across upper, mid, and lower neck zones.',
        includes: ['Full platysma relaxation', 'Nefertiti neck smoothing', 'Extended follow-up']
      }
    ]
  },

  // --- Dermal Fillers 1ml (Individual Standalone Cards) ---
  {
    id: 'filler-cheeks-soft',
    title: 'Cheek - Soft Tissue Volumisation (1ml)',
    category: 'Face & Injectables',
    description: 'Subtle mid-face volume restoration using cross-linked hyaluronic acid to lift tired apple cheeks and gently soften deep nasolabial folds.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    startingPrice: 290,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: '24 - 48 Hours',
    badge: '1ml Premium HA',
    packages: [
      {
        id: 'filler-cheeks-soft-pkg',
        name: 'Cheek - Soft Volumisation (1ml)',
        price: 290,
        sessions: 1,
        description: '1ml High G-prime HA placed via micro-cannula technique for smooth midface lift.',
        includes: ['1ml High G-prime HA', 'Micro-cannula / needle technique', 'Post-procedure review']
      }
    ]
  },
  {
    id: 'filler-cleavage-lines',
    title: 'Cleavage Lines (Décolletage) Filler (1ml)',
    category: 'Face & Injectables',
    description: 'Smooths vertical sleep, side-sleeping, and sun-damage creases across the central chest and cleavage using delicate skin-smoothing hyaluronic micro-papules.',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    startingPrice: 290,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: '24 - 48 Hours',
    badge: 'Décolletage',
    packages: [
      {
        id: 'filler-cleavage-lines-pkg',
        name: 'Cleavage Lines (1ml)',
        price: 290,
        sessions: 1,
        description: '1ml skin-smoothing HA applied to décolletage creases.',
        includes: ['1ml Skin-smoothing HA', 'Micro-papular smoothing protocol', 'Arnica soothing cream']
      }
    ]
  },
  {
    id: 'filler-lips',
    title: 'Lip Enhancement (1ml Premium Filler)',
    category: 'Face & Injectables',
    description: 'Bespoke architectural lip shaping emphasizing vermilion border crispness, Cupid’s bow contouring, pillowy volume, and profound deep moisture.',
    image: 'https://images.unsplash.com/photo-1588515724527-074a7a56616c?auto=format&fit=crop&w=800&q=80',
    startingPrice: 290,
    currency: '£',
    procedureTime: '30 - 45 Mins',
    downtime: '24 - 48 Hours',
    badge: 'Best Seller',
    popular: true,
    packages: [
      {
        id: 'filler-lips-pkg',
        name: 'Lip Enhancement (1ml)',
        price: 290,
        isPopular: true,
        sessions: 1,
        description: '1ml premium cross-linked HA tailored to personal lip aesthetic preferences.',
        includes: ['1ml Premium cross-linked HA', 'Topical medical numbing', 'Arnica soothing balm', 'Post-care review']
      }
    ]
  },
  {
    id: 'filler-rhinoplasty',
    title: 'Non-Surgical Rhinoplasty (Liquid Nose Job)',
    category: 'Face & Injectables',
    description: 'Strategic micro-droplet placement of ultra-dense cohesive filler to camouflage dorsal humps, lift drooping tips, and straighten the nasal bridge profile without surgery.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 290,
    currency: '£',
    procedureTime: '30 - 45 Mins',
    downtime: '24 Hours',
    badge: 'No Surgery',
    popular: true,
    packages: [
      {
        id: 'filler-rhinoplasty-pkg',
        name: 'Non-Surgical Rhinoplasty (min £290)',
        price: 290,
        sessions: 1,
        description: 'Precision bridge elevation, hump disguise, and tip lifting using high-G prime filler.',
        includes: ['High-density structural HA', 'Micro-droplet safety technique', '2-week physician refinement']
      }
    ]
  },
  {
    id: 'filler-nose-to-mouth',
    title: 'Nose to Mouth Lines (Nasolabial Folds 1ml)',
    category: 'Face & Injectables',
    description: 'Softens deep smile creases running from the nostril corners down to mouth borders, restoring a rested, youthful midface profile.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    startingPrice: 290,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: '24 Hours',
    badge: 'Smile Folds',
    packages: [
      {
        id: 'filler-nose-to-mouth-pkg',
        name: 'Nose to Mouth Lines (1ml)',
        price: 290,
        sessions: 1,
        description: '1ml Structural filler placed with micro-cannula to soften deep smile lines.',
        includes: ['1ml Structural filler', 'Precision placement', 'Topical anaesthetic', 'Follow-up']
      }
    ]
  },
  {
    id: 'filler-tear-trough',
    title: 'Tear Trough & Under-Eye Hollows (1ml)',
    category: 'Face & Injectables',
    description: 'Brightens tired dark circles and fills hollow sunken under-eye troughs using ultra-gentle low-hydrophilic hyaluronic acid via blunt cannula safety protocol.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    startingPrice: 290,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: '24 Hours',
    badge: 'Bright Eyes',
    popular: true,
    packages: [
      {
        id: 'filler-tear-trough-pkg',
        name: 'Tear Trough Treatment (1ml)',
        price: 290,
        sessions: 1,
        description: 'Specialised low-swelling under-eye formulation placed via micro-cannula.',
        includes: ['1ml Under-eye formulation', 'Blunt cannula safety protocol', 'Doctor review']
      }
    ]
  },
  {
    id: 'filler-temples',
    title: 'Temples Volume Restoration (1ml)',
    category: 'Face & Injectables',
    description: 'Rebuilds hollowed, skeletal temporal depressions to restore a soft, youthful oval-heart facial contour and support lateral brow elevation.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 290,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: '24 Hours',
    badge: 'Upper Face Lift',
    packages: [
      {
        id: 'filler-temples-pkg',
        name: 'Temples Rejuvenation (1ml)',
        price: 290,
        sessions: 1,
        description: 'Deep periosteal HA placement to restore smooth temporal harmony.',
        includes: ['1ml Deep periosteal HA', 'Facial architecture alignment', 'Review']
      }
    ]
  },
  {
    id: 'filler-cheek-deep',
    title: 'Cheek - Deep Contouring (1ml)',
    category: 'Face & Injectables',
    description: 'High-definition zygomatic arch enhancement placing high-density cohesive hyaluronic acid onto the bone for razor-sharp cheekbone definition and structural projection.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    startingPrice: 350,
    currency: '£',
    procedureTime: '40 Mins',
    downtime: '24 - 48 Hours',
    badge: 'Deep Architecture',
    packages: [
      {
        id: 'filler-cheek-deep-pkg',
        name: 'Cheek - Deep Contouring (1ml)',
        price: 350,
        sessions: 1,
        description: 'Ultra-dense structural HA for razor-sharp zygomatic arch contouring.',
        includes: ['Ultra-dense structural HA', 'Deep periosteal placement', 'Follow-up review']
      }
    ]
  },
  {
    id: 'filler-jaw-chin',
    title: 'Jaw & Chin - Deep Contouring (1ml)',
    category: 'Face & Injectables',
    description: 'Sculpts mandibular angles, sharpens the jawline profile border, and advances chin projection to eliminate lower face heaviness and strengthen side profiles.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 350,
    currency: '£',
    procedureTime: '40 Mins',
    downtime: '24 - 48 Hours',
    badge: 'Jawline Definition',
    popular: true,
    packages: [
      {
        id: 'filler-jaw-chin-pkg',
        name: 'Jaw & Chin - Deep Contouring (1ml)',
        price: 350,
        sessions: 1,
        description: 'Structural jawline filler sculpturing mandibular angle and chin projection.',
        includes: ['Structural jawline filler', 'Mandibular angle definition', 'Physician mapping']
      }
    ]
  },
  {
    id: 'filler-hand-rejuvenation',
    title: 'Hand Rejuvenation Filler (1ml)',
    category: 'Face & Injectables',
    description: 'Restores lost volume over dorsal veins and exposed tendons on the back of hands, delivering firm, plump, and age-defying smooth skin texture.',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    startingPrice: 470,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: '24 Hours',
    badge: 'Anti-Ageing Hands',
    packages: [
      {
        id: 'filler-hand-rejuvenation-pkg',
        name: 'Hand Rejuvenation (1ml)',
        price: 470,
        sessions: 1,
        description: '1ml Biostimulatory HA / CaHA fanned across dorsal hands.',
        includes: ['1ml Biostimulatory HA / CaHA', 'Cannula fanning protocol', 'Post-treatment massage']
      }
    ]
  },

  // --- Skin Boosters & High-Tech Lifting ---
  {
    id: 'profhilo-skin-booster',
    title: 'Profhilo® 2ml Bioremodeling',
    category: 'Face & Injectables',
    description: 'Ultra-pure stabilized hyaluronic acid formulated with patented NAHYCO® technology to stimulate 4 types of collagen and elastin across 10 Bio-Aesthetic Points.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    startingPrice: 350,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: '12 - 24 Hours',
    badge: 'Award Winner',
    popular: true,
    packages: [
      {
        id: 'profhilo-single',
        name: 'Single Treatment (2ml) £350',
        price: 350,
        sessions: 1,
        description: '10-point BAP bio-aesthetic injection protocol across full face or neck.',
        includes: ['2ml Pure high & low molecular HA', '10 BAP injection points', 'Post-treatment calming cream']
      },
      {
        id: 'profhilo-course-2',
        name: 'Course of 2 Treatments £560 (Save £140)',
        price: 560,
        isPopular: true,
        perSessionPrice: 280,
        savingsBadge: 'Save £140 · Recommended Protocol',
        sessions: 2,
        description: 'Complete gold-standard 2-session protocol spaced 4 weeks apart for peak collagen bio-remodeling.',
        includes: ['Two 2ml Profhilo treatments', 'Full clinical mapping', 'Complimentary 8-week physician review']
      }
    ]
  },
  {
    id: 'salmon-sperm-polynucleotides',
    title: 'Salmon Sperm Injection (Polynucleotides / PDRN)',
    category: 'Face & Injectables',
    description: 'Breakthrough cellular regeneration therapy utilizing purified DNA fragments (PDRN) to repair damaged cellular structures, fade pigmentation, and firm delicate eye and facial tissue.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    startingPrice: 350,
    currency: '£',
    procedureTime: '40 Mins',
    downtime: '24 Hours',
    badge: 'FROM £350',
    popular: true,
    packages: [
      {
        id: 'pdrn-single',
        name: 'Single Target Area (from £350)',
        price: 350,
        sessions: 1,
        description: 'Targeted polynucleotide infusion into delicate under-eye or cheek tissue.',
        includes: ['Medical-grade salmon DNA polynucleotides', 'Micro-mesotherapy protocol', 'Post-procedure soothing mask']
      },
      {
        id: 'pdrn-course-3',
        name: 'Full Cellular Course (3 Sessions) £900',
        price: 900,
        perSessionPrice: 300,
        savingsBadge: 'Save £150 · Maximum Tissue Repair',
        sessions: 3,
        description: 'Intensive 3-part regenerative program for maximum fibroblast stimulation and dermal thickening.',
        includes: ['3 Complete polynucleotide sessions', 'Progressive skin density scans', 'Take-home barrier cream']
      }
    ]
  },
  {
    id: 'morpheus8-facial',
    title: 'Morpheus8 Facial RF Microneedling',
    category: 'Advanced Facials',
    description: 'Subdermal adipose remodeling that combines microneedling with radiofrequency to melt submental fat, rebuild elastin, and tighten skin up to 4mm deep.',
    image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=800&q=80',
    startingPrice: 190,
    currency: '£',
    procedureTime: '60 Mins',
    downtime: '24 - 48 Hours',
    badge: 'Facial £190',
    popular: true,
    packages: [
      {
        id: 'morpheus8-face-single',
        name: 'Single Facial Session £190',
        price: 190,
        sessions: 1,
        description: 'Full face fractional RF microneedling treatment with topical anaesthesia.',
        includes: ['Medical-grade topical numbing', 'Full-face Morpheus8 passes', 'Cooling peptide post-care mask']
      },
      {
        id: 'morpheus8-face-course-3',
        name: 'Course of 3 Sessions (Face & Neck) £520',
        price: 520,
        perSessionPrice: 173,
        savingsBadge: 'Save £50 · Complete Collagen Lift',
        sessions: 3,
        description: 'Full course spaced 4-6 weeks apart for profound skin tightening and contour remodeling.',
        includes: ['3 Full-face & neck sessions', 'Pre- and post-treatment photographic review']
      }
    ]
  },
  {
    id: 'emface-lifting',
    title: 'EMFACE Skin Tightening & Lifting',
    category: 'Face & Injectables',
    description: 'Hands-free needle-free therapy combining synchronized Radiofrequency (RF) and High-Intensity Facial Electrical Stimulation (HIFES™) to tone delicate elevator muscles and smooth wrinkles.',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    startingPrice: 250,
    currency: '£',
    procedureTime: '20 Mins',
    downtime: 'Zero Downtime',
    badge: 'FROM £250',
    packages: [
      {
        id: 'emface-single',
        name: 'Single EMFACE Session (from £250)',
        price: 250,
        sessions: 1,
        description: 'Simultaneous treatment of forehead and cheek elevator muscle groups.',
        includes: ['Needle-free RF + HIFES technology', 'Full diagnostic face scan', 'Immediate glow']
      },
      {
        id: 'emface-course-4',
        name: 'Full Course (4 Sessions) £890',
        price: 890,
        perSessionPrice: 222,
        savingsBadge: 'Save £110 · Clinically Proven 37% Less Wrinkles',
        sessions: 4,
        description: 'Gold-standard 4-week protocol delivering 30% muscle tone increase and 23% lifting effect.',
        includes: ['4 Weekly EMFACE sessions', 'Full photographic tracking', 'Maintenance roadmap']
      }
    ]
  },
  {
    id: 'endolift-fiber-lift',
    title: 'Endolift® - Fiber Lift (Laser)',
    category: 'Face & Injectables',
    description: 'Minimally invasive internal laser procedure using microscopic optical fibers to dissolve localized fat and stimulate internal collagen retraction along the jawline and neck.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 950,
    currency: '£',
    procedureTime: '60 - 90 Mins',
    downtime: '2 - 3 Days',
    badge: 'FROM £950',
    packages: [
      {
        id: 'endolift-single',
        name: 'Single Session (Lower Face & Jowls) from £950',
        price: 950,
        sessions: 1,
        description: 'Subdermal micro-optical laser tightening targeting jowls, double chin, or neck.',
        includes: ['Local infiltration anaesthesia', 'Single-use optical micro-fiber', 'Post-procedure compression guidance']
      }
    ]
  },
  {
    id: 'co2-laser-face-neck',
    title: 'CO2 Laser: Facial & Neck Resurfacing',
    category: 'Advanced Facials',
    description: 'Gold-standard micro-ablative fractional CO2 laser resurfacing vaporizing damaged epidermal columns to eliminate deep wrinkles, acne scarring, and severe photodamage.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    startingPrice: 300,
    currency: '£',
    procedureTime: '60 Mins',
    downtime: '3 - 5 Days',
    badge: 'Face & Neck £300',
    packages: [
      {
        id: 'co2-face-neck-pkg',
        name: 'Facial & Neck Full Resurfacing £300',
        price: 300,
        sessions: 1,
        description: 'Comprehensive fractional ablative resurfacing across the entire face and neck.',
        includes: ['Medical topical anaesthetic', 'Multi-depth passes', 'Post-laser healing serum package']
      }
    ]
  },
  {
    id: 'co2-laser-hands',
    title: 'CO2 Laser: Hands Resurfacing',
    category: 'Advanced Facials',
    description: 'Ablative fractional CO2 laser renewal targeting sun spots, age pigmentation, crepey skin, and collagen depletion across the back of both hands.',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    startingPrice: 200,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: '3 - 4 Days',
    badge: 'Hands £200',
    packages: [
      {
        id: 'co2-hands-pkg',
        name: 'Hands Laser Resurfacing £200',
        price: 200,
        sessions: 1,
        description: 'Bilateral hand laser resurfacing to clear age spots and tighten loose dorsal skin.',
        includes: ['Bilateral hand laser resurfacing', 'Topical numbing', 'Soothing healing balm']
      }
    ]
  },
  {
    id: 'co2-laser-scars',
    title: 'CO2 Laser: Localized Scars',
    category: 'Advanced Facials',
    description: 'Ultra-targeted high-energy micro-fractional vaporization to remodel fibrous collagen bands in localized traumatic, surgical, or pitted acne scars.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 100,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: '2 - 3 Days',
    badge: 'Scars £100',
    packages: [
      {
        id: 'co2-scars-pkg',
        name: 'Localized Scar Treatment £100',
        price: 100,
        sessions: 1,
        description: 'High-precision resurfacing of localized surgical or trauma scars.',
        includes: ['Targeted CO2 laser passes', 'Sterile healing protocol']
      }
    ]
  },
  {
    id: 'co2-laser-stretch-marks',
    title: 'CO2 Laser: Stretch Marks (Striae)',
    category: 'Advanced Facials',
    description: 'Thermal fractional coagulation stimulating deep fibroblasts to blend texture, contract wide margins, and restore elasticity in stretch marks on abdomen, hips, or thighs.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    startingPrice: 200,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: '3 - 5 Days',
    badge: 'Stretch Marks £200',
    packages: [
      {
        id: 'co2-stretch-marks-pkg',
        name: 'Stretch Marks Resurfacing £200',
        price: 200,
        sessions: 1,
        description: 'Fractional thermal stimulation to blend and tighten stretch mark borders.',
        includes: ['Zonal treatment (Abdomen, thighs, or hips)', 'Hydrating barrier care']
      }
    ]
  },

  // =========================================================================
  // 2. BODY SCULPTING (Fat Dissolving, EMSCULPT, Cryo, Slimming Pen)
  // =========================================================================
  {
    id: 'aqualyx-course-1',
    title: 'Aqualyx - Course of 1',
    category: 'Body Sculpting',
    description: 'Targeted single-session deoxycholic acid lipolysis injected directly into stubborn subcutaneous adipose pockets to permanently rupture fat cell membranes.',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80',
    startingPrice: 170,
    currency: '£',
    procedureTime: '30 - 45 Mins',
    downtime: '24 - 48 Hours',
    badge: 'Course of 1',
    popular: true,
    packages: [
      {
        id: 'aqualyx-c1-small',
        name: 'Small Area £170 (e.g. Chin / Jowls)',
        price: 170,
        sessions: 1,
        description: 'Single session for double chin or small buccal pockets.',
        includes: ['Diagnostic fat pinch mapping', 'Aqualyx + local anaesthetic mixture', 'Post-injection guidance']
      },
      {
        id: 'aqualyx-c1-med',
        name: 'Medium Sized Area £190 (e.g. Arms / Flanks)',
        price: 190,
        sessions: 1,
        description: 'Single session for medium deposits like bra bulge or love handles.',
        includes: ['Medium zonal application', 'Comfort anaesthetic blend']
      },
      {
        id: 'aqualyx-c1-large',
        name: 'Large Area £230 (e.g. Full Abdomen / Thighs)',
        price: 230,
        sessions: 1,
        description: 'Single session across lower abdomen, outer thighs, or back.',
        includes: ['High-dose Aqualyx protocol', 'Multi-vector injection technique']
      }
    ]
  },
  {
    id: 'aqualyx-course-3',
    title: 'Aqualyx - Course of 3',
    category: 'Body Sculpting',
    description: 'Complete 3-session series spaced 3-4 weeks apart for cumulative permanent fat elimination across stubborn body or submental regions.',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80',
    startingPrice: 408,
    currency: '£',
    procedureTime: '30 - 45 Mins',
    downtime: '24 - 48 Hours',
    badge: 'Course of 3',
    popular: true,
    packages: [
      {
        id: 'aqualyx-c3-small',
        name: 'Small Area £408 (Save £102)',
        price: 408,
        perSessionPrice: 136,
        savingsBadge: 'Save £102 vs Single',
        sessions: 3,
        description: 'Full course of 3 treatments spaced 3-4 weeks apart for complete chin / jowl contouring.',
        includes: ['3 Small area treatments', 'Progressive calipers tracking', 'Review']
      },
      {
        id: 'aqualyx-c3-med',
        name: 'Medium Sized Area £456 (Save £114)',
        price: 456,
        perSessionPrice: 152,
        savingsBadge: 'Save £114 vs Single',
        sessions: 3,
        description: '3 sessions for persistent waistline, arm, or bra fold fat elimination.',
        includes: ['3 Medium area treatments', 'Measurement reviews']
      },
      {
        id: 'aqualyx-c3-large',
        name: 'Large Area £552 (Save £138)',
        price: 552,
        perSessionPrice: 184,
        savingsBadge: 'Save £138 vs Single',
        sessions: 3,
        isPopular: true,
        description: 'Complete 3-stage fat cell elimination for stubborn belly fat or thighs.',
        includes: ['3 Large area sessions', 'Body circumference logs', 'Dietary lymphatic support guidance']
      }
    ]
  },
  {
    id: 'deso-course-1',
    title: 'Deso Face & Body - Course of 1',
    category: 'Body Sculpting',
    description: 'Second-generation sodium deoxycholate formulated specifically for refined facial fat pockets (DesoFace) or dense body lipids (DesoBody).',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    startingPrice: 150,
    currency: '£',
    procedureTime: '30 - 45 Mins',
    downtime: '24 Hours',
    badge: 'Course of 1',
    packages: [
      {
        id: 'deso-c1-small',
        name: 'Small Area £150',
        price: 150,
        sessions: 1,
        description: 'Single session for double chin or jawline contouring.',
        includes: ['DesoFace specialized formulation', 'Cannula technique', 'Review']
      },
      {
        id: 'deso-c1-med',
        name: 'Medium Sized Area £170',
        price: 170,
        sessions: 1,
        description: 'Single session for flanks, inner knees, or underarm bulge.',
        includes: ['DesoBody formulation', 'Localized anaesthetic blend']
      },
      {
        id: 'deso-c1-large',
        name: 'Large Area £210',
        price: 210,
        sessions: 1,
        description: 'Single session for full stomach or outer thighs.',
        includes: ['High-potency DesoBody protocol', 'Multi-layer injection']
      }
    ]
  },
  {
    id: 'deso-course-3',
    title: 'Deso Face & Body - Course of 3',
    category: 'Body Sculpting',
    description: 'Intensive 3-part program spaced 4 weeks apart for stubborn lipid deposits resistant to exercise.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    startingPrice: 360,
    currency: '£',
    procedureTime: '30 - 45 Mins',
    downtime: '24 Hours',
    badge: 'Course of 3',
    popular: true,
    packages: [
      {
        id: 'deso-c3-small',
        name: 'Small Area £360 (Save £90)',
        price: 360,
        perSessionPrice: 120,
        savingsBadge: 'Save £90 vs Single',
        sessions: 3,
        description: 'Complete 3-session series for submental double chin elimination.',
        includes: ['3 DesoFace treatments', 'Before & after tracking']
      },
      {
        id: 'deso-c3-med',
        name: 'Medium Sized Area £408 (Save £102)',
        price: 408,
        perSessionPrice: 136,
        savingsBadge: 'Save £102 vs Single',
        sessions: 3,
        description: '3 sessions targeting flanks, bingo wings, or hips.',
        includes: ['3 DesoBody treatments']
      },
      {
        id: 'deso-c3-large',
        name: 'Large Area £504 (Save £126)',
        price: 504,
        perSessionPrice: 168,
        savingsBadge: 'Save £126 vs Single',
        sessions: 3,
        isPopular: true,
        description: 'Maximum fat cell destruction across abdomen or thigh zones.',
        includes: ['3 Full large area sessions', 'Body contour assessments']
      }
    ]
  },
  {
    id: 'slimming-pen-program',
    title: 'Slimming Pen Medical Program',
    category: 'Body Sculpting',
    description: 'Physician-prescribed GLP-1 medical weight loss therapy designed to suppress appetite, regulate blood sugar, and support sustained body fat reduction with ongoing doctor reviews.',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    startingPrice: 155,
    currency: '£',
    procedureTime: 'Medical Consult',
    downtime: 'Zero Downtime',
    badge: 'Doctor Prescribed',
    popular: true,
    packages: [
      {
        id: 'slimming-pen-1m',
        name: '1 Month Course £155',
        price: 155,
        sessions: 1,
        description: 'Initial 4-week medical pen supply with comprehensive clinical initiation.',
        includes: ['Medical doctor consultation', '1 Month pre-filled injection pen', 'Weekly dose schedule']
      },
      {
        id: 'slimming-pen-3m',
        name: '3 Month Course incl. Consultation & Monthly Online Reviews £450',
        price: 450,
        sessions: 3,
        savingsBadge: 'Includes Doctor Reviews & Progress Logs',
        isPopular: true,
        description: 'Full 12-week supported weight management program with monthly medical check-ins.',
        includes: ['3 Months full medication supply', 'Monthly online doctor reviews', 'Nutrition and metabolic support guide']
      }
    ]
  },
  {
    id: 'cryo-fat-freezing',
    title: 'Fat Freezing Cryo Body Slimming (Cryolipolysis)',
    category: 'Body Sculpting',
    description: 'Controlled medical cooling technology freezing subcutaneous fat cells to -9°C, triggering natural apoptosis and elimination through the lymphatic system without needles or surgery.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    startingPrice: 95,
    currency: '£',
    procedureTime: '45 - 60 Mins',
    downtime: 'Zero Downtime',
    badge: 'From £95.00',
    packages: [
      {
        id: 'cryo-single-cup',
        name: 'Single Applicator Session (from £95.00)',
        price: 95,
        sessions: 1,
        description: 'Targeted cooling application on one designated area (e.g. Lower belly or one flank).',
        includes: ['Anti-freeze membrane protection', '360° Surround cooling cup', 'Post-thaw lymphatic massage']
      },
      {
        id: 'cryo-dual-cup',
        name: 'Dual Applicator Session (e.g. Both Flanks / Hips) £180',
        price: 180,
        sessions: 1,
        description: 'Simultaneous treatment of symmetrical areas.',
        includes: ['2 Cryo applicators', 'Complete body measurement', 'Dual lymphatic massage']
      }
    ]
  },
  {
    id: 'emsculpt-body-sculpt',
    title: 'EMSCULPT Body Sculpt & Tightening',
    category: 'Body Sculpting',
    description: 'High-Intensity Electromagnetic Technology (HIFEM) producing 20,000 supramaximal contractions per session to simultaneously build muscle and burn deep fat.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    startingPrice: 275,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: 'Zero Downtime',
    badge: 'FROM £275',
    popular: true,
    packages: [
      {
        id: 'emsculpt-single',
        name: 'Single Target Session (from £275)',
        price: 275,
        sessions: 1,
        description: '30-minute supramaximal workout on Abdomen, Glutes, Arms, or Calves.',
        includes: ['HIFEM medical paddles', 'Intensity titration to 100%', 'No post-session recovery needed']
      },
      {
        id: 'emsculpt-course-4',
        name: 'Course of 4 Sessions £950 (Save £150)',
        price: 950,
        perSessionPrice: 237,
        savingsBadge: 'Save £150 · 16% Muscle Growth Protocol',
        sessions: 4,
        isPopular: true,
        description: 'Standard 2-week intensive protocol (2 sessions per week) for defined abs or lifted buttocks.',
        includes: ['4 Complete EMSCULPT sessions', 'Muscle tone & circumference logs']
      }
    ]
  },
  {
    id: 'morpheus8-body',
    title: 'Morpheus8 Body Treatment',
    category: 'Body Sculpting',
    description: 'Deep RF microneedling penetrating up to 7-8mm with Burst technology to melt body fat, remodel cellulite, and tighten lax skin on abdomen, thighs, and knees.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    startingPrice: 200,
    currency: '£',
    procedureTime: '60 Mins',
    downtime: '24 - 48 Hours',
    badge: 'FROM £200',
    packages: [
      {
        id: 'morpheus8-body-single',
        name: 'Body Treatment (from £200)',
        price: 200,
        sessions: 1,
        description: 'Single high-energy fractional RF treatment on targeted zone.',
        includes: ['Topical aesthetic numbing', 'Multi-depth body passes', 'Soothing post-care balm']
      },
      {
        id: 'morpheus8-body-course-3',
        name: 'Course of 3 Sessions £550 (Save £50)',
        price: 550,
        perSessionPrice: 183,
        savingsBadge: 'Save £50 · Deep Adipose Remodeling',
        sessions: 3,
        description: 'Complete 3-month course for lax skin on the abdomen, buttocks, or above the knees.',
        includes: ['3 Full body sessions', 'Clinical progress photos']
      }
    ]
  },
  {
    id: 'body-slimming-cellulite',
    title: 'Body Slimming for Fat Loss & Cellulite Reduction',
    category: 'Body Sculpting',
    description: 'Multi-technology lymphatic drainage and radiofrequency vacuum cavitation breaking down fibrotic septae bands and smoothing orange-peel skin texture.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    startingPrice: 195,
    currency: '£',
    procedureTime: '60 Mins',
    downtime: 'None',
    badge: 'FROM £195',
    packages: [
      {
        id: 'cellulite-single',
        name: 'Single Intensive Session (from £195)',
        price: 195,
        sessions: 1,
        description: 'Full-body or targeted dual-leg acoustic / RF cellulite treatment.',
        includes: ['RF thermal heating', 'Mechanical suction massage', 'Lymphatic flush']
      }
    ]
  },

  // =========================================================================
  // 3. ADVANCED FACIALS (Facials & Skin Care from Image 1)
  // =========================================================================
  {
    id: 'gold-facial-special',
    title: 'Facial - Gold MONDAY AND FRIDAY SPECIAL',
    category: 'Advanced Facials',
    description: 'Decadent 24-karat gold leaf facial treatment infused with cellular antioxidants to combat free-radical damage and deliver luminous red-carpet radiance (40min).',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 95,
    currency: '£',
    procedureTime: '40 Mins',
    downtime: 'None',
    badge: '40min £95',
    popular: true,
    packages: [
      {
        id: 'gold-facial-40min',
        name: 'Gold Special Facial 40min £95',
        price: 95,
        sessions: 1,
        description: 'Special promotional pricing for our 24K gold foil infusion facial.',
        includes: ['Deep cleansing', '24K gold foil application', 'Hyaluronic massage', 'Finishing radiance cream']
      }
    ]
  },
  {
    id: 'high-frequency-acne-facial',
    title: 'Facial - High Frequency for Acne',
    category: 'Advanced Facials',
    description: 'Gentle electrical current producing oxygen ozone directly inside pores to eliminate stubborn acne-causing P. acnes bacteria and speed healing (30min).',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 55,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: 'None',
    badge: '30min £55',
    packages: [
      {
        id: 'high-freq-single',
        name: 'High Frequency for Acne 30min £55',
        price: 55,
        sessions: 1,
        description: 'Targeted high-frequency glass argon/neon electrode pass over breakout areas.',
        includes: ['Purifying wash', 'Electrode antibacterial pass', 'Soothing zinc lotion']
      }
    ]
  },
  {
    id: 'extractions-scrubber-steamer',
    title: 'Facial - Extractions with Scrubber, Steamer & Suction',
    category: 'Advanced Facials',
    description: 'Deep cleansing medical facial combining warm ozone steam, ultrasonic skin scrubber vibrations, and gentle vacuum suction to unclog congested pores (45min).',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    startingPrice: 55,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: 'Few hours redness',
    badge: '45min £55',
    packages: [
      {
        id: 'extraction-single',
        name: 'Extractions with Scrubber & Steamer 45min £55',
        price: 55,
        sessions: 1,
        description: 'Thorough clearing of blackheads, milia, and sebum plugs.',
        includes: ['Ozone facial steam', 'Ultrasonic spatula pass', 'Manual extractions', 'Antibacterial finish']
      }
    ]
  },
  {
    id: 'led-light-therapy',
    title: 'Facial - LED Light Therapy',
    category: 'Advanced Facials',
    description: 'Specific wavelengths of medical light (Red 633nm for collagen, Blue 415nm for acne, Near-Infrared 830nm for deep healing) (45min).',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    startingPrice: 25,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: 'None',
    badge: '45min £25',
    packages: [
      {
        id: 'led-single',
        name: 'LED Light Therapy 45min £25',
        price: 25,
        sessions: 1,
        description: 'Medical LED canopy session calibrated to your personal skin condition.',
        includes: ['Cleansing', 'Targeted wavelength exposure', 'Finishing barrier cream']
      }
    ]
  },
  {
    id: 'oxygen-o2-dome-facial',
    title: 'Facial - Oxygen O2 Dome',
    category: 'Advanced Facials',
    description: 'Pure 90% hyperbaric oxygen and anion mist delivered under a sealed dome to accelerate cellular repair, kill anaerobic acne bacteria, and rejuvenate stressed skin (45min).',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 90,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: 'None',
    badge: '45min £90',
    packages: [
      {
        id: 'oxygen-dome-single',
        name: 'Oxygen O2 Dome 45min £90',
        price: 90,
        sessions: 1,
        description: 'Oxygen mist infusion + 20 minutes under the hyperbaric oxygen anion dome.',
        includes: ['Exfoliating wash', 'Oxygen ampoule spray', 'Anion dome immersion']
      }
    ]
  },
  {
    id: 'diamond-microdermabrasion',
    title: 'Facial - Diamond Tip Microdermabrasion',
    category: 'Advanced Facials',
    description: 'Non-chemical mechanical diamond exfoliation vacuuming dead surface cells away to smooth coarse texture, reduce dullness, and improve skincare absorption (45min).',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
    startingPrice: 60,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: 'None',
    badge: '45min £60',
    packages: [
      {
        id: 'diamond-single',
        name: 'Diamond Tip Microdermabrasion 45min £60',
        price: 60,
        sessions: 1,
        description: 'Complete diamond-tip resurfacing pass followed by hydrating cream application.',
        includes: ['Diamond resurfacing', 'Vacuum suction pore clearing', 'Hydrating SPF 50 shield']
      }
    ]
  },
  {
    id: 'egf-facial-special',
    title: 'Facial - EGF ("Epidermal Growth Factor") MONDAY & FRIDAY SPECIAL',
    category: 'Advanced Facials',
    description: 'Biotech peptide facial utilizing concentrated epidermal growth factors to trigger rapid cell turnover and repair cellular matrix fatigue (40min).',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    startingPrice: 115,
    currency: '£',
    procedureTime: '40 Mins',
    downtime: 'None',
    badge: '40min £115',
    packages: [
      {
        id: 'egf-facial-40min',
        name: 'EGF Facial Special 40min £115',
        price: 115,
        sessions: 1,
        description: 'Concentrated biotech EGF cellular infusion protocol.',
        includes: ['Enzymatic peel', 'EGF ampoule micro-infusion', 'Cellular recovery mask']
      }
    ]
  },
  {
    id: 'red-carpet-exfoliating-special',
    title: 'Facial - Red Carpet Exfoliating MONDAY & FRIDAY SPECIAL',
    category: 'Advanced Facials',
    description: 'Instant event-ready glow treatment combining fruit acid resurfacing, oxygenation, and firming botanical extracts without post-treatment peeling (45min).',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    startingPrice: 120,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: 'None / Instant Glow',
    badge: '45min £120',
    packages: [
      {
        id: 'red-carpet-45min',
        name: 'Red Carpet Exfoliating 45min £120',
        price: 120,
        sessions: 1,
        description: 'Event-ready exfoliation ritual for glass-like luminosity.',
        includes: ['Glow exfoliation pass', 'Oxygenated recovery mist', 'Contouring facial massage']
      }
    ]
  },
  {
    id: 'idebenone-facial-special',
    title: 'Facial - Idebenone Facial MONDAY & FRIDAY SPECIAL',
    category: 'Advanced Facials',
    description: 'Ultra-potent Idebenone antioxidant infusion (4x stronger than Vitamin C and 10x stronger than CoQ10) delivering maximum environmental age defense (40min).',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
    startingPrice: 105,
    currency: '£',
    procedureTime: '40 Mins',
    downtime: 'None',
    badge: '40min £105',
    packages: [
      {
        id: 'idebenone-40min',
        name: 'Idebenone Facial 40min £105',
        price: 105,
        sessions: 1,
        description: 'Super-antioxidant infusion shielding against pollution and photo-ageing.',
        includes: ['Double cleanse', 'Idebenone booster infusion', 'Antioxidant seal']
      }
    ]
  },
  {
    id: 'aquafacial-clinical',
    title: 'Facial - Aquafacial',
    category: 'Advanced Facials',
    description: 'Vortex-fusion medical facial utilizing saline and AHA/BHA serums to vacuum-extract pores, gently peel, and saturate the skin with intensive peptides and antioxidants (1h).',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    startingPrice: 150,
    currency: '£',
    procedureTime: '1 Hour',
    downtime: 'None / Immediate Glow',
    badge: '1h £150',
    popular: true,
    packages: [
      {
        id: 'aquafacial-single',
        name: 'Aquafacial Protocol (1h) £150',
        price: 150,
        sessions: 1,
        description: 'Complete 6-step vortex cleanse, chemical exfoliation, painless suction extractions, and antioxidant infusion.',
        includes: ['AHA/BHA vortex exfoliation', 'Painless blackhead vacuum extraction', 'Hyaluronic peptide hydration infusion', 'LED light booster']
      }
    ]
  },
  {
    id: 'microneedling-collagen-induction',
    title: 'Facial - Micro-Needling Collagen Induction Therapy',
    category: 'Advanced Facials',
    description: 'Medical precision dermapen creating thousands of microscopic micro-punctures to stimulate neocollagenesis, shrink pores, and soften pitted acne scarring (1h).',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    startingPrice: 150,
    currency: '£',
    procedureTime: '1 Hour',
    downtime: '12 - 24 Hours',
    badge: '1h £150',
    popular: true,
    packages: [
      {
        id: 'microneedle-single',
        name: 'Microneedling Collagen Therapy (1h) £150',
        price: 150,
        sessions: 1,
        description: 'Full-face medical microneedling with bespoke hyaluronic infusion.',
        includes: ['Topical aesthetic numbing', 'Full depth micro-needle pass', 'Calming hyaluronic biocellulose mask']
      }
    ]
  },
  {
    id: 'ultimate-glass-skin-facial',
    title: 'Facial - Ultimate Glass Skin',
    category: 'Advanced Facials',
    description: 'The pinnacle 2-hour medical facial ritual combining diamond peel, pure oxygen infusion, microcurrent contouring, and deep active essence layering for a luminous porcelain glass complexion (2h).',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 250,
    currency: '£',
    procedureTime: '2 Hours',
    downtime: 'Zero Downtime',
    badge: '2h £250',
    popular: true,
    packages: [
      {
        id: 'glass-skin-single',
        name: 'Ultimate Glass Skin VIP Ritual (2h) £250',
        price: 250,
        sessions: 1,
        description: 'Our most comprehensive transformative facial journey for unmatched luminosity.',
        includes: [
          'Double enzymatic cleanse',
          'Diamond microdermabrasion',
          'Oxygen dome hyperbaric infusion',
          'Bio-cellulose peptide matrix mask',
          'Cryo ice globe lymphatic sculpt',
          'Custom botanical cocktail finish'
        ]
      }
    ]
  },
  {
    id: 'regenerative-scalp-facial',
    title: 'Regenerative Scalp Facial Combination',
    category: 'Advanced Facials',
    description: 'Synergistic 90-minute dual protocol revitalizing scalp hair follicle roots with trichological detox and steam while simultaneously performing a deep antioxidant facial (1h 30 min).',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 95,
    currency: '£',
    procedureTime: '1h 30 Mins',
    downtime: 'None',
    badge: '1h 30 min £95',
    packages: [
      {
        id: 'scalp-facial-combo-90m',
        name: 'Regenerative Scalp Facial Combo (1h 30 min) £95',
        price: 95,
        sessions: 1,
        description: 'Micro-exfoliating scalp detox paired with custom radiance facial.',
        includes: ['Trichology scalp scrub & steam', 'Facial cleanse and active mask', 'High frequency stimulation']
      }
    ]
  },
  {
    id: 'bb-glow-facial',
    title: 'BB Glow Facial',
    category: 'Advanced Facials',
    description: 'Nano-needling infusion of nutrient-rich tinted pigments and peptides into the upper epidermis to even skin tone, conceal redness, and leave a semi-permanent soft-focus glow.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    startingPrice: 180,
    currency: '£',
    procedureTime: '60 Mins',
    downtime: 'None',
    badge: 'BB Glow £180',
    packages: [
      {
        id: 'bb-glow-single',
        name: 'BB Glow Facial £180',
        price: 180,
        sessions: 1,
        description: 'Deep pore cleanse followed by customized shade pigment nano-infusion.',
        includes: ['Cleansing & dermabrasion', 'Nano-needle BB serum infusion', 'Soothing LED therapy']
      }
    ]
  },

  // =========================================================================
  // 4. HAIR & BEAUTY (Salon, Lashes, Brows, SPMU, Waxing, Laser Hair)
  // =========================================================================

  // --- Lash & Eyebrow ---
  {
    id: 'eyebrow-wax',
    title: 'Eyebrow Wax',
    category: 'Hair & Beauty',
    description: 'Clean waxing and arch definition using soothing warm strip wax and cooling aloe vera aftercare.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 8,
    currency: '£',
    procedureTime: '15 Mins',
    downtime: 'None',
    badge: '£8',
    packages: [{ id: 'eyebrow-wax-pkg', name: 'Eyebrow Wax £8', price: 8, sessions: 1, description: 'Clean waxing and arch definition.', includes: ['Brow mapping', 'Gentle wax strip removal', 'Aloe soothing gel'] }]
  },
  {
    id: 'eyebrow-tint',
    title: 'Eyebrow Tint',
    category: 'Hair & Beauty',
    description: 'Custom tinting matching your hair undertones for crisp, fuller brow framing.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 10,
    currency: '£',
    procedureTime: '15 Mins',
    downtime: 'None',
    badge: '£10',
    packages: [{ id: 'eyebrow-tint-pkg', name: 'Eyebrow Tint £10', price: 10, sessions: 1, description: 'Custom shade tinting matching natural hair.', includes: ['Custom shade blend', 'Application & cleanup'] }]
  },
  {
    id: 'lash-tint',
    title: 'Lash Tint',
    category: 'Hair & Beauty',
    description: 'Deep jet black or dark brown tinting for mascara-free definition and darker, prominent lashes.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 10,
    currency: '£',
    procedureTime: '15 Mins',
    downtime: 'None',
    badge: '£10',
    packages: [{ id: 'lash-tint-pkg', name: 'Lash Tint £10', price: 10, sessions: 1, description: 'Deep pigment lash tint.', includes: ['Deep pigment lash tint', 'Gentle eye rinse'] }]
  },
  {
    id: 'cluster-lashes',
    title: 'Cluster Lash',
    category: 'Hair & Beauty',
    description: 'Party cluster extensions for instant weekend fullness and glamour.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 25,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: 'None',
    badge: '£25',
    packages: [{ id: 'cluster-lashes-pkg', name: 'Cluster Lash £25', price: 25, sessions: 1, description: 'Quick party cluster extensions.', includes: ['Application of cluster fans'] }]
  },
  {
    id: 'lash-lift',
    title: 'Lash Lift',
    category: 'Hair & Beauty',
    description: 'Lifts and curls natural eyelashes from root to tip with a nourishing keratin shield for 6-8 weeks of mascara-free curl.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 30,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: 'None',
    badge: '£30',
    packages: [{ id: 'lash-lift-pkg', name: 'Lash Lift £30', price: 30, sessions: 1, description: 'Curled natural lashes for 6-8 weeks.', includes: ['Silicone rod curling', 'Keratin nourishing shield'] }]
  },
  {
    id: 'eyebrow-lamination',
    title: 'Eyebrow Lamination',
    category: 'Hair & Beauty',
    description: 'Relaxes and sets brow hairs in an upward, brushed-up fluffy runway look, disguising gaps and adding uniform thickness.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 30,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: 'None',
    badge: '30',
    packages: [{ id: 'eyebrow-lamination-pkg', name: 'Eyebrow Lamination £30', price: 30, sessions: 1, description: 'Fluffy brushed-up brow setting.', includes: ['Brow perm setting', 'Nourishing oil finish'] }]
  },
  {
    id: 'classic-lashes',
    title: 'Classic Lash Extensions',
    category: 'Hair & Beauty',
    description: 'Individual 1-to-1 extension application for a natural, elegant, fluttery mascara finish.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 55,
    currency: '£',
    procedureTime: '60 Mins',
    downtime: 'None',
    badge: '£55',
    packages: [{ id: 'classic-lashes-pkg', name: 'Classic Lash £55', price: 55, sessions: 1, description: 'Full set of individual 1-to-1 lashes.', includes: ['Full set classic lashes', 'Eye gel patches'] }]
  },
  {
    id: 'russian-lashes',
    title: 'Russian Lash Extensions',
    category: 'Hair & Beauty',
    description: 'Handmade multi-lash lightweight fans applied to each lash for thick, fluffy, dark volume and drama.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 65,
    currency: '£',
    procedureTime: '75 Mins',
    downtime: 'None',
    badge: '£65',
    popular: true,
    packages: [{ id: 'russian-lashes-pkg', name: 'Russian Lash £65', price: 65, sessions: 1, description: 'Handmade Russian volume set.', includes: ['Full handmade Russian volume set'] }]
  },

  // --- Semi-Permanent Makeup ---
  {
    id: 'spmu-eyeliner',
    title: 'Semi-Permanent Eyeliner',
    category: 'Hair & Beauty',
    description: 'Crisp lash-line enhancement or winged eyeliner cosmetic pigment tattoo saving you daily makeup application.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    startingPrice: 200,
    currency: '£',
    procedureTime: '90 Mins',
    downtime: '3 - 5 Days',
    badge: '£200',
    packages: [{ id: 'spmu-eyeliner-pkg', name: 'Eyeliner SPMU £200', price: 200, sessions: 1, description: 'Lash line enhancement or subtle wing.', includes: ['Topical numbing', 'Sterile micro-pigment needle', 'Aftercare healing balm'] }]
  },
  {
    id: 'spmu-microblading',
    title: 'Microblading Eyebrows',
    category: 'Hair & Beauty',
    description: 'Hand-etched crisp realistic hair strokes filling sparse brows with natural flow and golden ratio architecture.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    startingPrice: 250,
    currency: '£',
    procedureTime: '120 Mins',
    downtime: '3 - 5 Days',
    badge: '£250',
    popular: true,
    packages: [{ id: 'spmu-microblading-pkg', name: 'Microblading £250', price: 250, sessions: 1, description: 'Manual realistic hair stroke etchings.', includes: ['Golden ratio brow mapping', 'Custom mineral pigment match', 'Aftercare pack'] }]
  },
  {
    id: 'spmu-micro-pigmentation',
    title: 'Micro-Pigmentation Eyebrows',
    category: 'Hair & Beauty',
    description: 'Digital device brow shading for clients with oily, textured, or mature skin requiring uniform color retention.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    startingPrice: 250,
    currency: '£',
    procedureTime: '120 Mins',
    downtime: '3 - 5 Days',
    badge: '£250',
    packages: [{ id: 'spmu-micro-pigmentation-pkg', name: 'Micro-pigmentation £250', price: 250, sessions: 1, description: 'Machine digital pigment shading.', includes: ['Digital machine shading', 'Sterile single-use cartridge'] }]
  },
  {
    id: 'spmu-ombre-brows',
    title: 'Ombré Brows',
    category: 'Hair & Beauty',
    description: 'Soft misted gradient fading from lighter at the front to sharply defined at the tail for a soft makeup finish.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    startingPrice: 250,
    currency: '£',
    procedureTime: '120 Mins',
    downtime: '3 - 5 Days',
    badge: '£250',
    packages: [{ id: 'spmu-ombre-brows-pkg', name: 'Ombré Brows £250', price: 250, sessions: 1, description: 'Ombré gradient shading.', includes: ['Ombré gradient shading', 'Aftercare instructions'] }]
  },
  {
    id: 'spmu-powder-brow',
    title: 'Powder Brow',
    category: 'Hair & Beauty',
    description: 'Full powdery soft makeup pencil finish delivering long-lasting saturated definition and density.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    startingPrice: 250,
    currency: '£',
    procedureTime: '120 Mins',
    downtime: '3 - 5 Days',
    badge: '£250',
    packages: [{ id: 'spmu-powder-brow-pkg', name: 'Powder Brow £250', price: 250, sessions: 1, description: 'Full soft powder shading.', includes: ['Full powder shading', 'Post-procedure care'] }]
  },
  {
    id: 'spmu-lip-blushing',
    title: 'Lip Blushing',
    category: 'Hair & Beauty',
    description: 'Infuses youthful nude, rose, or berry blush into pale lips with defined borders, enhancing natural shape and color for 2-3 years.',
    image: 'https://images.unsplash.com/photo-1588515724527-074a7a56616c?auto=format&fit=crop&w=800&q=80',
    startingPrice: 250,
    currency: '£',
    procedureTime: '120 Mins',
    downtime: '3 - 5 Days',
    badge: '£250',
    packages: [{ id: 'spmu-lip-blushing-pkg', name: 'Lip Blushing £250', price: 250, sessions: 1, description: 'Lip tint & border definition.', includes: ['Lip border definition', 'Full blush pigment saturation', 'Hydrating aftercare'] }]
  },
  {
    id: 'tattoo-removal-laser',
    title: 'Tattoo Removel (Laser)',
    category: 'Advanced Facials',
    description: 'Q-Switched laser breaking down cosmetic or body ink pigments without scarring.',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80',
    startingPrice: 350,
    currency: '£',
    procedureTime: '30 - 45 Mins',
    downtime: '2 - 3 Days',
    badge: 'From 350',
    packages: [{ id: 'tattoo-removal-laser-pkg', name: 'Tattoo Removal from £350', price: 350, sessions: 1, description: 'Laser ink shattering.', includes: ['Laser ink shattering', 'Cooling pack and antiseptic dressing'] }]
  },

  // --- Body Waxing ---
  {
    id: 'body-waxing-catalog',
    title: 'BODY Waxing Services',
    category: 'Hair & Beauty',
    description: 'Hygienic warm and hot strip waxing removing hairs cleanly from the root with soothing tea tree aftercare.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    startingPrice: 10,
    currency: '£',
    procedureTime: '15 - 45 Mins',
    downtime: 'None',
    badge: 'from £10',
    packages: [
      { id: 'wax-underarm', name: 'Underarm £10', price: 10, sessions: 1, description: 'Underarm waxing.', includes: ['Underarm wax'] },
      { id: 'wax-half-arm', name: 'Half Arm £10', price: 10, sessions: 1, description: 'Both forearms.', includes: ['Forearms wax'] },
      { id: 'wax-half-leg', name: 'Half Leg £15', price: 15, sessions: 1, description: 'Lower legs from knees down.', includes: ['Half leg wax'] },
      { id: 'wax-full-arm', name: 'Full Arm £15', price: 15, sessions: 1, description: 'Both full arms.', includes: ['Full arm wax'] },
      { id: 'wax-full-leg', name: 'Full Leg £20', price: 20, sessions: 1, description: 'Full legs from thighs to toes.', includes: ['Full leg wax'] },
      { id: 'wax-full-face', name: 'Full Face £20', price: 20, sessions: 1, description: 'Cheeks, lip, chin & forehead.', includes: ['Full face wax'] },
      { id: 'wax-bikini', name: 'Bikini £25', price: 25, sessions: 1, description: 'Standard bikini line wax.', includes: ['Bikini perimeter'] },
      { id: 'wax-brazilian', name: 'Brazilian £25', price: 25, sessions: 1, description: 'Full Brazilian waxing.', includes: ['Brazilian waxing'] },
      { id: 'wax-back-shoulder', name: 'Back & Shoulder £40', price: 40, sessions: 1, description: 'Full back and shoulders.', includes: ['Back & shoulders wax'] }
    ]
  },

  // --- Hair Salon ---
  {
    id: 'hair-salon-cuts',
    title: 'Cut: Ladies & Girls',
    category: 'Hair & Beauty',
    description: 'Master salon stylist precision haircutting, custom blow drying, and thermal finish.',
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
    startingPrice: 10,
    currency: '£',
    procedureTime: '15 - 60 Mins',
    downtime: 'None',
    badge: 'from £10',
    packages: [
      { id: 'hair-fringe', name: 'Fringe £10', price: 10, sessions: 1, description: 'Quick reshape or bang trimming.', includes: ['Fringe trim'] },
      { id: 'hair-wash-cut', name: 'Wash / Cut (From) £20', price: 20, sessions: 1, description: 'Wash & precision cut.', includes: ['Shampoo wash', 'Precision haircut'] },
      { id: 'hair-cut-blowdry', name: 'Cut / Blow Dry (From) £25', price: 25, sessions: 1, description: 'Wash, precision cut, and blow dry.', includes: ['Cut & blow dry'] },
      { id: 'hair-blow-dry', name: 'Blow Dry £35', price: 35, sessions: 1, description: 'Full salon wash and professional blow dry.', includes: ['Blow dry styling'] },
      { id: 'hair-blowdry-long', name: 'Blow / Dry Long / Curly £45 (+£10)', price: 45, sessions: 1, description: 'Specialized thermal smoothing for long or dense curly hair.', includes: ['Long hair thermal sculpt'] }
    ]
  },
  {
    id: 'hair-colour-salon',
    title: 'Colors: Highlights, Balayage & Tints',
    category: 'Hair & Beauty',
    description: 'Expert hair colourists using multidimensional tones, freehand balayage sweeps, and gentle ammonia-free toners.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    startingPrice: 15,
    currency: '£',
    procedureTime: '30 - 120 Mins',
    downtime: 'None',
    badge: 'from £15',
    packages: [
      { id: 'color-toner', name: 'Toner (from) £15', price: 15, sessions: 1, description: 'Post-bleach or maintenance glaze.', includes: ['Custom gloss toner'] },
      { id: 'color-in-between', name: 'Color in Between £30', price: 30, sessions: 1, description: 'Base tint between highlighted foil sections.', includes: ['Inter-foil tinting'] },
      { id: 'color-roots-tint', name: 'Roots Tint. £50', price: 50, sessions: 1, description: 'Grey coverage or regrowth matching.', includes: ['Root colour matching'] },
      { id: 'color-full-head', name: 'Full / Head Color (from) £60', price: 60, sessions: 1, description: 'All-over rich gloss colour.', includes: ['Full head formulation'] },
      { id: 'color-t-sections', name: 'T-Sections Highlights (From) £70', price: 70, sessions: 1, description: 'Parting line and hairline highlights.', includes: ['T-section foils'] },
      { id: 'color-balayage', name: 'Balayage £90', price: 90, sessions: 1, description: 'Custom hand-painted French balayage.', includes: ['Freehand placement', 'Gloss blend'] },
      { id: 'color-half-head', name: 'Half / Head Highlights (From) £90', price: 90, sessions: 1, description: 'Crown and sides highlights.', includes: ['Half-head foils'] },
      { id: 'color-full-head-hl', name: 'Full Head Highlights (From) £110', price: 110, sessions: 1, description: 'Maximum blonde saturation across whole head.', includes: ['Full head foils', 'Gloss toner'] }
    ]
  },
  {
    id: 'hair-treatments-salon',
    title: 'Hair Treatments: Keratin, Botox & Olaplex',
    category: 'Hair & Beauty',
    description: 'Intensive trichological repair therapies smoothing frizz, sealing split ends, and infusing hydrolysed keratin and hyaluronic acid deep into the cortex.',
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
    startingPrice: 15,
    currency: '£',
    procedureTime: '30 - 90 Mins',
    downtime: 'None',
    badge: 'from £15',
    packages: [
      { id: 'olaplex-addon', name: 'Olaplex Add-On £15', price: 15, sessions: 1, description: 'No.1 Bond Multiplier mixed into colour.', includes: ['Olaplex add-on'] },
      { id: 'hair-nourish-cond', name: 'Nourish / Condng £20', price: 20, sessions: 1, description: 'Intense moisture bath for dry strands.', includes: ['Steamer basin infusion'] },
      { id: 'keratin-blowdry', name: 'Keratin / Brazilian Blowdry (From) £60', price: 60, sessions: 1, description: 'Semi-permanent protein smoothing eliminating 95% of frizz.', includes: ['Brazilian keratin infusion', 'Ceramic sealing'] },
      { id: 'hair-botox', name: 'Hair Botox (from) £65', price: 65, sessions: 1, description: 'Deep conditioning reconstructing broken cortex fibers.', includes: ['Hyaluronic & caviar infusion'] },
      { id: 'olaplex-standalone', name: 'Olaplex (Stimming / Intensive) £65', price: 65, sessions: 1, description: 'Complete multi-step bond rebuilding ritual.', includes: ['Olaplex No.1, No.2 & moisture shield'] }
    ]
  },
  {
    id: 'men-and-kids',
    title: 'Men and Kids Grooming & Cuts',
    category: 'Hair & Beauty',
    subGroupId: 'men-and-kids',
    subCategory: 'Men and Kids',
    description: 'Tailored precision grooming, contemporary styling, and gentle hair care services designed for gentlemen and young clients.',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    startingPrice: 15,
    currency: '£',
    procedureTime: '20 - 30 Mins',
    downtime: 'None',
    badge: 'from £15',
    packages: [
      { id: 'men-kids-groom-1', name: 'Clipper Buzz / Trim £15', price: 15, sessions: 1, description: 'Clean clipper trim and edge cleanup.', includes: ['Clipper taper', 'Neck & edge cleanup'] },
      { id: 'men-kids-groom-2', name: 'Gentlemen & Kids Scissor Cut £20', price: 20, sessions: 1, description: 'Precision scissor cut and styling.', includes: ['Scissor cut', 'Wash & styling'] }
    ]
  },
  {
    id: 'mens-kids-services',
    title: "Men's / Kids Hair Service",
    category: 'Hair & Beauty',
    subGroupId: 'men-kids-services',
    subCategory: 'Men / kids services',
    description: 'Clean clipper trims, precision scissor cuts, and professional finishing pomade styling.',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    startingPrice: 15,
    currency: '£',
    procedureTime: '20 - 30 Mins',
    downtime: 'None',
    badge: 'from £15',
    packages: [
      { id: 'clipper-buzz', name: 'Clipper Buzz / Cut £15', price: 15, sessions: 1, description: 'Clean clipper trim and edge cleanup.', includes: ['Clipper taper', 'Neck trim'] },
      { id: 'cut-finishing', name: 'Cut & Finishing £20', price: 20, sessions: 1, description: 'Scissors and clipper cut with styling finish.', includes: ['Cut', 'Rinse', 'Pomade finish'] }
    ]
  },
  {
    id: 'party-makeup-manicure-extensions',
    title: 'Party Makeup, Gel Manicures & Hair Extensions',
    category: 'Hair & Beauty',
    description: 'Professional event makeup application, chip-free gel polish manicures, and full human hair extensions.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 20,
    currency: '£',
    procedureTime: '45 - 120 Mins',
    downtime: 'None',
    badge: 'from £20',
    packages: [
      { id: 'classic-manicure-gel', name: 'Classic Manicure + Gel £20', price: 20, sessions: 1, description: 'Nail shaping, cuticle treatment, and cured UV gel polish.', includes: ['Nail file & shape', 'Cuticle trim', 'Long-lasting gel color'] },
      { id: 'party-makeup', name: 'Any Party Make Up (from) £25', price: 25, sessions: 1, description: 'Full event makeup with contouring and eyeshadow.', includes: ['Skin prep', 'Full face makeup application'] },
      { id: 'hair-extensions-any', name: 'Any Hair Extension (from) £300', price: 300, sessions: 1, description: 'Full head premium human hair extensions for volume and length.', includes: ['Consultation & colour match', 'Full installation', 'Blending cut and finish'] }
    ]
  },

  // --- Laser Hair Removal ---
  {
    id: 'laser-electrolysis',
    title: 'Electrolysis Hair Removal (1h)',
    category: 'Hair & Beauty',
    description: 'Permanent galvanic / thermolysis probe hair removal ideal for stubborn hormonal or white/grey hairs (1h).',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80',
    startingPrice: 50,
    currency: '£',
    procedureTime: '1 Hour',
    downtime: 'None',
    badge: '1h £50',
    packages: [{ id: 'electrolysis-1h-pkg', name: 'Electrolysis Hair Removal 1h £50', price: 50, sessions: 1, description: '1-hour precision probe electrolysis.', includes: ['1-hour precision probe electrolysis', 'Antiseptic witch hazel finish'] }]
  },
  {
    id: 'laser-alma-soprano-body',
    title: 'Alma Soprano Laser Hair Removal - Body',
    category: 'Hair & Beauty',
    description: 'Virtually painless diode laser hair removal using in-motion SHR technology safe across all Fitzpatrick skin tones.',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80',
    startingPrice: 40,
    currency: '£',
    procedureTime: '15 - 90 Mins',
    downtime: 'Zero Downtime',
    badge: 'from £40',
    popular: true,
    packages: [
      { id: 'laser-bikini', name: 'Bikini £40', price: 40, sessions: 1, description: 'Neat perimeter bikini line hair removal.', includes: ['Alma Soprano SHR pass', 'Cooling contact gel'] },
      { id: 'laser-half-arm', name: 'Half Arm £40', price: 40, sessions: 1, description: 'Forearms to elbows on both arms.', includes: ['Both forearms'] },
      { id: 'laser-high-bikini', name: 'High Bikini £40', price: 40, sessions: 1, description: 'High cut bikini border removal.', includes: ['In-motion laser sweep'] },
      { id: 'laser-underarm', name: 'Underarm £40', price: 40, sessions: 1, description: 'Permanent hair reduction on both underarms.', includes: ['Bilateral underarms treatment'] },
      { id: 'laser-brazilian', name: 'Brazilian £65', price: 65, sessions: 1, description: 'Full intimate front strip with clearance.', includes: ['Brazilian laser contour'] },
      { id: 'laser-chest', name: 'Chest £65', price: 65, sessions: 1, description: 'Full male or female chest area.', includes: ['Chest laser pass'] },
      { id: 'laser-full-arm', name: 'Full Arm £65', price: 65, sessions: 1, description: 'Shoulders down to wrists on both arms.', includes: ['Both full arms'] },
      { id: 'laser-half-leg', name: 'Half Leg £65', price: 65, sessions: 1, description: 'Lower legs including knees and ankles.', includes: ['Both lower legs'] },
      { id: 'laser-stomach', name: 'Stomach £65', price: 65, sessions: 1, description: 'Full abdomen laser clearance.', includes: ['Full stomach pass'] },
      { id: 'laser-back', name: 'Back £85', price: 85, sessions: 1, description: 'Full shoulders and back down to waistband.', includes: ['Full back laser session'] },
      { id: 'laser-full-leg', name: 'Full Leg £85', price: 85, sessions: 1, description: 'Top of thighs down to ankles on both legs.', includes: ['Both full legs'] },
      { id: 'laser-full-body', name: 'Full Body from £250', price: 250, isPopular: true, sessions: 1, description: 'Comprehensive head-to-toe Alma Soprano ICE clearance.', includes: ['Full body laser clearance in one session'] }
    ]
  },

  // =========================================================================
  // 5. IV DRIP LOUNGE & WELLNESS (IV Infusions, Shots, PRP)
  // =========================================================================
  {
    id: 'iv-b12-shot',
    title: 'B12 Shot (Intramuscular)',
    category: 'IV Drip Lounge & Wellness',
    description: 'Instant energy shot boosting metabolism, red blood cell synthesis, mental clarity, and nervous system health.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 45,
    currency: '£',
    procedureTime: '15 Mins',
    downtime: 'Zero Downtime',
    badge: 'B12 £45',
    popular: true,
    packages: [{ id: 'iv-b12-shot-pkg', name: 'B12 Shot £45', price: 45, sessions: 1, description: '1000mcg Methylcobalamin B12 intramuscular injection.', includes: ['1000mcg Methylcobalamin B12', 'Painless IM administration'] }]
  },
  {
    id: 'iv-iron-shot',
    title: 'Iron Shot',
    category: 'IV Drip Lounge & Wellness',
    description: 'Replenishes iron stores to fight systemic fatigue, hair shedding, brittle nails, and low physical stamina.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 75,
    currency: '£',
    procedureTime: '15 Mins',
    downtime: 'Zero Downtime',
    badge: 'Iron £75',
    packages: [{ id: 'iv-iron-shot-pkg', name: 'Iron Shot £75', price: 75, sessions: 1, description: 'Physician-verified iron wellness booster.', includes: ['Physician-verified iron booster'] }]
  },
  {
    id: 'iv-ginko-infusion',
    title: 'Ginko Infusion',
    category: 'IV Drip Lounge & Wellness',
    description: 'Enhances micro-circulation, cerebral blood flow, mental focus, alertness, and cognitive memory recall.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 80,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: 'Zero Downtime',
    badge: 'Ginko £80',
    packages: [{ id: 'iv-ginko-infusion-pkg', name: 'Ginko Infusion £80', price: 80, sessions: 1, description: 'Ginko biloba cognitive micro-circulation drip.', includes: ['Ginko biloba active drip'] }]
  },
  {
    id: 'iv-performance-boosting',
    title: 'Performance Boosting Drip',
    category: 'IV Drip Lounge & Wellness',
    description: 'Formulated with amino acids, B-Complex, and electrolytes for athletic peak power and post-workout muscle repair.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 90,
    currency: '£',
    procedureTime: '40 Mins',
    downtime: 'Zero Downtime',
    badge: 'Performance £90',
    packages: [{ id: 'iv-performance-boosting-pkg', name: 'Performance Boosting £90', price: 90, sessions: 1, description: 'Amino acids + B-Complex + Magnesium drip.', includes: ['Amino acids + B-Complex + Magnesium drip', 'Hydrating electrolyte saline bag'] }]
  },
  {
    id: 'iv-vitamin-c',
    title: 'Vitamin C Infusion (High-Dose)',
    category: 'IV Drip Lounge & Wellness',
    description: 'Pure intravenous ascorbic acid stimulating collagen production and neutralising cellular oxidative stress.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 100,
    currency: '£',
    procedureTime: '40 Mins',
    downtime: 'Zero Downtime',
    badge: 'Vitamin C £100',
    packages: [{ id: 'iv-vitamin-c-pkg', name: 'Vitamin C £100', price: 100, sessions: 1, description: 'High-dose pure Vitamin C drip.', includes: ['High-dose pure Vitamin C drip', 'Immune defence recharge'] }]
  },
  {
    id: 'iv-vitamin-cocktail',
    title: 'Vitamin Cocktail Drip',
    category: 'IV Drip Lounge & Wellness',
    description: 'Comprehensive multi-vitamin drip replenishing depleted micronutrient reserves across the body.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 110,
    currency: '£',
    procedureTime: '40 Mins',
    downtime: 'Zero Downtime',
    badge: 'Cocktail £110',
    packages: [{ id: 'iv-vitamin-cocktail-pkg', name: 'Vitamin Cocktail £110', price: 110, sessions: 1, description: 'Full B-Complex, Vitamin C, Calcium, and Magnesium.', includes: ['Full B-Complex, Vitamin C, Calcium, and Magnesium'] }]
  },
  {
    id: 'iv-detox-hangover',
    title: 'Detox - Hangover Cure Drip',
    category: 'IV Drip Lounge & Wellness',
    description: 'Fast-acting saline rehydration with anti-nausea, electrolytes, and liver detoxifiers for rapid physical revival.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 125,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: 'Zero Downtime',
    badge: 'Detox £125',
    popular: true,
    packages: [{ id: 'iv-detox-hangover-pkg', name: 'Detox - Hangover Cure £125', price: 125, sessions: 1, description: '500ml Ringer saline bag with detox electrolytes.', includes: ['500ml Ringer saline bag', 'B-Complex', 'Detox electrolytes'] }]
  },
  {
    id: 'iv-zinc-vitamin-c-minerals',
    title: 'Zinc, Vitamin C & Mineral Booster',
    category: 'IV Drip Lounge & Wellness',
    description: 'Immune powerhouse blend strengthening mucosal barriers, cellular immunity, and accelerating infection recovery.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 130,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: 'Zero Downtime',
    badge: 'Zinc & Minerals £130',
    packages: [{ id: 'iv-zinc-pkg', name: 'Zinc, Vitamin C & Mineral £130', price: 130, sessions: 1, description: 'Zinc sulphate + Vitamin C + Trace minerals.', includes: ['Zinc sulphate + Vitamin C + Trace minerals'] }]
  },
  {
    id: 'iv-skinny-drip',
    title: 'Skinny Drip (Metabolic & Fat Burner)',
    category: 'IV Drip Lounge & Wellness',
    description: 'L-Carnitine and lipotropic nutrients stimulating liver metabolism to mobilize and burn fat stores efficiently.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 160,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: 'Zero Downtime',
    badge: 'Skinny Drip £160',
    popular: true,
    packages: [{ id: 'iv-skinny-drip-pkg', name: 'Skinny Drip £160', price: 160, sessions: 1, description: 'L-Carnitine + MIC lipotropics + B-Complex.', includes: ['L-Carnitine + Methionine, Inositol, Choline (MIC) + B-Complex'] }]
  },
  {
    id: 'iv-cinderella-brightening',
    title: 'Cinderella Brightening Drip',
    category: 'IV Drip Lounge & Wellness',
    description: '1200mg Glutathione master antioxidant paired with high-dose Vitamin C and Alpha Lipoic Acid for whole-body skin brightening.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 200,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: 'Zero Downtime',
    badge: 'Cinderella £200',
    popular: true,
    packages: [{ id: 'iv-cinderella-pkg', name: 'Cinderella Brightening £200', price: 200, sessions: 1, description: '1200mg Glutathione + Alpha Lipoic Acid + Vitamin C.', includes: ['1200mg High-grade Glutathione', 'Alpha Lipoic Acid', 'High-dose Vitamin C'] }]
  },
  {
    id: 'iv-modified-myers-cocktail',
    title: 'Modified Myers - Immune Booster Drip',
    category: 'IV Drip Lounge & Wellness',
    description: 'The world-famous gold standard wellness drip combining magnesium, B-complex, and high-potency Vitamin C.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    startingPrice: 200,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: 'Zero Downtime',
    badge: 'Myers £200',
    packages: [{ id: 'iv-myers-pkg', name: 'Modified Myers - Immune Booster £200', price: 200, sessions: 1, description: 'Full Myers nutrient formulation with nurse monitoring.', includes: ['Full Myers nutrient formulation', 'Medical nurse monitoring', 'Deep systemic recharge'] }]
  },
  {
    id: 'prp-hair-loss',
    title: 'Platelet-Rich Plasma (PRP) for Hair Loss Treatment',
    category: 'Face & Injectables',
    description: 'Autologous concentrated platelets packed with bioactive growth factors injected into the scalp to awaken dormant follicles and treat hair thinning.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    startingPrice: 150,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: '12 - 24 Hours',
    badge: 'For Hair Loss £150',
    popular: true,
    packages: [{ id: 'prp-hair-loss-pkg', name: 'PRP for Hair Loss Treatment £150', price: 150, sessions: 1, description: 'Subdermal platelet growth factor scalp injections.', includes: ['Medical centrifugation', 'Scalp micro-injections', 'Follicle stimulation review'] }]
  },
  {
    id: 'prp-facial-treatment',
    title: 'Platelet-Rich Plasma (PRP) Facial Treatment',
    category: 'Face & Injectables',
    description: 'Autologous platelet micro-infusion across the face (Vampire Facial) to stimulate collagen synthesis, tighten pores, and brighten skin tone.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80',
    startingPrice: 120,
    currency: '£',
    procedureTime: '45 Mins',
    downtime: '12 - 24 Hours',
    badge: 'Facial Treatment - from £120',
    packages: [{ id: 'prp-facial-pkg', name: 'PRP Facial Treatment (from £120)', price: 120, sessions: 1, description: 'Autologous platelet micro-infusion across the face.', includes: ['Blood draw & centrifuge separation', 'Micro-papular facial delivery', 'Soothing mask'] }]
  },
  {
    id: 'prp-cosmetic-injection',
    title: 'PRP Cosmetic Injection',
    category: 'Face & Injectables',
    description: 'High-density platelet injection targeting delicate under-eye hollows, smile creases, or scars for natural autologous volume and repair.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    startingPrice: 180,
    currency: '£',
    procedureTime: '30 Mins',
    downtime: '12 - 24 Hours',
    badge: 'Cosmetic Injection',
    packages: [{ id: 'prp-cosmetic-injection-pkg', name: 'PRP Cosmetic Injection £180', price: 180, sessions: 1, description: 'Targeted autologous growth factor injection.', includes: ['Pure autologous growth factors', 'Cannula safety injection', 'Review'] }]
  }
];

/**
 * Helper to fetch a pricing item by ID
 */
export const getPricingItemById = (id: string): TreatmentPricingItem | undefined => {
  const searchId = id.toLowerCase().trim();
  return TREATMENT_PRICING_DATA.find((item) => item.id.toLowerCase() === searchId);
};
