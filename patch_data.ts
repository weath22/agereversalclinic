import fs from 'fs';

let content = fs.readFileSync('src/data.ts', 'utf8');

const newImages = `export const TREATMENT_IMAGES: string[] = [
  '/images/treatment_facial_injectables_1784020708929.jpg',
  '/images/treatment_chemical_peel_1784020724076.jpg',
  '/images/treatment_dermal_fillers_1784020738614.jpg',
  '/images/treatment_microneedling_1784020753171.jpg',
  '/images/treatment_body_contouring_1784020767903.jpg',
  '/images/treatment_laser_skin_1784020784582.jpg'
];`;

content = content.replace(/export const TREATMENT_IMAGES:\s*string\[\]\s*=\s*\[[\s\S]*?\];/, newImages);

fs.writeFileSync('src/data.ts', content);
