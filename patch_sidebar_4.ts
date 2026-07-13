import fs from 'fs';

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

content = content.replace(
  /<span>Export Database<\/span>/g,
  `<span className="md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300">Export Database</span>`
);

content = content.replace(
  /<span>Exit Admin Portal<\/span>/g,
  `<span className="md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300">Exit Admin Portal</span>`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
