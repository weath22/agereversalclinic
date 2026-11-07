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

// Shared Clinical Visual Assets used only when initializing a brand-new custom service slot
const SHARED_VISUALS = {
  skinPrepSerum:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCsOTiAGYh3ZwZLqmHi8Bd0PxiStRtDizSpt6aZQOiK4iam0dZNqvgoDcfmzHEkdw6mxDAltrHWXCEqzKTpdFl7drjTkTldDHYHS19rTfI3aMfrTYEaIKS6vy5bkKPtVv1Wn8FKQCPeWz0LyspMn2th2S-EoEh_TS53HeNobPGv6iVP9P9wl0AxaswPrtfge5U2Civ1crVVE43ElCUJGP4nRTvCsneftVBNtdu7FdK2Mfx34MvrZv7PdtoPppdCt08IShs0_ObNd4Ww',
  recoverySanctuary:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBSuX4N3W4HsBUVW26Q5OmLoAQ6Qb3YNjGLg-8ofLrexbiVkt9Bw3a-hZGo93hvhun_nSrHqCNi3Y5dogbCEj0SZxTRz-sOlVnxvBLspr1iawH4StCpKMYzlZa2c5iu51J2sWJaCaBH4gkePN6MKNHwqw5U0h9utD-dO4ITw_Vg6XigW_70VQLdpHS7J9wIeuS2h2KizeqPqRTBI2Gt33cgzvC1_8crav5umAayG7FFLJ6XuHbKCfKJC5Auo3j7pI-IyKcihptQMM8r',
  diagnosticCloseup:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR',
  overviewBack:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR'
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
    item.heroMedia?.url || item.imageUrl || SHARED_VISUALS.diagnosticCloseup;
  const beforeImg = item.beforeImage || primaryImage;
  const afterImg = item.afterImage || primaryImage;

  const rawFront = item.overviewMedia?.frontCard?.url
    ? item.overviewMedia.frontCard
    : item.overviewMedia?.frontImage || item.overviewMedia?.frontCard;
  const rawBack = item.overviewMedia?.backCard?.url
    ? item.overviewMedia.backCard
    : item.overviewMedia?.backImage || item.overviewMedia?.backCard;

  const frontCard: TreatmentMediaItem = {
    ...(rawFront || {
      url: primaryImage,
      mediaType: 'image',
      altText: `${item.title} clinical protocol execution closeup`,
      seoTitle: `${item.title} Focal Procedure`,
      seoKeywords: defaultSeoKeywords.slice(2, 4),
    }),
    id: rawFront?.id || getServiceComponentSlotId(serviceId, 'overview-front'),
    url: rawFront?.url || primaryImage,
  };

  const backCard: TreatmentMediaItem = {
    ...(rawBack || {
      url: SHARED_VISUALS.overviewBack,
      mediaType: 'image',
      altText: `${item.title} scientific procedural and diagnostic profile framing`,
      seoTitle: `${item.title} Diagnostic Framing`,
      seoKeywords: defaultSeoKeywords.slice(0, 2),
    }),
    id: rawBack?.id || getServiceComponentSlotId(serviceId, 'overview-back'),
    url: rawBack?.url || SHARED_VISUALS.overviewBack,
  };

  const rawPre = item.clinicalGuidanceMedia?.preCare?.url
    ? item.clinicalGuidanceMedia.preCare
    : item.clinicalGuidanceMedia?.preCareVisual || item.clinicalGuidanceMedia?.preCare;
  const rawPost = item.clinicalGuidanceMedia?.postCare?.url
    ? item.clinicalGuidanceMedia.postCare
    : item.clinicalGuidanceMedia?.postCareVisual || item.clinicalGuidanceMedia?.postCare;

  const preCareMedia: TreatmentMediaItem = {
    ...(rawPre || {
      url: SHARED_VISUALS.skinPrepSerum,
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
    url: rawPre?.url || SHARED_VISUALS.skinPrepSerum,
  };

  const postCareMedia: TreatmentMediaItem = {
    ...(rawPost || {
      url: SHARED_VISUALS.recoverySanctuary,
      mediaType: 'image',
      altText: 'Clinical Recovery Spa Sanctuary - Cellular Healing & Protection',
      seoTitle: 'Clinical Recovery Protocol',
      caption: 'Cellular Healing & Protection',
      seoKeywords: ['post-care recovery', 'cellular healing', 'clinical skin recovery'],
    }),
    id: rawPost?.id || getServiceComponentSlotId(serviceId, 'post-care'),
    url: rawPost?.url || SHARED_VISUALS.recoverySanctuary,
  };

  const rawAdditional = Array.isArray(item.additionalImages)
    ? item.additionalImages.filter(Boolean)
    : [];
  const existingPortfolioByIdOrUrl = new Map<string, TreatmentMediaItem>();
  if (Array.isArray(item.portfolioMedia)) {
    item.portfolioMedia.forEach((pm) => {
      if (pm?.url) existingPortfolioByIdOrUrl.set(pm.url, pm);
      if (pm?.id) existingPortfolioByIdOrUrl.set(pm.id, pm);
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

  return {
    ...item,
    id: serviceId,
    imageUrl: primaryImage,
    seoKeywords: defaultSeoKeywords,
    coverMedia: {
      ...(item.coverMedia || {
        url: primaryImage,
        mediaType: 'image',
        altText: `${item.title} specialized clinical protocol at Age Reversal Clinic`,
        seoTitle: item.title,
        seoKeywords: defaultSeoKeywords.slice(0, 3),
        caption: item.badgeText || 'Specialist Protocol',
      }),
      id: item.coverMedia?.id || getServiceComponentSlotId(serviceId, 'cover'),
      url: item.coverMedia?.id ? item.coverMedia.url : item.coverMedia?.url || primaryImage,
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
      url: item.heroMedia?.url || primaryImage,
    },
    overviewMedia: {
      backCard,
      backImage: backCard,
      frontCard,
      frontImage: frontCard,
    },
    targetConcernsMedia: {
      ...(item.targetConcernsMedia || {
        url: SHARED_VISUALS.diagnosticCloseup,
        mediaType: 'image',
        altText: `High-precision targeted aesthetic treatment technology for ${item.title}`,
        seoTitle: 'Targeted Bio-Calibration Diagnosis',
        caption: 'Targeted Bio-Calibration',
        seoKeywords: defaultSeoKeywords,
      }),
      id:
        item.targetConcernsMedia?.id ||
        getServiceComponentSlotId(serviceId, 'target-concerns'),
      url: item.targetConcernsMedia?.url || SHARED_VISUALS.diagnosticCloseup,
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
