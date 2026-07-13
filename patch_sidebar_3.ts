import fs from 'fs';

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

content = content.replace(
  /<span className="truncate">\{tab\.label\}<\/span>/g,
  `<span className="truncate md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300">{tab.label}</span>`
);

content = content.replace(
  /<span>Migration Spec<\/span>/g,
  `<span className="truncate md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300">Migration Spec</span>`
);

content = content.replace(
  /<span>Next\.js Migration Spec<\/span>/g,
  `<span className="truncate md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300">Next.js Migration Spec</span>`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
