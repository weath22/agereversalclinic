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

## Verification Plan

### Automated Build Verification:
- Run `compile_applet` to verify zero TypeScript errors and successful production bundling.

### Manual / Browser Verification:
1. **Parent Branch CRUD**:
   - Add a new test parent branch (e.g. `Wellness Concierge`) and verify it appears in Row 1.
   - Rename a parent branch and verify all child treatments reflect the new branch name.
2. **Sub-Group CRUD**:
   - Select `Face & Injectables`, click `+ Add Sub-group` (e.g. `Bio-Regenerative Exosomes`).
   - Rename an existing sub-group (e.g. `Anti-Wrinkle` to `Neuromodulators & Botox`) and confirm all 12+ treatments update their badges and counts.
   - Delete a sub-group and verify the safe re-assignment modal cleanly migrates treatments.
3. **Card Assignment**:
   - Open a treatment edit modal, change its sub-group, save, and confirm the card filter count updates immediately.
4. **Persistence Test**:
   - Refresh the page and verify that the customized parent branches and sub-groups persist cleanly from disk.
