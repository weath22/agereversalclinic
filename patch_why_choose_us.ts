import fs from 'fs';

let content = fs.readFileSync('src/lib/adminStore.ts', 'utf8');

const newWhyChooseUsConfig = `const DEFAULT_WHY_CHOOSE_US_CONFIG: WhyChooseUsConfig = {
  heading: "Why choose Age Reversal Clinic London?",
  description: "Experience the pinnacle of clinical aesthetics. Here’s why clients trust our London flagship for their transformation.",
  pillars: [
    {
      id: 'p1',
      title: "London's Premier Aesthetic Destination",
      description: "Situated in the heart of London, offering unparalleled luxury and clinical excellence.",
      iconName: "Building"
    },
    {
      id: 'p2',
      title: "Top-rated by real patients",
      description: "Exceptional results with a 4.9/5 rating from over 2,000 verified reviews.",
      iconName: "Star"
    },
    {
      id: 'p3',
      title: "Advanced Clinical Technologies",
      description: "Equipped with state-of-the-art FDA-approved laser and imaging systems.",
      iconName: "Sparkles"
    },
    {
      id: 'p4',
      title: "World-Class Medical Team",
      description: "Our board-certified practitioners bring decades of specialized aesthetic expertise.",
      iconName: "Medal"
    }
  ]
};`;

content = content.replace(/const DEFAULT_WHY_CHOOSE_US_CONFIG:\s*WhyChooseUsConfig\s*=\s*\{[\s\S]*?\n\};\n*(?=const DEFAULT_AWARDS_CONFIG)/, newWhyChooseUsConfig + '\n\n');

// Bump the config key
content = content.replace(/const WHY_CHOOSE_US_CONFIG_KEY = 'homepage_why_choose_us_config';/, "const WHY_CHOOSE_US_CONFIG_KEY = 'homepage_why_choose_us_config_v2';");

fs.writeFileSync('src/lib/adminStore.ts', content);
