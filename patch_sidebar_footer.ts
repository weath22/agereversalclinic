import fs from 'fs';

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// replace justify-center with justify-start px-4 in the footer buttons
content = content.replace(
  /className="w-full flex items-center justify-center gap-2 bg-\[\#c5a880\]\/10/g,
  `className="w-full flex items-center justify-start px-4 gap-3 bg-[#c5a880]/10`
);

content = content.replace(
  /className="w-full flex items-center justify-center gap-2 bg-white text-\[\#003334\]/g,
  `className="w-full flex items-center justify-start px-4 gap-3 bg-white text-[#003334]`
);

// We need to also increase the icon size slightly to match the other icons, or keep it as is. 3.5 is 14px, 4.5 is 18px. Let's make it h-4.5 w-4.5 for consistency.
content = content.replace(/<Download className="h-3\.5 w-3\.5" \/>/g, `<Download className="h-4.5 w-4.5 shrink-0" />`);
content = content.replace(/<ArrowLeft className="h-3\.5 w-3\.5" \/>/g, `<ArrowLeft className="h-4.5 w-4.5 shrink-0" />`);


fs.writeFileSync('src/components/AdminDashboard.tsx', content);
