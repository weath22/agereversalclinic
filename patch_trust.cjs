const fs = require('fs');
let content = fs.readFileSync('src/components/TrustBrands.tsx', 'utf8');

// add imports
content = content.replace("import { Shield, Layers, Circle, Compass, Cpu, Infinity } from 'lucide-react';", "import { Shield, Layers, Circle, Compass, Cpu, Infinity } from 'lucide-react';\nimport { getTrustBrandsConfig } from '../lib/adminStore';\nimport { useState, useEffect } from 'react';");

// add state
content = content.replace("  // Mapping brand icon names to clean Lucide icons for elite style", "  const [config, setConfig] = useState(getTrustBrandsConfig());\n\n  useEffect(() => {\n    setConfig(getTrustBrandsConfig());\n  }, []);\n\n  // Mapping brand icon names to clean Lucide icons for elite style");

// replace data mapping
content = content.replace("BRAND_PARTNERS.map", "config.brands.map");

fs.writeFileSync('src/components/TrustBrands.tsx', content);
