const fs = require('fs');
let content = fs.readFileSync('src/components/SkincareCollection.tsx', 'utf8');

// add imports
content = content.replace("import { Product } from '../types';", "import { Product } from '../types';\nimport { getSkincareCollectionConfig } from '../lib/adminStore';\nimport { useEffect } from 'react';");

// add state
content = content.replace("  const [notification, setNotification] = useState<string | null>(null);", "  const [notification, setNotification] = useState<string | null>(null);\n  const [config, setConfig] = useState(getSkincareCollectionConfig());\n\n  useEffect(() => {\n    setConfig(getSkincareCollectionConfig());\n  }, []);");

// replace text
content = content.replace("Curated Skincare Essentials", "{config.heading}");
content = content.replace("SHOP OUR COLLECTION", "{config.description || 'SHOP OUR COLLECTION'}");

fs.writeFileSync('src/components/SkincareCollection.tsx', content);
