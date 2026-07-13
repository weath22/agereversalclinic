import fs from 'fs';

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

content = content.replace(
  /<div className="flex items-center gap-2">\s*<span className="text-\[10px\] font-mono font-bold px-2 py-0\.5 rounded-full bg-\[\#c5a880\]\/20 text-\[\#c5a880\]">\s*19\s*<\/span>\s*\{isHomepageEditorsOpen \? \(\s*<ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-white" \/>\s*\) : \(\s*<ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white" \/>\s*\)\}\s*<\/div>/,
  `<div className="flex items-center gap-2 md:opacity-0 md:hidden group-hover/sidebar:md:flex group-hover/sidebar:md:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#c5a880]/20 text-[#c5a880]">
                  19
                </span>
                {isHomepageEditorsOpen ? (
                  <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-white" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
                )}
              </div>`
);

// update the inner nav links in the accordion
content = content.replace(
  /<span className="truncate">\{item\.label\}<\/span>/g,
  `<span className="truncate md:opacity-0 md:hidden group-hover/sidebar:md:block group-hover/sidebar:md:opacity-100 transition-opacity duration-300 whitespace-nowrap">{item.label}</span>`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
