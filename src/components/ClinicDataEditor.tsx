import ClinicDataManager from './ClinicDataManager';

/**
 * ClinicDataEditor is the designated Clinic Data Editor Component
 * strictly adhering to:
 * 1. Flat page canvas layout (no nested card containers, sections sit directly on page)
 * 2. Pure typography (zero icons across tabs, headers, buttons, form labels)
 * 3. Concise field labels without verbose descriptions
 * 4. Text-based sub-menu navigation (Brand & SEO, Contact & Hours, Credentials, Locations, Social Media, Brand Assets, Raw Code)
 * 5. Responsive mobile bottom sheet modals for item editing (locations, arrays) and desktop modal/inline editing.
 */
export const ClinicDataEditor = ClinicDataManager;
export default ClinicDataManager;
