# Implementation Plan: Manageable Two-Tier Hierarchy (Parent Branches & Sub-Groups) for Treatment Pricing & Media

Build a full CRUD hierarchy management system inside **Treatment Pricing & Media (`TreatmentPricingEditor.tsx`)**, replacing hardcoded keyword matchers with a dynamic, two-tier filter pill interface where parent branches and sub-groups can be added, renamed, and deleted directly from the UI, with complete persistence into `src/data/treatmentPricing.ts` and `src/data/siteCustomizations.json`.

---

## User Review Required

> [!IMPORTANT]
> - **Cascade Safety on Delete**: When deleting a Parent Branch or Sub-Group that contains active treatments, a safe reassignment dialog will prompt you to select a new destination group so no treatments are ever lost or orphaned.
> - **Sync with Master Branches**: The 5 default parent branches match the existing **Services & Branches** taxonomy (`Face & Injectables`, `Body Sculpting`, `Advanced Facials`, `Hair & Beauty`, `IV Drips & Wellness`), and you will have the freedom to add more parent branches or edit existing ones.

---

## Proposed Changes

### 1. Data Schema & Persistence Store (`src/data/treatmentPricing.ts`, `src/lib/adminStore.ts`, `server.ts`) - [COMPLETED]
- Defined `TreatmentSubGroup` and `TreatmentTaxonomyGroup` interfaces.
- Seeded default taxonomy with all 5 clinic branches and structured sub-groups.
- Added `subCategory` and `subGroupId` to treatment items and summaries, with `inferTreatmentSubGroup` helper.
- Added store methods: `getTreatmentTaxonomy`, `saveTreatmentTaxonomy`, `resetTreatmentTaxonomy`, `fetchRemoteTreatmentTaxonomy`.
- Updated `server.ts` with `/api/admin/treatment-taxonomy` (GET/POST) and disk persistence into `siteCustomizations.json` and `treatmentPricing.ts`.

---

### 2. Two-Tier Interactive Filter Pill Bar in `TreatmentPricingEditor.tsx` - [COMPLETED]
- **Row 1: Parent Branches Bar**:
  - `All Procedures` pill with live total count.
  - Interactive Parent Branch pills with live procedure count badges.
  - Hover / Action Icons on each parent pill: ✏️ Edit (Pencil) to rename branch, 🗑️ Delete (Trash) with safe treatment re-assignment.
  - `+ Add Branch` button opening clean mini-modal to enter a new parent branch.
- **Row 2: Sub-Groups Bar (Contextual to Selected Parent)**:
  - Expands smoothly with `AnimatePresence` whenever a parent branch is selected.
  - Renders `All [Parent Name]` pill with parent count, plus each Sub-Group pill with live count.
  - Hover / Action Icons on each sub-group pill: ✏️ Edit (Pencil) to rename sub-group (auto-updates assigned treatments' `subCategory`), 🗑️ Delete (Trash) with cascade migration options.
  - `+ Add Sub-Group` button opening clean mini-modal to add sub-groups under the active parent branch.

---

### 3. Treatment Card & Modal Sub-Group Assignment (`TreatmentPricingEditor.tsx`) - [COMPLETED]
- **Card Display**:
  - Clean dual hierarchy badges displayed on every procedure card: `[Face & Injectables]` (clinic teal badge) `›` `[Anti-Wrinkle Injections (Botox)]` (warm gold badge), with intelligent fallback to `inferTreatmentSubGroup()` for legacy procedures.
- **Add / Edit Treatment Modal**:
  - Cascading dropdowns: Parent Branch dynamically lists all branches from `taxonomy`. When changed, automatically updates the child sub-groups.
  - Sub-Group dropdown dynamically filters to sub-groups belonging to the selected parent branch.
  - Inline `+ New Sub-Group` quick-add button & input right inside the modal (also accessible as "+ Add New Sub-Group..." in the select dropdown) so administrators can create and assign a new sub-group on the fly without leaving the modal.
- **Batch / Inline Updates & Preservation**:
  - When treatments are saved (`handleSaveTreatmentModal`), both `category`, `subCategory`, and `subGroupId` are validated, synced with taxonomy, and persisted to local/remote stores.
  - When treatments are duplicated (`handleDuplicateTreatment`), parent branch, sub-group title, and sub-group ID are explicitly preserved and indexed.
- **Safe Reassignment Modals**:
  - Modal 6: Add Parent Branch
  - Modal 7: Rename Parent Branch (cascades to treatments)
  - Modal 8: Delete Parent Branch (safe migration to another branch or unassigned)
  - Modal 9: Add Sub-Group
  - Modal 10: Rename Sub-Group (cascades to treatments)
  - Modal 11: Delete Sub-Group (safe migration to another sub-group or unassigned)

---

### 4. Integration & Public View Harmony (`PricingPageView.tsx`, `Header.tsx`)

- Update `PricingPageView.tsx` so the public pricing page filter tabs read directly from the dynamic taxonomy instead of hardcoded prefix checks.
- Ensure all events (`treatment_pricing_updated`, `treatment_taxonomy_updated`) propagate immediately across components without requiring full page refresh.

---

## Predictable ID Architecture for Clinic Edit Info Images (Permanent Zip File Safety)

### Task 1: Create Clinic Image Helper (`src/utils/clinicImageHelper.ts`) - [COMPLETED]
- Standardized permanent slot ID naming: `clinic-logo-icon.webp`, `clinic-logo-full.webp`, `clinic-exterior.webp`, `clinic-og-image.webp`, `clinic-location-[id].webp`, `clinic-interior-[index].webp`, `clinic-award-[id].webp`, `clinic-pillar-[id].webp`, `clinic-process-[id].webp`, `clinic-facility-[id].webp`, `clinic-brand-[id].webp`.
- Cache-busting resolver: `getClinicImagePath(slotId, fallbackUrl, version)`.
- Cascading safe error fallback handler: `handleClinicImageError(event, fallbackUrl, slotId)` (cascades: custom URL -> bundled catalog in `clinicImages.ts` -> permanent brand emblem `CLINIC_LOGOS.icon`).
- Client-side WebP converter: `convertClinicImageFileToWebP(file, quality, maxDimension)`.

### Task 2: Server Upload & File Storage Engine (`server.ts`) - [COMPLETED]
- Slot-aware upload endpoint wired to `/api/admin/clinic-assets/upload` and `/api/admin/upload-asset`.
- Writes directly to predictable slot paths: `public/assets/${slotId}.webp` and mirrors to `src/assets/images/${slotId}.webp` (and `dist/assets/`).
- Deletes previous obsolete files associated with `slotId` to eliminate storage bloat and orphaned uploads.
- Startup file verification & repair: `verifyAndRepairClinicDataAssets` mirrors all `clinic-*.webp` slot assets on server start and save.

### Task 3: Clinic Edit Info Admin UI (`ClinicDataManager.tsx` & `adminStore.ts`) - [COMPLETED]
- Pass slot identifiers on upload:
  - Brand Logo & Social: `clinic-logo-icon`, `clinic-logo-full`, `clinic-og-image`, `clinic-exterior`.
  - Locations: `clinic-location-${loc.id}` and `${getClinicSlotId('location', loc.id)}-gallery-${gIdx}`.
  - Interior Suites: `clinic-facility-${roomId}` and `clinic-interior-${index}`.
  - Awards / Pillars: `clinic-award-${award.id}` / `clinic-pillar-${pillar.id}`.
  - Process Steps: `clinic-process-${step.id}`.
  - Trust Brands: `clinic-brand-${brand.id}`.
- Direct WebP Compression: Client-side WebP conversion runs before sending to ensure uniform formatting.
- Image previews wired to `resolveClinicImageSrc` and protected by `handleClinicImageError`.

### Task 1B: Fast 404 Route for `/assets` in `server.ts` - [COMPLETED]
- Added terminating fast 404 handler for `/assets` after all static directory middlewares (`publicAssetsDir`, `srcAssetsDir`, `distAssetsDir`).
- Missing clinic slot assets (e.g. `/assets/clinic-location-1.webp`) now immediately return HTTP 404 with zero body, preventing the browser from receiving the Vite SPA HTML document (`index.html`) or hanging during image resolution.
- Existing assets continue serving with HTTP 200.

### Task 2: Build Reusable ClinicImageWithPlaceholder (`ClinicImageWithPlaceholder.tsx`) - [COMPLETED]
- Created `src/components/common/ClinicImageWithPlaceholder.tsx` mirroring the Pricing Card image engine:
  - Exact Brand Logo Preloader: While downloading, renders the exact clinic brand logo (`CLINIC_LOGOS.icon` / `clinicData.logo.icon`) with subtle luxury ambient glow.
  - Exact Brand Logo Error Fallback: On server 404 or missing image file, instantly halts image loading and renders the permanent gold Age Reversal Clinic brand emblem (`LogoOutlineSkeleton`).
  - Smooth GPU-accelerated opacity transition once photograph is fully loaded.
  - Accepts overlay children (badges, button triggers, gradient scrims) without extra wrapper divs.
  - Zero dummy AI or Unsplash placeholders: strictly authentic clinic brand emblem.

### Task 3: Connect Brand Logo Placeholder in User-Facing Components - [COMPLETED]
- Equipped all user-facing clinic displays with `<ClinicImageWithPlaceholder />`:
  - `LocationsAndConsultation.tsx`: Location cards display the gold clinic brand emblem when images are missing or loading, keeping location details, badges, and directions intact.
  - `FacilityInteriors.tsx`: Treatment room carousel and lightbox overlay render the authentic brand emblem placeholder if room photos 404 or load.
  - `AwardsShowcase.tsx`: Medical awards cards display the luxury clinic emblem placeholder with gold status badges preserved.
  - `WhyChooseUs.tsx`: Clinical pillars display the exact brand logo placeholder across full-bleed card backdrops.
  - `Header.tsx` & `Footer.tsx`: Brand logos resolve seamlessly with zero broken image indicators.

### Task 4: Update Admin Previews in `ClinicDataManager.tsx` - [COMPLETED]
- Built `AdminSlotThumbnail` and `AdminSlotImageFieldPreview` helper components:
  - Exact Brand Logo Emblem: When an asset returns HTTP 404 or is not yet uploaded, displays `<LogoOutlineSkeleton size="xs" variant="gold" animate={false} />` (the exact brand emblem) with an amber "Awaiting Upload" indicator and the target permanent slot path (`/assets/${slotId}.webp`).
  - Active Asset Badge: When the asset exists and loads successfully, displays the photo preview with an emerald "Asset Active" status badge.
  - Zero Broken Browser Icons: Fast 404 immediately triggers `onError`, preventing broken image icons or HTML payload downloads.
  - Upgraded all admin image previews:
    - Section 1: Logo Icon (`clinic-logo-icon`), Full Logo (`clinic-logo-full`), OG Image (`clinic-og-image`), Exterior Photo (`clinic-exterior`).
    - Section 2: Facility Gallery Suite Cards (`facilityGallery.rooms`).
    - Section 6: Clinic Facilities & Locations list & gallery images.
    - Section 8: Why Choose Us Pillars.
    - Section 9: Awards Showcase.
    - Section 11: Process Steps.
    - Section 12: Trust Brands.
    - Modals: Location draft, Pillar draft, Award draft, Facility Room draft, Process Step draft, Trust Brand draft, and Interior Photos array draft.
- Zero dummy or AI-generated stock photos: strictly the authentic brand emblem.

### Task 5: Verification & Build Validation - [COMPLETED]
- **TypeScript Check (`tsc --noEmit`)**: Clean validation with 0 errors across the entire project.
- **Production Build (`compile_applet`)**: Clean compilation without bundling or asset resolution warnings.
- **Fast 404 Route Verification**: Executed live HTTP request to non-existent `/assets/clinic-test-missing.webp`:
  - Returned immediate `HTTP/1.1 404 Not Found` with `Content-Length: 0`.
  - Zero HTML index fallback payload downloaded by the browser.
- **Card Fallback Verification**:
  - `ClinicImageWithPlaceholder` synchronously displays the gold `<LogoOutlineSkeleton size={size} variant="gold" animate={false} />` emblem upon 404 without flickering.
  - Image loading smoothly reveals uploaded photographs via GPU-accelerated opacity fade once loaded.
  - Both public user-facing components and admin manager preview tiles display the authentic brand emblem.

### Task 6: Asset Migration & Default Reference Update (`clinicInfo.ts`) - [COMPLETED]
- Migrated legacy timestamped uploads to optimized permanent WebP slot assets:
  - `clinic-logo-icon.webp` (34 KB)
  - `clinic-logo-full.webp` (34 KB)
  - `clinic-interior-0.webp` (258 KB)
  - `clinic-location-1791722960928.webp` (258 KB)
  - `clinic-location-1791728808656.webp` (977 KB)
- Synchronized and mirrored across both `public/assets/` and `src/assets/images/`.
- Updated all references in `src/data/clinicInfo.ts` and `src/data/siteCustomizations.json`.
- Removed obsolete timestamped files from disk to eliminate bloat.
- Added `iconName?: string` to `ClinicAwardItem` interface for full TypeScript compliance.
- Verified live HTTP response codes: permanent assets return `200 OK`, missing assets return fast `404 Not Found`.
