import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  TREATMENT_PRICING_DATA,
  filterAndSortTreatmentCards,
  TreatmentSortOption,
} from './src/data/treatmentPricing.ts';
import { CLINIC_DATA } from './src/data/clinicInfo.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure asset storage directories exist
const uploadsDir = path.resolve(__dirname, 'public/uploads');
const publicAssetsDir = path.resolve(__dirname, 'public/assets');
const srcAssetsDir = path.resolve(__dirname, 'src/assets/images');
const distAssetsDir = path.resolve(__dirname, 'dist/assets');
const publicTreatmentsDir = path.resolve(__dirname, 'public/assets/treatments');
const srcTreatmentsDir = path.resolve(__dirname, 'src/assets/images/treatments');
const distTreatmentsDir = path.resolve(__dirname, 'dist/assets/treatments');
const publicTransformationsDir = path.resolve(__dirname, 'public/assets/transformations');
const srcTransformationsDir = path.resolve(__dirname, 'src/assets/images/transformations');
const distTransformationsDir = path.resolve(__dirname, 'dist/assets/transformations');

for (const dir of [
  uploadsDir,
  publicAssetsDir,
  srcAssetsDir,
  publicTreatmentsDir,
  srcTreatmentsDir,
  publicTransformationsDir,
  srcTransformationsDir,
]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Path to site customizations and clinic info files
const customizationsPath = path.resolve(__dirname, 'src/data/siteCustomizations.json');
const clinicInfoPath = path.resolve(__dirname, 'src/data/clinicInfo.ts');
const treatmentPricingPath = path.resolve(__dirname, 'src/data/treatmentPricing.ts');
const transformationsDataPath = path.resolve(__dirname, 'src/data/transformationsData.ts');

// ============================================================================
// TASK 5: MIRRORING FOR PRODUCTION BUILD & RUNTIME SAFETY
// ============================================================================
// Ensure assets in src/assets/images (and treatments & transformations subdirectories)
// and public/assets (Vite public) are mirrored and kept in sync bidirectionally
// so neither environment loses clinic logos, location photos, or procedure images upon server restart or build.
try {
  const mirrorPairs: Array<[string, string]> = [
    [srcAssetsDir, publicAssetsDir],
    [srcTreatmentsDir, publicTreatmentsDir],
    [srcTransformationsDir, publicTransformationsDir],
  ];

  // Read active configuration files so the duplicate-extension cleaner never deletes
  // any file actively referenced in clinicInfo.ts or siteCustomizations.json
  const activeReferenceContent = [clinicInfoPath, customizationsPath]
    .map((filePath) => {
      try {
        return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
      } catch {
        return '';
      }
    })
    .join('\n');

  const isFileActivelyReferenced = (fileName: string): boolean => {
    if (!fileName) return false;
    return activeReferenceContent.includes(fileName);
  };

  for (const [srcDir, pubDir] of mirrorPairs) {
    if (fs.existsSync(srcDir) && fs.existsSync(pubDir)) {
      const srcFiles = fs.readdirSync(srcDir);
      for (const f of srcFiles) {
        const srcFile = path.join(srcDir, f);
        const pubFile = path.join(pubDir, f);
        if (fs.statSync(srcFile).isFile() && !fs.existsSync(pubFile)) {
          fs.copyFileSync(srcFile, pubFile);
          console.log(`[Production Mirror Sync] Synced ${f} from src to public assets`);
        }
      }

      const pubFiles = fs.readdirSync(pubDir);
      for (const f of pubFiles) {
        const pubFile = path.join(pubDir, f);
        const srcFile = path.join(srcDir, f);
        if (fs.statSync(pubFile).isFile() && !fs.existsSync(srcFile)) {
          fs.copyFileSync(pubFile, srcFile);
          console.log(`[Production Mirror Sync] Synced ${f} from public to src assets`);
        }
      }

      // Purge redundant non-webp duplicate pairs ONLY in treatment/transformation subdirectories
      // and NEVER delete any file actively referenced in clinicInfo.ts or siteCustomizations.json
      const isRootGeneralAssetsPair = srcDir === srcAssetsDir || pubDir === publicAssetsDir;
      if (!isRootGeneralAssetsPair) {
        for (const dir of [pubDir, srcDir]) {
          if (fs.existsSync(dir)) {
            const allFiles = fs.readdirSync(dir);
            for (const file of allFiles) {
              const fullPath = path.join(dir, file);
              if (!fs.statSync(fullPath).isFile()) continue;
              const ext = path.extname(file).toLowerCase();
              if (ext !== '.webp') {
                if (isFileActivelyReferenced(file)) {
                  continue;
                }
                const base = path.basename(file, ext);
                if (fs.existsSync(path.join(dir, `${base}.webp`))) {
                  try {
                    fs.unlinkSync(fullPath);
                    console.log(`[Cleaner] Purged redundant duplicate file: ${file}`);
                  } catch {}
                }
              }
            }
          }
        }
      }
    }
  }
} catch (syncErr) {
  console.warn('[Production Mirror] Initial synchronization notice:', syncErr);
}

// Serve uploaded and static assets
app.use('/uploads', express.static(uploadsDir));
app.use('/assets/treatments', express.static(publicTreatmentsDir));
app.use('/assets/treatments', express.static(srcTreatmentsDir));
if (fs.existsSync(distTreatmentsDir)) {
  app.use('/assets/treatments', express.static(distTreatmentsDir));
}
// Fast 404 for missing treatment images so they never fall through to Vite SPA HTML middleware
app.use('/assets/treatments', (_req, res) => {
  res.status(404).end();
});

app.use('/assets/transformations', express.static(publicTransformationsDir));
app.use('/assets/transformations', express.static(srcTransformationsDir));
if (fs.existsSync(distTransformationsDir)) {
  app.use('/assets/transformations', express.static(distTransformationsDir));
}
// Fast 404 for missing transformation images so they never fall through to Vite SPA HTML middleware
app.use('/assets/transformations', (_req, res) => {
  res.status(404).end();
});

app.use('/assets', express.static(publicAssetsDir));
app.use('/assets', express.static(srcAssetsDir));
if (fs.existsSync(distAssetsDir)) {
  app.use('/assets', express.static(distAssetsDir));
}
app.use(express.static(path.resolve(__dirname, 'public')));

const GROUP_TO_TRANSFORMATION_CATEGORY: Record<string, string> = {
  'anti-aging': 'Regenerative Biotech',
  'acne-scarring': 'Skin Texture & Scars',
  'facial-harmony': 'Facial Rejuvenation',
  'clinical-hair': 'Hair Density',
  'body-sculpting': 'Lifting & Contouring',
  'advanced-facials': 'Skin Texture & Scars',
};

function syncTransformationsDataTs(galleryConfig: any): void {
  if (!galleryConfig || !Array.isArray(galleryConfig.categories) || !fs.existsSync(transformationsDataPath)) {
    return;
  }
  try {
    const defaultPairIds = new Set(['pair-1', 'pair-2', 'pair-3', 'pair-4', 'pair-5', 'pair-6', 'pair-7', 'pair-8']);
    const syncedCases: any[] = [];

    for (const cat of galleryConfig.categories) {
      const mappedCategory = GROUP_TO_TRANSFORMATION_CATEGORY[cat.id] || 'Facial Rejuvenation';
      for (const pair of cat.pairs || []) {
        if (!pair || pair.hidden || defaultPairIds.has(pair.id)) continue;
        syncedCases.push({
          id: pair.id,
          title: pair.title,
          category: mappedCategory,
          tag: cat.name,
          patientInfo: pair.linkedTreatmentTitle || cat.name,
          duration: pair.duration || '8 Weeks',
          sessions: pair.sessions || 1,
          concern: pair.seoTitle || `${pair.title} clinical transformation at Age Reversal Clinics.`,
          beforeImage: pair.beforeImage,
          afterImage: pair.afterImage,
          galleryImages: [pair.beforeImage, pair.afterImage],
          recommendedTreatmentIds: pair.linkedTreatmentId ? [pair.linkedTreatmentId] : ['exosome', 'profhilo'],
          recommendedProductIds: ['st-antioxidant-soothing-serum', 'st-antioxidant-matte-day-cream'],
          treatmentGroupId: pair.treatmentGroupId || cat.id,
          linkedTreatmentId: pair.linkedTreatmentId,
          beforeAltText: pair.beforeAltText,
          afterAltText: pair.afterAltText,
          seoTitle: pair.seoTitle,
          seoKeywords: pair.seoKeywords || [],
          featured: Boolean(pair.featured),
          updatedAt: pair.updatedAt || Date.now(),
        });
      }
    }

    const existingContent = fs.readFileSync(transformationsDataPath, 'utf-8');
    const startMarker = 'export const ADMIN_SYNCED_TRANSFORMATION_CASES: TransformationCase[] =';
    const endMarker = 'export function getRecommendedTreatmentsForCase';
    const startIdx = existingContent.indexOf(startMarker);
    const endIdx = existingContent.indexOf(endMarker);

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const updatedTs =
        existingContent.slice(0, startIdx) +
        `${startMarker} ${JSON.stringify(syncedCases, null, 2)};\n\n` +
        existingContent.slice(endIdx);
      fs.writeFileSync(transformationsDataPath, updatedTs, 'utf-8');
      console.log(`[Admin] Synced ${syncedCases.length} Before & After transformation case(s) to ${transformationsDataPath}`);
    }
  } catch (err) {
    console.warn('[Admin] Could not sync transformationsData.ts:', err);
  }
}

function generateTreatmentPricingTs(items: any[]): string {
  // Preserve all interfaces, projection helpers, and sub-option definitions in src/data/treatmentPricing.ts
  if (fs.existsSync(treatmentPricingPath)) {
    const existingContent = fs.readFileSync(treatmentPricingPath, 'utf-8');
    const marker = 'export const TREATMENT_PRICING_DATA: TreatmentPricingItem[] =';
    const markerIdx = existingContent.indexOf(marker);
    if (markerIdx !== -1) {
      return `${existingContent.slice(0, markerIdx)}${marker} ${JSON.stringify(items, null, 2)};\n`;
    }
  }
  return `export const TREATMENT_PRICING_DATA = ${JSON.stringify(items, null, 2)};\n`;
}

// API: Save treatment pricing data to siteCustomizations.json and src/data/treatmentPricing.ts on disk
app.post('/api/admin/treatment-pricing', (req, res) => {
  try {
    const { treatmentPricingData, data } = req.body;
    const payload = treatmentPricingData || data || req.body;
    if (!payload || !Array.isArray(payload)) {
      return res.status(400).json({ success: false, error: 'Invalid treatment pricing data. Must be an array of treatments.' });
    }

    // 1. Write directly to src/data/treatmentPricing.ts so it is baked into source control and production builds
    const tsCode = generateTreatmentPricingTs(payload);
    fs.writeFileSync(treatmentPricingPath, tsCode, 'utf-8');
    console.log(`[Admin] Successfully wrote updated code to ${treatmentPricingPath}`);

    // 2. Also persist to siteCustomizations.json
    let existing: Record<string, any> = {};
    if (fs.existsSync(customizationsPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      } catch {
        existing = {};
      }
    }

    existing.treatment_pricing_data = payload;
    existing.lastSynced = new Date().toISOString();
    fs.writeFileSync(customizationsPath, JSON.stringify(existing, null, 2), 'utf-8');

    return res.json({
      success: true,
      message: 'Treatment pricing successfully written to src/data/treatmentPricing.ts and siteCustomizations.json',
      count: payload.length,
      updatedAt: existing.lastSynced
    });
  } catch (error) {
    console.error('Error saving treatment pricing:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

function generateClinicInfoTs(data: any): string {
  return `/**
 * ============================================================================
 * CLINIC MASTER & SEO CONFIGURATION
 * ============================================================================
 * Edit this file or customize via Admin Dashboard -> Clinic Master Data.
 * Updates clinic brand, contact, credentials, locations & Google SEO structured data.
 * ============================================================================
 */

import {
  CLINIC_LOGOS,
  CLINIC_LOCATION_IMAGES,
  CLINIC_INTERIOR_PHOTOS,
  CLINIC_BANNER_IMAGES
} from './clinicImages';

export interface ClinicLocation {
  id?: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country?: string;
  phone: string;
  hours: string;
  directionsUrl?: string;
  latitude?: number;
  longitude?: number;
  parkingAvailable?: boolean;
  wheelchairAccessible?: boolean;
  image?: string;
  imageAlt?: string;
  gallery?: string[];
}

export interface ClinicWhyChooseUsPillar {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  imageUrl?: string;
}

export interface ClinicWhyChooseUsSection {
  heading: string;
  subheading?: string;
  pillars: ClinicWhyChooseUsPillar[];
}

export interface ClinicAwardItem {
  id: string;
  title: string;
  year: string;
  organization: string;
  imageUrl?: string;
}

export interface ClinicAwardsSection {
  heading: string;
  subheading?: string;
  awards: ClinicAwardItem[];
}

export interface ClinicConsultationDoctor {
  id: string;
  name: string;
  specialty?: string;
  locationIds?: string[]; // Empty or matching location IDs where this specialist practices
  availableDays?: number[]; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  timeSlots?: string[]; // e.g. ["09:30", "11:00", "14:00", "16:00"]
}

export interface ClinicConsultationOption {
  value: string;
  label: string;
}

export interface ClinicStayInTouchChannel {
  id: string; // e.g. 'email' | 'phone' | 'telephone' | 'post' | 'whatsapp' | 'sms'
  label: string;
  enabled: boolean;
}

export interface ClinicConsultationConfig {
  heading?: string;
  subheading?: string;
  specialistLabel?: string; // Default: "Preferred Specialist"
  doctors: ClinicConsultationDoctor[];
  defaultTimeSlots: string[];
  bestTimeOptions: ClinicConsultationOption[];
  hearAboutUsOptions: ClinicConsultationOption[];
  stayInTouchChannels: ClinicStayInTouchChannel[];
}

export interface ClinicData {
  name: string;
  tagline: string;
  metaDescription: string;
  canonicalUrl: string;
  brandKeywords: string[];
  ogImage: string;

  logo: {
    icon: string;
    full?: string;
    alt: string;
  };
  exteriorPhoto?: string;
  interiorPhotos?: string[];

  phone: string;
  email: string;
  whatsapp: string;
  openingHours: string;

  priceRange: string;
  currency: string;
  acceptedPayments: string[];
  languagesSpoken: string[];
  medicalSpecialties: string[];

  gmcRegistration?: string;
  cqcStatus?: string;
  accreditations: string[];

  locations: ClinicLocation[];

  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin?: string;
  };

  googleReviewUrl?: string;

  whyChooseUs?: ClinicWhyChooseUsSection;
  awardsShowcase?: ClinicAwardsSection;
  consultationConfig?: ClinicConsultationConfig;
}

export const CLINIC_DATA: ClinicData = ${JSON.stringify(data, null, 2)};

/**
 * Compatible helper mapping for components throughout the app
 */
export const CLINIC_INFO = {
  clinicName: CLINIC_DATA.name,
  tagline: CLINIC_DATA.tagline,
  metaDescription: CLINIC_DATA.metaDescription,
  primaryPhone: CLINIC_DATA.phone,
  phoneHref: \`tel:\${(CLINIC_DATA.phone || '').replace(/[^0-9+]/g, '')}\`,
  primaryEmail: CLINIC_DATA.email,
  whatsappUrl: CLINIC_DATA.whatsapp,
  googleReviewUrl: CLINIC_DATA.googleReviewUrl || 'https://search.google.com/local/writereview?placeid=ChIJ-3P3F6sEdkgRk612k05J2vM',
  welcomeMessage: \`Welcome to \${CLINIC_DATA.name}\`,
  openingHoursSummary: {
    weekdays: CLINIC_DATA.openingHours,
    saturdays: 'Sat: 10:00 – 17:00',
    sundays: 'Sun: Closed'
  },
  locations: (CLINIC_DATA.locations || []).map((loc) => ({
    ...loc,
    id: loc.id || loc.name.toLowerCase().replace(/\\s+/g, '-'),
    shortName: loc.name
  })),
  socialLinks: CLINIC_DATA.socials
};

export default CLINIC_DATA;
`;
}

// API: Read clinic data (GET /api/admin/clinic-data and alias /api/admin/clinic-info)
// Merges active default values from src/data/clinicInfo.ts with any saved overrides in siteCustomizations.json
const parseClinicDataFromTsFile = (): Record<string, any> | null => {
  if (!fs.existsSync(clinicInfoPath)) return null;
  try {
    const content = fs.readFileSync(clinicInfoPath, 'utf-8');
    const marker = 'export const CLINIC_DATA: ClinicData = ';
    const startIdx = content.indexOf(marker);
    if (startIdx === -1) return null;
    const jsonStart = content.indexOf('{', startIdx + marker.length);
    const exportClinicInfoIdx = content.indexOf('export const CLINIC_INFO', jsonStart);
    if (jsonStart === -1 || exportClinicInfoIdx === -1) return null;
    let jsonBlock = content.slice(jsonStart, exportClinicInfoIdx).trim();
    if (jsonBlock.endsWith(';')) {
      jsonBlock = jsonBlock.slice(0, -1).trim();
    }
    return JSON.parse(jsonBlock);
  } catch {
    return null;
  }
};

const getMergedClinicData = () => {
  const diskTsClinicData = parseClinicDataFromTsFile();
  const baseClinicData: Record<string, any> = {
    ...CLINIC_DATA,
    ...(diskTsClinicData || {}),
    logo: {
      ...(CLINIC_DATA.logo || {}),
      ...(diskTsClinicData?.logo || {}),
    },
    socials: {
      ...(CLINIC_DATA.socials || {}),
      ...(diskTsClinicData?.socials || {}),
    },
    consultationConfig: {
      ...(CLINIC_DATA.consultationConfig || {}),
      ...(diskTsClinicData?.consultationConfig || {}),
    },
  };

  let customClinicData: Record<string, any> | null = null;
  if (fs.existsSync(customizationsPath)) {
    try {
      const customizations = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      if (customizations.clinic_info_data && typeof customizations.clinic_info_data === 'object') {
        customClinicData = customizations.clinic_info_data;
      }
    } catch (e) {
      console.error('Error reading customizations for clinic-data:', e);
    }
  }

      const merged = customClinicData
    ? {
        ...baseClinicData,
        ...customClinicData,
        logo: {
          ...baseClinicData.logo,
          ...(customClinicData.logo || {}),
          icon: customClinicData.logo?.icon || baseClinicData.logo?.icon,
          full: customClinicData.logo?.full || baseClinicData.logo?.full,
        },
        socials: {
          ...baseClinicData.socials,
          ...(customClinicData.socials || {}),
        },
        interiorPhotos:
          Array.isArray(customClinicData.interiorPhotos) && customClinicData.interiorPhotos.length > 0
            ? customClinicData.interiorPhotos
            : baseClinicData.interiorPhotos,
        locations:
          Array.isArray(customClinicData.locations) && customClinicData.locations.length > 0
            ? customClinicData.locations
            : baseClinicData.locations,
        whyChooseUs:
          customClinicData.whyChooseUs && typeof customClinicData.whyChooseUs === 'object'
            ? {
                ...(baseClinicData.whyChooseUs || {}),
                ...customClinicData.whyChooseUs,
                pillars: Array.isArray(customClinicData.whyChooseUs.pillars)
                  ? customClinicData.whyChooseUs.pillars
                  : baseClinicData.whyChooseUs?.pillars || [],
              }
            : baseClinicData.whyChooseUs,
        awardsShowcase:
          customClinicData.awardsShowcase && typeof customClinicData.awardsShowcase === 'object'
            ? {
                ...(baseClinicData.awardsShowcase || {}),
                ...customClinicData.awardsShowcase,
                awards: Array.isArray(customClinicData.awardsShowcase.awards)
                  ? customClinicData.awardsShowcase.awards
                  : baseClinicData.awardsShowcase?.awards || [],
              }
            : baseClinicData.awardsShowcase,
        consultationConfig:
          customClinicData.consultationConfig && typeof customClinicData.consultationConfig === 'object'
            ? {
                ...(baseClinicData.consultationConfig || {}),
                ...customClinicData.consultationConfig,
                doctors: Array.isArray(customClinicData.consultationConfig.doctors)
                  ? customClinicData.consultationConfig.doctors
                  : baseClinicData.consultationConfig?.doctors || [],
                defaultTimeSlots: Array.isArray(customClinicData.consultationConfig.defaultTimeSlots)
                  ? customClinicData.consultationConfig.defaultTimeSlots
                  : baseClinicData.consultationConfig?.defaultTimeSlots || [],
                bestTimeOptions: Array.isArray(customClinicData.consultationConfig.bestTimeOptions)
                  ? customClinicData.consultationConfig.bestTimeOptions
                  : baseClinicData.consultationConfig?.bestTimeOptions || [],
                hearAboutUsOptions: Array.isArray(customClinicData.consultationConfig.hearAboutUsOptions)
                  ? customClinicData.consultationConfig.hearAboutUsOptions
                  : baseClinicData.consultationConfig?.hearAboutUsOptions || [],
                stayInTouchChannels: Array.isArray(customClinicData.consultationConfig.stayInTouchChannels)
                  ? customClinicData.consultationConfig.stayInTouchChannels
                  : baseClinicData.consultationConfig?.stayInTouchChannels || [],
              }
            : baseClinicData.consultationConfig,
      }
    : baseClinicData;

  verifyAndRepairClinicDataAssets(merged);
  return merged;
};

// Helper: Collect all normalized /assets/... URLs referenced by a clinicData object
const collectClinicDataAssetUrls = (clinicData: any): string[] => {
  if (!clinicData || typeof clinicData !== 'object') return [];

  const rawUrls: string[] = [];
  const pushIfString = (val: unknown) => {
    if (typeof val === 'string' && val.trim()) {
      const cleanPath = val.split('?')[0].split('#')[0].trim();
      if (cleanPath.startsWith('/assets/')) {
        rawUrls.push(cleanPath);
      }
    }
  };

  pushIfString(clinicData.logo?.icon);
  pushIfString(clinicData.logo?.full);
  pushIfString(clinicData.ogImage);
  pushIfString(clinicData.exteriorPhoto);

  if (Array.isArray(clinicData.interiorPhotos)) {
    for (const photo of clinicData.interiorPhotos) {
      pushIfString(photo);
    }
  }

  if (Array.isArray(clinicData.locations)) {
    for (const loc of clinicData.locations) {
      if (!loc || typeof loc !== 'object') continue;
      pushIfString(loc.image);
      if (Array.isArray(loc.gallery)) {
        for (const galleryImg of loc.gallery) {
          pushIfString(galleryImg);
        }
      }
    }
  }

  if (Array.isArray(clinicData.whyChooseUs?.pillars)) {
    for (const pillar of clinicData.whyChooseUs.pillars) {
      if (!pillar || typeof pillar !== 'object') continue;
      pushIfString(pillar.imageUrl);
    }
  }

  if (Array.isArray(clinicData.awardsShowcase?.awards)) {
    for (const award of clinicData.awardsShowcase.awards) {
      if (!award || typeof award !== 'object') continue;
      pushIfString(award.imageUrl);
    }
  }

  return rawUrls;
};

// Helper: Delete a replaced clinicInfo.ts asset file from both public/assets/ and src/assets/images/
// while ensuring it is not still referenced by another active slot in clinicInfo.ts
const deleteReplacedClinicAssetFile = (oldUrl: string, activeUrlsSet: Set<string>): boolean => {
  if (!oldUrl || typeof oldUrl !== 'string') return false;

  const cleanPath = oldUrl.split('?')[0].split('#')[0].trim();
  if (!cleanPath.startsWith('/assets/')) return false;

  // Only manage files directly under /assets/<filename> (do not touch /assets/treatments/, /assets/transformations/, or /assets/aistudio/)
  if (path.posix.dirname(cleanPath) !== '/assets') {
    return false;
  }

  const fileName = path.basename(cleanPath);
  if (!fileName) return false;

  // Ensure the file is not still referenced by another slot in clinicInfo.ts
  for (const activeUrl of activeUrlsSet) {
    const activeClean = activeUrl.split('?')[0].split('#')[0].trim();
    if (activeClean === cleanPath || path.basename(activeClean) === fileName) {
      return false;
    }
  }

  let deletedAny = false;
  for (const targetDir of [publicAssetsDir, srcAssetsDir]) {
    try {
      const targetFilePath = path.join(targetDir, fileName);
      if (fs.existsSync(targetFilePath) && fs.statSync(targetFilePath).isFile()) {
        fs.unlinkSync(targetFilePath);
        deletedAny = true;
        console.log(`[Admin Asset Cleanup] Deleted replaced clinic asset: ${targetFilePath}`);
      }
    } catch (unlinkErr) {
      console.warn(`[Admin Asset Cleanup] Could not delete ${fileName} from ${targetDir}:`, unlinkErr);
    }
  }

  return deletedAny;
};

// Helper: Inspect all image paths in clinicData and ensure any /assets/... file
// exists in both public/assets/ and src/assets/images/
const verifyAndRepairClinicDataAssets = (clinicData: any): number => {
  if (!clinicData || typeof clinicData !== 'object') return 0;

  const uniqueUrls = Array.from(new Set(collectClinicDataAssetUrls(clinicData)));
  let repairedCount = 0;

  for (const cleanPath of uniqueUrls) {
    const fileName = path.basename(cleanPath);
    if (!fileName) continue;

    let requiredDirs: string[] = [];

    if (cleanPath.startsWith('/assets/treatments/')) {
      requiredDirs = [publicTreatmentsDir, srcTreatmentsDir];
    } else if (cleanPath.startsWith('/assets/transformations/')) {
      requiredDirs = [publicTransformationsDir, srcTransformationsDir];
    } else {
      requiredDirs = [publicAssetsDir, srcAssetsDir];
    }

    const existingSourcePath = requiredDirs
      .map((dir) => path.join(dir, fileName))
      .find((candidatePath) => {
        try {
          return fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile();
        } catch {
          return false;
        }
      });

    if (!existingSourcePath) {
      console.warn(`[Admin Asset Verify] Referenced clinic asset not found on disk: ${cleanPath}`);
      continue;
    }

    for (const targetDir of requiredDirs) {
      try {
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        const targetFilePath = path.join(targetDir, fileName);
        if (!fs.existsSync(targetFilePath)) {
          fs.copyFileSync(existingSourcePath, targetFilePath);
          repairedCount++;
          console.log(`[Admin Asset Repair] Restored ${fileName} -> ${targetDir}`);
        }
      } catch (copyErr) {
        console.warn(`[Admin Asset Repair] Could not copy ${fileName} to ${targetDir}:`, copyErr);
      }
    }
  }

  return repairedCount;
};

// Handler for saving clinic data
const handleSaveClinicData = (req: any, res: any) => {
  try {
    const clinicData = req.body.clinicData || req.body;
    if (!clinicData || typeof clinicData !== 'object' || !clinicData.name) {
      return res.status(400).json({ success: false, error: 'Invalid clinicData object. Must include at least a clinic name.' });
    }

    // Collect previous clinicInfo.ts & siteCustomizations.json image URLs before overwriting
    const previousTsData = parseClinicDataFromTsFile();
    let existing: Record<string, any> = {};
    if (fs.existsSync(customizationsPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      } catch {
        existing = {};
      }
    }
    const previousUrls = new Set<string>([
      ...collectClinicDataAssetUrls(previousTsData),
      ...collectClinicDataAssetUrls(existing.clinic_info_data),
    ]);

    // 0. Auto-verify and repair all referenced clinic logo, interior, exterior, and location assets
    // between public/assets/ and src/assets/images/
    const repairedAssetCount = verifyAndRepairClinicDataAssets(clinicData);
    if (repairedAssetCount > 0) {
      console.log(`[Admin] Auto-repaired ${repairedAssetCount} missing clinic asset mirror(s) before saving clinicInfo.ts`);
    }

    // 0b. Delete any replaced or removed clinicInfo.ts assets from public/assets/ and src/assets/images/
    const activeUrlsSet = new Set<string>(collectClinicDataAssetUrls(clinicData));
    for (const oldUrl of previousUrls) {
      if (!activeUrlsSet.has(oldUrl)) {
        deleteReplacedClinicAssetFile(oldUrl, activeUrlsSet);
      }
    }

    // 1. Generate clean TypeScript code and write directly to src/data/clinicInfo.ts on disk
    const tsCode = generateClinicInfoTs(clinicData);
    fs.writeFileSync(clinicInfoPath, tsCode, 'utf-8');
    console.log(`[Admin] Successfully wrote updated code to ${clinicInfoPath}`);

    // 2. Also persist / cache to siteCustomizations.json under clinic_info_data key
    existing.clinic_info_data = clinicData;
    if (Array.isArray(clinicData.locations)) {
      if (!existing.homepage_locations_config) {
        existing.homepage_locations_config = {
          heading: "Our Locations",
          description: "Conveniently located across London, providing world-class aesthetic dermatology, diagnostic consultations, and personalized care.",
          locations: []
        };
      }
      existing.homepage_locations_config.locations = clinicData.locations.map((loc: any, idx: number) => {
        const fullAddress = [
          loc.address?.trim(),
          (loc.city && !loc.address?.toLowerCase().includes(loc.city.toLowerCase())) ? loc.city.trim() : null,
          loc.postalCode?.trim() || null
        ].filter(Boolean).join(', ');
        return {
          id: loc.id || `loc-${idx + 1}`,
          name: loc.name,
          address: fullAddress,
          hours: loc.hours,
          phone: loc.phone || clinicData.phone,
          mapsUrl: loc.directionsUrl || `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`,
          bannerType: "Clinic",
          imageUrl: loc.image || ""
        };
      });
    }

    if (clinicData.whyChooseUs && typeof clinicData.whyChooseUs === 'object') {
      existing.homepage_why_choose_us_config_v3 = {
        heading: clinicData.whyChooseUs.heading || "Why Choose Age Reversal Clinic",
        subheading: clinicData.whyChooseUs.subheading || "",
        description:
          clinicData.whyChooseUs.subheading ||
          "We combine medical excellence with state-of-the-art technology to deliver safe, natural-looking results.",
        pillars: Array.isArray(clinicData.whyChooseUs.pillars) ? clinicData.whyChooseUs.pillars : []
      };
    }

    if (clinicData.awardsShowcase && typeof clinicData.awardsShowcase === 'object') {
      existing.homepage_awards_config = {
        heading: clinicData.awardsShowcase.heading || "Awards & Clinical Recognition",
        subheading:
          clinicData.awardsShowcase.subheading ||
          "Recognized nationally and globally for excellence in clinical and aesthetic dermatology.",
        awards: Array.isArray(clinicData.awardsShowcase.awards) ? clinicData.awardsShowcase.awards : []
      };
    }

    if (clinicData.consultationConfig && typeof clinicData.consultationConfig === 'object') {
      existing.homepage_consultation_config = {
        heading: clinicData.consultationConfig.heading || "Book a Preferred Consultation",
        subheading:
          clinicData.consultationConfig.subheading ||
          "Schedule your bespoke clinical assessment with our aesthetic specialists.",
        specialistLabel: clinicData.consultationConfig.specialistLabel || "Preferred Specialist",
        doctors: Array.isArray(clinicData.consultationConfig.doctors)
          ? clinicData.consultationConfig.doctors
          : [],
        defaultTimeSlots: Array.isArray(clinicData.consultationConfig.defaultTimeSlots)
          ? clinicData.consultationConfig.defaultTimeSlots
          : [],
        bestTimeOptions: Array.isArray(clinicData.consultationConfig.bestTimeOptions)
          ? clinicData.consultationConfig.bestTimeOptions
          : [],
        hearAboutUsOptions: Array.isArray(clinicData.consultationConfig.hearAboutUsOptions)
          ? clinicData.consultationConfig.hearAboutUsOptions
          : [],
        stayInTouchChannels: Array.isArray(clinicData.consultationConfig.stayInTouchChannels)
          ? clinicData.consultationConfig.stayInTouchChannels
          : [],
      };
    }

    existing.lastSynced = new Date().toISOString();
    fs.writeFileSync(customizationsPath, JSON.stringify(existing, null, 2), 'utf-8');

    return res.json({
      success: true,
      message: 'Modifications written directly back to src/data/clinicInfo.ts and cached in siteCustomizations.json',
      clinicData,
      updatedAt: existing.lastSynced
    });
  } catch (error) {
    console.error('Error writing clinicInfo.ts:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
};

// GET /api/admin/clinic-data & GET /api/admin/clinic-info
app.get('/api/admin/clinic-data', (_req, res) => {
  try {
    const data = getMergedClinicData();
    return res.json({ success: true, clinicData: data });
  } catch (error) {
    console.error('Error getting clinic data:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/admin/clinic-info', (_req, res) => {
  try {
    const data = getMergedClinicData();
    return res.json({ success: true, clinicData: data });
  } catch (error) {
    console.error('Error getting clinic info:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// POST /api/admin/clinic-data & POST /api/admin/save-clinic-info
app.post('/api/admin/clinic-data', handleSaveClinicData);
app.post('/api/admin/save-clinic-info', handleSaveClinicData);

// Helper to resolve active treatment catalog on the server (customizations override or default TREATMENT_PRICING_DATA)
const getServerTreatmentCatalog = (): any[] => {
  let catalog: any[] = TREATMENT_PRICING_DATA;
  if (fs.existsSync(customizationsPath)) {
    try {
      const customizations = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      if (
        customizations.treatment_pricing_data &&
        Array.isArray(customizations.treatment_pricing_data) &&
        customizations.treatment_pricing_data.length > 0
      ) {
        catalog = customizations.treatment_pricing_data;
      }
    } catch {
      // fall through to default catalog
    }
  }

  // Check which treatment IDs actually have an uploaded image file in public/assets/treatments or src/assets/images/treatments
  const existingDiskFiles = new Map<string, { path: string; mtimeMs: number }>();
  for (const dir of [publicTreatmentsDir, srcTreatmentsDir, distTreatmentsDir]) {
    if (fs.existsSync(dir)) {
      try {
        for (const file of fs.readdirSync(dir)) {
          const ext = path.extname(file).toLowerCase();
          if (['.webp', '.png', '.jpg', '.jpeg', '.svg'].includes(ext)) {
            const baseId = path.basename(file, ext).toLowerCase();
            if (!existingDiskFiles.has(baseId)) {
              const stat = fs.statSync(path.join(dir, file));
              existingDiskFiles.set(baseId, {
                path: `/assets/treatments/${file}`,
                mtimeMs: Math.floor(stat.mtimeMs),
              });
            }
          }
        }
      } catch {
        // ignore
      }
    }
  }

  return catalog.map((item: any) => {
    const cleanId = String(item.id || '')
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .toLowerCase();
    const diskMatch = existingDiskFiles.get(cleanId);
    if (diskMatch) {
      return {
        ...item,
        image: diskMatch.path,
        updatedAt: item.updatedAt || diskMatch.mtimeMs,
      };
    }
    return item;
  });
};

// GET /api/admin/treatment-pricing
// Supports:
// - fields=card (projects only essential card columns + pagination metadata: totalCount, hasMore, page, offset, limit)
// - page, offset, limit (defaults to limit=10 when fields=card or pagination params are supplied)
// - category, subOptions (comma-separated or repeated), search, sort
app.get('/api/admin/treatment-pricing', (req, res) => {
  try {
    const fieldsMode = req.query.fields ? String(req.query.fields) : undefined;
    const hasPaginationParams =
      fieldsMode === 'card' ||
      req.query.page !== undefined ||
      req.query.offset !== undefined ||
      req.query.limit !== undefined ||
      req.query.category !== undefined ||
      req.query.subOptions !== undefined ||
      req.query.search !== undefined ||
      req.query.sort !== undefined;

    if (hasPaginationParams) {
      const catalog = getServerTreatmentCatalog();
      const page = req.query.page !== undefined ? Number(req.query.page) : undefined;
      const offset = req.query.offset !== undefined ? Number(req.query.offset) : undefined;
      const limit = req.query.limit !== undefined ? Number(req.query.limit) : 10;
      const category = req.query.category ? String(req.query.category) : 'All Procedures';
      const rawSubOptions = req.query.subOptions;
      const subOptions = Array.isArray(rawSubOptions)
        ? rawSubOptions.map(String).filter(Boolean)
        : typeof rawSubOptions === 'string' && rawSubOptions.trim().length > 0
        ? rawSubOptions.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const search = req.query.search ? String(req.query.search) : '';
      const sort = (req.query.sort ? String(req.query.sort) : 'featured') as TreatmentSortOption;

      const paginated = filterAndSortTreatmentCards(catalog, {
        page,
        offset,
        limit,
        category,
        subOptions,
        search,
        sort,
        fields: 'card',
      });

      return res.json({
        success: true,
        data: paginated.items,
        items: paginated.items,
        totalCount: paginated.totalCount,
        hasMore: paginated.hasMore,
        page: paginated.page,
        offset: paginated.offset,
        limit: paginated.limit,
      });
    }

    // Legacy / full admin store fetch (when no fields=card or pagination query parameters are passed)
    if (fs.existsSync(customizationsPath)) {
      const customizations = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      if (customizations.treatment_pricing_data && Array.isArray(customizations.treatment_pricing_data)) {
        return res.json({ success: true, data: customizations.treatment_pricing_data });
      }
    }
    return res.json({ success: true, data: null });
  } catch (error) {
    console.error('Error reading treatment pricing customizations:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// GET /api/admin/treatment-pricing/:id
// Single-item detail endpoint: fetches packages[], procedureTime, and downtime on demand when a specific card is clicked
app.get('/api/admin/treatment-pricing/:id', (req, res) => {
  try {
    const targetId = String(req.params.id || '').trim();
    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Missing treatment ID' });
    }

    const catalog = getServerTreatmentCatalog();
    const matched = catalog.find((item: any) => item.id === targetId);
    if (!matched) {
      return res.status(404).json({ success: false, error: `Treatment '${targetId}' not found` });
    }

    // Return the single item's package details & essential fields (excluding unrelated gallery/SEO arrays)
    const detailPayload = {
      id: matched.id,
      title: matched.title,
      category: matched.category,
      description: matched.description,
      image: matched.image,
      startingPrice: matched.startingPrice,
      currency: matched.currency || '£',
      procedureTime: matched.procedureTime,
      downtime: matched.downtime,
      badge: matched.badge,
      popular: matched.popular,
      updatedAt: matched.updatedAt,
      packages: matched.packages || [],
      coverMedia: matched.coverMedia
        ? {
            url: matched.coverMedia.url,
            altText: matched.coverMedia.altText,
            seoTitle: matched.coverMedia.seoTitle,
          }
        : undefined,
    };

    return res.json({
      success: true,
      data: detailPayload,
    });
  } catch (error) {
    console.error('Error fetching single treatment package details:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// API: Get current persisted file config
app.get('/api/admin/config', (_req, res) => {
  try {
    if (fs.existsSync(customizationsPath)) {
      const data = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      return res.json({ success: true, data });
    }
    return res.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error reading customizations:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// API: Save changes directly to source code files (Bakes into project before deployment)
app.post('/api/admin/save-to-files', (req, res) => {
  try {
    const { key, data, allConfigs } = req.body;
    let existing: Record<string, any> = {};

    if (fs.existsSync(customizationsPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      } catch {
        existing = {};
      }
    }

    if (allConfigs && typeof allConfigs === 'object') {
      existing = { ...existing, ...allConfigs };
    } else if (key && data !== undefined) {
      existing[key] = data;
    }

    // If clinic_info_data is part of this save, also bake directly into src/data/clinicInfo.ts
    if (existing.clinic_info_data && typeof existing.clinic_info_data === 'object') {
      try {
        const tsCode = generateClinicInfoTs(existing.clinic_info_data);
        fs.writeFileSync(clinicInfoPath, tsCode, 'utf-8');
        console.log(`[Admin] Also synced clinicInfo.ts via save-to-files`);
      } catch (err) {
        console.error('[Admin] Error baking clinicInfo.ts during save-to-files:', err);
      }
    }

    // If homepage_gallery_config_v6 is part of this save, also sync into src/data/transformationsData.ts
    if (existing.homepage_gallery_config_v6 && typeof existing.homepage_gallery_config_v6 === 'object') {
      syncTransformationsDataTs(existing.homepage_gallery_config_v6);
    }

    existing.lastSynced = new Date().toISOString();

    fs.writeFileSync(customizationsPath, JSON.stringify(existing, null, 2), 'utf-8');
    console.log(`[Admin] Wrote updated customizations directly to disk at ${customizationsPath}`);

    return res.json({
      success: true,
      message: 'Source files updated on disk! Your edits are saved into the codebase and will be included in the build/deployment.',
      updatedAt: existing.lastSynced
    });
  } catch (error) {
    console.error('Error writing customizations to file:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// ============================================================================
// BEFORE & AFTER GALLERY: PERSISTENCE & WEBP UPLOAD ENDPOINTS
// ============================================================================
app.get('/api/admin/before-after-gallery', (_req, res) => {
  try {
    if (fs.existsSync(customizationsPath)) {
      const existing = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      if (existing && existing.homepage_gallery_config_v6) {
        return res.json({
          success: true,
          data: existing.homepage_gallery_config_v6,
          updatedAt: existing.lastSynced || null,
        });
      }
    }
    return res.json({ success: true, data: null });
  } catch (error) {
    console.error('[Admin] Error reading Before & After gallery config:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

app.post('/api/admin/before-after-gallery', (req, res) => {
  try {
    const config = req.body?.config || req.body?.data || req.body;
    if (!config || !Array.isArray(config.categories)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Before & After gallery configuration payload.',
      });
    }

    let existing: Record<string, any> = {};
    if (fs.existsSync(customizationsPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      } catch {
        existing = {};
      }
    }

    existing.homepage_gallery_config_v6 = config;
    existing.lastSynced = new Date().toISOString();

    fs.writeFileSync(customizationsPath, JSON.stringify(existing, null, 2), 'utf-8');
    syncTransformationsDataTs(config);

    console.log(`[Admin] Persisted Before & After gallery config to siteCustomizations.json and transformationsData.ts`);
    return res.json({
      success: true,
      message: 'Before & After gallery saved to siteCustomizations.json and transformationsData.ts',
      updatedAt: existing.lastSynced,
    });
  } catch (error) {
    console.error('[Admin] Error saving Before & After gallery config:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// API: Upload a Before or After image in WebP format directly to /assets/transformations/
app.post('/api/admin/transformations/upload-image', (req, res) => {
  try {
    const { pairId, slot, fileName, dataUrl, base64, title } = req.body || {};
    if (!dataUrl && !base64) {
      return res.status(400).json({
        success: false,
        error: 'Missing image data (dataUrl or base64 required)',
      });
    }

    const rawData = dataUrl ? dataUrl.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '') : base64;
    const buffer = Buffer.from(rawData, 'base64');

    const rawBase = fileName
      ? path.basename(fileName, path.extname(fileName))
      : `${pairId || title || 'ba'}-${slot || 'image'}`;
    const safeSlug = rawBase
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const timestamp = Date.now();
    const safeWebpName = `${safeSlug}-${timestamp}.webp`;

    const publicTransformationPath = path.join(publicTransformationsDir, safeWebpName);
    const srcTransformationPath = path.join(srcTransformationsDir, safeWebpName);

    fs.writeFileSync(publicTransformationPath, buffer);
    fs.writeFileSync(srcTransformationPath, buffer);

    if (fs.existsSync(distTransformationsDir)) {
      try {
        fs.writeFileSync(path.join(distTransformationsDir, safeWebpName), buffer);
      } catch (distErr) {
        console.warn('[Admin] Could not write transformation WebP to distTransformationsDir:', distErr);
      }
    }

    const cleanUrl = `/assets/transformations/${safeWebpName}`;
    console.log(`[Admin] Saved Before & After WebP image to ${cleanUrl}`);

    return res.json({
      success: true,
      url: cleanUrl,
      rawPath: cleanUrl,
      fileName: safeWebpName,
      version: timestamp,
      message: 'Before & After WebP image saved to /assets/transformations/ successfully!',
    });
  } catch (error) {
    console.error('[Admin] Error saving transformation WebP image:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// API: Upload an asset directly into public/assets and src/assets/images
app.post('/api/admin/upload-asset', (req, res) => {
  try {
    const { fileName, dataUrl, base64, previousUrl } = req.body;
    if (!fileName || (!dataUrl && !base64)) {
      return res.status(400).json({ success: false, error: 'Missing fileName or image data' });
    }

    const rawData = dataUrl ? dataUrl.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '') : base64;
    const buffer = Buffer.from(rawData, 'base64');

    // Clean file name
    const ext = path.extname(fileName) || '.png';
    const baseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeName = `${Date.now()}-${baseName}${ext}`;
    const publicAssetPath = path.join(publicAssetsDir, safeName);
    const srcAssetPath = path.join(srcAssetsDir, safeName);

    // Save only to public/assets and src/assets/images (no duplicate copies in public/uploads)
    fs.writeFileSync(publicAssetPath, buffer);
    fs.writeFileSync(srcAssetPath, buffer);

    const newAssetUrl = `/assets/${safeName}`;

    // If replacing an existing clinicInfo.ts image, delete the displaced file from public/assets and src/assets/images
    // unless it is still referenced by another slot in clinicInfo.ts
    if (typeof previousUrl === 'string' && previousUrl.trim()) {
      const normalizedPrev = previousUrl.split('?')[0].split('#')[0].trim();
      if (normalizedPrev && normalizedPrev !== newAssetUrl) {
        const currentClinicData = parseClinicDataFromTsFile();
        const allCurrentUrls = collectClinicDataAssetUrls(currentClinicData);
        // Remove a single occurrence of normalizedPrev (representing the slot being replaced)
        const prevIdx = allCurrentUrls.indexOf(normalizedPrev);
        if (prevIdx !== -1) {
          allCurrentUrls.splice(prevIdx, 1);
        }
        const activeUrlsSet = new Set<string>([...allCurrentUrls, newAssetUrl]);
        deleteReplacedClinicAssetFile(normalizedPrev, activeUrlsSet);
      }
    }

    console.log(`[Admin] Saved asset to public/assets/${safeName} and src/assets/images/${safeName}`);

    return res.json({
      success: true,
      url: newAssetUrl,
      fileName: safeName,
      message: 'Asset saved to public/assets and src/assets/images successfully!'
    });
  } catch (error) {
    console.error('Error saving asset:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// API: List assets in src/assets/images, public/assets, and public/assets/transformations
app.get('/api/admin/assets', (_req, res) => {
  try {
    const assetsList: Array<{ name: string; url: string; size: number; mtime: string; location: string }> = [];
    const seen = new Set<string>();

    // Read public/assets/transformations & src/assets/images/transformations first
    for (const transDir of [publicTransformationsDir, srcTransformationsDir]) {
      if (fs.existsSync(transDir)) {
        const files = fs.readdirSync(transDir);
        for (const file of files) {
          const url = `/assets/transformations/${file}`;
          if (!seen.has(url)) {
            const fullPath = path.join(transDir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isFile()) {
              seen.add(url);
              assetsList.push({
                name: file,
                url,
                size: stat.size,
                mtime: stat.mtime.toISOString(),
                location: 'public/assets/transformations'
              });
            }
          }
        }
      }
    }

    // Read public/assets
    if (fs.existsSync(publicAssetsDir)) {
      const files = fs.readdirSync(publicAssetsDir);
      for (const file of files) {
        const fullPath = path.join(publicAssetsDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
          seen.add(file);
          assetsList.push({
            name: file,
            url: `/assets/${file}`,
            size: stat.size,
            mtime: stat.mtime.toISOString(),
            location: 'public/assets & src/assets/images'
          });
        }
      }
    }

    // Read src/assets/images for existing project images
    if (fs.existsSync(srcAssetsDir)) {
      const files = fs.readdirSync(srcAssetsDir);
      for (const file of files) {
        if (!seen.has(file)) {
          const fullPath = path.join(srcAssetsDir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isFile()) {
            assetsList.push({
              name: file,
              url: `/assets/${file}`,
              size: stat.size,
              mtime: stat.mtime.toISOString(),
              location: 'src/assets/images'
            });
          }
        }
      }
    }

    return res.json({ success: true, assets: assetsList });
  } catch (error) {
    console.error('Error listing assets:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// ============================================================================
// TREATMENT PRICING CARDS: ID-BASED IMAGE UPLOAD & CLEANUP
// ============================================================================
// API: Upload, replace, and clean previous images for a specific treatment ID
app.post('/api/admin/treatments/:id/image', (req, res) => {
  try {
    const rawId = req.params.id || req.body?.id;
    if (!rawId) {
      return res.status(400).json({ success: false, error: 'Missing treatment ID in request parameters' });
    }

    // Standardize treatment ID (lowercase, alphanumeric + hyphens/underscores)
    const sanitizedId = String(rawId).trim().replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const { dataUrl, base64, fileName, extension } = req.body || {};

    if (!dataUrl && !base64) {
      return res.status(400).json({ success: false, error: 'Missing image data (dataUrl or base64 required)' });
    }

    // Determine extension from explicit parameter, fileName, or data URL MIME type
    let ext = '.webp';
    if (extension) {
      ext = extension.startsWith('.') ? extension.toLowerCase() : `.${extension.toLowerCase()}`;
    } else if (fileName && path.extname(fileName)) {
      ext = path.extname(fileName).toLowerCase();
    } else if (dataUrl) {
      const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
      if (match && match[1]) {
        const mimeSub = match[1].toLowerCase();
        if (mimeSub === 'jpeg' || mimeSub === 'jpg') ext = '.jpg';
        else if (mimeSub === 'png') ext = '.png';
        else if (mimeSub === 'webp') ext = '.webp';
        else if (mimeSub === 'svg+xml') ext = '.svg';
      }
    }

    // Extract raw base64 buffer
    const rawData = dataUrl ? dataUrl.replace(/^data:image\/\w+;base64,/, '') : base64;
    const buffer = Buffer.from(rawData, 'base64');

    // 1. Scan target directories and delete any previous image matching `${sanitizedId}.*`
    // Includes public, src, and production dist directories
    const targetDirs = [publicTreatmentsDir, srcTreatmentsDir];
    if (fs.existsSync(distTreatmentsDir)) {
      targetDirs.push(distTreatmentsDir);
    }
    const deletedFiles: string[] = [];

    for (const dir of targetDirs) {
      if (fs.existsSync(dir)) {
        try {
          const files = fs.readdirSync(dir);
          for (const f of files) {
            // Delete if file starts with `${sanitizedId}.` regardless of extension (.jpg, .png, .webp, etc.)
            if (f.startsWith(`${sanitizedId}.`)) {
              const fullPath = path.join(dir, f);
              try {
                fs.unlinkSync(fullPath);
                deletedFiles.push(f);
                console.log(`[Admin] Deleted previous treatment image: ${fullPath}`);
              } catch (delErr) {
                console.warn(`[Admin] Could not delete old file ${fullPath}:`, delErr);
              }
            }
          }
        } catch (readErr) {
          console.warn(`[Admin] Error reading directory ${dir}:`, readErr);
        }
      }
    }

    // 2. Save strictly ONE single .webp image per treatment ID
    const singleFileName = `${sanitizedId}.webp`;
    const publicPath = path.join(publicTreatmentsDir, singleFileName);
    const srcPath = path.join(srcTreatmentsDir, singleFileName);

    fs.writeFileSync(publicPath, buffer);
    fs.writeFileSync(srcPath, buffer);
    if (fs.existsSync(distTreatmentsDir)) {
      try {
        fs.writeFileSync(path.join(distTreatmentsDir, singleFileName), buffer);
      } catch (distErr) {
        console.warn(`[Admin] Could not write to distTreatmentsDir:`, distErr);
      }
    }
    console.log(`[Admin] Saved single treatment .webp image: ${publicPath}`);

    const timestamp = Date.now();
    const cleanRelativePath = `/assets/treatments/${singleFileName}`;
    const cacheBustedUrl = `${cleanRelativePath}?v=${timestamp}`;

    // 3. Sync: Update siteCustomizations.json and treatmentPricing.ts if matching item exists
    try {
      let customizations: Record<string, any> = {};
      if (fs.existsSync(customizationsPath)) {
        try {
          customizations = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
        } catch {
          customizations = {};
        }
      }

      const sourceList: any[] =
        customizations.treatment_pricing_data && Array.isArray(customizations.treatment_pricing_data) && customizations.treatment_pricing_data.length > 0
          ? customizations.treatment_pricing_data
          : TREATMENT_PRICING_DATA;

      let updated = false;
      const updatedList = sourceList.map((item: any) => {
        const itemId = String(item.id || '').trim().toLowerCase();
        const normalizedItemId = itemId.replace(/[^a-zA-Z0-9_-]/g, '-');
        if (itemId === sanitizedId || normalizedItemId === sanitizedId) {
          updated = true;
          return { ...item, image: cleanRelativePath, updatedAt: timestamp };
        }
        return item;
      });

      if (updated) {
        customizations.treatment_pricing_data = updatedList;
        customizations.lastSynced = new Date().toISOString();
        fs.writeFileSync(customizationsPath, JSON.stringify(customizations, null, 2), 'utf-8');
        const tsCode = generateTreatmentPricingTs(updatedList);
        fs.writeFileSync(treatmentPricingPath, tsCode, 'utf-8');
        console.log(`[Admin] Synced updated treatment image directly into treatmentPricing.ts`);
      }
    } catch (syncErr) {
      console.warn(`[Admin] Could not sync with treatmentPricing.ts:`, syncErr);
    }

    return res.json({
      success: true,
      id: sanitizedId,
      fileName: singleFileName,
      imagePath: cacheBustedUrl,
      rawPath: cleanRelativePath,
      deletedFiles: [...new Set(deletedFiles)],
      version: timestamp,
      message: `Treatment image for '${sanitizedId}' successfully saved and previous images purged.`
    });
  } catch (error) {
    console.error('[Admin] Error saving treatment image:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// API: Query current image info for a specific treatment ID
app.get('/api/admin/treatments/:id/image', (req, res) => {
  try {
    const rawId = req.params.id;
    const sanitizedId = String(rawId).trim().replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();

    if (fs.existsSync(publicTreatmentsDir)) {
      const files = fs.readdirSync(publicTreatmentsDir);
      const matched = files.find(f => f.startsWith(`${sanitizedId}.`));
      if (matched) {
        const stat = fs.statSync(path.join(publicTreatmentsDir, matched));
        const timestamp = Math.floor(stat.mtimeMs);
        return res.json({
          success: true,
          exists: true,
          fileName: matched,
          imagePath: `/assets/treatments/${matched}?v=${timestamp}`,
          rawPath: `/assets/treatments/${matched}`,
          updatedAt: stat.mtime.toISOString(),
          version: timestamp
        });
      }
    }

    return res.json({
      success: true,
      exists: false,
      imagePath: `/assets/treatments/${sanitizedId}.webp`,
      rawPath: `/assets/treatments/${sanitizedId}.webp`
    });
  } catch (error) {
    console.error('[Admin] Error checking treatment image:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// Vite or Static file serving
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
} else {
  const distDir = path.resolve(__dirname, 'dist');
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(distDir, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Age Reversal Clinic server running on http://0.0.0.0:${PORT}`);
});
