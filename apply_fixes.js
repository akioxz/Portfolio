const fs = require('fs');

function replace(file, regex, replacement) {
  let c = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, c.replace(regex, replacement));
}

replace('components/Navigation.tsx', /\{\s*label:\s*"Experience",\s*href:\s*"\/#experience"\s*\},?\n?/g, '');

let nav = fs.readFileSync('components/Navigation.tsx', 'utf8');
nav = nav.replace(
  /className=\{`flex items-center gap-3 transition-opacity w-fit \$\{isActive \? "opacity-100" : "opacity-40 hover:opacity-70"\}`\}/g,
  'className={`flex items-center gap-3 transition-colors duration-200 w-fit ${isActive ? "text-neutral-900 dark:text-cream opacity-100 font-bold" : "text-neutral-500 dark:text-white/40 hover:text-neutral-900 dark:hover:text-cream opacity-100"}`}'
);
nav = nav.replace(
  /className="font-mono text-\[12\.5px\] font-medium tracking-tight"/g,
  'className="font-mono text-[12.5px] font-medium tracking-tight text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-cream transition-colors duration-200"'
);
nav = nav.replace(
  /className="font-mono text-\[11px\] font-medium tracking-tight text-neutral-500 dark:text-neutral-400 mt-0\.5"/g,
  'className="font-mono text-[11px] font-medium tracking-tight text-neutral-500 dark:text-neutral-400 mt-0.5 group-hover:text-neutral-900 dark:group-hover:text-cream transition-colors duration-200"'
);
fs.writeFileSync('components/Navigation.tsx', nav);

function fixContrast(file) {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/text-slate\/80/g, 'text-neutral-600 dark:text-neutral-400');
  c = c.replace(/text-slate\/60/g, 'text-neutral-500 dark:text-neutral-400');
  c = c.replace(/text-slate\b(?![\/a-z])/g, 'text-neutral-600 dark:text-neutral-400');
  fs.writeFileSync(file, c);
}
fixContrast('components/Experience.tsx');
fixContrast('components/Projects.tsx');
fixContrast('components/projects/StickyProjectCard.tsx');
fixContrast('components/projects/DeckProjectCard.tsx');
fixContrast('components/Certifications.tsx');

function fixPills(file) {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(
    /className="px-2\.5 py-1 rounded-full border border-slate\/10 dark:border-white\/10 font-mono text-\[10px\] tracking-wider text-slate\/70 dark:text-white\/50 uppercase"/g,
    'className="px-2.5 py-1 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 font-mono text-[10px] tracking-wider text-neutral-600 dark:text-neutral-400 uppercase transition-colors"'
  );
  fs.writeFileSync(file, c);
}
fixPills('components/Experience.tsx');
fixPills('components/projects/StickyProjectCard.tsx');
fixPills('components/projects/DeckProjectCard.tsx');

let exp = fs.readFileSync('components/Experience.tsx', 'utf8');
exp = exp.replace(/<section id="experience"[^>]*>/, '<div id="experience-content" className="mt-16">');
exp = exp.replace(/<\/section>/, '</div>');
exp = exp.replace(/<div className="mb-16">[\s\S]*?<\/div>/, ''); 
exp = exp.replace(
  /<p className="font-mono text-\[11px\] text-teal\/90 mb-4 tracking-wider uppercase">\s*\{item\.subtitle\}\s*<\/p>/g,
  '<p className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400 mb-4 tracking-wide font-medium">\n                  {item.subtitle ? item.subtitle.toLowerCase().replace(/\\b\\w/g, c => c.toUpperCase()).replace("Academic Project:", "Academic Project:") : ""}\n                </p>'
);
fs.writeFileSync('components/Experience.tsx', exp);

let page = fs.readFileSync('app/page.tsx', 'utf8');
page = page.replace(/<Experience experience=\{experienceData \|\| \[\]\} \/>\r?\n\s*<Projects projects=\{projectsData \|\| \[\]\} \/>/, '<Projects projects={projectsData || []} experience={experienceData || []} />');
fs.writeFileSync('app/page.tsx', page);

let proj = fs.readFileSync('components/Projects.tsx', 'utf8');
proj = proj.replace(
  /export default function Projects\(\{ projects \}: \{ projects: ProjectData\[\] \}\) \{/,
  'import Experience, { ExperienceData } from "./Experience";\n\nexport default function Projects({ projects, experience = [] }: { projects: ProjectData[], experience?: ExperienceData[] }) {'
);
proj = proj.replace(
  /<\/section>/,
  '  {experience.length > 0 && <Experience experience={experience} />}\n    </section>'
);
fs.writeFileSync('components/Projects.tsx', proj);

console.log("Fixes applied successfully.");
