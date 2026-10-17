import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

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

for (const dir of [uploadsDir, publicAssetsDir, srcAssetsDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Serve uploaded and static assets
app.use('/uploads', express.static(uploadsDir));
app.use('/assets', express.static(publicAssetsDir));
app.use('/assets', express.static(srcAssetsDir));
app.use(express.static(path.resolve(__dirname, 'public')));

// Path to site customizations and clinic info files
const customizationsPath = path.resolve(__dirname, 'src/data/siteCustomizations.json');
const clinicInfoPath = path.resolve(__dirname, 'src/data/clinicInfo.ts');
const treatmentPricingPath = path.resolve(__dirname, 'src/data/treatmentPricing.ts');

function generateTreatmentPricingTs(items: any[]): string {
  return `/**
 * ============================================================================
 * TREATMENT & PRICING CATALOG (Auto-Synced from Admin Studio)
 * ============================================================================
 */

import { TreatmentMediaItem } from '../types';

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

export interface TreatmentPricingItem {
  id: string;
  title: string;
  category: TreatmentCategory;
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
  packages: PricingPackage[];
  coverMedia?: TreatmentMediaItem;
  galleryImages?: string[];
  seoKeywords?: string[];
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

export const TREATMENT_PRICING_DATA: TreatmentPricingItem[] = ${JSON.stringify(items, null, 2)};
`;
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
// Merges active default values with any saved overrides
const getMergedClinicData = () => {
  let customClinicData = null;
  if (fs.existsSync(customizationsPath)) {
    try {
      const customizations = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      if (customizations.clinic_info_data) {
        customClinicData = customizations.clinic_info_data;
      }
    } catch (e) {
      console.error('Error reading customizations for clinic-data:', e);
    }
  }

  // If no saved customization, read from clinicInfo.ts or return fallback
  if (!customClinicData && fs.existsSync(clinicInfoPath)) {
    try {
      // Return customClinicData if found in file or customizations
    } catch {
      // ignore
    }
  }

  return customClinicData;
};

// Handler for saving clinic data
const handleSaveClinicData = (req: any, res: any) => {
  try {
    const clinicData = req.body.clinicData || req.body;
    if (!clinicData || typeof clinicData !== 'object' || !clinicData.name) {
      return res.status(400).json({ success: false, error: 'Invalid clinicData object. Must include at least a clinic name.' });
    }

    // 1. Generate clean TypeScript code and write directly to src/data/clinicInfo.ts on disk
    const tsCode = generateClinicInfoTs(clinicData);
    fs.writeFileSync(clinicInfoPath, tsCode, 'utf-8');
    console.log(`[Admin] Successfully wrote updated code to ${clinicInfoPath}`);

    // 2. Also persist / cache to siteCustomizations.json under clinic_info_data key
    let existing: Record<string, any> = {};
    if (fs.existsSync(customizationsPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      } catch {
        existing = {};
      }
    }
    existing.clinic_info_data = clinicData;
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

// GET /api/admin/treatment-pricing
app.get('/api/admin/treatment-pricing', (_req, res) => {
  try {
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

// API: Upload an asset directly into public/uploads
app.post('/api/admin/upload-asset', (req, res) => {
  try {
    const { fileName, dataUrl, base64 } = req.body;
    if (!fileName || (!dataUrl && !base64)) {
      return res.status(400).json({ success: false, error: 'Missing fileName or image data' });
    }

    const rawData = dataUrl ? dataUrl.replace(/^data:image\/\w+;base64,/, '') : base64;
    const buffer = Buffer.from(rawData, 'base64');

    // Clean file name
    const ext = path.extname(fileName) || '.png';
    const baseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeName = `${Date.now()}-${baseName}${ext}`;
    const targetPath = path.join(uploadsDir, safeName);
    const publicAssetPath = path.join(publicAssetsDir, safeName);
    const srcAssetPath = path.join(srcAssetsDir, safeName);

    // Save to all target locations:
    // 1. src/assets/images for source code persistence & repository tracking
    // 2. public/assets & public/uploads for direct browser URL access
    fs.writeFileSync(targetPath, buffer);
    fs.writeFileSync(publicAssetPath, buffer);
    fs.writeFileSync(srcAssetPath, buffer);

    console.log(`[Admin] Saved asset to src/assets/images/${safeName} and public/assets/${safeName}`);

    return res.json({
      success: true,
      url: `/assets/${safeName}`,
      backupUrl: `/uploads/${safeName}`,
      fileName: safeName,
      message: 'Asset saved to src/assets/images and public/assets successfully!'
    });
  } catch (error) {
    console.error('Error saving asset:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// API: List assets in src/assets/images and public/assets
app.get('/api/admin/assets', (_req, res) => {
  try {
    const assetsList: Array<{ name: string; url: string; size: number; mtime: string; location: string }> = [];
    const seen = new Set<string>();

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
