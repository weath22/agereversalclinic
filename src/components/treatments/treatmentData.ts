import {
  TreatmentMediaItem,
  OverviewMediaConfig,
  ClinicalComparisonMediaConfig,
  ClinicalGuidanceMediaConfig
} from '../../types';
import { ADMIN_SYNCED_SERVICE_COMPONENTS } from '../../data/serviceComponentsData';

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

  // Clinical expectations & overview additions
  protocolQuote?: string;
  anesthesia?: string;
  longevity?: string;

  // Dermal Profiler Calibration Studio
  profilerEnabled?: boolean;
  dermalSpecs?: {
    frequency?: string;
    energy?: string;
    temperature?: string;
    mechanism?: string;
  };

  // Mirrored Before & After and custom pairs
  customBeforeAfterPairs?: Array<{
    id: string;
    beforeImage: string;
    afterImage: string;
    title: string;
    duration?: string;
    sessions?: number | string;
    beforeAltText?: string;
    afterAltText?: string;
  }>;
  excludedGalleryPairIds?: string[];

  // 6 Dedicated Component Slots (Rich Media & SEO)
  coverMedia?: TreatmentMediaItem;
  heroMedia?: TreatmentMediaItem;
  overviewMedia?: OverviewMediaConfig;
  targetConcernsMedia?: TreatmentMediaItem;
  clinicalComparisonMedia?: ClinicalComparisonMediaConfig;
  clinicalGuidanceMedia?: ClinicalGuidanceMediaConfig;
  portfolioMedia?: TreatmentMediaItem[];
  seoKeywords?: string[];
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  updatedAt?: number;
  isCustomized?: boolean;
}

/**
 * Generates a deterministic, persistent ID for a service component media slot.
 * Example: getServiceComponentSlotId('exosome', 'hero') -> 'service-exosome-hero'
 */
export function getServiceComponentSlotId(serviceId: string, slot: string): string {
  const cleanServiceId = String(serviceId || 'service')
    .trim()
    .toLowerCase()
    .replace(/@/g, '2')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'service';
  const cleanSlot = String(slot || 'media')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'media';
  return `service-${cleanServiceId}-${cleanSlot}`;
}

/**
 * Strips dummy AI/Unsplash placeholder URLs so only real uploaded or configured
 * clinical assets are rendered; empty strings trigger the brand logo placeholder.
 */
export function cleanServiceImageUrl(url?: string): string {
  const trimmed = String(url || '').trim();
  if (
    !trimmed ||
    trimmed.startsWith('https://lh3.googleusercontent.com/aida') ||
    trimmed.includes('unsplash.com')
  ) {
    return '';
  }
  return trimmed;
}

// Empty defaults so unpopulated slots display the brand logo placeholder instead of dummy photos
const SHARED_VISUALS = {
  skinPrepSerum: '',
  recoverySanctuary: '',
  diagnosticCloseup: '',
  overviewBack: ''
};

/**
 * Single Source of Truth reference pointing directly to `src/data/serviceComponentsData.ts`
 */
export const TREATMENT_DETAILS_DB: Record<string, TreatmentDetail> = ADMIN_SYNCED_SERVICE_COMPONENTS;

/**
 * Ensures any treatment record has all dedicated component media slots, deterministic IDs, and SEO fields populated
 */
export function populateTreatmentMediaDefaults(item: TreatmentDetail): TreatmentDetail {
  const serviceId =
    item.id && item.id !== 'bespoke'
      ? item.id
      : (item.title || 'service')
          .toLowerCase()
          .replace(/@/g, '2')
          .replace(/[^a-z0-9_-]+/g, '-')
          .replace(/^-+|-+$/g, '');

  const defaultSeoKeywords =
    item.seoKeywords && item.seoKeywords.length > 0
      ? item.seoKeywords
      : [
          'cellular skin regeneration',
          'anti-wrinkle clinic london',
          'collagen bio-remodeling',
          'non-surgical dermal lift',
          'medical grade pre-care protocol',
        ];

  const primaryImage =
    cleanServiceImageUrl(item.heroMedia?.url) || cleanServiceImageUrl(item.imageUrl);
  const beforeImg =
    cleanServiceImageUrl(item.clinicalComparisonMedia?.before?.url) ||
    cleanServiceImageUrl(item.beforeImage);
  const afterImg =
    cleanServiceImageUrl(item.clinicalComparisonMedia?.after?.url) ||
    cleanServiceImageUrl(item.afterImage);

  const rawFront = cleanServiceImageUrl(item.overviewMedia?.frontCard?.url)
    ? item.overviewMedia?.frontCard
    : item.overviewMedia?.frontImage || item.overviewMedia?.frontCard;
  const rawBack = cleanServiceImageUrl(item.overviewMedia?.backCard?.url)
    ? item.overviewMedia?.backCard
    : item.overviewMedia?.backImage || item.overviewMedia?.backCard;

  const frontCardUrl = cleanServiceImageUrl(rawFront?.url);
  const backCardUrl = cleanServiceImageUrl(rawBack?.url);

  const frontCard: TreatmentMediaItem = {
    ...(rawFront || {
      url: frontCardUrl,
      mediaType: 'image',
      altText: `${item.title} clinical protocol execution closeup`,
      seoTitle: `${item.title} Focal Procedure`,
      seoKeywords: defaultSeoKeywords.slice(2, 4),
    }),
    id: rawFront?.id || getServiceComponentSlotId(serviceId, 'overview-front'),
    url: frontCardUrl,
  };

  const backCard: TreatmentMediaItem = {
    ...(rawBack || {
      url: backCardUrl,
      mediaType: 'image',
      altText: `${item.title} scientific procedural and diagnostic profile framing`,
      seoTitle: `${item.title} Diagnostic Framing`,
      seoKeywords: defaultSeoKeywords.slice(0, 2),
    }),
    id: rawBack?.id || getServiceComponentSlotId(serviceId, 'overview-back'),
    url: backCardUrl,
  };

  const rawPre = cleanServiceImageUrl(item.clinicalGuidanceMedia?.preCare?.url)
    ? item.clinicalGuidanceMedia?.preCare
    : item.clinicalGuidanceMedia?.preCareVisual || item.clinicalGuidanceMedia?.preCare;
  const rawPost = cleanServiceImageUrl(item.clinicalGuidanceMedia?.postCare?.url)
    ? item.clinicalGuidanceMedia?.postCare
    : item.clinicalGuidanceMedia?.postCareVisual || item.clinicalGuidanceMedia?.postCare;

  const preCareUrl = cleanServiceImageUrl(rawPre?.url);
  const postCareUrl = cleanServiceImageUrl(rawPost?.url);

  const preCareMedia: TreatmentMediaItem = {
    ...(rawPre || {
      url: preCareUrl,
      mediaType: 'image',
      altText: 'Clinical Skin Prep Serum Application - Epidermal Prime & Hydration',
      seoTitle: 'Clinical Skin Prep Protocol',
      caption: 'Epidermal Prime & Hydration',
      seoKeywords: [
        'clinical skin prep',
        'serum application protocol',
        'medical grade pre-care protocol',
      ],
    }),
    id: rawPre?.id || getServiceComponentSlotId(serviceId, 'pre-care'),
    url: preCareUrl,
  };

  const postCareMedia: TreatmentMediaItem = {
    ...(rawPost || {
      url: postCareUrl,
      mediaType: 'image',
      altText: 'Clinical Recovery Spa Sanctuary - Cellular Healing & Protection',
      seoTitle: 'Clinical Recovery Protocol',
      caption: 'Cellular Healing & Protection',
      seoKeywords: ['post-care recovery', 'cellular healing', 'clinical skin recovery'],
    }),
    id: rawPost?.id || getServiceComponentSlotId(serviceId, 'post-care'),
    url: postCareUrl,
  };

  const rawAdditional = Array.isArray(item.additionalImages)
    ? item.additionalImages.map((u) => cleanServiceImageUrl(u)).filter(Boolean)
    : [];
  const existingPortfolioByIdOrUrl = new Map<string, TreatmentMediaItem>();
  if (Array.isArray(item.portfolioMedia)) {
    item.portfolioMedia.forEach((pm) => {
      const cleanedPmUrl = cleanServiceImageUrl(pm?.url);
      if (cleanedPmUrl) existingPortfolioByIdOrUrl.set(cleanedPmUrl, { ...pm, url: cleanedPmUrl });
      if (pm?.id) existingPortfolioByIdOrUrl.set(pm.id, { ...pm, url: cleanedPmUrl });
    });
  }

  const syncedPortfolioMedia: TreatmentMediaItem[] = rawAdditional.map((imgUrl, idx) => {
    const slotId = getServiceComponentSlotId(serviceId, `portfolio-${idx + 1}`);
    const existingMeta =
      existingPortfolioByIdOrUrl.get(imgUrl) || existingPortfolioByIdOrUrl.get(slotId);
    return {
      id: existingMeta?.id || slotId,
      url: imgUrl,
      mediaType: 'image',
      altText:
        existingMeta?.altText ||
        `${item.title} Clinical Reference Photograph #${idx + 1} at Age Reversal Clinics`,
      seoTitle:
        existingMeta?.seoTitle || `${item.title} — Reference Detail #${idx + 1}`,
      caption: existingMeta?.caption || `Reference Detail #${idx + 1}`,
      seoKeywords:
        existingMeta?.seoKeywords && existingMeta.seoKeywords.length > 0
          ? existingMeta.seoKeywords
          : [`${(item.title || 'treatment').toLowerCase()} gallery`, 'clinical portfolio london'],
    };
  });

  const coverUrl = cleanServiceImageUrl(item.coverMedia?.url) || primaryImage;
  const targetConcernsUrl = cleanServiceImageUrl(item.targetConcernsMedia?.url);

  return {
    ...item,
    id: serviceId,
    imageUrl: primaryImage,
    beforeImage: beforeImg,
    afterImage: afterImg,
    seoKeywords: defaultSeoKeywords,
    coverMedia: {
      ...(item.coverMedia || {
        url: coverUrl,
        mediaType: 'image',
        altText: `${item.title} specialized clinical protocol at Age Reversal Clinic`,
        seoTitle: item.title,
        seoKeywords: defaultSeoKeywords.slice(0, 3),
        caption: item.badgeText || 'Specialist Protocol',
      }),
      id: item.coverMedia?.id || getServiceComponentSlotId(serviceId, 'cover'),
      url: coverUrl,
    },
    heroMedia: {
      ...(item.heroMedia || {
        url: primaryImage,
        mediaType: 'image',
        altText: `${item.title} advanced clinical treatment hero presentation`,
        seoTitle: `${item.title} - Age Reversal Clinic London`,
        seoKeywords: defaultSeoKeywords,
      }),
      id: item.heroMedia?.id || getServiceComponentSlotId(serviceId, 'hero'),
      url: primaryImage,
    },
    overviewMedia: {
      backCard,
      backImage: backCard,
      frontCard,
      frontImage: frontCard,
    },
    targetConcernsMedia: {
      ...(item.targetConcernsMedia || {
        url: targetConcernsUrl,
        mediaType: 'image',
        altText: `High-precision targeted aesthetic treatment technology for ${item.title}`,
        seoTitle: 'Targeted Bio-Calibration Diagnosis',
        caption: 'Targeted Bio-Calibration',
        seoKeywords: defaultSeoKeywords,
      }),
      id:
        item.targetConcernsMedia?.id ||
        getServiceComponentSlotId(serviceId, 'target-concerns'),
      url: targetConcernsUrl,
    },
    clinicalComparisonMedia: {
      before: {
        ...(item.clinicalComparisonMedia?.before || {
          url: beforeImg,
          mediaType: 'image',
          altText: `Before ${item.title} baseline assessment photograph`,
          seoKeywords: [`before ${(item.title || '').toLowerCase()}`, defaultSeoKeywords[0]],
        }),
        id:
          item.clinicalComparisonMedia?.before?.id ||
          getServiceComponentSlotId(serviceId, 'comparison-before'),
        url: item.clinicalComparisonMedia?.before?.url || beforeImg,
      },
      after: {
        ...(item.clinicalComparisonMedia?.after || {
          url: afterImg,
          mediaType: 'image',
          altText: `After ${item.title} clinical transformation outcome photograph`,
          seoKeywords: [`after ${(item.title || '').toLowerCase()}`, defaultSeoKeywords[1]],
        }),
        id:
          item.clinicalComparisonMedia?.after?.id ||
          getServiceComponentSlotId(serviceId, 'comparison-after'),
        url: item.clinicalComparisonMedia?.after?.url || afterImg,
      },
      caseTitle:
        item.clinicalComparisonMedia?.caseTitle ||
        `Clinical Trial: ${item.title} Case Study`,
    },
    clinicalGuidanceMedia: {
      preCare: preCareMedia,
      preCareVisual: preCareMedia,
      postCare: postCareMedia,
      postCareVisual: postCareMedia,
    },
    additionalImages: rawAdditional,
    portfolioMedia: syncedPortfolioMedia,
  };
}

/**
 * Starter template used only when creating a brand-new custom service page
 */
export const DEFAULT_TREATMENT_DETAILS = (name: string): TreatmentDetail => {
  const baseItem: TreatmentDetail = {
    id: 'bespoke',
    title: `${name}`,
    category: 'Custom Bespoke Care',
    description: `Experience a premium, fully customized clinical session designed exclusively around the unique requirements of your skin. Our clinical specialists will analyze your skin barrier, hydration levels, and target goals to form an integrated, bespoke plan of action tailored exactly for you.`,
    imageUrl: SHARED_VISUALS.diagnosticCloseup,
    badgeText: 'Specialist Protocol',
    procedureTime: '45 - 60 Minutes',
    comfortLevel: 'Comfortable (Topical numbing)',
    downtime: '24 - 48 Hours',
    recommendedSessions: '3 Sessions spaced 4 weeks apart',
    concerns: [
      'General skin health preservation and barrier support',
      'Customized anti-aging and texturizing protocols',
      'Bespoke hydration infusion',
      'Individualized aesthetic goals'
    ],
    price: '£250',
    targetLayer: 'Dermis',
    targetLayerDepth: '1.5mm',
    beforeImage: '',
    afterImage: '',
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
