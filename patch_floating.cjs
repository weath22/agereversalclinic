const fs = require('fs');
let content = fs.readFileSync('src/components/FloatingMenu.tsx', 'utf8');

content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { getFloatingMenuConfig } from '../lib/adminStore';");
content = content.replace("  const [isOpen, setIsOpen] = useState(false);", "  const [config, setConfig] = useState(getFloatingMenuConfig());\n\n  useEffect(() => {\n    setConfig(getFloatingMenuConfig());\n  }, []);\n\n  const [isOpen, setIsOpen] = useState(false);");

content = content.replace("{ text: \"Hello! How can we help you today?\", isUser: false }", "{ text: config.welcomeMessage || \"Hello! How can we help you today?\", isUser: false }");

content = content.replace("'tel:+919876543210'", "`tel:${config.phone.replace(/[^0-9+]/g, '')}`");
content = content.replace("'mailto:contact@agereversalclinic.com'", "`mailto:${config.email}`");
content = content.replace("'https://maps.google.com/?q=Vaishali+Nagar+Jaipur'", "`https://maps.google.com/?q=${encodeURIComponent(config.address)}`");

// enableChat condition
content = content.replace("!isOpen && !isChatOpen && (", "!isOpen && !isChatOpen && config.enableChat && (");
content = content.replace("isChatOpen && (", "isChatOpen && config.enableChat && (");


fs.writeFileSync('src/components/FloatingMenu.tsx', content);
