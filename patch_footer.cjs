const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

content = content.replace("import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Clock, Mail } from 'lucide-react';", "import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Clock, Mail } from 'lucide-react';\nimport { getFooterConfig } from '../lib/adminStore';\nimport { useState, useEffect } from 'react';");

content = content.replace("  const currentYear = new Date().getFullYear();\n  const footerLinks =", "  const [config, setConfig] = useState(getFooterConfig());\n\n  useEffect(() => {\n    setConfig(getFooterConfig());\n  }, []);\n\n  const currentYear = new Date().getFullYear();\n  const footerLinks = config.links.length > 0 ? config.links :");

content = content.replace("LONDON COSMETIC CLINIC KNIGHTSBRIDGE,<br />              2ND FLOOR, 4 HARLEY STREET, LONDON, W1G 9PB", "{config.address}");
content = content.replace("020 3581 3391", "{config.phone}");
content = content.replace("MON-SAT: 9:30 AM – 5:00 PM", "{config.hours}");
content = content.replace("london@agereversalclinic.com", "{config.email}");

fs.writeFileSync('src/components/Footer.tsx', content);
