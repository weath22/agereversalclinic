import fs from 'fs';

let content = fs.readFileSync('src/lib/adminStore.ts', 'utf8');

const newGalleryConfig = `const DEFAULT_GALLERY_CONFIG: BeforeAfterGalleryConfig = {
  heading: "Before & After Gallery",
  description: "Witness the transformative journeys of our patients. These unretouched, real clinical cases illustrate the precision-guided results we achieve daily across our specialist disciplines.",
  categories: [
    {
      id: 'acne',
      name: 'Acne & Scarring',
      pairs: [
        {
          id: 'acne-1',
          title: 'Active Acne Clear-Up - 12 Wks',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCauimUjLiG4FTybnhAOQgEeV5EX6ZPVafVgrL3ZQsSct4k3azc70DZOUL83NrLvzdJb2f8vDkSR-JW3kDIXtIlaDRE7geAe7clP3VWiV3uUxojtpMPuJEi5OqDgxLNHx9CkD10MbA89eiJWjBKIGS_6wyql817jtfy9hiYYvBvNSkfl-hWqMAYjqlQY60-eyfLsAJrUNmaucXp2XyxxJ3g8KII7-qGALB6o42Cwv1YMd51LLVpOMqPrCEUk2hzlWKV6lTlxBcieuUH',
          afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOPTQtfj8J1bbB7SlVVRU6fYo2gWaZ-vP4FOmbQ0GK-wiSWxgFv7RrufflpNtjGP9Dk5eLV2kMfUIPVx1N4ETnRWMUGQ-pnWBcZCa97apM4cg71CV6hKaKDiQOlU26NKqLXuvzRkHrDNd-vXfy5u3MHCvpyxfbnHdk9lkm5vhjg9zIrK1aYJGwOOOPurVrXxbRr7FprgjD7ZzrUzhcc4DM6YdWc6J8P_jEx9W_ffwKfL2E8x3PIYt0_G8MTcbFUJlLtFYmgOa7s-OK'
        },
        {
          id: 'acne-2',
          title: 'Atrophic Scar Smoothing - 6 Mths',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2a_0Datjn8f2On3mNF7IY6_QgXkw0AQl1Il2WqYPqYqTU7wUKYRpJUg2xdA_d0B8SfBpbvVzzYOczvA85hXWv6hkb0snKG0UXUjP3EUDr0nkt_A_nINJJOIpGcQ2X_iD94V14qlhvJmRUp8In6cOEtlONSRSf5Kpdd8uA6VUX3SFIaBku4xsVbSvg9fE6K0FWVX-QGNWmY4jhYY70yZCEdfN_V3cezSz0jiycoy31X-hMxrw-bNoMrpEVo43FV1z8TnWKiqVpTdlK',
          afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClIGVnrpyhbZbn4skniRN95s8fe43niaHTpE2PHrPr4EAZc-kvyMu1k6JL4FcYCAw-SE1G2rBygkpuYimKkujZ8Ch9rHKJwqguHanaAZbAL8-ujTZWI6ThpC_rihPWbmp-seHAxJjDCFpT3JHdZknmaCVpfRjqS3n6DVdZCyDo4SBhN_q4D4NflwD5qBwDUw7uXpgpjXln7PkJWypOLjdKW-xVYzB53vh6hXOmAgbAecmaayoHjY2ZousTGNq_zRShg3Go2f8V0O4R'
        }
      ]
    },
    {
      id: 'antiaging',
      name: 'Anti-Aging Rejuvenation',
      pairs: [
        {
          id: 'age-1',
          title: 'Deep Wrinkle Diminution - 16 Wks',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCauimUjLiG4FTybnhAOQgEeV5EX6ZPVafVgrL3ZQsSct4k3azc70DZOUL83NrLvzdJb2f8vDkSR-JW3kDIXtIlaDRE7geAe7clP3VWiV3uUxojtpMPuJEi5OqDgxLNHx9CkD10MbA89eiJWjBKIGS_6wyql817jtfy9hiYYvBvNSkfl-hWqMAYjqlQY60-eyfLsAJrUNmaucXp2XyxxJ3g8KII7-qGALB6o42Cwv1YMd51LLVpOMqPrCEUk2hzlWKV6lTlxBcieuUH',
          afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClIGVnrpyhbZbn4skniRN95s8fe43niaHTpE2PHrPr4EAZc-kvyMu1k6JL4FcYCAw-SE1G2rBygkpuYimKkujZ8Ch9rHKJwqguHanaAZbAL8-ujTZWI6ThpC_rihPWbmp-seHAxJjDCFpT3JHdZknmaCVpfRjqS3n6DVdZCyDo4SBhN_q4D4NflwD5qBwDUw7uXpgpjXln7PkJWypOLjdKW-xVYzB53vh6hXOmAgbAecmaayoHjY2ZousTGNq_zRShg3Go2f8V0O4R'
        }
      ]
    },
    {
      id: 'hair',
      name: 'Clinical Hair Restoration',
      pairs: [
        {
          id: 'hair-1',
          title: 'Temporal Hairline Density - 6 Mths',
          beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2a_0Datjn8f2On3mNF7IY6_QgXkw0AQl1Il2WqYPqYqTU7wUKYRpJUg2xdA_d0B8SfBpbvVzzYOczvA85hXWv6hkb0snKG0UXUjP3EUDr0nkt_A_nINJJOIpGcQ2X_iD94V14qlhvJmRUp8In6cOEtlONSRSf5Kpdd8uA6VUX3SFIaBku4xsVbSvg9fE6K0FWVX-QGNWmY4jhYY70yZCEdfN_V3cezSz0jiycoy31X-hMxrw-bNoMrpEVo43FV1z8TnWKiqVpTdlK',
          afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOPTQtfj8J1bbB7SlVVRU6fYo2gWaZ-vP4FOmbQ0GK-wiSWxgFv7RrufflpNtjGP9Dk5eLV2kMfUIPVx1N4ETnRWMUGQ-pnWBcZCa97apM4cg71CV6hKaKDiQOlU26NKqLXuvzRkHrDNd-vXfy5u3MHCvpyxfbnHdk9lkm5vhjg9zIrK1aYJGwOOOPurVrXxbRr7FprgjD7ZzrUzhcc4DM6YdWc6J8P_jEx9W_ffwKfL2E8x3PIYt0_G8MTcbFUJlLtFYmgOa7s-OK'
        }
      ]
    }
  ]
};`;

content = content.replace(/const DEFAULT_GALLERY_CONFIG:\s*BeforeAfterGalleryConfig\s*=\s*\{[\s\S]*?\n\};\n*(?=const DEFAULT_WHY_CHOOSE_US_CONFIG)/, newGalleryConfig + '\n\n');
content = content.replace(/const GALLERY_CONFIG_KEY\s*=\s*'[^']+';/, "const GALLERY_CONFIG_KEY = 'homepage_gallery_config_v3';");

fs.writeFileSync('src/lib/adminStore.ts', content);
