const fs = require('fs');
let content = fs.readFileSync('src/components/Accreditations.tsx', 'utf8');

content = content.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport { getAccreditationsConfig } from '../lib/adminStore';\nimport { useState, useEffect } from 'react';");

content = content.replace("  const containerVariants = {", "  const [config, setConfig] = useState(getAccreditationsConfig());\n\n  useEffect(() => {\n    setConfig(getAccreditationsConfig());\n  }, []);\n\n  const containerVariants = {");

const listReplace = `            <div className="space-y-4">
              {config.accreditations.map(acc => (
              <div key={acc.id} className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-emerald-950/45 border border-emerald-800/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">{acc.text}</h4>
                </div>
              </div>
              ))}
            </div>`;
            
content = content.replace(/<div className="space-y-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/, listReplace + '\n          </div>\n        </div>\n      </div>\n    </section>');

fs.writeFileSync('src/components/Accreditations.tsx', content);
