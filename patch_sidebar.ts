import fs from 'fs';

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

content = content.replace(
  /<aside className=\{\`\s*fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-\[\#003334\] border-r border-\[\#c5a880\]\/15 text-white transform transition-transform duration-300 ease-in-out\s*md:translate-x-0 md:static md:h-screen md:sticky md:top-0 shrink-0\s*\$\{isMobileNavOpen \? 'translate-x-0' : '-translate-x-full md:translate-x-0'\}\s*\`\}>/,
  `<aside className={\`
        group/sidebar overflow-hidden
        fixed inset-y-0 left-0 z-50 flex flex-col bg-[#003334] border-r border-[#c5a880]/15 text-white transform transition-all duration-300 ease-in-out
        w-72 md:w-20 hover:md:w-72
        md:translate-x-0 md:static md:h-screen md:sticky md:top-0 shrink-0
        \${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      \`}>`
);

// update the logo text
content = content.replace(
  /<div>\s*<h2 className="font-serif font-bold text-base leading-tight tracking-tight text-white">\s*The London Clinic\s*<\/h2>\s*<p className="text-\[10px\] text-\[\#c5a880\] font-sans tracking-widest uppercase font-semibold">Admin Panel v1.2<\/p>\s*<\/div>/,
  `<div className="md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <h2 className="font-serif font-bold text-base leading-tight tracking-tight text-white">
                The London Clinic
              </h2>
              <p className="text-[10px] text-[#c5a880] font-sans tracking-widest uppercase font-semibold">Admin Panel v1.2</p>
            </div>`
);

// update the nav items span
content = content.replace(
  /<span>\{tab\.label\}<\/span>/g,
  `<span className="md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300 whitespace-nowrap">{tab.label}</span>`
);

content = content.replace(
  /<span>Homepage Editors<\/span>/g,
  `<span className="md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300 whitespace-nowrap">Homepage Editors</span>`
);

// update the count badge
content = content.replace(
  /<span className=\{\`text-\[10px\] font-mono font-bold px-2 py-0\.5 rounded-full \$\{isActive \? 'bg-\[\#003334\]\/15 text-\[\#003334\]' : 'bg-white\/10 text-slate-300'\}\`\}>\s*\{tab\.count\}\s*<\/span>/g,
  `<span className={\`md:opacity-0 md:hidden group-hover/sidebar:md:inline-block group-hover/sidebar:md:opacity-100 transition-opacity duration-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full \${isActive ? 'bg-[#003334]/15 text-[#003334]' : 'bg-white/10 text-slate-300'}\`}>
                    {tab.count}
                  </span>`
);

// update unread badge
content = content.replace(
  /<span className="bg-rose-500 text-white rounded-full text-\[9px\] px-1\.5 py-0\.5 font-bold font-mono animate-pulse">\s*\{tab\.badge\}\s*<\/span>/g,
  `<span className="md:opacity-0 md:hidden group-hover/sidebar:md:inline-block group-hover/sidebar:md:opacity-100 transition-opacity duration-300 bg-rose-500 text-white rounded-full text-[9px] px-1.5 py-0.5 font-bold font-mono animate-pulse">
                    {tab.badge}
                  </span>`
);

// update accordion icon
content = content.replace(
  /<div className="flex items-center gap-2">\s*<ChevronDown className=\{\`h-4 w-4 text-slate-400 transition-transform duration-300 \$\{isHomepageEditorsOpen \? 'rotate-180' : ''\}\`\} \/>\s*<\/div>/g,
  `<div className="flex items-center gap-2 md:opacity-0 md:hidden group-hover/sidebar:md:flex group-hover/sidebar:md:opacity-100 transition-opacity duration-300">
                <ChevronDown className={\`h-4 w-4 text-slate-400 transition-transform duration-300 \${isHomepageEditorsOpen ? 'rotate-180' : ''}\`} />
              </div>`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
