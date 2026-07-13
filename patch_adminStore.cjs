const fs = require('fs');

let content = fs.readFileSync('src/lib/adminStore.ts', 'utf8');

const defaultConfigs = `
const DEFAULT_SKINCARE_COLLECTION_CONFIG: SkincareCollectionConfig = {
  heading: "Skincare Essentials",
  description: "Dermatologist-approved formulations."
};

const DEFAULT_TRUST_BRANDS_CONFIG: TrustBrandsConfig = {
  brands: [
    { id: 'bp-1', name: 'Lumina', iconType: 'circle' },
    { id: 'bp-2', name: 'Aether', iconType: 'layers' },
    { id: 'bp-3', name: 'Vera', iconType: 'pill' },
    { id: 'bp-4', name: 'Zenith', iconType: 'shield' },
    { id: 'bp-5', name: 'Nexus', iconType: 'instagram' }
  ]
};

const DEFAULT_ACCREDITATIONS_CONFIG: AccreditationsConfig = {
  accreditations: [
    { id: 'acc-1', text: 'CQC Registered' },
    { id: 'acc-2', text: 'Save Face Accredited' }
  ]
};

const DEFAULT_LATEST_NEWS_CONFIG: LatestNewsConfig = {
  heading: "Latest News & Insights",
  description: "Stay informed on the latest clinical advancements.",
  newsArticles: [],
  storyArticles: []
};

const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  address: "123 Medical Plaza, London W1G 8JZ",
  phone: "020 7123 4567",
  email: "contact@agereversalclinic.com",
  hours: "Mon-Sat: 9am - 7pm",
  socialLinks: {
    facebook: "#",
    instagram: "#"
  },
  links: [
    { name: 'Home', href: '#home' }
  ]
};

const DEFAULT_FLOATING_MENU_CONFIG: FloatingMenuConfig = {
  phone: "020 7123 4567",
  email: "contact@agereversalclinic.com",
  address: "123 Medical Plaza, London",
  enableChat: true,
  welcomeMessage: "Hello! How can we help you today?"
};
`;

const initCode = `
  if (!window.localStorage.getItem(SKINCARE_COLLECTION_CONFIG_KEY)) {
    setStorageItem(SKINCARE_COLLECTION_CONFIG_KEY, DEFAULT_SKINCARE_COLLECTION_CONFIG);
  }
  if (!window.localStorage.getItem(TRUST_BRANDS_CONFIG_KEY)) {
    setStorageItem(TRUST_BRANDS_CONFIG_KEY, DEFAULT_TRUST_BRANDS_CONFIG);
  }
  if (!window.localStorage.getItem(ACCREDITATIONS_CONFIG_KEY)) {
    setStorageItem(ACCREDITATIONS_CONFIG_KEY, DEFAULT_ACCREDITATIONS_CONFIG);
  }
  if (!window.localStorage.getItem(LATEST_NEWS_CONFIG_KEY)) {
    setStorageItem(LATEST_NEWS_CONFIG_KEY, DEFAULT_LATEST_NEWS_CONFIG);
  }
  if (!window.localStorage.getItem(FOOTER_CONFIG_KEY)) {
    setStorageItem(FOOTER_CONFIG_KEY, DEFAULT_FOOTER_CONFIG);
  }
  if (!window.localStorage.getItem(FLOATING_MENU_CONFIG_KEY)) {
    setStorageItem(FLOATING_MENU_CONFIG_KEY, DEFAULT_FLOATING_MENU_CONFIG);
  }
`;

const resetCode = `
  setStorageItem(SKINCARE_COLLECTION_CONFIG_KEY, DEFAULT_SKINCARE_COLLECTION_CONFIG);
  setStorageItem(TRUST_BRANDS_CONFIG_KEY, DEFAULT_TRUST_BRANDS_CONFIG);
  setStorageItem(ACCREDITATIONS_CONFIG_KEY, DEFAULT_ACCREDITATIONS_CONFIG);
  setStorageItem(LATEST_NEWS_CONFIG_KEY, DEFAULT_LATEST_NEWS_CONFIG);
  setStorageItem(FOOTER_CONFIG_KEY, DEFAULT_FOOTER_CONFIG);
  setStorageItem(FLOATING_MENU_CONFIG_KEY, DEFAULT_FLOATING_MENU_CONFIG);
`;

const methodCode = `
export function getSkincareCollectionConfig(): SkincareCollectionConfig {
  initializeAdminStore();
  return getStorageItem<SkincareCollectionConfig>(SKINCARE_COLLECTION_CONFIG_KEY, DEFAULT_SKINCARE_COLLECTION_CONFIG);
}

export function saveSkincareCollectionConfig(config: SkincareCollectionConfig): SkincareCollectionConfig {
  setStorageItem(SKINCARE_COLLECTION_CONFIG_KEY, config);
  return config;
}

export function getTrustBrandsConfig(): TrustBrandsConfig {
  initializeAdminStore();
  return getStorageItem<TrustBrandsConfig>(TRUST_BRANDS_CONFIG_KEY, DEFAULT_TRUST_BRANDS_CONFIG);
}

export function saveTrustBrandsConfig(config: TrustBrandsConfig): TrustBrandsConfig {
  setStorageItem(TRUST_BRANDS_CONFIG_KEY, config);
  return config;
}

export function getAccreditationsConfig(): AccreditationsConfig {
  initializeAdminStore();
  return getStorageItem<AccreditationsConfig>(ACCREDITATIONS_CONFIG_KEY, DEFAULT_ACCREDITATIONS_CONFIG);
}

export function saveAccreditationsConfig(config: AccreditationsConfig): AccreditationsConfig {
  setStorageItem(ACCREDITATIONS_CONFIG_KEY, config);
  return config;
}

export function getLatestNewsConfig(): LatestNewsConfig {
  initializeAdminStore();
  return getStorageItem<LatestNewsConfig>(LATEST_NEWS_CONFIG_KEY, DEFAULT_LATEST_NEWS_CONFIG);
}

export function saveLatestNewsConfig(config: LatestNewsConfig): LatestNewsConfig {
  setStorageItem(LATEST_NEWS_CONFIG_KEY, config);
  return config;
}

export function getFooterConfig(): FooterConfig {
  initializeAdminStore();
  return getStorageItem<FooterConfig>(FOOTER_CONFIG_KEY, DEFAULT_FOOTER_CONFIG);
}

export function saveFooterConfig(config: FooterConfig): FooterConfig {
  setStorageItem(FOOTER_CONFIG_KEY, config);
  return config;
}

export function getFloatingMenuConfig(): FloatingMenuConfig {
  initializeAdminStore();
  return getStorageItem<FloatingMenuConfig>(FLOATING_MENU_CONFIG_KEY, DEFAULT_FLOATING_MENU_CONFIG);
}

export function saveFloatingMenuConfig(config: FloatingMenuConfig): FloatingMenuConfig {
  setStorageItem(FLOATING_MENU_CONFIG_KEY, config);
  return config;
}
`;

content = content.replace('// Initialize databases if they don\'t exist', defaultConfigs + '\n// Initialize databases if they don\'t exist');
content = content.replace('setStorageItem(SPECIAL_OFFERS_CONFIG_KEY, DEFAULT_SPECIAL_OFFERS_CONFIG);\n}', 'setStorageItem(SPECIAL_OFFERS_CONFIG_KEY, DEFAULT_SPECIAL_OFFERS_CONFIG);\n' + initCode + '}');
content = content.replace('setStorageItem(SPECIAL_OFFERS_CONFIG_KEY, DEFAULT_SPECIAL_OFFERS_CONFIG);\n}\n\n// HOMEPAGE EDIT METHODS', 'setStorageItem(SPECIAL_OFFERS_CONFIG_KEY, DEFAULT_SPECIAL_OFFERS_CONFIG);\n' + resetCode + '}\n\n// HOMEPAGE EDIT METHODS');
content = content + '\n' + methodCode;

fs.writeFileSync('src/lib/adminStore.ts', content);
