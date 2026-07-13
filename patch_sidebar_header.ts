import fs from 'fs';

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// replace p-6 with px-4 py-6 in the sidebar header
content = content.replace(
  /<div className="p-6 flex items-center justify-between border-b border-\[\#c5a880\]\/15">/,
  `<div className="px-4 py-6 flex items-center justify-between border-b border-[#c5a880]/15">`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
