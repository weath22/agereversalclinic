import fs from 'fs';

let content = fs.readFileSync('src/lib/adminStore.ts', 'utf8');

// Replace all URLs for acne-1, acne-2, age-1 with the local images
// We'll replace the beforeImage and afterImage fields globally in the DEFAULT_GALLERY_CONFIG section

// Just find the block and replace the URLs inside it.
// Actually, it's easier to just match the specific long URLs and replace them.

// Find all beforeImage strings starting with 'https://lh3.googleusercontent.com/aida-public/...'
content = content.replace(/beforeImage:\s*'https:\/\/lh3\.googleusercontent\.com\/aida-public\/[^']+'/g, (match, offset) => {
  if (content.substring(Math.max(0, offset - 100), offset).includes('acne-1') || content.substring(Math.max(0, offset - 100), offset).includes('acne-2')) {
     return `beforeImage: '/images/acne_before_1784018006369.jpg'`;
  }
  if (content.substring(Math.max(0, offset - 100), offset).includes('age-1')) {
     return `beforeImage: '/images/anti_aging_before_1784018038578.jpg'`;
  }
  return `beforeImage: '/images/anti_aging_before_1784018038578.jpg'`; // fallback
});

// Find all afterImage strings starting with 'https://lh3.googleusercontent.com/aida/...'
content = content.replace(/afterImage:\s*'https:\/\/lh3\.googleusercontent\.com\/aida\/[^']+'/g, (match, offset) => {
  if (content.substring(Math.max(0, offset - 200), offset).includes('acne-1') || content.substring(Math.max(0, offset - 200), offset).includes('acne-2')) {
     return `afterImage: '/images/acne_after_1784018022796.jpg'`;
  }
  if (content.substring(Math.max(0, offset - 200), offset).includes('age-1')) {
     return `afterImage: '/images/anti_aging_after_1784018054094.jpg'`;
  }
  return `afterImage: '/images/anti_aging_after_1784018054094.jpg'`; // fallback
});

// We need to bust local storage cache or update the version keys, so the UI picks it up!
content = content.replace(/const GALLERY_CONFIG_KEY = 'homepage_gallery_config';/, `const GALLERY_CONFIG_KEY = 'homepage_gallery_config_v2';`);


fs.writeFileSync('src/lib/adminStore.ts', content);
