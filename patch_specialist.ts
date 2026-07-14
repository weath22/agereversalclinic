import fs from 'fs';

let content = fs.readFileSync('src/lib/adminStore.ts', 'utf8');

const regex = /const DEFAULT_SPECIALIST_AREAS_CONFIG:\s*SpecialistAreasConfig = \{[\s\S]*?id:\s*'hair'[\s\S]*?\}[\s\S]*?\]\s*\};/;
// Wait, this might be fragile. 
// Instead, I'll just rewrite the whole DEFAULT_SPECIALIST_AREAS_CONFIG block.

const newBlock = `const DEFAULT_SPECIALIST_AREAS_CONFIG: SpecialistAreasConfig = {
  heading: "Explore our specialist areas",
  description: "At Age Reversal Clinic, we offer advanced aesthetic diagnostics, world-leading practitioners, and fast access to appointments - often within 48 hours - so your transformation can begin in days, not months.",
  areas: [
    {
      id: 'face',
      title: 'Face',
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
      title: 'Body',
      description: 'High-definition body shaping using advanced clinical techniques, including dermal fillers and fat reduction.',
      image: '/images/specialist_body_1784018636034.jpg'
    },
    {
      id: 'hair',
      title: 'Hair Restoration',
      description: 'Elite follicle stimulation and clinical growth induction therapies for healthy, robust hair restoration.',
      image: '/images/specialist_hair_1784018667926.jpg'
    }
  ]
};`;

// replace from `const DEFAULT_SPECIALIST_AREAS_CONFIG` to the `};` before `const DEFAULT_TREATMENTS_CONFIG`
content = content.replace(/const DEFAULT_SPECIALIST_AREAS_CONFIG:\s*SpecialistAreasConfig\s*=\s*\{[\s\S]*?\n\};\n*(?=const DEFAULT_TREATMENTS_CONFIG)/, newBlock + '\n\n');

content = content.replace(/const SPECIALIST_AREAS_CONFIG_KEY = 'homepage_specialist_areas_config';/, `const SPECIALIST_AREAS_CONFIG_KEY = 'homepage_specialist_areas_config_v2';`);

fs.writeFileSync('src/lib/adminStore.ts', content);
