import fs from 'fs';

// 1. Patch adminStore.ts
let storeContent = fs.readFileSync('src/lib/adminStore.ts', 'utf8');

const newAreasBlock = `const DEFAULT_SPECIALIST_AREAS_CONFIG: SpecialistAreasConfig = {
  heading: "Explore our specialist areas",
  description: "At Age Reversal Clinic, we offer advanced aesthetic diagnostics, world-leading practitioners, and fast access to appointments - often within 48 hours - so your transformation can begin in days, not months.",
  areas: [
    {
      id: 'face',
      title: 'Facial Injectables',
      description: 'Advanced clinical injectables and facial contouring tailored for natural lift, harmony, and structural rejuvenation.',
      image: '/images/specialist_face_1784018617135.jpg'
    },
    {
      id: 'skin',
      title: 'Skin Rejuvenation',
      description: 'State-of-the-art medical grade facials, laser therapies, and cellular treatments for luminous, clear skin.',
      image: '/images/specialist_skin_1784018653420.jpg'
    },
    {
      id: 'body',
      title: 'Body Contouring',
      description: 'High-definition body shaping using advanced clinical techniques, including dermal fillers and fat reduction.',
      image: '/images/specialist_body_1784018636034.jpg'
    },
    {
      id: 'hair',
      title: 'Hair Restoration',
      description: 'Elite follicle stimulation and clinical growth induction therapies for healthy, robust hair restoration.',
      image: '/images/specialist_hair_1784018667926.jpg'
    },
    {
      id: 'fillers',
      title: 'Dermal Fillers',
      description: 'Premium hyaluronic acid formulations to restore volume, define contours, and soften deep lines.',
      image: '/images/specialist_fillers_1784019006444.jpg'
    },
    {
      id: 'exosome',
      title: 'Exosome Therapy',
      description: 'Cutting-edge cellular regeneration utilizing isolated exosomes for profound anti-aging and tissue repair.',
      image: '/images/specialist_exosome_1784019018807.jpg'
    },
    {
      id: 'fat-reduction',
      title: 'Fat Reduction',
      description: 'Targeted, non-surgical lipid metabolization therapies for a refined and sculpted silhouette.',
      image: '/images/specialist_fat_reduction_1784019032389.jpg'
    },
    {
      id: 'rhinoplasty',
      title: 'Non-Surgical Rhinoplasty',
      description: 'Precision contouring to smooth dorsal humps and refine the nasal profile with zero downtime.',
      image: '/images/specialist_rhinoplasty_1784019045714.jpg'
    },
    {
      id: 'lips',
      title: 'Lip Enhancement',
      description: 'Artisanal lip augmentation designed to restore symmetry, add subtle volume, and define the vermillion border.',
      image: '/images/specialist_lips_1784019060568.jpg'
    },
    {
      id: 'laser',
      title: 'Laser Skin Resurfacing',
      description: 'Fractional ablative technology to dramatically improve texture, reduce scarring, and eliminate pigmentation.',
      image: '/images/specialist_laser_1784019072484.jpg'
    },
    {
      id: 'microneedling',
      title: 'Clinical Micro-needling',
      description: 'Controlled micro-injuries to stimulate endogenous collagen and elastin production for firmer skin.',
      image: '/images/specialist_microneedling_1784019085019.jpg'
    },
    {
      id: 'chemical-peel',
      title: 'Medical Grade Peels',
      description: 'Customized chemical exfoliation protocols to resolve acne, melasma, and severe photo-aging.',
      image: '/images/specialist_chemical_peel_1784019097136.jpg'
    }
  ]
};`;

storeContent = storeContent.replace(/const DEFAULT_SPECIALIST_AREAS_CONFIG:\s*SpecialistAreasConfig\s*=\s*\{[\s\S]*?\n\};\n*(?=const DEFAULT_TREATMENTS_CONFIG)/, newAreasBlock + '\n\n');
storeContent = storeContent.replace(/const SPECIALIST_AREAS_CONFIG_KEY\s*=\s*'[^']+';/, "const SPECIALIST_AREAS_CONFIG_KEY = 'homepage_specialist_areas_config_v3';");

fs.writeFileSync('src/lib/adminStore.ts', storeContent);


// 2. Patch SpecialistAreas.tsx to remove staticPagesData and just use config directly
let compContent = fs.readFileSync('src/components/SpecialistAreas.tsx', 'utf8');

const newCompLogic = `
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Compute dynamic pages based on specialistAreasConfig.areas
  const areas = specialistAreasConfig?.areas || [];
  const chunkedPages: Record<number, AreaItem[]> = {};
  const itemsPerPage = 4;

  if (areas.length > 0) {
    for (let i = 0; i < areas.length; i += itemsPerPage) {
      const pageNum = Math.floor(i / itemsPerPage) + 1;
      chunkedPages[pageNum] = areas.slice(i, i + itemsPerPage);
    }
  }

  const pagesData = Object.keys(chunkedPages).length > 0 ? chunkedPages : { 1: [] };
  const totalPages = Object.keys(pagesData).length || 1;
`;

compContent = compContent.replace(/const \[currentPage, setCurrentPage\] = useState<number>\(1\);[\s\S]*?const totalPages = Object\.keys\(pagesData\)\.length \|\| 1;/, newCompLogic);

fs.writeFileSync('src/components/SpecialistAreas.tsx', compContent);
