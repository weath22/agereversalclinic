import fs from 'fs';

let content = fs.readFileSync('src/lib/adminStore.ts', 'utf8');

// just patch the specific lines for hair-1
content = content.replace(/id: 'hair-1',\s*title: 'Temporal Hairline Density - 6 Mths',\s*beforeImage: '\/images\/anti_aging_before_1784018038578\.jpg',\s*afterImage: '\/images\/anti_aging_after_1784018054094\.jpg'/g, `id: 'hair-1',\n          title: 'Temporal Hairline Density - 6 Mths',\n          beforeImage: '/images/hair_before_1784018134600.jpg',\n          afterImage: '/images/hair_after_1784018152230.jpg'`);

content = content.replace(/const GALLERY_CONFIG_KEY = 'homepage_gallery_config_v2';/, `const GALLERY_CONFIG_KEY = 'homepage_gallery_config_v3';`);


fs.writeFileSync('src/lib/adminStore.ts', content);
