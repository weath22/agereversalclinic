const fs = require('fs');
let content = fs.readFileSync('src/components/LatestNews.tsx', 'utf8');

content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { getLatestNewsConfig } from '../lib/adminStore';");
content = content.replace("  const [activeTab, setActiveTab] = useState<'news' | 'stories'>('news');", "  const [activeTab, setActiveTab] = useState<'news' | 'stories'>('news');\n  const [config, setConfig] = useState(getLatestNewsConfig());\n\n  useEffect(() => {\n    setConfig(getLatestNewsConfig());\n  }, []);");

content = content.replace("Latest from The London Clinic", "{config.heading}");
content = content.replace("Keep up to date with the latest news, events and patient stories from The London Clinic.", "{config.description}");

fs.writeFileSync('src/components/LatestNews.tsx', content);
