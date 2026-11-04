import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  TREATMENT_PRICING_DATA,
  filterAndSortTreatmentCards,
  TreatmentSortOption,
  DEFAULT_TREATMENT_TAXONOMY,
  inferTreatmentSubGroup,
} from './src/data/treatmentPricing.ts';
import { CLINIC_DATA } from './src/data/clinicInfo.ts';
import { TREATMENTS, NEWS_ARTICLES, STORY_ARTICLES } from './src/data.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure asset storage directories exist (public/assets is the single source of truth)
const uploadsDir = path.resolve(__dirname, 'public/uploads');
const publicAssetsDir = path.resolve(__dirname, 'public/assets');
const distAssetsDir = path.resolve(__dirname, 'dist/assets');
const publicTreatmentsDir = path.resolve(__dirname, 'public/assets/treatments');
const distTreatmentsDir = path.resolve(__dirname, 'dist/assets/treatments');
const publicTransformationsDir = path.resolve(__dirname, 'public/assets/transformations');
const distTransformationsDir = path.resolve(__dirname, 'dist/assets/transformations');
const publicBlogDir = path.resolve(__dirname, 'public/assets/blog');
const distBlogDir = path.resolve(__dirname, 'dist/assets/blog');

for (const dir of [
  uploadsDir,
  publicAssetsDir,
  publicTreatmentsDir,
  publicTransformationsDir,
  publicBlogDir,
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
const specialistTreatmentsPath = path.resolve(__dirname, 'src/data/specialistTreatments.ts');
const dataTsPath = path.resolve(__dirname, 'src/data.ts');

// Serve uploaded and static assets from public/assets (and dist/assets in production)
app.use('/uploads', express.static(uploadsDir));
app.use('/assets/treatments', express.static(publicTreatmentsDir));
if (fs.existsSync(distTreatmentsDir)) {
  app.use('/assets/treatments', express.static(distTreatmentsDir));
}
// Fast 404 for missing treatment images so they never fall through to Vite SPA HTML middleware
app.use('/assets/treatments', (_req, res) => {
  res.status(404).end();
});

app.use('/assets/transformations', express.static(publicTransformationsDir));
if (fs.existsSync(distTransformationsDir)) {
  app.use('/assets/transformations', express.static(distTransformationsDir));
}
// Fast 404 for missing transformation images so they never fall through to Vite SPA HTML middleware
app.use('/assets/transformations', (_req, res) => {
  res.status(404).end();
});

app.use('/assets/blog', express.static(publicBlogDir));
if (fs.existsSync(distBlogDir)) {
  app.use('/assets/blog', express.static(distBlogDir));
}
// Fast 404 for missing blog cover images so they never fall through to Vite SPA HTML middleware
app.use('/assets/blog', (_req, res) => {
  res.status(404).end();
});

app.use('/assets', express.static(publicAssetsDir));
if (fs.existsSync(distAssetsDir)) {
  app.use('/assets', express.static(distAssetsDir));
}
// Fast 404 for missing clinic assets (*.webp, *.png, *.jpg, etc.) so they never fall through to Vite SPA index.html
app.use('/assets', (_req, res) => {
  res.status(404).end();
});
app.use(express.static(path.resolve(__dirname, 'public')));

const GROUP_TO_TRANSFORMATION_CATEGORY: Record<string, string> = {
  'anti-aging': 'Regenerative Biotech',
  'acne-scarring': 'Skin Texture & Scars',
  'facial-harmony': 'Facial Rejuvenation',
  'clinical-hair': 'Hair Density',
  'body-sculpting': 'Lifting & Contouring',
  'advanced-facials': 'Skin Texture & Scars',
  'botox': 'Facial Rejuvenation',
  'sweat-botox': 'Facial Rejuvenation',
  'dermal-fillers-1ml': 'Facial Rejuvenation',
  'skin-boosters': 'Regenerative Biotech',
  'polynucleotides': 'Regenerative Biotech',
  'profhilo-2ml': 'Regenerative Biotech',
  'salmon-sperm-injection': 'Regenerative Biotech',
  'exosomes': 'Regenerative Biotech',
  'sunekos': 'Regenerative Biotech',
  'jalupro': 'Regenerative Biotech',
  'lumi-eyes': 'Facial Rejuvenation',
  'hifu-face-lifting': 'Lifting & Contouring',
  'morpheus8-treatment': 'Lifting & Contouring',
  'co2-laser-from': 'Skin Texture & Scars',
  'thread-lifts': 'Lifting & Contouring',
  'lip-fillers': 'Facial Rejuvenation',
  'emface-skin-tightening-and-lifting': 'Lifting & Contouring',
  'emscuplt-body-sculpt-and-tightening': 'Lifting & Contouring',
  'buttock-sculpting-and-lifting': 'Lifting & Contouring',
  'fat-dissolving-injections': 'Lifting & Contouring',
  'vitamin-drips-and-shots': 'Regenerative Biotech',
  'platelet-rich-plasma-prp': 'Hair Density',
  'teeth-whitening': 'Facial Rejuvenation',
  'facial-skin-care': 'Skin Texture & Scars',
};

const DEFAULT_PAIR_IDS_SET = new Set(['pair-1', 'pair-2', 'pair-3', 'pair-4', 'pair-5', 'pair-6', 'pair-7', 'pair-8']);
const galleryManifestPath = path.join(publicTransformationsDir, '_gallery_manifest.json');

function isUnmodifiedDefaultPairObj(pair: any): boolean {
  if (!pair || !DEFAULT_PAIR_IDS_SET.has(String(pair.id || ''))) return false;
  if (pair.updatedAt) return false;
  if (pair.singleFrameImage) return false;
  const before = String(pair.beforeImage || '');
  const after = String(pair.afterImage || '');
  const isDefaultBefore = !before || before.startsWith('https://lh3.googleusercontent.com/aida');
  const isDefaultAfter = !after || after.startsWith('https://lh3.googleusercontent.com/aida');
  return isDefaultBefore && isDefaultAfter;
}

function sanitizePairIdForFile(pairId: string): string {
  return String(pairId || 'pair')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readGalleryManifestFromDisk(): any | null {
  try {
    if (fs.existsSync(galleryManifestPath)) {
      const parsed = JSON.parse(fs.readFileSync(galleryManifestPath, 'utf-8'));
      if (parsed && Array.isArray(parsed.categories)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Admin] Could not read _gallery_manifest.json:', err);
  }
  return null;
}

function writeGalleryManifestToDisk(galleryConfig: any): void {
  if (!galleryConfig || !Array.isArray(galleryConfig.categories)) return;
  try {
    if (!fs.existsSync(publicTransformationsDir)) {
      fs.mkdirSync(publicTransformationsDir, { recursive: true });
    }
    writeFileAtomicallySync(galleryManifestPath, JSON.stringify(galleryConfig, null, 2));
  } catch (err) {
    console.warn('[Admin] Could not write _gallery_manifest.json:', err);
  }
}

/**
 * Resolves a pair's before/after image URL against physical files on disk in /public/assets/transformations/ or /public/assets/.
 * Priority:
 * 1. If a deterministic file `${cleanPairId}-${slot}.webp` exists on disk, prefer it over placeholders or missing files.
 * 2. If `currentUrl` is a local `/assets/...` URL that exists on disk, return it with cache-busting `?v=${mtime}`.
 * 3. Check timestamped or slug-based `.webp` files in `/public/assets/transformations/`.
 */
function resolveDiskTransformationImage(
  pairId: string,
  slot: 'before' | 'after' | 'single',
  currentUrl?: string,
  titleOrSlug?: string
): string {
  const rawUrl = String(currentUrl || '').trim();
  const cleanPairId = sanitizePairIdForFile(pairId);

  try {
    if (!fs.existsSync(publicTransformationsDir)) {
      return rawUrl;
    }

    const deterministicName = `${cleanPairId}-${slot}.webp`;
    const deterministicPath = path.join(publicTransformationsDir, deterministicName);
    const hasDeterministicFile = Boolean(cleanPairId && fs.existsSync(deterministicPath));

    // 1. If rawUrl already points to a local /assets/ file, verify it exists on disk
    if (rawUrl.startsWith('/assets/')) {
      const cleanPathOnly = rawUrl.split('?')[0].split('#')[0];
      const relativeFromAssets = cleanPathOnly.replace(/^\/assets\/+/, '');
      const diskPath = path.join(publicAssetsDir, relativeFromAssets);
      if (fs.existsSync(diskPath)) {
        const mtime = Math.floor(fs.statSync(diskPath).mtimeMs);
        // If deterministic slot file also exists and is newer than a different referenced file, use deterministic
        if (hasDeterministicFile && path.resolve(diskPath) !== path.resolve(deterministicPath)) {
          const detMtime = Math.floor(fs.statSync(deterministicPath).mtimeMs);
          if (detMtime > mtime) {
            return `/assets/transformations/${deterministicName}?v=${detMtime}`;
          }
        }
        return rawUrl.includes('?v=') ? rawUrl : `${cleanPathOnly}?v=${mtime}`;
      }
    }

    // 2. If deterministic file `${cleanPairId}-${slot}.webp` exists on disk, ALWAYS recover it
    // when rawUrl is empty, a default Google placeholder, or a missing /assets/ file
    const isCurrentPlaceholderOrMissingLocal =
      !rawUrl ||
      rawUrl.startsWith('https://lh3.googleusercontent.com/aida') ||
      rawUrl.startsWith('/assets/');

    if (hasDeterministicFile && isCurrentPlaceholderOrMissingLocal) {
      const mtime = Math.floor(fs.statSync(deterministicPath).mtimeMs);
      return `/assets/transformations/${deterministicName}?v=${mtime}`;
    }

    // 3. Fallback: check if any file in publicTransformationsDir matches `${cleanPairId}-${slot}-*.webp` or `ba-${slug}-${slot}*.webp`
    if (isCurrentPlaceholderOrMissingLocal) {
      const allFiles = fs.readdirSync(publicTransformationsDir).filter((f) =>
        f.toLowerCase().endsWith('.webp')
      );
      const prefixes: string[] = [];
      if (cleanPairId) {
        prefixes.push(`${cleanPairId}-${slot}-`);
        prefixes.push(`ba-${cleanPairId}-${slot}`);
      }
      if (titleOrSlug) {
        const cleanSlug = sanitizePairIdForFile(titleOrSlug);
        if (cleanSlug) {
          prefixes.push(`ba-${cleanSlug}-${slot}`);
          prefixes.push(`${cleanSlug}-${slot}`);
        }
      }

      if (prefixes.length > 0) {
        const matching = allFiles
          .filter((f) => {
            const lower = f.toLowerCase();
            return prefixes.some((pref) => lower.startsWith(pref));
          })
          .map((f) => ({
            name: f,
            mtime: Math.floor(fs.statSync(path.join(publicTransformationsDir, f)).mtimeMs),
          }))
          .sort((a, b) => b.mtime - a.mtime);

        if (matching.length > 0) {
          return `/assets/transformations/${matching[0].name}?v=${matching[0].mtime}`;
        }
      }
    }
  } catch (err) {
    console.warn('[Admin] Error resolving disk transformation image:', err);
  }

  return rawUrl;
}

/**
 * Parses `ADMIN_SYNCED_TRANSFORMATION_CASES` from `/src/data/transformationsData.ts` on disk
 * so any copy/pasted updates to transformationsData.ts are immediately recognized.
 */
function readTransformationsFromTsDisk(): any[] {
  if (!fs.existsSync(transformationsDataPath)) return [];
  try {
    const content = fs.readFileSync(transformationsDataPath, 'utf-8');
    const startMarker = 'export const ADMIN_SYNCED_TRANSFORMATION_CASES: TransformationCase[] =';
    const endMarker = 'export function getRecommendedTreatmentsForCase';
    const startIdx = content.indexOf(startMarker);
    const endIdx = content.indexOf(endMarker);
    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return [];

    let jsonText = content.slice(startIdx + startMarker.length, endIdx).trim();
    if (jsonText.endsWith(';')) {
      jsonText = jsonText.slice(0, -1).trim();
    }
    const parsed = JSON.parse(jsonText);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[Admin] Could not parse ADMIN_SYNCED_TRANSFORMATION_CASES from transformationsData.ts:', err);
    return [];
  }
}

function caseToBeforeAfterPair(tc: any): any {
  const id = String(tc.id || `pair-${Date.now()}`);
  const groupId = String(tc.treatmentGroupId || tc.linkedTreatmentId || 'facial-skin-care');
  const beforeImage = resolveDiskTransformationImage(
    id,
    'before',
    tc.beforeImage,
    tc.linkedTreatmentTitle || tc.title
  );
  const afterImage = resolveDiskTransformationImage(
    id,
    'after',
    tc.afterImage,
    tc.linkedTreatmentTitle || tc.title
  );
  const singleFrameImage = resolveDiskTransformationImage(
    id,
    'single',
    tc.singleFrameImage,
    tc.linkedTreatmentTitle || tc.title
  );
  return {
    id,
    title: tc.title || 'Clinical Transformation',
    treatmentGroupId: groupId,
    linkedTreatmentId: tc.linkedTreatmentId || groupId,
    linkedTreatmentTitle: tc.linkedTreatmentTitle || tc.patientInfo || tc.tag || '',
    beforeImage,
    afterImage,
    singleFrameImage: singleFrameImage || undefined,
    beforeAltText: tc.beforeAltText || `${tc.title || 'Clinical'} Before Treatment at Age Reversal Clinics London`,
    afterAltText: tc.afterAltText || `${tc.title || 'Clinical'} After Treatment Result at Age Reversal Clinics London`,
    singleFrameAltText:
      tc.singleFrameAltText ||
      `${tc.title || 'Clinical'} Before & After Transformation at Age Reversal Clinics London`,
    seoTitle: tc.seoTitle || tc.concern || `${tc.title || 'Clinical'} — Before & After Result | Age Reversal Clinics`,
    seoKeywords: Array.isArray(tc.seoKeywords) ? tc.seoKeywords : [],
    duration: tc.duration || '8 Weeks',
    sessions: typeof tc.sessions === 'number' ? tc.sessions : 1,
    featured: Boolean(tc.featured),
    hidden: Boolean(tc.hidden),
    updatedAt: tc.updatedAt || Date.now(),
  };
}

function scoreBeforeAfterPairCompleteness(pair: any): number {
  if (!pair) return 0;
  let score = 0;
  const before = String(pair.beforeImage || '');
  const after = String(pair.afterImage || '');
  const single = String(pair.singleFrameImage || '');
  if (before.startsWith('/assets/transformations/') || before.startsWith('/assets/')) score += 50;
  else if (before && !before.startsWith('https://lh3.googleusercontent.com/aida')) score += 25;
  if (after.startsWith('/assets/transformations/') || after.startsWith('/assets/')) score += 50;
  else if (after && !after.startsWith('https://lh3.googleusercontent.com/aida')) score += 25;
  if (single.startsWith('/assets/transformations/') || single.startsWith('/assets/')) score += 50;
  else if (single) score += 25;
  if (pair.updatedAt) score += 10;
  return score;
}

/**
 * Reconciles Before & After gallery config across:
 * 1) incomingConfig (from client or siteCustomizations.json)
 * 2) existingJsonConfig (from siteCustomizations.json on disk)
 * 3) manifestConfig (from /public/assets/transformations/_gallery_manifest.json on disk)
 * 4) ADMIN_SYNCED_TRANSFORMATION_CASES (from transformationsData.ts on disk)
 * 5) physical .webp files in /public/assets/transformations/
 */
function reconcileBeforeAfterGalleryConfig(
  incomingConfig: any,
  existingJsonConfig?: any,
  options?: boolean | { allowDeletions?: boolean; deletedPairIds?: string[]; restoredDefaults?: boolean }
): any {
  const opts =
    typeof options === 'boolean'
      ? { allowDeletions: options, deletedPairIds: [], restoredDefaults: false }
      : options || {};
  const explicitDeletedIds = new Set<string>(
    Array.isArray(opts.deletedPairIds) ? opts.deletedPairIds.map(String) : []
  );

  const manifestConfig = readGalleryManifestFromDisk();
  const diskCases = readTransformationsFromTsDisk();

  const baseConfig =
    incomingConfig && Array.isArray(incomingConfig.categories) && incomingConfig.categories.length > 0
      ? incomingConfig
      : existingJsonConfig && Array.isArray(existingJsonConfig.categories) && existingJsonConfig.categories.length > 0
      ? existingJsonConfig
      : manifestConfig && Array.isArray(manifestConfig.categories) && manifestConfig.categories.length > 0
      ? manifestConfig
      : {
          heading: 'Visible Transformations',
          description: 'Explore our curated gallery of real patient results.',
          categories: [],
        };

  const tsMtime = fs.existsSync(transformationsDataPath)
    ? fs.statSync(transformationsDataPath).mtimeMs
    : 0;
  const jsonMtime = fs.existsSync(customizationsPath)
    ? fs.statSync(customizationsPath).mtimeMs
    : 0;
  const preferTsOnTie = tsMtime > jsonMtime + 500;

  // Map all categories in order
  const categoryMap = new Map<string, { id: string; name: string; pairs: any[] }>();
  for (const sourceCfg of [baseConfig, existingJsonConfig, manifestConfig]) {
    for (const cat of sourceCfg?.categories || []) {
      if (!cat || !cat.id) continue;
      if (!categoryMap.has(String(cat.id))) {
        categoryMap.set(String(cat.id), {
          id: String(cat.id),
          name: String(cat.name || cat.id),
          pairs: [],
        });
      }
    }
  }

  // Build map of incoming pairs
  const incomingPairsById = new Map<string, { pair: any; groupId: string }>();
  for (const cat of incomingConfig?.categories || []) {
    if (!cat) continue;
    for (const p of cat.pairs || []) {
      if (!p || !p.id) continue;
      const pairId = String(p.id);
      if (explicitDeletedIds.has(pairId)) continue;
      const groupId = String(p.treatmentGroupId || cat.id);
      incomingPairsById.set(pairId, { pair: p, groupId });
    }
  }

  // Build map of existing JSON pairs
  const existingPairsById = new Map<string, { pair: any; groupId: string }>();
  for (const cat of existingJsonConfig?.categories || []) {
    if (!cat) continue;
    for (const p of cat.pairs || []) {
      if (!p || !p.id) continue;
      const pairId = String(p.id);
      if (explicitDeletedIds.has(pairId)) continue;
      const groupId = String(p.treatmentGroupId || cat.id);
      existingPairsById.set(pairId, { pair: p, groupId });
    }
  }

  // Build map of disk manifest pairs
  const manifestPairsById = new Map<string, { pair: any; groupId: string }>();
  for (const cat of manifestConfig?.categories || []) {
    if (!cat) continue;
    for (const p of cat.pairs || []) {
      if (!p || !p.id) continue;
      const pairId = String(p.id);
      if (explicitDeletedIds.has(pairId)) continue;
      const groupId = String(p.treatmentGroupId || cat.id);
      manifestPairsById.set(pairId, { pair: p, groupId });
    }
  }

  // Build map of TS disk cases
  const tsPairsById = new Map<string, { pair: any; groupId: string }>();
  for (const tc of diskCases) {
    if (!tc || !tc.id) continue;
    const pairId = String(tc.id);
    if (explicitDeletedIds.has(pairId)) continue;
    const converted = caseToBeforeAfterPair(tc);
    tsPairsById.set(pairId, {
      pair: converted,
      groupId: String(converted.treatmentGroupId || 'facial-skin-care'),
    });
  }

  // Auto-discover any orphaned `*-before.webp` / `*-after.webp` pairs on disk in /public/assets/transformations/
  const diskOrphanPairsById = new Map<string, { pair: any; groupId: string }>();
  if (fs.existsSync(publicTransformationsDir)) {
    try {
      const files = fs.readdirSync(publicTransformationsDir);
      const discoveredIds = new Set<string>();
      for (const f of files) {
        const match = f.match(/^(.+)-(before|after|single)\.webp$/i);
        if (match && match[1]) {
          discoveredIds.add(match[1]);
        }
      }
      const defaultPairGroupMap: Record<string, string> = {
        'pair-1': 'facial-skin-care',
        'pair-2': 'co2-laser-from',
        'pair-3': 'dermal-fillers-1ml',
        'pair-4': 'platelet-rich-plasma-prp',
        'pair-5': 'profhilo-2ml',
        'pair-6': 'salmon-sperm-injection',
        'pair-7': 'morpheus8-treatment',
        'pair-8': 'emface-skin-tightening-and-lifting',
      };
      for (const discId of discoveredIds) {
        if (explicitDeletedIds.has(discId)) continue;
        if (
          !incomingPairsById.has(discId) &&
          !existingPairsById.has(discId) &&
          !manifestPairsById.has(discId) &&
          !tsPairsById.has(discId)
        ) {
          const beforeUrl = resolveDiskTransformationImage(discId, 'before', '');
          const afterUrl = resolveDiskTransformationImage(discId, 'after', '');
          const singleUrl = resolveDiskTransformationImage(discId, 'single', '');
          if (beforeUrl || afterUrl || singleUrl) {
            const gId = defaultPairGroupMap[discId] || 'facial-skin-care';
            diskOrphanPairsById.set(discId, {
              groupId: gId,
              pair: {
                id: discId,
                title: 'Clinical Transformation',
                treatmentGroupId: gId,
                linkedTreatmentId: gId,
                linkedTreatmentTitle: '',
                beforeImage: beforeUrl,
                afterImage: afterUrl,
                singleFrameImage: singleUrl || undefined,
                duration: '8 Weeks',
                sessions: 1,
                featured: false,
                hidden: false,
                updatedAt: Date.now(),
              },
            });
          }
        }
      }
    } catch (scanErr) {
      console.warn('[Admin] Could not scan /public/assets/transformations/ for pairs:', scanErr);
    }
  }

  // Always keep the union of all known pairs unless explicitly in deletedPairIds
  const allPairIds = new Set<string>();
  incomingPairsById.forEach((_, id) => allPairIds.add(id));
  existingPairsById.forEach((_, id) => allPairIds.add(id));
  manifestPairsById.forEach((_, id) => allPairIds.add(id));
  tsPairsById.forEach((_, id) => allPairIds.add(id));
  diskOrphanPairsById.forEach((_, id) => allPairIds.add(id));

  for (const pairId of allPairIds) {
    if (explicitDeletedIds.has(pairId)) continue;

    const inc = incomingPairsById.get(pairId);
    const ex = existingPairsById.get(pairId);
    const mf = manifestPairsById.get(pairId);
    const ts = tsPairsById.get(pairId);
    const orphan = diskOrphanPairsById.get(pairId);

    // Choose best version of this pair
    let chosen = inc?.pair || ex?.pair || mf?.pair || ts?.pair || orphan?.pair;
    let chosenGroupId =
      inc?.groupId || ex?.groupId || mf?.groupId || ts?.groupId || orphan?.groupId || 'facial-skin-care';

    const candidates = [inc, ex, mf, ts, orphan].filter(Boolean) as Array<{ pair: any; groupId: string }>;
    if (candidates.length > 1) {
      for (const cand of candidates) {
        const chosenScore = scoreBeforeAfterPairCompleteness(chosen);
        const candScore = scoreBeforeAfterPairCompleteness(cand.pair);
        const chosenTime = Number(chosen?.updatedAt || 0);
        const candTime = Number(cand.pair?.updatedAt || 0);

        if (isUnmodifiedDefaultPairObj(chosen) && !isUnmodifiedDefaultPairObj(cand.pair)) {
          chosen = cand.pair;
          chosenGroupId = cand.groupId;
        } else if (candScore > chosenScore && candTime >= chosenTime) {
          chosen = cand.pair;
          chosenGroupId = cand.groupId;
        } else if (candScore > chosenScore && isUnmodifiedDefaultPairObj(chosen)) {
          chosen = cand.pair;
          chosenGroupId = cand.groupId;
        } else if (candTime > chosenTime && !isUnmodifiedDefaultPairObj(cand.pair)) {
          chosen = cand.pair;
          chosenGroupId = cand.groupId;
        }
      }

      if (preferTsOnTie && ts && !isUnmodifiedDefaultPairObj(ts.pair)) {
        const tsScore = scoreBeforeAfterPairCompleteness(ts.pair);
        const chosenScore = scoreBeforeAfterPairCompleteness(chosen);
        if (tsScore >= chosenScore) {
          chosen = { ...chosen, ...ts.pair };
          chosenGroupId = ts.groupId || chosenGroupId;
        }
      }
    }

    const allBeforeUrls = [
      chosen?.beforeImage,
      inc?.pair?.beforeImage,
      ex?.pair?.beforeImage,
      mf?.pair?.beforeImage,
      ts?.pair?.beforeImage,
      orphan?.pair?.beforeImage,
    ];
    const allAfterUrls = [
      chosen?.afterImage,
      inc?.pair?.afterImage,
      ex?.pair?.afterImage,
      mf?.pair?.afterImage,
      ts?.pair?.afterImage,
      orphan?.pair?.afterImage,
    ];
    const allSingleUrls = [
      chosen?.singleFrameImage,
      inc?.pair?.singleFrameImage,
      ex?.pair?.singleFrameImage,
      mf?.pair?.singleFrameImage,
      ts?.pair?.singleFrameImage,
      orphan?.pair?.singleFrameImage,
    ];

    // Preserve local /assets/transformations/ or /assets/ images if another candidate had them and chosen had a placeholder
    const bestBefore =
      allBeforeUrls.find((u) => String(u || '').startsWith('/assets/transformations/')) ||
      allBeforeUrls.find((u) => String(u || '').startsWith('/assets/')) ||
      allBeforeUrls.find((u) => u && !String(u).startsWith('https://lh3.googleusercontent.com/aida')) ||
      chosen?.beforeImage ||
      '';

    const bestAfter =
      allAfterUrls.find((u) => String(u || '').startsWith('/assets/transformations/')) ||
      allAfterUrls.find((u) => String(u || '').startsWith('/assets/')) ||
      allAfterUrls.find((u) => u && !String(u).startsWith('https://lh3.googleusercontent.com/aida')) ||
      chosen?.afterImage ||
      '';

    const bestSingle =
      allSingleUrls.find((u) => String(u || '').startsWith('/assets/transformations/')) ||
      allSingleUrls.find((u) => String(u || '').startsWith('/assets/')) ||
      allSingleUrls.find((u) => Boolean(u)) ||
      chosen?.singleFrameImage ||
      '';

    const titleHint = chosen?.linkedTreatmentTitle || chosen?.title || '';
    const resolvedBefore = resolveDiskTransformationImage(pairId, 'before', bestBefore, titleHint);
    const resolvedAfter = resolveDiskTransformationImage(pairId, 'after', bestAfter, titleHint);
    const resolvedSingle = resolveDiskTransformationImage(pairId, 'single', bestSingle, titleHint);

    const targetGroupId = String(chosen?.treatmentGroupId || chosenGroupId || 'facial-skin-care');
    if (!categoryMap.has(targetGroupId)) {
      categoryMap.set(targetGroupId, {
        id: targetGroupId,
        name: chosen?.linkedTreatmentTitle || targetGroupId,
        pairs: [],
      });
    }

    const hasResolvedCustomImage =
      resolvedBefore.startsWith('/assets/') ||
      resolvedAfter.startsWith('/assets/') ||
      resolvedSingle.startsWith('/assets/');

    const finalPair = {
      ...chosen,
      id: pairId,
      treatmentGroupId: targetGroupId,
      beforeImage: resolvedBefore,
      afterImage: resolvedAfter,
      singleFrameImage: resolvedSingle || undefined,
      singleFrameAltText:
        chosen?.singleFrameAltText ||
        inc?.pair?.singleFrameAltText ||
        ex?.pair?.singleFrameAltText ||
        mf?.pair?.singleFrameAltText ||
        ts?.pair?.singleFrameAltText ||
        undefined,
      updatedAt: chosen?.updatedAt || (hasResolvedCustomImage ? Date.now() : undefined),
    };

    categoryMap.get(targetGroupId)!.pairs.push(finalPair);
  }

  return {
    heading: baseConfig.heading || 'Visible Transformations',
    description:
      baseConfig.description ||
      'Explore our curated gallery of real patient results. Slide to compare before and after clinical treatments.',
    categories: Array.from(categoryMap.values()),
  };
}

function syncTransformationsDataTs(galleryConfig: any): void {
  if (!galleryConfig || !Array.isArray(galleryConfig.categories)) {
    return;
  }

  // Always keep the persistent manifest in /public/assets/transformations/_gallery_manifest.json in sync
  writeGalleryManifestToDisk(galleryConfig);

  if (!fs.existsSync(transformationsDataPath)) {
    return;
  }
  try {
    const syncedCases: any[] = [];
    const seenIds = new Set<string>();

    for (const cat of galleryConfig.categories) {
      const mappedCategory = GROUP_TO_TRANSFORMATION_CATEGORY[cat.id] || 'Facial Rejuvenation';
      for (const pair of cat.pairs || []) {
        if (!pair || !pair.id || seenIds.has(pair.id)) continue;
        seenIds.add(pair.id);

        const titleHint = pair.linkedTreatmentTitle || pair.title || '';
        const resolvedBefore = resolveDiskTransformationImage(pair.id, 'before', pair.beforeImage, titleHint);
        const resolvedAfter = resolveDiskTransformationImage(pair.id, 'after', pair.afterImage, titleHint);
        const resolvedSingle = resolveDiskTransformationImage(
          pair.id,
          'single',
          pair.singleFrameImage,
          titleHint
        );

        syncedCases.push({
          id: pair.id,
          title: pair.title,
          category: mappedCategory,
          tag: cat.name || pair.linkedTreatmentTitle || 'Clinical Transformation',
          patientInfo: pair.linkedTreatmentTitle || cat.name || 'Clinical Transformation',
          duration: pair.duration || '8 Weeks',
          sessions: pair.sessions || 1,
          concern: pair.seoTitle || `${pair.title} clinical transformation at Age Reversal Clinics.`,
          beforeImage: resolvedBefore,
          afterImage: resolvedAfter,
          singleFrameImage: resolvedSingle || undefined,
          galleryImages: resolvedSingle ? [resolvedSingle] : [resolvedBefore, resolvedAfter].filter(Boolean),
          recommendedTreatmentIds: pair.linkedTreatmentId ? [pair.linkedTreatmentId] : ['exosome', 'profhilo'],
          recommendedProductIds: ['st-antioxidant-soothing-serum', 'st-antioxidant-matte-day-cream'],
          treatmentGroupId: pair.treatmentGroupId || cat.id,
          linkedTreatmentId: pair.linkedTreatmentId || cat.id,
          linkedTreatmentTitle: pair.linkedTreatmentTitle || cat.name,
          beforeAltText: pair.beforeAltText,
          afterAltText: pair.afterAltText,
          singleFrameAltText: pair.singleFrameAltText,
          seoTitle: pair.seoTitle,
          seoKeywords: pair.seoKeywords || [],
          featured: Boolean(pair.featured),
          hidden: Boolean(pair.hidden),
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
      if (updatedTs !== existingContent) {
        writeFileAtomicallySync(transformationsDataPath, updatedTs);
        console.log(`[Admin] Synced ${syncedCases.length} Before & After transformation case(s) to ${transformationsDataPath}`);
      }
    }
  } catch (err) {
    console.warn('[Admin] Could not sync transformationsData.ts:', err);
  }
}

const TRANSFORMATION_SLUG_TO_DISPLAY: Record<string, string> = {
  'anti-aging': 'Regenerative Biotech',
  'acne-scarring': 'Skin Texture & Scars',
  'facial-harmony': 'Facial Rejuvenation',
  'clinical-hair': 'Hair Density',
  'body-sculpting': 'Lifting & Contouring',
  'advanced-facials': 'Skin Texture & Scars',
};

function syncSpecialistTreatmentsTs(services: any[]): void {
  if (!Array.isArray(services) || services.length === 0 || !fs.existsSync(specialistTreatmentsPath)) {
    return;
  }
  try {
    const existingContent = fs.readFileSync(specialistTreatmentsPath, 'utf-8');
    const startMarker = 'const RAW_SPECIALIST_TREATMENTS: SpecialistTreatment[] =';
    const endMarker = 'export function enrichSpecialistTreatment';
    const startIdx = existingContent.indexOf(startMarker);
    const endIdx = existingContent.indexOf(endMarker);

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const cleanedItems = services.map((s: any) => {
        const pricingCat = s.pricingCategory || s.category || 'Face & Injectables';
        const rawTransCat = s.transformationCategory || 'Facial Rejuvenation';
        const transformationCategory = TRANSFORMATION_SLUG_TO_DISPLAY[rawTransCat] || rawTransCat;
        return {
          id: s.id,
          title: s.title,
          category: pricingCat,
          pricingCategory: pricingCat,
          transformationCategory,
          description: s.description || '',
          image: s.image || '',
          badge: s.badge || pricingCat,
          duration: s.duration || '45 mins',
          ...(s.coverMedia ? { coverMedia: s.coverMedia } : {}),
          ...(Array.isArray(s.seoKeywords) && s.seoKeywords.length > 0 ? { seoKeywords: s.seoKeywords } : {}),
        };
      });

      const updatedTs =
        existingContent.slice(0, startIdx) +
        `${startMarker} ${JSON.stringify(cleanedItems, null, 2)};\n\n` +
        existingContent.slice(endIdx);
      if (updatedTs !== existingContent) {
        fs.writeFileSync(specialistTreatmentsPath, updatedTs, 'utf-8');
        console.log(`[Admin] Synced ${cleanedItems.length} specialist services (and images) to ${specialistTreatmentsPath}`);
      }
    }
  } catch (err) {
    console.warn('[Admin] Could not sync specialistTreatments.ts:', err);
  }
}

/**
 * Exact 10-column projection for Homepage Treatments bento cards:
 * (id, name, stepNumber, tag, duration, description, image, imageAlt, seoTitle, seoKeywords)
 */
function projectServerHomepageTreatmentCard(item: any, idx: number = 0) {
  const fallbackSeed =
    TREATMENTS.find(
      (t: any) =>
        t.id === item?.id ||
        String(t.name || '').toLowerCase() === String(item?.name || item?.title || '').toLowerCase()
    ) || TREATMENTS[idx % Math.max(1, TREATMENTS.length)];

  const cleanName = String(item?.name || item?.title || fallbackSeed?.name || `Treatment ${idx + 1}`).trim();
  const cleanId =
    String(item?.id || fallbackSeed?.id || '')
      .trim() ||
    cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') ||
    `treatment-${idx + 1}`;

  const inferred = inferTreatmentSubGroup({
    id: cleanId,
    title: cleanName,
    category: item?.tag || item?.pricingCategory || item?.category || fallbackSeed?.tag,
    badge: item?.subCategory || item?.badge,
  });

  const cleanSubGroupId = String(
    item?.subGroupId || fallbackSeed?.subGroupId || inferred.subGroupId || ''
  ).trim();
  const cleanSubCategory = String(
    item?.subCategory || fallbackSeed?.subCategory || inferred.subCategory || cleanName
  ).trim();

  const rawTag = String(
    item?.tag ||
      item?.pricingCategory ||
      item?.category ||
      fallbackSeed?.tag ||
      inferred.parentCategory ||
      'Face & Injectables'
  ).trim();
  const cleanTag = rawTag === 'IV Drip Lounge & Wellness' ? 'IV Drips & Wellness' : rawTag;

  const cleanStepNumber = String(item?.stepNumber || String(idx + 1).padStart(2, '0')).trim();
  const cleanDuration = String(item?.duration || item?.procedureTime || fallbackSeed?.duration || '45 - 60 Mins').trim();
  const cleanDescription = String(
    item?.description ||
      fallbackSeed?.description ||
      `Bespoke ${cleanName} clinical protocol performed at Age Reversal Clinic.`
  ).trim();
  const rawImg = String(item?.image || '').trim();
  const cleanRawImg = rawImg && !rawImg.includes('unsplash.com') ? rawImg : '';
  const cleanImage = String(
    cleanRawImg || fallbackSeed?.image || '/assets/images/treatments/specialist-profhilo.jpg'
  ).trim();
  const cleanImageAlt = String(
    item?.imageAlt ||
      fallbackSeed?.imageAlt ||
      `${cleanName} — ${cleanSubCategory} (${cleanTag}) at Age Reversal Clinic London`
  ).trim();
  const cleanSeoTitle = String(
    item?.seoTitle ||
      fallbackSeed?.seoTitle ||
      `${cleanName} | ${cleanSubCategory} — Age Reversal Clinic`
  ).trim();
  const rawKeywords = Array.isArray(item?.seoKeywords) && item.seoKeywords.length > 0
    ? item.seoKeywords
    : Array.isArray(fallbackSeed?.seoKeywords) && fallbackSeed.seoKeywords.length > 0
    ? fallbackSeed.seoKeywords
    : [
        cleanName.toLowerCase(),
        cleanSubCategory.toLowerCase(),
        cleanTag.toLowerCase(),
        `${cleanName.toLowerCase()} london`,
        'age reversal clinic treatment',
        'medical aesthetics london',
      ];
  const cleanSeoKeywords = Array.from(
    new Set(
      rawKeywords
        .map((k: unknown) => String(k || '').trim())
        .filter(Boolean)
    )
  );

  return {
    id: cleanId,
    name: cleanName,
    stepNumber: cleanStepNumber,
    tag: cleanTag,
    subGroupId: cleanSubGroupId,
    subCategory: cleanSubCategory,
    duration: cleanDuration,
    description: cleanDescription,
    image: cleanImage,
    imageAlt: cleanImageAlt,
    seoTitle: cleanSeoTitle,
    seoKeywords: cleanSeoKeywords,
  };
}

/**
 * Syncs homepage_treatments_config directly into src/data.ts (TREATMENTS array)
 * while keeping it decoupled from specialistTreatments.ts.
 */
function syncHomepageTreatmentsDataTs(treatmentsConfig: any): void {
  if (
    !treatmentsConfig ||
    !Array.isArray(treatmentsConfig.treatments) ||
    treatmentsConfig.treatments.length === 0 ||
    !fs.existsSync(dataTsPath)
  ) {
    return;
  }
  try {
    const projectedList = treatmentsConfig.treatments.map((item: any, idx: number) =>
      projectServerHomepageTreatmentCard(item, idx)
    );
    const existingContent = fs.readFileSync(dataTsPath, 'utf-8');
    const startMarker = 'export const TREATMENTS: TreatmentType[] =';
    const endMarker = 'export const TREATMENT_IMAGES: string[] =';
    const startIdx = existingContent.indexOf(startMarker);
    const endIdx = existingContent.indexOf(endMarker);

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const updatedTs =
        existingContent.slice(0, startIdx) +
        `${startMarker} ${JSON.stringify(projectedList, null, 2)};\n\n` +
        existingContent.slice(endIdx);
      if (updatedTs !== existingContent) {
        fs.writeFileSync(dataTsPath, updatedTs, 'utf-8');
        console.log(`[Admin] Synced ${projectedList.length} Homepage Treatments (with SEO metadata) to ${dataTsPath}`);
      }
    }
  } catch (err) {
    console.warn('[Admin] Could not sync homepage treatments to src/data.ts:', err);
  }
}

// ============================================================================
// HOMEPAGE TREATMENT COVER IMAGES: MULTI-IMAGE PER SUBCATEGORY & MANIFEST SYNC
// ============================================================================
const treatmentCoversManifestPath = path.join(publicTreatmentsDir, '_treatment_covers_manifest.json');

function sanitizeCoverTokenForFile(val: string, fallback = 'cover'): string {
  const cleaned = String(val || fallback)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || fallback;
}

function readTreatmentCoversManifestFromDisk(): any | null {
  try {
    if (fs.existsSync(treatmentCoversManifestPath)) {
      const parsed = JSON.parse(fs.readFileSync(treatmentCoversManifestPath, 'utf-8'));
      if (parsed && Array.isArray(parsed.items)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Admin] Could not read _treatment_covers_manifest.json:', err);
  }
  return null;
}

function writeTreatmentCoversManifestToDisk(config: any): void {
  if (!config || !Array.isArray(config.items)) return;
  try {
    if (!fs.existsSync(publicTreatmentsDir)) {
      fs.mkdirSync(publicTreatmentsDir, { recursive: true });
    }
    writeFileAtomicallySync(treatmentCoversManifestPath, JSON.stringify(config, null, 2));
  } catch (err) {
    console.warn('[Admin] Could not write _treatment_covers_manifest.json:', err);
  }
}

function resolveDiskTreatmentCoverImage(
  coverId: string,
  subCategoryId: string,
  currentUrl?: string
): string {
  const cleanCoverId = sanitizeCoverTokenForFile(coverId, 'cover');
  const cleanSubCat = sanitizeCoverTokenForFile(subCategoryId, 'general');
  const rawUrl = typeof currentUrl === 'string' ? currentUrl.trim() : '';

  if (!fs.existsSync(publicTreatmentsDir)) {
    return rawUrl;
  }

  try {
    const deterministicName = cleanCoverId.startsWith(`cover-${cleanSubCat}-`)
      ? `${cleanCoverId}.webp`
      : cleanCoverId.startsWith('cover-')
      ? `${cleanCoverId}.webp`
      : `cover-${cleanSubCat}-${cleanCoverId}.webp`;
    const deterministicPath = path.join(publicTreatmentsDir, deterministicName);
    const hasDeterministicFile = fs.existsSync(deterministicPath);

    // 1. If rawUrl points to an existing local /assets/ file on disk, verify it and attach mtime cache-buster
    if (rawUrl.startsWith('/assets/')) {
      const cleanPathOnly = rawUrl.split('?')[0].split('#')[0];
      const relativeFromAssets = cleanPathOnly.replace(/^\/assets\/+/, '');
      const diskPath = path.join(publicAssetsDir, relativeFromAssets);
      if (fs.existsSync(diskPath)) {
        const mtime = Math.floor(fs.statSync(diskPath).mtimeMs);
        if (hasDeterministicFile && path.resolve(diskPath) !== path.resolve(deterministicPath)) {
          const detMtime = Math.floor(fs.statSync(deterministicPath).mtimeMs);
          if (detMtime > mtime) {
            return `/assets/treatments/${deterministicName}?v=${detMtime}`;
          }
        }
        return rawUrl.includes('?v=') ? rawUrl : `${cleanPathOnly}?v=${mtime}`;
      }
    }

    // 2. If deterministic cover file exists on disk in /public/assets/treatments/, always recover it
    if (hasDeterministicFile) {
      const mtime = Math.floor(fs.statSync(deterministicPath).mtimeMs);
      return `/assets/treatments/${deterministicName}?v=${mtime}`;
    }

    // 3. Also check if any file in /public/assets/treatments/ matches `${cleanCoverId}.webp`
    const directCoverPath = path.join(publicTreatmentsDir, `${cleanCoverId}.webp`);
    if (fs.existsSync(directCoverPath)) {
      const mtime = Math.floor(fs.statSync(directCoverPath).mtimeMs);
      return `/assets/treatments/${cleanCoverId}.webp?v=${mtime}`;
    }
  } catch (err) {
    console.warn('[Admin] Error resolving disk treatment cover image:', err);
  }

  return rawUrl;
}

function getDefaultHomepageTreatmentCovers(): any[] {
  return TREATMENTS.map((t: any, idx: number) => {
    const subCatId = String(t.subGroupId || t.id || `subcat-${idx + 1}`).trim();
    const subCatName = String(t.subCategory || t.name || `Treatment ${idx + 1}`).trim();
    const branchCategory = String(t.tag || 'Face & Injectables').trim();
    const coverId = `cover-seed-${sanitizeCoverTokenForFile(subCatId)}`;
    const resolvedImage =
      resolveDiskTreatmentCoverImage(coverId, subCatId, t.image) ||
      String(t.image || '/assets/images/treatments/specialist-profhilo.jpg').trim();

    return {
      id: coverId,
      subCategoryId: subCatId,
      subCategoryName: subCatName,
      branchCategory: branchCategory === 'IV Drip Lounge & Wellness' ? 'IV Drips & Wellness' : branchCategory,
      imageUrl: resolvedImage,
      title: String(t.name || subCatName).trim(),
      caption: String(t.duration || '45 - 60 Mins').trim(),
      altText: String(
        t.imageAlt || `${subCatName} (${branchCategory}) at Age Reversal Clinic London`
      ).trim(),
      seoTitle: String(
        t.seoTitle || `${subCatName} | ${branchCategory} — Age Reversal Clinic`
      ).trim(),
      seoKeywords: Array.isArray(t.seoKeywords)
        ? t.seoKeywords
        : [
            subCatName.toLowerCase(),
            branchCategory.toLowerCase(),
            `${subCatName.toLowerCase()} london`,
            'age reversal clinic treatment',
          ],
      showInDefaultGrid: idx < 6,
      hidden: false,
      order: idx + 1,
    };
  });
}

/**
 * Projects strictly the needed columns for a HomepageTreatmentCoverImage item
 * so no extra heavy bloat is returned over the wire.
 */
function projectServerHomepageTreatmentCover(item: any, idx: number = 0): any {
  const defaultSeed =
    TREATMENTS.find(
      (t: any) =>
        String(t.subGroupId || t.id || '').toLowerCase() ===
          String(item?.subCategoryId || '').toLowerCase() ||
        String(t.subCategory || t.name || '').toLowerCase() ===
          String(item?.subCategoryName || '').toLowerCase()
    ) || TREATMENTS[idx % Math.max(1, TREATMENTS.length)];

  const subCategoryId = String(
    item?.subCategoryId || defaultSeed?.subGroupId || defaultSeed?.id || 'facial-skin-care'
  ).trim();
  const subCategoryName = String(
    item?.subCategoryName || defaultSeed?.subCategory || defaultSeed?.name || 'Facial skin care'
  ).trim();
  const rawBranch = String(
    item?.branchCategory || defaultSeed?.tag || 'Face & Injectables'
  ).trim();
  const branchCategory =
    rawBranch === 'IV Drip Lounge & Wellness' ? 'IV Drips & Wellness' : rawBranch;

  const id = String(
    item?.id || `cover-${sanitizeCoverTokenForFile(subCategoryId)}-${idx + 1}`
  ).trim();

  const resolvedUrl = resolveDiskTreatmentCoverImage(
    id,
    subCategoryId,
    item?.imageUrl || item?.image || defaultSeed?.image
  );

  const title = String(item?.title !== undefined ? item.title : subCategoryName).trim();
  const caption = String(item?.caption !== undefined ? item.caption : '').trim();
  const altText = String(
    item?.altText ||
      item?.imageAlt ||
      defaultSeed?.imageAlt ||
      `${title || subCategoryName} (${branchCategory}) at Age Reversal Clinic London`
  ).trim();
  const seoTitle = String(
    item?.seoTitle ||
      defaultSeed?.seoTitle ||
      `${title || subCategoryName} | ${branchCategory} — Age Reversal Clinic`
  ).trim();
  const rawKeywords =
    Array.isArray(item?.seoKeywords) && item.seoKeywords.length > 0
      ? item.seoKeywords
      : Array.isArray(defaultSeed?.seoKeywords) && defaultSeed.seoKeywords.length > 0
      ? defaultSeed.seoKeywords
      : [
          subCategoryName.toLowerCase(),
          branchCategory.toLowerCase(),
          `${subCategoryName.toLowerCase()} london`,
          'age reversal clinic treatment',
        ];
  const seoKeywords = Array.from(
    new Set(rawKeywords.map((k: unknown) => String(k || '').trim()).filter(Boolean))
  );

  return {
    id,
    subCategoryId,
    subCategoryName,
    branchCategory,
    imageUrl: resolvedUrl,
    title,
    caption,
    altText,
    seoTitle,
    seoKeywords,
    showInDefaultGrid: Boolean(item?.showInDefaultGrid),
    hidden: Boolean(item?.hidden),
    order: typeof item?.order === 'number' && Number.isFinite(item.order) ? item.order : idx + 1,
    ...(item?.updatedAt ? { updatedAt: item.updatedAt } : {}),
  };
}

function scoreTreatmentCoverCompleteness(item: any): number {
  if (!item) return 0;
  let score = 0;
  const img = String(item.imageUrl || '');
  if (img.startsWith('/assets/treatments/cover-') || img.startsWith('/assets/treatments/')) {
    score += 60;
  } else if (img.startsWith('/assets/')) {
    score += 30;
  }
  if (item.updatedAt) score += 20;
  return score;
}

/**
 * Reconciles Homepage Treatment Cover Images across:
 * 1) incomingConfig
 * 2) existingJsonConfig (siteCustomizations.json -> homepage_treatment_cover_images_v1)
 * 3) manifestConfig (/public/assets/treatments/_treatment_covers_manifest.json)
 * 4) physical `cover-*.webp` files in /public/assets/treatments/
 * 5) default seed items
 */
function reconcileHomepageTreatmentCoversConfig(
  incomingConfig: any,
  existingJsonConfig?: any,
  options?: { deletedIds?: string[]; restoredDefaults?: boolean }
): { items: any[]; updatedAt: string } {
  const opts = options || {};
  const explicitDeletedIds = new Set<string>(
    Array.isArray(opts.deletedIds) ? opts.deletedIds.map((id) => String(id).trim()) : []
  );

  if (opts.restoredDefaults) {
    const defaults = getDefaultHomepageTreatmentCovers();
    const restoredPayload = {
      items: defaults,
      updatedAt: new Date().toISOString(),
    };
    writeTreatmentCoversManifestToDisk(restoredPayload);
    return restoredPayload;
  }

  const manifestConfig = readTreatmentCoversManifestFromDisk();
  const defaultSeeds = getDefaultHomepageTreatmentCovers();
  const seedById = new Map<string, any>(defaultSeeds.map((s) => [String(s.id), s]));

  const incomingItems: any[] = Array.isArray(incomingConfig?.items)
    ? incomingConfig.items
    : Array.isArray(incomingConfig)
    ? incomingConfig
    : [];
  const existingItems: any[] = Array.isArray(existingJsonConfig?.items)
    ? existingJsonConfig.items
    : Array.isArray(existingJsonConfig)
    ? existingJsonConfig
    : [];
  const manifestItems: any[] = Array.isArray(manifestConfig?.items) ? manifestConfig.items : [];

  const incomingById = new Map<string, any>();
  for (const item of incomingItems) {
    if (!item || !item.id) continue;
    const id = String(item.id).trim();
    if (!explicitDeletedIds.has(id)) {
      incomingById.set(id, item);
    }
  }

  const existingById = new Map<string, any>();
  for (const item of existingItems) {
    if (!item || !item.id) continue;
    const id = String(item.id).trim();
    if (!explicitDeletedIds.has(id)) {
      existingById.set(id, item);
    }
  }

  const manifestById = new Map<string, any>();
  for (const item of manifestItems) {
    if (!item || !item.id) continue;
    const id = String(item.id).trim();
    if (!explicitDeletedIds.has(id)) {
      manifestById.set(id, item);
    }
  }

  // Scan /public/assets/treatments/ for any orphaned `cover-<subCatId>-<coverId>.webp` files
  const diskOrphansById = new Map<string, any>();
  if (fs.existsSync(publicTreatmentsDir)) {
    try {
      const files = fs.readdirSync(publicTreatmentsDir);
      const knownSubCatIds = TREATMENTS.map((t: any) =>
        sanitizeCoverTokenForFile(String(t.subGroupId || t.id || ''))
      )
        .filter(Boolean)
        .sort((a, b) => b.length - a.length); // match longest subcategory slug first

      for (const f of files) {
        if (!f.toLowerCase().startsWith('cover-') || !f.toLowerCase().endsWith('.webp')) continue;
        const stem = f.slice(0, -5); // remove .webp
        const withoutPrefix = stem.slice('cover-'.length);
        let matchedSubCat = 'facial-skin-care';
        let extractedId = stem;

        for (const subId of knownSubCatIds) {
          if (withoutPrefix === subId) {
            matchedSubCat = subId;
            extractedId = `cover-seed-${subId}`;
            break;
          }
          if (withoutPrefix.startsWith(`${subId}-`)) {
            matchedSubCat = subId;
            const remainder = withoutPrefix.slice(subId.length + 1);
            extractedId = remainder.startsWith('cover-') ? remainder : `cover-${subId}-${remainder}`;
            break;
          }
        }

        if (explicitDeletedIds.has(extractedId) || explicitDeletedIds.has(stem)) continue;

        // Check if any known item already references this file or ID
        const cleanFileUrl = `/assets/treatments/${f}`;
        const alreadyReferenced = [...incomingById.values(), ...existingById.values(), ...manifestById.values()].some(
          (it: any) =>
            String(it?.id) === extractedId ||
            String(it?.id) === stem ||
            String(it?.imageUrl || '').split('?')[0] === cleanFileUrl
        );

        if (!alreadyReferenced) {
          const stat = fs.statSync(path.join(publicTreatmentsDir, f));
          const mtime = Math.floor(stat.mtimeMs);
          const matchedTreatment = TREATMENTS.find(
            (t: any) =>
              sanitizeCoverTokenForFile(String(t.subGroupId || t.id || '')) === matchedSubCat
          );
          diskOrphansById.set(extractedId, {
            id: extractedId,
            subCategoryId: matchedTreatment?.subGroupId || matchedTreatment?.id || matchedSubCat,
            subCategoryName: matchedTreatment?.subCategory || matchedTreatment?.name || matchedSubCat,
            branchCategory: matchedTreatment?.tag || 'Face & Injectables',
            imageUrl: `${cleanFileUrl}?v=${mtime}`,
            title: matchedTreatment?.name || matchedSubCat,
            caption: matchedTreatment?.duration || '45 - 60 Mins',
            showInDefaultGrid: false,
            hidden: false,
            order: 999,
            updatedAt: mtime,
          });
        }
      }
    } catch (scanErr) {
      console.warn('[Admin] Could not scan /public/assets/treatments/ for cover-*.webp files:', scanErr);
    }
  }

  const allIds = new Set<string>();
  incomingById.forEach((_, id) => allIds.add(id));
  existingById.forEach((_, id) => allIds.add(id));
  manifestById.forEach((_, id) => allIds.add(id));
  diskOrphansById.forEach((_, id) => allIds.add(id));

  // If no custom or manifest items exist yet, seed with the 24 default subcategories
  if (allIds.size === 0) {
    defaultSeeds.forEach((seed) => {
      if (!explicitDeletedIds.has(String(seed.id))) {
        allIds.add(String(seed.id));
      }
    });
  }

  const mergedItems: any[] = [];
  let idxCounter = 0;

  for (const id of allIds) {
    if (explicitDeletedIds.has(id)) continue;

    const inc = incomingById.get(id);
    const ex = existingById.get(id);
    const mf = manifestById.get(id);
    const orphan = diskOrphansById.get(id);
    const seed = seedById.get(id);

    // Choose metadata from incoming if present, otherwise existing, manifest, orphan, or seed
    let chosen = inc || ex || mf || orphan || seed;
    if (!chosen) continue;

    // Never allow a stale payload to overwrite a custom uploaded /assets/treatments/cover-*.webp image
    const candidates = [inc, ex, mf, orphan].filter(Boolean);
    let bestImageCandidate = chosen;
    let bestScore = scoreTreatmentCoverCompleteness(chosen);

    for (const cand of candidates) {
      const s = scoreTreatmentCoverCompleteness(cand);
      const candTime = Number(cand.updatedAt || 0);
      const bestTime = Number(bestImageCandidate?.updatedAt || 0);
      if (s > bestScore || (s === bestScore && candTime > bestTime)) {
        bestImageCandidate = cand;
        bestScore = s;
      }
    }

    const rawCombined = {
      ...(seed || {}),
      ...(orphan || {}),
      ...(mf || {}),
      ...(ex || {}),
      ...(inc || {}),
      id: chosen.id || id,
      imageUrl:
        (inc?.imageUrl && String(inc.imageUrl).startsWith('/assets/treatments/cover-')
          ? inc.imageUrl
          : bestImageCandidate?.imageUrl) ||
        inc?.imageUrl ||
        ex?.imageUrl ||
        mf?.imageUrl ||
        orphan?.imageUrl ||
        seed?.imageUrl,
      updatedAt:
        Math.max(
          Number(inc?.updatedAt || 0),
          Number(ex?.updatedAt || 0),
          Number(mf?.updatedAt || 0),
          Number(orphan?.updatedAt || 0)
        ) || undefined,
    };

    mergedItems.push(projectServerHomepageTreatmentCover(rawCombined, idxCounter++));
  }

  // Sort by explicit `order` ascending, then updatedAt descending
  mergedItems.sort((a, b) => {
    const orderDiff = (a.order ?? 999) - (b.order ?? 999);
    if (orderDiff !== 0) return orderDiff;
    return Number(b.updatedAt || 0) - Number(a.updatedAt || 0);
  });

  // Normalize sequential order 1..N
  const normalizedItems = mergedItems.map((item, i) => ({
    ...item,
    order: i + 1,
  }));

  const reconciledConfig = {
    items: normalizedItems,
    updatedAt: new Date().toISOString(),
  };

  writeTreatmentCoversManifestToDisk(reconciledConfig);
  return reconciledConfig;
}

// ============================================================================
// BLOG & CLINICAL JOURNAL: SEO SCORE, PROJECTION & DISK PERSISTENCE HELPERS
// ============================================================================
function slugifyBlogText(value: string, fallback: string = 'clinical-article'): string {
  const cleaned = String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || fallback;
}

function estimateServerReadingTime(article: any): string {
  if (typeof article?.readingTime === 'string' && article.readingTime.trim()) {
    return article.readingTime.trim();
  }
  const blockWords = Array.isArray(article?.contentBlocks)
    ? article.contentBlocks
        .map((b: any) =>
          [
            b?.heading || '',
            b?.text || '',
            ...(Array.isArray(b?.paragraphs) ? b.paragraphs : []),
            b?.calloutQuote || '',
            ...(Array.isArray(b?.bulletPoints) ? b.bulletPoints : []),
          ].join(' ')
        )
        .join(' ')
    : '';
  const totalWords = `${article?.title || ''} ${article?.description || ''} ${blockWords}`
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const mins = Math.max(2, Math.ceil(totalWords / 180));
  return `${mins} min read`;
}

function computeServerArticleSeoScore(article: any): {
  score: number;
  grade: 'optimized' | 'needs-attention';
} {
  const effectiveTitle = String(article?.seoTitle || article?.title || '').trim();
  const effectiveMeta = String(article?.metaDescription || article?.description || '').trim();
  const keywords: string[] = Array.isArray(article?.focusKeywords)
    ? article.focusKeywords.map((k: unknown) => String(k || '').trim()).filter(Boolean)
    : [];
  const primaryKeyword = (keywords[0] || '').toLowerCase();
  const slug = String(article?.slug || slugifyBlogText(article?.title || '')).toLowerCase();
  const imageAlt = String(article?.imageAlt || '').trim();
  const hasBlocks =
    (Array.isArray(article?.contentBlocks) && article.contentBlocks.length > 0) ||
    (Array.isArray(article?.faqItems) && article.faqItems.length > 0);

  let score = 0;
  if (effectiveTitle.length >= 30 && effectiveTitle.length <= 65) score += 20;
  else if (effectiveTitle.length >= 15) score += 10;

  if (effectiveMeta.length >= 100 && effectiveMeta.length <= 165) score += 20;
  else if (effectiveMeta.length >= 50) score += 10;

  if (keywords.length > 0) score += 20;

  if (
    primaryKeyword &&
    (effectiveTitle.toLowerCase().includes(primaryKeyword) ||
      slug.includes(slugifyBlogText(primaryKeyword, '')))
  ) {
    score += 15;
  } else if (keywords.length > 0) {
    score += 8;
  }

  if (imageAlt.length >= 10) score += 15;
  if (hasBlocks) score += 10;

  const clamped = Math.min(100, Math.max(0, score));
  return {
    score: clamped,
    grade: clamped >= 75 ? 'optimized' : 'needs-attention',
  };
}

function resolveDiskBlogImageById(rawId: string, currentImage?: string): string {
  const cleanId = String(rawId || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  const trimmedCurrent = String(currentImage || '').trim();

  // 1. Always check if a local file named ${cleanId}${ext} exists on disk in /public/assets/blog/
  // If the user uploaded a custom blog image for this post/block ID, it MUST always take priority
  // over any default external placeholder URL.
  if (cleanId && fs.existsSync(publicBlogDir)) {
    try {
      const files = fs.readdirSync(publicBlogDir);
      const matched = files.find((f) => {
        const ext = path.extname(f);
        const base = path.basename(f, ext).toLowerCase();
        return base === cleanId && ['.webp', '.jpg', '.jpeg', '.png', '.gif', '.avif'].includes(ext.toLowerCase());
      });
      if (matched) {
        const fullPath = path.join(publicBlogDir, matched);
        const stat = fs.statSync(fullPath);
        const ext = path.extname(matched).toLowerCase() || '.webp';
        const expectedCleanPath = `/assets/blog/${cleanId}${ext}`;
        if (trimmedCurrent.startsWith(expectedCleanPath) && trimmedCurrent.includes('?v=')) {
          return trimmedCurrent;
        }
        return `${expectedCleanPath}?v=${Math.floor(stat.mtimeMs || Date.now())}`;
      }
    } catch {}
  }

  // 2. If currentImage is a /assets/blog/ URL with another filename, verify it exists on disk and has ?v=
  if (trimmedCurrent.startsWith('/assets/blog/')) {
    const cleanPath = trimmedCurrent.split('?')[0].split('#')[0].trim();
    const fileName = path.basename(cleanPath);
    const pubCandidate = path.join(publicBlogDir, fileName);
    if (fs.existsSync(pubCandidate)) {
      if (trimmedCurrent.includes('?v=')) {
        return trimmedCurrent;
      }
      try {
        const stat = fs.statSync(pubCandidate);
        return `${cleanPath}?v=${Math.floor(stat.mtimeMs || Date.now())}`;
      } catch {
        return `${cleanPath}?v=${Date.now()}`;
      }
    }
  }

  return trimmedCurrent;
}

function collectAllBlogImagePaths(posts: any[]): Set<string> {
  const urls = new Set<string>();
  for (const post of posts) {
    if (typeof post?.image === 'string' && post.image.startsWith('/assets/blog/')) {
      urls.add(post.image.split('?')[0].split('#')[0].trim());
    }
    if (Array.isArray(post?.contentBlocks)) {
      for (const block of post.contentBlocks) {
        if (typeof block?.imageUrl === 'string' && block.imageUrl.startsWith('/assets/blog/')) {
          urls.add(block.imageUrl.split('?')[0].split('#')[0].trim());
        }
      }
    }
  }
  return urls;
}

function normalizeServerArticle(raw: any, defaultType: 'news' | 'stories' = 'news', idx: number = 0): any {
  const title = String(raw?.title || `Untitled Clinical Post ${idx + 1}`).trim();
  const type: 'news' | 'stories' =
    raw?.type === 'stories' || raw?.type === 'news' ? raw.type : defaultType;
  const id =
    String(raw?.id || '').trim() ||
    `${type === 'stories' ? 'story' : 'news'}-${Date.now()}-${idx}`;
  const cleanId = id
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  const slug = slugifyBlogText(raw?.slug || title, id);
  const status: 'published' | 'draft' = raw?.status === 'draft' ? 'draft' : 'published';
  const nowIso = new Date().toISOString();
  const publishedAt = String(raw?.publishedAt || nowIso).trim();
  const updatedAt = String(raw?.updatedAt || publishedAt).trim();
  const date =
    String(raw?.date || '').trim() ||
    new Date(publishedAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  const tag = String(raw?.tag || raw?.category || (type === 'stories' ? 'Patient Story' : 'Clinical News')).trim();
  const category = String(raw?.category || tag).trim();
  const author = String(raw?.author || 'Adv. Faith Chris').trim();
  const description = String(raw?.description || '').trim();
  const image = resolveDiskBlogImageById(id, raw?.image);
  const imageAlt = String(
    raw?.imageAlt || `${title} — ${category} at Age Reversal Clinic`
  ).trim();
  const seoTitle = String(
    raw?.seoTitle || `${title} | Age Reversal Clinic`
  ).trim();
  const metaDescription = String(
    raw?.metaDescription || description || `${title} clinical insights at Age Reversal Clinic.`
  ).trim();
  const focusKeywords = Array.isArray(raw?.focusKeywords)
    ? Array.from(
        new Set(
          raw.focusKeywords
            .map((k: unknown) => String(k || '').trim())
            .filter(Boolean)
        )
      )
    : [category.toLowerCase(), 'age reversal clinic', 'clinical aesthetics'];
  const canonicalUrl = String(raw?.canonicalUrl || `#article-${id}`).trim();
  const readingTime = estimateServerReadingTime(raw);
  const contentBlocks = Array.isArray(raw?.contentBlocks)
    ? raw.contentBlocks.map((block: any, bIdx: number) => {
        if (block && block.type === 'image') {
          const blockAssetId = `${id}-${block.id || `block-${bIdx + 1}`}`;
          return {
            ...block,
            imageUrl: resolveDiskBlogImageById(blockAssetId, block.imageUrl),
          };
        }
        return block;
      })
    : [];

  // Auto-recover any inline block image on disk matching ${cleanId}-block-* that might have been dropped by a stale config sync
  if (cleanId && fs.existsSync(publicBlogDir)) {
    try {
      const prefix = `${cleanId}-block-`;
      const files = fs.readdirSync(publicBlogDir);
      for (const f of files) {
        const ext = path.extname(f).toLowerCase();
        if (!['.webp', '.jpg', '.jpeg', '.png', '.gif', '.avif'].includes(ext)) continue;
        const base = path.basename(f, ext).toLowerCase();
        if (base.startsWith(prefix)) {
          const extractedBlockId = base.slice(cleanId.length + 1); // e.g. "block-1793612033457-wvlq"
          const cleanPath = `/assets/blog/${f}`;
          const stat = fs.statSync(path.join(publicBlogDir, f));
          const versionedUrl = `${cleanPath}?v=${Math.floor(stat.mtimeMs || Date.now())}`;
          const existingIdx = contentBlocks.findIndex(
            (b: any) =>
              b &&
              (String(b.id || '').toLowerCase() === extractedBlockId ||
                (typeof b.imageUrl === 'string' && b.imageUrl.split('?')[0].toLowerCase() === cleanPath.toLowerCase()))
          );
          if (existingIdx !== -1) {
            if (!contentBlocks[existingIdx].imageUrl || !String(contentBlocks[existingIdx].imageUrl).startsWith('/assets/blog/')) {
              contentBlocks[existingIdx] = {
                ...contentBlocks[existingIdx],
                type: 'image',
                imageUrl: versionedUrl,
              };
            }
          } else {
            contentBlocks.push({
              id: extractedBlockId,
              type: 'image',
              imageUrl: versionedUrl,
              imageAlt: `${title} — ${category} illustration`,
              imageCaption: '',
            });
          }
        }
      }
    } catch {}
  }

  const faqItems = Array.isArray(raw?.faqItems) ? raw.faqItems : [];

  return {
    id,
    slug,
    type,
    status,
    title,
    description,
    image,
    imageAlt,
    date,
    publishedAt,
    updatedAt,
    readingTime,
    author,
    tag,
    category,
    seoTitle,
    metaDescription,
    focusKeywords,
    canonicalUrl,
    contentBlocks,
    faqItems,
  };
}

/**
 * Exact Summary Column Projection for Paginated Blog Cards:
 * Strips out heavy contentBlocks[] and faqItems[] arrays.
 */
function projectServerBlogPostCard(article: any) {
  const normalized = normalizeServerArticle(article, article?.type || 'news');
  const { score, grade } = computeServerArticleSeoScore(normalized);
  return {
    id: normalized.id,
    slug: normalized.slug,
    title: normalized.title,
    description: normalized.description,
    category: normalized.category,
    tag: normalized.tag,
    type: normalized.type,
    status: normalized.status,
    date: normalized.date,
    publishedAt: normalized.publishedAt,
    updatedAt: normalized.updatedAt,
    author: normalized.author,
    readingTime: normalized.readingTime,
    image: normalized.image,
    imageAlt: normalized.imageAlt,
    seoScore: score,
    seoGrade: grade,
  };
}

function syncBlogArticlesDataTs(newsArticles: any[], storyArticles: any[]): void {
  if (!fs.existsSync(dataTsPath)) return;
  try {
    const cleanNews = (Array.isArray(newsArticles) ? newsArticles : []).map((a, idx) =>
      normalizeServerArticle(a, 'news', idx)
    );
    const cleanStories = (Array.isArray(storyArticles) ? storyArticles : []).map((a, idx) =>
      normalizeServerArticle(a, 'stories', idx)
    );

    const existingContent = fs.readFileSync(dataTsPath, 'utf-8');
    const newsStartMarker = 'export const NEWS_ARTICLES: Article[] =';
    const storyStartMarker = 'export const STORY_ARTICLES: Article[] =';
    const newsIdx = existingContent.indexOf(newsStartMarker);

    if (newsIdx !== -1 && existingContent.includes(storyStartMarker)) {
      const updatedTs =
        existingContent.slice(0, newsIdx) +
        `${newsStartMarker} ${JSON.stringify(cleanNews, null, 2)};\n\n` +
        `${storyStartMarker} ${JSON.stringify(cleanStories, null, 2)};\n`;
      if (updatedTs !== existingContent) {
        fs.writeFileSync(dataTsPath, updatedTs, 'utf-8');
        console.log(
          `[Admin] Synced ${cleanNews.length} news & ${cleanStories.length} story articles directly to ${dataTsPath}`
        );
      }
    }
  } catch (err) {
    console.warn('[Admin] Could not sync blog articles to src/data.ts:', err);
  }
}

/**
 * Dynamically reads NEWS_ARTICLES and STORY_ARTICLES from src/data.ts on disk
 * so that if a user copies and pastes an updated src/data.ts file to replace the old one,
 * the server immediately sees the new articles and images without needing a server restart.
 */
function readBlogArticlesFromDataTsDisk(): {
  newsArticles: any[];
  storyArticles: any[];
} {
  if (!fs.existsSync(dataTsPath)) {
    return { newsArticles: NEWS_ARTICLES, storyArticles: STORY_ARTICLES };
  }
  try {
    const content = fs.readFileSync(dataTsPath, 'utf-8');
    const newsStartMarker = 'export const NEWS_ARTICLES: Article[] =';
    const storyStartMarker = 'export const STORY_ARTICLES: Article[] =';
    const newsIdx = content.indexOf(newsStartMarker);
    const storyIdx = content.indexOf(storyStartMarker);
    if (newsIdx !== -1 && storyIdx !== -1 && storyIdx > newsIdx) {
      const newsRaw = content
        .slice(newsIdx + newsStartMarker.length, storyIdx)
        .trim()
        .replace(/;\s*$/, '');
      const storyRaw = content
        .slice(storyIdx + storyStartMarker.length)
        .trim()
        .replace(/;\s*$/, '');
      const parsedNews = JSON.parse(newsRaw);
      const parsedStories = JSON.parse(storyRaw);
      if (Array.isArray(parsedNews) && Array.isArray(parsedStories)) {
        return { newsArticles: parsedNews, storyArticles: parsedStories };
      }
    }
  } catch {
    // Fallback if src/data.ts uses non-JSON TS syntax
  }
  return { newsArticles: NEWS_ARTICLES, storyArticles: STORY_ARTICLES };
}

function countLocalBlogAssets(article: any): number {
  if (!article || typeof article !== 'object') return 0;
  let count = 0;
  if (typeof article.image === 'string' && article.image.startsWith('/assets/blog/')) {
    count += 2;
  }
  if (Array.isArray(article.contentBlocks)) {
    for (const b of article.contentBlocks) {
      if (typeof b?.imageUrl === 'string' && b.imageUrl.startsWith('/assets/blog/')) {
        count += 2;
      } else if (b?.type === 'image') {
        count += 1;
      }
    }
  }
  return count;
}

function reconcileBlogArticleLists(
  primaryList: any[],
  secondaryList: any[],
  defaultType: 'news' | 'stories'
): any[] {
  const pArr = Array.isArray(primaryList) ? primaryList : [];
  const sArr = Array.isArray(secondaryList) ? secondaryList : [];
  if (pArr.length === 0) {
    return sArr.map((a, idx) => normalizeServerArticle(a, defaultType, idx));
  }
  if (sArr.length === 0) {
    return pArr.map((a, idx) => normalizeServerArticle(a, defaultType, idx));
  }

  const secondaryById = new Map<string, any>();
  for (const item of sArr) {
    if (item && item.id) {
      secondaryById.set(String(item.id), item);
    }
  }

  const seenIds = new Set<string>();
  const merged: any[] = [];

  for (let i = 0; i < pArr.length; i++) {
    const pItem = pArr[i];
    if (!pItem || !pItem.id) continue;
    const idStr = String(pItem.id);
    seenIds.add(idStr);
    const sItem = secondaryById.get(idStr);

    if (!sItem) {
      merged.push(normalizeServerArticle(pItem, defaultType, i));
      continue;
    }

    const pNorm = normalizeServerArticle(pItem, defaultType, i);
    const sNorm = normalizeServerArticle(sItem, defaultType, i);

    const pAssets = countLocalBlogAssets(pNorm);
    const sAssets = countLocalBlogAssets(sNorm);
    const pTime = Date.parse(pNorm.updatedAt || pNorm.publishedAt || '') || 0;
    const sTime = Date.parse(sNorm.updatedAt || sNorm.publishedAt || '') || 0;

    // Pick base article by newer updatedAt or richer local /assets/blog/ assets
    const base = sTime > pTime || (sTime === pTime && sAssets > pAssets) ? { ...pNorm, ...sNorm } : { ...sNorm, ...pNorm };

    // Always preserve /assets/blog/ cover image if either source has one
    if (
      typeof sNorm.image === 'string' &&
      sNorm.image.startsWith('/assets/blog/') &&
      (!base.image || !String(base.image).startsWith('/assets/blog/'))
    ) {
      base.image = sNorm.image;
      base.imageAlt = sNorm.imageAlt || base.imageAlt;
    } else if (
      typeof pNorm.image === 'string' &&
      pNorm.image.startsWith('/assets/blog/') &&
      (!base.image || !String(base.image).startsWith('/assets/blog/'))
    ) {
      base.image = pNorm.image;
      base.imageAlt = pNorm.imageAlt || base.imageAlt;
    }

    // Preserve contentBlocks that have /assets/blog/ images or more blocks if timestamps are equal
    const pBlockAssets = (pNorm.contentBlocks || []).filter(
      (b: any) => typeof b?.imageUrl === 'string' && b.imageUrl.startsWith('/assets/blog/')
    ).length;
    const sBlockAssets = (sNorm.contentBlocks || []).filter(
      (b: any) => typeof b?.imageUrl === 'string' && b.imageUrl.startsWith('/assets/blog/')
    ).length;
    if (sBlockAssets > pBlockAssets) {
      base.contentBlocks = sNorm.contentBlocks;
    } else if (pBlockAssets > sBlockAssets) {
      base.contentBlocks = pNorm.contentBlocks;
    } else if (
      sTime === pTime &&
      Array.isArray(sNorm.contentBlocks) &&
      sNorm.contentBlocks.length > (base.contentBlocks?.length || 0)
    ) {
      base.contentBlocks = sNorm.contentBlocks;
    }

    merged.push(normalizeServerArticle(base, defaultType, i));
  }

  for (let j = 0; j < sArr.length; j++) {
    const sItem = sArr[j];
    if (sItem && sItem.id && !seenIds.has(String(sItem.id))) {
      seenIds.add(String(sItem.id));
      merged.push(normalizeServerArticle(sItem, defaultType, merged.length));
    }
  }

  return merged;
}

function getServerBlogConfig(): {
  heading: string;
  description: string;
  newsArticles: any[];
  storyArticles: any[];
} {
  let rawConfig: any = null;
  let customizationsMtime = 0;
  if (fs.existsSync(customizationsPath)) {
    try {
      customizationsMtime = fs.statSync(customizationsPath).mtimeMs || 0;
      const existing = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      if (existing && existing.homepage_latest_news_config) {
        rawConfig = existing.homepage_latest_news_config;
      }
    } catch {
      rawConfig = null;
    }
  }

  let dataTsMtime = 0;
  if (fs.existsSync(dataTsPath)) {
    try {
      dataTsMtime = fs.statSync(dataTsPath).mtimeMs || 0;
    } catch {}
  }

  const diskDataTs = readBlogArticlesFromDataTsDisk();
  const hasSavedNews = Array.isArray(rawConfig?.newsArticles) && rawConfig.newsArticles.length > 0;
  const hasSavedStories = Array.isArray(rawConfig?.storyArticles) && rawConfig.storyArticles.length > 0;

  // If the user pasted/updated src/data.ts more recently than siteCustomizations.json, treat src/data.ts as primary
  const dataTsIsNewer = dataTsMtime > customizationsMtime + 500;

  const newsPrimary = !hasSavedNews || dataTsIsNewer ? diskDataTs.newsArticles : rawConfig.newsArticles;
  const newsSecondary = !hasSavedNews || dataTsIsNewer ? rawConfig?.newsArticles || [] : diskDataTs.newsArticles;

  const storyPrimary = !hasSavedStories || dataTsIsNewer ? diskDataTs.storyArticles : rawConfig.storyArticles;
  const storySecondary = !hasSavedStories || dataTsIsNewer ? rawConfig?.storyArticles || [] : diskDataTs.storyArticles;

  return {
    heading: rawConfig?.heading || 'Latest News & Insights',
    description: rawConfig?.description || 'Stay informed on the latest clinical advancements.',
    newsArticles: reconcileBlogArticleLists(newsPrimary, newsSecondary, 'news'),
    storyArticles: reconcileBlogArticleLists(storyPrimary, storySecondary, 'stories'),
  };
}

function deleteUnreferencedBlogImageFile(oldUrl: string, activeUrls: Set<string>): string[] {
  const deleted: string[] = [];
  if (!oldUrl || typeof oldUrl !== 'string') return deleted;
  const cleanUrl = oldUrl.split('?')[0].split('#')[0].trim();
  if (!cleanUrl.startsWith('/assets/blog/') || activeUrls.has(cleanUrl)) {
    return deleted;
  }
  const fileName = path.basename(cleanUrl);
  for (const dir of [publicBlogDir, distBlogDir]) {
    const candidate = path.join(dir, fileName);
    if (fs.existsSync(candidate)) {
      try {
        fs.unlinkSync(candidate);
        deleted.push(fileName);
        console.log(`[Admin Blog Cleanup] Deleted unreferenced blog image: ${candidate}`);
      } catch (err) {
        console.warn(`[Admin Blog Cleanup] Could not delete ${candidate}:`, err);
      }
    }
  }
  return deleted;
}

function persistServerBlogConfig(config: {
  heading?: string;
  description?: string;
  newsArticles: any[];
  storyArticles: any[];
}): {
  heading: string;
  description: string;
  newsArticles: any[];
  storyArticles: any[];
  updatedAt: string;
} {
  let existing: Record<string, any> = {};
  if (fs.existsSync(customizationsPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
    } catch {
      existing = {};
    }
  }

  const prevConfig = getServerBlogConfig();
  const previousBlogImageUrls = collectAllBlogImagePaths([
    ...prevConfig.newsArticles,
    ...prevConfig.storyArticles,
  ]);

  const cleanNews = (Array.isArray(config.newsArticles) ? config.newsArticles : []).map((a, idx) =>
    normalizeServerArticle({ ...a, type: 'news' }, 'news', idx)
  );
  const cleanStories = (Array.isArray(config.storyArticles) ? config.storyArticles : []).map((a, idx) =>
    normalizeServerArticle({ ...a, type: 'stories' }, 'stories', idx)
  );
  const updatedAt = new Date().toISOString();

  const savedPayload = {
    heading: config.heading || prevConfig.heading || 'Latest News & Insights',
    description:
      config.description || prevConfig.description || 'Stay informed on the latest clinical advancements.',
    newsArticles: cleanNews,
    storyArticles: cleanStories,
    updatedAt,
  };

  const activeBlogImageUrls = collectAllBlogImagePaths([...cleanNews, ...cleanStories]);

  for (const oldUrl of previousBlogImageUrls) {
    if (!activeBlogImageUrls.has(oldUrl)) {
      deleteUnreferencedBlogImageFile(oldUrl, activeBlogImageUrls);
    }
  }

  existing.homepage_latest_news_config = savedPayload;
  existing.lastSynced = updatedAt;

  fs.writeFileSync(customizationsPath, JSON.stringify(existing, null, 2), 'utf-8');
  syncBlogArticlesDataTs(cleanNews, cleanStories);

  return savedPayload;
}

/**
 * Collects all /assets/treatments/... and /assets/... URLs currently referenced across
 * homepage_treatments_config, treatment_pricing_data, master_services_config_v1, and specialist areas
 * so replaced files can be safely deleted without removing shared assets.
 */
function collectActiveTreatmentAssetUrls(customizations: Record<string, any>): Set<string> {
  const active = new Set<string>();
  const addUrl = (val: unknown) => {
    if (typeof val === 'string' && val.trim()) {
      const clean = val.split('?')[0].split('#')[0].trim();
      if (clean.startsWith('/assets/')) {
        active.add(clean);
      }
    }
  };

  const treatCfg = customizations?.homepage_treatments_config;
  if (treatCfg && Array.isArray(treatCfg.treatments)) {
    for (const item of treatCfg.treatments) {
      addUrl(item?.image);
    }
  }
  if (Array.isArray(customizations?.treatment_pricing_data)) {
    for (const item of customizations.treatment_pricing_data) {
      addUrl(item?.image);
      addUrl(item?.coverMedia?.url);
    }
  }
  if (Array.isArray(customizations?.master_services_config_v1)) {
    for (const item of customizations.master_services_config_v1) {
      addUrl(item?.image);
      addUrl(item?.coverMedia?.url);
    }
  }
  if (Array.isArray(customizations?.homepage_specialist_areas_config_v4?.areas)) {
    for (const item of customizations.homepage_specialist_areas_config_v4.areas) {
      addUrl(item?.image);
      addUrl(item?.coverMedia?.url);
    }
  }
  for (const item of TREATMENT_PRICING_DATA) {
    addUrl((item as any)?.image);
  }
  const coverCfg = customizations?.homepage_treatment_cover_images_v1;
  if (coverCfg && Array.isArray(coverCfg.items)) {
    for (const item of coverCfg.items) {
      addUrl(item?.imageUrl);
    }
  }
  const diskManifestCovers = readTreatmentCoversManifestFromDisk();
  if (diskManifestCovers && Array.isArray(diskManifestCovers.items)) {
    for (const item of diskManifestCovers.items) {
      addUrl(item?.imageUrl);
    }
  }
  return active;
}

/**
 * Deletes a replaced /assets/treatments/<file> (or /assets/<file>) from both public and src directories
 * if it is not referenced in activeUrlsSet and is not a protected static seed file.
 */
function deleteReplacedTreatmentAssetFile(oldUrl: string, activeUrlsSet: Set<string>): string[] {
  const deleted: string[] = [];
  if (!oldUrl || typeof oldUrl !== 'string') return deleted;

  const cleanPath = oldUrl.split('?')[0].split('#')[0].trim();
  if (!cleanPath.startsWith('/assets/')) return deleted;
  if (cleanPath.startsWith('/assets/aistudio/') || cleanPath.startsWith('/assets/images/treatments/specialist-')) {
    return deleted;
  }

  const fileName = path.basename(cleanPath);
  if (!fileName || fileName.startsWith('specialist-') || fileName.startsWith('_')) return deleted;

  for (const activeUrl of activeUrlsSet) {
    const activeClean = activeUrl.split('?')[0].split('#')[0].trim();
    if (activeClean === cleanPath || path.basename(activeClean) === fileName) {
      return deleted;
    }
  }

  const isTreatmentSubdir = cleanPath.startsWith('/assets/treatments/');
  const targetDirs = isTreatmentSubdir
    ? [publicTreatmentsDir, ...(fs.existsSync(distTreatmentsDir) ? [distTreatmentsDir] : [])]
    : path.posix.dirname(cleanPath) === '/assets'
    ? [publicAssetsDir, ...(fs.existsSync(distAssetsDir) ? [distAssetsDir] : [])]
    : [];

  for (const dir of targetDirs) {
    try {
      const fullPath = path.join(dir, fileName);
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        fs.unlinkSync(fullPath);
        deleted.push(fileName);
        console.log(`[Admin Treatment Cleanup] Deleted replaced treatment asset: ${fullPath}`);
      }
    } catch (err) {
      console.warn(`[Admin Treatment Cleanup] Could not delete ${fileName} from ${dir}:`, err);
    }
  }

  return [...new Set(deleted)];
}

function syncTreatmentTaxonomyTs(taxonomy: any[]): void {
  if (!Array.isArray(taxonomy) || taxonomy.length === 0 || !fs.existsSync(treatmentPricingPath)) {
    return;
  }
  try {
    const existingContent = fs.readFileSync(treatmentPricingPath, 'utf-8');
    const startMarker = 'export const DEFAULT_TREATMENT_TAXONOMY: TreatmentTaxonomyGroup[] =';
    const endMarker = 'export function inferTreatmentSubGroup';
    const startIdx = existingContent.indexOf(startMarker);
    const endIdx = existingContent.indexOf(endMarker);

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const updatedTs =
        existingContent.slice(0, startIdx) +
        `${startMarker} ${JSON.stringify(taxonomy, null, 2)};\n\n` +
        existingContent.slice(endIdx);
      if (updatedTs !== existingContent) {
        fs.writeFileSync(treatmentPricingPath, updatedTs, 'utf-8');
        console.log(`[Admin] Synced treatment taxonomy (${taxonomy.length} groups) to ${treatmentPricingPath}`);
      }
    }
  } catch (err) {
    console.warn('[Admin] Could not sync treatment taxonomy to treatmentPricing.ts:', err);
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
    writeFileAtomicallySync(treatmentPricingPath, tsCode);
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
    writeFileAtomicallySync(customizationsPath, JSON.stringify(existing, null, 2));

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

export interface ClinicProcessStep {
  id: string;
  stepNumber: string;
  title: string;
  image: string;
  imageAlt?: string;
  seoKeywords?: string[];
}

export interface ClinicProcessSection {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  seoKeywords?: string[];
  steps: ClinicProcessStep[];
}

export interface ClinicFacilityRoomItem {
  id: string;
  title: string;
  tag: string;
  image: string;
  imageAlt?: string;
}

export interface ClinicFacilityGallerySection {
  eyebrow?: string;
  heading: string;
  seoKeywords?: string[];
  rooms: ClinicFacilityRoomItem[];
}

export interface ClinicTrustBrandItem {
  id: string;
  name: string;
  iconType: string;
  imageUrl?: string;
}

export interface ClinicTrustBrandsSection {
  heading: string;
  seoKeywords?: string[];
  brands: ClinicTrustBrandItem[];
}

export interface ClinicAccreditationsSection {
  eyebrow?: string;
  heading: string;
  description?: string;
  seoKeywords?: string[];
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
  processSection?: ClinicProcessSection;
  facilityGallery?: ClinicFacilityGallerySection;
  trustBrandsSection?: ClinicTrustBrandsSection;
  accreditationsSection?: ClinicAccreditationsSection;
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

const writeFileAtomicallySync = (targetPath: string, content: string): void => {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (fs.existsSync(targetPath)) {
    try {
      const current = fs.readFileSync(targetPath, 'utf-8');
      if (current === content) {
        return;
      }
    } catch {}
  }
  const tempPath = `${targetPath}.${process.pid}.${Date.now()}-${Math.random().toString(36).slice(2, 8)}.tmp`;
  fs.writeFileSync(tempPath, content, 'utf-8');
  fs.renameSync(tempPath, targetPath);
};

const normalizeServerClinicSlotId = (slotId: string): string => {
  if (!slotId) return 'clinic-asset-default';
  return String(slotId)
    .trim()
    .replace(/\.webp$/i, '')
    .replace(/^(\/assets\/|assets\/)/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .toLowerCase()
    .replace(/^clinic-location-(?:location-|loc-)/, 'clinic-location-')
    .replace(/^clinic-pillar-(?:pillar-|p-?)(?=\d)/, 'clinic-pillar-')
    .replace(/^clinic-award-(?:award-|aw-)/, 'clinic-award-')
    .replace(/^clinic-facility-(?:facility-room-|facility-|suite-|room-)/, 'clinic-facility-')
    .replace(/^clinic-process-(?:process-step-|process-|step-)/, 'clinic-process-')
    .replace(/^clinic-process-(\d)$/, 'clinic-process-0$1')
    .replace(/^clinic-brand-(?:brand-|bp-)/, 'clinic-brand-');
};

const resolveDiskClinicSlotImage = (slotId: string, ...candidates: Array<unknown>): string => {
  const cleanSlotId = normalizeServerClinicSlotId(slotId);
  const canonicalUrl = `/assets/${cleanSlotId}.webp`;
  const canonicalDiskPath = path.join(publicAssetsDir, `${cleanSlotId}.webp`);
  const canonicalExists = fs.existsSync(canonicalDiskPath);

  // 1. Prefer any non-empty candidate that points to an existing /assets/ file on disk or a valid external URL
  for (const cand of candidates) {
    if (typeof cand !== 'string') continue;
    const trimmed = cand.trim();
    if (!trimmed) continue;
    const cleanNoQuery = trimmed.split('?')[0].split('#')[0].trim();
    if (cleanNoQuery.startsWith('/assets/')) {
      const relFile = cleanNoQuery.replace(/^\/assets\//, '');
      const fullCandPath = path.join(publicAssetsDir, relFile);
      if (fs.existsSync(fullCandPath)) {
        return trimmed;
      }
      if (canonicalExists) {
        const versionMatch = trimmed.match(/[?&]v=([^&#]+)/);
        return versionMatch
          ? `${canonicalUrl}?v=${versionMatch[1]}`
          : `${canonicalUrl}?v=${Math.floor(fs.statSync(canonicalDiskPath).mtimeMs)}`;
      }
      // Do not return a local /assets/ path if the file does not exist on disk
    } else if (!trimmed.includes('images.unsplash.com')) {
      return trimmed;
    }
  }

  // 2. Auto-recover from public/assets/${cleanSlotId}.webp if the physical slot file exists on disk
  if (canonicalExists) {
    try {
      const mtime = Math.floor(fs.statSync(canonicalDiskPath).mtimeMs);
      return `${canonicalUrl}?v=${mtime}`;
    } catch {
      return canonicalUrl;
    }
  }

  return '';
};

const reconcileClinicDataWithDisk = (primary?: Record<string, any> | null, secondary?: Record<string, any> | null) => {
  const diskTs = parseClinicDataFromTsFile() || {};
  const p = primary && typeof primary === 'object' ? primary : {};
  const s = secondary && typeof secondary === 'object' ? secondary : {};
  const base: Record<string, any> = {
    ...CLINIC_DATA,
    ...diskTs,
    ...s,
    ...p,
  };

  const pickList = <T = any>(...lists: Array<unknown>): T[] => {
    for (const l of lists) {
      if (Array.isArray(l) && l.length > 0) return l as T[];
    }
    return [];
  };

  const findItemInSource = (list: unknown, id: string | undefined, idx: number): any => {
    if (!Array.isArray(list)) return {};
    if (id) {
      const byId = list.find((item: any) => item && String(item.id) === String(id));
      if (byId) return byId;
    }
    return list[idx] || {};
  };

  // Reconcile interiorPhotos
  let rawInteriorPhotos = pickList<string>(
    p.interiorPhotos,
    s.interiorPhotos,
    diskTs.interiorPhotos,
    CLINIC_DATA.interiorPhotos
  ).filter((u) => typeof u === 'string' && u.trim().length > 0);

  if (rawInteriorPhotos.length === 0) {
    const slot0 = resolveDiskClinicSlotImage('clinic-interior-0');
    if (slot0) rawInteriorPhotos = [slot0];
  } else {
    rawInteriorPhotos = rawInteriorPhotos
      .map((url, idx) => resolveDiskClinicSlotImage(`clinic-interior-${idx}`, url))
      .filter((u) => Boolean(u));
  }

  // Reconcile locations across all 4 sources (p, s, diskTs, CLINIC_DATA)
  const baseLocations = pickList<any>(p.locations, s.locations, diskTs.locations, CLINIC_DATA.locations);
  const locations = baseLocations.map((loc: any, idx: number) => {
    const locId = loc?.id || `loc-${idx + 1}`;
    const fromP = findItemInSource(p.locations, locId, idx);
    const fromS = findItemInSource(s.locations, locId, idx);
    const fromDiskTs = findItemInSource(diskTs.locations, locId, idx);
    const fromBaked = findItemInSource(CLINIC_DATA.locations, locId, idx);
    const slotId = normalizeServerClinicSlotId(`clinic-location-${locId}`);
    return {
      ...fromBaked,
      ...fromDiskTs,
      ...fromS,
      ...fromP,
      ...loc,
      id: locId,
      image: resolveDiskClinicSlotImage(
        slotId,
        loc?.image,
        fromP?.image,
        fromS?.image,
        fromDiskTs?.image,
        fromBaked?.image
      ),
    };
  });

  // Reconcile whyChooseUs pillars across all 4 sources
  const basePillars = pickList<any>(
    p.whyChooseUs?.pillars,
    s.whyChooseUs?.pillars,
    diskTs.whyChooseUs?.pillars,
    CLINIC_DATA.whyChooseUs?.pillars
  );
  const pillars = basePillars.map((pillar: any, idx: number) => {
    const pillarId = pillar?.id || `p${idx + 1}`;
    const fromP = findItemInSource(p.whyChooseUs?.pillars, pillarId, idx);
    const fromS = findItemInSource(s.whyChooseUs?.pillars, pillarId, idx);
    const fromDiskTs = findItemInSource(diskTs.whyChooseUs?.pillars, pillarId, idx);
    const fromBaked = findItemInSource(CLINIC_DATA.whyChooseUs?.pillars, pillarId, idx);
    const slotId = normalizeServerClinicSlotId(`clinic-pillar-${pillarId}`);
    return {
      ...fromBaked,
      ...fromDiskTs,
      ...fromS,
      ...fromP,
      ...pillar,
      id: pillarId,
      imageUrl: resolveDiskClinicSlotImage(
        slotId,
        pillar?.imageUrl,
        fromP?.imageUrl,
        fromS?.imageUrl,
        fromDiskTs?.imageUrl,
        fromBaked?.imageUrl
      ),
    };
  });

  // Reconcile awardsShowcase awards across all 4 sources
  const baseAwards = pickList<any>(
    p.awardsShowcase?.awards,
    s.awardsShowcase?.awards,
    diskTs.awardsShowcase?.awards,
    CLINIC_DATA.awardsShowcase?.awards
  );
  const awards = baseAwards.map((award: any, idx: number) => {
    const awardId = award?.id || `award-${idx + 1}`;
    const fromP = findItemInSource(p.awardsShowcase?.awards, awardId, idx);
    const fromS = findItemInSource(s.awardsShowcase?.awards, awardId, idx);
    const fromDiskTs = findItemInSource(diskTs.awardsShowcase?.awards, awardId, idx);
    const fromBaked = findItemInSource(CLINIC_DATA.awardsShowcase?.awards, awardId, idx);
    const slotId = normalizeServerClinicSlotId(`clinic-award-${awardId}`);
    return {
      ...fromBaked,
      ...fromDiskTs,
      ...fromS,
      ...fromP,
      ...award,
      id: awardId,
      imageUrl: resolveDiskClinicSlotImage(
        slotId,
        award?.imageUrl,
        fromP?.imageUrl,
        fromS?.imageUrl,
        fromDiskTs?.imageUrl,
        fromBaked?.imageUrl
      ),
    };
  });

  // Reconcile processSection steps across all 4 sources
  const baseSteps = pickList<any>(
    p.processSection?.steps,
    s.processSection?.steps,
    diskTs.processSection?.steps,
    CLINIC_DATA.processSection?.steps
  );
  const steps = baseSteps.map((step: any, idx: number) => {
    const stepNum = step?.stepNumber || String(idx + 1).padStart(2, '0');
    const stepId = step?.id || `step-${idx + 1}`;
    const fromP = findItemInSource(p.processSection?.steps, stepId, idx);
    const fromS = findItemInSource(s.processSection?.steps, stepId, idx);
    const fromDiskTs = findItemInSource(diskTs.processSection?.steps, stepId, idx);
    const fromBaked = findItemInSource(CLINIC_DATA.processSection?.steps, stepId, idx);
    const slotId = normalizeServerClinicSlotId(`clinic-process-${stepNum}`);
    return {
      ...fromBaked,
      ...fromDiskTs,
      ...fromS,
      ...fromP,
      ...step,
      id: stepId,
      stepNumber: stepNum,
      image: resolveDiskClinicSlotImage(
        slotId,
        step?.image,
        fromP?.image,
        fromS?.image,
        fromDiskTs?.image,
        fromBaked?.image
      ),
    };
  });

  // Reconcile facilityGallery rooms across all 4 sources
  const candidateRooms = pickList<any>(
    p.facilityGallery?.rooms,
    s.facilityGallery?.rooms,
    diskTs.facilityGallery?.rooms,
    CLINIC_DATA.facilityGallery?.rooms
  );
  const referenceRooms = pickList<any>(diskTs.facilityGallery?.rooms, s.facilityGallery?.rooms, CLINIC_DATA.facilityGallery?.rooms);
  const mergedRoomsRaw = [...candidateRooms];
  if (referenceRooms.length > mergedRoomsRaw.length) {
    const seenRoomIds = new Set(mergedRoomsRaw.map((r: any, i: number) => String(r?.id || `room-${i + 1}`)));
    for (let i = 0; i < referenceRooms.length; i++) {
      const refRoom = referenceRooms[i];
      const refId = String(refRoom?.id || `room-${i + 1}`);
      if (!seenRoomIds.has(refId)) {
        mergedRoomsRaw.push(refRoom);
        seenRoomIds.add(refId);
      }
    }
  }
  const rooms = mergedRoomsRaw.map((room: any, idx: number) => {
    const roomId = room?.id || `room-${idx + 1}`;
    const fromP = findItemInSource(p.facilityGallery?.rooms, roomId, idx);
    const fromS = findItemInSource(s.facilityGallery?.rooms, roomId, idx);
    const fromDiskTs = findItemInSource(diskTs.facilityGallery?.rooms, roomId, idx);
    const fromBaked = findItemInSource(CLINIC_DATA.facilityGallery?.rooms, roomId, idx);
    const slotId = normalizeServerClinicSlotId(`clinic-facility-${roomId}`);
    return {
      ...fromBaked,
      ...fromDiskTs,
      ...fromS,
      ...fromP,
      ...room,
      id: roomId,
      image: resolveDiskClinicSlotImage(
        slotId,
        room?.image,
        fromP?.image,
        fromS?.image,
        fromDiskTs?.image,
        fromBaked?.image
      ),
    };
  });

  // Reconcile trustBrandsSection brands across all 4 sources
  const baseBrands = pickList<any>(
    p.trustBrandsSection?.brands,
    s.trustBrandsSection?.brands,
    diskTs.trustBrandsSection?.brands,
    CLINIC_DATA.trustBrandsSection?.brands
  );
  const legacyPlaceholderBrandNames = new Set(['Lumina', 'Aether', 'Vera', 'Zenith', 'Nexus']);
  const brands = baseBrands.map((brand: any, idx: number) => {
    const brandId = brand?.id || `bp-${idx + 1}`;
    const fromP = findItemInSource(p.trustBrandsSection?.brands, brandId, idx);
    const fromS = findItemInSource(s.trustBrandsSection?.brands, brandId, idx);
    const fromDiskTs = findItemInSource(diskTs.trustBrandsSection?.brands, brandId, idx);
    const fromBaked = findItemInSource(CLINIC_DATA.trustBrandsSection?.brands, brandId, idx);
    const fb = { ...fromBaked, ...fromDiskTs, ...fromS };
    const slotId = normalizeServerClinicSlotId(`clinic-brand-${brandId}`);
    const useFallbackName =
      (!brand?.name || legacyPlaceholderBrandNames.has(String(brand.name).trim())) &&
      fb?.name &&
      !legacyPlaceholderBrandNames.has(String(fb.name).trim());
    return {
      ...fb,
      ...fromP,
      ...brand,
      id: brandId,
      name: useFallbackName ? fb.name : brand?.name || fb?.name || `Brand ${idx + 1}`,
      iconType: useFallbackName ? fb.iconType || brand?.iconType : brand?.iconType || fb?.iconType || 'layers',
      imageUrl: resolveDiskClinicSlotImage(
        slotId,
        brand?.imageUrl,
        fromP?.imageUrl,
        fromS?.imageUrl,
        fromDiskTs?.imageUrl,
        fromBaked?.imageUrl
      ),
    };
  });

  const merged = {
    ...base,
    ogImage: resolveDiskClinicSlotImage(
      'clinic-og-image',
      p.ogImage,
      s.ogImage,
      diskTs.ogImage,
      CLINIC_DATA.ogImage
    ),
    exteriorPhoto: resolveDiskClinicSlotImage(
      'clinic-exterior',
      p.exteriorPhoto,
      s.exteriorPhoto,
      diskTs.exteriorPhoto,
      CLINIC_DATA.exteriorPhoto
    ),
    logo: {
      ...(CLINIC_DATA.logo || {}),
      ...(diskTs.logo || {}),
      ...(s.logo || {}),
      ...(p.logo || {}),
      icon: resolveDiskClinicSlotImage(
        'clinic-logo-icon',
        p.logo?.icon,
        s.logo?.icon,
        diskTs.logo?.icon,
        CLINIC_DATA.logo?.icon
      ),
      full: resolveDiskClinicSlotImage(
        'clinic-logo-full',
        p.logo?.full,
        s.logo?.full,
        diskTs.logo?.full,
        CLINIC_DATA.logo?.full
      ),
      alt:
        p.logo?.alt ||
        s.logo?.alt ||
        diskTs.logo?.alt ||
        CLINIC_DATA.logo?.alt ||
        'Age Reversal Clinics Logo',
    },
    socials: {
      ...(CLINIC_DATA.socials || {}),
      ...(diskTs.socials || {}),
      ...(s.socials || {}),
      ...(p.socials || {}),
    },
    interiorPhotos: rawInteriorPhotos,
    locations,
    whyChooseUs: {
      ...(CLINIC_DATA.whyChooseUs || {}),
      ...(diskTs.whyChooseUs || {}),
      ...(s.whyChooseUs || {}),
      ...(p.whyChooseUs || {}),
      pillars,
    },
    awardsShowcase: {
      ...(CLINIC_DATA.awardsShowcase || {}),
      ...(diskTs.awardsShowcase || {}),
      ...(s.awardsShowcase || {}),
      ...(p.awardsShowcase || {}),
      awards,
    },
    consultationConfig: {
      ...(CLINIC_DATA.consultationConfig || {}),
      ...(diskTs.consultationConfig || {}),
      ...(s.consultationConfig || {}),
      ...(p.consultationConfig || {}),
      doctors: pickList(
        p.consultationConfig?.doctors,
        s.consultationConfig?.doctors,
        diskTs.consultationConfig?.doctors,
        CLINIC_DATA.consultationConfig?.doctors
      ),
      defaultTimeSlots: pickList(
        p.consultationConfig?.defaultTimeSlots,
        s.consultationConfig?.defaultTimeSlots,
        diskTs.consultationConfig?.defaultTimeSlots,
        CLINIC_DATA.consultationConfig?.defaultTimeSlots
      ),
      bestTimeOptions: pickList(
        p.consultationConfig?.bestTimeOptions,
        s.consultationConfig?.bestTimeOptions,
        diskTs.consultationConfig?.bestTimeOptions,
        CLINIC_DATA.consultationConfig?.bestTimeOptions
      ),
      hearAboutUsOptions: pickList(
        p.consultationConfig?.hearAboutUsOptions,
        s.consultationConfig?.hearAboutUsOptions,
        diskTs.consultationConfig?.hearAboutUsOptions,
        CLINIC_DATA.consultationConfig?.hearAboutUsOptions
      ),
      stayInTouchChannels: pickList(
        p.consultationConfig?.stayInTouchChannels,
        s.consultationConfig?.stayInTouchChannels,
        diskTs.consultationConfig?.stayInTouchChannels,
        CLINIC_DATA.consultationConfig?.stayInTouchChannels
      ),
    },
    processSection: {
      ...(CLINIC_DATA.processSection || {}),
      ...(diskTs.processSection || {}),
      ...(s.processSection || {}),
      ...(p.processSection || {}),
      seoKeywords: pickList(
        p.processSection?.seoKeywords,
        s.processSection?.seoKeywords,
        diskTs.processSection?.seoKeywords,
        CLINIC_DATA.processSection?.seoKeywords
      ),
      steps,
    },
    facilityGallery: {
      ...(CLINIC_DATA.facilityGallery || {}),
      ...(diskTs.facilityGallery || {}),
      ...(s.facilityGallery || {}),
      ...(p.facilityGallery || {}),
      seoKeywords: pickList(
        p.facilityGallery?.seoKeywords,
        s.facilityGallery?.seoKeywords,
        diskTs.facilityGallery?.seoKeywords,
        CLINIC_DATA.facilityGallery?.seoKeywords
      ),
      rooms,
    },
    trustBrandsSection: {
      ...(CLINIC_DATA.trustBrandsSection || {}),
      ...(diskTs.trustBrandsSection || {}),
      ...(s.trustBrandsSection || {}),
      ...(p.trustBrandsSection || {}),
      seoKeywords: pickList(
        p.trustBrandsSection?.seoKeywords,
        s.trustBrandsSection?.seoKeywords,
        diskTs.trustBrandsSection?.seoKeywords,
        CLINIC_DATA.trustBrandsSection?.seoKeywords
      ),
      brands,
    },
    accreditationsSection: {
      ...(CLINIC_DATA.accreditationsSection || {}),
      ...(diskTs.accreditationsSection || {}),
      ...(s.accreditationsSection || {}),
      ...(p.accreditationsSection || {}),
      seoKeywords: pickList(
        p.accreditationsSection?.seoKeywords,
        s.accreditationsSection?.seoKeywords,
        diskTs.accreditationsSection?.seoKeywords,
        CLINIC_DATA.accreditationsSection?.seoKeywords
      ),
    },
  };

  verifyAndRepairClinicDataAssets(merged);
  return merged;
};

const countPopulatedClinicImages = (data: any): number => {
  if (!data || typeof data !== 'object') return 0;
  let count = 0;
  const check = (val: unknown) => {
    if (typeof val === 'string' && val.trim().length > 0) count++;
  };
  check(data.ogImage);
  check(data.exteriorPhoto);
  check(data.logo?.icon);
  check(data.logo?.full);
  if (Array.isArray(data.interiorPhotos)) data.interiorPhotos.forEach(check);
  if (Array.isArray(data.locations)) data.locations.forEach((l: any) => check(l?.image));
  if (Array.isArray(data.whyChooseUs?.pillars)) data.whyChooseUs.pillars.forEach((p: any) => check(p?.imageUrl));
  if (Array.isArray(data.awardsShowcase?.awards)) data.awardsShowcase.awards.forEach((a: any) => check(a?.imageUrl));
  if (Array.isArray(data.processSection?.steps)) data.processSection.steps.forEach((s: any) => check(s?.image));
  if (Array.isArray(data.facilityGallery?.rooms)) data.facilityGallery.rooms.forEach((r: any) => check(r?.image));
  if (Array.isArray(data.trustBrandsSection?.brands)) data.trustBrandsSection.brands.forEach((b: any) => check(b?.imageUrl));
  return count;
};

const getMergedClinicData = () => {
  const diskTsClinicData = parseClinicDataFromTsFile();
  let customClinicData: Record<string, any> | null = null;
  let fullCustomizations: Record<string, any> | null = null;
  if (fs.existsSync(customizationsPath)) {
    try {
      fullCustomizations = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      if (fullCustomizations && fullCustomizations.clinic_info_data && typeof fullCustomizations.clinic_info_data === 'object') {
        customClinicData = fullCustomizations.clinic_info_data;
      }
    } catch (e) {
      console.error('Error reading customizations for clinic-data:', e);
    }
  }

  // Determine whether clinicInfo.ts was more recently modified (e.g. copied & pasted by user)
  // or contains more populated images than siteCustomizations.json
  let preferTsFile = false;
  try {
    if (fs.existsSync(clinicInfoPath) && fs.existsSync(customizationsPath)) {
      const tsMtime = fs.statSync(clinicInfoPath).mtimeMs;
      const jsonMtime = fs.statSync(customizationsPath).mtimeMs;
      if (tsMtime > jsonMtime + 500) {
        preferTsFile = true;
      }
    }
  } catch {
    // ignore stat errors
  }

  if (!preferTsFile && diskTsClinicData && customClinicData) {
    const tsImgCount = countPopulatedClinicImages(diskTsClinicData);
    const jsonImgCount = countPopulatedClinicImages(customClinicData);
    if (tsImgCount > jsonImgCount) {
      preferTsFile = true;
    }
  }

  const merged = preferTsFile
    ? reconcileClinicDataWithDisk(diskTsClinicData, customClinicData)
    : reconcileClinicDataWithDisk(customClinicData, diskTsClinicData);

  // If clinicInfo.ts had newer/more complete data than siteCustomizations.json, auto-sync siteCustomizations.json
  if (preferTsFile && fullCustomizations) {
    try {
      const prevJsonStr = JSON.stringify(fullCustomizations.clinic_info_data || {});
      const nextJsonStr = JSON.stringify(merged);
      if (prevJsonStr !== nextJsonStr) {
        applyClinicDataToCustomizationsObject(fullCustomizations, merged);
        fullCustomizations.lastSynced = new Date().toISOString();
        fs.writeFileSync(customizationsPath, JSON.stringify(fullCustomizations, null, 2), 'utf-8');
      }
    } catch (syncErr) {
      console.warn('Could not auto-sync clinicInfo.ts changes to siteCustomizations.json:', syncErr);
    }
  }

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

  if (Array.isArray(clinicData.processSection?.steps)) {
    for (const step of clinicData.processSection.steps) {
      if (!step || typeof step !== 'object') continue;
      pushIfString(step.image);
    }
  }

  if (Array.isArray(clinicData.facilityGallery?.rooms)) {
    for (const room of clinicData.facilityGallery.rooms) {
      if (!room || typeof room !== 'object') continue;
      pushIfString(room.image);
    }
  }

  if (Array.isArray(clinicData.trustBrandsSection?.brands)) {
    for (const brand of clinicData.trustBrandsSection.brands) {
      if (!brand || typeof brand !== 'object') continue;
      pushIfString(brand.imageUrl);
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

  // Never delete canonical /assets/clinic-*.webp permanent slot files
  if (/^clinic-.+\.webp$/i.test(fileName)) {
    return false;
  }

  // Ensure the file is not still referenced by another slot in clinicInfo.ts
  for (const activeUrl of activeUrlsSet) {
    const activeClean = activeUrl.split('?')[0].split('#')[0].trim();
    if (activeClean === cleanPath || path.basename(activeClean) === fileName) {
      return false;
    }
  }

  let deletedAny = false;
  for (const targetDir of [publicAssetsDir, ...(fs.existsSync(distAssetsDir) ? [distAssetsDir] : [])]) {
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
// and all permanent clinic-*.webp slot files exist in public/assets/ (and dist/assets/ if exists)
const verifyAndRepairClinicDataAssets = (clinicData?: any): number => {
  let repairedCount = 0;

  if (clinicData && typeof clinicData === 'object') {
    const uniqueUrls = Array.from(new Set(collectClinicDataAssetUrls(clinicData)));
    for (const cleanPath of uniqueUrls) {
      const fileName = path.basename(cleanPath);
      if (!fileName) continue;

      const primaryDir = cleanPath.startsWith('/assets/treatments/')
        ? publicTreatmentsDir
        : cleanPath.startsWith('/assets/transformations/')
        ? publicTransformationsDir
        : publicAssetsDir;

      const candidatePath = path.join(primaryDir, fileName);
      if (!fs.existsSync(candidatePath)) {
        console.warn(`[Admin Asset Verify] Referenced clinic asset not found on disk: ${cleanPath}`);
      }
    }
  }

  // Mirror permanent slot files starting with 'clinic-' to dist/assets/ if dist exists
  if (fs.existsSync(publicAssetsDir) && fs.existsSync(distAssetsDir)) {
    try {
      const files = fs.readdirSync(publicAssetsDir);
      for (const file of files) {
        if (file.startsWith('clinic-') && file.endsWith('.webp')) {
          const srcPath = path.join(publicAssetsDir, file);
          const destPath = path.join(distAssetsDir, file);
          if (fs.statSync(srcPath).isFile() && !fs.existsSync(destPath)) {
            fs.copyFileSync(srcPath, destPath);
            repairedCount++;
          }
        }
      }
    } catch (readErr) {
      console.warn(`[Permanent Slot Repair] Error syncing to distAssetsDir:`, readErr);
    }
  }

  return repairedCount;
};

// Helper: Synchronize clinicData and its derived homepage section configs into a customizations object
const applyClinicDataToCustomizationsObject = (existing: Record<string, any>, clinicData: any): void => {
  existing.clinic_info_data = clinicData;
  if (clinicData.logo && typeof clinicData.logo === 'object') {
    const resolvedLogoUrl = (clinicData.logo.icon || clinicData.logo.full) ?? '';
    existing.homepage_header_config = {
      ...(existing.homepage_header_config || { primaryName: 'Age Reversal', secondaryName: 'Clinic' }),
      logoUrl: resolvedLogoUrl,
    };
  }
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
        imageUrl: loc.image ?? ""
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

  if (clinicData.processSection && typeof clinicData.processSection === 'object') {
    existing.homepage_process_config = {
      eyebrow: clinicData.processSection.eyebrow || "Our Process",
      heading: clinicData.processSection.heading || "The Journey to Radiance",
      subheading:
        clinicData.processSection.subheading ||
        "From initial diagnostic skin mapping to bespoke clinical protocols and ongoing regenerative care.",
      seoKeywords: Array.isArray(clinicData.processSection.seoKeywords)
        ? clinicData.processSection.seoKeywords
        : [],
      steps: Array.isArray(clinicData.processSection.steps) ? clinicData.processSection.steps : [],
    };
  }

  if (clinicData.facilityGallery && typeof clinicData.facilityGallery === 'object') {
    existing.homepage_facility_interiors_config = {
      eyebrow: clinicData.facilityGallery.eyebrow || "Our Facility",
      heading: clinicData.facilityGallery.heading || "Clinic Gallery",
      seoKeywords: Array.isArray(clinicData.facilityGallery.seoKeywords)
        ? clinicData.facilityGallery.seoKeywords
        : [],
      rooms: Array.isArray(clinicData.facilityGallery.rooms) ? clinicData.facilityGallery.rooms : [],
    };
  }

  if (clinicData.trustBrandsSection && typeof clinicData.trustBrandsSection === 'object') {
    existing.homepage_trust_brands_config = {
      heading: clinicData.trustBrandsSection.heading || "Over 1,000+ Brands & Laboratories Trust Us",
      seoKeywords: Array.isArray(clinicData.trustBrandsSection.seoKeywords)
        ? clinicData.trustBrandsSection.seoKeywords
        : [],
      brands: Array.isArray(clinicData.trustBrandsSection.brands)
        ? clinicData.trustBrandsSection.brands
        : [],
    };
  }

  if (clinicData.accreditationsSection && typeof clinicData.accreditationsSection === 'object') {
    existing.homepage_accreditations_config = {
      eyebrow: clinicData.accreditationsSection.eyebrow || "Accreditations & Certifications",
      heading: clinicData.accreditationsSection.heading || "Excellence guaranteed. Trusted globally.",
      description:
        clinicData.accreditationsSection.description ||
        "We adhere to the highest international medical standards. Our facilities and practitioners are rigorously vetted by leading global dermatological and healthcare authorities.",
      seoKeywords: Array.isArray(clinicData.accreditationsSection.seoKeywords)
        ? clinicData.accreditationsSection.seoKeywords
        : [],
      items: Array.isArray(clinicData.accreditations) ? clinicData.accreditations : [],
    };
  }
};

// Handler for saving clinic data atomically to both src/data/clinicInfo.ts and src/data/siteCustomizations.json
const handleSaveClinicData = (req: any, res: any) => {
  try {
    const rawClinicData = req.body.clinicData || req.body;
    if (!rawClinicData || typeof rawClinicData !== 'object' || !rawClinicData.name) {
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

    // Reconcile with disk slot images so stale "" values never wipe out existing /assets/clinic-*.webp files
    const clinicData = reconcileClinicDataWithDisk(rawClinicData, previousTsData);

    // 0. Auto-verify and repair all referenced clinic logo, interior, exterior, and location assets
    const repairedAssetCount = verifyAndRepairClinicDataAssets(clinicData);
    if (repairedAssetCount > 0) {
      console.log(`[Admin] Auto-repaired ${repairedAssetCount} missing clinic asset mirror(s) before saving clinicInfo.ts`);
    }

    // 0b. Delete any replaced or removed non-canonical clinicInfo.ts assets from public/assets/
    const activeUrlsSet = new Set<string>(collectClinicDataAssetUrls(clinicData));
    for (const oldUrl of previousUrls) {
      if (!activeUrlsSet.has(oldUrl)) {
        deleteReplacedClinicAssetFile(oldUrl, activeUrlsSet);
      }
    }

    // 1. Prepare both clinicInfo.ts TypeScript code and siteCustomizations.json payload, then write atomically
    const tsCode = generateClinicInfoTs(clinicData);
    applyClinicDataToCustomizationsObject(existing, clinicData);
    existing.lastSynced = new Date().toISOString();
    const jsonPayload = JSON.stringify(existing, null, 2);

    writeFileAtomicallySync(clinicInfoPath, tsCode);
    writeFileAtomicallySync(customizationsPath, jsonPayload);
    console.log(`[Admin] Atomically persisted updated clinicData to ${clinicInfoPath} and ${customizationsPath}`);

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

  // Check which treatment IDs actually have an uploaded image file in public/assets/treatments
  const existingDiskFiles = new Map<string, { path: string; mtimeMs: number }>();
  for (const dir of [publicTreatmentsDir, distTreatmentsDir]) {
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
      let serverTaxonomy = DEFAULT_TREATMENT_TAXONOMY;
      if (fs.existsSync(customizationsPath)) {
        try {
          const customizations = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
          if (
            customizations.treatment_taxonomy_data &&
            Array.isArray(customizations.treatment_taxonomy_data) &&
            customizations.treatment_taxonomy_data.length > 0
          ) {
            serverTaxonomy = customizations.treatment_taxonomy_data;
          }
        } catch {
          // ignore
        }
      }

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
        taxonomy: serverTaxonomy,
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

// GET /api/admin/treatment-taxonomy
app.get('/api/admin/treatment-taxonomy', (_req, res) => {
  try {
    if (fs.existsSync(customizationsPath)) {
      try {
        const customizations = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
        if (
          customizations.treatment_taxonomy_data &&
          Array.isArray(customizations.treatment_taxonomy_data) &&
          customizations.treatment_taxonomy_data.length > 0
        ) {
          return res.json({ success: true, taxonomy: customizations.treatment_taxonomy_data });
        }
      } catch {
        // fall through to default taxonomy
      }
    }
    return res.json({ success: true, taxonomy: DEFAULT_TREATMENT_TAXONOMY });
  } catch (error) {
    console.error('Error fetching treatment taxonomy:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// POST /api/admin/treatment-taxonomy
app.post('/api/admin/treatment-taxonomy', (req, res) => {
  try {
    const { taxonomy, treatment_taxonomy_data, data } = req.body;
    const payload = taxonomy || treatment_taxonomy_data || data || req.body;
    if (!payload || !Array.isArray(payload)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid treatment taxonomy data. Must be an array of taxonomy groups.',
      });
    }

    // 1. Bake directly to src/data/treatmentPricing.ts so it persists across builds
    syncTreatmentTaxonomyTs(payload);

    // 2. Persist to siteCustomizations.json
    let existing: Record<string, any> = {};
    if (fs.existsSync(customizationsPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      } catch {
        existing = {};
      }
    }

    existing.treatment_taxonomy_data = payload;
    existing.lastSynced = new Date().toISOString();
    fs.writeFileSync(customizationsPath, JSON.stringify(existing, null, 2), 'utf-8');

    return res.json({
      success: true,
      message: 'Treatment taxonomy successfully saved to treatmentPricing.ts and siteCustomizations.json',
      taxonomy: payload,
      updatedAt: existing.lastSynced,
    });
  } catch (error) {
    console.error('Error saving treatment taxonomy:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// API: Get current persisted file config
app.get('/api/admin/config', (_req, res) => {
  try {
    if (fs.existsSync(customizationsPath)) {
      const data = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      let modified = false;

      const reconciledGallery = reconcileBeforeAfterGalleryConfig(
        data.homepage_gallery_config_v6,
        data.homepage_gallery_config_v6,
        false
      );
      if (JSON.stringify(data.homepage_gallery_config_v6) !== JSON.stringify(reconciledGallery)) {
        data.homepage_gallery_config_v6 = reconciledGallery;
        syncTransformationsDataTs(reconciledGallery);
        modified = true;
      }

      const reconciledCovers = reconcileHomepageTreatmentCoversConfig(
        data.homepage_treatment_cover_images_v1,
        data.homepage_treatment_cover_images_v1
      );
      if (
        JSON.stringify(data.homepage_treatment_cover_images_v1?.items) !==
        JSON.stringify(reconciledCovers.items)
      ) {
        data.homepage_treatment_cover_images_v1 = reconciledCovers;
        modified = true;
      }

      if (modified) {
        data.lastSynced = new Date().toISOString();
        writeFileAtomicallySync(customizationsPath, JSON.stringify(data, null, 2));
      }
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

    // Preserve existing homepage_treatments_config card images & SEO metadata so saving
    // Services & Branches (master_services_config_v1 / homepage_specialist_areas_config_v4) never overwrites them
    const prevTreatmentsConfig = existing.homepage_treatments_config;
    const prevGalleryConfig = existing.homepage_gallery_config_v6;
    const prevServerBlogConfig = getServerBlogConfig();

    if (allConfigs && typeof allConfigs === 'object') {
      existing = { ...existing, ...allConfigs };
    } else if (key && data !== undefined) {
      existing[key] = data;
    }

    // If Services & Branches was saved, ensure any existing custom images & SEO fields in homepage_treatments_config are preserved
    if (
      (key === 'master_services_config_v1' || key === 'homepage_specialist_areas_config_v4') &&
      prevTreatmentsConfig &&
      Array.isArray(prevTreatmentsConfig.treatments)
    ) {
      const prevById = new Map<string, any>(
        prevTreatmentsConfig.treatments.map((t: any) => [String(t.id), t])
      );
      const currentList = Array.isArray(existing.homepage_treatments_config?.treatments)
        ? existing.homepage_treatments_config.treatments
        : prevTreatmentsConfig.treatments;

      existing.homepage_treatments_config = {
        ...prevTreatmentsConfig,
        ...(existing.homepage_treatments_config || {}),
        seoKeywords:
          Array.isArray(existing.homepage_treatments_config?.seoKeywords) &&
          existing.homepage_treatments_config.seoKeywords.length > 0
            ? existing.homepage_treatments_config.seoKeywords
            : prevTreatmentsConfig.seoKeywords || [],
        treatments: currentList.map((item: any, idx: number) => {
          const prevItem = prevById.get(String(item.id));
          return projectServerHomepageTreatmentCard(
            {
              ...item,
              image: prevItem?.image || item.image,
              imageAlt: prevItem?.imageAlt || item.imageAlt,
              seoTitle: prevItem?.seoTitle || item.seoTitle,
              seoKeywords:
                Array.isArray(prevItem?.seoKeywords) && prevItem.seoKeywords.length > 0
                  ? prevItem.seoKeywords
                  : item.seoKeywords,
            },
            idx
          );
        }),
      };
    }

    const isTargetKey = (targetKey: string) =>
      key === targetKey || Boolean(allConfigs && Object.prototype.hasOwnProperty.call(allConfigs, targetKey));

    // If homepage_treatments_config is part of this save, project exact required fields and bake into src/data.ts
    if (
      isTargetKey('homepage_treatments_config') &&
      existing.homepage_treatments_config &&
      typeof existing.homepage_treatments_config === 'object' &&
      Array.isArray(existing.homepage_treatments_config.treatments)
    ) {
      existing.homepage_treatments_config = {
        editorialHeading: existing.homepage_treatments_config.editorialHeading || 'rejuvenation',
        editorialSub: existing.homepage_treatments_config.editorialSub || 'Begin your transformation',
        description:
          existing.homepage_treatments_config.description ||
          'At Age Reversal Clinic, we believe that aesthetic harmony elevates self-confidence. Our clinical therapists custom-tailor skin therapy sessions, premium facials, and micropigmentation protocols to support your personal wellness ritual.',
        seoKeywords: Array.isArray(existing.homepage_treatments_config.seoKeywords)
          ? existing.homepage_treatments_config.seoKeywords
          : [
              'age reversal clinic london treatments',
              'regenerative aesthetics london',
              'non-surgical facial rejuvenation',
              'body sculpting & skin boosters london',
              'clinical dermatology procedures',
            ],
        treatments: existing.homepage_treatments_config.treatments.map((item: any, idx: number) =>
          projectServerHomepageTreatmentCard(item, idx)
        ),
      };
      syncHomepageTreatmentsDataTs(existing.homepage_treatments_config);
    }

    // If clinic_info_data is part of this save (e.g. via allConfigs or direct key), reconcile with disk assets and bake into src/data/clinicInfo.ts
    if (
      isTargetKey('clinic_info_data') &&
      existing.clinic_info_data &&
      typeof existing.clinic_info_data === 'object'
    ) {
      try {
        const reconciledClinicData = reconcileClinicDataWithDisk(
          existing.clinic_info_data,
          parseClinicDataFromTsFile()
        );
        existing.clinic_info_data = reconciledClinicData;
        verifyAndRepairClinicDataAssets(reconciledClinicData);
        applyClinicDataToCustomizationsObject(existing, reconciledClinicData);
        const tsCode = generateClinicInfoTs(reconciledClinicData);
        writeFileAtomicallySync(clinicInfoPath, tsCode);
        console.log(`[Admin] Also synced reconciled clinicInfo.ts via save-to-files`);
      } catch (err) {
        console.error('[Admin] Error baking clinicInfo.ts during save-to-files:', err);
      }
    }

    // If homepage_gallery_config_v6 is part of this save, reconcile with disk & transformationsData.ts and sync
    if (
      isTargetKey('homepage_gallery_config_v6') &&
      existing.homepage_gallery_config_v6 &&
      typeof existing.homepage_gallery_config_v6 === 'object'
    ) {
      const reconciledGallery = reconcileBeforeAfterGalleryConfig(
        existing.homepage_gallery_config_v6,
        prevGalleryConfig,
        false
      );
      existing.homepage_gallery_config_v6 = reconciledGallery;
      syncTransformationsDataTs(reconciledGallery);
    }

    // If homepage_treatment_cover_images_v1 is part of this save, reconcile with disk & _treatment_covers_manifest.json
    if (
      isTargetKey('homepage_treatment_cover_images_v1') &&
      existing.homepage_treatment_cover_images_v1 &&
      typeof existing.homepage_treatment_cover_images_v1 === 'object'
    ) {
      existing.homepage_treatment_cover_images_v1 = reconcileHomepageTreatmentCoversConfig(
        existing.homepage_treatment_cover_images_v1,
        existing.homepage_treatment_cover_images_v1
      );
    }

    // If master_services_config_v1 or homepage_specialist_areas_config_v4 is part of this save,
    // also bake directly into src/data/specialistTreatments.ts so service images, names & branches persist after build/deploy
    if (
      isTargetKey('master_services_config_v1') &&
      Array.isArray(existing.master_services_config_v1) &&
      existing.master_services_config_v1.length > 0
    ) {
      syncSpecialistTreatmentsTs(existing.master_services_config_v1);
    } else if (
      isTargetKey('homepage_specialist_areas_config_v4') &&
      existing.homepage_specialist_areas_config_v4 &&
      Array.isArray(existing.homepage_specialist_areas_config_v4.areas) &&
      existing.homepage_specialist_areas_config_v4.areas.length > 0
    ) {
      syncSpecialistTreatmentsTs(existing.homepage_specialist_areas_config_v4.areas);
    }

    // If treatment_taxonomy_data is part of this save, bake into src/data/treatmentPricing.ts
    if (
      isTargetKey('treatment_taxonomy_data') &&
      Array.isArray(existing.treatment_taxonomy_data) &&
      existing.treatment_taxonomy_data.length > 0
    ) {
      syncTreatmentTaxonomyTs(existing.treatment_taxonomy_data);
    }

    // If homepage_latest_news_config is part of this save, reconcile with server state so stale localStorage never wipes out saved blog images or posts
    if (
      isTargetKey('homepage_latest_news_config') &&
      existing.homepage_latest_news_config &&
      typeof existing.homepage_latest_news_config === 'object'
    ) {
      const rawNewsCfg = existing.homepage_latest_news_config;
      if (Array.isArray(rawNewsCfg.newsArticles) || Array.isArray(rawNewsCfg.storyArticles)) {
        const incomingNews = Array.isArray(rawNewsCfg.newsArticles) ? rawNewsCfg.newsArticles : [];
        const incomingStories = Array.isArray(rawNewsCfg.storyArticles) ? rawNewsCfg.storyArticles : [];
        const cleanNews = reconcileBlogArticleLists(
          prevServerBlogConfig.newsArticles,
          incomingNews,
          'news'
        );
        const cleanStories = reconcileBlogArticleLists(
          prevServerBlogConfig.storyArticles,
          incomingStories,
          'stories'
        );
        existing.homepage_latest_news_config = {
          heading: rawNewsCfg.heading || prevServerBlogConfig.heading || 'Latest News & Insights',
          description:
            rawNewsCfg.description ||
            prevServerBlogConfig.description ||
            'Stay informed on the latest clinical advancements.',
          newsArticles: cleanNews,
          storyArticles: cleanStories,
          updatedAt: new Date().toISOString(),
        };
        syncBlogArticlesDataTs(cleanNews, cleanStories);
      }
    }

    existing.lastSynced = new Date().toISOString();

    writeFileAtomicallySync(customizationsPath, JSON.stringify(existing, null, 2));
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
// HOMEPAGE TREATMENTS BENTO SECTION: PAGINATED QUERY, PERSISTENCE & WEBP UPLOAD
// ============================================================================
app.get('/api/admin/homepage-treatments', (req, res) => {
  try {
    let rawConfig: any = null;
    if (fs.existsSync(customizationsPath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
        if (existing && existing.homepage_treatments_config) {
          rawConfig = existing.homepage_treatments_config;
        }
      } catch {
        rawConfig = null;
      }
    }

    const savedById = new Map<string, any>();
    if (rawConfig && Array.isArray(rawConfig.treatments)) {
      for (const t of rawConfig.treatments) {
        if (t && t.id) {
          savedById.set(String(t.id).trim().toLowerCase(), t);
        }
      }
    }

    // Project strictly the required card columns for every subcategory treatment card
    const allProjected = TREATMENTS.map((baseItem: any, idx: number) => {
      const saved =
        savedById.get(String(baseItem.id || '').toLowerCase()) ||
        savedById.get(String(baseItem.subGroupId || '').toLowerCase());
      return projectServerHomepageTreatmentCard(
        {
          ...baseItem,
          ...(saved && saved.id === baseItem.id ? saved : {}),
          image:
            (saved && saved.id === baseItem.id && saved.image) ||
            (saved && saved.image && String(saved.image).startsWith('/assets/treatments/')
              ? saved.image
              : baseItem.image),
        },
        idx
      );
    });

    const tagFilter = req.query.tag || req.query.category ? String(req.query.tag || req.query.category).trim() : '';
    const subGroupFilter =
      req.query.subGroupId || req.query.subCategory
        ? String(req.query.subGroupId || req.query.subCategory).trim().toLowerCase()
        : '';
    const searchFilter = req.query.search ? String(req.query.search).trim().toLowerCase() : '';

    const filtered = allProjected.filter((item: any) => {
      if (tagFilter && tagFilter !== 'ALL' && tagFilter !== 'All' && item.tag.toLowerCase() !== tagFilter.toLowerCase()) {
        return false;
      }
      if (
        subGroupFilter &&
        subGroupFilter !== 'all' &&
        String(item.subGroupId || '').toLowerCase() !== subGroupFilter &&
        String(item.subCategory || '').toLowerCase() !== subGroupFilter
      ) {
        return false;
      }
      if (searchFilter) {
        const hay = `${item.name} ${item.tag} ${item.subCategory} ${item.description} ${item.imageAlt} ${item.seoTitle} ${(item.seoKeywords || []).join(' ')}`.toLowerCase();
        if (!hay.includes(searchFilter)) return false;
      }
      return true;
    });

    const totalCount = filtered.length;
    const limit = req.query.limit !== undefined ? Math.max(1, Number(req.query.limit) || 6) : totalCount || 6;
    const page = req.query.page !== undefined ? Math.max(1, Number(req.query.page) || 1) : 1;
    const offset =
      req.query.offset !== undefined
        ? Math.max(0, Number(req.query.offset) || 0)
        : (page - 1) * limit;

    const paginatedItems = filtered.slice(offset, offset + limit);
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const hasMore = offset + paginatedItems.length < totalCount;

    const cleanConfig = {
      editorialHeading: rawConfig?.editorialHeading || 'rejuvenation',
      editorialSub: rawConfig?.editorialSub || 'Begin your transformation',
      description:
        rawConfig?.description ||
        'At Age Reversal Clinic, we believe that aesthetic harmony elevates self-confidence. Our clinical therapists custom-tailor skin therapy sessions, premium facials, and micropigmentation protocols to support your personal wellness ritual.',
      seoKeywords: Array.isArray(rawConfig?.seoKeywords)
        ? rawConfig.seoKeywords
        : [
            'age reversal clinic london treatments',
            'regenerative aesthetics london',
            'non-surgical facial rejuvenation',
            'body sculpting & skin boosters london',
            'clinical dermatology procedures',
          ],
      treatments: allProjected,
    };

    return res.json({
      success: true,
      config: cleanConfig,
      data: paginatedItems,
      items: paginatedItems,
      totalCount,
      hasMore,
      page: Math.floor(offset / limit) + 1,
      totalPages,
      offset,
      limit,
    });
  } catch (error) {
    console.error('[Admin] Error reading Homepage Treatments config:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

app.post('/api/admin/homepage-treatments', (req, res) => {
  try {
    const incoming = req.body?.config || req.body?.data || req.body;
    if (!incoming || !Array.isArray(incoming.treatments)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Homepage Treatments configuration payload.',
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

    // Collect previous treatment image URLs so displaced files in /assets/treatments/ can be cleaned up
    const previousTreatUrls = new Set<string>();
    if (Array.isArray(existing.homepage_treatments_config?.treatments)) {
      for (const item of existing.homepage_treatments_config.treatments) {
        if (typeof item?.image === 'string' && item.image.startsWith('/assets/treatments/')) {
          previousTreatUrls.add(item.image.split('?')[0].split('#')[0].trim());
        }
      }
    }

    const normalizedConfig = {
      editorialHeading: incoming.editorialHeading || 'rejuvenation',
      editorialSub: incoming.editorialSub || 'Begin your transformation',
      description:
        incoming.description ||
        'At Age Reversal Clinic, we believe that aesthetic harmony elevates self-confidence. Our clinical therapists custom-tailor skin therapy sessions, premium facials, and micropigmentation protocols to support your personal wellness ritual.',
      seoKeywords: Array.isArray(incoming.seoKeywords)
        ? Array.from(new Set(incoming.seoKeywords.map((k: unknown) => String(k || '').trim()).filter(Boolean)))
        : [
            'age reversal clinic london treatments',
            'regenerative aesthetics london',
            'non-surgical facial rejuvenation',
            'body sculpting & skin boosters london',
            'clinical dermatology procedures',
          ],
      treatments: incoming.treatments.map((item: any, idx: number) =>
        projectServerHomepageTreatmentCard(item, idx)
      ),
    };

    existing.homepage_treatments_config = normalizedConfig;
    existing.lastSynced = new Date().toISOString();

    // Clean up any replaced /assets/treatments/ files that are no longer referenced anywhere
    const activeUrls = collectActiveTreatmentAssetUrls(existing);
    for (const oldUrl of previousTreatUrls) {
      if (!activeUrls.has(oldUrl)) {
        deleteReplacedTreatmentAssetFile(oldUrl, activeUrls);
      }
    }

    fs.writeFileSync(customizationsPath, JSON.stringify(existing, null, 2), 'utf-8');
    syncHomepageTreatmentsDataTs(normalizedConfig);

    console.log(`[Admin] Persisted Homepage Treatments config to siteCustomizations.json and src/data.ts`);
    return res.json({
      success: true,
      config: normalizedConfig,
      message: 'Homepage Treatments config saved to siteCustomizations.json and src/data.ts',
      updatedAt: existing.lastSynced,
    });
  } catch (error) {
    console.error('[Admin] Error saving Homepage Treatments config:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// ============================================================================
// HOMEPAGE TREATMENT COVER IMAGES: MULTI-IMAGE GALLERY, PAGINATION & WEBP UPLOAD
// ============================================================================
app.get('/api/admin/homepage-treatment-covers', (req, res) => {
  try {
    let existing: Record<string, any> = {};
    if (fs.existsSync(customizationsPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      } catch {
        existing = {};
      }
    }

    const rawJsonCovers = existing?.homepage_treatment_cover_images_v1 || null;
    const reconciled = reconcileHomepageTreatmentCoversConfig(rawJsonCovers, rawJsonCovers);

    if (JSON.stringify(rawJsonCovers?.items) !== JSON.stringify(reconciled.items)) {
      existing.homepage_treatment_cover_images_v1 = reconciled;
      existing.lastSynced = new Date().toISOString();
      writeFileAtomicallySync(customizationsPath, JSON.stringify(existing, null, 2));
    } else if (!fs.existsSync(treatmentCoversManifestPath)) {
      writeTreatmentCoversManifestToDisk(reconciled);
    }

    const allItems = reconciled.items;

    // Compute per-subcategory counts & default grid counts before filtering
    const subcategoryCounts: Record<string, number> = {};
    let defaultGridCount = 0;
    for (const item of allItems) {
      const subId = String(item.subCategoryId || '').toLowerCase();
      if (subId) {
        subcategoryCounts[subId] = (subcategoryCounts[subId] || 0) + 1;
      }
      if (item.showInDefaultGrid && !item.hidden) {
        defaultGridCount++;
      }
    }

    const subCategoryFilter =
      req.query.subCategoryId || req.query.subCategory
        ? String(req.query.subCategoryId || req.query.subCategory).trim().toLowerCase()
        : '';
    const branchFilter =
      req.query.branchCategory || req.query.category || req.query.tag
        ? String(req.query.branchCategory || req.query.category || req.query.tag).trim().toLowerCase()
        : '';
    const defaultGridOnly =
      req.query.showInDefaultGrid === 'true' || req.query.defaultGridOnly === 'true';
    const includeHidden = req.query.includeHidden !== 'false';
    const searchFilter = req.query.search ? String(req.query.search).trim().toLowerCase() : '';

    const filtered = allItems.filter((item: any) => {
      if (!includeHidden && item.hidden) return false;
      if (defaultGridOnly && !item.showInDefaultGrid) return false;
      if (
        branchFilter &&
        branchFilter !== 'all' &&
        String(item.branchCategory || '').toLowerCase() !== branchFilter
      ) {
        return false;
      }
      if (
        subCategoryFilter &&
        subCategoryFilter !== 'all' &&
        String(item.subCategoryId || '').toLowerCase() !== subCategoryFilter &&
        String(item.subCategoryName || '').toLowerCase() !== subCategoryFilter
      ) {
        return false;
      }
      if (searchFilter) {
        const hay = `${item.title || ''} ${item.caption || ''} ${item.subCategoryName || ''} ${item.branchCategory || ''} ${item.altText || ''} ${(item.seoKeywords || []).join(' ')}`.toLowerCase();
        if (!hay.includes(searchFilter)) return false;
      }
      return true;
    });

    const totalCount = filtered.length;
    const limit =
      req.query.limit !== undefined
        ? Math.max(1, Number(req.query.limit) || 12)
        : Math.max(1, totalCount || 12);
    const page = req.query.page !== undefined ? Math.max(1, Number(req.query.page) || 1) : 1;
    const offset =
      req.query.offset !== undefined
        ? Math.max(0, Number(req.query.offset) || 0)
        : (page - 1) * limit;

    const paginatedItems = filtered.slice(offset, offset + limit);
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const hasMore = offset + paginatedItems.length < totalCount;

    const isPaginatedQuery = req.query.limit !== undefined || req.query.page !== undefined || req.query.offset !== undefined;

    return res.json({
      success: true,
      ...(isPaginatedQuery ? {} : { config: reconciled }),
      data: paginatedItems,
      items: paginatedItems,
      totalCount,
      hasMore,
      page: Math.floor(offset / limit) + 1,
      totalPages,
      offset,
      limit,
      subcategoryCounts,
      defaultGridCount,
      updatedAt: reconciled.updatedAt,
    });
  } catch (error) {
    console.error('[Admin] Error reading Homepage Treatment Cover Images:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

app.post('/api/admin/homepage-treatment-covers', (req, res) => {
  try {
    const incoming = req.body?.config || req.body?.data || req.body;
    const items = Array.isArray(incoming?.items)
      ? incoming.items
      : Array.isArray(req.body?.items)
      ? req.body.items
      : Array.isArray(incoming)
      ? incoming
      : null;
    const deletedIds: string[] = Array.isArray(req.body?.deletedIds)
      ? req.body.deletedIds.map((id: unknown) => String(id || '').trim()).filter(Boolean)
      : [];
    const restoredDefaults = Boolean(req.body?.restoredDefaults);

    if (!items && !restoredDefaults) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Homepage Treatment Cover Images payload (items array required).',
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

    // Track previous cover image URLs so explicitly deleted cover images can be removed from disk
    const previousCoverUrls = new Set<string>();
    const prevManifest = readTreatmentCoversManifestFromDisk();
    for (const srcList of [
      existing.homepage_treatment_cover_images_v1?.items,
      prevManifest?.items,
    ]) {
      if (Array.isArray(srcList)) {
        for (const it of srcList) {
          if (typeof it?.imageUrl === 'string' && it.imageUrl.startsWith('/assets/treatments/cover-')) {
            previousCoverUrls.add(it.imageUrl.split('?')[0].split('#')[0].trim());
          }
          if (deletedIds.includes(String(it?.id || '')) && typeof it?.imageUrl === 'string') {
            const cleanDelUrl = it.imageUrl.split('?')[0].split('#')[0].trim();
            if (cleanDelUrl.startsWith('/assets/treatments/cover-')) {
              deleteReplacedTreatmentAssetFile(cleanDelUrl, new Set());
            }
          }
        }
      }
    }

    const reconciled = reconcileHomepageTreatmentCoversConfig(
      { items: items || [] },
      existing.homepage_treatment_cover_images_v1,
      {
        deletedIds,
        restoredDefaults,
      }
    );

    existing.homepage_treatment_cover_images_v1 = reconciled;
    existing.lastSynced = new Date().toISOString();

    // If any cover IDs were explicitly deleted, remove their unreferenced `cover-*.webp` files from disk
    if (deletedIds.length > 0) {
      const activeUrls = collectActiveTreatmentAssetUrls(existing);
      for (const oldUrl of previousCoverUrls) {
        if (!activeUrls.has(oldUrl)) {
          deleteReplacedTreatmentAssetFile(oldUrl, activeUrls);
        }
      }
    }

    writeFileAtomicallySync(customizationsPath, JSON.stringify(existing, null, 2));
    writeTreatmentCoversManifestToDisk(reconciled);

    console.log(
      `[Admin] Persisted ${reconciled.items.length} Homepage Treatment Cover Image(s) to siteCustomizations.json and _treatment_covers_manifest.json`
    );

    return res.json({
      success: true,
      config: reconciled,
      data: reconciled.items,
      items: reconciled.items,
      updatedAt: existing.lastSynced,
      message: 'Homepage Treatment Cover Images saved to disk and manifest.',
    });
  } catch (error) {
    console.error('[Admin] Error saving Homepage Treatment Cover Images:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

app.post('/api/admin/homepage-treatment-covers/upload-image', (req, res) => {
  try {
    const {
      id,
      subCategoryId,
      subCategoryName,
      branchCategory,
      title,
      caption,
      altText,
      seoTitle,
      seoKeywords,
      showInDefaultGrid,
      hidden,
      order,
      dataUrl,
      base64,
      previousUrl,
    } = req.body || {};

    if (!dataUrl && !base64) {
      return res.status(400).json({
        success: false,
        error: 'Missing image data (dataUrl or base64 required)',
      });
    }

    const timestamp = Date.now();
    const cleanSubCat = sanitizeCoverTokenForFile(subCategoryId || subCategoryName || 'general', 'general');
    const coverId = String(id || `cover-${cleanSubCat}-${timestamp}`).trim();
    const cleanCoverId = sanitizeCoverTokenForFile(coverId, `cover-${timestamp}`);

    const safeWebpName = cleanCoverId.startsWith(`cover-${cleanSubCat}-`)
      ? `${cleanCoverId}.webp`
      : cleanCoverId.startsWith('cover-')
      ? `${cleanCoverId}.webp`
      : `cover-${cleanSubCat}-${cleanCoverId}.webp`;

    // Read & reconcile existing cover items BEFORE writing the new file to disk
    let existing: Record<string, any> = {};
    if (fs.existsSync(customizationsPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      } catch {
        existing = {};
      }
    }

    const currentCoversConfig = reconcileHomepageTreatmentCoversConfig(
      existing.homepage_treatment_cover_images_v1,
      existing.homepage_treatment_cover_images_v1
    );

    const rawData = dataUrl ? dataUrl.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '') : base64;
    const buffer = Buffer.from(rawData, 'base64');

    if (!fs.existsSync(publicTreatmentsDir)) {
      fs.mkdirSync(publicTreatmentsDir, { recursive: true });
    }

    const publicFilePath = path.join(publicTreatmentsDir, safeWebpName);
    fs.writeFileSync(publicFilePath, buffer);

    if (fs.existsSync(distTreatmentsDir)) {
      try {
        fs.writeFileSync(path.join(distTreatmentsDir, safeWebpName), buffer);
      } catch (distErr) {
        console.warn('[Admin] Could not mirror treatment cover WebP to distTreatmentsDir:', distErr);
      }
    }

    const cleanUrl = `/assets/treatments/${safeWebpName}`;
    const versionedUrl = `${cleanUrl}?v=${timestamp}`;
    console.log(`[Admin] Saved Homepage Treatment Cover WebP image to ${cleanUrl}`);

    const existingIdx = currentCoversConfig.items.findIndex(
      (it: any) => String(it?.id) === coverId
    );

    const upsertedItem = projectServerHomepageTreatmentCover(
      {
        ...(existingIdx !== -1 ? currentCoversConfig.items[existingIdx] : {}),
        id: coverId,
        subCategoryId: subCategoryId || currentCoversConfig.items[existingIdx]?.subCategoryId || cleanSubCat,
        subCategoryName:
          subCategoryName || currentCoversConfig.items[existingIdx]?.subCategoryName || cleanSubCat,
        branchCategory:
          branchCategory || currentCoversConfig.items[existingIdx]?.branchCategory || 'Face & Injectables',
        imageUrl: versionedUrl,
        ...(title !== undefined ? { title } : {}),
        ...(caption !== undefined ? { caption } : {}),
        ...(altText !== undefined ? { altText } : {}),
        ...(seoTitle !== undefined ? { seoTitle } : {}),
        ...(Array.isArray(seoKeywords) ? { seoKeywords } : {}),
        showInDefaultGrid:
          showInDefaultGrid !== undefined
            ? Boolean(showInDefaultGrid)
            : existingIdx !== -1
            ? Boolean(currentCoversConfig.items[existingIdx].showInDefaultGrid)
            : false,
        hidden:
          hidden !== undefined
            ? Boolean(hidden)
            : existingIdx !== -1
            ? Boolean(currentCoversConfig.items[existingIdx].hidden)
            : false,
        order:
          typeof order === 'number'
            ? order
            : existingIdx !== -1
            ? currentCoversConfig.items[existingIdx].order
            : currentCoversConfig.items.length + 1,
        updatedAt: timestamp,
      },
      existingIdx !== -1 ? existingIdx : currentCoversConfig.items.length
    );

    const nextItems = [...currentCoversConfig.items];
    if (existingIdx !== -1) {
      nextItems[existingIdx] = upsertedItem;
    } else {
      nextItems.push(upsertedItem);
    }

    const updatedConfig = reconcileHomepageTreatmentCoversConfig(
      { items: nextItems },
      currentCoversConfig
    );

    existing.homepage_treatment_cover_images_v1 = updatedConfig;
    existing.lastSynced = new Date().toISOString();

    if (typeof previousUrl === 'string' && previousUrl.trim()) {
      const normPrev = previousUrl.split('?')[0].split('#')[0].trim();
      if (normPrev && normPrev !== cleanUrl && normPrev.startsWith('/assets/treatments/cover-')) {
        const activeSet = collectActiveTreatmentAssetUrls(existing);
        activeSet.delete(normPrev);
        activeSet.add(cleanUrl);
        deleteReplacedTreatmentAssetFile(normPrev, activeSet);
      }
    }

    writeFileAtomicallySync(customizationsPath, JSON.stringify(existing, null, 2));
    writeTreatmentCoversManifestToDisk(updatedConfig);

    return res.json({
      success: true,
      id: coverId,
      fileName: safeWebpName,
      url: cleanUrl,
      versionedUrl,
      imagePath: versionedUrl,
      rawPath: cleanUrl,
      version: timestamp,
      item: upsertedItem,
      updatedConfig,
      message: 'Homepage Treatment Cover WebP image saved and persisted to disk & manifest!',
    });
  } catch (error) {
    console.error('[Admin] Error uploading Homepage Treatment Cover WebP image:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// ============================================================================
// BEFORE & AFTER GALLERY: PERSISTENCE & WEBP UPLOAD ENDPOINTS
// ============================================================================
app.get('/api/admin/before-after-gallery', (_req, res) => {
  try {
    let existing: Record<string, any> = {};
    if (fs.existsSync(customizationsPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
      } catch {
        existing = {};
      }
    }

    const rawJsonGallery = existing?.homepage_gallery_config_v6 || null;
    const reconciled = reconcileBeforeAfterGalleryConfig(rawJsonGallery, rawJsonGallery, false);

    // Always ensure manifest & transformationsData.ts stay synced if reconciliation recovered any cases or disk images
    if (JSON.stringify(rawJsonGallery) !== JSON.stringify(reconciled)) {
      existing.homepage_gallery_config_v6 = reconciled;
      existing.lastSynced = new Date().toISOString();
      writeFileAtomicallySync(customizationsPath, JSON.stringify(existing, null, 2));
      syncTransformationsDataTs(reconciled);
    } else if (!fs.existsSync(galleryManifestPath)) {
      writeGalleryManifestToDisk(reconciled);
    }

    return res.json({
      success: true,
      data: reconciled,
      updatedAt: existing.lastSynced || null,
    });
  } catch (error) {
    console.error('[Admin] Error reading Before & After gallery config:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

app.post('/api/admin/before-after-gallery', (req, res) => {
  try {
    const config = req.body?.config || req.body?.data || req.body;
    const allowDeletions = Boolean(req.body?.allowDeletions ?? true);
    const deletedPairIds = Array.isArray(req.body?.deletedPairIds) ? req.body.deletedPairIds : [];
    const restoredDefaults = Boolean(req.body?.restoredDefaults);
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

    const reconciled = reconcileBeforeAfterGalleryConfig(
      config,
      existing.homepage_gallery_config_v6,
      {
        allowDeletions,
        deletedPairIds,
        restoredDefaults,
      }
    );

    existing.homepage_gallery_config_v6 = reconciled;
    existing.lastSynced = new Date().toISOString();

    writeFileAtomicallySync(customizationsPath, JSON.stringify(existing, null, 2));
    syncTransformationsDataTs(reconciled);

    console.log(`[Admin] Persisted reconciled Before & After gallery config to siteCustomizations.json and transformationsData.ts`);
    return res.json({
      success: true,
      data: reconciled,
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
    const {
      pairId,
      slot,
      fileName,
      dataUrl,
      base64,
      title,
      groupId,
      linkedTreatmentId,
      linkedTreatmentTitle,
      duration,
      sessions,
      beforeAltText,
      afterAltText,
      singleFrameAltText,
      seoTitle,
      seoKeywords,
    } = req.body || {};
    if (!dataUrl && !base64) {
      return res.status(400).json({
        success: false,
        error: 'Missing image data (dataUrl or base64 required)',
      });
    }

    const rawData = dataUrl ? dataUrl.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '') : base64;
    const buffer = Buffer.from(rawData, 'base64');

    const normalizedSlot: 'before' | 'after' | 'single' =
      slot === 'single' ? 'single' : slot === 'after' ? 'after' : 'before';
    const timestamp = Date.now();
    let safeWebpName: string;

    if (pairId) {
      const cleanPairId = sanitizePairIdForFile(pairId);
      safeWebpName = `${cleanPairId}-${normalizedSlot}.webp`;

      // Clean up any legacy timestamped files for the same pairId + slot to prevent orphan clutter
      if (fs.existsSync(publicTransformationsDir)) {
        try {
          const prefix = `${cleanPairId}-${normalizedSlot}-`;
          for (const existingFile of fs.readdirSync(publicTransformationsDir)) {
            if (existingFile.toLowerCase().startsWith(prefix) && existingFile.toLowerCase().endsWith('.webp')) {
              fs.unlinkSync(path.join(publicTransformationsDir, existingFile));
            }
          }
        } catch (cleanupErr) {
          console.warn('[Admin] Could not clean up old transformation slot file:', cleanupErr);
        }
      }
    } else {
      const rawBase = fileName
        ? path.basename(fileName, path.extname(fileName))
        : `${title || 'ba'}-${normalizedSlot}`;
      const safeSlug = rawBase
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      safeWebpName = `${safeSlug}-${timestamp}.webp`;
    }

    if (!fs.existsSync(publicTransformationsDir)) {
      fs.mkdirSync(publicTransformationsDir, { recursive: true });
    }
    const publicTransformationPath = path.join(publicTransformationsDir, safeWebpName);
    fs.writeFileSync(publicTransformationPath, buffer);

    if (fs.existsSync(distTransformationsDir)) {
      try {
        fs.writeFileSync(path.join(distTransformationsDir, safeWebpName), buffer);
      } catch (distErr) {
        console.warn('[Admin] Could not write transformation WebP to distTransformationsDir:', distErr);
      }
    }

    const cleanUrl = `/assets/transformations/${safeWebpName}`;
    const versionedUrl = `${cleanUrl}?v=${timestamp}`;
    console.log(`[Admin] Saved Before & After WebP image to ${cleanUrl}`);

    // Immediately persist the updated image URL into siteCustomizations.json, _gallery_manifest.json, & transformationsData.ts
    // even when creating a brand new pair in the modal before clicking Save!
    let updatedGallery: any = null;
    if (pairId) {
      try {
        let existing: Record<string, any> = {};
        if (fs.existsSync(customizationsPath)) {
          try {
            existing = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
          } catch {
            existing = {};
          }
        }

        const currentGallery = reconcileBeforeAfterGalleryConfig(
          existing.homepage_gallery_config_v6,
          existing.homepage_gallery_config_v6,
          false
        );
        let pairFound = false;
        const fieldName =
          normalizedSlot === 'single'
            ? 'singleFrameImage'
            : normalizedSlot === 'after'
            ? 'afterImage'
            : 'beforeImage';
        const targetGroupId = String(groupId || linkedTreatmentId || 'facial-skin-care');

        for (const cat of currentGallery.categories || []) {
          for (const pair of cat.pairs || []) {
            if (pair && String(pair.id) === String(pairId)) {
              pair[fieldName] = versionedUrl;
              if (title) pair.title = title;
              if (linkedTreatmentId) pair.linkedTreatmentId = linkedTreatmentId;
              if (linkedTreatmentTitle) pair.linkedTreatmentTitle = linkedTreatmentTitle;
              if (duration) pair.duration = duration;
              if (typeof sessions === 'number') pair.sessions = sessions;
              if (beforeAltText) pair.beforeAltText = beforeAltText;
              if (afterAltText) pair.afterAltText = afterAltText;
              if (singleFrameAltText) pair.singleFrameAltText = singleFrameAltText;
              if (seoTitle) pair.seoTitle = seoTitle;
              if (Array.isArray(seoKeywords) && seoKeywords.length > 0) pair.seoKeywords = seoKeywords;
              pair.updatedAt = timestamp;
              pairFound = true;
            }
          }
        }

        // If pairId is a newly created pair not yet in categories, insert it now so the image cannot be lost!
        if (!pairFound) {
          if (!Array.isArray(currentGallery.categories)) {
            currentGallery.categories = [];
          }
          let targetCat = currentGallery.categories.find((c: any) => c && String(c.id) === targetGroupId);
          if (!targetCat) {
            targetCat = currentGallery.categories[0];
          }
          if (!targetCat) {
            targetCat = {
              id: targetGroupId,
              name: linkedTreatmentTitle || 'Facial & Skin Care',
              pairs: [],
            };
            currentGallery.categories.push(targetCat);
          }
          if (!Array.isArray(targetCat.pairs)) {
            targetCat.pairs = [];
          }

          const existingBeforeDiskUrl = resolveDiskTransformationImage(String(pairId), 'before', '');
          const existingAfterDiskUrl = resolveDiskTransformationImage(String(pairId), 'after', '');
          const existingSingleDiskUrl = resolveDiskTransformationImage(String(pairId), 'single', '');

          const newPairEntry = {
            id: String(pairId),
            title: title || (linkedTreatmentTitle ? `${linkedTreatmentTitle} Transformation` : 'Clinical Transformation'),
            treatmentGroupId: targetCat.id,
            linkedTreatmentId: linkedTreatmentId || targetCat.id,
            linkedTreatmentTitle: linkedTreatmentTitle || targetCat.name || '',
            beforeImage: normalizedSlot === 'before' ? versionedUrl : existingBeforeDiskUrl || '',
            afterImage: normalizedSlot === 'after' ? versionedUrl : existingAfterDiskUrl || '',
            singleFrameImage:
              normalizedSlot === 'single' ? versionedUrl : existingSingleDiskUrl || undefined,
            beforeAltText:
              beforeAltText || `${title || 'Clinical'} Before Treatment at Age Reversal Clinics London`,
            afterAltText:
              afterAltText || `${title || 'Clinical'} After Treatment Result at Age Reversal Clinics London`,
            singleFrameAltText:
              singleFrameAltText ||
              `${title || 'Clinical'} Before & After Transformation at Age Reversal Clinics London`,
            seoTitle:
              seoTitle || `${title || 'Clinical'} — Before & After Result | Age Reversal Clinics`,
            seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : [],
            duration: duration || '6 Weeks • 3 Sessions',
            sessions: typeof sessions === 'number' ? sessions : 3,
            featured: false,
            hidden: false,
            updatedAt: timestamp,
          };

          targetCat.pairs.unshift(newPairEntry);
        }

        existing.homepage_gallery_config_v6 = currentGallery;
        existing.lastSynced = new Date().toISOString();
        writeFileAtomicallySync(customizationsPath, JSON.stringify(existing, null, 2));
        syncTransformationsDataTs(currentGallery);
        updatedGallery = currentGallery;
        console.log(`[Admin] Auto-persisted ${fieldName} for ${pairId} to siteCustomizations.json, _gallery_manifest.json, and transformationsData.ts`);
      } catch (persistErr) {
        console.warn('[Admin] Could not auto-persist uploaded transformation image to config:', persistErr);
      }
    }

    return res.json({
      success: true,
      url: cleanUrl,
      versionedUrl,
      rawPath: cleanUrl,
      fileName: safeWebpName,
      version: timestamp,
      updatedGallery,
      message: 'Before & After WebP image saved to /assets/transformations/ successfully!',
    });
  } catch (error) {
    console.error('[Admin] Error saving transformation WebP image:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// API: Slot-Aware Upload for Clinic Assets (permanent slot IDs) & general/treatment asset uploads
const handleAdminAssetUpload = (req: any, res: any) => {
  try {
    const { fileName, dataUrl, base64, previousUrl, folder, category, slotId } = req.body || {};
    const effectiveSlotId = slotId || req.query.slotId || (req.path.includes('/clinic-assets/upload') ? fileName : undefined);

    if ((!fileName && !effectiveSlotId) || (!dataUrl && !base64)) {
      return res.status(400).json({ success: false, error: 'Missing fileName/slotId or image data' });
    }

    const rawData = dataUrl ? dataUrl.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '') : base64;
    const buffer = Buffer.from(rawData, 'base64');
    const timestamp = Date.now();

    // 1. Permanent Slot-Based Upload (Clinic Edit Info: logo, location, interior, award, pillar, process, etc.)
    if (effectiveSlotId && typeof effectiveSlotId === 'string' && effectiveSlotId.trim().length > 0) {
      const sanitizedSlotId = String(effectiveSlotId)
        .trim()
        .replace(/\.webp$/i, '')
        .replace(/^(\/assets\/|assets\/)/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .toLowerCase();

      const singleFileName = `${sanitizedSlotId}.webp`;
      const publicAssetPath = path.join(publicAssetsDir, singleFileName);

      // Purge any older obsolete files matching this slot (e.g. old PNGs, JPEGs, or timestamped duplicates)
      const targetDirs = [publicAssetsDir];
      if (fs.existsSync(distAssetsDir)) {
        targetDirs.push(distAssetsDir);
      }
      const deletedFiles: string[] = [];

      for (const dir of targetDirs) {
        if (fs.existsSync(dir)) {
          try {
            const files = fs.readdirSync(dir);
            for (const f of files) {
              if (
                f !== singleFileName &&
                (f.startsWith(`${sanitizedSlotId}.`) || f.startsWith(`${sanitizedSlotId}-`))
              ) {
                const fullPath = path.join(dir, f);
                try {
                  fs.unlinkSync(fullPath);
                  deletedFiles.push(f);
                  console.log(`[Admin Slot Cleanup] Deleted obsolete slot file: ${fullPath}`);
                } catch (delErr) {
                  console.warn(`[Admin Slot Cleanup] Could not delete old file ${fullPath}:`, delErr);
                }
              }
            }
          } catch (readErr) {
            console.warn(`[Admin Slot Cleanup] Error reading directory ${dir}:`, readErr);
          }
        }
      }

      // Save the single .webp directly to public/assets
      fs.writeFileSync(publicAssetPath, buffer);
      if (fs.existsSync(distAssetsDir)) {
        try {
          fs.writeFileSync(path.join(distAssetsDir, singleFileName), buffer);
        } catch {}
      }

      const cleanRelativeUrl = `/assets/${singleFileName}`;
      const cacheBustedUrl = `${cleanRelativeUrl}?v=${timestamp}`;

      // If replacing an existing clinicInfo.ts image (e.g. an old timestamped upload /assets/179172...png),
      // delete the displaced file from public/assets if not used elsewhere
      if (typeof previousUrl === 'string' && previousUrl.trim()) {
        const normalizedPrev = previousUrl.split('?')[0].split('#')[0].trim();
        if (normalizedPrev && normalizedPrev !== cleanRelativeUrl) {
          const currentClinicData = parseClinicDataFromTsFile();
          const allCurrentUrls = collectClinicDataAssetUrls(currentClinicData);
          const prevIdx = allCurrentUrls.indexOf(normalizedPrev);
          if (prevIdx !== -1) {
            allCurrentUrls.splice(prevIdx, 1);
          }
          const activeUrlsSet = new Set<string>([...allCurrentUrls, cleanRelativeUrl]);
          const deletedOld = deleteReplacedClinicAssetFile(normalizedPrev, activeUrlsSet);
          if (deletedOld) {
            deletedFiles.push(path.basename(normalizedPrev));
          }
        }
      }

      console.log(`[Admin] Saved permanent slot WebP asset: ${cleanRelativeUrl}`);

      // Automatically reconcile and persist clinicInfo.ts & siteCustomizations.json when a clinic-* slot image is uploaded
      if (sanitizedSlotId.startsWith('clinic-')) {
        try {
          let existingCust: Record<string, any> = {};
          if (fs.existsSync(customizationsPath)) {
            try {
              existingCust = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
            } catch {
              existingCust = {};
            }
          }
          const reconciled = reconcileClinicDataWithDisk(
            existingCust.clinic_info_data,
            parseClinicDataFromTsFile()
          );
          applyClinicDataToCustomizationsObject(existingCust, reconciled);
          existingCust.lastSynced = new Date().toISOString();
          writeFileAtomicallySync(clinicInfoPath, generateClinicInfoTs(reconciled));
          writeFileAtomicallySync(customizationsPath, JSON.stringify(existingCust, null, 2));
        } catch (syncErr) {
          console.warn(`[Admin] Could not auto-sync clinicInfo.ts after slot upload:`, syncErr);
        }
      }

      return res.json({
        success: true,
        slotId: sanitizedSlotId,
        fileName: singleFileName,
        url: cleanRelativeUrl,
        rawPath: cleanRelativeUrl,
        imagePath: cacheBustedUrl,
        version: timestamp,
        deletedFiles: [...new Set(deletedFiles)],
        message: `Clinic asset for slot '${sanitizedSlotId}' successfully saved to ${cleanRelativeUrl}`
      });
    }

    // 2. Treatments Folder Upload
    const isTreatmentsFolder =
      folder === 'treatments' ||
      category === 'treatments' ||
      (typeof previousUrl === 'string' && previousUrl.startsWith('/assets/treatments/'));

    const isWebpPayload = typeof dataUrl === 'string' && dataUrl.startsWith('data:image/webp');
    const rawExt = path.extname(fileName) || '.webp';
    const ext = isTreatmentsFolder || isWebpPayload ? '.webp' : rawExt;
    const baseName = path
      .basename(fileName, path.extname(fileName))
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
    const safeName = `${baseName || 'asset'}-${timestamp}${ext}`;

    if (isTreatmentsFolder) {
      const publicTreatPath = path.join(publicTreatmentsDir, safeName);

      fs.writeFileSync(publicTreatPath, buffer);
      if (fs.existsSync(distTreatmentsDir)) {
        try {
          fs.writeFileSync(path.join(distTreatmentsDir, safeName), buffer);
        } catch {}
      }

      const newTreatmentAssetUrl = `/assets/treatments/${safeName}`;

      if (typeof previousUrl === 'string' && previousUrl.trim()) {
        const normalizedPrev = previousUrl.split('?')[0].split('#')[0].trim();
        if (normalizedPrev && normalizedPrev !== newTreatmentAssetUrl) {
          let existingCustomizations: Record<string, any> = {};
          if (fs.existsSync(customizationsPath)) {
            try {
              existingCustomizations = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
            } catch {}
          }
          const activeSet = collectActiveTreatmentAssetUrls(existingCustomizations);
          activeSet.delete(normalizedPrev);
          activeSet.add(newTreatmentAssetUrl);
          deleteReplacedTreatmentAssetFile(normalizedPrev, activeSet);
        }
      }

      console.log(`[Admin] Saved treatment WebP asset to ${newTreatmentAssetUrl}`);
      return res.json({
        success: true,
        url: newTreatmentAssetUrl,
        rawPath: newTreatmentAssetUrl,
        fileName: safeName,
        version: timestamp,
        message: 'Treatment WebP asset saved to /assets/treatments/ and previous file cleaned up!',
      });
    }

    // 3. General non-slot asset upload fallback
    const publicAssetPath = path.join(publicAssetsDir, safeName);

    fs.writeFileSync(publicAssetPath, buffer);

    const newAssetUrl = `/assets/${safeName}`;

    if (typeof previousUrl === 'string' && previousUrl.trim()) {
      const normalizedPrev = previousUrl.split('?')[0].split('#')[0].trim();
      if (normalizedPrev && normalizedPrev !== newAssetUrl) {
        const currentClinicData = parseClinicDataFromTsFile();
        const allCurrentUrls = collectClinicDataAssetUrls(currentClinicData);
        const prevIdx = allCurrentUrls.indexOf(normalizedPrev);
        if (prevIdx !== -1) {
          allCurrentUrls.splice(prevIdx, 1);
        }
        const activeUrlsSet = new Set<string>([...allCurrentUrls, newAssetUrl]);
        deleteReplacedClinicAssetFile(normalizedPrev, activeUrlsSet);
      }
    }

    console.log(`[Admin] Saved asset to public/assets/${safeName}`);

    return res.json({
      success: true,
      url: newAssetUrl,
      fileName: safeName,
      message: 'Asset saved to public/assets successfully!'
    });
  } catch (error) {
    console.error('Error saving asset:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
};

app.post('/api/admin/upload-asset', handleAdminAssetUpload);
app.post('/api/admin/clinic-assets/upload', handleAdminAssetUpload);

// API: List assets in public/assets, public/assets/treatments, public/assets/transformations, and public/assets/blog
app.get('/api/admin/assets', (_req, res) => {
  try {
    const assetsList: Array<{ name: string; url: string; size: number; mtime: string; location: string }> = [];
    const seen = new Set<string>();

    // Read public/assets/treatments
    if (fs.existsSync(publicTreatmentsDir)) {
      const files = fs.readdirSync(publicTreatmentsDir);
      for (const file of files) {
        const url = `/assets/treatments/${file}`;
        if (!seen.has(url)) {
          const fullPath = path.join(publicTreatmentsDir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isFile()) {
            seen.add(url);
            assetsList.push({
              name: file,
              url,
              size: stat.size,
              mtime: stat.mtime.toISOString(),
              location: 'public/assets/treatments'
            });
          }
        }
      }
    }

    // Read public/assets/transformations
    if (fs.existsSync(publicTransformationsDir)) {
      const files = fs.readdirSync(publicTransformationsDir);
      for (const file of files) {
        const url = `/assets/transformations/${file}`;
        if (!seen.has(url)) {
          const fullPath = path.join(publicTransformationsDir, file);
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

    // Read public/assets/blog
    if (fs.existsSync(publicBlogDir)) {
      const files = fs.readdirSync(publicBlogDir);
      for (const file of files) {
        const url = `/assets/blog/${file}`;
        if (!seen.has(url)) {
          const fullPath = path.join(publicBlogDir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isFile()) {
            seen.add(url);
            assetsList.push({
              name: file,
              url,
              size: stat.size,
              mtime: stat.mtime.toISOString(),
              location: 'public/assets/blog'
            });
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
            location: 'public/assets'
          });
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
// TREATMENT CARDS (PRICING & HOMEPAGE TREATMENTS): ID-BASED WEBP UPLOAD & CLEANUP
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
    const {
      dataUrl,
      base64,
      previousUrl,
      scope,
      target,
      imageAlt,
      seoTitle,
      seoKeywords,
    } = req.body || {};

    if (!dataUrl && !base64) {
      return res.status(400).json({ success: false, error: 'Missing image data (dataUrl or base64 required)' });
    }

    const isHomepageTreatmentScope =
      scope === 'homepage_treatments' ||
      target === 'homepage_treatments' ||
      sanitizedId.startsWith('homepage-');

    const baseCardId = sanitizedId.replace(/^homepage-/, '');
    const fileStem = isHomepageTreatmentScope ? `homepage-${baseCardId}` : sanitizedId;

    // Extract raw base64 buffer
    const rawData = dataUrl ? dataUrl.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '') : base64;
    const buffer = Buffer.from(rawData, 'base64');

    // 1. Scan target directories and delete any previous image matching `${fileStem}.*`
    const targetDirs = [publicTreatmentsDir];
    if (fs.existsSync(distTreatmentsDir)) {
      targetDirs.push(distTreatmentsDir);
    }
    const deletedFiles: string[] = [];

    for (const dir of targetDirs) {
      if (fs.existsSync(dir)) {
        try {
          const files = fs.readdirSync(dir);
          for (const f of files) {
            if (f.startsWith(`${fileStem}.`)) {
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

    // 2. Save strictly ONE single .webp image per treatment card slot
    const singleFileName = `${fileStem}.webp`;
    const publicPath = path.join(publicTreatmentsDir, singleFileName);

    fs.writeFileSync(publicPath, buffer);
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

    // 3. Sync: Update siteCustomizations.json (and decoupled target source file)
    try {
      let customizations: Record<string, any> = {};
      if (fs.existsSync(customizationsPath)) {
        try {
          customizations = JSON.parse(fs.readFileSync(customizationsPath, 'utf-8'));
        } catch {
          customizations = {};
        }
      }

      if (isHomepageTreatmentScope) {
        // Decoupled persistence for Homepage Treatments card image + SEO metadata
        const existingTreatConfig = customizations.homepage_treatments_config || {};
        const sourceTreatments: any[] =
          Array.isArray(existingTreatConfig.treatments) && existingTreatConfig.treatments.length > 0
            ? existingTreatConfig.treatments
            : TREATMENTS;

        let previousCardImageUrl = typeof previousUrl === 'string' ? previousUrl : '';
        const updatedTreatments = sourceTreatments.map((item: any, idx: number) => {
          const itemId = String(item.id || '').trim().toLowerCase();
          const normalizedItemId = itemId.replace(/[^a-zA-Z0-9_-]/g, '-');
          if (itemId === baseCardId || normalizedItemId === baseCardId) {
            if (!previousCardImageUrl && typeof item.image === 'string') {
              previousCardImageUrl = item.image;
            }
            return projectServerHomepageTreatmentCard(
              {
                ...item,
                image: cleanRelativePath,
                ...(typeof imageAlt === 'string' && imageAlt.trim() ? { imageAlt: imageAlt.trim() } : {}),
                ...(typeof seoTitle === 'string' && seoTitle.trim() ? { seoTitle: seoTitle.trim() } : {}),
                ...(Array.isArray(seoKeywords) && seoKeywords.length > 0 ? { seoKeywords } : {}),
              },
              idx
            );
          }
          return projectServerHomepageTreatmentCard(item, idx);
        });

        customizations.homepage_treatments_config = {
          editorialHeading: existingTreatConfig.editorialHeading || 'rejuvenation',
          editorialSub: existingTreatConfig.editorialSub || 'Begin your transformation',
          description:
            existingTreatConfig.description ||
            'At Age Reversal Clinic, we believe that aesthetic harmony elevates self-confidence. Our clinical therapists custom-tailor skin therapy sessions, premium facials, and micropigmentation protocols to support your personal wellness ritual.',
          seoKeywords: Array.isArray(existingTreatConfig.seoKeywords)
            ? existingTreatConfig.seoKeywords
            : [
                'age reversal clinic london treatments',
                'regenerative aesthetics london',
                'non-surgical facial rejuvenation',
                'body sculpting & skin boosters london',
                'clinical dermatology procedures',
              ],
          treatments: updatedTreatments,
        };
        customizations.lastSynced = new Date().toISOString();

        if (previousCardImageUrl) {
          const normPrev = previousCardImageUrl.split('?')[0].split('#')[0].trim();
          if (normPrev && normPrev !== cleanRelativePath) {
            const activeSet = collectActiveTreatmentAssetUrls(customizations);
            activeSet.delete(normPrev);
            activeSet.add(cleanRelativePath);
            const extraDeleted = deleteReplacedTreatmentAssetFile(normPrev, activeSet);
            deletedFiles.push(...extraDeleted);
          }
        }

        fs.writeFileSync(customizationsPath, JSON.stringify(customizations, null, 2), 'utf-8');
        syncHomepageTreatmentsDataTs(customizations.homepage_treatments_config);
        console.log(`[Admin] Synced Homepage Treatment WebP image directly into homepage_treatments_config & src/data.ts`);
      } else {
        // Default Treatment Pricing card image sync
        const sourceList: any[] =
          customizations.treatment_pricing_data &&
          Array.isArray(customizations.treatment_pricing_data) &&
          customizations.treatment_pricing_data.length > 0
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

        if (typeof previousUrl === 'string' && previousUrl.trim()) {
          const normPrev = previousUrl.split('?')[0].split('#')[0].trim();
          if (normPrev && normPrev !== cleanRelativePath) {
            const activeSet = collectActiveTreatmentAssetUrls(customizations);
            activeSet.delete(normPrev);
            activeSet.add(cleanRelativePath);
            const extraDeleted = deleteReplacedTreatmentAssetFile(normPrev, activeSet);
            deletedFiles.push(...extraDeleted);
          }
        }

        if (updated) {
          customizations.treatment_pricing_data = updatedList;
          customizations.lastSynced = new Date().toISOString();
          fs.writeFileSync(customizationsPath, JSON.stringify(customizations, null, 2), 'utf-8');
          const tsCode = generateTreatmentPricingTs(updatedList);
          fs.writeFileSync(treatmentPricingPath, tsCode, 'utf-8');
          console.log(`[Admin] Synced updated treatment image directly into treatmentPricing.ts`);
        }
      }
    } catch (syncErr) {
      console.warn(`[Admin] Could not sync treatment image metadata:`, syncErr);
    }

    return res.json({
      success: true,
      id: sanitizedId,
      fileName: singleFileName,
      url: cleanRelativePath,
      imagePath: cacheBustedUrl,
      rawPath: cleanRelativePath,
      deletedFiles: [...new Set(deletedFiles)],
      version: timestamp,
      message: `Treatment image for '${fileStem}' successfully saved as .webp and previous images purged.`
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

// ============================================================================
// BLOG & CLINICAL JOURNAL: PAGINATED LIST, ON-DEMAND SINGLE POST, CRUD & WEBP COVER UPLOAD
// ============================================================================

// GET /api/admin/blog-posts
// Lightweight Paginated List Query: Projects ONLY exact card summary columns (id, slug, title, category, type, status, date, image, seoScore, etc.)
app.get('/api/admin/blog-posts', (req, res) => {
  try {
    const blogConfig = getServerBlogConfig();
    const allPosts = [...blogConfig.newsArticles, ...blogConfig.storyArticles];

    const counts = {
      all: allPosts.length,
      news: allPosts.filter((p) => p.type === 'news').length,
      stories: allPosts.filter((p) => p.type === 'stories').length,
      published: allPosts.filter((p) => p.status !== 'draft').length,
      drafts: allPosts.filter((p) => p.status === 'draft').length,
    };

    const typeFilter = req.query.type ? String(req.query.type).trim().toLowerCase() : 'all';
    const statusFilter = req.query.status ? String(req.query.status).trim().toLowerCase() : 'all';
    const categoryFilter = req.query.category ? String(req.query.category).trim().toLowerCase() : '';
    const searchFilter = req.query.search ? String(req.query.search).trim().toLowerCase() : '';
    const sortOption = req.query.sort ? String(req.query.sort).trim().toLowerCase() : 'newest';

    // Project summary columns first
    let projected = allPosts.map((post) => projectServerBlogPostCard(post));

    // Apply filters
    projected = projected.filter((item) => {
      if (typeFilter === 'news' && item.type !== 'news') return false;
      if (typeFilter === 'stories' && item.type !== 'stories') return false;
      if (statusFilter === 'published' && item.status !== 'published') return false;
      if (statusFilter === 'draft' && item.status !== 'draft') return false;
      if (
        categoryFilter &&
        categoryFilter !== 'all' &&
        item.category.toLowerCase() !== categoryFilter &&
        item.tag.toLowerCase() !== categoryFilter
      ) {
        return false;
      }
      if (searchFilter) {
        const hay = `${item.title} ${item.slug} ${item.category} ${item.tag} ${item.author} ${item.description}`.toLowerCase();
        if (!hay.includes(searchFilter)) return false;
      }
      return true;
    });

    // Apply sorting
    projected.sort((a, b) => {
      if (sortOption === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortOption === 'seo-desc') {
        return b.seoScore - a.seoScore;
      }
      const timeA = Date.parse(a.publishedAt || a.date || '') || 0;
      const timeB = Date.parse(b.publishedAt || b.date || '') || 0;
      if (sortOption === 'oldest') {
        return timeA - timeB;
      }
      return timeB - timeA;
    });

    const totalCount = projected.length;
    const limit = req.query.limit !== undefined ? Math.max(1, Number(req.query.limit) || 6) : 6;
    const page = req.query.page !== undefined ? Math.max(1, Number(req.query.page) || 1) : 1;
    const offset =
      req.query.offset !== undefined
        ? Math.max(0, Number(req.query.offset) || 0)
        : (page - 1) * limit;

    const paginatedItems = projected.slice(offset, offset + limit);
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const hasMore = offset + paginatedItems.length < totalCount;

    return res.json({
      success: true,
      items: paginatedItems,
      data: paginatedItems,
      totalCount,
      hasMore,
      page: Math.floor(offset / limit) + 1,
      totalPages,
      offset,
      limit,
      counts,
      heading: blogConfig.heading,
      description: blogConfig.description,
    });
  } catch (error) {
    console.error('[Admin] Error fetching paginated blog posts:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// GET /api/admin/blog-posts/:idOrSlug
// Single-Post On-Demand Query: Fetches full contentBlocks, faqItems, and complete SEO metadata ONLY when opening a post
app.get('/api/admin/blog-posts/:idOrSlug', (req, res) => {
  try {
    const target = String(req.params.idOrSlug || '').trim().toLowerCase();
    if (!target) {
      return res.status(400).json({ success: false, error: 'Missing blog post ID or slug' });
    }

    const blogConfig = getServerBlogConfig();
    const allPosts = [...blogConfig.newsArticles, ...blogConfig.storyArticles];
    const matched = allPosts.find(
      (post) =>
        String(post.id || '').toLowerCase() === target ||
        String(post.slug || '').toLowerCase() === target
    );

    if (!matched) {
      return res.status(404).json({ success: false, error: `Blog post '${target}' not found` });
    }

    const seoCheck = computeServerArticleSeoScore(matched);
    return res.json({
      success: true,
      data: matched,
      post: matched,
      seoScore: seoCheck.score,
      seoGrade: seoCheck.grade,
    });
  } catch (error) {
    console.error('[Admin] Error fetching single blog post:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// POST /api/admin/blog-posts
// Create a new blog post (or save header metadata) and persist to siteCustomizations.json + src/data.ts
app.post('/api/admin/blog-posts', (req, res) => {
  try {
    const incoming = req.body?.post || req.body?.article || req.body;
    const blogConfig = getServerBlogConfig();

    // Support updating section heading/description alongside or independently
    if (incoming && !incoming.title && (incoming.heading || incoming.description)) {
      const savedCfg = persistServerBlogConfig({
        heading: incoming.heading || blogConfig.heading,
        description: incoming.description || blogConfig.description,
        newsArticles: blogConfig.newsArticles,
        storyArticles: blogConfig.storyArticles,
      });
      return res.json({
        success: true,
        heading: savedCfg.heading,
        description: savedCfg.description,
        updatedAt: savedCfg.updatedAt,
      });
    }

    if (!incoming || !String(incoming.title || '').trim()) {
      return res.status(400).json({
        success: false,
        error: 'Blog post title is required.',
      });
    }

    const postType: 'news' | 'stories' = incoming.type === 'stories' ? 'stories' : 'news';
    const generatedId =
      String(incoming.id || '').trim() ||
      `${postType === 'stories' ? 'story' : 'news'}-${Date.now()}`;

    const normalizedPost = normalizeServerArticle(
      {
        ...incoming,
        id: generatedId,
        type: postType,
        publishedAt: incoming.publishedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      postType
    );

    const nextNews =
      postType === 'news'
        ? [normalizedPost, ...blogConfig.newsArticles.filter((p) => p.id !== normalizedPost.id)]
        : blogConfig.newsArticles.filter((p) => p.id !== normalizedPost.id);

    const nextStories =
      postType === 'stories'
        ? [normalizedPost, ...blogConfig.storyArticles.filter((p) => p.id !== normalizedPost.id)]
        : blogConfig.storyArticles.filter((p) => p.id !== normalizedPost.id);

    const savedCfg = persistServerBlogConfig({
      heading: blogConfig.heading,
      description: blogConfig.description,
      newsArticles: nextNews,
      storyArticles: nextStories,
    });

    return res.json({
      success: true,
      post: normalizedPost,
      summary: projectServerBlogPostCard(normalizedPost),
      updatedAt: savedCfg.updatedAt,
      message: 'Blog post created and persisted to src/data.ts and siteCustomizations.json.',
    });
  } catch (error) {
    console.error('[Admin] Error creating blog post:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// PUT /api/admin/blog-posts/:id
// Update an existing blog post by ID and persist to siteCustomizations.json + src/data.ts
app.put('/api/admin/blog-posts/:id', (req, res) => {
  try {
    const targetId = String(req.params.id || '').trim();
    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Missing blog post ID' });
    }

    const incoming = req.body?.post || req.body?.article || req.body;
    const blogConfig = getServerBlogConfig();
    const existingPost = [...blogConfig.newsArticles, ...blogConfig.storyArticles].find(
      (p) => p.id === targetId
    );

    const postType: 'news' | 'stories' =
      incoming?.type === 'stories' || incoming?.type === 'news'
        ? incoming.type
        : existingPost?.type || 'news';

    const updatedPost = normalizeServerArticle(
      {
        ...(existingPost || {}),
        ...(incoming || {}),
        id: targetId,
        type: postType,
        updatedAt: new Date().toISOString(),
      },
      postType
    );

    const filteredNews = blogConfig.newsArticles.filter((p) => p.id !== targetId);
    const filteredStories = blogConfig.storyArticles.filter((p) => p.id !== targetId);

    const nextNews =
      postType === 'news'
        ? blogConfig.newsArticles.some((p) => p.id === targetId)
          ? blogConfig.newsArticles.map((p) => (p.id === targetId ? updatedPost : p))
          : [updatedPost, ...filteredNews]
        : filteredNews;

    const nextStories =
      postType === 'stories'
        ? blogConfig.storyArticles.some((p) => p.id === targetId)
          ? blogConfig.storyArticles.map((p) => (p.id === targetId ? updatedPost : p))
          : [updatedPost, ...filteredStories]
        : filteredStories;

    const savedCfg = persistServerBlogConfig({
      heading: blogConfig.heading,
      description: blogConfig.description,
      newsArticles: nextNews,
      storyArticles: nextStories,
    });

    return res.json({
      success: true,
      post: updatedPost,
      summary: projectServerBlogPostCard(updatedPost),
      updatedAt: savedCfg.updatedAt,
      message: 'Blog post updated and synced to disk.',
    });
  } catch (error) {
    console.error('[Admin] Error updating blog post:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// PATCH /api/admin/blog-posts/:id/status
// Toggle or set a blog post's publication status ('published' | 'draft')
app.patch('/api/admin/blog-posts/:id/status', (req, res) => {
  try {
    const targetId = String(req.params.id || '').trim();
    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Missing blog post ID' });
    }

    const blogConfig = getServerBlogConfig();
    const existingPost = [...blogConfig.newsArticles, ...blogConfig.storyArticles].find(
      (p) => p.id === targetId
    );
    if (!existingPost) {
      return res.status(404).json({ success: false, error: `Blog post '${targetId}' not found` });
    }

    const requestedStatus = req.body?.status;
    const nextStatus: 'published' | 'draft' =
      requestedStatus === 'published' || requestedStatus === 'draft'
        ? requestedStatus
        : existingPost.status === 'draft'
        ? 'published'
        : 'draft';

    const nowIso = new Date().toISOString();
    const updatedPost = normalizeServerArticle(
      {
        ...existingPost,
        status: nextStatus,
        updatedAt: nowIso,
        ...(nextStatus === 'published' && existingPost.status === 'draft'
          ? { publishedAt: nowIso }
          : {}),
      },
      existingPost.type || 'news'
    );

    const nextNews = blogConfig.newsArticles.map((p) => (p.id === targetId ? updatedPost : p));
    const nextStories = blogConfig.storyArticles.map((p) => (p.id === targetId ? updatedPost : p));

    const savedCfg = persistServerBlogConfig({
      heading: blogConfig.heading,
      description: blogConfig.description,
      newsArticles: nextNews,
      storyArticles: nextStories,
    });

    return res.json({
      success: true,
      id: targetId,
      status: nextStatus,
      post: updatedPost,
      summary: projectServerBlogPostCard(updatedPost),
      updatedAt: savedCfg.updatedAt,
    });
  } catch (error) {
    console.error('[Admin] Error toggling blog post status:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// DELETE /api/admin/blog-posts/:id
// Delete a blog post by ID and purge its cover WebP file from /assets/blog/ if unreferenced
app.delete('/api/admin/blog-posts/:id', (req, res) => {
  try {
    const targetId = String(req.params.id || '').trim();
    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Missing blog post ID' });
    }

    const blogConfig = getServerBlogConfig();
    const nextNews = blogConfig.newsArticles.filter((p) => p.id !== targetId);
    const nextStories = blogConfig.storyArticles.filter((p) => p.id !== targetId);

    const savedCfg = persistServerBlogConfig({
      heading: blogConfig.heading,
      description: blogConfig.description,
      newsArticles: nextNews,
      storyArticles: nextStories,
    });

    return res.json({
      success: true,
      deletedId: targetId,
      updatedAt: savedCfg.updatedAt,
      message: `Blog post '${targetId}' deleted and synced to disk.`,
    });
  } catch (error) {
    console.error('[Admin] Error deleting blog post:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// POST /api/admin/blog-posts/upload-image & POST /api/admin/blog-posts/:id/image
// Save uploaded blog image as /assets/blog/${id}${ext}?v=${Date.now()} in /public/assets/blog/ & /src/assets/images/blog/
const handleBlogCoverImageUpload = (req: any, res: any) => {
  try {
    const rawId = req.params?.id || req.body?.id || req.body?.postId || req.body?.slug || 'blog-cover';
    const sanitizedId =
      String(rawId)
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase() || 'blog-cover';
    const { dataUrl, base64, previousUrl, imageAlt, parentPostId, blockId } = req.body || {};

    if (!dataUrl && !base64) {
      return res.status(400).json({
        success: false,
        error: 'Missing image data (dataUrl or base64 required)',
      });
    }

    let ext = '.webp';
    const mimeMatch =
      typeof dataUrl === 'string'
        ? dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,/)
        : null;
    if (mimeMatch && mimeMatch[1]) {
      const sub = mimeMatch[1].toLowerCase();
      if (sub === 'webp') ext = '.webp';
      else if (sub === 'jpeg' || sub === 'jpg') ext = '.jpg';
      else if (sub === 'png') ext = '.png';
      else if (sub === 'gif') ext = '.gif';
      else if (sub === 'avif') ext = '.avif';
    }

    const rawData = dataUrl ? dataUrl.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '') : base64;
    const buffer = Buffer.from(rawData, 'base64');

    const targetDirs = [publicBlogDir];
    if (fs.existsSync(distBlogDir)) {
      targetDirs.push(distBlogDir);
    }
    const deletedFiles: string[] = [];

    // Purge any previous file with the exact same ID stem (never touch inline blocks or other post IDs)
    for (const dir of targetDirs) {
      if (fs.existsSync(dir)) {
        try {
          const files = fs.readdirSync(dir);
          for (const f of files) {
            const fExt = path.extname(f);
            const fBase = path.basename(f, fExt).toLowerCase();
            if (fBase === sanitizedId) {
              const fullPath = path.join(dir, f);
              try {
                fs.unlinkSync(fullPath);
                deletedFiles.push(f);
              } catch {}
            }
          }
        } catch {}
      }
    }

    const singleFileName = `${sanitizedId}${ext}`;
    const publicPath = path.join(publicBlogDir, singleFileName);

    fs.writeFileSync(publicPath, buffer);
    if (fs.existsSync(distBlogDir)) {
      try {
        fs.writeFileSync(path.join(distBlogDir, singleFileName), buffer);
      } catch {}
    }

    const timestamp = Date.now();
    const cleanRelativePath = `/assets/blog/${sanitizedId}${ext}`;
    const cacheBustedUrl = `/assets/blog/${sanitizedId}${ext}?v=${timestamp}`;

    const cleanParentPostId = parentPostId
      ? String(parentPostId)
          .trim()
          .replace(/[^a-zA-Z0-9_-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')
          .toLowerCase()
      : '';
    const cleanBlockId = blockId ? String(blockId).trim() : '';

    // Immediately persist cover image OR inline contentBlock image to siteCustomizations.json and src/data.ts
    const blogConfig = getServerBlogConfig();
    let foundExisting = false;

    const updatePostWithUploadedImage = (post: any, postType: 'news' | 'stories') => {
      const postCleanId = String(post.id || '')
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();

      // Case 1: Cover image upload matching post.id
      if (!cleanBlockId && (postCleanId === sanitizedId || post.id === rawId)) {
        foundExisting = true;
        return normalizeServerArticle(
          {
            ...post,
            image: cacheBustedUrl,
            ...(typeof imageAlt === 'string' && imageAlt.trim() ? { imageAlt: imageAlt.trim() } : {}),
            updatedAt: new Date().toISOString(),
          },
          postType
        );
      }

      // Case 2: Inline modular block image upload matching parentPostId (or prefix of sanitizedId)
      const isParentMatch =
        (cleanParentPostId && (postCleanId === cleanParentPostId || post.id === parentPostId)) ||
        (!cleanParentPostId && sanitizedId.startsWith(`${postCleanId}-block-`));

      if (isParentMatch) {
        foundExisting = true;
        const resolvedBlockId =
          cleanBlockId || sanitizedId.slice(postCleanId.length + 1) || `block-${timestamp}`;
        const existingBlocks = Array.isArray(post.contentBlocks) ? [...post.contentBlocks] : [];
        const blockIdx = existingBlocks.findIndex(
          (b: any) => b && String(b.id || '').toLowerCase() === resolvedBlockId.toLowerCase()
        );
        if (blockIdx !== -1) {
          existingBlocks[blockIdx] = {
            ...existingBlocks[blockIdx],
            id: existingBlocks[blockIdx].id || resolvedBlockId,
            type: 'image',
            imageUrl: cacheBustedUrl,
            imageAlt:
              (typeof imageAlt === 'string' && imageAlt.trim()) ||
              existingBlocks[blockIdx].imageAlt ||
              `${post.title || 'Clinical'} — illustration`,
          };
        } else {
          existingBlocks.push({
            id: resolvedBlockId,
            type: 'image',
            imageUrl: cacheBustedUrl,
            imageAlt:
              (typeof imageAlt === 'string' && imageAlt.trim()) ||
              `${post.title || 'Clinical'} — illustration`,
            imageCaption: '',
          });
        }
        return normalizeServerArticle(
          {
            ...post,
            contentBlocks: existingBlocks,
            updatedAt: new Date().toISOString(),
          },
          postType
        );
      }

      return post;
    };

    const nextNews = blogConfig.newsArticles.map((post) => updatePostWithUploadedImage(post, 'news'));
    const nextStories = blogConfig.storyArticles.map((post) => updatePostWithUploadedImage(post, 'stories'));

    if (foundExisting) {
      persistServerBlogConfig({
        heading: blogConfig.heading,
        description: blogConfig.description,
        newsArticles: nextNews,
        storyArticles: nextStories,
      });
    } else if (typeof previousUrl === 'string' && previousUrl.startsWith('/assets/blog/')) {
      const normPrev = previousUrl.split('?')[0].split('#')[0].trim();
      if (normPrev !== cleanRelativePath) {
        const activeUrls = collectAllBlogImagePaths([
          ...blogConfig.newsArticles,
          ...blogConfig.storyArticles,
        ]);
        activeUrls.add(cleanRelativePath);
        deleteUnreferencedBlogImageFile(normPrev, activeUrls);
      }
    }

    console.log(`[Admin] Saved blog image to ${cacheBustedUrl}`);

    return res.json({
      success: true,
      id: sanitizedId,
      fileName: singleFileName,
      url: cacheBustedUrl,
      rawPath: cleanRelativePath,
      imagePath: cacheBustedUrl,
      version: timestamp,
      deletedFiles: [...new Set(deletedFiles)],
      message: `Blog image saved as ${cacheBustedUrl}`,
    });
  } catch (error) {
    console.error('[Admin] Error saving blog image:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
};

app.post('/api/admin/blog-posts/upload-image', handleBlogCoverImageUpload);
app.post('/api/admin/blog-posts/:id/image', handleBlogCoverImageUpload);

// GET /api/admin/blog-posts/:id/image
// Resolve current image file in /assets/blog/${id}${ext}?v=${timestamp}
app.get('/api/admin/blog-posts/:id/image', (req, res) => {
  try {
    const rawId = req.params.id;
    const sanitizedId =
      String(rawId)
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase() || 'blog-cover';

    if (fs.existsSync(publicBlogDir)) {
      const files = fs.readdirSync(publicBlogDir);
      const matched = files.find((f) => {
        const fExt = path.extname(f);
        return path.basename(f, fExt).toLowerCase() === sanitizedId;
      });
      if (matched) {
        const stat = fs.statSync(path.join(publicBlogDir, matched));
        const ext = path.extname(matched).toLowerCase() || '.webp';
        const timestamp = Math.floor(stat.mtimeMs || Date.now());
        return res.json({
          success: true,
          exists: true,
          id: sanitizedId,
          fileName: matched,
          imagePath: `/assets/blog/${sanitizedId}${ext}?v=${timestamp}`,
          rawPath: `/assets/blog/${sanitizedId}${ext}`,
          updatedAt: stat.mtime.toISOString(),
          version: timestamp,
        });
      }
    }

    return res.json({
      success: true,
      exists: false,
      id: sanitizedId,
      imagePath: `/assets/blog/${sanitizedId}.webp`,
      rawPath: `/assets/blog/${sanitizedId}.webp`,
    });
  } catch (error) {
    console.error('[Admin] Error checking blog image:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

// Vite or Static file serving
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: {
      middlewareMode: true,
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : {
              ignored: [
                '**/src/data/siteCustomizations.json',
                '**/src/data/clinicInfo.ts*',
                '**/src/data/transformationsData.ts*',
                '**/src/data/specialistTreatments.ts*',
                '**/src/data/treatmentPricing.ts*',
                '**/src/data.ts*',
                '**/public/assets/**',
                '**/public/uploads/**',
                '**/*.tmp',
              ],
            },
    },
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
  try {
    const repairedCount = verifyAndRepairClinicDataAssets(getMergedClinicData());
    if (repairedCount > 0) {
      console.log(`[Startup Asset Repair] Automatically mirrored and repaired ${repairedCount} clinic asset(s).`);
    }
  } catch (err) {
    console.warn('[Startup Asset Repair] Verification notice:', err);
  }
  console.log(`Age Reversal Clinic server running on http://0.0.0.0:${PORT}`);
});
