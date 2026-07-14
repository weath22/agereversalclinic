import fs from 'fs';

let storeContent = fs.readFileSync('src/lib/adminStore.ts', 'utf8');

const newAreasBlock = `const DEFAULT_SPECIALIST_AREAS_CONFIG: SpecialistAreasConfig = {
  heading: "Explore our specialist areas",
  description: "At Age Reversal Clinic, we offer advanced aesthetic diagnostics, world-leading practitioners, and fast access to appointments - often within 48 hours - so your transformation can begin in days, not months.",
  areas: [
    {
      id: 'face',
      title: 'Facial Injectables',
      description: 'Advanced clinical injectables and facial contouring tailored for natural lift, harmony, and structural rejuvenation.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOPTQtfj8J1bbB7SlVVRU6fYo2gWaZ-vP4FOmbQ0GK-wiSWxgFv7RrufflpNtjGP9Dk5eLV2kMfUIPVx1N4ETnRWMUGQ-pnWBcZCa97apM4cg71CV6hKaKDiQOlU26NKqLXuvzRkHrDNd-vXfy5u3MHCvpyxfbnHdk9lkm5vhjg9zIrK1aYJGwOOOPurVrXxbRr7FprgjD7ZzrUzhcc4DM6YdWc6J8P_jEx9W_ffwKfL2E8x3PIYt0_G8MTcbFUJlLtFYmgOa7s-OK'
    },
    {
      id: 'skin',
      title: 'Skin Rejuvenation',
      description: 'State-of-the-art medical grade facials, laser therapies, and cellular treatments for luminous, clear skin.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2a_0Datjn8f2On3mNF7IY6_QgXkw0AQl1Il2WqYPqYqTU7wUKYRpJUg2xdA_d0B8SfBpbvVzzYOczvA85hXWv6hkb0snKG0UXUjP3EUDr0nkt_A_nINJJOIpGcQ2X_iD94V14qlhvJmRUp8In6cOEtlONSRSf5Kpdd8uA6VUX3SFIaBku4xsVbSvg9fE6K0FWVX-QGNWmY4jhYY70yZCEdfN_V3cezSz0jiycoy31X-hMxrw-bNoMrpEVo43FV1z8TnWKiqVpTdlK'
    },
    {
      id: 'body',
      title: 'Body Contouring',
      description: 'High-definition body shaping using advanced clinical techniques, including dermal fillers and fat reduction.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClIGVnrpyhbZbn4skniRN95s8fe43niaHTpE2PHrPr4EAZc-kvyMu1k6JL4FcYCAw-SE1G2rBygkpuYimKkujZ8Ch9rHKJwqguHanaAZbAL8-ujTZWI6ThpC_rihPWbmp-seHAxJjDCFpT3JHdZknmaCVpfRjqS3n6DVdZCyDo4SBhN_q4D4NflwD5qBwDUw7uXpgpjXln7PkJWypOLjdKW-xVYzB53vh6hXOmAgbAecmaayoHjY2ZousTGNq_zRShg3Go2f8V0O4R'
    },
    {
      id: 'hair',
      title: 'Hair Restoration',
      description: 'Elite follicle stimulation and clinical growth induction therapies for healthy, robust hair restoration.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCauimUjLiG4FTybnhAOQgEeV5EX6ZPVafVgrL3ZQsSct4k3azc70DZOUL83NrLvzdJb2f8vDkSR-JW3kDIXtIlaDRE7geAe7clP3VWiV3uUxojtpMPuJEi5OqDgxLNHx9CkD10MbA89eiJWjBKIGS_6wyql817jtfy9hiYYvBvNSkfl-hWqMAYjqlQY60-eyfLsAJrUNmaucXp2XyxxJ3g8KII7-qGALB6o42Cwv1YMd51LLVpOMqPrCEUk2hzlWKV6lTlxBcieuUH'
    }
  ]
};`;

storeContent = storeContent.replace(/const DEFAULT_SPECIALIST_AREAS_CONFIG:\s*SpecialistAreasConfig\s*=\s*\{[\s\S]*?\n\};\n*(?=const DEFAULT_TREATMENTS_CONFIG)/, newAreasBlock + '\n\n');
storeContent = storeContent.replace(/const SPECIALIST_AREAS_CONFIG_KEY\s*=\s*'[^']+';/, "const SPECIALIST_AREAS_CONFIG_KEY = 'homepage_specialist_areas_config_v4';");

fs.writeFileSync('src/lib/adminStore.ts', storeContent);
